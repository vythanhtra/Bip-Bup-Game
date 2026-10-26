const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  p.on('load', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {})); p.on('framenavigated', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {}));
  await p.goto('file://' + __dirname + '/../public/index.html?lang=vi'); await p.waitForTimeout(500);
  await p.evaluate(() => { __bakhi.save.unlocked = 40; localStorage.setItem('bakhi.save', JSON.stringify(__bakhi.save)); });
  await p.click('#btn-map2'); await p.waitForTimeout(300);
  await p.click('.hero[data-hero="hoayen"]'); await p.waitForTimeout(300);
  const heroOn = await p.evaluate(() => document.querySelector('.hero.on').getAttribute('data-hero'));
  const skip = async () => { for (let i = 0; i < 8; i++) { const vis = await p.evaluate(() => !document.getElementById('dlg').hidden); if (!vis) break; await p.click('#dlg-box'); await p.waitForTimeout(80); } };
  const st = () => p.evaluate(() => { const B = __bakhi.get(); return { state: B.state, mech: B.mech, hp: B.hp, hearts: B.hearts, phase: B.phase, hits: B.hits }; });
  // double
  await p.evaluate(() => __bakhi.startGate(17)); await p.waitForTimeout(200); await skip(); await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'double'; B.fake = false; __bakhi.signal(); });
  await p.waitForTimeout(120); await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await p.waitForTimeout(60); await p.screenshot({ path: 'p2-double.png' }); await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await p.waitForTimeout(150); const r17 = await st();
  // hold
  await p.evaluate(() => __bakhi.startGate(20)); await p.waitForTimeout(200); await skip(); await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'hold'; B.fake = false; });
  await p.waitForTimeout(650); await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await p.waitForTimeout(900); const holdMid = await st(); await p.screenshot({ path: 'p2-hold.png' });
  await p.evaluate(() => __bakhi.signal()); await p.waitForTimeout(150); await p.evaluate(() => __bakhi.up()); await p.waitForTimeout(150); const r20 = await st();
  // hold release early -> hurt
  await p.evaluate(() => __bakhi.startGate(21)); await p.waitForTimeout(200); await skip(); await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'hold'; B.fake = false; }); await p.waitForTimeout(650); await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await p.waitForTimeout(300); await p.evaluate(() => __bakhi.up()); await p.waitForTimeout(100); const r21 = await st();
  // spot
  await p.evaluate(() => __bakhi.startGate(25)); await p.waitForTimeout(200); await skip(); await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'spot'; B.fake = false; __bakhi.signal(); });
  await p.waitForTimeout(300); await p.screenshot({ path: 'p2-spot.png' }); await p.evaluate(() => __bakhi.tap(5, 5)); await p.waitForTimeout(120); const spotMiss = await st();
  await p.waitForTimeout(1200); await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'wait') { B.mech = 'spot'; B.fake = false; __bakhi.signal(); } }); await p.waitForTimeout(200); await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await p.waitForTimeout(120); const spotHit = await st();
  // final boss phases
  await p.evaluate(() => __bakhi.startGate(40)); await p.waitForTimeout(200); await skip(); await p.evaluate(() => { const B = __bakhi.get(); B.hp = 5; B.mech = 'normal'; B.fake = false; __bakhi.signal(); }); await p.waitForTimeout(100); await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await p.waitForTimeout(600); await p.screenshot({ path: 'p2-phase.png' }); const r40 = await st();
  // lose at boss -> practice button
  await p.evaluate(() => { const B = __bakhi.get(); B.hearts = 1; }); await p.waitForTimeout(2400); await p.waitForFunction(() => __bakhi.get().state === 'wait', null, { timeout: 6000 }).catch(() => {}); await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'wait') { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); } }); await p.waitForTimeout(1300);
  await p.evaluate(() => __bakhi.up()); await p.waitForTimeout(700); await skip(); await p.evaluate(() => { const B = __bakhi.get(); B.hearts = 1; B.forgive = 0; }); await p.waitForTimeout(900); await p.waitForFunction(() => __bakhi.get().state === 'wait', null, { timeout: 6000 }).catch(() => {}); await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'wait') { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); } }); await p.waitForTimeout(1300);
  const resVisible = await p.evaluate(() => !document.getElementById('s-result').hidden && !document.getElementById('btn-practice').hidden); await p.screenshot({ path: 'p2-lose.png' });
  await p.click('#btn-practice'); await p.waitForTimeout(300); const prac = await p.evaluate(() => ({ practice: __bakhi.get().practice, hearts: __bakhi.get().hearts, gate: document.getElementById('hud-gate').textContent }));
  // world 3 / 5 backgrounds
  await p.evaluate(() => __bakhi.startGate(33)); await p.waitForTimeout(200); await skip(); await p.waitForTimeout(600); await p.screenshot({ path: 'p2-w5.png' });
  await p.evaluate(() => __bakhi.startGate(24)); await p.waitForTimeout(200); await skip(); await p.waitForTimeout(600); await p.screenshot({ path: 'p2-w3.png' });
  console.log(JSON.stringify({ heroOn, r17, holdMid, r20, r21, spotMiss, spotHit, r40, resVisible, prac, errs }, null, 1));
  await b.close();
})();
