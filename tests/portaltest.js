/* portal edition at 1280×720 with a keyboard and at 430×932 with touch: loads with art, English, no pad with keys, background fit, SDK stub events, ad seam throttle, no outbound links */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/portal/poki/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch();
  /* desktop */
  const d = await b.newContext({ viewport: { width: 1280, height: 720 } }); const p = await d.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  const sdk = { calls: [] };
  await p.addInitScript(() => { window.PokiSDK = { init: () => Promise.resolve(), gameLoadingFinished: () => { window.__sdk = (window.__sdk || []); __sdk.push('loaded'); }, gameplayStart: () => { (window.__sdk = window.__sdk || []).push('start'); }, gameplayStop: () => { (window.__sdk = window.__sdk || []).push('stop'); }, commercialBreak: () => { (window.__sdk = window.__sdk || []).push('ad'); return new Promise(r => setTimeout(r, 300)); } }; });
  await p.goto(U); await p.waitForTimeout(1200);
  ok(await p.evaluate(() => CONFIG.portal === 'poki' && CONFIG.img.length > 100 && document.documentElement.lang === 'en'), 'portal edition: poki, art set, English');
  ok(await p.evaluate(() => document.getElementById('langbar').hidden && document.getElementById('btn-fb').hidden), 'no language bar, no Facebook button');
  ok(await p.evaluate(() => (window.__sdk || []).indexOf('loaded') >= 0), 'SDK gameLoadingFinished called');
  ok(await p.evaluate(() => [...document.querySelectorAll('a[href^="http"]')].filter(a => !/fonts\.g/.test(a.href) && !a.hidden && a.offsetParent).length === 0), 'no visible outbound links on the title');
  await p.evaluate(() => { __bakhi.save.seen = { t0: 1, fk: 1, pr: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1 }; }); await p.click('#btn-play'); await p.waitForTimeout(1500);
  const st = await p.evaluate(() => { const B = __bakhi.get(); return { fight: !!B.fight, st: B.state, pro: !!window.PRO, pad: document.getElementById('pad').hidden, kind: __bakhi.input(), bg: __bakhi.bgMode() }; });
  ok(st.fight && !st.pro, 'Play goes to a fight, not the prologue (' + st.st + ')');
  ok(st.kind === 'keys' && st.pad, 'desktop: keys assumed, pad hidden');
  ok(st.bg === 'fit', 'wide frame: background height-fit with side extension (' + st.bg + ')');
  ok(await p.evaluate(() => (window.__sdk || []).indexOf('start') >= 0), 'SDK gameplayStart called');
  for (let i = 0; i < 8 && (await p.evaluate(() => __bakhi.get().state === 'dialog')); i++) { await p.keyboard.press('Enter'); await p.waitForTimeout(250); }
  await p.waitForTimeout(400); await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(300);
  await p.keyboard.down('ArrowRight'); await p.waitForTimeout(250); await p.keyboard.up('ArrowRight');
  const mv = await p.evaluate(() => { const B = __bakhi.get(); return { x: B.H.x, st: B.H.st }; }); ok(mv.x > 0, 'arrow key moves the hero');
  await p.screenshot({ path: '/tmp/claude-0/-home-user/958197c9-f6a7-5ac6-a683-6c384b085848/scratchpad/shots/portal-desktop.png' });
  /* win the gate: the auto-advance to gate 2 passes the ad seam once; a second win within 3 minutes does not */
  const ko = async () => { await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = 1; B.H.x = B.E.x - 45; B.E.ai.next = performance.now() + 1e9; B.E.st = 'idle'; B.E.blockHeld = false; }); await p.evaluate(() => __bakhi.press('lt')); };
  await ko(); let sawAd = false; for (let i = 0; i < 90; i++) { await p.waitForTimeout(100); if (await p.evaluate(() => __bakhi.paused() && __bakhi.ads.n === 1 && (window.__sdk || []).indexOf('ad') >= 0)) { sawAd = true; break; } }
  ok(sawAd, 'win → auto-advance requests one ad break with the game paused');
  ok(await p.evaluate(() => (window.__sdk || []).indexOf('stop') >= 0), 'SDK gameplayStop called at the result');
  await p.waitForTimeout(900); ok(await p.evaluate(() => !__bakhi.paused() && __bakhi.get() && __bakhi.get().fight && __bakhi.get().n === 2), 'ad done → unpaused, gate 2 started');
  for (let i = 0; i < 8 && (await p.evaluate(() => __bakhi.get().state === 'dialog')); i++) { await p.keyboard.press('Enter'); await p.waitForTimeout(250); }
  await p.waitForTimeout(400); await p.evaluate(() => __bakhi.beep()); await p.waitForTimeout(300); await ko(); let g3 = false; for (let i = 0; i < 90; i++) { await p.waitForTimeout(100); if (await p.evaluate(() => __bakhi.get().n === 3)) { g3 = true; break; } }
  ok(g3 && await p.evaluate(() => __bakhi.ads.n === 1), 'second win within 3 minutes: no ad, gate 3 started');
  ok(errs.length === 0, 'desktop: no page errors ' + JSON.stringify(errs));
  await d.close();
  /* phone */
  const m = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true }); const q = await m.newPage(); const errs2 = []; q.on('pageerror', e => errs2.push('PAGEERROR ' + e.message));
  await q.goto(U); await q.waitForTimeout(1200); await q.evaluate(() => { __bakhi.save.seen = { t0: 1, fk: 1, pr: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1 }; }); await q.tap('#btn-play'); await q.waitForTimeout(1500);
  for (let i = 0; i < 8 && (await q.evaluate(() => __bakhi.get().state === 'dialog')); i++) { await q.tap('#dlg-box'); await q.waitForTimeout(250); }
  await q.waitForTimeout(500);
  const st2 = await q.evaluate(() => ({ fight: !!__bakhi.get().fight, pad: document.getElementById('pad').hidden, kind: __bakhi.input(), bg: __bakhi.bgMode() }));
  ok(st2.fight && st2.kind === 'touch' && !st2.pad, 'phone: touch, pad shown');
  ok(st2.bg === 'cover', 'portrait: background cover (' + st2.bg + ')');
  await q.screenshot({ path: '/tmp/claude-0/-home-user/958197c9-f6a7-5ac6-a683-6c384b085848/scratchpad/shots/portal-phone.png' });
  ok(errs2.length === 0, 'phone: no page errors ' + JSON.stringify(errs2));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
