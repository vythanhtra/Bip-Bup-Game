/* Gate 7 · Thác Bản Giốc (Cao Bằng): the wide multi-tier waterfall on the Quây Sơn river, a green pool with bamboo rafts, karst hills
   around, fresh morning. The fight is on the grassy riverbank. Sources: Wikipedia "Ban Gioc–Detian Falls". */
import { makeKit } from './kit.js';
export function build(THREE, opts) {
  const K = makeKit(THREE, 71), { M, tbox } = K, scene = new THREE.Scene();
  K.dawn(scene, { phone: opts && opts.phone, elevation: 22, azimuth: -40, turbidity: 5, rayleigh: 1.8, exposure: .58, fog: 0xd8e6e0, fogDensity: .0065, sunColor: 0xfff0d0, sunPower: 3.2 });
  const grass = K.std({ map: K.T.rice, color: 0x7aa060 }); tbox(scene, 160, 1, 40, grass, 0, -.5, 16, 5);
  K.river(scene, -160, 160, -46, -4, 0x6ab8a8);
  const fallTick = K.falls(scene, 0, -48, 4, 60);
  K.karst2(scene, 5, -100, -40, -82, -50, 30, 44); K.karst2(scene, 5, 40, 100, -82, -50, 30, 44); K.range(scene, -150, 60, 70, 0x5a7a62); const sprayTick = K.spray(scene, 10, 0, .5, -40, 28, 3);
  K.raft(scene, -14, -14, .3); K.raft(scene, 10, -20, -.2); K.raft(scene, 26, -12, .1);
  K.bamboo(scene, 40, -50, -14, -2, 0); K.bamboo(scene, 40, 14, 50, -2, 0);
  K.grass(scene, 520, -70, 70, -2, 34, [-14, 14, 0, 13]);
  const life = K.life(scene, { leaves: [-30, -1] });
  K.merge(scene);
  return { scene, tick: t => { life(t); fallTick(t); sprayTick(t); }, groundZ: 5, fight: { pos: [0, 6.2, 23], target: [0, 4.2, 0] },
    intro: [[-30, 14, -20], [0, 9, -16], [24, 8, 14], [0, 6.2, 23]], introLook: [0, 6, -48] };
}
