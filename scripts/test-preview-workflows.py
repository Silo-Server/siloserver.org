"""Exercise the actual workflow scripts with fake GitHub/Cloudflare responses."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[1]


def block(file, step, key):
    source = (ROOT / '.github/workflows' / file).read_text()
    source = source.split(f'- name: {step}\n', 1)[1]
    source = source.split(f'{key}: |\n', 1)[1].split('\n      - name:', 1)[0]
    return textwrap.dedent(source)


TEARDOWN = block('preview-teardown.yml', 'Delete previews', 'run')
RECONCILE = block('preview-deploy.yml', 'Recheck PR and remove uploads made after closure', 'script')


def deployment(id='old', branch='pr-21', created='2021-03-09T00:55:03.923456Z'):
    return dict(id=id, created_on=created, deployment_trigger={'metadata': {'branch': branch}})


class TeardownTests(unittest.TestCase):
    def run_cleanup(self, pages, branch='pr-21', failed=False, missing=False):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            (folder / 'pages.json').write_text(json.dumps(pages))
            fake = folder / 'curl'
            fake.write_text('''#!/usr/bin/env python3
import json, os, sys
from urllib.parse import urlparse, parse_qs
url = sys.argv[-1]
if '-X' in sys.argv:
    with open('deleted.txt', 'a') as f: f.write(url.split('/')[-1].split('?')[0] + '\\n')
    print(json.dumps({'success': os.environ['FAIL_DELETE'] != '1', 'errors': [{'code': 8000009 if os.environ['MISSING'] == '1' else 10000}]}))
else:
    page = int(parse_qs(urlparse(url).query)['page'][0])
    pages = json.load(open('pages.json'))
    print(json.dumps({'success': True, 'result': pages[page-1] if page <= len(pages) else []}))
''')
            fake.chmod(0o755)
            env = dict(os.environ, PATH=f'{folder}:{os.environ["PATH"]}', CF_ACCOUNT_ID='test',
                       CF_API_TOKEN='test', PREVIEW_PROJECT='test', PR_BRANCH=branch,
                       MAX_AGE_DAYS='30', FAIL_DELETE='1' if failed else '0', MISSING='1' if missing else '0')
            result = subprocess.run(['bash', '-c', TEARDOWN], cwd=folder, env=env,
                                    capture_output=True, text=True)
            deleted = (folder / 'deleted.txt').read_text().splitlines() if (folder / 'deleted.txt').exists() else []
            return result, deleted

    def test_failed_delete_fails_job(self):
        result, _ = self.run_cleanup([[deployment()]], failed=True)
        self.assertNotEqual(result.returncode, 0)

    def test_repeated_delete_is_success(self):
        result, _ = self.run_cleanup([[deployment()]], failed=True, missing=True)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_close_filters_branch_across_pages(self):
        result, deleted = self.run_cleanup([[deployment('other', 'pr-22')], [deployment()]])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(deleted, ['old'])

    def test_sweep_accepts_fractional_seconds_and_preserves_recent(self):
        result, deleted = self.run_cleanup([[deployment(), deployment('recent', created='2999-01-01T00:00:00Z'), deployment('prod', 'main')]], branch='')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(deleted, ['old'])

    def test_sweep_accepts_whole_seconds(self):
        result, deleted = self.run_cleanup([[deployment(created='2021-03-09T00:55:03Z')]], branch='')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(deleted, ['old'])

    def test_pagination_does_not_stop_at_100(self):
        result, deleted = self.run_cleanup([[deployment(str(i), 'pr-22')] for i in range(100)] + [[deployment()]])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(deleted, ['old'])


class ReconcileTests(unittest.TestCase):
    def run_reconcile(self, state='closed', sha='current', fail=False, missing=False):
        harness = r'''
const script = process.env.SCRIPT;
const outputs = {}, deleted = [];
const pr = {number: 21, state: process.env.PR_STATE, head: {sha: process.env.HEAD_SHA}};
const github = {rest: {pulls: {get: async () => ({data: pr})}}};
const context = {repo: {owner: 'test', repo: 'test'}};
const core = {setOutput: (k,v) => outputs[k] = v, info: () => {}};
const fetch = async (url, options) => {
  if (options.method === 'DELETE') {
    deleted.push(url);
    return {ok: process.env.FAIL_DELETE !== '1', status: process.env.FAIL_DELETE === '1' ? 400 : 200,
      json: async () => ({success: process.env.FAIL_DELETE !== '1', errors: [{code: process.env.MISSING === '1' ? 8000009 : 10000}]})};
  }
  const page = new URL(url).searchParams.get('page');
  const result = page === '1' ? [
    {id: 'new-upload', deployment_trigger: {metadata: {branch: 'pr-21'}}},
    {id: 'other', deployment_trigger: {metadata: {branch: 'pr-22'}}}
  ] : [];
  return {ok: true, json: async () => ({success: true, result})};
};
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
try {
  await new AsyncFunction('github','context','core','fetch',script)(github,context,core,fetch);
  console.log(JSON.stringify({outputs,deleted}));
} catch (error) { console.error(error.message); process.exitCode = 1; }
'''
        env = dict(os.environ, SCRIPT=RECONCILE, PR_STATE=state, HEAD_SHA=sha,
                   PR_NUMBER='21', PR_SHA='current', CF_ACCOUNT_ID='test', CF_API_TOKEN='test',
                   PREVIEW_PROJECT='test', FAIL_DELETE='1' if fail else '0', MISSING='1' if missing else '0')
        return subprocess.run(['node', '--input-type=module', '-e', harness], env=env, capture_output=True, text=True)

    def test_close_during_upload_deletes_and_suppresses_publication(self):
        result = self.run_reconcile()
        self.assertEqual(result.returncode, 0, result.stderr)
        data = json.loads(result.stdout)
        self.assertEqual(data['outputs']['publish'], 'false')
        self.assertEqual(len(data['deleted']), 1)
        self.assertIn('/new-upload?', data['deleted'][0])

    def test_open_current_head_publishes(self):
        result = self.run_reconcile(state='open')
        self.assertEqual(json.loads(result.stdout), {'outputs': {'publish': 'true'}, 'deleted': []})

    def test_superseded_head_does_not_publish(self):
        result = self.run_reconcile(state='open', sha='newer')
        self.assertEqual(json.loads(result.stdout)['outputs']['publish'], 'false')

    def test_failed_cleanup_fails_job(self):
        self.assertNotEqual(self.run_reconcile(fail=True).returncode, 0)

    def test_concurrent_teardown_already_deleted_upload(self):
        self.assertEqual(self.run_reconcile(fail=True, missing=True).returncode, 0)


class DeploymentStatusTests(unittest.TestCase):
    def run_status(self, stages, records=None, identity='current', api_success=True):
        script = block('preview-deploy.yml', 'Verify terminal deployment success', 'script')
        if records is None:
            records = [{'type': 'pages-deploy', 'pages_project': 'test', 'deployment_id': 'upload-id'}]
        harness = r'''
const stages = JSON.parse(process.env.STAGES);
let polls = 0;
const fs = {readFileSync: () => process.env.RECORDS};
const fetch = async () => {
  const stage = stages[Math.min(polls++, stages.length - 1)];
  return {ok: process.env.API_SUCCESS === '1', json: async () => ({
    success: process.env.API_SUCCESS === '1', errors: [{code: 10000}],
    result: {id: 'upload-id', latest_stage: stage,
      deployment_trigger: {metadata: {branch: 'pr-21', commit_hash: process.env.IDENTITY}}},
  })};
};
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
try {
  await new AsyncFunction('require', 'fetch', 'setTimeout', process.env.SCRIPT)(
    () => fs, fetch, (resolve) => resolve());
  console.log(JSON.stringify({polls}));
} catch (error) {
  console.log(JSON.stringify({polls, error: error.message}));
  process.exitCode = 1;
}
'''
        env = dict(os.environ, SCRIPT=script, STAGES=json.dumps(stages),
                   RECORDS='\n'.join(json.dumps(record) for record in records),
                   IDENTITY=identity, API_SUCCESS='1' if api_success else '0',
                   PREVIEW_PROJECT='test', PR_NUMBER='21', PR_SHA='current',
                   CF_ACCOUNT_ID='test', CF_API_TOKEN='test', WRANGLER_OUTPUT_FILE_PATH='unused')
        return subprocess.run(['node', '--input-type=module', '-e', harness], env=env, capture_output=True, text=True)

    def test_active_then_failure_never_publishes_success(self):
        result = self.run_status([{'name': 'deploy', 'status': 'active'}, {'name': 'deploy', 'status': 'failure'}])
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(json.loads(result.stdout)['polls'], 2)

    def test_active_then_success(self):
        result = self.run_status([{'name': 'deploy', 'status': 'active'}, {'name': 'deploy', 'status': 'success'}])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)['polls'], 2)

    def test_build_success_is_not_deployment_success(self):
        result = self.run_status([{'name': 'build', 'status': 'success'}, {'name': 'deploy', 'status': 'failure'}])
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(json.loads(result.stdout)['polls'], 2)

    def test_never_terminal_times_out(self):
        result = self.run_status([{'name': 'deploy', 'status': 'active'}])
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(json.loads(result.stdout)['polls'], 30)

    def test_missing_or_ambiguous_upload_id_fails(self):
        for records in ([], [{'type': 'pages-deploy', 'pages_project': 'test'}]):
            result = self.run_status([], records=records)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(json.loads(result.stdout)['polls'], 0)

    def test_wrong_commit_fails(self):
        self.assertNotEqual(self.run_status([{'name': 'deploy', 'status': 'success'}], identity='wrong').returncode, 0)

    def test_api_failure_fails(self):
        self.assertNotEqual(self.run_status([{'name': 'deploy', 'status': 'success'}], api_success=False).returncode, 0)


class LifecycleOrderingTests(unittest.TestCase):
    def test_status_transitions(self):
        result = subprocess.run(['node', '--test', 'scripts/test-preview-status.mjs'],
                                cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_status_writes_are_serialized_and_do_not_run_pr_code(self):
        result = subprocess.run(['bun', '-e', '''
const files = ['preview-progress', 'preview-report', 'preview-deploy', 'pr-build'];
console.log(JSON.stringify(await Promise.all(files.map(async name =>
  Bun.YAML.parse(await Bun.file(`.github/workflows/${name}.yml`).text())))));
'''], cwd=ROOT, capture_output=True, text=True, check=True)
        progress, reporter, deploy, build = json.loads(result.stdout)
        self.assertEqual(progress['on']['workflow_run']['types'], ['requested', 'in_progress', 'completed'])
        job = reporter['jobs']['report']
        self.assertEqual(job['concurrency']['group'], 'preview-status-${{ inputs.sha }}')
        self.assertEqual(job['concurrency']['queue'], 'max')
        self.assertFalse(job['concurrency']['cancel-in-progress'])
        self.assertEqual(job['steps'][0]['with']['ref'], '${{ github.workflow_sha }}')
        self.assertFalse(job['steps'][0]['with']['persist-credentials'])
        self.assertEqual(build['permissions'], {'contents': 'read'})
        self.assertNotIn('environment', job)
        self.assertEqual(deploy['jobs']['deploy']['needs'], 'report-start')
        self.assertIn('always()', deploy['jobs']['report-result']['if'])
        self.assertIn("needs.deploy.outputs.published == 'true'", deploy['jobs']['report-result']['if'])

    def test_queue_covers_publication_and_teardown_without_replacing_close(self):
        # Check actual workflow configuration, not a mocked scheduler. GitHub's
        # workflow-level lock must enclose every step in both workflows.
        result = subprocess.run(['bun', '-e', '''
const files = ['preview-deploy', 'preview-teardown'];
console.log(JSON.stringify(await Promise.all(files.map(async name =>
  Bun.YAML.parse(await Bun.file(`.github/workflows/${name}.yml`).text())))));
'''], cwd=ROOT, capture_output=True, text=True, check=True)
        deploy, teardown = json.loads(result.stdout)
        self.assertEqual(deploy['concurrency'], teardown['concurrency'])
        self.assertEqual(deploy['concurrency']['queue'], 'max')
        self.assertFalse(deploy['concurrency']['cancel-in-progress'])
        # Neither side may opt publication or cleanup out of the shared lock.
        self.assertIsInstance(deploy['concurrency']['group'], str)
        self.assertNotIn('${{', deploy['concurrency']['group'])
        steps = deploy['jobs']['deploy']['steps']
        names = [step['name'] for step in steps]
        self.assertLess(names.index('Verify terminal deployment success'), names.index('Comment on the pull request'))
        for step in steps:
            if step['name'] in ('Comment on the pull request', 'Report status on the commit'):
                self.assertNotIn('always()', step['if'])
        for step in teardown['jobs']['teardown']['steps']:
            if step['name'] in ('Delete previews', 'Update the pull request comment'):
                self.assertIn("steps.state.outputs.closed == 'true'", step['if'])

    def test_delayed_close_event_skips_reopened_pr(self):
        script = block('preview-teardown.yml', 'Check that the pull request is still closed', 'script')
        harness = r'''
const outputs = {};
const github = {rest:{pulls:{get: async () => ({data:{state: 'open'}})}}};
const context = {repo:{owner:'test',repo:'test'},payload:{pull_request:{number:21}}};
const core = {setOutput:(key,value) => outputs[key] = value};
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
await new AsyncFunction('github','context','core',process.env.SCRIPT)(github,context,core);
console.log(JSON.stringify(outputs));
'''
        result = subprocess.run(['node', '--input-type=module', '-e', harness],
                                env=dict(os.environ, SCRIPT=script), capture_output=True, text=True, check=True)
        self.assertEqual(json.loads(result.stdout), {'closed': 'false'})


if __name__ == '__main__':
    unittest.main()
