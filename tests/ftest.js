/* fight engine B (ADR-005): two-thumb 2D fighter. Countdown + peck, movement, jump, block/perfect block, jab chain → hook, heavy, special/super, enemy AI attacks, KO, best-of-3 bosses, timeout, pad visibility */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi'); await p.waitForTimeout(900);
  const F = () => p.evaluate(() => __bakhi.fight());
  const press = k => p.evaluate(k => __bakhi.press(k), k);
  const hold = (k, ms) => p.evaluate(async ({ k, ms }) => { __bakhi.key(k, 1); await new Promise(r => setTimeout(r, ms)); __bakhi.key(k, 0); }, { k, ms });
  const freeze = () => p.evaluate(() => { const B = __bakhi.get(); B.E.ai.next = performance.now() + 1e9; B.E.ai.mode = 'idle'; B.E.st = 'idle'; B.E.blockHeld = false; B.E.atk = null; });
  await p.evaluate(() => { __bakhi.save.seen = { t0: 1, fk: 1, pr: 1, w1: 1, pro: 1 }; __bakhi.startGate(1, { skipDlg: true }); });
  await p.waitForTimeout(500); let f = await F(); ok(f.fight && f.state === 'count' && f.H && f.E && f.hhp === 120, 'gate starts in count with two fighters, hero HP 120');
  ok(await p.evaluate(() => !document.getElementById('pad').hidden && document.getElementById('hud-hearts').hidden), 'virtual pad shown, hearts hidden');
  await press('lt'); await p.waitForTimeout(60); await press('lt'); await p.waitForTimeout(60); f = await F(); ok(f.hp === 100 && (f.hhp === 115 || f.hhp === 120), 'attack presses before the beep: forgiven once, then pecked -5, enemy untouched');
  await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(120); f = await F(); ok(f.state === 'fight', 'BÍP opens the round');
  await freeze();
  /* movement + facing */
  const x0 = f.H.x; await hold('r', 300); f = await F(); ok(f.H.x > x0 + 20, 'walk right moves the hero (' + x0 + ' -> ' + f.H.x + ')');
  await p.waitForTimeout(700); const x1 = f.H.x; await hold('l', 300); f = await F(); ok(f.H.x < x1 - 20 && f.H.face === 1, 'walk left, still facing the enemy (' + x1 + ' -> ' + f.H.x + ', face ' + f.H.face + ')');
  /* jump */
  await press('u'); await p.waitForTimeout(200); f = await F(); ok(f.H.y < -10 && f.H.st === 'jump', 'jump leaves the ground'); await p.waitForTimeout(700); f = await F(); ok(f.H.y === 0 && f.H.st === 'idle', 'lands back to idle');
  /* walk into range and jab chain: lt lt hv = 8 + 8 + 22 */
  await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 42; B.H.vx = 0; B.E.vx = 0; }); const hp0 = (await F()).hp;
  await press('lt'); await p.waitForTimeout(200); f = await F(); ok(hp0 - f.hp === 8 && f.E.st === 'hit', 'jab lands for 8, enemy in hitstun');
  await press('lt'); await p.waitForTimeout(220); f = await F(); ok(hp0 - f.hp === 16, 'second jab chains (16 total)');
  await press('hv'); await p.waitForTimeout(320); f = await F(); ok(hp0 - f.hp === 38 && f.E.st === 'down', 'hook finisher 22 knocks down (38 total)');
  ok(f.H.meter > 15, 'meter fills from hits (' + f.H.meter + ')');
  await p.waitForTimeout(1200); await freeze();
  /* heavy on its own */
  await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 45; B.H.vx = 0; B.E.vx = 0; B.E.st = 'idle'; B.E.blockHeld = false; }); const hp1 = (await F()).hp; await press('hv'); await p.waitForTimeout(450); f = await F(); ok(hp1 - f.hp === 18, 'heavy punch deals 18 (' + (hp1 - f.hp) + ')');
  /* enemy blocks: chip only */
  await p.waitForTimeout(600); await p.evaluate(() => { const B = __bakhi.get(); B.E.st = 'block'; B.E.blockHeld = true; B.E.blockT = 0; B.E.ai.mode = 'block'; B.E.ai.next = performance.now() + 2000; B.H.x = B.E.x - 45; B.H.vx = 0; B.E.vx = 0; }); const hp2 = (await F()).hp; await press('lt'); await p.waitForTimeout(250); f = await F(); ok(hp2 - f.hp === 1, 'blocked jab chips 1 (' + (hp2 - f.hp) + ')');
  /* hero blocks an enemy heavy: chip; perfect block → counter x2 */
  await freeze(); await p.evaluate(() => { const B = __bakhi.get(); B.E.st = 'idle'; B.E.blockHeld = false; B.E.ai.next = performance.now() + 1e9; B.H.st = 'idle'; B.H.x = B.E.x - 50; });
  await p.evaluate(() => __bakhi.key('b', 1)); await p.waitForTimeout(300); await p.evaluate(() => { __bakhi.get().H.x = __bakhi.get().E.x - 45; }); const hh1 = (await F()).hhp;
  await p.evaluate(() => { const B = __bakhi.get(); B.E.st = 'atk'; B.E.atk = Object.assign({}, { su: 60, ac: 100, re: 200, rg: 11.5, dmg: 18, hs: 450, kb: 4, lbl: 'heavyLbl' }); B.E.atkKey = 'hv'; B.E.atkT = performance.now(); B.E.hitFlag = false; B.E.feint = false; });
  await p.waitForTimeout(400); f = await F(); ok(hh1 - f.hhp === 3 && f.H.st !== 'hit', 'held block takes 15% chip (-' + (hh1 - f.hhp) + ')'); await p.evaluate(() => __bakhi.key('b', 0));
  await p.waitForTimeout(400); await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 45; B.H.vx = 0; B.E.st = 'atk'; B.E.atk = Object.assign({}, { su: 60, ac: 100, re: 200, rg: 11.5, dmg: 18, hs: 450, kb: 4, lbl: 'heavyLbl' }); B.E.atkKey = 'hv'; B.E.atkT = performance.now(); B.E.hitFlag = false; B.E.feint = false; B.H.st = 'idle'; });
  await p.evaluate(() => __bakhi.key('b', 1)); const hh2 = (await F()).hhp; await p.waitForTimeout(400); await p.evaluate(() => __bakhi.key('b', 0)); f = await F(); ok(hh2 === f.hhp, 'perfect block: no chip');
  await p.evaluate(() => { const B = __bakhi.get(); B.E.st = 'idle'; B.E.atk = null; B.E.blockHeld = false; B.H.st = 'idle'; B.H.x = B.E.x - 45; B.H.vx = 0; B.E.vx = 0; }); const hp3 = (await F()).hp; await press('lt'); await p.waitForTimeout(220); f = await F(); ok(hp3 - f.hp === 16, 'counter after perfect block doubles the jab (' + (hp3 - f.hp) + ')');
  /* special at 50, super at 100 */
  await p.waitForTimeout(500); await freeze(); await p.evaluate(() => { const B = __bakhi.get(); B.E.st = 'idle'; B.E.blockHeld = false; B.H.st = 'idle'; B.H.meter = 60; B.H.x = B.E.x - 60; B.H.vx = 0; B.E.vx = 0; }); const hp4 = (await F()).hp; await press('sp'); await p.waitForTimeout(500); f = await F(); ok(hp4 - f.hp === 24 && f.H.meter >= 10 && f.H.meter <= 30, 'Ba Khi rush deals 24 and spends 50 (' + (hp4 - f.hp) + ', meter ' + f.H.meter + ')');
  await p.waitForTimeout(900); await freeze(); await p.evaluate(() => { const B = __bakhi.get(); B.E.st = 'idle'; B.E.blockHeld = false; B.E.hp = 100; B.H.st = 'idle'; B.H.meter = 100; B.H.x = B.E.x - 60; B.H.vx = 0; B.E.vx = 0; }); await press('sp'); await p.waitForTimeout(700); f = await F(); ok(100 - f.hp >= 24 && 100 - f.hp <= 48 && f.H.meter <= 40, 'Tí super flurry lands 4-8 hits of 6 and spends the meter (' + (100 - f.hp) + ', meter ' + f.H.meter + ')');
  /* enemy AI attacks on its own and can hit the hero */
  await p.waitForTimeout(1000); await p.evaluate(() => { const B = __bakhi.get(); B.E.st = 'idle'; B.E.ai.next = 0; B.E.ai.mode = 'idle'; B.E.ai.aggr = 1; B.E.ai.feint = 0; B.H.st = 'idle'; B.H.x = B.E.x - 50; });
  await p.waitForFunction(() => { const f = __bakhi.fight(); return f && f.E.st === 'atk' && !f.E.feint; }, null, { timeout: 4000 }); ok(true, 'enemy AI launches an attack');
  const hh3 = (await F()).hhp; await p.waitForFunction(h => __bakhi.fight().hhp < h, hh3, { timeout: 4000 }); f = await F(); ok(f.hhp < hh3, 'enemy attack lands on the hero (' + hh3 + ' -> ' + f.hhp + ')');
  /* KO → round end → auto next gate */
  await freeze(); await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 3; B.E.st = 'idle'; B.H.st = 'idle'; B.H.hitUntil = 0; B.H.x = B.E.x - 45; B.H.vx = 0; B.E.vx = 0; B.E.hitUntil = 0; B.E.invUntil = 0; }); await press('lt'); await p.waitForTimeout(250); f = await F(); ok(f.state === 'rend' && f.rwins === 1 && f.E.st === 'down', 'KO → round end, enemy down ' + JSON.stringify({ st: f.state, w: f.rwins, E: f.E, H: f.H }));
  await p.waitForTimeout(2000); ok(await p.evaluate(() => __bakhi.get().state === 'won'), 'regular gate: one round wins'); await p.waitForTimeout(1700); ok(await p.evaluate(() => __bakhi.get().n === 2 && ['cine', 'dialog', 'count'].indexOf(__bakhi.get().state) >= 0), 'auto-advances to gate 2 (opens with the gate scene)');
  ok(await p.evaluate(() => __bakhi.save.hitsMode === 'ko' && __bakhi.save.hits.length === 1), 'KO time recorded');
  /* boss best of 3 */
  await p.evaluate(() => { __bakhi.startGate(8, { skipDlg: true }); __bakhi.beep(); }); await p.waitForTimeout(150); await freeze(); f = await F(); ok(f.state === 'fight' && f.rnum === 1, 'boss round 1');
  await p.evaluate(() => { const B = __bakhi.get(); B.H.hp = 10; B.rEnd = performance.now() - 1; }); await p.waitForTimeout(150); f = await F(); ok(f.state === 'rend' && f.rlost === 1, 'timeout with lower HP% loses the round');
  await p.waitForTimeout(2000); f = await F(); ok(f.state === 'count' && f.rnum === 2 && f.hhp === 120, 'round 2 with HP refilled');
  await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(150); await freeze(); await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 1; B.H.x = B.E.x - 45; B.H.vx = 0; B.E.vx = 0; B.H.hitUntil = 0; B.H.st = 'idle'; }); await press('lt'); await p.waitForTimeout(2200); f = await F(); ok(f.rwins === 1 && f.rnum === 3 && f.state === 'count', '1-1 → round 3');
  await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(150); await p.evaluate(() => { const B = __bakhi.get(); B.H.hp = 1; B.rEnd = performance.now() - 1; }); await p.waitForTimeout(2200);
  ok(await p.evaluate(() => __bakhi.get().state === 'lost'), 'boss 1-2 → gate lost'); ok(await p.evaluate(() => document.getElementById('pad').hidden), 'pad hidden after the gate');
  await p.evaluate(() => __bakhi.up()); await p.waitForTimeout(300); f = await F(); ok(f && f.state === 'count' && f.rnum === 1, 'tap after loss restarts the gate');
  await p.evaluate(() => { document.getElementById('btn-quit').click(); }); ok(await p.evaluate(() => document.getElementById('pad').hidden), 'quit hides the pad');
  /* keyboard drives the pad; legacy engine for run */
  await p.evaluate(() => { __bakhi.startGate(2, { skipDlg: true }); __bakhi.beep(); }); await p.waitForTimeout(150); await freeze(); const kx = (await F()).H.x; await p.keyboard.down('ArrowRight'); await p.waitForTimeout(250); await p.keyboard.up('ArrowRight'); f = await F(); ok(f.H.x > kx + 15, 'keyboard arrow walks');
  await p.evaluate(() => { document.getElementById('btn-quit').click(); __bakhi.startRun(); }); await p.waitForTimeout(300); f = await F(); ok(f && !f.fight, 'run mode stays on the reflex engine');
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
