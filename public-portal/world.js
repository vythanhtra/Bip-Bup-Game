/* ===== BÁ KHÍ world data: story, worlds, enemies, gates, dialog ===== */
var STORY = [
  'Lục Địa Bụp từng là nơi ai cũng nhanh như chớp. Gà gáy đúng 5 giờ, bánh chưng chín đúng 12 tiếng, ai gọi là có người dạ liền.',
  'Rồi Lão Rùa Thiên Tuế, mười nghìn tuổi, tức vì cả thiên hạ chê chậm, đã thả Chậm Chạp Chi Thuật xuống trần.',
  'Từ đó gà gáy lúc 2 giờ chiều. Nồi bánh chưng nhà Tí nấu ba tháng chưa chín. Lý trưởng ngáp một cái hết nửa ngày.',
  'Tí Bụp, học trò duy nhất của Bà Nội Bụp, mang theo Gà Bíp làm trọng tài, lên đường đi qua 40 cửa để trả lại phản xạ cho muôn dân.',
  'Luật chỉ có một: Gà gáy BÍP thì BỤP. Chưa gáy mà bụp là ăn đòn.'
];
var RANKS = [
  [200, '👑', 'Đế Vương Bụp'],
  [240, '🥇', 'Vương Giả Vàng'],
  [290, '⚔️', 'Cao Thủ Sắt'],
  [350, '🎋', 'Võ Giả Tre'],
  [1e9, '🌱', 'Tân Thủ Cỏ']
];
function rankOf(avg){ for (var i = 0; i < RANKS.length; i++) if (avg < RANKS[i][0]) return RANKS[i]; return RANKS[RANKS.length - 1]; }

var HEROES = {
  tibup: { name: 'Tí Bụp', aura: '#ffd23f', aura2: '#ff8c1a', unlock: 0, hearts: 3, dmg: 1, win: 1, forgive: 0, perk: 'Cân bằng. Không mạnh, không yếu, rất đói.', line: 'Bụp một cái, trời long đất lở.', bio: '16 tuổi, làng Tre. Nắm tay to gấp đôi cái đầu. Yếu điểm: mùi thịt kho.' },
  hoayen: { name: 'Hỏa Yến', aura: '#ff3b3b', aura2: '#ffd23f', unlock: 16, hearts: 3, dmg: 1.3, win: 0.8, forgive: 0, perk: 'Đòn +30%, nhưng cửa sổ phản xạ hẹp hơn 20%.', line: 'Nóng!!! Cái gì cũng nóng!!!', bio: 'Bán bánh tráng nướng ở Chợ Đêm. Nướng cháy cả quầy hàng xóm. Đánh mạnh, nhưng cửa sổ phản xạ hẹp hơn.' },
  bangnhi: { name: 'Băng Nhi', aura: '#7fe7ff', aura2: '#ffffff', unlock: 24, hearts: 3, dmg: 1, win: 1, forgive: 1, perk: 'Được tha lần bụp sớm đầu tiên mỗi trận.', line: 'Bình... tĩnh... rồi... BỤP.', bio: 'Người Sông Băng, nói chậm, đánh nhanh. Được tha một lần bụp sớm mỗi trận.' },
  thachlao: { name: 'Thạch Lão', aura: '#5ac54f', aura2: '#aab0c4', unlock: 32, hearts: 5, dmg: 0.8, win: 1.25, forgive: 0, perk: '5 tim, cửa sổ rộng hơn 25%, nhưng đòn yếu hơn 20%.', line: 'Tao là đá. Đá không vội.', bio: 'Hòn đá bị Tí tập đấm 10.000 lần nên thành tinh. Máu nhiều, đánh chậm, rất hay dỗi.' }
};

