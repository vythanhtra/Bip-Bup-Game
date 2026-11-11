# ADR-010: Mỗi cửa đấu ở một địa danh Việt Nam có thật, dựng thành cảnh 3D

- **Trạng thái:** Accepted. Ngày 2026-11-10, Owner xem bản mẫu v2 và trả lời "Đồng ý với mô hình này".
  - Owner duyệt cách làm: cảnh 3D low-poly dựng bằng mã, nhân vật 2D đứng trên sân 3D.
  - Bản mẫu v2 là chuẩn phong cách cho các cảnh: https://claude.ai/artifact/CjBTHRDbsMopi9yTSEGfWQ
  - Owner nhận xét bản mẫu v1 dựng sai cổng Mông Phụ (hai tầng mái kiểu chùa). Bản v2 dựng lại đúng kiểu "thượng gia hạ môn".
- **Sửa ngân sách (Owner duyệt 2026-11-11):** mục 7 đổi thành:
  - Máy tính: tối đa 100 lần vẽ và 120.000 tam giác mỗi khung, tính cả lượt vẽ bóng.
  - Điện thoại: giữ 40 lần vẽ và 30.000 tam giác.

  Lý do: bản cảnh v3 có bầu trời vật lý, vân nổi, tán lá, cỏ và địa hình. Bản đó đo được 23–85 lần vẽ và 23.000–97.000 tam giác trên máy tính. Bản điện thoại tự giảm lá, cỏ và độ mịn địa hình, nên vẫn nằm trong giới hạn cũ.
- **Bị thay một phần:** mục 3 của Decision sẽ do ADR-011 thay. ADR-011 đang ở trạng thái Proposed: cảnh lấy từ mô hình glTF chuyên nghiệp, vì Owner đánh giá ngày 2026-11-10 rằng cảnh dựng bằng mã chưa đẹp và chưa chính xác.
- **Ngày:** 2026-11-10
- **Feature:** real-places-3d
- **Tác giả:** Claude Code (Implementer). Owner quyết.
- **Quyết định của Owner (2026-11-10):**
  - Lấy địa danh ở Việt Nam trước, phần thế giới làm đợt riêng sau.
  - Mỗi cửa có một nền đấu riêng.
  - Làm thử vùng 1 (cửa 1–8) trước.
  - Cửa 8 là một sân đình làng chung chung, không gắn tên đình có thật.
  - Cảnh là 3D thật, xoay được.

## Context

Hiện có 40 cửa chia 5 vùng, mỗi vùng dùng 3 nền tranh 2D (`img/bg`, `img/bgw`, theo ADR-003). Nhân vật và toàn bộ trận đấu được vẽ bằng canvas 2D. Chuyển động chỉ có trục ngang và trục đứng: mặt đất nằm ở `GY`, nhân vật có tọa độ `x` và `y`.

Owner muốn mỗi cửa đi qua một địa danh có thật, và cảnh là 3D thật, xoay được.

Ràng buộc:
- Không đổi cơ chế chiến đấu (giới hạn phạm vi thường trực của Owner).
- Game là trang tĩnh trên Vercel, chạy trên điện thoại phổ thông.
- Owner đã báo bị giật trên bản hình vẽ, nguyên nhân chưa rõ.
- Bản cổng game (ADR-002) yêu cầu tải nhanh.
- Không có tài sản 3D sẵn có cho các địa danh này.

## Decision

1. **Hai lớp canvas.** Thêm một canvas WebGL (three.js) nằm dưới canvas 2D hiện có.
   - Canvas 3D vẽ cảnh địa danh.
   - Canvas 2D vẫn vẽ nhân vật, HUD và hiệu ứng như cũ. Khi có cảnh 3D, canvas 2D bỏ bước vẽ nền, phần còn lại không đổi.
   - Vì vậy logic trận đấu và cách vẽ nhân vật không đổi.
2. **Camera.**
   - Lúc vào cửa (`B.state === 'cine'`): camera bay quanh địa danh, rồi hạ về góc nhìn ngang.
   - Trong lúc đánh: camera cố định ở góc ngang để đòn đánh dễ đọc. Camera chỉ trôi nhẹ theo vị trí của Tí để tạo chiều sâu.
   - Người chơi kéo để xoay cảnh khi đang ở cảnh mở màn hoặc khi tạm dừng. Trong lúc đánh thì khóa xoay.
   - Đường mặt đất của cảnh 3D trùng với `GY`, để nhân vật đứng đúng trên sân.
3. **Cảnh dựng bằng mã, phong cách low-poly.**
   - Mỗi địa danh là một hàm `build(THREE, kit)` trong `src/places/<key>.js`.
   - Các cảnh dùng chung một bộ chi tiết `src/places/kit.js`: tường đá ong, mái ngói, cổng làng, cây đa, khóm tre, ruộng, ruộng bậc thang, núi đá vôi, nước, lò gốm, cờ hội.
   - Không dùng mô hình 3D tải từ ngoài, để tránh vướng bản quyền và giữ dung lượng nhỏ.
4. **Dữ liệu.**
   - Thêm `PLACES[n] = { key, name, sub }` trong `src/world.js`.
   - Tên và câu giới thiệu có đủ tiếng Việt, Anh và Trung trong `src/i18n.js` và `src/lang/`.
   - Cảnh mở màn mỗi cửa ghi "Cửa n · <địa danh>" kèm câu giới thiệu.
