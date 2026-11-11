/* Gate 6 · Đồ Sơn (Hải Phòng), home of the buffalo-fighting festival (lễ hội chọi trâu): a sand arena ringed by bamboo stands and a
   crowd, five-colour festival flags, a big drum, the green Đồ Sơn hills and the sea behind. Bright festival day.
   Sources: Wikipedia "Đồ Sơn buffalo fighting festival". */
import { makeKit } from './kit.js';
export function build(THREE, opts) {
  const K = makeKit(THREE, 61), { M, tbox, mesh } = K, scene = new THREE.Scene();
  K.dawn(scene, { phone: opts && opts.phone, elevation: 40, azimuth: -30, turbidity: 3, rayleigh: 1.2, exposure: .5, fog: 0xd8e8f4, fogDensity: .0045, sunColor: 0xfff4e0, sunPower: 3.4 });
  const sand = K.std({ map: K.T.earth, color: 0xf0dcb0 }); K.tbox(scene, 160, 1, 120, sand, 0, -.5, 20, 6);
  K.stands(scene, -20, -6, 22, 5, .25); K.stands(scene, 20, -6, 22, 5, -.25); K.stands(scene, 0, -12, 18, 5, 0);
  K.flags(scene, 18, -34, 34, -2, 7); K.flags(scene, 10, -34, -16, 14, 6); K.flags(scene, 10, 16, 34, 14, 6);
  K.drum(scene, -15, 8); K.drum(scene, 15, 8);
  K.range(scene, -78, 34, 40, 0x3f7a42);
  K.sea(scene, -40, 0x8ac8e0);
  const tick = K.life(scene, { leaves: [-30, 10] });
  K.merge(scene);
  return { scene, tick, groundZ: 5, fight: { pos: [0, 6.2, 23], target: [0, 3.4, 0] },
    intro: [[0, 26, 40], [-24, 14, 18], [16, 9, 24], [0, 6.2, 23]], introLook: [0, 4, -10] };
}
