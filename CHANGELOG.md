# Demonym Web Connect Changelog

This changelog tracks the public **Demonym Web Connect** project from its first multiplayer proof-of-concept through the current Connect site and Cardputer integration work.

The project began as **Demonym Web Battle** and was quickly expanded / renamed to **Demonym Web Connect** once the scope grew beyond battles toward future trading, chat, rankings, and other connected features.

---

## v0.3.2.7 — Site shell, navigation, themes, and presentation polish

### Site structure

- Expanded Web Connect from a single battle page into a small multi-page Connect site.
- Added:
  - Home
  - Connect
  - About
  - News
  - Ladder
  - Support
  - Settings
- Added a 50px site header with a 920px maximum content width.
- Added desktop navigation and a responsive off-canvas menu for smaller screens.
- Grouped the primary product areas around Connect, News, and Ladder.
- Moved About into the right-side utility/navigation group.
- Updated visible branding from `DEMONYM CONNECT` to `DEMONYM Connect`.

### Home

- Added a dedicated landing page.
- Added route cards for the main site areas.
- Added hover states to route cards.
- Added current Web Connect version output beneath the Home grid.

### About

- Added personal project background and an explanation of the goals behind Demonym and Demonym Connect.
- Added links to:
  - Reddit
  - Instagram
  - GitHub / eyeofbri
  - Demonym Web Connect
  - Demonym
- Added matching social / GitHub icons.
- Added hover states to About-page buttons and links.

### News

- Added repository-backed lightweight news posts.
- News files live in `public/news/`.
- Added support for `.md` and `.txt` posts.
- Added minimal Markdown rendering for:
  - headings
  - paragraphs
  - lists
  - links
  - emphasis
  - inline code
- News posts are sorted by their latest GitHub commit date.
- Files beginning with `_` are ignored by the feed.

### Ladder

- Added a placeholder page for the future player-ranking / competitive system.

### Support

- Added project support and feedback links.
- Added Buy Me a Coffee link.
- Added GitHub issue / feedback link with an explanation that a GitHub account is required to open an issue.
- Added firmware download links:
  - latest Demonym GitHub release
  - Demonym M5Burner listing

### Settings

- Added persistent Dark / Light theme selection.
- Added persistent Simple / Sharp interface style selection.
- Added hover / pointer behavior to Settings controls.
- Fixed the Connect `.lobby` and `#battle` surfaces so they properly change when Light mode is enabled.

### Typography and branding

- Added Chakra Petch for headlines and display text.
- Added Google Sans Flex for general interface/body text.
- Refined the `DEMONYM Connect` site-brand treatment.
- Removed the old decorative logo `::before`.
- Added outlined / glowing brand styling that works across:
  - Light
  - Dark
  - Simple
  - Sharp

### Sharp theme

- Expanded the visual style with restrained Metalheart / Depthcore / Y2K-futurist influence.
- Added:
  - layered gunmetal surfaces
  - brushed-metal style gradients
  - recessed content wells
  - inset edges
  - beveled borders
  - deeper panel shadows
  - clipped mechanical geometry
  - schematic grid details
  - circuit-like traces
  - node dots
  - slotted marks
  - faux technical labels
  - additional decorative greebles
- Kept the detailing intentionally restrained so gameplay and navigation remain readable.

### Footer and favicon

- Added a footer that sits at the bottom of short pages while moving naturally below longer content.
- Footer year is generated dynamically.
- Updated footer credit to:
  - `© 2026 Demonym / Built By - Eye of Bri.`
- Linked Eye of Bri to the Reddit profile.
- Added a GitHub icon on the right side of the footer linking to the Web Connect repository.
- Added a custom SVG favicon using:
  - `D` in the upper-left
  - `C` in the lower-right
  - a lightning-bolt motif through the center
  - outlined styling matching the Connect branding.

### Battle compatibility

- Preserved the v0.3.2.6 battle UI and networking behavior.
- Preserved Cardputer sprite transfer.
- Preserved Battle Rules v19.
- Preserved reconnect, session-resume, and session-cleanup behavior.

---

## v0.3.2.6 — Compact native-style battle interface

### Browser battle UI

- Reworked the browser battle screen to look substantially closer to the native Cardputer battle interface.
- Added compact fighter HUDs.
- Added:
  - creature level
  - HP bars
  - Energy bars
  - numeric HP values
  - numeric Energy values
  - status display
