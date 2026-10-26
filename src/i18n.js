/* ===== i18n: UI strings (vi default, en) + merge of LANG_EN data layers into the world/story globals ===== */
var I18N = (function(){
  var UI = {
    vi: {
      mapBtn: '🗺️ Bản đồ', tutTitle: 'CỬA 0 · TẬP', tutEnemy: 'Lính Cỏ Tập Sự', tut1: 'Nó sắp ra đòn. Chạm mũi tên hoặc vuốt theo hướng đó để đỡ.', tut2: 'Mũi tên HỒNG run rẩy là đòn GIẢ. Đứng im.', tut3: 'Giờ thì: nghe BÍP là BỤP.', tutForgive: 'TẬP THÔI, THA', tutDone: 'XONG BÀI TẬP!',
      atkHit: 'ĂN ĐÒN! 👊', wrongDir: 'SAI HƯỚNG! ↔', feintHit: 'ĐÒN GIẢ! 🎭', feintLbl: 'giả!', parryLbl: 'ĐỠ!', comboLbl: 'CHUỖI ĐỠ x{n}', comboTag: ' x{n}', betWin: 'CƯỢC THẮNG!', betLbl: 'CƯỢC x2! ', betLose: 'CƯỢC THUA! 🎲', hintBet: 'đang cược x2... thả đúng lúc gáy, dưới 160ms', swipeHint: 'chạm hoặc vuốt theo mũi tên', parryTeach: 'Nó ra đòn! Chạm mũi tên hoặc vuốt theo hướng đó để đỡ.', run: '⏱️ Chạy 60 giây', runTitle: 'CHẠY 60 GIÂY', runHud: 'CHẠY · {t} · {s} điểm', runNext: 'đối thủ tiếp!', resRun: 'CHẠY 60 GIÂY: {s} ĐIỂM', subRun: '{k} đối thủ gục · chuỗi đỡ dài nhất {c} · kỷ lục {b}.', newBest: ' 🏆 KỶ LỤC MỚI!', shareRun: '⏱️ BÁ KHÍ Chạy 60 giây: {s} điểm\nPhá được không? 👉 {u}', cardRun: 'Chạy 60s · {s} điểm',
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
      proSkip: 'Giữ để bỏ qua', proTry: 'Bụp thử xem nào!', proSlow: 'Chậm như bùn...', proGran: 'Tí! Lại đây bà bảo.', proWait: 'Chờ... nghe cho kỹ...', proEarly: 'CHƯA GÁY!', proEarlyB: 'Bà bảo gì? Chưa gáy mà bụp!', proHit: 'NHỊP TRỞ LẠI!', proBeep: 'BÍP!', proTitle: 'BÁ KHÍ', storyPlay: '🎬 Xem mở đầu',
      hintHeavy: 'đòn nặng... thả để tung', hintSuper: 'giữ thêm... BÁ KHÍ!',
      roundN: 'HIỆP {n}', roundOf: '{a} – {b}', readyCall: 'Sẵn sàng...', beepFight: 'BÍP! ĐÁNH!', peckLbl: 'CHƯA GÁY!', peckSay: 'Mổ cho chừa. Gáy rồi mới đánh.', jabLbl: 'ĐẤM', hookLbl: 'MÓC!', heavyLbl: 'ĐÒN NẶNG', counterLbl: 'PHẢN ĐÒN!', blockedLbl: 'BỊ ĐỠ', interruptLbl: 'CẮT ĐÒN!', superLbl: 'BÁ KHÍ!', superCall: 'Cả làng nghe thấy luôn.', koLbl: 'K.O.!', koLose: 'K.O.', timeUp: 'HẾT GIỜ', yawnTie: 'Hòa. Ngáp ai dài hơn thì thua.', roundWon: 'Thắng hiệp', roundLost: 'Thua hiệp', tapHint: 'Chạm: đấm · giữ: đòn nặng · chạm mũi tên: đỡ', meterFull: 'Bá Khí đầy! Giữ 1,5 giây rồi thả.',
      early: 'BỤP SỚM! 💀', earlyRel: 'THẢ SỚM! 💀', fooledSneeze: 'MẮC BẪY HẮT XÌ! 🤧', fooledFox: 'TIN CÁO À? 🦊', fooledDuck: 'MẮC BẪY VỊT! 🦆', fooledRev: 'LUẬT NGƯỢC MÀ! 🔄', countWrong: 'ĐẾM SAI! 🔢', whiff: 'HỤT CHỖ! 💨', spotGone: 'TẮT MẤT RỒI! 🌑', asleep: 'NGỦ À? 😴',
      tutLbl: 'LẦN ĐẦU THA 🦆', tutSub: 'màn đỏ + CẠC = vịt lừa', tutLine: 'Vịt đấy! Lần đầu tha. Lần sau mất tim.', tutSay: 'Vịt đấy! Lần đầu tha.', tutBig: 'GIẢ! ĐỨNG IM', tutHint: 'màn đỏ + tiếng CẠC = vịt lừa. Không bụp.',
      ghostSub: 'người thách bụp ở đây', dimHint: 'Lý Trưởng đang ngáp... đừng ngủ theo', clearedBig: 'QUA CỬA {n}', lostBig: 'THUA', nextSoon: '{ms} · cửa tiếp theo...', tapRetry: 'chạm để đánh lại ngay',
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
    zh: {
      mapBtn: '🗺️ 地图', tutTitle: '第0关 · 练习', tutEnemy: '稻草兵·学徒', tut1: '它要出手了。点箭头或顺着箭头滑动来挡。', tut2: '粉色抖动的箭头是假动作。别动。', tut3: '现在：听到哔就嘭。', tutForgive: '练习，免罚', tutDone: '练习完成！',
      atkHit: '挨打！👊', wrongDir: '方向错了！↔', feintHit: '假动作！🎭', feintLbl: '假的！', parryLbl: '挡住！', comboLbl: '连挡 x{n}', comboTag: ' x{n}', betWin: '赌赢了！', betLbl: '赌 x2！', betLose: '赌输了！🎲', hintBet: '正在赌 x2……听到哔再放，要在160ms内', swipeHint: '点箭头或顺着滑', parryTeach: '它要出手了！点箭头或顺着箭头滑动来挡。', run: '⏱️ 60秒冲刺', runTitle: '60秒冲刺', runHud: '冲刺 · {t} · {s} 分', runNext: '下一个！', resRun: '60秒冲刺：{s} 分', subRun: '击倒 {k} 个 · 最长连挡 {c} · 纪录 {b}。', newBest: ' 🏆 新纪录！', shareRun: '⏱️ 别信鸭子 60秒冲刺：{s} 分\n来破 👉 {u}', cardRun: '60秒冲刺 · {s} 分',
      title: '别信鸭子', logo: '别信鸭子', logoSub: '先哔，再嘭。', brand: '别信鸭子', brandSub: '一根手指的反应格斗',
      tag: '听到「哔」就「嘭」。没哔就嘭，挨揍。', play: '开始', daily: '📅 每日关', vs: '🥊 双人同屏', story: '📜 剧情', sound: '🔊 声音', mutedBtn: '🔇 已静音', langBtn: '🌐 语言',
      home: '← 回首页', quit: '✕ 退出', next: '下一关 ▸', nextN: '第{n}关 ▸', retry: '🔁 再来', practice: '🥋 练习', share: '📋 复制战绩', img: '🖼️ 保存卡片', link: '🔗 挑战链接', map: '🗺️ 地图',
      resHint: '丢进群里。谁点开链接，就直接进这一关，必须比你快。', dlgTap: '点击继续 ▸', dlgSkipped: '已跳过对话',
      gate: '第{n}关', gateName: '第{n}关 · {w}', practiceTag: '练习', dailyHud: '每日关 {d}', dailyTitle: '每日关 {d}',
      copyFail: '复制失败，截图炫耀也行', copied: '已复制！随便往哪儿贴。', copiedLink: '第{n}关挑战链接已复制！', copiedDaily: '每日关挑战链接已复制！', vsMissing: '模式更新中，稍后再试',
      chalBanner: '🥊 有人在{g}用{ms}ms的反应向你挑战。能赢吗？', acceptChal: '接受挑战', chalDaily: '📅 有人在每日关 {d} 用{ms}ms向你挑战。', chalDailyPast: ' 那天已经过了，还能打，但不算连续天数。', acceptDaily: '接受每日挑战',
      rankSubAvg: '平均反应 {ms}ms · ', rankSubNone: '还没有反应数据 · ', rankSubTail: '{s}⭐ · {a}/{b} 关', heroLock: '🔒 通过第{n}关解锁', worldLock: '通过第{n}关后开放',
      beepName: '哔哔鸡', grandmaName: '嘭奶奶', dailyIntro: '每日关 {d}：今天全世界都打这一关，套路顺序一模一样。只算第一次。别信鸭子。', practiceIntro: '练习：5 颗心，不计星，不解锁。先热热手，再来真的。',
      idle: ['咕……', '咕咕……', '嗯……', '等一下……'], foxBluff: '哔！（信哥）', sneeze: '阿……嚏！', quack: '嘎！！', quackGo: '嘎！！（快嘭！）', beepFreeze: '哔！（别动！）', one: '一！', two: '二！', three: '三！', beep2: '哔哔！', beep1: '哔！', releaseCue: '放！！',
      critLbl: '暴击！', boopLbl: '嘭！', chargeLbl: '蓄力满！！', chargeHit: '蓄力嘭！', phase: '第{n}回合', phaseSub: '{l}（+1 ❤️）', missOneLbl: '少嘭一下！', smallSpot: '小亮点！', doubleLbl: '双嘭！', oneMore: '一……再来！',
      forgiveLbl: '饶你一次', forgiveSub: '{h} 稳住了', forgiveLine: '这次饶你。下次没有。', forgiveSay: '饶你一次', heart: '-1 ❤️',
      hurtLines: ['谁让你嘭的？', '还没哔呢！', '疼不疼？', '打空了！', '规则呢？规则呢？', '奶奶教你的？'], ouch: '哎哟！',
      proSkip: '长按跳过', proTry: '来，嘭一下试试！', proSlow: '慢得像泥...', proGran: '小嘭！过来，奶奶有话说。', proWait: '等着... 仔细听...', proEarly: '还没叫！', proEarlyB: '奶奶怎么说的？没哔就嘭！', proHit: '节奏回来了！', proBeep: '哔！', proTitle: '霸气', storyPlay: '🎬 看开场',
      hintHeavy: '重拳蓄力……松手出拳', hintSuper: '再按住……霸气！',
      roundN: '第 {n} 回合', roundOf: '{a} – {b}', readyCall: '准备……', beepFight: '哔！打！', peckLbl: '还没叫！', peckSay: '啄一下长记性。叫了才能打。', jabLbl: '拳', hookLbl: '勾拳！', heavyLbl: '重拳', counterLbl: '反击！', blockedLbl: '被挡', interruptLbl: '打断！', superLbl: '霸气！', superCall: '全村都听见了。', koLbl: 'K.O.！', koLose: 'K.O.', timeUp: '时间到', yawnTie: '平局。谁哈欠长谁输。', roundWon: '赢下回合', roundLost: '输掉回合', tapHint: '点：拳 · 长按：重拳 · 点箭头：格挡', meterFull: '霸气满了！长按 1.5 秒再放。',
      early: '太早了！💀', earlyRel: '放早了！💀', fooledSneeze: '被喷嚏骗了！🤧', fooledFox: '信狐狸？🦊', fooledDuck: '被鸭子骗了！🦆', fooledRev: '反转规则！🔄', countWrong: '数错了！🔢', whiff: '打偏了！💨', spotGone: '亮点灭了！🌑', asleep: '睡着了？😴',
      tutLbl: '第一次免费 🦆', tutSub: '红屏 + 嘎 = 鸭子', tutLine: '那是鸭子！第一次免费，下次扣心。', tutSay: '那是鸭子，第一次免费。', tutBig: '假的！别动', tutHint: '红屏 + 「嘎」= 鸭子在骗你。别嘭。',
      ghostSub: '对手在这里嘭的', dimHint: '村长在打哈欠……你别跟着睡', clearedBig: '第{n}关 通过', lostBig: '输了', nextSoon: '{ms} · 下一关……', tapRetry: '点一下再打',
      cueAgain: '再来！', cueDouble: '嘭嘭！', cueRelease: '放！', cueSpot: '那儿！', cueRev: '嘎 = 嘭！', cueBoop: '嘭！', cueRevFreeze: '哔 = 别动！', cueDont: '别动！',
      hintHolding: '蓄力中……按住', hintHold: '按住不放，蓄力', hintDouble: '等两声鸡叫……', hintSpot: '等烟里的亮点……', hintRev: '反转：嘎就嘭，哔就别动', hintCount: '数鸡叫……最后一声之后再嘭', hintGhost: '等鸡叫……要快过 {ms}ms', hintWait: '等鸡叫……',
      vsWin: ' 🎉 你赢了挑战者（{a}ms < {b}ms）！', vsLose: ' 😭 输给挑战者（{b}ms）。再来！', vsLose2: ' 😭 输给挑战者（{b}ms）。', vsStill: ' 挑战者还在笑。',
      resDailyWon: '每日关 {d} 通过', resDailyLost: '每日关 {d} 失败', resPracWon: '热身完毕，来真的', resPracLost: '再练练', resFinal: '天下第一嘭！', resBoss: '击败 {e}！', resWon: '通过 {g}', resLost: '输给 {e}',
      subDaily: '反应 {ms}ms · ', subDailyFirst: '今天第一次，已计入', subDailyReplay: '重玩，不计入（第一次：{f}）', subLost: '失败', subStreak: ' · 🔥 连续 {n} 天', subTomorrow: '。明天有新关。',
      subAvg: '平均反应 {ms}ms。', subPerfect: '完美！', sub2: '差一星：要低于 250ms。', sub1: '差星：别掉心，而且要低于 250ms。', subYourMs: ' 你的反应：{ms}ms。', newHero: ' 🎉 解锁新角色：{h}。去地图选。',
      cardBoss: 'BOSS：{e}', cardVs: 'vs {e}', cardDaily: '每日关 {d}', cardLost: '输了  ', ko: 'K.O.',
      shareGate: '🥊 别信鸭子 • {g}{r} • {h}\n⚡ 反应 {ms}ms • 段位 {rk}\n来这一关，比我快 👉 {u}', shareDaily: '📅 别信鸭子 每日关 {d}{r}{s}\n同一关，同样套路，全世界。谁更快？👉 {u}',
      badgePlayed: '今天 {d}：{r}{s} · 重玩不计入', badgeNew: '今天 {d}：还没玩 · 全世界同一关、同样套路{s}', badgeStreak: ' · 🔥 连续 {n} 天', badgeLost: '❌ 失败',
      vsP1: '小嘭', vsP2: '火燕', vsQuit: '✕ 退出', vsAgain: '🔁 再战', vsShare: '📋 复制战绩', vsShareText: '🥊 别信鸭子 双人同屏：{w} {a}-{b} {l} · 最快 {ms} · ba-khi.vercel.app',
      vsGLwin: ['一比零！', '吃到了！', '这么快？', '漂亮的嘭！', '另一个睡着了？'], vsGLearly: ['谁嘭早了？', '还没哔呢！', '那是陷阱，天才。'], vsGLfake: ['平局？没有平局。', '两个都没动。不错。', '是鸭子叫的，不是我。'], vsGLend: ['天下第一嘭……沙发上的。', '输的人洗碗。'],
      vsReady: '准备！', vsHeld: '按住……等另一个人', vsPut: '把手指放在这里', vsBoth: '两人都按住就开始', vsGo: '准备', vsSleep: '两个都睡了？', vsRound: '第{r}回合 · {a}-{b} · 先到3', vsOpp: '对手{l}', vsCrit: '暴击！', vsBoop: '嘭！', vsSlow: '慢！', vsAsleep: '睡着了？😴', vsPlus: '+1 回合', vsMinus: '-1 回合', vsZzz: '睡着', vsWon: '{n} 获胜', vsLost: '输了 {a}-{b}', vsAvg: '平均 {a}ms · 对手 {b}ms', vsEarlyLbl: '太早了！💀', vsFakeLbl: '被鸭子骗了！🦆', vsBoopLbl: '嘭！', vsQuack: '嘎！！', vsBeep: '哔！', vsWait: '等鸡叫……'
    },
    en: {
      mapBtn: '🗺️ Map', tutTitle: 'GATE 0 · PRACTICE', tutEnemy: 'Grass Guard, Trainee', tut1: 'Incoming. Tap the arrow or swipe its way to parry.', tut2: 'A PINK, shaky arrow is a FEINT. Hold still.', tut3: 'Now: hear BEEP, you BOOP.', tutForgive: 'PRACTICE, FORGIVEN', tutDone: 'LESSON DONE!',
      atkHit: 'HIT! 👊', wrongDir: 'WRONG WAY! ↔', feintHit: 'FEINT! 🎭', feintLbl: 'feint!', parryLbl: 'PARRY!', comboLbl: 'PARRY CHAIN x{n}', comboTag: ' x{n}', betWin: 'BET WON!', betLbl: 'BET x2! ', betLose: 'BET LOST! 🎲', hintBet: 'betting x2... release on the beep, under 160ms', swipeHint: 'tap or swipe the arrow', parryTeach: 'Incoming! Tap the arrow or swipe its way to parry.', run: '⏱️ 60-second Run', runTitle: '60-SECOND RUN', runHud: 'RUN · {t} · {s} pts', runNext: 'next!', resRun: '60-SECOND RUN: {s} POINTS', subRun: '{k} opponents down · longest parry chain {c} · best {b}.', newBest: ' 🏆 NEW BEST!', shareRun: "⏱️ DON'T TRUST THE DUCK, 60-second run: {s} points\nBeat it 👉 {u}", cardRun: '60s run · {s} pts',
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
      proSkip: 'Hold to skip', proTry: 'Go on, try a boop!', proSlow: 'Slow as mud...', proGran: 'Tí! Come here, Grandma says.', proWait: 'Wait... listen close...', proEarly: 'NO BEEP YET!', proEarlyB: 'What did Grandma say? No beep, no boop!', proHit: 'THE BEAT IS BACK!', proBeep: 'BEEP!', proTitle: 'BA KHI', storyPlay: '🎬 Watch the intro',
      hintHeavy: 'heavy... release to swing', hintSuper: 'keep holding... BA KHI!',
      roundN: 'ROUND {n}', roundOf: '{a} – {b}', readyCall: 'Ready...', beepFight: 'BEEP! FIGHT!', peckLbl: 'NO BEEP YET!', peckSay: 'Pecked. Wait for the beep.', jabLbl: 'JAB', hookLbl: 'HOOK!', heavyLbl: 'HEAVY', counterLbl: 'COUNTER!', blockedLbl: 'BLOCKED', interruptLbl: 'CUT IN!', superLbl: 'BA KHI!', superCall: 'The whole village heard that.', koLbl: 'K.O.!', koLose: 'K.O.', timeUp: 'TIME UP', yawnTie: 'Draw. Longest yawn loses.', roundWon: 'Round won', roundLost: 'Round lost', tapHint: 'Tap: punch · hold: heavy · tap the arrow: block', meterFull: 'Ba Khi is full! Hold 1.5 s, then release.',
      early: 'TOO EARLY! 💀', earlyRel: 'RELEASED EARLY! 💀', fooledSneeze: 'FOOLED BY A SNEEZE! 🤧', fooledFox: 'TRUSTED THE FOX? 🦊', fooledDuck: 'FOOLED BY THE DUCK! 🦆', fooledRev: 'REVERSE RULE! 🔄', countWrong: 'MISCOUNTED! 🔢', whiff: 'MISSED THE SPOT! 💨', spotGone: 'LIGHT WENT OUT! 🌑', asleep: 'ASLEEP? 😴',
      tutLbl: 'FIRST TIME FREE 🦆', tutSub: 'red screen + QUACK = the duck', tutLine: "That's the duck! First one's free. Next one costs a heart.", tutSay: "That's the duck. First one's free.", tutBig: 'FAKE! FREEZE', tutHint: 'Red screen + QUACK = the duck lying. Do not boop.',
      ghostSub: 'your rival booped here', dimHint: "The Chief is yawning... don't nod off too", clearedBig: 'GATE {n} CLEAR', lostBig: 'LOST', nextSoon: '{ms} · next gate...', tapRetry: 'tap to fight again',
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
  var lang = 'vi', chosen = false;
  try {
    var q = /[?&]lang=(vi|en|zh)/.exec(location.search); var st = localStorage.getItem('bakhi.lang'), nl = navigator.language || '';
    if (q) { lang = q[1]; chosen = true; localStorage.setItem('bakhi.lang', lang); } else if (st === 'vi' || st === 'en' || st === 'zh') { lang = st; chosen = true; } else lang = (typeof DEFAULT_LANG !== 'undefined') ? DEFAULT_LANG : (/^vi/i.test(nl) ? 'vi' : /^zh/i.test(nl) ? 'zh' : 'en');
  } catch (e) {}
  if (typeof DEFAULT_LANG !== 'undefined' && typeof CONFIG !== 'undefined' && CONFIG.portal) { lang = DEFAULT_LANG; chosen = true; }   /* portal edition: language fixed at build time */
  function T(k, v){ var s = (UI[lang] && UI[lang][k] !== undefined) ? UI[lang][k] : UI.vi[k]; if (s === undefined) return k; if (typeof s !== 'string') return s; if (v) for (var key in v) s = s.split('{' + key + '}').join(v[key]); return s; }
  function mergeInto(dst, src, fields){ if (!dst || !src) return; for (var k in src) { if (!dst[k]) continue; if (fields) fields.forEach(function(f){ if (src[k][f] !== undefined) dst[k][f] = src[k][f]; }); else dst[k] = src[k]; } }
  function applyData(){
    var L = window['LANG_' + lang.toUpperCase()]; if (lang === 'vi' || !L) return;
    var w = L.world || {}, s = L.story || {};
    if (w.STORY) STORY.splice.apply(STORY, [0, STORY.length].concat(w.STORY));
    if (w.RANKS) w.RANKS.forEach(function(r, i){ if (RANKS[i]) RANKS[i][2] = r[2]; });
    mergeInto(HEROES, w.HEROES, ['name', 'perk', 'line', 'bio']); mergeInto(ENEMIES, w.ENEMIES, ['name', 'line']);
    if (w.WORLDS) w.WORLDS.forEach(function(x, i){ if (WORLDS[i]) { WORLDS[i].name = x.name; WORLDS[i].sub = x.sub; WORLDS[i].mech = x.mech; } });
    if (w.PHASE_LINES) for (var g in w.PHASE_LINES) { var ph = GATES[g - 1] && GATES[g - 1].phases; if (ph) w.PHASE_LINES[g].forEach(function(l, i){ if (ph[i]) ph[i].line = l; }); }
    if (w.DIALOG) for (var d in w.DIALOG) if (DIALOG[d]) DIALOG[d].forEach(function(line, i){ var e = w.DIALOG[d][i]; if (e) { line.name = e.name; line.text = e.text; } });
    mergeInto(WIN_LINES, w.WIN_LINES); mergeInto(TAUNTS, w.TAUNTS); mergeInto(HERO_CHEER, w.HERO_CHEER); mergeInto(HERO_OUCH, w.HERO_OUCH); mergeInto(ROUND_CALL, w.ROUND_CALL);
    if (w.ENEMY_WIN_LINES) ENEMY_WIN_LINES.splice.apply(ENEMY_WIN_LINES, [0, ENEMY_WIN_LINES.length].concat(w.ENEMY_WIN_LINES));
    if (w.MOVE_CALLS && typeof MOVES !== 'undefined') for (var mk in w.MOVE_CALLS) if (MOVES[mk]) { var mc = w.MOVE_CALLS[mk]; if (MOVES[mk].phases) MOVES[mk].phases.forEach(function(ph, pi){ ph.forEach(function(c, ci){ if (mc[pi] && mc[pi][ci]) c.call = mc[pi][ci]; }); }); else MOVES[mk].set.forEach(function(c, ci){ if (mc[ci]) c.call = mc[ci]; }); }
    if (s.GATE_META) for (var n in s.GATE_META) if (GATE_META[n]) { var m = s.GATE_META[n]; if (m.title) GATE_META[n].title = m.title; if (m.name) GATE_META[n].name = m.name; if (m.intro && GATE_META[n].intro) GATE_META[n].intro.forEach(function(l, i){ if (m.intro[i]) l[1] = m.intro[i][1]; }); }
    mergeInto(ENEMY_HIT, s.ENEMY_HIT); mergeInto(ENEMY_LOW, s.ENEMY_LOW); mergeInto(ENEMY_FOOLED, s.ENEMY_FOOLED); mergeInto(HERO_CRIT, s.HERO_CRIT); mergeInto(HERO_SLOW, s.HERO_SLOW); mergeInto(GABIP_LINES, s.GABIP_LINES);
  }
  function applyDom(){
    document.documentElement.lang = lang; document.title = T('title');
    var els = document.querySelectorAll('[data-t]'); for (var i = 0; i < els.length; i++) { var k = els[i].getAttribute('data-t'); if (k === 'logo') els[i].innerHTML = T('logo') + '<small>' + T('logoSub') + '</small>'; else els[i].textContent = T(k); }
    if (lang !== 'vi') document.body.classList.add(lang);
  }
  function setLang(l){ try { localStorage.setItem('bakhi.lang', l); } catch (e) {} var u = location.href.replace(/[?&]lang=(vi|en|zh)/, ''); location.href = u.split('#')[0] + (u.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + l + (location.hash || ''); }
  function choose(l){ try { localStorage.setItem('bakhi.lang', l); } catch (e) {} if (l === lang) { var pk = document.getElementById('langpick'); if (pk) pk.hidden = true; return; } setLang(l); }
  applyData();
  return { lang: lang, chosen: chosen, T: T, applyDom: applyDom, setLang: setLang, choose: choose };
})();
var T = I18N.T;
