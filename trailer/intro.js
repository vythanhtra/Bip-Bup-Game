const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, recordVideo: { dir: 'raw/intro', size: { width: 1080, height: 1920 } } });
  const p = await ctx.newPage(); await p.goto('file://' + process.cwd() + '/cards.built.html#intro'); await new Promise(r => setTimeout(r, 16300));
  const v = p.video(); await ctx.close(); fs.copyFileSync(await v.path(), 'raw/intro.webm'); await b.close(); console.log('intro re-recorded'); })();
