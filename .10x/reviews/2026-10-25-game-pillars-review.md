# Đánh giá theo trụ cột làm game và ra mắt game — 2026-10-25

**Bản được chấm:** commit 66bdacf (Core 2 + đợt 1 sprint cổng game), build local từ `src/`, chụp trên khung 390×844 (iPhone 14), ngôn ngữ vi/en.
**Người chấm:** 10x-Team (QA + Senior Engineer + PM, lăng kính Art Director / Audio Director / Game Designer).
**Nhãn bằng chứng:** `CONFIRMED` = thấy trong ảnh chụp hoặc mã nguồn, có `file:line`. `HYPOTHESIS` = suy luận, chưa có số liệu người chơi.
**Lưu ý nền:** chưa có dữ liệu người chơi thật (bảng `events` chưa tạo). Mọi điểm về "cảm giác" và "độ khó" là đánh giá chuyên môn, không phải đo lường.

## Bảng điểm tổng

| # | Trụ cột | Điểm /10 | Trạng thái | Chặn ra mắt cổng? |
|---|---------|----------|-----------|-------------------|
| 1 | Lõi chơi (core loop) | 7 | Core 2 đủ chiều sâu, nhưng 15 đối thủ dùng chung 1 hồ sơ đòn | Không |
| 2 | Cảm giác tay (game feel) | 7 | Hit-stop, rung, flash, hạt đều có; thiếu "suýt nữa" khi thua | Không |
| 3 | Chuyển động (animation) | 5 | 1 khung hình tĩnh mỗi nhân vật, chỉ có squash/stretch thủ tục | Không, nhưng kéo điểm ấn tượng |
| 4 | Hình ảnh (art direction) | 5 | Nhân vật 14×18 px trộn nền vector gradient + chữ HD; 5 lỗi hiển thị cụ thể | **Có** (lỗi tràn chữ ở bản EN) |
| 5 | Âm thanh | 6 | 25 SFX + voice blip + 5 nhạc nền thủ tục; vòng nhạc 6,4 giây, không nhạc màn chính | Không |
| 6 | Cốt truyện và nhân vật | 7 | Tiền đề mạnh, 40 cửa có lời thoại riêng; kết thúc chỉ là một đoạn chữ | Không |
| 7 | Phút đầu (onboarding) | 7 | Vào thẳng trận, cửa 0 dạy 3 bước, tha mọi lỗi | Không |
| 8 | Giao diện và chữ (UI/UX) | 5 | HUD vỡ ở tiêu đề EN dài, 3 chỗ chữ tràn hoặc đè nhau | **Có** |
| 9 | Hệ thống giữ chân (meta) | 6 | Cửa hằng ngày, chạy 60 giây, đấu đôi, thách link; chưa có sưu tập | Không |
| 10 | Kỹ thuật và hiệu năng | 8 | 272 KB, không tài sản ngoài, chạy mọi trình duyệt, 11 bộ test xanh | Không |
| 11 | Sẵn sàng ra mắt (launch readiness) | 4 | Không og:image, không favicon, trailer quay trước Core 2, chưa có bộ ảnh listing, đo lường chưa nhận dữ liệu | **Có** |
| 12 | Bản địa hóa | 8 | vi/en/zh đầy đủ, chuyển ngữ sáng tạo; EN dài làm vỡ HUD | Một phần |

**Kết luận ngắn:** lõi chơi và kỹ thuật đã ở mức đem đi nộp được. Thứ kéo game xuống là **lớp trình bày** (hình ảnh, chuyển động, lỗi chữ) và **bộ đồ ra mắt** (ảnh chia sẻ, icon, trailer đúng bản, listing). Đây là hai thứ người chơi lạ nhìn thấy trước khi họ cảm nhận được lõi.

---

## 1. Lõi chơi — 7/10

**Có gì.** Vòng lặp: chờ → đối thủ ra đòn (mũi tên) → đỡ bằng vuốt hoặc chạm → gà gáy → bụp → lặp. Có đòn giả, giữ-để-cược x2,2, chuỗi đỡ nhân sát thương, 6 cơ chế gáy (thường, đôi, giữ, điểm sáng, luật ngược, đếm) và tín hiệu giả. Chạy 60 giây có nhịp độ tăng dần. `CONFIRMED` src/game.html:407-440.

