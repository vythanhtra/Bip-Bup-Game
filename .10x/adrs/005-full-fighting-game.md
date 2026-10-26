# ADR-005: Game đối kháng 2D đầy đủ, hai ngón (thay thế lựa chọn C của ADR-004)

**Status:** Accepted (Owner chọn phương án B, 2026-10-26)
**Date:** 2026-10-26
**Feature:** fighting-pivot
**Author:** 10x-Team (Game Director + Architect), Owner quyết
**Supersedes:** quyết định "phương án C" trong ADR-004 (ADR-004 vẫn giữ 4 điểm còn lại: hiệp, HP, chỉ số KO, tuyệt chiêu)

## Context
Owner đã đọc ba phương án và chọn B: đối kháng đầy đủ với di chuyển, chặn, nhảy, liên hoàn nhiều nút, hai ngón, chấp nhận mất bản sắc một tay và chi phí 4–6 tuần, khoảng 150 ảnh. Implementer đã nêu rủi ro (cổng game chơi tay đôi khó, cân bằng) và Owner giữ quyết định.

## Decision
- Sân đấu 2D ngang trên màn dọc: hai đấu sĩ có toạ độ, hướng mặt, trọng lực, pushbox. Vòng tick mô phỏng (`fightStep`) tách khỏi vẽ (`drawFighters`).
- Điều khiển: nút ảo hai cụm (`#pad`): trái ◀ ▶ ▲ ▼, phải 🛡 ✨ 👊 💥; bàn phím mũi tên/WASD + Z X C + Shift/Space. Chạm canvas = 👊 (dự phòng).
- Đòn theo bảng `ATK` (khởi động/trúng/hồi, tầm, sát thương, choáng, đẩy lùi, ngã, lao tới). Liên hoàn 👊👊💥, đá bay khi nhảy, ✨ 50 % = Xung Bá Khí, 100 % = tuyệt chiêu.
- Chặn: giữ 🛡 (hoặc lùi ngay sau khi bị đánh) ăn 15 % sát thương; chặn trong 150 ms trước đòn = ĐỠ CHUẨN, mở 600 ms phản đòn x2.
- Địch: máy trạng thái theo `aiProfile()` (tốc độ, hung hăng, chặn phản xạ, nhảy vào, giả đòn, khởi động dài ở vùng thấp) và bộ đòn `MOVES` (L = nhẹ, R = nặng, U = đá bay, f = giả).
- Hiệp, HP, KO, tỉ số, chỉ số KO, màn kết quả giữ từ ADR-004 đợt 1. Hiệp 60 giây.
- Daily, run, tutorial, versus, prologue cảnh 4 vẫn ở động cơ phản xạ cho tới đợt 3.

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|---|---|---|---|
| C. Một ngón (đã làm đợt 1) | Rẻ, giữ bản sắc | Owner thấy chưa đủ "đối kháng" | Owner chọn B |
| B ngang màn (landscape) | Sân rộng, đúng chuẩn thể loại | Cần 17 nền ngang mới, UI làm lại | Giữ dọc ở đợt này, cân nhắc sau khi chơi thử |

## Consequences
### Positive
- Đúng thể loại: đọc đòn, né, chặn, ép góc, liên hoàn, tuyệt chiêu. Dễ mở rộng cho tay đôi cùng máy.
### Negative
- Hai ngón trên màn dọc: sân hẹp (430 px), nút chiếm 15 % đáy. Cổng game trên máy tính cần bàn phím.
- Cần tư thế mới cho 19 nhân vật: đi, nhảy, chặn, cúi, ngã, chiêu (120–150 ảnh). Đợt này dùng mã co kéo từ 3 tư thế có sẵn.
### Risks
- Cân bằng AI theo vùng: chỉnh trong `aiProfile()` và `ATK`; test `tests/ftest.js` khoá số.
- Độ trễ chạm trên điện thoại yếu: nút dùng pointer capture, không dựa vào click.

## Dependencies
- ADR-003 (ảnh), ADR-004 (hiệp/HP/chỉ số).
