# Thẩm định game BÁ KHÍ: hội đồng 5 nhóm

- **Ngày:** 2026-10-27
- **Commit thẩm định:** 6cd0cde (`main`)
- **Phạm vi:** chế độ đối kháng (ADR-005), là chế độ mặc định của mọi bản trừ chạy nhanh (run)
- **Phương pháp:** đọc mã nguồn và bảng thông số, tính các con số trực tiếp từ mã. Chưa có dữ liệu người chơi thật.
- **Nhãn:** CONFIRMED = đã kiểm trong mã. HYPOTHESIS = suy luận, cần đo.

**Mức độ:**
- **Chặn:** phải sửa trước khi nộp portal.
- **Cần sửa:** nên sửa trước đợt chơi thử nội bộ.
- **Gợi ý:** sửa sau.

## Kết luận chung

**Chưa đạt để nộp portal.** Lõi đối kháng công bằng và đọc được:
- chặn thắng đòn đánh
- vật thắng chặn
- đấm nhanh thắng vật

Tuy vậy còn bốn vấn đề chặn:
1. 40 cửa đang dạy những luật không còn tồn tại.
2. Ưu và nhược điểm của nhân vật ghi trên màn hình không có thật trong trận.
3. Trùm cuối yếu hơn trùm trước, và hiệp cao trào bị bỏ qua nếu thắng liền hai hiệp.
4. Không thông số cân bằng nào đã được đo. Hệ thống ghi số liệu hiện cũng không ghi đủ để đo.

---

## Nhóm 1: Thiết kế trải nghiệm và cấp độ (nguyên tắc Nintendo)

### [Chặn] G1-1: Game dạy luật của chế độ cũ, chế độ đánh thật không có

CONFIRMED.

Các trường `mech`, `fake`, `to`, `dim`, `foxbluff`, `sneeze` của cửa và chỉ số `win` của nhân vật chỉ được đọc bởi chế độ phản xạ cũ:
- `src/game.html:483-512`
- `src/game.html:1134-1252`

Chế độ đối kháng chỉ dùng `g.hp`, `g.w`, `g.e`, `g.e2`, `g.smoke`, `phases` và cờ trùm (`src/game.html:791-803`).

Thế mà lời thoại và bản đồ vẫn dạy các luật cũ:
- Cửa 14 (`src/story2.js:17`): "LUẬT NGƯỢC: nghe CẠC thì BỤP"
- Cửa 17 (`src/world.js:174`): "BÍP BÍP thì bụp HAI cái"
- Cửa 20 (`src/world.js:179`, `story2.js:23`): "GIỮ ngón tay để tích khí"
- Cửa 22 (`story2.js:25`): "ĐẾM GÁY"
- Cửa 25 (`world.js:189`): "bụp đúng điểm sáng"
- Cửa 33 (`world.js:198`): "tôi hô Hai tiếng, Giữ khí, Nhìn kỹ"
- Dòng `mech` của 5 vùng trên bản đồ (`world.js:45-49`)

Người chơi được dặn một luật, rồi luật đó không xảy ra. Đây là lỗi dạy học nặng nhất theo cách Nintendo: giới thiệu một cơ chế ở nơi an toàn, phát triển nó, đảo nó, rồi kết.

**Yêu cầu:** viết lại lời thoại và mô tả vùng theo đúng những gì chế độ đánh có. Nội dung thật có theo từng vùng: xem G1-3.

### [Cần sửa] G1-2: Trong cùng một vùng, các cửa chỉ khác nhau ở máu địch

CONFIRMED.

Độ khó của AI chỉ phụ thuộc vào số vùng và cờ trùm (`aiProfile`, `src/game.html:789`). Mỗi vùng có 8 cửa, hai loại địch luân phiên, máu tăng 5 mỗi cửa.

Đường máu còn giữ những chỗ tụt của chế độ cũ (trước đây tụt để bù cơ chế mới): cửa 9 là 140 → cửa 10 là 105, 19→20, 28→29, 37→38. Trong chế độ đánh, đó là những cửa dễ hơn mà không có gì mới.

