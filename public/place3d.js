/* ===== BÁ KHÍ real places in 3D (ADR-010) =====
   A WebGL canvas (#scene3d) under the 2D game canvas, only with ?places=1 in the art edition. The fight, the fighters and the HUD stay 2D:
   while a scene is live, drawBg() leaves the 2D canvas transparent and this layer shows the place behind it.
   Camera: during a gate's opening scene (B.cine) it flies round the place and settles on the fight view; in a fight it stays side-on and only
   drifts with the 2D camera. Drag to look round in the opening scene or while paused; a plain tap still reaches the game.
   Any failure (no WebGL, a file that does not load, a slow device) falls back to the 2D backgrounds for the rest of the session. */
var PLACE3D = (function(){
  var FLAG = false; try { FLAG = /[?&]places=1(&|$)/.test(location.search); } catch (e) {}
  var REDUCE = false; try { REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var SLOW_MS = (typeof window.__P3D_SLOW === 'number' ? window.__P3D_SLOW : 22), SLOW_WIN = 3000, GONE = 1200;   /* __P3D_SLOW, __P3D_NOPOST: tests on software GL only */   /* ADR-010 §6: average frame over 22 ms for 3 s of fighting -> 2D */
  var st = { failed: false, why: '', key: null, n: 0, ready: false, THREE: null, sc: null, renderer: null, cam: null, canvas: null, last: 0, f: null,
    yaw: 0, pitch: 0, drag: null, slow: [], prevT: 0, path: null, lastKey: '', skip: 0 };
  function now(){ return performance.now(); }
  function base(){ var b = (typeof CONFIG !== 'undefined' && CONFIG.imgBase) || 'img/'; return b.replace(/img\/$/, ''); }
  function enabled(){ return FLAG && !st.failed && typeof PLACES !== 'undefined' && typeof ASSETS !== 'undefined' && ASSETS.count() > 0 && !(typeof CONFIG !== 'undefined' && CONFIG.portal); }
  function place(n){ return enabled() && PLACES[n] ? PLACES[n] : null; }
  function canvas(){ if (!st.canvas) st.canvas = document.getElementById('scene3d'); return st.canvas; }
  function hide(){ var c = canvas(); if (c) c.hidden = true; }
  function webgl(){ try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
  function fallback(why){ if (st.failed) return; st.failed = true; st.why = String(why || '').slice(0, 80); st.ready = false; hide(); try { A.ev('p3d_fallback', { x: st.why.slice(0, 40) }); } catch (e) {} }
  function dispose(){ if (!st.sc) return; try { st.sc.scene.traverse(function(o){ if (o.geometry) o.geometry.dispose(); var m = o.material; if (m) (m.length ? m : [m]).forEach(function(x){ if (x.map) x.map.dispose(); x.dispose(); }); }); } catch (e) {} st.sc = null; }

  /* called by startGate(): load and build the scene of gate n, or hide when the gate has none */
  function gate(n){ var P = place(n); st.ready = false; st.n = n; st.key = P ? P.key : null; if (!P) { hide(); return null; }
    if (!webgl()) { fallback('no-webgl'); return null; }
    var key = P.key, root = base();
    var phone = Math.min(innerWidth, innerHeight) < 600, A = root + 'vendor/three-addons/postprocessing/';
    var post = phone || window.__P3D_NOPOST ? [] : ['EffectComposer', 'RenderPass', 'GTAOPass', 'OutputPass', 'UnrealBloomPass', 'ShaderPass', 'BokehPass'].map(function(n){ return import(A + n + '.js'); });   /* desktop only: AO, a soft bloom, a vignette */
    return Promise.all([import(root + 'vendor/three.module.min.js'), import(root + 'places/' + key + '.js')].concat(post)).then(function(m){
      if (st.key !== key || st.failed) return; var add = {}; m.slice(2).forEach(function(x){ for (var k in x) add[k] = x[k]; }); setup(m[0], m[1], add); }).catch(function(e){ fallback('load: ' + (e && e.message || e)); });
  }
  function setup(THREE, mod, add){
    try {
      var c = canvas(); if (!c) throw new Error('no #scene3d');
      var phone = Math.min(innerWidth, innerHeight) < 600;
      if (!st.renderer) { st.renderer = new THREE.WebGLRenderer({ canvas: c, antialias: !phone, powerPreference: 'high-performance' }); st.renderer.outputColorSpace = THREE.SRGBColorSpace;
        st.renderer.toneMapping = THREE.ACESFilmicToneMapping; st.renderer.toneMappingExposure = 1.05; st.renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
      st.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); st.renderer.shadowMap.enabled = !phone;
      dispose(); st.THREE = THREE; st.sc = mod.build(THREE, { phone: phone });
      st.cam = new THREE.PerspectiveCamera(42, 1, .1, 600);
      var ud = st.sc.scene.userData; st.renderer.toneMappingExposure = ud.exposure || 1.05; st.renderer.toneMapping = ud.tone === 'agx' && THREE.AgXToneMapping !== undefined ? THREE.AgXToneMapping : THREE.ACESFilmicToneMapping;   /* AgX: the softer film curve, per scene */
      if (ud.sky) { var pm = new THREE.PMREMGenerator(st.renderer), es = new THREE.Scene(); es.add(ud.sky.clone()); if (st.envRT) st.envRT.dispose(); st.envRT = pm.fromScene(es, 0, .1, 1000); st.sc.scene.environment = st.envRT.texture; pm.dispose(); }   /* light from the sky itself */
      st.comp = null; st.sceneCalls = 0; st.sceneTris = 0;
      if (add && add.EffectComposer) { var cp = new add.EffectComposer(st.renderer), w0 = innerWidth, h0 = innerHeight; cp.addPass(new add.RenderPass(st.sc.scene, st.cam));
        var fx = []; st.sc.scene.traverse(function(o){ if (o.userData.fx) fx.push(o); }); var vis = function(v){ return { enabled: true, needsSwap: false, renderToScreen: false, setSize: function(){}, dispose: function(){}, render: function(){ fx.forEach(function(o){ o.visible = v; }); } }; };   /* sprites (mist, smoke, birds) have no real depth: hide them from the AO pass */
        cp.addPass(vis(false)); var ao = new add.GTAOPass(st.sc.scene, st.cam, w0, h0); ao.updateGtaoMaterial({ radius: .9, distanceExponent: 1.2, thickness: 1.2, scale: 1.1, samples: 12 }); ao.blendIntensity = .85; cp.addPass(ao);
        if (ud.dof && add.BokehPass) { st.bokeh = new add.BokehPass(st.sc.scene, st.cam, { focus: 18, aperture: ud.dof.aperture || .0012, maxblur: ud.dof.maxblur || .007 }); cp.addPass(st.bokeh); } else st.bokeh = null;   /* depth of field: the fighters' plane sharp, the place behind soft */
        cp.addPass(vis(true));
        cp.addPass(new add.UnrealBloomPass(new THREE.Vector2(w0, h0), .22, .55, .9)); cp.addPass(new add.OutputPass());
        cp.addPass(new add.ShaderPass({ uniforms: { tDiffuse: { value: null }, amt: { value: .32 }, sat: { value: ud.sat || 1 } }, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
          fragmentShader: 'uniform sampler2D tDiffuse; uniform float amt; uniform float sat; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); float l = dot(c.rgb, vec3(.2126, .7152, .0722)); c.rgb = mix(vec3(l), c.rgb, sat); vec2 d = vUv - .5; float v = 1. - amt * smoothstep(.25, .85, dot(d, d) * 2.2); c.rgb *= v; gl_FragColor = c; }' }));
        st.comp = cp; }
      st.renderer.info.autoReset = false;
      st.path = new THREE.CatmullRomCurve3(st.sc.intro.map(function(p){ return new THREE.Vector3(p[0], p[1], p[2]); }));
      st.yaw = st.pitch = 0; st.slow = []; st.prevT = 0; st.lastKey = ''; st.shown = false; st.ready = true;
    } catch (e) { fallback('build: ' + (e && e.message || e)); }
  }
  function live(){ return !!(st.ready && !st.failed && now() - st.last < GONE); }

  function fightPos(aspect){ var p = st.sc.fight.pos, z = aspect < .8 ? p[2] / Math.max(.45, aspect * 1.25) : p[2]; return new st.THREE.Vector3(p[0], aspect < .8 ? p[1] + 1.8 : p[1], z); }
  /* one game frame: f = { B, W, H, GY, SC, now (game clock), paused } */
  function frame(f){
    st.last = now(); st.f = f; if (!st.ready) return; var B = f.B; if (!B) return;
    var THREE = st.THREE, c = canvas(), r = st.renderer, cam = st.cam, sc = st.sc; if (c.hidden) c.hidden = false;
    var w = f.W, h = f.H; if (c.width !== Math.floor(w * r.getPixelRatio()) || c.height !== Math.floor(h * r.getPixelRatio())) { r.setSize(w, h, false); if (st.comp) { st.comp.setPixelRatio(r.getPixelRatio()); st.comp.setSize(w, h); } st.lastKey = ''; }
    cam.aspect = w / h; cam.fov = cam.aspect < .8 ? 58 : 42; cam.updateProjectionMatrix();
    if (B.cine && !st.shown) { st.shown = true; if ((f.now - B.cine.t0) / B.cine.dur < .9) B.cine.t0 = f.now; }   /* the scene loads while the opening scene runs: start the fly-round from the beginning */
    if (!B.cine) st.shown = true;
    if (B.cine && st.drag && st.drag.moved && st.prevNow) B.cine.t0 += f.now - st.prevNow;   /* looking round holds the opening scene */
    st.prevNow = f.now;
    var intro = !!B.cine, k = intro ? Math.min(1, (f.now - B.cine.t0) / B.cine.dur) : 1, e = REDUCE ? 1 : k * k * (3 - 2 * k);
    var tgt = new THREE.Vector3().fromArray(sc.fight.target), pos;
    if (intro && !REDUCE) { pos = st.path.getPoint(e); var lk = new THREE.Vector3().fromArray(sc.introLook); tgt = lk.lerp(tgt, Math.min(1, e * 1.3)); if (e > .85) pos.lerp(fightPos(cam.aspect), (e - .85) / .15); }
    else { pos = fightPos(cam.aspect); if (B.fight && B.arenaW && f.SC) { var off = (B.camX - (B.arenaW - w) / 2) / f.SC * .12; pos.x += off; tgt.x += off * .7; } }
    if (!st.drag && !(f.paused || intro)) { st.yaw *= .9; st.pitch *= .9; if (Math.abs(st.yaw) < 1e-3) st.yaw = 0; if (Math.abs(st.pitch) < 1e-3) st.pitch = 0; }
    if (st.yaw || st.pitch) { var v = pos.clone().sub(tgt), sph = new THREE.Spherical().setFromVector3(v); sph.theta += st.yaw; sph.phi = Math.max(.25, Math.min(1.45, sph.phi + st.pitch)); pos = tgt.clone().add(new THREE.Vector3().setFromSpherical(sph)); }
    cam.position.copy(pos); cam.lookAt(tgt);
    /* ground line: the fighters' ground (z = groundZ) lands on the 2D game's GY */
    cam.clearViewOffset(); cam.updateMatrixWorld(); var g = new THREE.Vector3(tgt.x, 0, sc.groundZ).project(cam), gy = (1 - g.y) / 2 * h, dy = (gy - f.GY) * (intro ? e : 1);
    if (Math.abs(dy) > .5) cam.setViewOffset(w, h, 0, dy, w, h);
    cam.updateMatrixWorld(); var g2 = new THREE.Vector3(tgt.x, 0, sc.groundZ).project(cam); st.groundY = (1 - g2.y) / 2 * h;
    var tt = st.last / 1000; if (sc.tick) sc.tick(tt);
    var key = [pos.x.toFixed(2), pos.y.toFixed(2), pos.z.toFixed(2), tgt.x.toFixed(2), w, h, f.GY].join(',');
    /* every game frame counts, drawn or skipped: the average gap between game frames over 3 s of fighting (ADR-010 §6) */
    if (B.fight && !f.paused && !intro) { if (st.prevT) { var gap = st.last - st.prevT; st.big = gap > Math.max(500, SLOW_MS * 20) ? (st.big || 0) + 1 : 0; if (st.big >= 2) { fallback('slow ' + Math.round(gap) + 'ms'); return; }   /* two half-second frames in a row: far too slow to wait for the 3 s average */
      st.slow.push([st.last, gap]); while (st.slow.length && st.last - st.slow[0][0] > SLOW_WIN) st.slow.shift();
        if (st.slow.length >= 3 && st.last - st.slow[0][0] > SLOW_WIN * .8) { var s = 0; st.slow.forEach(function(x){ s += x[1]; }); if (s / st.slow.length > SLOW_MS) { fallback('slow ' + Math.round(s / st.slow.length) + 'ms'); return; } } } st.prevT = st.last; }
    else st.prevT = 0;
    if (key === st.lastKey && !intro && (st.skip++ % 2)) return;   /* camera still in a fight: draw the scene at half rate (ADR-010 §7) */
    st.lastKey = key;
    if (!st.sceneCalls) { r.info.reset(); r.render(sc.scene, cam); st.sceneCalls = r.info.render.calls; st.sceneTris = r.info.render.triangles; }   /* the scene alone, for the budget (ADR-010 §7) */
    if (st.bokeh) st.bokeh.uniforms.focus.value = cam.position.distanceTo(new THREE.Vector3(tgt.x, 1.6, sc.groundZ));
    r.info.reset(); if (st.comp) st.comp.render(); else r.render(sc.scene, cam);
  }

  /* drag to look round (opening scene, pause); a tap is handed on to the game unchanged */
  function canTurn(){ return live() && st.f && st.f.B && (st.f.B.cine || st.f.paused); }
  function install(){ var cv = document.getElementById('game'); if (!cv || install.done) return; install.done = true;
    cv.addEventListener('pointerdown', function(e){ if (e.__p3d || !canTurn()) return; e.stopImmediatePropagation(); e.preventDefault(); st.drag = { x: e.clientX, y: e.clientY, moved: false, yaw: st.yaw, pitch: st.pitch, e: e }; }, true);
    window.addEventListener('pointermove', function(e){ var d = st.drag; if (!d) return; var dx = e.clientX - d.x, dy = e.clientY - d.y; if (!d.moved && Math.hypot(dx, dy) < 8) return; d.moved = true; st.yaw = d.yaw - dx * .008; st.pitch = Math.max(-.6, Math.min(.4, d.pitch - dy * .005)); }, true);
    window.addEventListener('pointerup', function(e){ var d = st.drag; if (!d) return; st.drag = null; if (d.moved) { e.stopImmediatePropagation(); return; }
      var o = d.e, ev; try { ev = new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: o.clientX, clientY: o.clientY, pointerId: o.pointerId, pointerType: o.pointerType, isPrimary: true }); } catch (x) { return; } ev.__p3d = true; cv.dispatchEvent(ev); }, true);
  }
  setInterval(function(){ if (st.ready && now() - st.last > GONE) hide(); }, 250);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();

  return { flag: function(){ return FLAG; }, enabled: enabled, place: place, gate: gate, frame: frame, live: live, fallback: fallback, turning: function(){ return !!(st.drag && st.drag.moved); },
    state: function(){ return { key: st.key, n: st.n, ready: st.ready, failed: st.failed, why: st.why, yaw: st.yaw, gy: st.f ? st.f.GY : null, groundY: st.groundY, slowN: st.slow.length, slowAvg: st.slow.length ? st.slow.reduce(function(a, x){ return a + x[1]; }, 0) / st.slow.length : 0, info: st.renderer ? { calls: st.sceneCalls, triangles: st.sceneTris, frameCalls: st.renderer.info.render.calls, post: !!st.comp } : null }; },
    project: function(x, y, z){ if (!st.ready) return null; var v = new st.THREE.Vector3(x, y, z).project(st.cam); return { x: (v.x + 1) / 2 * st.f.W, y: (1 - v.y) / 2 * st.f.H }; } };
})();
