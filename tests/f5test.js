/* increment 5: movement feel — pre-jump and landing recovery, double-tap dash and backdash, camera that follows a wider arena, AI pre-jump */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi'); await p.waitForTimeout(900);
  const F = () => p.evaluate(() => { const B = __bakhi.get(); return { H: { x: B.H.x, y: B.H.y, st: B.H.st, face: B.H.face, inv: B.H.invUntil - performance.now(), vx: B.H.vx }, E: { x: B.E.x, st: B.E.st, y: B.E.y }, camX: B.camX, camZ: B.camZ, arenaW: B.arenaW, W: innerWidth, SC: __bakhi.sc ? __bakhi.sc() : 0 }; });
  const press = k => p.evaluate(k => __bakhi.press(k), k);
  const freezeAll = () => p.evaluate(() => { const B = __bakhi.get(); B.Fs.slice(1).forEach(E => { E.ai.next = performance.now() + 1e9; E.ai.mode = 'idle'; E.st = 'idle'; E.blockHeld = false; E.atk = null; E.hitUntil = 0; E.vx = 0; }); B.H.st = 'idle'; B.H.hitUntil = 0; B.H.vx = 0; });
  const open = async (n) => { await p.evaluate(n => { __bakhi.save.seen = { t0: 1, fk: 1, pr: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1, pro: 1 }; __bakhi.setHero('tibup'); __bakhi.startGate(n, { skipDlg: true }); __bakhi.beep(); }, n); await p.waitForTimeout(150); await freezeAll(); };
  await open(1); let f = await F();
  ok(f.arenaW > f.W * 1.2 && f.camX > 0, 'arena wider than the screen, camera starts centred (' + f.arenaW + ' vs ' + f.W + ', cam ' + Math.round(f.camX) + ')');
  const inView = (x, f) => { const sx = (x - f.camX) * f.camZ; return sx > 0 && sx < f.W; };
  ok(inView(f.H.x, f) && inView(f.E.x, f), 'both fighters on screen at the start');
  /* pre-jump: 60 ms squat, then airborne, then a landing squash that blocks input */
  await press('u'); await p.waitForTimeout(25); f = await F(); ok(f.H.st === 'prejump' && f.H.y === 0, 'jump starts with a pre-jump squat on the ground');
  await p.waitForTimeout(200); f = await F(); ok(f.H.st === 'jump' && f.H.y < -10, 'airborne after the squat');
  let sawLand = false; for (let i = 0; i < 40; i++) { await p.waitForTimeout(25); f = await F(); if (f.H.st === 'land') { sawLand = true; break; } }
  ok(sawLand, 'landing recovery state after the jump');
  await p.evaluate(() => { const B = __bakhi.get(); B.H.st = 'land'; B.H.landT = performance.now(); B.H.landUntil = performance.now() + 400; }); await press('lt'); await p.waitForTimeout(60); f = await F(); ok(f.H.st === 'land', 'attack pressed during landing recovery is ignored');
  await p.waitForTimeout(450); f = await F(); ok(f.H.st === 'idle', 'back to idle after the recovery');
  /* dash: forward on double tap toward the enemy, backdash is invulnerable */
  await freezeAll(); f = await F(); const x0 = f.H.x;
  await press('dr'); await p.waitForTimeout(60); f = await F(); ok(f.H.st === 'dash' && f.H.x > x0 + 10, 'forward dash moves the hero (' + Math.round(f.H.x - x0) + 'px in 60 ms)');
  await p.waitForTimeout(300); f = await F(); ok(f.H.st === 'idle' && f.H.x - x0 > 40, 'dash ends in idle well ahead (' + Math.round(f.H.x - x0) + 'px)');
  const x1 = f.H.x; await press('dl'); await p.waitForTimeout(60); f = await F(); ok(f.H.st === 'dash' && f.H.x < x1 - 8 && f.H.inv > 0, 'backdash moves away and is invulnerable (' + Math.round(f.H.inv) + 'ms left)');
  await p.waitForTimeout(400);
  /* dash-cancel: a jab 100 ms into a forward dash comes out */
  await freezeAll(); await press('dr'); await p.waitForTimeout(110); await press('lt'); await p.waitForTimeout(40); f = await F(); ok(f.H.st === 'atk', 'jab cancels a forward dash after 90 ms');
  await p.waitForTimeout(600);
  /* double tap on the pad keys makes a dash */
  await freezeAll(); await p.evaluate(() => { __bakhi.key('r', 1); __bakhi.key('r', 0); }); await p.waitForTimeout(80); await p.evaluate(() => { __bakhi.key('r', 1); }); await p.waitForTimeout(60); f = await F(); ok(f.H.st === 'dash', 'double-tapping right dashes'); await p.evaluate(() => __bakhi.key('r', 0)); await p.waitForTimeout(400);
  await freezeAll(); await p.evaluate(() => { __bakhi.key('r', 1); __bakhi.key('r', 0); }); await p.waitForTimeout(400); await p.evaluate(() => { __bakhi.key('r', 1); }); await p.waitForTimeout(60); f = await F(); ok(f.H.st === 'walk', 'two taps 400 ms apart only walk'); await p.evaluate(() => __bakhi.key('r', 0));
  /* camera follows: walk the hero to the left edge, camera pans to 0, hero stays on screen */
  await freezeAll(); await p.evaluate(() => __bakhi.key('l', 1)); await p.waitForTimeout(2500); await p.evaluate(() => __bakhi.key('l', 0)); await p.waitForTimeout(400); f = await F();
  ok(f.camX < 4 && f.H.x < f.arenaW * .2, 'camera panned to the left edge (cam ' + Math.round(f.camX) + ', hero ' + Math.round(f.H.x) + ')');
  ok(inView(f.H.x, f), 'hero still on screen at the edge');
  ok(f.camZ <= 1 && f.camZ >= .78, 'zoom stays within bounds (' + f.camZ.toFixed(2) + ')');
  /* spread wide: camera zooms out so both stay visible */
  await p.evaluate(() => { const B = __bakhi.get(); B.H.x = 60; B.E.x = B.arenaW - 60; }); await p.waitForTimeout(600); f = await F();
  ok(f.camZ < .95 && inView(f.H.x, f) && inView(f.E.x, f), 'zoomed out with both visible when far apart (z ' + f.camZ.toFixed(2) + ')');
  /* AI pre-jump launches */
  await p.evaluate(() => { const B = __bakhi.get(); B.E.st = 'prejump'; B.E.jumpAt = performance.now(); B.E.jumpVx = 0; }); await p.waitForTimeout(120); f = await F(); ok(f.E.st === 'jump' && f.E.y < 0, 'enemy pre-jump launches into a jump');
  /* enemy clamps inside the arena, not the screen */
  await p.evaluate(() => { const B = __bakhi.get(); B.E.st = 'idle'; B.E.y = 0; B.E.vy = 0; B.E.x = B.arenaW + 500; }); await p.waitForTimeout(80); f = await F(); ok(f.E.x <= f.arenaW && f.E.x > f.W, 'enemy clamped to the arena edge beyond the screen width (' + Math.round(f.E.x) + ')');
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