Điều này khớp với phản hồi trước đây của Owner: "đánh lặp lại nhiều quá".

Đường máu đầy đủ:

`1:100 … 7:130+đồng đội · 8:180 trùm · 9:140 · 10:105 … 16:190 trùm · 17:135 … 20:110 … 24:200 trùm · … 32:210 trùm · … 40: 120/140/160 trùm`

### [Cần sửa] G1-3: Có nội dung mới theo vùng, nhưng không được dạy

CONFIRMED.

Những gì chế độ đánh thật sự thêm vào theo vùng:

| Vùng | Môi trường (`worldMods`, `game.html:1044`) | AI mới (`aiStep`, `game.html:865-897`) |
|---|---|---|
| 1 Làng Tre | không | không |
| 2 Chợ Đêm | thêm đòn giả, Vịt hô BÍP giả giữa trận (đánh trong 0,65 s là mất 5 máu) | lướt vào, đánh chặn trên không (upper), vật khi Tí đang chặn |
| 3 Sông Băng | băng trơn (trượt) | móc quật ngã |
| 4 Núi Lửa | khói (chỉ thấy ánh nắm đấm), dung nham (đứng yên 2,5 s mất 3 máu mỗi 0,8 s) | địch đỡ chuẩn 35 % |
| 5 Thiên Đình | ngẫu nhiên 2 trong 5 yếu tố trên | tổng hợp |

Tất cả chỉ được báo bằng một dòng chữ lúc bắt đầu trận (`modLabels`, `game.html:1048`). Đòn vật xuất hiện lần đầu ở vùng 2 mà không có bài dạy nào. Dung nham phạt việc đứng yên mà không ai nói trước.

**Yêu cầu:** cửa đầu mỗi vùng dạy đúng một thứ mới trong điều kiện an toàn. Ví dụ ở cửa 9: Gà Bíp nói "nó sẽ vật nếu con chỉ đứng chặn; đấm nhanh để ngắt", và địch cửa đó chỉ dùng đòn vật.

### [Cần sửa] G1-4: Có phím vô dụng và kỹ năng chưa được dạy

- **Cúi:** không có tác dụng gì, chỉ đổi tư thế. CONFIRMED: chỉ được gán ở `game.html:862`, không có trong phép tính trúng đòn (`resolveHit`, `game.html:906`).
- **Màn tập:** dạy đi, ba đòn liên hoàn, chặn và tuyệt chiêu (`i18n.js:5`), nhưng không dạy nhảy, đòn trên không, lướt (bấm đúp) hay cách xử lý đòn vật.

### Điểm mạnh

- Đoạn mở đầu chơi được.
- Có cảnh chuyển trước mỗi cửa.
- Vật phẩm mở dần theo cửa và tiền thưởng chơi lại, tạo vòng lặp muốn chơi tiếp.
- Thất bại có thể thử lại ngay.

---

## Nhóm 2: Nhân vật và cân bằng chiến đấu (nguyên tắc Riot)

### [Chặn] G2-1: Nhược điểm ghi trên màn hình không có thật

CONFIRMED.

| Nhân vật | Máu | Hệ số đòn | Máu × đòn | Liên hoàn 3 đòn | Tuyệt chiêu | Mở ở cửa | Nhược điểm ghi trên màn hình | Thực tế trong trận |
|---|---|---|---|---|---|---|---|---|
| Tí Bụp | 120 | 1,0 | 120 | 38 | dồn 8 đòn × 6 | 0 | không | |
| Hỏa Yến | 120 | 1,3 | **156** | 49 | đốt 26×1,3 + 4×4 | 16 | "cửa sổ phản xạ hẹp hơn 20 %" | `win` chỉ dùng ở chế độ cũ (`game.html:499, 1246`), nên **không có nhược điểm** |
| Băng Nhi | 120 | 1,0 | 120 | 38 | đóng băng 20 + 1,5 s | 24 | ưu điểm "được tha lần bụp sớm" | chỉ tha 5 máu khi bấm trước tiếng BÍP, gần như vô nghĩa |
| Thạch Lão | 200 | 0,8 | 160 | 30 | dỗi 3 s, phản đòn | 32 | "đánh chậm" | tốc độ đòn giống hệt các nhân vật khác |

