# Đặc tả bộ kỹ năng 4 nhân vật (đi kèm ADR-008)

- **Trạng thái:** ADR-008 đã được Owner duyệt (2026-10-28). Q1–Q5 đã chốt. Các con số vẫn là giả thuyết.
- **Phạm vi:** chưa sửa mã. Đối chiếu tại c5ae809, nhánh `claude/telemetry-teaching`.
- **Nhãn:**
  - **CONFIRMED** = đã kiểm trong mã tại c5ae809.
  - **H#** = giả thuyết, phải kiểm thử trước khi chốt.

Đơn vị khoảng cách là **SC**, đơn vị của engine.

| Mốc tham chiếu (CONFIRMED) | Giá trị |
|---|---|
| Tầm đấm | 11 SC |
| Tầm đòn nặng | 11,5 SC |
| Tầm móc | 12 SC |
| Khoảng cách hai bên lúc vào hiệp | khoảng 0,44 màn hình |

Thang sát thương (CONFIRMED):

| Đòn | Sát thương |
|---|---|
| Đấm | 8 |
| Đòn nặng | 18 |
| Móc | 22 |
| Liên hoàn của Tí | 38 |
| Tuyệt chiêu | 24–48 |
| Máu địch | 100–210 mỗi hiệp |

## 0. Luật chung

| Luật | Nội dung | Nguồn |
|---|---|---|
| BÍP mở hiệp | Đánh trước tiếng BÍP bị mổ −5 máu, như nhau với cả bốn nhân vật. Bỏ "được tha" của Băng Nhi (`forgive`). | CONFIRMED (`peck`, `src/game.html`); bỏ `forgive` là quyết định mới |
| Liên hoàn chung | Đấm → đấm 2 → móc, giữ nguyên cho cả bốn (màn tập đã dạy) | CONFIRMED `:782-792` |
| Đỡ chuẩn | Cửa sổ 150 ms, phản đòn ×2 trong 600 ms. Hỏa Yến có cửa sổ riêng; Thạch Lão đổi phần thưởng (mục 2 và 4) | CONFIRMED `:918-920` |
| Một thanh tài nguyên | Bá Khí cho Tí, Băng Nhi, Thạch Lão; Nhiệt cho Hỏa Yến | ADR-008 |
| Miễn khống chế (mới, toàn engine) | Đóng băng không cộng dồn. Địch thường tan băng thì miễn đóng băng **2 s** (H12). Trùm không bao giờ bị đóng băng: đòn đóng băng chỉ gián đoạn **0,4 s**, rồi miễn **8 s** (H13). Trong lúc miễn, trên đầu hiện "KHÁNG BĂNG". | Mới; sửa lỗi trùm hiện bị đóng băng 1,5 s (`:1090`) |
| Công tắc | `?kits=1` hoặc `save.dev.kits`. Khi tắt, game chạy như c5ae809 | Mới |
| Chế độ chạy 60 giây | Không áp bộ kỹ năng; dùng engine phản xạ như cũ | CONFIRMED (`B.fight = FIGHT && !opt.run`) |

Mỗi kỹ năng dưới đây mô tả theo cùng một khung: trạng thái → kích hoạt → hủy → tác động lên máu và tài nguyên → hiển thị → cách địch khắc chế → số liệu.

## 1. Tí Bụp: Chuỗi Bụp (liên kích)

| Mục | Đặc tả |
|---|---|
| Trạng thái | `kit.chain` (số nguyên), `kit.chainT` (lúc trúng gần nhất) |
| Tăng chuỗi | Đòn thường của Tí (đấm, đấm 2, nặng, móc, trên không) **trúng và không bị chặn**. Xung và tuyệt chiêu không cộng, cũng không làm đứt chuỗi |
| Đứt chuỗi | (a) đòn của Tí kết thúc mà không trúng ai<br>(b) địch chặn được đòn của Tí<br>(c) Tí mất máu vì bất kỳ nguồn nào, trừ chip damage lúc đang chặn<br>(d) quá **1,2 s** không có đòn trúng (H1) |
| Tác động | Từ chuỗi 3: đòn thường của Tí +5 % sát thương mỗi bậc, tối đa +25 % ở chuỗi 7 (H2). Không đổi máu, không đổi luật nạp Bá Khí |
| Khác liên hoàn chung | Liên hoàn đấm–đấm–móc mất sau 600–700 ms (CONFIRMED). Chuỗi Bụp đi xuyên nhiều lần liên hoàn, chỉ mất theo các điều kiện đứt ở trên |
| Hiển thị | Bộ đếm "CHUỖI n" cạnh thanh máu của Tí. Từ 3 trở lên, nắm đấm sáng vàng. Khi đứt: chữ xám "đứt chuỗi" một lần, gộp vào chữ nổi |
| Địch khắc chế | Đã có: AI chặn nhiều gấp 2,2 lần khi bị đấm liên tục (`aiStep`), chặn làm đứt chuỗi. Vùng 4 có địch đỡ chuẩn |
| Điểm yếu | 120 máu, hệ số ×1,0, không có khống chế |
| Số liệu (`f2`, trường 12) | `c<chuỗi dài nhất>b<hụt>.<bị chặn>.<bị trúng>.<hết giờ>` |

