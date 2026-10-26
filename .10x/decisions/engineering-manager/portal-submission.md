# Engineering Manager: portal-submission

Ordered tasks (each ≤ half a day; 2-week window, submission day 14):
1. Game clock `gnow()` + `PAUSE` + visibility pause overlay + build guard; all 15 suites green. (day 1)
2. `__bakhi.pause/resume/clock` hooks + f6test part 1. (day 1)
3. Editions: relative `imgBase`, `public/portal/{crazygames,poki}` builds, `tools/portal-zip.sh`, deploy; QA links live. (day 2)
4. Input kind + `setPad()` + key hint (vi/en/zh) + f6test part 2. (day 2)
5. HUD scale via `--ui` and `UI` for canvas HUD text at 1280×720. (day 3)
6. Background height-fit + blurred side extension + `bgMode()` + screenshots at 1280×720 for all 5 worlds. (day 3)
7. Portal first minute: Play → tutorial/gate in portal edition; `first_beep`, `input_kind` events. (day 4)
8. Supabase: restore project, migration `events`, RLS, smoke insert from the deployed build, funnel queries in docs/analytics.md. (day 4, needs Owner approval of the migration)
9. `ADS.maybe` seam + `portal.js` onPause/onResume + watchdog + `ad` event; f6test part 3. (day 5)
10. Internal playtest link + instructions to Owner; collect 10 sessions. (day 5–8, Owner)
11. Tuning pass from playtest: gates 1–5 AI knobs, dash window, pre-jump; re-run suites. (day 9–10)
12. Listing assets: 16:9 and 9:16 screenshots (en), 30 s clip (en), descriptions; CrazyGames + Poki QA checklists re-read. (day 11–12)
13. Submit CrazyGames, then Poki; record submission ids in status. (day 13–14)

Risks: clock change regressions (mitigated by doing it first and alone); Supabase restore; portal SDK specifics (read docs in task 3); Owner availability for 8, 10, 13.
