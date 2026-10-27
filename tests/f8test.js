/* balance telemetry (Owner 2026-10-27): gate_clear / gate_lose / quit carry x = f1|mode|hero|W/L/Q|hp/hmax|rounds|tries|first|supers.rushes|damage by source|gear
   every value is taken from the fight engine (hero HP, round score, round clock, the hit that landed), never from the reflex engine's hearts/round fields */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
const sleep = ms => new Promise(r => setTimeout(r, ms));
function parse(x){ const f = x.split('|'), hp = f[4].split('/'), d = {}; (f[9].match(/[a-z]\d+/g) || []).forEach(t => { d[t[0]] = +t.slice(1); });
  return { ver: f[0], mode: f[1], hero: f[2], res: f[3], hp: +hp[0], hmax: +hp[1], rounds: f[5], tries: +f[6], first: +f[7], sup: +f[8].split('.')[0], rush: +f[8].split('.')[1], dmg: d, gear: f[10], n: f.length }; }
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi'); await sleep(900);
  await p.evaluate(() => { window.__ev = []; A.ev = function(n, d){ __ev.push({ n: n, g: d && d.g, ms: d && d.ms, x: d && d.x }); }; });
  const evs = () => p.evaluate(() => __ev.slice());
  const last = async n => (await evs()).filter(e => e.n === n).pop();
  const press = k => p.evaluate(k => __bakhi.press(k), k);
  const freeze = () => p.evaluate(() => { const B = __bakhi.get(); B.Fs.slice(1).forEach(E => { E.ai.next = __bakhi.clock() + 1e9; E.ai.mode = 'idle'; E.st = 'idle'; E.blockHeld = false; E.atk = null; E.hitUntil = 0; E.vx = 0; }); B.H.st = 'idle'; B.H.hitUntil = 0; B.H.vx = 0; B.refNext = __bakhi.clock() + 1e9; B.duckNext = __bakhi.clock() + 1e9; B.lavaNext = __bakhi.clock() + 1e9; });
  const close = () => p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 45; B.H.face = 1; B.E.face = -1; B.H.vx = 0; B.E.vx = 0; });
  const open = async (n, opt) => { await p.evaluate(([n, opt]) => { __bakhi.startGate(n, Object.assign({ skipDlg: true }, opt || {})); }, [n, opt]);
    for (let i = 0; i < 6 && await p.evaluate(() => __bakhi.get().state !== 'count'); i++) { await p.evaluate(() => document.getElementById('dlg-box').click()); await sleep(120); }   /* practice opens with Gà Bíp's line */
    await p.evaluate(() => __bakhi.beep()); await sleep(150); await freeze(); await close(); };
  const enemyHits = async k => { await close(); await p.evaluate(k => __bakhi.cunning(k), k); await sleep(k === 'grab' ? 900 : 700); await freeze(); };
  const ko = async () => { await close(); await p.evaluate(() => { __bakhi.get().E.hp = 1; }); await press('lt'); await sleep(2100); };

  await p.evaluate(() => { localStorage.clear(); const s = __bakhi.save; s.seen = { t0: 1, fk: 1, pr: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1, pro: 1, kb: 1 }; s.stars = {}; s.unlocked = 30; s.tries = {}; s.items = { giaprom: 1, duaca: 1, banh1: 1 }; s.equip = { cos: 'giaprom', wpn: 'duaca' }; s.hpBoost = 1; s.coins = 0; __bakhi.setHero('tibup'); });

  /* 1. win, first try: light, heavy, grab and the enemy's super each counted under their own source; hero super and rush counted */
  await open(1);
  await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = B.E.hmax = 999; B.H.meter = 100; }); await press('sp'); await sleep(1700); await freeze();
  await p.evaluate(() => { __bakhi.get().H.meter = 50; }); await close(); await press('sp'); await sleep(1300); await freeze();
  await enemyHits('lt'); await enemyHits('hv'); await enemyHits('grab');
  await close(); await p.evaluate(() => { const B = __bakhi.get(); B.E.meter = 100; __bakhi.superNow('E'); }); await sleep(1800); await freeze();
  const mid = await p.evaluate(() => { const B = __bakhi.get(); return { hp: B.H.hp, hmax: B.H.hmax, t: __bakhi.tl() }; });
  ok(mid.t.tl.src.l > 0 && mid.t.tl.src.h > 0 && mid.t.tl.src.g > 0 && mid.t.tl.src.s > 0, 'light, heavy, grab and super damage each land in their own bucket: ' + JSON.stringify(mid.t.tl.src));
  ok(mid.hmax - mid.hp === Object.values(mid.t.tl.src).reduce((a, b) => a + b, 0), 'damage buckets add up to the HP the hero actually lost (' + (mid.hmax - mid.hp) + ')');
  ok(mid.t.tl.sup === 1 && mid.t.tl.rush === 1, 'one super and one rush counted (' + mid.t.tl.sup + '.' + mid.t.tl.rush + ')');
  const tFight = await p.evaluate(() => __bakhi.clock() - __bakhi.get().rT0);
  await ko();
  let e = await last('gate_clear'), x = parse(e.x), endB = await p.evaluate(() => { const B = __bakhi.get(); return { hp: B.H.hp, hmax: B.H.hmax, rw: B.rwins, rl: B.rlost }; });
  ok(e.g === 1 && x.ver === 'f1' && x.n === 11 && e.x.length <= 120, 'gate_clear for gate 1 uses format f1 with 11 fields, ' + e.x.length + ' chars: ' + e.x);
  ok(x.mode === 'gate' && x.hero === 'tibup' && x.res === 'W', 'mode, hero and result recorded');
  ok(x.hp === Math.max(0, Math.round(endB.hp)) && x.hmax === endB.hmax && x.hmax === 120 + 20 + 30, 'HP left matches the fight (' + x.hp + '/' + x.hmax + ', gear included)');
  ok(x.rounds === endB.rw + '-' + endB.rl && x.rounds === '1-0', 'round score 1-0');
  ok(x.tries === 1 && x.first === 1, 'first try, first clear');
  ok(x.gear === 'giaprom,duaca,1', 'gear at the time of play: ' + x.gear);
  ok(x.sup === 1 && x.rush === 1 && x.dmg.g > 0 && x.dmg.h > 0, 'super/rush and damage sources sent');
  ok(e.ms >= tFight && e.ms < tFight + 2600, 'fight time comes from the round clock (' + e.ms + ' ms, about ' + Math.round(tFight) + ' ms before the last punch)');
  ok(!/hearts/.test(e.x), 'reflex-engine hearts field no longer sent from the fight engine');

  /* 2. loss, then retry from the loss screen, then a win on the second try */
  await p.evaluate(() => { const s = __bakhi.save; s.equip = {}; s.hpBoost = 0; });
  await open(2); await p.evaluate(() => { __bakhi.get().H.hp = 5; }); await enemyHits('hv'); await sleep(2000);
  e = await last('gate_lose'); x = parse(e.x);
  ok(e.g === 2 && x.res === 'L' && x.hp === 0 && x.hmax === 120 && x.rounds === '0-1', 'gate_lose: 0 HP left, 0-1 (' + e.x + ')');
  ok(x.dmg.h === 5 && x.tries === 1 && x.first === 0, 'the killing heavy is counted only up to the HP that was left (h5), try 1');
  ok(await p.evaluate(() => __bakhi.get().state === 'lost'), 'loss screen waits for a tap');
  await p.evaluate(() => __bakhi.up()); await sleep(200);
  e = await last('gate_start'); ok(e.g === 2 && e.x === 'gate' && await p.evaluate(() => __bakhi.save.tries[2] === 2), 'tapping retries: gate_start again, tries for gate 2 = 2');
  await p.evaluate(() => __bakhi.beep()); await sleep(150); await freeze(); await ko();
  e = await last('gate_clear'); x = parse(e.x);
  ok(e.g === 2 && x.res === 'W' && x.tries === 2 && x.first === 1 && x.hp === 120, 'second try clears gate 2: tries 2, first clear 1, full HP (' + e.x + ')');
  await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(200);
  /* replay of a cleared gate is not a first clear */
  await open(1); await ko(); e = await last('gate_clear'); x = parse(e.x);
  ok(e.g === 1 && x.tries === 2 && x.first === 0, 'replaying gate 1: tries 2, first clear 0');
  await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(200);

  /* 3. stage and rule damage: lava (stage), the duck's fake BÍP (stage), swinging before the BÍP (p) */
  await p.evaluate(() => { __bakhi.startGate(28, { skipDlg: true }); }); await sleep(500); await press('lt'); await sleep(100);
  let t = await p.evaluate(() => __bakhi.tl().tl.src); ok(t.p === 5, 'swinging before the BÍP is counted as p5 (' + t.p + ')');
  await p.evaluate(() => __bakhi.beep()); await sleep(150); await freeze();
  await p.evaluate(() => { const B = __bakhi.get(); B.stillT = __bakhi.clock() - 3000; B.lavaNext = 0; }); await sleep(120);
  t = await p.evaluate(() => __bakhi.tl().tl.src); ok(t.e === 3, 'standing on lava is stage damage e3 (' + t.e + ')');
  await p.evaluate(() => { const B = __bakhi.get(); B.lavaNext = __bakhi.clock() + 1e9; B.stillT = __bakhi.clock(); B.fakeBeepT = __bakhi.clock(); B.fakeBeepWin = 650; B.fakeBeepDmg = 5; B.fakeBeepSrc = 'e'; }); await press('lt'); await sleep(100);
  t = await p.evaluate(() => __bakhi.tl().tl.src); ok(t.e === 8, "punching on the duck's fake BÍP is stage damage too (e8: " + t.e + ')');

  /* 4. quit in the middle of a fight */
  const before = (await evs()).filter(e => e.n === 'gate_clear' || e.n === 'gate_lose').length;
  await sleep(1000); await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(200);
  e = await last('quit'); x = parse(e.x);
  ok(e.g === 28 && x.res === 'Q' && x.mode === 'gate' && x.tries === 1, 'quit sends Q with mode and tries (' + e.x + ')');
  ok(e.ms >= 900 && e.ms < 2500, 'quit carries the time spent in the unfinished round (' + e.ms + ' ms)');
  ok((await evs()).filter(e => e.n === 'gate_clear' || e.n === 'gate_lose').length === before, 'quitting sends no clear/lose');

  /* 5. other modes are labelled and do not count as tries */
  await open(3, { practice: true }); await ko(); e = await last('gate_clear'); x = parse(e.x);
  ok(x.mode === 'practice' && x.tries === 0 && x.first === 0 && await p.evaluate(() => !__bakhi.save.tries[3]), 'practice is labelled and not counted as a try');
  await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(200);
  await p.evaluate(() => __bakhi.setHero('hoayen')); await open(4); await ko(); e = await last('gate_clear'); x = parse(e.x);
  ok(x.hero === 'hoayen' && x.gear === '-,-,0', 'hero switch and no gear recorded (' + x.hero + ', ' + x.gear + ')');
  ok(await p.evaluate(() => { const t = JSON.parse(localStorage.getItem('bakhi.save')).tries; return t[1] === 2 && t[2] === 2 && t[4] === 1 && !t[3]; }), 'tries per gate are saved with the progress');

  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
