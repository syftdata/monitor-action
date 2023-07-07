const core = require("@actions/core");
const exec = require("@actions/exec");
const github = require("@actions/github");

export async function setupSyftCli() {
  core.info("Installing Syft");
  await exec.exec(`npm -g install @syftdata/cli`);
}

export async function getIssueNumber(octokit) {
  try {
    const context = github.context;
    const issue = context.issue;
    if (issue) {
      return issue.number;
    }

    const prs = (
      await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        commit_sha: context.sha,
        owner: context.repo.owner,
        repo: context.repo.repo,
      })
    ).data;
    if (prs.length > 0) {
      return prs[0].number;
    }
    return 0;
  } catch (e) {
    core.warning(
      `Failed to get issue number from context, error: ${e.message}`
    );
    return 0;
  }
}

export async function postComent(octokit, issueNumber, comment) {
  if (issueNumber === 0) {
    core.warning("No issue number found, skipping posting comment");
    return;
  }
  const context = github.context;
  try {
    await octokit.rest.issues.createComment({
      issue_number: issueNumber,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: comment,
    });
  } catch (e) {
    core.warning(`Failed to post comment, error: ${e.message}`);
  }
}
