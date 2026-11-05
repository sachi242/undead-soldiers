# Mixamo animation source set

Downloaded from the signed-in Mixamo library on 2026-11-05. Source character: Y Bot. Exports: binary FBX, Without Skin, 30 FPS, no keyframe reduction. In Place was enabled for Rifle Run, Rifle Crouch Walk, Rifle Side Step, and Prone Forward where available. The game controller owns world movement; root motion should be stripped/normalized during retargeting.

| File | Intended state |
| --- | --- |
| Rifle Aiming Idle.fbx | Armed idle / ADS |
| Rifle Run.fbx | Armed running; adjust playback rate for sprint |
| Firing Rifle.fbx | Rifle shot / upper-body firing blend |
| Rifle Side Step.fbx | Strafe; mirrored variation requires a verified mirror pass |
| Rifle Crouch Walk.fbx | Crouched movement / slide transition source |
| Reloading.fbx | Standing reload |
| Prone Reloading.fbx | Reload while prone |
| Prone Forward.fbx | Prone movement source |
| Low Crawl.fbx | Low crawl source; not a finished limbless worm animation |
| Jump.fbx | Rifle jump |
| Jumping Down.fbx | Jump-down / landing source |
| Rifle Death.fbx | Death / collapse source |

## Verified
All twelve binary FBX files parse using the project's Three.js 0.128.0 FBXLoader and each contains a nonempty AnimationClip with 53 tracks. `manifest.json` records lengths, track counts, file sizes, and SHA-256 hashes. Run `node scripts/inspect-animations.cjs` after `npm install` to regenerate the inventory. This is file validation, not visual animation/gameplay QA.

## Retargeting
`../../Soldier_01.gltf` was exported from Blockbench and uses a custom rig (Hips, Torso, Neck, Head, L_Shoulder/L_Arm_Lower/L_Hand, R equivalents, and leg chains). The bake in scripts/build-soldier.cjs maps bones, fits rest directions, removes horizontal root motion, corrects the floor, and preserves the supplied Idle_Weapon and Idle_No_Weapon clips. Raw Mixamo tracks cannot be directly assigned to the custom rig.

Wall running, true limbless wriggling, single-leg hopping, and the head stomp require custom animation or substantial adaptation. Detached limbs need animation masks or mesh/skin handling that preserves the existing damage mechanics.

Three supplied skins are preserved. `../../Soldier_01.png` is a default copy of Soldier_01_Skin_2_SgtFrag.png to satisfy the original glTF image URI. FishHead and Zombie remain alternatives.

The downloads remain local working sources. The game now uses the derived assets/Soldier_01_animated.gltf, with retargeted clips and independent animated skeletons. See docs/CHARACTER.md for the runtime state mapping and remaining custom-animation work. Original FBX downloads are not published as standalone files.
