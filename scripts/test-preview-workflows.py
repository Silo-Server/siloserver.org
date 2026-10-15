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
    def run_cleanup(self, pages, branch='pr-21', failed=False, missing=False, keep=''):
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
                       MAX_AGE_DAYS='30', KEEP_ID=keep, FAIL_DELETE='1' if failed else '0', MISSING='1' if missing else '0')
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

    def test_close_keeps_the_redirect_deployment(self):
        result, deleted = self.run_cleanup([[deployment('redirect'), deployment()]], keep='redirect')
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
    {id: 'redirect', deployment_trigger: {metadata: {branch: 'pr-21', commit_message: 'Preview removed'}}},
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
        # Only the new upload goes; the redirect from an earlier close stays.
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


class ResolvePullRequestTests(unittest.TestCase):
    def resolve(self, by_commit=True, pr=None):
        script = block('preview-deploy.yml', 'Resolve the pull request from trusted event data', 'script')
        pr = pr or {'number': 21, 'state': 'open', 'user': {'login': 'contributor'},
                    'head': {'sha': 'current', 'ref': 'feature', 'repo': {'full_name': 'contributor/fork', 'owner': {'login': 'contributor'}}}}
        harness = r'''
const outputs = {}, lookups = [];
const pr = JSON.parse(process.env.PR);
const github = {
  paginate: async (method, params) => method(params),
  rest: {
    repos: {listPullRequestsAssociatedWithCommit: async () => process.env.BY_COMMIT === '1' ? [pr] : []},
    pulls: {list: async ({head}) => { lookups.push(head); return head === 'contributor:feature' ? [pr] : []; }},
  },
};
const context = {repo: {owner: 'test', repo: 'site'}, payload: {workflow_run: {
  head_sha: 'current', head_branch: 'feature', head_repository: {full_name: 'contributor/fork'}}}};
const core = {setOutput: (key, value) => outputs[key] = value, info: () => {}};
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
await new AsyncFunction('require', 'github', 'context', 'core', process.env.SCRIPT)(require, github, context, core);
console.log(JSON.stringify({outputs, lookups}));
'''
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            tools = folder / 'trusted-preview/.github/preview-tools'
            tools.mkdir(parents=True)
            (tools / 'find-pull-request.cjs').symlink_to(ROOT / '.github/preview-tools/find-pull-request.cjs')
            env = dict(os.environ, SCRIPT=script, GITHUB_WORKSPACE=str(folder), PR=json.dumps(pr),
                       BY_COMMIT='1' if by_commit else '0')
            result = subprocess.run(['node', '--input-type=module', '-e',
                                     "import { createRequire } from 'node:module';\nconst require = createRequire(process.cwd() + '/');\n" + harness],
                                    cwd=folder, env=env, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            return json.loads(result.stdout)

    def test_same_repository_pr_is_found_by_commit(self):
        data = self.resolve()
        self.assertEqual(data['outputs'], {'skip': 'false', 'pr': '21', 'sha': 'current', 'short': 'current'})
        self.assertEqual(data['lookups'], [])

    def test_fork_pr_is_found_by_owner_and_branch(self):
        data = self.resolve(by_commit=False)
        self.assertEqual(data['outputs']['skip'], 'false')
        self.assertEqual(data['outputs']['pr'], '21')
        self.assertEqual(data['lookups'], ['contributor:feature'])

    def test_branch_match_still_needs_the_built_commit(self):
        pr = {'number': 21, 'state': 'open', 'user': {'login': 'contributor'},
              'head': {'sha': 'newer', 'ref': 'feature', 'repo': {'full_name': 'contributor/fork'}}}
        self.assertEqual(self.resolve(by_commit=False, pr=pr)['outputs'], {'skip': 'true'})

    def test_tooling_is_checked_out_before_the_lookup(self):
        result = subprocess.run(['bun', '-e', '''
console.log(JSON.stringify(Bun.YAML.parse(await Bun.file('.github/workflows/preview-deploy.yml').text())));
'''], cwd=ROOT, capture_output=True, text=True, check=True)
        steps = json.loads(result.stdout)['jobs']['deploy']['steps']
        names = [step['name'] for step in steps]
        checkout = steps[names.index('Checkout trusted deployment tooling')]
        self.assertLess(names.index('Checkout trusted deployment tooling'), names.index('Resolve the pull request from trusted event data'))
        self.assertEqual(checkout['with']['ref'], '${{ github.workflow_sha }}')
        self.assertFalse(checkout['with']['persist-credentials'])
        # The artifact never lands where the trusted tooling is loaded from.
        self.assertEqual(steps[names.index('Download build')]['with']['path'], 'dist')


class ChangesSummaryTests(unittest.TestCase):
    def summarize(self, write):
        script = block('preview-deploy.yml', 'Summarize documentation changes', 'script')
        harness = r'''
const outputs = {};
const core = {setOutput: (key, value) => outputs[key] = value};
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
await new AsyncFunction('require', 'core', process.env.SCRIPT)(require, core);
console.log(JSON.stringify(outputs));
'''
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            tools = folder / 'trusted-preview/.github/preview-tools'
            tools.mkdir(parents=True)
            (tools / 'docs-changes-summary.cjs').symlink_to(ROOT / '.github/preview-tools/docs-changes-summary.cjs')
            (folder / 'dist/_changes').mkdir(parents=True)
            write(folder / 'dist/_changes/manifest.json', folder)
            env = dict(os.environ, SCRIPT=script, GITHUB_WORKSPACE=str(folder), PR_NUMBER='21', PREVIEW_PROJECT='test')
            result = subprocess.run(['node', '--input-type=module', '-e',
                                     "import { createRequire } from 'node:module';\nconst require = createRequire(process.cwd() + '/');\n" + harness],
                                    cwd=folder, env=env, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            return json.loads(result.stdout)['summary']

    def test_links_point_at_this_preview(self):
        manifest = {'pages': [{'path': '/docs/a', 'title': 'A', 'status': 'changed', 'hunks': [{'sig': 'x'}]}]}
        summary = self.summarize(lambda path, _: path.write_text(json.dumps(manifest)))
        self.assertIn('[A](https://pr-21.test.pages.dev/docs/a?change=1) | 1 |', summary)

    def test_missing_oversized_or_linked_manifests_are_ignored(self):
        self.assertEqual(self.summarize(lambda path, _: None), '')
        self.assertEqual(self.summarize(lambda path, _: path.write_text(' ' * (600 * 1024))), '')
        def link(path, folder):
            secret = folder / 'secret.json'
            secret.write_text(json.dumps({'pages': [{'path': '/docs/a', 'title': 'A', 'status': 'changed', 'hunks': []}]}))
            path.symlink_to(secret)
        self.assertEqual(self.summarize(link), '')

    def test_summary_is_optional_and_trusted(self):
        result = subprocess.run(['bun', '-e', '''
console.log(JSON.stringify(Bun.YAML.parse(await Bun.file('.github/workflows/preview-deploy.yml').text())));
'''], cwd=ROOT, capture_output=True, text=True, check=True)
        steps = json.loads(result.stdout)['jobs']['deploy']['steps']
        names = [step['name'] for step in steps]
        summary = steps[names.index('Summarize documentation changes')]
        # A broken summary must never hold back the preview comment.
        self.assertTrue(summary['continue-on-error'])
        self.assertEqual(summary['if'], "steps.reconcile.outputs.publish == 'true'")
        self.assertIn('/trusted-preview/.github/preview-tools/', summary['with']['script'])
        self.assertLess(names.index('Summarize documentation changes'), names.index('Comment on the pull request'))
        self.assertIn('${{ steps.changes.outputs.summary }}', steps[names.index('Comment on the pull request')]['with']['message'])


class RedirectTests(unittest.TestCase):
    def publish(self, records=None):
        script = block('preview-teardown.yml', 'Publish a redirect on the preview address', 'run')
        if records is None:
            records = [{'type': 'version'}, {'type': 'pages-deploy', 'pages_project': 'test', 'deployment_id': 'redirect-id'}]
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            tools = folder / 'trusted-preview/.github/preview-tools/node_modules/.bin'
            tools.mkdir(parents=True)
            (tools / 'wrangler').write_text('#!/bin/sh\necho "$@" > "$RUNNER_TEMP/args"\nls "$3" > "$RUNNER_TEMP/files"\nprintf "%s" "$RECORDS" > "$WRANGLER_OUTPUT_FILE_PATH"\n')
            (tools / 'wrangler').chmod(0o755)
            env = dict(os.environ, RUNNER_TEMP=str(folder),
                       GITHUB_OUTPUT=str(folder / 'output'), PREVIEW_PROJECT='test', PR_NUMBER='21',
                       WRANGLER_OUTPUT_FILE_PATH=str(folder / 'out.ndjson'),
                       RECORDS='\n'.join(json.dumps(record) for record in records))
            result = subprocess.run(['bash', '-c', script], cwd=folder, env=env, capture_output=True, text=True)
            read = lambda name: (folder / name).read_text() if (folder / name).exists() else ''
            return result, read('redirect-site/_redirects'), read('args') + read('files'), read('output')

    def test_every_page_keeps_its_path(self):
        result, redirects, args, output = self.publish()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(redirects, '/*  https://siloserver.org/:splat  302\n')
        self.assertIn('--branch=pr-21', args)
        for name in ('_headers', '_redirects', '404.html'):
            self.assertIn(name, args)
        self.assertEqual(output, 'id=redirect-id\n')

    def test_missing_deployment_id_fails(self):
        result, _, _, output = self.publish(records=[{'type': 'version'}])
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(output, '')

    def test_more_than_one_deployment_id_fails(self):
        record = {'type': 'pages-deploy', 'pages_project': 'test', 'deployment_id': 'a'}
        result, _, _, output = self.publish(records=[record, dict(record, deployment_id='b')])
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(output, '')

    def wait(self, answer):
        script = block('preview-teardown.yml', 'Wait for the preview address to redirect', 'run')
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            # answer: 'exact' echoes the probed path, anything else is printed as is.
            (folder / 'curl').write_text("""#!/usr/bin/env python3
import os, sys
from urllib.parse import urlparse
answer = os.environ['ANSWER']
print('302 https://siloserver.org' + urlparse(sys.argv[-1]).path if answer == 'exact' else answer, end='')
""")
            (folder / 'sleep').write_text('#!/bin/sh\nexit 0\n')
            for tool in ('curl', 'sleep'):
                (folder / tool).chmod(0o755)
            env = dict(os.environ, PATH=f'{folder}:{os.environ["PATH"]}', GITHUB_OUTPUT=str(folder / 'output'),
                       PREVIEW_PROJECT='test', PR_NUMBER='21', ANSWER=answer)
            result = subprocess.run(['bash', '-e', '-c', script], cwd=folder, env=env, capture_output=True, text=True)
            output = (folder / 'output').read_text() if (folder / 'output').exists() else ''
            return result, output

    def test_wait_accepts_only_the_exact_redirect(self):
        result, output = self.wait('exact')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(output, 'ok=true\n')

    def test_wait_ignores_other_redirects_and_old_pages(self):
        # A pull request's own _redirects could send / to production; that must not count.
        for answer in ('302 https://siloserver.org/', '200 ', '000 '):
            result, output = self.wait(answer)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(output, '')
            self.assertIn('::warning::', result.stdout)

    def test_redirect_is_optional_and_precedes_deletion(self):
        result = subprocess.run(['bun', '-e', '''
console.log(JSON.stringify(Bun.YAML.parse(await Bun.file('.github/workflows/preview-teardown.yml').text())));
'''], cwd=ROOT, capture_output=True, text=True, check=True)
        steps = json.loads(result.stdout)['jobs']['teardown']['steps']
        names = [step['name'] for step in steps]
        delete = names.index('Delete previews')
        for name in ('Checkout trusted deployment tooling', 'Install locked deployment tooling',
                     'Publish a redirect on the preview address', 'Wait for the preview address to redirect'):
            self.assertLess(names.index(name), delete)
            # A failed redirect must never stop the old preview from being deleted.
            self.assertTrue(steps[names.index(name)]['continue-on-error'])
        checkout = steps[names.index('Checkout trusted deployment tooling')]['with']
        self.assertEqual(checkout['ref'], '${{ github.workflow_sha }}')
        self.assertEqual(checkout['sparse-checkout'], '.github/preview-tools')
        self.assertFalse(checkout['persist-credentials'])
        self.assertEqual(steps[delete]['env']['KEEP_ID'], '${{ steps.redirect.outputs.id }}')
        # Secrets stay out of the step that runs npm install scripts.
        install = steps[names.index('Install locked deployment tooling')]
        self.assertNotIn('env', install)
        self.assertNotIn('secrets', install['run'])
        self.assertEqual(steps[names.index('Wait for the preview address to redirect')]['if'],
                         "steps.redirect.outputs.id != ''")
        self.assertIn("steps.wait.outputs.ok == 'true'", steps[-1]['with']['message'])
        for name in ('Checkout trusted deployment tooling', 'Install locked deployment tooling',
                     'Publish a redirect on the preview address'):
            self.assertEqual(steps[names.index(name)]['if'], "steps.state.outputs.published == 'true'")
        # Teardown never creates the sticky comment, so it stays proof of publication.
        self.assertIn("steps.state.outputs.published == 'true'", steps[-1]['if'])


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

    def check_state(self, state, comments=(), number='21'):
        script = block('preview-teardown.yml', 'Check that the pull request is still closed', 'script')
        harness = r'''
const outputs = {};
const github = {
  rest: {pulls: {get: async () => ({data: {state: process.env.PR_STATE}})}, issues: {listComments: 'list'}},
  paginate: async () => JSON.parse(process.env.COMMENTS),
};
const context = {repo:{owner:'test',repo:'test'}};
const core = {setOutput:(key,value) => outputs[key] = value};
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
try {
  await new AsyncFunction('github','context','core',process.env.SCRIPT)(github,context,core);
  console.log(JSON.stringify(outputs));
} catch (error) { console.error(error.message); process.exitCode = 1; }
'''
        return subprocess.run(['node', '--input-type=module', '-e', harness],
                              env=dict(os.environ, SCRIPT=script, PR_STATE=state, PR_NUMBER=number,
                                       COMMENTS=json.dumps(list(comments))),
                              capture_output=True, text=True)

    def test_delayed_close_event_skips_reopened_pr(self):
        result = self.check_state('open')
        self.assertEqual(json.loads(result.stdout), {'closed': 'false'})

    def test_redirect_only_for_published_previews(self):
        sticky = {'user': {'login': 'github-actions[bot]'}, 'body': 'Preview\n<!-- Sticky Pull Request Commentpreview -->'}
        forged = dict(sticky, user={'login': 'someone'})
        cases = [([sticky], 'true'), ([], 'false'), ([forged], 'false')]
        for comments, expected in cases:
            result = self.check_state('closed', comments)
            self.assertEqual(json.loads(result.stdout), {'closed': 'true', 'published': expected})

    def test_manual_run_rejects_a_bad_number(self):
        for number in ('0', '21; rm -rf /', 'abc'):
            self.assertNotEqual(self.check_state('closed', number=number).returncode, 0)


if __name__ == '__main__':
    unittest.main()
