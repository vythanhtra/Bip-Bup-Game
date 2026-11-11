/* ADR-010 real places in 3D, spec .10x/specs/2026-11-10-real-places-3d-spec.md §5 (P1–P6).
   Runs on software WebGL (SwiftShader), so the slow-device fallback threshold is raised with window.__P3D_SLOW except in its own check. */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  const page = async (q, o = {}) => { const ctx = await b.newContext({ viewport: o.vp || { width: 1280, height: 720 } }); const p = await ctx.newPage(); const reqs = [];
    await p.route(/supabase\.co/, r => r.abort()); if (o.block) await p.route(o.block, r => r.abort());
    p.on('request', r => reqs.push(r.url())); p.on('pageerror', e => errs.push((o.tag || q) + ': ' + e.message));
    if (o.slow !== false) await p.addInitScript(() => { window.__P3D_SLOW = 1e9; }); if (!o.post) await p.addInitScript(() => { window.__P3D_NOPOST = 1; });   /* software GL is far too slow for the AO pass; one check below runs with it */ if (o.noGL) await p.addInitScript(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(k){ return /webgl/.test(k) ? null : g.apply(this, arguments); }; });
    await p.goto(U + q); await p.waitForTimeout(800); p.reqs = reqs; return p; };
  const start = (p, n, still) => p.evaluate(([n, still]) => { __bakhi.save.seen = { t0: 1, pro: 1, kb: 1 }; __bakhi.save.unlocked = 40; __bakhi.startGate(n, still ? { skipDlg: true } : undefined); const B = __bakhi.get(); if (still && B.cine) B.cine.t0 = -1e9; }, [n, !!still]);
  const settled = p => p.waitForFunction(() => { const s = PLACE3D.state(); return s.ready || s.failed; }, null, { timeout: 30000 });
  const S = p => p.evaluate(() => Object.assign(PLACE3D.state(), { live: PLACE3D.live(), hidden: document.getElementById('scene3d').hidden, state: __bakhi.get() && __bakhi.get().state }));

  /* P1: flag off, no three.js or scene is fetched, the 3D canvas stays hidden, the 2D background draws as before */
  let p = await page('?lang=vi', { tag: 'off' }); await start(p, 1, true); await p.waitForFunction(() => __bakhi.get().state === 'fight', null, { timeout: 20000 }); await p.waitForTimeout(800);
  let s = await S(p);
  ok(!s.ready && s.hidden && !(await p.evaluate(() => PLACE3D.enabled())), 'P1 flag off: PLACE3D disabled, #scene3d hidden ' + JSON.stringify({ ready: s.ready, hidden: s.hidden }));
  ok(!p.reqs.some(u => /vendor\/three|places\//.test(u)), 'P1 flag off: no request for vendor/three or places/ (' + p.reqs.filter(u => /vendor|places/.test(u)).length + ')');
  ok(await p.evaluate(() => { const c = document.getElementById('game'), x = c.getContext('2d').getImageData(c.width / 2, 20, 1, 1).data; return x[3] === 255; }), 'P1 flag off: the 2D canvas still paints an opaque background');
  await p.context().close();
  /* P1b: flag on, a gate without a place (gate 9) loads nothing */
  p = await page('?places=1&lang=vi', { tag: 'gate9' }); await start(p, 9, true); await p.waitForFunction(() => __bakhi.get().state === 'fight', null, { timeout: 20000 }); await p.waitForTimeout(600);
  ok(!p.reqs.some(u => /vendor\/three|places\//.test(u)) && (await S(p)).hidden, 'P1 flag on, gate 9 (no place yet): nothing loaded, #scene3d hidden'); await p.context().close();
  /* P1c: the portal edition never turns it on */
  p = await page('?places=1', { tag: 'portal' }); p.reqs.length = 0; await p.goto(U.replace(/preview\/$/, 'portal/poki/') + '?places=1'); await p.waitForTimeout(800);
  ok(await p.evaluate(() => !PLACE3D.enabled()), 'P1 portal edition: ?places=1 does nothing'); await p.context().close();

  /* P2 + P6: flag on, gate 1 builds the Đường Lâm scene; the ground at the fighters' depth lands on GY; budget */
  for (const vp of [{ width: 1024, height: 640 }, { width: 390, height: 844 }]) {   /* 1024 x 640 is still the desktop path; software GL at 1280 px is too slow to keep frames under 1.2 s */
    p = await page('?places=1&lang=vi', { vp, tag: 'p2 ' + vp.width }); await start(p, 1, true); await settled(p); await p.waitForFunction(() => __bakhi.get().state === 'fight', null, { timeout: 20000 }); await p.waitForTimeout(1500);
    s = await S(p);
    ok(s.ready && s.key === 'duonglam' && s.live && !s.hidden, vp.width + 'px P2: gate 1 shows the duonglam scene ' + JSON.stringify({ key: s.key, ready: s.ready, live: s.live, why: s.why }));
    ok(s.gy && Math.abs(s.groundY - s.gy) <= 2, vp.width + 'px P2: the scene ground meets the game ground (' + (s.groundY && s.groundY.toFixed(1)) + ' vs GY ' + s.gy + ')');
    const lim = vp.width < 600 || vp.height < 600 ? [40, 30000] : [100, 120000];   /* ADR-010 §7 as amended 2026-11-11: phone 40 / 30 000, desktop 100 / 120 000 */
    ok(s.info && s.info.triangles <= lim[1] && s.info.calls <= lim[0], vp.width + 'px P6: budget ' + JSON.stringify(s.info) + ' (max ' + lim[1] + ' triangles, ' + lim[0] + ' draw calls)');
    const see = await p.evaluate(() => new Promise(res => { const out = []; let n = 0; (function f(){ const c = document.getElementById('game'), g = c.getContext('2d'), solid = [[4, 4], [c.width - 5, 4], [4, c.height - 5], [c.width - 5, c.height - 5]].filter(q => g.getImageData(q[0], q[1], 1, 1).data[3] === 255).length; out.push([PLACE3D.live(), solid === 4 ? 255 : 0]);   /* a drawn background is fully opaque at all four corners; game effects (the round-start flash) are only partly opaque */ if (++n < 20) requestAnimationFrame(f); else res(out); })(); }));
    ok(see.some(x => x[0]) && see.every(x => !x[0] || x[1] === 0), vp.width + 'px P2: while the scene is live the 2D canvas is see-through where the background was (' + see.filter(x => x[0]).length + '/20 live frames)');
    await p.context().close(); }

  /* P2 + P6 for every gate of the first wave: the right scene, ground on GY, within budget */
  p = await page('?places=1&lang=vi', { tag: 'all' });
  for (let n = 1; n <= 8; n++) { await start(p, n, true); await p.waitForFunction(n => { const s = PLACE3D.state(); return s.n === n && (s.ready || s.failed); }, n, { timeout: 30000 });
    await p.waitForFunction(() => __bakhi.get().state === 'fight' || __bakhi.get().state === 'count', null, { timeout: 20000 }); await p.waitForTimeout(1200); s = await S(p);
    const want = await p.evaluate(n => PLACES[n].key, n);
    ok(s.ready && s.key === want && Math.abs(s.groundY - s.gy) <= 2 && s.info.triangles <= 120000 && s.info.calls <= 100,   /* desktop budget (1280 px) */ 'gate ' + n + ' ' + want + ': scene up, ground on GY, budget ' + JSON.stringify({ key: s.key, why: s.why, gy: s.gy, groundY: s.groundY && +s.groundY.toFixed(1), info: s.info })); }
  await p.context().close();

  /* desktop post-processing (AO, bloom, vignette) is on, and the phone path skips it */
  p = await page('?places=1&lang=vi', { post: true, tag: 'post' }); await start(p, 1, true); await settled(p); await p.waitForTimeout(1500); s = await S(p);
  ok(s.ready && s.info && s.info.post === true && s.info.frameCalls > s.info.calls, 'desktop: post-processing on ' + JSON.stringify(s.info)); await p.context().close();
  p = await page('?places=1&lang=vi', { post: true, vp: { width: 390, height: 844 }, tag: 'post phone' }); await start(p, 1, true); await settled(p); await p.waitForTimeout(1500); s = await S(p);
  ok(s.ready && s.info && s.info.post === false, 'phone: no post-processing ' + JSON.stringify(s.info)); await p.context().close();

  /* P3: the opening scene names the place, in vi / en / zh */
  const want = { vi: ['Đường Lâm', 'Cổng làng Mông Phụ, dựng năm 1553'], en: ['Duong Lam', 'Mong Phu village gate, built in 1553'], zh: ['唐林古村', '古村的村门，建于1553年'] };
  for (const lg of ['vi', 'en', 'zh']) { p = await page('?places=1&lang=' + lg, { tag: 'p3 ' + lg }); await start(p, 1); await p.waitForTimeout(300);
    const c = await p.evaluate(() => { const B = __bakhi.get(); return B.cine && B.cine.place ? { name: B.cine.place.name, sub: B.cine.place.sub, dur: B.cine.dur } : null; });
    ok(c && c.name === want[lg][0] && c.sub === want[lg][1] && c.dur >= 5200, lg + ' P3: opening scene carries the place ' + JSON.stringify(c)); await p.context().close(); }

  /* P4: drag turns the view in the opening scene without skipping it; a plain tap still skips; in a fight a drag does not turn the view */
  p = await page('?places=1&lang=vi', { tag: 'p4', vp: { width: 390, height: 844 } }); await start(p, 1); await settled(p); await p.waitForTimeout(600);   /* the input logic is the same on every size; the phone path keeps software GL fast enough */
  const t0 = await p.evaluate(() => __bakhi.get().cine.t0);
  await p.mouse.move(200, 400); await p.mouse.down(); await p.mouse.move(120, 380, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(200);
  let r = await p.evaluate(() => ({ yaw: PLACE3D.state().yaw, cine: !!__bakhi.get().cine, t0: __bakhi.get().cine && __bakhi.get().cine.t0 }));
  ok(r.cine && r.t0 >= t0 && Math.abs(r.yaw) > .1, 'P4 drag in the opening scene turns the view, holds it and does not skip it ' + JSON.stringify(r));
  const t1 = await p.evaluate(() => { const B = __bakhi.get(); if (!B.cine) return null; B.cine.t0 = __bakhi.clock() - 1000; return B.cine.t0; });   /* 1 s into the scene: past the game's 0.5 s tap guard, whatever the test machine's speed */
  await p.mouse.click(200, 400); await p.waitForTimeout(150);
  r = await p.evaluate(() => ({ cine: !!__bakhi.get().cine, t0: __bakhi.get().cine && __bakhi.get().cine.t0 }));
  ok(t1 !== null && (!r.cine || r.t0 < t1), 'P4 a plain tap still reaches the game (opening scene skipped) ' + JSON.stringify(r));
  await start(p, 1, true); await p.waitForFunction(() => __bakhi.get().state === 'fight' && PLACE3D.live(), null, { timeout: 30000 }); await p.waitForTimeout(500);
  await p.mouse.move(200, 300); await p.mouse.down(); await p.mouse.move(80, 300, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(200);
  ok(Math.abs(await p.evaluate(() => PLACE3D.state().yaw)) < .01, 'P4 in a fight a drag does not turn the view'); await p.context().close();

  /* P5: no WebGL, a missing file, a slow device: back to the 2D background, the game keeps running, no page error */
  p = await page('?places=1&lang=vi', { noGL: true, tag: 'p5 nogl' }); await start(p, 1, true); await settled(p); s = await S(p);
  ok(s.failed && s.why === 'no-webgl' && s.hidden, 'P5 no WebGL: falls back ' + JSON.stringify({ failed: s.failed, why: s.why })); await p.context().close();
  p = await page('?places=1&lang=vi', { block: /places\/duonglam\.js/, tag: 'p5 block' }); await start(p, 1, true); await settled(p); s = await S(p);
  await p.waitForFunction(() => __bakhi.get().state === 'fight', null, { timeout: 20000 }); await p.waitForTimeout(600);
  ok(s.failed && /^load/.test(s.why) && s.hidden, 'P5 scene file blocked: falls back ' + JSON.stringify({ why: s.why }));
  ok(await p.evaluate(() => { const c = document.getElementById('game'), x = c.getContext('2d').getImageData(c.width / 2, 20, 1, 1).data; return x[3] === 255; }), 'P5 after the fallback the 2D background is drawn'); await p.context().close();
  p = await page('?places=1&lang=vi', { slow: false, vp: { width: 1280, height: 720 }, tag: 'p5 slow' }); await p.addInitScript(() => {}); await p.evaluate(() => { window.__slowHog = setInterval(() => { const t = performance.now(); while (performance.now() - t < 40) {} }, 0); });
  await start(p, 1, true); await settled(p); await p.waitForFunction(() => PLACE3D.state().failed, null, { timeout: 20000 }).catch(() => {}); s = await S(p);
  ok(s.failed && /^slow/.test(s.why), 'P5 frames over 22 ms for 3 s of fighting: falls back ' + JSON.stringify({ why: s.why })); await p.context().close();

  /* no false fallback: the slow check counts every game frame, drawn or skipped (the scene is drawn at half rate when still),
     so its average gap matches the browser's own frame gap instead of doubling it */
  p = await page('?places=1&lang=vi', { vp: { width: 320, height: 240 }, tag: 'p5 gap' }); await start(p, 1, true); await settled(p);
  await p.waitForFunction(() => __bakhi.get().state === 'fight', null, { timeout: 20000 }); await p.waitForTimeout(1000);
  r = await p.evaluate(() => new Promise(res => { const gaps = []; let last = 0; const t0 = performance.now(); (function f(t){ if (last) gaps.push(t - last); last = t; if (performance.now() - t0 < 3200) requestAnimationFrame(f); else res({ raf: gaps.reduce((a, b) => a + b, 0) / gaps.length, p3d: PLACE3D.state().slowAvg }); })(); }));
  ok(r.p3d > 0 && Math.abs(r.p3d - r.raf) / r.raf < .35, 'P5 the slow check measures the real frame gap (' + r.p3d.toFixed(1) + ' ms vs browser ' + r.raf.toFixed(1) + ' ms)'); await p.context().close();

  /* the fight itself is untouched: a few seconds of AI fighting on gate 1 with the scene on */
  p = await page('?places=1&lang=vi', { tag: 'fight' }); await start(p, 1, true); await settled(p); await p.waitForFunction(() => __bakhi.get().state === 'fight', null, { timeout: 20000 });
  const hp0 = await p.evaluate(() => __bakhi.get().H.hp); await p.waitForTimeout(6000); const hp1 = await p.evaluate(() => ({ hp: __bakhi.get().H.hp, st: __bakhi.get().state }));
  ok(hp1.hp <= hp0 && ['fight', 'rend', 'count', 'won', 'lost'].indexOf(hp1.st) >= 0, 'fight runs with the scene on ' + JSON.stringify({ hp0, hp1 })); await p.context().close();

  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs.slice(0, 5)));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
