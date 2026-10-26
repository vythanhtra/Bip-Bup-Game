# SDE — index

[DISCOVERED] Shipped: see .10x/status.md "Built so far". Known tech debt: game.html main script is one 600-line closure; enemy attack directions are random (no per-enemy patterns); trailer bot (trailer/record4.js) cannot parry so trailer v4 predates Core 2; p2/p3 tests are legacy smoke scripts with weak assertions.


Active: portal-launch-sprint (see portal-launch-sprint.md)

- 2026-10-26 task 7: bubble word-wrap (wrapText, up to 3 lines), swipe hint clamped to screen, combo label moved below hero feet, HUD grid rows min-width:0 + title ellipsis + name ellipsis, tutorial shows a shield instead of 9 hearts, lose pose sits dazed with stars and retry text below the actors. p2/p3 tests updated to open the map via #btn-map2 (they assumed PLAY→map, broken since increment 1). All 11 suites green.
