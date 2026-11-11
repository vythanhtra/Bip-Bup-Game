/* Gate 3 · Đông Hồ (Bắc Ninh): the woodblock print village. Prints on dó paper (rooster, pig, carp) dry in rows on the yard, tiled
   houses, areca palms, haystacks, the Đuống river dike behind. Bright noon. Sources: Wikipedia "Đông Hồ painting". */
import { makeKit } from './kit.js';
export function build(THREE, opts) {
  const K = makeKit(THREE, 31), { M, tbox, mesh, rr } = K, scene = new THREE.Scene();
  K.dawn(scene, { phone: opts && opts.phone, elevation: 52, azimuth: -35, turbidity: 4, rayleigh: 1.5, exposure: .48, fog: 0xdce8f0, fogDensity: .005, sunColor: 0xfff6e8, sunPower: 3.4 });
  tbox(scene, 160, 1, 120, M.earth, 0, -.5, 20, 6); tbox(scene, 30, .06, 14, M.brick, 0, .03, 4, 3.2);
  K.prints(scene, 60, -15, -4.5, -1, 10); K.prints(scene, 60, 4.5, 15, -1, 10);
  K.house(scene, -12, -9, 10, 5); K.house(scene, 2, -10, 10, 5); K.house(scene, 16, -9, 9, 5); K.house(scene, -28, -6, 9, 5, .3); K.house(scene, 30, -6, 9, 5, -.3);
  const trunk = K.std({ color: 0x8a7a5a }), frond = K.std({ color: 0x4f8a3a, flatShading: true, side: THREE.DoubleSide });
  for (const [x, z] of [[-20, 0], [-22, 6], [21, 1], [24, -2], [-8, -16], [10, -17]]) { const h = rr(9, 12); mesh(new THREE.CylinderGeometry(.16, .2, h, 6), trunk, x, h / 2, z, scene);
    for (let i = 0; i < 7; i++) { const f = mesh(new THREE.ConeGeometry(.5, 3.4, 4), frond, x, h, z, scene); f.rotation.z = Math.PI / 2 - .5; f.rotation.y = i / 7 * Math.PI * 2; f.geometry.translate(0, 1.6, 0); } }
  const hay = K.std({ color: 0xd8b860, flatShading: true }); for (const [x, z] of [[-30, 10], [32, 12], [-36, -14]]) { mesh(new THREE.CylinderGeometry(1.6, 1.8, 2.4, 10), hay, x, 1.2, z, scene); mesh(new THREE.ConeGeometry(1.9, 2, 10), hay, x, 3.4, z, scene); }
  tbox(scene, 220, 3, 8, M.earth, 0, 1.2, -40, 6); K.river(scene, -200, 200, -80, -45, 0xa8c8c0); K.bamboo(scene, 60, -60, 60, -34, -30);
  K.wear(scene, 30, 14, 0, 4); K.grass(scene, 300, -60, 60, -14, 30, [-16, 16, -4, 12]);
  const tick = K.life(scene, { leaves: [-20, 2], smoke: [2, 5.5, -12] });
  K.merge(scene);
  return { scene, tick, groundZ: 5, fight: { pos: [0, 6.2, 23], target: [0, 3.4, 0] },
    intro: [[-24, 16, 18], [-8, 12, 14], [14, 9, 20], [0, 6.2, 23]], introLook: [-10, 0, 4] };
}