- Reduced unused vertical space throughout the battle screen.
- Reorganized the battle presentation into a more compact arena.

### Battle / Settings tabs

- Added `BATTLE` and `SETTINGS` tabs inside the Connect battle interface.
- Moved development / diagnostic controls out of the main battle view:
  - lineage selection
  - device payload test
  - connection information
- Kept the active battle view focused on the actual match.

### Battle log

- Made the Battle Log collapsible.
- Added an entry count.
- Preserved Simple / Verbose copy controls.
- Fixed ordered-list numbering being clipped at the left edge.

### Creature visuals

- Preserved native Cardputer visuals across reset / rematch state.
- Added optional `visual-relay-v1` support.
- Prepared a path where a Cardputer can render an opponent creature using the native firmware generator and send that exact rendered sprite back to the room for browser display.

### Compatibility

- Preserved v0.3.2.5 reconnect behavior.
- Preserved session resume.
- Preserved room/session cleanup.
- Preserved Battle Rules v19.

---

## v0.3.2.5 — Session lifecycle cleanup

### Room cleanup

- Added explicit lifecycle cleanup for abandoned Durable Object battle rooms.
- Added a cleanup path for rooms where both players have left.
- Added shorter cleanup handling for completed battles.
- Preserved the existing reconnect grace period before a temporarily disconnected player is treated as gone.
- Added long-term stale-room expiry so abandoned test rooms do not remain indefinitely.

### Lifecycle timing

- Kept the 60-second reconnect/session-resume window.
- Added abandoned-room cleanup after approximately 15 minutes.
- Added completed-room cleanup after approximately 5 minutes when empty.
- Added an absolute stale-room cleanup around 24 hours.

### UI / diagnostics

- Added session lifecycle information to the browser UI.
- Added session-expiring / cleanup states.

### Creature sprite transport

- This became the working checkpoint where the Cardputer-generated creature visual was successfully transported to the browser.
- Confirmed the real Cardputer sprite could appear in the browser rather than only the earlier approximation.

---

## v0.3.2.4.1 — Native sprite state hotfix

- Fixed the browser-facing state serializer accidentally omitting the persisted `creature.visual` field.
- Allowed the browser to receive the actual native Cardputer sprite data that was already stored by the server.
- No corresponding firmware update was required for this correction.
- Kept the existing browser fallback renderer for creatures without a native uploaded visual.

---

## v0.3.2.4 — Native Cardputer sprite transfer

### Native creature visual upload

- Added compact Cardputer-generated sprite transfer.
- Added support for the `indexed4-rgb565-v1` visual format.
- Sprite payload:
  - 32×32 pixels
  - indexed 4-bit palette values
  - RGB565 palette data
- Added server-side storage of the uploaded native creature visual.
- Added browser Canvas reconstruction of the exact uploaded sprite.

### Browser arena

- Reworked the browser battle area into a more game-like shared arena.
- Added real `<canvas>` creature displays.
- Added mirrored positioning / facing for opposing creatures.
- Preserved a deterministic browser fallback sprite when a native visual is not available.

---

## v0.3.2.3 — Reconnect recovery and explicit leave behavior

- Improved recovery after a reconnect window expires.
- Preserved the still-connected opponent rather than treating the entire room as abandoned.
- Allowed a fresh player to take the newly opened slot after the expired session.
- Reset the interrupted battle cleanly before the replacement player enters.
- Triggered a new Signal Toss only for a genuinely new battle establishment.
- Avoided performing a second Signal Toss during a successful resume.
- Added explicit **Leave Match** behavior.
- Cleared saved browser session information when a player intentionally leaves.
- Improved handling of stale / expired saved session tokens.
- Explicit resume attempts with an invalid or expired token are rejected instead of silently consuming a new player slot.

---

## v0.3.2.2 — Simplified room readiness flow

### Removed the visible READY ceremony

- Removed the player-facing READY button / readiness ceremony.
- Kept internal readiness state for server coordination.

### Browser players

- Browser clients automatically establish after a successful connection / handshake.
- Joining a battle is treated as the player's intentional commitment to enter.

### Cardputer players

- Physical Cardputer clients establish after their canonical creature snapshot is accepted.
- This keeps the Cardputer flow tied to a valid creature handoff rather than a separate READY press.

### Empty slots

- Empty player slots now display as genuinely empty / waiting.
- Removed the misleading placeholder creature that previously made a missing P2 look occupied.
- Added `WAITING` presentation for unoccupied slots.

