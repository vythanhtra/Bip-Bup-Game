# ADR-011: Cảnh địa danh dùng mô hình 3D chuyên nghiệp (glTF), thay cho cảnh dựng bằng mã

- **Trạng thái:** Không chọn. Ngày 2026-11-11, Owner trả lời "bạn cứ tự xây theo phương án hiện tại đã làm đi".
  - ADR-010 giữ nguyên: cảnh dựng bằng mã.
  - Bản yêu cầu đặt hàng `2026-11-10-3d-art-brief.md` giữ lại để tham khảo nếu sau này đặt hàng.
- **Trạng thái trước đó:** Proposed, chờ Owner duyệt ngân sách, phong cách và cách đặt hàng (mục Open questions).
- **Ngày:** 2026-11-10
- **Feature:** real-places-3d
- **Tác giả:** Claude Code (Implementer). Owner quyết.
- **Thay một phần ADR-010:** thay mục 3 của Decision (cảnh dựng bằng mã, low-poly). Các mục 1, 2 và 4–8 của ADR-010 giữ nguyên.
- **Quyết định của Owner (2026-11-10):** "Các cảnh chưa chính xác và chưa chuyên nghiệp, chưa đẹp." Owner chọn hướng mô hình 3D chuyên nghiệp: thuê họa sĩ 3D hoặc mua mô hình có bản quyền.

## Context

Tám cảnh dựng bằng mã (ADR-010 đợt 1) chạy đúng về kỹ thuật:
- nằm trong ngân sách hiệu năng;
- mặt sân khớp với `GY`;
- tự quay về nền 2D khi cần;
- đạt toàn bộ test trong `tests/pl3test.js`.

Nhưng Owner đánh giá các cảnh chưa giống địa danh thật và chưa đạt mức chuyên nghiệp. Dựng bằng các khối hình cơ bản và vân vẽ bằng mã có giới hạn về chất lượng. Không thể đạt độ chính xác kiến trúc như ảnh chụp, cũng không thể có chất liệu tốt như tài sản do họa sĩ làm.

## Decision

1. **Nguồn cảnh:** mỗi địa danh là một file glTF 2.0 nhị phân (`.glb`) do họa sĩ 3D làm, hoặc mua có giấy phép thương mại.
   - Yêu cầu kỹ thuật và mỹ thuật nằm trong `.10x/specs/2026-11-10-3d-art-brief.md`.
   - Owner duyệt từng cảnh bằng mắt trước khi nhận bàn giao.
2. **Ghép vào game:** `src/place3d.js` tải `places/<key>.glb` bằng `GLTFLoader` của three.js.
   - Lưới nén bằng meshopt; vân nén bằng KTX2. Bộ giải nén cố định phiên bản trong `vendor/`.
   - Camera lấy từ các node đặt tên sẵn trong file: `cam_fight` và `cam_intro_1..n`.
   - Mặt sân lấy từ node `ground_fight`.
   - Các phần còn lại giữ nguyên như ADR-010: canvas WebGL nằm dưới game 2D, khớp `GY`, kéo để xoay, rơi về 2D, công tắc `?places=1`.
3. **Ngân sách mỗi cảnh:**

   | | Trên điện thoại | Trên máy tính |
   |---|---|---|
   | Tam giác (bản tải) | tối đa 80.000 | tối đa 150.000 |
   | File `.glb` | tối đa 4 MB | tối đa 8 MB |
   | Lần gọi vẽ | tối đa 60 | tối đa 60 |
   | Vân | tối đa 2048 px | tối đa 2048 px |
   | Ánh sáng | nướng sẵn (lightmap / AO) | nướng sẵn (lightmap / AO) |

   - Mỗi cảnh cần hai mức chi tiết: bản nhẹ cho điện thoại và bản đầy đủ cho máy tính.
   - Tự quay về 2D vẫn áp dụng như ADR-010 mục 6.
4. **Cảnh dựng bằng mã hiện có** (`src/places/*.js`) chỉ dùng tạm:
   - để thử đường ghép và chạy test khi chưa có mô hình thật;
   - không được bật cho người chơi.

   Khi có file `.glb` của địa danh nào, cảnh đó dùng file `.glb`.
5. **Phong cách (đề xuất, chờ Owner chốt):** 3D vẽ tay, kiểu stylized hand-painted, màu ấm.
   - Phong cách này hợp với nhân vật 2D hiện có, giống các game 2.5D.
   - Không làm kiểu ảnh thật (photoreal), vì sẽ lệch hẳn với nhân vật vẽ tay.
6. **Bản quyền:**
   - Mỗi file phải đi kèm giấy phép cho phép dùng thương mại trong game web và trên cổng game, không giới hạn số lượt chơi.
   - Ghi nguồn trong `docs/credits.md`.
   - Không dùng mô hình chỉ cho dùng cá nhân hoặc biên tập (editorial-only).

## Alternatives Considered

| Phương án | Ưu | Nhược | Vì sao không chọn |
|---|---|---|---|
| Tiếp tục dựng bằng mã, theo ảnh tham chiếu | Không tốn tiền, nhẹ | Giới hạn chất lượng; Owner đã đánh giá là chưa đẹp | Owner không chọn |
| Sinh 3D bằng AI từ ảnh (Meshy, Tripo…) | Nhanh, rẻ | Chất lượng không đều, lưới bẩn, khó giữ chung một phong cách | Có thể dùng để phác thảo cho họa sĩ |
| Tranh vẽ 2.5D nhiều lớp | Đẹp, đúng phong cách, nhanh | Không xoay được 360° | Owner chọn 3D thật |
| Ảnh vệ tinh 3D (Google Photorealistic 3D Tiles) | Rất giống thật | Điều khoản không cho dùng làm cảnh game, cần mạng, nặng | Vướng điều khoản |

## Consequences

### Positive
- Cảnh đạt mức chuyên nghiệp và giống địa danh. Ảnh listing và trailer có điểm nhấn văn hóa Việt.
- Lớp 3D, cơ chế rơi về 2D và test đã có đều dùng lại được.

### Negative
- Tốn chi phí và thời gian đặt hàng. Owner chốt ngân sách.
- File nặng hơn nhiều so với cảnh dựng bằng mã (vài MB thay vì vài KB), nên phải tải theo từng cửa và có màn chờ.
- Phụ thuộc người làm bên ngoài, nên cần nghiệm thu từng cảnh.

### Risks
- **Hiệu năng trên điện thoại:**
  - Bắt buộc có bản nhẹ cho điện thoại.
  - Đo trên máy thật trước khi bật cho người chơi.
  - Rơi về 2D vẫn hoạt động.
- **Bản quyền mô hình mua sẵn:** kiểm giấy phép từng file trước khi nhận.
- **Độ chính xác văn hóa:**
  - Họa sĩ làm theo ảnh tham chiếu đã kiểm nguồn.
  - Không dựng trận đấu trong chùa, đền, lăng.
  - Cửa 8 là sân đình chung chung.

## Open questions (Owner)
1. **Ngân sách và cách đặt hàng:** thuê họa sĩ, mua mô hình sẵn, hay kết hợp cả hai.
2. **Phong cách:** stylized hand-painted (đề xuất) hay cách khác.
3. **Ảnh tham chiếu:** Owner có ảnh tự chụp các địa danh không. Ảnh tự chụp thì không vướng bản quyền ảnh.
4. **Thứ tự:** làm cửa 1 trước để duyệt phong cách, rồi mới đặt cửa 2–8.
