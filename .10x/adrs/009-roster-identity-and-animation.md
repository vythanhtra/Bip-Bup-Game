# ADR-009: 19 nhân vật, 19 lối đánh và hoạt ảnh nhận diện được

- **Trạng thái:** Proposed. Owner đã chốt Q1–Q5 ngày 2026-10-31 (bên dưới); chưa ghi duyệt toàn văn ADR.
- **Quyết định của Owner (2026-10-31):**
  - Q1: hoạt ảnh sinh khung chính bằng AI (phương án a).
  - Q2: có luật chung chống đấm bừa.
  - Q3: hai cửa mẫu là cửa 6 và cửa 8.
  - Q4: Owner giao Implementer chọn. Chọn đổi chỗ chiêu Thạch Lão như đặc tả mục 2.2; giữ chữ "Dỗi" trong câu thoại.
  - Q5: sửa ngay chỗ Lính Đèn Lồng.
  - Q6 (nhánh): Owner chưa trả lời. Implementer chọn tách nhánh `claude/foes-proto` từ 58b7076.
- **Ngày:** 2026-10-31
- **Feature:** roster-identity
- **Tác giả:** Claude Code (Implementer)
- **Nguồn yêu cầu:** tài liệu của Owner "Đề xuất xây dựng 4 nhân vật thành 4 trường phái chiến đấu thực sự khác nhau" (gửi 2026-10-31), kèm nhận xét "các đối thủ không có lối đánh khác nhau, game khá nhàm chán".
- **Đặc tả chi tiết:** `.10x/specs/2026-10-31-roster-identity-spec.md`
- **Cơ sở đối chiếu:**
  - `main` ở **4111ad7**. Blob `src/world.js` là `f6329c5`, khớp blob tài liệu của Owner trích.
  - Nhánh `claude/hero-kits-proto` ở **58b7076** (bản thử ADR-008). Mọi số dòng dưới đây tính tại 58b7076.
- **Quan hệ với ADR khác:**
  - Mở rộng ADR-008 (cơ chế 4 nhân vật chính) sang bộ đòn và hoạt ảnh.
  - Dựa trên ADR-003 (hình sinh bằng AI) và ADR-005 (engine đánh nhau).

## Bối cảnh

### 1. Đối thủ chung một bộ não (CONFIRMED)

**Một hàm AI cho cả 15 đối thủ.** `aiStep` (`src/game.html:882`) quyết định đi, chặn, nhảy và ra đòn cho mọi đối thủ.

**Tính cách AI chỉ theo vùng.** `aiProfile` (`:805`) tính tốc độ, độ hung hăng, tỷ lệ chặn và nhảy, tốc độ báo đòn, sát thương chỉ từ hai thứ: số vùng `w` và cờ trùm. Hai đối thủ cùng vùng (Lính Cỏ và Trâu Lười, Vịt Giả Gà và Lính Đèn Lồng…) di chuyển, áp sát và chặn giống hệt nhau.

**Bộ chiêu riêng chỉ khác ở thứ tự đòn.** `MOVES` (`src/world.js:103-136`) là di sản của engine phản xạ cũ: mỗi bước là một hướng `L/R/U/?`. `aiAttack` (`:917-923`) đổi hướng thành cùng một nhóm đòn chung (`lt`, `hv`, `fin`, `grab`, nhảy, `sp`) trong bảng `ATK` (`:789-799`). Khác biệt còn lại chỉ là thứ tự đòn, hệ số báo đòn `tel` và câu hô.

**Chiêu riêng hiếm khi xuất hiện.** `SUPERS` (`src/world.js:321-339`) chỉ dùng khi Bá Khí đầy 100 % (`:899`).

### 2. Đấm bừa luôn thắng (CONFIRMED bằng bot, 2026-10-28)

- `tools/kitbot.js`, 30 trận mỗi ô: lối đấm bừa thắng 30/30 ở cửa 12 và cửa 16 (trùm) với cả bốn nhân vật, kể cả khi tắt bộ kỹ năng.
- Lấy mẫu từng khung hình: khi bị đấm liên tục, trùm cửa 16 nằm trong trạng thái trúng đòn hoặc ngã khoảng 50 % thời gian, chỉ ra đòn 11–13 % thời gian. Kết quả ghi ở đặc tả ADR-008, mục 8.

### 3. Hình ảnh: dáng riêng có, chuyển động riêng chưa có (CONFIRMED)

Đếm theo `public/img/s/`:

