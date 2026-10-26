# Architect: portal-submission

**Status:** Accepted by Owner 2026-10-26 · **Feature:** portal-submission (PM file: `.10x/decisions/product-manager/portal-submission.md`) · **ADRs:** 006 (pausable game clock), 007 (presentation by input kind and aspect, not by device)

## Requirements (from PM, verified against code)
Functional: portal edition for CrazyGames and Poki (SDK events, one ad break after a result, no outbound links), desktop keyboard play in a 16:9 iframe with the pad hidden and a key hint, phone portrait unchanged, Play → first fight in ≤ 10 s with the prologue optional, funnel events readable in Supabase (`first_beep`, `input_kind` added; `gate_clear`/`gate_lose` already emitted), game pauses correctly when the tab is hidden or an ad plays.
Non-functional: zero new runtime dependencies, payload stays ≈ 3.4 MB, no new failure mode can stop a fight (SDK missing, Supabase down, ad fails → game continues), everything testable through `window.__bakhi` with Playwright at 1280×720 and 430×932.

## Landscape (what exists)
- `build.js <url> <lang> <portal>` already emits a portal variant with `CONFIG.portal`, loads the portal SDK script, `portal.js` wraps init / gameplayStart / gameplayStop / happytime / adBreak with no-ops. `adBreak` is never called. The portal edition does not ship the art set (`ART=1` and `OUT_DIR` under `public/` compute `imgBase` as one fixed level).
- `analytics.js` posts to Supabase REST (ADR-001); the `events` table was never created. Event row: sid, d, ev, lang, v, portal, secs, g, ms, x.
- Fight engine (ADR-005 + increments 2–5) keys every timer off `performance.now()` (53 call sites in game.html). `requestAnimationFrame` stops while hidden, so on return the round clock has lost the hidden time and timed states (hitstun, AI next, round end) resolve at once. Audio already suspends on hidden.
- Resize: `SC` from min(W/64, H/84), ground `GY` clamped above the 150 px pad. At 1280×720 the fight engine and camera work (arena 1664 px); the pad still shows, HUD text is phone-sized, the 9:16 background is cover-cropped to a blurred strip.
- Vercel serves `public/` statically from git (`outputDirectory: public`, no build step). Portals take either a zip upload (CrazyGames, Poki) or a hosted URL for QA.

