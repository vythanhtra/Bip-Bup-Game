# Senior Engineer: portal-submission

Implementation notes per task:
1. Clock: `var PAUSE = { off: 0, on: false, at: 0, enter(){...}, leave(){...} }; function gnow(){ return performance.now() - PAUSE.off; }`. `loop(now)` ignores the rAF timestamp and uses `gnow()`. `visibilitychange` → enter on hidden; leave on the next user gesture (tap/key) so the player sees the paused overlay instead of being hit on return. Fight-only: outside `B.fight` keep the same clock (harmless).
3. build.js: `const depth = OUT.split('/').length - 1` when `OUT.startsWith('public/')`; portal builds: `ART=1 OUT_DIR=public/portal/crazygames node build.js https://ba-khi.vercel.app/portal/crazygames/ en crazygames`.
4. `INPUT.kind`: initial `matchMedia('(pointer: coarse)').matches ? 'touch' : 'keys'`; update on events; `setPad()` = `$('pad').hidden = !(B && B.fight && !B.over && INPUT.kind === 'touch' && padWanted)`. Key hint drawn in the canvas hint slot (reuse `padHint` slot) for `kind === 'keys'` during the first 2 rounds of a session.
6. Background: `fitBg(im, W, H, gy)` returns `{ k, x0, y0, side }`; side canvas = `W × H`, draw image scaled ×1.6 centred, `filter = 'blur(12px) brightness(.55)'`, then draw the sharp height-fit image on top; parallax translate applies only to the sharp layer (side layer drawn before the camera translate).
9. `ADS.maybe(done)`: guard `PORTAL.on`, `gnow() - ADS.last >= 180000`, `B.n >= 1`, `!B.vs`; `AUDIO.mute(true)`; `PAUSE.enter()`; `PORTAL.adBreak(cb)`; watchdog `setTimeout(cb, 12000)` once-guarded; `cb` → `PAUSE.leave(); AUDIO.mute(false); done()`.