| Nhóm | Tư thế đang có | Ghi chú |
|---|---|---|
| Tí Bụp | 8: đứng, đi, nhảy, đánh, chặn, trúng đòn, ngã, tuyệt chiêu | |
| Hỏa Yến, Băng Nhi, Thạch Lão | 6: thiếu đi, nhảy | |
| 15 đối thủ | 4: đứng, đánh, trúng đòn, và ngã hoặc chặn | |

- Mỗi tư thế là **một khung hình**. Mọi đòn của một nhân vật dùng chung một hình "đánh". Engine tạo cảm giác chuyển động bằng co giãn, nghiêng và trượt hình (`drawFighters`, `:1095`).
- Dáng đứng của 19 nhân vật đã khác nhau rõ: kiểm bằng bảng ghép hình, bóng nhân vật phân biệt được.
- **Lính Đèn Lồng** đã có bộ hình riêng `linhdem-*.png` (commit 9370d0e). Nhưng `ENEMIES.linhdem` vẫn trỏ `spr: 'linhco'` kèm bảng đổi màu (`src/world.js:29`), nên trong game nó hiện là Lính Cỏ đổi màu.

## Quyết định (đề xuất)

**1. Tách hai bài toán, như tài liệu của Owner:**
- 4 nhân vật chính có **bộ võ**: cơ chế (ADR-008), bộ đòn 4 đòn + chiêu đặc biệt + tuyệt chiêu, và hoạt ảnh riêng.
- 15 đối thủ có **bộ hành vi**: hồ sơ AI riêng, 3 chiêu có tư thế báo trước riêng, một cách khắc chế riêng.
- 5 trùm thêm pha chiến đấu và hoạt ảnh pha.

**2. Hồ sơ AI theo từng đối thủ thay cho theo vùng.**
- Mỗi đối thủ khai báo `ai` trong dữ liệu:
  - khoảng cách ưa thích
  - độ hung hăng, tỷ lệ chặn, tỷ lệ nhảy
  - nhịp tấn công
- `aiProfile` lấy hồ sơ riêng làm gốc. Vùng chỉ còn là hệ số độ khó.
- Bộ chiêu chuyển từ hướng `L/R/U` sang **tên đòn thật** trong một bảng đòn của đối thủ. Mỗi đòn có thời gian chuẩn bị, ra đòn, hồi đòn, tầm, sát thương, và tư thế báo trước.

**3. Engine thêm 11 khối dùng chung (K1–K11 trong đặc tả, mục 4). Ngoài hồ sơ AI và đòn theo tên dùng cho mọi đối thủ, các khối cơ chế là:**

| Khối | Phục vụ |
|---|---|
| Đạn bay | Người Tuyết (gió lạnh), Băng Vương (bão tuyết), Khỉ Lửa (chuối), Hỏa Long (lửa), Băng Nhi (Hàn Phong) |
| Lao dài | Trâu Lười (Húc Đại Địa), Anh Hai (Chốt Đơn), Thiên Binh (Tỉnh Rồi), Cánh Cụt (Đầu Lân Húc) |
| Đòn không bị ngắt | Anh Hai (Hàng Xịn), Lý Trưởng (gồng phản công), Trâu Lười (húc khi tỉnh), Thạch Lão (Sơn Kình) |
| Đếm đòn liên tiếp | Lý Trưởng (gồng sau 4 đòn) |
| Trạng thái ngủ hoặc mở thế | Trâu Lười, Thiên Binh |
| Vùng trên sàn | Băng Vương (băng), Gà Nướng (mật ong), Băng Nhi (vệt băng) |
| Nhịp báo trước | Cánh Cụt (trống) |
| Niệm có thể ngắt | Gà Nướng (hồi máu), Người Tuyết (hít hơi) |
| Nhảy qua đầu | Khỉ Lửa, Tiên Nữ |

Chi tiết và mức thay đổi trong đặc tả, mục 4.

**4. Luật chống đấm bừa thuộc từng đối thủ, không phải một luật chung.**
- Theo tài liệu của Owner, mỗi đối thủ có cách khắc chế riêng. Lý Trưởng gồng lên phản công sau 4 đòn liên tiếp; Anh Hai có đòn không bị ngắt.
- Có thêm một giới hạn chung chống khóa vô hạn hay không là **câu hỏi mở cho Owner** (đặc tả, mục 9).

