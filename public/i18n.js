/* ===== i18n: UI strings (vi default, en) + merge of LANG_EN data layers into the world/story globals ===== */
var I18N = (function(){
  var UI = {
    vi: {
      title: 'Bá Khí: Battle Aura', logo: 'BÁ KHÍ', logoSub: 'BATTLE AURA', brand: 'BÁ KHÍ', brandSub: 'BATTLE AURA',
      tag: 'Gà gáy BÍP thì BỤP. Chưa gáy mà bụp là ăn đòn.', play: 'VÀO GAME', daily: '📅 Cửa Hằng Ngày', vs: '🥊 Đấu Tay Đôi', story: '📜 Cốt truyện', sound: '🔊 Âm thanh', mutedBtn: '🔇 Đang tắt tiếng', langBtn: '🌐 English',
      home: '← Về trang chính', quit: '✕ Thoát', next: 'CỬA TIẾP ▸', nextN: 'CỬA {n} ▸', retry: '🔁 Đánh lại', practice: '🥋 Luyện tập', share: '📋 Sao chép kết quả', img: '🖼️ Lưu ảnh thẻ', link: '🔗 Link thách cửa này', map: '🗺️ Bản đồ',
      resHint: 'Dán vào Zalo, Messenger, story. Ai mở link thách sẽ nhảy thẳng vào cửa này và phải nhanh hơn bạn.', dlgTap: 'Chạm để tiếp ▸', dlgSkipped: 'Đã bỏ qua hội thoại',
      gate: 'Cửa {n}', gateName: 'Cửa {n} · {w}', practiceTag: 'LUYỆN', dailyHud: 'Cửa HẰNG NGÀY {d}', dailyTitle: 'CỬA HẰNG NGÀY {d}',
      copyFail: 'Không sao chép được, chụp màn hình để khoe nhé', copied: 'Đã sao chép! Dán vào Zalo, Messenger, FB…', copiedLink: 'Đã sao chép link thách đấu cửa {n}!', copiedDaily: 'Đã sao chép link thách Cửa Hằng Ngày!', vsMissing: 'Chế độ đang cập nhật, thử lại sau',
      chalBanner: '🥊 Có người thách bạn {g} với phản xạ {ms}ms. Vượt được không?', acceptChal: 'NHẬN THÁCH ĐẤU', chalDaily: '📅 Có người thách bạn Cửa Hằng Ngày {d} với phản xạ {ms}ms.', chalDailyPast: ' Cửa đó đã qua ngày, bạn vẫn đánh được nhưng không tính chuỗi.', acceptDaily: 'NHẬN THÁCH HẰNG NGÀY',
      rankSubAvg: 'Phản xạ trung bình {ms}ms · ', rankSubNone: 'Chưa có dữ liệu phản xạ · ', rankSubTail: '{s}⭐ · {a}/{b} cửa', heroLock: '🔒 Qua cửa {n}', worldLock: 'Mở khi qua cửa {n}',
      beepName: 'Gà Bíp', grandmaName: 'Bà Nội Bụp', dailyIntro: 'Cửa Hằng Ngày {d}: cả thế giới hôm nay đánh đúng cửa này, đúng thứ tự mánh này. Lần đầu mới tính. Đừng tin vịt.', practiceIntro: 'Luyện tập: 5 tim, không tính sao, không mở cửa. Tập cho quen tay rồi đánh thật.',
      idle: ['Cục...', 'Cục cục...', 'Hmm...', 'Chờ nhé...'], foxBluff: 'BÍP! (tin anh đi)', sneeze: 'Hắt... XÌ!', quack: 'CẠC!!', quackGo: 'CẠC!! (bụp đi!)', beepFreeze: 'TÁC!! BÍP! (đứng im!)', one: 'MỘT!', two: 'HAI!', three: 'BA!', beep2: 'TÁC!! BÍP BÍP!', beep1: 'TÁC!! BÍP!', releaseCue: 'THẢ!!',
      critLbl: 'CHÍ MẠNG! ', boopLbl: 'BỤP! ', chargeLbl: 'TÍCH KHÍ!!', chargeHit: 'TÍCH KHÍ! ', phase: 'HIỆP {n}', phaseSub: '{l} (+1 ❤️)', missOneLbl: 'THIẾU MỘT BỤP! ', smallSpot: 'ĐIỂM NHỎ! ', doubleLbl: 'BỤP BỤP! ', oneMore: 'Một... nữa!',
      forgiveLbl: 'THA 1 LẦN', forgiveSub: '{h} bình tĩnh', forgiveLine: 'Lần này tha. Lần sau không.', forgiveSay: 'Lần này tha', heart: '-1 ❤️',
      hurtLines: ['Ai bảo bụp!', 'Chưa gáy mà!', 'Đau không?', 'Hụt rồi!', 'Luật đâu? Luật đâu?', 'Bà Nội dạy thế à?'], ouch: 'Ui da!',
      early: 'BỤP SỚM! 💀', earlyRel: 'THẢ SỚM! 💀', fooledSneeze: 'MẮC BẪY HẮT XÌ! 🤧', fooledFox: 'TIN CÁO À? 🦊', fooledDuck: 'MẮC BẪY VỊT! 🦆', fooledRev: 'LUẬT NGƯỢC MÀ! 🔄', countWrong: 'ĐẾM SAI! 🔢', whiff: 'HỤT CHỖ! 💨', spotGone: 'TẮT MẤT RỒI! 🌑', asleep: 'NGỦ À? 😴',
      tutLbl: 'LẦN ĐẦU THA 🦆', tutSub: 'màn đỏ + CẠC = vịt lừa', tutLine: 'Vịt đấy! Lần đầu tha. Lần sau mất tim.', tutSay: 'Vịt đấy! Lần đầu tha.', tutBig: 'GIẢ! ĐỨNG IM', tutHint: 'màn đỏ + tiếng CẠC = vịt lừa. Không bụp.',
      ghostSub: 'người thách bụp ở đây', dimHint: 'Lý Trưởng đang ngáp... đừng ngủ theo', clearedBig: 'QUA CỬA {n}', lostBig: 'THUA', nextSoon: '{ms}ms · cửa tiếp theo...', tapRetry: 'chạm để đánh lại ngay',
      cueAgain: 'NỮA!', cueDouble: 'BỤP BỤP!', cueRelease: 'THẢ!', cueSpot: 'ĐÓ!', cueRev: 'CẠC = BỤP!', cueBoop: 'BỤP!', cueRevFreeze: 'BÍP = IM!', cueDont: 'ĐỪNG!',
      hintHolding: 'đang tích khí... giữ nguyên', hintHold: 'ấn và GIỮ để tích khí', hintDouble: 'chờ hai tiếng gáy...', hintSpot: 'chờ điểm sáng trong khói...', hintRev: 'LUẬT NGƯỢC: CẠC thì bụp, BÍP thì im', hintCount: 'đếm tiếng gáy... bụp sau tiếng CUỐI', hintGhost: 'chờ gà gáy... nhanh hơn {ms}ms', hintWait: 'chờ gà gáy...',
      vsWin: ' 🎉 Bạn THẮNG người thách ({a}ms < {b}ms)!', vsLose: ' 😭 Thua người thách ({b}ms). Đánh lại đi!', vsLose2: ' 😭 Thua người thách ({b}ms).', vsStill: ' Người thách vẫn đang cười.',
      resDailyWon: 'QUA CỬA HẰNG NGÀY {d}', resDailyLost: 'THUA CỬA HẰNG NGÀY {d}', resPracWon: 'LUYỆN XONG, VÀO ĐÁNH THẬT', resPracLost: 'LUYỆN TIẾP ĐI', resFinal: 'THIÊN HẠ ĐỆ NHẤT BỤP!', resBoss: 'HẠ TRÙM {e}!', resWon: 'QUA {g}', resLost: 'THUA {e}',
      subDaily: 'Phản xạ {ms}ms · ', subDailyFirst: 'lần đầu hôm nay, đã tính', subDailyReplay: 'chơi lại, không tính (lần đầu: {f})', subLost: 'thua', subStreak: ' · 🔥 chuỗi {n} ngày', subTomorrow: '. Mai có cửa mới.',
      subAvg: 'Phản xạ trung bình {ms}ms. ', subPerfect: 'Hoàn hảo!', sub2: 'Thiếu sao: cần dưới 250ms.', sub1: 'Thiếu sao: đừng mất tim, và dưới 250ms.', subYourMs: ' Phản xạ của bạn: {ms}ms.', newHero: ' 🎉 Mở nhân vật mới: {h}. Chọn ở bản đồ.',
      cardBoss: 'TRÙM: {e}', cardVs: 'vs {e}', cardDaily: 'Hằng Ngày {d}', cardLost: 'THUA  ', ko: 'K.O.',
      shareGate: '🥊 BÁ KHÍ • {g}{r} • {h}\n⚡ Phản xạ {ms}ms • Cấp {rk}\nThách bạn qua cửa này nhanh hơn tôi 👉 {u}', shareDaily: '📅 BÁ KHÍ Cửa Hằng Ngày {d}{r}{s}\nCùng cửa, cùng mánh, cả thế giới. Ai nhanh hơn? 👉 {u}',
      badgePlayed: 'Hôm nay {d}: {r}{s} · chơi lại không tính', badgeNew: 'Hôm nay {d}: chưa chơi · cùng cửa, cùng mánh cho cả thế giới{s}', badgeStreak: ' · 🔥 chuỗi {n} ngày', badgeLost: '❌ thua',
      vsP1: 'Tí Bụp', vsP2: 'Hỏa Yến', vsQuit: '✕ Thoát', vsAgain: '🔁 Đấu lại', vsShare: '📋 Sao chép kết quả', vsShareText: '🥊 BÁ KHÍ Đấu Tay Đôi: {w} {a}-{b} {l} · nhanh nhất {ms} · ba-khi.vercel.app',
      vsGLwin: ['Một không!', 'Ăn rồi!', 'Nhanh thế!', 'Bụp đẹp!', 'Người kia ngủ à?'], vsGLearly: ['Ai bụp sớm thế?', 'Chưa gáy mà!', 'Bẫy đó, ngu!', 'Luật đâu?'], vsGLfake: ['Hoà? Không có hoà.', 'Cả hai đứng im. Giỏi.', 'Vịt gáy, không phải tôi.'], vsGLend: ['Thiên hạ đệ nhất bụp... trong nhà này.', 'Người thua rửa bát.'],
      vsReady: 'Sẵn sàng!', vsHeld: 'Giữ nguyên... chờ người kia', vsPut: 'Đặt ngón tay vào đây', vsBoth: 'Cả hai đặt ngón tay vào để bắt đầu', vsGo: 'SẴN SÀNG', vsSleep: 'Cả hai ngủ à?', vsRound: 'Hiệp {r} · {a}-{b} · tới 3', vsOpp: 'ĐỐI THỦ {l}', vsCrit: 'CHÍ MẠNG!', vsBoop: 'BỤP!', vsSlow: 'CHẬM!', vsAsleep: 'NGỦ À? 😴', vsPlus: '+1 hiệp', vsMinus: '-1 hiệp', vsZzz: 'ngủ', vsWon: '{n} THẮNG', vsLost: 'THUA {a}-{b}', vsAvg: 'TB {a}ms · đối thủ {b}ms', vsEarlyLbl: 'BỤP SỚM! 💀', vsFakeLbl: 'MẮC BẪY VỊT! 🦆', vsBoopLbl: 'BỤP!', vsQuack: 'CẠC!!', vsBeep: 'TÁC!! BÍP!', vsWait: 'chờ gà gáy...'
    },
    en: {
      title: "Don't Trust the Duck", logo: "DON'T TRUST<br>THE DUCK", logoSub: 'BEEP FIRST. THEN BOOP.', brand: "DON'T TRUST THE DUCK", brandSub: 'A ONE-FINGER REFLEX BRAWLER',
      tag: 'Beep means BOOP. Boop before the beep and you eat a punch.', play: 'PLAY', daily: '📅 Daily Gate', vs: '🥊 2 Players, 1 Phone', story: '📜 Story', sound: '🔊 Sound', mutedBtn: '🔇 Muted', langBtn: '🌐 Tiếng Việt',
      home: '← Home', quit: '✕ Quit', next: 'NEXT GATE ▸', nextN: 'GATE {n} ▸', retry: '🔁 Rematch', practice: '🥋 Practice', share: '📋 Copy result', img: '🖼️ Save card', link: '🔗 Challenge link', map: '🗺️ Map',
      resHint: 'Paste it in the group chat. Whoever opens the link lands on this exact gate and has to beat your time.', dlgTap: 'Tap to continue ▸', dlgSkipped: 'Dialogue skipped',
      gate: 'Gate {n}', gateName: 'Gate {n} · {w}', practiceTag: 'PRACTICE', dailyHud: 'DAILY GATE {d}', dailyTitle: 'DAILY GATE {d}',
      copyFail: "Couldn't copy. Screenshot it and brag anyway.", copied: 'Copied! Paste it anywhere.', copiedLink: 'Challenge link for gate {n} copied!', copiedDaily: 'Daily Gate challenge link copied!', vsMissing: 'Mode is updating, try again later',
      chalBanner: '🥊 Someone challenged you on {g} with a {ms}ms reflex. Beat it?', acceptChal: 'ACCEPT CHALLENGE', chalDaily: '📅 Someone challenged you on Daily Gate {d} with a {ms}ms reflex.', chalDailyPast: " That day is over. You can still play it, but it won't count for your streak.", acceptDaily: 'ACCEPT DAILY CHALLENGE',
      rankSubAvg: 'Average reflex {ms}ms · ', rankSubNone: 'No reflex data yet · ', rankSubTail: '{s}⭐ · {a}/{b} gates', heroLock: '🔒 Clear gate {n}', worldLock: 'Unlocks after gate {n}',
      beepName: 'Beep the Rooster', grandmaName: 'Grandma Boop', dailyIntro: "Daily Gate {d}: the whole world fights this exact gate today, same tricks in the same order. First try counts. Don't trust the duck.", practiceIntro: "Practice: 5 hearts, no stars, unlocks nothing. Get your hand warm, then do it for real.",
      idle: ['Cluck...', 'Cluck cluck...', 'Hmm...', 'Wait for it...'], foxBluff: 'BEEP! (trust me, bro)', sneeze: 'Ah... CHOO!', quack: 'QUACK!!', quackGo: 'QUACK!! (boop now!)', beepFreeze: 'BEEP! (freeze!)', one: 'ONE!', two: 'TWO!', three: 'THREE!', beep2: 'BEEP BEEP!', beep1: 'BEEP!', releaseCue: 'RELEASE!!',
      critLbl: 'CRITICAL! ', boopLbl: 'BOOP! ', chargeLbl: 'CHARGED!!', chargeHit: 'CHARGED! ', phase: 'ROUND {n}', phaseSub: '{l} (+1 ❤️)', missOneLbl: 'ONE BOOP SHORT! ', smallSpot: 'TINY TARGET! ', doubleLbl: 'DOUBLE BOOP! ', oneMore: 'One... again!',
      forgiveLbl: 'FORGIVEN ONCE', forgiveSub: '{h} keeps it cool', forgiveLine: 'Forgiven this time. Not next time.', forgiveSay: 'Forgiven, once', heart: '-1 ❤️',
      hurtLines: ['Who said boop?', 'No beep yet!', 'Did that hurt?', 'Missed!', 'Rules? Rules?', 'Grandma taught you that?'], ouch: 'Ouch!',
      early: 'TOO EARLY! 💀', earlyRel: 'RELEASED EARLY! 💀', fooledSneeze: 'FOOLED BY A SNEEZE! 🤧', fooledFox: 'TRUSTED THE FOX? 🦊', fooledDuck: 'FOOLED BY THE DUCK! 🦆', fooledRev: 'REVERSE RULE! 🔄', countWrong: 'MISCOUNTED! 🔢', whiff: 'MISSED THE SPOT! 💨', spotGone: 'LIGHT WENT OUT! 🌑', asleep: 'ASLEEP? 😴',
      tutLbl: 'FIRST TIME FREE 🦆', tutSub: 'red screen + QUACK = the duck', tutLine: "That's the duck! First one's free. Next one costs a heart.", tutSay: "That's the duck. First one's free.", tutBig: 'FAKE! FREEZE', tutHint: 'Red screen + QUACK = the duck lying. Do not boop.',
      ghostSub: 'your rival booped here', dimHint: "The Chief is yawning... don't nod off too", clearedBig: 'GATE {n} CLEAR', lostBig: 'LOST', nextSoon: '{ms}ms · next gate...', tapRetry: 'tap to fight again',
      cueAgain: 'AGAIN!', cueDouble: 'BOOP BOOP!', cueRelease: 'RELEASE!', cueSpot: 'THERE!', cueRev: 'QUACK = BOOP!', cueBoop: 'BOOP!', cueRevFreeze: 'BEEP = FREEZE!', cueDont: "DON'T!",
      hintHolding: 'charging... hold it', hintHold: 'press and HOLD to charge', hintDouble: 'wait for two crows...', hintSpot: 'wait for the light in the smoke...', hintRev: 'REVERSE: QUACK = boop, BEEP = freeze', hintCount: 'count the crows... boop after the LAST', hintGhost: 'wait for the beep... beat {ms}ms', hintWait: 'wait for the beep...',
      vsWin: ' 🎉 You BEAT your rival ({a}ms < {b}ms)!', vsLose: ' 😭 Lost to your rival ({b}ms). Go again!', vsLose2: ' 😭 Lost to your rival ({b}ms).', vsStill: ' Your rival is still laughing.',
      resDailyWon: 'DAILY GATE {d} CLEAR', resDailyLost: 'DAILY GATE {d} LOST', resPracWon: 'WARMED UP. NOW FOR REAL', resPracLost: 'KEEP PRACTICING', resFinal: 'WORLD BOOP CHAMPION!', resBoss: '{e} DEFEATED!', resWon: '{g} CLEAR', resLost: 'LOST TO {e}',
      subDaily: 'Reflex {ms}ms · ', subDailyFirst: 'first try today, it counts', subDailyReplay: 'replay, does not count (first try: {f})', subLost: 'lost', subStreak: ' · 🔥 {n}-day streak', subTomorrow: '. New gate tomorrow.',
      subAvg: 'Average reflex {ms}ms. ', subPerfect: 'Perfect!', sub2: 'Missing star: get under 250ms.', sub1: "Missing stars: don't lose a heart, and get under 250ms.", subYourMs: ' Your reflex: {ms}ms.', newHero: ' 🎉 New character unlocked: {h}. Pick them on the map.',
      cardBoss: 'BOSS: {e}', cardVs: 'vs {e}', cardDaily: 'Daily {d}', cardLost: 'LOST  ', ko: 'K.O.',
      shareGate: "🥊 DON'T TRUST THE DUCK • {g}{r} • {h}\n⚡ Reflex {ms}ms • Rank {rk}\nBeat my time on this gate 👉 {u}", shareDaily: "📅 DON'T TRUST THE DUCK Daily {d}{r}{s}\nSame gate, same tricks, whole world. Faster than me? 👉 {u}",
      badgePlayed: 'Today {d}: {r}{s} · replays do not count', badgeNew: 'Today {d}: not played yet · same gate, same tricks for the whole world{s}', badgeStreak: ' · 🔥 {n}-day streak', badgeLost: '❌ lost',
      vsP1: 'Ti Boop', vsP2: 'Blaze Yen', vsQuit: '✕ Quit', vsAgain: '🔁 Rematch', vsShare: '📋 Copy result', vsShareText: "🥊 DON'T TRUST THE DUCK, 2 players: {w} {a}-{b} {l} · fastest {ms} · ba-khi.vercel.app",
      vsGLwin: ['One nil!', 'Got it!', 'That fast?', 'Clean boop!', 'Is the other one asleep?'], vsGLearly: ['Who booped early?', 'No beep yet!', "That's the trap, genius."], vsGLfake: ['A draw? No draws.', 'Both froze. Nice.', 'The duck crowed, not me.'], vsGLend: ['Boop champion... of this couch.', 'Loser does the dishes.'],
      vsReady: 'Ready!', vsHeld: 'Hold it... waiting for the other one', vsPut: 'Put your finger here', vsBoth: 'Both players hold to start', vsGo: 'READY', vsSleep: 'Both asleep?', vsRound: 'Round {r} · {a}-{b} · first to 3', vsOpp: 'RIVAL {l}', vsCrit: 'CRITICAL!', vsBoop: 'BOOP!', vsSlow: 'SLOW!', vsAsleep: 'ASLEEP? 😴', vsPlus: '+1 round', vsMinus: '-1 round', vsZzz: 'asleep', vsWon: '{n} WINS', vsLost: 'LOST {a}-{b}', vsAvg: 'avg {a}ms · rival {b}ms', vsEarlyLbl: 'TOO EARLY! 💀', vsFakeLbl: 'FOOLED BY THE DUCK! 🦆', vsBoopLbl: 'BOOP!', vsQuack: 'QUACK!!', vsBeep: 'BEEP!', vsWait: 'wait for the beep...'
    }
  };
  var lang = 'vi';
  try {
    var q = /[?&]lang=(vi|en)/.exec(location.search); var st = localStorage.getItem('bakhi.lang');
    if (q) { lang = q[1]; localStorage.setItem('bakhi.lang', lang); } else if (st === 'vi' || st === 'en') lang = st; else lang = (typeof DEFAULT_LANG !== 'undefined') ? DEFAULT_LANG : (/^vi/i.test(navigator.language || '') ? 'vi' : 'en');
  } catch (e) {}
  function T(k, v){ var s = (UI[lang] && UI[lang][k] !== undefined) ? UI[lang][k] : UI.vi[k]; if (s === undefined) return k; if (typeof s !== 'string') return s; if (v) for (var key in v) s = s.split('{' + key + '}').join(v[key]); return s; }
  function mergeInto(dst, src, fields){ if (!dst || !src) return; for (var k in src) { if (!dst[k]) continue; if (fields) fields.forEach(function(f){ if (src[k][f] !== undefined) dst[k][f] = src[k][f]; }); else dst[k] = src[k]; } }
  function applyData(){
    var L = window.LANG_EN; if (lang !== 'en' || !L) return;
    var w = L.world || {}, s = L.story || {};
    if (w.STORY) STORY.splice.apply(STORY, [0, STORY.length].concat(w.STORY));
    if (w.RANKS) w.RANKS.forEach(function(r, i){ if (RANKS[i]) RANKS[i][2] = r[2]; });
    mergeInto(HEROES, w.HEROES, ['name', 'perk', 'line', 'bio']); mergeInto(ENEMIES, w.ENEMIES, ['name', 'line']);
    if (w.WORLDS) w.WORLDS.forEach(function(x, i){ if (WORLDS[i]) { WORLDS[i].name = x.name; WORLDS[i].sub = x.sub; WORLDS[i].mech = x.mech; } });
    if (w.PHASE_LINES) for (var g in w.PHASE_LINES) { var ph = GATES[g - 1] && GATES[g - 1].phases; if (ph) w.PHASE_LINES[g].forEach(function(l, i){ if (ph[i]) ph[i].line = l; }); }
    if (w.DIALOG) for (var d in w.DIALOG) if (DIALOG[d]) DIALOG[d].forEach(function(line, i){ var e = w.DIALOG[d][i]; if (e) { line.name = e.name; line.text = e.text; } });
    mergeInto(WIN_LINES, w.WIN_LINES); mergeInto(TAUNTS, w.TAUNTS); mergeInto(HERO_CHEER, w.HERO_CHEER); mergeInto(HERO_OUCH, w.HERO_OUCH); mergeInto(ROUND_CALL, w.ROUND_CALL);
    if (w.ENEMY_WIN_LINES) ENEMY_WIN_LINES.splice.apply(ENEMY_WIN_LINES, [0, ENEMY_WIN_LINES.length].concat(w.ENEMY_WIN_LINES));
    if (s.GATE_META) for (var n in s.GATE_META) if (GATE_META[n]) { var m = s.GATE_META[n]; if (m.title) GATE_META[n].title = m.title; if (m.name) GATE_META[n].name = m.name; if (m.intro && GATE_META[n].intro) GATE_META[n].intro.forEach(function(l, i){ if (m.intro[i]) l[1] = m.intro[i][1]; }); }
    mergeInto(ENEMY_HIT, s.ENEMY_HIT); mergeInto(ENEMY_LOW, s.ENEMY_LOW); mergeInto(ENEMY_FOOLED, s.ENEMY_FOOLED); mergeInto(HERO_CRIT, s.HERO_CRIT); mergeInto(HERO_SLOW, s.HERO_SLOW); mergeInto(GABIP_LINES, s.GABIP_LINES);
  }
  function applyDom(){
    document.documentElement.lang = lang; document.title = T('title');
    var els = document.querySelectorAll('[data-t]'); for (var i = 0; i < els.length; i++) { var k = els[i].getAttribute('data-t'); if (k === 'logo') els[i].innerHTML = T('logo') + '<small>' + T('logoSub') + '</small>'; else els[i].textContent = T(k); }
    if (lang === 'en') document.body.classList.add('en');
  }
  function setLang(l){ try { localStorage.setItem('bakhi.lang', l); } catch (e) {} var u = location.href.replace(/[?&]lang=(vi|en)/, ''); location.href = u.split('#')[0] + (u.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + l + (location.hash || ''); }
  applyData();
  return { lang: lang, T: T, applyDom: applyDom, setLang: setLang };
})();
var T = I18N.T;
