"""Exercise the trusted workflow's route using representative GitHub events."""
import copy
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


class RoutingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        result = subprocess.run(['bun', '-e', '''
const workflow = Bun.YAML.parse(await Bun.file('.github/workflows/website-build.yml').text());
console.log(JSON.stringify(workflow));
'''], cwd=ROOT, capture_output=True, text=True, check=True)
        cls.workflow = json.loads(result.stdout)
        cls.script = cls.workflow['jobs']['runner']['steps'][0]['run']

    def route(self, event_name='pull_request', event=None, enabled='true',
              ref='refs/pull/1/merge', repository='Silo-Server/siloserver.org'):
        if event is None:
            event = {'pull_request': {
                'author_association': 'MEMBER', 'user': {'type': 'User'},
                'head': {'repo': {'owner': {'login': 'Silo-Server'}}},
                'base': {'ref': 'main'},
            }}
        with tempfile.TemporaryDirectory() as directory:
            payload = Path(directory) / 'event.json'
            output = Path(directory) / 'output'
            payload.write_text(json.dumps(event))
            env = dict(os.environ, GITHUB_EVENT_PATH=str(payload), GITHUB_OUTPUT=str(output),
                       GITHUB_EVENT_NAME=event_name, GITHUB_REF=ref,
                       GITHUB_REPOSITORY=repository, LINUX_CI_ENABLED=enabled)
            subprocess.run([sys.executable, '-c', self.script], env=env, check=True)
            return output.read_text().strip() == 'use_linux=true'

    def test_activation_is_explicit(self):
        for setting in ['', 'false', 'TRUE']:
            with self.subTest(setting=setting):
                self.assertFalse(self.route(enabled=setting))

    def test_team_branches_and_protected_main_events(self):
        self.assertTrue(self.route())
        for event in ['push', 'schedule', 'repository_dispatch', 'workflow_dispatch']:
            with self.subTest(event=event):
                self.assertTrue(self.route(event, {}, ref='refs/heads/main'))
                self.assertFalse(self.route(event, {}, ref='refs/heads/topic'))

    def test_forks_collaborators_bots_and_other_base_stay_hosted(self):
        base = {'pull_request': {
            'author_association': 'MEMBER', 'user': {'type': 'User'},
            'head': {'repo': {'owner': {'login': 'Silo-Server'}}}, 'base': {'ref': 'main'},
        }}
        for section, key, value in [
            ('user', 'type', 'Bot'), ('base', 'ref', 'develop'),
            ('head', 'repo', None), ('head', 'repo', {'owner': {'login': 'Quick104'}}),
        ]:
            event = copy.deepcopy(base)
            event['pull_request'][section][key] = value
            with self.subTest(section=section, value=value):
                self.assertFalse(self.route(event=event))
        for association in ['NONE', 'CONTRIBUTOR', 'COLLABORATOR']:
            event = copy.deepcopy(base)
            event['pull_request']['author_association'] = association
            self.assertFalse(self.route(event=event))
        self.assertFalse(self.route(repository='someone/siloserver.org'))
        self.assertFalse(self.route('pull_request_target'))

    def test_build_has_no_write_permissions_or_deployment_environment(self):
        self.assertEqual(self.workflow['permissions'], {'contents': 'read'})
        self.assertNotIn('inputs', self.workflow['on']['workflow_call'] or {})
        for job in self.workflow['jobs'].values():
            self.assertNotIn('environment', job)
        site = self.workflow['jobs']['site']
        preview = next(s for s in site['steps'] if s['name'] == 'Build preview')
        self.assertNotIn('GITHUB_TOKEN', preview['env'])
        checkout = next(s for s in site['steps'] if s['name'] == 'Checkout')
        self.assertFalse(checkout['with']['persist-credentials'])
        self.assertNotIn('ref', checkout['with'])

    def test_required_check_and_artifact_handshake(self):
        result = subprocess.run(['bun', '-e', '''
console.log(JSON.stringify(await Promise.all(['pr-build', 'deploy'].map(async name =>
  Bun.YAML.parse(await Bun.file(`.github/workflows/${name}.yml`).text())))));
'''], cwd=ROOT, capture_output=True, text=True, check=True)
        pull, production = json.loads(result.stdout)
        if all('checks' not in workflow['jobs'] for workflow in [pull, production]):
            self.skipTest('Caller cutover follows the reusable workflow bootstrap')
        for workflow in [pull, production]:
            self.assertEqual(workflow['jobs']['checks']['uses'],
                             'Silo-Server/siloserver.org/.github/workflows/website-build.yml@main')
            check = workflow['jobs']['build']
            self.assertEqual(check['needs'], 'checks')
            self.assertEqual(check['if'], 'always()')
            self.assertEqual(check['steps'][0]['env']['RESULT'], '${{ needs.checks.result }}')
            command = check['steps'][0]['run']
            for conclusion in ['success', 'failure', 'cancelled', 'skipped']:
                status = subprocess.run(['bash', '-c', command],
                                        env=dict(os.environ, RESULT=conclusion)).returncode
                self.assertEqual(status == 0, conclusion == 'success')
        self.assertEqual(production['jobs']['deploy']['runs-on'], 'ubuntu-latest')
        self.assertEqual(production['jobs']['deploy']['needs'], 'build')
        self.assertEqual(production['permissions'], {'contents': 'read'})
        uploads = [s for s in self.workflow['jobs']['site']['steps'] if 'uses' in s]
        preview = next(s for s in uploads if s['uses'].startswith('actions/upload-artifact@'))
        self.assertEqual(preview['with']['name'], 'preview-site')
        self.assertEqual(preview['if'], "github.event_name == 'pull_request'")


if __name__ == '__main__':
    unittest.main()
