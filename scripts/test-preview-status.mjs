import test from 'node:test';
import assert from 'node:assert/strict';
import report from '../.github/preview-tools/report-status.cjs';

const marker = (rank, {run = 10, attempt = 1, deploy = 0, deployAttempt = 0} = {}) => ({
  context: 'preview', state: rank === 4 ? 'success' : 'pending',
  target_url: `https://example.test#preview-run=${run}&attempt=${attempt}&deploy=${deploy}&deploy-attempt=${deployAttempt}&stage=${rank}`,
});

async function invoke(options = {}) {
  const run = { id: 10, workflow_id: 1, event: 'pull_request', head_sha: 'abc',
    head_branch: 'feature', head_repository: { full_name: 'contributor/fork' },
    status: 'queued', conclusion: null, run_attempt: 1,
    html_url: 'https://github.com/test/site/actions/runs/10', ...options.run };
  const pr = { number: 22, state: 'open', head: { sha: 'abc', ref: 'feature',
    repo: {full_name: 'contributor/fork'} }, ...options.pr };
  const written = [];
  const github = {
    paginate: async (fn) => fn === github.rest.actions.listWorkflowRuns ? (options.runs ?? [run]) : [pr],
    rest: {
      actions: {getWorkflowRun: async () => ({data: run}), listWorkflowRuns: () => {}},
      pulls: {get: async () => ({data: options.freshPr ?? pr})},
      repos: {
        listPullRequestsAssociatedWithCommit: () => {},
        listCommitStatuses: async () => ({data: options.previous ? [options.previous] : []}),
        createCommitStatus: async status => written.push(status),
      },
    },
  };
  process.env.BUILD_ATTEMPT = String(options.attempt ?? 1);
  process.env.PREVIEW_PROJECT = 'siloserver-org';
  process.env.DEPLOY_RUN_URL = 'https://github.com/test/site/actions/runs/20';
  process.env.DEPLOY_RUN_ID = String(options.deploy ?? 20);
  process.env.DEPLOY_ATTEMPT = String(options.deployAttempt ?? 1);
  await report({github, context: {repo: {owner: 'test', repo: 'site'}}, core: {info() {}},
    runId: 10, sha: 'abc', phase: options.phase ?? 'build'});
  return written;
}
const built = {status: 'completed', conclusion: 'success'};

test('queued and running fork builds post optional pending status', async () => {
  for (const status of ['queued', 'in_progress']) {
    const [result] = await invoke({run: {status}});
    assert.equal(result.state, 'pending'); assert.equal(result.context, 'preview');
    assert.ok(result.target_url.startsWith('https://github.com/test/site/actions/runs/10'));
  }
});
test('successful build waits for deployment and deployment reports progress', async () => {
  assert.equal((await invoke({run: built}))[0].description, 'Preview waiting for deployment');
  assert.equal((await invoke({run: built, phase: 'deploying'}))[0].description, 'Preview deploying');
});
test('failed, timed-out and cancelled builds report a terminal failure', async () => {
  for (const conclusion of ['failure', 'timed_out', 'cancelled', 'action_required']) {
    assert.equal((await invoke({run: {status: 'completed', conclusion}}))[0].state, 'failure');
  }
});
test('deployment success links to the preview and failure links to logs', async () => {
  const [success] = await invoke({run: built, phase: 'success'});
  assert.equal(success.state, 'success'); assert.ok(success.target_url.startsWith('https://pr-22.siloserver-org.pages.dev'));
  for (const phase of ['failure', 'cancelled', 'skipped']) {
    const [failure] = await invoke({run: built, phase});
    assert.equal(failure.state, 'failure'); assert.ok(failure.target_url.includes('/actions/runs/20'));
  }
});
test('closed, changed-head and mismatched fork PRs are ignored', async () => {
  assert.deepEqual(await invoke({pr: {state: 'closed'}}), []);
  assert.deepEqual(await invoke({freshPr: {state: 'closed'}}), []);
  assert.deepEqual(await invoke({pr: {head: {sha: 'newer'}}}), []);
  assert.deepEqual(await invoke({pr: {head: {sha: 'abc', ref: 'feature', repo: {full_name: 'wrong/repo'}}}}), []);
});
test('newer builds and rerun attempts suppress older events', async () => {
  assert.deepEqual(await invoke({runs: [{id: 11, head_branch: 'feature', head_repository: {full_name: 'contributor/fork'}}]}), []);
  assert.deepEqual(await invoke({run: {run_attempt: 2}}), []);
  assert.equal((await invoke({run: {run_attempt: 2}, attempt: 2, previous: marker(4)}))[0].state, 'pending');
});
test('late build notifications cannot downgrade deployment status', async () => {
  for (const rank of [3, 4]) assert.deepEqual(await invoke({run: built, previous: marker(rank, {deploy: 20, deployAttempt: 1})}), []);
});
test('deployment reruns recover failures but old attempts cannot overwrite them', async () => {
  const previous = {...marker(4, {deploy: 20, deployAttempt: 1}), state: 'failure'};
  assert.equal((await invoke({run: built, phase: 'deploying', deployAttempt: 2, previous}))[0].state, 'pending');
  assert.equal((await invoke({run: built, phase: 'success', deployAttempt: 2, previous}))[0].state, 'success');
  assert.deepEqual(await invoke({run: built, phase: 'failure', previous: marker(3, {deploy: 20, deployAttempt: 2})}), []);
});
test('late duplicate deploying event cannot downgrade terminal result', async () => {
  assert.deepEqual(await invoke({run: built, phase: 'deploying', previous: marker(4, {deploy: 20, deployAttempt: 1})}), []);
});
test('unexpected build identity fails closed', async () => {
  await assert.rejects(invoke({run: {event: 'push'}}), /identity/);
  await assert.rejects(invoke({run: {head_sha: 'wrong'}}), /identity/);
});
