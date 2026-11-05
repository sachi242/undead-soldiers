# Soldier model and animation integration

The bot, remote player, and local third-person body now use the supplied Soldier_01 model. The original model and three PNG skins are preserved. Soldier_01.png is a default alias of the supplied SgtFrag skin. First-person view retains the weapon-only camera presentation.

## Runtime assets
- assets/Soldier_01_animated.gltf: supplied geometry/skin, seven damage regions, both original idle clips, and twelve baked Mixamo clips.
- assets/Soldier_01.png: default texture.
- animated-soldier.js: independent skeleton cloning, animation selection/crossfades, upper-body firing, damage-region visibility, and fallback handling.

The pinned Three.js 0.128.0 GLTFLoader and SkeletonUtils addons match the existing engine version. Model loads are shared, but each actor receives an independent skeleton and mixer. If loading fails, the procedural character remains active and the UI reports the fallback.

## Animation selection
Idle, run, strafe, reload, jump, landing, crouched slide, prone reload, low crawl, and death have matching baked clips. Rifle fire is masked to upper-body tracks and layered over the current movement action. Sprint changes playback rate. Local view uses actual input state; peer movement/reload/airborne state is synchronized.

## Retargeting
The source Blockbench rig has 16 bones. scripts/build-soldier.cjs maps them to the Mixamo source rig, aligns rest directions in world space, converts back to target-local quaternions, preserves target bone lengths, and samples at 30 FPS. Root XZ motion is removed. A skinning-based floor correction compensates for different limb lengths; the game controller owns world elevation, including jumps.

The bake preserves the provided model's texture coordinates and original Idle_Weapon/Idle_No_Weapon animations. It partitions triangles by dominant skin influence into torso, head, helmet cap, two arms, and two legs. A severed region is baked from its current skinned pose into a detached static mesh. Hiding that region never scales or removes the torso skeleton. Helmet separation uses the upper head geometry, not a separately authored helmet object.

## Rebuild and verify
Run npm install, then npm run build:character and npm test. Rebuilding requires the downloaded FBX files in assets/animations/mixamo; original downloads remain local working sources. The baked runtime glTF is included in the repository and requires no FBX download or build step to play. The retarget report records clip names and bone mapping.

Tests cover loading actual rigged geometry, independent skeletons, working animation tracks, damage tags/visibility, finite skinned positions, and the game's full detach/regenerate lifecycle. Texture URLs and content types are checked through the launcher test. These checks do not replace visual gameplay review.

## Remaining animation work
Wall running currently uses the run animation with controller wall motion. True limbless wriggling uses a low-crawl adaptation with removed limbs hidden. One-leg hopping and head stomp still need bespoke clips/polish. Mirrored left strafe, hand-to-weapon alignment, transition feel, and cross-network timing need player review. No browser/computer-use gameplay testing was performed for this update.
