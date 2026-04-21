# Repository Agent Instructions

## Project Context

Repository: `aolingge/deutsch-lernen`
Primary language: PowerShell

## Default Workflow

- Keep changes small and focused.
- Read existing README, package files, build scripts, and workflow files before editing.
- Prefer existing project conventions over introducing new structure.
- Do not add secrets, tokens, cookies, private URLs, private paths, or credentials to repository files, issue comments, PR comments, fixtures, or docs.
- Include verification commands in PR descriptions.
- Treat workflow, publishing, dependency, and authentication changes as security-sensitive.

## Pull Request Rules

- CI and security checks must pass before merge.
- Low-risk Dependabot patch updates may be auto-merged only when branch protection and required checks are active.
- Major dependency updates, GitHub Actions updates, publishing changes, and human-authored code changes require maintainer review.
