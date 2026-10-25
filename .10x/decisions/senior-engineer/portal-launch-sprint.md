# Senior Engineer: portal-launch-sprint — implementation notes

- Analytics: `A.ev` builds `{sid,d,ev,g,ms,x,lang,v,t}`; batch up to 10 or flush on visibilitychange/pagehide with sendBeacon (`Content-Type: application/json`, `apikey` header cannot be set on sendBeacon → use fetch keepalive with headers; sendBeacon only as last resort to a URL that carries `apikey` as query param). Supabase REST accepts `?apikey=` query param.
- Tutorial gate: reuse planAttacks by injecting `B.atks` directly after scheduleRound when `B.tut0`; set `B.forgiveAtk = 2`; in tickAttacks, a landed attack while `B.forgiveAtk > 0` shows "lần đầu tha" instead of hurt.
- Straight-into-play: `$('btn-play')` → `startGate(save.unlocked)` unless `!save.seen.t0` → `startTutorial()`. Keep map button on result and quit screens.
- Portal: build emits `public-portal/`; `portal.js` exposes `PORTAL.gameplayStart/Stop/loadingStop/adBreak` and detects `window.CrazyGames` or `window.PokiSDK` when present.