Hệ quả:
- Hỏa Yến mạnh hơn Tí ở mọi mặt.
- Băng Nhi mở sau Hỏa Yến nhưng yếu hơn cô.

### [Chặn] G2-2: Bốn nhân vật dùng chung một bộ đòn

CONFIRMED.

Cả bốn dùng chung bảng `ATK` (`game.html:777-787`), cùng tốc độ đi, cùng tầm. Khác biệt duy nhất về lối chơi là tuyệt chiêu, mà tuyệt chiêu chỉ dùng được khi thanh Bá Khí đầy.

Theo Riot, mỗi nhân vật cần một điểm mạnh rõ, một điểm yếu rõ, và một cách chơi riêng mà người chơi cảm nhận được trong từng giây, không chỉ lúc tung chiêu.

**Đề xuất (cần Owner duyệt vì đổi lối chơi):**
- **Tí:** cân bằng.
- **Hỏa Yến:** đòn ra nhanh hơn, nhưng mất máu khi chặn gấp đôi.
- **Băng Nhi:** cửa sổ đỡ chuẩn rộng hơn, đòn yếu hơn.
- **Thạch Lão:** đòn nặng có giáp (không bị ngắt), nhưng đi chậm hơn 15 %.

### [Cần sửa] G2-3: Tuyệt chiêu của Thạch Lão không có cách phản ứng từ đối thủ

CONFIRMED.

Chiêu "dỗi" phản lại mọi đòn trong 3 s (`resolveHit`, `game.html:907`). AI không hề kiểm tra trạng thái này (`aiStep`), nên vẫn lao vào đánh và tự ăn đòn. Đối thủ phải có cách phản ứng: lùi ra, hoặc chờ hết thời gian.

### Điểm mạnh

AI có đọc thói quen người chơi (`game.html:882-885`):
- đấm liên tục → địch chặn nhiều gấp 2,2 lần
- nhảy → địch đánh chặn trên không
- đứng chặn → địch vật

Đây là phản ứng hợp lý trước lối chơi của người chơi.

---

## Nhóm 3: Trùm, nhịp độ và độ khó

### Số liệu tính từ mã

CONFIRMED. Tính từ `aiProfile` và `aiAttack` (`game.html:789, 898-905`).

| Vùng | Khởi động đòn nhẹ (ms) thường / trùm | Đòn nặng (ms) thường / trùm | Vật (ms) thường / trùm | Hệ số sát thương địch thường / trùm | Số đòn nặng hạ 120 máu thường / trùm | Tỷ lệ chặn | Tỷ lệ vật khi Tí chặn |
|---|---|---|---|---|---|---|---|
| 1 | 421 / 379 | 662 / 596 | 756 / 680 | 1,05 / 1,20 | 7 / 6 | 20 % | 0 |
| 2 | 351 / 316 | 552 / 497 | 630 / 567 | 1,20 / 1,35 | 6 / 5 | 28 % | 27 % |
| 3 | 304 / 274 | 478 / 431 | 546 / 491 | 1,35 / 1,50 | 5 / 5 | 36 % | 33 % |
| 4 | 269 / 242 | 423 / 381 | 483 / 435 | 1,50 / 1,65 | 5 / 4 | 44 % | 39 % |
| 5 | 234 / 211 | 368 / 331 | 420 / 378 | 1,65 / 1,80 | 4 / 4 | 52 % | 45 % |

Tỷ lệ vật là xác suất ở mỗi lần AI ra quyết định, tức mỗi 0,11–0,25 s, khi Tí đứng chặn trong tầm.

