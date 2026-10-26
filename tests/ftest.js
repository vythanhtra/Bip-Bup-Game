/* fight engine (ADR-004, increment 1): BÍP opens the round, punches/chain/heavy/super, parry → counter, enemy strikes hero HP, KO, best-of-3 for bosses, timeout, peck gag */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi'); await p.waitForTimeout(900);
  const F = () => p.evaluate(() => __bakhi.fight());
  const tap = () => p.evaluate(() => { __bakhi.tap(); __bakhi.up(); });
  /* gate 1: countdown, no punches before the beep (peck gag) */
  await p.evaluate(() => { __bakhi.save.seen = { t0: 1, fk: 1, pr: 1, w1: 1, pro: 1 }; __bakhi.setAtk(false); __bakhi.startGate(1, { skipDlg: true }); });
  await p.waitForTimeout(500); let f = await F(); ok(f.fight && f.state === 'count' && f.hhp === 120 && f.rnum === 1, 'gate starts in count state with hero HP 120 (3 hearts x 40)');
  ok(await p.evaluate(() => document.getElementById('hud-hearts').hidden && !document.getElementById('hud-hbar').hidden), 'HUD shows the hero HP bar instead of hearts');
  await tap(); f = await F(); ok(f.hp === 100 && f.state === 'count', 'tap during countdown does no damage to the enemy');
  await tap(); f = await F(); ok(f.hhp === 115 || f.hhp === 120, 'early taps: first forgiven (hero perk), second pecked -5');
  await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(120); f = await F(); ok(f.state === 'fight', 'BÍP opens the round');
  /* light punches chain into a hook */
  const hp0 = f.hp; await tap(); await p.waitForTimeout(120); await tap(); await p.waitForTimeout(120); await tap(); await p.waitForTimeout(80); f = await F();
  ok(hp0 - f.hp === 34, 'jab 9 + jab 9 + hook 16 = 34 (' + (hp0 - f.hp) + ')'); ok(f.meter === 24, 'meter +8 per hit');
  /* heavy punch: hold 700 ms */
  const hp1 = f.hp; await p.evaluate(() => __bakhi.tap()); await p.waitForTimeout(700); await p.evaluate(() => __bakhi.up()); f = await F();
  ok(hp1 - f.hp >= 20 && hp1 - f.hp <= 36, 'heavy punch after a hold deals 20-36 (' + (hp1 - f.hp) + ')');
  /* pressure: after 4 unanswered hits the enemy blocks one */
  await p.waitForTimeout(500); const hp2 = f.hp; await tap(); f = await F(); ok(hp2 - f.hp <= 3, 'pressure 4: enemy blocks (-' + (hp2 - f.hp) + ')');
  /* enemy attack: let it strike, hero HP drops; parry → counter x2 */
  await p.evaluate(() => { __bakhi.setAtk(true); const B = __bakhi.get(); B.eNext = 0; B.eStun = 0; B.pressure = 0; });
  await p.waitForFunction(() => __bakhi.atk(), null, { timeout: 4000 }); const hh0 = (await F()).hhp;
  await p.waitForFunction(() => !__bakhi.atk() && __bakhi.fight().hhp < 120, null, { timeout: 4000 }); f = await F(); ok(f.hhp < hh0 && f.state === 'fight', 'enemy strike lands on hero HP (' + hh0 + ' -> ' + f.hhp + ')');
  /* parry next telegraph by swiping its direction, then counter */
  await p.waitForFunction(() => __bakhi.atk() && !__bakhi.atk().feint, null, { timeout: 6000 });
  const dir = await p.evaluate(() => __bakhi.atk().dir); const hp3 = (await F()).hp; await p.evaluate(d => __bakhi.swipe(d), dir); f = await F();
  ok(f.hp < hp3 && f.state === 'fight', 'parry chips the enemy'); const hp4 = f.hp; await p.evaluate(() => __bakhi.setAtk(false)); await p.evaluate(() => { __bakhi.get().atks = []; __bakhi.get().pressure = 0; }); await tap(); f = await F();
  ok(hp4 - f.hp === 18, 'counter jab x2 = 18 (' + (hp4 - f.hp) + ')');
  /* super: fill the meter, hold 1.6 s */
  await p.evaluate(() => { const B = __bakhi.get(); B.meter = 100; B.pressure = 0; B.hp = 100; }); const hp5 = (await F()).hp; await p.evaluate(() => __bakhi.tap()); await p.waitForTimeout(1650); await p.evaluate(() => __bakhi.up()); f = await F();
  ok(hp5 - f.hp === 40 && f.meter === 0, 'super deals 40 and empties the meter (' + (hp5 - f.hp) + ')');
  /* KO ends the round and the gate (1 round for regular gates) */
  await p.evaluate(() => { __bakhi.get().hp = 5; __bakhi.get().pressure = 0; }); await tap(); await p.waitForTimeout(100); f = await F(); ok(f.state === 'rend' && f.rwins === 1, 'KO → round end, 1-0');
  await p.waitForTimeout(1900); ok(await p.evaluate(() => __bakhi.get().state === 'won'), 'regular gate: one round wins the gate');
  await p.waitForTimeout(1700); ok(await p.evaluate(() => __bakhi.get().n === 2 && __bakhi.get().state === 'count'), 'auto-advances to gate 2 countdown');
  ok(await p.evaluate(() => __bakhi.save.hitsMode === 'ko' && __bakhi.save.hits.length === 1 && __bakhi.save.stars[1] >= 1), 'KO time recorded, stars saved');
  /* boss: best of 3, lose a round on timeout */
  await p.evaluate(() => { __bakhi.setAtk(false); __bakhi.startGate(8, { skipDlg: true }); __bakhi.beep(); }); await p.waitForTimeout(150); f = await F(); ok(f.state === 'fight' && f.rnum === 1, 'boss gate round 1');
  await p.evaluate(() => { const B = __bakhi.get(); B.hhp = 10; B.rEnd = performance.now() - 1; }); await p.waitForTimeout(120); f = await F(); ok(f.state === 'rend' && f.rlost === 1, 'timeout with lower HP% loses the round');
  await p.waitForTimeout(1900); f = await F(); ok(f.state === 'count' && f.rnum === 2 && f.hhp === 120, 'round 2 starts with hero HP refilled');
  await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(120);
  await p.evaluate(() => { __bakhi.get().hp = 1; }); await tap(); await p.waitForTimeout(1900); f = await F(); ok(f.rwins === 1 && f.rnum === 3 && f.state === 'count', '1-1 → round 3');
  await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(120); await p.evaluate(() => { __bakhi.get().hhp = 1; __bakhi.get().rEnd = performance.now() - 1; }); await p.waitForTimeout(2000);
  ok(await p.evaluate(() => __bakhi.get().state === 'lost'), 'boss 1-2 → gate lost');
  /* retry after loss works; practice gets more HP */
  await p.evaluate(() => __bakhi.up()); await p.waitForTimeout(300); f = await F(); ok(f && f.state === 'count' && f.rnum === 1 && f.rlost === 0, 'tap after loss restarts the gate');
  await p.evaluate(() => { __bakhi.startGate(3, { skipDlg: true, practice: true }); }); await p.waitForTimeout(200); f = await F(); ok(f.hmax === 200, 'practice: 5 hearts → 200 HP');
  /* legacy engine still used for daily and run */
  await p.evaluate(() => { document.getElementById('btn-quit').click(); __bakhi.startRun(); }); await p.waitForTimeout(300); f = await F(); ok(f && !f.fight, 'run mode stays on the reflex engine');
  await p.evaluate(() => { document.getElementById('btn-quit').click(); __bakhi.setFight(false); __bakhi.startGate(2, { skipDlg: true }); }); await p.waitForTimeout(300); f = await F(); ok(f && !f.fight, 'setFight(false) hook restores the reflex engine');
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
