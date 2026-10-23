(function(){
  var SHARE_URL = "https://ba-khi.vercel.app";
  var $ = function(id){ return document.getElementById(id); };
  var cv = $('game'), ctx = cv.getContext('2d'), W = 0, H = 0, DPR = 1, GY = 0, SC = 5;
  var HERO = 'tibup';
  var save = { unlocked: 1, stars: {}, best: {}, hits: [] };
  try { var s0 = JSON.parse(localStorage.getItem('bakhi.save') || 'null'); if (s0 && s0.stars) save = s0; } catch (e) {}
  function persist(){ try { localStorage.setItem('bakhi.save', JSON.stringify(save)); } catch (e) {} }
  var challenge = null, m = /^#?c(\d{1,2})-(\d{2,4})$/.exec(location.hash || '');
  if (m && +m[1] >= 1 && +m[1] <= GATES.length) { challenge = { gate: +m[1], ms: +m[2] }; }

  /* ---------- audio ---------- */
  var audio = null;
  function sound(){ try { if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === 'suspended') audio.resume(); } catch (e) { audio = null; } }
  function tone(f, dur, type, to, vol, delay){ if (!audio) return; try { var o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + (delay || 0); o.type = type || 'square'; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur); g.gain.setValueAtTime(vol || .15, t); g.gain.exponentialRampToValueAtTime(.001, t + dur); o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + dur); } catch (e) {} }
  var SFX = {
    bip: function(){ tone(880, .06, 'square', 0, .12); tone(1320, .12, 'square', 1760, .18, .06); },
    quack: function(){ tone(220, .18, 'sawtooth', 140, .14); },
    bup: function(){ tone(170, .14, 'sine', 40, .3); tone(90, .2, 'square', 30, .12); },
    crit: function(){ tone(170, .14, 'sine', 40, .3); tone(1200, .1, 'square', 2400, .1, .05); tone(1600, .12, 'square', 3200, .1, .12); },
    hurt: function(){ tone(140, .3, 'sawtooth', 50, .18); },
    win: function(){ [523, 659, 784, 1046].forEach(function(f, i){ tone(f, .18, 'square', 0, .12, i * .12); }); },
    lose: function(){ [392, 330, 262].forEach(function(f, i){ tone(f, .3, 'triangle', 0, .15, i * .25); }); },
    click: function(){ tone(600, .05, 'square', 0, .06); }
  };
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

  /* ---------- resize ---------- */
  function resize(){ DPR = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight; cv.width = Math.floor(W * DPR); cv.height = Math.floor(H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); GY = Math.floor(H * 0.68); SC = Math.max(4, Math.min(10, Math.floor(Math.min(W / 72, H / 110)))); }
  window.addEventListener('resize', resize); resize();

  /* ---------- title ---------- */
  function drawTitle(){
    var c = $('title-canvas'), x = c.getContext('2d'), w = c.width, h = c.height, gy = Math.floor(h * 0.78), t = performance.now() / 1000;
    drawBg(x, WORLDS[0], w, h, t, gy);
    drawSprite(x, 'tibup', w * 0.26, gy, 7, false);
    drawSprite(x, 'gabip', w * 0.47, gy - 10, 5, false);
    drawSprite(x, 'banoi', w * 0.62, gy, 6, true);
    x.fillStyle = 'rgba(255,210,63,.9)'; x.font = '900 22px ' + getComputedStyle(document.body).fontFamily; x.fillText('BỤP!', w * 0.36, gy - 125 + Math.sin(t * 4) * 4);
  }
  $('btn-play').addEventListener('click', function(){ sound(); SFX.click(); if (challenge) { startGate(challenge.gate); } else { renderMap(); show('s-map'); } });
  $('btn-story').addEventListener('click', function(){ var s = $('story'); if (s.hidden) { s.innerHTML = STORY.map(function(p){ return '<p>' + p + '</p>'; }).join(''); s.hidden = false; } else s.hidden = true; });
  $('btn-home').addEventListener('click', function(){ show('s-title'); });
  if (challenge) { var cb = $('challenge-banner'); cb.textContent = '🥊 Có người thách bạn ' + gateName(challenge.gate) + ' với phản xạ ' + challenge.ms + 'ms. Vượt được không?'; cb.hidden = false; $('btn-play').textContent = 'NHẬN THÁCH ĐẤU'; }

  /* ---------- map ---------- */
  function renderMap(){
    var all = save.hits, avg = avgOf(all), r = rankOf(avg || 9999);
    $('rank-name').textContent = r[1] + ' ' + r[2];
    var totalStars = 0; for (var k in save.stars) totalStars += save.stars[k];
    $('rank-sub').textContent = (all.length ? 'Phản xạ trung bình ' + avg + 'ms · ' : 'Chưa có dữ liệu phản xạ · ') + totalStars + '⭐ · ' + Math.min(save.unlocked - 1, GATES.length) + '/' + GATES.length + ' cửa';
    face($('rank-face'), HERO);
    var html = '';
    WORLDS.forEach(function(w){
      html += '<div class="world' + (w.open ? '' : ' closed') + '"><h3><span>' + w.id + '. ' + w.name + '</span><small>' + (w.open ? w.sub : 'Sắp mở') + '</small></h3><p class="mech">' + w.mech + '</p>';
      if (w.open) {
        html += '<div class="gates">';
        GATES.forEach(function(g, i){ if (g.w !== w.id) return; var n = i + 1, st = save.stars[n] || 0, locked = n > save.unlocked, cls = 'gate' + (locked ? ' lock' : '') + (ENEMIES[g.e].boss ? ' boss' : '') + (n === save.unlocked ? ' next' : '');
          html += '<button type="button" class="' + cls + '" data-gate="' + n + '"' + (locked ? ' disabled' : '') + '>' + (ENEMIES[g.e].boss ? '👹' : n) + '<span class="st">' + (st ? '★'.repeat(st) : (locked ? '🔒' : '')) + '</span></button>'; });
        html += '</div>';
      } else html += '<div class="gates">' + '<button type="button" class="gate lock" disabled>🔒<span class="st"></span></button>'.repeat(4) + '</div>';
      html += '</div>';
    });
    $('worlds').innerHTML = html;
    Array.prototype.forEach.call(document.querySelectorAll('.gate[data-gate]'), function(b){ b.addEventListener('click', function(){ sound(); SFX.click(); startGate(+b.getAttribute('data-gate')); }); });
  }
  $('btn-map').addEventListener('click', function(){ renderMap(); show('s-map'); });

  /* ---------- battle ---------- */
  var B = null, raf = 0, parts = [], fx = [];
  function startGate(n){
    var g = GATES[n - 1], e = ENEMIES[g.e], w = WORLDS[g.w - 1];
    B = { n: n, g: g, e: e, w: w, hp: g.hp, max: g.hp, hearts: 3, hits: [], state: 'dialog', t0: performance.now(), tSig: 0, tEnd: 0, fake: false, flash: 0, flashCol: '', dim: 0,
      heroX: 0, enemyX: 0, shake: 0, bubble: null, bubbleT: 0, lastHit: 0, intro: 0, over: false, dlg: (DIALOG[n] || []).slice(), round: 0 };
    if (!DIALOG[n]) B.dlg = [{ who: e.spr, swap: e.swap, name: e.name, text: e.line }];
    parts = []; fx = [];
    $('hud-gate').textContent = gateName(n) + (e.boss ? ' · TRÙM' : '');
    $('hud-enemy').textContent = e.name; $('hud-hero').textContent = HEROES[HERO].name;
    updateHud(); show(null); $('hud').hidden = false;
    nextDialog();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function updateHud(){ $('hud-hearts').textContent = '❤️'.repeat(B.hearts) + '🖤'.repeat(3 - B.hearts); $('hud-ehp').style.width = Math.max(0, B.hp / B.max * 100) + '%'; }
  function nextDialog(){
    if (!B.dlg.length) { $('dlg').hidden = true; B.state = 'ready'; B.t0 = performance.now(); scheduleRound(); return; }
    var d = B.dlg.shift(); $('dlg').hidden = false; $('dlg-name').textContent = d.name; $('dlg-text').textContent = d.text; face($('dlg-face'), d.who, d.swap); B.state = 'dialog';
  }
  $('dlg-box').addEventListener('click', function(){ sound(); SFX.click(); if (B && B.state === 'dialog') nextDialog(); });
  function scheduleRound(){
    B.round++;
    B.state = 'wait'; B.t0 = performance.now();
    B.fake = Math.random() < B.g.fake;
    B.tSig = B.t0 + B.g.wait[0] + Math.random() * (B.g.wait[1] - B.g.wait[0]);
    B.bubble = ['Cục...', 'Cục cục...', 'Hmm...', 'Chờ nhé...'][Math.floor(Math.random() * 4)]; B.bubbleWho = 'gabip'; B.bubbleT = performance.now();
    if (B.g.dim) B.dim = 0;
  }
  function signal(now){
    B.state = B.fake ? 'fakesig' : 'go'; B.tSig = now; B.tEnd = now + B.g.to;
    if (B.fake) { B.flash = 1; B.flashCol = '255,46,110'; SFX.quack(); B.bubble = B.g.foxbluff && Math.random() < .5 ? 'BÍP! (tin anh đi)' : 'CẠC!!'; B.bubbleWho = B.g.foxbluff && B.bubble[0] === 'B' ? 'cao' : 'vitgia'; B.bubbleT = now; }
    else { B.flash = 1; B.flashCol = '198,255,46'; SFX.bip(); vib(25); B.bubble = 'TÁC!! BÍP!'; B.bubbleWho = 'gabip'; B.bubbleT = now; burst(B.heroX, GY - SC * 9, HEROES[HERO].aura, 26); }
  }
  function tap(){
    if (!B || B.over) return;
    var now = performance.now();
    if (B.state === 'wait' || B.state === 'fakesig') { hurt(B.state === 'wait' ? 'BỤP SỚM! 💀' : 'MẮC BẪY VỊT! 🦆', now); return; }
    if (B.state === 'go') {
      var ms = Math.round(now - B.tSig), dmg = ms < 180 ? 45 : ms < 250 ? 35 : ms < 320 ? 25 : ms < 450 ? 15 : 8;
      B.hits.push(ms); save.hits.push(ms); if (save.hits.length > 60) save.hits.shift();
      B.hp -= dmg; updateHud(); B.state = 'hit'; B.t0 = now; B.lastHit = ms; B.shake = 1;
      if (ms < 180) SFX.crit(); else SFX.bup(); vib(ms < 180 ? [30, 30, 60] : 30);
      fx.push({ t: now, x: B.enemyX, y: GY - SC * 14, txt: (ms < 180 ? 'CHÍ MẠNG! ' : 'BỤP! ') + '-' + dmg, sub: ms + 'ms', col: ms < 180 ? '#ffd23f' : '#c6ff2e' });
      burst(B.enemyX, GY - SC * 8, '#ffffff', 18);
      B.bubble = ms < 180 ? 'TRỜI ƠI!!' : ms < 250 ? 'Ngon!' : ms < 320 ? 'Ổn.' : 'Chậm rồi...'; B.bubbleWho = 'gabip'; B.bubbleT = now;
      if (B.hp <= 0) { B.hp = 0; updateHud(); setTimeout(function(){ endBattle(true); }, 900); }
      else setTimeout(function(){ if (B && !B.over && B.state === 'hit') scheduleRound(); }, 900);
    }
  }
  function hurt(label, now){
    B.hearts--; updateHud(); B.state = 'hurt'; B.t0 = now; B.shake = 1; SFX.hurt(); vib([60, 40, 60]);
    fx.push({ t: now, x: B.heroX, y: GY - SC * 14, txt: label, sub: '-1 ❤️', col: '#ff2e6e' });
    B.bubble = ['Ai bảo bụp!', 'Chưa gáy mà!', 'Đau không?'][Math.floor(Math.random() * 3)]; B.bubbleWho = B.e.spr; B.bubbleSwap = B.e.swap; B.bubbleT = now;
    if (B.hearts <= 0) setTimeout(function(){ endBattle(false); }, 900);
    else setTimeout(function(){ if (B && !B.over && B.state === 'hurt') scheduleRound(); }, 1000);
  }
  function burst(x, y, col, n){ for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, sp = 2 + Math.random() * 5; parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, life: 1, col: col, sz: 3 + Math.random() * 4 }); } }
  function endBattle(won){
    B.over = true; B.state = 'end'; $('hud').hidden = true; $('dlg').hidden = true;
    var avg = avgOf(B.hits), stars = 0;
    if (won) { stars = 1 + (B.hearts === 3 ? 1 : 0) + (avg && avg < 250 ? 1 : 0); save.stars[B.n] = Math.max(save.stars[B.n] || 0, stars); if (!save.best[B.n] || avg < save.best[B.n]) save.best[B.n] = avg; if (B.n === save.unlocked && B.n < GATES.length) save.unlocked = B.n + 1; else if (B.n === GATES.length && save.unlocked <= GATES.length) save.unlocked = GATES.length + 1; persist(); SFX.win(); }
    else { persist(); SFX.lose(); }
    cancelAnimationFrame(raf);
    showResult(won, stars, avg);
  }
  $('btn-quit').addEventListener('click', function(){ if (!B) return; B.over = true; cancelAnimationFrame(raf); $('hud').hidden = true; $('dlg').hidden = true; renderMap(); show('s-map'); });
  cv.addEventListener('pointerdown', function(e){ e.preventDefault(); sound(); if (B && B.state === 'dialog') { nextDialog(); return; } tap(); });
  document.addEventListener('keydown', function(e){ if ((e.code === 'Space' || e.code === 'Enter') && B && !B.over && !e.repeat) { var tg = e.target.tagName; if (tg === 'BUTTON' || tg === 'A') return; e.preventDefault(); sound(); if (B.state === 'dialog') nextDialog(); else tap(); } });

  /* ---------- render loop ---------- */
  function loop(now){
    if (!B || B.over) return;
    raf = requestAnimationFrame(loop);
    var t = now / 1000, st = B.state;
    if (st === 'wait' && now >= B.tSig) signal(now);
    if (st === 'fakesig' && now - B.tSig > 1100) { B.fake = false; B.state = 'wait'; B.tSig = now + 600 + Math.random() * 1800; B.bubble = 'Hú vía. Chờ tiếp...'; B.bubbleWho = 'gabip'; B.bubbleT = now; }
    if (st === 'go' && now > B.tEnd) { hurt('NGỦ À? 😴', now); }
    if (B.g.dim && (st === 'wait')) B.dim = Math.min(.7, (now - B.t0) / 4000); else B.dim = Math.max(0, B.dim - .05);

    drawBg(ctx, B.w, W, H, t, GY);
    var hx = W * 0.3, ex = W * 0.7, bob = Math.sin(t * 5) * 2;
    if (st === 'hit') { var k = Math.min(1, (now - B.t0) / 160); hx += (ex - hx - SC * 12) * (k < .5 ? k * 2 : (1 - k) * 2) * .9; }
    if (st === 'hurt') { var k2 = Math.min(1, (now - B.t0) / 200); ex -= (ex - hx - SC * 12) * (k2 < .5 ? k2 * 2 : (1 - k2) * 2) * .9; }
    B.heroX = hx; B.enemyX = ex;
    var shake = B.shake > 0 ? (Math.random() - .5) * 12 * B.shake : 0; B.shake = Math.max(0, B.shake - .06);
    ctx.save(); ctx.translate(shake, shake * .5);
    /* aura while waiting */
    var auraI = st === 'wait' ? Math.min(1, (now - B.t0) / 2500) : st === 'go' ? 1 : 0;
    if (auraI > 0) { for (var i = 0; i < 3; i++) if (Math.random() < auraI) parts.push({ x: hx + SC * 7 + (Math.random() - .5) * SC * 14, y: GY - Math.random() * SC * 4, vx: (Math.random() - .5), vy: -2 - Math.random() * 3 * auraI, life: 1, col: Math.random() < .5 ? HEROES[HERO].aura : HEROES[HERO].aura2, sz: 2 + Math.random() * 4 * auraI });
      var rg = ctx.createRadialGradient(hx + SC * 7, GY - SC * 8, 4, hx + SC * 7, GY - SC * 8, SC * 16); rg.addColorStop(0, 'rgba(255,210,63,' + (.35 * auraI) + ')'); rg.addColorStop(1, 'rgba(255,210,63,0)'); ctx.fillStyle = rg; ctx.fillRect(hx - SC * 10, GY - SC * 26, SC * 34, SC * 28); }
    /* shadows */
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(hx + SC * 7, GY + 4, SC * 7, SC * 1.5, 0, 0, 7); ctx.ellipse(ex + SC * 7, GY + 4, SC * 7, SC * 1.5, 0, 0, 7); ctx.fill();
    /* characters */
    drawSprite(ctx, HERO, hx, GY + bob, SC, false);
    var eswap = B.e.swap; if (st === 'hit' && now - B.t0 < 120) eswap = { k: '#fff', s: '#fff', g: '#fff', d: '#fff', p: '#fff', o: '#fff', y: '#fff', w: '#fff', e: '#fff', n: '#fff', r: '#fff' };
    var ebob = B.e.spr === 'traului' ? Math.sin(t * 2) * 3 : Math.sin(t * 5 + 1) * 2;
    drawSprite(ctx, B.e.spr, ex, GY + ebob, SC, true, eswap);
    if (B.e.spr === 'traului' && st === 'wait') { ctx.fillStyle = '#fff'; ctx.font = '900 ' + SC * 3 + 'px ' + getComputedStyle(document.body).fontFamily; ctx.fillText('z', ex + SC * 2, GY - SC * 16 - (t % 1) * 20); }
    /* referee */
    var rx = W / 2 - SC * 4, ry = Math.max(GY - SC * 22, 120);
    drawSprite(ctx, 'gabip', rx, ry + Math.sin(t * 8) * (st === 'go' ? 4 : 1), Math.max(3, SC - 2), false);
    if (B.bubble && now - B.bubbleT < 1600) bubble(B.bubbleWho === 'gabip' ? rx + SC * 5 : B.bubbleWho === HERO ? hx + SC * 7 : ex + SC * 7, B.bubbleWho === 'gabip' ? ry - SC * 14 : GY - SC * 19, B.bubble, B.bubbleWho === 'vitgia' || B.bubbleWho === 'cao' ? '#ff2e6e' : B.bubble.indexOf('BÍP') >= 0 ? '#c6ff2e' : '#fff');
    /* particles */
    for (i = parts.length - 1; i >= 0; i--) { var p = parts[i]; p.x += p.vx; p.y += p.vy; p.life -= .03; if (p.life <= 0) { parts.splice(i, 1); continue; } ctx.globalAlpha = p.life; ctx.fillStyle = p.col; ctx.fillRect(p.x, p.y, p.sz, p.sz); } ctx.globalAlpha = 1;
    /* floating text */
    for (i = fx.length - 1; i >= 0; i--) { var f = fx[i], age = (now - f.t) / 1000; if (age > 1.2) { fx.splice(i, 1); continue; } ctx.globalAlpha = Math.min(1, 1.5 - age); ctx.fillStyle = f.col; ctx.font = '900 ' + Math.round(SC * 4.2) + 'px ' + getComputedStyle(document.body).fontFamily; ctx.textAlign = 'center'; ctx.fillText(f.txt, f.x + SC * 7, f.y - age * 50); ctx.font = '800 ' + Math.round(SC * 2.4) + 'px ' + getComputedStyle(document.body).fontFamily; ctx.fillStyle = '#fff'; ctx.fillText(f.sub, f.x + SC * 7, f.y - age * 50 + SC * 3); ctx.textAlign = 'left'; } ctx.globalAlpha = 1;
    ctx.restore();
    /* dim (boss 1 yawn) */
    if (B.dim > 0) { ctx.fillStyle = 'rgba(5,3,20,' + B.dim + ')'; ctx.fillRect(0, 0, W, H); if (B.dim > .3) { ctx.fillStyle = 'rgba(255,255,255,' + (B.dim - .3) + ')'; ctx.font = '800 16px ' + getComputedStyle(document.body).fontFamily; ctx.textAlign = 'center'; ctx.fillText('Lý Trưởng đang ngáp... đừng ngủ theo', W / 2, H * .5); ctx.textAlign = 'left'; } }
    /* big cue text */
    ctx.textAlign = 'center'; ctx.font = '900 ' + Math.round(Math.min(W, H) * .16) + 'px ' + getComputedStyle(document.body).fontFamily;
    if (st === 'go') { ctx.fillStyle = '#c6ff2e'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 8; ctx.strokeText('BỤP!', W / 2, H * .86); ctx.fillText('BỤP!', W / 2, H * .86); }
    else if (st === 'fakesig') { ctx.fillStyle = '#ff2e6e'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 8; ctx.strokeText('ĐỪNG!', W / 2, H * .86); ctx.fillText('ĐỪNG!', W / 2, H * .86); }
    else if (st === 'wait' || st === 'ready') { ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '800 ' + Math.round(Math.min(W, H) * .05) + 'px ' + getComputedStyle(document.body).fontFamily; ctx.fillText('chờ gà gáy...', W / 2, H * .86); }
    ctx.textAlign = 'left';
    /* flash */
    if (B.flash > 0) { ctx.fillStyle = 'rgba(' + B.flashCol + ',' + (B.flash * .55) + ')'; ctx.fillRect(0, 0, W, H); B.flash -= .08; }
  }
  function bubble(x, y, text, col){
    ctx.font = '900 ' + Math.round(SC * 2.6) + 'px ' + getComputedStyle(document.body).fontFamily; var tw = ctx.measureText(text).width + 24, bh = SC * 4.4, bx = Math.max(8, Math.min(W - tw - 8, x - tw / 2));
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, y - bh, tw, bh, 10) : ctx.rect(bx, y - bh, tw, bh); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.lineTo(x, y + 8); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col === '#fff' ? '#1a1026' : col; ctx.textAlign = 'center'; ctx.fillText(text, bx + tw / 2, y - bh * .3); ctx.textAlign = 'left';
  }

  /* ---------- result ---------- */
  var last = null;
  function showResult(won, stars, avg){
    var all = save.hits, r = rankOf(avgOf(all) || 9999);
    last = { won: won, stars: stars, avg: avg, gate: B.n, rank: r };
    $('res-stars').textContent = won ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '💀';
    var vs = '';
    if (challenge && challenge.gate === B.n) vs = won ? (avg < challenge.ms ? ' 🎉 Bạn THẮNG người thách (' + avg + 'ms < ' + challenge.ms + 'ms)!' : ' 😭 Thua người thách (' + challenge.ms + 'ms). Đánh lại đi!') : ' Người thách vẫn đang cười.';
    $('res-title').textContent = won ? (B.e.boss ? 'HẠ TRÙM ' + B.e.name.toUpperCase() + '!' : 'QUA ' + gateName(B.n).toUpperCase()) : 'THUA ' + B.e.name.toUpperCase();
    $('res-sub').textContent = (won ? (WIN_LINES[B.n] || 'Phản xạ trung bình ' + avg + 'ms. ' + (stars === 3 ? 'Hoàn hảo!' : stars === 2 ? 'Thiếu sao: cần dưới 250ms.' : 'Thiếu sao: đừng mất tim, và dưới 250ms.')) : ENEMY_WIN_LINES[Math.floor(Math.random() * 3)] + (avg ? ' Phản xạ của bạn: ' + avg + 'ms.' : '')) + vs;
    $('btn-next').hidden = !won || B.n >= GATES.length; $('btn-next').textContent = B.n >= GATES.length ? '' : 'CỬA ' + (B.n + 1) + ' ▸';
    drawCard(won, stars, avg, r);
    try { $('btn-img').href = $('res-card').toDataURL('image/png'); } catch (e) {}
    var url = SHARE_URL + '#c' + B.n + '-' + (avg || 999);
    $('btn-fb').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(shareText());
    show('s-result');
  }
  function shareText(){ var l = last; return '🥊 BÁ KHÍ • ' + gateName(l.gate) + (l.won ? ' ✅ ' + '★'.repeat(l.stars) : ' ❌') + '\n⚡ Phản xạ ' + (l.avg || '?') + 'ms • Cấp ' + l.rank[1] + ' ' + l.rank[2] + '\nThách bạn qua cửa này nhanh hơn tôi 👉 ' + SHARE_URL + '#c' + l.gate + '-' + (l.avg || 999); }
  function drawCard(won, stars, avg, r){
    var c = $('res-card'), x = c.getContext('2d'), w = c.width, h = c.height, gy = Math.floor(h * .72), ff = getComputedStyle(document.body).fontFamily;
    drawBg(x, B.w, w, h, 3, gy);
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0, 0, w, h);
    drawSprite(x, HERO, w * .12, gy, 12, false);
    drawSprite(x, B.e.spr, w * .62, gy, 12, true, won ? { k: '#333', s: '#777', g: '#777', d: '#666', p: '#777', o: '#777', y: '#888', w: '#999', e: '#777', n: '#666', r: '#777' } : B.e.swap);
    if (won) { x.fillStyle = '#ff2e6e'; x.font = '900 60px ' + ff; x.save(); x.translate(w * .72, gy - 110); x.rotate(-.3); x.fillText('K.O.', 0, 0); x.restore(); }
    x.fillStyle = '#ffd23f'; x.font = '900 54px ' + ff; x.fillText('BÁ KHÍ', 40, 70); x.fillStyle = '#fff'; x.font = '800 22px ' + ff; x.fillText('BATTLE AURA', 44, 98);
    x.textAlign = 'right'; x.font = '900 34px ' + ff; x.fillText(gateName(B.n), w - 40, 64); x.font = '800 20px ' + ff; x.fillStyle = '#c6ff2e'; x.fillText(B.e.boss ? 'TRÙM: ' + B.e.name : 'vs ' + B.e.name, w - 40, 94); x.textAlign = 'left';
    x.fillStyle = 'rgba(11,11,22,.85)'; x.fillRect(0, h - 120, w, 120);
    x.fillStyle = won ? '#c6ff2e' : '#ff2e6e'; x.font = '900 44px ' + ff; x.fillText(won ? '★'.repeat(stars) + '☆'.repeat(3 - stars) + '  ' + (avg || '?') + 'ms' : 'THUA  ' + (avg ? avg + 'ms' : ''), 40, h - 62);
    x.fillStyle = '#fff'; x.font = '800 24px ' + ff; x.fillText(r[1] + ' ' + r[2] + '  ·  ' + HEROES[HERO].name, 40, h - 24);
    x.textAlign = 'right'; x.fillStyle = '#a7a8c6'; x.font = '800 20px ' + ff; x.fillText(SHARE_URL.replace(/^https?:\/\//, ''), w - 40, h - 24); x.textAlign = 'left';
  }
  $('btn-next').addEventListener('click', function(){ sound(); SFX.click(); challenge = null; startGate(Math.min(GATES.length, last.gate + 1)); });
  $('btn-retry').addEventListener('click', function(){ sound(); SFX.click(); startGate(last.gate); });
  $('btn-share').addEventListener('click', function(){ copy(shareText(), 'Đã sao chép! Dán vào Zalo, Messenger, FB…'); });
  $('btn-link').addEventListener('click', function(){ copy(SHARE_URL + '#c' + last.gate + '-' + (last.avg || 999), 'Đã sao chép link thách đấu cửa ' + last.gate + '!'); });

  /* title animation */
  (function tl(){ if (!$('s-title').hidden) drawTitle(); requestAnimationFrame(tl); })();
  window.__bakhi = { startGate: startGate, get: function(){ return B; }, save: save, signal: function(){ if (B) signal(performance.now()); }, tap: tap };
})();
