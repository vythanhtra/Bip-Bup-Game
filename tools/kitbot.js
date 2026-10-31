/* ADR-008 measurement bot (spec section 8, criteria A1-A4).
   Plays gates with ?kits=1 under a virtual clock: performance.now() advances exactly 16.7 ms per frame and frames run as fast as the
   machine allows, so a 60 s round takes a few real seconds and physics/timers stay frame-exact. Math.random is seeded per run.
   Usage: node tools/kitbot.js [runsPerCell=10] [parallel=4] [url=http://localhost:8765/preview/]   (serve public/ first)
   Baseline without kits (same bot, no gear, engine without kits): KITS=0 STYLES=mash node tools/kitbot.js 30 6
   ADR-009 foes (spec section 8, F1-F3): KITS=0 FOES=1 GATES=6,8 STYLES=mash,balanced,counter node tools/kitbot.js 30 6
   'counter' plays each sample foe the way its design asks (hit the dozing bull twice then back off, jump its charge; stop at three hits
   on Lý Trưởng and guard); elsewhere it plays 'balanced' and stops at five hits in a row.
   Output: one JSON line per run on stdout, then a summary table. Every threshold it reports against is a hypothesis (H23). */
const { chromium } = require('playwright');
const RUNS = +process.argv[2] || 10, PAR = +process.argv[3] || 4, URL = process.argv[4] || 'http://localhost:8765/preview/';
const HEROES = ['tibup', 'hoayen', 'bangnhi', 'thachlao'], GATES = (process.env.GATES || '12,16').split(',').map(Number), STYLES = (process.env.STYLES || 'mash,turtle,balanced').split(','), KITS = process.env.KITS !== '0', FOES = process.env.FOES === '1';

