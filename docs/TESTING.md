# Browser smoke testing

Operator: friend. Run date: 2026-11-05. Related task: #2.

## Tested build and environment

- Commit: `ed4aef1afebe4c765a406cabf777d33d9d435efe`.
- Target: deployed https://sachi242.github.io/undead-soldiers/ (not local).
- Public HTML matched this commit's `index.html` after CRLF/LF normalization.
- Browser: ChatGPT in-app browser, 1280 x 720 screenshot; exact engine/version not exposed by the inspected UI. Host OS: Windows; remote browser OS/version not verified.
- Local file navigation was blocked by browser security policy. A separate automated-browser import also failed before launch. Neither is classified as a game bug.
- Render updates were slow in this testing surface. Wall-clock timing, reload completion and movement need a normal desktop-browser follow-up. These results are a partial smoke pass, not full gameplay validation.

## Checklist and observed results

PASS applies only to the observation stated. NOT TESTED means no verified result.

| Check / repeatable procedure | Result | Observation |
| --- | --- | --- |
| Load page; inspect arena and engine status | PASS | Ready status; WebGL arena, walls, soldiers and weapon rendered. Captured browser error/warning log was empty at inspection. |
| Click Enter arena | PASS | Cover removed from accessibility tree; HUD showed intact limbs and 12 / 12. |
| Hold W/A/S/D separately; verify direction and collision | NOT TESTED | Sustained movement not verified. |
| Drag inside arena | PASS | A right/down drag visibly changed the arena view; ammo stayed 12 / 12. |
| Click inside arena to fire | PASS | Ammo changed from 12 / 12 to 11 / 12. Hit accuracy not established. |
| Press R after firing; wait for 12 / 12 | NOT TESTED | R changed HUD to RELOADING; completion not verified. |
| Hit helmet, then exposed head | NOT TESTED | No controlled head elimination observed. |
| Shoot limbs; inspect detachment and player damage states | NOT TESTED | Demo sets player limbs empty, but combat limb damage was not verified. |
| Eliminate enemy; walk through glowing confirm tag | NOT TESTED | No verified tag collection or score increment. |
| Click Pause, then Resume | PASS | Button toggled Resume/Pause; notices changed to Paused/Combat resumed. Simulation freeze itself not measured. |
| Click Try tombstone rush | PASS | Empty limb HUD, WORM CRAWL, green relic and descending 5.0 timer appeared. |
| Reach relic before expiry | NOT TESTED | No verified restoration through collection. |
| Start rush; remain still until expiry; respawn | NOT TESTED | Countdown observed to 4.7 only; expiry/respawn not verified. |
| Restart during active rush | FAIL | Limbs, ammo and intact mode reset; rush overlay removed, but regeneration instruction persisted. See #3. |
| Repeat at narrow width and with touch input | NOT TESTED | Responsive layout and touch gameplay not exercised. |

## Confirmed failure

[#3: Restart leaves tombstone instruction visible](https://github.com/sachi242/undead-soldiers/issues/3).
Enter arena, click **Try tombstone rush**, then **Restart** while rush is active.
Expected a fresh-run notice. Observed **REGENERATE: reach the green tombstone before the timer expires.** even with STRUCTURE INTACT, full limbs, 12 / 12 and no rush overlay; it remained after dragging aim. This confirms stale text, not an active hidden rush. Checked existing repository issues for duplicates before filing. No fixes made.

## Input limits and follow-up

The displayed controls require WASD, R and other keyboard keys plus click/drag aiming. Source inspection found no on-screen movement/reload buttons; touch-only play is therefore not established. Source has a below-500px style rule, but that does not establish narrow-screen usability. Test HUD overlap, footer reachability and touch/keyboard focus on real devices.

Before treating #2 as complete, run all NOT TESTED rows in a regular WebGL-capable desktop browser, recording browser/OS versions and commit. In particular verify reload completion, WASD, helmet/head finish, limb combat, tags, pause timing and both tombstone outcomes. Keep gameplay fixes in separate issues/PRs. No deployment success claim beyond the page observed in this run.
