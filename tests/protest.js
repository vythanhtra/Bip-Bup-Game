/* prologue (5 playable intro scenes): runs once in art mode, scene order, interactive beats, hold-to-skip, replay, no runtime errors */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(U + '?lang=vi'); await p.waitForTimeout(900);
  const pro = () => p.evaluate(() => { const r = __bakhi.pro(); return r ? { i: r.i, step: r.step, dlg: !!r.dlg, out: !!r.out } : null; });
  /* first play on a fresh save starts the prologue, not the tutorial */
  await p.evaluate(() => { localStorage.clear(); __bakhi.save.seen = {}; document.getElementById('btn-play').click(); });
  await p.waitForTimeout(300); let s = await pro(); ok(s && s.i === 0, 'play on fresh save opens prologue scene 0');
  ok(await p.evaluate(() => document.getElementById('btn-story').textContent.indexOf('mở đầu') > 0), 'story button relabelled to replay');
  /* scene 0 ignores early taps, advances after 1.5 s */
  await p.evaluate(() => __bakhi.proTap()); s = await pro(); ok(s.i === 0 && !s.out, 'tap before 1.5 s does not advance');
  await p.waitForTimeout(1500); await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(600); s = await pro(); ok(s.i === 1, 'scene 1 (turtle) after tap');
  ok(await p.evaluate(() => __bakhi.audio.ready() ? true : true), 'audio call safe without context');
  await p.waitForTimeout(1600); await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(600); s = await pro(); ok(s.i === 2 && s.step === 0, 'scene 2 (slow boop) step 0');
  await p.waitForTimeout(1300); await p.evaluate(() => __bakhi.proTap()); s = await pro(); ok(s.step === 1, 'Gà Bíp asks for a try');
  await p.evaluate(() => __bakhi.proTap()); s = await pro(); ok(s.step === 2, 'slow punch started');
  await p.waitForTimeout(3200); s = await pro(); ok(s.step === 3, 'grandma calls after the slow punch');
  await p.waitForTimeout(2200); s = await pro(); ok(s.i === 3 && s.dlg, 'scene 3 opens grandma dialogue');
  ok(await p.evaluate(() => !document.getElementById('dlg').hidden && document.getElementById('dlg-name').textContent.length > 0), 'dialogue box visible with a name');
  const nd = await p.evaluate(() => PRO_DLG.length + 1); ok(nd >= 8, 'grandma explains the mission before the rule (' + nd + ' lines)');
  ok(await p.evaluate(() => PRO_DLG.some(d => /40 cửa/.test(d.text)) && PRO_DLG.some(d => /học trò duy nhất/.test(d.text))), 'mission says why Tí and why 40 gates');
  for (let k = 0; k < nd; k++) { await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(80); }
  s = await pro(); ok(s.i === 3 && !s.dlg && s.step === 1, 'dialogue done, waiting for the beep');
  ok(await p.evaluate(() => document.getElementById('dlg').hidden), 'dialogue box hidden while waiting');
  /* early tap is forgiven (no fail state), signal re-rolled */
  await p.evaluate(() => __bakhi.proTap()); s = await pro(); ok(s.step === 1, 'early boop keeps waiting (forgiven)');
  /* wait for the signal then boop */
  await p.waitForFunction(() => { const r = __bakhi.pro(); return r && r.i === 3 && r.sigDone; }, null, { timeout: 5000 });
  await p.evaluate(() => __bakhi.proTap()); s = await pro(); ok(s.step === 1, 'first jab after the beep counts (lesson needs three)'); await p.waitForTimeout(300); await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(300); await p.evaluate(() => __bakhi.proTap()); s = await pro(); ok(s.step === 2, 'third jab knocks the dummy down');
  await p.waitForTimeout(2500); s = await pro(); ok(s.i === 4, 'scene 4 (departure)');
  await p.waitForTimeout(2600); await p.evaluate(() => __bakhi.proTap()); await p.waitForTimeout(700);
  s = await pro(); const B = await p.evaluate(() => { const b = __bakhi.get(); return b ? { tut0: b.tut0, n: b.n } : null; });
  ok(!s && B && B.tut0, 'prologue ends into the tutorial'); ok(await p.evaluate(() => __bakhi.save.seen.pro === 1), 'seen.pro saved');
  /* second play skips the prologue */
  await p.evaluate(() => { document.getElementById('btn-quit').click(); }); await p.waitForTimeout(200);
  await p.evaluate(() => { __bakhi.save.seen.t0 = 1; document.getElementById('btn-play').click(); }); await p.waitForTimeout(300);
  ok(!(await pro()) && (await p.evaluate(() => !!__bakhi.get())), 'play with seen.pro goes straight to a gate');
  /* replay from the title + hold to skip returns to the title */
  await p.evaluate(() => { document.getElementById('btn-quit').click(); }); await p.waitForTimeout(200);
  await p.evaluate(() => { window.__bakhiHome(); document.getElementById('btn-story').click(); }); await p.waitForTimeout(300);
  s = await pro(); ok(s && s.i === 0, 'story button replays the prologue');
  await p.evaluate(() => { const r = __bakhi.pro(); r.holdT = performance.now() - 700; }); await p.waitForTimeout(150);
  ok(!(await pro()) && (await p.evaluate(() => !document.getElementById('s-title').hidden)), 'hold skip from replay returns to title');
  /* Escape also skips, and skip from first play lands in the tutorial */
  await p.evaluate(() => { __bakhi.save.seen = {}; document.getElementById('btn-play').click(); }); await p.waitForTimeout(200);
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  ok(!(await pro()) && (await p.evaluate(() => { const b = __bakhi.get(); return !!(b && b.tut0); })), 'Escape skips into the tutorial');
  /* non-image edition: play never opens the prologue */
  const p2 = await ctx.newPage(); p2.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p2.goto((process.env.URL2 || 'http://localhost:8765/') + '?lang=vi'); await p2.waitForTimeout(700);
  await p2.evaluate(() => { localStorage.clear(); __bakhi.save.seen = {}; document.getElementById('btn-play').click(); }); await p2.waitForTimeout(300);
  ok(await p2.evaluate(() => !__bakhi.pro() && !!__bakhi.get() && __bakhi.get().tut0), 'text edition: play goes to the tutorial');
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
