# Demonym-Web-Battle

Online Connect interface and multiplayer backend for Demonym (cardputer adv virtual pet)

[![Latest Demonym Release](https://img.shields.io/github/v/release/eyeofbri/Demonym?label=Latest%20Demonym%20Release&logo=github)](https://github.com/eyeofbri/Demonym/releases/latest)

[![View Demonym on GitHub](https://img.shields.io/badge/View-Demonym%20on%20GitHub-181717?logo=github&logoColor=white)](https://github.com/eyeofbri/Demonym)


## Session lifecycle (v0.3.2.5)

Cleanup is server-owned through Durable Object alarms. The existing 60-second player reconnect grace remains unchanged. An empty unfinished room is retained for 15 minutes; an empty completed room is retained for 5 minutes. A 24-hour inactivity deadline is maintained as a safety net. When cleanup expires, persisted room/session state is deleted and any remaining sockets are closed.

The browser displays the current session-cleanup state below the battle status. Closing a browser, losing power, or abandoning a Cardputer session does not require that client to return for cleanup to occur.
