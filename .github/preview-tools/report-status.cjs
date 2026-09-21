// Runs only from trusted default-branch tooling, never from the PR artifact.
module.exports = async ({ github, context, core, runId, sha, phase }) => {
  const repo = context.repo;
  const { data: run } = await github.rest.actions.getWorkflowRun({ ...repo, run_id: runId });
  if (run.event !== 'pull_request' || run.head_sha !== sha) throw new Error('Unexpected build identity');
  const prs = await github.paginate(github.rest.repos.listPullRequestsAssociatedWithCommit,
    { ...repo, commit_sha: sha, per_page: 100 });
  const matches = p => p.head.sha === sha && p.head.repo?.full_name === run.head_repository.full_name &&
    p.head.ref === run.head_branch;
  const candidate = prs.find(p => p.state === 'open' && matches(p));
  if (!candidate) return;
  const { data: pr } = await github.rest.pulls.get({ ...repo, pull_number: candidate.number });
  if (pr.state !== 'open' || !matches(pr)) return;

  // A different run for the same commit, or a rerun attempt, supersedes old events.
  const runs = await github.paginate(github.rest.actions.listWorkflowRuns, {
    ...repo, workflow_id: run.workflow_id, head_sha: sha, event: 'pull_request', per_page: 100,
  });
  if (runs.some(other => other.id > run.id && other.head_branch === run.head_branch &&
    other.head_repository?.full_name === run.head_repository.full_name)) return;
  const attempt = Number(run.run_attempt);
  if (attempt !== Number(process.env.BUILD_ATTEMPT)) return;
  const deployId = phase === 'build' ? 0 : Number(process.env.DEPLOY_RUN_ID);
  const deployAttempt = phase === 'build' ? 0 : Number(process.env.DEPLOY_ATTEMPT);

  let state = 'pending', description, rank;
  if (phase === 'build') {
    if (run.status !== 'completed') {
      rank = run.status === 'in_progress' ? 1 : 0;
      description = rank ? 'Preview building' : 'Preview pending: waiting for build';
    } else if (run.conclusion === 'success') {
      rank = 2; description = 'Preview waiting for deployment';
    } else {
      rank = 4; state = 'failure';
      description = `Preview unavailable: build ${run.conclusion}`;
    }
  } else {
    if (run.status !== 'completed' || run.conclusion !== 'success') return;
    if (phase === 'deploying') {
      rank = 3; description = 'Preview deploying';
    } else if (phase === 'success') {
      rank = 4; state = 'success'; description = 'Preview deployed';
    } else if (['failure', 'cancelled', 'skipped'].includes(phase)) {
      rank = 4; state = 'failure'; description = `Preview unavailable: deployment ${phase}`;
    } else throw new Error('Unexpected preview status phase');
  }

  // The reusable reporter serializes writes per SHA. This marker prevents late
  // build events and old attempts from overwriting newer deployment results.
  const { data: statuses } = await github.rest.repos.listCommitStatusesForRef({ ...repo, ref: sha, per_page: 100 });
  const previous = statuses.find(status => status.context === 'preview');
  const marker = previous?.target_url?.match(/#preview-run=(\d+)&attempt=(\d+)&deploy=(\d+)&deploy-attempt=(\d+)&stage=(\d+)$/);
  if (marker) {
    const [, oldRun, oldAttempt, oldDeploy, oldDeployAttempt, oldRank] = marker.map(Number);
    if (oldRun > run.id || (oldRun === run.id && oldAttempt > attempt)) return;
    if (oldRun === run.id && oldAttempt === attempt) {
      if (oldDeploy > deployId || (oldDeploy === deployId && oldDeployAttempt > deployAttempt)) return;
      if (oldDeploy === deployId && oldDeployAttempt === deployAttempt && oldRank >= rank) return;
    }
  }
  // Preserve a successful status written by the previous workflow implementation.
  if (!marker && previous?.state === 'success' && phase === 'build' &&
    Date.parse(previous.created_at) >= Date.parse(run.run_started_at)) return;

  const target = state === 'success'
    ? `https://pr-${pr.number}.${process.env.PREVIEW_PROJECT}.pages.dev`
    : phase === 'build' ? run.html_url : process.env.DEPLOY_RUN_URL;
  await github.rest.repos.createCommitStatus({
    ...repo, sha, state, context: 'preview', description,
    target_url: `${target}#preview-run=${run.id}&attempt=${attempt}&deploy=${deployId}&deploy-attempt=${deployAttempt}&stage=${rank}`,
  });
  core.info(description);
};
