const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  p.on('load', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {})); p.on('framenavigated', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {}));
  await p.goto('file://' + __dirname + '/../public/index.html?lang=vi'); await p.waitForTimeout(400);
  const st = () => p.evaluate(() => { const B = __bakhi.get(); return B && { state: B.state, n: B.n, hp: B.hp, hearts: B.hearts, streak: B.streak, forgive: B.forgive }; });
  // audio init + say + music
  const audio = await p.evaluate(() => { __bakhi.audio.init(); __bakhi.say('tibup', 'Bụp một cái, trời long đất lở!'); __bakhi.audio.musicStart(3, false, 0); return __bakhi.audio.ready(); });
  await p.waitForTimeout(400);
  // gate 1 first time: dialog shows; hold to skip
  await p.click('#btn-play'); await p.waitForTimeout(200); await p.click('.gate[data-gate="1"]'); await p.waitForTimeout(200);
  const dlg1 = await p.evaluate(() => !document.getElementById('dlg').hidden);
  await p.hover('#dlg-box'); await p.mouse.down(); await p.waitForTimeout(600); await p.mouse.up(); await p.waitForTimeout(200);
  const afterHold = await st(); const dlgGone = await p.evaluate(() => document.getElementById('dlg').hidden);
  // forgive on gate 1: early tap should be forgiven once
  await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await p.waitForTimeout(150); const afterEarly = await st();
  // win gate 1 -> auto continue to gate 2 (no sheet)
  await p.waitForTimeout(900); await p.evaluate(() => { const B = __bakhi.get(); B.hp = 1; B.fake = false; B.mech = 'normal'; if (B.state === 'wait') __bakhi.signal(); }); await p.waitForTimeout(80); await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await p.waitForTimeout(700);
  const wonState = await st(); await p.screenshot({ path: 'r-won.png' }); await p.waitForTimeout(1400); const nextGate = await st();
  const dlg2 = await p.evaluate(() => !document.getElementById('dlg').hidden);
  for (let i = 0; i < 6; i++) { const v = await p.evaluate(() => !document.getElementById('dlg').hidden); if (!v) break; await p.click('#dlg-box'); await p.waitForTimeout(80); }
  // lose gate 2 -> instant retry overlay (no sheet), tap -> restart same gate
  await p.waitForTimeout(700); await p.evaluate(() => { const B = __bakhi.get(); B.forgive = 0; B.hearts = 1; }); await p.waitForTimeout(200); await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'wait') { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); } }); await p.waitForTimeout(800);
  const lostState = await st(); await p.screenshot({ path: 'r-lost.png' }); const sheetHidden = await p.evaluate(() => document.getElementById('s-result').hidden);
  await p.evaluate(() => __bakhi.up()); await p.waitForTimeout(800); const retried = await st();
  // second loss -> sheet
  const dbg1 = await st(); await p.evaluate(() => { const B = __bakhi.get(); B.forgive = 0; B.hearts = 1; }); await p.waitForTimeout(100); const dbg2 = await st(); await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'wait') { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); } }); await p.waitForTimeout(300); const dbg3 = await st(); await p.waitForTimeout(600); const dbg4 = await st();
  const sheet2 = await p.evaluate(() => !document.getElementById('s-result').hidden); console.log('DBG', JSON.stringify({ dbg1, dbg2, dbg3, dbg4, sheet2 }));
  // retry from sheet skips dialog
  await p.click('#btn-retry'); await p.waitForTimeout(200); const dlgRetry = await p.evaluate(() => !document.getElementById('dlg').hidden);
  // boss win still shows sheet; gate 1 revisit skips dialog (seen)
  await p.evaluate(() => { __bakhi.save.unlocked = 40; __bakhi.startGate(8); }); await p.waitForTimeout(200); const dlg8 = await p.evaluate(() => !document.getElementById('dlg').hidden);
  for (let i = 0; i < 5; i++) { const v = await p.evaluate(() => !document.getElementById('dlg').hidden); if (!v) break; await p.click('#dlg-box'); await p.waitForTimeout(60); }
  await p.evaluate(() => { const B = __bakhi.get(); B.hp = 1; B.fake = false; B.mech = 'normal'; __bakhi.signal(); }); await p.waitForTimeout(80); await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await p.waitForTimeout(900);
  const bossSheet = await p.evaluate(() => !document.getElementById('s-result').hidden);
  // mute toggle
  await p.click('#btn-map'); await p.waitForTimeout(100); await p.click('#btn-home'); await p.click('#btn-mute2'); const muteTxt = await p.evaluate(() => document.getElementById('btn-mute2').textContent + '|' + __bakhi.save.mute);
  // frame time in gate 32 with smoke
  await p.evaluate(() => __bakhi.startGate(32)); await p.waitForTimeout(200); for (let i = 0; i < 5; i++) { const v = await p.evaluate(() => !document.getElementById('dlg').hidden); if (!v) break; await p.click('#dlg-box'); await p.waitForTimeout(60); }
  const ft = await p.evaluate(() => new Promise(r => { const ts = []; let last = performance.now(); function f(t){ ts.push(t - last); last = t; if (ts.length < 120) requestAnimationFrame(f); else r({ avg: (ts.reduce((a, c) => a + c, 0) / ts.length).toFixed(1), max: Math.max(...ts).toFixed(1) }); } requestAnimationFrame(f); }));
  console.log(JSON.stringify({ audio, dlg1, afterHold, dlgGone, afterEarly, wonState, nextGate, dlg2, lostState, sheetHidden, retried, sheet2, dlgRetry, dlg8, bossSheet, muteTxt, ft, errs }, null, 1));
  await b.close();
})();
