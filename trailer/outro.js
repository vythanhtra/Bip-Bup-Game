const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, recordVideo: { dir: 'raw/outro', size: { width: 1080, height: 1920 } } });
  const p = await ctx.newPage(); await p.goto('file://' + process.cwd() + '/cards.built.html#outro'); await new Promise(r => setTimeout(r, 6500));
  const v = p.video(); await ctx.close(); fs.copyFileSync(await v.path(), 'raw/outro.webm'); await b.close(); console.log('outro re-recorded'); })();