var ENEMIES = {
  linhco:   { name: 'Lính Cỏ',        spr: 'linhco',   line: 'Tôi là bù nhìn. Tôi không sợ gì hết. Trừ lửa.' },
  traului:  { name: 'Trâu Lười',      spr: 'traului',  line: 'Khò... khò... đánh tao sau nhé...' },
  linhdem:  { name: 'Lính Đèn Lồng',  spr: 'linhco',   swap: { g: '#8e44ad', n: '#e8343c' }, line: 'Ca đêm lương gấp đôi, đánh cũng gấp đôi.' },
  vitgia:   { name: 'Vịt Giả Gà',     spr: 'vitgia',   line: 'Cục tác... à nhầm... cạc.' },
  lytruong: { name: 'Lý Trưởng Ngáp', spr: 'lytruong', boss: true, line: 'Ngáp... làng này cấm nhanh. Ai nhanh... ngáp... phạt thuế.' },
  cao:      { name: 'Anh Hai Hàng Hiệu', spr: 'cao',   boss: true, line: 'Bá Khí xịn đây, 99k một gói, mua 2 tặng 1. Ơ... BÍP!' },
  canhcut:  { name: 'Cánh Cụt Múa Lân', spr: 'canhcut', line: 'Tùng tùng cắc tùng... lạnh quá quên bài rồi.' },
  nguoituyet: { name: 'Người Tuyết Hắt Xì', spr: 'nguoituyet', line: 'Hắt... hắt... đừng đánh lúc tôi đang... XÌ!' },
  bangvuong: { name: 'Băng Vương Hắt Hơi', spr: 'bangvuong', boss: true, line: 'Ta hắt hơi một cái là cả sông đóng băng. Hai cái thì... ngươi tự hiểu.' },
  khilua:   { name: 'Khỉ Lửa', spr: 'khilua', line: 'Ăn chuối nướng không? Nướng bằng chính tay tao.' },
  ganuong:  { name: 'Gà Nướng Hồi Sinh', spr: 'ganuong', line: 'Người ta nướng tôi ba lần. Lần này tôi nướng lại.' },
  hoalong:  { name: 'Hỏa Long Nấu Lẩu', spr: 'hoalong', boss: true, line: 'Lẩu của ta sôi bằng khói. Ngươi nhìn thấy gì thì bụp cái đó.' },
  thienbinh: { name: 'Thiên Binh Ngủ Gật', spr: 'thienbinh', line: 'Canh cổng trời ba nghìn năm... cho tao chợp mắt một... BỤP?' },
  tiennu:   { name: 'Tiên Nữ Livestream', spr: 'tiennu', line: 'Mọi người ơi thả tim đi, hôm nay em đánh nhau với một thằng nhóc nè.' },
  rua:      { name: 'Lão Rùa Thiên Tuế', spr: 'rua', boss: true, phases: 3, line: 'Mười nghìn năm ta chậm. Hôm nay cả thiên hạ phải chậm theo ta.' }
};

var WORLDS = [
  { id: 1, name: 'Làng Tre', sub: 'Bình minh, ruộng lúa, gió tre', mech: 'Phản xạ thuần. Nghe BÍP là BỤP.', sky: ['#7fc8ff', '#ffe0a8'], ground: '#6fbf4a', accent: '#5ac54f', text: '#1a1026', open: true },
  { id: 2, name: 'Chợ Đêm', sub: 'Đèn lồng, mùi nướng, lừa đảo', mech: 'Có VỊT giả gà. Màn đỏ, tiếng CẠC thì đứng im. Cửa 14 lật luật: CẠC thì bụp, BÍP thì im.', sky: ['#141a3a', '#3a1a4a'], ground: '#3a2f4a', accent: '#ff5fa2', text: '#ffffff', open: true },
  { id: 3, name: 'Sông Băng', sub: 'Cực quang, tuyết, hắt xì', mech: 'Nhịp đôi: BÍP BÍP thì bụp hai cái. Giữ ngón tay rồi thả đúng lúc để tích khí. Cửa 22: gà gáy 2 hay 3 tiếng, bụp sau tiếng CUỐI.', sky: ['#0b1a3a', '#3b6fe0'], ground: '#cfefff', accent: '#7fe7ff', text: '#ffffff', open: true },
  { id: 4, name: 'Núi Lửa', sub: 'Dung nham, khói lẩu', mech: 'Khói che màn. Điểm sáng hiện ra rồi nhỏ dần, phải bụp đúng chỗ.', sky: ['#2a0a0a', '#ff6b1a'], ground: '#3a1a1a', accent: '#ff3b3b', text: '#ffffff', open: true },
  { id: 5, name: 'Thiên Đình', sub: 'Mây vàng, tiên nữ livestream', mech: 'Gà Bíp báo trước mánh nào rồi trộn tất cả. Trùm cuối 3 hiệp.', sky: ['#2b1a4a', '#ffd23f'], ground: '#f6e7b0', accent: '#ffd23f', text: '#1a1026', open: true }
];

