/* increment 4: coins and shop, gear effects, tag-team gates with cover AI and partner death, cunning grab / anti-air / adaptive block */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi'); await p.waitForTimeout(900);
  const F = () => p.evaluate(() => __bakhi.fight());
  const press = k => p.evaluate(k => __bakhi.press(k), k);
  const freezeAll = () => p.evaluate(() => { const B = __bakhi.get(); B.Fs.slice(1).forEach(E => { E.ai.next = performance.now() + 1e9; E.ai.mode = 'idle'; E.st = 'idle'; E.blockHeld = false; E.atk = null; E.hitUntil = 0; E.vx = 0; }); B.H.st = 'idle'; B.H.hitUntil = 0; B.H.vx = 0; });
  const open = async (n) => { await p.evaluate(n => { __bakhi.save.seen = { t0: 1, fk: 1, pr: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1, pro: 1 }; __bakhi.startGate(n, { skipDlg: true }); __bakhi.beep(); }, n); await p.waitForTimeout(150); await freezeAll(); };
  /* coins: first clear of gate 1 pays double */
  await p.evaluate(() => { localStorage.clear(); __bakhi.save.coins = 0; __bakhi.save.stars = {}; __bakhi.save.unlocked = 1; __bakhi.save.items = {}; __bakhi.save.equip = {}; __bakhi.save.hpBoost = 0; });
  await open(1); await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 2; B.H.x = B.E.x - 45; }); await press('lt'); await p.waitForTimeout(2000);
  let coins = await p.evaluate(() => __bakhi.save.coins); ok(coins === (16 + 15) * 2, 'first clear of gate 1 with 3 stars pays (10+6+15)x2 = 62 (' + coins + ')');
  ok(await p.evaluate(() => { const B = __bakhi.get(); return B.coins === 62; }), 'reward stored on the battle for the result line');
  await p.waitForTimeout(1800); await p.evaluate(() => { document.getElementById('btn-quit').click(); });
  /* replays pay a quarter (Owner 2026-10-27: rewards come from progress) */
  await p.evaluate(() => { __bakhi.startGate(1, { skipDlg: true }); __bakhi.beep(); }); await p.waitForTimeout(150); await freezeAll();
  await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 2; B.H.x = B.E.x - 45; }); await press('lt'); await p.waitForTimeout(2000);
  const c2 = await p.evaluate(() => __bakhi.save.coins); ok(c2 - coins === 8, 'replaying gate 1 pays a quarter: +8 (' + (c2 - coins) + ')');
  await p.waitForTimeout(1800); await p.evaluate(() => { document.getElementById('btn-quit').click(); });
  /* shop: items open by clearing their gate */
  await p.evaluate(() => { __bakhi.save.coins = 150; __bakhi.save.stars = { 1: 3 }; });
  ok(await p.evaluate(() => !__bakhi.itemOpen('banh1') && !__bakhi.shop.buy('banh1') && __bakhi.save.coins === 150), 'rice cake stays locked until gate 2 is cleared');
  await p.evaluate(() => { __bakhi.save.stars = { 1: 3, 2: 3, 3: 3, 5: 1 }; });
  ok(await p.evaluate(() => !__bakhi.shop.buy('chay')), 'pestle stays locked until gate 8 is cleared');
  ok(await p.evaluate(() => __bakhi.shop.buy('banh1') && __bakhi.save.coins === 110 && __bakhi.save.hpBoost === 1), 'rice cake bought: -40, hpBoost 1');
  ok(await p.evaluate(() => __bakhi.shop.buy('duaca') && __bakhi.save.coins === 50 && __bakhi.save.equip.wpn === 'duaca'), 'chopsticks bought and equipped');
  ok(await p.evaluate(() => __bakhi.shop.buy('duaca') && __bakhi.save.equip.wpn === '' && __bakhi.shop.buy('duaca') && __bakhi.save.equip.wpn === 'duaca' && __bakhi.save.coins === 50), 'tapping an owned item toggles equip without charging');
  ok(await p.evaluate(() => !__bakhi.shop.buy('giaprom') && __bakhi.save.coins === 50), 'cannot afford straw armour at 50');
  await p.evaluate(() => { document.getElementById('btn-shop').click(); }); await p.waitForTimeout(200);
  ok(await p.evaluate(() => !document.getElementById('s-shop').hidden && document.querySelectorAll('#shop-list .item').length === 10 && document.querySelector('#shop-list .item[data-id="duaca"]').classList.contains('on')), 'shop screen lists 10 items and marks the equipped one');
  await p.evaluate(() => { document.getElementById('btn-shop-home').click(); });
  /* gear in battle: +20 HP, longer jab, +1 damage */
  await open(2); let f = await F(); ok(f.hmax === 140, 'rice cake raises max HP to 140 (' + f.hmax + ')');
  await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 72; B.H.vx = 0; }); const hp0 = f.hp; await press('lt'); await p.waitForTimeout(220); f = await F(); ok(hp0 - f.hp === 9, 'chopsticks: jab reaches 72 px and deals 9 (' + (hp0 - f.hp) + ')');
  /* tag gate 7: two enemies, partner covers, both must fall, bar is the sum */
  await p.evaluate(() => { __bakhi.save.unlocked = 8; });
  await open(7); let ens = await p.evaluate(() => __bakhi.enemies()); ok(ens.length === 2 && ens[0].key === 'linhco' && ens[1].key === 'traului', 'gate 7 fields two enemies');
  ok(await p.evaluate(() => document.getElementById('hud-enemy').textContent.indexOf('&') > 0), 'HUD shows both names');
  f = await F(); const sum = await p.evaluate(() => { const B = __bakhi.get(); return B.E.hp + B.E2.hp; }); ok(f.hp === sum, 'enemy bar is the sum of both (' + f.hp + ')');
  await p.evaluate(() => { const B = __bakhi.get(); B.Fs.slice(1).forEach(E => { E.ai.next = 0; E.ai.mode = 'idle'; }); B.H.x = B.E.x - 50; }); await p.waitForTimeout(1500);
  const cov = await p.evaluate(() => { const B = __bakhi.get(); const ens = [B.E, B.E2]; const agg = ens[B.tagTurn % 2], cov = ens[(B.tagTurn + 1) % 2]; return { aggD: Math.abs(agg.x - B.H.x), covD: Math.abs(cov.x - B.H.x), covAtk: cov.st === 'atk' }; });
  ok(cov.covD > cov.aggD - 10 && !cov.covAtk, 'cover partner stays further away and does not attack (agg ' + Math.round(cov.aggD) + ', cover ' + Math.round(cov.covD) + ')');
  await freezeAll(); await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 2; B.H.x = B.E.x - 45; B.H.vx = 0; B.E.vx = 0; }); await press('lt'); await p.waitForTimeout(300); ens = await p.evaluate(() => __bakhi.enemies()); f = await F();
  ok(ens[0].dead && f.state === 'fight', 'first partner falls, fight continues');
  await freezeAll(); await p.evaluate(() => { const B = __bakhi.get(); B.E2.hp = 2; B.E2.st = 'idle'; B.H.x = B.E2.x - 45; B.H.face = B.E2.x > B.H.x ? 1 : -1; B.H.vx = 0; B.E2.vx = 0; B.H.hitUntil = 0; }); await press('lt'); await p.waitForTimeout(300); f = await F(); ok(f.state === 'rend' && f.rwins === 1, 'second partner falls → round won');
  await p.waitForTimeout(2000); coins = await p.evaluate(() => __bakhi.get().coins); ok(coins >= 40, 'tag gate pays more (' + coins + ')');
  /* cunning: grab goes through a held block */
  await p.waitForTimeout(1800); await open(9); await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 40; B.H.vx = 0; }); await p.evaluate(() => __bakhi.key('b', 1)); await p.waitForTimeout(100); const hh0 = (await F()).hhp;
  await p.evaluate(() => __bakhi.cunning('grab')); await p.waitForTimeout(450); f = await F(); ok(hh0 - f.hhp >= 10 && f.H.st === 'down', 'grab ignores the block and knocks down (-' + (hh0 - f.hhp) + ')'); await p.evaluate(() => __bakhi.key('b', 0));
  await p.waitForTimeout(1200); await freezeAll(); await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 45; B.H.vx = 0; }); await press('u'); await p.waitForTimeout(120); const hh1 = (await F()).hhp; await p.evaluate(() => __bakhi.cunning('upper')); await p.waitForTimeout(400); f = await F(); ok(hh1 - f.hhp >= 12, 'anti-air hits the airborne hero (-' + (hh1 - f.hhp) + ')');
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
