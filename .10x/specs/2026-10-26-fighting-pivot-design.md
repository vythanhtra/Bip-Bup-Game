# Thiết kế: BÁ KHÍ thành game đối kháng hài hước (đề xuất, chờ Owner chốt)

**Yêu cầu Owner (2026-10-26):** "Tôi muốn thành game đối kháng và hài hước. Gà gáy BÍP chỉ báo hiệu trận đấu bắt đầu."

## 1. Cái gì đổi, cái gì giữ
| | Hiện nay (reflex) | Đề xuất (đối kháng) |
|---|---|---|
| BÍP | Tín hiệu để bụp, mỗi lượt một lần | Cồng khai trận, mỗi hiệp một lần |
| Vòng chơi | Chờ → BÍP → chạm → đo ms → lượt mới | BÍP → hai bên đánh qua lại cho tới KO hoặc hết giờ |
| Thắng thua | Đối thủ hết HP sau nhiều lượt; mình mất tim khi sai | Hai thanh HP, 2 thắng 3 hiệp, KO |
| Đòn địch | Mũi tên báo đòn, chạm vào mũi tên để đỡ, vuốt để né (đã có `MOVES` cho 15 địch) | Giữ nguyên nhưng thành cốt lõi: né/đỡ/phản đòn liên tục |
| Đòn mình | Một cú bụp khi BÍP | Chạm = đấm, chạm chạm = liên hoàn, giữ = đòn nặng tích khí, phản đòn sau khi đỡ |
| Vịt giả gà | Tín hiệu giả | Trò lừa của địch trong hiệp (giả vờ ra đòn) và chiêu hài |
| Mánh vùng (đôi, giữ, khói, ngược, đếm) | Biến thể tín hiệu | Biến thể đòn và bối cảnh (xem mục 4) |
| 15 địch, 4 hero, 40 cửa, 5 vùng, hội thoại, prologue | Giữ | Giữ, chỉ sửa lời luật |
| Thẻ tính giờ ms, xếp hạng, thách đấu bằng ms | Có | Đổi sang điểm hiệp (thời gian KO, HP còn, số phản đòn) |

## 2. Điều khiển một ngón (giữ bản sắc chơi dọc, một tay)
- **Chạm**: đấm thẳng, 1 nhịp. Ba chạm liền thành liên hoàn 3 (đấm, đấm, móc) nếu đúng nhịp (khoảng 180–320 ms giữa hai chạm).
- **Giữ rồi thả**: đòn nặng tích khí, càng giữ càng mạnh, tối đa 1,2 giây. Trong lúc giữ mình đứng yên, dễ ăn đòn.
- **Vuốt trái/phải**: né sang bên, tránh đòn ngang. **Vuốt xuống**: cúi, tránh đòn trên. **Vuốt lên**: nhảy đạp (đòn mở).
- **Chạm đúng mũi tên báo đòn**: đỡ. Đỡ đúng mở cửa sổ phản đòn 500 ms: chạm tiếp là phản đòn x2, có hiệu ứng chậm 150 ms.
- **Thanh Bá Khí** đầy sau 6 đòn trúng hoặc 3 đỡ: chạm hai ngón (hoặc giữ 1,5 giây) tung tuyệt chiêu hài của hero.

## 3. Nhịp một trận
1. Hội thoại trước trận như cũ (có thể bỏ qua).
2. Gà Bíp nhảy lên giữa sân, đếm "Hiệp 1..." rồi gáy **BÍP**: lóe xanh, cồng, nhạc vào trống. Bụp trước khi gáy: Gà Bíp mổ vào đầu, mất 5 HP, bong bóng "Chưa gáy!" (giữ gag cũ).
3. Hiệp 45 giây. Địch ra đòn theo `MOVES` (telegraph, feint, combo) xen kẽ với cửa sổ hở để mình đánh. Mỗi 8–12 giây có một "khoảnh khắc hài" (mục 5).
4. Hết HP: KO với hoạt cảnh riêng. Hết giờ: so HP, hòa thì Gà Bíp xử bằng... ngáp ai dài hơn thua.
5. Thắng 2 hiệp là qua cửa. Sao: 3 sao nếu KO không mất hiệp và HP trên 60 %.

## 4. Mánh vùng đổi nghĩa
| Vùng | Cũ | Mới |
|---|---|---|
| Làng Tre | phản xạ thuần | đòn thẳng, học né đỡ |
| Chợ Đêm | vịt giả gà, luật ngược | địch giả vờ ra đòn (feint nhiều), cửa 14 "luật ngược": đỡ bằng vuốt, né bằng chạm |
| Sông Băng | nhịp đôi, giữ khí, đếm | sàn trơn (né trượt xa hơn), đòn địch theo nhịp đôi, tích khí mạnh hơn, địch đếm nhịp rồi tung liên hoàn |
| Núi Lửa | khói, điểm sáng | khói che mũi tên báo đòn, chỉ thấy điểm sáng ở tay địch; nền nóng: đứng yên lâu mất HP |
| Thiên Đình | trộn tất cả | trộn tất cả, trùm 3 hiệp với 3 bộ đòn |

