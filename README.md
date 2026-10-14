# Demonym Web Connect v0.3.3.0 device-first patch

This patch makes Cardputer-to-Cardputer the primary multiplayer path while keeping browser participants compatible for development/testing.

Changes:
- server metadata now identifies Cardputer as the primary participant
- accepts `device-first-v1` / `state-sync-v1` capabilities
- supports `state-request` for authoritative lock recovery
- completed-match `leave` closes the room for both devices with `room-closed` instead of creating a reconnect state
- browser battle participation remains available as optional dev/test compatibility
