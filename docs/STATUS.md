# Project status

Updated: 2026-11-05

## Current code
- Static HTML/JavaScript game in index.html; Three.js 0.128.0 loaded from CDN.
- Initial solo prototype includes an arena, four bots, limb removal, helmet/head hits, confirm tags, and a five-second regeneration demonstration.
- Design document: "Undead Soliders.txt". Prototype is not the completed design.
- Two-player peer-to-peer PIN duels are implemented on the multiplayer feature branch, with solo bots preserved. This is casual client-trusted networking; no relay or host migration is configured.
- Third-person view, wall running, final art/audio, and full balancing are not complete.

## Verification and hosting
- JavaScript syntax and six transport lifecycle tests passed for PIN multiplayer. A two-tab browser test verified host/join, opponent visibility, helmet damage, headshot elimination, respawn, and disconnect cleanup with no console errors observed. Separate-computer/network testing and the full gameplay checklist remain pending.
- Source is uploaded to GitHub. Pages publishes main from the repository root.
- Last observed publishing attempt: build passed, deployment returned HTTP 500, retry was queued. This is historical status, not a live deployment check.
- No preview deployment is configured for feature branches.

## Coordination
- Shared instructions and onboarding are in AGENTS.md and docs/COLLABORATION.md.
- Use Issues as the task board and pull requests as the review queue.
- Operator labels: sachi and friend. Friend's GitHub username/access has not been configured by this setup.
- First code task: split index.html without changing behavior. Until merged, only one person edits index.html.
- A second person can independently document browser test results or review the design.

## Next milestones
1. Separate game systems into files and document local preview.
2. Verify core gameplay in a browser and record reproducible bugs.
3. Implement scoped features from the design with issue ownership.
