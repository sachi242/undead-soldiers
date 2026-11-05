# Four-digit PIN multiplayer

This feature adds a two-player peer-to-peer duel. Four digits refers to the room PIN, not the player count. Solo bot practice remains available.

## Play
1. Both players open the same game version in a current desktop Chrome, Edge, or Firefox browser.
2. Player one chooses **Host room** and shares the displayed four-digit PIN. Keep this tab open.
3. Player two enters the PIN (including any leading zeros) and chooses **Join room**.
4. When connected, both enter the duel automatically. Players start on opposite sides of the spawn area; bots are disabled.
5. Break the opponent's helmet, then hit their exposed head. Body/limb hits sever limbs. Losing all limbs starts the five-second tombstone rush. Collect the opponent's tag after elimination. Respawn is local; restarting does not reset your opponent's score.
6. **Leave room** returns to solo. Disconnecting ends the duel; there is no host migration or automatic rejoin.

Pause is local and does not protect you from incoming hits. The tombstone demo button is disabled during a duel. Use desktop keyboard/mouse controls; touch movement is not implemented.

Click **Enter arena** to request mouse capture. **Enable mouse** retries capture, and Escape releases it. If the browser blocks capture, mouse-over aiming is enabled inside the arena (the cursor can still reach its edges). Turn off browser annotation mode so clicks reach the game. Hold the left mouse button for repeated shots with visible tracers; remote shots also show tracers. Gameplay verification of these latest input/tracer changes is left to the player.

## Preview locally
From the repository root with Python installed:

```powershell
python -m http.server 8080
```

Open http://localhost:8080 in two tabs to test the lobby, then test with a friend on another computer/network. External network access is required to load the pinned Three.js and PeerJS libraries and reach signaling/STUN services. GitHub Pages serves the static files; it does not host a game server.

## Network boundaries
PeerJS 1.5.5 uses its public signaling service to find peers. Gameplay travels over WebRTC data channels. No microphone, camera, account, or paid backend is required. Direct connections can fail behind restrictive NAT/firewalls. No TURN relay is configured; a 20-second timeout explains the failure. A production service can supply its own signaling and TURN configuration later.

Four-digit codes are discoverable room locators, not passwords. Rooms admit one guest; full rooms reject further connections. This is casual client-trusted gameplay, not competitive anti-cheat: remote movement and reported hits are trusted after basic bounds/type/rate checks. Do not use it for ranked play.

## Checks
Run `node --test tests/room.test.cjs` for transport lifecycle, PIN validation, room capacity, collision retry, backpressure, and cleanup coverage. Browser checks and remaining limits are recorded in the pull request; a mock transport test alone does not verify WebRTC connectivity across networks.