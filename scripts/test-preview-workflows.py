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
    def run_cleanup(self, pages, branch='pr-21', failed=False):
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
    print(json.dumps({'success': os.environ['FAIL_DELETE'] != '1', 'errors': ['mock failure']}))
else:
    page = int(parse_qs(urlparse(url).query)['page'][0])
    pages = json.load(open('pages.json'))
    print(json.dumps({'success': True, 'result': pages[page-1] if page <= len(pages) else []}))
''')
            fake.chmod(0o755)
            env = dict(os.environ, PATH=f'{folder}:{os.environ["PATH"]}', CF_ACCOUNT_ID='test',
                       CF_API_TOKEN='test', PREVIEW_PROJECT='test', PR_BRANCH=branch,
                       MAX_AGE_DAYS='30', FAIL_DELETE='1' if failed else '0')
            result = subprocess.run(['bash', '-c', TEARDOWN], cwd=folder, env=env,
                                    capture_output=True, text=True)
            deleted = (folder / 'deleted.txt').read_text().splitlines() if (folder / 'deleted.txt').exists() else []
            return result, deleted

    def test_failed_delete_fails_job(self):
        result, _ = self.run_cleanup([[deployment()]], failed=True)
        self.assertNotEqual(result.returncode, 0)

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
    return {ok: process.env.FAIL_DELETE !== '1', status: process.env.MISSING === '1' ? 404 : 200,
      json: async () => ({success: process.env.FAIL_DELETE !== '1', errors: ['mock failure']})};
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


if __name__ == '__main__':
    unittest.main()
