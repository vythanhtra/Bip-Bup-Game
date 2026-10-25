# Staff Engineer: portal-launch-sprint

- Keep ES5 style; analytics.js and portal.js are classic scripts loaded before game.js; build.js copies them and bakes constants (`ANALYTICS_URL`, `ANALYTICS_KEY`, `PORTAL`) as a tiny generated `config.js` (not inline script, to keep the no-inline-script assertion).
- All new UI text through T(); add vi/en/zh keys together.
- Tests: extend tests/ with p8test.js (tutorial flow, play-into-gate, analytics queue captured via page.route to the Supabase URL). Keep ?lang=vi in tests to skip the picker.
- Do not touch trailer tooling in this sprint except the bot's `setAtk` (already present).
