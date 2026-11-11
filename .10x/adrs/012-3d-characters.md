# ADR-012: Nhân vật 3D dựng bằng mã, chạy trên lớp cảnh 3D

- **Trạng thái:** Proposed, chờ Owner duyệt (xem mục Open questions).
- **Ngày:** 2026-11-11
- **Feature:** real-places-3d
- **Tác giả:** Claude Code (Implementer). Owner quyết.
- **Yêu cầu của Owner (2026-11-11):** "xây dựng nhân vật 3D luôn theo cách họ làm". "Cách họ làm" là cách của game "The Clockmaker's Heart" Owner gửi: dựng hoàn toàn bằng mã trên three.js, vật liệu vật lý, shader riêng, hậu kỳ kiểu điện ảnh.
- **Liên quan ADR-010:** ADR-010 mục 1 định nhân vật giữ 2D. ADR này đổi điểm đó, chỉ khi bật công tắc riêng.

## Context

Mỗi nhân vật hiện là một bộ hình vẽ 2D theo tư thế: đứng, đi, đánh, dính đòn, chặn, ngã, tuyệt chiêu. Trận đấu mô phỏng trên mặt phẳng 2D: mỗi nhân vật có `x`, `y`, trạng thái `st`, đòn `atk` và các pha su/ac/re. Lớp 2D vẽ nhân vật lên trên cảnh 3D.

Game có 19 nhân vật: 4 anh hùng và 15 đối thủ, chưa tính trùm. Mỗi nhân vật cần khoảng 8–12 tư thế hoặc hoạt ảnh.

## Decision (đề xuất)

1. **Mô phỏng không đổi.** Trận đấu, hitbox, AI và luật vẫn chạy trên dữ liệu 2D hiện có. Nhân vật 3D chỉ là cách vẽ khác của cùng trạng thái đó.

   Như vậy cơ chế chiến đấu không đổi, đúng giới hạn phạm vi thường trực của Owner.
2. **Lớp vẽ.** `src/actor3d.js` dựng mỗi nhân vật thành một bộ khung gồm hông, thân, đầu, hai tay, hai chân. Thân thể ghép từ khối cong, lathe, ống. Vật liệu vật lý có độ nhám, bóng khuất và ánh vải.

   Nhân vật đặt trên mặt sân ở `z = groundZ`. Tọa độ `x` lấy từ `x` của mô phỏng, quy đổi theo đơn vị SC.
3. **Hoạt ảnh bằng mã.** Mỗi trạng thái (`idle`, `walk`, `atk` theo pha su/ac/re, `hurt`, `block`, `down`, `jump`, `super`) là một hàm tư thế: góc khớp theo thời gian. Giữa hai trạng thái có pha trộn ngắn.

   Đòn riêng của từng nhân vật (ADR-008, ADR-009) dùng lại tên đòn để chọn tư thế.
4. **Lớp 2D.** Khi nhân vật 3D sẵn sàng, `drawActor` không vẽ hình 2D của nhân vật đó. Các phần sau vẫn ở lớp 2D:
   - chữ báo đòn, hiệu ứng trúng đòn;
   - HUD, Gà Bíp, bóng thoại.
5. **Công tắc và rơi về 2D.** Chỉ bật khi có `?chars3d=1` cùng `?places=1`. Nhân vật nào chưa có bản 3D thì vẫn vẽ 2D.

   Nếu lỗi hoặc máy chậm, quay về hình 2D như ADR-010 mục 6.
6. **Làm theo đợt.**
   - Đợt thử: Tí Bụp và Lính Cỏ ở cửa 1.
   - Owner duyệt hình dáng, chuyển động và độ đọc đòn.
   - Sau đó làm 17 nhân vật còn lại.

## Alternatives Considered

| Phương án | Ưu | Nhược |
|---|---|---|
| Giữ nhân vật 2D trên cảnh 3D (hiện tại) | Đã có, rẻ, đúng nét vẽ tay | Không đồng bộ phong cách với cảnh 3D |
| Mô hình 3D có khung xương làm trong Blender, tải glTF | Đẹp, chuyển động tự nhiên | Cần họa sĩ hoặc mua; Owner đã chọn không đặt hàng (ADR-011) |
| Sinh 3D bằng AI từ hình 2D hiện có | Giữ nhận diện nhân vật | Không có công cụ kết nối trong phiên; lưới và khung xương cần làm sạch |

## Consequences

- **Tốt:**
  - Cảnh và nhân vật cùng một thế giới 3D, có ánh sáng và bóng thật.
  - Có thể quay camera quanh trận đấu ở cảnh mở màn và màn thắng.
- **Xấu:**
  - Khối lượng lớn: 19 nhân vật, mỗi nhân vật khoảng 10 hoạt ảnh.
  - Nhân vật dựng bằng mã sẽ đơn giản hơn tranh vẽ hiện có. Nguy cơ mất nét duyên của hình 2D mà Owner đã duyệt.
  - Đòn đánh phải đọc được trong 0,2–0,6 giây. Tư thế 3D phải rõ ràng như hình 2D.
- **Rủi ro:**
  - Hiệu năng trên điện thoại: thêm 2–3 nhân vật, mỗi nhân vật khoảng 3.000–6.000 tam giác.
  - Trùng giờ với các việc khác của ADR-010.

## Open questions (Owner)

1. **Phong cách:**
   - (a) Hoạt hình chibi đầu to giống hình 2D hiện có, kiểu vẽ toon. Tôi đề xuất (a).
   - (b) Tỷ lệ thật, vật liệu vật lý như game đồng hồ.
2. **Đợt thử:** Tí Bụp và Lính Cỏ ở cửa 1 có được không?
3. **Màn hình 2D:** khi chơi bản 3D, chân dung hội thoại và ảnh trên bản đồ vẫn dùng tranh 2D có được không?
