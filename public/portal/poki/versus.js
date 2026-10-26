/* BÁ KHÍ — Đấu Tay Đôi chuyền tay (ADR-005 đợt 3): hai người chơi lần lượt cùng một cửa trên một máy, so KO, thời gian KO rồi máu còn lại.
   Tích hợp: VERSUS.start() từ màn chính, game gọi VERSUS.report(r) khi trận của một người kết thúc, VERSUS.stop() khi thoát. */
var VERSUS = (function(){
  var ov = null, M = null, prevHero = null;
  function L(k, v){ return typeof T === 'function' ? T(k, v) : k; }
  function sfx(n){ try { AUDIO.sfx[n](); } catch (e) {} }
  function $$(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; }
  function heroes(){ var out = [], H = window.HEROES || {}; for (var k in H) out.push(k); return out; }
  function gateName(n){ var G = window.GATES, Wd = window.WORLDS; if (!G || !G[n - 1]) return '#' + n; return L('gateName', { n: n, w: Wd[G[n - 1].w - 1].name }); }
  function build(){
    ov = $$('div'); ov.id = 'vs-overlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:60;background:rgba(11,11,22,.96);color:#fff;display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto;font-family:inherit';
    var st = $$('style'); st.textContent = '#vs-overlay .vs-box{width:100%;max-width:420px;display:grid;gap:12px;text-align:center}#vs-overlay h2{margin:0;font-size:22px;color:#ffd23f}#vs-overlay .vs-row{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}#vs-overlay button{font:800 15px inherit;padding:10px 14px;border-radius:12px;border:2px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;cursor:pointer}#vs-overlay button.sel{border-color:#ffd23f;background:rgba(255,210,63,.25)}#vs-overlay button.cta{background:#ffd23f;color:#1a1026;border-color:#ffd23f;font-size:20px;padding:14px 26px}#vs-overlay .vs-sub{opacity:.8;font-size:14px}#vs-overlay .vs-big{font-size:34px;font-weight:900;color:#c6ff2e}';
    ov.appendChild(st); ov.appendChild($$('div', 'vs-box')); document.body.appendChild(ov);
  }
  function box(){ var b = ov.querySelector('.vs-box'); b.innerHTML = ''; return b; }
  function pickScreen(){ var b = box(); b.appendChild($$('h2', null, L('vsPick')));
    M.hero = M.hero || ['tibup', 'hoayen'];
    [1, 2].forEach(function(p){ b.appendChild($$('div', 'vs-sub', L('vsPickP', { p: p }))); var row = $$('div', 'vs-row'); heroes().forEach(function(k){ var bt = $$('button', M.hero[p - 1] === k ? 'sel' : '', HEROES[k].name); bt.addEventListener('click', function(){ sfx('click'); M.hero[p - 1] = k; pickScreen(); }); row.appendChild(bt); }); b.appendChild(row); });
    var gl = $$('div', 'vs-sub', L('vsGateL', { g: gateName(M.gate) })); b.appendChild(gl);
    var rg = $$('div', 'vs-row'); var prev = $$('button', null, '◀'), next = $$('button', null, '▶'); prev.addEventListener('click', function(){ sfx('click'); M.gate = Math.max(1, M.gate - 1); pickScreen(); }); next.addEventListener('click', function(){ sfx('click'); M.gate = Math.min(maxGate(), M.gate + 1); pickScreen(); }); rg.appendChild(prev); rg.appendChild(next); b.appendChild(rg);
    b.appendChild($$('div', 'vs-sub', L('vsRule')));
    var go = $$('button', 'cta', L('vsStart')); go.addEventListener('click', function(){ sfx('click'); handScreen(1); }); b.appendChild(go);
    var q = $$('button', null, L('vsQuit')); q.addEventListener('click', function(){ sfx('click'); api.stop(); if (window.__bakhiHome) window.__bakhiHome(); }); b.appendChild(q);
  }
  function maxGate(){ var s = window.__bakhi && window.__bakhi.save; return Math.max(1, Math.min(window.GATES ? GATES.length : 40, (s && s.unlocked) || 1)); }
  function handScreen(p){ var b = box(); b.appendChild($$('h2', null, L('vsHand', { p: p }))); b.appendChild($$('div', 'vs-sub', HEROES[M.hero[p - 1]].name + ' · ' + gateName(M.gate)));
    var go = $$('button', 'cta', L('vsHandGo')); go.addEventListener('click', function(){ sfx('click'); play(p); }); b.appendChild(go); ov.style.display = 'flex'; }
  function play(p){ ov.style.display = 'none'; window.__bakhi.setHero(M.hero[p - 1]); window.__bakhi.startGate(M.gate, { skipDlg: true, vs: { p: p } }); }
  function resultScreen(){ var r1 = M.res[1], r2 = M.res[2], w = 0;
    if (r1.won !== r2.won) w = r1.won ? 1 : 2; else if (r1.won) w = r1.ms < r2.ms ? 1 : r2.ms < r1.ms ? 2 : 0; else w = r1.hp > r2.hp ? 1 : r2.hp > r1.hp ? 2 : 0;
    M.winner = w; var b = box(); b.appendChild($$('div', 'vs-big', w ? L('vsWinner', { p: w }) : L('vsDrawT')));
    [1, 2].forEach(function(p){ var r = M.res[p]; b.appendChild($$('div', 'vs-sub', L('vsLine', { p: p, h: r.hero, r: r.won ? L('vsKO') : L('vsFell'), ms: fmt(r.ms), hp: r.hp }))); });
    var again = $$('button', 'cta', L('vsAgain')); again.addEventListener('click', function(){ sfx('click'); M.res = {}; pickScreen(); }); b.appendChild(again);
    var sh = $$('button', null, L('vsShare')); sh.addEventListener('click', function(){ sfx('click'); var txt = L('vsShareTxt', { g: gateName(M.gate), a: r1.hero, b: r2.hero, w: w ? L('vsWinner', { p: w }) : L('vsDrawT'), u: (window.__bakhi && window.__bakhi.shareUrl) || location.href.split('?')[0] }); try { navigator.clipboard.writeText(txt); } catch (e) {} if (navigator.share) { try { navigator.share({ text: txt }); } catch (e) {} } }); b.appendChild(sh);
    var q = $$('button', null, L('vsQuit')); q.addEventListener('click', function(){ sfx('click'); api.stop(); if (window.__bakhiHome) window.__bakhiHome(); }); b.appendChild(q);
    ov.style.display = 'flex'; try { AUDIO.sfx.win(); } catch (e) {} }
  function fmt(ms){ var sx = (ms / 1000).toFixed(1); return (document.documentElement.lang === 'vi' ? sx.replace('.', ',') : sx) + 's'; }
  var api = {
    start: function(){ if (!ov) build(); var cur = window.__bakhi && window.__bakhi.get(); prevHero = window.__bakhi ? window.__bakhi.hero() : null; M = { gate: Math.min(2, maxGate()), hero: ['tibup', 'hoayen'], res: {} }; pickScreen(); ov.style.display = 'flex'; },
    report: function(r){ if (!M) return; M.res[r.p] = r; if (r.p === 1) handScreen(2); else resultScreen(); },
    stop: function(){ if (ov) ov.style.display = 'none'; if (prevHero && window.__bakhi) window.__bakhi.setHero(prevHero); M = null; },
    state: function(){ return M; }
  };
  return api;
})();
