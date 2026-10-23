(function(){
  var SHARE_URL = "https://ba-khi.vercel.app";
  var $ = function(id){ return document.getElementById(id); };
  var cv = $('game'), ctx = cv.getContext('2d'), W = 0, H = 0, DPR = 1, GY = 0, SC = 5;
  var save = { unlocked: 1, stars: {}, best: {}, hits: [], hero: 'tibup', seen: {}, mute: false };
  try { var s0 = JSON.parse(localStorage.getItem('bakhi.save') || 'null'); if (s0 && s0.stars) { save = s0; if (!save.hero) save.hero = 'tibup'; if (!save.seen) save.seen = {}; } } catch (e) {}
  var HERO = HEROES[save.hero] ? save.hero : 'tibup';
  function persist(){ try { localStorage.setItem('bakhi.save', JSON.stringify(save)); } catch (e) {} }
  var challenge = null, m = /^#?c(\d{1,2})-(\d{2,4})$/.exec(location.hash || '');
  if (m && +m[1] >= 1 && +m[1] <= GATES.length) { challenge = { gate: +m[1], ms: +m[2] }; }
  var FF = function(){ return getComputedStyle(document.body).fontFamily; };

  /* ---------- audio (see audio.js) ---------- */
  function sound(){ AUDIO.init(); AUDIO.setMute(!!save.mute); }
  var SFX = { bip: AUDIO.sfx.crow, bip2: AUDIO.sfx.crow2, quack: AUDIO.sfx.quack, bup: AUDIO.sfx.punch, crit: AUDIO.sfx.crit, charge: function(){}, hurt: AUDIO.sfx.hurt, win: AUDIO.sfx.win, lose: AUDIO.sfx.lose, phase: AUDIO.sfx.phase, click: AUDIO.sfx.click };
  function say(who, text, opts){ try { AUDIO.say(who, text, opts); } catch (e) {} }
  function setMuteUI(){ var m = !!save.mute; $('btn-mute').textContent = m ? '🔇' : '🔊'; $('btn-mute2').textContent = m ? '🔇 Đang tắt tiếng' : '🔊 Âm thanh'; }
  function toggleMute(){ save.mute = !save.mute; persist(); sound(); setMuteUI(); if (!save.mute) SFX.click(); }
  $('btn-mute').addEventListener('click', toggleMute); $('btn-mute2').addEventListener('click', toggleMute); setMuteUI();
  function vib(p){ try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

  /* ---------- helpers ---------- */
  function toast(msg){ var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(function(){ t.classList.remove('show'); }, 2400); }
  function copy(text, ok){
    function fallback(){ var ta = $('copyarea'); ta.value = text; ta.style.left = '0'; ta.focus(); ta.select(); var done = false; try { done = document.execCommand('copy'); } catch (e) {} ta.style.left = '-9999px'; toast(done ? ok : 'Không sao chép được, chụp màn hình để khoe nhé'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function(){ toast(ok); }, fallback); else fallback();
  }
  function show(id){ ['s-title', 's-map', 's-result'].forEach(function(s){ $(s).hidden = s !== id; }); }
  function face(canvas, name, swap){ var c = canvas.getContext('2d'); c.clearRect(0, 0, canvas.width, canvas.height); var sz = spriteSize(name); var sc = Math.floor(Math.min(canvas.width / sz.w, canvas.height / sz.h)); drawSprite(c, name, Math.floor((canvas.width - sz.w * sc) / 2), canvas.height - Math.floor((canvas.height - sz.h * sc) / 2), sc, false, swap); }
  function avgOf(arr){ if (!arr.length) return 0; var s = 0; for (var i = 0; i < arr.length; i++) s += arr[i]; return Math.round(s / arr.length); }
  function gateName(n){ return 'Cửa ' + n + ' · ' + WORLDS[GATES[n - 1].w - 1].name; }
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------- resize ---------- */
  function resize(){ DPR = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight; cv.width = Math.floor(W * DPR); cv.height = Math.floor(H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); GY = Math.floor(H * 0.68); SC = Math.max(4, Math.min(10, Math.floor(Math.min(W / 72, H / 110)))); }
  window.addEventListener('resize', resize); resize();

  /* ---------- title ---------- */
  function drawTitle(){
    var c = $('title-canvas'), x = c.getContext('2d'), w = c.width, h = c.height, gy = Math.floor(h * 0.78), t = performance.now() / 1000;
    drawBg(x, WORLDS[0], w, h, t, gy);
    drawSprite(x, HERO, w * 0.26, gy, 7, false);
    drawSprite(x, 'gabip', w * 0.47, gy - 10, 5, false);
    drawSprite(x, 'banoi', w * 0.62, gy, 6, true);
    x.fillStyle = 'rgba(255,210,63,.9)'; x.font = '900 22px ' + FF(); x.fillText('BỤP!', w * 0.36, gy - 125 + Math.sin(t * 4) * 4);
  }
  $('btn-play').addEventListener('click', function(){ sound(); SFX.click(); if (challenge) { startGate(challenge.gate); } else { renderMap(); show('s-map'); } });
  $('btn-story').addEventListener('click', function(){ var s = $('story'); if (s.hidden) { s.innerHTML = STORY.map(function(p){ return '<p>' + p + '</p>'; }).join(''); s.hidden = false; } else s.hidden = true; });
  $('btn-home').addEventListener('click', function(){ show('s-title'); });
  if (challenge) { var cb = $('challenge-banner'); cb.textContent = '🥊 Có người thách bạn ' + gateName(challenge.gate) + ' với phản xạ ' + challenge.ms + 'ms. Vượt được không?'; cb.hidden = false; $('btn-play').textContent = 'NHẬN THÁCH ĐẤU'; }

  /* ---------- map + hero select ---------- */
  function heroUnlocked(k){ return save.unlocked > HEROES[k].unlock; }
  function renderMap(){
    var all = save.hits, avg = avgOf(all), r = rankOf(avg || 9999);
    $('rank-name').textContent = r[1] + ' ' + r[2];
    var totalStars = 0; for (var k in save.stars) totalStars += save.stars[k];
    $('rank-sub').textContent = (all.length ? 'Phản xạ trung bình ' + avg + 'ms · ' : 'Chưa có dữ liệu phản xạ · ') + totalStars + '⭐ · ' + Math.min(save.unlocked - 1, GATES.length) + '/' + GATES.length + ' cửa';
    face($('rank-face'), HERO);
    var hh = '';
    Object.keys(HEROES).forEach(function(k){ var h = HEROES[k], un = heroUnlocked(k); hh += '<button type="button" class="hero' + (k === HERO ? ' on' : '') + (un ? '' : ' lock') + '" data-hero="' + k + '"' + (un ? '' : ' disabled') + '><canvas id="hf-' + k + '" width="42" height="54"></canvas>' + h.name + '<small>' + (un ? h.perk : '🔒 Qua cửa ' + h.unlock) + '</small></button>'; });
    $('heroes').innerHTML = hh;
    Object.keys(HEROES).forEach(function(k){ face($('hf-' + k), k); });
    Array.prototype.forEach.call(document.querySelectorAll('.hero[data-hero]'), function(b){ b.addEventListener('click', function(){ sound(); SFX.click(); HERO = b.getAttribute('data-hero'); save.hero = HERO; persist(); renderMap(); toast(HEROES[HERO].name + ': ' + HEROES[HERO].line); }); });
    var html = '';
    WORLDS.forEach(function(w){
      var first = GATES.findIndex(function(g){ return g.w === w.id; }) + 1, locked = first > save.unlocked;
      html += '<div class="world' + (locked ? ' need' : '') + '"><h3><span>' + w.id + '. ' + w.name + '</span><small>' + (locked ? 'Mở khi qua cửa ' + (first - 1) : w.sub) + '</small></h3><p class="mech">' + w.mech + '</p><div class="gates">';
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
  function startGate(n, opt){
    opt = opt || {};
    var g = GATES[n - 1], e = ENEMIES[g.e], w = WORLDS[g.w - 1], hs = HEROES[HERO];
    var ph = g.phases ? g.phases[0] : null;
    B = { n: n, g: g, e: e, w: w, hs: hs, practice: !!opt.practice, phase: 1, hp: ph ? ph.hp : g.hp, max: ph ? ph.hp : g.hp, hearts: hs.hearts + (opt.practice ? 2 : 0), forgive: hs.forgive, hits: [], state: 'dialog', t0: performance.now(), tSig: 0, tEnd: 0,
      fake: false, mech: 'normal', flash: 0, flashCol: '', dim: 0, heroX: 0, enemyX: 0, shake: 0, bubble: null, bubbleT: 0, over: false, dlg: (DIALOG[n] || []).slice(), round: 0,
      holding: false, holdT: 0, taps: 0, tap1: 0, spot: null, smokeA: g.smoke || 0 };
    B.streak = 0; B.introLine = !DIALOG[n] || opt.skipDlg || save.seen[n];
    if (!DIALOG[n] || opt.skipDlg || save.seen[n]) B.dlg = [];
    if (opt.practice) B.dlg = [{ who: 'gabip', name: 'Gà Bíp', text: 'Luyện tập: 5 tim, không tính sao, không mở cửa. Tập cho quen tay rồi đánh thật.' }];
    if (n <= 2) B.forgive = Math.max(B.forgive, 1);
    AUDIO.musicStart(g.w, !!e.boss, g.phases ? 1 : 0);
    parts = []; fx = []; smoke = []; for (var i = 0; i < 14; i++) smoke.push({ x: Math.random(), y: Math.random(), r: .18 + Math.random() * .25, v: (.01 + Math.random() * .02) * (Math.random() < .5 ? 1 : -1) });
    $('hud-gate').textContent = gateName(n) + (e.boss ? ' · TRÙM' : '') + (B.practice ? ' · LUYỆN' : '');
    $('hud-enemy').textContent = e.name; $('hud-hero').textContent = hs.name;
    updateHud(); show(null); $('hud').hidden = false;
    nextDialog();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function curP(){ return B.g.phases ? B.g.phases[B.phase - 1] : B.g; }
  function updateHud(){ var mh = B.hs.hearts + (B.practice ? 2 : 0); $('hud-hearts').textContent = '❤️'.repeat(Math.max(0, B.hearts)) + '🖤'.repeat(Math.max(0, mh - B.hearts)); $('hud-ehp').style.width = Math.max(0, B.hp / B.max * 100) + '%'; $('hud-enemy').textContent = B.e.name + (B.g.phases ? ' · hiệp ' + B.phase + '/' + B.g.phases.length : ''); }
  function nextDialog(){
    if (!B.dlg.length) { $('dlg').hidden = true; if (DIALOG[B.n] && !B.practice) { save.seen[B.n] = 1; persist(); } B.state = 'ready'; B.t0 = performance.now(); scheduleRound(); return; }
    var d = B.dlg.shift(); $('dlg').hidden = false; $('dlg-name').textContent = d.name; $('dlg-text').textContent = d.text; face($('dlg-face'), d.who, d.swap); B.state = 'dialog'; say(d.who, d.text);
  }
  $('dlg-box').addEventListener('click', function(){ sound(); SFX.click(); if (B && B.state === 'dialog') nextDialog(); });
  var dlgHold = null;
  $('dlg-box').addEventListener('pointerdown', function(){ clearTimeout(dlgHold); dlgHold = setTimeout(function(){ if (B && B.state === 'dialog') { B.dlg = []; nextDialog(); toast('Đã bỏ qua hội thoại'); } }, 450); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(ev){ $('dlg-box').addEventListener(ev, function(){ clearTimeout(dlgHold); }); });
  function scheduleRound(){
    var P = curP();
    B.round++; B.state = 'wait'; B.t0 = performance.now(); B.holding = false; B.taps = 0; B.spot = null;
    B.fake = Math.random() < (P.fake || 0);
    B.mech = P.mech ? pick(P.mech) : 'normal';
    var span = (B.g.wait[1] - B.g.wait[0]) * Math.pow(0.88, B.streak);
    B.tSig = B.t0 + B.g.wait[0] + Math.max(300, Math.pow(Math.random(), 1.7) * span);
    if (B.introLine && B.round === 1 && !B.practice) { B.bubble = B.e.line; B.bubbleWho = B.e.spr; B.bubbleT = performance.now(); say(B.e.spr, B.e.line, { low: true }); B.tSig += 900; }
    else { B.bubble = B.mech === 'normal' ? pick(['Cục...', 'Cục cục...', 'Hmm...', 'Chờ nhé...']) : ROUND_CALL[B.mech]; B.bubbleWho = 'gabip'; B.bubbleT = performance.now(); }
    if (B.mech === 'double') AUDIO.sfx.callDouble(); else if (B.mech === 'hold') AUDIO.sfx.callHold(); else if (B.mech === 'spot') AUDIO.sfx.callSpot();
    AUDIO.musicState('wait'); if (B.g.dim) AUDIO.pedalStart();
    if (B.tSig - B.t0 > 1500 && Math.random() < .6 && TAUNTS[B.g.e]) { var tl = pick(TAUNTS[B.g.e]); setTimeout(function(){ if (B && B.state === 'wait' && B.tSig - performance.now() > 700) { B.bubble = tl; B.bubbleWho = B.e.spr; B.bubbleT = performance.now(); say(B.e.spr, tl, { low: true, rate: 1.2 }); } }, 650); }
    if (B.g.dim) B.dim = 0;
  }
  function signal(now){
    var P = curP(); B.tSig = now; B.tEnd = now + (P.to || B.g.to) * B.hs.win; AUDIO.musicState('signal'); AUDIO.pedalStop();
    if (B.fake) { B.state = 'fakesig'; B.flash = 1; B.flashCol = '255,46,110'; if (B.g.sneeze) AUDIO.sfx.sneeze(); else SFX.quack(); var bluff = B.g.foxbluff && Math.random() < .5; B.bubble = bluff ? 'BÍP! (tin anh đi)' : (B.g.sneeze ? 'Hắt... XÌ!' : 'CẠC!!'); B.bubbleWho = bluff ? 'cao' : (B.g.sneeze ? 'bangvuong' : 'vitgia'); B.bubbleT = now; return; }
    B.state = 'go'; B.flash = 1; B.flashCol = '198,255,46'; vib(25);
    if (B.mech === 'double') { SFX.bip2(); B.bubble = 'TÁC!! BÍP BÍP!'; }
    else { SFX.bip(); B.bubble = B.mech === 'hold' ? 'THẢ!!' : 'TÁC!! BÍP!'; }
    B.bubbleWho = 'gabip'; B.bubbleT = now;
    if (B.mech === 'spot') { var r = Math.min(W, H) * 0.16 * (B.g.spotR || 1); B.spot = { x: W * (0.15 + Math.random() * 0.7), y: H * (0.22 + Math.random() * 0.5), r0: r, r: r }; }
    burst(B.heroX, GY - SC * 9, B.hs.aura, 26);
  }
  function dmgFor(ms){ return ms < 180 ? 45 : ms < 250 ? 35 : ms < 320 ? 25 : ms < 450 ? 15 : 8; }
  function hit(ms, mult, label){
    var now = performance.now(), dmg = Math.round(dmgFor(ms) * mult * B.hs.dmg);
    B.hits.push(ms); if (!B.practice) { save.hits.push(ms); if (save.hits.length > 60) save.hits.shift(); }
    B.hp -= dmg; updateHud(); B.state = 'hit'; B.t0 = now; B.shake = 1; B.holding = false; B.spot = null; B.streak++; AUDIO.chargeStop(); AUDIO.musicState('play');
    if (ms < 180 || mult > 1.2) SFX.crit(); else SFX.bup(); vib(ms < 180 ? [30, 30, 60] : 30);
    if (Math.random() < .5) { var ch = pick(HERO_CHEER[HERO] || ['BỤP!']); setTimeout(function(){ say(HERO, ch, { rate: 1.3 }); }, 120); }
    fx.push({ t: now, x: B.enemyX, y: GY - SC * 14, txt: (label || (ms < 180 ? 'CHÍ MẠNG! ' : 'BỤP! ')) + '-' + dmg, sub: ms + 'ms', col: mult > 1.2 ? '#7fe7ff' : ms < 180 ? '#ffd23f' : '#c6ff2e' });
    burst(B.enemyX, GY - SC * 8, '#ffffff', 18);
    B.bubble = mult > 1.2 ? 'TÍCH KHÍ!!' : ms < 180 ? 'TRỜI ƠI!!' : ms < 250 ? 'Ngon!' : ms < 320 ? 'Ổn.' : 'Chậm rồi...'; B.bubbleWho = 'gabip'; B.bubbleT = now;
    if (B.hp <= 0) {
      if (B.g.phases && B.phase < B.g.phases.length) { B.phase++; var P = B.g.phases[B.phase - 1]; B.hp = P.hp; B.max = P.hp; B.smokeA = P.smoke || 0; B.hearts = Math.min(B.hs.hearts + (B.practice ? 2 : 0), B.hearts + 1); updateHud(); SFX.phase(); AUDIO.musicStart(B.g.w, true, B.phase); B.bubble = P.line; B.bubbleWho = B.e.spr; B.bubbleT = now + 400; setTimeout(function(){ say(B.e.spr, P.line); }, 400); fx.push({ t: now + 300, x: W / 2 - SC * 7, y: H * .4, txt: 'HIỆP ' + B.phase, sub: P.line + ' (+1 ❤️)', col: '#ffd23f' }); setTimeout(function(){ if (B && !B.over) scheduleRound(); }, 1400); }
      else { B.hp = 0; updateHud(); setTimeout(function(){ endBattle(true); }, 500); }
    }
    else setTimeout(function(){ if (B && !B.over && B.state === 'hit') scheduleRound(); }, 420);
  }
  function hurt(label, now, who){
    AUDIO.chargeStop(); AUDIO.musicState('play'); B.streak = 0;
    if (B.forgive > 0 && /SỚM|THẢ/.test(label)) { B.forgive--; B.state = 'hit'; B.t0 = now; B.holding = false; AUDIO.sfx.forgive(); fx.push({ t: now, x: B.heroX, y: GY - SC * 14, txt: 'THA 1 LẦN', sub: B.hs.name + ' bình tĩnh', col: '#7fe7ff' }); B.bubble = 'Lần này tha. Lần sau không.'; B.bubbleWho = 'gabip'; B.bubbleT = now; say('gabip', 'Lần này tha'); setTimeout(function(){ if (B && !B.over) scheduleRound(); }, 650); return; }
    B.hearts--; updateHud(); B.state = 'hurt'; B.t0 = now; B.shake = 1; B.holding = false; B.spot = null; vib([60, 40, 60]);
    if (/SỚM|THẢ/.test(label)) AUDIO.sfx.buzzer(); else if (/HỤT CHỖ|NGỦ|TẮT/.test(label)) AUDIO.sfx.whiff(); SFX.hurt();
    fx.push({ t: now, x: B.heroX, y: GY - SC * 14, txt: label, sub: '-1 ❤️', col: '#ff2e6e' });
    var ou = pick(HERO_OUCH[HERO] || ['Ui da!']); say(HERO, ou, { rate: 1.3 });
    var tl = pick(['Ai bảo bụp!', 'Chưa gáy mà!', 'Đau không?', 'Hụt rồi!']); B.bubble = tl; B.bubbleWho = who || B.e.spr; B.bubbleSwap = B.e.swap; B.bubbleT = now; setTimeout(function(){ say((who || B.e.spr), tl, { low: who !== 'gabip' }); }, 350);
    if (B.hearts <= 0) setTimeout(function(){ endBattle(false); }, 500);
    else setTimeout(function(){ if (B && !B.over && B.state === 'hurt') scheduleRound(); }, 650);
  }
  function burst(x, y, col, n){ for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, sp = 2 + Math.random() * 5; parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, life: 1, col: col, sz: 3 + Math.random() * 4 }); } }

  /* input: down/up with coordinates */
  function tapDown(px, py){
    if (!B || B.over) return;
    var now = performance.now(), st = B.state;
    if (st === 'wait') {
      if (B.mech === 'hold') { if (!B.holding) { B.holding = true; B.holdT = now; AUDIO.chargeStart(); } return; }
      hurt('BỤP SỚM! 💀', now); return;
    }
    if (st === 'fakesig') { hurt(B.g.sneeze ? 'MẮC BẪY HẮT XÌ! 🤧' : B.g.foxbluff ? 'TIN CÁO À? 🦊' : 'MẮC BẪY VỊT! 🦆', now); return; }
    if (st === 'go') {
      var ms = Math.round(now - B.tSig);
      if (B.mech === 'spot') { var d = Math.hypot(px - B.spot.x, py - B.spot.y); if (d > B.spot.r + 10) { hurt('HỤT CHỖ! 💨', now, 'gabip'); return; } hit(ms, B.spot.r < B.spot.r0 * .6 ? 1.3 : 1, B.spot.r < B.spot.r0 * .6 ? 'ĐIỂM NHỎ! ' : null); return; }
      if (B.mech === 'double') { B.taps++; if (B.taps === 1) { B.tap1 = now; AUDIO.sfx.tapone(); burst(B.heroX + SC * 7, GY - SC * 10, B.hs.aura, 10); B.bubble = 'Một... nữa!'; B.bubbleWho = 'gabip'; B.bubbleT = now; return; } var ms1 = Math.round(B.tap1 - B.tSig); hit(ms1, now - B.tap1 < 450 ? 1.25 : 1, now - B.tap1 < 450 ? 'BỤP BỤP! ' : null); return; }
      if (B.mech === 'hold') { if (B.holding) return; hit(ms, 1, null); return; }
      hit(ms, 1, null); return;
    }
    if (st === 'lost') { startGate(B.n, { skipDlg: true, practice: B.practice }); return; }
  }
  function tapUp(){
    if (!B || B.over || !B.holding) return;
    var now = performance.now();
    if (B.state === 'wait') { hurt('THẢ SỚM! 💀', now); return; }
    if (B.state === 'go') { var ms = Math.round(now - B.tSig), held = (B.tSig - B.holdT) / 1000; hit(ms, held > 0.6 ? 1.6 : 1.2, 'TÍCH KHÍ! '); return; }
    B.holding = false;
  }
  function endBattle(won){
    B.over = true; B.state = 'end'; $('hud').hidden = true; $('dlg').hidden = true;
    var avg = avgOf(B.hits), stars = 0;
    if (won) { stars = 1 + (B.hearts === B.hs.hearts + (B.practice ? 2 : 0) ? 1 : 0) + (avg && avg < 250 ? 1 : 0);
      if (!B.practice) { save.stars[B.n] = Math.max(save.stars[B.n] || 0, stars); if (!save.best[B.n] || avg < save.best[B.n]) save.best[B.n] = avg; if (B.n === save.unlocked) save.unlocked = B.n + 1; persist(); } SFX.win(); }
    else { if (!B.practice) persist(); SFX.lose(); }
    AUDIO.musicStop();
    var lossKey = 'l' + B.n; losses[lossKey] = won ? 0 : (losses[lossKey] || 0) + 1;
    if (won && !B.e.boss && !B.practice && B.n < GATES.length && !(challenge && challenge.gate === B.n)) { B.over = false; B.state = 'won'; B.t0 = performance.now(); B.stars = stars; B.avg = avg; lastWin = { gate: B.n, stars: stars, avg: avg }; setTimeout(function(){ if (B && B.state === 'won') startGate(B.n + 1); }, 1500); return; }
    if (!won && losses[lossKey] < 2 && !(challenge && challenge.gate === B.n)) { B.over = false; B.state = 'lost'; B.t0 = performance.now(); return; }
    cancelAnimationFrame(raf);
    showResult(won, stars, avg);
  }
  var losses = {}, lastWin = null;
  $('btn-quit').addEventListener('click', function(){ if (!B) return; B.over = true; AUDIO.musicStop(); cancelAnimationFrame(raf); $('hud').hidden = true; $('dlg').hidden = true; renderMap(); show('s-map'); });
  cv.addEventListener('pointerdown', function(e){ e.preventDefault(); sound(); if (B && B.state === 'dialog') { nextDialog(); return; } tapDown(e.clientX, e.clientY); });
  cv.addEventListener('pointerup', function(e){ e.preventDefault(); tapUp(); });
  cv.addEventListener('pointercancel', function(){ tapUp(); });
  document.addEventListener('keydown', function(e){ if ((e.code === 'Space' || e.code === 'Enter') && B && !B.over && !e.repeat) { var tg = e.target.tagName; if (tg === 'BUTTON' || tg === 'A') return; e.preventDefault(); sound(); if (B.state === 'dialog') nextDialog(); else tapDown(B.spot ? B.spot.x : W / 2, B.spot ? B.spot.y : H / 2); } });
  document.addEventListener('keyup', function(e){ if ((e.code === 'Space' || e.code === 'Enter') && B && !B.over) tapUp(); });

  /* ---------- render loop ---------- */
  function loop(now){
    if (!B || B.over) return;
    raf = requestAnimationFrame(loop);
    var t = now / 1000, st = B.state, P = curP(), dt = Math.min(50, now - (B.lastF || now)) / 16.7; B.lastF = now;
    if (st === 'won' || st === 'lost') { drawBg(ctx, B.w, W, H, t, GY); drawSprite(ctx, HERO, W * .3, GY, SC, false); if (st === 'lost') drawSprite(ctx, B.e.spr, W * .7 - ((B.g.phases ? 3 : B.e.boss ? 1 : 0)) * 7, GY, B.g.phases ? SC + 3 : B.e.boss ? SC + 1 : SC, true, B.e.swap);
      ctx.fillStyle = 'rgba(11,11,22,.55)'; ctx.fillRect(0, 0, W, H); ctx.textAlign = 'center'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 8;
      ctx.font = '900 ' + Math.round(Math.min(W, H) * .13) + 'px ' + FF(); ctx.fillStyle = st === 'won' ? '#c6ff2e' : '#ff2e6e'; ctx.strokeText(st === 'won' ? 'QUA CỬA ' + B.n : 'THUA', W / 2, H * .42); ctx.fillText(st === 'won' ? 'QUA CỬA ' + B.n : 'THUA', W / 2, H * .42);
      ctx.font = '900 ' + Math.round(Math.min(W, H) * .11) + 'px ' + FF(); ctx.fillStyle = '#ffd23f'; if (st === 'won') { ctx.strokeText('★'.repeat(B.stars) + '☆'.repeat(3 - B.stars), W / 2, H * .53); ctx.fillText('★'.repeat(B.stars) + '☆'.repeat(3 - B.stars), W / 2, H * .53); }
      ctx.font = '800 ' + Math.round(Math.min(W, H) * .05) + 'px ' + FF(); ctx.fillStyle = '#fff'; var msg = st === 'won' ? (B.avg + 'ms · cửa tiếp theo...') : 'chạm để đánh lại ngay'; ctx.strokeText(msg, W / 2, H * .62); ctx.fillText(msg, W / 2, H * .62); ctx.textAlign = 'left'; return; }
    if (st === 'wait' && now >= B.tSig) signal(now);
    if (st === 'fakesig' && now - B.tSig > 650) { AUDIO.sfx.phew(); B.fake = false; B.state = 'wait'; B.t0 = now - 500; B.tSig = now + 400 + Math.random() * 900; AUDIO.musicState('wait'); B.bubble = 'Hú vía. ' + (B.mech === 'normal' ? 'Chờ tiếp...' : ROUND_CALL[B.mech]); B.bubbleWho = 'gabip'; B.bubbleT = now; }
    if (st === 'go' && now > B.tEnd) { if (B.mech === 'double' && B.taps === 1) hit(Math.round(B.tap1 - B.tSig), 0.4, 'THIẾU MỘT BỤP! '); else hurt(B.mech === 'spot' ? 'TẮT MẤT RỒI! 🌑' : 'NGỦ À? 😴', now, 'gabip'); }
    if (B.g.dim && (st === 'wait')) B.dim = Math.min(.7, (now - B.t0) / 2200); else B.dim = Math.max(0, B.dim - .05);
    if (B.spot && st === 'go') B.spot.r = B.spot.r0 * (1 - 0.65 * Math.min(1, (now - B.tSig) / (B.tEnd - B.tSig)));

    drawBg(ctx, B.w, W, H, t, GY);
    var hx = W * 0.3, ex = W * 0.7, bob = Math.sin(t * 5) * 2;
    if (st === 'hit') { var k = Math.min(1, (now - B.t0) / 160); hx += (ex - hx - SC * 12) * (k < .5 ? k * 2 : (1 - k) * 2) * .9; }
    if (st === 'hurt') { var k2 = Math.min(1, (now - B.t0) / 200); ex -= (ex - hx - SC * 12) * (k2 < .5 ? k2 * 2 : (1 - k2) * 2) * .9; }
    B.heroX = hx; B.enemyX = ex;
    var shake = B.shake > 0 ? (Math.random() - .5) * 12 * B.shake : 0; B.shake = Math.max(0, B.shake - .06 * dt);
    ctx.save(); ctx.translate(shake, shake * .5);
    /* aura while waiting; much bigger while holding */
    var auraI = st === 'wait' ? Math.min(1, (now - B.t0) / 1200) : st === 'go' ? 1 : 0;
    if (B.holding) auraI = Math.min(1.8, 1 + (now - B.holdT) / 900);
    if (auraI > 0) { for (var i = 0; i < 3; i++) if (Math.random() < auraI) parts.push({ x: hx + SC * 7 + (Math.random() - .5) * SC * 14 * auraI, y: GY - Math.random() * SC * 4, vx: (Math.random() - .5), vy: -2 - Math.random() * 3 * auraI, life: 1, col: Math.random() < .5 ? B.hs.aura : B.hs.aura2, sz: 2 + Math.random() * 4 * auraI });
      var rg = ctx.createRadialGradient(hx + SC * 7, GY - SC * 8, 4, hx + SC * 7, GY - SC * 8, SC * 16 * auraI); rg.addColorStop(0, hexA(B.hs.aura, .4 * Math.min(1, auraI))); rg.addColorStop(1, hexA(B.hs.aura, 0)); ctx.fillStyle = rg; ctx.fillRect(hx - SC * 14, GY - SC * 30, SC * 42, SC * 32); }
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(hx + SC * 7, GY + 4, SC * 7, SC * 1.5, 0, 0, 7); ctx.ellipse(ex + SC * 7, GY + 4, SC * 7, SC * 1.5, 0, 0, 7); ctx.fill();
    drawSprite(ctx, HERO, hx, GY + bob, SC, false);
    var eswap = B.e.swap; if (st === 'hit' && now - B.t0 < 120) eswap = { k: '#fff', s: '#fff', g: '#fff', d: '#fff', p: '#fff', o: '#fff', y: '#fff', w: '#fff', e: '#fff', n: '#fff', r: '#fff', b: '#fff', c: '#fff', h: '#fff', m: '#fff', q: '#fff', x: '#fff', G: '#fff' };
    var ebob = B.e.spr === 'traului' ? Math.sin(t * 2) * 3 : Math.sin(t * 5 + 1) * 2, esc = B.g.phases ? SC + 3 : B.e.boss ? SC + 1 : SC;
    drawSprite(ctx, B.e.spr, ex - (esc - SC) * 7, GY + ebob, esc, true, eswap);
    if ((B.e.spr === 'traului' || B.e.spr === 'thienbinh') && st === 'wait') { ctx.fillStyle = '#fff'; ctx.font = '900 ' + SC * 3 + 'px ' + FF(); ctx.fillText('z', ex + SC * 2, GY - SC * 16 - (t % 1) * 20); }
    /* referee */
    var rx = W / 2 - SC * 4, ry = Math.max(GY - SC * 22, 120);
    drawSprite(ctx, 'gabip', rx, ry + Math.sin(t * 8) * (st === 'go' ? 4 : 1), Math.max(3, SC - 2), false);
    /* particles */
    for (i = parts.length - 1; i >= 0; i--) { var p = parts[i]; p.x += p.vx; p.y += p.vy; p.life -= .03 * dt; if (p.life <= 0) { parts.splice(i, 1); continue; } ctx.globalAlpha = p.life; ctx.fillStyle = p.col; ctx.fillRect(p.x, p.y, p.sz, p.sz); } ctx.globalAlpha = 1;
    ctx.restore();
    /* smoke (world 4/5) */
    if (B.smokeA > 0) { var sa = B.smokeA * (st === 'go' || st === 'hit' ? 0.85 : 1); ctx.fillStyle = 'rgba(40,20,30,' + (sa * .3) + ')'; ctx.fillRect(0, 0, W, H);
      for (i = 0; i < smoke.length; i++) { var s = smoke[i]; s.x += s.v * .004; if (s.x < -.3) s.x = 1.3; if (s.x > 1.3) s.x = -.3; var sr = s.r * Math.min(W, H); var sg = ctx.createRadialGradient(s.x * W, s.y * H, 0, s.x * W, s.y * H, sr); sg.addColorStop(0, 'rgba(110,80,90,' + (sa * .55) + ')'); sg.addColorStop(1, 'rgba(90,70,80,0)'); ctx.fillStyle = sg; ctx.fillRect(s.x * W - sr, s.y * H - sr, sr * 2, sr * 2); } }
    /* spot */
    if (B.spot && st === 'go') { var sp = B.spot, g2 = ctx.createRadialGradient(sp.x, sp.y, sp.r * .2, sp.x, sp.y, sp.r); g2.addColorStop(0, 'rgba(255,255,220,.95)'); g2.addColorStop(.7, 'rgba(198,255,46,.6)'); g2.addColorStop(1, 'rgba(198,255,46,0)'); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r, 0, 7); ctx.fill(); ctx.strokeStyle = '#c6ff2e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r, 0, 7); ctx.stroke(); ctx.fillStyle = '#1a1026'; ctx.font = '900 ' + Math.round(sp.r * .5) + 'px ' + FF(); ctx.textAlign = 'center'; ctx.fillText('BỤP', sp.x, sp.y + sp.r * .18); ctx.textAlign = 'left'; }
    /* bubbles + floating text drawn above smoke */
    if (B.bubble && now - B.bubbleT < 1600 && now >= B.bubbleT) bubble(B.bubbleWho === 'gabip' ? rx + SC * 5 : B.bubbleWho === HERO ? hx + SC * 7 : ex + SC * 7, B.bubbleWho === 'gabip' ? ry - SC * 14 : GY - SC * 19, B.bubble, (B.bubbleWho === 'vitgia' || B.bubbleWho === 'cao' || B.bubbleWho === 'bangvuong') && st === 'fakesig' ? '#ff2e6e' : B.bubble.indexOf('BÍP') >= 0 || B.bubble.indexOf('THẢ') >= 0 ? '#5a8f00' : '#fff');
    for (i = fx.length - 1; i >= 0; i--) { var f = fx[i], age = (now - f.t) / 1000; if (age < 0) continue; if (age > 1.4) { fx.splice(i, 1); continue; } ctx.globalAlpha = Math.min(1, 1.6 - age); ctx.fillStyle = f.col; ctx.font = '900 ' + Math.round(SC * 4.2) + 'px ' + FF(); ctx.textAlign = 'center'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 5; ctx.strokeText(f.txt, f.x + SC * 7, f.y - age * 50); ctx.fillText(f.txt, f.x + SC * 7, f.y - age * 50); ctx.font = '800 ' + Math.round(SC * 2.4) + 'px ' + FF(); ctx.fillStyle = '#fff'; ctx.strokeText(f.sub, f.x + SC * 7, f.y - age * 50 + SC * 3); ctx.fillText(f.sub, f.x + SC * 7, f.y - age * 50 + SC * 3); ctx.textAlign = 'left'; } ctx.globalAlpha = 1;
    if (B.dim > 0) { ctx.fillStyle = 'rgba(5,3,20,' + B.dim + ')'; ctx.fillRect(0, 0, W, H); if (B.dim > .3) { ctx.fillStyle = 'rgba(255,255,255,' + (B.dim - .3) + ')'; ctx.font = '800 16px ' + FF(); ctx.textAlign = 'center'; ctx.fillText('Lý Trưởng đang ngáp... đừng ngủ theo', W / 2, H * .5); ctx.textAlign = 'left'; } }
    /* big cue text */
    ctx.textAlign = 'center'; ctx.font = '900 ' + Math.round(Math.min(W, H) * (B.mech === 'double' ? .12 : .16)) + 'px ' + FF(); ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 8;
    if (st === 'go') { var cue = B.mech === 'double' ? (B.taps ? 'NỮA!' : 'BỤP BỤP!') : B.mech === 'hold' && B.holding ? 'THẢ!' : B.mech === 'spot' ? 'ĐÓ!' : 'BỤP!'; ctx.fillStyle = '#c6ff2e'; ctx.strokeText(cue, W / 2, H * .86); ctx.fillText(cue, W / 2, H * .86); }
    else if (st === 'fakesig') { ctx.fillStyle = '#ff2e6e'; ctx.strokeText('ĐỪNG!', W / 2, H * .86); ctx.fillText('ĐỪNG!', W / 2, H * .86); }
    else if (st === 'wait' || st === 'ready') { ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '800 ' + Math.round(Math.min(W, H) * .05) + 'px ' + FF(); var hint = B.mech === 'hold' ? (B.holding ? 'đang tích khí... giữ nguyên' : 'ấn và GIỮ để tích khí') : B.mech === 'double' ? 'chờ hai tiếng gáy...' : B.mech === 'spot' ? 'chờ điểm sáng trong khói...' : 'chờ gà gáy...'; ctx.strokeText(hint, W / 2, H * .86); ctx.fillText(hint, W / 2, H * .86); }
    ctx.textAlign = 'left';
    if (B.flash > 0) { ctx.fillStyle = 'rgba(' + B.flashCol + ',' + (B.flash * .55) + ')'; ctx.fillRect(0, 0, W, H); B.flash -= .08 * dt; }
  }
  function hexA(h, a){ var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function bubble(x, y, text, col){
    ctx.font = '900 ' + Math.round(SC * 2.6) + 'px ' + FF(); var tw = ctx.measureText(text).width + 24, bh = SC * 4.4, bx = Math.max(8, Math.min(W - tw - 8, x - tw / 2));
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, y - bh, tw, bh, 10) : ctx.rect(bx, y - bh, tw, bh); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.lineTo(x, y + 8); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col === '#fff' ? '#1a1026' : col; ctx.textAlign = 'center'; ctx.fillText(text, bx + tw / 2, y - bh * .3); ctx.textAlign = 'left';
  }

  /* ---------- result ---------- */
  var last = null;
  function showResult(won, stars, avg){
    var all = save.hits, r = rankOf(avgOf(all) || 9999);
    last = { won: won, stars: stars, avg: avg, gate: B.n, rank: r, practice: B.practice };
    $('res-stars').textContent = won ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '💀';
    var vs = '';
    if (challenge && challenge.gate === B.n) vs = won ? (avg < challenge.ms ? ' 🎉 Bạn THẮNG người thách (' + avg + 'ms < ' + challenge.ms + 'ms)!' : ' 😭 Thua người thách (' + challenge.ms + 'ms). Đánh lại đi!') : ' Người thách vẫn đang cười.';
    var newHero = won && !B.practice && Object.keys(HEROES).filter(function(k){ return HEROES[k].unlock === B.n; })[0];
    $('res-title').textContent = B.practice ? (won ? 'LUYỆN XONG, VÀO ĐÁNH THẬT' : 'LUYỆN TIẾP ĐI') : won ? (B.n === GATES.length ? 'THIÊN HẠ ĐỆ NHẤT BỤP!' : B.e.boss ? 'HẠ TRÙM ' + B.e.name.toUpperCase() + '!' : 'QUA ' + gateName(B.n).toUpperCase()) : 'THUA ' + B.e.name.toUpperCase();
    $('res-sub').textContent = (won ? (WIN_LINES[B.n] || 'Phản xạ trung bình ' + avg + 'ms. ' + (stars === 3 ? 'Hoàn hảo!' : stars === 2 ? 'Thiếu sao: cần dưới 250ms.' : 'Thiếu sao: đừng mất tim, và dưới 250ms.')) : pick(ENEMY_WIN_LINES) + (avg ? ' Phản xạ của bạn: ' + avg + 'ms.' : '')) + vs + (newHero ? ' 🎉 Mở nhân vật mới: ' + HEROES[newHero].name + '. Chọn ở bản đồ.' : '');
    if (newHero) AUDIO.sfx.unlock();
    $('btn-next').hidden = !won || B.practice || B.n >= GATES.length; $('btn-next').textContent = 'CỬA ' + (B.n + 1) + ' ▸';
    $('btn-practice').hidden = !(B.e.boss && (!won || B.practice));
    drawCard(won, stars, avg, r);
    try { $('btn-img').href = $('res-card').toDataURL('image/png'); } catch (e) {}
    var url = SHARE_URL + '#c' + B.n + '-' + (avg || 999);
    $('btn-fb').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(shareText());
    show('s-result');
  }
  function shareText(){ var l = last; return '🥊 BÁ KHÍ • ' + gateName(l.gate) + (l.won ? ' ✅ ' + '★'.repeat(l.stars) : ' ❌') + ' • ' + HEROES[HERO].name + '\n⚡ Phản xạ ' + (l.avg || '?') + 'ms • Cấp ' + l.rank[1] + ' ' + l.rank[2] + '\nThách bạn qua cửa này nhanh hơn tôi 👉 ' + SHARE_URL + '#c' + l.gate + '-' + (l.avg || 999); }
  function drawCard(won, stars, avg, r){
    var c = $('res-card'), x = c.getContext('2d'), w = c.width, h = c.height, gy = Math.floor(h * .72), ff = FF();
    drawBg(x, B.w, w, h, 3, gy);
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0, 0, w, h);
    drawSprite(x, HERO, w * .12, gy, 12, false);
    drawSprite(x, B.e.spr, w * .62, gy, 12, true, won ? { k: '#333', s: '#777', g: '#777', d: '#666', p: '#777', o: '#777', y: '#888', w: '#999', e: '#777', n: '#666', r: '#777', b: '#777', c: '#888', h: '#555', m: '#777', q: '#777', x: '#777', G: '#666' } : B.e.swap);
    if (won) { x.fillStyle = '#ff2e6e'; x.font = '900 60px ' + ff; x.save(); x.translate(w * .72, gy - 110); x.rotate(-.3); x.fillText('K.O.', 0, 0); x.restore(); }
    x.fillStyle = '#ffd23f'; x.font = '900 54px ' + ff; x.fillText('BÁ KHÍ', 40, 70); x.fillStyle = '#fff'; x.font = '800 22px ' + ff; x.fillText('BATTLE AURA', 44, 98);
    x.textAlign = 'right'; x.font = '900 34px ' + ff; x.fillText(gateName(B.n), w - 40, 64); x.font = '800 20px ' + ff; x.fillStyle = '#c6ff2e'; x.fillText(B.e.boss ? 'TRÙM: ' + B.e.name : 'vs ' + B.e.name, w - 40, 94); x.textAlign = 'left';
    x.fillStyle = 'rgba(11,11,22,.85)'; x.fillRect(0, h - 120, w, 120);
    x.fillStyle = won ? '#c6ff2e' : '#ff2e6e'; x.font = '900 44px ' + ff; x.fillText(won ? '★'.repeat(stars) + '☆'.repeat(3 - stars) + '  ' + (avg || '?') + 'ms' : 'THUA  ' + (avg ? avg + 'ms' : ''), 40, h - 62);
    x.fillStyle = '#fff'; x.font = '800 24px ' + ff; x.fillText(r[1] + ' ' + r[2] + '  ·  ' + HEROES[HERO].name, 40, h - 24);
    x.textAlign = 'right'; x.fillStyle = '#a7a8c6'; x.font = '800 20px ' + ff; x.fillText(SHARE_URL.replace(/^https?:\/\//, ''), w - 40, h - 24); x.textAlign = 'left';
  }
  $('btn-next').addEventListener('click', function(){ sound(); SFX.click(); challenge = null; startGate(Math.min(GATES.length, last.gate + 1)); });
  $('btn-retry').addEventListener('click', function(){ sound(); SFX.click(); startGate(last.gate, { skipDlg: true }); });
  $('btn-practice').addEventListener('click', function(){ sound(); SFX.click(); startGate(last.gate, { practice: true }); });
  $('btn-share').addEventListener('click', function(){ copy(shareText(), 'Đã sao chép! Dán vào Zalo, Messenger, FB…'); });
  $('btn-link').addEventListener('click', function(){ copy(SHARE_URL + '#c' + last.gate + '-' + (last.avg || 999), 'Đã sao chép link thách đấu cửa ' + last.gate + '!'); });

  (function tl(){ if (!$('s-title').hidden) drawTitle(); requestAnimationFrame(tl); })();
  window.__bakhi = { audio: AUDIO, say: say, startGate: startGate, get: function(){ return B; }, save: save, signal: function(){ if (B) signal(performance.now()); }, tap: function(x, y){ tapDown(x === undefined ? (B && B.spot ? B.spot.x : W / 2) : x, y === undefined ? (B && B.spot ? B.spot.y : H / 2) : y); }, up: tapUp, setHero: function(k){ HERO = k; } };
})();