**5. Chuẩn hoạt ảnh: 12 nhóm cho cả 19 nhân vật, theo tài liệu của Owner.**
- Mỗi nhóm khai báo: số khung, khung nào là chuẩn bị, ra đòn, hồi đòn, và hộp va chạm.
- Engine chuyển từ "1 hình mỗi tư thế" sang "dải khung theo từng pha của đòn". Pha khớp với `su/ac/re` sẵn có, để hình không bao giờ lệch khỏi thời điểm gây sát thương.
- Hình hiện có vẫn chạy nếu chưa có dải khung: dùng 1 khung như bây giờ.

**6. Triển khai sau công tắc, thử trên 2 cửa mẫu, đo bằng bot rồi mới mở rộng.**
- Công tắc dự kiến: `?foes=1`.
- Đề xuất 2 cửa mẫu: cửa 6 (Trâu Lười) và cửa 8 (Lý Trưởng, trùm 1). Lý do trong đặc tả, mục 7.

## Phương án đã cân nhắc

| Phương án | Ưu | Nhược | Vì sao không chọn |
|---|---|---|---|
| A. Chỉ tăng chỉ số theo đối thủ (máu, sát thương, tốc độ) | Nhanh, ít rủi ro | Vẫn một lối đánh thắng tất cả; Owner đã loại ("không chỉ thay sát thương") | Không giải quyết vấn đề |
| B. Một luật chung chống đấm bừa, giữ AI chung | Nhỏ, đo nhanh | Đối thủ vẫn giống nhau, chỉ khó hơn | Thiếu bản sắc; có thể thêm sau như lưới an toàn |
| C. Viết AI riêng hoàn toàn cho từng đối thủ | Tự do tối đa | 15 bộ não khó cân bằng, khó test, trùng mã | Chi phí bảo trì cao |
| **D. Hồ sơ AI dữ liệu hóa + khối engine dùng chung + đòn riêng** | Khác biệt thật, mỗi khối test được riêng, thêm đối thủ bằng dữ liệu | Cần làm lại bảng `MOVES`, thêm 11 khối engine | **Chọn** |
| Hoạt ảnh: vẽ tay sprite sheet cho 19 nhân vật | Mượt, đồng nhất nhất | Tốn thời gian và chi phí nhất | Owner quyết (câu hỏi mở) |
| Hoạt ảnh: sinh khung chính bằng AI + nội suy bằng engine | Nhanh, đúng ADR-003 | Khó giữ đồng nhất giữa nhiều khung | Đề xuất cho bản thử |

## Hệ quả

### Tích cực
- Mỗi cửa đòi một cách đánh khác. Lối đấm bừa bị chặn ở những đối thủ được thiết kế để trị nó.
- Thêm hoặc chỉnh đối thủ phần lớn bằng dữ liệu trong `src/world.js`.
- Bot đã có (`tools/kitbot.js`) đo được ngay từng đối thủ.

### Tiêu cực
- **Khối lượng hình lớn.** Đủ chuẩn 12 nhóm cho 19 nhân vật là 257 nhóm hoạt ảnh; đã có 85, thiếu 172 (đặc tả, mục 6).
- **Bảng `MOVES` cũ phải viết lại**, kéo theo bản dịch câu hô tiếng Anh và tiếng Trung (`MOVE_CALLS`, `src/i18n.js:153`) và engine phản xạ cũ (`src/game.html:586`). Không test nào đọc `MOVES` trực tiếp.
- **Độ khó tăng.** Cần đo lại tỷ lệ qua cửa lần đầu bằng số liệu `f1/f2` sau khi phát hành.

### Rủi ro và cách giảm
- **Hình sinh bằng AI lệch nhau giữa các khung.** Cách giảm: thử 1 nhân vật trước, chấm theo 8 tiêu chí kỹ thuật của Owner; không đạt thì đổi phương án sản xuất.
- **Cân bằng sai làm game quá khó.** Cách giảm: mọi con số là giả thuyết, có bot và công tắc; trẻ em là người chơi chính nên giữ báo đòn rõ.
- **Hiệu năng trên điện thoại khi thêm dải khung.** Cách giảm: gom hình thành sprite sheet theo nhân vật, đo thời gian khung như p4test.

## Phụ thuộc
- ADR-008: bản thử bộ kỹ năng 4 nhân vật đang ở nhánh `claude/hero-kits-proto`, chưa gộp `main`.
- ADR-003: phương án sinh hình.
- ADR-006: đồng hồ game `gnow()`. Mọi thời gian của khối mới phải dùng đồng hồ này.
