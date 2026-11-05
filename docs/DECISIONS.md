# Agreed project decisions

## 2026-11-05 — Shared project memory
GitHub holds durable project information. AGENTS.md sets agent workflow; STATUS.md records current facts; issues record ownership and progress; PRs hold changes. Chat histories are not automatically shared.

## 2026-11-05 — Separate task branches
Each operator uses a separate clone/worktree and a work/<operator>/<issue>-<name> branch. Human review precedes merging. The initial collaboration documentation is bootstrapped directly onto main; subsequent feature work uses PRs.

## 2026-11-05 — Prevent conflicting edits
The initial game is one large index.html. Only one operator edits it until a behavior-preserving file split merges. This is a coordination rule, not an enforced repository permission.

## 2026-11-05 — Existing publishing
Retain root-of-main GitHub Pages publishing. No new hosting service, paid tool, shared credential, or automatic preview environment is introduced.
