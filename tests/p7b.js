const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const vp of [{ width: 390, height: 844 }, { width: 430, height: 932 }, { width: 1280, height: 800 }]) {
    const p = await b.newPage({ viewport: vp, hasTouch: true }); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + __dirname + '/../public/index.html?lang=vi'); await sleep(200);
    await p.evaluate(() => { __bakhi.save.unlocked = 40; __bakhi.startGate(5, { skipDlg: true }); }); await sleep(100);
    await p.waitForFunction(() => !!__bakhi.atk(), null, { timeout: 8000, polling: 10 }); await sleep(150);
    const r = await p.evaluate(() => { const B = __bakhi.get(); return { SC: (function(){ return B.arrowPos ? Math.round(B.arrowPos.r / 2.2) : 0; })(), ap: B.arrowPos, hp: B.hp, combo: B.combo }; });
    await p.touchscreen.tap(r.ap.x, r.ap.y); await sleep(80);
    const after = await p.evaluate(() => { const B = __bakhi.get(); return { st: B.state, combo: B.combo, hp: B.hp, holding: B.holding }; });
    console.log(vp.width + 'x' + vp.height, 'arrow r=' + Math.round(r.ap.r), after.combo === 1 && after.st === 'wait' && !after.holding ? 'PASS tap on arrow parries' : 'FAIL ' + JSON.stringify(after), 'errors', errs.length);
    if (vp.width === 390) await p.screenshot({ path: 's7b_tele.png' });
    await p.close();
  }
  await b.close();
})();
