/* Gate 8 · Sân đình (Owner 2026-11-10: a generic village communal-house yard, no real đình named). Brick courtyard, the đình hall
   with its big tiled roof and upturned corners, a banyan, a flag pole, red lanterns, a lotus pond, festival dusk. Lý Trưởng's yard. */
import { makeKit } from './kit.js';
export function build(THREE, opts) {
  const K = makeKit(THREE, 83), { M, tbox, mesh } = K, scene = new THREE.Scene();
  K.dawn(scene, { phone: opts && opts.phone, elevation: 2.5, azimuth: 80, turbidity: 12, rayleigh: 3.5, mie: .02, exposure: .95, fog: 0xc8907a, fogDensity: .008, sunColor: 0xff9050, sunPower: 3.2, hemi: .7 });
  tbox(scene, 160, 1, 120, M.earth, 0, -.5, 20, 6); tbox(scene, 34, .06, 20, M.brick, 0, .03, 2, 1.6);
  K.dinh(scene, 0, -12, 16, 7);
  K.banyan(scene, -20, -4, .8); K.lotusPond(scene, 22, 2, 16, 12);
  mesh(new THREE.CylinderGeometry(.14, .18, 14, 8), M.wood, -11, 7, 4, scene); K.flags(scene, 1, -11, -11, 4, 14);
  K.lanterns(scene, 12, -16, 16, -4.2, 6.2); K.lanterns(scene, 6, -28, -18, 6, 5); K.lanterns(scene, 6, 18, 28, 6, 5);
  for (const s of [-1, 1]) { tbox(scene, 28, 2, .6, M.lat, s * 30, 1, -8); }
  K.bamboo(scene, 60, -60, 60, -26, -22);
  K.wear(scene, 34, 20, 0, 2); K.grass(scene, 260, -60, 60, -20, 30, [-18, 18, -8, 13]);
  const tick = K.life(scene, { leaves: [-20, -4], smoke: [8, 6, -14] });
  K.merge(scene);
  return { scene, tick, groundZ: 5, fight: { pos: [0, 6.2, 23], target: [0, 3.4, 0] },
    intro: [[-34, 16, 24], [-12, 10, 16], [16, 8, 22], [0, 6.2, 23]], introLook: [0, 5, -12] };
}
