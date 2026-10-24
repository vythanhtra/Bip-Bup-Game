/* Trailer v4 recorder: hook / logo / game / vs / outro, per language (LANG=vi|en). In-page event log with real timestamps. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const LANG = process.env.LANG_CUT || 'vi', OUT = path.join(__dirname, 'raw4-' + LANG);
const FULL = { width: 1080, height: 1920 }, PHONE = { width: 540, height: 960 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const GAME = 'file:///home/user/ba-khi/public/index.html?lang=' + LANG;
const SUB_CSS = `#__sub{position:fixed;left:50%;top:15%;transform:translate(-50%,0);background:rgba(11,11,22,.9);border:2px solid #ffd23f;color:#fff;font-family:'Be Vietnam Pro',system-ui,sans-serif;font-weight:900;font-size:25px;line-height:1.25;padding:12px 18px;border-radius:14px;max-width:88%;text-align:center;z-index:80;pointer-events:none;opacity:0;transition:opacity .2s;text-wrap:balance}#__sub.on{opacity:1}#__sub b{color:#c6ff2e}#__sub.big{font-size:34px;border-color:#ff2e6e}#__sub.low{top:auto;bottom:9%}`;
const S = {
  vi: { fooled: 'Vừa bị <b>VỊT</b> lừa. Vịt có chứng chỉ.', rule: 'Luật: nghe <b>BÍP</b> thì <b>BỤP</b>. Càng nhanh, đòn càng đau.', early: 'Còn bụp <b>trước</b> khi gà gáy?', hit: '<b>Ăn đòn.</b>', lost: '<b>THUA.</b> Nó không bao giờ học.', m: ['LÍNH CỎ BỊ CHIM Ị', 'TRÂU LƯỜI GYM', 'TIÊN NỮ BÁN HÀNG ONLINE'], red: 'Màn <b>ĐỎ</b>, tiếng CẠC: đứng im.', green: 'Màn <b>XANH</b>: BỤP.', rev: 'Cửa 14 lật luật: <b>CẠC thì BỤP</b>, BÍP thì im.', count: 'Cửa 22: gà gáy 2 hay 3 tiếng. Bụp sau tiếng <b>CUỐI</b>.', hold: '<b>GIỮ</b> ngón tay tích khí. Gà gáy thì <b>THẢ</b>.', spot: 'Khói che hết. Bụp đúng <b>điểm sáng</b>.', boss: 'Trùm Chợ Đêm <b>tự hô BÍP</b> để lừa.', trust: 'Chỉ tin <b>Gà Bíp</b>.', ko16: '<b>Hạ trùm.</b>', daily: '<b>CỬA HẰNG NGÀY</b>: cả thế giới cùng một cửa, cùng mánh.', dailyRes: 'Lần đầu mới tính. Giữ <b>chuỗi ngày</b>.', ghost: 'Gửi link thách đấu: bạn mình thấy <b>bóng ma</b> bạn bụp ở đâu.', final: 'Trùm cuối: <b>3 hiệp</b>, trộn mọi mánh.', quote: '"Tao là đá. Đá không vội." vs "Mười nghìn năm ta chậm."', share: 'Lưu thẻ. Gửi link. <b>Bạn phải nhanh hơn tôi.</b>', vs: '<b>2 NGƯỜI 1 MÁY</b>: ai bụp trước thắng hiệp.', vsFake: 'Vịt gáy giả: ai bụp là <b>thua hiệp</b>.', vsEnd: 'Người thua <b>rửa bát</b>.' },
  en: { fooled: 'Scammed by a <b>DUCK</b>. A certified one.', rule: 'One rule: hear <b>BEEP</b>, you <b>BOOP</b>. Faster = harder.', early: 'Boop <b>before</b> the beep?', hit: '<b>Punished.</b>', lost: '<b>LOST.</b> He never learns.', m: ['GRASS GUARD, BIRD VICTIM', 'GYM-MEMBER BUFFALO', 'FAIRY INFLUENCER'], red: '<b>RED</b> screen, QUACK: freeze.', green: '<b>GREEN</b>: BOOP.', rev: 'Gate 14 flips it: <b>QUACK = BOOP</b>, BEEP = freeze.', count: 'Gate 22: two or three crows. Boop after the <b>LAST</b>.', hold: '<b>HOLD</b> to charge. Beep: <b>RELEASE</b>.', spot: 'Smoke everywhere. Punch the <b>light</b>.', boss: 'The boss <b>fakes the beep</b> himself.', trust: 'Trust only <b>the chicken</b>.', ko16: '<b>Boss down.</b>', daily: '<b>DAILY GATE</b>: same gate, same tricks, whole world.', dailyRes: 'First try counts. Keep your <b>streak</b>.', ghost: 'Send the link: your friend sees the <b>ghost</b> of your boop.', final: 'Final boss: <b>3 rounds</b>, every trick at once.', quote: '"I am rock. Rock does not rush." vs "Ten thousand years I was slow."', share: 'Save the card. Send the link. <b>Beat my time.</b>', vs: '<b>2 PLAYERS, 1 PHONE</b>: first boop wins the round.', vsFake: 'Duck crows: whoever boops <b>loses the round</b>.', vsEnd: 'Loser <b>does the dishes</b>.' }
}[LANG];
async function rec(browser, name, size, fn) {
  const dir = path.join(OUT, name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, hasTouch: true, locale: LANG === 'vi' ? 'vi-VN' : 'en-US' });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('PAGEERROR', e.message, (e.stack || '').split('\n').slice(0, 2).join(' | ')));
  const cdp = await ctx.newCDPSession(page); const frames = []; let n = 0;
  cdp.on('Page.screencastFrame', ev => { const f = path.join(dir, 'f' + String(n++).padStart(6, '0') + '.jpg'); fs.writeFileSync(f, Buffer.from(ev.data, 'base64')); frames.push({ f, t: ev.metadata.timestamp }); cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }).catch(() => {}); });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, maxWidth: size.width, maxHeight: size.height, everyNthFrame: 1 });
  const marks = {}; const out = await fn(page, (k) => { marks[k] = Date.now() / 1000; }) || {};
  const tEnd = Date.now() / 1000; await cdp.send('Page.stopScreencast').catch(() => {}); await ctx.close();
  const start = frames[0].t; let list = '';
  for (let i = 0; i < frames.length; i++) { const d = (i + 1 < frames.length ? frames[i + 1].t : tEnd) - frames[i].t; list += "file '" + frames[i].f + "'\nduration " + Math.max(0.001, d).toFixed(4) + '\n'; }
  list += "file '" + frames[frames.length - 1].f + "'\n"; fs.writeFileSync(path.join(dir, 'list.txt'), list);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'), '-vf', 'fps=30,scale=' + size.width + ':' + size.height + ',setsar=1', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(OUT, name + '.mp4')]);
  const rel = {}; for (const k in marks) rel[k] = +(marks[k] - start).toFixed(3);
  const events = (out.events || []).map(e => Object.assign({}, e, { t: +(e.t / 1000 - start).toFixed(3) })).filter(e => e.t >= 0);
  const dur = tEnd - start; fs.writeFileSync(path.join(OUT, name + '.json'), JSON.stringify({ marks: rel, events, dur: +dur.toFixed(3) }, null, 1));
  console.log('recorded', name, frames.length, 'frames', dur.toFixed(1) + 's', events.length, 'events');
}
async function setupGame(p, url) {
  await p.goto(url || GAME); await p.addStyleTag({ content: SUB_CSS });
  await p.evaluate(() => {
    var seed = 7; Math.random = function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    try { localStorage.setItem('bakhi.lang', I18N.lang); } catch (e) {} __bakhi.save.seen.fk = 1; var lp = document.getElementById('langpick'); if (lp) lp.hidden = true;
    const d = document.createElement('div'); d.id = '__sub'; document.body.appendChild(d);
    window.__ev = window.__ev || []; window.__bot = { react: [150, 280], earlyN: 0, fakeOnce: false, foolOnce: false, tapped: false, quick: true, hpCap: 0, fakeMax: -1, _fr: -1, _fc: 0 };
    let lastB = null, lastState = '';
    setInterval(() => { const B = window.__bakhi.get(); if (!B) return;
      if (B !== lastB || B.state !== lastState) { lastB = B; lastState = B.state; if (['go', 'fakesig', 'hit', 'hurt', 'won', 'lost'].indexOf(B.state) >= 0) window.__ev.push({ k: B.state, t: performance.timeOrigin + (B.state === 'go' || B.state === 'fakesig' ? B.tSig : B.t0), ms: B.state === 'hit' ? (B.hits[B.hits.length - 1] || 0) : 0, gate: B.n, mech: B.mech, phase: B.phase }); }
      if (B.over) return; const now = performance.now();
      if (__bot.hpCap && B.hp > __bot.hpCap && B.state === 'wait') { B.hp = __bot.hpCap; B.max = __bot.hpCap; }
      if (__bot.quick && B.state === 'wait' && B.tSig - B.t0 > 1700) B.tSig = B.t0 + 900 + Math.random() * 700;
      if (__bot.fakeOnce && B.state === 'wait' && B.round === 1) { B.fake = true; __bot.fakeOnce = false; }
      if (B.state === 'wait' && B.mech === 'reverse' && B.round !== __bot._rr) { __bot._rr = B.round; B.fake = true; }
      if (__bot.fakeMax >= 0 && B.state === 'wait' && B.mech !== 'reverse' && B.round !== __bot._fr) { __bot._fr = B.round; if (B.fake) { if (__bot._fc >= __bot.fakeMax) B.fake = false; else __bot._fc++; } }
      if (__bot.foolOnce && B.state === 'fakesig' && now - B.tSig > 350) { __bot.foolOnce = false; window.__bakhi.tap(); }
      if (B.state === 'wait' && B.mech === 'hold' && !B.holding && now - B.t0 > 600 && __bot.earlyN === 0) window.__bakhi.tap();
      if (B.state === 'go' && !__bot.tapped) { __bot.tapped = true; const d = __bot.react[0] + Math.random() * (__bot.react[1] - __bot.react[0]);
        setTimeout(() => { const B2 = window.__bakhi.get(); if (!B2 || B2.state !== 'go') return; if (B2.mech === 'hold' && B2.holding) window.__bakhi.up(); else { window.__bakhi.tap(); if (B2.mech === 'double') setTimeout(() => window.__bakhi.tap(), 170); } }, d); }
      if (B.state !== 'go') __bot.tapped = false;
      if (__bot.earlyN > 0 && B.state === 'wait' && now - B.t0 > 650) { __bot.earlyN--; window.__bakhi.tap(); }
    }, 8);
  });
}
const sub = (p, html, big, low) => p.evaluate(([h, b, l]) => { const d = document.getElementById('__sub'); d.className = (h ? 'on' : '') + (b ? ' big' : '') + (l ? ' low' : ''); if (h) d.innerHTML = h; }, [html, !!big, !!low]);
const dbg = async (p, what) => { try { console.log('TIMEOUT', what, await p.evaluate(() => { const B = __bakhi.get(); return JSON.stringify({ state: B.state, gate: B.n, mech: B.mech, hp: B.hp, bot: window.__bot, last: window.__ev.slice(-3) }); })); } catch (e) {} };
const waitState = async (p, s, t = 20000) => { try { await p.waitForFunction(s => { const B = __bakhi.get(); return B && B.state === s; }, s, { timeout: t, polling: 16 }); } catch (e) { await dbg(p, 'state ' + s); throw e; } };
const evCount = p => p.evaluate(() => window.__ev.length);
const waitResult = async (p, t) => { try { await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: t, polling: 16 }); } catch (e) { await dbg(p, 'result'); throw e; } };
const waitEv = async (p, k, t = 15000) => { const n0 = await evCount(p); try { await p.waitForFunction(([k, n0]) => window.__ev.slice(n0).some(e => e.k === k), [k, n0], { timeout: t, polling: 16 }); } catch (e) { await dbg(p, 'ev ' + k); throw e; } };
const skipAll = p => p.evaluate(() => { const B = __bakhi.get(); if (B && B.state === 'dialog') { B.dlg = []; document.getElementById('dlg-box').click(); } });
const start = (p, n, opt) => p.evaluate(([n, o]) => { __bakhi.save.unlocked = 40; __bakhi.startGate(n, o); }, [n, opt || {}]);
const bubbleIntro = (p, n, idx) => p.evaluate(([n, i]) => { const B = __bakhi.get(), m = GATE_META[n]; if (!m || !m.intro) return; const l = m.intro[i]; B.bubble = l[1]; B.bubbleWho = l[0]; B.bubbleT = performance.now(); B.tSig = B.t0 + 1900; __bakhi.say(l[0], l[1], { low: l[0] !== 'gabip' }); }, [n, idx]);
const bot = (p, o) => p.evaluate(o => Object.assign(window.__bot, o), o);
const force = (p, o) => p.evaluate(o => { const B = __bakhi.get(); Object.assign(B, o); }, o);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const only = process.env.SEG;
  if (!only || only === 'hook') await rec(browser, 'hook', PHONE, async (p, mark) => {
    await setupGame(p); await start(p, 11, { skipDlg: true }); await sleep(150);
    await p.evaluate(() => { const B = __bakhi.get(); B.fake = true; B.tSig = performance.now() + 900; }); await bot(p, { foolOnce: true });
    await waitEv(p, 'hurt', 8000); mark('fooled'); await sleep(250); await sub(p, S.fooled, true); await sleep(2300);
    return { events: await p.evaluate(() => window.__ev) };
  });
  if (!only || only === 'logo') await rec(browser, 'logo', FULL, async p => { await p.goto('file://' + __dirname + '/cards4.built.html#logo-' + LANG); await sleep(3000); });
  if (!only || only === 'outro') await rec(browser, 'outro', FULL, async p => { await p.goto('file://' + __dirname + '/cards4.built.html#outro-' + LANG); await sleep(7000); });
  if (!only || only === 'game') await rec(browser, 'game', PHONE, async (p, mark) => {
    await setupGame(p);
    await start(p, 1); await sleep(300); mark('gate1'); await sleep(2300); await skipAll(p);
    await bot(p, { react: [95, 150] }); await sub(p, S.rule);
    await waitState(p, 'won', 25000); mark('win1'); await sleep(900);
    await p.waitForFunction(() => { const B = __bakhi.get(); return B && B.n === 2 && (B.state === 'dialog' || B.state === 'wait'); }, null, { timeout: 8000, polling: 16 }); await skipAll(p); await sub(p, S.early); await force(p, { forgive: 0 }); await bot(p, { earlyN: 3 });
    await waitEv(p, 'hurt', 8000); mark('gag'); await sleep(500); await sub(p, S.hit); await waitState(p, 'lost', 15000); mark('lose'); await sub(p, S.lost, true); await sleep(1500); await sub(p, '');
    const M = [[3, 0], [6, 0], [36, 2]];
    for (let i = 0; i < M.length; i++) { await start(p, M[i][0], { skipDlg: true }); await sleep(60); mark(i === 0 ? 'montage' : 'm' + i); await bubbleIntro(p, M[i][0], M[i][1]); await bot(p, { react: [60, 120], hpCap: 400 }); await sub(p, S.m[i]); await waitEv(p, 'hit', 8000); await sleep(650); }
    await bot(p, { hpCap: 0 }); await sub(p, '');
    /* duck lesson */
    await start(p, 11, { skipDlg: true }); await sleep(80); mark('duck'); await p.evaluate(() => { const B = __bakhi.get(); B.fake = true; B.tSig = performance.now() + 1200; }); await bot(p, { react: [100, 160] });
    await sub(p, S.red); await waitState(p, 'fakesig', 8000); await sleep(900); await sub(p, S.green); await waitEv(p, 'hit', 8000); await sleep(800); await sub(p, '');
    /* reverse rule: quack = boop */
    await start(p, 14, { skipDlg: true }); await sleep(80); mark('reverse'); await bot(p, { hpCap: 60, react: [110, 160] }); await sub(p, S.rev);
    await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'reverse'; B.fake = true; B.tSig = performance.now() + 1500; }); await waitEv(p, 'hit', 10000); await sleep(1100); await sub(p, ''); await bot(p, { hpCap: 0 });
    /* count rule */
    await start(p, 22, { skipDlg: true }); await sleep(80); mark('count'); await bot(p, { hpCap: 60, react: [110, 160] }); await sub(p, S.count);
    await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'count'; B.cnt = 3; B.fake = false; B.tSig = performance.now() + 1500; }); await waitEv(p, 'hit', 10000); await sleep(1100); await sub(p, ''); await bot(p, { hpCap: 0 });
    /* hold + spot */
    await start(p, 20, { skipDlg: true }); await sleep(80); mark('hold'); await bot(p, { hpCap: 60 }); await sub(p, S.hold);
    await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'hold'; }); await waitEv(p, 'hit', 12000); await sleep(1100); await sub(p, ''); await bot(p, { hpCap: 0 });
    await start(p, 28, { skipDlg: true }); await sleep(80); mark('spot'); await bot(p, { hpCap: 60 }); await sub(p, S.spot);
    await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'spot'; B.fake = false; }); await waitEv(p, 'hit', 12000); await sleep(1100); await sub(p, ''); await bot(p, { hpCap: 0 });
    /* boss 16 */
    await start(p, 16); await sleep(200); mark('boss'); await sleep(2600); await skipAll(p);
    await force(p, { hp: 80, max: 80 }); await bot(p, { fakeOnce: true, foolOnce: true, react: [110, 160] });
    await sub(p, S.boss); await waitEv(p, 'hurt', 10000); await sleep(900); await sub(p, S.trust); await sleep(1800); await sub(p, '');
    await waitResult(p, 30000); mark('ko16'); await sub(p, S.ko16, true); await sleep(1500); await sub(p, '');
    /* daily gate */
    await p.evaluate(() => __bakhi.startDaily()); await sleep(150); mark('daily'); await sub(p, S.daily); await sleep(2600); await skipAll(p); await bot(p, { hpCap: 50, react: [90, 140], fakeMax: 0, _fc: 0, _fr: -1 }); await sleep(300);
    await waitResult(p, 30000); mark('dailyRes'); await sub(p, S.dailyRes); await sleep(2400); await sub(p, ''); await bot(p, { hpCap: 0, fakeMax: -1 });
    /* ghost challenge link */
    const ev1 = await p.evaluate(() => window.__ev); await p.goto('about:blank'); await setupGame(p, GAME + '#c11-130'); await sleep(200); mark('ghost'); await sub(p, S.ghost); await sleep(1400); await p.tap('#btn-play'); await sleep(150);
    for (let i = 0; i < 4; i++) { await skipAll(p); await sleep(80); } await bot(p, { react: [260, 320], hpCap: 60 }); await p.evaluate(() => { const B = __bakhi.get(); B.fake = false; B.mech = 'normal'; });
    await waitEv(p, 'hit', 10000); await sleep(1300); await sub(p, ''); await bot(p, { hpCap: 0 });
    /* final boss */
    await p.evaluate(() => { __bakhi.setHero('thachlao'); __bakhi.save.hero = 'thachlao'; }); await start(p, 40); await sleep(200); mark('final'); await sleep(2600); await skipAll(p);
    await bot(p, { hpCap: 40, react: [60, 120], fakeMax: 1, _fc: 0, _fr: -1 }); await sub(p, S.final); await sleep(3500); await sub(p, S.quote); await sleep(4200); await sub(p, '');
    await waitResult(p, 60000); mark('ko'); await bot(p, { hpCap: 0 });
    await sleep(600); await sub(p, S.share); await sleep(1200); await p.tap('#btn-link'); await sleep(2200); await sub(p, '');
    return { events: ev1.concat(await p.evaluate(() => window.__ev)) };
  });
  if (!only || only === 'vs') await rec(browser, 'vs', PHONE, async (p, mark) => {
    await setupGame(p); await p.evaluate(() => { document.getElementById('btn-vs').click(); window.__vsev = []; let last = ''; setInterval(() => { const s = __vs.get(); if (!s || s.state === last) return; last = s.state; const t = performance.timeOrigin + performance.now(); if (s.state === 'go') __vsev.push({ k: 'go', t: performance.timeOrigin + s.tSig, ms: 0 }); else if (s.state === 'fakesig') __vsev.push({ k: 'fakesig', t: performance.timeOrigin + s.tSig, ms: 0 }); else if (s.state === 'result') __vsev.push({ k: s.early ? 'hurt' : 'hit', t, ms: s.roundMs[s.winner] || 0 }); else if (s.state === 'end') __vsev.push({ k: 'won', t, ms: 0 }); }, 8); });
    await sleep(400); mark('vs'); await sub(p, S.vs, false, true); await sleep(900);
    await p.evaluate(() => { __vs.hold(1, true); __vs.hold(2, true); }); await sleep(1800);
    const round = async (winner, fake, msW, msL) => {
      await p.waitForFunction(() => __vs.get().state === 'wait', null, { timeout: 8000, polling: 16 }); await sleep(700);
      if (fake) { await p.evaluate(() => __vs.fake(true)); await p.evaluate(() => __vs.signal()); await sleep(380); await p.evaluate(l => __vs.tap(l), winner === 1 ? 2 : 1); }
      else { await p.evaluate(() => __vs.fake(false)); await p.evaluate(() => __vs.signal()); await sleep(msW); await p.evaluate(w => __vs.tap(w), winner); await sleep(msL - msW); await p.evaluate(l => __vs.tap(l), winner === 1 ? 2 : 1); }
      await p.waitForFunction(() => /result|end/.test(__vs.get().state), null, { timeout: 5000, polling: 16 });
    };
    await round(1, false, 118, 240); await sleep(1700); mark('vs1');
    await sub(p, S.vsFake, false, true); await round(1, true); await sleep(1700); mark('vs2');
    await sub(p, '', false, true); await round(2, false, 105, 300); await sleep(1700); mark('vs3');
    await round(1, false, 97, 220); mark('vsend'); await sleep(600); await sub(p, S.vsEnd, true, true); await sleep(2600); await sub(p, '', false, true);
    return { events: await p.evaluate(() => window.__vsev) };
  });
  await browser.close();
})();
