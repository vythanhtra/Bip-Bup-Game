/* ADR-009 wave A (Owner 2026-11-01: extend foe identities to the other foes): Lính Cỏ, Lính Đèn Lồng, Vịt Giả Gà, Anh Hai Hàng Hiệu, behind ?foes=1.
   New engine pieces, each with a negative test: several hits per move with uneven gaps, foe feints, keeping distance, a 'mid' band, a reaction to the hero's swing,
   a blinding flash carried by a foe move. With the flag off the four keep the old profile and never use a foe move. */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const errs = [];
  const page = async q => { const p = await (await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true })).newPage(); await p.route(/supabase\.co/, r => r.abort()); p.on('pageerror', e => errs.push(e.message)); await p.goto(U + '?lang=vi' + q); await p.waitForTimeout(900); return p; };
  const open = async (p, g, still) => { await p.evaluate(g => { __bakhi.save.seen = { t0: 1, pro: 1, kb: 1, [g]: 1 }; __bakhi.save.unlocked = 40; __bakhi.startGate(g, { skipDlg: true }); const B = __bakhi.get(); if (B.cine) B.cine.t0 = -1e9; }, g);
    await p.waitForFunction(() => __bakhi.get().state === 'fight', null, { timeout: 15000 });
    if (still) await freeze(p); };
  const freeze = p => p.evaluate(() => { const B = __bakhi.get(); B.Fs.slice(1).forEach(E => { E.ai.next = __bakhi.clock() + 1e9; E.ai.mode = 'idle'; E.st = 'idle'; E.atk = null; E.napUntil = 0; }); B.H.st = 'idle'; B.H.atk = null; B.H.hitUntil = 0; B.H.blockHeld = false; });
  const quit = async p => { await p.evaluate(() => { const q = document.getElementById('btn-quit'); if (q && q.offsetParent) q.click(); }); await p.waitForTimeout(200); };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  /* hero at d SC from the foe (foe to the right unless left), both facing each other, mid-arena */
  const place = (p, d, left) => p.evaluate(([d, left]) => { const B = __bakhi.get(), SC = __bakhi.sc(); B.H.x = B.arenaW / 2; B.E.x = B.H.x + (left ? -d : d) * SC; B.E.face = left ? 1 : -1; B.H.face = -B.E.face; B.H.st = 'idle'; B.H.y = 0; B.H.vy = 0; B.H.vx = 0; B.E.vx = 0; B.H.downUntil = 0; B.H.hitUntil = 0; B.H.blockHeld = false; B.H.invUntil = 0; B.H.hp = B.H.hmax; }, [d, !!left]);
  const rnd = (p, v) => p.evaluate(v => { window.__r0 = window.__r0 || Math.random; Math.random = v === null ? window.__r0 : () => v; }, v);
  const ai = (p, fn, near) => p.evaluate(([fn, near]) => __bakhi.foeAi(fn, 0, near), [fn, !!near]);
  /* record the game-clock times at which the hero loses HP, for ms of real time */
  const hpLog = (p, ms, hold) => p.evaluate(([ms, hold]) => new Promise(res => { const B = __bakhi.get(), SC = __bakhi.sc(), out = []; let last = B.H.hp; const t0 = performance.now();
    (function f(){ if (hold) { B.H.y = -12 * SC; B.H.vy = 0; B.H.st = 'jump'; } if (B.H.hp < last) { out.push({ t: __bakhi.clock(), d: last - B.H.hp }); last = B.H.hp; } if (performance.now() - t0 < ms) requestAnimationFrame(f); else res(out); })(); }), [ms, !!hold]);

  /* ---- flag off: the four keep the world profile and never use a foe move ---- */
  let p = await page('');
  const legacy = { 3: [.38, .2], 9: [.46, .28], 10: [.46, .28], 16: [.56, .28] };
  for (const g of [3, 9, 10, 16]) { await open(p, g, true);
    const a = await p.evaluate(() => { const E = __bakhi.get().E; return { k: E.ekey, aggr: E.ai.aggr, block: E.ai.block, foe: __bakhi.foe() }; });
    ok(a.foe === null && Math.abs(a.aggr - legacy[g][0]) < 1e-9 && Math.abs(a.block - legacy[g][1]) < 1e-9, 'flag off: gate ' + g + ' ' + a.k + ' keeps the world profile and no foe state: ' + JSON.stringify(a));
    await p.evaluate(() => { const B = __bakhi.get(); B.E.ai.next = 0; window.__foeSeen = 0; (function f(){ const E = __bakhi.get().E; if (E && E.atk && E.atk.foe) window.__foeSeen++; if (__bakhi.get().state === 'fight') requestAnimationFrame(f); })(); });
    await sleep(2500); ok(await p.evaluate(() => window.__foeSeen) === 0, 'flag off: gate ' + g + ' fights 2.5 s without any foe move');
    await quit(p); }
  await p.context().close();

  /* ---- flag on ---- */
  p = await page('&foes=1');
  const prof = { 3: ['linhco', .25, 0], 10: ['linhdem', .46, .25], 9: ['vitgia', .55, .28], 16: ['cao', .6, .2] };
  for (const g of [3, 10, 9, 16]) { await open(p, g, true);
    const a = await p.evaluate(() => { const E = __bakhi.get().E; return { k: E.ekey, aggr: E.ai.aggr, block: E.ai.block }; });
    ok(a.k === prof[g][0] && Math.abs(a.aggr - prof[g][1]) < 1e-9 && Math.abs(a.block - prof[g][2]) < 1e-9, 'K1: gate ' + g + ' ' + a.k + ' uses its own profile (aggr ' + prof[g][1] + ', block ' + prof[g][2] + '): ' + JSON.stringify(a));
    await quit(p); }

  /* Lính Cỏ: Bão Rơm lands three times on a hero in reach, none out of reach */
  await open(p, 3, true); await place(p, 8);
  await p.evaluate(() => __bakhi.foeMove('spin'));
  let log = await hpLog(p, 1400);
  ok(log.length === 3 && log.every(h => h.d >= 4), 'multi-hit: Bão Rơm lands 3 hits on a hero standing in reach: ' + JSON.stringify(log.map(h => h.d)));
  await freeze(p); await place(p, 25); await p.evaluate(() => __bakhi.foeMove('spin'));
  log = await hpLog(p, 1400); ok(log.length === 0, 'multi-hit, negative: out of reach (25 SC) the spin lands nothing');
  await freeze(p); await place(p, 8); await p.evaluate(() => __bakhi.key('b', 1)); await sleep(250); await p.evaluate(() => __bakhi.foeMove('spin')); await sleep(1400);
  const hb = await p.evaluate(() => { __bakhi.key('b', 0); const B = __bakhi.get(); return B.H.hmax - B.H.hp; });
  ok(hb > 0 && hb <= 3, 'multi-hit: each of the three hits is blocked separately, chip only (' + hb + ' HP)');
  /* mid band: Rơm Đâm from 13 SC; nothing mid from 17 SC (no far move either) */
  await freeze(p); await place(p, 13); await rnd(p, 0); let r = await ai(p, 'far'); await rnd(p, null);
  ok(r.r === true && r.atk === 'poke', "mid band: at 13 SC Lính Cỏ opens with Rơm Đâm (" + r.atk + ')');
  await freeze(p); await place(p, 17); await rnd(p, 0); r = await ai(p, 'far'); await rnd(p, null);
  ok(r.r === false && !r.atk, 'mid band, negative: at 17 SC (outside 16) Lính Cỏ has no mid or far move');
  r = await ai(p, 'react'); ok(r.r === false, 'react, negative: Lính Cỏ has no reaction move');
  await quit(p);

  /* Lính Đèn Lồng: keeps distance, twirl catches a jump, the photo blinds */
  await open(p, 10, true); await place(p, 6); await rnd(p, 0); r = await ai(p, 'keep', true); await rnd(p, null);
  ok(r.r === true && r.mode === 'walk' && r.dir === -r.face, 'keep: hero at 6 SC, Lính Đèn Lồng steps back (dir ' + r.dir + ', facing ' + r.face + ')');
  await freeze(p); await p.evaluate(() => { const B = __bakhi.get(), SC = __bakhi.sc(); B.E.x = 10 * SC; B.H.x = 16 * SC; B.E.face = 1; }); await rnd(p, 0); r = await ai(p, 'keep', true); await rnd(p, null);
  ok(r.r === false, 'keep, negative: backed into the left wall it does not step back');
  await freeze(p); await place(p, 12); await rnd(p, 0); r = await ai(p, 'keep', true); await rnd(p, null);
  ok(r.r === false, 'keep, negative: at 12 SC (outside 10) it does not retreat');
  await freeze(p); await place(p, 13); await rnd(p, .99); r = await ai(p, 'far'); await rnd(p, 0); const hold = await ai(p, 'keep', false); await rnd(p, null);
  ok(r.r === false && hold.r === true && hold.mode === 'idle', 'keep: at 13 SC with no attack this time it waits (' + hold.mode + ') instead of walking in');
  await freeze(p); await place(p, 18); await rnd(p, 0); r = await ai(p, 'keep', false); await rnd(p, null);
  ok(r.r === false, 'keep, negative: at 18 SC (outside 16) it does not hold, so it walks in as before');
  await freeze(p); await place(p, 13); await rnd(p, 0); r = await ai(p, 'far'); await rnd(p, null);
  ok(r.r === true && (r.atk === 'lamp' || r.atk === 'snap'), 'mid band: at 13 SC Lính Đèn Lồng swings the lamp or takes a photo (' + r.atk + ')');
  await freeze(p); await place(p, 9); await p.evaluate(() => __bakhi.foeMove('twirl')); log = await hpLog(p, 1100, true);
  ok(log.length >= 1, 'air: Đèn Xoay catches a hero held 12 SC up in a jump (' + log.length + ' hits)');
  await freeze(p); await place(p, 9); await p.evaluate(() => __bakhi.foeMove('lamp')); log = await hpLog(p, 800, true);
  ok(log.length === 0, 'air, negative: Đèn Quật (no air flag) passes under the same jump');
  await freeze(p); await place(p, 12); await p.evaluate(() => __bakhi.foeMove('snap')); await sleep(800);
  let bl = await p.evaluate(() => { const B = __bakhi.get(); return { blind: B.blindUntil > __bakhi.clock(), hurt: B.H.hp < B.H.hmax }; });
  ok(bl.blind && bl.hurt, 'flash: Chụp Ảnh Lóe lands and blinds the hero');
  await freeze(p); await p.evaluate(() => { __bakhi.get().blindUntil = 0; }); await place(p, 12);
  await p.evaluate(() => __bakhi.key('b', 1)); await sleep(250); await p.evaluate(() => __bakhi.foeMove('snap')); await sleep(800);
  bl = await p.evaluate(() => { __bakhi.key('b', 0); const B = __bakhi.get(); return B.blindUntil > __bakhi.clock() || B.H.st === 'hit'; }); ok(!bl, 'flash, negative: a blocked photo does not blind');
  await quit(p);

  /* Vịt Giả Gà: a fake swing never lands; the real one does */
  await open(p, 9, true); await place(p, 8); await p.evaluate(() => __bakhi.foeMove('wings', 0, true));
  log = await hpLog(p, 900); let fe = await p.evaluate(() => ({ st: __bakhi.get().E.st, fk: __bakhi.foe().K.fk }));
  ok(log.length === 0 && fe.st !== 'atk' && fe.fk === 1, 'feint: a faked Cánh Quạt stops before it lands, no damage (feints counted: ' + fe.fk + ')');
  await freeze(p); await place(p, 8); await p.evaluate(() => __bakhi.foeMove('wings')); log = await hpLog(p, 1300);
  ok(log.length === 3, 'feint, negative: the real Cánh Quạt lands 3 times (' + log.length + ')');
  await freeze(p); await place(p, 8); await rnd(p, 0); r = await ai(p, 'close'); await rnd(p, null);
  ok(r.r === true && r.feint === true, 'feint: with a low roll foeClose fakes the move');
  await freeze(p); await rnd(p, .99); r = await ai(p, 'close'); await rnd(p, null);
  ok(r.r === true && r.feint === false, 'feint: with a high roll it is real');
  await quit(p);

  /* Anh Hai: Hàng Xịn answers a swing, armoured; Mua 2 Tặng 1 has a late third hit */
  await open(p, 16, true); await place(p, 8); await p.evaluate(() => { const B = __bakhi.get(); B.H.st = 'atk'; B.H.atk = { su: 5000, ac: 0, re: 0, rg: 0, dmg: 0 }; B.H.atkT = __bakhi.clock(); B.H.feint = false; }); await rnd(p, 0); r = await ai(p, 'react'); await rnd(p, null);
  ok(r.r === true && r.atk === 'deal', 'react: Anh Hai answers a swing in reach with Hàng Xịn');
  const sa = await p.evaluate(() => { const B = __bakhi.get(); B.H.st = 'idle'; B.H.atk = null; const hp = B.E.hp; __bakhi.hitE('lt'); return { st: B.E.st, atk: B.E.atk && B.E.atk.foe, dmg: hp - B.E.hp }; });
  ok(sa.st === 'atk' && sa.atk === 'deal' && sa.dmg > 0, 'K5: a jab during Hàng Xịn deals damage (' + sa.dmg + ') but does not stop it');
  await sleep(700); let hs = await p.evaluate(() => __bakhi.get().H.st);
  ok(hs === 'down', 'Hàng Xịn knocks an unguarded hero down (' + hs + ')');
  await freeze(p); await place(p, 8); await p.evaluate(() => { const B = __bakhi.get(); B.H.st = 'atk'; B.H.atk = { su: 5000, ac: 0, re: 0, rg: 0, dmg: 0 }; B.H.atkT = __bakhi.clock(); B.H.feint = true; }); await rnd(p, 0); r = await ai(p, 'react'); await rnd(p, null);
  ok(r.r === false, 'react, negative: a hero feint does not trigger Hàng Xịn');
  await freeze(p); await place(p, 20); await p.evaluate(() => { const B = __bakhi.get(); B.H.st = 'atk'; B.H.atk = { su: 5000, ac: 0, re: 0, rg: 0, dmg: 0 }; B.H.atkT = __bakhi.clock(); B.H.feint = false; }); await rnd(p, 0); r = await ai(p, 'react'); await rnd(p, null);
  ok(r.r === false, 'react, negative: a swing from 20 SC (outside 12) does not trigger it');
  await freeze(p); await place(p, 8); await p.evaluate(() => __bakhi.foeMove('combo')); log = await hpLog(p, 1500);
  const g1 = log[1] && log[1].t - log[0].t, g2 = log[2] && log[2].t - log[1].t;
  ok(log.length === 3 && g2 - g1 > 150, 'gaps: Mua 2 Tặng 1 lands 3 hits, the third late (' + Math.round(g1) + ' ms then ' + Math.round(g2) + ' ms)');
  await quit(p);

  /* live AI: each gate fights 4 s with its own moves, no errors */
  for (const g of [3, 10, 9, 16]) { await open(p, g, false);
    await p.evaluate(() => { window.__mv = {}; (function f(){ const B = __bakhi.get(); if (!B) return; B.Fs.slice(1).forEach(E => { if (E.atk && E.atk.foe) window.__mv[E.atk.foe] = 1; }); if (B.H.hp < 30) B.H.hp = B.H.hmax; if (B.state === 'fight') requestAnimationFrame(f); })(); });
    await sleep(4500); const mv = await p.evaluate(() => Object.keys(window.__mv));
    ok(mv.length >= 1, 'live: gate ' + g + ' uses its own moves (' + mv.join(', ') + ')'); await quit(p); }

  ok(errs.length === 0, 'no page errors: ' + errs.slice(0, 3).join(' | '));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