## 2. Hỏa Yến: Hỏa Tích (bùng nổ)

| Mục | Đặc tả |
|---|---|
| Trạng thái | `kit.heat` 0–100, hiện ở vị trí thanh Bá Khí: màu cam, nhãn "NHIỆT". Hỏa Yến không dùng Bá Khí |
| Nạp nhiệt | +0,9 × sát thương khi đòn của cô trúng và không bị chặn (H3). Không nạp khi bị trúng, khi chặn, hay khi đỡ chuẩn |
| Nguội | Sau **3 s** không đòn nào trúng (H4), mất **15/s** (H5) |
| Tiêu nhiệt | ✨ khi nhiệt ≥ 50: Phượng Kích, tức xung lao tới sẵn có (`sp`), tốn 50. ✨ khi nhiệt = 100: tuyệt chiêu đốt sẵn có, tốn toàn bộ |
| Lãng phí | Phượng Kích hoặc tuyệt chiêu không trúng ai: nhiệt đã tốn mất trắng, hiện "PHÍ NHIỆT" |
| Điểm yếu | Cửa sổ đỡ chuẩn **100 ms** thay vì 150 (H6). Hệ số đòn hạ từ 1,3 xuống **1,15** (H7), vì sức bùng nổ đã chuyển sang nhiệt. 120 máu |
| Hiển thị | Thanh cam có lửa khi ≥ 50; tay rực khi đầy; chữ "PHÍ NHIỆT" khi hụt |
| Địch khắc chế | Đã có: chặn nhiều khi bị đấm liên tục (không trúng thì không có nhiệt), đỡ chuẩn ở vùng 4 |
| Số liệu | `h<nạp>.<tiêu>.<phí do hụt>.<phí do nguội>` |

## 3. Băng Nhi: Hàn Kình (khống chế theo khoảng cách)

| Mục | Đặc tả |
|---|---|
| Đòn mới `ice` | 💥 khi đứng, không nằm trong liên hoàn, và Bá Khí ≥ **25** (H8): tốn 25. Nếu Bá Khí < 25, 💥 vẫn là đòn nặng thường. Sau đấm 2, 💥 vẫn ra móc như cũ để giữ liên hoàn chung. **Không thêm nút mới** |
| Tầm và xét trúng | Tối đa **30 SC** (H9). Xét trúng tức thời ở khung đòn có hiệu lực, với địch gần nhất phía trước trong 30 SC, cùng độ cao. Không có đạn bay |
| Nhịp đòn | Khởi động 260 ms, hiệu lực 120 ms, hồi 420 ms (H10). Hụt thì dễ bị đánh trả |
| Dải khoảng cách | **Sát** (≤ 11 SC): 18 sát thương + đóng băng **1,0 s**<br>**Vừa** (11–20 SC): 12 + đóng băng **0,5 s**<br>**Xa** (20–30 SC): 6 + làm chậm **1,5 s**: địch đi và khởi động đòn chậm ×1,3 (H11) |
| Đóng băng | Địch thường đứng yên, không đánh, không chặn (CONFIRMED: trạng thái `hit`). Theo luật miễn khống chế ở mục 0. Trùm chỉ bị gián đoạn 0,4 s |
| Tuyệt chiêu cũ | Đóng băng 1,5 s, 20 sát thương: giữ, nhưng theo luật miễn khống chế. Trùm chỉ bị gián đoạn |
| Điểm yếu | Hệ số ×1,0, 120 máu. Hàn Kình tốn Bá Khí nên ít xung và tuyệt chiêu hơn. Hụt thì hồi lâu |
| Hiển thị | Lúc khởi động: vệt băng chạy dọc tầm, chia ba màu theo ba dải, báo luôn cho người chơi biết tầm. Địch bị đóng băng: phủ sương và vòng đếm thời gian còn lại. Trùm đang miễn: biểu tượng "KHÁNG BĂNG" |
| Địch khắc chế | Đã có: lướt áp sát từ vùng 2. **Thêm (H14):** khi đối thủ là Băng Nhi và cách xa hơn 15 SC, AI lướt nhiều gấp đôi. Đây là thay đổi AI, cần test âm |
| Điện thoại | Phải xác nhận trong bản thử rằng vệt băng đọc được trên màn hình 390 px |
| Số liệu | `f<trúng sát>.<vừa>.<xa>.<ms đóng băng lên địch>` |

