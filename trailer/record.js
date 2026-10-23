const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const FULL = { width: 1080, height: 1920 }, PHONE = { width: 540, height: 960 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const marks = {};
async function rec(browser, name, fn, size) {
  const dir = path.join(__dirname, 'raw', name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, hasTouch: true, recordVideo: { dir, size } });
  const t0 = Date.now();
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('PAGEERROR', e.message));
  await fn(page, k => { marks[k] = (Date.now() - t0) / 1000; });
  const v = page.video(); await ctx.close(); fs.copyFileSync(await v.path(), path.join(__dirname, 'raw', name + '.webm')); console.log('recorded', name);
}
/* subtitle in the empty sky band under the HUD; nothing else is drawn there */
const SUB_CSS = `#__sub{position:fixed;left:50%;top:15%;transform:translate(-50%,0);background:rgba(11,11,22,.88);border:2px solid #ffd23f;color:#fff;font-family:'Be Vietnam Pro',system-ui,sans-serif;font-weight:900;font-size:24px;line-height:1.25;padding:12px 18px;border-radius:14px;max-width:88%;text-align:center;z-index:50;pointer-events:none;opacity:0;transition:opacity .25s;text-wrap:balance}#__sub.on{opacity:1}#__sub b{color:#c6ff2e}`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  if (!process.env.GAME_ONLY) await rec(browser, 'intro', async p => { await p.goto('file://' + __dirname + '/cards.built.html#intro'); await sleep(11800); }, FULL);
  if (!process.env.GAME_ONLY) await rec(browser, 'outro', async p => { await p.goto('file://' + __dirname + '/cards.built.html#outro'); await sleep(6500); }, FULL);
  await rec(browser, 'game', async (p, mark) => {
    await p.goto('file:///home/user/ba-khi/public/index.html');
    await p.addStyleTag({ content: SUB_CSS });
    await p.evaluate(() => { const d = document.createElement('div'); d.id = '__sub'; document.body.appendChild(d);
      window.__bot = { react: [150, 280], early: false, fakeOnce: false, tapped: false, quick: true };
      setInterval(() => { const B = window.__bakhi.get(); if (!B || B.over) return;
        if (__bot.quick && B.state === 'wait' && B.tSig - B.t0 > 1700) B.tSig = B.t0 + 900 + Math.random() * 800;   /* trailer pacing: shorter waits */
        if (__bot.fakeOnce && B.state === 'wait' && B.round === 1) { B.fake = true; __bot.fakeOnce = false; }
        if (B.state === 'go' && !__bot.tapped) { __bot.tapped = true; const d = __bot.react[0] + Math.random() * (__bot.react[1] - __bot.react[0]); setTimeout(() => window.__bakhi.tap(), d); }
        if (B.state !== 'go') __bot.tapped = false;
        if (__bot.early && B.state === 'wait' && performance.now() - B.t0 > 600) { __bot.early = false; window.__bakhi.tap(); }
      }, 10); });
    const sub = async (html, ms) => { await p.evaluate(h => { const d = document.getElementById('__sub'); if (!h) { d.classList.remove('on'); return; } d.innerHTML = h; d.classList.add('on'); }, html); if (ms) await sleep(ms); };
    const dialogs = async (ms, keep) => { for (let i = 0; i < 6; i++) { const vis = await p.evaluate(() => !document.getElementById('dlg').hidden); if (!vis) break; await sleep(i < keep ? ms : 150); await p.tap('#dlg-box'); } };
    const waitState = async (st, t = 20000) => { await p.waitForFunction(s => { const B = __bakhi.get(); return B && B.state === s; }, st, { timeout: t }); };
    const waitEnd = async (t = 30000) => { await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: t }); };
    /* 1. title + map */
    await sleep(900); await sub('<b>BÁ KHÍ: Battle Aura.</b> Game phản xạ nhiều cửa, một ngón tay.', 2300);
    await p.tap('#btn-play'); await sub('<b>5 vùng, 40 cửa.</b> Mỗi vùng một mánh mới.', 1800);
    /* 2. gate 1: grandma rule + Tí's joke, then two hits */
    await p.tap('.gate[data-gate="1"]'); await sub('', 0); mark('gate1'); await dialogs(2300, 2);
    await sub('Luật: <b>gà gáy BÍP thì BỤP.</b> Càng nhanh, đòn càng đau.', 0);
    await waitEnd(); mark('win1'); await sub('Qua cửa. Nhận sao.', 1600);
    /* 3. gate 2: the early-tap gag, then cut */
    await p.tap('#btn-next'); await dialogs(0, 0); await sub('Bụp <b>trước</b> khi gà gáy thì sao?', 300);
    await p.evaluate(() => { __bot.early = true; }); await waitState('hurt'); mark('gag'); await sleep(250); await sub('<b>Ăn đòn liền.</b>', 1500); await sub('', 0);
    /* 4. gate 9: duck fake signal, one real hit, cut */
    await p.evaluate(() => { __bakhi.save.unlocked = 16; __bakhi.startGate(9); }); mark('night');
    await sub('Vùng 2, <b>Chợ Đêm</b>. Có vịt giả gà.', 0); await dialogs(2200, 1);
    await p.evaluate(() => { __bot.fakeOnce = true; }); await sub('', 0);
    await waitState('fakesig'); mark('duck'); await sub('Màn đỏ, tiếng <b>CẠC</b>: đứng im!', 1400); await sub('', 0);
    await waitState('hit'); await sleep(1100);
    /* 5. boss: fox bluff, crit, KO */
    await p.evaluate(() => { __bakhi.startGate(16); }); mark('boss');
    await sub('Trùm Chợ Đêm: <b>Anh Hai Hàng Hiệu</b>.', 0); await dialogs(2600, 1);
    await p.evaluate(() => { const B = __bakhi.get(); B.hp = 80; B.max = 80; __bot.fakeOnce = true; __bot.react = [120, 175]; });
    await waitState('fakesig'); await sub('Cáo tự hô BÍP. <b>Chỉ tin màn hình XANH.</b>', 1500); await sub('', 0);
    await waitEnd(30000); mark('ko'); await sub('<b>Hạ trùm.</b> Lưu thẻ. Thách bạn bè qua link.', 2200);
    await p.tap('#btn-link'); await sleep(2000); await sub('', 600);
  }, PHONE);
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'marks.json'), JSON.stringify(marks, null, 1)); console.log(marks);
})();
