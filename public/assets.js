/* ===== BÁ KHÍ assets (ADR-003): PNG art with text-sprite fallback ===== */
var ASSETS = (function(){
  var cache = {}, list = {}, base = (typeof CONFIG !== 'undefined' && CONFIG.imgBase) || 'img/';
  try { if (typeof CONFIG !== 'undefined' && CONFIG.img) { for (var i = 0; i < CONFIG.img.length; i++) list[CONFIG.img[i]] = 1; } } catch (e) {}
  function has(key){ return !!list[key]; }
  function load(key){
    if (!has(key)) return Promise.resolve(null);
    if (cache[key]) return cache[key].p;
    var img = new Image(), rec = { img: img, ok: false, p: null };
    rec.p = new Promise(function(res){ img.onload = function(){ rec.ok = true; res(img); }; img.onerror = function(){ rec.ok = false; res(null); }; });
    img.src = base + key + '.png'; cache[key] = rec; return rec.p;
  }
  function img(key){ var r = cache[key]; if (r) return r.ok ? r.img : null; if (has(key)) load(key); return null; }
  function need(keys){ return Promise.all(keys.map(load)); }
  /* keys for one actor: idle/attack/hurt sprites + portrait */
  function actorKeys(k){ return ['s/' + k + '-idle', 's/' + k + '-attack', 's/' + k + '-hurt', 'p/' + k]; }
  /* best sprite for a pose, falling back to idle, then null */
  var POSE_FALLBACK = { down: 'hurt', block: 'idle', jump: 'idle', walk: 'idle', crouch: 'idle', super: 'attack' };
  function sprite(k, pose){ pose = pose || 'idle'; var im0 = img('s/' + k + '-' + pose); if (im0) return im0; var fb = POSE_FALLBACK[pose]; if (fb && fb !== 'idle') { var im1 = img('s/' + k + '-' + fb); if (im1) return im1; } return pose !== 'idle' ? img('s/' + k + '-idle') : null; }
  return { has: has, load: load, img: img, need: need, actorKeys: actorKeys, sprite: sprite, url: function(k){ return base + k + '.png'; }, count: function(){ return Object.keys(list).length; } };
})();
