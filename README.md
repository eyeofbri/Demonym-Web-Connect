# Demonym-Web-Battle

Online Connect interface and multiplayer backend for Demonym (cardputer adv virtual pet)

[![Latest Demonym Release](https://img.shields.io/github/v/release/eyeofbri/Demonym?label=Latest%20Demonym%20Release&logo=github)](https://github.com/eyeofbri/Demonym/releases/latest)

[![View Demonym on GitHub](https://img.shields.io/badge/View-Demonym%20on%20GitHub-181717?logo=github&logoColor=white)](https://github.com/eyeofbri/Demonym)

---

## Demonym Connect

**Demonym Connect** is the web interface and multiplayer backend for **Demonym**, my virtual-pet / creature game for the M5Stack Cardputer ADV.

The goal is to let a physical Cardputer connect to a browser, another browser, and eventually other players through a shared online Connect system without turning the browser into a completely separate version of the game.

The project started as a small proof-of-concept for online battles and has grown into the beginning of a wider Connect site for battles, player rankings, updates, downloads, and future multiplayer features.

### Open the live site

**[demonym-web-connect.eyeofbri.workers.dev](https://demonym-web-connect.eyeofbri.workers.dev/)**

The site is deployed as a Cloudflare Worker with Durable Objects handling multiplayer battle rooms and WebSocket state.

---

## How to play

### Browser vs. browser

1. Open the **[Demonym Connect site](https://demonym-web-connect.eyeofbri.workers.dev/)**.
2. Open **Connect**.
3. One player selects **Create Battle**.
4. Share the six-character Battle Code with the second player.
5. The second player enters the code and selects **Join Battle**.
6. Once both players are established, the server performs a **Signal Toss** to determine the first battle priority.
7. Pick a move and lock it in.
8. When both players have chosen, the server resolves the round and sends the result to both players.
9. Continue until one creature wins.

The browser battle uses the same server-authoritative rules for both players. Refreshing or briefly losing the connection should resume the same session during the reconnect window instead of immediately destroying the match.

### Cardputer vs. browser

A supported Demonym firmware build can join a browser-created room directly from the Cardputer.

1. Create a battle from the **Connect** page.
2. Open Web Battle / Connect on the Cardputer.
3. Enter the Battle Code shown in the browser.
4. The Cardputer sends its canonical Demonym creature data to the room.
5. Once the creature is accepted, the Cardputer joins the battle as the second player.
6. Moves chosen on the Cardputer are sent to the same server-authoritative battle used by the browser.
7. Battle events, HP, Energy, statuses, turns, and reconnect state stay synchronized between both sides.

Current builds can also send a native Cardputer-generated creature visual to the browser so the web battle can display the actual Demonym sprite rather than only a browser approximation.

---

## Battle basics

Demonym Web Connect currently follows the same general battle model used by the main game:

- each creature has a moveset
- moves consume Energy
- moves can apply damage, healing, statuses, pressure effects, cooldowns, and other battle behavior
- both players choose their action before the round resolves
- battle resolution is authoritative on the server
- **Recover** is always available as a zero-cost action and restores up to 2 Energy
- Signal Toss determines the initial battle priority
- later rounds alternate resolution priority according to the battle rules
- completed matches can be rematched without creating a completely new room

The current Web Connect battle implementation is based on **Battle Rules v19**.

---

## Connect site

The web project is becoming more than a single battle screen.

Current sections include:

- **Home** — entry point for the Connect site
- **Connect** — create or join a battle
- **News** — lightweight project posts stored in the repository
- **Ladder** — placeholder for future rankings and competitive records
- **About** — information about Demonym, the project, and me
- **Support** — downloads, feedback, issue reporting, and support links
- **Settings** — theme and interface options

The site includes both a simpler interface style and a more detailed **Sharp** theme inspired by older game-network interfaces, Metalheart / Depthcore design, mechanical UI panels, schematic details, and early-2000s sci-fi software.

---

## News posts

News posts live in:

```text
public/news/
```

Posts can be simple `.md` or `.txt` files.

Markdown posts can use basic formatting such as headings, lists, links, emphasis, and inline code. The News page reads the files from the public GitHub repository and sorts them by their latest commit date, newest first.

Files whose names begin with `_` are ignored by the News feed, so files such as `_README.md` can be used for notes or instructions.

---

## Downloads

### Latest Demonym firmware

**[Download the latest Demonym release on GitHub](https://github.com/eyeofbri/Demonym/releases/latest)**

### M5Burner

**[Open Demonym in M5Burner](https://burner.m5stack.com/ZC9Q4U)**

---

## Development

The Web Connect project currently uses:

- Cloudflare Workers
- Cloudflare Durable Objects
- WebSockets
- TypeScript
- browser JavaScript / HTML / CSS
- server-authoritative battle resolution
- canonical Demonym creature payloads
- Cardputer session resume and reconnect support
- compact Cardputer-specific room-state messages
- native Cardputer sprite transfer

The public Web Connect repository is:

**[github.com/eyeofbri/Demonym-Web-Connect](https://github.com/eyeofbri/Demonym-Web-Connect/)**

The public Demonym repository is:

**[github.com/eyeofbri/Demonym](https://github.com/eyeofbri/Demonym)**

---

## Local development

Install dependencies:

```bash
npm install
```

Start the local Cloudflare development server:

```bash
npm run dev
```

Wrangler will print the local address, normally something similar to:

```text
http://localhost:8787
```

Deploy the Worker:

```bash
npm run deploy
```

---

## Routing note

Demonym Connect uses client-side routes such as:

```text
/connect
/about
/news
/ladder
/support
/settings
```

For Cloudflare Workers Static Assets, the project should use SPA fallback handling in `wrangler.toml` / `wrangler.jsonc` rather than a catch-all `_redirects` rule that points back to `/index.html`.

For example:

```toml
[assets]
directory = "./public"
not_found_handling = "single-page-application"
```

Keep the existing asset directory from your project if it is different from `./public`.

---

## What's next

Demonym Connect is still experimental, but the longer-term direction includes:

- player accounts / persistent identities
- ranked battles
- a proper Ladder / Boards system
- ratings and match history
- unlockable competitive options
- named public matches or a room browser
- trading between players
- lightweight player chat
- better Cardputer/browser visual parity
- continued native battle animations and UI polish
- additional Connect features beyond battles

The goal is not to replace the Cardputer version of Demonym. The web side is meant to extend it: a place where the physical game can connect outward to other players, devices, and future systems.

---

## Changelog

A detailed development history is available in **[CHANGELOG.md](CHANGELOG.md)**.

---

## Links

- [Demonym Connect](https://demonym-web-connect.eyeofbri.workers.dev/)
- [Demonym Web Connect on GitHub](https://github.com/eyeofbri/Demonym-Web-Connect/)
- [Demonym on GitHub](https://github.com/eyeofbri/Demonym)
- [Latest Demonym Release](https://github.com/eyeofbri/Demonym/releases/latest)
- [M5Burner](https://burner.m5stack.com/ZC9Q4U)
- [GitHub / eyeofbri](https://github.com/eyeofbri)
- [Reddit / eyeofbri](https://www.reddit.com/user/eyeofbri/)
- [Instagram / eye_of_bri](https://www.instagram.com/eye_of_bri/)
- [Buy Me a Coffee](https://buymeacoffee.com/eyeofbri)
