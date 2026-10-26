# Architect: portal-launch-sprint (increment 1)

Components added, all client-side unless noted:
1. **analytics.js** — `A.ev(name, data)` queue + sendBeacon to Supabase REST (ADR-001). Called from game.html at: load, play, startGate (gate_start), endBattle (gate_clear/gate_lose with ms, hearts, round), startRun, startDaily, share/link buttons, heartbeat timer. Never throws; disabled when no URL baked.
2. **Straight-into-play** — title PLAY starts the next unlocked gate (or gate 0 on first visit); map reachable from result/quit. Challenge/daily links unchanged.
3. **Tutorial gate 0** — synthetic gate object (no world data change): Grass Guard with 25 hp, scripted sequence: slow attack (tel 1200 ms, arrow + hand hint), then feint, then beep; attacks forgiven twice; cannot lose. Marks `save.seen.t0`. Uses existing startGate(opt.gate) path.
4. **Portal variant** — build flag + `portal.js` adapter (ADR-002).
5. **Per-enemy move sets (increment 2)** — ENEMIES[k].moves: array of patterns `{dirs:[...], tel, feintAt, gapMs}`; planAttacks picks from the enemy's set instead of random dirs. Data-only change in world.js plus 10 lines in planAttacks.
6. **Near-miss feedback (increment 2)** — on lose: show enemy hp left and the player's best ms; on early/fooled: ms off. Collection v1: `save.cards[enemyKey] = {beat, fooledBy, bestMs}` rendered on the map screen.

Boundaries: analytics never reads game state directly, only receives explicit calls. Tutorial is a gate object, not a new state machine. Failure modes: analytics endpoint down → silent; Supabase re-paused → silent; portal SDK missing → no-op adapter.


## 2026-10-26 — Art pipeline (ADR-003)
- New module `src/assets.js`: `ASSETS.need(keys)` returns a promise; cache by key; `ASSETS.img(key)` returns HTMLImageElement or null.
- `drawActor(key, x, y, scale, flip, swap, anim)` keeps its signature; internally `if (ASSETS.img(key)) drawImageActor(...) else drawTextActor(...)`.
- Palette variants (`GATE_META[n].v`) map to `{hue, sat, tint}`; applied with `ctx.filter` where supported, else skipped (variant falls back to base look).
- Backgrounds: `drawBg(world)` draws `img/bg/<world>.png` cover-fit, parallax of 2 layers reserved for later; existing procedural bg kept as fallback.
- Portrait dialog: `#dlg` gets a 128 css px portrait slot on the right, name plate below; text wraps in the remaining width (fixes bubble overflow class of bugs).
- Build: `build.js` copies `public/img` into `public-portal/img`; `img-src/` holds originals, `tools/art-build.py` does keying, trim, resize, pngquant.
