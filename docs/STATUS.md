# Project status

Updated: 2026-11-05

## Current code
- Static HTML/JavaScript game in index.html; Three.js 0.128.0 loaded from CDN.
- Solo training spawns exactly one articulated soldier. Its AI strafes, reacts to aim and nearby shots, routes around obstacles, seeks cover while reloading, and changes movement with limb loss. Both player and bot have a five-second regeneration event.
- Rifle/SMG switching, held fire, tracers, impact sparks/marks, mouse capture with fallback, and a Windows batch launcher are implemented on the feature branch. Gameplay testing of these latest changes is pending user testing.
- Design document: "Undead Soliders.txt". Prototype is not the completed design.
- Supplied Soldier_01 geometry and SgtFrag texture replace procedural bodies after loading. The latest set contains 16 newly retargeted motions and six retained specialist clips. Directional movement, turns, and hit reactions are wired; grenade toss is baked for future use. See docs/CHARACTER.md; custom wall-run/hop/stomp polish remains.
- Two-player peer-to-peer PIN duels are implemented on the multiplayer feature branch, with solo bots preserved. This is casual client-trusted networking; no relay or host migration is configured.
- First/third-person switching, ADS, limb-dependent wall running/jumping, slide cancellation, armor-before-limb rules, recoil changes, relic bearing/reachability, and guarded finisher prompts are implemented on the feature branch. Latest gameplay validation remains pending. See docs/DESIGN-AUDIT.md for design coverage and explicit limitations.
- Final art/audio, polished animations, relay/anti-cheat infrastructure, and full balancing remain unfinished.

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
