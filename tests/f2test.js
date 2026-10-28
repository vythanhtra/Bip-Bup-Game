/* increment 2: per-character supers and effects, referee crossing + peck, grandma commentary, world modifiers, KO variants render, no errors */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi'); await p.waitForTimeout(900);
  const F = () => p.evaluate(() => __bakhi.fight());
  const freeze = () => p.evaluate(() => { const B = __bakhi.get(); B.E.ai.next = performance.now() + 1e9; B.E.ai.mode = 'idle'; B.E.st = 'idle'; B.E.blockHeld = false; B.E.atk = null; B.E.hitUntil = 0; B.H.st = 'idle'; B.H.hitUntil = 0; B.H.vx = 0; B.E.vx = 0; });
  const open = async (n, hero) => { await p.evaluate(({ n, hero }) => { __bakhi.save.seen = { t0: 1, fk: 1, pr: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1, pro: 1 }; if (hero) __bakhi.setHero(hero); __bakhi.startGate(n, { skipDlg: true }); __bakhi.beep(); }, { n, hero }); await p.waitForTimeout(150); await freeze(); };
  /* grandma speaks at the beep */
  await open(2); let f = await F(); ok(f.state === 'fight' && typeof f.gran === 'string' && f.gran.length > 0, 'grandma comments at round start: ' + f.gran);
  /* hero super: Tí flurry 8 x 6 */
  await p.evaluate(() => { const B = __bakhi.get(); B.H.meter = 100; B.H.x = B.E.x - 45; B.E.hp = 100; }); await p.evaluate(() => __bakhi.press('sp')); await p.waitForTimeout(1300); f = await F(); ok(100 - f.hp >= 40 && 100 - f.hp <= 48 && f.H.meter < 50, 'Tí flurry super lands 7-8 hits (' + (100 - f.hp) + ')');
  /* Thạch Lão sulk reflects enemy hits */
  await open(2, 'thachlao'); await p.evaluate(() => { const B = __bakhi.get(); B.H.meter = 100; }); await p.evaluate(() => __bakhi.press('sp')); await p.waitForTimeout(100); f = await F(); ok(f.H.meter === 0 && f.H.st === 'idle', 'sulk super costs the meter and keeps the hero idle');
  await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 45; B.E.st = 'atk'; B.E.atk = Object.assign({}, { su: 50, ac: 100, re: 200, rg: 11.5, dmg: 18, hs: 450, kb: 4, lbl: 'heavyLbl' }); B.E.atkKey = 'hv'; B.E.atkT = performance.now(); B.E.hitFlag = false; B.E.feint = false; }); const eh0 = (await F()).hp, hh0 = (await F()).hhp; await p.waitForTimeout(400); f = await F(); ok(f.hhp === hh0 && eh0 - f.hp === 18, 'enemy heavy reflected back (-' + (eh0 - f.hp) + ' to enemy, hero ' + hh0 + '->' + f.hhp + ')');
  await p.evaluate(() => __bakhi.setHero('tibup'));
  /* enemy supers by kind */
  await open(2); await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 50; }); await p.evaluate(() => __bakhi.superNow('E')); await p.waitForTimeout(900); f = await F(); ok(f.hhp < 120, 'Trâu Lười fall super hits (' + f.hhp + ')'); await p.waitForTimeout(400); f = await F(); ok(f.E.st === 'down', 'then the buffalo sleeps (down)');
  await open(9); await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 50; }); await p.evaluate(() => __bakhi.superNow('E')); await p.waitForTimeout(50); f = await F(); ok(f.fake, 'duck fake-beep super arms the trap'); await p.evaluate(() => __bakhi.press('lt')); await p.waitForTimeout(80); f = await F(); ok(f.hhp === 110 && !f.fake, 'attacking into the fake beep costs 10 (' + f.hhp + ')');
  await open(10); await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 50; }); await p.evaluate(() => __bakhi.superNow('E')); await p.waitForTimeout(700); f = await F(); ok(f.blind, 'Lính Đèn Lồng flash blinds');
  await open(17); f = await F(); ok(f.mods && f.mods.ice, 'Sông Băng: ice modifier');
  await open(28); f = await F(); ok(f.mods && f.mods.smoke && f.mods.lava, 'Núi Lửa: smoke + lava modifiers (gate 28: gate 25 teaches smoke alone, 27 lava alone)');
  await p.evaluate(() => { const B = __bakhi.get(); B.stillT = performance.now() - 3000; }); const lh = (await F()).hhp; await p.waitForTimeout(150); f = await F(); ok(f.hhp === lh - 3, 'standing still on lava burns 3 (' + lh + '->' + f.hhp + ')');
  await open(40); await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 60; }); await p.evaluate(() => __bakhi.superNow('E')); await p.waitForTimeout(700); f = await F(); ok(f.slow, 'Lão Rùa slow applied');
  await open(34); await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 60; }); await p.evaluate(() => __bakhi.superNow('E')); await p.waitForTimeout(700); f = await F(); ok(f.hearts, 'Tiên Nữ hearts overlay');
  await open(26); await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 50; }); await p.evaluate(() => __bakhi.superNow('E')); await p.waitForTimeout(150); f = await F(); const ehp = await p.evaluate(() => __bakhi.get().E.hp); ok(ehp === 75, 'Gà Nướng heals 25 (E.hp ' + ehp + ', hud ' + f.hp + ')');
  /* referee crossing and peck */
  await open(3); await p.evaluate(() => __bakhi.refNow()); await p.waitForTimeout(200); f = await F(); ok(f.ref, 'referee starts crossing');
  await p.evaluate(() => { const B = __bakhi.get(); B.ref.prog = .5; B.ref.pauseUntil = performance.now() + 2000; B.H.x = Math.round(B.arenaW / 2) - 20; B.H.face = 1; B.E.x = B.arenaW - 60; }); const rh = (await F()).hhp; await p.evaluate(() => __bakhi.press('lt')); await p.waitForTimeout(250); f = await F(); ok(f.hhp === rh - 6, 'hitting the referee gets pecked -6 (' + rh + '->' + f.hhp + ')');
  /* KO variants: every enemy renders its KO without errors */
  const sprs = ['linhco', 'traului', 'linhdem', 'vitgia', 'lytruong', 'cao', 'canhcut', 'nguoituyet', 'bangvuong', 'khilua', 'ganuong', 'hoalong', 'thienbinh', 'tiennu', 'rua'];
  const gateOf = { linhco: 1, traului: 2, linhdem: 10, vitgia: 9, lytruong: 8, cao: 16, canhcut: 17, nguoituyet: 18, bangvuong: 24, khilua: 25, ganuong: 26, hoalong: 32, thienbinh: 33, tiennu: 34, rua: 40 };
  for (const sp of sprs) { await open(gateOf[sp]); await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 1; B.H.x = B.E.x - 45; }); await p.evaluate(() => __bakhi.press('lt')); await p.waitForTimeout(700); }
  ok(errs.length === 0, 'all 15 KO animations rendered without errors');
  await p.evaluate(() => { document.getElementById('btn-quit').click(); });
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
