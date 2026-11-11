/* Gate 5 · Bát Tràng (Hà Nội): a brick lane between walls pressed with coal patties (bánh than), old climbing kilns with smoking
   chimneys, rows of glazed jars, the Red River beyond. Late afternoon. Sources: Wikipedia "Bát Tràng". */
import { makeKit } from './kit.js';
export function build(THREE, opts) {
  const K = makeKit(THREE, 53), { M, tbox } = K, scene = new THREE.Scene();
  K.dawn(scene, { phone: opts && opts.phone, elevation: 8, azimuth: 50, turbidity: 10, rayleigh: 3, mie: .012, exposure: .74, fog: 0xe8c0a0, fogDensity: .0075, sunColor: 0xffb070, sunPower: 3.6 });
  tbox(scene, 160, 1, 120, M.earth, 0, -.5, 20, 6); tbox(scene, 26, .06, 16, M.brick, 0, .03, 4, 1.6);
  tbox(scene, 30, 3, .6, M.coal, -18, 1.5, -6, 3); tbox(scene, 30, 3, .6, M.coal, 18, 1.5, -6, 3); tbox(scene, .6, 3, 14, M.coal, -13.5, 1.5, 3, 3); tbox(scene, .6, 3, 14, M.coal, 13.5, 1.5, 3, 3);
  K.jars(scene, 44, -12.5, -8, -4, 8); K.jars(scene, 44, 8, 12.5, -4, 8);
  const ch1 = K.kiln(scene, -30, -18, .15), ch2 = K.kiln(scene, 8, -22, -.1);
  K.house(scene, -6, -14, 9, 5); K.house(scene, 26, -14, 9, 5, -.2);
  K.river(scene, -200, 200, -110, -60, 0xc8a890); K.bamboo(scene, 40, -70, 70, -50, -46);
  K.wear(scene, 26, 16, 0, 4);
  const smokeA = K.life(scene, { leaves: [-12, 0], smoke: ch1 }), smokeB = K.life(scene, { leaves: [12, 0], smoke: ch2 });
  K.merge(scene);
  return { scene, tick: t => { smokeA(t); smokeB(t); }, groundZ: 5, fight: { pos: [0, 6.2, 23], target: [0, 3.4, 0] },
    intro: [[-30, 20, -30], [-14, 12, 0], [10, 8, 20], [0, 6.2, 23]], introLook: [-10, 6, -20] };
}
