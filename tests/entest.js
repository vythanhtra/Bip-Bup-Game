const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const URL = 'file://' + __dirname + '/../public/index.html?lang=en';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 1 }); await p.addInitScript(function(){ window.__FIGHT_OFF = 1; }); /* legacy reflex engine (daily/run) */
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  p.on('load', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {})); p.on('framenavigated', () => p.evaluate(() => window.__bakhi && __bakhi.setAtk(false)).catch(() => {}));
  const ok = (c, m) => console.log((c ? 'PASS' : 'FAIL') + ' ' + m);
  const skipAll = async () => { for (let i = 0; i < 8; i++) { const v = await p.evaluate(() => !document.getElementById('dlg').hidden); if (!v) break; await p.evaluate(() => { const B = __bakhi.get(); B.dlg = []; }); await p.tap('#dlg-box'); await sleep(80); } };
  await p.goto(URL); await sleep(500);
  const t = await p.evaluate(() => ({ title: document.title, logo: document.querySelector('.logo').textContent, play: document.getElementById('btn-play').textContent, tag: document.querySelector('.tag').textContent, lang: I18N.lang, hero: HEROES.tibup.name, enemy: ENEMIES.vitgia.name, world: WORLDS[1].name, rc: ROUND_CALL.reverse, gm14: GATE_META[14].intro[0][1], d1: DIALOG[1][0].text, story: STORY[0], rank: RANKS[0][2] }));
  ok(t.title === "Don't Trust the Duck" && /DON'T TRUST/.test(t.logo) && t.play === 'PLAY', 'EN title/logo/play: ' + t.logo.replace(/\s+/g, ' '));
  ok(t.hero === 'Ti Boop' && /duck/i.test(t.enemy) && t.world === 'Night Market' && /REVERSE/.test(t.rc), 'EN data merged: ' + [t.hero, t.enemy, t.world, t.rc].join(' | '));
  ok(/REVERSE RULE/.test(t.gm14) && /BEEP/.test(t.d1) && /BOOP/.test(t.d1), 'EN intros: ' + t.d1.slice(0, 80));
  ok(await p.evaluate(() => PRO_DLG.every(d => !/[ạảãàáâầấậẩẫăằắặẳẵđ]/i.test(d.text + d.name)) && /40 gates/.test(PRO_DLG[6].text) && /only student/.test(PRO_DLG[5].text)), 'EN prologue mission merged');
  console.log('   story:', t.story.slice(0, 100)); console.log('   rank:', t.rank);
  await p.screenshot({ path: 'en_title.png' });
  // gate 1 dialog in English
  await p.evaluate(() => { __bakhi.save.unlocked = 40; __bakhi.startGate(1); }); await sleep(300);
  const d = await p.evaluate(() => ({ name: document.getElementById('dlg-name').textContent, text: document.getElementById('dlg-text').textContent, hud: document.getElementById('hud-gate').textContent }));
  ok(d.name === 'Grandma Boop' && /BOOP/.test(d.text) && /^Gate 1/.test(d.hud), 'EN dialog: ' + d.name + ' / ' + d.hud);
  await p.screenshot({ path: 'en_dlg.png' }); await skipAll(); await sleep(700);
  await p.screenshot({ path: 'en_wait.png' });
  await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'normal'; B.fake = false; __bakhi.signal(); }); await sleep(120); await p.evaluate(() => __bakhi.tap()); await sleep(150); await p.screenshot({ path: 'en_hit.png' });
  const hitTxt = await p.evaluate(() => fx === undefined ? null : null).catch(() => null);
  // early tap -> forgive (gate1) label
  await sleep(800); await p.evaluate(() => { const B = __bakhi.get(); B.forgive = 0; }); await p.evaluate(() => { __bakhi.tap(); setTimeout(() => __bakhi.up(), 50); }); await sleep(150); await p.screenshot({ path: 'en_hurt.png' });
  const st = await p.evaluate(() => __bakhi.get().state); ok(st === 'hurt', 'EN early tap hurts (kind early): ' + st);
  // reverse gate 14 trap label
  await p.evaluate(() => __bakhi.startGate(14, { skipDlg: true })); await sleep(700);
  await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'reverse'; B.fake = false; __bakhi.signal(); }); await sleep(100); await p.screenshot({ path: 'en_rev.png' });
  await p.evaluate(() => __bakhi.tap()); await sleep(60); const r = await p.evaluate(() => { const B = __bakhi.get(); return { st: B.state, h: B.hearts }; }); ok(r.st === 'hurt', 'EN reverse trap: ' + r.st);
  // count label
  await sleep(900); await p.evaluate(() => __bakhi.startGate(22, { skipDlg: true })); await sleep(700);
  await p.evaluate(() => { const B = __bakhi.get(); B.mech = 'count'; B.cnt = 3; __bakhi.signal(); }); await sleep(450); await p.screenshot({ path: 'en_count.png' });
  await p.evaluate(() => __bakhi.tap()); await sleep(60); ok((await p.evaluate(() => __bakhi.get().state)) === 'hurt', 'EN count miscount hurts');
  // daily result + share text in English
  await sleep(900); await p.evaluate(() => __bakhi.startDaily(20261024)); await sleep(200); await skipAll(); await sleep(600);
  for (let i = 0; i < 12; i++) { const s = await p.evaluate(() => __bakhi.get().state); if (s === 'end') break; await p.evaluate(() => { const B = __bakhi.get(); if (B.state === 'wait') { B.mech = 'normal'; B.fake = false; B.hp = Math.min(B.hp, 30); __bakhi.signal(); } }); await sleep(110); await p.evaluate(() => __bakhi.tap()); await sleep(800); }
  await p.waitForFunction(() => !document.getElementById('s-result').hidden, null, { timeout: 8000 }); await sleep(200);
  const res = await p.evaluate(() => ({ t: document.getElementById('res-title').textContent, s: document.getElementById('res-sub').textContent, badge: document.getElementById('daily-badge').textContent }));
  ok(/DAILY GATE Oct 24 CLEAR/.test(res.t) && /first try today/.test(res.s), 'EN daily result: ' + res.t + ' / ' + res.s.slice(0, 60));
  await p.screenshot({ path: 'en_res.png' });
  // share text
  await p.evaluate(() => { navigator.clipboard.writeText = t => { window.__clip = t; return Promise.resolve(); }; document.getElementById('btn-share').click(); }); await sleep(100);
  const clip = await p.evaluate(() => window.__clip); ok(/DON'T TRUST THE DUCK Daily Oct 24/.test(clip) && /#d20261024-/.test(clip), 'EN share text: ' + clip.split('\n')[0]);
  // versus in English
  await p.evaluate(() => { document.getElementById('btn-map').click(); document.getElementById('btn-home').click(); }); await sleep(100);
  await p.evaluate(() => document.getElementById('btn-vs').click()); await sleep(400); await p.screenshot({ path: 'en_vs.png' });
  const vsq = await p.evaluate(() => document.getElementById('vs-quit').textContent); ok(vsq === '✕ Quit', 'EN versus quit button: ' + vsq);
  await p.evaluate(() => document.getElementById('vs-quit').click()); await sleep(200);
  // language toggle back to vi
  await p.evaluate(() => document.querySelector('#langbar button[data-lang="vi"]').click()); await sleep(600);
  const back = await p.evaluate(() => ({ lang: I18N.lang, play: document.getElementById('btn-play').textContent, url: location.href }));
  ok(back.lang === 'vi' && back.play === 'VÀO GAME', 'toggle back to VI: ' + back.url);
  console.log('errors:', errs.length ? errs : 'none');
  await b.close();
})();
