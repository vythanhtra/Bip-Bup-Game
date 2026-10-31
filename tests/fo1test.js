/* ADR-009 foe identities prototype (?foes=1), sample gates 6 (Trâu Lười) and 8 (Lý Trưởng), plus the shared anti-mash rule (Owner Q2).
   Each engine block has a negative test (spec section 4); with the flag off nothing changes (K1 parity, no foe state, f1 telemetry). */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const errs = [];
  const page = async q => { const p = await (await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true })).newPage(); await p.route(/supabase\.co/, r => r.abort()); p.on('pageerror', e => errs.push(e.message)); await p.goto(U + '?lang=vi' + q); await p.waitForTimeout(900); return p; };
  const open = async (p, g, still) => { await p.evaluate(g => { __bakhi.save.seen = { t0: 1, pro: 1, kb: 1, [g]: 1 }; __bakhi.save.unlocked = 40; __bakhi.startGate(g, { skipDlg: true }); const B = __bakhi.get(); if (B.cine) B.cine.t0 = -1e9; }, g);
    await p.waitForFunction(() => __bakhi.get().state === 'fight', null, { timeout: 15000 });
    if (still) await p.evaluate(() => { const B = __bakhi.get(); B.Fs.slice(1).forEach(E => { E.ai.next = __bakhi.clock() + 1e9; E.ai.mode = 'idle'; E.st = 'idle'; E.atk = null; E.napUntil = 0; }); }); };
  const quit = async p => { await p.evaluate(() => { const q = document.getElementById('btn-quit'); if (q && q.offsetParent) q.click(); }); await p.waitForTimeout(200); };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const zCount = p => p.evaluate(async () => { const P = CanvasRenderingContext2D.prototype, f0 = P.fillText; let n = 0; P.fillText = function(t){ if (t === 'z') n++; return f0.apply(this, arguments); }; await new Promise(r => setTimeout(r, 200)); P.fillText = f0; return n; });   /* "z" drawn in 200 ms */
  const near = p => p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 5 * __bakhi.sc(); B.H.st = 'idle'; B.H.hitUntil = 0; B.E.invUntil = 0; });

  /* ---- flag off: parity ---- */
  let p = await page('');
  ok(await p.evaluate(() => __bakhi.foes()) === false, 'flag off: FOES is false');
  await open(p, 6, true);
  let ai = await p.evaluate(() => { const E = __bakhi.get().E; return { aggr: E.ai.aggr, block: E.ai.block, jump: E.ai.jump, foe: __bakhi.foe() }; });
  ok(ai.foe === null && Math.abs(ai.aggr - .38) < 1e-9 && Math.abs(ai.block - .2) < 1e-9 && Math.abs(ai.jump - .06) < 1e-9, 'K1 flag off: Trâu Lười keeps the world-1 profile (aggr .38, block .2, jump .06) and no foe state: ' + JSON.stringify(ai));
  await quit(p); await open(p, 8, true);
  for (let i = 0; i < 6; i++) { await near(p); await p.evaluate(() => __bakhi.hitE('lt')); await sleep(120); }
  let st = await p.evaluate(() => { const E = __bakhi.get().E; return { st: E.st, sa: E.saUntil > __bakhi.clock(), x: __bakhi.tl().x }; });
  ok(st.st === 'hit' && !st.sa, 'flag off: six jabs in a row on Lý Trưởng, no brace, still in hitstun (' + st.st + ')');
  ok(/^f1\|/.test(st.x) && st.x.split('|').length === 11, 'flag off: telemetry stays f1 with 11 fields: ' + st.x);
  await quit(p); await p.context().close();

  /* ---- flag on ---- */
  p = await page('&foes=1');
  ok(await p.evaluate(() => __bakhi.foes()) === true, 'flag on: FOES is true');

  /* K1: per-enemy profile only where FOE_KIT has one */
  await open(p, 6, true);
  ai = await p.evaluate(() => { const E = __bakhi.get().E; return { aggr: E.ai.aggr, block: E.ai.block, jump: E.ai.jump }; });
  ok(ai.aggr === .5 && ai.block === 0 && ai.jump === 0, 'K1: Trâu Lười uses its own profile (aggr .5, never blocks, never jumps): ' + JSON.stringify(ai));

  /* K4 + K5: the charge winds up in place, then travels; jumping over it avoids it; it is not interrupted during startup */
  await p.evaluate(() => { const B = __bakhi.get(), SC = __bakhi.sc(); B.H.x = B.arenaW / 2 - 10 * SC; B.E.x = B.H.x + 20 * SC; B.E.face = -1; B.H.face = 1; });
  const x0 = await p.evaluate(() => { __bakhi.foeMove('charge'); return __bakhi.get().E.x; });
  await sleep(400);
  let c = await p.evaluate(() => { const E = __bakhi.get().E; return { x: E.x, st: E.st, sa: E.saUntil > __bakhi.clock() }; });
  ok(Math.abs(c.x - x0) < 1 && c.st === 'atk' && c.sa, 'K4: the charge stays put while it winds up (moved ' + Math.round(c.x - x0) + ' px), armoured');
  const hp0 = await p.evaluate(() => __bakhi.get().E.hp);
  c = await p.evaluate(() => { __bakhi.hitE('lt'); const E = __bakhi.get().E; return { st: E.st, atk: E.atk && E.atk.foe, hp: E.hp }; });
  ok(c.st === 'atk' && c.atk === 'charge' && c.hp < hp0, 'K5: a jab during the wind-up deals damage (' + (hp0 - c.hp) + ') but does not stop the charge');
  const hh0 = await p.evaluate(() => __bakhi.get().H.hp);
  await sleep(250);   /* jump just before the 800 ms wind-up ends, so the hero is high when the bull arrives */
  await p.evaluate(() => { __bakhi.key('u', 1); }); await sleep(60); await p.evaluate(() => __bakhi.key('u', 0));
  await sleep(1200);   /* past the end of the move (800 + 420 + 520 ms) */
  c = await p.evaluate(() => { const B = __bakhi.get(); return { hp: B.H.hp, ex: B.E.x, aw: B.arenaW, K: __bakhi.foe().K.ch }; });
  ok(c.hp === hh0 && c.K.miss === 1, 'K4 negative: jumping over the charge takes no damage, counted as a miss: ' + JSON.stringify(c.K));
  ok(c.ex >= 8 * await p.evaluate(() => __bakhi.sc()) && c.ex <= c.aw, 'K4 negative: the charge never leaves the arena (x ' + Math.round(c.ex) + ' of ' + c.aw + ')');
  await p.evaluate(() => { const B = __bakhi.get(), SC = __bakhi.sc(); B.E.atk = null; B.E.st = 'idle'; B.H.x = B.arenaW / 2 - 10 * SC; B.E.x = B.H.x + 20 * SC; B.E.face = -1; __bakhi.foeMove('charge'); });
  await sleep(1900);
  c = await p.evaluate(() => { const B = __bakhi.get(); return { hp: B.H.hp, K: __bakhi.foe().K.ch }; });
  ok(c.hp < hh0 && c.K.hit === 1, 'K4: standing still, the charge lands (' + (hh0 - c.hp) + ' damage, ' + JSON.stringify(c.K) + ')');
  await p.evaluate(() => { const B = __bakhi.get(), SC = __bakhi.sc(); B.E.atk = null; B.E.st = 'idle'; B.E.napUntil = 0; B.H.x = B.arenaW / 2 - 10 * SC; B.E.x = B.H.x + 20 * SC; __bakhi.foeMove('charge'); });
  ok(await zCount(p) === 0, 'K7: no "z" over the awake, charging bull (z must mean asleep)'); await sleep(1700);

  /* K7: nap; three hits wake it with an armoured horn; never naps right after being hit */
  await p.evaluate(() => { const B = __bakhi.get(); B.E.atk = null; B.E.st = 'idle'; B.H.st = 'idle'; B.H.hitUntil = 0; B.H.hp = B.H.hmax; __bakhi.foeNap(4000); });
  let n = await p.evaluate(() => __bakhi.foe().E[0].nap); ok(n && await zCount(p) > 0, 'K7: the bull dozes, shown by z');
  for (let i = 0; i < 2; i++) { await near(p); await p.evaluate(() => __bakhi.hitE('lt')); await sleep(150); }
  c = await p.evaluate(() => ({ e: __bakhi.foe().E[0], K: __bakhi.foe().K }));
  ok(c.e.nap && c.K.wake === 0, 'K7: two hits on a dozing bull do not wake it');
  await near(p); await p.evaluate(() => __bakhi.hitE('lt'));
  c = await p.evaluate(() => ({ e: __bakhi.foe().E[0], K: __bakhi.foe().K }));
  ok(!c.e.nap && c.K.wake === 1 && c.e.atk === 'horn' && c.e.sa, 'K7: the third hit wakes it with an armoured horn: ' + JSON.stringify(c.e));
  await p.evaluate(() => { const B = __bakhi.get(); B.E.atk = null; B.E.st = 'idle'; B.E.lastHitT = __bakhi.clock(); B.E.napCheck = 0; B.E.ai.next = 0; });
  let napped = false; for (let i = 0; i < 20; i++) { await sleep(50); napped = napped || await p.evaluate(() => __bakhi.foe().E[0].nap); }
  ok(!napped, 'K7 negative: within 1.5 s of being hit it never dozes off (20 checks)');
  await quit(p);

  /* K6: Lý Trưởng braces after four landed hits in a row */
  await open(p, 8, true);
  ai = await p.evaluate(() => { const E = __bakhi.get().E; return { aggr: E.ai.aggr, block: E.ai.block }; });
  ok(ai.aggr === .45 && ai.block === .3, 'K1: Lý Trưởng profile (aggr .45, block .3)');
  for (let i = 0; i < 3; i++) { await near(p); await p.evaluate(() => __bakhi.hitE('lt')); await sleep(150); }
  c = await p.evaluate(() => ({ e: __bakhi.foe().E[0], K: __bakhi.foe().K }));
  ok(c.e.run === 3 && c.K.gong === 0 && c.e.st === 'hit', 'K6: three in a row: warned, no brace yet (run ' + c.e.run + ')');
  await near(p); await p.evaluate(() => __bakhi.hitE('lt'));
  c = await p.evaluate(() => ({ e: __bakhi.foe().E[0], K: __bakhi.foe().K }));
  ok(c.K.gong === 1 && c.e.atk === 'gong' && c.e.sa && c.e.st === 'atk', 'K6: the fourth hit makes him brace and strike back (28, knocks down), armoured: ' + JSON.stringify(c.e));
  const hb = await p.evaluate(() => __bakhi.get().H.hp); await sleep(600);
  ok(await p.evaluate(() => __bakhi.get().H.hp) < hb, 'K6: the counter lands on a player who keeps standing there');
  await p.evaluate(() => { const B = __bakhi.get(); B.E.atk = null; B.E.st = 'idle'; B.H.hp = B.H.hmax; B.H.st = 'idle'; B.H.hitUntil = 0; });
  await sleep(1600);
  for (let i = 0; i < 3; i++) { await near(p); await p.evaluate(() => __bakhi.hitE('lt')); await sleep(150); }
  await sleep(1600);
  for (let i = 0; i < 3; i++) { await near(p); await p.evaluate(() => __bakhi.hitE('lt')); await sleep(150); }
  c = await p.evaluate(() => ({ e: __bakhi.foe().E[0], K: __bakhi.foe().K }));
  ok(c.K.gong === 1 && c.e.run === 3, 'K6 negative: three hits, a 1.6-second pause (the in-a-row window is 1.5 s), three hits: no second brace (run restarted at ' + c.e.run + ')');
  await sleep(1600);
  for (let i = 0; i < 2; i++) { await near(p); await p.evaluate(() => __bakhi.hitE('lt')); await sleep(150); }
  await p.evaluate(() => { __bakhi.get().H.lastHitT = __bakhi.clock(); });   /* the player gets hit in between */
  for (let i = 0; i < 2; i++) { await near(p); await p.evaluate(() => __bakhi.hitE('lt')); await sleep(150); }
  c = await p.evaluate(() => ({ e: __bakhi.foe().E[0], K: __bakhi.foe().K }));
  ok(c.K.gong === 1 && c.e.run === 2, 'K6 negative: being hit resets the count (run ' + c.e.run + ')');
  await sleep(1600);
  for (let i = 0; i < 5; i++) { await near(p); await p.evaluate(k => __bakhi.hitE(k), i % 2 ? 'sp' : 'sup'); await sleep(120); }
  c = await p.evaluate(() => ({ e: __bakhi.foe().E[0], K: __bakhi.foe().K }));
  ok(c.K.gong === 1, 'K6 negative: rushes and supers do not count toward the brace');
  await quit(p);

  /* shared anti-mash rule on an enemy without its own (Lính Cỏ, gate 3) */
  await open(p, 3, true);
  for (let i = 0; i < 4; i++) { await near(p); await p.evaluate(() => __bakhi.hitE('lt')); await sleep(120); }
  c = await p.evaluate(() => ({ e: __bakhi.foe().E[0], K: __bakhi.foe().K }));
  ok(c.K.brk === 0 && c.e.run === 4, 'shared rule negative: four in a row, no break-out yet');
  const hx0 = await p.evaluate(() => __bakhi.get().H.x);
  await near(p); const hxn = await p.evaluate(() => __bakhi.get().H.x); await p.evaluate(() => __bakhi.hitE('lt')); await sleep(300);
  c = await p.evaluate(() => ({ e: __bakhi.foe().E[0], K: __bakhi.foe().K, hx: __bakhi.get().H.x, ex: __bakhi.get().E.x, inv: __bakhi.get().E.invUntil > __bakhi.clock() - 300 }));
  ok(c.K.brk === 1 && c.e.st !== 'hit' && c.e.run === 0, 'shared rule: the fifth hit in a row and the enemy breaks out (' + c.e.st + ')');
  ok(Math.abs(c.hx - c.ex) > Math.abs(hxn - c.ex) + 2 * await p.evaluate(() => __bakhi.sc()), 'shared rule: the player is pushed back (' + Math.round(Math.abs(hxn - c.ex)) + ' -> ' + Math.round(Math.abs(c.hx - c.ex)) + ' px)');
  await quit(p);

  /* telemetry f2 with the foe field (13th), kit field empty without ?kits=1 */
  await open(p, 6, false); await sleep(300);
  const x = await p.evaluate(() => __bakhi.tl().x), f = x.split('|');
  ok(f[0] === 'f2' && f.length === 13 && f[11] === '' && /^o\d+\.\d+\.\d+\.\d+\.\d+\.\d+\.\d+\.\d+$/.test(f[12]) && x.length <= 120, 'telemetry: f2 with the foe summary as field 13: ' + x);
  await quit(p);

  /* real play: mashing jabs on Lính Cỏ triggers the shared rule */
  await open(p, 3, false);
  for (let i = 0; i < 40; i++) { await p.evaluate(() => { const B = __bakhi.get(); if (Math.abs(B.H.x - B.E.x) > 9 * __bakhi.sc()) B.H.x = B.E.x - 8 * __bakhi.sc(); __bakhi.press('lt'); }); await sleep(90); }
  c = await p.evaluate(() => __bakhi.foe().K);
  ok(c.brk >= 1, 'real input: forty mashed jabs make Lính Cỏ break out at least once (brk ' + c.brk + ')');
  await quit(p);

  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
