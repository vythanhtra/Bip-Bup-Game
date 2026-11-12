/* Gate 1 · Đường Lâm (ADR-010; Owner approved the v2 prototype 2026-11-10).
   Mông Phụ village gate as "thượng gia hạ môn": a laterite gateway with two wooden door leaves, and on top a small timber house with a
   two-slope roof of ngói mũi hài. Beside it the old banyan, a lotus pond, a laterite well, laterite lane walls, tiled houses, a bamboo
   hedge, rice fields and the hills on the horizon, at dawn. Sources: sovhtt.hanoi.gov.vn (model of the gate), duonglamvillage.com. */
import { makeKit } from './kit.js';
export function build(THREE, opts) {
  const K = makeKit(THREE, 11), { M, tbox, mesh, rr, dm } = K, scene = new THREE.Scene();
  K.dawn(scene, { phone: opts && opts.phone, elevation: 6, azimuth: -58, turbidity: 9, rayleigh: 3, mie: .012, exposure: .95, fog: 0xf0c49a, fogDensity: .0045, sunColor: 0xffbf80, sunPower: 3.8, hemi: .6 });
  scene.userData.tone = 'agx'; scene.userData.sat = 1.14;   /* cinematic trial (Owner 2026-11-11): AgX; depth of field removed, the place behind stays sharp (Owner 2026-11-12: "nền hiện quá mờ") */
  /* ground: earth, brick yard in front of the gate (the fight's ground at z = 5), paddies with their bunds */
  tbox(scene, 160, 1, 120, M.earth, 0, -.5, 20, 6);
  tbox(scene, 16, .06, 12, M.brick, 0, .03, 3, 3.2); K.wear(scene, 16, 12, 0, 3);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) tbox(scene, 13.4, .3, 8.4, M.rice, -62 + i * 14, -.05, -30 - j * 9.5, 5);
  for (let i = 0; i < 9; i++) tbox(scene, .6, .5, 40, M.earth, -69 + i * 14, .05, -44, 6);
  K.lotusPond(scene, 19, 4, 20, 14);
  /* the gate */
  const gate = new THREE.Group(); gate.position.set(0, 0, -6); scene.add(gate); const GW = 7.2, GD = 4.6;
  tbox(gate, 2.4, 3.3, GD, M.lat, -GW / 2 + 1.2, 1.65, 0); tbox(gate, 2.4, 3.3, GD, M.lat, GW / 2 - 1.2, 1.65, 0);
  tbox(gate, GW, 1.1, GD, M.lat, 0, 3.85, 0); tbox(gate, GW + .2, .18, GD + .2, M.wood, 0, 4.47, 0);
  for (const x of [-GW / 2 + .2, -1.25, 1.25, GW / 2 - .2]) for (const z of [-GD / 2 + .2, GD / 2 - .2]) mesh(new THREE.CylinderGeometry(.14, .16, 1.0, 8), M.wood, x, 5.05, z, gate);
  tbox(gate, GW - .3, .9, .12, M.wood, 0, 5.05, GD / 2 - .2, 1.2); tbox(gate, GW - .3, .9, .12, M.wood, 0, 5.05, -GD / 2 + .2, 1.2);
  K.gableRoof(gate, GW, GD, 2.1, 1.1, 5.55, { eaveTiles: true });
  for (const s of [-1, 1]) { const leaf = new THREE.Group(); leaf.position.set(s * 1.2, 0, GD / 2 - .55); gate.add(leaf); tbox(leaf, 1.2, 3.2, .14, M.wood, -s * .6, 1.6, 0, 1.2);
    for (const y of [.6, 1.6, 2.6]) tbox(leaf, 1.18, .07, .16, M.iron, -s * .6, y, .01); leaf.rotation.y = s > 0 ? .9 : -.35; }
  mesh(new THREE.BoxGeometry(2.4, .02, GD), M.dark, 0, .02, 0, gate);
  const board = K.tex(512, 128, (g, w, h) => { g.fillStyle = '#3a1e12'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9963f'; g.lineWidth = 8; g.strokeRect(8, 8, w - 16, h - 16); g.fillStyle = '#e7c26a'; g.font = '700 56px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('MÔNG PHỤ', w / 2, h / 2 + 4); });
  board.wrapS = board.wrapT = THREE.ClampToEdgeWrapping; const bd = mesh(new THREE.PlaneGeometry(2.6, .65), new THREE.MeshStandardMaterial({ map: board, roughness: .8 }), 0, 3.85, GD / 2 + .02, gate); bd.userData.noMerge = true;
  /* lane walls, houses, banyan, well, bamboo, horizon */
  for (const s of [-1, 1]) { tbox(scene, 26, 2.2, .7, M.lat, s * (GW / 2 + 13), 1.1, -6); tbox(scene, 26.4, .18, 1.0, M.ridge, s * (GW / 2 + 13), 2.29, -6); }
  K.house(scene, -17, -15, 10, 5); K.house(scene, 13, -16, 9, 5); K.house(scene, 30, -13, 8, 5, -.25); K.house(scene, -33, -12, 9, 5, .2);
  K.banyan(scene, -14, -3, .85); K.well(scene, -19, 3);
  K.bamboo(scene, 75, 8, 44, -11, -8.5); K.bamboo(scene, 75, -44, -8, -11, -8.5);
  K.range(scene, -185, 42, 70, 0x7a8aa0);   /* hills toward Ba Vì on the horizon */
  const treeL = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), K.std({ color: 0x55703f, flatShading: true }), 80);
  for (let i = 0; i < 80; i++) { dm.position.set(rr(-110, 110), rr(1.5, 3), rr(-82, -70)); const s = rr(2.5, 4.5); dm.scale.set(s, s, s); dm.rotation.set(K.rnd(), K.rnd(), 0); dm.updateMatrix(); treeL.setMatrixAt(i, dm.matrix); } scene.add(treeL);
  K.grass(scene, 520, -60, 60, -12, 30, [-12, 12, -3, 12]);   /* grass on the earth round the yard, none on the fight floor */
  const tick = K.life(scene, { smoke: [13, 6, -16], leaves: [-14, -3] });
  K.merge(scene);
  return { scene, tick, groundZ: 5,
    fight: { pos: [0, 6.2, 23], target: [0, 3.4, 0] },
    intro: [[-26, 18, 26], [-6, 9, 30], [18, 7, 24], [0, 6.2, 23]], introLook: [-8, 6, -2] };
}