## 4. Thạch Lão: Sơn Kình (phòng thủ phản kích)

| Mục | Đặc tả |
|---|---|
| Trạng thái | `kit.pts` 0–3, hiện bằng 3 hạt đá cạnh thanh máu |
| Tích điểm | **Đỡ chuẩn** +1 điểm, tối đa 3 (H15). Thạch Lão **không** nhận phản đòn ×2 như ba người kia. Chặn thường không có điểm |
| Xả điểm | 💥 khi có ≥ 1 điểm: Sơn Kình. Đòn nặng có giáp lúc khởi động (bị đánh vẫn mất máu nhưng không bị ngắt), sát thương 18 + **8 mỗi điểm** (H16); đủ 3 điểm thì quật ngã. Tiêu hết điểm. Không có điểm thì 💥 là đòn nặng thường |
| Mất điểm | Bị vật: −1 điểm (H18), đây là cách khắc chế. Không đỡ chuẩn trong **8 s** (H17): mất hết. Hết hiệp: mất hết |
| Tuyệt chiêu "Thế Núi" (thay "Dỗi") | Thế đứng **1,5 s** (H21). Đòn thường **đầu tiên** đánh trúng ông bị vô hiệu và ông phản kích tự động: 20 + 5 mỗi điểm, tiêu hết điểm. **Chỉ phản một lần.** Đòn vật phá thế ngay lập tức. Hết thế hoặc sau khi phản thì hồi 400 ms |
| Điểm yếu | Mọi đòn khởi động **×1,2** (H19), đi chậm **×0,9** (H20), hệ số đòn ×0,8. 200 máu |
| Hiển thị | 3 hạt đá sáng dần. Thế Núi: hào quang đá và âm thanh riêng. Sơn Kình: sóng đất |
| Địch khắc chế | Đã có: AI vật khi Tí đứng chặn (vùng 2 trở đi). **Thêm (H22):** khi Thạch Lão đang trong Thế Núi và trong tầm, AI lùi 60 %, vật 30 %, đánh 10 %. Đây là thay đổi AI, cần test âm |
| Số liệu | `p<tích>.<xả>.<mất>s<phản>.<bị vật>.<hết giờ>` |

## 5. Vũ khí riêng (quyết định 1)

Áp dụng khi công tắc bật.
- **Cửa hàng:** ẩn 5 vũ khí dùng chung, không xóa mã hay dữ liệu. Áo và bánh chưng ở lại.
- **Bản thử:** chỉ có bậc 1, tức bộ kỹ năng gốc ở trên.
- **Mua bằng xu (Owner chốt Q2, 2026-10-28):**
  - Bậc 1 có sẵn khi mở nhân vật.
  - Bậc 2–4 mua bằng xu trong cửa hàng, chỗ của 5 vũ khí cũ. Mỗi bậc chỉ bày bán khi nhân vật đã mở và đã qua cửa mốc: bậc 2 qua cửa 16, bậc 3 qua cửa 24, bậc 4 qua cửa 32 (H25).
  - Giá đề xuất 110 / 180 / 260 xu, lấy theo giá các vũ khí cũ (H25).
  - Mua cho nhân vật nào thì chỉ nhân vật đó dùng.
  - **Hệ quả cho kinh tế xu (H26):**
    - Mua đủ cho cả bốn nhân vật tốn 4 × 550 = 2 200 xu; 5 vũ khí cũ chỉ tốn 910.
    - Phải đo lượng xu thật người chơi kiếm được (sự kiện `coins`) trước khi chốt giá.
    - Có thể giảm giá cho nhân vật mở muộn.
  - **Áo và bánh chưng:** vẫn bán như cũ.
