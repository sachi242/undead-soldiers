# Work together from two Codex CLIs

## What is shared
The repository stores code, design, instructions, decisions, and templates. GitHub Issues store task ownership and handoffs. Pull requests store proposed changes and review. Git pushes/pulls synchronize saved changes, not live editing, local files, or chat memory.

Separate GitHub accounts with collaborator access are recommended. If both computers authenticate to one account, branches still work, but GitHub attribution, approvals, and issue assignees cannot reliably distinguish the two people. Use operator labels in branch names, issue updates, and PR descriptions. Never commit login credentials.

## One-time setup on each computer
Use an installed Git client and Codex CLI, signed in through each application's normal authentication flow. Each person keeps their own Codex account. Give Git write access through the normal GitHub login flow on that computer; this repository does not configure authentication.

Clone into a new folder (do not clone over an existing project):

```powershell
git clone https://github.com/sachi242/undead-soldiers.git
cd undead-soldiers
codex
```

If a checkout already exists, tell Codex to inspect its remote and working tree before synchronizing; do not reset it to discard local work.

## Start a task
1. Pick an open issue and agree the owner: sachi or friend. Read existing claims and PRs. Update the issue using the handoff format below (manually if the CLI has no GitHub issue tool).
2. Confirm nobody is editing overlapping files. index.html currently requires a single editor until the split task merges.
3. With a clean working tree, create a branch from the fetched main. Replace the sample operator, issue number, and task name:

```powershell
git fetch origin
git switch -c work/sachi/123-example-task origin/main
```

4. Start a fresh Codex session after pulling new AGENTS.md instructions. Paste:

> Read AGENTS.md and docs/STATUS.md. My operator label is <sachi or friend>. Work on GitHub issue #<number>. Inspect local changes and the issue owner first, then create a task branch from current origin/main. Stay within the issue scope, verify the change, and prepare a pull request. Record a concise handoff. Do not merge automatically.

Do not start the same task in both accounts. Reading the same docs is sufficient; no chat export is required.

## Finish a task
Test locally, commit the specific files, push your feature branch, and open a pull request targeting main. Codex can do this when its GitHub access is available. Otherwise use GitHub's "Compare & pull request" button after pushing.

The other person reviews. With a shared GitHub login, GitHub cannot count you as separate reviewers; arrange human review yourselves. Merge one PR at a time. The next task starts from the newly fetched main.

## Issue handoff format
```text
Operator: sachi | friend
State: ready | in progress | in review | blocked | done
Branch / PR:
Scope / files:
Verified:
Blocker / next step:
```

Comments are lightweight coordination, not an automatic lock or background agent messaging system.

## Test and publish
For the current single-file game, open index.html in a WebGL-capable browser with internet access for Three.js. If the game becomes modules, serve the repository over HTTP and document the exact preview command in README.md.

Each merge to main triggers GitHub Pages. Check Actions for the actual deployment result; a successful build is not proof of successful publication. Feature branches require local testing unless a preview service is added later.

Game URL: https://sachi242.github.io/undead-soldiers/
Task board: https://github.com/sachi242/undead-soldiers/issues
Changes for review: https://github.com/sachi242/undead-soldiers/pulls

## Keep context inexpensive
Use one issue per small feature, compact handoffs, targeted file reads, and shared decisions. Do not poll another agent constantly or copy full transcripts into the repository. Each Codex account retains its own usage limits.
