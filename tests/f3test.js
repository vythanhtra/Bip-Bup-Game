/* increment 3: guided fight tutorial, daily on the fight engine, KO-time formatting everywhere, pass-the-phone versus, three-jab prologue lesson, rule texts */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi'); await p.waitForTimeout(900);
  const F = () => p.evaluate(() => __bakhi.fight()); const TU = () => p.evaluate(() => __bakhi.tut());
  const press = k => p.evaluate(k => __bakhi.press(k), k);
  /* rule texts */
  ok(await p.evaluate(() => STORY[4].indexOf('trận bắt đầu') > 0 && DIALOG[1][0].text.indexOf('trận bắt đầu') > 0 && document.querySelector('[data-t="tag"]').textContent.indexOf('trận bắt đầu') >= 0), 'story, grandma and tagline teach the new rule');
  /* tutorial: fresh save, play → tutorial on the fight engine */
  await p.evaluate(() => { localStorage.clear(); __bakhi.save.seen = { pro: 1 }; __bakhi.startTutorial(); }); await p.waitForTimeout(300);
  let f = await F(), t = await TU(); ok(f.fight && t.tut0 && f.state === 'count', 'tutorial runs on the fight engine');
  await press('lt'); await p.waitForTimeout(80); f = await F(); ok(f.hhp >= 115 && f.hhp <= 120, 'early press: forgiven or pecked, never fatal');
  await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(200); t = await TU(); ok(t.step === 1, 'step 1: walk up');
  await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 50; }); await p.waitForTimeout(200); t = await TU(); ok(t.step === 2, 'step 2: punch three times');
  for (let i = 0; i < 3; i++) { await press('lt'); await p.waitForTimeout(260); await p.evaluate(() => { const B = __bakhi.get(); B.E.st = 'idle'; B.E.hitUntil = 0; B.E.vx = 0; B.H.x = B.E.x - 45; }); }
  await p.waitForTimeout(200); t = await TU(); ok(t.hits >= 3 && t.step === 3, 'three hits counted → step 3: block');
  await p.evaluate(() => __bakhi.key('b', 1)); await p.waitForFunction(() => __bakhi.tut().blocked, null, { timeout: 8000 }); await p.evaluate(() => __bakhi.key('b', 0)); await p.waitForTimeout(200); t = await TU(); f = await F(); ok(t.step === 4 && f.H.meter === 100, 'block registered → step 4 with a full meter');
  await p.evaluate(() => { const B = __bakhi.get(); B.H.st = 'idle'; B.H.hitUntil = 0; B.H.x = B.E.x - 50; }); await press('sp'); await p.waitForTimeout(1400); t = await TU(); ok(t.sup && t.step === 5, 'super used → step 5: finish him');
  await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 2; B.E.st = 'idle'; B.E.hitUntil = 0; B.H.st = 'idle'; B.H.hitUntil = 0; B.H.x = B.E.x - 45; B.H.vx = 0; B.E.vx = 0; }); await press('lt'); await p.waitForTimeout(2100);
  ok(await p.evaluate(() => __bakhi.get().state === 'won' && __bakhi.save.seen.t0 === 1), 'KO ends the tutorial, seen.t0 saved');
  await p.waitForTimeout(1700); ok(await p.evaluate(() => { const B = __bakhi.get(); return B && !B.tut0 && B.n === 1; }), 'then gate 1 starts');
  ok(await p.evaluate(() => { const B = __bakhi.get(); return B.hhp === 120; }), 'hero HP intact after tutorial');
  /* daily on the fight engine */
  await p.evaluate(() => { document.getElementById('btn-quit').click(); __bakhi.startDaily(); }); await p.waitForTimeout(300); f = await F(); ok(f.fight && (await p.evaluate(() => !!__bakhi.get().daily)), 'daily gate uses the fight engine');
  await p.evaluate(() => { document.getElementById('dlg-box').click(); }); await p.waitForTimeout(200); await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(150); await p.evaluate(() => { const B = __bakhi.get(); B.E.ai.next = performance.now() + 1e9; B.E.ai.mode = 'idle'; B.E.st = 'idle'; B.E.blockHeld = false; B.E.hp = 2; B.H.x = B.E.x - 45; B.H.vx = 0; }); await press('lt'); await p.waitForTimeout(2200);
  ok(await p.evaluate(() => !document.getElementById('s-result').hidden && /s/.test(document.getElementById('res-sub').textContent) && !/ms/.test(document.getElementById('res-sub').textContent)), 'daily result shows seconds, not ms: ' + (await p.evaluate(() => document.getElementById('res-sub').textContent.slice(0, 60))));
  ok(await p.evaluate(() => __bakhi.fmtMs(12345) === '12,3s'), 'fmtMs formats KO time in Vietnamese');
  /* versus pass-the-phone */
  await p.evaluate(() => { window.__bakhiHome(); document.getElementById('btn-vs').click(); }); await p.waitForTimeout(300);
  ok(await p.evaluate(() => { const o = document.getElementById('vs-overlay'); return o && o.style.display !== 'none' && !!VERSUS.state(); }), 'versus pick screen opens');
  await p.evaluate(() => { const bs = [...document.querySelectorAll('#vs-overlay button')]; bs.find(b => b.textContent === 'ĐÁNH!').click(); }); await p.waitForTimeout(200);
  await p.evaluate(() => { const bs = [...document.querySelectorAll('#vs-overlay button')]; bs.find(b => b.textContent === 'Sẵn sàng rồi').click(); }); await p.waitForTimeout(300);
  f = await F(); ok(f && f.fight && (await p.evaluate(() => __bakhi.get().vs.p === 1 && __bakhi.hero() === 'tibup')), 'player 1 fights as Tí');
  await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(150); await p.evaluate(() => { const B = __bakhi.get(); B.E.ai.next = performance.now() + 1e9; B.E.ai.mode = 'idle'; B.E.st = 'idle'; B.E.blockHeld = false; B.E.hp = 2; B.H.x = B.E.x - 45; B.H.vx = 0; }); await press('lt'); await p.waitForTimeout(2200);
  ok(await p.evaluate(() => { const s = VERSUS.state(); return s && s.res[1] && s.res[1].won && document.getElementById('vs-overlay').style.display !== 'none'; }), 'player 1 result recorded, hand-over screen shown');
  await p.evaluate(() => { const bs = [...document.querySelectorAll('#vs-overlay button')]; bs.find(b => b.textContent === 'Sẵn sàng rồi').click(); }); await p.waitForTimeout(300);
  ok(await p.evaluate(() => __bakhi.get().vs.p === 2 && __bakhi.hero() === 'hoayen'), 'player 2 fights as Hỏa Yến');
  await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(150); await p.evaluate(() => { const B = __bakhi.get(); B.H.hp = 1; B.rEnd = performance.now() - 1; }); await p.waitForTimeout(2300);
  ok(await p.evaluate(() => { const s = VERSUS.state(); return s && s.winner === 1 && document.querySelector('#vs-overlay .vs-big').textContent.indexOf('NGƯỜI 1') >= 0; }), 'player 1 wins (KO beats a loss)');
  await p.evaluate(() => { [...document.querySelectorAll('#vs-overlay button')].find(b => b.textContent === '✕ Thoát').click(); }); await p.waitForTimeout(200);
  ok(await p.evaluate(() => __bakhi.hero() === 'tibup' && !document.getElementById('s-title').hidden), 'quit restores the hero and returns to the title');
  /* prologue scene 3 needs three jabs */
  await p.evaluate(() => { __bakhi.save.seen = {}; __bakhi.startPrologue(); }); await p.waitForTimeout(1600);
  await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(2200);
  await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(2000);
  await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(100); await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(3300); await p.waitForTimeout(2300);
  await p.waitForFunction(() => { const r = __bakhi.pro(); return r && r.i === 3 && r.dlg; }, null, { timeout: 8000 });
  for (let k = 0; k < 4; k++) { await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(80); }
  await p.waitForFunction(() => { const r = __bakhi.pro(); return r && r.i === 3 && r.sigDone; }, null, { timeout: 6000 });
  await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(300); let pr = await p.evaluate(() => { const r = __bakhi.pro(); return { i: r.i, step: r.step, hits: r.hits }; }); ok(pr.i === 3 && pr.step === 1 && pr.hits === 1, 'first jab counted, lesson continues');
  await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(300); await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(200); pr = await p.evaluate(() => { const r = __bakhi.pro(); return { i: r.i, step: r.step, hits: r.hits }; }); ok(pr.step === 2 && pr.hits === 3, 'third jab knocks the dummy down');
  await p.evaluate(() => __bakhi.proSkip());
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