- **Nguyên tắc cho các bậc sau:** mỗi bậc mở một lựa chọn mới, không chỉ cộng chỉ số. Mở theo vùng, sau khi nhân vật đã mở. Các ví dụ sau là giả thuyết, đặc tả sau khi đo:
  - **Tí:** chuỗi chịu được một lần bị chặn; chuỗi ≥ 5 thì móc quật ngã.
  - **Hỏa Yến:** Phượng Kích nối được từ đấm 2.
  - **Băng Nhi:** Hàn Kình để lại vùng băng làm chậm.
  - **Thạch Lão:** Thế Núi phản được hai lần.
- **Chi phí vẽ:** hình vũ khí trên người cả bốn. Thương của Hỏa Yến cần vẽ lại hình đánh, đây là chi phí lớn nhất.

## 6. Mở nhân vật ở cửa 8 / 16 / 24 (quyết định 2)

- **Mốc mở:** `HEROES.unlock` đổi thành 8 / 16 / 24. `heroUnlocked` không đổi: nó trả đúng khi `save.unlocked > unlock`, tức đã qua cửa đó (CONFIRMED `:381`).
- **Lời kết thúc:**
  - Lời kết thúc cửa 8, 16, 24 (vi/en/zh) báo người mới gia nhập.
  - Lời kết thúc cửa 32 bỏ câu báo mở nhân vật.
- **Giới thiệu:** trận đầu với nhân vật mới, Gà Bíp giới thiệu bộ kỹ năng qua `coach()` đã có.
- **Phải đo:** độ khó vùng 2–4 khi người chơi dùng nhân vật mới; bài dạy của `FIGHT_PLAN` vẫn đúng với cả bốn.

## 7. Số liệu `f2`

- **Định dạng:** `f2|…11 trường như f1…|<tóm tắt bộ kỹ năng>`. Trường 12 dùng mẫu trong từng mục ở trên, có tiền tố theo nhân vật (`c`, `h`, `f`, `p`).
- **Độ dài:** dài nhất ước khoảng 100 ký tự, dưới giới hạn 120.
- **Tương thích:** các truy vấn đang có đọc `f1|%` phải đổi điều kiện lọc thành `x ~ '^f[12]\|'`. `docs/analytics.md` sẽ có thêm cách tách trường 12.

## 8. Bản thử và tiêu chí nghiệm thu

**Bản thử:**
- Bản tranh, công tắc `?kits=1`, nút chọn nhân vật dành cho thử nghiệm.
- Cửa 12: quái thường, vùng 2, có vật và Vịt.
- Cửa 16: trùm 3 hiệp, Anh Hai.

**Bot:**
- Ba lối chơi:
  - đấm bừa
  - chỉ đứng thủ
  - cân bằng (chặn khi thấy mũi tên, đánh trả)
- 4 nhân vật × 2 cửa × 3 lối chơi × 50 trận.
- AI hiện dùng `Math.random`. Chỉ trong test, thêm hạt giống ngẫu nhiên để kết quả lặp lại được.

**Tiêu chí, đều là giả thuyết để Owner duyệt:**

| # | Tiêu chí |
|---|---|
| A1 | "Đấm bừa" không được thắng ≥ 80 % ở cửa 16 với cả bốn nhân vật |
| A2 | Lối chơi tốt nhất phải khác nhau giữa ít nhất 3 trên 4 nhân vật, hoặc chênh lệch tỷ lệ thắng giữa các lối chơi khác nhau rõ (> 15 điểm) |
| A3 | Trùm bị khống chế ≤ 10 % thời gian trận khi chơi Băng Nhi |
| A4 | Không vòng lặp khóa nào. Test âm: Băng Nhi không thể giữ một địch thường đóng băng quá 1,0 s trong mỗi 3 s |
| A5 | Khi tắt công tắc, 20 bộ test hiện có cho kết quả như c5ae809 |

**Kết quả bot lần 1 (2026-10-28, nhánh `claude/hero-kits-proto`, chưa commit):**
- Chạy `node tools/kitbot.js 30 6`: 4 nhân vật × 2 cửa × 3 lối chơi × 30 trận = 720 trận (ít hơn 50 trận như kế hoạch, để có số sớm).
- Đồng hồ ảo, hạt giống cố định, không lỗi trang, không trận nào treo. Bot chặn mọi yêu cầu tới Supabase.
- Đối chứng: cùng bot "đấm bừa", tắt công tắc (`KITS=0 STYLES=mash`): 240 trận.