**Thiếu gì.**
- `CONFIRMED` src/game.html:407-410: hồ sơ đòn chỉ phụ thuộc vùng đất và số cửa. Cánh Cụt, Người Tuyết, Băng Vương ở vùng 3 ra đòn giống hệt nhau. Người chơi không "học" được đối thủ, chỉ học vùng. Đây là khoảng trống lớn nhất của lõi, và đã nằm trong đợt 2.
- `CONFIRMED` src/game.html:442: chế độ Chạy 60 giây bốc ngẫu nhiên vùng đất và đối thủ độc lập nhau, nên Lính Đèn Lồng Ca Đêm đứng giữa trời vàng ban ngày (ảnh `shots/16-run.png`). Không sai luật nhưng phá chất "thế giới".
- `HYPOTHESIS`: đường cong độ khó 40 cửa chưa được kiểm bằng số. Cần phễu gate_lose theo cửa và theo lý do (`x`) sau khi bảng events chạy.

**Khuyến nghị.** Đợt 2 giữ đúng: bộ đòn riêng cho 15 đối thủ (mỗi đối thủ 2–3 "câu" đòn có chữ ký: Trâu ngủ ra đòn chậm nhưng kép, Vịt toàn đòn giả, Khỉ Lửa nhanh và dồn dập). Chạy 60 giây: chọn vùng rồi mới chọn đối thủ thuộc vùng.

## 2. Cảm giác tay — 7/10

**Có gì.** `CONFIRMED` src/game.html:362,390,432,523: hit-stop 85 ms khi dính đòn, 45 ms khi đỡ; rung màn theo sát thương; flash màu theo sự kiện; hạt khí quanh nhân vật khi chờ; rung điện thoại (`vib`). Đòn trúng có số sát thương và mili-giây phản xạ (ảnh `shots/12-hurt.png` ghi "BỤP! -15 423ms"). Đây là phần làm tốt nhất của game.

**Thiếu gì.**
- Thua không có "suýt nữa". Khi bụp sớm 30 ms hay đỡ sai hướng, màn chỉ báo "sớm" hoặc "sai hướng". Người chơi không biết mình gần đúng đến đâu, nên không có động lực thử lại ngay. Đã nằm trong đợt 2.
- Chạm mũi tên để đỡ không có phản hồi riêng cho ngón tay (không có vòng tròn nở ra chỗ chạm). `HYPOTHESIS`: người chơi mới sẽ nghi ngờ "mình đã chạm trúng chưa".
- Đòn trúng đối thủ: đối thủ bay sang phải và xoay, nhưng không có vệt chém hay "tia" nối từ nắm đấm sang mặt đối thủ. Cú đấm đọc được nhờ chữ, chưa nhờ hình.

## 3. Chuyển động — 5/10

**Có gì.** `CONFIRMED` src/sprites.js: mỗi nhân vật là **một** khung hình tĩnh 14×18 pixel. Mọi chuyển động là thủ tục trong src/game.html:561-586: co giãn theo sin, nghiêng, nhảy, trượt. Mỗi đối thủ có một "nhịp thở" riêng (trâu phồng xẹp, vịt lắc, cánh cụt nhảy). Vào trận có hiệu ứng chạy vào và bụi.

**Thiếu gì.**
- Không có khung hình "đấm", "đỡ", "ra đòn", "ngã". Cú đấm là nhân vật tĩnh trượt sang phải và co giãn. Đòn của đối thủ là nhân vật nghiêng về trước rồi giật lại, còn mũi tên vàng mới là thứ nói "sắp đánh". Người xem trailer hay ảnh chụp không thấy ai đang đánh ai.
- Gà Bíp trọng tài lơ lửng giữa không trung không có chỗ đậu (`shots/03-tutorial-arrow.png`). Thiếu một cành tre, một cái cọc hay hiệu ứng vỗ cánh đủ rõ.
- Tư thế thua: nhân vật xoay nằm ngang ở góc dưới trái, bị chữ "chạm để đánh lại ngay" đè lên (`shots/22-lost.png`). Thua cần được "diễn", không phải xoay 90 độ.

**Khuyến nghị.** Không cần bộ khung hình đầy đủ. Thêm 3 khung cho hero (đấm, đỡ, ngã) và 2 khung cho mỗi đối thủ (ra đòn, dính đòn) là đủ để game "đọc được" trong ảnh tĩnh. Với sprite dạng chữ như hiện nay, mỗi khung là 18 dòng chữ, chi phí thấp. Đây là việc đáng đưa vào đợt 2 vì nó phục vụ cả ảnh listing lẫn trailer.

## 4. Hình ảnh — 5/10

