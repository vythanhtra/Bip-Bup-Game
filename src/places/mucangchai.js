/* Gate 4 · Mù Cang Chải (Lào Cai since the 2025 merger): golden rice terraces wrapping the hillsides at harvest, wooden houses on the
   slopes, mountains and low cloud in the valley, golden afternoon. Sources: vietnamtourism.com (Lào Cai guide). */
import { makeKit } from './kit.js';
export function build(THREE, opts) {
  const K = makeKit(THREE, 41), { M, tbox, rr } = K, scene = new THREE.Scene();
  K.dawn(scene, { phone: opts && opts.phone, elevation: 16, azimuth: 70, turbidity: 7, rayleigh: 2.6, mie: .01, exposure: .6, fog: 0xe8d4a8, fogDensity: .0035, sunColor: 0xffc070, sunPower: 3.6 });
  tbox(scene, 60, 1, 30, M.earth, 0, -.5, 8, 6); tbox(scene, 40, .3, 6, M.rice, 0, -.05, 18, 5);          /* the terrace the fight stands on */
  K.terracedValley(scene, 300, 220, 0, -70, 34, 1.3, true, 26);
  K.stiltHouse(scene, -14, -8, .2); K.stiltHouse(scene, 16, -10, -.3); K.stiltHouse(scene, 34, -4, -.6);
  K.range(scene, -200, 80, 90, 0x55705a);
  const tick = K.life(scene, { leaves: [-30, -10] });
  K.merge(scene);
  return { scene, tick, groundZ: 5, fight: { pos: [0, 6.2, 23], target: [0, 3.4, 0] },
    intro: [[-50, 30, -10], [-20, 18, 20], [20, 10, 26], [0, 6.2, 23]], introLook: [0, 10, -50] };
}
