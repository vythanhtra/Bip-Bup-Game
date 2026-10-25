const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); const ok = (c, m) => console.log((c ? 'PASS' : 'FAIL') + ' ' + m);
  const posted = []; await p.route('**/rest/v1/events', r => { posted.push(...JSON.parse(r.request().postData())); r.fulfill({ status: 201, body: '' }); });
  await p.goto('file://' + __dirname + '/../public/index.html?lang=vi'); await sleep(300);
  await p.evaluate(() => { localStorage.removeItem('bakhi.save'); CONFIG.analyticsUrl = 'https://x.supabase.co'; CONFIG.analyticsKey = 'k'; });
  await p.goto('about:blank'); await p.goto('file://' + __dirname + '/../public/index.html?lang=vi'); await sleep(300);
  await p.evaluate(() => { CONFIG.analyticsUrl = 'https://x.supabase.co'; CONFIG.analyticsKey = 'k'; });
  // first visit: PLAY -> tutorial gate 0
  await p.tap('#btn-play'); await sleep(400);
  let v = await p.evaluate(() => { const B = __bakhi.get(); return { tut: !!B.tut0, st: B.state, hud: document.getElementById('hud-gate').textContent, atks: B.atks.length, forgive: B.forgiveAtk }; });
  ok(v.tut && v.st === 'wait' && /CỬA 0/.test(v.hud) && v.atks === 1, 'first PLAY goes straight into tutorial gate 0: ' + v.hud);
  // let the first attack land: forgiven, no heart lost
  await p.waitForFunction(() => !!__bakhi.atk(), null, { timeout: 8000, polling: 10 }); const h0 = await p.evaluate(() => __bakhi.get().hearts); await sleep(1700);
  v = await p.evaluate(() => { const B = __bakhi.get(); return { st: B.state, hearts: B.hearts, forgive: B.forgiveAtk, step: B.tutStep }; });
  ok(v.hearts === h0 && v.st === 'wait' && v.forgive === 8 && v.step === 0, 'tutorial: missed parry is forgiven and the step repeats');
  // parry it -> step 1 (feint)
  await p.waitForFunction(() => !!__bakhi.atk(), null, { timeout: 8000, polling: 10 }); await sleep(100); const a = await p.evaluate(() => __bakhi.atk()); await p.evaluate(d => __bakhi.swipe(d), a.dir); await sleep(100);
  v = await p.evaluate(() => { const B = __bakhi.get(); return { step: B.tutStep, combo: B.combo }; }); ok(v.step === 1 && v.combo === 1, 'tutorial: parry advances to the feint lesson');
  await p.waitForFunction(() => __bakhi.get().state === 'wait' && __bakhi.get().round >= 2, null, { timeout: 9000, polling: 10 });
  await p.waitForFunction(() => { const a = __bakhi.atk(); return a && a.feint; }, null, { timeout: 8000, polling: 10 }); await sleep(1700);
  v = await p.evaluate(() => { const B = __bakhi.get(); return { step: B.tutStep, hearts: B.hearts }; }); ok(v.step === 2 && v.hearts === h0, 'tutorial: ignoring the feint advances to the beep lesson');
  await p.waitForFunction(() => __bakhi.get().state === 'go', null, { timeout: 12000, polling: 10 }); await sleep(100); await p.evaluate(() => __bakhi.tap()); await sleep(100);
  await p.waitForFunction(() => __bakhi.get().state === 'won' || (__bakhi.get().n === 1 && !__bakhi.get().tut0), null, { timeout: 12000, polling: 20 });
  await sleep(1800); v = await p.evaluate(() => { const B = __bakhi.get(); return { n: B.n, tut: !!B.tut0, seen: __bakhi.save.seen.t0, st: B.state }; });
  ok(!v.tut && v.n === 1 && v.seen === 1, 'tutorial done -> gate 1 starts, seen.t0 saved: ' + JSON.stringify(v));
  // quit -> map; title PLAY now goes straight to the next unlocked gate
  await p.evaluate(() => { document.getElementById('btn-quit').click(); }); await sleep(100); ok(await p.evaluate(() => !document.getElementById('s-map').hidden), 'quit shows the map');
  await p.evaluate(() => { document.getElementById('btn-home').click(); __bakhi.save.unlocked = 7; }); await sleep(100); await p.tap('#btn-play'); await sleep(300);
  ok(await p.evaluate(() => __bakhi.get().n === 7 && !__bakhi.get().tut0), 'PLAY jumps straight to the next unlocked gate');
  await p.evaluate(() => { document.getElementById('btn-quit').click(); document.getElementById('btn-home').click(); }); await sleep(100);
  ok(await p.evaluate(() => !document.getElementById('btn-map2').hidden), 'title has a map button');
  // analytics: events posted with the expected shape
  await p.evaluate(() => A.flush()); await sleep(300);
  const names = posted.map(e => e.ev); const keys = Object.keys(posted[0] || {}).sort().join(',');
  ok(names.includes('play') && names.includes('gate_start') && names.includes('gate_clear') && names.includes('quit'), 'analytics events: ' + [...new Set(names)].join(' '));
  ok(keys === 'd,ev,g,lang,ms,portal,secs,sid,v,x', 'event row shape: ' + keys);
  // portal edition hides outbound buttons and the picker
  await p.goto('about:blank'); await p.goto('file://' + __dirname + '/../public-portal/index.html'); await sleep(400);
  const pe = await p.evaluate(() => ({ portal: PORTAL.on, fb: document.getElementById('btn-fb').hidden, pick: document.getElementById('langpick').hidden, bar: document.getElementById('langbar').hidden, lang: I18N.lang, sdk: !!document.querySelector('script[src*="crazygames"]') }));
  ok(pe.portal && pe.fb && pe.pick && pe.bar && pe.lang === 'en' && pe.sdk, 'portal edition: ' + JSON.stringify(pe));
  console.log('errors:', errs.length ? errs : 'none'); await b.close();
})();
