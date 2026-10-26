const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const URL = 'file://' + __dirname + '/../public/index.html';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 1 }); await p.addInitScript(function(){ window.__FIGHT_OFF = 1; }); /* legacy reflex engine (daily/run) */
  const errs = []; p.on('pageerror', e => errs.push(e.message)); const ok = (c, m) => console.log((c ? 'PASS' : 'FAIL') + ' ' + m);
  p.on('load', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {})); p.on('framenavigated', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {}));
  await p.goto(URL); await sleep(400);
  let v = await p.evaluate(() => ({ pick: !document.getElementById('langpick').hidden, lang: I18N.lang, on: document.querySelector('#langbar button.on').getAttribute('data-lang') }));
  ok(v.pick && v.lang === 'en' && v.on === 'en', 'first visit: picker shown, auto EN (en-US browser): ' + JSON.stringify(v));
  await p.screenshot({ path: 'lang_pick.png' });
  await p.tap('#langpick button[data-lang="vi"]'); await sleep(800);
  v = await p.evaluate(() => ({ pick: !document.getElementById('langpick').hidden, lang: I18N.lang, play: document.getElementById('btn-play').textContent, on: document.querySelector('#langbar button.on').getAttribute('data-lang'), st: localStorage.getItem('bakhi.lang') }));
  ok(!v.pick && v.lang === 'vi' && v.play === 'VÀO GAME' && v.on === 'vi' && v.st === 'vi', 'picked VI: reloads in Vietnamese, remembered: ' + JSON.stringify(v));
  await p.screenshot({ path: 'lang_vi.png' });
  await p.goto('about:blank'); await p.goto(URL); await sleep(400);
  v = await p.evaluate(() => ({ pick: !document.getElementById('langpick').hidden, lang: I18N.lang }));
  ok(!v.pick && v.lang === 'vi', 'second visit: no picker, stays VI');
  await p.tap('#langbar button[data-lang="en"]'); await sleep(800);
  v = await p.evaluate(() => ({ lang: I18N.lang, play: document.getElementById('btn-play').textContent, logo: document.querySelector('.logo').textContent }));
  ok(v.lang === 'en' && v.play === 'PLAY', 'langbar switch to EN: ' + v.logo.replace(/\s+/g, ' '));
  await p.screenshot({ path: 'lang_en.png' });
  await p.tap('#langbar button[data-lang="en"]'); await sleep(300); ok((await p.evaluate(() => I18N.lang)) === 'en', 'same-language click is a no-op');
  console.log('errors:', errs.length ? errs : 'none'); await b.close();
})();
