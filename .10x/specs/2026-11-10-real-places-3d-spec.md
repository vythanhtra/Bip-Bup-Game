# Đặc tả: địa danh có thật, cảnh 3D (ADR-010), đợt 1 gồm cửa 1–8

## 1. Mục tiêu

Khi bật `?places=1`, mỗi cửa từ 1 đến 8 diễn ra trong một cảnh 3D low-poly của một địa danh Việt Nam có thật.
- Cảnh mở màn: camera bay quanh địa danh, kèm tên và một câu giới thiệu.
- Trong lúc đánh: camera đứng ở góc nhìn ngang. Nhân vật 2D đứng trên sân 3D.

Khi tắt công tắc, game giữ nguyên như hiện nay.

## 2. Danh sách địa danh (Owner duyệt 2026-11-10)

| Cửa | Đối thủ | Khóa | Địa danh (vi) | Chi tiết chính trong cảnh |
|---|---|---|---|---|
| 1 | Lính Cỏ | duonglam | Cổng làng Mông Phụ, làng cổ Đường Lâm (Hà Nội) | Cổng làng hai tầng mái, tường đá ong, giếng làng, cây đa, bình minh |
| 2 | Trâu Lười | tamcoc | Tam Cốc (Ninh Bình) | Núi đá vôi, ruộng lúa chín, sông Ngô Đồng, thuyền nan |
| 3 | Lính Cỏ | dongho | Làng tranh Đông Hồ (Bắc Ninh) | Sân phơi tranh (khung tranh gà, lợn), nhà ngói, cây cau |
| 4 | Trâu Lười | mucangchai | Ruộng bậc thang Mù Cang Chải (Lào Cai) | Ruộng bậc thang uốn theo sườn đồi, chòi canh, mây vờn |
| 5 | Lính Cỏ | battrang | Làng gốm Bát Tràng (Hà Nội) | Lò gốm, chum vại xếp hàng, khói lò, bờ sông Hồng |
| 6 | Trâu Lười | doson | Đồ Sơn (Hải Phòng), quê lễ hội chọi trâu | Bãi chọi trâu, cờ hội, khán đài tre, biển phía sau |
| 7 | Lính Cỏ + Trâu | bangioc | Thác Bản Giốc (Cao Bằng) | Thác nhiều tầng, bè tre, núi đá, nước bắn |
| 8 | Lý Trưởng | sandinh | Sân đình làng (không gắn tên đình thật) | Sân gạch, đình mái cong ở xa, cây đa, cột cờ hội |

Câu giới thiệu có ba thứ tiếng, mỗi câu tối đa 60 ký tự, chỉ nêu điều đã kiểm chứng được. Ví dụ cửa 1: "Cổng làng Mông Phụ, tường đá ong cổ".

## 3. Kiến trúc

- `src/places/kit.js` là bộ chi tiết low-poly dùng chung. Mỗi hàm trả về `THREE.Group`, có tham số màu và kích thước:
  - `kit.wall`, `kit.gate`, `kit.roof`, `kit.banyan`, `kit.bamboo`;
  - `kit.paddy`, `kit.terraces`, `kit.karst`, `kit.water`;
  - `kit.kiln`, `kit.jars`, `kit.flags`, `kit.boat`, `kit.falls`, `kit.sky`.
- `src/places/<khóa>.js`: hàm `build(THREE, kit)` trả về các thứ sau:
  - `scene`;
  - `ground`: độ cao mặt sân, để khớp với `GY`;
  - `intro`: các điểm camera đi qua, gồm vị trí và điểm nhìn;
  - `fight`: vị trí và điểm nhìn của camera khi đánh.
- `src/place3d.js` là phần nối với game:
  - tải `vendor/three.module.min.js`, cố định phiên bản;
  - tạo canvas WebGL `#scene3d` nằm dưới `#game`;
  - đồng bộ kích thước khung và khớp mặt đất với `GY`;
  - điều khiển camera theo `B.state` (`cine` → bay quanh, `fight` → cố định, có trôi nhẹ theo Tí);
  - cho kéo để xoay ở cảnh mở màn và lúc tạm dừng;
  - đo thời gian khung hình và rơi về 2D khi cần;
  - cung cấp `PLACE3D.on()`, `PLACE3D.ready()`, `PLACE3D.fallback(reason)`.
- `src/game.html`:
  - Khi `PLACE3D.on()` và cảnh đã sẵn sàng, `drawBgImage` không vẽ nền. Canvas 2D được xóa trong suốt.
  - Cảnh mở màn dùng `T('placeName')` và `T('placeSub')` thay cho tên vùng.
  - Mọi chỗ khác giữ nguyên.
- `build.js`: chép `src/places/` và `vendor/` cho bản hình vẽ. Bản cổng game không bật trong đợt 1.

## 4. Ngân sách và rơi về 2D

Ngân sách cho mỗi cảnh:
- tối đa 30.000 tam giác, tối đa 40 lần gọi vẽ;
- cảnh nặng không quá 15 KB sau nén, chưa tính three.js;
- 1 đèn đổ bóng trên máy tính, không đổ bóng trên điện thoại;
- `pixelRatio` tối đa 1,5;
- khi đang đánh mà camera không trôi thì không vẽ lại khung 3D.

Game rơi về nền 2D của vùng khi:
- không có WebGL;
- tải gói three.js hoặc cảnh bị lỗi;
- thời gian vẽ trung bình quá 22 ms một khung trong 3 giây, đo khi đang đánh.

Sau khi rơi về 2D:
- game ghi sự kiện thống kê `p3d_fallback` kèm lý do;
- không quay lại 3D trong lượt chơi đó.

## 5. Nghiệm thu (đợt 1)