5. **Công tắc và tải.**
   - Chỉ bật khi có `?places=1` và đang ở bản hình vẽ.
   - Gói three.js (cố định phiên bản, đặt trong `public/vendor/`) và cảnh của cửa chỉ được tải khi bật công tắc.
   - Khi tắt công tắc, game không tải thêm byte nào và vẽ y như hiện nay.
6. **Rơi về bản 2D.** Game quay về nền 2D của vùng khi xảy ra một trong các trường hợp:
   - máy không có WebGL;
   - tải gói hoặc cảnh bị lỗi;
   - thời gian vẽ trung bình quá 22 ms một khung trong 3 giây, đo khi đang đánh.

   Khi đã rơi về 2D trong một lượt chơi thì không quay lại 3D nữa. `?art=0` vẫn mở bản pixel.
7. **Ngân sách hiệu năng cho mỗi cảnh:**
   - tối đa 30.000 tam giác;
   - 1 đèn có đổ bóng trên máy tính; trên điện thoại tắt đổ bóng;
   - `pixelRatio` tối đa 1,5;
   - khi đang đánh mà camera không trôi thì không vẽ lại khung 3D.

   Nếu người dùng bật `prefers-reduced-motion`, cảnh mở màn bỏ đoạn camera bay quanh.
8. **Làm theo đợt.**
   - Đợt 1: cửa 1–8, vùng Làng Tre, danh sách trong đặc tả.
   - Owner duyệt hình, địa danh và hiệu năng xong mới làm cửa 9–40.
   - Phần địa danh thế giới là một đợt riêng, sẽ có ADR riêng.

## Alternatives Considered

| Phương án | Ưu | Nhược | Vì sao không chọn |
|---|---|---|---|
| Nền tranh 2D vẽ bằng AI cho từng địa danh | Rẻ, khớp phong cách hiện có | Không phải 3D, không xoay được | Owner chọn 3D thật |
| Nền nhiều lớp, các lớp trượt lệch nhau (parallax) | Nhẹ, có cảm giác chiều sâu | Không xoay được | Owner chọn 3D thật |
| Viết lại cả trận đấu trong 3D, nhân vật là mô hình 3D | Đồng nhất hoàn toàn | Đổi cơ chế và cách vẽ, phải làm mô hình cho 19 nhân vật, quá phạm vi | Owner chưa cho đổi cơ chế |
| Mô hình glTF có sẵn (Sketchfab) hoặc sinh 3D bằng AI | Chi tiết hơn | Vướng bản quyền từng mô hình, nặng vài MB, khó giữ chung phong cách | Có thể xét cho từng mô hình về sau nếu Owner muốn |
| Ảnh chụp 360° địa danh thật | Thật nhất | Cần ảnh có giấy phép, nặng, không hợp nhân vật hoạt hình | Lệch phong cách |

## Consequences

### Positive
- Mỗi cửa có một cảnh riêng nhận ra được. Ảnh listing và trailer có điểm nhấn văn hóa Việt.
- Cảnh dựng bằng mã nên nhẹ (vài KB cho mỗi cảnh), không vướng bản quyền ảnh, và chỉnh sửa được.

### Negative
- Thêm một thư viện lớn: three.js khoảng 150 KB sau gzip, chỉ tải khi bật công tắc.
- Phong cách low-poly của cảnh khác lối tranh của nhân vật. Kiểu ghép này giống các game 2.5D, nhưng Owner cần duyệt bằng mắt.
- Dựng 40 cảnh bằng mã tốn công. Bộ chi tiết dùng chung giúp giảm phần việc này.
- Cảnh chỉ gợi đặc trưng của địa danh, không phải bản sao kiến trúc chính xác.

### Risks
- **Hiệu năng trên điện thoại yếu**, trong khi lỗi giật Owner báo vẫn chưa rõ nguyên nhân.
  - Giảm rủi ro: ngân sách ở mục 7; tự rơi về 2D ở mục 6; đo thời gian vẽ khung bằng test.
  - Owner cần thử trên điện thoại thật trước khi bật cho mọi người.
- **Độ nhạy văn hóa:** không dựng trận đấu trong chùa, đền hay lăng. Cửa 8 là sân đình chung chung, không gắn tên đình có thật.
- **Tên hành chính** đã đổi sau đợt sáp nhập tỉnh năm 2025, ví dụ Mù Cang Chải nay thuộc tỉnh Lào Cai. Mỗi tên phải được kiểm lại khi nghiệm thu.
- **Giới hạn của trình duyệt:** WebGL trong một số webview cổng game có thể bị tắt. Khi đó game rơi về 2D theo mục 6.

## Dependencies
- ADR-003: nền 2D vẫn là đường rơi về.
- ADR-002: bản cổng game giữ nguyên trong đợt 1, công tắc không bật ở đó.
- ADR-008 và ADR-009: không đụng tới.
- Test hiện có phải giữ nguyên kết quả khi tắt công tắc. Repo này chưa có bộ Golden Test; các bộ `f*`, `fo*`, `k1`, `p*`, `pro`, `ld`, `lh`, `portal`, `ed`, `art` là bộ hồi quy.