**Có gì.** Bảng màu rõ, mỗi vùng đất có tông riêng (tre xanh sáng, chợ đêm tím đèn lồng, sông băng xanh trắng, đảo lửa, cổng trời). Nhân vật dễ nhận. Logo và màn chính sạch (`shots/02-title.png`).

**Lỗi cụ thể.**
1. `CONFIRMED` `shots/06-gate9-dialog.png`: bong bóng lời thoại cửa 9 tràn khỏi mép phải, mất chữ ("Bụp lúc đó là…"). src/game.html:617 (hàm `bubble`) không bẻ dòng theo bề rộng màn.
2. `CONFIRMED` `shots/08-attack-arrow.png`: gợi ý "chạm hoặc vuốt theo mũi tên" bị cắt ở mép phải khi mũi tên ở sát biên. src/game.html:593.
3. `CONFIRMED` `shots/11-hit.png`: "CHUỖI ĐỠ x1" (src/game.html:595) đè lên chữ nổi "ĐỠ!" và "-8". Ba lớp chữ cùng một chỗ.
4. `CONFIRMED` `shots/19-boss24-fight.png`: bản EN, tiêu đề "GATE 24 · THE ICE KING SNEEZES" xuống 2 dòng, đẩy nút Quit xuống dưới nút loa, HUD vỡ. CSS src/game.html:88-89 không giới hạn bề rộng tiêu đề.
5. `CONFIRMED` `shots/20-final-boss.png`: đấu trường trùm cuối là nền cát phẳng và mây. Cửa 40 không trông khác cửa 33. Thiếu "sân khấu" cho trận cuối.
6. Độ phân giải trộn: nhân vật pixel 14 px phóng to 10 lần, nền là gradient và hình vector mượt, chữ là font HD. Ba ngôn ngữ hình ảnh trên một màn. Không phải lỗi, nhưng là lý do game trông "làm nhanh" trong ảnh chụp.

**Khuyến nghị.** Sửa 1–4 trước khi nộp cổng (nửa ngày). Số 5 và 6: chọn một hướng và giữ nhất quán. Rẻ nhất là kéo nền về cùng chất pixel (vẽ nền bằng ô vuông to, không gradient), đắt hơn là vẽ lại nhân vật 32 px.

## 5. Âm thanh — 6/10

**Có gì.** `CONFIRMED` src/audio.js: toàn bộ âm thanh sinh bằng WebAudio, không file. 25 SFX có chủ ý (gáy, cạc, hắt xì, đấm, chí mạng, đỡ, lên khí, thắng, thua, mở khóa). Voice blip đọc theo dấu tiếng Việt (sắc lên, huyền xuống, ngã lượn, nặng ngắn) src/audio.js:62-80, chi tiết hiếm thấy. 5 giai điệu theo vùng + nhạc trùm, nhạc tắt dần khi chờ gáy để tạo căng thẳng (src/audio.js:116-121). Compressor trên master để không vỡ.

**Thiếu gì.**
- `CONFIRMED` src/audio.js:94-115: mỗi giai điệu 32 bước, nửa phách mỗi bước, ở 150 bpm là **6,4 giây một vòng**. Một trận 60–90 giây nghe vòng đó 10–14 lần. Đây là nguồn "đơn điệu" nghe thấy được.
- Không có nhạc ở màn chính và bản đồ. Người chơi mở game vào im lặng.
- Âm thanh đòn trúng không đổi theo sát thương hay chuỗi: đấm -8 và chí mạng x2,2 chỉ khác một lớp crash.
- Không có tiếng môi trường (gió tre, chợ đêm, băng rạn) dù mỗi vùng đã có tông.

**Khuyến nghị.** Rẻ và hiệu quả: mỗi vùng 2 đoạn A/B 32 bước xen kẽ, đổi bass mỗi 4 vòng (giảm cảm giác lặp 3–4 lần). Thêm nhạc màn chính dùng giai điệu A chậm lại. Tiếng đấm tăng pitch theo chuỗi. Tất cả vẫn trong WebAudio, không thêm file.

## 6. Cốt truyện và nhân vật — 7/10

**Có gì.** Tiền đề một câu, dễ kể: "Lão Rùa thả Chậm Chạp Chi Thuật, gà gáy lúc 2 giờ chiều, Tí Bụp đi trả lại phản xạ cho muôn dân" (src/world.js:2-8). 15 đối thủ có tính cách qua lời thoại, 40 cửa có tiêu đề và đoạn mở riêng (src/story2.js:3-45), lời thoại tình huống khi bị đánh, khi sắp thua, khi lừa được (src/story2.js:47-80). Hài tự giễu rất Việt (Trâu Lười Gym, Tiên Nữ Livestream bị bóc phốt). Bản EN/ZH chuyển ngữ sáng tạo chứ không dịch sát.