| # | Tiêu chí | Cách kiểm |
|---|---|---|
| P1 | Tắt công tắc: không tải `vendor/three*` hay `places/*`; nền và chữ cửa 1–8 giống hệt hiện nay | Test bắt request mạng, so khóa nền và chữ |
| P2 | Bật công tắc: cửa n dựng đúng cảnh của `PLACES[n].key`; mặt sân trùng `GY` (sai lệch ≤ 2 px) | Test kiểm khóa cảnh, chiếu điểm mặt sân lên màn hình |
| P3 | Cảnh mở màn ghi "Cửa n · <địa danh>" và câu giới thiệu đúng ở vi, en và zh | Test chữ ở 3 ngôn ngữ |
| P4 | Trong lúc đánh không xoay được cảnh. Ở cảnh mở màn và lúc tạm dừng thì kéo để xoay được | Test mô phỏng thao tác kéo |
| P5 | Không có WebGL hoặc cảnh tải lỗi: game rơi về nền 2D, không có lỗi JavaScript | Test chặn tải hoặc tắt WebGL |
| P6 | Ngân sách: máy tính tối đa 100 lần vẽ và 120.000 tam giác; điện thoại tối đa 40 lần vẽ và 30.000 tam giác (Owner duyệt 2026-11-11). Tính cả lượt vẽ bóng, không tính hậu kỳ | Test đọc `renderer.info` |
| P7 | Cơ chế chiến đấu không đổi: các bộ `fo*`, `k1`, `f*` vẫn đạt khi có `?places=1` | Chạy lại các bộ này |
| P8 | Mỗi địa danh có nguồn xác minh tên và tỉnh sau sáp nhập 2025 | Bảng nguồn ở mục 7 |
| P9 | Owner duyệt bằng mắt 8 cảnh, và thử trên điện thoại thật không giật | Owner nghiệm thu |

## 6. Ngoài phạm vi đợt 1

- Cửa 9–40.
- Địa danh thế giới.
- Bản cổng game.
- Mô hình 3D cho nhân vật.
- Thay đổi cơ chế chiến đấu.

## 7. Nguồn xác minh

Sẽ bổ sung khi làm từng cảnh. Đã có:
- Mù Cang Chải thuộc tỉnh Lào Cai sau Nghị quyết 202/2025/QH15: theo vietnamtourism.com và thuvienphapluat.vn.
- Làng cổ Đường Lâm và làng Mông Phụ: theo Wikipedia.
- Đông Hồ, Bát Tràng: theo Wikipedia. Tên đơn vị hành chính sau sáp nhập cần kiểm lại.
- Cổng Mông Phụ kiểu "thượng gia hạ môn", xây đá ong, khung gỗ, mái ngói ri hoặc ngói mũi hài; đứng cạnh cây đa, ao, giếng, lũy tre: theo sovhtt.hanoi.gov.vn (mô hình cổng do GS. Ejima Akiyoshi phục dựng), nhagotrendoi.vn, duonglamvillage.com. Năm dựng 1553 theo phần lớn nguồn; một số nguồn ghi khác.
- Tam Cốc (sông Ngô Đồng, núi đá vôi, đò chèo): Wikipedia "Tam Cốc – Bích Động".
- Đông Hồ (tranh khắc gỗ in trên giấy dó): Wikipedia "Đông Hồ painting".
- Bát Tràng (làng gốm bên sông Hồng; tường bánh than ở ngõ cổ là chi tiết quen thuộc nhưng chưa có nguồn chính thức, cần Owner xác nhận): Wikipedia "Bát Tràng".
- Đồ Sơn (lễ hội chọi trâu): Wikipedia "Đồ Sơn buffalo fighting festival".
- Thác Bản Giốc trên sông Quây Sơn: Wikipedia "Ban Gioc–Detian Falls".
- Cửa 8 là sân đình chung chung, không gắn tên đình có thật (Owner 2026-11-10).

## 8. Kết quả đợt 1 (2026-11-10)

- Đã có 8 cảnh: `duonglam`, `tamcoc`, `dongho`, `mucangchai`, `battrang`, `doson`, `bangioc`, `sandinh`.
- Cả 8 cảnh đều trong ngân sách sau khi gộp khối: tối đa 40 lần gọi vẽ, 30.000 tam giác.
  - Cửa 1 đo được 37–40 lần gọi vẽ và khoảng 27.000 tam giác.
  - Số đo cửa 2–8 do `tests/pl3test.js` ghi lại.
- Các test của lớp 3D chạy trên WebGL phần mềm (SwiftShader). Thời gian khung hình ở đó không đại diện cho máy thật, nên chỉ kiểm cơ chế rơi về 2D, không đo hiệu năng thật.
- Tiêu chí P9 (Owner xem bằng mắt và thử trên điện thoại thật) chưa làm.

## 9. Bản v3 (2026-11-11)

Owner chọn tiếp tục dựng cảnh bằng mã (không làm theo ADR-011) và đã duyệt ngân sách mới cho máy tính.

Những gì có trong bản v3:
- Bầu trời vật lý (`Sky` của three.js) kèm ánh sáng môi trường lấy từ bầu trời (PMREM).
- Vân nổi (normal map) tạo từ vân màu.
- Tán lá và cỏ dựng bằng các tấm lá có độ trong.
- Mái cong; đình có đầu đao.
- Địa hình tạo bằng nhiễu: núi đá vôi, dãy núi xa, ruộng bậc thang với đường bờ vẽ theo đường đồng mức, thác nhiều dòng.
- Hậu kỳ chỉ bật trên máy tính: GTAO, bloom nhẹ, viền tối.

Các phần mở rộng three.js 0.160.0 nằm trong `vendor/three-addons/`. Chúng được chép nguyên từ gói npm, chỉ sửa đường dẫn import.
