/* ADR-008 hero kits prototype (?kits=1): each kit through the real fight engine, the crowd-control rules, the two new AI rules with their
   negative tests (spec section 10, N1-N10, P1-P2) and f2 telemetry. Flag-off parity is the rest of the suite, which runs without ?kits=1. */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi&kits=1'); await sleep(900);
  ok(await p.evaluate(() => __bakhi.kits()), 'the prototype flag is on with ?kits=1');
  await p.evaluate(() => { window.__ev = []; A.ev = function(n, d){ __ev.push({ n: n, g: d && d.g, ms: d && d.ms, x: d && d.x }); }; localStorage.clear(); const s = __bakhi.save; s.seen = { t0: 1, pro: 1, kb: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1, kit_tibup: 1, kit_hoayen: 1, kit_bangnhi: 1, kit_thachlao: 1 }; s.unlocked = 40; s.stars = {}; s.items = {}; s.equip = {}; s.hpBoost = 0; });
  const SC = await p.evaluate(() => __bakhi.sc());
  const K = () => p.evaluate(() => __bakhi.kit());
  const press = k => p.evaluate(k => __bakhi.press(k), k);
  const freeze = () => p.evaluate(() => { const B = __bakhi.get(); B.Fs.slice(1).forEach(E => { E.ai.next = __bakhi.clock() + 1e9; E.ai.mode = 'idle'; E.st = 'idle'; E.blockHeld = false; E.atk = null; E.hitUntil = 0; E.vx = 0; }); B.H.st = 'idle'; B.H.hitUntil = 0; B.H.vx = 0; B.refNext = __bakhi.clock() + 1e9; B.duckNext = __bakhi.clock() + 1e9; B.lavaNext = __bakhi.clock() + 1e9; B.stillT = __bakhi.clock() + 1e9; });
  const at = d => p.evaluate(d => { const B = __bakhi.get(); B.H.x = B.E.x - d; B.H.face = 1; B.E.face = -1; B.H.vx = 0; B.E.vx = 0; B.E.y = 0; B.H.y = 0; }, d);
  const open = async (n, hero) => { await p.evaluate(([n, h]) => { __bakhi.setHero(h); __bakhi.startGate(n, { skipDlg: true }); }, [n, hero]);
    for (let i = 0; i < 12 && await p.evaluate(() => __bakhi.get().state !== 'count'); i++) { await p.evaluate(() => { const B = __bakhi.get(); if (B.cine) B.cine.t0 = -1e9; if (B.state === 'dialog') document.getElementById('dlg-box').click(); }); await sleep(100); }
    await p.evaluate(() => __bakhi.beep()); await sleep(150); await freeze(); await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = B.E.hmax = 999; }); await at(45); };
  const quit = async () => { await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(150); };
  const ehp = () => p.evaluate(() => __bakhi.get().E.hp);
  const hit = async (k, d, wait) => { await freeze(); await at(d === undefined ? 45 : d); const h0 = await ehp(); await press(k); await sleep(wait || 760); return h0 - await ehp(); };
  const enemyHits = async (k, wait) => { await at(45); await p.evaluate(k => __bakhi.cunning(k), k); await sleep(wait || 600); };

  /* ---- Tí: Chuỗi Bụp ---- */
  await open(12, 'tibup');
  const d1 = await hit('hv'), d2 = await hit('hv'), d3 = await hit('hv'); let k = await K();
  ok(k.K.chain === 3 && d1 === 18 && d2 === 18 && d3 === 19, 'Chuỗi Bụp: three landed heavies make chain 3; the 3rd is +5 % (' + [d1, d2, d3].join(', ') + ')');
  const d4 = await hit('hv'), d5 = await hit('hv'), d6 = await hit('hv'), d7 = await hit('hv'), d8 = await hit('hv'); k = await K();
  ok(k.K.chain === 8 && d7 === 23 && d8 === 23, 'chain bonus caps at +25 % from the 7th hit (18 → ' + d7 + ', 8th ' + d8 + ')');
  await hit('lt', 160, 500); k = await K(); ok(k.K.chain === 0 && k.K.br.w === 1, 'a whiff breaks the chain');
  await hit('lt'); await hit('lt', 45, 450); await p.evaluate(() => { const E = __bakhi.get().E; E.ai.mode = 'block'; E.st = 'block'; E.blockHeld = true; });
  await at(45); await press('lt'); await sleep(450); k = await K(); ok(k.K.chain === 0 && k.K.br.b === 1, 'a blocked hit breaks the chain');
  await hit('lt'); await hit('lt', 45, 450); await enemyHits('hv'); k = await K(); ok(k.K.chain === 0 && k.K.br.h === 1, 'getting hit breaks the chain');
  await hit('lt'); await hit('lt', 45, 300); await sleep(1300); k = await K(); ok(k.K.chain === 0 && k.K.br.t === 1, '1.2 s without a landed hit breaks the chain');
  await hit('lt'); await hit('lt', 45, 450); await p.evaluate(() => { __bakhi.get().H.meter = 50; }); await hit('sp', 45, 420); k = await K(); ok(k.K.chain === 2, 'the rush neither builds nor breaks the chain (' + k.K.chain + ')');
  await quit();

  /* ---- Hỏa Yến: Hỏa Tích ---- */
  await open(12, 'hoayen');
  ok(await p.evaluate(() => __bakhi.get().H.dmgMul === 1.15 && __bakhi.shop.gear().perfect === 100), 'Hỏa Yến: damage ×1.15 (Q4), perfect-block window 100 ms');
  await p.evaluate(() => { __bakhi.get().H.meter = 0; }); const hd = await hit('lt', 45, 500); k = await K(); ok(hd === 9 && Math.abs(k.meter - 9 * .9) < .01, 'Heat fills 0.9 × damage from a landed hit (' + hd + ' → ' + k.meter.toFixed(1) + ')');
  const m0 = k.meter; await enemyHits('hv'); k = await K(); ok(k.meter === m0, 'no Heat from getting hit');
  await freeze(); await at(45); await p.evaluate(() => __bakhi.key('b', 1)); await p.evaluate(() => __bakhi.cunning('lt')); await sleep(500); await p.evaluate(() => __bakhi.key('b', 0)); k = await K(); ok(k.meter === m0, 'no Heat from blocking');
  await p.evaluate(() => { const B = __bakhi.get(); B.H.meter = 40; B.kit.heatT = __bakhi.clock() - 3100; }); await sleep(1000); k = await K(); ok(k.meter < 28 && k.meter > 22 && k.K.heat.wasteDecay > 12, 'Heat cools 15/s after 3 s without a hit (40 → ' + k.meter.toFixed(1) + ')');
  await p.evaluate(() => { const B = __bakhi.get(); B.H.meter = 60; B.kit.heatT = __bakhi.clock(); }); await freeze(); await at(200); await press('sp'); await sleep(1100); k = await K();
  ok(Math.round(k.meter) === 10 && k.K.heat.wasteHit === 50, 'a rush that misses wastes its 50 Heat (meter ' + Math.round(k.meter) + ', wasted ' + k.K.heat.wasteHit + ')');
  /* perfect block: guard raised as the strike starts, it lands about 120-140 ms later — outside her 100 ms window */
  await freeze(); await at(45); await p.evaluate(() => { __bakhi.key('b', 1); __bakhi.cunning('lt'); }); await sleep(400); await p.evaluate(() => __bakhi.key('b', 0));
  const hyCounter = await p.evaluate(() => __bakhi.get().H.counterUntil); await quit();
  await open(12, 'tibup'); await p.evaluate(() => { __bakhi.key('b', 1); __bakhi.cunning('lt'); }); await sleep(400); await p.evaluate(() => __bakhi.key('b', 0));
  const tiCounter = await p.evaluate(() => __bakhi.get().H.counterUntil - __bakhi.clock());
  ok(!hyCounter && tiCounter > 0, 'the same block timing is a perfect block for Tí (150 ms) but not for Hỏa Yến (100 ms)');
  await quit();
  await p.evaluate(() => { const s = __bakhi.save; s.items.aotien = 1; s.equip.cos = 'aotien'; __bakhi.setHero('hoayen'); }); const g1 = await p.evaluate(() => __bakhi.shop.gear().perfect);
  await p.evaluate(() => __bakhi.setHero('tibup')); const g2 = await p.evaluate(() => __bakhi.shop.gear().perfect); await p.evaluate(() => { const s = __bakhi.save; s.equip.cos = ''; });
  ok(g1 === 150 && g2 === 200, 'Q1: the fairy coat adds 50 ms to each hero’s own window (Hỏa Yến 150, Tí 200)');

  /* ---- Băng Nhi: Hàn Kình ---- */
  await open(12, 'bangnhi');
  ok(await p.evaluate(() => __bakhi.get().forgive === 0), 'Q3: Băng Nhi has no early-swing pardon at gate 12');
  await p.evaluate(() => { __bakhi.get().H.meter = 20; }); await at(45); await press('hv'); await sleep(60); k = await K(); ok(k.atk && k.atk.lbl === 'heavyLbl' && k.meter === 20, 'under 25 Ba Khi, 💥 stays the plain heavy'); await sleep(800);
  const band = async d => { await freeze(); await p.evaluate(() => { const B = __bakhi.get(); B.H.meter = 60; B.E.ccImmuneUntil = 0; B.E.frozenUntil = 0; B.E.slowUntil = 0; }); await at(d * SC); const h0 = await ehp(); await press('hv'); await sleep(420);
    return p.evaluate(h0 => { const B = __bakhi.get(), n = __bakhi.clock(); return { dmg: h0 - B.E.hp, frozen: Math.round(Math.max(0, B.E.frozenUntil - n)), slow: B.E.slowUntil > n, atk: B.H.atkKey, meter: Math.round(B.H.meter) }; }, h0); };
  let r = await band(8); ok(r.atk === 'ice' && r.meter === Math.round(35 + 18 * .6) && r.dmg === 18 && r.frozen > 700 && r.frozen <= 1000, 'close band (8 SC): ice palm costs 25, 18 damage, about 1 s freeze (' + JSON.stringify(r) + ')'); await sleep(1300);
  r = await band(15); ok(r.dmg === 12 && r.frozen > 200 && r.frozen <= 500, 'mid band (15 SC): 12 damage, 0.5 s freeze (' + JSON.stringify(r) + ')'); await sleep(800);
  r = await band(25); ok(r.dmg === 6 && r.frozen === 0 && r.slow, 'far band (25 SC): 6 damage and a slow, no freeze (' + JSON.stringify(r) + ')'); await sleep(800);
  r = await band(36); ok(r.dmg === 0, 'beyond 30 SC the palm misses (' + r.dmg + ')'); await sleep(800);
  /* no stacking, immunity after a freeze: spam the palm for 6 s, at most 1 s frozen in any 3 s */
  await freeze(); await p.evaluate(() => { const B = __bakhi.get(); B.E.ccImmuneUntil = 0; B.E.frozenUntil = 0; window.__fz = 0; window.__fzT = setInterval(() => { const E = __bakhi.get().E; if (E.frozenUntil > __bakhi.clock()) window.__fz += 50; }, 50); });
  for (let i = 0; i < 12; i++) { await p.evaluate(() => { const B = __bakhi.get(); B.H.meter = 100; B.H.st = 'idle'; B.H.hitUntil = 0; B.H.atk = null; }); await at(8 * SC); await press('hv'); await sleep(500); }
  const fz = await p.evaluate(() => { clearInterval(window.__fzT); return window.__fz; });
  ok(fz <= 2200 && fz >= 1500, 'A4: spamming the palm for 6 s freezes a normal enemy about 2 × 1 s, never back to back (' + fz + ' ms)');
  await quit();
  await open(16, 'bangnhi'); await p.evaluate(() => { __bakhi.get().H.meter = 60; }); await at(8 * SC); await press('hv'); await sleep(420);
  r = await p.evaluate(() => { const B = __bakhi.get(), n = __bakhi.clock(); return { frozen: B.E.frozenUntil > n, stagger: Math.round(B.E.hitUntil - n), imm: Math.round(B.E.ccImmuneUntil - n) }; });
  ok(!r.frozen && r.stagger <= 400 && r.imm > 7500 && r.imm <= 8400, 'boss: the palm only staggers (≤ 0.4 s), then 8 s freeze immunity (' + JSON.stringify(r) + ')');
  await sleep(600); await freeze(); await p.evaluate(() => { const B = __bakhi.get(); B.H.meter = 100; }); await at(45); await p.evaluate(() => __bakhi.superNow('H')); await sleep(700);
  r = await p.evaluate(() => { const B = __bakhi.get(), n = __bakhi.clock(); return { frozen: B.E.frozenUntil > n, hit: B.E.st }; }); ok(!r.frozen, 'boss: her old 1.5 s freezing super is refused during the immunity (' + JSON.stringify(r) + ')');
  await quit();
  await p.evaluate(() => { __bakhi.setHero('bangnhi'); __bakhi.startGate(12, { skipDlg: true }); }); for (let i = 0; i < 6 && await p.evaluate(() => __bakhi.get().state === 'cine'); i++) { await p.evaluate(() => { __bakhi.get().cine.t0 = -1e9; }); await sleep(120); }
  await sleep(450); await press('lt'); await sleep(100); r = await p.evaluate(() => ({ hp: __bakhi.get().H.hp, st: __bakhi.get().state }));
  ok(r.hp === 115, 'Q3: Băng Nhi swinging before the BÍP is pecked −5 like everyone else (' + r.hp + ', ' + r.st + ')'); await quit();

  /* ---- Thạch Lão: Sơn Kình, Thế Núi ---- */
  await open(12, 'thachlao');
  await at(45); await press('lt'); await sleep(40); k = await K(); ok(k.atk.su === 108, 'Thạch Lão: startup ×1.2 (jab 90 → ' + k.atk.su + ' ms)'); await sleep(600);
  const walk = async h => { await quit(); await open(12, h); await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.arenaW * .2; B.E.x = B.arenaW * .95; }); const x0 = await p.evaluate(() => __bakhi.get().H.x), t0 = await p.evaluate(() => __bakhi.clock()); await p.evaluate(() => __bakhi.key('r', 1)); await sleep(500); await p.evaluate(() => __bakhi.key('r', 0)); const r = await p.evaluate(() => ({ x: __bakhi.get().H.x, t: __bakhi.clock() })); return (r.x - x0) / (r.t - t0); };   /* px per ms, mid-arena, away from the edges */
  const wT = await walk('tibup'), wS = await walk('thachlao'); ok(wS / wT > .82 && wS / wT < .97, 'Thạch Lão walks about 0.9× (' + (wS / wT).toFixed(2) + ')');
  await freeze(); await at(45); await p.evaluate(() => { __bakhi.key('b', 1); __bakhi.cunning('lt'); }); await sleep(400); await p.evaluate(() => __bakhi.key('b', 0)); k = await K();
  ok(k.K.pts === 1 && !(await p.evaluate(() => __bakhi.get().H.counterUntil)), 'a perfect block stores a stone instead of the ×2 counter window');
  await p.evaluate(() => { __bakhi.get().kit.pts = 2; }); await freeze(); await at(45); const sh0 = await ehp(), hh0 = await p.evaluate(() => __bakhi.get().H.hp);
  await press('hv'); await sleep(40); await p.evaluate(() => __bakhi.cunning('lt')); await sleep(140); k = await K(); const hh1 = await p.evaluate(() => __bakhi.get().H.hp);
  ok(k.atk && k.atk.lbl === 'rockLbl' && k.sa && hh1 < hh0, 'Sơn Kình: 💥 with stones releases it; a hit during its startup hurts but does not interrupt');
  await sleep(700); const rockDmg = sh0 - await ehp(); ok(rockDmg === Math.round((18 + 8 * 2) * .8), 'Sơn Kình with 2 stones deals (18 + 16) × 0.8 = 27 (' + rockDmg + ')');
  await p.evaluate(() => { const B = __bakhi.get(); B.kit.pts = 2; B.kit.ptsT = __bakhi.clock(); }); await enemyHits('grab', 900); k = await K(); ok(k.K.pts === 1 && k.K.ps.lost >= 1, 'a grab knocks one stone loose');
  await p.evaluate(() => { const B = __bakhi.get(); B.kit.pts = 2; B.kit.ptsT = __bakhi.clock() - 8100; }); await sleep(100); k = await K(); ok(k.K.pts === 0, 'stones fade after 8 s without a perfect block');
  /* Thế Núi */
  const stance = async () => { await freeze(); await at(45); await p.evaluate(() => { const B = __bakhi.get(); B.H.meter = 100; B.kit.pts = 1; B.kit.ptsT = __bakhi.clock(); }); await p.evaluate(() => __bakhi.superNow('H')); await sleep(80); };
  await stance(); k = await K(); ok(k.stance, 'Thế Núi replaces Dỗi as Thạch Lão’s super');
  let hpA = await p.evaluate(() => __bakhi.get().H.hp), eA = await ehp(); await enemyHits('lt', 400); let hpB = await p.evaluate(() => __bakhi.get().H.hp), eB = await ehp(); k = await K();
  ok(hpB === hpA && eA - eB === 25 && !k.stance && k.K.st.c === 1, 'N10a: the first strike into the stance is cancelled and countered for 20 + 5 per stone (' + (eA - eB) + ')');
  await sleep(500); await freeze(); hpA = await p.evaluate(() => __bakhi.get().H.hp); await enemyHits('lt', 400); hpB = await p.evaluate(() => __bakhi.get().H.hp); ok(hpB < hpA, 'N10b: the next strike lands normally (one counter only)');
  await sleep(600); await stance(); eA = await ehp(); hpA = await p.evaluate(() => __bakhi.get().H.hp); await enemyHits('grab', 900); k = await K(); hpB = await p.evaluate(() => __bakhi.get().H.hp);
    ok(!k.stance && k.K.st.g === 1 && hpB < hpA && (await ehp()) === eA && k.K.pts === 0, 'N9: a grab breaks the stance, no counter, the hero takes it and loses a stone');
  await sleep(800); await stance(); await sleep(1600); k = await K(); ok(!k.stance && k.K.st.x === 1, 'the stance ends by itself after 1.5 s');
  await quit();

  /* ---- AI rules: same seeded decisions with and without the kit (N1, N2, N5, N6, N8), and the rules where they apply (N3, N4, N7, P1, P2) ---- */
  const decide = (n, seed, dSC, opt) => p.evaluate(([n, seed, dSC, opt]) => {
    const B = __bakhi.get(), E = B.E, H = B.H, kit = B.kit, SCv = __bakhi.sc(); if (opt.noKit) B.kit = null; let s = seed; const R = Math.random;
    Math.random = function(){ s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const out = { dash: 0, grab: 0, back: 0, atk: 0, other: 0 };
    for (let i = 0; i < n; i++) { E.meter = 0; E.ai.hist = []; E.ai.lastKey = ''; E.ai.sameN = 0; E.chain = 0; E.lastAtkT = -1e9; E.st = 'idle'; E.atk = null; E.atkKey = ''; E.ai.next = 0; E.ai.combo = null; E.ai.mode = 'idle'; E.y = 0; E.vx = 0; E.hitUntil = 0; E.dead = false; H.y = 0; H.st = opt.block ? 'block' : 'idle'; H.blockHeld = !!opt.block; H.stanceUntil = opt.stance ? __bakhi.clock() + 1e6 : 0; E.x = H.x + dSC * SCv; E.face = -1; H.face = 1; B.stat = { jabT: [] };
      const r = __bakhi.aiStep(0); if (r.st === 'dash') out.dash++; else if (r.st === 'atk' && r.atk === 'grab') out.grab++; else if (r.mode === 'walk' && r.dir === -r.face) out.back++; else if (r.st === 'atk' || r.st === 'prejump') out.atk++; else out.other++; }
    Math.random = R; B.kit = kit; H.stanceUntil = 0; return out; }, [n, seed, dSC, opt || {}]);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  for (const h of ['tibup', 'hoayen', 'thachlao']) { await open(14, h); await at(400); const a = await decide(1500, 7, 18), c = await decide(1500, 7, 18, { noKit: true }); ok(same(a, c), 'N1: ' + h + ' at 18 SC: dash-ins identical with and without kits (' + a.dash + ')'); await quit(); }
  await open(14, 'bangnhi'); await at(400);
  let a = await decide(1500, 7, 12), c = await decide(1500, 7, 12, { noKit: true }); ok(same(a, c), 'N2: Băng Nhi within 15 SC: AI unchanged');
  const pK = await decide(3000, 11, 18), p0 = await decide(3000, 11, 18, { noKit: true }); ok(pK.dash / p0.dash > 1.6 && pK.dash / p0.dash < 2.4, 'P1: Băng Nhi at 18 SC at gate 14: about twice the dash-ins (' + p0.dash + ' → ' + pK.dash + ')'); await quit();
  for (const g of [11, 5]) { await open(g, 'bangnhi'); await at(400); a = await decide(1500, 7, 18); ok(a.dash === 0, (g === 11 ? 'N3: gate 11 (dash not taught yet)' : 'N4: world 1') + ': no dash-in against Băng Nhi (' + a.dash + ')'); await quit(); }
  await open(14, 'thachlao'); await at(400);
  a = await decide(1500, 7, 9); c = await decide(1500, 7, 9, { noKit: true }); ok(same(a, c), 'N5: Thạch Lão not in stance: AI unchanged');
  a = await decide(1500, 7, 20, { stance: true }); c = await decide(1500, 7, 20, { stance: true, noKit: true }); ok(same(a, c), 'N6: stance but out of reach: AI unchanged');
  const pS = await decide(3000, 5, 9, { stance: true }), tot = 3000;
  ok(pS.grab / tot > .26 && pS.grab / tot < .34 && pS.back / tot > .56 && pS.back / tot < .72, 'P2: stance in reach at gate 14: grab ' + (100 * pS.grab / tot).toFixed(1) + ' %, back off ' + (100 * pS.back / tot).toFixed(1) + ' %'); await quit();
  for (const g of [9, 5]) { await open(g, 'thachlao'); await at(400); a = await decide(1500, 5, 9, { stance: true }); ok(a.grab === 0 && a.back / 1500 > .85, 'N7: gate ' + g + ' (no grabs yet): the grab share turns into backing off (back ' + (100 * a.back / 1500).toFixed(1) + ' %, grab ' + a.grab + ')'); await quit(); }
  await open(14, 'tibup'); await at(400); a = await decide(1500, 9, 9, { block: true }); c = await decide(1500, 9, 9, { block: true, noKit: true }); ok(same(a, c), 'N8: Tí blocking in reach: no stance rule (identical decisions)'); await quit();

  /* ---- f2 telemetry ---- */
  await open(12, 'thachlao'); await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 1; }); await at(45); await press('lt'); await sleep(2200);
  const ev = await p.evaluate(() => __ev.filter(e => e.n === 'gate_clear').pop()); const f = ev.x.split('|');
  ok(f[0] === 'f2' && f.length === 12 && /^p\d+\.\d+\.\d+s\d+\.\d+\.\d+$/.test(f[11]) && ev.x.length <= 120, 'gate_clear sends f2 with a 12th kit field: ' + ev.x);
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
