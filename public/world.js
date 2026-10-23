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
  tibup: { name: 'Tí Bụp', aura: '#ffd23f', aura2: '#ff8c1a', line: 'Bụp một cái, trời long đất lở.', bio: '16 tuổi, làng Tre. Nắm tay to gấp đôi cái đầu. Yếu điểm: mùi thịt kho.' },
  hoayen: { name: 'Hỏa Yến', aura: '#ff3b3b', aura2: '#ffd23f', line: 'Nóng!!! Cái gì cũng nóng!!!', bio: 'Bán bánh tráng nướng ở Chợ Đêm. Nướng cháy cả quầy hàng xóm. Đánh mạnh, nhưng cửa sổ phản xạ hẹp hơn.' },
  bangnhi: { name: 'Băng Nhi', aura: '#7fe7ff', aura2: '#ffffff', line: 'Bình... tĩnh... rồi... BỤP.', bio: 'Người Sông Băng, nói chậm, đánh nhanh. Được tha một lần bụp sớm mỗi trận.' },
  thachlao: { name: 'Thạch Lão', aura: '#5ac54f', aura2: '#aab0c4', line: 'Tao là đá. Đá không vội.', bio: 'Hòn đá bị Tí tập đấm 10.000 lần nên thành tinh. Máu nhiều, đánh chậm, rất hay dỗi.' }
};

var ENEMIES = {
  linhco:   { name: 'Lính Cỏ',        spr: 'linhco',   line: 'Tôi là bù nhìn. Tôi không sợ gì hết. Trừ lửa.' },
  traului:  { name: 'Trâu Lười',      spr: 'traului',  line: 'Khò... khò... đánh tao sau nhé...' },
  linhdem:  { name: 'Lính Đèn Lồng',  spr: 'linhco',   swap: { g: '#8e44ad', n: '#e8343c' }, line: 'Ca đêm lương gấp đôi, đánh cũng gấp đôi.' },
  vitgia:   { name: 'Vịt Giả Gà',     spr: 'vitgia',   line: 'Cục tác... à nhầm... cạc.' },
  lytruong: { name: 'Lý Trưởng Ngáp', spr: 'lytruong', boss: true, line: 'Ngáp... làng này cấm nhanh. Ai nhanh... ngáp... phạt thuế.' },
  cao:      { name: 'Anh Hai Hàng Hiệu', spr: 'cao',   boss: true, line: 'Bá Khí xịn đây, 99k một gói, mua 2 tặng 1. Ơ... BÍP!' }
};

var WORLDS = [
  { id: 1, name: 'Làng Tre', sub: 'Bình minh, ruộng lúa, gió tre', mech: 'Phản xạ thuần. Nghe BÍP là BỤP.', sky: ['#7fc8ff', '#ffe0a8'], ground: '#6fbf4a', accent: '#5ac54f', text: '#1a1026', open: true },
  { id: 2, name: 'Chợ Đêm', sub: 'Đèn lồng, mùi nướng, lừa đảo', mech: 'Có VỊT giả gà. Màn đỏ, tiếng CẠC thì đứng im.', sky: ['#141a3a', '#3a1a4a'], ground: '#3a2f4a', accent: '#ff5fa2', text: '#ffffff', open: true },
  { id: 3, name: 'Sông Băng', sub: 'Cực quang, tuyết, hắt xì', mech: 'Nhịp đôi: BÍP BÍP thì BỤP BỤP. Giữ tay để tích khí.', sky: ['#0b1a3a', '#3b6fe0'], ground: '#cfefff', accent: '#7fe7ff', text: '#ffffff', open: false },
  { id: 4, name: 'Núi Lửa', sub: 'Dung nham, khói lẩu', mech: 'Khói che màn. Điểm sáng nhỏ dần, phải bụp đúng chỗ.', sky: ['#2a0a0a', '#ff6b1a'], ground: '#3a1a1a', accent: '#ff3b3b', text: '#ffffff', open: false },
  { id: 5, name: 'Thiên Đình', sub: 'Mây vàng, tiên nữ livestream', mech: 'Trộn tất cả. Trùm cuối 3 hiệp.', sky: ['#2b1a4a', '#ffd23f'], ground: '#f6e7b0', accent: '#ffd23f', text: '#1a1026', open: false }
];

