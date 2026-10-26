# ADR-004: Chuyển lõi chơi từ phản xạ một cú sang đối kháng một ngón

**Status:** Accepted (Owner ủy quyền 2026-10-26: "Bạn tự xác định vai trò và đánh giá, lựa chọn"; Game Director chọn C)
**Date:** 2026-10-26
**Feature:** fighting-pivot
**Author:** 10x-Team (Architect + Staff Engineer), Owner quyết

## Context
Owner yêu cầu game thành đối kháng và hài hước; BÍP chỉ còn là cồng khai trận. Lõi hiện tại là chu kỳ lượt: chờ, tín hiệu, một cú bụp đo ms, cộng thêm lớp đòn địch có telegraph, đỡ bằng chạm mũi tên, né bằng vuốt, bộ đòn riêng cho 15 địch (`MOVES`). Lớp này đã là 40 % của một hệ đối kháng.

## Decision
Theo phương án C trong `specs/2026-10-26-fighting-pivot-design.md`: hiệp đấu liên tục sau BÍP, hai thanh HP, đấm/liên hoàn/đòn nặng bằng chạm và giữ, né/đỡ/phản đòn bằng vuốt và chạm mũi tên, 2 thắng 3 hiệp, thanh Bá Khí mở tuyệt chiêu hài, trọng tài Gà Bíp can thiệp. Giữ điều khiển một ngón, màn dọc, một file HTML + tài sản PNG (ADR-003). Giữ `MOVES`, nền, hội thoại, prologue, i18n. Trạng thái trận thành `fight` với vòng tick liên tục; `hit/hurt` thành `dealDamage(side, amount, kind)`.

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|---|---|---|---|
| A. Giữ lượt, BÍP mở hiệp | Rẻ, 4–5 ngày | Vẫn là chờ tín hiệu, không phải đối kháng | Không đạt yêu cầu |
| B. Đối kháng đầy đủ hai ngón | Gần game đối kháng thật | 4–6 tuần, 150 ảnh, mất bản sắc một tay, cổng game khó | Quá ngưỡng cho đợt này |
| C. Đối kháng một ngón | Giữ bản sắc, tận dụng 40 % mã, 2–3 tuần | Cân bằng cần vài vòng chỉnh | Chọn |

## Consequences
### Positive
- Trận có cao trào, hài có hệ thống (trọng tài, tuyệt chiêu, KO), dễ làm clip và listing.
### Negative
- Chỉ số ms và xếp hạng cũ mất ý nghĩa; thách đấu/daily phải đổi chỉ số; p-series test viết lại.
- Versus phản xạ hiện tại lệch khỏi lõi mới, cần làm lại ở đợt sau.
### Risks
- Cân bằng: đòn nặng quá mạnh hoặc đỡ quá dễ. Giảm: tham số trong `GATES`/`MOVES`, hook `__bakhi.plan`, chơi thử Owner sau đợt 1.
- Tài sản: 60 ảnh mới phụ thuộc hạn mức Canva. Giảm: đợt 1 không cần ảnh mới (block và KO bằng mã từ idle/hurt).

## Dependencies
- ADR-003 (tài sản PNG). Golden flow: tutorial, prologue, daily, challenge, run, versus phải cập nhật cùng.

## Quyết định 5 điểm (Game Director thay Owner, 2026-10-26)
1. Phương án C: đối kháng một ngón.
2. Cửa thường: một hiệp 45 giây tới KO (giữ nhịp 60–90 giây mỗi cửa); trùm: thắng 2 trong 3 hiệp, Lão Rùa mỗi hiệp một bộ đòn như 3 pha cũ.
3. Bỏ tim: HP hero = tim × 40 (120, Thạch Lão 200). Perk "tha một lần" thành tha một lần bụp trước khi gáy. Thua cửa thì chơi lại, không giới hạn.
4. Chỉ số: tổng thời gian KO (ms, càng thấp càng tốt). Hạng theo `RANKS_KO` 20/30/45/70 giây. Lịch sử ms cũ được xóa lần đầu ghi KO (`save.hitsMode`).
5. Tuyệt chiêu: thuần một ngón, giữ 1,5 giây khi thanh Bá Khí đầy. Thả trước đó là đòn nặng.
