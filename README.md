# Undead Soldiers

A playable browser-based 3D arena combat prototype based on `Undead Soliders.txt`.

## Play locally

For two-player play, choose **Host room**, share the displayed four-digit PIN, and have your friend choose **Join room** with that PIN. Both browsers need the same version. See [multiplayer setup and limits](docs/MULTIPLAYER.md). Use a local HTTP server (`python -m http.server 8080`) for development, then open http://localhost:8080.

Open `index.html` in a modern desktop browser with WebGL enabled. Three.js is loaded from a pinned CDN and requires an internet connection.

Click **Enter arena**, then use WASD to move, drag to aim, and click to fire. Shift sprints, Space jumps, C slides, R reloads, and E finishes nearby limbless enemies. The **Try tombstone rush** button demonstrates the five-second regeneration mechanic.

## Browser testing with GitHub Pages

GitHub Pages publishes from the root of the `main` branch. Updates to `index.html` automatically trigger a deployment. Play at https://sachi242.github.io/undead-soldiers/ once deployment completes.

The local `.github/workflows/pages.yml` is an optional alternative for deploying with GitHub Actions; it is not required by the current branch-based hosting setup.

## Prototype scope

Includes a 3D arena, four bots, armor stripping, limb removal, movement penalties, torso highlighting, tombstone regeneration, exposed-head eliminations, close-range finishers, and confirm tags.

This is an early single-player prototype. Multiplayer, third-person view, wall running, final art/audio, and full balancing remain to be developed. JavaScript syntax has been checked; complete browser gameplay validation remains pending.

## Work together with two Codex CLIs

Start with [the collaboration guide](docs/COLLABORATION.md). Both sessions follow [AGENTS.md](AGENTS.md), check [project status](docs/STATUS.md), claim an [issue](https://github.com/sachi242/undead-soldiers/issues), and work on separate branches. Open a pull request before merging into main.