### Compatibility

- Preserved:
  - Signal Toss
  - round state
  - locked actions
  - reconnect/session resume
  - Battle Rules v19
- Browser↔browser and browser↔Cardputer testing confirmed the simplified flow reached Signal Toss and Round 1 normally.

---

## v0.3.2.1 — Cardputer connection-stability hotfix

### Compact Cardputer state

- Added capability-gated compact room-state transport for physical Cardputers.
- Cardputer clients no longer need to receive the large browser-oriented state envelope.
- Added `compact-state-v1`.

### Browser compatibility

- Browser and Cardputer Mock clients continue to receive the richer full-state representation required by the development UI.

### Stability

- Reduced WebSocket message size for Cardputer connections.
- Added reconnect / transport diagnostics.
- Hardened physical-device reconnect behavior.
- Addressed repeated disconnect/reconnect loops caused by sending browser-sized state to the embedded client.

---

## v0.3.2 — Canonical Demonym battle bridge

This was the major transition from the earlier browser test battle into a server implementation that could genuinely interoperate with Demonym firmware.

### Battle Rules v19

- Ported Demonym Battle Rules v19 into the Web Connect Worker.
- Server battle resolution became aligned with the firmware battle model.

### Canonical creature payload v2

- Replaced the earlier lightweight test payload with canonical creature payload v2.
- Added canonical creature identity / stats / move data suitable for real Cardputer creatures.
- Added validation for imported Cardputer creature payloads.

### Battle behavior

Added or aligned support for:

- canonical move resolution
- Recover
- Energy costs
- cooldowns
- Pressures
- statuses
- Adaptations / battle modifiers
- lineage-specific behavior
- move interactions and synergies

### Events

- Added top-level battle events so embedded clients do not need to parse the full browser state document simply to play battle feedback.
- Preserved the rolling browser event list for reconnect playback.

### Validation

- Cross-checked C++ and TypeScript battle behavior with golden vectors.
- Payload and battle-rule validation passed during the canonical bridge work.

---

## v0.3.1 — Reconnect race hotfix

### Connection generations

- Added per-socket connection generation IDs.
- Prevented an older/stale WebSocket close event from disconnecting a newer resumed connection.

### Refresh / resume

- Browser refresh remembers:
  - room
  - client type
  - session
- Refresh resumes the same:
  - player slot
  - round
  - lock state
  - active battle

### Expired sessions

- Expired sessions reset the interrupted battle cleanly.
- The remaining connected player can stay in the room.

---

## v0.3 — Session resume and battle-event playback

### Battle presentation lock

- Disabled battle move controls while server-authored battle events are actively playing out.
- Prevented the UI from accepting a new selection during move-resolution animation / playback.

### Resumable sessions

- Added opaque session tokens.
- Added `session-resume-v1`.
- Added a 60-second reconnect window.
- Added automatic browser reconnect behavior.
- Stored active-room session information in browser `sessionStorage`.
- Reconnecting preserves:
  - player slot
  - round
  - selected / locked action
  - match state

This was the first major pass where refreshing or briefly losing the browser connection no longer meant automatically losing the battle session.

---

## v0.2.9 — Demonym Connect protocol handshake

### Connection protocol

Added the Demonym Connect v1 handshake:

1. server sends `hello-required`
2. client sends `client-hello`
3. server validates the client
4. server responds with `hello-ack`

### Capability negotiation

- Added client type / version identification.
- Added capability negotiation.
- Added compatibility validation before battle messages are accepted.

### Cardputer Mock

- Added Cardputer Mock gating to the browser development harness.
- Device-specific creature import paths now require an appropriate Cardputer-style handshake.

This was the beginning of separating a generic browser battle client from a real embedded-client protocol.

---

## v0.2.8 — External / Cardputer creature payload testing

- Added an external creature import path.
- Added mock Cardputer payload generation.
- Added payload validation.
- Added source indicators showing whether a player is using a browser test creature or imported device creature.
- Preserved imported creatures when resetting for a rematch.
- Established the initial `demonym-battle-creature` payload concept that was later superseded by canonical payload v2.

---

## v0.2.7 — Versioned battle payloads and event stream

- Added versioned creature / battle payload handling.
- Added a server-authored battle event stream.
- Added more visible server-driven feedback to the browser UI.
- Began separating state from presentation so battle actions could be played back as discrete events instead of appearing only as a changed final state.

---

