/* Lính Đèn Lồng (Owner 2026-10-31, ADR-009 Q5): in the art edition its lines are attributed to its own art (portrait p/linhdem),
   not to Lính Cỏ's, and the fight draws its own sprite; the coded-sprite edition keeps Lính Cỏ recoloured (there is no coded Lính Đèn Lồng). */
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
(async () => {
  const b = await chromium.launch();
  for (const [ed, want] of [['preview/', 'linhdem'], ['', 'linhco']]) {
    const p = await (await b.newContext({ viewport: { width: 430, height: 932 } })).newPage(); await p.route(/supabase\.co/, r => r.abort());
    const errs = []; p.on('pageerror', e => errs.push(e.message)); const tag = (ed || 'root') + ': ';
    await p.goto(BASE + ed + '?lang=vi'); await p.waitForTimeout(900);
    await p.evaluate(() => { __bakhi.save.seen = { t0: 1, pro: 1, kb: 1 }; __bakhi.save.unlocked = 40; __bakhi.startGate(10); });
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => { const B = __bakhi.get(); return { ib: (B.introBubbles || []).map(d => d.who + '/' + d.spr), art: typeof ASSETS !== 'undefined' && ASSETS.count() > 0 }; });
    ok(r.ib[0] === 'linhdem/' + want, tag + "gate 10 opening line is Lính Đèn Lồng's, drawn as " + want + ' (' + r.ib.join(', ') + ')');
    if (r.art) {
      await p.waitForFunction(() => { const B = __bakhi.get(); return B.state === 'fight' || B.state === 'count'; }, null, { timeout: 15000 }).catch(() => {});
      ok(await p.evaluate(() => !!ASSETS.sprite('linhdem', 'idle') && __bakhi.get().E.ekey === 'linhdem'), tag + 'the fight draws the linhdem sprite (key linhdem, image loaded)');
    }
    ok(errs.length === 0, tag + 'no page errors ' + JSON.stringify(errs));
  }
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
