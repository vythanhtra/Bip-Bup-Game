/* ===== BÁ KHÍ: per-gate flavour, variant enemies, situational banter ===== */
/* GATE_META[n] = { title, name (enemy display name), v (palette swap), intro: [[who, text], ...] } */
var GATE_META = {
  1:  { title: 'Bài học đầu tiên', name: 'Lính Cỏ Tập Sự' },
  2:  { title: 'Trâu đang mơ', name: 'Trâu Lười Ngủ Trưa', intro: [['gabip', 'Bài mới: NHẢY. Đang bay mà đấm là đòn trên không, quật ngã luôn. Trâu này chậm, tập trên nó đi.'], ['traului', 'Khò... mơ thấy cỏ... đừng đánh thức...'], ['tibup', 'Trâu ngủ mà cũng phải đánh à bà?'], ['banoi', 'Ngủ trong giờ làm việc là phải bụp.']] },
  3:  { title: 'Bù nhìn bị chim ị', name: 'Lính Cỏ Bị Chim Ị', v: { n: '#f1f1f1' }, intro: [['linhco', 'Đừng nhìn mũ tôi. Chim nó... nó không tôn trọng tôi.'], ['tibup', 'Con tưởng chim sợ bù nhìn chứ?'], ['linhco', 'Thời buổi này chim nó cũng lười sợ.']] },
  4:  { title: 'Trâu đi làm muộn', name: 'Trâu Lười Đi Làm Muộn', v: { d: '#5a4a6a' }, intro: [['gabip', 'Bài mới: LƯỚT. Chạm nhanh hai lần về một phía là lướt đi. Lướt lùi thì né được đòn trong chớp mắt.'], ['traului', 'Tao đến muộn 3 tiếng. Theo giờ làng là... đúng giờ.'], ['gabip', 'Theo giờ Chậm Chạp Chi Thuật thì vẫn sớm.']] },
  5:  { title: 'Bù nhìn trưởng phòng', name: 'Lính Cỏ Trưởng Phòng', v: { g: '#2e7d32', n: '#4a4a4a' }, intro: [['linhco', 'Tôi là trưởng phòng bù nhìn. Có 7 cái bù nhìn dưới quyền.'], ['tibup', 'Chúng nó cũng đứng im như anh ạ?'], ['linhco', 'Đó gọi là kỷ luật.']] },
  6:  { title: 'Trâu gym', name: 'Trâu Lười Gym', v: { d: '#6a3a3a' }, intro: [['traului', 'Tao tập gym. Mỗi ngày nằm 23 tiếng, nghỉ 1 tiếng.'], ['tibup', 'Nghỉ để làm gì ạ?'], ['traului', 'Để... đổi tư thế nằm.']] },
  7:  { title: 'Bù nhìn cuối cùng', name: 'Lính Cỏ Cựu Chiến Binh', v: { g: '#8a7a2a', n: '#3a2a1a' }, intro: [['gabip', 'Bài mới: hai đứa LIÊN THỦ. Một đứa đánh, một đứa canh, rồi đổi lượt. Hạ một đứa là đứa kia nổi điên.'], ['linhco', 'Tôi đứng cánh đồng này 40 năm. Chưa có ai đi qua.'], ['tibup', 'Vậy anh canh cái gì?'], ['linhco', '...Tôi quên rồi.']] },
  8:  { title: 'Lý Trưởng Ngáp' },
  9:  { title: 'Vịt nhập môn', name: 'Vịt Giả Gà Tập Sự' },
  10: { title: 'Lính ca đêm', name: 'Lính Đèn Lồng Ca Đêm', intro: [['linhdem', 'Ca đêm lương gấp đôi. Nhưng chưa ai trả.'], ['tibup', 'Vậy anh làm vì gì?'], ['linhdem', 'Vì đèn lồng đẹp.']] },
  11: { title: 'Vịt có bằng cấp', name: 'Vịt Giả Gà Có Chứng Chỉ', v: { w: '#ffe9b0' }, intro: [['gabip', 'Bài mới: đòn VẬT 🤲. Chặn không đỡ được vật! Thấy 🤲 thì đấm nhanh để ngắt, hoặc lùi ra xa.'], ['vitgia', 'Tôi có chứng chỉ gà hạng B. Học online 3 ngày.'], ['gabip', 'Chứng chỉ gà không có hạng B.'], ['vitgia', 'Cạc. Tức là có.']] },
  12: { title: 'Lính thích chụp ảnh', name: 'Lính Đèn Lồng Sống Ảo', v: { g: '#b03a8a', n: '#ffd23f' }, intro: [['linhdem', 'Khoan, để tôi chụp cái ảnh đã. Góc này đèn đẹp.'], ['tibup', 'Anh định đánh hay định đăng story?'], ['linhdem', 'Đăng xong rồi đánh.']] },
  13: { title: 'Vịt đeo râu', name: 'Vịt Giả Gà Đeo Râu Giả', v: { w: '#d9d9d9', o: '#e8343c' }, intro: [['gabip', 'Bài mới: ở chợ này nhảy vào là bị ĐÁNH ĐÓN ⬆️. Muốn vào gần thì lướt, đừng nhảy.'], ['vitgia', 'Lần này tôi đeo râu. Gà có râu. Rõ ràng.'], ['tibup', 'Gà không có râu.'], ['vitgia', 'Gà... trưởng thành thì có.']] },
  14: { title: 'Lính cầm sổ phạt', name: 'Lính Đèn Lồng Thu Phí', v: { g: '#3a5a9a', n: '#c6ff2e' }, intro: [['gabip', 'Từ đây trộn cả: Vịt hô giả, vật, đánh đón. Nhớ: 🤲 thì đấm ngắt, nghe CẠC thì ngừng tay.'], ['linhdem', 'Đứng lại. Phí đi qua chợ: 5 nghìn. Phí thở: 2 nghìn.'], ['tibup', 'Phí bụp anh bao nhiêu?'], ['linhdem', 'Cái đó... miễn phí. Khoan.']] },
  15: { title: 'Vịt cuối chợ', name: 'Vịt Giả Gà Trùm Nhỏ', v: { w: '#c6ff2e', y: '#ff5fa2' }, intro: [['vitgia', 'Tôi là vịt mạnh nhất chợ. Tôi kêu được cả "cục" lẫn "cạc".'], ['gabip', 'Thì vẫn là vịt.'], ['vitgia', 'Vịt... đa năng.']] },
  16: { title: 'Anh Hai Hàng Hiệu' },
  17: { title: 'Lân lạnh cóng', name: 'Cánh Cụt Múa Lân Quên Bài' },
  18: { title: 'Người tuyết sổ mũi', name: 'Người Tuyết Sổ Mũi', intro: [['nguoituyet', 'Hắt... Tôi cảm 400 năm rồi. Chưa khỏi.'], ['tibup', 'Chú uống thuốc chưa?'], ['nguoituyet', 'Uống xong nó... đóng băng trong bụng.']] },
  19: { title: 'Lân có trống', name: 'Cánh Cụt Múa Lân Có Trống', v: { r: '#ffd23f' }, intro: [['gabip', 'Bài mới: cú MÓC quật ngã. Giữ lùi để chặn. Bị ngã thì lúc đứng dậy con được miễn đòn một chút.'], ['canhcut', 'Lần này tôi mang trống. Tùng... tùng... tùng...'], ['gabip', 'Trống của anh còn chậm hơn cú móc của anh.'], ['canhcut', 'Trống tôi bị đóng băng mà.']] },
  20: { title: 'Người tuyết tập yoga', name: 'Người Tuyết Tập Yoga', v: { r: '#8e44ad' }, intro: [['gabip', 'Ôn bài: sàn trơn và cú móc.'], ['nguoituyet', 'Giữ hơi thở... giống yoga... hắt... XÌ. Hỏng rồi.']] },
  21: { title: 'Lân đi diễn đám cưới', name: 'Cánh Cụt Múa Lân Đám Cưới', v: { r: '#ff5fa2' }, intro: [['canhcut', 'Tôi vừa diễn đám cưới về. Cô dâu khóc.'], ['tibup', 'Vì cảm động ạ?'], ['canhcut', 'Vì tôi trượt băng vào bánh cưới.']] },
  22: { title: 'Người tuyết đeo khăn mới', name: 'Người Tuyết Khăn Hàng Hiệu', v: { r: '#ffd23f' }, intro: [['gabip', 'Người tuyết này cũng biết móc. Ngã thì đứng dậy bình tĩnh, đừng đấm vội.'], ['nguoituyet', 'Khăn này Anh Hai Hàng Hiệu bán. 99k.'], ['tibup', 'Anh Hai bán hàng giả đó chú.'], ['nguoituyet', '...Thảo nào nó lạnh hơn lúc chưa quàng.']] },
  23: { title: 'Lân tổng duyệt', name: 'Cánh Cụt Múa Lân Tổng Duyệt', v: { r: '#7fe7ff', h: '#1a2a4a' }, intro: [['canhcut', 'Hôm nay tổng duyệt. Tôi nhớ bài rồi. Tùng tùng cắc... à.'], ['gabip', 'Hai đứa liên thủ trên băng trơn. Hạ đứa gần trước.']] },
  24: { title: 'Băng Vương Hắt Hơi' },
  25: { title: 'Khỉ nướng chuối', name: 'Khỉ Lửa Nướng Chuối' },
  26: { title: 'Gà nướng lần một', name: 'Gà Nướng Hồi Sinh Lần 1', intro: [['ganuong', 'Người ta nướng tôi. Tôi sống lại. Giờ tôi giòn hơn.'], ['tibup', 'Giòn thì đánh có đau không?'], ['ganuong', 'Đau. Nhưng thơm.']] },
  27: { title: 'Khỉ bán than', name: 'Khỉ Lửa Bán Than', v: { o: '#4a4a4a', r: '#ff6b1a' }, intro: [['gabip', 'Bài mới: ĐẤT NÓNG. Đứng yên hơn hai giây là bỏng chân. Cứ đi, cứ đấm, đừng đứng im.'], ['khilua', 'Than đây, than tự thân đây. Mua không?'], ['tibup', 'Khỉ bán than từ tay mình luôn à?'], ['khilua', 'Tiết kiệm chi phí.']] },
  28: { title: 'Gà nướng lần hai', name: 'Gà Nướng Hồi Sinh Lần 2', v: { n: '#5a2a0a' }, intro: [['ganuong', 'Lần hai rồi. Da tôi giờ như giày da.'], ['gabip', 'Ôn bài: khói với đất nóng cùng lúc. Vừa nhìn nắm đấm vừa đi.']] },
  29: { title: 'Khỉ sợ nước', name: 'Khỉ Lửa Sợ Nước', v: { o: '#ff3b3b' }, intro: [['gabip', 'Bài mới: khỉ này biết ĐỠ CHUẨN rồi phản đòn gấp đôi. Đấm một hai cái rồi lùi, đừng đấm bừa.'], ['khilua', 'Tao sợ mỗi nước. Mày có mang nước không?'], ['tibup', 'Con mang nắm đấm thôi.'], ['khilua', 'Ờ. Vậy đỡ.']] },
  30: { title: 'Gà nướng mật ong', name: 'Gà Nướng Mật Ong', v: { n: '#c98a2a' }, intro: [['ganuong', 'Lần này ướp mật ong. Đánh tôi dính tay đó.'], ['gabip', 'Trộn hết: khói, đất nóng, đỡ chuẩn. Hai tay sẵn sàng.']] },
  31: { title: 'Khỉ chúa', name: 'Khỉ Lửa Chúa Đảo', v: { o: '#ffd23f', r: '#ff3b3b' }, intro: [['khilua', 'Tao là chúa đảo khỉ. Đảo có 1 khỉ. Là tao.'], ['tibup', 'Cô đơn không ạ?'], ['khilua', 'Có lửa thì không cô đơn.']] },
  32: { title: 'Hỏa Long Nấu Lẩu' },
  33: { title: 'Lính trời ngủ gật', name: 'Thiên Binh Ngủ Gật' },
  34: { title: 'Tiên nữ lên sóng', name: 'Tiên Nữ Livestream', intro: [['tiennu', 'Mọi người ơi, 10 nghìn mắt xem rồi. Thằng nhóc này hôm nay toang.'], ['tibup', 'Chị quay con góc nào đẹp ấy.']] },
  35: { title: 'Lính trời ngáy to', name: 'Thiên Binh Ngáy To', v: { y: '#aab0c4' }, intro: [['thienbinh', 'Khò... ai gọi... khò... cổng trời đóng... khò...'], ['gabip', 'Ông này ngáy to quá. Đừng để ông ru ngủ.']] },
  36: { title: 'Tiên nữ bán hàng', name: 'Tiên Nữ Bán Hàng Online', v: { m: '#c6ff2e' }, intro: [['tiennu', 'Link dưới bình luận nha mọi người. Bá Khí giả, 99k.'], ['tibup', 'Chị cũng nhập hàng Anh Hai à?'], ['tiennu', 'Hoa hồng 40%, em không hiểu gì về đạo đức.']] },
  37: { title: 'Lính trời tăng ca', name: 'Thiên Binh Tăng Ca', v: { y: '#ff8c1a' }, intro: [['thienbinh', 'Tăng ca 3000 năm. Lương vẫn... tính theo mây.'], ['tibup', 'Mây có ăn được không ạ?'], ['thienbinh', 'Ăn được thì tao đã không ngủ gật.']] },
  38: { title: 'Tiên nữ bị bóc phốt', name: 'Tiên Nữ Bị Bóc Phốt', v: { m: '#ff3b3b', h: '#ffd23f' }, intro: [['tiennu', 'Em bị bóc phốt bán hàng giả. Giờ em stream để giải thích.'], ['gabip', 'Giải thích bằng cách đánh người à?'], ['tiennu', 'Content là content.']] },
  39: { title: 'Lính trời cuối cùng', name: 'Thiên Binh Gác Cổng Chính', v: { y: '#ffffff' }, intro: [['thienbinh', 'Ta là lính gác cổng chính. Sau cổng là Lão Rùa.'], ['tibup', 'Ông có ngủ không?'], ['thienbinh', 'Có. Nhưng ngủ đứng. Chuyên nghiệp hơn.']] },
  40: { title: 'Lão Rùa Thiên Tuế' }
};
/* situational banter */
var ENEMY_HIT = {
  _: ['Ái!', 'Đau!', 'Ơ kìa!', 'Mẹ ơi!', 'Nhẹ tay!', 'Hự!'],
  traului: ['Khò... đau...', 'Ai đánh trâu?', 'Mơ thấy đấm...'], lytruong: ['Ngáp... đau...', 'Phạt thuế!'], cao: ['Kính tao!', 'Hàng hiệu đấy!'],
  vitgia: ['Cạc!!', 'Gà bị đánh! À vịt!'], rua: ['Chậm... thôi...', 'Mai hẵng đau.'], hoalong: ['Lẩu đổ!', 'Khói mắt!'], tiennu: ['Đừng quay cảnh này!', 'Cắt! Cắt!'],
  ganuong: ['Giòn tan!', 'Nướng lần nữa à?'], bangvuong: ['Hắt... đau... XÌ!'], thienbinh: ['Tỉnh rồi!', 'Ai đánh cổng trời?']
};
var ENEMY_LOW = {
  _: ['Thôi thôi, nói chuyện được không?', 'Mình huề nhé?', 'Tao có con nhỏ ở nhà...', 'Để tao gọi quản lý.'],
  traului: ['Cho tao ngủ nốt đi...'], cao: ['Giảm giá 50%! Tha anh!'], vitgia: ['Thú thật, tôi là vịt. Tha đi.'], lytruong: ['Miễn thuế! Miễn thuế!'],
  tiennu: ['Mọi người ơi cứu em, thả tim đi!'], rua: ['Ta mới 10 nghìn tuổi, còn trẻ...'], ganuong: ['Đừng! Tôi sắp thành gà rán!'], hoalong: ['Lẩu còn chưa chín mà!']
};
var ENEMY_FOOLED = {
  _: ['Ha ha, dính rồi!', 'Dễ lừa quá!', 'Mắc bẫy nha!'],
  vitgia: ['Cạc cạc cạc, dính bẫy!', 'Vịt 1 - Người 0.'], cao: ['Tin anh chưa? Tin là mất tiền.'], bangvuong: ['Hắt hơi giả đấy. Hắt... thật nè. XÌ!']
};
var HERO_CRIT = {
  tibup: ['BỤP CHÍ MẠNG!', 'Bà ơi con làm được rồi!', 'Nắm tay to là có lý do!'],
  hoayen: ['CHÁY HẾT!', 'Nóng chưa?!', 'Thêm than đi!'],
  bangnhi: ['Đóng băng.', 'Vừa đủ lạnh.', 'Bình tĩnh là sức mạnh.'],
  thachlao: ['Đá rơi.', 'Hừm. Mạnh.', 'Không vội mà vẫn trúng.']
};
var HERO_SLOW = {
  tibup: ['Ơ, tay con còn kẹt ở túi kẹo.', 'Lag! Lag mạng!', 'Con vừa nghĩ đến thịt kho...'],
  hoayen: ['Nguội rồi!', 'Chậm thế này ai bán bánh?'],
  bangnhi: ['...hơi quá bình tĩnh.', 'Lạnh quá, tay cứng.'],
  thachlao: ['Đá mà, đá không vội.', 'Chậm là tốt. Hình như vậy.']
};
var GABIP_LINES = { count: ['Đếm được không đấy?', 'Hai... hay ba? Hồi hộp chưa.', 'Tai nghe, tay đếm.'], reverse: ['Vịt hôm nay là trọng tài.', 'Ngược rồi đấy, đừng theo thói quen.', 'Bíp là bẫy. Nhớ chưa?'],
  slow: ['Bạn ngủ à?', 'Chậm hơn Lão Rùa luôn.', 'Tôi gáy xong đi pha trà rồi đấy.', 'Lý Trưởng còn nhanh hơn.'],
  fast: ['Nhanh hơn cả tiếng gáy!', 'Tôi chưa kịp đóng mỏ!', 'Trời ơi tay hay mắt?'],
  streak: ['Chuỗi 3! Nóng máy rồi!', 'Chuỗi 5! Ai dạy bạn vậy?', 'Chuỗi 7! Tôi gáy không kịp!', 'Chuỗi 10!!! BÁ KHÍ THẬT SỰ!'],
  fooled: ['Đã bảo đừng tin vịt!', 'Màn ĐỎ mà cũng bụp!', 'Tai nghe gì vậy?!'],
  hold: ['Giữ chắc... đừng run.', 'Khí đang dâng...', 'Chưa, chưa thả!'],
  phew: ['Hú vía. Chờ tiếp.', 'Giỏi. Không mắc bẫy.', 'Vịt thua rồi, chờ tôi nhé.']
};