/* 16 gates of phase 1. hp = enemy HP, wait = [min,max] ms before signal, to = timeout ms, fake = fake-signal chance */
var GATES = [
  { w: 1, e: 'linhco',   hp: 100,  wait: [700, 2400], to: 750, fake: 0 },
  { w: 1, e: 'traului',  hp: 105,  wait: [700, 2400], to: 750, fake: 0 },
  { w: 1, e: 'linhco',   hp: 110,  wait: [700, 2400], to: 750, fake: 0 },
  { w: 1, e: 'traului',  hp: 115,  wait: [700, 2400], to: 750, fake: 0 },
  { w: 1, e: 'linhco',   hp: 120, wait: [700, 2400], to: 750,  fake: 0 },
  { w: 1, e: 'traului',  hp: 125, wait: [700, 2400], to: 750,  fake: 0 },
  { w: 1, e: 'linhco',   hp: 130, wait: [700, 2400], to: 750,  fake: 0 },
  { w: 1, e: 'lytruong', hp: 180, wait: [800, 3200], to: 850,  fake: 0, dim: true },
  { w: 2, e: 'vitgia',   hp: 140, wait: [600, 2800], to: 700,  fake: 0.25 },
  { w: 2, e: 'linhdem',  hp: 105, wait: [600, 2800], to: 700,  fake: 0.3 },
  { w: 2, e: 'vitgia',   hp: 110, wait: [600, 2800], to: 700,  fake: 0.35 },
  { w: 2, e: 'linhdem',  hp: 115, wait: [600, 2800], to: 700,  fake: 0.4 },
  { w: 2, e: 'vitgia',   hp: 120, wait: [600, 2800], to: 700,  fake: 0.45 },
  { w: 2, e: 'linhdem',  hp: 125, wait: [600, 2800], to: 700,  fake: 0.5, mech: ['reverse'] },
  { w: 2, e: 'vitgia',   hp: 135, wait: [600, 2800], to: 700,  fake: 0.5, mech: ['normal', 'reverse', 'reverse'] },
  { w: 2, e: 'cao',      hp: 190, wait: [800, 3200], to: 800,  fake: 0.55, foxbluff: true },
  { w: 3, e: 'canhcut',    hp: 135, wait: [600, 2800], to: 650, fake: 0, mech: ['double'] },
  { w: 3, e: 'nguoituyet', hp: 140, wait: [600, 2800], to: 650, fake: 0, mech: ['double'] },
  { w: 3, e: 'canhcut',    hp: 145, wait: [600, 2800], to: 650, fake: 0, mech: ['double'] },
  { w: 3, e: 'nguoituyet', hp: 110, wait: [600, 2800], to: 650, fake: 0, mech: ['hold'] },
  { w: 3, e: 'canhcut',    hp: 115, wait: [600, 2800], to: 650, fake: 0, mech: ['hold'] },
  { w: 3, e: 'nguoituyet', hp: 120, wait: [600, 2800], to: 650, fake: 0, mech: ['count'] },
  { w: 3, e: 'canhcut',    hp: 125, wait: [600, 2800], to: 650, fake: 0, mech: ['count', 'double', 'hold'] },
  { w: 3, e: 'bangvuong',  hp: 200, wait: [800, 3200], to: 750, fake: 0.2, mech: ['double', 'hold'], sneeze: true },
  { w: 4, e: 'khilua',     hp: 135, wait: [600, 2800], to: 1100, fake: 0, mech: ['spot'], smoke: 0.5, spotR: 1.0 },
  { w: 4, e: 'ganuong',    hp: 140, wait: [600, 2800], to: 1050, fake: 0, mech: ['spot'], smoke: 0.55, spotR: 0.9 },
  { w: 4, e: 'khilua',     hp: 145, wait: [600, 2800], to: 1000, fake: 0, mech: ['spot'], smoke: 0.6, spotR: 0.85 },
  { w: 4, e: 'ganuong',    hp: 150, wait: [600, 2800], to: 1000, fake: 0.25, mech: ['spot'], smoke: 0.6, spotR: 0.8 },
  { w: 4, e: 'khilua',     hp: 115, wait: [600, 2800], to: 950, fake: 0, mech: ['spot'], smoke: 0.65, spotR: 0.75 },
  { w: 4, e: 'ganuong',    hp: 120, wait: [600, 2800], to: 950, fake: 0, mech: ['spot', 'reverse'], smoke: 0.65, spotR: 0.7 },
  { w: 4, e: 'khilua',     hp: 125, wait: [600, 2800], to: 900, fake: 0.2, mech: ['spot', 'reverse', 'count'], smoke: 0.7, spotR: 0.65 },
  { w: 4, e: 'hoalong',    hp: 210, wait: [800, 3200], to: 950, fake: 0.3, mech: ['spot', 'spot', 'double'], smoke: 0.8, spotR: 0.6 },
  { w: 5, e: 'thienbinh',  hp: 135, wait: [600, 2800], to: 950, fake: 0.2, mech: ['normal', 'double', 'hold', 'spot'], smoke: 0.3, spotR: 0.9 },
  { w: 5, e: 'tiennu',     hp: 140, wait: [600, 2800], to: 950, fake: 0.25, mech: ['normal', 'double', 'hold', 'spot'], smoke: 0.3, spotR: 0.85 },
  { w: 5, e: 'thienbinh',  hp: 145, wait: [600, 2800], to: 900, fake: 0.25, mech: ['double', 'hold', 'spot'], smoke: 0.35, spotR: 0.8 },
  { w: 5, e: 'tiennu',     hp: 150, wait: [600, 2800], to: 900, fake: 0.3, mech: ['double', 'hold', 'spot'], smoke: 0.35, spotR: 0.8 },
  { w: 5, e: 'thienbinh',  hp: 155, wait: [600, 2800], to: 900, fake: 0.3, mech: ['double', 'hold', 'spot'], smoke: 0.4, spotR: 0.75 },
  { w: 5, e: 'tiennu',     hp: 120, wait: [600, 2800], to: 900, fake: 0.35, mech: ['double', 'hold', 'spot', 'reverse', 'count'], smoke: 0.4, spotR: 0.7 },
  { w: 5, e: 'thienbinh',  hp: 125, wait: [600, 2800], to: 900, fake: 0.35, mech: ['count', 'reverse', 'spot', 'hold'], smoke: 0.45, spotR: 0.7 },
  { w: 5, e: 'rua',        hp: 120, wait: [800, 3400], to: 750, fake: 0.3, mech: ['normal', 'double'], smoke: 0.2, spotR: 0.9,
    phases: [
      { hp: 120, mech: ['normal', 'double'], fake: 0.3, to: 750, smoke: 0.2, line: 'Hiệp một. Ta còn chưa tỉnh ngủ.' },
      { hp: 140, mech: ['hold', 'double', 'spot'], fake: 0.35, to: 720, smoke: 0.5, line: 'Hiệp hai. Ngươi bắt đầu làm ta thức rồi đấy.' },
      { hp: 160, mech: ['spot', 'hold', 'double', 'reverse', 'count'], fake: 0.45, to: 700, smoke: 0.7, line: 'Hiệp cuối. MƯỜI NGHÌN NĂM BÁ KHÍ!' }
    ] }
];

