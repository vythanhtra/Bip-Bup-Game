/* line spacing (Owner 2026-10-31: wrapped lines touched, Vietnamese capitals stack two marks above): every text that wraps to 2+ lines
   on the title, map, shop, keyboard guide and dialogue box keeps at least 1.35 x its font size between lines. Display titles (.logo) are exempt. */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/', MIN = 1.35;
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
function tight(MIN){
  const blocks = new Map(), walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = walker.nextNode())) { if (!n.textContent.trim()) continue; let el = n.parentElement; if (!el || !el.getClientRects().length || el.closest('.logo')) continue;
    while (el && getComputedStyle(el).display === 'inline') el = el.parentElement;
    const r = document.createRange(); r.selectNodeContents(n); const tops = [...r.getClientRects()].filter(q => q.width > 1).map(q => q.top);
    blocks.set(el, (blocks.get(el) || []).concat(tops)); }
  const bad = [];
  for (const [el, tops] of blocks) { const t = [...new Set(tops.map(Math.round))].sort((a, b) => a - b).filter((x, i, a) => i === 0 || x - a[i - 1] > 3); if (t.length < 2) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize), lh = parseFloat(getComputedStyle(el).lineHeight);   /* the computed value, not the rounded pixel pitch */
    const ratio = isNaN(lh) ? Math.min(...t.slice(1).map((x, i) => x - t[i])) / fs : lh / fs;
    if (ratio < MIN) bad.push((el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + el.className) + ' ' + ratio.toFixed(2) + ' "' + el.textContent.trim().slice(0, 40) + '"'); }
  return bad; }
(async () => {
  const b = await chromium.launch();
  for (const [L, w, h] of [['vi', 360, 740], ['vi', 1280, 720], ['en', 360, 740], ['zh', 360, 740]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 800, hasTouch: w < 800 })).newPage(); await p.route(/supabase\.co/, r => r.abort());
    const errs = []; p.on('pageerror', e => errs.push(e.message)); const W = ms => p.waitForTimeout(ms), tag = L + ' ' + w + 'px ';
    const check = async s => { const bad = await p.evaluate(tight, MIN); ok(bad.length === 0, tag + s + ': wrapped text keeps line spacing >= ' + MIN + (bad.length ? ' ' + JSON.stringify(bad) : '')); };
    await p.goto(U + '?lang=' + L); await W(1000); await check('title');
    await p.evaluate(() => { const s = __bakhi.save; s.seen = { t0: 1, pro: 1, kb: 1 }; s.unlocked = 14; s.coins = 900; }); await p.reload(); await W(1000); await check('title, returning player');
    await p.evaluate(() => document.getElementById('btn-map').click()); await W(500); await check('map');
    await p.reload(); await W(900); await p.evaluate(() => document.getElementById('btn-shop').click()); await W(500); await check('shop');
    await p.reload(); await W(900); await p.evaluate(() => { const k = document.getElementById('btn-keys'); if (k) k.click(); }); await W(400); await check('keyboard guide');
    await p.reload(); await W(900); await p.evaluate(() => { __bakhi.save.seen = { t0: 1, pro: 1, kb: 1 }; __bakhi.save.unlocked = 40; __bakhi.startGate(9); }); await W(900); await check('dialogue box');
    ok(errs.length === 0, tag + 'no page errors ' + JSON.stringify(errs)); }
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