/* runs inside the page */
function harness(cfg){
  let vt = 1000, s = cfg.seed >>> 0; const q = [];
  Math.random = function(){ s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  performance.now = function(){ return vt; };
  const ch = new MessageChannel(); ch.port1.onmessage = function(){ const cbs = q.splice(0); vt += 16.7; try { if (window.__bot) window.__bot(); } catch (e) { window.__botErr = String(e); } cbs.forEach(function(cb){ cb(vt); }); };
  window.requestAnimationFrame = function(cb){ q.push(cb); if (q.length === 1) ch.port2.postMessage(0); return q.length; };
  window.cancelAnimationFrame = function(){};
  window.__result = null;
  window.__setupBot = function(style){
    const held = { l: 0, r: 0, b: 0, u: 0 }; let f = 0, step = 0;
    const key = function(k, v){ if (held[k] !== v) { held[k] = v; __bakhi.key(k, v); } };
    const release = function(){ key('l', 0); key('r', 0); key('b', 0); key('u', 0); };
    A.ev = function(n, d){ if ((n === 'gate_clear' || n === 'gate_lose') && !window.__result) window.__result = { n: n, ms: d.ms, x: d.x, vt: vt }; };
    window.__bot = function(){
      const B = __bakhi.get(); if (!B || !B.fight || B.over) { return; }
      if (B.state !== 'fight') { release(); return; }
      f++; const urgent = (style === 'balanced' || style === 'counter') && B.Fs.slice(1).some(function(X){ return X.st === 'atk' && X.atk && !X.feint && vt - X.atkT < X.atk.su; });
      if (!urgent && f % 4) return;   /* decide every 4 frames (~67 ms), every frame while a strike is coming */
      const H = B.H, SC = __bakhi.sc(), en = B.Fs.slice(1).filter(function(E){ return !E.dead && E.hp > 0; }); if (!en.length) return;
      const E = en.reduce(function(a, b){ return Math.abs(b.x - H.x) < Math.abs(a.x - H.x) ? b : a; }), d = Math.abs(E.x - H.x) / SC, toward = E.x > H.x ? 'r' : 'l', away = toward === 'r' ? 'l' : 'r';
      const now = vt, th = en.filter(function(X){ return X.st === 'atk' && X.atk && !X.feint && now - X.atkT < X.atk.su && Math.abs(X.x - H.x) / SC < 22; })[0];
      const K = B.kit || {}, hero = __bakhi.hero(); let style2 = style;
      if (style === 'turtle') { key(toward, 0); key(away, 1); return; }   /* hold back: blocks every strike, never attacks */
      if (style === 'counter') {
        if (E.ekey === 'traului') {
          const ch = en.filter(function(X){ return X.st === 'atk' && X.atk && X.atk.foe === 'charge' && now - X.atkT < X.atk.su + X.atk.ac; })[0];
          if (ch) { const left = ch.atk.su - (now - ch.atkT); key(away, 0); key(toward, 0); key('u', left < 160 && left > -100 ? 1 : 0); return; }   /* hold jump as the stampede leaves, release after */
          key('u', 0);
          if (E.napUntil > now) { key(away, 0); if (d > 9) { key(toward, 1); return; } key(toward, 0); if ((E.napHits || 0) < 2) __bakhi.press('lt'); else { key(away, 1); } return; }   /* two hits on the dozing bull, then step away */
        }
        const run = now - (E.foeHitT || -1e9) < 900 ? E.foeRun || 0 : 0;
        if (E.ekey === 'lytruong' && run >= 3) { key(toward, 0); key(away, 1); return; }   /* three hits, then guard: never feed the brace */
        if (run < 5 || E.ekey === 'traului') style2 = 'balanced'; else { key(toward, 0); key(away, 1); return; }
      }
      if (style2 === 'mash') { key(away, 0);
        if (d > 9) { key(toward, 1); return; } key(toward, 0);
        if (H.meter >= 50 && Math.random() < .15) __bakhi.press('sp'); else __bakhi.press(Math.random() < .7 ? 'lt' : 'hv'); return; }
      /* balanced: block what is coming, jab through grabs, then punish and use the kit */
      /* raise the guard in the strike's last 130 ms: a skilled player's perfect block (inside 150 ms, outside Hỏa Yến's 100 ms about half the time) */
      if (th) { if (th.atk.unblock && d < 10) { key(away, 0); key(toward, 0); __bakhi.press('lt'); return; } key(toward, 0); key(away, th.atk.su - (now - th.atkT) <= 130 ? 1 : 0); return; }
      key(away, 0);
      if (hero === 'bangnhi' && H.meter >= 25 && d > 11 && d < 20 && Math.random() < .5) { key(toward, 0); __bakhi.press('hv'); return; }
      if (d > 9) { key(toward, 1); return; } key(toward, 0);
      if (hero === 'thachlao' && H.meter >= 100) { __bakhi.press('sp'); return; }
      if (hero === 'thachlao' && K.pts > 0) { __bakhi.press('hv'); return; }
      if (H.meter >= 100 || (H.meter >= 50 && Math.random() < .3)) { __bakhi.press('sp'); return; }
      __bakhi.press(['lt', 'lt', 'hv'][step++ % 3]);
    };
  };
}

async function one(browser, job){
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route(/supabase\.co/, r => r.abort());   /* bot games must never reach the production events table */
  await p.addInitScript(harness, { seed: job.seed });
  await p.goto(URL + '?lang=vi' + (KITS ? '&kits=1' : '') + (FOES ? '&foes=1' : ''));
  await p.waitForFunction(() => window.__bakhi && __bakhi.get, null, { timeout: 20000 });
  await p.evaluate(([h, g, st]) => { localStorage.clear(); const s = __bakhi.save; s.seen = { t0: 1, pro: 1, kb: 1, w1: 1, w2: 1, w3: 1, w4: 1, w5: 1, kit_tibup: 1, kit_hoayen: 1, kit_bangnhi: 1, kit_thachlao: 1 }; s.seen[g] = 1; s.unlocked = 40; s.items = {}; s.equip = {}; s.hpBoost = 0;
    __bakhi.setHero(h); window.__setupBot(st); __bakhi.startGate(g, { skipDlg: true }); const B = __bakhi.get(); if (B.cine) B.cine.t0 = -1e9; }, [job.hero, job.gate, job.style]);
  let res = null; const t0 = Date.now();
  while (!res && Date.now() - t0 < 120000) { await p.waitForTimeout(250); res = await p.evaluate(() => { const B = __bakhi.get(); if (B && B.state === 'dialog') document.getElementById('dlg-box').click(); return window.__result; }); }
  const botErr = await p.evaluate(() => window.__botErr || null);
  await ctx.close();
  if (!res) return Object.assign({}, job, { res: 'timeout', errs: errs.concat(botErr ? [botErr] : []) });
  const f = res.x.split('|');
  return Object.assign({}, job, { res: f[3], hp: f[4], rounds: f[5], ms: res.ms, kit: f[11] || '', foe: f[12] || '', dmgIn: f[9], errs: errs.concat(botErr ? [botErr] : []) });
}

(async () => {
  const jobs = []; let seed = 1000;
  for (const g of GATES) for (const hero of HEROES) for (const style of STYLES) for (let i = 0; i < RUNS; i++) jobs.push({ gate: g, hero: hero, style: style, seed: seed++ });
  const browser = await chromium.launch(); const out = []; let next = 0;
  async function worker(){ while (next < jobs.length) { const j = jobs[next++]; const r = await one(browser, j); out.push(r); console.log(JSON.stringify(r)); } }
  await Promise.all(Array.from({ length: PAR }, worker)); await browser.close();
  const cell = {}; out.forEach(r => { const k = r.gate + '|' + r.hero + '|' + r.style; (cell[k] = cell[k] || []).push(r); });
  console.log('\nSUMMARY gate hero style n win% medianMs kitFields');
  Object.keys(cell).sort().forEach(k => { const rs = cell[k], w = rs.filter(r => r.res === 'W').length, ms = rs.map(r => r.ms || 0).sort((a, b) => a - b);
    console.log(k.split('|').join(' '), rs.length, Math.round(100 * w / rs.length), ms[Math.floor(ms.length / 2)], rs.slice(0, 3).map(r => r.kit).join(' ')); });
})();