/* dialog before certain gates. who: sprite name for portrait */
var DIALOG = {
  1: [
    { who: 'banoi', name: 'Bà Nội Bụp', text: 'Tí! Nghe kỹ đây. Gà Bíp gáy "BÍP" thì mày BỤP. Chưa gáy mà bụp là ăn đòn.' },
    { who: 'tibup', name: 'Tí Bụp', text: 'Bà ơi, lỡ lúc đó con đói thì sao?' },
    { who: 'banoi', name: 'Bà Nội Bụp', text: 'Đói thì càng phải nhanh. Bụp chậm là Lý Trưởng đánh thuế luôn cái bụng đói của mày.' },
    { who: 'gabip', name: 'Gà Bíp', text: 'Và đừng nhìn tôi kiểu đó. Tôi là trọng tài, không phải món ăn.' }
  ],
  8: [
    { who: 'lytruong', name: 'Lý Trưởng Ngáp', text: 'Ngáp... làng này cấm nhanh. Ai nhanh... ngáp... là phạt thuế.' },
    { who: 'tibup', name: 'Tí Bụp', text: 'Ông nói xong chưa ạ? Con đợi nãy giờ mọc rêu rồi.' },
    { who: 'gabip', name: 'Gà Bíp', text: 'Cẩn thận: ông ấy ngáp là màn hình tối dần. Đừng ngủ theo ông ấy!' }
  ],
  9: [
    { who: 'gabip', name: 'Gà Bíp', text: 'Chợ Đêm có VỊT giả gà. Nó kêu "CẠC", màn hình ĐỎ. Bụp lúc đó là mắc bẫy.' },
    { who: 'tibup', name: 'Tí Bụp', text: 'Vịt mà cũng dám giả gà à? Thời buổi này...' },
    { who: 'vitgia', name: 'Vịt Giả Gà', text: 'Cục tác... à nhầm... cạc.' }
  ],
  16: [
    { who: 'cao', name: 'Anh Hai Hàng Hiệu', text: 'Anh Hai đây bán Bá Khí xịn, 99k một gói, mua 2 tặng 1. Em mua không? Ơ... BÍP!' },
    { who: 'tibup', name: 'Tí Bụp', text: 'Anh không phải gà. Anh là cáo đeo kính đen.' },
    { who: 'gabip', name: 'Gà Bíp', text: 'Cáo sẽ tự hô BÍP để lừa. Chỉ tin TÔI và màn hình XANH thôi nhé.' }
  ]
};
DIALOG[17] = [
  { who: 'gabip', name: 'Gà Bíp', text: 'Sông Băng lạnh tới mức tôi gáy ra hai tiếng. "BÍP BÍP" thì bụp HAI cái thật nhanh.' },
  { who: 'tibup', name: 'Tí Bụp', text: 'Bụp hai cái thì tay con có nát không?' },
  { who: 'canhcut', name: 'Cánh Cụt Múa Lân', text: 'Nát thì tôi múa lân cho. Tùng tùng... quên bài rồi.' }
];
DIALOG[20] = [
  { who: 'gabip', name: 'Gà Bíp', text: 'Mánh mới: GIỮ ngón tay trên màn hình lúc chờ để tích khí. Tôi gáy thì THẢ ra. Thả sớm là ăn đòn.' },
  { who: 'tibup', name: 'Tí Bụp', text: 'Giữ bao lâu ạ?' },
  { who: 'gabip', name: 'Gà Bíp', text: 'Tới khi tôi gáy. Đừng ngủ.' }
];
DIALOG[24] = [
  { who: 'bangvuong', name: 'Băng Vương Hắt Hơi', text: 'Hắt... Ta hắt hơi một cái, cả sông đóng băng. Hai cái thì... XÌ! XÌ!' },
  { who: 'tibup', name: 'Tí Bụp', text: 'Ông bị cảm thì đi khám, sao lại đổ cho cả sông?' },
  { who: 'gabip', name: 'Gà Bíp', text: 'Trận này trộn nhịp đôi và tích khí. Tôi báo trước từng lượt, nghe cho kỹ.' }
];
DIALOG[25] = [
  { who: 'gabip', name: 'Gà Bíp', text: 'Núi Lửa đầy khói lẩu. Lúc gáy, tôi chỉ thắp được MỘT điểm sáng. Bụp đúng vào đó, nó nhỏ dần đấy.' },
  { who: 'khilua', name: 'Khỉ Lửa', text: 'Bụp trượt là tao nướng chuối trên đầu mày.' }
];
DIALOG[32] = [
  { who: 'hoalong', name: 'Hỏa Long Nấu Lẩu', text: 'Lẩu của ta sôi bằng khói. Ngươi nhìn thấy gì thì bụp cái đó. Nếu nhìn thấy.' },
  { who: 'tibup', name: 'Tí Bụp', text: 'Lẩu gì mà khói thế này, ông cho cả củi vào nồi à?' },
  { who: 'gabip', name: 'Gà Bíp', text: 'Khói dày nhất đấy. Nhìn điểm sáng, đừng nhìn rồng.' }
];
DIALOG[33] = [
  { who: 'tiennu', name: 'Tiên Nữ Livestream', text: 'Mọi người ơi, thả tim đi. Hôm nay em đánh một thằng nhóc mang gà lên trời.' },
  { who: 'gabip', name: 'Gà Bíp', text: 'Thiên Đình trộn mọi mánh. Mỗi lượt tôi hô trước: "Hai tiếng", "Giữ khí", hay "Nhìn kỹ".' }
];
DIALOG[40] = [
  { who: 'rua', name: 'Lão Rùa Thiên Tuế', text: 'Mười nghìn năm ta chậm. Hôm nay cả thiên hạ phải chậm theo ta.' },
  { who: 'tibup', name: 'Tí Bụp', text: 'Ông ơi, nồi bánh chưng nhà con nấu ba tháng rồi. Con cần về trước khi nó thành than.' },
  { who: 'rua', name: 'Lão Rùa Thiên Tuế', text: 'Vậy thì qua được ba hiệp của ta đã. Hiệp một... ta còn chưa tỉnh ngủ.' },
  { who: 'gabip', name: 'Gà Bíp', text: 'Ba hiệp, mỗi hiệp một kiểu. Tôi hô gì bụp nấy. Lần này có thua thì về luyện lại, đừng khóc.' }
];
var WIN_LINES = {
  8: 'Lý Trưởng ngáp một cái rồi ngủ luôn. Làng Tre tỉnh dậy, gà gáy lại đúng 5 giờ.',
  16: 'Anh Hai chạy mất dép, để lại 300 gói Bá Khí giả. Phía bắc, Sông Băng bắt đầu tan. Hỏa Yến xin đi cùng (đã mở nhân vật).',
  24: 'Băng Vương hắt hơi lần cuối rồi ngủ đông. Sông chảy lại. Băng Nhi lặng lẽ đi theo đoàn (đã mở nhân vật).',
  32: 'Nồi lẩu của Hỏa Long cuối cùng cũng chín. Khói tan. Thạch Lão, hòn đá bị Tí đấm 10.000 lần, đứng dậy đi theo (đã mở nhân vật).',
  40: 'Lão Rùa ngã xuống, rồi... ngáp. Chậm Chạp Chi Thuật tan. Gà gáy đúng 5 giờ. Tí chạy về làng: nồi bánh chưng vừa chín tới. Lão Rùa được mời một miếng. Ông nhai... rất chậm.'
};
/* in-battle voice: enemy taunts while waiting, hero reactions */
var TAUNTS = {
  linhco: ['Bù nhìn cũng biết đợi.', 'Mày run à?', 'Gió thổi tao còn đứng vững.', 'Chim còn không sợ tao, mày sợ gì?', 'Tao đứng đây từ hồi mày chưa đẻ.', 'Đấm bù nhìn là xui 7 năm đó.'],
  traului: ['Khò... khò...', 'Đánh khẽ thôi, tao đang mơ.', 'Cỏ ngon hơn mày.', 'Mơ thấy mày thua...', 'Năm phút nữa... dậy...', 'Nằm cũng là võ.'],
  linhdem: ['Ca đêm, đừng làm ồn.', 'Lương tăng ca đâu?', 'Đèn lồng sáng hơn mày.', 'Chụp cái ảnh đã.', 'Phí đứng nhìn: 2 nghìn.', 'Về ngủ đi, chợ đóng rồi.'],
  vitgia: ['Cục... cạc... cục.', 'Tin tao đi, tao là gà.', 'Gà gì mà biết bơi?', 'Cạc. Ý tôi là cục.', 'Chứng chỉ gà đây này.', 'Gà bơi là gà tiến hóa.'],
  lytruong: ['Ngáp... thuế đâu?', 'Làng này... ngáp... cấm nhanh.', 'Đợi ta ngáp xong.', 'Nhanh là phạm pháp.', 'Ta ngáp một cái là hết tuần.', 'Ký đơn xin bụp chưa?'],
  cao: ['Mua 2 tặng 1 nhé?', 'Anh Hai uy tín.', 'Kính đen 99k.', 'Em là khách VIP đó.', 'Hàng chính hãng... của anh.', 'Thiếu tiền anh cho nợ.'],
  canhcut: ['Tùng tùng... quên bài.', 'Lạnh quá, bụp cho ấm.', 'Múa lân không bụng?', 'Cắc tùng... cắc gì nhỉ?', 'Đầu lân nặng quá.', 'Khán giả đâu hết rồi?'],
  nguoituyet: ['Hắt... hắt...', 'Đừng đánh lúc tôi xì.', 'Mũi cà rốt mới thay.', 'Cảm 400 năm rồi.', 'Ai có khăn giấy không?', 'Hắt... chưa xì... hồi hộp chưa?'],
  bangvuong: ['Hắt... Xì chưa?', 'Một cái là đóng băng.', 'Ta cảm, ngươi chết.', 'Khăn tay của ta là cả sông.', 'Hắt hơi hoàng gia đấy.', 'Đừng nhìn mũi ta.'],
  khilua: ['Chuối nướng không?', 'Tay tao đang cháy.', 'Khỉ mà cũng biết bụp.', 'Than tự thân, giá rẻ.', 'Mày nóng hay tao nóng?', 'Đừng đổ nước!'],
  ganuong: ['Nướng tao ba lần rồi.', 'Giòn chưa?', 'Lần này tao nướng mày.', 'Thơm không? Thơm là mùi tao.', 'Da tao như giày da.', 'Chấm muối tiêu chanh không?'],
  hoalong: ['Lẩu sôi chưa?', 'Khói mắt chưa?', 'Nhìn được gì không?', 'Thêm rau không?', 'Lẩu rồng, 1 triệu một nồi.', 'Ho đi, khói đấy.'],
  thienbinh: ['Ba nghìn năm... ngáp.', 'Chợp mắt tí.', 'Cổng trời... zzz.', 'Lương tính theo mây.', 'Ai đó? Ờ... ngủ tiếp.', 'Ngủ đứng, chuyên nghiệp.'],
  tiennu: ['Thả tim đi mọi người!', 'Em đang live nha.', 'Góc này đẹp không?', 'Link dưới bình luận.', '10 nghìn mắt xem đó.', 'Đừng chửi em, em khóc.'],
  rua: ['Mười nghìn năm.', 'Chậm... là nhanh.', 'Ngươi vội gì?', 'Để ta nghĩ... đến tuần sau.', 'Mai bụp cũng được mà.', 'Ta đã thấy nhiều kẻ nhanh. Giờ họ già rồi.']
};
var HERO_CHEER = {
  tibup: ['BỤP!', 'Đói quá!', 'Nữa đi!', 'Bà xem nè!', 'Tay to có khác!', 'Ngon cơm!'],
  hoayen: ['NÓNG!!!', 'Cháy!', 'Thêm lửa!', 'Bánh tráng nướng!', 'Giòn!', 'Rực!'],
  bangnhi: ['Bình... tĩnh.', 'Lạnh.', 'Vừa đủ.', 'Xong rồi.', 'Đừng vội mừng.', 'Băng.'],
  thachlao: ['Đá không vội.', 'Hừm.', 'Xong.', 'Đá rơi.', 'Chậm mà chắc.', 'Mười nghìn cú đấm trả lại.']
};
var HERO_OUCH = {
  tibup: ['Ui da!', 'Bà ơi!', 'Lỡ tay!', 'Con đói nên run!', 'Oái!', 'Đau quá bà!'],
  hoayen: ['Tức!!!', 'Ai bụp?!', 'Nóng máu!', 'Cháy luôn nhà nó!', 'Hừ!', 'Lỡ!'],
  bangnhi: ['...', 'Hơi vội.', 'Lạnh rồi.', 'Tính sai.', 'Hm.', 'Thở.'],
  thachlao: ['Dỗi.', 'Đau đá.', 'Hừ.', 'Đá cũng biết đau.', 'Mẻ rồi.', 'Về làm đá lại.']
};
/* per-character voice: base pitch (Hz), waveform, speed */
var VOICES = {
  tibup: [420, 'square', 1.0], hoayen: [520, 'sawtooth', 1.2], bangnhi: [480, 'sine', 0.8], thachlao: [160, 'triangle', 0.7],
  banoi: [300, 'triangle', 0.9], gabip: [900, 'square', 1.4],
  linhco: [260, 'square', 1.0], traului: [120, 'triangle', 0.6], linhdem: [240, 'square', 1.0], vitgia: [700, 'sawtooth', 1.3],
  lytruong: [200, 'triangle', 0.5], cao: [380, 'sawtooth', 1.3], canhcut: [600, 'square', 1.2], nguoituyet: [340, 'sine', 0.9],
  bangvuong: [180, 'triangle', 0.7], khilua: [560, 'sawtooth', 1.5], ganuong: [320, 'square', 1.1], hoalong: [110, 'sawtooth', 0.6],
  thienbinh: [220, 'triangle', 0.6], tiennu: [640, 'sine', 1.3], rua: [90, 'triangle', 0.45]
};
var ROUND_CALL = { normal: 'Chờ nhé...', double: 'Hai tiếng, hai bụp!', hold: 'Giữ ngón tay, tích khí!', spot: 'Nhìn kỹ điểm sáng!', reverse: 'LUẬT NGƯỢC! Cạc thì bụp, bíp thì im!', count: 'ĐẾM GÁY! Bụp sau tiếng CUỐI!' };
var ENEMY_WIN_LINES = ['Thua à? Chậm Chạp Chi Thuật bám vào mày rồi.', 'Chậm thế này thì Lão Rùa cũng thắng được mày.', 'Ngủ ngon nhé, nhà vô địch.', 'Phạm luật ba lần. Bà Nội mà biết thì...'];

