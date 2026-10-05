# Demonym-Web-Battle

Online Connect interface and multiplayer backend for Demonym (cardputer adv virtual pet)

[![Latest Demonym Release](https://img.shields.io/github/v/release/eyeofbri/Demonym?label=Latest%20Demonym%20Release&logo=github)](https://github.com/eyeofbri/Demonym/releases/latest)

[![View Demonym on GitHub](https://img.shields.io/badge/View-Demonym%20on%20GitHub-181717?logo=github&logoColor=white)](https://github.com/eyeofbri/Demonym)

[![Open DEMONYM Connect](https://img.shields.io/badge/Open-DEMONYM%20Connect-075f5b?logo=cloudflare&logoColor=white)](https://demonym-web-connect.eyeofbri.workers.dev/)

**DEMONYM Connect** is the online interface and multiplayer backend for **Demonym**, my virtual-pet / creature game for the M5Stack Cardputer ADV.

It started as a browser battle experiment and has grown into a wider Connect project for browser-to-browser and Cardputer-to-browser battles, project updates, future rankings, and other multiplayer features. The web side is meant to extend the physical Cardputer game rather than replace it.

## How to connect and play

### Browser vs. browser

1. Open **[DEMONYM Connect](https://demonym-web-connect.eyeofbri.workers.dev/)**.
2. Go to **Connect**.
3. One player selects **Create Battle**.
4. Share the six-character Battle Code.
5. The second player enters the code and selects **Join Battle**.
6. Once both players are connected, choose moves and battle normally.

### Cardputer vs. browser

1. Create a battle from the **Connect** page.
2. Open Web Battle / Connect on a supported Demonym firmware build.
3. Enter the Battle Code on the Cardputer.
4. The Cardputer sends its creature into the room and joins the same server-authoritative battle as the browser.
5. Choose moves on either device and continue until the battle ends.

Reconnect and session-resume support allows short disconnects or refreshes to return to the same active match.

## Download Demonym

- **[Latest GitHub Release](https://github.com/eyeofbri/Demonym/releases/latest)**
- **[Demonym on M5Burner](https://burner.m5stack.com/ZC9Q4U)**

## Local development

Install dependencies:

```bash
npm install
```

Run a local development server:

```bash
npm run dev
```

Deploy:

```bash
npm run deploy
```

## What's coming

The longer-term direction for DEMONYM Connect includes:

- ranked battles and a Ladder / Boards system
- player ratings and match history
- public / named matches and room discovery
- trading
- lightweight chat
- additional Cardputer-to-web features
- continued battle UI, animation, and creature-visual improvements

## Changelog

See **[CHANGELOG.md](CHANGELOG.md)** for the full development history.

## Links

- [DEMONYM Connect](https://demonym-web-connect.eyeofbri.workers.dev/)
- [Demonym Web Connect on GitHub](https://github.com/eyeofbri/Demonym-Web-Connect/)
- [Demonym on GitHub](https://github.com/eyeofbri/Demonym)
- [GitHub / eyeofbri](https://github.com/eyeofbri)
- [Reddit / eyeofbri](https://www.reddit.com/user/eyeofbri/)
- [Instagram / eye_of_bri](https://www.instagram.com/eye_of_bri/)
- [Buy Me a Coffee](https://buymeacoffee.com/eyeofbri)
