#!/usr/bin/env node

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;

if (!token || !repository) {
  throw new Error("GITHUB_TOKEN and GITHUB_REPOSITORY are required.");
}

const [owner, repo] = repository.split("/");
const apiBase = "https://api.github.com";
const digestTitle = "Repository maintenance digest";
const marker = "<!-- github-governance-maintenance-digest -->";
const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

async function api(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "github-governance-maintenance",
      ...(options.headers ?? {})
    }
  });
  if (response.status === 204) return null;
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.message ?? response.statusText;
    const error = new Error(`${response.status} ${message}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

async function optionalApi(path) {
  try {
    return { ok: true, data: await api(path) };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

function linkList(items, formatter) {
  return items.length === 0 ? "- None" : items.map(formatter).join("\n");
}

async function ensureLabel(name, color, description) {
  try {
    await api(`/repos/${owner}/${repo}/labels/${encodeURIComponent(name)}`, {
      method: "PATCH",
      body: JSON.stringify({ color, description })
    });
  } catch (error) {
    if (error.status !== 404) throw error;
    await api(`/repos/${owner}/${repo}/labels`, {
      method: "POST",
      body: JSON.stringify({ name, color, description })
    });
  }
}

async function findDigestIssue() {
  const issues = await api(`/repos/${owner}/${repo}/issues?state=open&per_page=100`);
  return issues.find((issue) => issue.title === digestTitle && !issue.pull_request);
}

const [pulls, issues, runs, dependabotAlerts, codeScanningAlerts] = await Promise.all([
  api(`/repos/${owner}/${repo}/pulls?state=open&per_page=100`),
  api(`/repos/${owner}/${repo}/issues?state=open&per_page=100`),
  api(`/repos/${owner}/${repo}/actions/runs?per_page=100`),
  optionalApi(`/repos/${owner}/${repo}/dependabot/alerts?state=open&per_page=25`),
  optionalApi(`/repos/${owner}/${repo}/code-scanning/alerts?state=open&per_page=25`)
]);

const stalePulls = pulls.filter((pull) => new Date(pull.updated_at) < twoDaysAgo);
const openBugs = issues.filter((issue) => !issue.pull_request && issue.title !== digestTitle).filter((issue) =>
  issue.labels?.some((label) => ["bug", "security"].includes(label.name))
);
const failedRuns = runs.workflow_runs.filter((run) =>
  ["push", "schedule", "workflow_dispatch"].includes(run.event) &&
  new Date(run.created_at) >= sevenDaysAgo &&
  !["success", "skipped", "cancelled"].includes(run.conclusion)
);
const hasProblems = stalePulls.length > 0 || openBugs.length > 0 || failedRuns.length > 0 ||
  (dependabotAlerts.ok && dependabotAlerts.data.length > 0) ||
  (codeScanningAlerts.ok && codeScanningAlerts.data.length > 0);

const existing = await findDigestIssue();

if (!hasProblems) {
  if (existing) {
    await api(`/repos/${owner}/${repo}/issues/${existing.number}`, {
      method: "PATCH",
      body: JSON.stringify({ state: "closed", state_reason: "completed" })
    });
  }
  console.log("No maintenance issues found.");
  process.exit(0);
}

await ensureLabel("maintenance", "5319e7", "Repository health and automation follow-up.");

const body = [
  marker,
  `Last checked: ${now.toISOString()}`,
  "",
  "## Needs Attention",
  "",
  "### Stale Open PRs",
  linkList(stalePulls, (pull) => `- #${pull.number} ${pull.title} (${pull.html_url})`),
  "",
  "### Open Bug or Security Issues",
  linkList(openBugs, (issue) => `- #${issue.number} ${issue.title} (${issue.html_url})`),
  "",
  "### Failed Default-Branch or Scheduled Workflows",
  linkList(failedRuns, (run) => `- ${run.name}: ${run.conclusion} (${run.html_url})`),
  "",
  "### Dependabot Alerts",
  dependabotAlerts.ok ? linkList(dependabotAlerts.data, (alert) => `- ${alert.dependency?.package?.name ?? "dependency"} ${alert.security_advisory?.severity ?? "unknown"} (${alert.html_url})`) : `- Not readable by this workflow token: ${dependabotAlerts.message}`,
  "",
  "### Code Scanning Alerts",
  codeScanningAlerts.ok ? linkList(codeScanningAlerts.data, (alert) => `- ${alert.rule?.id ?? "rule"} (${alert.html_url})`) : `- Not readable by this workflow token: ${codeScanningAlerts.message}`
].join("\n");

if (existing) {
  await api(`/repos/${owner}/${repo}/issues/${existing.number}`, {
    method: "PATCH",
    body: JSON.stringify({ body })
  });
  console.log(`Updated issue #${existing.number}.`);
} else {
  const created = await api(`/repos/${owner}/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title: digestTitle, body, labels: ["maintenance"] })
  });
  console.log(`Created issue #${created.number}.`);
}
