// Runs only from trusted default-branch tooling. Finds the open pull request a
// "PR build" run belongs to, using the workflow run and the GitHub API, never
// the build artifact.
//
// GitHub links a commit to this repository's pull requests only when the
// commit exists here, so a fork's head commit finds nothing by commit. The
// fork's owner and branch, from the same trusted run, find it instead. Either
// way the pull request must be open with exactly this head commit, repository,
// and branch.

module.exports = async function findPullRequest({ github, repo, run, sha }) {
  const headRepo = run.head_repository?.full_name;
  const matches = pr => pr.state === 'open' && pr.head?.sha === sha &&
    pr.head?.repo?.full_name === headRepo && pr.head?.ref === run.head_branch;

  const byCommit = await github.paginate(github.rest.repos.listPullRequestsAssociatedWithCommit,
    { ...repo, commit_sha: sha, per_page: 100 });
  const found = byCommit.find(matches);
  if (found || !headRepo || !run.head_branch) return found ?? null;

  const byBranch = await github.paginate(github.rest.pulls.list,
    { ...repo, state: 'open', head: `${headRepo.split('/')[0]}:${run.head_branch}`, per_page: 100 });
  return byBranch.find(matches) ?? null;
};
