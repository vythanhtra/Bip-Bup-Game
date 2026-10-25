const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  p.on('load', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {})); p.on('framenavigated', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {}));
  await p.goto('file://' + __dirname + '/../public/index.html?lang=vi'); await p.waitForTimeout(400);
  const st = () => p.evaluate(() => { const B = __bakhi.get(); return B && { state: B.state, n: B.n, hearts: B.hearts, holding: B.holding }; });
  const skip = async () => { for (let i = 0; i < 8; i++) { const v = await p.evaluate(() => !document.getElementById('dlg').hidden); if (!v) break; await p.tap('#dlg-box'); await p.waitForTimeout(60); } };
  // 2: tap right after dialog closes must not hurt (gate 9, no forgive)
  await p.evaluate(() => { __bakhi.save.unlocked = 40; __bakhi.startGate(9); }); await p.waitForTimeout(150); await skip(); await p.waitForTimeout(100); await p.tap('#game'); await p.waitForTimeout(100); const grace = await st();
  // 1: pointercancel during hold does not hurt
  await p.evaluate(() => __bakhi.startGate(20)); await p.waitForTimeout(150); await skip(); await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'hold'; }); await p.waitForTimeout(600); await p.evaluate(() => __bakhi.tap()); await p.waitForTimeout(200);
  await p.evaluate(() => document.getElementById('game').dispatchEvent(new PointerEvent('pointercancel'))); await p.waitForTimeout(100); const cancel = await st();
  // 3: lost overlay: restart on pointerup, lockout protects from double tap
  await p.evaluate(() => __bakhi.startGate(10)); await p.waitForTimeout(150); await skip(); await p.evaluate(() => { const B = __bakhi.get(); B.hearts = 1; }); await p.waitForTimeout(700); await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'wait') (__bakhi.tap(), setTimeout(() => __bakhi.up(), 50)); }); await p.waitForTimeout(800);
  const lost = await st(); const hudVisible = await p.evaluate(() => !document.getElementById('hud').hidden);
  await p.tap('#game'); await p.waitForTimeout(40); await p.tap('#game'); await p.waitForTimeout(400); const afterDouble = await st();
  // 4: challenge link unlock
  await p.evaluate(() => { localStorage.clear(); }); await p.goto('file://' + __dirname + '/../public/index.html?lang=vi&v=2#c12-231'); await p.waitForTimeout(300);
  await p.tap('#btn-play'); await p.waitForTimeout(200); await skip(); await p.evaluate(() => { const B = __bakhi.get(); B.hp = 1; B.fake = false; B.mech = 'normal'; __bakhi.signal(); }); await p.waitForTimeout(80); await p.evaluate(() => __bakhi.tap()); await p.waitForTimeout(900);
  const chal = await p.evaluate(() => ({ unlocked: __bakhi.save.unlocked, sheet: !document.getElementById('s-result').hidden, next: !document.getElementById('btn-next').hidden }));
  // 7: perf gate 32
  await p.evaluate(() => __bakhi.startGate(32)); await p.waitForTimeout(150); await skip();
  const ft = await p.evaluate(() => new Promise(r => { const ts = []; let last = performance.now(); function f(t){ ts.push(t - last); last = t; if (ts.length < 150) requestAnimationFrame(f); else { ts.sort((a, b) => a - b); r({ avg: (ts.reduce((a, c) => a + c, 0) / ts.length).toFixed(1), p95: ts[Math.floor(ts.length * .95)].toFixed(1) }); } } requestAnimationFrame(f); }));
  console.log(JSON.stringify({ grace, cancel, lost, hudVisible, afterDouble, chal, ft, errs }));
  await b.close();
})();
