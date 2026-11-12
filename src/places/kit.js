/* ADR-010 shared kit for the real-place scenes: painted canvas textures (no image files), materials, and low-poly parts of a
   northern Vietnamese village. Every scene module imports makeKit and builds from it, so the places share one look (the v2 prototype). */
import { Sky } from '../vendor/three-addons/objects/Sky.js';
const CLEAR = .55;
export function makeKit(THREE, seed0) {
  let seed = seed0 || 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, rr = (a, b) => a + rnd() * (b - a);
  const dm = new THREE.Object3D();
  function tex(w, h, draw, rx = 1, ry = 1) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 4; return t; }
  function speck(g, w, h, n, cols, s0, s1) { for (let i = 0; i < n; i++) { g.fillStyle = cols[Math.floor(rnd() * cols.length)]; const s = rr(s0, s1); g.fillRect(rnd() * w, rnd() * h, s, s); } }
  /* laterite (đá ong): rust-brown blocks in courses, honeycomb pores, moss creeping up from the foot */
  const laterite = (moss) => (g, w, h) => { g.fillStyle = '#7a3f26'; g.fillRect(0, 0, w, h); const bh = h / 6, bw = w / 4;
    for (let r = 0; r < 6; r++) for (let c = -1; c < 5; c++) { const x = c * bw + (r % 2 ? bw / 2 : 0) + 3, y = r * bh + 3; g.fillStyle = ['#9a5634', '#a8613a', '#8c4b2d', '#b06b3f', '#94512f'][Math.floor(rnd() * 5)]; g.fillRect(x, y, bw - 6, bh - 6);
      for (let p = 0; p < 70; p++) { g.fillStyle = rnd() < .5 ? 'rgba(40,18,10,.55)' : 'rgba(200,140,90,.35)'; const s = rr(1.5, 4.5); g.beginPath(); g.ellipse(x + rnd() * (bw - 6), y + rnd() * (bh - 6), s, s * .7, 0, 0, 7); g.fill(); } }
    if (moss) { for (let i = 0; i < 40; i++) { const x = rnd() * w, y = rnd() * h, r = rr(6, 22), gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, 'rgba(70,95,40,.55)'); gr.addColorStop(1, 'rgba(70,95,40,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); } speck(g, w, h, 300, ['rgba(80,110,45,.45)', 'rgba(50,70,30,.45)'], 1, 3); } };
  const T = {
    lat: tex(256, 192, laterite(true)), latClean: tex(256, 192, laterite(false)),
    /* ngói mũi hài: rows of small fish-scale tiles with a darker lip, lichen specks */
    tile: tex(256, 256, (g, w, h) => { g.fillStyle = '#5a2418'; g.fillRect(0, 0, w, h); const tw = 16, th = 14;
      for (let r = 0; r < h / th + 1; r++) for (let c = -1; c < w / tw + 1; c++) { const x = c * tw + (r % 2 ? tw / 2 : 0), y = r * th; g.fillStyle = ['#8e3b26', '#9c4429', '#833522', '#a34d2e'][Math.floor(rnd() * 4)];
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + tw, y); g.lineTo(x + tw, y + th * .55); g.quadraticCurveTo(x + tw / 2, y + th * 1.25, x, y + th * .55); g.closePath(); g.fill(); g.strokeStyle = 'rgba(40,12,6,.7)'; g.lineWidth = 1.4; g.stroke(); }
      speck(g, w, h, 260, ['rgba(160,170,110,.45)', 'rgba(60,70,40,.45)'], 1, 3); }),
    /* square fired bricks of a village yard */
    brick: tex(256, 256, (g, w, h) => { g.fillStyle = '#6e3a28'; g.fillRect(0, 0, w, h); const s = 32; for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) { g.fillStyle = ['#a8664a', '#b27556', '#9c5c44', '#b0705a'][Math.floor(rnd() * 4)]; g.fillRect(x + 1.5, y + 1.5, s - 3, s - 3); } speck(g, w, h, 600, ['rgba(60,30,20,.25)', 'rgba(220,170,120,.18)'], 1, 3); }),
    earth: tex(256, 256, (g, w, h) => { g.fillStyle = '#b48a58'; g.fillRect(0, 0, w, h); speck(g, w, h, 2200, ['#a77c4c', '#c09868', '#9c7246', '#c8a474'], 1, 5); }),
    wood: tex(64, 256, (g, w, h) => { g.fillStyle = '#4a2c1c'; g.fillRect(0, 0, w, h); for (let i = 0; i < 26; i++) { g.strokeStyle = rnd() < .5 ? 'rgba(25,12,6,.6)' : 'rgba(110,70,45,.5)'; g.lineWidth = rr(.6, 2); g.beginPath(); const x = rnd() * w; g.moveTo(x, 0); g.bezierCurveTo(x + rr(-4, 4), h * .3, x + rr(-4, 4), h * .7, x + rr(-3, 3), h); g.stroke(); } }),
    rice: tex(256, 256, (g, w, h) => { g.fillStyle = '#8fae3c'; g.fillRect(0, 0, w, h); for (let i = 0; i < 1800; i++) { g.strokeStyle = ['#a7c24a', '#7c9a30', '#c9c24c', '#b7b23e'][Math.floor(rnd() * 4)]; g.lineWidth = 1; const x = rnd() * w, y = rnd() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + rr(-2, 2), y - rr(3, 7)); g.stroke(); } }),
    water: tex(256, 256, (g, w, h) => { g.fillStyle = '#4f7a6e'; g.fillRect(0, 0, w, h); for (let i = 0; i < 140; i++) { g.strokeStyle = 'rgba(220,240,230,.18)'; g.lineWidth = 1; const x = rnd() * w, y = rnd() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + rr(8, 24), y); g.stroke(); } }),
    puff: tex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(255,240,225,.9)'); gr.addColorStop(1, 'rgba(255,240,225,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }),
    bird: tex(64, 32, (g) => { g.strokeStyle = '#2a2030'; g.lineWidth = 3; g.beginPath(); g.moveTo(4, 18); g.quadraticCurveTo(18, 4, 32, 16); g.quadraticCurveTo(46, 4, 60, 18); g.stroke(); })
  };
  T.puff.wrapS = T.puff.wrapT = T.bird.wrapS = T.bird.wrapT = THREE.ClampToEdgeWrapping;
  /* a tangent-space normal map from a colour texture: darker = lower (pores, mortar joints, tile lips), so low sun rakes the relief */
  function nmap(src, k) { const c = src.image, w = c.width, h = c.height, d = c.getContext('2d').getImageData(0, 0, w, h).data, H = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) H[i] = (d[i * 4] * .3 + d[i * 4 + 1] * .59 + d[i * 4 + 2] * .11) / 255;
    const o = document.createElement('canvas'); o.width = w; o.height = h; const og = o.getContext('2d'), im = og.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const l = H[y * w + (x + w - 1) % w], r = H[y * w + (x + 1) % w], u = H[((y + h - 1) % h) * w + x], dn = H[((y + 1) % h) * w + x];
      const nx = (l - r) * k, ny = (dn - u) * k, len = Math.hypot(nx, ny, 1), j = (y * w + x) * 4; im.data[j] = (nx / len * .5 + .5) * 255; im.data[j + 1] = (ny / len * .5 + .5) * 255; im.data[j + 2] = (1 / len * .5 + .5) * 255; im.data[j + 3] = 255; }
    og.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(o); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.copy(src.repeat); t.anisotropy = 4; return t; }
  const N = { lat: nmap(T.lat, 5), latClean: nmap(T.latClean, 5), tile: nmap(T.tile, 4), brick: nmap(T.brick, 3), wood: nmap(T.wood, 2), earth: nmap(T.earth, 1.5) };
  const ns = new THREE.Vector2(1.4, 1.4);
  /* grey maps from a colour texture: cavity (ambient occlusion: joints and pores darker) and roughness (lo..hi, darker = smoother where dew sits) */
  function greyMap(src, f) { const c = src.image, w = c.width, h = c.height, d = c.getContext('2d').getImageData(0, 0, w, h).data, o = document.createElement('canvas'); o.width = w; o.height = h; const og = o.getContext('2d'), im = og.createImageData(w, h);
    for (let i = 0; i < w * h; i++) { const l = (d[i * 4] * .3 + d[i * 4 + 1] * .59 + d[i * 4 + 2] * .11) / 255, v = Math.max(0, Math.min(255, f(l) * 255)); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
    og.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(o); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.copy(src.repeat); return t; }
  const AO = { lat: greyMap(T.lat, l => .35 + l * 1.3), tile: greyMap(T.tile, l => .25 + l * 1.6), brick: greyMap(T.brick, l => .3 + l * 1.4) };
  const RG = { lat: greyMap(T.lat, l => .75 + l * .25), tile: greyMap(T.tile, l => .35 + l * .7), brick: greyMap(T.brick, l => .55 + l * .5) };
  const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ roughness: .95, metalness: 0 }, o));
  const M = { lat: std({ map: T.lat, normalMap: N.lat, normalScale: ns, aoMap: AO.lat, roughnessMap: RG.lat, roughness: 1 }), latClean: std({ map: T.latClean, normalMap: N.latClean, normalScale: ns, aoMap: AO.lat, roughnessMap: RG.lat, roughness: 1 }),
    tile: new THREE.MeshPhysicalMaterial({ map: T.tile, normalMap: N.tile, normalScale: ns, aoMap: AO.tile, roughnessMap: RG.tile, roughness: 1, clearcoat: .35, clearcoatRoughness: .55, side: THREE.DoubleSide }),   /* dew on the tiles at dawn */ wood: std({ map: T.wood, normalMap: N.wood }), woodDS: std({ map: T.wood, normalMap: N.wood, side: THREE.DoubleSide }), brick: std({ map: T.brick, normalMap: N.brick, normalScale: ns, aoMap: AO.brick, roughnessMap: RG.brick, roughness: 1 }),
    earth: std({ map: T.earth, normalMap: N.earth }), rice: std({ map: T.rice }), water: std({ map: T.water, roughness: .15, metalness: .2, transparent: true, opacity: .92 }), ridge: std({ color: 0x6b2c1b }), iron: std({ color: 0x2a2a2a, metalness: .6, roughness: .5 }),
    bark: std({ color: 0x6a5240, flatShading: true }), leafA: std({ color: 0x3e6e34, flatShading: true }), leafB: std({ color: 0x4f8040, flatShading: true }), leafC: std({ color: 0x6a9a48, flatShading: true }),
    culm: std({ color: 0x8aa04c, roughness: .7 }), bLeaf: std({ color: 0x5f8f3a, flatShading: true, side: THREE.DoubleSide }), dark: std({ color: 0x3a2418 }) };
  function mesh(geo, mat, x, y, z, parent) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; }
  /* box whose texture repeats by real size (1 repeat = unit metres) */
  function tbox(parent, w, h, d, mat, x, y, z, unit = 2.4) { const geo = new THREE.BoxGeometry(w, h, d), uv = geo.attributes.uv, pos = geo.attributes.position, n = geo.attributes.normal;
    for (let i = 0; i < uv.count; i++) { const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i)), px = pos.getX(i), py = pos.getY(i), pz = pos.getZ(i); uv.setXY(i, (ny > .5 ? px : nx > .5 ? pz : px) / unit, (ny > .5 ? pz : py) / unit); } return mesh(geo, mat, x, y, z, parent); }
  /* two-slope tiled roof (mái hai dốc), ridge along x. The eaves and the ridge rise towards the ends (the gentle curve of northern roofs,
     opts.curl > 0 for the upturned corners of a đình), ridge with end pieces, wooden gables, rafter ends under the eaves */
  function roofSurface(W, half, rise, dropAtEave, curl, s) { const nx = 28, nz = 6, pos = [], uv = [], idx = [];
    for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) { const u = i / nx * 2 - 1, t = j / nz, ax = Math.abs(u), lift = curl * Math.pow(ax, 5) * (.35 + .65 * t) + .25 * Math.pow(ax, 3);
        pos.push(u * W / 2, rise - t * (rise + dropAtEave) + lift, s * t * half); uv.push(u * W / 2 / 2.2, t * Math.hypot(half, rise) / 2.2); }
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; if (s > 0) idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g; }
  function gableRoof(parent, w, d, rise, over, y, opts) { opts = opts || {}; const g = new THREE.Group(); g.position.y = y; parent.add(g); const half = d / 2 + over, W = w + over * 2, drop = rise * over / (d / 2), curl = opts.curl || .35;
    for (const s of [-1, 1]) mesh(roofSurface(W, half, rise, drop, curl, s), M.tile, 0, 0, 0, g);
    const ridgePts = []; for (let i = 0; i <= 16; i++) { const u = i / 16 * 2 - 1, ax = Math.abs(u); ridgePts.push(new THREE.Vector3(u * (W / 2 + .1), rise + .14 + curl * Math.pow(ax, 5) * .35 + .25 * Math.pow(ax, 3), 0)); }
    mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ridgePts), 32, .2, 6, false), M.ridge, 0, 0, 0, g);
    for (const s of [-1, 1]) { const end = mesh(new THREE.ConeGeometry(.22, .9 + curl, 6), M.ridge, s * (W / 2 + .05), rise + .5 + curl * .45, 0, g); end.rotation.z = -s * (.5 + curl * .4); }
    const tri = new THREE.Shape(); tri.moveTo(-half + over, 0); tri.lineTo(0, rise); tri.lineTo(half - over, 0); tri.closePath();
    for (const s of [-1, 1]) { const gm = mesh(new THREE.ShapeGeometry(tri), M.woodDS, s * w / 2, 0, 0, g); gm.rotation.y = Math.PI / 2; }
    for (let i = 0; i < 13; i++) for (const s of [-1, 1]) mesh(new THREE.BoxGeometry(.09, .09, over + .4), M.wood, -w / 2 - over + .3 + i * (W - .6) / 12, -.06, s * (d / 2 + over / 2 - .1), g);
    if (opts.eaveTiles) { const n = Math.round(W / .26), tg = new THREE.CircleGeometry(.15, 8, Math.PI, Math.PI), em = new THREE.InstancedMesh(tg, M.ridge, n * 2); let k = 0;
      for (const s of [-1, 1]) for (let i = 0; i < n; i++) { const u = (i + .5) / n * 2 - 1, ax = Math.abs(u), lift = curl * Math.pow(ax, 5) + .25 * Math.pow(ax, 3); dm.position.set(u * W / 2, rise - (rise + drop) + lift - .04, s * (half + .02)); dm.rotation.set(0, s > 0 ? 0 : Math.PI, 0); dm.scale.set(1, 1, 1); dm.updateMatrix(); em.setMatrixAt(k++, dm.matrix); }
      em.castShadow = true; g.add(em); }   /* the scalloped tile ends along the eaves */
    return g; }
  /* a three-bay village house: laterite walls, wooden veranda posts and door panels, tiled roof */
  function house(parent, x, z, w, d, ry) { const h = new THREE.Group(); h.position.set(x, 0, z); h.rotation.y = ry || 0; parent.add(h);
    tbox(h, w, 3, d, M.latClean, 0, 1.5, 0); for (let i = 0; i < 5; i++) mesh(new THREE.CylinderGeometry(.16, .18, 3, 8), M.wood, -w / 2 + .5 + i * (w - 1) / 4, 1.5, d / 2 + .8, h);
    tbox(h, w - 1, 2.4, .1, M.wood, 0, 1.4, d / 2 + .02, 1.2); gableRoof(h, w, d + 1.6, 2.4, .9, 3); return h; }
  /* leaf-card textures: clusters of leaves painted with alpha, so foliage reads as leaves, not blobs */
  function leafTex(kind) { return tex(256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); const greens = kind === 'bamboo' ? ['#5f8f3a', '#7aa84a', '#4f7a30', '#8ab858'] : kind === 'grass' ? ['#7a9a3a', '#8aae48', '#5f7f2e', '#a8b858'] : ['#2f5a28', '#3e6e34', '#4f8040', '#2a4a22', '#5f9048'];
      const n = kind === 'grass' ? 70 : kind === 'bamboo' ? 34 : 120;
      for (let i = 0; i < n; i++) { g.save(); const cx = kind === 'grass' ? rr(20, 236) : 128 + rr(-1, 1) * rr(20, 110), cy = kind === 'grass' ? 256 : 128 + rr(-1, 1) * rr(20, 110); g.translate(cx, cy); g.fillStyle = greens[Math.floor(rnd() * greens.length)];
        if (kind === 'grass') { g.rotate(rr(-.35, .35)); g.beginPath(); g.moveTo(-3, 0); g.quadraticCurveTo(rr(-6, 6), -rr(80, 200) / 2, rr(-10, 10), -rr(120, 240)); g.lineTo(3, 0); g.fill(); }
        else if (kind === 'bamboo') { g.rotate(rnd() * 6.28); g.beginPath(); g.ellipse(0, 0, rr(30, 48), rr(4, 7), 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(-30, -1, 60, 1.5); }
        else { g.rotate(rnd() * 6.28); g.beginPath(); g.ellipse(0, 0, rr(9, 15), rr(5, 8), 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-10, 0); g.lineTo(10, 0); g.stroke(); }
        g.restore(); } }); }
  T.wear = tex(512, 512, (g, w, h) => { g.clearRect(0, 0, w, h); for (let i = 0; i < 160; i++) { const x = rnd() * w, y = rnd() * h, r = rr(10, 60), gr = g.createRadialGradient(x, y, 1, x, y, r), a = rr(.08, .28); gr.addColorStop(0, 'rgba(90,70,45,' + a + ')'); gr.addColorStop(1, 'rgba(90,70,45,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
    speck(g, w, h, 900, ['rgba(60,45,30,.35)', 'rgba(150,130,100,.3)', 'rgba(70,90,40,.35)'], 1, 3); });
  function wear(parent, w, d, x, z) { const m = mesh(new THREE.PlaneGeometry(w, d), std({ map: T.wear, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), x, .075, z, parent); m.rotation.x = -Math.PI / 2; m.castShadow = false; m.userData.noMerge = true; return m; }
  const LT = { tree: leafTex('tree'), bamboo: leafTex('bamboo'), grass: leafTex('grass') };
  Object.values(LT).forEach(t => { t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; });
  const leafMat = (t, extra) => std(Object.assign({ map: t, alphaTest: .45, side: THREE.DoubleSide, roughness: .85 }, extra || {}));
  /* a cross of two vertical cards (or three for round clumps) */
  function crossGeo(w, h, three) { const parts = [], n = three ? 3 : 2; for (let i = 0; i < n; i++) { const p = new THREE.PlaneGeometry(w, h); p.translate(0, h / 2, 0); p.rotateY(i * Math.PI / n); parts.push(p.toNonIndexed()); }
    let total = 0; parts.forEach(p => total += p.attributes.position.count); const P = new Float32Array(total * 3), Nn = new Float32Array(total * 3), U = new Float32Array(total * 2); let o = 0;
    parts.forEach(p => { P.set(p.attributes.position.array, o * 3); Nn.set(p.attributes.normal.array, o * 3); U.set(p.attributes.uv.array, o * 2); o += p.attributes.position.count; });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.BufferAttribute(Nn, 3)); g.setAttribute('uv', new THREE.BufferAttribute(U, 2)); return g; }
  /* n leaf cards scattered by place(i) -> [x, y, z, size]; tinted per card */
  const PHONE = { on: false };
  function foliage(parent, n, place, texture, tint) { if (PHONE.on) n = Math.ceil(n * .55); const im = new THREE.InstancedMesh(crossGeo(1, 1, true), leafMat(texture), n), c = new THREE.Color();
    for (let i = 0; i < n; i++) { const [x, y, z, s] = place(i); dm.position.set(x, y - s * .5, z); dm.rotation.set(rr(-.5, .5), rnd() * 6.28, rr(-.5, .5)); dm.scale.set(s, s, s); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix);
      c.setHSL((tint || .27) + rr(-.03, .03), rr(.35, .55), rr(.32, .5)); im.setColorAt(i, c); }
    im.castShadow = im.receiveShadow = true; parent.add(im); return im; }
  /* a banyan (cây đa): buttressed trunk, spreading limbs, a dense crown of leaf cards over darker inner volume, aerial roots */
  function banyan(parent, x, z, scale) { const b = new THREE.Group(); b.position.set(x, 0, z); b.scale.setScalar(scale || 1); parent.add(b);
    const bark = std({ color: 0x6a5240, normalMap: N.wood, normalScale: new THREE.Vector2(2, 2) });
    mesh(new THREE.CylinderGeometry(1.4, 2.6, 7.5, 12), bark, 0, 3.75, 0, b);
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, r = mesh(new THREE.ConeGeometry(.75, 2.6, 6), bark, Math.cos(a) * 2.2, .9, Math.sin(a) * 2.2, b); r.rotation.z = Math.cos(a) * .7; r.rotation.x = -Math.sin(a) * .7; }
    const limbs = []; for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + .3, L = rr(6, 9), l = mesh(new THREE.CylinderGeometry(.3, .7, L, 7), bark, Math.cos(a) * L * .38, 7.6 + rr(0, 1.5), Math.sin(a) * L * .38, b); l.rotation.z = -Math.cos(a) * 1.05; l.rotation.x = Math.sin(a) * 1.05; limbs.push([Math.cos(a) * L * .75, 8.5, Math.sin(a) * L * .75]); }
    const inner = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), std({ color: 0x24401e }), 22); for (let i = 0; i < 22; i++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * 7; dm.position.set(Math.cos(a) * r * .8, 9.6 + rr(-.8, 1), Math.sin(a) * r * .7); const s = rr(1.6, 2.4); dm.scale.set(s, s * .6, s); dm.rotation.set(0, 0, 0); dm.updateMatrix(); inner.setMatrixAt(i, dm.matrix); } b.add(inner);
    foliage(b, 340, () => { const a = rnd() * 6.28, r = Math.pow(rnd(), .6) * 10.5, top = 13.2 - r * r * .045; return [Math.cos(a) * r, top - rnd() * 3.2 * (1 - r / 12), Math.sin(a) * r * .85, rr(2.2, 3.4)]; }, LT.tree, .29);
    const roots = new THREE.InstancedMesh(new THREE.CylinderGeometry(.04, .07, 1, 4), bark, 60); for (let i = 0; i < 60; i++) { const l = limbs[i % limbs.length], len = rr(3.5, 7.5); dm.position.set(l[0] * rr(.3, 1) + rr(-.6, .6), l[1] - len / 2, l[2] * rr(.3, 1) + rr(-.6, .6)); dm.rotation.set(rr(-.05, .05), 0, rr(-.05, .05)); dm.scale.set(1, len, 1); dm.updateMatrix(); roots.setMatrixAt(i, dm.matrix); } b.add(roots);
    return b; }
  /* a bamboo hedge (lũy tre): arching culms with nodes, feathery leaf cards along the upper third */
  function bamboo(parent, n, x0, x1, z0, z1) { const culms = new THREE.InstancedMesh(new THREE.CylinderGeometry(.08, .12, 1, 6), std({ color: 0x8aa04c, roughness: .6 }), n), c = new THREE.Color(), tops = [];
    for (let i = 0; i < n; i++) { const x = rr(x0, x1), z = rr(z0, z1), h = rr(10, 16), lean = rr(-.22, .22) + Math.sign(x || 1) * .1; dm.position.set(x - Math.sin(lean) * h / 2, h / 2 * Math.cos(lean), z); dm.rotation.set(rr(-.08, .08), 0, lean); dm.scale.set(1, h, 1); dm.updateMatrix(); culms.setMatrixAt(i, dm.matrix);
      c.setHSL(rr(.18, .24), rr(.35, .5), rr(.36, .5)); culms.setColorAt(i, c); tops.push([x, z, h, lean]); }
    culms.castShadow = true; parent.add(culms);
    foliage(parent, n * 4, i => { const [x, z, h, lean] = tops[i % tops.length], k = rr(.55, 1.02), hy = h * k * Math.cos(lean); return [x - Math.sin(lean) * h * k + rr(-.8, .8), hy, z + rr(-.8, .8), rr(1.8, 3)]; }, LT.bamboo, .24); }
  /* grass clumps over [x0, x1] x [z0, z1], skipping the rectangle skip = [x0, x1, z0, z1] (the fight floor) */
  function grass(parent, n, x0, x1, z0, z1, skip) { if (PHONE.on) n = Math.ceil(n * .35); let placed = 0; const pts = []; for (let k = 0; k < n * 4 && placed < n; k++) { const x = rr(x0, x1), z = rr(z0, z1); if (skip && x > skip[0] && x < skip[1] && z > skip[2] && z < skip[3]) continue; pts.push([x, z]); placed++; }
    return foliage(parent, pts.length, i => [pts[i][0], rr(.3, .6), pts[i][1], rr(.7, 1.3)], LT.grass, .2); }
  /* lotus pond (ao sen): laterite rim, water, leaves and pink flowers */
  function lotusPond(parent, x, z, w, d) { const p = new THREE.Group(); p.position.set(x, 0, z); parent.add(p); tbox(p, w, .6, d, M.latClean, 0, -.2, 0); const wt = mesh(new THREE.BoxGeometry(w - 1.4, .1, d - 1.4), new THREE.MeshPhysicalMaterial({ color: 0x2e5a50, roughness: .04, metalness: 0, clearcoat: 1, clearcoatRoughness: .03, transparent: true, opacity: .93, envMapIntensity: 1.3 }), 0, .05, 0, p); wt.castShadow = false; wt.userData.noMerge = true;
    const n = Math.round(w * d / 4), leaves = new THREE.InstancedMesh(new THREE.CircleGeometry(.75, 10, .25, Math.PI * 1.85), std({ color: 0x4f8a3a, side: THREE.DoubleSide, roughness: .7 }), n);
    for (let i = 0; i < n; i++) { dm.position.set(rr(-w / 2 + 1.2, w / 2 - 1.2), rr(.12, .9), rr(-d / 2 + 1.2, d / 2 - 1.2)); dm.rotation.set(-Math.PI / 2 + rr(-.3, .3), rr(-.3, .3), rnd() * 6); const s = rr(.6, 1.5); dm.scale.set(s, s, s); dm.updateMatrix(); leaves.setMatrixAt(i, dm.matrix); }
    leaves.receiveShadow = true; p.add(leaves); const fl = new THREE.InstancedMesh(new THREE.ConeGeometry(.28, .45, 6), std({ color: 0xf2a0b8, flatShading: true }), 16);
    for (let i = 0; i < 16; i++) { dm.position.set(rr(-w / 2 + 1.5, w / 2 - 1.5), rr(.9, 1.6), rr(-d / 2 + 1.5, d / 2 - 1.5)); dm.rotation.set(Math.PI, 0, 0); dm.scale.set(1, 1, 1); dm.updateMatrix(); fl.setMatrixAt(i, dm.matrix); } p.add(fl); return p; }
  /* a laterite well (giếng làng) */
  function well(parent, x, z) { const w = new THREE.Group(); w.position.set(x, 0, z); parent.add(w); const ring = mesh(new THREE.CylinderGeometry(1.15, 1.25, .9, 14, 1, true), std({ map: T.latClean, side: THREE.DoubleSide }), 0, .45, 0, w); ring.userData.noMerge = true;
    mesh(new THREE.CylinderGeometry(1.2, 1.2, .14, 14), M.latClean, 0, .92, 0, w); mesh(new THREE.CircleGeometry(1.0, 14), std({ color: 0x23423e, roughness: .1 }), 0, .7, 0, w).rotation.x = -Math.PI / 2; return w; }
  /* physical sky (Rayleigh/Mie scattering, the Sky addon) with the sun at elevation / azimuth; the directional light comes from the same sun.
     scene.userData.sky lets the host build image-based light from it; scene.userData.exposure sets the tone-mapping exposure. */
  function dawn(scene, opts) { opts = opts || {}; PHONE.on = !!opts.phone; const sky = new Sky(); sky.scale.setScalar(450); sky.userData.noMerge = true; scene.add(sky); const u = sky.material.uniforms;
    u.turbidity.value = opts.turbidity !== undefined ? opts.turbidity : 7; u.rayleigh.value = opts.rayleigh !== undefined ? opts.rayleigh : 2.2; u.mieCoefficient.value = opts.mie !== undefined ? opts.mie : .006; u.mieDirectionalG.value = .86;
    const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - (opts.elevation !== undefined ? opts.elevation : 9)), THREE.MathUtils.degToRad(opts.azimuth !== undefined ? opts.azimuth : -60)); u.sunPosition.value.copy(sunDir);
    scene.userData.sky = sky; scene.userData.exposure = opts.exposure || .55;
    scene.fog = new THREE.FogExp2(opts.fog || 0xe8c8a8, (opts.fogDensity || .0075) * CLEAR);   /* CLEAR: the Owner found the places too hazy (2026-11-12): every scene's fog at 55 % */ scene.add(new THREE.HemisphereLight(opts.skyLight || 0xffe6c8, opts.groundLight || 0x56603e, opts.hemi !== undefined ? opts.hemi : .5));
    const sun = new THREE.DirectionalLight(opts.sunColor || 0xffc690, opts.sunPower || 3.2); sun.position.copy(sunDir).multiplyScalar(70); sun.castShadow = true; const sm = opts.phone ? 1024 : 2048; sun.shadow.mapSize.set(sm, sm); sun.shadow.bias = -.0003; sun.shadow.normalBias = .04; sun.shadow.radius = 3;
    Object.assign(sun.shadow.camera, { left: -48, right: 48, top: 48, bottom: -48, near: 1, far: 180 }); scene.add(sun); return sun; }
  /* morning mist banks, kitchen smoke from (sx, sy, sz), falling leaves round (lx, lz), birds; returns tick(t) */
  function life(scene, o) { const mist = [], smoke = [], birds = [];
    for (let i = 0; i < 6; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.puff, transparent: true, opacity: .18, depthWrite: false }));   /* mist banks: thinner, the place behind stays clear */ s.position.set(-75 + i * 30 + rr(-6, 6), rr(1.5, 3), rr(-60, -24)); s.scale.set(rr(50, 70), rr(6, 9), 1); s.userData.fx = true; scene.add(s); mist.push(s); }
    if (o.smoke) for (let i = 0; i < 6; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.puff, transparent: true, opacity: .4, depthWrite: false })); s.userData.k = i / 6; s.userData.fx = true; scene.add(s); smoke.push(s); }
    const fall = new THREE.InstancedMesh(new THREE.PlaneGeometry(.22, .14), std({ color: 0x8aa040, side: THREE.DoubleSide }), 40), fp = []; for (let i = 0; i < 40; i++) fp.push({ x: o.leaves[0] + rr(-7, 7), y: rr(0, 11), z: o.leaves[1] + rr(-5, 5), s: rr(.4, 1), r: rnd() * 6 }); fall.userData.fx = true; scene.add(fall);
    for (let i = 0; i < 3; i++) { const b = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.bird, transparent: true, fog: false })); b.scale.set(1.6, .8, 1); b.userData = { o: rnd() * 40, h: rr(18, 26), z: rr(-40, -25), fx: true }; scene.add(b); birds.push(b); }
    return function tick(t) { mist.forEach((m, i) => { m.position.x += Math.sin(t * .1 + i) * .01; });
      smoke.forEach(s => { const k = (s.userData.k + t * .06) % 1; s.position.set(o.smoke[0] + k * 3, o.smoke[1] + k * 9, o.smoke[2] + k * 2); const sc = 1.5 + k * 5; s.scale.set(sc, sc, 1); s.material.opacity = .45 * (1 - k); });
      fp.forEach((p, i) => { p.y -= .012 * p.s; p.x += Math.sin(t + i) * .006; if (p.y < 0) p.y = 11; dm.position.set(p.x, p.y, p.z); dm.rotation.set(t * p.s + p.r, t * .7 + i, 0); dm.scale.set(1, 1, 1); dm.updateMatrix(); fall.setMatrixAt(i, dm.matrix); }); fall.instanceMatrix.needsUpdate = true;
      birds.forEach((b, i) => { b.position.set(((t * 3 + b.userData.o * 4) % 160) - 80, b.userData.h + Math.sin(t * 2 + i) * .6, b.userData.z); }); }; }

  /* ---------- terrain: seeded value noise, heightfields, karst, terraces, mountain ranges ---------- */
  const perm = new Uint8Array(512); { const q = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } for (let i = 0; i < 512; i++) perm[i] = q[i & 255]; }
  const hash = (x, y) => perm[(perm[x & 255] + (y & 255)) & 511] / 255;
  function vnoise(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
  function fbm(x, y, o) { let s = 0, a = .5, f = 1; for (let i = 0; i < (o || 4); i++) { s += a * vnoise(x * f, y * f); f *= 2.03; a *= .5; } return s; }
  const vcMat = std({ vertexColors: true, roughness: .92 });
  /* a heightfield w x d centred on (x, z): fn(wx, wz) -> height, paint(wx, y, wz, normalY, colour) */
  function heightfield(parent, w, d, nx, nz, x, z, fn, paint, mat) { if (PHONE.on) { nx = Math.ceil(nx * .6); nz = Math.ceil(nz * .6); } const g = new THREE.PlaneGeometry(w, d, nx, nz); g.rotateX(-Math.PI / 2); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, fn(p.getX(i) + x, p.getZ(i) + z)); g.computeVertexNormals(); const nn = g.attributes.normal, col = new Float32Array(p.count * 3), c = new THREE.Color();
    for (let i = 0; i < p.count; i++) { paint(p.getX(i) + x, p.getY(i), p.getZ(i) + z, nn.getY(i), c); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = mesh(g, mat || vcMat, x, 0, z, parent); return m; }
  /* a distant range: a ridge line along x at depth z, peaks up to h, hazy blue-green */
  function range(parent, z, h, depth, tint) { const base = new THREE.Color(tint || 0x5f7a6a), top = new THREE.Color(0x8a96a8);
    return heightfield(parent, 700, depth, 140, 24, 0, z, (x, wz) => { const t = 1 - Math.abs(wz - z) / (depth / 2); const ridge = Math.pow(Math.max(0, t), 1.4); return h * ridge * (.45 + .75 * fbm(x * .012 + 3, wz * .012, 5)) - 2; },
      (x, y, wz, ny, c) => { c.copy(base).lerp(top, Math.min(1, y / h)); c.offsetHSL(0, 0, (fbm(x * .05, wz * .05) - .5) * .12); }); }
  /* a limestone karst tower (núi đá vôi): a noise-sculpted column narrowing to a rounded top, grey rock with dark rain streaks, green on ledges, shrubs on top */
  const karstMat = std({ vertexColors: true, roughness: .95, normalMap: N.latClean, normalScale: new THREE.Vector2(.6, .6) });
  function karstTower(parent, x, z, h, r) { const seg = PHONE.on ? 18 : 30, g = new THREE.CylinderGeometry(r * .7, r, h, seg, PHONE.on ? 10 : 18, false), p = g.attributes.position, sx = rnd() * 100, up = [];
    for (let i = 0; i < p.count; i++) { const px = p.getX(i), py = p.getY(i), pz = p.getZ(i), rad = Math.hypot(px, pz), t = Math.min(1, Math.max(0, (py + h / 2) / h)); if (rad < 1e-4) { if (py > 0) p.setY(i, py + r * .45); continue; }
      const a = Math.atan2(pz, px), k = (1 + .55 * (fbm(Math.cos(a) * 1.6 + sx, t * 3.2 + sx, 5) - .5)) * (1 - .38 * Math.pow(t, 2.2)) * (t > .97 ? .8 : 1); p.setX(i, px * k); p.setZ(i, pz * k); }
    g.translate(0, h / 2, 0); g.computeVertexNormals(); const nn = g.attributes.normal, col = new Float32Array(p.count * 3), c = new THREE.Color(), rockA = new THREE.Color(0x857f70), rockB = new THREE.Color(0x56524a), green = new THREE.Color(0x3a6430);
    for (let i = 0; i < p.count; i++) { const ny = nn.getY(i), t = p.getY(i) / h, a = Math.atan2(p.getZ(i), p.getX(i)); c.copy(rockA).lerp(rockB, Math.min(1, Math.max(0, fbm(a * 3 + sx, t * 10, 3) * 1.6 - .4)));
      if (ny > .32 || t > .88) { c.lerp(green, Math.min(1, (ny - .1) * 1.5 + (t > .88 ? .6 : 0))); if (rnd() < .5) up.push([p.getX(i), p.getY(i), p.getZ(i)]); } col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); const m = mesh(g, karstMat, x, 0, z, parent);
    if (up.length) foliage(parent, Math.min(up.length, Math.round(h * 4)), () => { const q = up[Math.floor(rnd() * up.length)]; return [x + q[0], q[1] + .4, z + q[2], rr(1.6, 3)]; }, LT.tree, .28); return m; }
  function karst2(parent, n, x0, x1, z0, z1, h0, h1) { for (let i = 0; i < n; i++) { const h = rr(h0, h1); karstTower(parent, rr(x0, x1), rr(z0, z1), h, h * rr(.3, .42)); } }
  /* a terraced valley (ruộng bậc thang): smooth hills quantised into contour steps; flat paddies gold or green, earthen risers; flat near the fight floor */
  function terracedValley(parent, w, d, x, z, peak, step, gold, flatR) { const riceA = new THREE.Color(gold ? 0xe0b030 : 0x9cc454), riceB = new THREE.Color(gold ? 0xa8902a : 0x74a43e), water = new THREE.Color(0xa8c4c0);
    /* the bunds are drawn per pixel from the world height, so the terrace lines stay crisp and follow the hill's contours */
    const mat = std({ vertexColors: true, roughness: .9 }); mat.onBeforeCompile = sh => { sh.uniforms.uStep = { value: step };
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp; uniform float uStep;').replace('#include <color_fragment>', '#include <color_fragment>\nif (vWp.y > .4) { float f = fract(vWp.y / uStep); float bund = 1. - smoothstep(.0, .09, f) * smoothstep(1., .9, f); diffuseColor.rgb = mix(diffuseColor.rgb * (.82 + .3 * f), vec3(.30, .26, .15), bund * .85); }'); };
    const raw = (wx, wz) => { const r = Math.hypot(wx, wz - 8), keep = Math.min(1, Math.max(0, (r - flatR) / 34)); return peak * keep * keep * (.3 + fbm(wx * .016 + 7, wz * .016 + 3, 5) * 1.15); };
    return heightfield(parent, w, d, 150, 110, x, z, raw, (wx, y, wz, ny, c) => { c.copy(riceA).lerp(riceB, fbm(wx * .07, wz * .07, 3)); if (!gold && fbm(wx * .05 + 9, wz * .05) > .62) c.lerp(water, .45); }, mat); }
  /* foam / spray puffs at (x, y, z), radius r: soft sprites (no depth, skipped by the AO pass) */
  function spray(parent, n, x, y, z, rx, rz) { const out = []; for (let i = 0; i < n; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.puff, transparent: true, opacity: .55, depthWrite: false })); sp.position.set(x + rr(-rx, rx), y + rr(0, 2), z + rr(-rz, rz)); const s = rr(4, 9); sp.scale.set(s, s * .7, 1); sp.userData.fx = true; sp.userData.b = sp.position.y; sp.userData.o = rnd() * 6; parent.add(sp); out.push(sp); }
    return t => out.forEach(sp => { sp.position.y = sp.userData.b + Math.sin(t * .8 + sp.userData.o) * .5; sp.material.opacity = .4 + .2 * Math.sin(t * 1.3 + sp.userData.o); }); }
  /* merge every plain static mesh that shares a material into one draw call (ADR-010 §7) */
  function merge(scene) { scene.updateMatrixWorld(true); const groups = new Map(), drop = [];
    scene.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o.userData.noMerge || Array.isArray(o.material)) return; let g = o.geometry; if (!g.attributes.uv || !g.attributes.normal) return; g = g.index ? g.toNonIndexed() : g.clone(); g.applyMatrix4(o.matrixWorld);
      const k = o.material.uuid; if (!groups.has(k)) groups.set(k, { mat: o.material, geos: [] }); groups.get(k).geos.push(g); drop.push(o); });
    drop.forEach(o => o.parent.remove(o));
    groups.forEach(({ mat, geos }) => { let n = 0; geos.forEach(g => { n += g.attributes.position.count; }); const hasC = geos.every(g => g.attributes.color), P = new Float32Array(n * 3), N = new Float32Array(n * 3), U = new Float32Array(n * 2), C = hasC ? new Float32Array(n * 3) : null; let o = 0;
      geos.forEach(g => { P.set(g.attributes.position.array, o * 3); N.set(g.attributes.normal.array, o * 3); U.set(g.attributes.uv.array, o * 2); if (C) C.set(g.attributes.color.array, o * 3); o += g.attributes.position.count; g.dispose(); });
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(N, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(U, 2)); if (C) geo.setAttribute('color', new THREE.BufferAttribute(C, 3)); geo.computeBoundingSphere();
      const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; scene.add(m); }); }

  /* ---------- parts for gates 2-8 ---------- */
  /* limestone karst towers (núi đá vôi): stacked, slightly twisted cones with green caps; n towers in a band */
  const rock = std({ color: 0x7a786a, flatShading: true }), rockG = std({ color: 0x3f6a32, flatShading: true });
  function karst(parent, n, x0, x1, z0, z1, h0, h1) { for (let i = 0; i < n; i++) { const x = rr(x0, x1), z = rr(z0, z1), h = rr(h0, h1), r = h * rr(.28, .42), g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rnd() * 6; parent.add(g);
      mesh(new THREE.CylinderGeometry(r * .45, r, h * .75, 7, 2), rock, 0, h * .375, 0, g); const cap = mesh(new THREE.IcosahedronGeometry(r * .62, 0), rockG, rr(-.3, .3) * r, h * .8, 0, g); cap.scale.set(1, 1.1, 1);
      for (let k = 0; k < 3; k++) mesh(new THREE.IcosahedronGeometry(r * rr(.25, .4), 0), rockG, rr(-.6, .6) * r, h * rr(.3, .65), rr(-.6, .6) * r, g); } }
  /* a broad river or lake surface (x0..x1, z0..z1) */
  function river(parent, x0, x1, z0, z1, color) { const w = mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0, 1, 1), std({ map: T.water, color: color || 0xffffff, roughness: .12, metalness: .25, transparent: true, opacity: .93 }), (x0 + x1) / 2, .02, (z0 + z1) / 2, parent); w.rotation.x = -Math.PI / 2; w.castShadow = false; w.userData.noMerge = true; return w; }
  /* a sampan (thuyền nan / thuyền đò) with a rower in a conical hat */
  const hull = std({ color: 0x5a3a24, flatShading: true }), conical = std({ color: 0xd8c08a, flatShading: true }), cloth = std({ color: 0x3a5a7a, flatShading: true });
  function boat(parent, x, z, ry) { const b = new THREE.Group(); b.position.set(x, .05, z); b.rotation.y = ry || 0; parent.add(b); const h = mesh(new THREE.CylinderGeometry(.75, .45, 4.4, 8, 1, false, 0, Math.PI), hull, 0, .35, 0, b); h.rotation.z = Math.PI / 2; h.rotation.y = Math.PI / 2;
    mesh(new THREE.CylinderGeometry(.18, .22, .9, 6), cloth, .9, .9, 0, b); mesh(new THREE.ConeGeometry(.42, .3, 10), conical, .9, 1.5, 0, b); const oar = mesh(new THREE.CylinderGeometry(.04, .04, 2.6, 4), M.wood, 1.4, .7, .35, b); oar.rotation.z = .9; return b; }
  /* rice terraces (ruộng bậc thang) climbing a hill at (x, z): stepped rings, gold or green */
  function terraces(parent, x, z, rings, r0, step, rise, gold) { const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); const ma = std({ map: T.rice, color: gold ? 0xffd27a : 0xffffff });
    const mg = std({ map: T.rice, color: gold ? 0xd8e07a : 0xc8e8a0 }); for (let i = 0; i < rings; i++) { const r = r0 - i * step; if (r <= step) break; const c = mesh(new THREE.CylinderGeometry(r, r + step * .35, rise, 22), i % 3 === 2 ? mg : ma, rr(-.5, .5) * step * i * .3, rise * (i + .5), rr(-.4, .4) * step * i * .3, g); c.scale.z = rr(.5, .65); c.rotation.y = rr(-.2, .2); }
    return g; }
  /* a wooden stilt house (nhà sàn) with a steep roof */
  function stiltHouse(parent, x, z, ry) { const h = new THREE.Group(); h.position.set(x, 0, z); h.rotation.y = ry || 0; parent.add(h); for (const px of [-2.2, 0, 2.2]) for (const pz of [-1.4, 1.4]) mesh(new THREE.CylinderGeometry(.12, .14, 8, 6), M.wood, px, -2, pz, h);   /* stilts run down into a sloping ground, so a house never floats */
    tbox(h, 5, 2.2, 3.2, M.wood, 0, 3.1, 0, 1.2); const r = mesh(new THREE.CylinderGeometry(.01, 3.6, 2.6, 4, 1), std({ color: 0x6a5a48, flatShading: true }), 0, 5.5, 0, h); r.rotation.y = Math.PI / 4; r.scale.set(1, 1, .7); return h; }
  /* coal-patty wall (tường bánh than, Bát Tràng): round dark patties pressed onto a laterite wall */
  T.coal = tex(256, 128, (g, w, h) => { g.fillStyle = '#8c5a3e'; g.fillRect(0, 0, w, h); speck(g, w, h, 600, ['#7a4a32', '#9a6a4a'], 1, 3); for (let y = 12; y < h; y += 24) for (let x = 12 + (y % 48 ? 12 : 0); x < w; x += 24) { g.fillStyle = ['#2a2420', '#332a24', '#241e1a'][Math.floor(rnd() * 3)]; g.beginPath(); g.arc(x + rr(-2, 2), y + rr(-2, 2), 9, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.07)'; g.beginPath(); g.arc(x - 2, y - 2, 4, 0, 7); g.fill(); } });
  M.coal = std({ map: T.coal });
  /* a dragon kiln (lò bầu/lò rồng): a long brick tunnel climbing a slope, with a tall chimney; returns the chimney top for smoke */
  const kilnBrick = std({ map: T.brick, color: 0xc08a70 });
  function kiln(parent, x, z, ry) { const k = new THREE.Group(); k.position.set(x, 0, z); k.rotation.y = ry || 0; parent.add(k);
    for (let i = 0; i < 6; i++) { const seg = mesh(new THREE.CylinderGeometry(1.6, 1.6, 2.2, 10, 1, false, 0, Math.PI), kilnBrick, i * 2.1, .5 + i * .45, 0, k); seg.rotation.z = Math.PI / 2; seg.rotation.y = Math.PI / 2; seg.rotation.order = 'YXZ'; }
    mesh(new THREE.BoxGeometry(1.4, 7, 1.4), kilnBrick, 13.2, 3.5 + 2.4, 0, k); return [x + Math.cos(ry || 0) * 13.2, 9.6, z - Math.sin(ry || 0) * 13.2]; }
  /* glazed jars (chum vại, lọ gốm): lathe shapes, instanced in rows */
  function jars(parent, n, x0, x1, z0, z1) { const pts = [[0, 0], [.32, 0], [.36, .08], [.62, .55], [.74, .95], [.66, 1.2], [.42, 1.36], [.36, 1.42], [.42, 1.5], [.4, 1.54], [0, 1.54]].map(p => new THREE.Vector2(p[0], p[1])), geo = new THREE.LatheGeometry(pts, 20);
    const cols = [0x6b4a2e, 0x3d5a6a, 0xb8a27a, 0x8a3a2a], per = Math.ceil(n / cols.length); cols.forEach((c, ci) => { const im = new THREE.InstancedMesh(geo, std({ color: c, roughness: .22, metalness: .05, envMapIntensity: 1.4 }), per);
      for (let i = 0; i < per; i++) { dm.position.set(rr(x0, x1), 0, rr(z0, z1)); const s = rr(.45, .9); dm.scale.set(s, s, s); dm.rotation.set(0, rnd() * 6, 0); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); } im.castShadow = im.receiveShadow = true; parent.add(im); }); }
  /* festival flags (cờ hội): poles with triangular five-colour flags along a line */
  function flags(parent, n, x0, x1, z, h) { const cols = [0xd63a2a, 0xf2c230, 0x2a7ad6, 0x2aa65a, 0xf0f0e0]; const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(.06, .08, 1, 5), M.wood, n); const tri = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1.4, 0), new THREE.Vector3(1.6, -.7, 0)]); tri.computeVertexNormals();
    const fl = cols.map(c => new THREE.InstancedMesh(tri, std({ color: c, side: THREE.DoubleSide }), Math.ceil(n / cols.length))), cnt = cols.map(() => 0);
    for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * i / Math.max(1, n - 1), hh = h * rr(.9, 1.1); dm.position.set(x, hh / 2, z); dm.rotation.set(0, 0, 0); dm.scale.set(1, hh, 1); dm.updateMatrix(); poles.setMatrixAt(i, dm.matrix);
      const ci = i % cols.length; dm.position.set(x, hh, z); dm.scale.set(1, 1, 1); dm.rotation.set(0, rr(-.4, .4), 0); dm.updateMatrix(); fl[ci].setMatrixAt(cnt[ci]++, dm.matrix); } fl.forEach((m, i) => { m.count = cnt[i]; parent.add(m); }); poles.castShadow = true; parent.add(poles); return fl; }
  /* a festival drum (trống hội) on a wooden stand */
  function drum(parent, x, z) { const d = new THREE.Group(); d.position.set(x, 0, z); parent.add(d); const b = mesh(new THREE.CylinderGeometry(1, 1, 1.4, 16), std({ color: 0x9a2a1e }), 0, 1.6, 0, d); b.rotation.z = Math.PI / 2;
    for (const s of [-1, 1]) { const f = mesh(new THREE.CircleGeometry(1, 16), std({ color: 0xe8d6b0 }), s * .71, 1.6, 0, d); f.rotation.y = s * Math.PI / 2; } for (const s of [-1, 1]) mesh(new THREE.BoxGeometry(.15, 1.4, .15), M.wood, s * .6, .7, 0, d); return d; }
  /* bamboo grandstand (khán đài tre) with a seated crowd of conical hats and caps */
  function stands(parent, x, z, w, rows, ry) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry || 0; parent.add(g); for (let r = 0; r < rows; r++) tbox(g, w, .5, 1.4, M.wood, 0, .5 + r * .8, -r * 1.4, 1.2);
    const crowd = new THREE.InstancedMesh(new THREE.CylinderGeometry(.22, .28, .8, 6), std({ color: 0xffffff }), Math.floor(w * rows * 1.2)), hat = new THREE.InstancedMesh(new THREE.ConeGeometry(.36, .28, 8), conical, crowd.count); const pal = [0xd63a2a, 0x2a7ad6, 0xf2c230, 0x3a3a3a, 0xf0f0e0, 0x2aa65a];
    for (let i = 0; i < crowd.count; i++) { const r = i % rows, px = -w / 2 + .4 + rnd() * (w - .8); dm.position.set(px, 1.15 + r * .8, -r * 1.4); dm.scale.set(1, 1, 1); dm.rotation.set(0, 0, 0); dm.updateMatrix(); crowd.setMatrixAt(i, dm.matrix); crowd.setColorAt(i, new THREE.Color(pal[i % pal.length]));
      dm.position.y += .62; dm.updateMatrix(); hat.setMatrixAt(i, dm.matrix); } g.add(crowd, hat); return g; }
  /* the sea to the horizon */
  function sea(parent, z0, color) { return river(parent, -260, 260, -260, z0, color || 0x9ad0e0); }
  /* a stepped waterfall (thác nhiều tầng): white curtains over rock ledges, animated foam; returns tick(t) */
  T.falls = tex(64, 256, (g, w, h) => { g.fillStyle = 'rgba(235,248,255,.85)'; g.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { g.strokeStyle = rnd() < .5 ? 'rgba(255,255,255,.9)' : 'rgba(160,200,220,.6)'; g.lineWidth = rr(1, 3); const x = rnd() * w; g.beginPath(); g.moveTo(x, rnd() * h); g.lineTo(x + rr(-1, 1), rnd() * h); g.stroke(); } });
  /* water curtain texture: many streams of varied width and opacity with ragged edges, transparent gaps between groups */
  T.curtain = tex(512, 256, (g, w, h) => { g.clearRect(0, 0, w, h); let x = 0; while (x < w) { const sw = rr(18, 70), gap = rnd() < .45 ? rr(10, 40) : rr(0, 6);
      for (let k = 0; k < sw; k += 2) { const edge = Math.min(k, sw - k) / (sw / 2), a = Math.min(1, edge * 1.6) * rr(.55, .95); g.fillStyle = 'rgba(240,250,255,' + a.toFixed(2) + ')'; g.fillRect(x + k, 0, 2, h); }
      for (let i = 0; i < sw * 3; i++) { g.fillStyle = rnd() < .5 ? 'rgba(255,255,255,.9)' : 'rgba(150,190,210,.5)'; g.fillRect(x + rnd() * sw, rnd() * h, 1.5, rr(10, 60)); } x += sw + gap; } });
  function falls(parent, x, z, tiers, width) { const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); const ticks = [];
    const rockFace = std({ vertexColors: true, roughness: .95, normalMap: N.latClean, normalScale: new THREE.Vector2(.8, .8) }), c = new THREE.Color();
    const cm = new THREE.MeshStandardMaterial({ map: T.curtain, vertexColors: true, transparent: true, opacity: .9, roughness: .2, depthWrite: false, side: THREE.DoubleSide });   /* vertex alpha: separate streams, rock between them */ T.curtain.repeat.set(2, 1);
    for (let i = 0; i < tiers; i++) { const y0 = i * 4.2, zz = -i * 4.5, w = width * (1 - i * .06);
      const geo = new THREE.BoxGeometry(w + 8, 4.4, 4.6, 40, 6, 3), p = geo.attributes.position, col = new Float32Array(p.count * 3);
      for (let k = 0; k < p.count; k++) { const px = p.getX(k), py = p.getY(k), pz = p.getZ(k), n = fbm(px * .15 + i * 7, py * .3 + pz * .2, 4); p.setX(k, px + (n - .5) * .8); p.setY(k, py + (py > 1.5 ? (n - .5) * .9 : 0)); p.setZ(k, pz + (n - .5) * 1.4);
        c.setHex(py > 1.6 && n > .42 ? 0x3a6430 : 0x4a463e); c.offsetHSL(0, 0, (n - .5) * .16); col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b; }
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals(); mesh(geo, rockFace, 0, y0 - .2, zz - 2.3, g);
      foliage(g, 36, () => [rr(-w / 2 - 3, w / 2 + 3), y0 + 2.1, zz - rr(1, 4), rr(1.5, 2.6)], LT.tree, .3);
      const cg = new THREE.PlaneGeometry(w, 4.7, 72, 6), cp = cg.attributes.position, uv = cg.attributes.uv, ca = new Float32Array(cp.count * 4); for (let k = 0; k < cp.count; k++) { const yy = cp.getY(k); cp.setZ(k, Math.pow((2.35 - yy) / 4.7, 2) * 1.4 + Math.sin(cp.getX(k) * .4 + i) * .3); uv.setX(k, uv.getX(k) + i * .37);
        const n = fbm(cp.getX(k) * .09 + i * 13.7, i * 3.1, 3), a = Math.min(1, Math.max(0, (n - .44) * 9)), sh = .82 + .14 * n; ca[k * 4] = sh * .94; ca[k * 4 + 1] = sh; ca[k * 4 + 2] = sh; ca[k * 4 + 3] = a; }   /* streams of varied width between dark rock, a cool white rather than paper white */
      cg.setAttribute('color', new THREE.BufferAttribute(ca, 4));
      cg.computeVertexNormals(); const cu = mesh(cg, cm, 0, y0 - .1, zz + .2, g); cu.userData.noMerge = true; cu.castShadow = false;
      ticks.push(spray(g, 4, 0, y0 - 2.6, zz + 1.8, w / 2, .8)); }
    return function(tt) { T.curtain.offset.y = (tt * 1.4) % 1; ticks.forEach(f => f(tt)); }; }
  /* a bamboo raft (bè tre) */
  function raft(parent, x, z, ry) { const r = new THREE.Group(); r.position.set(x, .08, z); r.rotation.y = ry || 0; parent.add(r); for (let i = 0; i < 8; i++) { const c = mesh(new THREE.CylinderGeometry(.14, .14, 5, 6), M.culm, 0, 0, -1 + i * .28, r); c.rotation.z = Math.PI / 2; } mesh(new THREE.ConeGeometry(.42, .3, 10), conical, .8, 1.4, 0, r); mesh(new THREE.CylinderGeometry(.18, .22, .9, 6), cloth, .8, .75, 0, r); return r; }
  /* a communal house (đình làng): wide timber hall on a raised base, big tiled roof with upturned corners (đầu đao) and a ridge */
  function dinh(parent, x, z, w, d) { const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); tbox(g, w + 2, .8, d + 2, M.latClean, 0, .4, 0, 2.4);
    for (let i = 0; i < 7; i++) for (const pz of [-d / 2, d / 2]) mesh(new THREE.CylinderGeometry(.26, .3, 3.2, 10), std({ color: 0x5a2e1e }), -w / 2 + i * w / 6, 2.4, pz, g);
    tbox(g, w, 2.6, .12, M.wood, 0, 2.1, -d / 2 + .3, 1.2); const roof = gableRoof(g, w, d, 3.2, 1.8, 4, { curl: .95 }); return g; }
  /* red festival lanterns (đèn lồng) on a line; emissive so they glow at dusk */
  function lanterns(parent, n, x0, x1, z, y) { const im = new THREE.InstancedMesh(new THREE.SphereGeometry(.38, 10, 8), new THREE.MeshStandardMaterial({ color: 0xd8382a, emissive: 0xff5a2a, emissiveIntensity: .9 }), n);
    for (let i = 0; i < n; i++) { dm.position.set(x0 + (x1 - x0) * i / Math.max(1, n - 1), y + Math.sin(i * 1.7) * .3, z); dm.scale.set(1, 1.25, 1); dm.rotation.set(0, 0, 0); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); } parent.add(im); return im; }
  /* Đông Hồ folk prints drying on mats: simple woodblock motifs (rooster, pig, carp) on dó paper, lined up in the yard */
  function prints(parent, n, x0, x1, z0, z1) { const motifs = ['gà', 'lợn', 'cá']; const texs = motifs.map((m, mi) => tex(128, 160, (g, w, h) => { g.fillStyle = '#f3e6c4'; g.fillRect(0, 0, w, h); speck(g, w, h, 300, ['rgba(180,150,100,.25)'], 1, 2); g.strokeStyle = '#2a1a10'; g.lineWidth = 3; g.strokeRect(6, 6, w - 12, h - 12);
      const col = ['#c8382a', '#2a6a3a', '#d8a02a', '#3a4a8a'];
      if (mi === 0) { g.fillStyle = col[0]; g.beginPath(); g.ellipse(64, 92, 34, 26, 0, 0, 7); g.fill(); g.fillStyle = col[2]; g.beginPath(); g.moveTo(92, 80); g.lineTo(116, 50); g.lineTo(104, 96); g.fill(); g.fillStyle = col[0]; g.beginPath(); g.arc(40, 58, 14, 0, 7); g.fill(); g.fillStyle = '#d8382a'; g.fillRect(34, 40, 10, 8); g.strokeStyle = '#2a1a10'; g.beginPath(); g.moveTo(56, 116); g.lineTo(52, 136); g.moveTo(70, 116); g.lineTo(74, 136); g.stroke(); }
      if (mi === 1) { g.fillStyle = '#2a2a2a'; g.beginPath(); g.ellipse(64, 90, 44, 30, 0, 0, 7); g.fill(); g.strokeStyle = '#f3e6c4'; g.lineWidth = 4; g.beginPath(); g.arc(52, 86, 10, 0, 7); g.stroke(); g.beginPath(); g.arc(78, 92, 8, 0, 7); g.stroke(); g.fillStyle = '#2a2a2a'; for (const lx of [36, 52, 76, 92]) g.fillRect(lx, 112, 7, 18); }
      if (mi === 2) { g.fillStyle = col[3]; g.beginPath(); g.ellipse(60, 84, 40, 20, -.5, 0, 7); g.fill(); g.fillStyle = col[0]; g.beginPath(); g.moveTo(92, 60); g.lineTo(118, 44); g.lineTo(110, 76); g.fill(); g.fillStyle = '#f3e6c4'; g.beginPath(); g.arc(34, 98, 4, 0, 7); g.fill(); }
      g.fillStyle = '#2a1a10'; g.font = '700 16px serif'; g.textAlign = 'center'; g.fillText(m, 64, 150); }));
    texs.forEach(t => { t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; });
    const mats = texs.map(t => std({ map: t, side: THREE.DoubleSide })), per = Math.ceil(n / 3), geo = new THREE.PlaneGeometry(1.2, 1.5);
    mats.forEach((m, mi) => { const im = new THREE.InstancedMesh(geo, m, per); for (let i = 0; i < per; i++) { dm.position.set(rr(x0, x1), .1 + mi * .003, rr(z0, z1)); dm.rotation.set(-Math.PI / 2, 0, rr(-.15, .15)); dm.scale.set(1, 1, 1); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); } im.receiveShadow = true; parent.add(im); }); }
  return { THREE, rnd, rr, dm, tex, T, M, N, LT, std, nmap, mesh, tbox, gableRoof, house, banyan, bamboo, foliage, grass, wear, fbm, heightfield, range, karstTower, karst2, terracedValley, spray, lotusPond, well, dawn, karst, river, boat, terraces, stiltHouse, kiln, jars, flags, drum, stands, sea, falls, raft, dinh, lanterns, prints, life, merge };
}