| Tiêu chí | Kết quả | Kết luận |
|---|---|---|
| A1 | Đấm bừa thắng 30/30 ở cửa 16 với cả bốn nhân vật (Wilson 95 %: 89–100 %). Khi tắt công tắc cũng thắng 30/30. | **Không đạt.** Lỗi có từ trước, không do bộ kỹ năng gây ra. |
| A2 | Đấm bừa và cân bằng đều thắng 100 %. Chỉ đứng thủ thua 100 % vì hết giờ, do bot không bao giờ đánh. | **Không đo được.** Tỷ lệ thắng bão hòa nên không phân biệt được lối chơi. |
| A3 | Băng Nhi ở cửa 16: thời gian trùm bị khống chế, trung vị 3,5 %, cao nhất 5,0 %. | **Đạt.** |
| A4 | `tests/k1test.js`: test âm giữ đóng băng ≤ 1,0 s trong mỗi 3 s. | **Đạt.** |
| A5 | Tắt công tắc: 18/20 bộ test như trước. entest và zhtest giữ lỗi có sẵn; p3test lỗi ngẫu nhiên như ở c5ae809. | **Đạt.** |

- Máu mất, trung vị, của lối đấm bừa:
  - Cửa 12: 0 % với cả bốn nhân vật, bật hay tắt công tắc đều vậy.
  - Cửa 16, bật bộ kỹ năng: Tí 9 %, Hỏa Yến 0 %, Băng Nhi 9 %, Thạch Lão 6 %.
  - Cửa 16, tắt bộ kỹ năng: 0 / 0 / 0 / 6 %.
- **Nguyên nhân (HYPOTHESIS, có số liệu ủng hộ):** đòn nhẹ đánh liên tục giữ địch trong trạng thái trúng đòn hoặc ngã.
  - Lấy mẫu từng khung hình ở cửa 16 khi đấm bừa: trùm ở trạng thái `hit`/`down` khoảng 50 % thời gian, chỉ ra đòn ở 11–13 % thời gian.
  - Bật hay tắt công tắc, con số gần như nhau.
  - Chưa xác minh đòn nào của trùm bị cắt ngang ở giai đoạn ra đòn.
- **Giới hạn:** bot thao tác chính xác theo khung hình và không có độ trễ phản xạ của người thật. Tỷ lệ thắng của bot chỉ là cận trên.

**Người chơi thật:**
- Đợt chơi thử nội bộ: mỗi người chơi 2 nhân vật trên 2 cửa.
- Hỏi một câu: "Hai nhân vật khác nhau ở chỗ nào?" Đạt nếu ≥ 7/10 người nói được đúng cơ chế.
- Tỷ lệ thắng chỉ dùng để tham khảo cho tới khi đủ mẫu (xem `docs/analytics.md`).

## 9. Câu hỏi mở cho Owner

| # | Câu hỏi | Đề xuất của Implementer |
|---|---|---|
| Q1 | Áo tiên nới cửa sổ đỡ chuẩn lên 300 ms, đè lên nhược điểm của Hỏa Yến và làm Thạch Lão quá dễ tích điểm. Áo dài đỏ tăng nạp Bá Khí ×1,3 (có áp cho Nhiệt không?) | **Owner giao Implementer chọn:** khi công tắc bật, Áo tiên chỉ cộng +50 ms vào cửa sổ riêng của từng người (Hỏa Yến 100 → 150 ms, ba người kia 150 → 200 ms); Áo dài đỏ áp ×1,3 cho cả Nhiệt. Ghi là H27 |
| Q2 | Nâng cấp vũ khí mua bằng xu hay tự mở khi qua vùng? | **Owner chốt: mua bằng xu** (xem mục 5) |
| Q3 | Bỏ "được tha lần bấm sớm" của Băng Nhi? | **Owner chốt: bỏ** |
| Q4 | Bản thử hạ hệ số đòn của Hỏa Yến từ 1,3 xuống 1,15? | **Owner giao Implementer chọn:** có, 1,15 trong bản thử (H7), rồi đo |
| Q5 | Thêm hai luật AI mới (H14, H22)? | **Owner chốt: có, kèm test âm** (xem mục 10) |

## 10. Test âm cho hai luật AI mới (Owner chốt Q5)

Mỗi luật phải có test chứng minh nó **chỉ** chạy đúng nơi cần chạy. Các test chạy trên AI thật, không gọi thẳng hàm nội bộ, giống cách `tests/f9test.js` đang làm với đòn vật.

**H14: chống Băng Nhi đánh xa.** AI lướt áp sát nhiều gấp đôi khi đối thủ là Băng Nhi và cách xa hơn 15 SC.

