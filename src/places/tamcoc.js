/* Gate 2 · Tam Cốc (Ninh Bình): the Ngô Đồng river winding through rice fields between limestone karst towers, sampans rowed by
   boatwomen in conical hats, morning haze. The fight is on the earth bank by the paddies. Sources: Wikipedia "Tam Cốc-Bích Động". */
import { makeKit } from './kit.js';
export function build(THREE, opts) {
  const K = makeKit(THREE, 23), { M, tbox, rr } = K, scene = new THREE.Scene();
  K.dawn(scene, { phone: opts && opts.phone, elevation: 14, azimuth: -50, turbidity: 10, rayleigh: 2, mie: .008, exposure: .62, fog: 0xdfe3d8, fogDensity: .0055, sunColor: 0xfff0d8, sunPower: 3 });
  tbox(scene, 160, 1, 40, M.earth, 0, -.5, 14, 6);                                   /* the bank where they fight */
  for (let i = 0; i < 4; i++) { tbox(scene, 9.4, .3, 6.4, M.rice, -16 - i * 10, .02, 4 + (i % 2) * 2, 5); tbox(scene, 9.4, .3, 6.4, M.rice, 16 + i * 10, .02, 4 + (i % 2) * 2, 5); }   /* paddies either side of the bank path */
  K.river(scene, -160, 160, -40, -6, 0xc8e8d8);                                       /* Ngô Đồng river */
  for (let i = 0; i < 6; i++) tbox(scene, 18, .3, 10, M.rice, -60 + i * 22, -.08, -50, 5);   /* paddies on the far bank */
  K.karst2(scene, 7, -80, -16, -58, -28, 22, 36); K.karst2(scene, 7, 16, 80, -58, -28, 22, 36); K.karst2(scene, 5, -50, 50, -120, -90, 34, 50); K.range(scene, -175, 46, 80, 0x6a8a78);
  K.karst2(scene, 2, -70, -48, -6, 8, 18, 26); K.karst2(scene, 2, 48, 70, -6, 8, 18, 26);
  for (const [x, z, r] of [[-20, -18, .2], [-6, -24, -.1], [12, -15, 3.1], [26, -26, 2.9], [40, -12, .3]]) K.boat(scene, x, z, r);
  K.bamboo(scene, 40, -40, -16, -4, -2); K.bamboo(scene, 40, 16, 40, -4, -2);
  K.grass(scene, 420, -70, 70, -5, 30, [-14, 14, -2, 13]);
  const tick = K.life(scene, { leaves: [-30, -3] });
  K.merge(scene);
  return { scene, tick, groundZ: 5, fight: { pos: [0, 6.2, 23], target: [0, 3.4, 0] },
    intro: [[-40, 22, -10], [-10, 10, 10], [20, 8, 26], [0, 6.2, 23]], introLook: [0, 8, -40] };
}
