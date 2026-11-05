# Mixamo animation sources

The current bake uses 16 loose FBX motions supplied in this folder. Y Bot.fbx is the reference rig; its one-frame pose is not a gameplay clip. The RAR is ignored. Raw FBX working files stay local; the baked animated glTF is tracked.

| Source | Game animation |
| --- | --- |
| rifle aiming idle, rifle run, walking | Armed idle, run, and ADS walk |
| run backwards, walking backwards | Backward sprint and walk |
| strafe left, strafe right | Directional strafe |
| strafe (2), strafe | Fast left/right strafe |
| turn left, turning right 45 degrees | Standing turns |
| firing rifle, hit reaction | Upper-body firing and hit overlays |
| reloading, rifle jump | Standing reload and jump |
| toss grenade | Baked for future grenade gameplay; not triggered |

The previous crouch, prone reload, prone crawl, low crawl, landing, and death clips are retained from the existing baked glTF when their loose files are absent. Rebuilding uses `npm run build:character`; it does not need or read the archive. The bake verifies that retained tracks still match the target rig, removes horizontal movement, and normalizes vertical placement of newly baked clips. `node scripts/inspect-animations.cjs` inventories the loose FBXs without opening the RAR.

The supplied Blockbench rig and both original idles are preserved. See [character integration](../../../docs/CHARACTER.md) and the [retarget report](../retarget-report.json).