| # | Tình huống | Kỳ vọng |
|---|---|---|
| N1 | Tí, Hỏa Yến, Thạch Lão đứng cách 18 SC | tần suất lướt bằng mức hiện tại (so với c5ae809, cùng hạt giống) |
| N2 | Băng Nhi đứng cách ≤ 15 SC | tần suất lướt bằng mức hiện tại |
| N3 | Băng Nhi ở cửa 9–12, nơi `FIGHT_PLAN` tắt `dash` | không lướt lần nào |
| N4 | Vùng 1, nơi AI chưa biết lướt | không lướt lần nào |
| P1 (dương) | Băng Nhi cách 18 SC ở cửa 13 trở đi | tần suất lướt khoảng gấp đôi N1, trong khoảng tin cậy |

**H22: chống Thế Núi.** Khi Thạch Lão đang đứng Thế Núi và trong tầm: AI lùi 60 %, vật 30 %, đánh 10 %.

| # | Tình huống | Kỳ vọng |
|---|---|---|
| N5 | Thạch Lão không đứng Thế Núi | AI hành xử như hiện tại |
| N6 | Đang Thế Núi nhưng ngoài tầm | AI hành xử như hiện tại |
| N7 | Đang Thế Núi ở cửa mà `FIGHT_PLAN` tắt `grab`, hoặc ở vùng 1 | không có đòn vật; phần 30 % chuyển thành lùi |
| N8 | Ba nhân vật khác đứng chặn trong tầm | không có luật Thế Núi nào chạy |
| N9 | Đòn vật trúng lúc Thế Núi | thế bị phá, không phản kích, Thạch Lão mất 1 điểm Sơn Kình |
| N10 | Hai đòn liên tiếp vào Thế Núi | chỉ đòn đầu bị phản, đòn sau trúng bình thường |
| P2 (dương) | Đang Thế Núi trong tầm, 200 lần quyết định của AI | tỷ lệ lùi / vật / đánh nằm quanh 60 / 30 / 10 % |

**Bỏ "được tha" của Băng Nhi (Owner chốt Q3):**
- Thêm test: Băng Nhi bấm trước tiếng BÍP thì bị mổ −5 máu như ba người kia.
- `forgive` không còn trong dữ liệu nhân vật khi công tắc bật.

## Bảng giả thuyết

Mọi con số dưới đây đều phải kiểm thử trước khi chốt.

| Mã | Giá trị |
|---|---|
| H1 | Chuỗi Bụp đứt sau 1,2 s không trúng |
| H2 | +5 %/bậc từ chuỗi 3, tối đa +25 % |
| H3 | Nhiệt +0,9 × sát thương khi trúng |
| H4 | Nhiệt bắt đầu nguội sau 3 s |
| H5 | Nhiệt nguội 15/s |
| H6 | Đỡ chuẩn của Hỏa Yến 100 ms |
| H7 | Hệ số đòn của Hỏa Yến 1,15 |
| H8 | Hàn Kình tốn 25 Bá Khí |
| H9 | Hàn Kình tầm 30 SC |
| H10 | Hàn Kình: khởi động 260 / hiệu lực 120 / hồi 420 ms |
| H11 | Ba dải 11 / 20 / 30 SC: 18 + 1,0 s, 12 + 0,5 s, 6 + chậm 1,5 s ×1,3 |
| H12 | Địch thường miễn đóng băng 2 s |
| H13 | Trùm: gián đoạn 0,4 s, miễn 8 s |
| H14 | AI lướt ×2 khi Băng Nhi cách > 15 SC |
| H15 | Đỡ chuẩn +1 điểm, tối đa 3 |
| H16 | Sơn Kình 18 + 8/điểm |
| H17 | Điểm mất sau 8 s không đỡ chuẩn |
| H18 | Bị vật −1 điểm |
| H19 | Khởi động của Thạch Lão ×1,2 |
| H20 | Thạch Lão đi chậm ×0,9 |
| H21 | Thế Núi 1,5 s, phản một lần |
| H22 | AI trước Thế Núi: lùi 60 % / vật 30 % / đánh 10 % |
| H23 | Các ngưỡng A1–A4 |
| H24 | Ngưỡng người chơi 7/10 |
| H25 | Giá và mốc bày bán bậc vũ khí: 110 / 180 / 260 xu, qua cửa 16 / 24 / 32 |
| H26 | Tổng 2 200 xu cho đủ bốn bộ vũ khí là chấp nhận được với lượng xu kiếm được |
| H27 | Áo tiên +50 ms trên cửa sổ riêng; Áo dài đỏ ×1,3 cho cả Nhiệt |