**Thiếu gì.**
- Kết thúc là một đoạn chữ trên màn kết quả (src/world.js:163). 40 cửa đổi lấy 3 dòng chữ. Cần một cảnh kết dù chỉ 10 giây: làng tỉnh dậy, gà gáy đúng 5 giờ, nồi bánh chưng chín.
- Câu chuyện chỉ hiện trong hộp thoại có thể bỏ qua và bong bóng 1,6 giây. Không có gì trong gameplay nhắc đến "chậm": kẻ địch không chậm hơn, thế giới không chậm. `HYPOTHESIS`: người chơi quốc tế không đọc hộp thoại sẽ không biết game có truyện.
- Bà Nội Bụp, người thầy, chỉ xuất hiện ở cửa 1. Không có "người đồng hành" trên đường ngoài Gà Bíp.

## 7. Phút đầu — 7/10

**Có gì.** `CONFIRMED` sau đợt 1: nút VÀO GAME vào thẳng cửa 0; cửa 0 dạy đỡ đòn (có bàn tay chỉ), đòn giả, gáy, tha mọi lỗi, rồi tự sang cửa 1 (src/game.html, `startTutorial`/`tutorialRound`). Thua ở cửa thường cho đánh lại ngay không rời trận (src/game.html:499).

**Thiếu gì.**
- Bộ chọn ngôn ngữ che toàn bộ màn chính ở lần mở đầu (`shots/01-langpick.png`). Với cổng game (ngôn ngữ cố định) đã ẩn, nhưng trên ba-khi.vercel.app đây vẫn là màn đầu tiên người lạ thấy: một hộp thoại, không phải trò chơi.
- Cửa 0 có 9 tim trên HUD (`shots/03-tutorial-arrow.png`), nhìn như lỗi. Nên ẩn tim trong cửa tập.
- `HYPOTHESIS`: 3 bước tập mất khoảng 12–15 giây trước khi người chơi được bụp thật lần đầu. Với cổng game, 10 giây đầu quyết định ở lại hay thoát. Cân nhắc đổi thứ tự: gáy trước (3 giây có phần thưởng), đỡ sau.

## 8. Giao diện và chữ — 5/10

Lỗi đã liệt kê ở mục 4 (1–4). Thêm:
- Bản EN nhiều chuỗi dài hơn VI 30–60% (tiêu đề cửa, tên đối thủ "Sneezing Ice King"). HUD tên đối thủ đã xuống dòng ở `shots/19-boss24-fight.png`. Cần quy tắc: tiêu đề 1 dòng, cắt bằng dấu "…", tên đối thủ co chữ.
- Màn chính có 7 nút cùng cấp (Vào game, Hằng ngày, Đấu đôi, Chạy 60 giây, Bản đồ, Cốt truyện, Âm thanh). Người mới không biết chọn gì ngoài nút xanh. Cổng game thường chỉ muốn 1 nút.
- Bản đồ hiển thị "Đế Vương Bụp · 84 ms · 0/40 cửa" cho tài khoản mới chưa chơi (`shots/14-map.png`, do dữ liệu test), nghĩa là hạng được tính từ trung bình của rất ít mẫu. Nên yêu cầu tối thiểu 10 lần bụp trước khi gán hạng.

## 9. Hệ thống giữ chân — 6/10

Có: cửa hằng ngày theo hạt giống chung toàn cầu và chuỗi ngày, chạy 60 giây có kỷ lục, đấu đôi cùng máy, link thách đấu có bóng ma, thẻ kết quả tải ảnh. Thiếu: không có gì để "sưu tập" (thẻ đối thủ đã hạ, trang phục), không có bảng xếp hạng (đã quyết định không làm backend), không có mục tiêu ngoài 40 cửa. Đã nằm trong đợt 2 (bộ sưu tập v1).

## 10. Kỹ thuật — 8/10

`CONFIRMED`: build 272 KB không tài sản ngoài, chỉ tải font từ Google Fonts; ES5, không framework, chạy trên WebView cũ; không script inline (đúng yêu cầu cổng game); 11 bộ test Playwright xanh; build 3 ngôn ngữ × 2 cổng từ một nguồn; đo lường ẩn danh theo ADR-001. Trừ điểm: font Google Fonts là một yêu cầu mạng bên ngoài mà một số cổng chặn trong iframe (cần kiểm trên CrazyGames QA), và chưa có `manifest.json` nên không cài được lên màn hình chính.

