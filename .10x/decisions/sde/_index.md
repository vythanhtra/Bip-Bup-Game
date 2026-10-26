# SDE — index

[DISCOVERED] Shipped: see .10x/status.md "Built so far". Known tech debt: game.html main script is one 600-line closure; enemy attack directions are random (no per-enemy patterns); trailer bot (trailer/record4.js) cannot parry so trailer v4 predates Core 2; p2/p3 tests are legacy smoke scripts with weak assertions.


Active: portal-launch-sprint (see portal-launch-sprint.md)

- 2026-10-26 task 7: bubble word-wrap (wrapText, up to 3 lines), swipe hint clamped to screen, combo label moved below hero feet, HUD grid rows min-width:0 + title ellipsis + name ellipsis, tutorial shows a shield instead of 9 hearts, lose pose sits dazed with stars and retry text below the actors. p2/p3 tests updated to open the map via #btn-map2 (they assumed PLAY→map, broken since increment 1). All 11 suites green.

- 2026-10-26 tasks 8+10: src/assets.js (manifest-gated loader, actorKeys, sprite(pose) fallback chain), drawActor draws PNG when `a.key` resolves (height 19*SC, native facing, no flip), hero/enemy/referee callers pass key+pose, face() renders portrait into a 192x240 canvas with class img, drawBg uses img/bg/<world> cover-fit with the ground line at 78% of image height and edge colours sampled (try/catch for tainted canvases under file://), build.js emits CONFIG.img only when ART=1 so production stays on text sprites until the set is complete. img-src/ holds 200 px placeholders from Canva thumbnails; replace with full-res originals when available.

- 2026-10-26 task 12: `MOVES[enemy]` = { tel, feint, set:[{s:[{d,f,t,g}], call}] | phases:[set,set,set] }. planAttacks keeps the world profile (tel base, feint default, max length via pr.n+1) and picks a combo from the enemy set; steps resolve '?' dirs, forced feints, per-step telegraph (floor 420 ms) and gap multipliers; the first step carries `call`, shown as an enemy bubble + voice at wind-up (after the one-time parryTeach). LANG_EN/ZH.world.MOVE_CALLS override calls. Hook `__bakhi.plan(rnd)` for simulation; scratch sim over 60 rounds per enemy: patterns 3 (scarecrow, roast chicken: deliberately predictable) to 21 (fairy), feint 0 to 0.62.