## 5. Hài hước có hệ thống (không chỉ lời thoại)
- **Trọng tài Gà Bíp can thiệp**: thỉnh thoảng chạy ngang sân, ai đánh trúng gà bị gà mổ; địch bị mổ thì mình được đánh tự do 2 giây.
- **Tuyệt chiêu hero**: Tí "Đói Quá Đấm Bừa" (đấm 10 phát mắt nhắm), Hỏa Yến "Bánh Tráng Nướng Mặt", Băng Nhi "Bình... Tĩnh..." (đóng băng địch rồi búng tai), Thạch Lão "Dỗi" (ngồi xuống, địch đánh gãy tay).
- **Tuyệt chiêu địch** (mỗi địch một): Trâu Lười ngủ gục đè người, Vịt Giả Gà gáy giả làm mình bụp sớm, Lý Trưởng ngáp làm mình ngủ 1 giây, Anh Hai bán hàng (mình mất HP mua kính), Tiên Nữ livestream (thả tim che màn hình), Lão Rùa chậm tới mức mình ngủ...
- **KO hoạt cảnh**: mỗi địch một kiểu ngã hài (có thể dùng sprite hurt + mã: xoay, bay, bẹp).
- **Bình luận viên**: Bà Nội bình luận từ góc màn hình bằng bong bóng ngắn mỗi 10 giây, lấy từ `TAUNTS`/`HERO_CHEER` và kho mới.
- **Đám đông**: 2–3 nhân vật nền (bù nhìn, trâu) phản ứng theo đòn (nhảy, che mắt).

## 6. Tài sản cần thêm
- Mỗi nhân vật (19): thêm 3 tư thế: đỡ (block), KO, tuyệt chiêu = 57 ảnh. Hiện có idle/attack/hurt. Né dùng idle + mã.
- Gà Bíp: 3 tư thế (đếm, mổ, chạy).
- Âm thanh: cồng, đỡ, phản đòn, KO, tuyệt chiêu (tổng hợp bằng mã như hiện nay).
- UI: hai thanh HP, đồng hồ hiệp, thanh Bá Khí, đếm hiệp. Khung gỗ như ADR-003 mục 5.

## 7. Ảnh hưởng mã (theo AGENTS.md: thay đổi kiến trúc + luật nghiệp vụ)
- `B.state` thêm `fight` thay cho chu kỳ wait/go/hit/hurt; `scheduleRound/signal` thành `startRound`; `hit/hurt` thành `dealDamage(side)`.
- `MOVES` giữ, `planAttacks` chạy liên tục trong hiệp thay vì theo lượt. `tickAttacks/parry/swipe` giữ, thêm counter window.
- Thách đấu ms, bảng xếp hạng ms, Cửa Hằng Ngày theo seed: giữ seed, đổi chỉ số sang thời gian KO.
- Chế độ chạy (run) và Đấu Tay Đôi (`versus.js`): versus hiện là tay đôi phản xạ, sẽ chuyển sang đối kháng chia đôi màn hình ở đợt sau.
- Tutorial 3 bước và prologue cảnh 4: đổi bài học thành "BÍP là bắt đầu, né đỡ rồi đấm".
- i18n: khoảng 40 chuỗi mới ×3 ngôn ngữ; `STORY[4]` và `tag` đổi thành "Gà gáy BÍP là trận bắt đầu. Đánh hay, né khéo, cười to."
- Test: p-series dựa trên chu kỳ lượt phải viết lại thành kịch bản hiệp (hook `__bakhi.plan`, `fight()`); giữ test i18n, scenery, prologue.

## 8. Ba phương án
| | A. Đấu nhịp (giữ lượt) | B. Đối kháng đầy đủ | C. Đối kháng một ngón (đề xuất) |
|---|---|---|---|
| Ý | BÍP mở hiệp, trong hiệp vẫn lượt: địch ra đòn, mình đỡ rồi được đấm 1 cú | Di chuyển, chặn, nhảy, combo nhiều nút, 2 ngón | Mục 2–5 ở trên: đánh qua lại liên tục, một ngón, hài có hệ thống |
| Công | 4–5 ngày | 4–6 tuần, cần gần 150 ảnh mới | 2–3 tuần, 60 ảnh mới |
| Rủi ro | Vẫn cảm giác "chờ", chưa phải đối kháng | Mất bản sắc chơi dọc một tay, cổng game chơi tay đôi khó | Cân bằng khó hơn, cần 2 vòng chỉnh sau khi chơi thử |
| Giữ được | Toàn bộ mã | Ít | Địch, đòn, nền, hội thoại, prologue, i18n |

**Đề xuất C**, chia 3 đợt để Owner chơi thử sớm:
1. **Đợt 1 (1 tuần)**: lõi hiệp: BÍP khai trận, 2 thanh HP, đấm/liên hoàn/đòn nặng, né/đỡ/phản đòn, KO, 2 thắng 3, Làng Tre 8 cửa chơi được trên preview. Chưa tuyệt chiêu.
2. **Đợt 2 (1 tuần)**: thanh Bá Khí và tuyệt chiêu 4 hero + 15 địch, trọng tài can thiệp, bình luận viên, KO hoạt cảnh, mánh vùng mới cho 4 vùng còn lại.
3. **Đợt 3 (3–5 ngày)**: tutorial và prologue cập nhật, daily/thách đấu theo chỉ số mới, versus, test, cân bằng, listing.

## 9. Câu hỏi Owner cần chốt
1. Chọn A, B hay C?
2. Hiệp: 2 thắng 3 với 45 giây, hay một hiệp dài tới KO?
3. Mất tim bỏ hẳn, hay giữ "tim" làm số lần được tiếp tục sau KO?
4. Chỉ số xếp hạng mới: thời gian KO, hay điểm tổng (HP còn + phản đòn + thời gian)?
5. Tuyệt chiêu kích hoạt bằng chạm hai ngón hay giữ 1,5 giây (một ngón thuần)?
