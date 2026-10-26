const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const URL = 'file://' + __dirname + '/../public/index.html?lang=zh';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 1 }); await p.addInitScript(function(){ window.__FIGHT_OFF = 1; }); /* legacy reflex engine (daily/run) */
  const errs = []; p.on('pageerror', e => errs.push(e.message)); const ok = (c, m) => console.log((c ? 'PASS' : 'FAIL') + ' ' + m);
  p.on('load', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {})); p.on('framenavigated', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {}));
  const skipAll = async () => { for (let i = 0; i < 8; i++) { const v = await p.evaluate(() => !document.getElementById('dlg').hidden); if (!v) break; await p.evaluate(() => { const B = __bakhi.get(); B.dlg = []; }); await p.tap('#dlg-box'); await sleep(80); } };
  await p.goto(URL); await sleep(500);
  const t = await p.evaluate(() => ({ title: document.title, logo: document.querySelector('.logo').textContent, play: document.getElementById('btn-play').textContent, lang: I18N.lang, hero: HEROES.tibup.name, enemy: ENEMIES.vitgia.name, world: WORLDS[1].name, rc: ROUND_CALL.reverse, gm14: GATE_META[14].intro[0][1], d1: DIALOG[1][0].text, streak: GABIP_LINES.streak[0], on: document.querySelector('#langbar button.on').getAttribute('data-lang') }));
  ok(t.title === '别信鸭子' && /别信鸭子/.test(t.logo) && t.play === '开始' && t.on === 'zh', 'ZH title/logo/play: ' + t.logo.replace(/\s+/g, ' '));
  ok(t.hero === '小嘭' && /鸭/.test(t.enemy) && t.world === '夜市' && /反转/.test(t.rc) && /连击/.test(t.streak), 'ZH data merged: ' + [t.hero, t.enemy, t.world, t.rc].join(' | '));
  ok(/反转规则/.test(t.gm14) && /哔/.test(t.d1) && /嘭/.test(t.d1), 'ZH intros: ' + t.d1.slice(0, 40));
  await p.screenshot({ path: 'zh_title.png' });
  await p.evaluate(() => { __bakhi.save.unlocked = 40; __bakhi.startGate(1); }); await sleep(300);
  const d = await p.evaluate(() => ({ name: document.getElementById('dlg-name').textContent, hud: document.getElementById('hud-gate').textContent }));
  ok(d.name === '嘭奶奶' && /^第1关/.test(d.hud), 'ZH dialog: ' + d.name + ' / ' + d.hud);
  await p.screenshot({ path: 'zh_dlg.png' }); await skipAll(); await sleep(700);
  await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'normal'; B.fake = false; __bakhi.signal(); }); await sleep(120); await p.evaluate(() => __bakhi.tap()); await sleep(150); await p.screenshot({ path: 'zh_hit.png' });
  await sleep(900); await p.evaluate(() => __bakhi.startGate(14, { skipDlg: true })); await sleep(700);
  await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'reverse'; B.fake = false; __bakhi.signal(); }); await sleep(100); await p.screenshot({ path: 'zh_rev.png' });
  await p.evaluate(() => __bakhi.tap()); await sleep(60); ok((await p.evaluate(() => __bakhi.get().state)) === 'hurt', 'ZH reverse trap hurts');
  await sleep(900); await p.evaluate(() => __bakhi.startDaily(20261024)); await sleep(200); await skipAll(); await sleep(600);
  for (let i = 0; i < 12; i++) { const s = await p.evaluate(() => __bakhi.get().state); if (s === 'end') break; await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'wait') { B.mech = 'normal'; B.fake = false; B.hp = Math.min(B.hp, 30); __bakhi.signal(); } }); await sleep(110); await p.evaluate(() => __bakhi.tap()); await sleep(800); }
  await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: 8000 }); await sleep(200);
  const res = await p.evaluate(() => ({ t: document.getElementById('res-title').textContent, s: document.getElementById('res-sub').textContent }));
  ok(/每日关 10月24日 通过/.test(res.t) && /第一次/.test(res.s), 'ZH daily result: ' + res.t);
  await p.screenshot({ path: 'zh_res.png' });
  await p.evaluate(() => { navigator.clipboard.writeText = t => { window.__clip = t; return Promise.resolve(); }; document.getElementById('btn-share').click(); }); await sleep(100);
  const clip = await p.evaluate(() => window.__clip); ok(/别信鸭子 每日关 10月24日/.test(clip), 'ZH share: ' + clip.split('\n')[0]);
  await p.evaluate(() => { document.getElementById('btn-map').click(); }); await sleep(200); await p.screenshot({ path: 'zh_map.png' });
  await p.evaluate(() => { document.getElementById('btn-home').click(); document.getElementById('btn-vs').click(); }); await sleep(400); await p.screenshot({ path: 'zh_vs.png' });
  ok((await p.evaluate(() => document.getElementById('vs-quit').textContent)) === '✕ 退出', 'ZH versus');
  await p.evaluate(() => document.getElementById('vs-quit').click()); await sleep(200);
  console.log('errors:', errs.length ? errs : 'none'); await b.close();
})();