### [Chặn] G3-1: Trùm cuối yếu hơn trùm trước, và hiệp cao trào thường bị bỏ qua

CONFIRMED.

- **Máu:** máu mỗi hiệp của Lão Rùa là 120/140/160, trong khi Hỏa Long có 210 mỗi hiệp.
- **Thể thức:** trùm đánh 3 hiệp thắng 2 (`rtot`, `game.html:441`; `endRound`, `game.html:991-992`).
- **Hệ quả:** ai thắng liền hai hiệp sẽ không bao giờ gặp hiệp 3 "MƯỜI NGHÌN NĂM BÁ KHÍ".
- **Bộ đòn:** hiệp 1 của Rùa có thời gian báo đòn ×1,6, nên chậm hơn địch thường ở vùng 5.

**Yêu cầu:** với trùm có nhiều giai đoạn, ba giai đoạn phải là ba thanh máu nối tiếp, không phải thắng 2 trên 3. Máu và độ khó tăng dần, và giai đoạn 3 phải là thứ mạnh nhất game.

### [Cần sửa] G3-2: Trùm chỉ là địch thường được cộng chỉ số

CONFIRMED.

So với địch thường cùng vùng, trùm chỉ hơn:
- 10 % độ hung hăng
- báo đòn ngắn hơn 10 %
- sát thương +0,15
- thể thức thắng 2 trên 3
- một tuyệt chiêu riêng

Ba cơ chế riêng của trùm đều chỉ chạy ở chế độ cũ: màn tối dần của Lý Trưởng (`dim`), BÍP giả của Cáo (`foxbluff`), hắt hơi của Băng Vương (`sneeze`).

Đây đúng là kiểu "chỉ tăng máu và sát thương" mà hội đồng cảnh báo. Mỗi trùm cần một kiểu nguy hiểm riêng mà người chơi nhận ra được và có cách đối phó. Ví dụ:
- Lý Trưởng ngáp làm Tí buồn ngủ: phải đánh trước khi ngáp xong.
- Cáo hô BÍP giả giữa trận.
- Băng Vương hắt hơi đẩy lùi, và hắt hơi có báo trước.

### [Cần sửa] G3-3: Tín hiệu báo đòn

CONFIRMED (`drawFighters`, `game.html:1029-1035`).

**Tốt:**
- Mũi tên trên đầu đổi từ vàng sang đỏ ở 75 % thời gian khởi động.
- Vật có biểu tượng 🤲 kèm chữ.
- Đánh chặn trên không có biểu tượng ⬆️.

**Vấn đề:**
- **Đòn nhẹ và đòn nặng dùng cùng một mũi tên.** Người chơi không biết sắp ăn 8 hay 30 sát thương.
- **Đòn giả được tô hồng kèm dấu "?".** Thực tế đòn giả được thông báo trước. Tỷ lệ đòn giả tăng theo vùng (0 → 45 %) chỉ thêm thời gian chết, không thêm thử thách. Đây là độ khó giả.
- **Phản xạ ở vùng 5 (HYPOTHESIS):** khởi động 211–234 ms gần bằng thời gian phản xạ thị giác phổ biến (khoảng 250 ms, chưa kể độ trễ thiết bị). Chặn bằng phản xạ gần như không làm được, chỉ còn cách giữ lùi để tự chặn. Vòng lặp "giữ lùi, rồi bị vật, rồi đấm ngắt" có thể đủ sâu, nhưng phải được kiểm chứng bằng người chơi.

### Mức phạt khi mắc lỗi

CONFIRMED.

Mức phạt nhẹ, hợp với game portal:
- bấm trước tiếng BÍP: −5 máu
- đánh trúng trọng tài: −6 máu và choáng 0,7 s
- BÍP giả: −5
- dung nham: −3 mỗi 0,8 s
- thua cửa: thử lại ngay

Hết 60 s thì xử theo tỷ lệ máu. Không có thông báo nào giải thích vì sao thua.

---

## Nhóm 4: Hình ảnh, hoạt ảnh và hiệu ứng

