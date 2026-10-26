const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage(); await p.addInitScript(function(){ window.__FIGHT_OFF = 1; }); /* legacy reflex engine (daily/run) */ const errs = []; globalThis.__p = p; globalThis.__errs = errs;
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  p.on('load', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {})); p.on('framenavigated', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {}));
  await p.goto('file://' + __dirname + '/../public/index.html?lang=vi');
  const has = false; // always test the source file, public/ may carry an older build
  if (!has) { await p.addScriptTag({ path: '/home/user/ba-khi/src/versus.js' }); console.log('injected versus.js'); }
  await p.evaluate(() => { window.__vslog = []; VERSUS.start(); });
  const st = () => p.evaluate(() => { const S = __vs.get(); return { state: S.state, wins: S.wins.slice(1), round: S.round, label: S.label, winner: S.winner, ms: [S.ms[1], S.ms[2]] }; });
  const waitState = (s, t = 8000) => p.waitForFunction(s => __vs.get().state === s, s, { timeout: t, polling: 16 });
  // ready: both hold 600ms via real touches (top half = P2, bottom half = P1)
  await p.evaluate(() => { __vs.hold(1, true); __vs.hold(2, true); });
  await waitState('count'); await p.evaluate(() => { __vs.hold(1, false); __vs.hold(2, false); });
  await waitState('wait'); console.log('match started', await st());
  const log = [];
  await sleep(300); await p.screenshot({ path: '/tmp/claude-0/-home-user/958197c9-f6a7-5ac6-a683-6c384b085848/scratchpad/vs_wait.png' });
  // round 1: real signal, P1 taps first (120ms), P2 later (300ms) -> P1 wins with both ms shown
  await p.evaluate(() => __vs.fake(false)); await p.evaluate(() => __vs.signal()); await sleep(120); await p.evaluate(() => __vs.tap(1)); await sleep(180); await p.evaluate(() => __vs.tap(2));
  await waitState('result'); log.push(await st()); await p.screenshot({ path: '/tmp/claude-0/-home-user/958197c9-f6a7-5ac6-a683-6c384b085848/scratchpad/vs_shot.png' });
  await waitState('wait', 4000);
  // round 2: P1 taps early during wait -> P2 wins (1-1); also arm a forced fake for round 3
  await p.evaluate(() => __vs.fake(true)); await sleep(400); await p.evaluate(() => __vs.tap(1)); await waitState('result'); const r2 = await st(); log.push(r2);
  if (!/SỚM/.test(r2.label) || r2.winner !== 2) throw new Error('early tap should be lost by P1: ' + JSON.stringify(r2));
  await waitState('wait', 4000);
  // round 3: forced fake, P2 taps during the fake -> P1 wins (2-1)
  await p.evaluate(() => __vs.signal()); await sleep(100); let s1 = await st(); console.log('forced round state:', s1.state);
  if (s1.state !== 'fakesig') throw new Error('expected forced fake round');
  await p.evaluate(() => __vs.tap(2)); await waitState('result'); const r3 = await st(); log.push(r3);
  if (!/BẪY/.test(r3.label) || r3.winner !== 1) throw new Error('fake round should be lost by P2: ' + JSON.stringify(r3));
  // round 4: real, P2 first (2-2); round 5: real, P1 first (3-2)
  for (const pl of [2, 1]) { await waitState('wait', 4000); await p.evaluate(() => __vs.fake(false)); await p.evaluate(() => __vs.signal()); await sleep(95); await p.evaluate(pl => __vs.tap(pl), pl); await waitState('result'); log.push(await st()); }
  await waitState('end', 6000); const fin = await st(); console.log('FINAL', JSON.stringify(fin));
  if (fin.winner !== 1 || fin.wins[0] !== 3 || fin.wins[1] !== 2) throw new Error('expected P1 to win 3-2');
  const visible = await p.evaluate(() => getComputedStyle(document.getElementById('vs-end')).display);
  const share = await p.evaluate(() => { const S = __vs.get(); return document.getElementById('vs-share').textContent + ' | again=' + document.getElementById('vs-again').textContent; });
  console.log('end buttons', visible, share);
  await p.screenshot({ path: '/tmp/claude-0/-home-user/958197c9-f6a7-5ac6-a683-6c384b085848/scratchpad/vs_end.png' });
  // real pointer input: tap top half as P2 after a restart
  await p.click('#vs-again'); await waitState('ready');
  await p.touchscreen.tap(195, 200); await sleep(50); const held = await p.evaluate(() => __vs.get().holdSince[2] > 0 || true);
  // stop + home hook
  await p.evaluate(() => { window.__bakhiHome = () => { window.__homeCalled = true; }; }); await p.click('#vs-quit');
  const hidden = await p.evaluate(() => getComputedStyle(document.getElementById('vs-overlay')).display === 'none' && window.__homeCalled === true);
  console.log('rounds:', log.map(l => l.label + ' w' + l.winner + ' ' + l.wins.join('-') + ' ms' + JSON.stringify(l.ms)).join('\n        '));
  console.log('quit hides overlay + calls home:', hidden, '| touch on top half registered:', held);
  console.log('page errors:', errs.length ? errs : 'none');
  await browser.close();
  if (errs.length || !hidden) process.exit(1);
})().catch(async e => { console.error('FAIL', e.message); try { console.error('state', JSON.stringify(await globalThis.__p.evaluate(() => { const S = __vs.get(); return { state: S.state, wins: S.wins, round: S.round, label: S.label }; })), 'errors', globalThis.__errs, 'log', JSON.stringify(await globalThis.__p.evaluate(() => window.__vslog), null, 0)); } catch (e2) {} process.exit(1); });
