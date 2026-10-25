/* BÁ KHÍ — Đấu Tay Đôi: 2 người, 1 điện thoại. Self-contained overlay; integrates via VERSUS.start()/stop(). */
var VERSUS = (function(){
  var ov = null, cv = null, ctx = null, W = 0, H = 0, DPR = 1, raf = 0, S = null, parts = [], fx = [], started = false, toastEl = null, btnBar = null;
  var P = [null, { k: 'tibup', name: 'Tí Bụp', col: '#ffd23f' }, { k: 'hoayen', name: 'Hỏa Yến', col: '#ff3b3b' }];
  function L(k, v){ return typeof T === 'function' ? T(k, v) : k; }
  var FF = function(){ return getComputedStyle(document.body).fontFamily; };
  var GL = {};
  function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
  function sfx(n){ try { AUDIO.sfx[n](); } catch (e) {} }
  function say(t, o){ try { AUDIO.say('gabip', t, o || { rate: 1.2 }); } catch (e) {} }
  function sound(){ try { AUDIO.init(); } catch (e) {} }
  function toast(m){ toastEl.textContent = m; toastEl.style.opacity = '1'; clearTimeout(toastEl._t); toastEl._t = setTimeout(function(){ toastEl.style.opacity = '0'; }, 2200); }
  function build(){
    P[1].name = L('vsP1'); P[2].name = L('vsP2'); GL.win = L('vsGLwin'); GL.early = L('vsGLearly'); GL.fake = L('vsGLfake'); GL.end = L('vsGLend');
    ov = document.createElement('div'); ov.id = 'vs-overlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:60;background:#0b0b16;touch-action:none;user-select:none;-webkit-user-select:none;overflow:hidden';
    cv = document.createElement('canvas'); cv.id = 'vs-canvas'; cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;touch-action:none;display:block'; ov.appendChild(cv); ctx = cv.getContext('2d');
    var bs = 'position:absolute;z-index:2;font:800 14px ' + FF() + ';padding:8px 12px;border-radius:12px;border:2px solid #ffd23f;background:rgba(11,11,22,.85);color:#fff;cursor:pointer';
    var q = document.createElement('button'); q.id = 'vs-quit'; q.type = 'button'; q.textContent = L('vsQuit'); q.style.cssText = bs + ';right:10px;top:50%;transform:translateY(-50%)'; ov.appendChild(q);
    q.addEventListener('pointerdown', function(e){ e.stopPropagation(); }); q.addEventListener('click', function(e){ e.stopPropagation(); sfx('click'); api.stop(); if (window.__bakhiHome) window.__bakhiHome(); });
    btnBar = document.createElement('div'); btnBar.id = 'vs-end'; btnBar.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;display:none;gap:10px;flex-direction:column;align-items:center';
    var again = document.createElement('button'); again.id = 'vs-again'; again.type = 'button'; again.textContent = L('vsAgain'); again.style.cssText = bs + ';position:static;font-size:20px;padding:14px 26px;background:#c6ff2e;color:#0b0b16;border-color:#c6ff2e';
    var share = document.createElement('button'); share.id = 'vs-share'; share.type = 'button'; share.textContent = L('vsShare'); share.style.cssText = bs + ';position:static';
    btnBar.appendChild(again); btnBar.appendChild(share); ov.appendChild(btnBar);
    [again, share].forEach(function(b){ b.addEventListener('pointerdown', function(e){ e.stopPropagation(); }); });
    again.addEventListener('click', function(e){ e.stopPropagation(); sfx('click'); newMatch(); });
    share.addEventListener('click', function(e){ e.stopPropagation(); copy(shareText()); });
    toastEl = document.createElement('div'); toastEl.id = 'vs-toast'; toastEl.style.cssText = 'position:absolute;left:50%;bottom:12%;transform:translateX(-50%);z-index:4;background:#ffd23f;color:#0b0b16;font:800 15px ' + FF() + ';padding:10px 14px;border-radius:12px;opacity:0;transition:opacity .2s;pointer-events:none;max-width:90%;text-align:center'; ov.appendChild(toastEl);
    document.body.appendChild(ov);
    cv.addEventListener('pointerdown', function(e){ e.preventDefault(); sound(); onDown(e.clientY < H / 2 ? 2 : 1, e.pointerId, e.timeStamp); });
    ['pointerup', 'pointercancel'].forEach(function(ev){ cv.addEventListener(ev, function(e){ e.preventDefault(); onUp(e.pointerId); }); });
    document.addEventListener('keydown', function(e){ if (!started || e.repeat) return; if (e.code === 'KeyA') { e.preventDefault(); sound(); onDown(2, 'kA', e.timeStamp); } if (e.code === 'KeyL') { e.preventDefault(); sound(); onDown(1, 'kL', e.timeStamp); } });
    document.addEventListener('keyup', function(e){ if (!started) return; if (e.code === 'KeyA') onUp('kA'); if (e.code === 'KeyL') onUp('kL'); });
    window.addEventListener('resize', resize);
  }
  function resize(){ if (!cv) return; DPR = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight; cv.width = Math.floor(W * DPR); cv.height = Math.floor(H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  function copy(text){ var ok = L('copied'); if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function(){ toast(ok); }, function(){ toast(L('copyFail')); }); else toast(L('copyFail')); }
  function shareText(){ var w = S.winner, l = w === 1 ? 2 : 1, best = Math.min.apply(null, S.ms[1].concat(S.ms[2]).filter(function(x){ return x > 0; }).concat([9999])); return L('vsShareText', { w: P[w].name, a: S.wins[w], b: S.wins[l], l: P[l].name, ms: best < 9999 ? best + 'ms' : '?' }); }
  function avg(a){ if (!a.length) return 0; var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return Math.round(s / a.length); }
  /* ---- state machine: ready → wait → (fakesig|go) → result → wait ... → end ---- */
  function newMatch(){ S = { state: 'ready', t0: performance.now(), wins: [0, 0, 0], ms: [null, [], []], round: 0, fake: false, forceFake: null, tSig: 0, holding: {}, holdSince: [0, 0, 0], winner: 0, loser: 0, roundMs: [0, 0, 0], label: '', freezeUntil: 0, shake: 0, flash: 0, flashCol: '', bubble: '', bubbleT: 0, anim: 0 }; parts = []; fx = []; btnBar.style.display = 'none'; try { AUDIO.musicStart(2, false, 0); AUDIO.musicState('wait'); } catch (e) {} }
  function scheduleRound(now){ S.round++; S.state = 'wait'; S.t0 = now; S.fake = S.forceFake !== null ? S.forceFake : Math.random() < .25; S.forceFake = null; S.tSig = now + 900 + Math.pow(Math.random(), 1.7) * 2300; S.bubble = pick(L('idle')); S.bubbleT = now; try { AUDIO.musicState('wait'); } catch (e) {} }
  function signal(now){ S.tSig = now; S.flash = 1; try { AUDIO.musicState('signal'); } catch (e) {}
    if (S.fake) { S.state = 'fakesig'; S.flashCol = '255,46,110'; sfx('quack'); S.bubble = L('vsQuack'); S.bubbleT = now; return; }
    S.state = 'go'; S.flashCol = '198,255,46'; sfx('crow'); S.bubble = L('vsBeep'); S.bubbleT = now; try { if (navigator.vibrate) navigator.vibrate(25); } catch (e) {} }
  function roundOver(winner, label, now, msW, msL, kind){ S.early = kind === 'early';
    if (window.__vslog) window.__vslog.push({ t: Math.round(now), st: S.state, round: S.round, winner: winner, label: label, msW: msW, msL: msL, stack: (new Error()).stack.split('\n')[2] });
    var loser = winner === 1 ? 2 : 1; S.state = 'result'; S.t0 = now; S.winner = winner; S.loser = loser; S.label = label; S.wins[winner]++;
    S.roundMs[winner] = msW; S.roundMs[loser] = msL; if (msW > 0) S.ms[winner].push(msW); if (msL > 0) S.ms[loser].push(msL);
    S.freezeUntil = now + 90; S.shake = 1; S.anim = now; try { AUDIO.musicState('play'); } catch (e) {}
    if (S.early) { sfx('buzzer'); sfx('hurt'); S.bubble = pick(GL.early); } else { sfx(msW < 180 ? 'crit' : 'punch'); S.bubble = S.wins[winner] + ' - ' + S.wins[loser] + '! ' + pick(GL.win); }
    S.bubbleT = now + 150; setTimeout(function(){ say(S.bubble); }, 150); burst(W / 2, H / 2, '#fff', 18);
    var tok = S; setTimeout(function(){ if (S !== tok) return; if (S.wins[winner] >= 3) endMatch(); else scheduleRound(performance.now()); }, 1500);
  }
  function endMatch(){ S.state = 'end'; S.t0 = performance.now(); sfx('win'); setTimeout(function(){ say(pick(GL.end)); }, 400); try { AUDIO.musicStop(); } catch (e) {} btnBar.style.display = 'flex'; }
  function onDown(pl, id, ts){
    if (!S) return; var now = ts && ts > 0 ? ts : performance.now();
    S.holding[id] = pl; if (!S.holdSince[pl]) S.holdSince[pl] = now;
    if (S.state === 'ready' || S.state === 'end' || S.state === 'result') return;
    if (now < S.freezeUntil) return;
    if (S.state === 'wait') { if (now - S.t0 < 350) return; roundOver(pl === 1 ? 2 : 1, L('vsEarlyLbl'), now, 0, 0, 'early'); return; }
    if (S.state === 'fakesig') { roundOver(pl === 1 ? 2 : 1, L('vsFakeLbl'), now, 0, 0, 'early'); return; }
    if (S.state === 'go') { var ms = Math.round(now - S.tSig); S.state = 'golate'; S.goWinner = pl; S.goMs = ms; S.goT = now; var tok = S; setTimeout(function(){ if (S === tok && S.state === 'golate') roundOver(pl, L('vsBoopLbl'), performance.now(), ms, 0); }, 260); return; }
    if (S.state === 'golate' && pl !== S.goWinner) { var ms2 = Math.round(now - S.tSig); roundOver(S.goWinner, L('vsBoopLbl'), now, S.goMs, ms2); }
  }
  function onUp(id){ if (!S) return; var pl = S.holding[id]; delete S.holding[id]; if (pl) { var still = false; for (var k in S.holding) if (S.holding[k] === pl) still = true; if (!still) S.holdSince[pl] = 0; } }
  function burst(x, y, col, n){ for (var i = 0; i < n; i++) { var a = Math.random() * 6.28, sp = 2 + Math.random() * 5; parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, life: 1, col: col, sz: 3 + Math.random() * 4 }); } }
  /* ---- render ---- */
  function loop(now){
    if (!started) return; raf = requestAnimationFrame(loop);
    if (now < S.freezeUntil) { S.lastF = now; return; }
    var dt = Math.min(50, now - (S.lastF || now)) / 16.7; S.lastF = now; var t = now / 1000, st = S.state;
    if (st === 'ready') { var both = S.holdSince[1] && S.holdSince[2] && now - S.holdSince[1] > 600 && now - S.holdSince[2] > 600; if (both) { sfx('click'); say(L('vsReady')); S.state = 'count'; S.t0 = now; } }
    if (st === 'count' && now - S.t0 > 900) scheduleRound(now);
    if (st === 'wait' && now >= S.tSig) signal(now);
    if (st === 'fakesig' && now - S.tSig > 700) { sfx('phew'); S.state = 'wait'; S.t0 = now - 500; S.tSig = now + 500 + Math.random() * 900; S.fake = false; S.bubble = pick(GL.fake); S.bubbleT = now; say(S.bubble); }
    if (st === 'go' && now - S.tSig > 1500) { S.state = 'wait'; S.t0 = now; S.tSig = now + 800 + Math.random() * 1200; S.bubble = L('vsSleep'); S.bubbleT = now; say(S.bubble); try { AUDIO.musicState('wait'); } catch (e) {} }
    var shake = S.shake > 0 ? (Math.random() - .5) * 12 * S.shake : 0; S.shake = Math.max(0, S.shake - .06 * dt);
    ctx.save(); ctx.translate(shake, shake * .5);
    drawHalf(2, now, t); drawHalf(1, now, t);
    ctx.restore();
    /* centre band: referee + net */
    ctx.fillStyle = '#0b0b16'; ctx.fillRect(0, H / 2 - 3, W, 6);
    var csc = Math.max(3, Math.min(6, Math.floor(W / 90))), rsz = spriteSize('gabip'), rx = W / 2 - rsz.w * csc / 2, ry = H / 2 + rsz.h * csc / 2;
    var flap = (st === 'go' && now - S.tSig < 500) ? Math.sin(t * 60) : Math.sin(t * 3) * .3;
    ctx.fillStyle = '#ffd23f'; ctx.fillRect(rx - csc * 1.5, ry - csc * 8 + flap * csc * 2, csc * 2, csc * 1.2); ctx.fillRect(rx + rsz.w * csc - csc * .5, ry - csc * 8 + flap * csc * 2, csc * 2, csc * 1.2);
    drawSprite(ctx, 'gabip', rx, ry - (st === 'go' && now - S.tSig < 300 ? Math.sin((now - S.tSig) / 300 * Math.PI) * csc * 4 : 0), csc, false);
    if (S.bubble && now - S.bubbleT < 1600 && now >= S.bubbleT) { for (var side = 1; side <= 2; side++) { ctx.save(); if (side === 2) { ctx.translate(W, H); ctx.rotate(Math.PI); } bubble(W / 2, H / 2 - rsz.h * csc / 2 - csc * 3, S.bubble, st === 'fakesig' ? '#ff2e6e' : /BÍP/.test(S.bubble) ? '#5a8f00' : '#1a1026'); ctx.restore(); } }
    for (var i = parts.length - 1; i >= 0; i--) { var p = parts[i]; p.x += p.vx * dt; p.y += p.vy * dt; if (p.grav) p.vy += p.grav * dt; p.life -= (p.conf ? .012 : .03) * dt; if (p.life <= 0 || p.y > H) { parts.splice(i, 1); continue; } ctx.globalAlpha = Math.min(1, p.life); ctx.fillStyle = p.col; ctx.fillRect(p.x, p.y, p.sz, p.sz * (p.conf ? .6 : 1)); } ctx.globalAlpha = 1;
    if (S.flash > 0) { ctx.fillStyle = 'rgba(' + S.flashCol + ',' + (S.flash * .55) + ')'; ctx.fillRect(0, 0, W, H); S.flash -= .08 * dt; }
    if (st === 'end' && Math.random() < .7) parts.push({ x: Math.random() * W, y: -10, vx: (Math.random() - .5) * 2, vy: 3 + Math.random() * 4, life: 1.2, col: pick(['#ffd23f', '#c6ff2e', '#ff5fa2', '#7fe7ff', '#fff']), sz: 5 + Math.random() * 5, conf: true });
  }
  /* draw one player's half in its own frame: (0,0)-(W,hh) with the player's character on the left, facing the centre line at the bottom; top half is rotated 180° */
  function drawHalf(pl, now, t){
    var hh = H / 2, st = S.state, me = P[pl], op = P[pl === 1 ? 2 : 1], SC = Math.max(4, Math.min(9, Math.floor(Math.min(W / 72, hh / 60))));
    ctx.save(); if (pl === 2) { ctx.translate(W, hh); ctx.rotate(Math.PI); } else ctx.translate(0, hh);
    ctx.beginPath(); ctx.rect(0, 0, W, hh); ctx.clip();
    var gy = Math.floor(hh * .82); drawBg(ctx, WORLDS[pl === 1 ? 0 : 1], W, hh, t, gy);
    /* my character on the left, opponent (greyed) on the right, both facing centre */
    var hx = W * .22, ex = W * .62, a = { sx: 1 + Math.sin(t * 6) * .025, sy: 1 - Math.sin(t * 6) * .025, dx: 0, dy: 0, rot: 0 }, b = { sx: 1, sy: 1, dx: 0, dy: 0, rot: 0 };
    if (st === 'result') { var k = Math.min(1, (now - S.anim) / 420), pk = Math.sin(k * Math.PI), early = S.early;
      if (S.winner === pl) { a.dx = pk * (ex - hx - SC * 10) * (early ? .2 : 1); a.sx = 1 + pk * .3; a.sy = 1 - pk * .15; a.rot = -pk * .12; b.dx = pk * SC * 6; b.rot = pk * .4; b.sx = k < .25 ? 1.25 : 1; b.sy = k < .25 ? .75 : 1; }
      else { a.dx = -pk * SC * 6; a.rot = -pk * .35; a.sy = 1 - pk * .1; b.dx = -pk * (ex - hx - SC * 10) * (early ? .2 : 1); } }
    if (st === 'go' && now - S.tSig < 110) { a.sy = .86; a.sx = 1.12; }
    if (st === 'end') { if (S.winner === pl) { a.dy = -Math.abs(Math.sin(now / 110)) * SC * 5; } else { a.rot = -Math.PI / 2; a.dx = -SC * 6; } }
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(hx + SC * 7, gy + 4, SC * 7, SC * 1.5, 0, 0, 7); ctx.ellipse(ex + SC * 7, gy + 4, SC * 7, SC * 1.5, 0, 0, 7); ctx.fill();
    var grey = { k: '#333', s: '#777', g: '#777', d: '#666', p: '#777', o: '#777', y: '#888', w: '#999', e: '#777', n: '#666', r: '#777', b: '#777', c: '#888', h: '#555', m: '#777', q: '#777', x: '#777', G: '#666' };
    actor(op.k, ex, gy, SC, true, grey, b); actor(me.k, hx, gy, SC, false, null, a);
    /* HUD: name + score dots */
    var ff = FF(), hy = hh - 12; ctx.textAlign = 'left'; ctx.font = '900 ' + Math.round(SC * 3) + 'px ' + ff; ctx.fillStyle = me.col; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 4; ctx.strokeText(me.name, 14, hy); ctx.fillText(me.name, 14, hy);
    var nw = ctx.measureText(me.name).width; for (var i = 0; i < 3; i++) { ctx.fillStyle = i < S.wins[pl] ? '#c6ff2e' : 'rgba(255,255,255,.3)'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(14 + nw + SC * 2 + i * SC * 2.4, hy - SC * 1.1, SC * .9, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.textAlign = 'right'; ctx.font = '800 ' + Math.round(SC * 2) + 'px ' + ff; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 3; var ht = L('vsRound', { r: Math.max(1, S.round), a: S.wins[pl], b: S.wins[pl === 1 ? 2 : 1] }); ctx.strokeText(ht, W - 14, hy); ctx.fillText(ht, W - 14, hy);
    /* cue text */
    ctx.textAlign = 'center'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 8; var big = Math.round(Math.min(W, hh) * .17), cy = hh * .42;
    ctx.font = '900 ' + big + 'px ' + ff;
    if (st === 'ready') { ctx.fillStyle = '#fff'; ctx.font = '800 ' + Math.round(big * .36) + 'px ' + ff; var held = S.holdSince[pl] && now - S.holdSince[pl] > 0; var rt = held ? L('vsHeld') : L('vsPut'); ctx.strokeText(rt, W / 2, cy); ctx.fillText(rt, W / 2, cy); ctx.font = '800 ' + Math.round(big * .26) + 'px ' + ff; ctx.strokeText(L('vsBoth'), W / 2, cy + big * .5); ctx.fillText(L('vsBoth'), W / 2, cy + big * .5);
      if (held) { ctx.fillStyle = me.col; ctx.beginPath(); ctx.arc(W / 2, cy + big * 1.1, SC * 2.5 + Math.sin(t * 10) * 3, 0, 7); ctx.fill(); } }
    else if (st === 'count') { ctx.fillStyle = '#ffd23f'; ctx.strokeText(L('vsGo'), W / 2, cy); ctx.fillText(L('vsGo'), W / 2, cy); }
    else if (st === 'wait') { ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '800 ' + Math.round(big * .36) + 'px ' + ff; ctx.strokeText(L('vsWait'), W / 2, cy); ctx.fillText(L('vsWait'), W / 2, cy); }
    else if (st === 'fakesig') { ctx.fillStyle = '#ff2e6e'; ctx.strokeText(L('cueDont'), W / 2, cy); ctx.fillText(L('cueDont'), W / 2, cy); }
    else if (st === 'go' || st === 'golate') { ctx.fillStyle = '#c6ff2e'; ctx.strokeText(L('vsBoop'), W / 2, cy); ctx.fillText(L('vsBoop'), W / 2, cy); }
    else if (st === 'result') { var won = S.winner === pl, early = S.early, mine = S.roundMs[pl];
      ctx.fillStyle = won ? '#c6ff2e' : '#ff2e6e'; ctx.font = '900 ' + Math.round(big * .8) + 'px ' + ff; var txt = won ? (early ? L('vsOpp', { l: S.label.replace(/[!💀🦆].*$/, '') }) : (mine < 180 ? L('vsCrit') : L('vsBoop'))) : (early && S.loser === pl ? S.label : (mine > 0 ? L('vsSlow') : L('vsAsleep'))); var tw0 = ctx.measureText(txt).width; if (tw0 > W - 30) ctx.font = '900 ' + Math.round(big * .8 * (W - 30) / tw0) + 'px ' + ff; ctx.strokeText(txt, W / 2, cy); ctx.fillText(txt, W / 2, cy);
      ctx.fillStyle = '#fff'; ctx.font = '800 ' + Math.round(big * .36) + 'px ' + ff; var sub = mine > 0 ? mine + 'ms' : (early ? (won ? L('vsPlus') : L('vsMinus')) : L('vsZzz')); ctx.strokeText(sub, W / 2, cy + big * .55); ctx.fillText(sub, W / 2, cy + big * .55); }
    else if (st === 'end') { var w2 = S.winner === pl; ctx.fillStyle = w2 ? '#c6ff2e' : '#ff2e6e'; ctx.font = '900 ' + Math.round(big * .75) + 'px ' + ff; var et = w2 ? L('vsWon', { n: me.name.toUpperCase() }) : L('vsLost', { a: S.wins[pl], b: S.wins[pl === 1 ? 2 : 1] }); ctx.strokeText(et, W / 2, cy); ctx.fillText(et, W / 2, cy);
      ctx.fillStyle = '#fff'; ctx.font = '800 ' + Math.round(big * .3) + 'px ' + ff; var es = L('vsAvg', { a: avg(S.ms[pl]) || '?', b: avg(S.ms[pl === 1 ? 2 : 1]) || '?' }); ctx.strokeText(es, W / 2, cy + big * .5); ctx.fillText(es, W / 2, cy + big * .5); }
    ctx.textAlign = 'left'; ctx.restore();
  }
  function actor(name, x, y, sc, flip, swap, a){ var sz = spriteSize(name), w = sz.w * sc, cx = x + w / 2; ctx.save(); ctx.translate(cx + (a.dx || 0), y + (a.dy || 0)); ctx.rotate(a.rot || 0); ctx.scale(a.sx || 1, a.sy || 1); drawSprite(ctx, name, -w / 2, 0, sc, flip, swap); ctx.restore(); }
  function bubble(x, y, text, col){ ctx.font = '900 15px ' + FF(); var tw = ctx.measureText(text).width + 24, bh = 28, bx = Math.max(8, Math.min(W - tw - 8, x - tw / 2)); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1a1026'; ctx.lineWidth = 3; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(bx, y - bh, tw, bh, 10); else ctx.rect(bx, y - bh, tw, bh); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.lineTo(x, y + 8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.fillText(text, bx + tw / 2, y - bh * .3); ctx.textAlign = 'left'; }
  var api = {
    start: function(){ if (!ov) build(); ov.style.display = 'block'; resize(); started = true; newMatch(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); },
    stop: function(){ started = false; cancelAnimationFrame(raf); if (ov) ov.style.display = 'none'; try { AUDIO.musicStop(); } catch (e) {} }
  };
  window.__vs = { get: function(){ return S; }, tap: function(pl){ var id = 't' + pl + Math.random(); onDown(pl, id, performance.now()); setTimeout(function(){ onUp(id); }, 30); }, hold: function(pl, on){ if (on) onDown(pl, 'h' + pl, performance.now()); else onUp('h' + pl); }, signal: function(){ if (S && S.state === 'wait') signal(performance.now()); }, fake: function(b){ if (S) { S.forceFake = !!b; if (S.state === 'wait') S.fake = !!b; } } };
  return api;
})();
