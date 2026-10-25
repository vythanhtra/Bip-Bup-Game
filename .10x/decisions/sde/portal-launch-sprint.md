# SDE: portal-launch-sprint — increment 1

Built (commit after this file):
- src/analytics.js: queue + fetch keepalive to Supabase REST, lazy CONFIG, 30-s heartbeat, flush on hide. Hooks in game.html: load, play, gate_start, gate_clear, gate_lose (with last hurt kind), quit, run_end, share (text/link/fb).
- src/portal.js: adapter for CrazyGames SDK v3 / Poki SDK, no-ops otherwise. Calls: init, gameplayStart (startGate), gameplayStop (result/quit), happy (boss KO), adBreak (unused yet).
- build.js: `node build.js <url> [lang] [crazygames|poki]` → public/ or public-portal/ plus generated config.js (analytics URL/key, portal, version=git sha).
- Straight-into-play: PLAY → tutorial on first visit, else next unlocked gate; map via new title button, quit and result.
- Tutorial gate 0: synthetic gate (Grass Guard Trainee, 34 hp), scripted steps parry → feint → beep, every mistake forgiven, finishes into gate 1; `save.seen.t0`.
- Portal edition hides Facebook button, language bar and picker; language fixed at build.
Deviations: analytics key baked in build.js (public anon key by design). Tech debt: public-portal/ committed as an artifact; no automated deploy for it yet.
Tests: tests/p8test.js (11 checks) + all previous suites green. Console shows failed POSTs in the sandbox (no network) — expected.