/* ---- backgrounds. t in seconds. gy = ground y ---- */
function drawBg(ctx, w, W, H, t, gy){
  var g = ctx.createLinearGradient(0, 0, 0, gy); g.addColorStop(0, w.sky[0]); g.addColorStop(1, w.sky[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (w.id === 1) bgTre(ctx, W, H, t, gy);
  else if (w.id === 2) bgCho(ctx, W, H, t, gy);
  else if (w.id === 3) bgBang(ctx, W, H, t, gy);
  else if (w.id === 4) bgLua(ctx, W, H, t, gy);
  else bgThien(ctx, W, H, t, gy);
}
function hills(ctx, W, gy, base, amp, freq, phase, color){
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, gy);
  for (var x = 0; x <= W; x += 8) ctx.lineTo(x, base - Math.abs(Math.sin(x * freq + phase)) * amp - Math.sin(x * freq * 3.1 + phase) * amp * 0.2);
  ctx.lineTo(W, gy); ctx.closePath(); ctx.fill();
}
function bgTre(ctx, W, H, t, gy){
  ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(W * 0.78, gy * 0.42, Math.min(W, H) * 0.09, 0, 7); ctx.fill();
  hills(ctx, W, gy, gy * 0.78, gy * 0.22, 0.012, t * 0.05, '#7fd1a0');
  hills(ctx, W, gy, gy * 0.9, gy * 0.14, 0.02, 1.7 + t * 0.1, '#58b06e');
  var sp = Math.max(60, W / 9), off = (t * 12) % sp, i, x;
  for (i = -1; i < W / sp + 1; i++) {
    x = i * sp + off + Math.sin(i * 7) * 14;
    ctx.fillStyle = i % 2 ? '#3f9a4a' : '#2e7d32'; ctx.fillRect(x, gy * 0.35, 7, gy * 0.65);
    ctx.fillStyle = '#1e5a24'; for (var y = gy * 0.4; y < gy; y += 36) ctx.fillRect(x - 1, y, 9, 3);
    ctx.fillStyle = '#5ac54f'; ctx.fillRect(x + 7, gy * 0.45 + (i % 3) * 20, 22, 4); ctx.fillRect(x - 20, gy * 0.6 + (i % 2) * 24, 20, 4);
  }
  ctx.fillStyle = '#6fbf4a'; ctx.fillRect(0, gy, W, H - gy);
  ctx.fillStyle = '#4e9c35'; for (i = 0; i < 6; i++) ctx.fillRect(0, gy + 14 + i * 22, W, 4);
  ctx.fillStyle = '#8bd36a'; ctx.fillRect(0, gy, W, 5);
}
function bgCho(ctx, W, H, t, gy){
  var i, x, y;
  ctx.fillStyle = '#fff'; for (i = 0; i < 40; i++) { x = (i * 97) % W; y = (i * 53) % (gy * 0.6); ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)); ctx.fillRect(x, y, 2, 2); } ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.arc(W * 0.2, gy * 0.25, Math.min(W, H) * 0.06, 0, 7); ctx.fill();
  ctx.fillStyle = '#1a1030';
  var rw = Math.max(70, W / 7);
  for (i = -1; i < W / rw + 1; i++) { x = i * rw; var hh = gy * (0.35 + ((i * 7) % 5) * 0.06); ctx.fillRect(x, gy - hh, rw - 6, hh); ctx.beginPath(); ctx.moveTo(x - 10, gy - hh); ctx.lineTo(x + rw / 2 - 3, gy - hh - 28); ctx.lineTo(x + rw + 4, gy - hh); ctx.fill(); }
  ctx.strokeStyle = '#2a1a40'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, gy * 0.42); for (x = 0; x <= W; x += 10) ctx.lineTo(x, gy * 0.42 + Math.sin(x / W * Math.PI) * 24); ctx.stroke();
  for (i = 0; i < W / 70 + 1; i++) {
    x = i * 70 + 25; y = gy * 0.42 + Math.sin(x / W * Math.PI) * 24 + 12 + Math.sin(t * 2 + i) * 3;
    var rg = ctx.createRadialGradient(x, y, 2, x, y, 40); rg.addColorStop(0, 'rgba(255,120,60,.55)'); rg.addColorStop(1, 'rgba(255,120,60,0)'); ctx.fillStyle = rg; ctx.fillRect(x - 40, y - 40, 80, 80);
    ctx.fillStyle = i % 3 === 0 ? '#ffd23f' : '#e8343c'; ctx.fillRect(x - 7, y - 9, 14, 18); ctx.fillStyle = '#1a1026'; ctx.fillRect(x - 8, y - 11, 16, 3); ctx.fillRect(x - 8, y + 9, 16, 3);
  }
  ctx.fillStyle = '#3a2f4a'; ctx.fillRect(0, gy, W, H - gy);
  ctx.fillStyle = '#4a3f5e'; for (i = 0; i < W / 26 + 1; i++) for (var j = 0; j < 5; j++) ctx.fillRect(i * 26 + (j % 2) * 13, gy + 10 + j * 20, 18, 10);
  ctx.fillStyle = '#ff5fa2'; ctx.fillRect(0, gy, W, 4);
}
function bgBang(ctx, W, H, t, gy){
  for (var i = 0; i < 3; i++) { ctx.fillStyle = ['rgba(127,231,255,.25)', 'rgba(198,255,46,.18)', 'rgba(255,95,162,.18)'][i]; ctx.beginPath(); ctx.moveTo(0, gy * 0.1 + i * 30);
    for (var x = 0; x <= W; x += 10) ctx.lineTo(x, gy * 0.1 + i * 30 + Math.sin(x * 0.01 + t + i) * 40); ctx.lineTo(W, gy * 0.3 + i * 30); ctx.lineTo(0, gy * 0.3 + i * 30); ctx.fill(); }
  hills(ctx, W, gy, gy * 0.8, gy * 0.3, 0.015, 0.4, '#dff4ff'); hills(ctx, W, gy, gy * 0.92, gy * 0.15, 0.025, 2, '#b9e4ff');
  ctx.fillStyle = '#cfefff'; ctx.fillRect(0, gy, W, H - gy); ctx.fillStyle = '#9fd3ef'; ctx.fillRect(0, gy, W, 4);
}
function bgLua(ctx, W, H, t, gy){
  hills(ctx, W, gy, gy * 0.75, gy * 0.35, 0.01, 1, '#4a1a1a'); hills(ctx, W, gy, gy * 0.9, gy * 0.2, 0.02, 3, '#2a0f0f');
  ctx.fillStyle = '#ff6b1a'; ctx.fillRect(0, gy, W, H - gy); ctx.fillStyle = '#ffd23f'; for (var i = 0; i < W / 40; i++) ctx.fillRect(i * 40 + Math.sin(t + i) * 6, gy + 8, 18, 4);
  ctx.fillStyle = '#3a1a1a'; ctx.fillRect(0, gy, W, 5);
}
function bgThien(ctx, W, H, t, gy){
  for (var i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(255,255,255,.75)'; var x = ((i * 173 + t * 10) % (W + 200)) - 100, y = gy * (0.2 + (i % 3) * 0.2); ctx.beginPath(); ctx.arc(x, y, 30, 0, 7); ctx.arc(x + 35, y - 10, 38, 0, 7); ctx.arc(x + 75, y, 28, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#f6e7b0'; ctx.fillRect(0, gy, W, H - gy); ctx.fillStyle = '#ffd23f'; ctx.fillRect(0, gy, W, 5);
}
