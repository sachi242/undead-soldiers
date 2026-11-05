# Design document audit

Compared with `Undead Soliders.txt` on 2026-11-05. “Implemented” means code exists on the feature branch, not that player testing has approved its feel or balance.

| Requirement | Implementation / remaining work |
| --- | --- |
| First/third person | V or the view button switches cameras; own articulated body is visible in third person; camera retracts at cover. Validate camera clipping in play. |
| No health bars; exposed head kills | Shared rules break the helmet first, then permit a headshot kill. Body hits never directly eliminate. |
| Armor then limb loss | Each limb has an armor plate. A first hit strips it, a second severs the limb. Plates change material. Torso hits select a surviving limb. |
| Limb speed matrix | +10% one missing arm, +30% both missing arms, −60% one missing leg, −85% both missing legs. Low body profile and pose follow the remaining limbs. |
| Worm crawling | +40% over normal crawling, following the detailed prose. The summary table is ambiguous about the baseline; this choice is explicit in game-rules.js. |
| Wall run / wall jump | Hold Space while moving alongside a wall after jumping; press Space again to kick off. Two-arm wall run 2.2s (prototype choice), armless 3.4s, one-leg 1.2s; no legs disables it. Playtest wall contacts and timing. |
| Slide / cancel | C starts or cancels a slide. Both legs required; armless slides last longer. |
| ADS / off-hand recoil / rig firing | Right-click lowers FOV and spread. Arm loss increases spread and recoil. Torso-mounted weapon remains usable without arms. |
| Five-second relic rush | Reachability uses navigation path length and the player's actual crawl speed. HUD shows distance and bearing. Touching regenerates all visible limbs, armor, and helmet. Bot has its own relic. A fully blocked location can fall back to the current position. |
| Fatal collapse / tag | Timer expiry eliminates; peer sends a confirm tag to the opponent. Solo player's death ends the practice round, rather than leaving a persistent spectator world. |
| Torso hunter highlighting | Limbless enemy model receives a red aura with depth test disabled, visible through cover. A polished thermal outline and named tracking marker remain art/UI work. |
| Head stomp | E prompt only for a nearby limbless enemy with clear line of sight. Close range and player height are checked; short camera feedback is present. Bespoke stomp animation remains unfinished. |
| Training bot | Exactly one solo bot; finite ammo, reload cover seeking, strafe, threat dodge, obstacle navigation, anatomy-dependent movement and relic recovery. |
| Peer testing | Two players via PIN. Four players were not specified by the source design. No TURN configuration, host migration, or competitive anti-cheat. |

## Still requires validation or production work
- User gameplay testing: wall runs/jumps, camera aiming/clipping, collision edges, ADS, armor balance, finishers, and tombstone timing.
- Cross-computer/network multiplayer testing of the latest mechanics; both players must use the same branch/version.
- Audio, polished movement/finisher animations, and final balancing. The supplied textured Soldier_01 model now has retargeted Mixamo clips; procedural models remain a load-failure fallback. See CHARACTER.md.
- Cover seeking is grid based. A complete physics controller, anti-cheat authority, relay infrastructure, or larger player count is not provided.

Code verification uses pure rules tests, bot decision/navigation tests, actual Three.js model checks, and a headless game lifecycle. No computer-use gameplay testing is performed for this audit, per the user's preference.