/* 16 gates of phase 1. hp = enemy HP, wait = [min,max] ms before signal, to = timeout ms, fake = fake-signal chance */
var GATES = [
  { w: 1, e: 'linhco',   hp: 60,  wait: [1500, 3500], to: 1100, fake: 0 },
  { w: 1, e: 'traului',  hp: 70,  wait: [1500, 3500], to: 1050, fake: 0 },
  { w: 1, e: 'linhco',   hp: 80,  wait: [1300, 3500], to: 1000, fake: 0 },
  { w: 1, e: 'traului',  hp: 90,  wait: [1300, 3800], to: 1000, fake: 0 },
  { w: 1, e: 'linhco',   hp: 100, wait: [1200, 4000], to: 950,  fake: 0 },
  { w: 1, e: 'traului',  hp: 110, wait: [1200, 4000], to: 900,  fake: 0 },
  { w: 1, e: 'linhco',   hp: 120, wait: [1000, 4200], to: 900,  fake: 0 },
  { w: 1, e: 'lytruong', hp: 200, wait: [1500, 4500], to: 900,  fake: 0, dim: true },
  { w: 2, e: 'vitgia',   hp: 100, wait: [1300, 3800], to: 950,  fake: 0.25 },
  { w: 2, e: 'linhdem',  hp: 110, wait: [1300, 3800], to: 900,  fake: 0.3 },
  { w: 2, e: 'vitgia',   hp: 120, wait: [1200, 4000], to: 900,  fake: 0.35 },
  { w: 2, e: 'linhdem',  hp: 130, wait: [1200, 4000], to: 850,  fake: 0.4 },
  { w: 2, e: 'vitgia',   hp: 140, wait: [1000, 4200], to: 850,  fake: 0.45 },
  { w: 2, e: 'linhdem',  hp: 150, wait: [1000, 4200], to: 800,  fake: 0.5 },
  { w: 2, e: 'vitgia',   hp: 160, wait: [900, 4500],  to: 800,  fake: 0.5 },
  { w: 2, e: 'cao',      hp: 260, wait: [1200, 4800], to: 800,  fake: 0.55, foxbluff: true }
];

/* dialog before certain gates. who: sprite name for portrait */
var DIALOG = {
  1: [
    { who: 'banoi', name: 'Bà Nội Bụp', text: 'Tí! Nghe kỹ đây. Gà Bíp gáy "BÍP" thì mày BỤP. Chưa gáy mà bụp là ăn đòn.' },
    { who: 'tibup', name: 'Tí Bụp', text: 'Bà ơi, lỡ lúc đó con đói thì sao?' },
    { who: 'banoi', name: 'Bà Nội Bụp', text: 'Thì bụp cho nhanh rồi về ăn. Đi!' },
    { who: 'gabip', name: 'Gà Bíp', text: 'Tôi là trọng tài. Màn XANH và tiếng BÍP của tôi là thật. Chấm hết.' }
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
var WIN_LINES = {
  8: 'Lý Trưởng ngáp một cái rồi ngủ luôn. Làng Tre tỉnh dậy, gà gáy lại đúng 5 giờ.',
  16: 'Anh Hai chạy mất dép, để lại 300 gói Bá Khí giả. Phía bắc, Sông Băng đang rục rịch tan... (Vùng 3 sắp mở)'
};
var ENEMY_WIN_LINES = ['Thua à? Chậm Chạp Chi Thuật bám vào mày rồi.', 'Về ăn cơm đi, mai đánh tiếp.', 'Ngủ ngon nhé, nhà vô địch.'];

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