### [Cần sửa, ưu tiên cao] G4-1: Mọi loại đòn dùng chung một hình "đánh"

> **Đính chính 2026-10-28:** bản đầu ghi "mỗi nhân vật chỉ có 3 tư thế", dựa vào `actorKeys` (`src/assets.js:16`), hàm chỉ nạp trước 3 hình. Kiểm lại thư mục `img-src/s/`:
> - **Tí:** 8 hình (đứng, đi, nhảy, đánh, chặn, trúng đòn, ngã, tuyệt chiêu).
> - **Hỏa Yến, Băng Nhi, Thạch Lão:** 6 hình.
> - **Đối thủ:** 4 hình (đứng, đánh, trúng đòn, và ngã hoặc chặn).
>
> Kết luận về đòn đánh không đổi.

CONFIRMED (`img-src/s/`).

Mọi đòn dùng cùng một hình `attack`: nhẹ, nặng, móc, vật, upper, trên không. Với đối thủ, chặn và nhảy cũng chỉ là bóp, nghiêng hoặc xoay ảnh.

Người chơi không đọc được đòn từ dáng người mà phải dựa vào biểu tượng phủ lên. Theo hướng dẫn của Riot, hình dáng và hoạt ảnh phải tự nói lên đòn.

**Tối thiểu cần thêm** cho Tí và 5 trùm:
- dáng gồng đòn nặng
- dáng vật
- dáng chặn (đối thủ chưa có)

### [Cần sửa] G4-2: Hiệu ứng che mất thông tin đòn

CONFIRMED.

- Chiêu lóe sáng của Lính Đèn Lồng ẩn mọi mũi tên báo đòn trong 2,2 s (`hideArrow`).
- Tim của Tiên Nữ phủ màn hình 2,6 s.
- Khói ở vùng 4 chỉ cho thấy ánh nắm đấm.
- Các tuyệt chiêu diện rộng có tầm 40 ô (`superMove`, `game.html:1053`) nhưng không vẽ phạm vi.

Theo nguyên tắc Riot, hiệu ứng che đòn thật là lỗi thiết kế, trừ khi đó là cơ chế đã được dạy và có cách chống.

**Yêu cầu:** mỗi hiệu ứng che phải còn một tín hiệu âm thanh và một tín hiệu hình tối thiểu, và phải được giới thiệu trước.

### Điểm mạnh

- Nhân vật dễ nhận ra sau đợt rà soát hình ảnh: mũ, áo và màu nhất quán.
- Địch biến thể dùng bảng màu riêng (`GATE_META v`).
- Cảm giác đánh tốt: dừng hình 55/75/100 ms theo sát thương, rung màn hình, tia lửa.
- Vũ khí và áo mua trong cửa hàng hiện ra trên người Tí.

---

## Nhóm 5: Kiểm thử, dữ liệu và cân bằng

### [Chặn] G5-1: Không thông số cân bằng nào đã được đo

CONFIRMED.

Bảng `events` hôm nay có 0 dòng. 17 bộ test kiểm tra chức năng, không kiểm tra cân bằng.

| Loại | Thông số |
|---|---|
| **Đã đo** | khung hình 16,6 ms trung bình, p95 16,8 ms (p4test); không tràn khung ở 5 độ phân giải; luồng chức năng (17 bộ test) |
| **Giả thuyết, chưa đo** | toàn bộ bảng ATK; hệ số báo đòn và sát thương theo vùng; đường máu 40 cửa; chỉ số 4 nhân vật; tỷ lệ chặn, vật, đòn giả; giá vật phẩm; tiền thưởng; độ dài hiệp 60 s; thời gian dung nham và Vịt |

### [Chặn] G5-2: Hệ thống ghi số liệu không ghi đủ để cân bằng

CONFIRMED (`game.html:1165`).

`gate_clear` và `gate_lose` không ghi:
- nhân vật đang dùng
- máu còn lại
- tỷ số hiệp
- thời gian trận
- số lần dùng tuyệt chiêu
- nguồn sát thương nhận vào
- số lần thử ở cửa đó

