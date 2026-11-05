/* Main link edition (Owner 2026-11-05: release the painted edition on the main link).
   Default: the art edition (painted sprites, first PLAY opens the prologue). ?art=0: the pixel edition (text sprites, first PLAY opens tutorial gate 0),
   which the p-series tests use. */
const { chromium } = require('playwright');
const BASE = 'file://' + __dirname + '/../public/index.html';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [q, art] of [['?lang=vi', true], ['?art=0&lang=vi', false]]) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })).newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.route(/supabase\.co/, r => r.abort());
    await p.goto(BASE + q); await p.waitForTimeout(600);
    const n = await p.evaluate(() => ASSETS.count());
    ok(art ? n > 100 : n === 0, q + ': ' + (art ? 'art' : 'pixel') + ' edition, ' + n + ' images listed');
    await p.click('#btn-play'); await p.waitForTimeout(700);
    const r = await p.evaluate(() => { const B = __bakhi.get(); return { pro: !!(__bakhi.pro && __bakhi.pro()), tut: !!(B && B.tut0) }; });
    ok(art ? r.pro && !r.tut : !r.pro && r.tut, q + ': first PLAY opens ' + (art ? 'the prologue' : 'tutorial gate 0') + ' ' + JSON.stringify(r));
    await p.context().close();
  }
  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
