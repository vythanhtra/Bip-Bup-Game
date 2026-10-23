const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const SIZE = { width: 1080, height: 1920 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function rec(browser, name, fn, size) { size = size || SIZE;
  const dir = path.join(__dirname, 'raw', name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, hasTouch: true, recordVideo: { dir, size: size } });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('PAGEERROR', e.message));
  await fn(page);
  const v = page.video(); await ctx.close(); const p = await v.path();
  const out = path.join(__dirname, 'raw', name + '.webm'); fs.copyFileSync(p, out); console.log('recorded', name);
}
const SUB_CSS = `#__sub{position:fixed;left:50%;top:70%;transform:translate(-50%,0);background:rgba(11,11,22,.85);border:2px solid #ffd23f;color:#fff;font-family:'Be Vietnam Pro',system-ui,sans-serif;font-weight:900;font-size:23px;line-height:1.25;padding:11px 17px;border-radius:13px;max-width:92%;text-align:center;z-index:50;pointer-events:none;opacity:0;transition:opacity .3s;text-wrap:balance}#__sub.on{opacity:1}#__sub b{color:#c6ff2e}`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  if (!process.env.GAME_ONLY) await rec(browser, 'intro', async p => { await p.goto('file://' + __dirname + '/cards.built.html#intro'); await sleep(13600); });
  if (!process.env.GAME_ONLY) await rec(browser, 'outro', async p => { await p.goto('file://' + __dirname + '/cards.built.html#outro'); await sleep(7000); });
  await rec(browser, 'game', async p => {
    await p.goto('file:///home/user/ba-khi/public/index.html');
    await p.addStyleTag({ content: SUB_CSS });
    await p.evaluate(() => { const d = document.createElement('div'); d.id = '__sub'; document.body.appendChild(d);
      window.__bot = { react: [150, 290], early: false, fakeOnce: false, tapped: false };
      setInterval(() => { const B = window.__bakhi.get(); if (!B || B.over) return;
        if (__bot.fakeOnce && B.state === 'wait' && B.round === 1) { B.fake = true; __bot.fakeOnce = false; }
        if (B.state === 'go' && !__bot.tapped) { __bot.tapped = true; const d = __bot.react[0] + Math.random() * (__bot.react[1] - __bot.react[0]); setTimeout(() => window.__bakhi.tap(), d); }
        if (B.state !== 'go') __bot.tapped = false;
        if (__bot.early && B.state === 'wait' && performance.now() - B.t0 > 700) { __bot.early = false; window.__bakhi.tap(); }
      }, 10); });
    const sub = async (html, ms) => { await p.evaluate(h => { const d = document.getElementById('__sub'); if (!h) { d.classList.remove('on'); return; } d.innerHTML = h; d.classList.add('on'); }, html); if (ms) await sleep(ms); };
    const dialogs = async (ms) => { for (let i = 0; i < 6; i++) { const vis = await p.evaluate(() => !document.getElementById('dlg').hidden); if (!vis) break; await sleep(ms); await p.tap('#dlg-box'); } };
    const waitEnd = async (t = 40000) => { await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: t }); };
    await sleep(1200); await sub('Đây là <b>BÁ KHÍ: Battle Aura</b>. Game phản xạ nhiều cửa, chơi bằng một ngón tay.', 3200);
    await p.tap('#btn-play'); await sub('<b>5 vùng đất, 40 cửa.</b> Mỗi vùng thêm một mánh mới.', 2600);
    await p.tap('.gate[data-gate="1"]'); await sub('Gặp <b>Tí Bụp</b>, Bà Nội Bụp và trọng tài <b>Gà Bíp</b>.', 500);
    await dialogs(2100);
    await sub('Luật chỉ có một: <b>Gà gáy BÍP thì BỤP.</b> Càng nhanh, đòn càng đau.', 0);
    await waitEnd(); await sub('Qua cửa. Nhận sao. <b>Chí mạng</b> khi dưới 180ms.', 3000);
    await p.tap('#btn-next'); await dialogs(1500); await sub('Còn bụp trước khi gà gáy thì sao?', 0);
    await p.evaluate(() => { __bot.early = true; }); await sleep(2200); await sub('<b>Ăn đòn liền.</b> Mất một tim.', 2000); await sub('', 0);
    await waitEnd(); await sleep(1500);
    await p.evaluate(() => { __bakhi.save.unlocked = 16; __bakhi.startGate(9); });
    await sub('Vùng 2, <b>Chợ Đêm</b>. Ở đây có VỊT giả gà.', 500); await dialogs(2100);
    await p.evaluate(() => { __bot.fakeOnce = true; }); await sub('Màn đỏ, tiếng <b>CẠC</b>: đứng im. Bụp là mắc bẫy.', 0);
    await waitEnd(); await sleep(1500);
    await p.evaluate(() => { __bakhi.startGate(16); }); await sub('Trùm Chợ Đêm: <b>Anh Hai Hàng Hiệu</b>. Cáo tự hô BÍP để lừa bạn.', 500);
    await dialogs(2300); await p.evaluate(() => { const B = __bakhi.get(); B.hp = 110; B.max = 110; }); await sub('Chỉ tin Gà Bíp và màn hình <b>XANH</b>.', 0);
    await waitEnd(45000); await sub('<b>Hạ trùm.</b> Lưu thẻ, khoe lên story.', 2800);
    await sub('Gửi <b>link thách cửa</b>: bạn bè phải nhanh hơn bạn.', 400); await p.tap('#btn-link'); await sleep(2600); await sub('', 800);
  }, { width: 540, height: 960 });
  await browser.close();
  for (const f of ['intro', 'game', 'outro']) console.log(f, fs.statSync(path.join(__dirname, 'raw', f + '.webm')).size, 'bytes');
})();