Trường `x` còn ghi sai:
- `'hearts' + B.hearts` không đổi trong chế độ đánh, vì tim không bị trừ.
- `'r' + B.round` là bộ đếm của chế độ cũ.

### Yêu cầu trước khi chấp nhận cân bằng

**1. Sửa sự kiện** `gate_clear` / `gate_lose` để ghi: nhân vật, máu còn (%), tỷ số hiệp, thời gian (ms), số tuyệt chiêu, số lần thử cửa này, và nguồn sát thương lớn nhất (đòn nặng / vật / dung nham / trọng tài / tuyệt chiêu).

**2. Chỉ số cần đo:**
- tỷ lệ qua cửa ở lần đầu, theo từng cửa
- số lần thử trung bình
- máu còn lại
- thời gian
- tỷ lệ bỏ giữa chừng
- tỷ lệ thắng theo nhân vật trên cùng nhóm cửa
- tần suất tuyệt chiêu
- phân bố nguồn sát thương

**3. Ngưỡng mục tiêu (HYPOTHESIS, Owner duyệt):**
- qua lần đầu 75–90 % ở vùng 1, 45–65 % ở trùm vùng 5
- không cửa nào cần quá 4 lần thử ở trung vị
- chênh tỷ lệ thắng giữa các nhân vật không quá 5 điểm phần trăm

**4. Bot mô phỏng** (người chơi máy với 3 mức kỹ năng, seed cố định) chạy 40 cửa × 4 nhân vật để bắt hồi quy cân bằng. Hiện AI dùng `Math.random`, không có seed.

**5. Cỡ mẫu:** đợt chơi thử 10 người (kế hoạch portal) chỉ đủ để phát hiện cửa kẹt. Cần ít nhất vài trăm lượt chơi ở mỗi vùng mới kết luận được tỷ lệ thắng.

---

## Thứ tự khuyến nghị

| # | Việc | Nhóm | Cần Owner duyệt? |
|---|---|---|---|
| 1 | Sửa sự kiện ghi số liệu (G5-2) trước đợt chơi thử | 5 | không (nhỏ) |
| 2 | Viết lại lời thoại và mô tả vùng theo luật đánh thật; dạy một thứ mới ở cửa đầu mỗi vùng (G1-1, G1-3) | 1 | không đổi lối chơi |
| 3 | Rùa: 3 giai đoạn nối tiếp, máu tăng dần, giai đoạn 3 mạnh nhất (G3-1) | 3 | có |
| 4 | Bản sắc nhân vật: nhược điểm thật cho Hỏa Yến, bỏ hoặc thay "tha bụp sớm" của Băng Nhi, Thạch Lão đi chậm hoặc có giáp (G2-1, G2-2) | 2 | có |
| 5 | Cơ chế riêng cho 5 trùm trong chế độ đánh (G3-2) | 3 | có |
| 6 | Mũi tên khác nhau cho đòn nhẹ / nặng; bỏ dấu "?" của đòn giả hoặc giảm tỷ lệ đòn giả (G3-3) | 3, 4 | có |
| 7 | Cúi né được upper và đòn cao, hoặc bỏ phím cúi (G1-4) | 1 | có |
| 8 | Thêm tư thế gồng nặng / vật / chặn (G4-1) | 4 | tốn công vẽ |
| 9 | Bot mô phỏng có seed (G5) | 5 | không |

## Giới hạn của thẩm định này

- Không chơi tay. Mọi nhận định về cảm giác là HYPOTHESIS cho tới khi có người chơi thật.
- Con số 250 ms phản xạ là mức phổ biến, chưa đo trên người chơi của game.
- Chưa xét chế độ chạy nhanh (run, vẫn dùng chế độ phản xạ), đấu tay đôi và cửa hằng ngày.
- "Không thấy lỗi" ở phần nào không có nghĩa phần đó đã được chứng minh là ổn.
