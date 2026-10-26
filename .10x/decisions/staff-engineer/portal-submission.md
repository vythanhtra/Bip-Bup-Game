# Staff Engineer: portal-submission

Patterns and standards for this sprint (2026-10-26):
- **Clock:** `gnow()` is defined once near the top of the main script; `PAUSE` object next to it. Replace `performance.now()` by script (sed) inside `src/game.html` only, then re-add the three allowed uses (gnow body, `A` analytics in analytics.js untouched, audio untouched). `build.js` fails the build if `performance.now()` appears in game.js outside `gnow`.
- **Pause overlay:** drawn by the loop when `PAUSE.on`; the loop still schedules rAF so resume is instant; input handlers return early while paused. Versus overlay (versus.js) uses no timers, nothing to do.
- **Input kind:** `INPUT.kind` lives next to `IN`/`PRESS` (same file section). `pointerdown` with `pointerType === 'touch'` → touch; `keydown` with a KEYMAP key → keys; `(pointer: coarse)` default. `setPad()` is the only function that toggles `#pad` visibility from kind + fight state; existing `$('pad').hidden = ...` sites call it.
- **HUD scale:** a CSS variable `--ui` = `clamp(13px, min(W,H)/32, 22px)` set in `resize()`; hud/bars/hints use it. Canvas text sizes that used `SC` for HUD-like text use `UI = min(W,H)/32` instead; sprite-anchored text keeps `SC`.
- **Background fit:** in `drawBgImage` (world.js): `wide = W / H > (im.width / im.height) * 1.15`; cache key `im.src + '|' + W + 'x' + H`; offscreen canvas holds the blurred, darkened extension; `bgMode()` hook returns the mode for tests.
- **Editions:** `imgBase` = `'../'.repeat(depth(OUT))` + `'img/'` where depth counts path segments below `public/`. Portal editions always `ART=1`, `LANG=en`. `tools/portal-zip.sh` is the only place that copies `img/`.
- **Ads:** `ADS` object in game.html near `PORTAL` use; the single seam is the result-screen continue handler and `endRun`. Watchdog 12 s. Emits `A.ev('ad', { x })`.
- **Events:** migration SQL in `supabase/migrations/0001_events.sql` (committed) and applied through the Supabase MCP; queries in `docs/analytics.md`.
- **Tests:** new `tests/f6test.js` (clock/pause, input kind, bg mode, ads throttle, portal edition load at 1280×720 with keys and 430×932 with touch). Every existing suite stays untouched except fixtures that reference `performance.now()` through hooks (`__bakhi.clock()`).
- **i18n:** key hint and paused text are three new keys in vi/en/zh.
