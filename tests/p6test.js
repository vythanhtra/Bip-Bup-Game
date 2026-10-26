const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const URL = 'file://' + __dirname + '/../public/index.html?lang=vi';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await browser.newContext({ viewport: { width: 420, height: 800 }, hasTouch: true });
  const p = await ctx.newPage(); await p.addInitScript(function(){ window.__FIGHT_OFF = 1; }); /* legacy reflex engine (daily/run) */ const errs = []; p.on('pageerror', e => errs.push(e.message));
  p.on('load', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {})); p.on('framenavigated', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {}));
  const ok = (c, m) => console.log((c ? 'PASS' : 'FAIL') + ' ' + m);
  const get = () => p.evaluate(() => { const B = __bakhi.get(); return B && { state: B.state, mech: B.mech, fake: B.fake, hearts: B.hearts, hp: B.hp, n: B.n, daily: B.daily, cnt: B.cnt, cntN: B.cntN, tut: B.tut, ghostShown: B.ghostShown}; });
  const st = () => p.evaluate(() => __bakhi.get().state);
  const waitSt = (s, t = 8000) => p.waitForFunction(s => __bakhi.get() && __bakhi.get().state === s, s, { timeout: t, polling: 10 });
  const skip = () => p.evaluate(() => { const B = __bakhi.get(); if (B && B.state === 'dialog') { B.dlg = []; document.getElementById('dlg-box').click(); } });
  await p.goto(URL);
  // 1. title + badge
  ok(await p.evaluate(() => /chưa chơi/.test(document.getElementById('daily-badge').textContent)), 'daily badge shows not played yet');
  ok(await p.evaluate(() => typeof VERSUS === 'object' && typeof VERSUS.start === 'function'), 'VERSUS module loaded');
  // 2. daily determinism
  const d1 = await p.evaluate(() => JSON.stringify(__bakhi.dailyGate(20261024)));
  const d2 = await p.evaluate(() => JSON.stringify(__bakhi.dailyGate(20261024)));
  const d3 = await p.evaluate(() => JSON.stringify(__bakhi.dailyGate(20261025)));
  ok(d1 === d2 && d1 !== d3, 'daily gate deterministic per day: ' + d1.slice(0, 90));
  // seeded mech order deterministic across two runs
  async function dailySeq(){ await p.evaluate(() => __bakhi.startDaily(20261024)); await sleep(100); await skip(); await sleep(700); const seq = []; for (let i = 0; i < 4; i++) { seq.push(await p.evaluate(() => { const B = __bakhi.get(); return B.mech + ':' + B.fake; })); await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'normal'; B.fake = false; __bakhi.signal(); }); await sleep(120); await p.evaluate(() => __bakhi.tap()); await sleep(700); } return seq.join(' | '); }
  const s1 = await dailySeq(); await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(100); const s2 = await dailySeq();
  ok(s1 === s2 && /reverse|count|double|hold|spot/.test(s1), 'seq2=' + s2 + ' ' + 'daily mechanic sequence identical on replay: ' + s1);
  await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(100);
  // 3. play a daily to the end -> save.daily, streak, result
  await p.evaluate(() => { __bakhi.startDaily(20261024); }); await sleep(100); await skip(); await sleep(600);
  for (let i = 0; i < 12; i++) { const s = await st(); if (s === 'end' || s === 'won') break; await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'wait') { B.mech = 'normal'; B.fake = false; B.hp = Math.min(B.hp, 30); __bakhi.signal(); } }); await sleep(110); await p.evaluate(() => __bakhi.tap()); await sleep(800); }
  await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: 8000 });
  const res = await p.evaluate(() => ({ t: document.getElementById('res-title').textContent, s: document.getElementById('res-sub').textContent, save: JSON.parse(localStorage.getItem('bakhi.save')), next: document.getElementById('btn-next').hidden }));
  ok(/CỬA HẰNG NGÀY 24\/10/.test(res.t) && res.save.daily && res.save.daily.day === 20261024 && res.save.daily.won && res.save.dstreak === 1 && res.next, 'daily result recorded: ' + res.t + ' / ' + res.s.slice(0, 80));
  ok(res.save.unlocked === 1, 'daily does not unlock story gates');
  await p.evaluate(() => document.getElementById('btn-share').click()); await sleep(50);
  // replay doesn't count
  await p.evaluate(() => document.getElementById('btn-retry').click()); await sleep(150); await skip(); await sleep(600);
  await p.evaluate(() => { const B = __bakhi.get(); B.forgive = 0; }); for (let i = 0; i < 4; i++) { await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await sleep(900); }
  await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: 8000 });
  const res2 = await p.evaluate(() => ({ s: document.getElementById('res-sub').textContent, save: JSON.parse(localStorage.getItem('bakhi.save')) }));
  ok(res2.save.daily.won === true && /không tính/.test(res2.s), 'daily replay does not overwrite first result: ' + res2.s.slice(0, 70));
  // 4. reverse mechanic
  await p.evaluate(() => { __bakhi.save.unlocked = 40; __bakhi.startGate(14, { skipDlg: true }); }); await sleep(700);
  await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'reverse'; B.fake = true; __bakhi.signal(); }); await sleep(30);
  let g = await get(); ok(g.state === 'go' && g.mech === 'reverse', 'reverse: quack is GO');
  await p.evaluate(() => __bakhi.tap()); await sleep(30); g = await get(); ok(g.state === 'hit', 'reverse: tap on quack hits');
  await sleep(900); await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'reverse'; B.fake = false; __bakhi.signal(); }); await sleep(30);
  g = await get(); ok(g.state === 'fakesig', 'reverse: bíp is the trap');
  const h0 = g.hearts; await p.evaluate(() => __bakhi.tap()); await sleep(30); g = await get(); ok(g.state === 'hurt' && g.hearts === h0 - 1, 'reverse: tapping on bíp loses a heart');
  await sleep(900); await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'reverse'; B.fake = false; __bakhi.signal(); }); await sleep(900); g = await get(); ok(g.state === 'wait', 'reverse: ignoring the bíp returns to wait (' + g.state + ')');
  // 5. count mechanic
  await p.evaluate(() => { __bakhi.startGate(22, { skipDlg: true }); }); await sleep(700);
  await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'count'; B.cnt = 3; __bakhi.signal(); }); await sleep(30);
  g = await get(); ok(g.state === 'count' && g.cntN === 1, 'count: first crow enters count state');
  await sleep(420); g = await get(); ok(g.state === 'count' && g.cntN === 2, 'count: second crow (cnt=3) still counting');
  const hc = g.hearts; await p.evaluate(() => __bakhi.tap()); await sleep(30); g = await get(); ok(g.state === 'hurt' && g.hearts === hc - 1, 'count: tapping before the last crow = ĐẾM SAI');
  await sleep(900); await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'count'; B.cnt = 2; __bakhi.signal(); }); await sleep(450);
  g = await get(); ok(g.state === 'go', 'count: after last crow (cnt=2) state is go');
  await p.evaluate(() => __bakhi.tap()); await sleep(30); g = await get(); ok(g.state === 'hit', 'count: tap after last crow hits');
  // 6. first-fake tutorial (fresh save)
  await p.evaluate(() => { localStorage.clear(); }); await p.goto(URL); await p.evaluate(() => { __bakhi.save.unlocked = 40; __bakhi.startGate(9, { skipDlg: true }); }); await sleep(700);
  await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'normal'; B.fake = true; __bakhi.signal(); }); await sleep(30);
  g = await get(); ok(g.state === 'fakesig' && g.tut === true, 'tutorial: first ever fake flagged');
  const ht = g.hearts; await p.evaluate(() => __bakhi.tap()); await sleep(30); g = await get(); ok(g.state === 'wait' && g.hearts === ht, 'tutorial: first fooled tap forgiven, no heart lost');
  await sleep(2200); await p.evaluate(() => { const B = __bakhi.get(); B.state = 'wait'; B.mech = 'normal'; B.fake = true; __bakhi.signal(); }); await sleep(30); g = await get();
  ok(g.state === 'fakesig' && !g.tut, 'tutorial: second fake is not forgiven');
  await p.evaluate(() => __bakhi.tap()); await sleep(30); g = await get(); ok(g.state === 'hurt', 'tutorial: second fooled tap hurts');
  // 7. ghost on challenge link
  await p.goto('about:blank'); await p.goto(URL + '#c11-150'); await sleep(100); await p.evaluate(() => document.getElementById('btn-play').click()); await sleep(100); await skip(); await sleep(200); await skip(); await sleep(700);
  ok(await p.evaluate(() => /👻 150ms/.test(document.getElementById('hud-gate').textContent)), 'ghost: hud shows challenger ms');
  await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'normal'; B.fake = false; __bakhi.signal(); }); await sleep(260);
  g = await get(); ok(g.ghostShown === true, 'ghost: ghost fired at challenger time');
  await p.evaluate(() => __bakhi.tap()); await sleep(100);
  // 8. daily challenge link
  await p.goto('about:blank'); await p.goto(URL + '#d20261024-130'); await sleep(100);
  ok(await p.evaluate(() => /Hằng Ngày 24\/10/.test(document.getElementById('challenge-banner').textContent) && document.getElementById('btn-play').textContent === 'NHẬN THÁCH HẰNG NGÀY'), 'daily challenge banner');
  await p.evaluate(() => document.getElementById('btn-play').click()); await sleep(200); g = await get(); ok(g && g.daily === 20261024, 'daily challenge starts that day\'s gate');
  console.log('errors:', errs.length ? errs : 'none');
  await browser.close();
})();
