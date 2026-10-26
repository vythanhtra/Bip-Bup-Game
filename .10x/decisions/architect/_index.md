# Architect — index

[DISCOVERED] Structure: src/game.html (UI + main loop + state machine B), src/world.js (data: heroes, enemies, gates, dialog, taunts, backgrounds), src/story2.js (per-gate meta, banter), src/audio.js (mixer, SFX, voice blips, music), src/sprites.js, src/i18n.js (+ src/lang/*), src/versus.js (self-contained 2-player overlay). build.js inlines/splits into public/. State: one battle object B with states dialog/ready/wait/count/fakesig/go/hit/hurt/won/lost/end; attacks planned per round (B.atks). Save in localStorage (bakhi.save, bakhi.lang). Challenge links in URL hash (#c<gate>-<ms>, #d<yyyymmdd>-<ms>). Determinism for daily via mulberry32 seeded RNG used only for mechanic decisions.
[DISCOVERED] Boundaries worth keeping: data (world/story/lang) vs engine (game.html) vs audio; test hooks window.__bakhi are the contract for Playwright tests and the trailer bot.


Active: portal-submission (see portal-submission.md; supersedes portal-launch-sprint)

Principles added 2026-10-26: (1) time inside the engine goes through `gnow()`, never `performance.now()` (ADR-006); (2) presentation is decided by input kind and aspect ratio at runtime, never by device sniffing (ADR-007); (3) editions are build outputs of one source; portal differences live in `portal.js` and `CONFIG.portal` only (ADR-002).

- ADR-003 (2026-10-26): AI-generated PNG art assets with loader + text-sprite fallback. Architecture changes from single-file/no-assets to assets-with-fallback.