## 11. Sẵn sàng ra mắt — 4/10

Danh mục đồ ra mắt chuẩn của một game web và tình trạng:

| Hạng mục | Tình trạng | Bằng chứng |
|----------|-----------|------------|
| Ảnh chia sẻ `og:image` 1200×630 | **Không có** | public/index.html chỉ có og:title/description |
| Favicon / icon 512 | **Không có** | không có `<link rel="icon">` |
| `manifest.json` (PWA) | Không có | |
| Trailer đúng bản hiện tại | **Lỗi thời**: v4 quay trước Core 2, không có đỡ đòn, đòn giả, cược | trailer/record4.js |
| Bộ ảnh listing (5 ảnh 16:9 hoặc 9:16) | Chưa có | |
| Clip 30 giây cho cổng | Chưa có | |
| Mô tả listing EN ngắn/dài, tag thể loại | Có nháp trong docs/global-strategy.md, chưa chốt | |
| Đo lường nhận dữ liệu | **Chưa**: bảng events chưa tạo | .10x/status.md |
| Chính sách riêng tư (cổng yêu cầu khi có analytics) | Chưa có trang | |
| Bài đăng mạng xã hội | Có sẵn | docs/social-launch.md |
| Test 50 người lạ | Chưa chạy | |

Mục in đậm là điều kiện tối thiểu để nộp cổng hoặc để một link chia sẻ trên Facebook/Discord hiện ra tử tế. Hiện tại dán link lên Facebook ra một ô xám không ảnh.

## 12. Bản địa hóa — 8/10

Ba ngôn ngữ đầy đủ cả giao diện, truyện, lời thoại, tên riêng (Tí Bụp → Ti Boop, Vịt Giả Gà → duck). Phát hiện ngôn ngữ đúng thứ tự (URL → đã chọn → trình duyệt). Trừ: chuỗi EN dài phá HUD (mục 8) và một số chuỗi EN trên canvas chưa co theo bề rộng.

---

## Việc cần làm, xếp theo thứ tự

**A. Trước khi test 50 người và trước khi nộp cổng (ước 1,5 ngày)**
1. Sửa 4 lỗi chữ: bong bóng bẻ dòng, gợi ý mũi tên kẹp trong màn, tách vị trí "CHUỖI ĐỠ" khỏi chữ nổi, HUD tiêu đề 1 dòng + tên đối thủ co chữ.
2. Ẩn 9 tim ở cửa 0; tư thế thua không bị chữ đè.
3. Tạo `og:image`, favicon, `manifest.json` (ảnh dựng từ canvas của game, không cần họa sĩ).
4. Tạo bảng events (chờ Owner duyệt hộp thoại Supabase).

**B. Trong đợt 2 (đã chốt, bổ sung từ đánh giá này)**
5. Bộ đòn riêng 15 đối thủ (đã có).
6. Cảm giác "suýt nữa" khi thua (đã có).
7. Bộ sưu tập v1 (đã có).
8. **Mới:** 3 khung hình hero (đấm, đỡ, ngã) + 2 khung mỗi đối thủ (ra đòn, dính đòn).
9. **Mới:** nhạc A/B mỗi vùng + nhạc màn chính; tiếng đấm đổi theo chuỗi.
10. **Mới:** chạy 60 giây chọn đối thủ theo vùng.
11. Bộ ảnh listing + clip 30 giây quay **sau** mục 8, bằng bot biết đỡ đòn.

**C. Sau khi có số liệu**
12. Cảnh kết 10 giây cho cửa 40.
13. Đấu trường trùm cuối riêng.
14. Quyết định hướng hình ảnh (pixel toàn phần hay vẽ lại nhân vật 32 px) dựa trên tỷ lệ ở lại ngày 1.

## Những gì đã làm đúng và nên giữ

- Lõi "đừng tin vịt" là một câu, nhớ được, dịch được sang ba thứ tiếng.
- Cảm giác tay khi trúng đòn (hit-stop, số mili-giây) là thứ hiếm game web nhỏ làm.
- Voice blip theo dấu tiếng Việt và hài tự giễu là bản sắc, không nên "quốc tế hóa" mất.
- Kỹ thuật một file, không tài sản, build đa ngôn ngữ, test tự động: nền này cho phép sửa nhanh trong 2 tuần tới.

Agent: Claude Code
