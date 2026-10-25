const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const URL = 'file://' + __dirname + '/../public/index.html?lang=vi';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); const ok = (c, m) => console.log((c ? 'PASS' : 'FAIL') + ' ' + m);
  const g = () => p.evaluate(() => { const B = __bakhi.get(); return B && { st: B.state, hearts: B.hearts, hp: B.hp, combo: B.combo, atks: B.atks.map(a => [a.dir, a.st, a.feint]), n: B.n, run: B.run && { score: B.run.score, kills: B.run.kills }, dlg: B.dlg.length, ib: !!B.introBubbles, holding: B.holding }; });
  const waitAtk = () => p.waitForFunction(() => { const a = __bakhi.atk(); return !!a; }, null, { timeout: 8000, polling: 10 });
  await p.goto(URL); await sleep(300);
  // 1. intro bubbles instead of dialog box at gate 3; gate 1 keeps the box first time
  await p.evaluate(() => { localStorage.clear(); __bakhi.save.unlocked = 40; __bakhi.startGate(1); }); await sleep(100); let v = await g(); ok(v.st === 'dialog' && v.dlg >= 1, 'gate 1 first time keeps the dialog box');
  await p.evaluate(() => { __bakhi.save.seen = {}; __bakhi.startGate(3); }); await sleep(100); v = await g(); ok(v.st === 'wait' && v.ib && v.dlg === 0, 'gate 3: intro as bubbles, straight into play');
  // 2. attack telegraph appears, correct swipe parries
  await waitAtk(); const a1 = await p.evaluate(() => __bakhi.atk()); const hp0 = (await g()).hp;
  await p.evaluate(d => __bakhi.swipe(d), a1.dir); await sleep(60); v = await g();
  ok(v.st === 'wait' && v.combo === 1 && v.hp < hp0, 'correct swipe parries: combo 1, enemy loses hp (' + hp0 + '→' + v.hp + ')');
  // combo multiplies the boop
  await p.waitForFunction(() => __bakhi.get().state === 'go', null, { timeout: 8000 }); await sleep(100); const hpB = (await g()).hp; await p.evaluate(() => __bakhi.tap()); await sleep(60); v = await g();
  const dmg = hpB - v.hp; ok(v.st === 'hit' && dmg >= 40, 'boop after parry is multiplied: dmg ' + dmg);
  // 3. wrong direction = hit
  await sleep(1000); await p.evaluate(() => __bakhi.startGate(5, { skipDlg: true })); await sleep(100); await p.evaluate(() => { __bakhi.get().forgive = 0; __bakhi.get().hearts = 9; }); await waitAtk(); const a2 = await p.evaluate(() => __bakhi.atk()); const h0 = (await g()).hearts;
  await p.evaluate(d => __bakhi.swipe(d), a2.dir === 'L' ? 'R' : 'L'); await sleep(60); v = await g(); ok(v.st === 'hurt' && v.hearts === h0 - 1, 'wrong direction swipe takes a heart');
  // 4. unparried attack lands
  await sleep(900); await p.waitForFunction(() => __bakhi.get().state === 'wait', null, { timeout: 5000 }); await waitAtk(); const h1 = (await g()).hearts; await sleep(1200); v = await g(); ok(v.st === 'hurt' && v.hearts === h1 - 1, 'unparried attack lands (' + h1 + '→' + v.hearts + ')');
  // 5. feint: swiping on a feint is fooled
  await sleep(900); await p.waitForFunction(() => __bakhi.get().state === 'wait', null, { timeout: 5000 }); await p.evaluate(() => { const B = __bakhi.get(); B.atks.forEach(a => { a.feint = true; }); }); await waitAtk(); const h2 = (await g()).hearts; const a3 = await p.evaluate(() => __bakhi.atk());
  await p.evaluate(d => __bakhi.swipe(d), a3.dir); await sleep(60); v = await g(); ok(v.st === 'hurt' && v.hearts === h2 - 1, 'swiping on a feint = fooled');
  // feint that is ignored passes harmlessly
  await sleep(900); await p.waitForFunction(() => __bakhi.get().state === 'wait', null, { timeout: 5000 }); await p.evaluate(() => { const B = __bakhi.get(); B.atks.forEach(a => { a.feint = true; }); }); await waitAtk(); const h3 = (await g()).hearts; await sleep(1300); v = await g(); ok(v.hearts === h3 && v.st !== 'hurt', 'ignored feint does no harm');
  // 6. bet: hold, release fast on beep = x2.2 ; release slow = bet lost
  await p.evaluate(() => { __bakhi.setAtk(false); __bakhi.startGate(10, { skipDlg: true }); }); await sleep(700); await p.evaluate(() => { const B = __bakhi.get(); B.state = 'wait'; B.fake = false; B.tSig = performance.now() + 5000; });
  await p.evaluate(() => __bakhi.tap()); await sleep(500); v = await g(); ok(v.holding && v.st === 'wait', 'holding in wait = charging a bet, no penalty');
  const hpC = v.hp; await p.evaluate(() => { const B = __bakhi.get(); B.fake = false; B.mech = 'normal'; __bakhi.signal(); }); await sleep(90); await p.evaluate(() => __bakhi.up()); await sleep(60); v = await g();
  ok(v.st === 'hit' && hpC - v.hp >= 90, 'bet won: x2.2 damage (' + (hpC - v.hp) + ')');
  await sleep(1000); await p.waitForFunction(() => __bakhi.get().state === 'wait', null, { timeout: 5000 }); await sleep(100); await p.evaluate(() => __bakhi.tap()); await sleep(500); const h4 = (await g()).hearts;
  await p.evaluate(() => { const B = __bakhi.get(); B.fake = false; B.mech = 'normal'; __bakhi.signal(); }); await sleep(320); await p.evaluate(() => __bakhi.up()); await sleep(60); v = await g(); ok(v.st === 'hurt' && v.hearts === h4 - 1, 'bet lost on slow release');
  // short tap in wait still = early
  await sleep(900); await p.waitForFunction(() => __bakhi.get().state === 'wait', null, { timeout: 5000 }); await sleep(100); const h5 = (await g()).hearts; await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 60); }); await sleep(200); v = await g(); ok(v.st === 'hurt' && v.hearts === h5 - 1, 'short tap before the beep is still early');
  // 7. run mode
  await p.evaluate(() => { __bakhi.setAtk(false); __bakhi.startRun(); }); await sleep(300); v = await g(); ok(v.run && v.run.score === 0 && v.st === 'wait', 'run mode starts');
  await p.evaluate(() => { const B = __bakhi.get(); B.run.until = performance.now() + 9000; });
  let kills = 0; for (let i = 0; i < 20; i++) { const s = await p.evaluate(() => __bakhi.get().state); if (s === 'end') break; await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'wait') { B.mech = 'normal'; B.fake = false; B.hp = Math.min(B.hp, 40); __bakhi.signal(); } }); await sleep(100); await p.evaluate(() => __bakhi.tap()); await sleep(900); }
  await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: 15000 });
  const res = await p.evaluate(() => ({ t: document.getElementById('res-title').textContent, s: document.getElementById('res-sub').textContent, best: __bakhi.save.runBest, hud: document.getElementById('hud-gate').textContent }));
  ok(/CHẠY 60 GIÂY: \d+ ĐIỂM/.test(res.t) && res.best > 0 && /đối thủ gục/.test(res.s), 'run result: ' + res.t + ' / ' + res.s);
  await p.evaluate(() => { navigator.clipboard.writeText = t => { window.__clip = t; return Promise.resolve(); }; document.getElementById('btn-share').click(); }); await sleep(50);
  ok(/Chạy 60 giây: \d+ điểm/.test(await p.evaluate(() => window.__clip)), 'run share text');
  console.log('errors:', errs.length ? errs : 'none'); await b.close();
})();
