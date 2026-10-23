const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const FULL = { width: 1080, height: 1920 }, PHONE = { width: 540, height: 960 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const marks = {};
async function rec(browser, name, fn, size) {
  size = size || SIZE;
  const dir = path.join(__dirname, 'raw', name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('PAGEERROR', e.message));
  const cdp = await ctx.newCDPSession(page);
  const frames = []; let n = 0;
  cdp.on('Page.screencastFrame', ev => { const f = path.join(dir, 'f' + String(n++).padStart(6, '0') + '.jpg'); fs.writeFileSync(f, Buffer.from(ev.data, 'base64')); frames.push({ f, t: ev.metadata.timestamp }); cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }).catch(() => {}); });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, maxWidth: size.width, maxHeight: size.height, everyNthFrame: 1 });
  const t0 = Date.now() / 1000;
  await fn(page, k => { marks[k] = Date.now() / 1000; });
  const tEnd = Date.now() / 1000;
  await cdp.send('Page.stopScreencast').catch(() => {}); await ctx.close();
  /* CFR 30 fps video built from real frame timestamps */
  const start = frames[0].t; let list = '';
  for (let i = 0; i < frames.length; i++) { const d = (i + 1 < frames.length ? frames[i + 1].t : tEnd) - frames[i].t; list += "file '" + frames[i].f + "'\nduration " + Math.max(0.001, d).toFixed(4) + '\n'; }
  list += "file '" + frames[frames.length - 1].f + "'\n";
  fs.writeFileSync(path.join(dir, 'list.txt'), list);
  require('child_process').execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'), '-vf', 'fps=30,scale=' + size.width + ':' + size.height + ',setsar=1', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(__dirname, 'raw', name + '.mp4')]);
  for (const k in marks) if (marks[k] > 1e9) marks[k] = +(marks[k] - start).toFixed(3);
  console.log('recorded', name, frames.length, 'frames,', (tEnd - start).toFixed(1) + 's');
}
/* subtitle in the empty sky band under the HUD; nothing else is drawn there */
const SUB_CSS = `#__sub{position:fixed;left:50%;top:15%;transform:translate(-50%,0);background:rgba(11,11,22,.88);border:2px solid #ffd23f;color:#fff;font-family:'Be Vietnam Pro',system-ui,sans-serif;font-weight:900;font-size:24px;line-height:1.25;padding:12px 18px;border-radius:14px;max-width:88%;text-align:center;z-index:50;pointer-events:none;opacity:0;transition:opacity .25s;text-wrap:balance}#__sub.on{opacity:1}#__sub b{color:#c6ff2e}`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  if (!process.env.GAME_ONLY) await rec(browser, 'intro', async p => { await p.goto('file://' + __dirname + '/cards.built.html#intro'); await sleep(18600); }, FULL);
  if (!process.env.GAME_ONLY) await rec(browser, 'outro', async p => { await p.goto('file://' + __dirname + '/cards.built.html#outro'); await sleep(6500); }, FULL);
  await rec(browser, 'game', async (p, mark) => {
    await p.goto('file:///home/user/ba-khi/public/index.html');
    await p.addStyleTag({ content: SUB_CSS });
    await p.evaluate(() => { const d = document.createElement('div'); d.id = '__sub'; document.body.appendChild(d);
      window.__bot = { react: [150, 280], earlyN: 0, fakeOnce: false, tapped: false, quick: true };
      setInterval(() => { const B = window.__bakhi.get(); if (!B || B.over) return; const now = performance.now();
        if (__bot.quick && B.state === 'wait' && B.tSig - B.t0 > 1700) B.tSig = B.t0 + 900 + Math.random() * 800;
        if (__bot.fakeOnce && B.state === 'wait' && B.round === 1) { B.fake = true; __bot.fakeOnce = false; }
        if (B.state === 'wait' && B.mech === 'hold' && !B.holding && now - B.t0 > 350 && __bot.earlyN === 0) window.__bakhi.tap();
        if (B.state === 'go' && !__bot.tapped) { __bot.tapped = true; const d = __bot.react[0] + Math.random() * (__bot.react[1] - __bot.react[0]);
          setTimeout(() => { const B2 = window.__bakhi.get(); if (!B2 || B2.state !== 'go') return; if (B2.mech === 'hold' && B2.holding) window.__bakhi.up(); else { window.__bakhi.tap(); if (B2.mech === 'double') setTimeout(() => window.__bakhi.tap(), 170); } }, d); }
        if (B.state !== 'go') __bot.tapped = false;
        if (__bot.earlyN > 0 && B.state === 'wait' && now - B.t0 > 650) { __bot.earlyN--; window.__bakhi.tap(); }
      }, 10); });
    const sub = async (html, ms) => { await p.evaluate(h => { const d = document.getElementById('__sub'); if (!h) { d.classList.remove('on'); return; } d.innerHTML = h; d.classList.add('on'); }, html); if (ms) await sleep(ms); };
    const dialogs = async (ms, keep) => { for (let i = 0; i < 6; i++) { const vis = await p.evaluate(() => !document.getElementById('dlg').hidden); if (!vis) break; await sleep(i < keep ? ms : 150); await p.tap('#dlg-box'); } };
    const waitState = async (st, t = 20000) => { await p.waitForFunction(s => { const B = __bakhi.get(); return B && B.state === s; }, st, { timeout: t }); };
    const waitEnd = async (t = 30000) => { await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: t }); };
    /* 1. title + map */
    await sleep(1200); await sub('<b>BÁ KHÍ: Battle Aura.</b> Game phản xạ nhiều cửa, chơi bằng một ngón tay.', 3600);
    await p.tap('#btn-play'); await sub('<b>5 vùng đất, 40 cửa.</b> Mỗi vùng thêm một mánh mới.', 3200);
    /* 2. gate 1: full grandma + chicken dialog, fight, auto-continue */
    await p.tap('.gate[data-gate="1"]'); await sub('', 0); mark('gate1'); await dialogs(3300, 4);
    await sub('Luật chỉ có một: <b>gà gáy BÍP thì BỤP.</b> Càng nhanh, đòn càng đau.', 0);
    await waitState('won', 30000); mark('win1'); await sub('Qua cửa là <b>vào cửa tiếp ngay</b>. Không màn hình thừa.', 2800);
    /* 3. gate 2: break the rule, forgiven once, then LOSE, instant retry */
    await waitState('wait', 8000); await sub('Còn nếu <b>phạm luật</b>, bụp trước khi gà gáy?', 1500);
    await p.evaluate(() => { __bot.earlyN = 4; }); await waitState('hurt', 15000); mark('gag'); await sleep(300); await sub('<b>Ăn đòn liền.</b> Mất một tim.', 2400);
    await sub('Lì lợm bụp sớm tiếp...', 0); await waitState('lost', 25000); mark('lose');
    await sub('Ba lần phạm luật: <b>THUA</b>. Chạm một cái là đánh lại ngay.', 3600); await sub('', 0);
    /* 4. gate 9: duck fake signal, one real hit, cut */
    await p.evaluate(() => { __bakhi.save.unlocked = 40; __bakhi.startGate(9); }); mark('night');
    await sub('Vùng 2, <b>Chợ Đêm</b>. Ở đây có vịt giả gà.', 0); await dialogs(3200, 1);
    await p.evaluate(() => { __bot.fakeOnce = true; }); await sub('', 0);
    await waitState('fakesig', 15000); mark('duck'); await sub('Màn đỏ, tiếng <b>CẠC</b>: đứng im!', 2600); await sub('', 0);
    await waitState('hit', 15000); await sleep(900);
    /* 5. world 3: hold / release */
    await p.evaluate(() => { __bakhi.startGate(21); }); mark('hold'); await sub('Vùng 3, <b>Sông Băng</b>: ấn giữ để tích khí, gà gáy thì <b>thả</b>.', 400); await dialogs(0, 0);
    await p.evaluate(() => { const B = __bakhi.get(); B.hp = 60; B.max = 60; });
    await waitState('hit', 15000); await sleep(2800); await sub('', 0);
    /* 6. world 4: spot in the smoke */
    await p.evaluate(() => { __bakhi.startGate(27); }); mark('spot'); await sub('Vùng 4, <b>Núi Lửa</b>: khói che hết, bụp đúng <b>điểm sáng</b>.', 400); await dialogs(0, 0);
    await p.evaluate(() => { const B = __bakhi.get(); B.hp = 60; B.max = 60; });
    await waitState('hit', 15000); await sleep(2800); await sub('', 0);
    /* 7. boss 16: fox bluff, crit, KO */
    await p.evaluate(() => { __bakhi.startGate(16); }); mark('boss');
    await sub('Trùm Chợ Đêm: <b>Anh Hai Hàng Hiệu</b>. Cáo tự hô BÍP để lừa bạn.', 0); await dialogs(3400, 1);
    await p.evaluate(() => { const B = __bakhi.get(); B.hp = 80; B.max = 80; __bot.fakeOnce = true; __bot.react = [120, 175]; });
    await waitState('fakesig', 15000); await sub('Chỉ tin Gà Bíp và màn hình <b>XANH</b>.', 2800); await sub('', 0);
    await waitEnd(30000); mark('ko'); await sub('<b>Hạ trùm.</b> Lưu thẻ, khoe lên story.', 3400);
    await sub('Gửi <b>link thách cửa</b>: bạn bè phải nhanh hơn bạn.', 600); await p.tap('#btn-link'); await sleep(3000); await sub('', 600);
  }, PHONE);
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'marks.json'), JSON.stringify(marks, null, 1)); console.log(marks);
})();
