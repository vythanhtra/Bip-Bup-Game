/* 40-gate teaching (Owner 2026-10-27, review G1-1/G1-3): no reflex-engine rules left in what the player reads (vi/en/zh),
   each world's threats introduced one at a time (FIGHT_PLAN), the lesson opens in the dialogue box, Gà Bíp repeats it the first time it happens in the fight,
   and an unblockable grab keeps its 🤲 above flash/hearts/smoke */
const { chromium } = require('playwright');
const U = process.env.URL || 'http://localhost:8765/preview/';
let fails = 0; function ok(c, m){ console.log((c ? 'ok' : 'not ok') + ' - ' + m); if (!c) fails++; }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OLD = {   /* phrases that only make sense in the reflex engine */
  vi: /bụp hai|bụp HAI|tích khí|điểm sáng|đếm gáy|luật ngược|giữ ngón|màn hình (đỏ|xanh)|màn đỏ|nhịp đôi|tiếng cuối|tối dần|cửa sổ phản xạ|bụp sớm|hô gì bụp nấy/i,
  en: /charge|light spot|find the light|count rule|reverse rule|hold your finger|red screen|green screen|screen turns|double beat|double beep|the last one|goes dark|reaction window|early boop|boop what i call/i,
  zh: /嘭两下|蓄气|亮点|数数|反转|按住屏幕|红屏|绿屏|屏幕变红|双拍|双哔|最后一声|变暗|窗口|抢嘭|我报啥/ };
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));

  /* 1. text audit, all three languages: dialogue, gate intros, world descriptions, hero perks and bios, prologue */
  for (const lg of ['vi', 'en', 'zh']) {
    await p.goto(U + '?lang=' + lg); await sleep(700);
    const texts = await p.evaluate(() => { const out = [];
      for (const n in DIALOG) DIALOG[n].forEach((d, i) => out.push(['DIALOG ' + n + '.' + i, d.text]));
      for (const n in GATE_META) (GATE_META[n].intro || []).forEach((l, i) => out.push(['GATE_META ' + n + '.' + i, l[1]]));
      WORLDS.forEach(w => out.push(['WORLD ' + w.id, w.mech])); for (const k in HEROES) { out.push(['HERO ' + k, HEROES[k].perk]); out.push(['BIO ' + k, HEROES[k].bio]); }
      PRO_DLG.forEach((d, i) => out.push(['PRO ' + i, d.text])); STORY.forEach((s, i) => out.push(['STORY ' + i, s])); return out; });
    const bad = texts.filter(t => OLD[lg].test(t[1]));
    ok(bad.length === 0, lg + ': no reflex-engine rules in ' + texts.length + ' player-facing lines' + (bad.length ? ': ' + JSON.stringify(bad.slice(0, 4)) : ''));
    const lessons = await p.evaluate(() => Object.keys(FIGHT_PLAN).filter(n => FIGHT_PLAN[n].teach).map(n => { const d = DIALOG[n] || (GATE_META[n].intro || []).map(l => ({ who: l[0], text: l[1] })); return [n, FIGHT_PLAN[n].teach, (d.find(x => x.who === 'gabip') || {}).text || '']; }));
    ok(lessons.length === 12 && lessons.every(l => l[2].length > 20), lg + ': all 12 lesson gates have a Gà Bíp line (' + lessons.map(l => l[0] + ':' + l[1]).join(' ') + ')');
    const coach = await p.evaluate(() => ['jump', 'dash', 'tag', 'duck', 'grab', 'upper', 'ice', 'fin', 'smoke', 'lava', 'eparry', 'mix'].filter(k => T('coach_' + k) === 'coach_' + k));
    ok(coach.length === 0, lg + ': every lesson has an in-fight reminder text ' + coach.join(','));
  }

  await p.goto(U + '?lang=vi'); await sleep(800);
  await p.evaluate(() => { localStorage.clear(); const s = __bakhi.save; s.seen = { t0: 1, pro: 1, kb: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1 }; s.unlocked = 40; s.stars = {}; __bakhi.setHero('tibup'); });
  const L = () => p.evaluate(() => __bakhi.lesson());
  const toFight = async () => { for (let i = 0; i < 12 && await p.evaluate(() => __bakhi.get().state === 'dialog' || __bakhi.get().state === 'cine'); i++) { await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'cine') B.cine.t0 = -1e9; else document.getElementById('dlg-box').click(); }); await sleep(120); } await p.evaluate(() => __bakhi.beep()); await sleep(200); };
  const open = async n => { await p.evaluate(n => __bakhi.startGate(n, { skipDlg: true }), n); await toFight(); };

  /* 2. the lesson opens in the dialogue box on the first visit (not as a two-second bubble) */
  await p.evaluate(() => { __bakhi.startGate(11); }); await sleep(300);
  for (let i = 0; i < 4 && await p.evaluate(() => __bakhi.get().state === 'cine'); i++) { await p.evaluate(() => { __bakhi.get().cine.t0 = -1e9; }); await sleep(150); }
  let box = await p.evaluate(() => ({ st: __bakhi.get().state, vis: !document.getElementById('dlg').hidden, txt: document.getElementById('dlg-text').textContent, bub: !!__bakhi.get().introBubbles }));
  ok(box.st === 'dialog' && box.vis && /VẬT/.test(box.txt) && !box.bub, 'gate 11 opens with the grab lesson in the dialogue box: ' + box.txt.slice(0, 50));
  await toFight();

  /* 3. one new thing at a time */
  const want = { 9: ['duck'], 10: ['duck', 'feint'], 11: ['grab'], 12: ['duck', 'feint', 'grab'], 13: ['grab', 'upper', 'dash'], 14: ['duck', 'feint', 'grab', 'upper', 'dash'],
    17: ['ice'], 19: ['fin'], 21: ['ice', 'fin'], 25: ['smoke'], 27: ['lava'], 29: ['eparry'], 30: ['smoke', 'lava', 'eparry'] };
  const NEW = { 2: ['duck', 'feint', 'grab', 'upper', 'dash'], 3: ['ice', 'fin'], 4: ['smoke', 'lava', 'eparry'] };
  for (const n of Object.keys(want).map(Number)) {
    await open(n); const l = await L(); const w = n <= 16 ? 2 : n <= 24 ? 3 : 4; const own = l.feats.filter(f => NEW[w].includes(f)).sort();
    ok(JSON.stringify(own) === JSON.stringify(want[n].slice().sort()), 'gate ' + n + ': world ' + w + ' features on = ' + own.join(',') + ' (want ' + want[n].join(',') + ')');
    if (w === 3) ok(l.feats.includes('grab') && l.feats.includes('upper'), 'gate ' + n + ': world 2 threats stay on');
    if (n === 25 || n === 27) ok((n === 25) === (l.smoke > 0) && (n === 25) === !!l.mods.smoke && (n === 27) === !!l.mods.lava, 'gate ' + n + ': smoke ' + l.smoke + ', lava ' + l.mods.lava);
    await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(100);
  }
  await open(35); let l35 = await L(); ok(l35.feats.length === 10, 'world 5 keeps every feature (random stage mix)'); await p.evaluate(() => document.getElementById('btn-quit').click());

  /* 4. Gà Bíp repeats the lesson the first time it happens, from the real fight engine */
  const coached = async (n, k, setup, ms) => { await open(n); await p.evaluate(setup); for (let t = 0; t < ms; t += 100) { if ((await L()).coached[k]) break; await sleep(100); } const l = await L(); const bub = await p.evaluate(() => __bakhi.get().coachMsg || ''); await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(100); return { on: !!l.coached[k], bub: bub }; };
  let c = await coached(2, 'jump', () => {}, 300); ok(c.on && /▲|nhảy/i.test(c.bub), 'gate 2: jump lesson at the BÍP: ' + c.bub);
  await open(9); await p.evaluate(() => { __bakhi.get().duckNext = 0; }); await sleep(250); const b0 = await p.evaluate(() => __bakhi.get().bubble); await sleep(900);
  await p.evaluate(() => { const B = __bakhi.get(); B.bubble = 'Cạc... cục!'; B.bubbleWho = 'vitgia'; B.bubbleT = __bakhi.clock(); }); await sleep(300);   /* an enemy call right after must not replace the lesson */
  const b1 = await p.evaluate(() => { const B = __bakhi.get(); return __bakhi.clock() - B.coachT < 2600 ? B.coachMsg : ''; }), d9 = (await L()).coached.duck; await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(100);
  ok(d9 && b0 === 'BÍP!' && /CẠC/.test(b1), 'gate 9: the fake BÍP shows first, then Gà Bíp explains it: ' + b0 + ' → ' + b1);
  c = await coached(11, 'grab', () => { const B = __bakhi.get(); B.H.x = B.E.x - 50; __bakhi.key('b', 1); }, 8000); await p.evaluate(() => __bakhi.key('b', 0));
  ok(c.on && /🤲/.test(c.bub), 'gate 11: the enemy AI grabs a blocking hero and Gà Bíp explains: ' + c.bub);
  /* isolation: in gate 9 the same blocking never draws a grab */
  await open(9); await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 50; window.__grabs = 0; B.H.hp = B.H.hmax = 9999; __bakhi.key('b', 1); });
  for (let t = 0; t < 6000; t += 50) { if (await p.evaluate(() => __bakhi.get().E.atkKey === 'grab' && __bakhi.get().E.st === 'atk')) { await p.evaluate(() => window.__grabs++); break; } await sleep(50); }
  ok(await p.evaluate(() => window.__grabs === 0), 'gate 9: 6 s of blocking next to the duck, no grab (grab is taught at gate 11)'); await p.evaluate(() => { __bakhi.key('b', 0); document.getElementById('btn-quit').click(); });
  c = await coached(27, 'lava', () => { const B = __bakhi.get(); B.stillT = __bakhi.clock() - 1600; }, 400); ok(c.on && /Đất nóng/.test(c.bub), 'gate 27: hot-ground warning before the first burn: ' + c.bub);
  c = await coached(29, 'eparry', () => { const B = __bakhi.get(); B.E.ai.next = __bakhi.clock() + 1e9; B.E.ai.mode = 'block'; B.H.x = B.E.x - 45; B.E.st = 'block'; B.E.blockHeld = true; B.E.blockT = __bakhi.clock(); __bakhi.press('lt'); }, 800);
  ok(c.on && /đỡ chuẩn/.test(c.bub), 'gate 29: the enemy perfect-blocks and Gà Bíp explains: ' + c.bub);
  c = await coached(10, 'duck', () => { __bakhi.get().duckNext = 0; }, 400); ok(!c.on, 'practice gate 10 does not repeat the lesson');

  /* 5. keyboard wording on computers */
  await p.evaluate(() => __bakhi.device('pc')); c = await coached(4, 'dash', () => {}, 300); ok(c.on && /[AD←→]{2}/.test(c.bub), 'gate 4 on a computer names the keys: ' + c.bub); await p.evaluate(() => __bakhi.device('phone'));

  /* 6. grab warning stays on top of the lantern flash */
  await open(12); await p.evaluate(() => { const B = __bakhi.get(); B.E.ai.next = __bakhi.clock() + 1e9; B.H.x = B.E.x - 50; B.blindUntil = __bakhi.clock() + 2000; B.E.st = 'idle'; __bakhi.cunning('grab'); B.E.atk = Object.assign({}, B.E.atk, { su: 900 }); });
  await sleep(250); const mk = await p.evaluate(() => (__bakhi.get().marks || []).length); await p.screenshot({ path: 'tests/shots/f9-grab-blind.png' });
  ok(mk === 1, 'grab under the flash: 🤲 queued for the top layer (' + mk + ')');

  /* 7. floating hit text (Owner 2026-10-27: it covered the screen during combos): one label per combo, summed damage, short life */
  await open(3); await p.evaluate(() => { const B = __bakhi.get(); B.E.hp = B.E.hmax = 999; B.E.ai.next = __bakhi.clock() + 1e9; B.E.ai.mode = 'idle'; });
  for (const k of ['lt', 'lt', 'hv']) { await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 45; }); await p.evaluate(k => __bakhi.press(k), k); await sleep(200); }
  let fl = await p.evaluate(() => __bakhi.fxList().filter(f => f.hit)), lost = await p.evaluate(() => 999 - __bakhi.get().E.hp);
  ok(fl.length === 1 && fl[0].n === 3 && fl[0].sub === '-' + lost && /×3/.test(fl[0].txt), 'jab, jab, hook make one label: ' + JSON.stringify(fl));
  await sleep(1000); ok(await p.evaluate(() => __bakhi.fxLive()) === 0, 'hit labels are gone 1 s after the last hit');
  /* the enemy's reaction line waits for the hit label instead of covering it (Owner 2026-10-29), then shows in what is left of its 1.6 s */
  const jab = async () => { for (let i = 0; i < 20 && !await p.evaluate(() => __bakhi.fxLive()); i++) { await p.evaluate(() => { const B = __bakhi.get(); B.H.x = B.E.x - 45; __bakhi.press('lt'); }); await sleep(150); } };   /* the hook above may still have the enemy down */
  await jab();
  await p.evaluate(() => { const B = __bakhi.get(); B.bubble = 'Nhẹ tay!'; B.bubbleWho = B.e.spr; B.bubbleT = __bakhi.clock(); });
  ok(await p.evaluate(() => __bakhi.fxLive()) > 0 && !await p.evaluate(() => __bakhi.bubbleOn()), 'enemy reaction line hidden while the hit label is up');
  await sleep(1000); ok(await p.evaluate(() => __bakhi.fxLive()) === 0 && await p.evaluate(() => __bakhi.bubbleOn()), 'enemy reaction line shows once the label is gone');
  await jab();
  await p.evaluate(() => { const B = __bakhi.get(); B.bubble = 'BÍP! ĐÁNH!'; B.bubbleWho = B.e.spr; B.bubbleT = __bakhi.clock(); });
  ok(await p.evaluate(() => __bakhi.fxLive()) > 0 && await p.evaluate(() => __bakhi.bubbleOn()), 'a BÍP line from an enemy is gameplay and shows even over a hit label');
  await p.evaluate(() => document.getElementById('btn-quit').click()); await sleep(100);

  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
