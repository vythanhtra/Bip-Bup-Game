/* ===== BÁ KHÍ audio: mixer, SFX, character voice blips, per-world music ===== */
var AUDIO = (function(){
  var ctx = null, master, comp, bus = {}, noiseBuf = null, muted = false, gen = 0;
  function init(){
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = .004; comp.release.value = .12;
      master = ctx.createGain(); master.gain.value = muted ? 0 : 1; master.connect(comp); comp.connect(ctx.destination);
      ['music', 'sfx', 'voice'].forEach(function(b){ bus[b] = ctx.createGain(); bus[b].gain.value = b === 'music' ? .55 : b === 'voice' ? .5 : .8; bus[b].connect(master); });
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    } catch (e) { ctx = null; return false; }
  }
  function setMute(m){ muted = m; if (master) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, .02); }
  function now(){ return ctx ? ctx.currentTime : 0; }
  /* --- primitives (all scheduled at absolute time t) --- */
  function osc(b, type, f, t, dur, vol, to, a, d){
    if (!ctx) return; var o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (a || .004)); g.gain.exponentialRampToValueAtTime(.0001, t + dur + (d || 0));
    o.connect(g); g.connect(bus[b]); o.start(t); o.stop(t + dur + (d || 0) + .02); return o;
  }
  function noise(b, t, dur, vol, type, freq, q){
    if (!ctx) return; var s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter(); s.buffer = noiseBuf; s.loop = true;
    f.type = type || 'bandpass'; f.frequency.value = freq || 2000; f.Q.value = q || .8;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .003); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus[b]); s.start(t); s.stop(t + dur + .02);
  }
  function kick(t, v){ osc('music', 'sine', 150, t, .22, v || .5, 40); }
  function snare(t, v){ noise('music', t, .14, (v || .3), 'bandpass', 1800, .6); osc('music', 'triangle', 190, t, .08, (v || .3) * .5, 120); }
  function hat(t, v){ noise('music', t, .04, v || .07, 'highpass', 7000, 1); }
  function crash(t, v){ noise('sfx', t, 1.1, v || .3, 'highpass', 4000, .5); }
  var N = function(m){ return 440 * Math.pow(2, (m - 69) / 12); };
  /* --- SFX --- */
  var sfx = {
    crow: function(t){ t = t || now(); noise('sfx', t, .03, .25, 'highpass', 3000); osc('sfx', 'square', 880, t, .04, .14, 1100); osc('sfx', 'square', 1320, t + .04, .09, .2, 1760); osc('sfx', 'square', 1500, t + .13, .07, .14, 1200); },
    crow2: function(){ var t = now(); sfx.crow(t); sfx.crow(t + .2); },
    quack: function(){ var t = now(); osc('sfx', 'sawtooth', 220, t, .25, .16, 140); osc('sfx', 'sawtooth', 227, t, .25, .08, 150); noise('sfx', t, .2, .12, 'lowpass', 900); },
    sneeze: function(){ var t = now(); noise('sfx', t, .3, .14, 'bandpass', 1200, 1.5); osc('sfx', 'sawtooth', 300, t + .3, .22, .22, 90); noise('sfx', t + .3, .18, .25, 'bandpass', 2500, .7); },
    punch: function(){ var t = now(); osc('sfx', 'sine', 170, t, .15, .45, 40); osc('sfx', 'square', 90, t, .12, .12, 30); noise('sfx', t, .06, .3, 'lowpass', 700); },
    crit: function(){ var t = now(); sfx.punch(); osc('sfx', 'square', 1200, t + .03, .1, .12, 2400); osc('sfx', 'square', 1600, t + .1, .12, .12, 3200); noise('sfx', t, .05, .35, 'bandpass', 3000); crash(t + .05, .18); },
    whiff: function(){ var t = now(); noise('sfx', t, .12, .25, 'highpass', 2000); },
    buzzer: function(){ var t = now(); osc('sfx', 'square', 110, t, .12, .18); osc('sfx', 'square', 115, t, .12, .18); osc('sfx', 'square', 110, t + .16, .12, .18); osc('sfx', 'square', 115, t + .16, .12, .18); },
    hurt: function(){ var t = now(); osc('sfx', 'sawtooth', 140, t, .3, .2, 50); noise('sfx', t, .04, .3, 'lowpass', 1200); },
    forgive: function(){ var t = now(); osc('sfx', 'triangle', 523, t, .12, .14); osc('sfx', 'triangle', 659, t + .12, .2, .14); },
    tapone: function(){ osc('sfx', 'square', 700, now(), .05, .12); },
    phew: function(){ osc('sfx', 'triangle', 440, now(), .3, .12, 330); },
    callDouble: function(){ var t = now(); osc('sfx', 'square', 700, t, .05, .1); osc('sfx', 'square', 700, t + .12, .05, .1); },
    callHold: function(){ osc('sfx', 'triangle', 300, now(), .35, .12, 700); },
    callSpot: function(){ osc('sfx', 'sine', 1800, now(), .2, .12, 1400); },
    callReverse: function(){ var t = now(); osc('sfx', 'sawtooth', 440, t, .12, .1, 220); osc('sfx', 'square', 880, t + .16, .1, .1, 1100); },
    callCount: function(){ var t = now(); [0, .11, .22].forEach(function(d){ osc('sfx', 'square', 700, t + d, .04, .1); }); },
    ghost: function(){ osc('sfx', 'sine', 1200, now(), .12, .08, 600); },
    phase: function(){ var t = now(); noise('sfx', t, 1, .18, 'bandpass', 1500, .5); osc('sfx', 'sawtooth', 110, t, 1, .12, 880); [69, 73, 76, 81, 85].forEach(function(m, i){ osc('sfx', 'square', N(m), t + 1 + i * .09, .3, .12); }); },
    ko: function(){ var t = now(); osc('sfx', 'sine', 27.5, t, 1.2, .5); [45, 52, 57, 64].forEach(function(m){ osc('sfx', 'square', N(m), t, 1.2, .1); }); crash(t, .4); kick(t, .9); [69, 73, 76, 81, 85].forEach(function(m, i){ osc('sfx', 'square', N(m), t + 1.1 + i * .11, .35, .12); }); osc('sfx', 'square', N(85), t + 1.7, 1, .09); },
    lose: function(){ var t = now(); osc('sfx', 'sawtooth', 330, t, .7, .2, 110); [64, 62, 60, 57].forEach(function(m, i){ osc('sfx', 'square', N(m), t + .6 + i * .18, .25, .1); }); },
    win: function(){ var t = now(); [76, 79, 81, 88].forEach(function(m, i){ osc('sfx', 'square', N(m), t + i * .11, .3, .12); }); osc('sfx', 'square', N(88), t + .44, .8, .1); crash(t, .2); },
    click: function(){ osc('sfx', 'square', 600, now(), .05, .06); },
    unlock: function(){ var t = now(); [60, 64, 67, 72, 76].forEach(function(m, i){ osc('sfx', 'triangle', N(m), t + i * .08, .4, .12); }); }
  };
  var chargeOsc = null;
  function chargeStart(){ if (!ctx) return; chargeStop(); var t = now(); var o = ctx.createOscillator(), g = ctx.createGain(), l = ctx.createOscillator(), lg = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(900, t + 2.5); l.frequency.value = 12; lg.gain.value = 30; l.connect(lg); lg.connect(o.frequency); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .1); o.connect(g); g.connect(bus.sfx); o.start(t); l.start(t); chargeOsc = { o: o, l: l, g: g }; }
  function chargeStop(){ if (!chargeOsc) return; var c = chargeOsc, t = now(); chargeOsc = null; c.g.gain.setTargetAtTime(.0001, t, .03); try { c.o.stop(t + .15); c.l.stop(t + .15); } catch (e) {} }
  /* --- voice blips --- */
  function hash(s){ var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff; return h; }
  function say(who, text, opts){
    if (!ctx || !text) return; opts = opts || {}; var p = (typeof VOICES !== 'undefined' && VOICES[who]) || [400, 'square', 1];
    var base = p[0] * (opts.low ? .7 : 1), type = p[1], rate = p[2] * (opts.rate || 1), step = .11 / rate, myGen = ++gen, t = now() + .02;
    var toks = text.normalize('NFD').split(/[\s,.!?:;…]+/).filter(Boolean);
    toks.forEach(function(tk, i){
      if (tk === '') { t += .18; return; }
      var st = /́/.test(tk) ? 4 : /̀/.test(tk) ? -4 : /[̉̃]/.test(tk) ? 'w' : /̣/.test(tk) ? 'h' : 0;
      var bare = tk.replace(/[̀-ͯ]/g, ''), caps = bare.length > 1 && bare === bare.toUpperCase() && /[A-Z]/.test(bare);
      var jit = (hash(bare) % 5) - 2, f = base * Math.pow(2, (jit + (caps ? 5 : 0)) / 12), len = (.06 + Math.min(bare.length, 5) * .006) * (caps ? 1.6 : 1) * (st === 'h' ? .6 : 1), vol = caps ? .35 : .22;
      if (st === 'h') f *= .9;
      var to = st === 4 ? f * Math.pow(2, 4 / 12) : st === -4 ? f * Math.pow(2, -4 / 12) : st === 'w' ? f * .85 : 0;
      var o = osc('voice', type, f, t, len, vol, to, .005);
      if (st === 'w' && o) { o.frequency.setValueAtTime(f * .85, t + len * .5); o.frequency.exponentialRampToValueAtTime(f * 1.1, t + len); }
      if (who === 'tiennu' && i === toks.length - 1 && o) o.frequency.exponentialRampToValueAtTime(f * 1.5, t + len);
      if (who === 'nguoituyet' && /XI/i.test(bare)) noise('voice', t, .2, .2, 'bandpass', 2500);
      t += step * (caps ? 1.5 : 1);
    });
    return myGen;
  }
  /* --- music --- */
  var A = [69,72,74,76,74,72,69,67, 69,72,76,79,76,74,72,69, 64,67,69,72,69,67,64,62, 64,67,69,72,74,72,69,67];
  var Bm = [81,79,76,74,76,79,81,84, 81,79,76,74,72,74,76,79, 76,74,72,69,72,74,76,79, 81,84,81,79,76,74,72,69];
  var BOSS = [57,69,57,68,57,69,57,67, 60,72,60,71,60,72,60,69, 57,69,57,68,57,69,57,67, 62,74,62,73,62,74,62,71];
  var ICE = [74,0,78,0,81,0,78,0, 86,0,81,0,78,0,74,0, 76,0,81,0,83,0,81,0, 88,0,83,0,81,0,76,0];
  var LAVA = [64,65,64,67,64,65,64,71, 64,65,64,67,69,67,65,64, 60,61,60,64,60,61,60,67, 60,61,60,64,65,64,61,60];
  var SKY = [72,0,0,76,0,0,79,0, 83,0,0,79,0,0,76,0, 74,0,0,77,0,0,81,0, 84,0,0,81,0,0,77,0];
  var PATS = {
    1: { bpm: 150, mel: A, bass: [45,45,52,45,48,48,43,43], lead: 'square', drums: 'med', oct: 0 },
    2: { bpm: 150, mel: Bm, bass: [41,41,43,43,45,45,52,52], lead: 'square', drums: 'med', oct: -12, drone: 55 },
    3: { bpm: 120, mel: ICE, bass: [50,50,57,57,52,52,55,55], lead: 'triangle', drums: 'hats', oct: 0, bell: true },
    4: { bpm: 170, mel: LAVA, bass: [40,40,40,40,41,41,43,43], lead: 'square', drums: 'hard', oct: 0, detune: 7 },
    5: { bpm: 140, mel: SKY, bass: [48,48,55,55,53,53,55,55], lead: 'triangle', drums: 'hats', oct: 0, pad: [[60,64,67,71],[57,60,64,67],[53,57,60,65],[55,59,62,67]] }
  };
  var mus = { on: false, pat: null, bpm: 150, step: 0, next: 0, timer: null, state: 'play', boss: false, pedal: null };
  function musicStart(worldId, boss, phase){
    if (!ctx) return; musicStop();
    var p = PATS[worldId] || PATS[1]; mus.pat = p; mus.boss = !!boss; mus.bpm = p.bpm * (boss ? 1.15 : 1) * (phase ? Math.pow(1.07, phase - 1) : 1);
    if (phase) { mus.pat = { bpm: mus.bpm, mel: BOSS, bass: [45,45,45,45,48,48,50,50], lead: 'square', drums: 'hard', oct: 0 }; }
    mus.on = true; mus.step = 0; mus.next = now() + .05; mus.state = 'dialog'; bus.music.gain.setValueAtTime(.55, now());
    mus.timer = setInterval(tick, 25);
  }
  function tick(){
    if (!mus.on || !ctx) return; var p = mus.pat, beat = 60 / mus.bpm, sd = beat / 2;
    while (mus.next < now() + .12) {
      var t = mus.next, k = mus.step % 32, playing = mus.state === 'play' || mus.state === 'dialog', m = p.mel[k];
      if (playing) {
        if (m) { osc('music', p.lead, N(m + p.oct), t, sd * 1.1, .11, 0, .004); if (p.detune) osc('music', p.lead, N(m + p.oct) * Math.pow(2, p.detune / 1200), t, sd * 1.1, .07, 0, .004); if (p.bell) osc('music', 'sine', N(m + 12), t, .6, .06, 0, .005); }
        if (k % 4 === 0) osc('music', 'triangle', N(p.bass[(k / 4) % 8]), t, beat, .16, 0, .005);
        if (p.pad && k % 8 === 0) p.pad[(Math.floor(mus.step / 8)) % 4].forEach(function(n){ osc('music', 'triangle', N(n), t, beat * 4, .035, 0, .05); });
        if (p.drone && k % 2 === 0) osc('music', 'sawtooth', p.drone, t, sd, .05, 0, .01);
        var drums = mus.boss ? 'hard' : p.drums;
        if (mus.state === 'play') {
          if (drums !== 'hats') { if (k % 8 === 0) kick(t, .45); if (k % 8 === 4) snare(t, .25); }
          if (drums === 'hard') { if (k % 2 === 1) hat(t, .06); if (k % 4 === 2) kick(t, .25); if (k % 16 === 14) snare(t + sd / 2, .15); }
          else if (k % 2 === 0) hat(t, drums === 'hats' ? .05 : .045);
        }
      }
      mus.next += sd; mus.step++;
    }
  }
  function musicState(s){
    if (!ctx || !mus.on) return; var t = now();
    if (s === 'wait') { mus.state = 'wait'; bus.music.gain.cancelScheduledValues(t); bus.music.gain.setValueAtTime(bus.music.gain.value, t); bus.music.gain.linearRampToValueAtTime(0.0001, t + .35); }
    else if (s === 'signal') { bus.music.gain.cancelScheduledValues(t); bus.music.gain.setValueAtTime(0.0001, t); pedalStop(); }
    else { /* play: return on next step boundary */ mus.state = s; var delay = Math.max(0, mus.next - t); bus.music.gain.cancelScheduledValues(t); bus.music.gain.setValueAtTime(0.0001, t); bus.music.gain.setValueAtTime(.55, t + delay); }
  }
  function pedalStart(){ if (!ctx || mus.pedal) return; var t = now(), o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = 55; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.06, t + 1.5); o.connect(g); g.connect(bus.music); o.start(t); mus.pedal = { o: o, g: g }; }
  function pedalStop(){ if (!mus.pedal) return; var p = mus.pedal, t = now(); mus.pedal = null; p.g.gain.setTargetAtTime(.0001, t, .01); try { p.o.stop(t + .1); } catch (e) {} }
  function musicStop(){ mus.on = false; if (mus.timer) clearInterval(mus.timer); mus.timer = null; pedalStop(); chargeStop(); if (ctx) { var t = now(); bus.music.gain.cancelScheduledValues(t); bus.music.gain.setTargetAtTime(.0001, t, .08); } }
  document.addEventListener('visibilitychange', function(){ if (!ctx) return; if (document.hidden) ctx.suspend(); else ctx.resume(); });
  return { init: init, setMute: setMute, isMuted: function(){ return muted; }, sfx: sfx, say: say, chargeStart: chargeStart, chargeStop: chargeStop, musicStart: musicStart, musicState: musicState, musicStop: musicStop, pedalStart: pedalStart, pedalStop: pedalStop, ready: function(){ return !!ctx; } };
})();
