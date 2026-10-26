# ADR-003: Bộ hình theo lối Stardew, sinh bằng AI, tải như tài sản PNG

**Status:** Accepted (Owner chốt 2026-10-26)
**Date:** 2026-10-26
**Feature:** portal-launch-sprint (đợt 2)
**Author:** 10x-Team (Architect + Staff Engineer), Owner quyết

## Context
Đánh giá 12 trụ cột (reviews/2026-10-25) chấm hình ảnh 5/10, chuyển động 5/10. Owner xem mẫu 32 px vẽ bằng mã và so với ảnh Stardew Valley, kết luận mã sinh hình khối không đạt chuẩn game nổi tiếng. Thử nghiệm sinh hình bằng AI qua Canva (chân dung, nhân vật trong trận, nền làng tre) đạt khoảng 80 đến 90% mức tham chiếu trong 20 phút, không tốn tiền. Owner chốt hướng này và gộp vào đợt 2.

Ràng buộc hiện tại: game là một file HTML, sprite là chuỗi ký tự, không tải tài sản ngoài (chỉ font Google). Cổng game (CrazyGames, Poki) chấp nhận tài sản, nhưng yêu cầu tải nhanh và không script inline.

## Decision
1. **Nguồn hình**: sinh bằng AI (Canva generate-image) theo một bộ prompt chuẩn (style guide) cho ba lớp: chân dung hội thoại 1:1, nhân vật trong trận toàn thân trên nền xanh phẳng để tách, nền sân đấu dọc 9:16. Mỗi nhân vật có 1 chân dung và 3 tư thế (đứng, ra đòn, dính đòn); chuyển tiếp dùng co giãn bằng mã như hiện nay.
2. **Lưu trữ**: PNG trong `public/img/` (và `public-portal/img/`), tên theo khóa nhân vật: `img/p/<key>.png` (chân dung 256²), `img/s/<key>-<pose>.png` (sprite, cao 192 px, nền trong suốt), `img/bg/<world>.png` (nền dọc 540×960). Tổng mục tiêu dưới 3 MB sau nén (pngquant hoặc oxipng).
3. **Tải**: `src/assets.js` tải trước theo nhu cầu: màn chính tải 1 nền + hero hiện tại; vào cửa tải nền vùng + đối thủ của cửa; hiện thanh tiến trình nhỏ nếu quá 300 ms. Lỗi tải một ảnh không chặn trận: hàm vẽ rơi về sprite ký tự cũ (giữ `src/sprites.js` làm dự phòng).
4. **Vẽ**: `drawActor` nhận ảnh thay vì lưới ký tự; giữ nguyên pipeline co giãn, lật, đổi màu bằng canvas filter cho biến thể (`v` palette swap chuyển thành hue-rotate hoặc lớp phủ màu).
5. **Giao diện**: khung gỗ kiểu Stardew cho HUD, hộp thoại có chân dung, màn kết quả; vẽ bằng CSS và canvas, không ảnh.
6. **Bản quyền**: ảnh sinh từ Canva dùng theo điều khoản nội dung AI của Canva; ghi nguồn trong `docs/credits.md`; kiểm lại điều khoản thương mại trước khi nộp cổng.

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|---|---|---|---|
| Giữ sprite ký tự, vẽ lại 32 px bằng mã | Không tài sản, không bản quyền | Trần chất lượng thấp, Owner đã xem và loại | Không đạt chuẩn |
| Thuê họa sĩ pixel | Chất lượng và đồng nhất cao nhất | 1.000 đến 2.000 đô la, 2 đến 3 tuần, lệch lịch nộp cổng | Chi phí và thời gian |
| Mua gói tài sản itch.io | Rẻ, nhanh cho nền | Không có nhân vật riêng của game | Dùng bổ sung nếu AI thiếu nền |
| Sinh hình bằng AI rồi nhúng base64 vào HTML | Vẫn một file | 3 MB base64 làm HTML nặng và chậm parse | Tải PNG riêng tốt hơn |

## Consequences
### Positive
- Mức hình ảnh nhảy từ 5/10 lên ước 8/10, đủ cho ảnh listing và trailer.
- Chân dung hội thoại cho phép kể chuyện bằng mặt, không chỉ bằng chữ.
### Negative
- Mất tính "một file"; build và deploy phải chép thư mục img; cache phải đặt đúng.
- AI không đảm bảo đồng nhất tuyệt đối giữa chân dung, sprite và các tư thế; cần vòng chọn lọc tay.
- Biến thể đổi màu (`v`) cần làm lại bằng filter, có thể kém tinh tế hơn.
### Risks
- Mạng phiên hiện chặn tải từ Canva: cần Owner mở `media.canva.com` và `www.canva.com` trong chính sách mạng của môi trường, hoặc tải tay. Giảm rủi ro: sinh trước, tải sau; pipeline dựng từ thư mục `img-src/`.
- Hạn mức sinh hình của Canva: sinh theo lô, ghi media id vào `docs/art-manifest.json` để tải lại được.
- Kích thước: kiểm soát bằng ngân sách 3 MB và nén.

## Dependencies
- ADR-002 (bản cổng) phải chép `img/` vào `public-portal/`.
- Tests: p-series dùng hook, không phụ thuộc ảnh; thêm test tải lỗi rơi về sprite cũ.
