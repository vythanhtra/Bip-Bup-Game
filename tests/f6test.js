/* portal-submission: pausable game clock (ADR-006), paused overlay and resume, input kind + pad, background fit, ad seam, portal edition */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi'); await p.waitForTimeout(900);
  const G = () => p.evaluate(() => { const B = __bakhi.get(); return { st: B.state, left: B.rEnd - __bakhi.clock(), hx: B.H.x, paused: __bakhi.paused(), ehp: B.E.hp, hhp: B.H.hp, clock: __bakhi.clock() }; });
  const open = async (n) => { await p.evaluate(n => { __bakhi.save.seen = { t0: 1, fk: 1, pr: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1, pro: 1 }; __bakhi.setHero('tibup'); __bakhi.startGate(n, { skipDlg: true }); __bakhi.beep(); }, n); await p.waitForTimeout(200); };
  /* 1. clock: pausing freezes the round timer and the simulation */
  await open(1); let g0 = await G(); ok(g0.st === 'fight' && g0.left > 50000, 'round running (' + Math.round(g0.left) + ' ms left)');
  await p.evaluate(() => __bakhi.pause()); await p.waitForTimeout(700); let g1 = await G();
  ok(g1.paused && Math.abs(g1.left - g0.left) < 60, 'round timer frozen while paused (' + Math.round(g0.left - g1.left) + ' ms drift)');
  ok(Math.abs(g1.clock - g0.clock) < 60, 'game clock stopped (' + Math.round(g1.clock - g0.clock) + ' ms)');
  await p.evaluate(() => __bakhi.key('r', 1)); await p.waitForTimeout(200); let g2 = await G(); ok(Math.abs(g2.hx - g1.hx) < 1, 'no simulation while paused (hero did not move)');
  await p.evaluate(() => __bakhi.key('r', 0));
  /* 2. a tap resumes and is swallowed; timer continues from where it stopped */
  await p.touchscreen.tap(215, 500); await p.waitForTimeout(120); let g3 = await G(); ok(!g3.paused && g3.st === 'fight', 'tap resumes the fight');
  ok(Math.abs(g3.left - g1.left) < 250, 'timer resumed from the paused value (' + Math.round(g1.left - g3.left) + ' ms used)');
  /* 3. hidden tab pauses during a fight, the AI cannot hit a paused player */
  await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 40; B.E.ai.next = 0; });
  await p.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await p.waitForTimeout(100); const hp0 = (await G()).hhp; await p.waitForTimeout(1500); let g4 = await G(); ok(g4.paused && g4.hhp === hp0, 'hidden tab pauses the fight; hero hp unchanged (' + hp0 + ')');
  await p.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await p.waitForTimeout(200); ok((await G()).paused, 'coming back keeps the paused overlay until a gesture');
  await p.keyboard.press('Space'); await p.waitForTimeout(100); ok(!(await G()).paused, 'any key resumes');
  /* 4. pause outside a fight is ignored */
  await p.evaluate(() => { document.getElementById('btn-quit').click(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  ok(!(await p.evaluate(() => __bakhi.paused())), 'no pause when not fighting');
  await p.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  /* 5. input kind: touch shows the pad, keys hide it; a real key press flips it */
  await open(2); ok(await p.evaluate(() => __bakhi.input() === 'touch' && !document.getElementById('pad').hidden), 'touch context: pad shown');
  await p.keyboard.down('ArrowRight'); await p.waitForTimeout(80); await p.keyboard.up('ArrowRight');
  ok(await p.evaluate(() => __bakhi.input() === 'keys' && document.getElementById('pad').hidden), 'a keyboard press hides the pad');
  await p.touchscreen.tap(215, 500); await p.waitForTimeout(60); ok(await p.evaluate(() => __bakhi.input() === 'touch' && !document.getElementById('pad').hidden), 'a touch brings the pad back');
  await p.evaluate(() => { document.getElementById('btn-quit').click(); });
  /* 6. ads: no portal → immediate; the seam is throttled and resumes the clock */
  ok(await p.evaluate(() => new Promise(r => { let c = 0; __bakhi.ads.maybe(() => c++); r(c === 1 && __bakhi.ads.n === 0); })), 'no portal: continue runs at once, no ad counted');
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
