/* Owner 2026-10-27: phone / computer choice on the title; computer mode: key legend instead of the pad, keyboard guide before the first fight, Esc pause, Space = block only, menus by keyboard, keyboard wording in the tutorial */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch();
  const d = await b.newContext({ viewport: { width: 1280, height: 720 } }); const p = await d.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi'); await p.waitForTimeout(1000);
  ok(await p.evaluate(() => !document.getElementById('devbar').hidden && document.querySelector('#devbar button.on').getAttribute('data-dev') === 'pc'), 'desktop: device bar shown, Computer preselected');
  ok(await p.evaluate(() => !document.getElementById('btn-keys').hidden), 'Controls button visible in computer mode');
  await p.click('#btn-keys'); await p.waitForTimeout(150); ok(await p.evaluate(() => __bakhi.guide() && !document.getElementById('kbguide').hidden), 'Controls button opens the keyboard sheet');
  await p.keyboard.press('KeyA'); await p.waitForTimeout(100); ok(await p.evaluate(() => !__bakhi.guide()), 'any key closes it');
  /* phone choice → pad in a fight */
  await p.click('#devbar button[data-dev="phone"]'); await p.waitForTimeout(100);
  ok(await p.evaluate(() => __bakhi.device() === 'phone' && __bakhi.save.device === 'phone' && document.getElementById('btn-keys').hidden), 'choosing Phone is saved and hides the Controls button');
  await p.evaluate(() => { __bakhi.save.seen = { t0: 1, fk: 1, pr: 1, pro: 1, kb: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1 }; __bakhi.setHero('tibup'); __bakhi.startGate(2, { skipDlg: true }); }); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !document.getElementById('pad').hidden && document.getElementById('keys').hidden), 'phone mode: pad shown, key legend hidden');
  await p.keyboard.down('ArrowRight'); await p.waitForTimeout(80); await p.keyboard.up('ArrowRight');
  ok(await p.evaluate(() => !document.getElementById('pad').hidden), 'a key press does not override an explicit Phone choice');
  await p.evaluate(() => document.getElementById('btn-quit').click()); await p.waitForTimeout(300);
  /* computer choice → legend, guide on the first fight, clock frozen behind it */
  await p.click('#btn-home'); await p.waitForTimeout(200); await p.click('#devbar button[data-dev="pc"]'); await p.waitForTimeout(100);
  await p.evaluate(() => { delete __bakhi.save.seen.kb; document.activeElement && document.activeElement.blur(); }); await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const g1 = await p.evaluate(() => ({ guide: __bakhi.guide(), paused: __bakhi.paused(), keys: !document.getElementById('keys').hidden, pad: document.getElementById('pad').hidden, st: __bakhi.get() && __bakhi.get().state }));
  ok(g1.st !== null && g1.pad, 'Enter on the title starts play, no pad on a computer (' + g1.st + ')');
  for (let i = 0; i < 40 && !(await p.evaluate(() => __bakhi.guide())) && (await p.evaluate(() => ['cine', 'dialog'].indexOf(__bakhi.get().state) >= 0)); i++) { await p.keyboard.press('Enter'); await p.waitForTimeout(200); }
  await p.waitForTimeout(300);
  ok(await p.evaluate(() => __bakhi.guide() && __bakhi.paused()), 'keyboard sheet before the first computer fight, game paused');
  const c0 = await p.evaluate(() => __bakhi.clock()); await p.waitForTimeout(500); ok(Math.abs((await p.evaluate(() => __bakhi.clock())) - c0) < 40, 'clock frozen behind the sheet');
  await p.keyboard.press('KeyQ'); await p.waitForTimeout(120); ok(await p.evaluate(() => !__bakhi.guide() && !__bakhi.paused() && __bakhi.save.seen.kb === 1), 'any key starts the fight and remembers the sheet');
  ok(await p.evaluate(() => !document.getElementById('keys').hidden && document.getElementById('pad').hidden), 'key legend along the bottom during the fight, pad hidden');
  /* fight on the keyboard */
  await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(250);
  const freeze = () => p.evaluate(() => { const B = __bakhi.get(); B.Fs.slice(1).forEach(E => { E.ai.next = performance.now() + 1e9; E.ai.mode = 'idle'; E.st = 'idle'; E.atk = null; E.vx = 0; E.blockHeld = false; }); B.H.st = 'idle'; B.H.vx = 0; B.H.hitUntil = 0; });
  await freeze(); await p.keyboard.down('Space'); await p.waitForTimeout(120);
  ok(await p.evaluate(() => __bakhi.get().H.st === 'block'), 'Space blocks'); await p.keyboard.up('Space'); await p.waitForTimeout(80);
  ok(await p.evaluate(() => __bakhi.get().H.st !== 'atk'), 'Space no longer throws a punch as well');
  await freeze(); await p.keyboard.down('KeyZ'); await p.waitForTimeout(40);
  ok(await p.evaluate(() => document.querySelector('#keys span[data-k="lt"]').classList.contains('on') && __bakhi.get().H.st === 'atk'), 'Z punches and lights the Z key in the legend'); await p.keyboard.up('KeyZ'); await p.waitForTimeout(600);
  await freeze(); const box = await p.locator('#keys span[data-k="hv"]').boundingBox(); await p.mouse.move(box.x + 10, box.y + 10); await p.mouse.down(); await p.waitForTimeout(40); await p.mouse.up();
  ok(await p.evaluate(() => __bakhi.get().H.st === 'atk' && __bakhi.get().H.atkKey === 'hv'), 'clicking X in the legend throws a heavy');
  await p.waitForTimeout(800); await p.keyboard.press('Escape'); await p.waitForTimeout(100); ok(await p.evaluate(() => __bakhi.paused()), 'Esc pauses');
  await p.keyboard.press('Escape'); await p.waitForTimeout(100); ok(await p.evaluate(() => !__bakhi.paused()), 'Esc again resumes');
  /* result screen by keyboard */
  await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 1; B.H.x = B.E.x - 45; B.E.ai.next = performance.now() + 1e9; B.E.st = 'idle'; B.E.blockHeld = false; }); await p.keyboard.press('KeyZ');
  let adv = false; for (let i = 0; i < 60; i++) { await p.waitForTimeout(100); if (await p.evaluate(() => __bakhi.get().n === 2)) { adv = true; break; } } ok(adv, 'a win moves on to the next gate');
  /* tutorial wording on a computer */
  await p.evaluate(() => { document.getElementById('btn-quit').click(); }); await p.waitForTimeout(300);
  await p.evaluate(() => __bakhi.startTutorial()); await p.waitForTimeout(600); await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(300); await p.evaluate(() => { const B = __bakhi.get(); B.tutStep = 3; B.tutSaidT = 0; }); await p.waitForTimeout(300);
  ok(await p.evaluate(() => /Space/.test(__bakhi.get().bubble || '')), 'tutorial tells computer players to hold Space (' + (await p.evaluate(() => __bakhi.get().bubble)) + ')');
  /* layouts: the legend follows the hand; tutorial names the keys of the active layout; IME fallback */
  await p.evaluate(() => { document.getElementById('btn-quit').click(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { __bakhi.layout('wasd'); __bakhi.startGate(3, { skipDlg: true }); __bakhi.beep(); }); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.querySelector('#keys kbd[data-kn="lt"]').textContent === 'J' && document.querySelector('#keys kbd[data-kn="u"]').textContent === 'W'), 'layout 1 legend: W jump, J punch');
  await p.keyboard.down('ArrowLeft'); await p.waitForTimeout(60); await p.keyboard.up('ArrowLeft');
  ok(await p.evaluate(() => __bakhi.layout() === 'arrows' && document.querySelector('#keys kbd[data-kn="lt"]').textContent === 'Z'), 'pressing an arrow switches the legend to layout 2 (Z punch)');
  await p.keyboard.down('KeyD'); await p.waitForTimeout(60); await p.keyboard.up('KeyD');
  ok(await p.evaluate(() => __bakhi.layout() === 'wasd' && __bakhi.save.layout === 'wasd'), 'pressing D switches back to layout 1 and remembers it');
  await p.evaluate(() => { const B = __bakhi.get(); B.Fs.slice(1).forEach(E => { E.ai.next = performance.now() + 1e9; E.st = 'idle'; E.atk = null; }); B.H.st = 'idle'; B.H.hitUntil = 0; }); await p.keyboard.down('KeyJ'); await p.waitForTimeout(40);
  ok(await p.evaluate(() => __bakhi.get().H.st === 'atk' && __bakhi.get().H.atkKey === 'lt'), 'J punches'); await p.keyboard.up('KeyJ'); await p.waitForTimeout(500);
  await p.evaluate(() => { const B = __bakhi.get(); B.H.st = 'idle'; B.H.hitUntil = 0; B.H.atk = null; }); await p.keyboard.down('KeyL'); await p.waitForTimeout(40); await p.keyboard.up('KeyL');
  ok(await p.evaluate(() => !__bakhi.ime()), 'no IME warning on plain keys');
  await p.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ư', code: '', bubbles: true }))); await p.waitForTimeout(100);
  ok(await p.evaluate(() => __bakhi.ime() && !document.getElementById('imewarn').hidden && __bakhi.layout() === 'arrows'), 'an accented character from an IME shows the Unikey warning and falls back to arrows');
  await p.evaluate(() => { document.getElementById('btn-quit').click(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { __bakhi.layout('wasd'); __bakhi.startTutorial(); }); await p.waitForTimeout(600); await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(300); await p.evaluate(() => { const B = __bakhi.get(); B.tutStep = 2; B.tutSaidT = 0; }); await p.waitForTimeout(300);
  ok(await p.evaluate(() => /J J K/.test(__bakhi.get().bubble || '')), 'layout 1 tutorial says J J K (' + (await p.evaluate(() => __bakhi.get().bubble)) + ')');
  ok(errs.length === 0, 'desktop: no page errors ' + JSON.stringify(errs));
  await d.close();
  /* phone default */
  const m = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true }); const q = await m.newPage(); const errs2 = []; q.on('pageerror', e => errs2.push('PAGEERROR ' + e.message));
  await q.goto(U + '?lang=vi'); await q.waitForTimeout(1000);
  ok(await q.evaluate(() => document.querySelector('#devbar button.on').getAttribute('data-dev') === 'phone' && document.getElementById('btn-keys').hidden), 'phone: Phone preselected, no Controls button');
  await q.evaluate(() => { __bakhi.save.seen = { t0: 1, fk: 1, pr: 1, pro: 1, w1: 1 }; __bakhi.startGate(2, { skipDlg: true }); }); await q.waitForTimeout(300);
  ok(await q.evaluate(() => !document.getElementById('pad').hidden && document.getElementById('keys').hidden && !__bakhi.guide()), 'phone fight: pad, no legend, no keyboard sheet');
  ok(errs2.length === 0, 'phone: no page errors ' + JSON.stringify(errs2));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
