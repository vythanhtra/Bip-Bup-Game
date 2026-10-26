(function(){
  var SHARE_URL = "https://ba-khi.vercel.app";
  var $ = function(id){ return document.getElementById(id); };
  var cv = $('game'), ctx = cv.getContext('2d'), W = 0, H = 0, DPR = 1, GY = 0, SC = 5;
  var save = { unlocked: 1, stars: {}, best: {}, hits: [], hero: 'tibup', seen: {}, mute: false };
  try { var s0 = JSON.parse(localStorage.getItem('bakhi.save') || 'null'); if (s0 && s0.stars) { save = s0; if (!save.hero) save.hero = 'tibup'; if (!save.seen) save.seen = {}; } } catch (e) {}
  var HERO = HEROES[save.hero] ? save.hero : 'tibup';
  function persist(){ try { localStorage.setItem('bakhi.save', JSON.stringify(save)); } catch (e) {} }
  var challenge = null, m = /^#?c(\d{1,2})-(\d{2,4})$/.exec(location.hash || ''), md = /^#?d(\d{8})-(\d{2,4})$/.exec(location.hash || '');
  if (m && +m[1] >= 1 && +m[1] <= GATES.length) { challenge = { gate: +m[1], ms: +m[2] }; }
  /* ---------- daily gate: same seed, same gate, same tricks for everyone today ---------- */
  function dayKey(d){ d = d || new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
  function dayLabel(k){ k = String(k); if (I18N.lang === 'zh') return (+k.slice(4, 6)) + '月' + (+k.slice(6, 8)) + '日'; if (I18N.lang === 'en') return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+k.slice(4, 6) - 1] + ' ' + (+k.slice(6, 8)); return k.slice(6, 8) + '/' + k.slice(4, 6); }
  function mulberry(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var DAILY_POOL = []; for (var dpi = 3; dpi <= GATES.length; dpi++) if (!ENEMIES[GATES[dpi - 1].e].boss) DAILY_POOL.push(dpi);
  function dailyGate(key){ var r = mulberry(key * 7919 + 13); var n = DAILY_POOL[Math.floor(r() * DAILY_POOL.length)], base = GATES[n - 1];
    var mechs = [['normal', 'double'], ['normal', 'hold'], ['normal', 'spot'], ['normal', 'reverse'], ['normal', 'count'], ['double', 'hold', 'reverse'], ['spot', 'count'], ['normal', 'double', 'hold', 'spot', 'reverse', 'count']][Math.floor(r() * 8)];
    return { n: n, gate: Object.assign({}, base, { phases: null, hp: 120 + Math.floor(r() * 4) * 10, mech: mechs, fake: .2 + Math.floor(r() * 3) * .1, wait: [600, 2800], to: 800, dim: false }), seed: key * 31 + 7 }; }
  if (md) { challenge = { daily: +md[1], ms: +md[2] }; }
  function dailyBadge(){ var k = dayKey(), d = save.daily, b = $('daily-badge'); if (!b) return; var streak = save.dstreak || 0, streakTxt = streak > 1 ? T('badgeStreak', { n: streak }) : '';
    b.textContent = d && d.day === k ? T('badgePlayed', { d: dayLabel(k), r: d.won ? '✅ ' + d.avg + 'ms' : T('badgeLost'), s: streakTxt }) : T('badgeNew', { d: dayLabel(k), s: streakTxt }); }
  function startDaily(key){ key = key || dayKey(); var dg = dailyGate(key); startGate(dg.n, { skipDlg: true, gate: dg.gate, daily: key, seed: dg.seed }); }
  var FF = function(){ return getComputedStyle(document.body).fontFamily; };
  I18N.applyDom(); PORTAL.init(); A.ev('load', { x: location.hash ? 'hash' : 'direct' });
  if (PORTAL.on) { $('btn-fb').hidden = true; $('langbar').hidden = true; $('langpick').hidden = true; }
  Array.prototype.forEach.call(document.querySelectorAll('#langbar button, #langpick button'), function(b){ var l = b.getAttribute('data-lang'); if (l === I18N.lang) b.classList.add('on'); b.addEventListener('click', function(){ I18N.choose(l); }); });
  if (!I18N.chosen && !PORTAL.on) $('langpick').hidden = false;

  /* ---------- audio (see audio.js) ---------- */
  function sound(){ AUDIO.init(); AUDIO.setMute(!!save.mute); }
  var SFX = { bip: AUDIO.sfx.crow, bip2: AUDIO.sfx.crow2, quack: AUDIO.sfx.quack, bup: AUDIO.sfx.punch, crit: AUDIO.sfx.crit, charge: function(){}, hurt: AUDIO.sfx.hurt, win: AUDIO.sfx.win, lose: AUDIO.sfx.lose, phase: AUDIO.sfx.phase, click: AUDIO.sfx.click };
  function say(who, text, opts){ try { AUDIO.say(who, text, opts); } catch (e) {} }
  function setMuteUI(){ var m = !!save.mute; $('btn-mute').textContent = m ? '🔇' : '🔊'; $('btn-mute2').textContent = m ? T('mutedBtn') : T('sound'); }
  function toggleMute(){ save.mute = !save.mute; persist(); sound(); setMuteUI(); if (!save.mute) SFX.click(); }
  $('btn-mute').addEventListener('click', toggleMute); $('btn-mute2').addEventListener('click', toggleMute); setMuteUI();
  function vib(p){ try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

  /* ---------- helpers ---------- */
  function toast(msg){ var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(function(){ t.classList.remove('show'); }, 2400); }
  function copy(text, ok){
    function fallback(){ var ta = $('copyarea'); ta.value = text; ta.style.left = '0'; ta.focus(); ta.select(); var done = false; try { done = document.execCommand('copy'); } catch (e) {} ta.style.left = '-9999px'; toast(done ? ok : T('copyFail')); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function(){ toast(ok); }, fallback); else fallback();
  }
  function show(id){ ['s-title', 's-map', 's-result'].forEach(function(s){ $(s).hidden = s !== id; }); if (id === 's-title' && typeof dailyBadge === 'function') dailyBadge(); }
  function face(canvas, name, swap){ var pim = typeof ASSETS !== 'undefined' ? ASSETS.img('p/' + name) : null;
    if (pim) { canvas.width = 192; canvas.height = 240; var pc = canvas.getContext('2d'), pk = Math.max(192 / pim.width, 240 / pim.height); pc.drawImage(pim, (192 - pim.width * pk) / 2, 0, pim.width * pk, pim.height * pk); canvas.className = 'img'; return; }
    if (canvas.className === 'img') { canvas.className = ''; canvas.width = canvas.width === 192 ? 64 : canvas.width; canvas.height = canvas.height === 240 ? 80 : canvas.height; }
    var c = canvas.getContext('2d'); c.clearRect(0, 0, canvas.width, canvas.height); var sz = spriteSize(name); var sc = Math.floor(Math.min(canvas.width / sz.w, canvas.height / sz.h)); drawSprite(c, name, Math.floor((canvas.width - sz.w * sc) / 2), canvas.height - Math.floor((canvas.height - sz.h * sc) / 2), sc, false, swap); }
  function avgOf(arr){ if (!arr.length) return 0; var s = 0; for (var i = 0; i < arr.length; i++) s += arr[i]; return Math.round(s / arr.length); }
  function gateName(n){ return T('gateName', { n: n, w: WORLDS[GATES[n - 1].w - 1].name }); }
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------- resize ---------- */
  function resize(){ DPR = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight; cv.width = Math.floor(W * DPR); cv.height = Math.floor(H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); GY = Math.floor(H * 0.68); SC = Math.max(5, Math.min(11, Math.floor(Math.min(W / 64, H / 96)))); }
  window.addEventListener('resize', resize); resize();

  /* ---------- title ---------- */
  function drawTitle(){
    var c = $('title-canvas'), x = c.getContext('2d'), w = c.width, h = c.height, gy = Math.floor(h * 0.78), t = performance.now() / 1000;
    drawBg(x, WORLDS[0], w, h, t, gy);
    drawSprite(x, HERO, w * 0.26, gy, 7, false);
    drawSprite(x, 'gabip', w * 0.47, gy - 10, 5, false);
    drawSprite(x, 'banoi', w * 0.62, gy, 6, true);
    x.fillStyle = 'rgba(255,210,63,.9)'; x.font = '900 22px ' + FF(); x.fillText(T('cueBoop'), w * 0.36, gy - 125 + Math.sin(t * 4) * 4);
  }
  $('btn-play').addEventListener('click', function(){ sound(); SFX.click(); A.ev('play'); if (challenge && challenge.daily) { startDaily(challenge.daily); } else if (challenge) { startGate(challenge.gate); } else if (!save.seen.t0) { startTutorial(); } else { startGate(Math.min(GATES.length, save.unlocked)); } });
  $('btn-map2').addEventListener('click', function(){ sound(); SFX.click(); renderMap(); show('s-map'); });
  $('btn-story').addEventListener('click', function(){ var s = $('story'); if (s.hidden) { s.innerHTML = STORY.map(function(p){ return '<p>' + p + '</p>'; }).join(''); s.hidden = false; } else s.hidden = true; });
  $('btn-home').addEventListener('click', function(){ show('s-title'); });
  if (challenge && challenge.daily) { var cbd = $('challenge-banner'); cbd.textContent = T('chalDaily', { d: dayLabel(challenge.daily), ms: challenge.ms }) + (challenge.daily !== dayKey() ? T('chalDailyPast') : ''); cbd.hidden = false; $('btn-play').textContent = T('acceptDaily'); }
  else if (challenge) { var cb = $('challenge-banner'); cb.textContent = T('chalBanner', { g: gateName(challenge.gate), ms: challenge.ms }); cb.hidden = false; $('btn-play').textContent = T('acceptChal'); }

  /* ---------- map + hero select ---------- */
  function heroUnlocked(k){ return save.unlocked > HEROES[k].unlock; }
  function renderMap(){
    var all = save.hits, avg = avgOf(all), r = rankOf(avg || 9999);
    $('rank-name').textContent = r[1] + ' ' + r[2];
    var totalStars = 0; for (var k in save.stars) totalStars += save.stars[k];
    $('rank-sub').textContent = (all.length ? T('rankSubAvg', { ms: avg }) : T('rankSubNone')) + T('rankSubTail', { s: totalStars, a: Math.min(save.unlocked - 1, GATES.length), b: GATES.length });
    face($('rank-face'), HERO);
    var hh = '';
    Object.keys(HEROES).forEach(function(k){ var h = HEROES[k], un = heroUnlocked(k); hh += '<button type="button" class="hero' + (k === HERO ? ' on' : '') + (un ? '' : ' lock') + '" data-hero="' + k + '"' + (un ? '' : ' disabled') + '><canvas id="hf-' + k + '" width="42" height="54"></canvas>' + h.name + '<small>' + (un ? h.perk : T('heroLock', { n: h.unlock })) + '</small></button>'; });
    $('heroes').innerHTML = hh;
    Object.keys(HEROES).forEach(function(k){ face($('hf-' + k), k); });
    Array.prototype.forEach.call(document.querySelectorAll('.hero[data-hero]'), function(b){ b.addEventListener('click', function(){ sound(); SFX.click(); HERO = b.getAttribute('data-hero'); save.hero = HERO; persist(); renderMap(); toast(HEROES[HERO].name + ': ' + HEROES[HERO].line); }); });
    var html = '';
    WORLDS.forEach(function(w){
      var first = GATES.findIndex(function(g){ return g.w === w.id; }) + 1, locked = first > save.unlocked;
      html += '<div class="world' + (locked ? ' need' : '') + '"><h3><span>' + w.id + '. ' + w.name + '</span><small>' + (locked ? T('worldLock', { n: first - 1 }) : w.sub) + '</small></h3><p class="mech">' + w.mech + '</p><div class="gates">';
      GATES.forEach(function(g, i){ if (g.w !== w.id) return; var n = i + 1, st = save.stars[n] || 0, lk = n > save.unlocked, cls = 'gate' + (lk ? ' lock' : '') + (ENEMIES[g.e].boss ? ' boss' : '') + (n === save.unlocked ? ' next' : '');
        html += '<button type="button" class="' + cls + '" data-gate="' + n + '"' + (lk ? ' disabled' : '') + '>' + (ENEMIES[g.e].boss ? (g.phases ? '👑' : '👹') : n) + '<span class="st">' + (st ? '★'.repeat(st) : (lk ? '🔒' : '')) + '</span></button>'; });
      html += '</div></div>';
    });
    $('worlds').innerHTML = html;
    Array.prototype.forEach.call(document.querySelectorAll('.gate[data-gate]'), function(b){ b.addEventListener('click', function(){ sound(); SFX.click(); startGate(+b.getAttribute('data-gate')); }); });
  }
  $('btn-map').addEventListener('click', function(){ renderMap(); show('s-map'); });

  /* ---------- battle ---------- */
  var B = null, raf = 0, parts = [], fx = [], smoke = [];
  var puff = document.createElement('canvas'); puff.width = puff.height = 256; (function(){ var pc = puff.getContext('2d'), g = pc.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(110,80,90,1)'); g.addColorStop(1, 'rgba(110,80,90,0)'); pc.fillStyle = g; pc.fillRect(0, 0, 256, 256); })();
  function startGate(n, opt){
    opt = opt || {};
    var g = opt.gate || GATES[n - 1], e = ENEMIES[g.e], w = WORLDS[g.w - 1], hs = HEROES[HERO], meta = GATE_META[n] || {};
    var ph = g.phases ? g.phases[0] : null, eswap = Object.assign({}, e.swap || {}, meta.v || {});
    B = { n: n, g: g, e: e, w: w, hs: hs, practice: !!opt.practice, phase: 1, hp: ph ? ph.hp : g.hp, max: ph ? ph.hp : g.hp, hearts: hs.hearts + (opt.practice ? 2 : 0), forgive: hs.forgive, hits: [], state: 'dialog', t0: performance.now(), tSig: 0, tEnd: 0,
      fake: false, mech: 'normal', flash: 0, flashCol: '', dim: 0, heroX: 0, enemyX: 0, shake: 0, bubble: null, bubbleT: 0, over: false, dlg: (DIALOG[n] || []).slice(), round: 0,
      holding: false, holdT: 0, taps: 0, tap1: 0, spot: null, smokeA: g.smoke || 0,
      ename: meta.name || e.name, eswap: eswap, title: meta.title || '', entT: 0, hitT: 0, hurtT: 0, freezeUntil: 0, begged: false, heldSaid: false,
      daily: opt.daily || 0, rng: opt.seed ? mulberry(opt.seed) : null, cnt: 0, cntN: 0, cntT: 0, tut: false, ghostT: -1e9, ghostShown: false,
      atks: [], combo: 0, bestCombo: 0, parryT: -1e9, zoom: 0, run: opt.run || null, introBubbles: null, gesture: null, tut0: !!opt.tut0, tutStep: 0, forgiveAtk: opt.tut0 ? 9 : 0 };
    if (B.tut0) { B.forgive = 9; B.hearts = 9; }
    B.streak = 0;
    if (B.daily) B.title = T('dailyTitle', { d: dayLabel(B.daily) });
    if (!DIALOG[n] && meta.intro) B.dlg = meta.intro.map(function(l){ var who = l[0]; return { who: who, spr: SPR[who] ? who : (ENEMIES[who] ? ENEMIES[who].spr : who), swap: who === e.spr ? eswap : (ENEMIES[who] && ENEMIES[who].swap) || null, name: who === e.spr ? B.ename : (HEROES[who] ? HEROES[who].name : who === 'gabip' ? T('beepName') : who === 'banoi' ? T('grandmaName') : (ENEMIES[who] ? ENEMIES[who].name : who)), text: l[1] }; });
    if (typeof ASSETS !== 'undefined') ASSETS.need(['bg/' + BG_KEYS[g.w]].concat(ASSETS.actorKeys(HERO), ASSETS.actorKeys(g.e), ['s/gabip-idle', 'p/gabip']));
    var keepBox = (n === 1 || e.boss) && !save.seen[n];
    if (!keepBox && B.dlg.length && !B.daily) { B.introBubbles = B.dlg.slice(0, 2).map(function(d){ return { who: d.who, spr: d.spr || d.who, text: d.text }; }); B.dlg = []; }
    if ((opt.skipDlg || save.seen[n]) && !B.daily) { B.dlg = []; if (opt.skipDlg) B.introBubbles = null; }
    if (B.daily) B.dlg = [{ who: 'gabip', name: T('beepName'), text: T('dailyIntro', { d: dayLabel(B.daily) }) }];
    B.introLine = !B.dlg.length && !DIALOG[n] && !meta.intro;
    if (opt.practice) B.dlg = [{ who: 'gabip', name: T('beepName'), text: T('practiceIntro') }];
    if (n <= 2) B.forgive = Math.max(B.forgive, 1);
    AUDIO.musicStart(g.w, !!e.boss, g.phases ? 1 : 0);
    parts = []; fx = []; smoke = []; for (var i = 0; i < 14; i++) smoke.push({ x: Math.random(), y: Math.random(), r: .18 + Math.random() * .25, v: (.01 + Math.random() * .02) * (Math.random() < .5 ? 1 : -1) });
    $('hud-gate').textContent = (B.daily ? T('dailyHud', { d: dayLabel(B.daily) }) : T('gate', { n: n }) + ' · ' + (B.title || w.name)) + (B.practice ? ' · ' + T('practiceTag') : '') + (chalMs() ? ' · 👻 ' + chalMs() + 'ms' : '');
    $('hud-enemy').textContent = B.ename; $('hud-hero').textContent = hs.name;
    updateHud(); show(null); $('hud').hidden = false;
    A.ev('gate_start', { g: n, x: B.run ? 'run' : B.daily ? 'daily' : B.practice ? 'practice' : opt.tut0 ? 'tutorial' : 'gate' }); PORTAL.gameplayStart();
    nextDialog();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function curP(){ return B.g.phases ? B.g.phases[B.phase - 1] : B.g; }
  function updateHud(){ var mh = B.hs.hearts + (B.practice ? 2 : 0); $('hud-hearts').textContent = B.tut0 ? '🛡️' : '❤️'.repeat(Math.max(0, B.hearts)) + '🖤'.repeat(Math.max(0, mh - B.hearts)); $('hud-ehp').style.width = Math.max(0, B.hp / B.max * 100) + '%'; $('hud-enemy').textContent = B.ename + (B.g.phases ? ' · ' + T('phase', { n: B.phase }).toLowerCase() + '/' + B.g.phases.length : ''); }
  function nextDialog(){
    if (!B.dlg.length) { $('dlg').hidden = true; if (!B.practice && !B.daily) { save.seen[B.n] = 1; persist(); } B.state = 'ready'; B.t0 = performance.now(); if (!B.entT) B.entT = performance.now(); scheduleRound(); return; }
    var d = B.dlg.shift(); $('dlg').hidden = false; $('dlg-name').textContent = d.name; $('dlg-text').textContent = d.text; face($('dlg-face'), d.spr || d.who, d.swap); B.state = 'dialog'; say(d.who, d.text);
  }
  $('dlg-box').addEventListener('click', function(){ sound(); SFX.click(); if (B && B.state === 'dialog') nextDialog(); });
  $('dlg-box').addEventListener('contextmenu', function(e){ e.preventDefault(); });
  var dlgHold = null;
  $('dlg-box').addEventListener('pointerdown', function(){ clearTimeout(dlgHold); dlgHold = setTimeout(function(){ if (B && B.state === 'dialog') { B.dlg = []; nextDialog(); toast(T('dlgSkipped')); } }, 450); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(ev){ $('dlg-box').addEventListener(ev, function(){ clearTimeout(dlgHold); }); });
  function scheduleRound(){
    var P = curP();
    B.round++; B.state = 'wait'; B.t0 = performance.now(); B.holding = false; B.taps = 0; B.spot = null; B.heldSaid = false; B.ghostShown = false; B.cntN = 0;
    var rnd = B.rng || Math.random;
    B.mech = P.mech ? P.mech[Math.floor(rnd() * P.mech.length)] : 'normal';
    B.fake = B.mech === 'reverse' ? rnd() < .5 : B.mech === 'count' ? false : rnd() < (P.fake || 0);
    B.cnt = 2 + (rnd() < .45 ? 1 : 0);
    var span = (B.g.wait[1] - B.g.wait[0]) * Math.pow(0.88, B.streak);
    B.tSig = B.t0 + B.g.wait[0] + Math.max(300, Math.pow(rnd(), 1.7) * span);
    if (B.introBubbles && B.round === 1 && !B.practice) { var ib = B.introBubbles, tokI = B; B.bubble = ib[0].text; B.bubbleWho = ib[0].spr; B.bubbleT = performance.now(); say(ib[0].who, ib[0].text, { low: ib[0].who !== 'gabip' }); if (ib[1]) setTimeout(function(){ if (B === tokI && B.state === 'wait') { B.bubble = ib[1].text; B.bubbleWho = ib[1].spr; B.bubbleT = performance.now(); say(ib[1].who, ib[1].text, { low: ib[1].who !== 'gabip' }); } }, 1700); B.tSig += ib[1] ? 2600 : 1200; }
    else if (B.introLine && B.round === 1 && !B.practice) { B.bubble = B.e.line; B.bubbleWho = B.e.spr; B.bubbleT = performance.now(); say(B.e.spr, B.e.line, { low: true }); B.tSig += 900; }
    else { B.bubble = B.mech === 'normal' ? pick(T('idle')) : ROUND_CALL[B.mech]; B.bubbleWho = 'gabip'; B.bubbleT = performance.now(); }
    if (B.tut0) tutorialRound(); else planAttacks(rnd);
    if (B.mech === 'double') AUDIO.sfx.callDouble(); else if (B.mech === 'hold') AUDIO.sfx.callHold(); else if (B.mech === 'spot') AUDIO.sfx.callSpot(); else if (B.mech === 'reverse') AUDIO.sfx.callReverse(); else if (B.mech === 'count') AUDIO.sfx.callCount();
    if ((B.mech === 'reverse' || B.mech === 'count') && (B.round === 1 || Math.random() < .35)) say('gabip', ROUND_CALL[B.mech], { rate: 1.15 });
    AUDIO.musicState('wait'); if (B.g.dim) AUDIO.pedalStart();
    if (B.tSig - B.t0 > 1500 && Math.random() < .6 && TAUNTS[B.g.e]) { var tl = pick(TAUNTS[B.g.e]); setTimeout(function(){ if (B && B.state === 'wait' && B.tSig - performance.now() > 700) { B.bubble = tl; B.bubbleWho = B.e.spr; B.bubbleT = performance.now(); say(B.e.spr, tl, { low: true, rate: 1.2 }); } }, 650); }
    if (B.g.dim) B.dim = 0;
  }
  function signal(now){
    var P = curP(); B.tSig = now; B.tEnd = now + (P.to || B.g.to) * B.hs.win; AUDIO.musicState('signal'); AUDIO.pedalStop();
    var rnd = B.rng || Math.random;
    if (B.mech === 'reverse') {
      if (B.fake) { B.fake = false; B.state = 'go'; B.flash = 1; B.flashCol = '190,120,255'; SFX.quack(); vib(25); B.bubble = T('quackGo'); B.bubbleWho = 'vitgia'; B.bubbleT = now; burst(B.heroX, GY - SC * 9, B.hs.aura, 26); return; }
      B.state = 'fakesig'; B.flash = 1; B.flashCol = '255,160,40'; SFX.bip(); B.bubble = T('beepFreeze'); B.bubbleWho = 'gabip'; B.bubbleT = now; return;
    }
    if (B.mech === 'count') { B.state = 'count'; B.cntN = 1; B.cntT = now; SFX.bip(); B.flash = .5; B.flashCol = '255,210,63'; B.bubble = T('one'); B.bubbleWho = 'gabip'; B.bubbleT = now; return; }
    if (B.fake && !save.seen.fk && !B.practice) { B.tut = true; save.seen.fk = 1; persist(); }
    if (B.fake) { B.state = 'fakesig'; B.flash = 1; B.flashCol = '255,46,110'; if (B.g.sneeze) AUDIO.sfx.sneeze(); else SFX.quack(); var bluff = B.g.foxbluff && rnd() < .5; B.bubble = bluff ? T('foxBluff') : (B.g.sneeze ? T('sneeze') : T('quack')); B.bubbleWho = bluff ? 'cao' : (B.g.sneeze ? 'bangvuong' : 'vitgia'); B.bubbleT = now; return; }
    B.state = 'go'; B.flash = 1; B.flashCol = '198,255,46'; vib(25);
    if (B.mech === 'double') { SFX.bip2(); B.bubble = T('beep2'); }
    else { SFX.bip(); B.bubble = B.mech === 'hold' ? T('releaseCue') : T('beep1'); }
    B.bubbleWho = 'gabip'; B.bubbleT = now;
    if (B.mech === 'spot') { var r = Math.min(W, H) * 0.16 * (B.g.spotR || 1); B.spot = { x: W * (0.15 + rnd() * 0.7), y: H * (0.22 + rnd() * 0.5), r0: r, r: r }; }
    burst(B.heroX, GY - SC * 9, B.hs.aura, 26);
  }
  function dmgFor(ms){ return ms < 180 ? 45 : ms < 250 ? 35 : ms < 320 ? 25 : ms < 450 ? 15 : 8; }
  function hit(ms, mult, label){
    var now = performance.now(); if (B.combo > 0) { mult *= 1 + .25 * Math.min(4, B.combo); label = (label || (ms < 180 ? T('critLbl') : T('boopLbl'))) + T('comboTag', { n: B.combo }); }
    var dmg = Math.round(dmgFor(ms) * mult * B.hs.dmg); B.bestCombo = Math.max(B.bestCombo, B.combo); B.combo = 0; B.zoom = 1;
    if (B.run) { B.run.score += dmg + (ms < 180 ? 30 : 0); }
    B.hits.push(ms); if (!B.practice) { save.hits.push(ms); if (save.hits.length > 60) save.hits.shift(); }
    B.hp -= dmg; updateHud(); B.state = 'hit'; B.t0 = now; B.shake = .6 + Math.min(1.2, dmg / 45) * .9; B.holding = false; B.spot = null; B.streak++; AUDIO.chargeStop(); AUDIO.musicState('play');
    if (ms < 180 || mult > 1.2) SFX.crit(); else SFX.bup(); vib(ms < 180 ? [30, 30, 60] : 30);
    B.hitT = now; B.freezeUntil = now + (ms < 180 || mult > 1.2 ? 120 : 55);
    for (var li = 0; li < 6; li++) parts.push({ x: B.heroX - 10 - Math.random() * 40, y: GY - SC * 12 + Math.random() * SC * 8, vx: -14 - Math.random() * 8, vy: 0, life: .6, col: 'rgba(255,255,255,.8)', sz: 3, w: 30 + Math.random() * 30 });
    for (li = 0; li < 5; li++) parts.push({ x: B.enemyX + SC * 6, y: GY - SC * 9, vx: (Math.random() - .5) * 10, vy: -4 - Math.random() * 5, life: 1, col: '#ffd23f', sz: 7, star: true });
    var crit = ms < 180 || mult > 1.2;
    if (crit) { var cl = pick(HERO_CRIT[HERO] || HERO_CHEER[HERO]); setTimeout(function(){ say(HERO, cl, { rate: 1.3 }); }, 100); }
    else if (ms > 450) { var sl = pick(HERO_SLOW[HERO] || ['...']); setTimeout(function(){ say(HERO, sl, { rate: 1.1 }); }, 150); }
    else if (Math.random() < .5) { var ch = pick(HERO_CHEER[HERO] || ['BỤP!']); setTimeout(function(){ say(HERO, ch, { rate: 1.3 }); }, 120); }
    var tokB = B; setTimeout(function(){ if (B !== tokB || B.over) return; var nowb = performance.now();
      if (B.hp > 0 && B.hp / B.max < .3 && !B.begged) { B.begged = true; var lw = pick((ENEMY_LOW[B.g.e] || []).concat(ENEMY_LOW._)); B.bubble = lw; B.bubbleWho = B.e.spr; B.bubbleT = nowb; say(B.e.spr, lw, { low: true }); }
      else if (Math.random() < .55) { var eh = pick((ENEMY_HIT[B.g.e] || []).concat(ENEMY_HIT._)); B.bubble = eh; B.bubbleWho = B.e.spr; B.bubbleT = nowb; say(B.e.spr, eh, { low: true, rate: 1.4 }); } }, 420);
    fx.push({ t: now, x: B.enemyX, y: GY - SC * 14, txt: (label || (ms < 180 ? T('critLbl') : T('boopLbl'))) + '-' + dmg, sub: ms + 'ms', col: mult > 1.2 ? '#7fe7ff' : ms < 180 ? '#ffd23f' : '#c6ff2e' });
    burst(B.enemyX, GY - SC * 8, '#ffffff', 18);
    var gl = mult > 1.2 ? T('chargeLbl') : ms < 150 ? pick(GABIP_LINES.fast) : ms > 450 ? pick(GABIP_LINES.slow) : null;
    if ([3, 5, 7, 10].indexOf(B.streak) >= 0) gl = GABIP_LINES.streak[[3, 5, 7, 10].indexOf(B.streak)];
    if (gl) { B.bubble = gl; B.bubbleWho = 'gabip'; B.bubbleT = now; if (/Chuỗi|TÍCH|Streak|CHARGED|连击|蓄力/.test(gl)) say('gabip', gl, { rate: 1.2 }); } else B.bubble = null;
    if (B.hp <= 0 && B.run) { B.run.kills++; B.run.score += 100; fx.push({ t: now + 200, x: W / 2 - SC * 7, y: H * .35, txt: '+100', sub: T('runNext'), col: '#ffd23f' }); var tokR = B; setTimeout(function(){ if (B === tokR && !B.over) nextRunEnemy(); }, 700); }
    else if (B.hp <= 0) {
      if (B.g.phases && B.phase < B.g.phases.length) { B.phase++; var P = B.g.phases[B.phase - 1]; B.hp = P.hp; B.max = P.hp; B.smokeA = P.smoke || 0; B.hearts = Math.min(B.hs.hearts + (B.practice ? 2 : 0), B.hearts + 1); updateHud(); SFX.phase(); AUDIO.musicStart(B.g.w, true, B.phase); B.bubble = P.line; B.bubbleWho = B.e.spr; B.bubbleT = now + 400; setTimeout(function(){ say(B.e.spr, P.line); }, 400); fx.push({ t: now + 300, x: W / 2 - SC * 7, y: H * .4, txt: T('phase', { n: B.phase }), sub: T('phaseSub', { l: P.line }), col: '#ffd23f' }); var tokP = B; setTimeout(function(){ if (B === tokP && !B.over) scheduleRound(); }, 1400); }
      else { B.hp = 0; updateHud(); var tokE = B; setTimeout(function(){ if (B === tokE) endBattle(true); }, 500); }
    }
    else { var tokH = B; setTimeout(function(){ if (B === tokH && !B.over && B.state === 'hit') scheduleRound(); }, 420); }
  }
  function hurt(label, now, who, kind){
    AUDIO.chargeStop(); AUDIO.musicState('play'); B.streak = 0; B.combo = 0; B.atks = []; kind = kind || 'early'; B.lastKind = kind;
    if (B.tut0) { B.state = 'hit'; B.t0 = now; B.holding = false; AUDIO.sfx.forgive(); fx.push({ t: now, x: B.heroX, y: GY - SC * 14, txt: T('tutForgive'), sub: '', col: '#7fe7ff' }); var tokT2 = B; setTimeout(function(){ if (B === tokT2 && !B.over) scheduleRound(); }, 650); return; }
    if (B.forgive > 0 && kind === 'early') { B.forgive--; B.state = 'hit'; B.t0 = now; B.holding = false; AUDIO.sfx.forgive(); fx.push({ t: now, x: B.heroX, y: GY - SC * 14, txt: T('forgiveLbl'), sub: T('forgiveSub', { h: B.hs.name }), col: '#7fe7ff' }); B.bubble = T('forgiveLine'); B.bubbleWho = 'gabip'; B.bubbleT = now; say('gabip', T('forgiveSay')); var tokF = B; setTimeout(function(){ if (B === tokF && !B.over) scheduleRound(); }, 650); return; }
    B.hearts--; updateHud(); B.state = 'hurt'; B.t0 = now; B.hurtT = now; B.freezeUntil = now + 85; B.shake = 1.3; B.holding = false; B.spot = null; vib([60, 40, 60]);
    for (var si = 0; si < 6; si++) parts.push({ x: B.heroX + SC * 7 + (Math.random() - .5) * SC * 6, y: GY - SC * 16, vx: (Math.random() - .5) * 4, vy: -3 - Math.random() * 3, life: 1, col: '#7fe7ff', sz: 4, grav: .35 });
    var fooled = kind === 'fooled';
    if (fooled) { for (si = 0; si < 3; si++) fx.push({ t: now + si * 120, x: B.heroX - SC * 2 + si * SC * 5, y: GY - SC * 20, txt: '?', sub: '', col: '#ff2e6e' }); }
    if (kind === 'early' || kind === 'count' || kind === 'bet') AUDIO.sfx.buzzer(); else if (kind === 'whiff') AUDIO.sfx.whiff(); else if (kind === 'atk') AUDIO.sfx.punch(); SFX.hurt(); B.zoom = .8;
    fx.push({ t: now, x: B.heroX, y: GY - SC * 14, txt: label, sub: T('heart'), col: '#ff2e6e' });
    var ou = pick(HERO_OUCH[HERO] || [T('ouch')]); say(HERO, ou, { rate: 1.3 });
    var tl = fooled ? pick((ENEMY_FOOLED[B.g.e] || []).concat(ENEMY_FOOLED._)) : who === 'gabip' ? pick(GABIP_LINES.slow) : pick(T('hurtLines'));
    B.bubble = tl; B.bubbleWho = fooled ? B.e.spr : (who || B.e.spr); B.bubbleT = now; setTimeout(function(){ say(B.bubbleWho, tl, { low: B.bubbleWho !== 'gabip' }); }, 350);
    var tokU = B;
    if (B.hearts <= 0) setTimeout(function(){ if (B === tokU) endBattle(false); }, 500);
    else setTimeout(function(){ if (B === tokU && !B.over && B.state === 'hurt') scheduleRound(); }, 650);
  }
  function burst(x, y, col, n){ for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, sp = 2 + Math.random() * 5; parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, life: 1, col: col, sz: 3 + Math.random() * 4 }); } }

  /* ---------- core 2: enemy attacks (telegraph → strike), parry by swipe, feints, hold-to-bet, 60s run ---------- */
  var ATK_OFF = false;
  function atkProfile(){ var w = B.g.w, boss = !!B.e.boss, n = B.n;
    if (B.run) { var k = B.run.kills; return { n: Math.min(3, 1 + Math.floor(k / 3)), tel: Math.max(420, 720 - k * 25), feint: Math.min(.35, k * .04) }; }
    if (B.practice && n <= 2) return { n: 0 };
    var prof = w === 1 ? { n: n <= 2 ? 0 : 1, tel: 820, feint: 0 } : w === 2 ? { n: 1 + (n % 2), tel: 680, feint: .22 } : w === 3 ? { n: 2, tel: 600, feint: .2 } : w === 4 ? { n: 2, tel: 560, feint: .25 } : { n: 2 + (n % 2), tel: 500, feint: .3 };
    if (boss) { prof.n = Math.min(3, prof.n + 1); prof.tel -= 40; } return prof; }
  function planAttacks(rnd){
    B.atks = []; if (ATK_OFF || B.mech === 'hold') return; var pr = atkProfile(); if (!pr.n) return;
    var t = B.t0 + 700 + (B.round === 1 ? 900 : 0); if (B.introBubbles && B.round === 1) t += 2400;
    var mv = MOVES[B.g.e], set = mv ? moveSet(B.g.e, B.phase) : null;
    if (!set) { for (var i = 0; i < pr.n; i++) { if (rnd() < .35 && i > 0) continue; var dir = ['L', 'R', 'U'][Math.floor(rnd() * 3)]; B.atks.push({ dir: dir, at: t, tel: pr.tel, feint: rnd() < pr.feint, st: 0 }); t += pr.tel + 620 + rnd() * 400; } }
    else {
      var pool = set.filter(function(c){ return c.s.length <= pr.n + 1; }); if (!pool.length) pool = [set[0]];
      var c = pool[Math.floor(rnd() * pool.length)], tel = Math.round(pr.tel * (mv.tel || 1)), fp = mv.feint == null ? pr.feint : mv.feint;
      for (var j = 0; j < c.s.length; j++) { var sp = c.s[j], d2 = !sp.d || sp.d === '?' ? ['L', 'R', 'U'][Math.floor(rnd() * 3)] : sp.d, tl = Math.max(420, Math.round(tel * (sp.t || 1)));
        B.atks.push({ dir: d2, at: t, tel: tl, feint: sp.f ? true : rnd() < fp * (j === 0 ? 1 : .5), st: 0, call: j === 0 ? c.call : null, combo: c.s.length }); t += tl + Math.round((620 + rnd() * 400) * (sp.g || 1)); }
    }
    if (B.atks.length) B.tSig = Math.max(B.tSig, t + 350);
  }
  function curAtk(){ for (var i = 0; i < B.atks.length; i++) if (B.atks[i].st === 1) return B.atks[i]; return null; }
  function tickAttacks(now){
    if (B.state !== 'wait') return;
    for (var i = 0; i < B.atks.length; i++) { var a = B.atks[i];
      if (a.st === 0 && now >= a.at) { a.st = 1; AUDIO.sfx.windup(); if (B.round <= 1 && !save.seen.pr) { save.seen.pr = 1; persist(); B.bubble = T('parryTeach'); B.bubbleWho = 'gabip'; B.bubbleT = now; say('gabip', T('parryTeach'), { rate: 1.2 }); }
        else if (a.call && !B.tut0) { B.bubble = a.call; B.bubbleWho = B.e.spr; B.bubbleT = now; say(B.e.spr, a.call, { rate: 1.3, low: true }); } }
      else if (a.st === 1 && now >= a.at + a.tel) { a.st = 2;
        if (a.feint) { AUDIO.sfx.phew(); fx.push({ t: now, x: B.enemyX, y: GY - SC * 16, txt: T('feintLbl'), sub: '', col: '#ff5fa2' }); if (B.tut0 && B.tutStep === 1) { B.tutStep = 2; B.tSig = now + 99999; var tokF = B; setTimeout(function(){ if (B === tokF && !B.over) scheduleRound(); }, 900); } }
        else if (B.tut0 && B.forgiveAtk > 0) { B.forgiveAtk--; AUDIO.sfx.forgive(); fx.push({ t: now, x: B.heroX, y: GY - SC * 14, txt: T('tutForgive'), sub: '', col: '#7fe7ff' }); B.bubble = T('tut1'); B.bubbleWho = 'gabip'; B.bubbleT = now; a.st = 0; a.at = now + 1200; }
        else { B.holding = false; AUDIO.chargeStop(); hurt(T('atkHit'), now, null, 'atk'); return; } } }
  }
  function parry(dir, now){
    var a = curAtk(); if (!a) return false;
    if (a.feint) { a.st = 2; hurt(T('feintHit'), now, null, 'fooled'); return true; }
    if (a.dir !== dir) { a.st = 2; hurt(T('wrongDir'), now, null, 'atk'); return true; }
    a.st = 2; B.combo++; B.parryT = now; B.freezeUntil = now + 45; B.shake = .5; AUDIO.sfx.parry(); vib(20); if (B.tut0 && B.tutStep === 0) { B.tutStep = 1; B.tSig = now + 99999; var tokS = B; setTimeout(function(){ if (B === tokS && !B.over) scheduleRound(); }, 900); }
    var pd = Math.round(6 * B.hs.dmg + B.combo * 2); B.hp -= pd; updateHud(); if (B.run) B.run.score += 10 + B.combo * 5;
    burst(B.heroX + SC * 11, GY - SC * 9, '#ffffff', 14); for (var i = 0; i < 4; i++) parts.push({ x: B.heroX + SC * 11, y: GY - SC * 9, vx: (Math.random() - .5) * 8, vy: -2 - Math.random() * 4, life: .8, col: '#ffd23f', sz: 5, star: true });
    fx.push({ t: now, x: B.heroX + SC * 2, y: GY - SC * 15, txt: T('parryLbl') + (B.combo > 1 ? ' x' + B.combo : ''), sub: '-' + pd, col: '#7fe7ff' });
    if (B.combo === 3 || B.combo === 5) { B.bubble = pick(GABIP_LINES.streak); B.bubbleWho = 'gabip'; B.bubbleT = now; }
    if (B.hp <= 0) { B.hp = 0; updateHud(); if (B.run) { B.run.kills++; B.run.score += 100; var tokP = B; setTimeout(function(){ if (B === tokP && !B.over) nextRunEnemy(); }, 600); } else { var tokE2 = B; setTimeout(function(){ if (B === tokE2) endBattle(true); }, 500); } }
    return true;
  }
  /* run mode: random opponents, 60 s, score */
  var RUN_POOL = Object.keys(ENEMIES).filter(function(k){ return !ENEMIES[k].boss; });
  function runGate(k){ var e = RUN_POOL[Math.floor(Math.random() * RUN_POOL.length)], w = 1 + Math.floor(Math.random() * 5), mech = k < 2 ? ['normal'] : ['normal', 'normal', 'double', 'spot', 'reverse', 'count'];
    return { w: w, e: e, hp: 60 + Math.min(60, k * 8), wait: [500, 1500], to: 750, fake: Math.min(.4, .1 + k * .04), mech: mech, smoke: w === 4 ? .35 : 0, spotR: .9 }; }
  function startRun(){ var g = runGate(0), gi = GATES.findIndex(function(x){ return x.e === g.e; }) + 1; startGate(gi || 1, { skipDlg: true, gate: g, run: { score: 0, kills: 0, until: performance.now() + 60000, started: performance.now() } }); B.title = T('runTitle'); $('hud-gate').textContent = T('runHud', { t: '1:00', s: 0 }); }
  function nextRunEnemy(){ var r = B.run, g = runGate(r.kills), e = ENEMIES[g.e]; B.g = g; B.e = e; B.w = WORLDS[g.w - 1]; B.ename = e.name; B.eswap = Object.assign({}, e.swap || {}); B.hp = g.hp; B.max = g.hp; B.smokeA = g.smoke; B.entT = performance.now(); B.enemyEnt = performance.now(); B.combo = 0; B.begged = false; updateHud(); AUDIO.musicStart(g.w, false, 0); SFX.phase(); B.bubble = e.line; B.bubbleWho = e.spr; B.bubbleT = performance.now() + 300; scheduleRound(); }
  function tickRun(now){ var r = B.run; if (!r) return; var left = Math.max(0, r.until - now); $('hud-gate').textContent = T('runHud', { t: '0:' + String(Math.ceil(left / 1000)).padStart(2, '0'), s: r.score }); if (left <= 0 && !B.over) { B.over = true; endRun(); } }
  function endRun(){ var r = B.run; AUDIO.musicStop(); SFX.win(); $('hud').hidden = true; cancelAnimationFrame(raf); A.ev('run_end', { ms: r.score, x: 'k' + r.kills }); PORTAL.gameplayStop(); if (!save.runBest || r.score > save.runBest) { save.runBest = r.score; r.newBest = true; } persist(); showResult(true, 0, avgOf(B.hits)); }
  /* tutorial gate 0: one slow attack, one feint, one beep; nothing can be lost */
  function startTutorial(){ var g = { w: 1, e: 'linhco', hp: 34, wait: [900, 1400], to: 1100, fake: 0, mech: ['normal'] }; startGate(1, { skipDlg: true, gate: g, tut0: true }); B.ename = T('tutEnemy'); B.title = T('tutTitle'); $('hud-gate').textContent = T('tutTitle'); updateHud(); }
  function tutorialRound(){ var now = performance.now(), st = B.tutStep;
    if (st === 0) { B.atks = [{ dir: 'R', at: now + 1500, tel: 1500, feint: false, st: 0 }]; B.tSig = now + 9000; B.bubble = T('tut1'); B.bubbleWho = 'gabip'; B.bubbleT = now; say('gabip', T('tut1'), { rate: 1.15 }); }
    else if (st === 1) { B.atks = [{ dir: 'L', at: now + 1300, tel: 1500, feint: true, st: 0 }]; B.tSig = now + 4600; B.bubble = T('tut2'); B.bubbleWho = 'gabip'; B.bubbleT = now; say('gabip', T('tut2'), { rate: 1.15 }); }
    else { B.atks = []; B.tSig = now + 2600; B.bubble = T('tut3'); B.bubbleWho = 'gabip'; B.bubbleT = now; say('gabip', T('tut3'), { rate: 1.15 }); }
  }
  /* input: down/up with coordinates */
  function tapDown(px, py, ts){
    if (!B || B.over) return;
    var now = (ts && ts > 0 ? ts : performance.now()), st = B.state;
    if (now < (B.lockUntil || 0)) return;
    if (st === 'wait' && B.round === 1 && now - B.t0 < 500) return;   /* grace after dialog closes */
    if (st === 'wait') { var ap = B.arrowPos, ca0 = curAtk(); if (ca0 && ap && Math.hypot(px - ap.x, py - ap.y) < ap.r) { parry(ca0.dir, now); return; }
      if (!B.holding) { B.holding = true; B.holdT = now; B.gesture = { x: px, y: py, t: now }; if (B.mech === 'hold' || !ca0) AUDIO.chargeStart(); } return; }
    if (st === 'fakesig' && B.tut) { B.tut = false; B.fake = false; B.state = 'wait'; B.t0 = now - 500; B.tSig = now + 1100 + Math.random() * 600; AUDIO.sfx.forgive(); fx.push({ t: now, x: B.heroX, y: GY - SC * 14, txt: T('tutLbl'), sub: T('tutSub'), col: '#7fe7ff' }); B.bubble = T('tutLine'); B.bubbleWho = 'gabip'; B.bubbleT = now; say('gabip', T('tutSay')); AUDIO.musicState('wait'); return; }
    if (st === 'fakesig') { hurt(B.mech === 'reverse' ? T('fooledRev') : B.g.sneeze ? T('fooledSneeze') : B.g.foxbluff ? T('fooledFox') : T('fooledDuck'), now, null, 'fooled'); return; }
    if (st === 'count') { hurt(T('countWrong'), now, 'gabip', 'count'); return; }
    if (st === 'go') {
      var ms = Math.round(now - B.tSig);
      if (B.mech === 'spot') { var d = Math.hypot(px - B.spot.x, py - B.spot.y); if (d > B.spot.r + 10) { hurt(T('whiff'), now, 'gabip', 'whiff'); return; } hit(ms, B.spot.r < B.spot.r0 * .6 ? 1.3 : 1, B.spot.r < B.spot.r0 * .6 ? T('smallSpot') : null); return; }
      if (B.mech === 'double') { B.taps++; if (B.taps === 1) { B.tap1 = now; AUDIO.sfx.tapone(); burst(B.heroX + SC * 7, GY - SC * 10, B.hs.aura, 10); B.bubble = T('oneMore'); B.bubbleWho = 'gabip'; B.bubbleT = now; return; } var ms1 = Math.round(B.tap1 - B.tSig); hit(ms1, now - B.tap1 < 450 ? 1.25 : 1, now - B.tap1 < 450 ? T('doubleLbl') : null); return; }
      if (B.mech === 'hold') { if (B.holding) return; hit(ms, 1, null); return; }
      hit(ms, 1, null); return;
    }
  }
  function tapUp(ts){
    if (!B || B.over) return;
    if (B.state === 'lost') { var n0 = B.n, pr = B.practice; startGate(n0, { skipDlg: true, practice: pr }); B.lockUntil = performance.now() + 450; return; }
    if (!B.holding) return;
    var now = (ts && ts > 0 ? ts : performance.now()); B.gesture = null;
    if (B.state === 'wait') { hurt(now - B.holdT < 250 ? T('early') : T('earlyRel'), now, null, 'early'); return; }
    if (B.state === 'go') { var ms = Math.round(now - B.tSig), held = (B.tSig - B.holdT) / 1000;
      if (B.mech === 'hold') { hit(ms, held > 0.6 ? 1.6 : 1.2, T('chargeHit')); return; }
      if (held < 0.4) { hit(ms, 1, null); return; }
      if (ms < 160) { fx.push({ t: now, x: B.heroX, y: GY - SC * 19, txt: T('betWin'), sub: 'x2.2', col: '#ffd23f' }); hit(ms, 2.2, T('betLbl')); return; }
      B.holding = false; hurt(T('betLose'), now, 'gabip', 'bet'); return; }
    B.holding = false;
  }
  function endBattle(won){
    B.over = true; B.state = 'end'; $('dlg').hidden = true;
    var avg = avgOf(B.hits), stars = 0;
    A.ev(won ? 'gate_clear' : 'gate_lose', { g: B.n, ms: avg || null, x: (B.tut0 ? 'tutorial:' : B.daily ? 'daily:' : B.practice ? 'practice:' : '') + (won ? 'hearts' + B.hearts : 'r' + B.round + ':' + (B.lastKind || '')) });
    if (B.tut0) { save.seen.t0 = 1; persist(); B.over = false; B.state = 'won'; B.t0 = performance.now(); B.stars = 3; B.avg = avg; AUDIO.musicStop(); SFX.win(); var tokT = B; setTimeout(function(){ if (B === tokT && B.state === 'won') { startGate(Math.min(GATES.length, save.unlocked)); B.lockUntil = performance.now() + 450; } }, 1500); return; }
    if (won) { stars = 1 + (B.hearts === B.hs.hearts + (B.practice ? 2 : 0) ? 1 : 0) + (avg && avg < 250 ? 1 : 0);
      if (B.daily) { dailyDone(true, avg); }
      else if (!B.practice) { save.stars[B.n] = Math.max(save.stars[B.n] || 0, stars); if (!save.best[B.n] || avg < save.best[B.n]) save.best[B.n] = avg; if (B.n === save.unlocked) save.unlocked = B.n + 1; if (challenge && challenge.gate === B.n) save.unlocked = Math.max(save.unlocked, B.n + 1); persist(); } SFX.win(); }
    else { if (B.daily) dailyDone(false, avg); else if (!B.practice) persist(); SFX.lose(); }
    AUDIO.musicStop();
    var lossKey = 'l' + B.n; losses[lossKey] = won ? 0 : (losses[lossKey] || 0) + 1;
    if (won && !B.e.boss && !B.practice && !B.daily && B.n < GATES.length && !(challenge && challenge.gate === B.n)) { B.over = false; B.state = 'won'; B.t0 = performance.now(); B.stars = stars; B.avg = avg; lastWin = { gate: B.n, stars: stars, avg: avg }; var tokW = B; setTimeout(function(){ if (B === tokW && B.state === 'won') { startGate(B.n + 1); B.lockUntil = performance.now() + 450; } }, 1500); return; }
    if (!won && losses[lossKey] < 2 && !B.daily && !(challenge && challenge.gate === B.n)) { B.over = false; B.state = 'lost'; B.t0 = performance.now(); return; }
    $('hud').hidden = true; cancelAnimationFrame(raf); PORTAL.gameplayStop(); if (won && B.e.boss) PORTAL.happy();
    showResult(won, stars, avg);
  }
  var losses = {}, lastWin = null;
  function dailyDone(won, avg){ var k = B.daily, d = save.daily; B.dailyFirst = !(d && d.day === k);
    if (B.dailyFirst) { var y = new Date(); y.setDate(y.getDate() - 1); save.dstreak = (save.dlast === dayKey(y)) ? (save.dstreak || 0) + 1 : 1; save.dlast = k; save.daily = { day: k, won: won, avg: avg }; }
    persist(); }
  function chalMs(){ return challenge && B && ((challenge.gate === B.n && !B.daily) || (challenge.daily && challenge.daily === B.daily)) ? challenge.ms : 0; }
  $('btn-quit').addEventListener('click', function(){ if (!B) return; A.ev('quit', { g: B.n, x: 'r' + B.round }); PORTAL.gameplayStop(); B.over = true; AUDIO.musicStop(); cancelAnimationFrame(raf); $('hud').hidden = true; $('dlg').hidden = true; renderMap(); show('s-map'); });
  cv.addEventListener('pointerdown', function(e){ e.preventDefault(); sound(); if (B && B.state === 'dialog') { nextDialog(); return; } tapDown(e.clientX, e.clientY, e.timeStamp); });
  cv.addEventListener('pointermove', function(e){ if (!B || !B.gesture || !B.holding) return; var dx = e.clientX - B.gesture.x, dy = e.clientY - B.gesture.y; if (Math.hypot(dx, dy) < 28) return; var dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'R' : 'L') : (dy < 0 ? 'U' : 'D'); B.gesture = null; swipe(dir, e.timeStamp); });
  cv.addEventListener('pointerup', function(e){ e.preventDefault(); sound(); tapUp(e.timeStamp); });
  cv.addEventListener('pointercancel', function(){ if (B) { B.holding = false; B.gesture = null; AUDIO.chargeStop(); } });
  function swipe(dir, ts){ if (!B || B.over) return; var now = (ts && ts > 0 ? ts : performance.now()); if (B.state !== 'wait') return; B.holding = false; AUDIO.chargeStop(); if (!parry(dir, now)) { B.swT = now; B.swDir = dir; } }
  document.addEventListener('click', function(){ sound(); }, true);
  document.addEventListener('keydown', function(e){ if ((e.code === 'Space' || e.code === 'Enter') && B && !B.over && !e.repeat) { var tg = e.target.tagName; if (tg === 'BUTTON' || tg === 'A') return; e.preventDefault(); sound(); if (B.state === 'dialog') nextDialog(); else tapDown(B.spot ? B.spot.x : W / 2, B.spot ? B.spot.y : H / 2); } });
  document.addEventListener('keyup', function(e){ if ((e.code === 'Space' || e.code === 'Enter') && B && !B.over) tapUp(); });
  document.addEventListener('keydown', function(e){ var m = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D', KeyA: 'L', KeyD: 'R', KeyW: 'U', KeyS: 'D' }[e.code]; if (m && B && !B.over && !e.repeat) { e.preventDefault(); sound(); if (B.state === 'wait' && !B.holding) { B.holding = true; B.holdT = performance.now(); } swipe(m); } });

  /* ---------- render loop ---------- */
  function loop(now){
    if (!B || B.over) return;
    raf = requestAnimationFrame(loop);
    if (now < B.freezeUntil) { B.lastF = now; return; }   /* hit-stop: hold the last frame */
    var t = now / 1000, st = B.state, P = curP(), dt = Math.min(50, now - (B.lastF || now)) / 16.7; B.lastF = now;
    if (st === 'won' || st === 'lost') { drawBg(ctx, B.w, W, H, t, GY); var age = (now - B.t0) / 1000, esc0 = B.g.phases ? SC + 3 : B.e.boss ? SC + 1 : SC;
      if (st === 'won') { drawActor(HERO, W * .3, GY, SC, false, null, { dy: -Math.abs(Math.sin(age * 9)) * SC * 5, sy: 1 + Math.sin(age * 18) * .08, sx: 1 - Math.sin(age * 18) * .06, key: HERO, pose: 'attack' }); drawActor(B.e.spr, W * .7 - (esc0 - SC) * 7 + age * W * .9, GY - age * age * H * .6, esc0, true, B.eswap, { rot: age * 9, key: B.g.e, pose: 'hurt' });
        if (Math.random() < .8) parts.push({ x: Math.random() * W, y: -10, vx: (Math.random() - .5) * 2, vy: 3 + Math.random() * 4, life: 1.2, col: pick(['#ffd23f', '#c6ff2e', '#ff5fa2', '#7fe7ff', '#fff']), sz: 5 + Math.random() * 5, conf: true }); }
      else { var kd = Math.min(1, age * 3); drawActor(HERO, W * .3, GY, SC, false, null, { rot: -.3 * kd + Math.sin(age * 4) * .05, sy: 1 - .28 * kd, sx: 1 + .18 * kd, dy: SC * 2.5 * kd, key: HERO, pose: 'hurt' }); ctx.font = '900 ' + SC * 3 + 'px ' + FF(); ctx.fillStyle = '#ffd23f'; for (var si = 0; si < 3; si++) ctx.fillText('✦', W * .3 + SC * 7 + Math.cos(age * 3 + si * 2.1) * SC * 6, GY - SC * 20 + Math.sin(age * 3 + si * 2.1) * SC * 2); drawActor(B.e.spr, W * .7 - (esc0 - SC) * 7, GY, esc0, true, B.eswap, { dy: -Math.abs(Math.sin(age * 7)) * SC * 3, rot: Math.sin(age * 7) * .15, key: B.g.e, pose: 'attack' }); }
      for (var pi = parts.length - 1; pi >= 0; pi--) { var pp = parts[pi]; pp.x += pp.vx; pp.y += pp.vy; pp.life -= .012 * dt; if (pp.life <= 0 || pp.y > H) { parts.splice(pi, 1); continue; } ctx.globalAlpha = Math.min(1, pp.life); ctx.fillStyle = pp.col; ctx.fillRect(pp.x, pp.y, pp.sz, pp.sz * (pp.conf ? .6 : 1)); } ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(11,11,22,.55)'; ctx.fillRect(0, 0, W, H); ctx.textAlign = 'center'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 8;
      ctx.font = '900 ' + Math.round(Math.min(W, H) * .13) + 'px ' + FF(); ctx.fillStyle = st === 'won' ? '#c6ff2e' : '#ff2e6e'; var bigT = st === 'won' ? (B.tut0 ? T('tutDone') : T('clearedBig', { n: B.n })) : T('lostBig'); ctx.strokeText(bigT, W / 2, H * .42); ctx.fillText(bigT, W / 2, H * .42);
      ctx.font = '900 ' + Math.round(Math.min(W, H) * .11) + 'px ' + FF(); ctx.fillStyle = '#ffd23f'; if (st === 'won') { ctx.strokeText('★'.repeat(B.stars) + '☆'.repeat(3 - B.stars), W / 2, H * .53); ctx.fillText('★'.repeat(B.stars) + '☆'.repeat(3 - B.stars), W / 2, H * .53); }
      ctx.font = '800 ' + Math.round(Math.min(W, H) * .05) + 'px ' + FF(); ctx.fillStyle = '#fff'; var msg = st === 'won' ? T('nextSoon', { ms: B.avg }) : T('tapRetry'), my = Math.min(H - 30, GY + SC * 9); ctx.strokeText(msg, W / 2, my); ctx.fillText(msg, W / 2, my); ctx.textAlign = 'left'; return; }
    tickAttacks(now); if (B.over) return; tickRun(now); if (B.over) return; st = B.state;
    if (st === 'wait' && now >= B.tSig) signal(now);
    if (st === 'count' && now - B.cntT > 380) { B.cntN++; B.cntT = now; SFX.bip();
      if (B.cntN >= B.cnt) { B.state = 'go'; B.tSig = now; B.tEnd = now + (P.to || B.g.to) * B.hs.win; B.flash = 1; B.flashCol = '198,255,46'; vib(25); B.bubble = (B.cnt === 2 ? T('two') : T('three')) + ' ' + T('cueBoop'); B.bubbleWho = 'gabip'; B.bubbleT = now; burst(B.heroX, GY - SC * 9, B.hs.aura, 26); }
      else { B.flash = .5; B.flashCol = '255,210,63'; B.bubble = T('two'); B.bubbleWho = 'gabip'; B.bubbleT = now; } }
    var gm = chalMs(); if (gm && st === 'go' && !B.ghostShown && now - B.tSig >= gm) { B.ghostShown = true; B.ghostT = now; AUDIO.sfx.ghost(); fx.push({ t: now, x: B.heroX + SC * 4, y: GY - SC * 18, txt: '👻 ' + gm + 'ms', sub: T('ghostSub'), col: '#7fe7ff' }); }
    if (st === 'fakesig' && now - B.tSig > (B.tut ? 1700 : 650)) { AUDIO.sfx.phew(); B.fake = false; B.state = 'wait'; B.t0 = now - 500; B.tSig = now + 400 + Math.random() * 900; AUDIO.musicState('wait'); B.bubble = pick(GABIP_LINES.phew); B.bubbleWho = 'gabip'; B.bubbleT = now; say('gabip', B.bubble, { rate: 1.2 }); }
    if (st === 'wait' && B.holding && !B.heldSaid && now - B.holdT > 1300) { B.heldSaid = true; B.bubble = pick(GABIP_LINES.hold); B.bubbleWho = 'gabip'; B.bubbleT = now; }
    if (st === 'go' && now > B.tEnd) { if (B.mech === 'double' && B.taps === 1) hit(Math.round(B.tap1 - B.tSig), 0.4, T('missOneLbl')); else hurt(B.mech === 'spot' ? T('spotGone') : T('asleep'), now, 'gabip', 'whiff'); }
    if (B.g.dim && (st === 'wait')) B.dim = Math.min(.7, (now - B.t0) / 2200); else B.dim = Math.max(0, B.dim - .05);
    if (B.spot && st === 'go') B.spot.r = B.spot.r0 * (1 - 0.65 * Math.min(1, (now - B.tSig) / (B.tEnd - B.tSig)));

    drawBg(ctx, B.w, W, H, t, GY);
    var hx = W * 0.3, ex = W * 0.7, bob = Math.sin(t * 5) * 2;
    if (st === 'hit') { var k = Math.min(1, (now - B.t0) / 160); hx += (ex - hx - SC * 12) * (k < .5 ? k * 2 : (1 - k) * 2) * .9; }
    if (st === 'hurt') { var k2 = Math.min(1, (now - B.t0) / 200); ex -= (ex - hx - SC * 12) * (k2 < .5 ? k2 * 2 : (1 - k2) * 2) * .9; }
    B.heroX = hx; B.enemyX = ex;
    var shake = B.shake > 0 ? (Math.random() - .5) * 12 * B.shake : 0; B.shake = Math.max(0, B.shake - .06 * dt);
    B.zoom = B.zoom * Math.pow(.86, dt); var zf = 1 + Math.abs(B.zoom) * .035;
    ctx.save(); ctx.translate(W / 2, GY); ctx.scale(zf, zf); ctx.translate(-W / 2, -GY); ctx.translate(shake, shake * .5);
    /* aura while waiting; much bigger while holding */
    var auraI = st === 'wait' ? Math.min(1, (now - B.t0) / 1200) : st === 'go' ? 1 : 0;
    if (B.holding) auraI = Math.min(1.8, 1 + (now - B.holdT) / 900);
    if (auraI > 0) { for (var i = 0; i < 3; i++) if (Math.random() < auraI) parts.push({ x: hx + SC * 7 + (Math.random() - .5) * SC * 14 * auraI, y: GY - Math.random() * SC * 4, vx: (Math.random() - .5), vy: -2 - Math.random() * 3 * auraI, life: 1, col: Math.random() < .5 ? B.hs.aura : B.hs.aura2, sz: 2 + Math.random() * 4 * auraI });
      var rg = ctx.createRadialGradient(hx + SC * 7, GY - SC * 8, 4, hx + SC * 7, GY - SC * 8, SC * 16 * auraI); rg.addColorStop(0, hexA(B.hs.aura, .4 * Math.min(1, auraI))); rg.addColorStop(1, hexA(B.hs.aura, 0)); ctx.fillStyle = rg; ctx.fillRect(hx - SC * 14, GY - SC * 30, SC * 42, SC * 32); }
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(hx + SC * 7, GY + 4, SC * 7, SC * 1.5, 0, 0, 7); ctx.ellipse(ex + SC * 7, GY + 4, SC * 7, SC * 1.5, 0, 0, 7); ctx.fill();
    /* ---- hero animation ---- */
    var ha = { sx: 1 + Math.sin(t * 6) * .025, sy: 1 - Math.sin(t * 6) * .025, dy: 0, rot: 0, dx: 0 }, ent = B.entT ? (now - B.entT) / 1000 : 9;
    if (ent < .6) { var ek = 1 - Math.pow(1 - ent / .6, 3); ha.dx = -(1 - ek) * W * .45; ha.dy = -Math.abs(Math.sin(ent * 20)) * SC * 3 * (1 - ek); if (ent > .5 && ent < .55) for (var di = 0; di < 4; di++) parts.push({ x: hx + SC * 7, y: GY, vx: (Math.random() - .5) * 6, vy: -1 - Math.random(), life: .8, col: 'rgba(200,200,200,.7)', sz: 5 }); }
    if (B.holding) { var hk = Math.min(1, (now - B.holdT) / 900); ha.sy = .9 - hk * .06 + Math.sin(t * 40) * .02 * hk; ha.sx = 1.08 + hk * .08; ha.dx = Math.sin(t * 50) * 2 * hk; }
    if (st === 'go' && now - B.tSig < 110 && !B.holding) { ha.sy = .86; ha.sx = 1.12; }
    if (st === 'hit') { var kh = Math.min(1, (now - B.t0) / 160), peak = kh < .5 ? kh * 2 : (1 - kh) * 2; ha.sx = 1 + peak * .3; ha.sy = 1 - peak * .15; ha.rot = -peak * .12; }
    if (st === 'hurt') { var ku = Math.min(1, (now - B.t0) / 450); ha.dx = -Math.sin(ku * Math.PI) * SC * 6; ha.rot = -Math.sin(ku * Math.PI) * .35; ha.sy = 1 - Math.sin(ku * Math.PI) * .22; ha.sx = 1 + Math.sin(ku * Math.PI) * .15; }
    ha.key = HERO; ha.pose = st === 'hit' ? 'attack' : st === 'hurt' ? 'hurt' : 'idle';
    drawActor(HERO, hx, GY, SC, false, null, ha);
    if (now - B.ghostT < 380) { var gk = (now - B.ghostT) / 380; ctx.globalAlpha = .45 * (1 - gk); drawActor(HERO, hx + SC * 9 * Math.sin(gk * Math.PI), GY, SC, false, { k: '#7fe7ff', s: '#7fe7ff', g: '#7fe7ff', d: '#7fe7ff', p: '#7fe7ff', o: '#7fe7ff', y: '#7fe7ff', w: '#fff', e: '#7fe7ff', n: '#7fe7ff', r: '#7fe7ff', b: '#7fe7ff', c: '#7fe7ff', h: '#7fe7ff', m: '#7fe7ff', q: '#7fe7ff', x: '#7fe7ff', G: '#7fe7ff' }, { sx: 1.25, sy: .9 }); ctx.globalAlpha = 1; }
    if (st === 'hurt' && now - B.t0 < 600) { ctx.fillStyle = '#ff2e6e'; ctx.font = '900 ' + SC * 5 + 'px ' + FF(); ctx.fillText('!', hx + SC * 8, GY - SC * 20 - Math.sin((now - B.t0) / 100) * 4); }
    /* ---- enemy animation ---- */
    var esc = B.g.phases ? SC + 3 : B.e.boss ? SC + 1 : SC, ex0 = ex - (esc - SC) * 7, es = B.e.spr, low = B.hp / B.max < .3;
    var ea = { sx: 1, sy: 1, dy: 0, rot: 0, dx: 0 };
    if (es === 'traului' || es === 'thienbinh' || es === 'lytruong') { ea.sy = 1 + Math.sin(t * 2.2) * .05; ea.sx = 1 - Math.sin(t * 2.2) * .03; }
    else if (es === 'vitgia') { ea.rot = Math.sin(t * 7) * .09; ea.dy = -Math.abs(Math.sin(t * 7)) * SC * .6; }
    else if (es === 'canhcut' || es === 'khilua') { var hop = (t * (es === 'khilua' ? 2.2 : 1.1)) % 1; ea.dy = -Math.max(0, Math.sin(hop * Math.PI)) * SC * (es === 'khilua' ? 4 : 2.5); ea.sy = hop < .1 ? .9 : 1; }
    else if (es === 'nguoituyet') { ea.dx = Math.sin(t * 30) * 1.5; ea.rot = Math.sin(t * 30) * .02; }
    else if (es === 'cao') { ea.rot = Math.sin(t * 2.5) * .06; ea.dx = Math.sin(t * 2.5) * SC * .8; }
    else if (es === 'tiennu') { ea.rot = -.12 + Math.sin(t * 3) * .04; }
    else if (es === 'hoalong') { ea.sx = 1 + Math.sin(t * 3) * .05; ea.sy = 1 + Math.sin(t * 3 + 1) * .05; }
    else if (es === 'rua') { ea.dy = Math.sin(t * 1.2) * SC * .5; }
    else if (es === 'bangvuong') { ea.dx = Math.sin(t * 1.5) * SC; ea.sy = 1 + Math.sin(t * 1.5) * .03; }
    else if (es === 'ganuong') { ea.rot = Math.sin(t * 5) * .08; }
    else { ea.sy = 1 + Math.sin(t * 5 + 1) * .035; ea.sx = 1 - Math.sin(t * 5 + 1) * .02; }
    if (low && st === 'wait') { ea.dx += Math.sin(t * 45) * 2; if (Math.random() < .08) parts.push({ x: ex0 + esc * 7 + (Math.random() - .5) * esc * 6, y: GY - esc * 15, vx: 0, vy: 1, life: .9, col: '#7fe7ff', sz: 3, grav: .2 }); }
    if (st === 'hit') { var kk = Math.min(1, (now - B.t0) / 420), kb = Math.sin(kk * Math.PI); ea.dx += kb * SC * 7; ea.rot += kb * .4; ea.sx = kk < .25 ? 1.25 : 1 - kb * .15; ea.sy = kk < .25 ? .75 : 1 + kb * .15; }
    if (st === 'hurt') { var k3 = Math.min(1, (now - B.t0) / 200), pk = k3 < .5 ? k3 * 2 : (1 - k3) * 2; ea.sx = 1 + pk * .3; ea.sy = 1 - pk * .15; ea.rot = pk * .15; }
    if (st === 'fakesig') { ea.dy = -Math.abs(Math.sin((now - B.tSig) / 60)) * SC * 2; ea.rot = Math.sin((now - B.tSig) / 60) * .2; }
    var ca = curAtk();
    if (ca) { var ak = Math.min(1, (now - ca.at) / ca.tel); ea.dx += ak * SC * 3 + Math.sin(now / 40) * ak * 3; ea.rot += -.08 - ak * .18; ea.sy = 1 + ak * .08; ea.sx = 1 - ak * .05; if (ak > .82) ea.dx -= (ak - .82) / .18 * SC * 16; }
    if (now - B.parryT < 320) { var pk2 = 1 - (now - B.parryT) / 320; ea.dx += pk2 * SC * 6; ea.rot += pk2 * .3; ea.sx = 1 + pk2 * .2; ea.sy = 1 - pk2 * .12; }
    var eswap = B.eswap; if (st === 'hit' && now - B.t0 < 120) eswap = { k: '#fff', s: '#fff', g: '#fff', d: '#fff', p: '#fff', o: '#fff', y: '#fff', w: '#fff', e: '#fff', n: '#fff', r: '#fff', b: '#fff', c: '#fff', h: '#fff', m: '#fff', q: '#fff', x: '#fff', G: '#fff' };
    ea.key = B.g.e; ea.pose = st === 'hit' ? 'hurt' : (ca && (now - ca.at) / ca.tel > .55) || st === 'hurt' ? 'attack' : 'idle';
    drawActor(B.e.spr, ex0, GY, esc, true, eswap, ea);
    if (ca) { var ak2 = Math.min(1, (now - ca.at) / ca.tel), ax = ex0 + esc * 7, ay = GY - esc * 22 - SC * 2 + (ca.feint ? Math.sin(now / 35) * 5 : 0), asz = SC * (3.2 + ak2 * 1.6); B.arrowPos = { x: ax, y: ay, r: asz * 2.2 }; ctx.save(); ctx.translate(ax, ay); ctx.rotate(ca.dir === 'L' ? Math.PI : ca.dir === 'R' ? 0 : -Math.PI / 2); if (ca.feint) ctx.rotate(Math.sin(now / 50) * .25);
      ctx.fillStyle = ca.feint ? '#ff5fa2' : (ak2 > .8 ? '#ff2e6e' : '#ffd23f'); ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-asz, -asz * .45); ctx.lineTo(asz * .2, -asz * .45); ctx.lineTo(asz * .2, -asz * .9); ctx.lineTo(asz * 1.1, 0); ctx.lineTo(asz * .2, asz * .9); ctx.lineTo(asz * .2, asz * .45); ctx.lineTo(-asz, asz * .45); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      if (B.tut0 && !ca.feint) { var hk = (now / 500) % 1, hdx = ca.dir === 'L' ? -1 : ca.dir === 'R' ? 1 : 0, hdy = ca.dir === 'U' ? -1 : 0; ctx.font = '900 ' + SC * 5 + 'px ' + FF(); ctx.textAlign = 'center'; ctx.fillText('👆', hx + SC * 7 + hdx * hk * SC * 12, GY - SC * 6 + hdy * hk * SC * 12); ctx.textAlign = 'left'; }
      if (ca.feint) { ctx.fillStyle = '#ff5fa2'; ctx.font = '900 ' + SC * 4 + 'px ' + FF(); ctx.textAlign = 'center'; ctx.strokeText('?', ax, ay - asz * 1.1); ctx.fillText('?', ax, ay - asz * 1.1); ctx.textAlign = 'left'; }
      ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '800 ' + Math.round(SC * 2.2) + 'px ' + FF(); ctx.textAlign = 'center'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 3; var shw = ctx.measureText(T('swipeHint')).width / 2, shx = Math.max(8 + shw, Math.min(W - 8 - shw, ax)); ctx.strokeText(T('swipeHint'), shx, ay + asz * 1.6); ctx.fillText(T('swipeHint'), shx, ay + asz * 1.6); ctx.textAlign = 'left'; }
    if (!ca) B.arrowPos = null;
    if (B.combo > 0) { ctx.fillStyle = '#7fe7ff'; ctx.font = '900 ' + Math.round(SC * 2.8) + 'px ' + FF(); ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 4; ctx.strokeText(T('comboLbl', { n: B.combo }), hx, GY + SC * 5.5); ctx.fillText(T('comboLbl', { n: B.combo }), hx, GY + SC * 5.5); }
    if ((B.e.spr === 'traului' || B.e.spr === 'thienbinh') && st === 'wait') { ctx.fillStyle = '#fff'; ctx.font = '900 ' + SC * 3 + 'px ' + FF(); ctx.fillText('z', ex + SC * 2, GY - SC * 16 - (t % 1) * 20); }
    /* referee */
    var rx = W / 2 - SC * 4, ry = Math.max(GY - SC * 22, 120);
    var csc = Math.max(3, SC - 2), cry = ry + Math.sin(t * 8) * 1 - (st === 'go' && now - B.tSig < 300 ? Math.sin((now - B.tSig) / 300 * Math.PI) * SC * 4 : 0), flap = (st === 'go' && now - B.tSig < 500) ? Math.sin(t * 60) : Math.sin(t * 3) * .3;
    ctx.fillStyle = '#ffd23f'; ctx.fillRect(rx - csc * 1.5, cry - csc * 8 + flap * csc * 2, csc * 2, csc * 1.2); ctx.fillRect(rx + csc * 13.5, cry - csc * 8 + flap * csc * 2, csc * 2, csc * 1.2);
    drawActor('gabip', rx, cry, csc, false, null, { sx: 1 + (st === 'go' ? Math.sin(t * 60) * .1 : 0), key: 'gabip' });
    if (st === 'go' && now - B.tSig < 200 && Math.random() < .5) parts.push({ x: rx + csc * 7, y: cry - csc * 8, vx: (Math.random() - .5) * 6, vy: -1 + Math.random() * 2, life: 1, col: '#ffd23f', sz: 4, grav: .15 });
    /* particles */
    for (i = parts.length - 1; i >= 0; i--) { var p = parts[i]; p.x += p.vx * dt; p.y += p.vy * dt; if (p.grav) p.vy += p.grav * dt; p.life -= (p.w ? .08 : .03) * dt; if (p.life <= 0) { parts.splice(i, 1); continue; } ctx.globalAlpha = Math.min(1, p.life); ctx.fillStyle = p.col;
      if (p.w) ctx.fillRect(p.x, p.y, p.w, p.sz); else if (p.star) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.life * 6); ctx.fillRect(-p.sz / 2, -p.sz / 6, p.sz, p.sz / 3); ctx.fillRect(-p.sz / 6, -p.sz / 2, p.sz / 3, p.sz); ctx.restore(); } else ctx.fillRect(p.x, p.y, p.sz, p.sz); } ctx.globalAlpha = 1;
    ctx.restore();
    /* smoke (world 4/5) */
    if (B.smokeA > 0) { var sa = B.smokeA * (st === 'go' || st === 'hit' ? 0.85 : 1); ctx.fillStyle = 'rgba(40,20,30,' + (sa * .3) + ')'; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = sa * .55; for (i = 0; i < smoke.length; i++) { var s = smoke[i]; s.x += s.v * .004 * dt; if (s.x < -.3) s.x = 1.3; if (s.x > 1.3) s.x = -.3; var sr = s.r * Math.min(W, H); ctx.drawImage(puff, s.x * W - sr, s.y * H - sr, sr * 2, sr * 2); } ctx.globalAlpha = 1; }
    /* spot */
    if (B.spot && st === 'go') { var sp = B.spot, g2 = ctx.createRadialGradient(sp.x, sp.y, sp.r * .2, sp.x, sp.y, sp.r); g2.addColorStop(0, 'rgba(255,255,220,.95)'); g2.addColorStop(.7, 'rgba(198,255,46,.6)'); g2.addColorStop(1, 'rgba(198,255,46,0)'); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r, 0, 7); ctx.fill(); ctx.strokeStyle = '#c6ff2e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r, 0, 7); ctx.stroke(); ctx.fillStyle = '#1a1026'; ctx.font = '900 ' + Math.round(sp.r * .5) + 'px ' + FF(); ctx.textAlign = 'center'; ctx.fillText('BỤP', sp.x, sp.y + sp.r * .18); ctx.textAlign = 'left'; }
    /* bubbles + floating text drawn above smoke */
    if (B.bubble && now - B.bubbleT < 1600 && now >= B.bubbleT) bubble(B.bubbleWho === 'gabip' ? rx + SC * 5 : B.bubbleWho === HERO ? hx + SC * 7 : ex + SC * 7, B.bubbleWho === 'gabip' ? ry - SC * 14 : (B.arrowPos && B.bubbleWho !== HERO ? B.arrowPos.y - B.arrowPos.r - SC * 1.5 : GY - SC * 19), B.bubble, (B.bubbleWho === 'vitgia' || B.bubbleWho === 'cao' || B.bubbleWho === 'bangvuong') && st === 'fakesig' ? '#ff2e6e' : /BÍP|THẢ|BEEP|RELEASE|哔|放/.test(B.bubble) ? '#5a8f00' : '#fff');
    for (i = fx.length - 1; i >= 0; i--) { var f = fx[i], age = (now - f.t) / 1000; if (age < 0) continue; if (age > 1.4) { fx.splice(i, 1); continue; } ctx.globalAlpha = Math.min(1, 1.6 - age); ctx.fillStyle = f.col; ctx.font = '900 ' + Math.round(SC * 4.2) + 'px ' + FF(); ctx.textAlign = 'center'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 5; ctx.strokeText(f.txt, f.x + SC * 7, f.y - age * 50); ctx.fillText(f.txt, f.x + SC * 7, f.y - age * 50); ctx.font = '800 ' + Math.round(SC * 2.4) + 'px ' + FF(); ctx.fillStyle = '#fff'; ctx.strokeText(f.sub, f.x + SC * 7, f.y - age * 50 + SC * 3); ctx.fillText(f.sub, f.x + SC * 7, f.y - age * 50 + SC * 3); ctx.textAlign = 'left'; } ctx.globalAlpha = 1;
    if (B.dim > 0) { ctx.fillStyle = 'rgba(5,3,20,' + B.dim + ')'; ctx.fillRect(0, 0, W, H); if (B.dim > .3) { ctx.fillStyle = 'rgba(255,255,255,' + (B.dim - .3) + ')'; ctx.font = '800 16px ' + FF(); ctx.textAlign = 'center'; ctx.fillText(T('dimHint'), W / 2, H * .5); ctx.textAlign = 'left'; } }
    /* big cue text */
    ctx.textAlign = 'center'; ctx.font = '900 ' + Math.round(Math.min(W, H) * (B.mech === 'double' ? .12 : .16)) + 'px ' + FF(); ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 8;
    if (st === 'go') { var cue = B.mech === 'double' ? (B.taps ? T('cueAgain') : T('cueDouble')) : B.mech === 'hold' && B.holding ? T('cueRelease') : B.mech === 'spot' ? T('cueSpot') : B.mech === 'reverse' ? T('cueRev') : T('cueBoop'); var cfs = Math.round(Math.min(W, H) * (B.mech === 'reverse' ? .11 : B.mech === 'double' ? .12 : .16)); ctx.font = '900 ' + cfs + 'px ' + FF(); var cw = ctx.measureText(cue).width; if (cw > W - 20) ctx.font = '900 ' + Math.floor(cfs * (W - 20) / cw) + 'px ' + FF(); ctx.fillStyle = '#c6ff2e'; ctx.strokeText(cue, W / 2, H * .86); ctx.fillText(cue, W / 2, H * .86); }
    else if (st === 'count') { ctx.fillStyle = '#ffd23f'; ctx.strokeText(String(B.cntN), W / 2, H * .86); ctx.fillText(String(B.cntN), W / 2, H * .86); }
    else if (st === 'fakesig' && B.tut) { ctx.fillStyle = '#ff2e6e'; ctx.font = '900 ' + Math.round(Math.min(W, H) * .12) + 'px ' + FF(); ctx.strokeText(T('tutBig'), W / 2, H * .86); ctx.fillText(T('tutBig'), W / 2, H * .86); ctx.font = '800 ' + Math.round(Math.min(W, H) * .045) + 'px ' + FF(); ctx.fillStyle = '#fff'; ctx.strokeText(T('tutHint'), W / 2, H * .92); ctx.fillText(T('tutHint'), W / 2, H * .92); }
    else if (st === 'fakesig') { var dc = B.mech === 'reverse' ? T('cueRevFreeze') : T('cueDont'); if (B.mech === 'reverse') ctx.font = '900 ' + Math.round(Math.min(W, H) * .11) + 'px ' + FF(); ctx.fillStyle = '#ff2e6e'; ctx.strokeText(dc, W / 2, H * .86); ctx.fillText(dc, W / 2, H * .86); }
    else if (st === 'wait' || st === 'ready') { ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '800 ' + Math.round(Math.min(W, H) * .05) + 'px ' + FF(); var hint = B.mech === 'hold' ? (B.holding ? T('hintHolding') : T('hintHold')) : B.mech === 'double' ? T('hintDouble') : B.mech === 'spot' ? T('hintSpot') : B.mech === 'reverse' ? T('hintRev') : B.mech === 'count' ? T('hintCount') : (gm ? T('hintGhost', { ms: gm }) : (B.holding ? T('hintBet') : T('hintWait'))); var hw = ctx.measureText(hint).width; if (hw > W - 24) ctx.font = '800 ' + Math.round(Math.min(W, H) * .05 * (W - 24) / hw) + 'px ' + FF(); ctx.strokeText(hint, W / 2, H * .86); ctx.fillText(hint, W / 2, H * .86); }
    ctx.textAlign = 'left';
    if (B.flash > 0) { ctx.fillStyle = 'rgba(' + B.flashCol + ',' + (B.flash * .55) + ')'; ctx.fillRect(0, 0, W, H); B.flash -= .08 * dt; }
  }
  function drawActor(name, x, y, sc, flip, swap, a){
    var sz = spriteSize(name), w = sz.w * sc, cx = x + w / 2, im = a.key && typeof ASSETS !== 'undefined' ? ASSETS.sprite(a.key, a.pose) : null;
    ctx.save(); ctx.translate(cx + (a.dx || 0), y + (a.dy || 0)); ctx.rotate(a.rot || 0); ctx.scale(a.sx || 1, a.sy || 1);
    if (im) { var ih = sc * 19, iw = im.width * ih / im.height, src = swap && swap.k === '#fff' ? tintImg(im, '#fff') : im; ctx.drawImage(src, -iw / 2, -ih, iw, ih); }
    else drawSprite(ctx, name, -w / 2, 0, sc, flip, swap);
    ctx.restore();
  }
  var tintCache = {};
  function tintImg(im, col){ var k = im.src + col, c = tintCache[k]; if (c) return c; c = document.createElement('canvas'); c.width = im.width; c.height = im.height; var g = c.getContext('2d'); g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); tintCache[k] = c; return c; }
  function hexA(h, a){ var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function bubble(x, y, text, col){
    var bf = Math.round(SC * 2.6); ctx.font = '900 ' + bf + 'px ' + FF(); var maxW = W - 40, lines = wrapText(text, maxW), lh = bf * 1.2;
    if (lines.length > 3) { bf = Math.max(12, Math.floor(bf * .82)); ctx.font = '900 ' + bf + 'px ' + FF(); lines = wrapText(text, maxW).slice(0, 3); lh = bf * 1.2; }
    var tw = 0; for (var li = 0; li < lines.length; li++) tw = Math.max(tw, ctx.measureText(lines[li]).width); tw += 24; var bh = SC * 1.6 + lh * lines.length, bx = Math.max(8, Math.min(W - tw - 8, x - tw / 2));
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, y - bh, tw, bh, 10) : ctx.rect(bx, y - bh, tw, bh); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.lineTo(x, y + 8); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col === '#fff' ? '#1a1026' : col; ctx.textAlign = 'center'; for (var lj = 0; lj < lines.length; lj++) ctx.fillText(lines[lj], bx + tw / 2, y - bh + SC * .8 + lh * (lj + .8)); ctx.textAlign = 'left';
  }
  function wrapText(text, maxW){ var words = String(text).split(' '), out = [], cur = ''; for (var i = 0; i < words.length; i++) { var t = cur ? cur + ' ' + words[i] : words[i]; if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = words[i]; } else cur = t; } if (cur) out.push(cur); return out; }

  /* ---------- result ---------- */
  var last = null;
  function showResult(won, stars, avg){
    var all = save.hits, r = rankOf(avgOf(all) || 9999);
    last = { won: won, stars: stars, avg: avg, gate: B.n, rank: r, practice: B.practice, daily: B.daily };
    $('res-stars').textContent = won ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '💀';
    var vs = '';
    if (challenge && challenge.gate === B.n) vs = won ? (avg < challenge.ms ? T('vsWin', { a: avg, b: challenge.ms }) : T('vsLose', { b: challenge.ms })) : T('vsStill');
    var newHero = won && !B.practice && Object.keys(HEROES).filter(function(k){ return HEROES[k].unlock === B.n; })[0];
    var dailyVs = ''; if (challenge && challenge.daily && B.daily === challenge.daily) dailyVs = won ? (avg < challenge.ms ? T('vsWin', { a: avg, b: challenge.ms }) : T('vsLose2', { b: challenge.ms })) : T('vsStill');
    if (B.run) { $('res-title').textContent = T('resRun', { s: B.run.score }); $('res-sub').textContent = T('subRun', { k: B.run.kills, c: B.bestCombo, b: save.runBest || 0 }) + (B.run.newBest ? T('newBest') : ''); $('btn-next').hidden = true; $('btn-practice').hidden = true; last = { won: true, stars: 0, avg: avg, gate: B.n, rank: r, run: B.run.score }; drawCard(true, 0, avg, r); try { $('btn-img').href = $('res-card').toDataURL('image/png'); } catch (e) {} $('btn-fb').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(SHARE_URL) + '&quote=' + encodeURIComponent(shareText()); show('s-result'); return; }
    $('res-title').textContent = B.daily ? T(won ? 'resDailyWon' : 'resDailyLost', { d: dayLabel(B.daily) }) : B.practice ? T(won ? 'resPracWon' : 'resPracLost') : won ? (B.n === GATES.length ? T('resFinal') : B.e.boss ? T('resBoss', { e: B.ename.toUpperCase() }) : T('resWon', { g: gateName(B.n).toUpperCase() })) : T('resLost', { e: B.ename.toUpperCase() });
    $('res-sub').textContent = B.daily ? (T('subDaily', { ms: avg || '?' }) + (B.dailyFirst ? T('subDailyFirst') : T('subDailyReplay', { f: save.daily.won ? save.daily.avg + 'ms' : T('subLost') })) + (save.dstreak > 1 ? T('subStreak', { n: save.dstreak }) : '') + dailyVs + T('subTomorrow')) : (won ? (WIN_LINES[B.n] || T('subAvg', { ms: avg }) + (stars === 3 ? T('subPerfect') : stars === 2 ? T('sub2') : T('sub1'))) : pick(ENEMY_WIN_LINES) + (avg ? T('subYourMs', { ms: avg }) : '')) + vs + (newHero ? T('newHero', { h: HEROES[newHero].name }) : '');
    if (newHero) AUDIO.sfx.unlock();
    $('btn-next').hidden = !won || B.practice || B.daily || B.n >= GATES.length || B.n + 1 > save.unlocked; $('btn-next').textContent = T('nextN', { n: B.n + 1 });
    $('btn-practice').hidden = !(B.e.boss && (!won || B.practice));
    drawCard(won, stars, avg, r);
    try { $('btn-img').href = $('res-card').toDataURL('image/png'); } catch (e) {}
    var url = shareUrl();
    $('btn-fb').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(shareText());
    show('s-result');
  }
  function shareUrl(){ var l = last; return SHARE_URL + (l.daily ? '#d' + l.daily + '-' : '#c' + l.gate + '-') + (l.avg || 999); }
  function shareText(){ var l = last; if (l.run !== undefined) return T('shareRun', { s: l.run, u: SHARE_URL }); if (l.daily) return T('shareDaily', { d: dayLabel(l.daily), r: l.won ? ' ✅ ' + l.avg + 'ms' : ' ❌', s: save.dstreak > 1 ? T('subStreak', { n: save.dstreak }) : '', u: shareUrl() }); return T('shareGate', { g: gateName(l.gate), r: l.won ? ' ✅ ' + '★'.repeat(l.stars) : ' ❌', h: HEROES[HERO].name, ms: l.avg || '?', rk: l.rank[1] + ' ' + l.rank[2], u: shareUrl() }); }
  function drawCard(won, stars, avg, r){
    var c = $('res-card'), x = c.getContext('2d'), w = c.width, h = c.height, gy = Math.floor(h * .72), ff = FF();
    drawBg(x, B.w, w, h, 3, gy);
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0, 0, w, h);
    drawSprite(x, HERO, w * .12, gy, 12, false);
    drawSprite(x, B.e.spr, w * .62, gy, 12, true, won ? { k: '#333', s: '#777', g: '#777', d: '#666', p: '#777', o: '#777', y: '#888', w: '#999', e: '#777', n: '#666', r: '#777', b: '#777', c: '#888', h: '#555', m: '#777', q: '#777', x: '#777', G: '#666' } : B.eswap);
    if (won) { x.fillStyle = '#ff2e6e'; x.font = '900 60px ' + ff; x.save(); x.translate(w * .72, gy - 110); x.rotate(-.3); x.fillText(T('ko'), 0, 0); x.restore(); }
    var en = I18N.lang === 'en';
    x.fillStyle = '#ffd23f'; x.font = '900 ' + (en ? 30 : 54) + 'px ' + ff; x.fillText(T('brand'), 40, en ? 62 : 70); x.fillStyle = '#fff'; x.font = '800 ' + (en ? 15 : 22) + 'px ' + ff; x.fillText(T('brandSub'), 44, en ? 88 : 98);
    x.textAlign = 'right'; x.font = '900 ' + (en ? 26 : 34) + 'px ' + ff; x.fillText(B.run ? T('cardRun', { s: B.run.score }) : B.daily ? T('cardDaily', { d: dayLabel(B.daily) }) : gateName(B.n), w - 40, 64); x.font = '800 20px ' + ff; x.fillStyle = '#c6ff2e'; x.fillText(B.e.boss ? T('cardBoss', { e: B.ename }) : T('cardVs', { e: B.ename }), w - 40, 94); x.textAlign = 'left';
    x.fillStyle = 'rgba(11,11,22,.85)'; x.fillRect(0, h - 120, w, 120);
    x.fillStyle = won ? '#c6ff2e' : '#ff2e6e'; x.font = '900 44px ' + ff; x.fillText(won ? '★'.repeat(stars) + '☆'.repeat(3 - stars) + '  ' + (avg || '?') + 'ms' : T('cardLost') + (avg ? avg + 'ms' : ''), 40, h - 62);
    x.fillStyle = '#fff'; x.font = '800 24px ' + ff; x.fillText(r[1] + ' ' + r[2] + '  ·  ' + HEROES[HERO].name, 40, h - 24);
    x.textAlign = 'right'; x.fillStyle = '#a7a8c6'; x.font = '800 20px ' + ff; x.fillText(SHARE_URL.replace(/^https?:\/\//, ''), w - 40, h - 24); x.textAlign = 'left';
  }
  $('btn-next').addEventListener('click', function(){ sound(); SFX.click(); challenge = null; startGate(Math.min(GATES.length, last.gate + 1)); });
  $('btn-retry').addEventListener('click', function(){ sound(); SFX.click(); if (last.run !== undefined) startRun(); else if (last.daily) startDaily(last.daily); else startGate(last.gate, { skipDlg: true }); });
  $('btn-practice').addEventListener('click', function(){ sound(); SFX.click(); startGate(last.gate, { practice: true }); });
  $('btn-share').addEventListener('click', function(){ A.ev('share', { g: last.gate, x: 'text' }); copy(shareText(), T('copied')); });
  $('btn-fb').addEventListener('click', function(){ A.ev('share', { g: last.gate, x: 'fb' }); });
  $('btn-link').addEventListener('click', function(){ A.ev('share', { g: last.gate, x: 'link' }); copy(shareUrl(), last.daily ? T('copiedDaily') : T('copiedLink', { n: last.gate })); });
  $('btn-run').addEventListener('click', function(){ sound(); SFX.click(); startRun(); });
  $('btn-daily').addEventListener('click', function(){ sound(); SFX.click(); startDaily(challenge && challenge.daily ? challenge.daily : 0); });
  $('btn-vs').addEventListener('click', function(){ sound(); SFX.click(); if (!window.VERSUS) { toast(T('vsMissing')); return; } show(null); VERSUS.start(); });
  window.__bakhiHome = function(){ dailyBadge(); show('s-title'); };
  dailyBadge();

  (function tl(){ if (!$('s-title').hidden) drawTitle(); requestAnimationFrame(tl); })();
  window.__bakhi = { audio: AUDIO, say: say, startGate: startGate, startDaily: startDaily, startRun: startRun, startTutorial: startTutorial, swipe: function(d){ swipe(d); }, setAtk: function(on){ ATK_OFF = !on; }, plan: function(r){ planAttacks(r || Math.random); }, atk: function(){ return B && curAtk(); }, dailyGate: dailyGate, dayKey: dayKey, get: function(){ return B; }, save: save, signal: function(){ if (B) signal(performance.now()); }, tap: function(x, y){ tapDown(x === undefined ? (B && B.spot ? B.spot.x : W / 2) : x, y === undefined ? (B && B.spot ? B.spot.y : H / 2) : y); }, up: tapUp, setHero: function(k){ HERO = k; } };
})();
