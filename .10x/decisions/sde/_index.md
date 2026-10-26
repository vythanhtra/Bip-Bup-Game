# SDE — index

[DISCOVERED] Shipped: see .10x/status.md "Built so far". Known tech debt: game.html main script is one 600-line closure; enemy attack directions are random (no per-enemy patterns); trailer bot (trailer/record4.js) cannot parry so trailer v4 predates Core 2; p2/p3 tests are legacy smoke scripts with weak assertions.


Active: portal-launch-sprint (see portal-launch-sprint.md)

- 2026-10-26 task 7: bubble word-wrap (wrapText, up to 3 lines), swipe hint clamped to screen, combo label moved below hero feet, HUD grid rows min-width:0 + title ellipsis + name ellipsis, tutorial shows a shield instead of 9 hearts, lose pose sits dazed with stars and retry text below the actors. p2/p3 tests updated to open the map via #btn-map2 (they assumed PLAY→map, broken since increment 1). All 11 suites green.

- 2026-10-26 tasks 8+10: src/assets.js (manifest-gated loader, actorKeys, sprite(pose) fallback chain), drawActor draws PNG when `a.key` resolves (height 19*SC, native facing, no flip), hero/enemy/referee callers pass key+pose, face() renders portrait into a 192x240 canvas with class img, drawBg uses img/bg/<world> cover-fit with the ground line at 78% of image height and edge colours sampled (try/catch for tainted canvases under file://), build.js emits CONFIG.img only when ART=1 so production stays on text sprites until the set is complete. img-src/ holds 200 px placeholders from Canva thumbnails; replace with full-res originals when available.

- 2026-10-26 task 12: `MOVES[enemy]` = { tel, feint, set:[{s:[{d,f,t,g}], call}] | phases:[set,set,set] }. planAttacks keeps the world profile (tel base, feint default, max length via pr.n+1) and picks a combo from the enemy set; steps resolve '?' dirs, forced feints, per-step telegraph (floor 420 ms) and gap multipliers; the first step carries `call`, shown as an enemy bubble + voice at wind-up (after the one-time parryTeach). LANG_EN/ZH.world.MOVE_CALLS override calls. Hook `__bakhi.plan(rnd)` for simulation; scratch sim over 60 rounds per enemy: patterns 3 (scarecrow, roast chicken: deliberately predictable) to 21 (fairy), feint 0 to 0.62.

- 2026-10-26 task 9: full base set generated via Canva (ids in docs/art-manifest.json). build.js: OUT_DIR env override; editions under public/ share public/img via CONFIG.imgBase='../img/'. public/preview = ART=1 edition for owner playtest; production config.img stays empty.

- 2026-10-26 poses: 38 attack/hurt sprites generated (image-to-image where the reference was fresh; Canva rejects references older than about an hour with SERVER_GENERIC, so heroes and the duck were done text-only from the style-guide DESC). 85 images, 2.1 MB after quantisation, under the 3 MB budget.

- 2026-10-26 owner feedback on /preview/: (1) title still drew text sprites -> drawTitle uses hero/referee/duck images when loaded; (2) fighters cut off at the right and too big -> image actors are 16*SC tall (was 19), anchors moved to 0.19W/0.63W in image mode, drawActor clamps the image inside the screen, ground line lowered to 0.76H so more scene shows, background covers the bottom (sky crops instead of a colour band); (3) static characters -> hero bounces on his toes and sways while waiting, enemy paces and bobs between attacks, enemy walks in from the right at the start (B.enemyEnt). 6 suites green.

- 2026-10-26 scenery (owner ask: let players admire the Vietnamese countryside and the other regions): world intro cinematic on first entry of each world (5.2 s camera drift from sky to stage, zoom 1.28 to 1, world name + subtitle card, fighters fade in, tap skips, save.seen['w'+id], opt.cine replays); drawAmbient per world (bamboo leaves + birds, fireflies, snow, embers, petals + cloud wisps) over the image stage in fights, cinematic, won/lost; camera breathes (zoom 1.5 percent, slow pan) in image mode; map world cards use their stage as a banner (ASSETS.url). 7 suites green.