## v0.2.6 — Same-room rematch loop

- Added rematch support after a completed battle.
- Both players can agree to rematch without creating a new room.
- Reset battle state while keeping the room.
- Preserved player creature / lineage selections where appropriate.
- Added a new Signal Toss for the fresh match.
- Added a match counter.

---

## v0.2.5 — Permanent Recover action

- Promoted **Recover** into a normal fifth battle action.
- Recover:
  - costs 0 Energy
  - restores up to 2 Energy
  - consumes the player's action for the round
- Prevented low-Energy / disruption situations from turning into a deadlock.
- Added clearer round, lock, and resolution presentation.
- Exposed the recovery amount through server battle configuration.

Recover later became part of the canonical Web Connect / firmware battle rules.

---

## v0.2.4 — Round Lock

### Simultaneous move selection

- Changed the battle from simple turn ownership into a round-lock model.
- Both players select their moves without seeing the opponent's selection.
- A round resolves only after both players lock an action.

### Resolution order

- Added sequential resolution once both choices are locked.
- Added alternating priority behavior between rounds.

### Resource / status handling

- Added round-oriented status and Energy processing.
- Addressed battle states where Energy or Disruption could otherwise prevent meaningful progress.

This release established the basic multiplayer battle flow that remains recognizable in the current system.

---

## v0.2.3 — Lineage selection

- Added all eight Demonym lineages to the browser battle test:
  - Husk
  - Mire
  - Wisp
  - Fang
  - Choir
  - Machine
  - Cinder
  - Veil
- Added server-defined lineage presets.
- Added synchronized pre-battle lineage selection.
- Locked lineage choice once the player entered / readied for battle.
- Added signature-centered test loadouts for each lineage.

---

## v0.2.2 — Moveset foundation

- Replaced the very early placeholder battle actions with a broader move system.
- Added named moves and lineage-signature moves.
- Added the early versions of:
  - Pressures
  - statuses
  - damage
  - accuracy
  - healing
  - recoil
  - Energy
  - Ward
  - Evasion
- Expanded the server resolver so the battle could model more than simple fixed damage.

At this stage the numeric values were still Web Connect test values rather than the later canonical firmware rules.

---

## v0.2.1 — Signal Toss

- Added server-side randomized initiative.
- Added synchronized Signal Toss results.
- Displayed the winner in the battle UI and battle log.
- Reset initiative correctly when the match / connection state reset.

Signal Toss became the basis for deciding the initial canonical first fighter.

---

## v0.2 — First real multiplayer battle state

This release moved beyond the v0.1 networking proof-of-concept.

### Server-authoritative state

- Added a real server-owned battle state.
- Added player readiness.
- Added turn ownership.
- Added creature / move data.
- Added Energy.
- Added server-side action validation.
- Added battle logging.
- Added synchronized results to both connected players.

### Testing

- Tested desktop↔desktop multiplayer.
- Tested desktop↔phone multiplayer.
- Verified turn enforcement and synchronized battle state.

---

## v0.1 — Multiplayer foundation / proof of concept

This was the first working Demonym online multiplayer infrastructure.

### Infrastructure

- Created the public GitHub project.
- Connected GitHub deployment to Cloudflare.
- Added a static browser frontend.
- Added the Cloudflare Worker backend.
- Added a `BattleRoom` Durable Object.
- Added WebSocket multiplayer communication.
- Added generated room codes.
- Added basic room creation / joining.

### First successful test

- Confirmed two separate clients could join the same room and exchange synchronized state.
- Desktop↔phone testing verified the online architecture worked outside a single browser session.

### Project direction

The project began as **Demonym Web Battle**, but the scope quickly expanded into **Demonym Web Connect**.

The longer-term Connect direction includes:

- Battle
- Trade
- Chat
- player rankings
- multiplayer room discovery
- other connected Demonym features

---

## Current direction

The current Web Connect stack has moved through several distinct phases:

1. **v0.1** — prove multiplayer networking works
2. **v0.2.x** — build an actual browser multiplayer battle
3. **v0.3 / v0.3.1** — make sessions and reconnects robust
4. **v0.3.2.x** — bridge the browser battle to the real Cardputer / Battle Rules v19 implementation
5. **v0.3.2.4–v0.3.2.6** — bring native Cardputer presentation into the browser
6. **v0.3.2.7** — grow the battle page into the broader Demonym Connect site

Future work is expected to build outward from this foundation rather than replacing it.
