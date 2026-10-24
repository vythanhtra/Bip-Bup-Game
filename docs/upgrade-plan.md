# Nâng cấp "Ngày thứ 7": kế hoạch và kết quả sprint 1

Mục tiêu: biến BÁ KHÍ từ "đồ chơi 10 phút" thành game người ta quay lại mỗi ngày. Xuất phát từ bản đánh giá: ý tưởng và cá tính đạt mức studio lớn, hệ thống giữ chân ở mức game jam.

## Các vai và kết luận

**Producer** — Chọn 6 việc theo tác động ÷ công sức, làm trong một sprint, mỗi việc có test tự động. Hoãn: backend bảng xếp hạng (cần Supabase, dự án hiện đang tạm dừng), hình ảnh độ phân giải cao (đổi toàn bộ pipeline sprite), bản quốc tế.

**Game designer** — Ba lớp giữ chân: (1) lý do quay lại mỗi ngày: Cửa Hằng Ngày cùng seed cho cả thế giới, chuỗi ngày; (2) lý do kéo người khác vào: Đấu Tay Đôi trên một máy, bóng ma trong link thách đấu; (3) lý do đi tiếp sau cửa 20: hai luật mới đảo thói quen đã học. Dạy tín hiệu giả bằng tha thứ một lần thay vì phạt mù.

**Kỹ sư gameplay** — Tất cả cơ chế chạy trong `src/game.html`, Đấu Tay Đôi tách riêng `src/versus.js` để không đụng vòng lặp chính. Cửa Hằng Ngày dùng RNG riêng (mulberry32) chỉ cho quyết định cơ chế, không cho hạt/hiệu ứng, nên mọi thiết bị ra cùng chuỗi mánh dù khung hình khác nhau.

**QA** — Bộ test Playwright trong `tests/`: p2/p3/p4/phold (hồi quy cũ), p6test (hằng ngày, luật ngược, đếm gáy, dạy tín hiệu giả, bóng ma, link thách hằng ngày), vstest (trận đấu tay đôi đầy đủ gồm một hiệp lừa). Phát hiện và sửa một lỗi cũ: hội thoại mở màn với người nói là khóa kẻ thù (ví dụ `linhdem`) làm vỡ khung mặt.

## Đã triển khai

| # | Tính năng | Ở đâu | Ghi chú |
|---|---|---|---|
| 1 | **Cửa Hằng Ngày** | nút trên trang chính, `#d<yyyymmdd>-<ms>` | Cùng cửa, cùng thứ tự mánh cho mọi người trong ngày; lần đầu mới tính; chuỗi ngày; thẻ và link thách riêng; không mở khóa cốt truyện |
| 2 | **Đấu Tay Đôi** | `src/versus.js` | Hai người một điện thoại, nửa trên lật 180°, best-of-5, 25% hiệp lừa, bụp sớm thua hiệp, phím A/L trên máy tính |
| 3 | **Bóng ma thách đấu** | link `#c<cửa>-<ms>` | Đúng thời điểm người thách đã bụp, bóng ma xanh lóe lên kèm "👻 142ms"; HUD ghi mục tiêu |
| 4 | **Luật Ngược** | cửa 14, 15, 30, 31, 38, 39, trùm cuối hiệp 3 | CẠC thì bụp, BÍP thì đứng im; Gà Bíp báo trước mỗi vòng |
| 5 | **Đếm Gáy** | cửa 22, 23, 31, 38, 39, trùm cuối hiệp 3 | Gà gáy 2 hoặc 3 tiếng, bụp sau tiếng cuối; bụp giữa chừng là "ĐẾM SAI" |
| 6 | **Dạy tín hiệu giả** | lần đầu gặp vịt | Cửa sổ giả kéo dài 1.7s, chữ "GIẢ! ĐỨNG IM", cú bụp hụt đầu tiên được tha |
| 7 | **Juice** | mọi trận | Hit-stop crit 120ms, rung theo sát thương, ăn đòn ép hình mạnh hơn |

## Sprint 2 (chưa làm)

- Bảng xếp hạng ms theo ngày (Supabase, tên 3 ký tự). Cần khôi phục dự án Supabase đang tạm dừng.
- Trung bình toàn cầu trên thẻ Cửa Hằng Ngày (cùng backend).
- Sprite độ phân giải cao hơn và hoạt ảnh khung hình cho 4 nhân vật chính.
- Bản tiếng Anh cho 40 đối thủ (hài phải viết lại, không dịch).
