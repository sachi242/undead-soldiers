# Undead Soldiers — shared Codex instructions

## Start small
- Read docs/STATUS.md and the assigned GitHub issue first. Read docs/COLLABORATION.md on first setup.
- Read only code and design sections relevant to the task; avoid loading full chat histories or repeatedly scanning the repository.
- The design source is "Undead Soliders.txt". Code and verified results determine current behavior; the design describes intended behavior.
- User instructions take precedence over this file.

## Coordinate
- GitHub is the shared source of truth. Local edits and Codex chats are not automatically synchronized.
- Before starting, inspect git status, fetch origin, and check the issue for an existing owner or overlapping pull request.
- Agree one owner per task before coding. An issue comment is a coordination signal, not an atomic lock; if two people claim it, coordinate before editing.
- Each person uses a separate clone/worktree and branch: work/<operator>/<issue>-<short-name>.
- Use stable operator labels such as sachi and friend, even if both computers authenticate to the same GitHub account.
- Never work directly on main for normal feature work. Start from current origin/main; preserve uncommitted user changes.
- Until the monolithic index.html is split, only one person edits it at a time. Others can own documentation or test reports.
- Make a focused pull request with the issue number, operator, files touched, tests, and known limits. A human merges after review.
- Fetch again before review; resolve conflicts on the feature branch without overwriting another person's work. Do not force-push main.

## Finish and hand off
- Update the issue with a short status, branch/PR, verification, blockers, and next step.
- Change docs/STATUS.md only when shared project facts change, preferably in the same PR. Keep task chatter on issues.
- Record durable agreed decisions in docs/DECISIONS.md. Do not paste chats, credentials, or private account information.
- Run checks appropriate to the change; do not claim unperformed browser tests or successful deployment.
- Publish only through the existing Pages setup. main publishes publicly; branches do not get automatic preview URLs.

## Efficiency
- One task, one owner, one branch. Reuse existing findings and avoid duplicated agent runs.
- Keep documentation concise. Prefer targeted searches and one meaningful verification pass.
- Shared files reduce repeated explanation; they do not pool account allowances or guarantee lower credit usage.
