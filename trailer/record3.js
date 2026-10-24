/* Trailer v3 recorder: hook / logo / game / outro segments, in-page event log with frame-accurate timestamps */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const FULL = { width: 1080, height: 1920 }, PHONE = { width: 540, height: 960 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const GAME = 'file:///home/user/ba-khi/public/index.html';
const SUB_CSS = `#__sub{position:fixed;left:50%;top:15%;transform:translate(-50%,0);background:rgba(11,11,22,.9);border:2px solid #ffd23f;color:#fff;font-family:'Be Vietnam Pro',system-ui,sans-serif;font-weight:900;font-size:25px;line-height:1.25;padding:12px 18px;border-radius:14px;max-width:88%;text-align:center;z-index:50;pointer-events:none;opacity:0;transition:opacity .2s;text-wrap:balance}#__sub.on{opacity:1}#__sub b{color:#c6ff2e}#__sub.big{font-size:34px;border-color:#ff2e6e}`;
async function rec(browser, name, size, fn) {
  const dir = path.join(__dirname, 'raw', name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, hasTouch: true });
  const page = await ctx.newPage(); page.on('pageerror', e => console.log('PAGEERROR', e.message, (e.stack || '').split('\n').slice(0, 3).join(' | ')));
  const cdp = await ctx.newCDPSession(page); const frames = []; let n = 0;
  cdp.on('Page.screencastFrame', ev => { const f = path.join(dir, 'f' + String(n++).padStart(6, '0') + '.jpg'); fs.writeFileSync(f, Buffer.from(ev.data, 'base64')); frames.push({ f, t: ev.metadata.timestamp }); cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }).catch(() => {}); });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, maxWidth: size.width, maxHeight: size.height, everyNthFrame: 1 });
  const marks = {}; const out = await fn(page, (k) => { marks[k] = Date.now() / 1000; }) || {};
  const tEnd = Date.now() / 1000; await cdp.send('Page.stopScreencast').catch(() => {}); await ctx.close();
  const start = frames[0].t; let list = '';
  for (let i = 0; i < frames.length; i++) { const d = (i + 1 < frames.length ? frames[i + 1].t : tEnd) - frames[i].t; list += "file '" + frames[i].f + "'\nduration " + Math.max(0.001, d).toFixed(4) + '\n'; }
  list += "file '" + frames[frames.length - 1].f + "'\n"; fs.writeFileSync(path.join(dir, 'list.txt'), list);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'), '-vf', 'fps=30,scale=' + size.width + ':' + size.height + ',setsar=1', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(__dirname, 'raw', name + '.mp4')]);
  const rel = {}; for (const k in marks) rel[k] = +(marks[k] - start).toFixed(3);
  const events = (out.events || []).map(e => Object.assign({}, e, { t: +(e.t / 1000 - start).toFixed(3) })).filter(e => e.t >= 0);
  const dur = tEnd - start; fs.writeFileSync(path.join(__dirname, 'raw', name + '.json'), JSON.stringify({ marks: rel, events, dur: +dur.toFixed(3) }, null, 1));
  console.log('recorded', name, frames.length, 'frames', dur.toFixed(1) + 's', events.length, 'events');
}
async function setupGame(p) {
  await p.goto(GAME); await p.addStyleTag({ content: SUB_CSS });
  await p.evaluate(() => {
    /* seeded RNG for repeatable mechanics */
    var seed = 7; Math.random = function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const d = document.createElement('div'); d.id = '__sub'; document.body.appendChild(d);
    window.__ev = []; window.__bot = { react: [150, 280], earlyN: 0, fakeOnce: false, foolOnce: false, tapped: false, quick: true, hpCap: 0, fakeMax: -1, _fr: -1, _fc: 0 };
    let lastB = null, lastState = '';
    setInterval(() => { const B = window.__bakhi.get(); if (!B) return;
      if (B !== lastB || B.state !== lastState) { lastB = B; lastState = B.state; if (['go', 'fakesig', 'hit', 'hurt', 'won', 'lost'].indexOf(B.state) >= 0) window.__ev.push({ k: B.state, t: performance.timeOrigin + (B.state === 'go' || B.state === 'fakesig' ? B.tSig : B.t0), ms: B.state === 'hit' ? (B.hits[B.hits.length - 1] || 0) : 0, gate: B.n, mech: B.mech, phase: B.phase }); }
      if (B.over) return; const now = performance.now();
      if (__bot.hpCap && B.hp > __bot.hpCap && B.state === 'wait') { B.hp = __bot.hpCap; B.max = __bot.hpCap; }
      if (__bot.quick && B.state === 'wait' && B.tSig - B.t0 > 1700) B.tSig = B.t0 + 900 + Math.random() * 700;
      if (__bot.fakeOnce && B.state === 'wait' && B.round === 1) { B.fake = true; __bot.fakeOnce = false; }
      if (__bot.fakeMax >= 0 && B.state === 'wait' && B.round !== __bot._fr) { __bot._fr = B.round; if (B.fake) { if (__bot._fc >= __bot.fakeMax) B.fake = false; else __bot._fc++; } }
      if (__bot.foolOnce && B.state === 'fakesig' && now - B.tSig > 350) { __bot.foolOnce = false; window.__bakhi.tap(); }
      if (B.state === 'wait' && B.mech === 'hold' && !B.holding && now - B.t0 > 600 && __bot.earlyN === 0) window.__bakhi.tap();
      if (B.state === 'go' && !__bot.tapped) { __bot.tapped = true; const d = __bot.react[0] + Math.random() * (__bot.react[1] - __bot.react[0]);
        setTimeout(() => { const B2 = window.__bakhi.get(); if (!B2 || B2.state !== 'go') return; if (B2.mech === 'hold' && B2.holding) window.__bakhi.up(); else { window.__bakhi.tap(); if (B2.mech === 'double') setTimeout(() => window.__bakhi.tap(), 170); } }, d); }
      if (B.state !== 'go') __bot.tapped = false;
      if (__bot.earlyN > 0 && B.state === 'wait' && now - B.t0 > 650) { __bot.earlyN--; window.__bakhi.tap(); }
    }, 8);
  });
}
const sub = (p, html, big) => p.evaluate(([h, b]) => { const d = document.getElementById('__sub'); d.className = (h ? 'on' : '') + (b ? ' big' : ''); if (h) d.innerHTML = h; }, [html, !!big]);
const st = p => p.evaluate(() => { const B = __bakhi.get(); return B && B.state; });
const dbg = async (p, what) => { try { console.log('TIMEOUT', what, await p.evaluate(() => { const B = __bakhi.get(); return JSON.stringify({ state: B.state, gate: B.gate, mech: B.mech, hp: B.hp, fake: B.fake, bot: window.__bot, last: window.__ev.slice(-3) }); })); } catch (e) {} };
const waitState = async (p, s, t = 20000) => { try { await p.waitForFunction(s => { const B = __bakhi.get(); return B && B.state === s; }, s, { timeout: t, polling: 16 }); } catch (e) { await dbg(p, 'state ' + s); throw e; } };
const evCount = p => p.evaluate(() => window.__ev.length);
const waitEv = async (p, k, t = 15000) => { const n0 = await evCount(p); try { await p.waitForFunction(([k, n0]) => window.__ev.slice(n0).some(e => e.k === k), [k, n0], { timeout: t, polling: 16 }); } catch (e) { await dbg(p, 'ev ' + k); throw e; } };
const skipAll = p => p.evaluate(() => { const B = __bakhi.get(); if (B && B.state === 'dialog') { B.dlg = []; document.getElementById('dlg-box').click(); } });
const nextLine = p => p.tap('#dlg-box');
const start = (p, n, opt) => p.evaluate(([n, o]) => { __bakhi.save.unlocked = 40; __bakhi.startGate(n, o); }, [n, opt || {}]);
const bubbleIntro = (p, n, idx) => p.evaluate(([n, i]) => { const B = __bakhi.get(), m = GATE_META[n]; if (!m || !m.intro) return; const l = m.intro[i]; B.bubble = l[1]; B.bubbleWho = l[0]; B.bubbleT = performance.now(); B.tSig = B.t0 + 1900; __bakhi.say(l[0], l[1], { low: l[0] !== 'gabip' }); }, [n, idx]);
const bot = (p, o) => p.evaluate(o => Object.assign(window.__bot, o), o);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  /* ---- hook: gate 11, fooled by the duck ---- */
  await rec(browser, 'hook', PHONE, async (p, mark) => {
    await setupGame(p); await start(p, 11, { skipDlg: true }); await sleep(150);
    await p.evaluate(() => { const B = __bakhi.get(); B.fake = true; B.tSig = performance.now() + 900; }); await bot(p, { foolOnce: true });
    await waitEv(p, 'hurt', 8000); mark('fooled'); await sleep(250); await sub(p, 'Vừa bị <b>VỊT</b> lừa. Vịt có chứng chỉ.', true); await sleep(2300);
    return { events: await p.evaluate(() => window.__ev) };
  });
  if (process.env.SEG === 'hook') { await browser.close(); return; }
  if (process.env.SEG !== 'game') {
  await rec(browser, 'logo', FULL, async p => { await p.goto('file://' + __dirname + '/cards.built.html#logo'); await sleep(3000); });
  await rec(browser, 'outro', FULL, async p => { await p.goto('file://' + __dirname + '/cards.built.html#outro'); await sleep(6500); });
  }
  /* ---- main ---- */
  await rec(browser, 'game', PHONE, async (p, mark) => {
    await setupGame(p);
    /* 3. gate 1: one grandma line, then three crits */
    await start(p, 1); await sleep(300); mark('gate1'); await sleep(2300); await skipAll(p);
    await bot(p, { react: [95, 150] }); await sub(p, 'Luật: nghe <b>BÍP</b> thì <b>BỤP</b>. Càng nhanh, đòn càng đau.');
    await waitState(p, 'won', 25000); mark('win1'); await sleep(900);
    /* 4. gate 2: break the rule, lose fast */
    await p.waitForFunction(() => { const B = __bakhi.get(); return B && B.n === 2 && (B.state === 'dialog' || B.state === 'wait'); }, null, { timeout: 8000, polling: 16 }); await skipAll(p); await sub(p, 'Còn bụp <b>trước</b> khi gà gáy?'); await p.evaluate(() => { const B = __bakhi.get(); B.forgive = 0; }); await bot(p, { earlyN: 3 });
    await waitEv(p, 'hurt', 8000); mark('gag'); await sleep(500); await sub(p, '<b>Ăn đòn.</b>'); await waitState(p, 'lost', 15000); mark('lose'); await sub(p, '<b>THUA.</b> Nó không bao giờ học.', true); await sleep(1500); await sub(p, '');
    /* 5. montage of weird opponents */
    const M = [[3, 0, 'LÍNH CỎ BỊ CHIM Ị'], [6, 0, 'TRÂU LƯỜI GYM'], [36, 2, 'TIÊN NỮ BÁN HÀNG ONLINE']];
    for (let i = 0; i < M.length; i++) { await start(p, M[i][0], { skipDlg: true }); await sleep(60); mark(i === 0 ? 'montage' : 'm' + i); await bubbleIntro(p, M[i][0], M[i][1]); await bot(p, { react: [60, 120], hpCap: 400 }); await sub(p, M[i][2]); await waitEv(p, 'hit', 8000); await sleep(650); }
    await bot(p, { hpCap: 0 }); await sub(p, '');
    /* 6. duck lesson: gate 11, do NOT tap on red */
    await start(p, 11, { skipDlg: true }); await sleep(80); mark('duck'); await p.evaluate(() => { const B = __bakhi.get(); B.fake = true; B.tSig = performance.now() + 1200; }); await bot(p, { react: [100, 160] });
    await sub(p, 'Màn <b>ĐỎ</b>, tiếng CẠC: đứng im.'); await waitState(p, 'fakesig', 8000); await sleep(900); await sub(p, 'Màn <b>XANH</b>: BỤP.'); await waitEv(p, 'hit', 8000); await sleep(800); await sub(p, '');
    /* 7. hold: gate 20 */
    await start(p, 20, { skipDlg: true }); await sleep(80); mark('hold'); await bubbleIntro(p, 20, 1); await bot(p, { hpCap: 60 }); await sub(p, 'Mánh mới: <b>GIỮ</b> ngón tay tích khí. Gà gáy thì <b>THẢ</b>.');
    await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'hold'; }); await waitEv(p, 'hit', 12000); await sleep(1200); await sub(p, ''); await bot(p, { hpCap: 0 });
    /* 8. spot: gate 28 */
    await waitState(p, 'won', 6000).catch(() => {}); await start(p, 28, { skipDlg: true }); await sleep(80); mark('spot'); await bubbleIntro(p, 28, 0); await bot(p, { hpCap: 60 }); await sub(p, 'Núi Lửa: khói che hết. Bụp đúng <b>điểm sáng</b>.');
    await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'spot'; B.fake = false; }); await waitEv(p, 'hit', 12000); await sleep(1200); await sub(p, ''); await bot(p, { hpCap: 0 });
    /* 9. boss 16: bluffed once, then revenge */
    await waitState(p, 'won', 6000).catch(() => {}); await start(p, 16); await sleep(200); mark('boss'); await sleep(2600); await skipAll(p);
    await p.evaluate(() => { const B = __bakhi.get(); B.hp = 80; B.max = 80; }); await bot(p, { fakeOnce: true, foolOnce: true, react: [110, 160] });
    await sub(p, 'Trùm Chợ Đêm <b>tự hô BÍP</b> để lừa.'); await waitEv(p, 'hurt', 10000); await sleep(900); await sub(p, 'Chỉ tin <b>Gà Bíp</b>.'); await sleep(1800); await sub(p, '');
    await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: 30000 }); mark('ko16'); await sub(p, '<b>Hạ trùm.</b>', true); await sleep(1600); await sub(p, '');
    /* 10. final boss with Thạch Lão */
    await p.evaluate(() => { __bakhi.setHero('thachlao'); __bakhi.save.hero = 'thachlao'; }); await start(p, 40); await sleep(200); mark('final'); await sleep(2600); await skipAll(p);
    await bot(p, { hpCap: 40, react: [60, 120], fakeMax: 1, _fc: 0, _fr: -1 }); await sub(p, 'Trùm cuối: <b>3 hiệp</b>, trộn mọi mánh.'); await sleep(3500); await sub(p, '"Tao là đá. Đá không vội." vs "Mười nghìn năm ta chậm."'); await sleep(4200); await sub(p, '');
    await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: 60000 }); mark('ko'); await sub(p, ''); await bot(p, { hpCap: 0 });
    /* 11. result: share */
    await sleep(600); await sub(p, 'Lưu thẻ. Gửi link. <b>Bạn phải nhanh hơn tôi.</b>'); await sleep(1200); await p.tap('#btn-link'); await sleep(2200); await sub(p, '');
    return { events: await p.evaluate(() => window.__ev) };
  });
  await browser.close();
})();