## Architectures considered
**1. One source, editions by build, presentation by input and aspect (recommended).** No device detection. Layout decisions come from two runtime signals: input kind (touch vs keyboard/mouse, observed from events) and aspect ratio (W/H). Portal differences stay in `portal.js` + `CONFIG.portal`. Time goes through one game clock that can pause. Ads are a call at one seam (the result screen's continue action).
**2. Desktop mode as a separate layout state.** A `MODE = 'desktop' | 'phone'` chosen at load with distinct HUD, pad, arena constants and a landscape stage set. More freedom for a desktop look, but two layout code paths to keep green, and a wrong guess (touch laptop, phone in landscape) is stuck. Rejected: double the UI surface for a 2-week window.
**3. Minimal: letterbox + no pause clock.** Force a 9:16 box inside the 16:9 iframe, keep timers as they are. Fastest, but portals and players see black bars on 60–70 % of sessions, and hidden-tab/ad returns still break rounds (Poki QA tests exactly this). Rejected.

## Decision: architecture 1

### Components and boundaries
1. **Editions (build.js).** `public/` (vi, text sprites), `public/preview/` (art, vi), new `public/portal/crazygames/` and `public/portal/poki/` (art, en, SDK). `imgBase` becomes relative to the edition's depth (`'../'.repeat(depth) + 'img/'`), so all editions under `public/` share one `public/img`. A script `tools/portal-zip.sh <portal>` copies the edition plus `img/` into a self-contained zip for upload (zip is a build artifact, not committed). Vercel keeps serving `public/` from git; QA links are `https://ba-khi.vercel.app/portal/<portal>/`.
2. **Portal adapter (`portal.js`).** Unchanged contract (`init, gameplayStart, gameplayStop, happy, adBreak(done)`), plus `onPause(fn)`/`onResume(fn)` so SDK-driven pauses (Poki ad, CrazyGames ad) and tab visibility reach the engine through one path. Failure mode: any SDK error is swallowed and `done` is always called, so an ad failure never blocks the next gate.
3. **Game clock (ADR-006).** `function gnow(){ return performance.now() - PAUSE.off; }` replaces `performance.now()` inside the engine; `PAUSE.enter()` stores the wall time, `PAUSE.leave()` adds the hidden duration to `PAUSE.off`. The frame loop's `now` argument becomes `gnow()`. Sources of pause: `visibilitychange` hidden, portal `adBreak` start, (later) a pause button. During pause the loop draws a "Paused, tap or press any key" overlay and reads no input. Analytics keeps wall time (its `secs` is session length). Audio keeps its own suspend on hidden.
4. **Presentation (ADR-007).** `INPUT.kind` ∈ {touch, keys} set from the first `pointerdown` (pointerType) / `keydown`; default from `matchMedia('(pointer: coarse)')`. Pad visible only when `kind === 'touch'`; a one-line key hint ("← → move · ↑ jump · Z punch · X heavy · C block · V special", localized) shows for keys during the first two rounds. HUD font and bar sizes scale with `min(W, H)` instead of `SC`. Background: if the frame is wider than the image aspect × 1.15, fit the image to the ground height (so the painted scene stays sharp and centred, parallax still applies) and fill the sides from an offscreen copy of the same image scaled up ×1.6, blurred (`ctx.filter: blur(12px)`, cached per image and size; fallback: flat colour from the image's edge pixels where `filter` is unsupported). No new art.
5. **First minute.** In the portal edition `btn-play` goes to the tutorial (first visit) or the next gate; the prologue stays behind the Story button. Public editions keep today's behaviour. `first_beep` is emitted once per session at the first real BEEP; `input_kind` once at the first gate start.
6. **Ad seam.** One call site: the result screen's continue action (next gate / retry / map) and the end of a run. `ADS.maybe(done)`: if `PORTAL.on` and `gnow() - lastAd ≥ 180 000` and the gate just finished is ≥ 1, call `PORTAL.adBreak` (mute + pause around it) and record the time; otherwise `done()` immediately. Never on the first result of a session, never during versus.
7. **Events table (ADR-001 reused).** Migration `events(id bigserial, at timestamptz default now(), sid text, d text, ev text, lang text, v text, portal text, secs int, g int, ms int, x text)`, RLS: anon INSERT only. Funnel queries documented in `docs/analytics.md`. New events: `first_beep` (ms = time since load), `input_kind` (x = touch|keys), `ad` (x = shown|skipped|error).

### Data flow
Load → `PORTAL.init` → title → Play → (`gate_start`, `gameplayStart`) → fight on `gnow()` → result (`gate_clear`/`gate_lose`, `gameplayStop`, `happy` on boss) → continue → `ADS.maybe` → next. Hidden tab or ad → `PAUSE.enter` → overlay → visible/ad done → `PAUSE.leave` → timers continue where they stopped.

### Failure modes
| Failure | Behaviour |
|---|---|
| SDK script blocked / absent | `portal.js` no-ops; game identical to public edition minus share links |
| Ad errors or never resolves | `adBreak` resolves `done` on error; a 12 s watchdog resolves it anyway and unpauses |
| Supabase paused / 4xx | fetch errors swallowed; nothing queued beyond 50 rows |
| `ctx.filter` unsupported (old Safari) | side fill uses edge colours; image still height-fit |
| Touch laptop | first input wins; a later touch re-shows the pad, a later key hides it |
| Hidden during countdown | `tSig`, `readyAt` are on the game clock, so the round still starts after the same wait |

### Migration path (no big bang)
1. `gnow()` + `PAUSE` with visibility only; all 14 suites must stay green before anything else lands (the clock change touches every timer).
2. Portal editions + relative `imgBase` + zip script; QA link live by day 3.
3. Input kind + pad/hint + HUD scale; then background treatment.
4. Ad seam + events table + new events; first-minute change for the portal edition.
5. Listing assets, submission.

### Testing contract additions (`window.__bakhi`)
`pause()`, `resume()`, `clock()` → `gnow()`, `input(kind)`, `ads.last`, `bgMode()` → 'cover' | 'fit'. Playwright runs at 1280×720 (keys) and 430×932 (touch) for the portal edition.

### Explicitly out of scope
New art, landscape phone layout, run mode on the fight engine, leaderboard, rewarded ads, Vercel build pipeline changes.
