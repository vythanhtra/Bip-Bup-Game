# ADR-008: Bộ kỹ năng riêng cho 4 nhân vật

- **Trạng thái:** Proposed (chờ Owner duyệt)
- **Ngày:** 2026-10-28
- **Feature:** hero-kits
- **Tác giả:** Claude Code (Implementer)
- **Đặc tả chi tiết:** `.10x/specs/2026-10-28-hero-kits-spec.md`
- **Cơ sở đối chiếu:** nhánh `claude/telemetry-teaching` tại **c5ae809**. Mã game ở commit này giống hệt 8880352, hai commit sau chỉ sửa `docs/analytics.md`.
  - `main` đang ở 432c832, chưa có phần ghi số liệu `f1` và bảng `FIGHT_PLAN` mà ADR này dựa vào.
  - Mọi số dòng dưới đây tính tại c5ae809.

## Bối cảnh

Thẩm định ngày 2026-10-27 (G2-1, G2-2) kết luận bốn nhân vật gần như là một. Đã kiểm lại trên c5ae809 (CONFIRMED).

**1. Chung một bộ đòn.** Cả bốn dùng chung bảng `ATK` (`src/game.html:782-792`): cùng tốc độ đi, tầm, khởi động, sát thương gốc. Khác biệt chỉ ở các điểm sau:

| Khác biệt | Giá trị | Vị trí trong mã |
|---|---|---|
| Máu | `hearts × 40`: 120 / 120 / 120 / 200 | `src/game.html:442` |
| Hệ số đòn | 1,0 / 1,3 / 1,0 / 0,8 | `src/world.js:19-23` |
| Tuyệt chiêu | dồn đòn / đốt / đóng băng 1,5 s / Dỗi 3 s | `src/world.js:310-314` |

**2. Bá Khí và đỡ chuẩn là cơ chế chung.**
- Đánh trúng được +0,6 × sát thương, bị trúng +0,25 × sát thương (`:931`). Chặn được +3, đỡ chuẩn +10 (`:918`).
- Xung tốn 50, tuyệt chiêu tốn 100 (`:858`).
- Đỡ chuẩn trong 150 ms cho phản đòn ×2 trong 600 ms, với cả bốn nhân vật (`:918-920`).

**3. Engine thiếu bốn thứ:**
- **Hồi chiêu:** không có bộ đếm thời gian hồi chiêu.
- **Đòn tầm xa:** không có đạn bay. Mọi đòn xét trúng bằng tầm, hướng mặt và độ cao (`fightStep`).
- **Ngoại lệ cho trùm:** đóng băng áp lên mọi mục tiêu, kể cả trùm (`applyEffect`, `:1090`).
- **AI biết "Dỗi":** AI không kiểm tra trạng thái này (`aiStep`, `:870-902`), trong khi "Dỗi" phản mọi đòn (`:913`).

**4. Cửa hàng là đồ cộng chỉ số, dùng chung** (`SHOP`, `src/world.js:350`; `gearMods`, `src/game.html:411`).
- 5 vũ khí: Đũa cả, Chày giã gạo, Quạt mo, Gậy tre, Nồi cơm.
- 4 áo: Giáp rơm, Áo mưa lá, Áo dài đỏ, Áo tiên.
- Bánh chưng.

**5. Mốc mở nhân vật:** cửa 16 / 24 / 32 (`HEROES.unlock`, `heroUnlocked`, `src/game.html:381`). Lời kết thúc các cửa 16 / 24 / 32 báo việc mở (`WIN_LINES`, `src/world.js:221-226`).

**6. Số liệu:** định dạng `f1` đã ghi nhân vật, nguồn sát thương, tuyệt chiêu (`tlX`, `src/game.html:986`; `docs/analytics.md`).

Owner đã duyệt định hướng (2026-10-28):
- **Bốn vai trò:** liên kích, bùng nổ, khống chế, phòng thủ phản kích.
- **Bốn quyết định:**
  1. Thay 5 vũ khí dùng chung bằng vũ khí riêng (bản thử giữ cửa hàng cũ sau công tắc, không xóa).
  2. Mở nhân vật ở cửa 8 / 16 / 24.
  3. "Dỗi" thành thế phản kích có giới hạn và có cách khắc chế.
  4. Băng Nhi có đòn tầm xa kèm hiệu ứng băng.

## Quyết định

1. **Bộ kỹ năng là dữ liệu cộng một bộ điều phối sự kiện.**
   - **Dữ liệu:** bảng `HERO_KIT` trong `src/world.js` chứa mọi con số; mọi con số là giả thuyết, đánh mã H1…H24 trong đặc tả.
   - **Logic:** gọn trong `src/game.html`, chạy qua một hàm `kitOn(sự_kiện, …)`, được gọi ở 6 điểm cố định của engine:
     - đầu hiệp
     - đòn của Tí trúng
     - đòn của Tí hụt
     - Tí bị trúng
     - Tí chặn hoặc đỡ chuẩn
     - mỗi khung hình
   - **Thay đổi bộ đòn:** đòn riêng ghi trong `HERO_KIT[k].atk` và được ghép vào lúc ra đòn (`startAtk`, `:848`). Không viết lại bảng `ATK` chung.
2. **Mỗi nhân vật chỉ có một thanh tài nguyên trên HUD.**
   - Tí, Băng Nhi và Thạch Lão vẫn dùng thanh Bá Khí.
   - Với Hỏa Yến, thanh đó đổi thành **Nhiệt**: cùng vị trí, khác màu, nhãn và luật nạp.
   - Không thêm thanh thứ hai lên màn hình điện thoại.
3. **Giới hạn kỹ năng bằng giá Bá Khí, không thêm bộ đếm hồi chiêu.**
   - Ngoại lệ duy nhất là **thời gian miễn khống chế**. Đây là luật mới cho toàn engine, áp cho mọi hiệu ứng đóng băng, kể cả tuyệt chiêu cũ:
     - Không cộng dồn.
     - Địch thường miễn 2 s sau khi tan băng.
     - Trùm không bị đóng băng: chỉ bị gián đoạn 0,4 s, sau đó miễn 8 s.
4. **Lối chơi BÍP–BỤP giữ nguyên.**
   - Tiếng BÍP mở mỗi hiệp. Đánh trước BÍP bị mổ, như nhau với cả bốn nhân vật. "Được tha lần bấm sớm" của Băng Nhi bị bỏ vì không phải bản sắc của cô.
   - Trong trận, kỹ năng chỉ thưởng cho việc đọc mũi tên báo đòn, chặn, đỡ chuẩn và đánh trả. Không có kỹ năng nào tự trúng hay tự né.
   - `FIGHT_PLAN`, AI theo vùng và báo đòn của địch không đổi.
   - Chế độ chạy 60 giây (engine phản xạ) không đổi.
5. **Vũ khí riêng theo nhân vật.**
   - Thay 5 vũ khí dùng chung khi công tắc `heroKits` bật. Áo và bánh chưng ở lại.
   - Mỗi bậc nâng cấp **mở thêm một lựa chọn**, không cộng chỉ số.
   - Bản thử chỉ có bậc 1, tức bộ kỹ năng gốc. Các bậc sau đặc tả riêng sau khi đo.
6. **Mở nhân vật ở cửa 8 / 16 / 24.**
   - Đổi `HEROES.unlock` và lời kết thúc các cửa 8 / 16 / 24 ở cả ba thứ tiếng.
   - Trận đầu tiên với nhân vật mới, Gà Bíp giới thiệu bộ kỹ năng qua cơ chế `coach()` đã có.
7. **Số liệu `f2`:** thêm trường thứ 12 tóm tắt bộ kỹ năng.
   - Không quá 120 ký tự.
   - Trường 1–11 giữ nguyên vị trí, nên các truy vấn hiện có vẫn đọc được dòng `f2`.
8. **Bản thử trước, rồi mới mở rộng.**
   - Chỉ chạy khi có công tắc `?kits=1`, chỉ ở bản tranh, kèm nút chọn nhân vật dành cho thử nghiệm.
   - Đo trên cửa 12 (quái thường) và cửa 16 (trùm).
   - Khi tắt công tắc, game chạy y như c5ae809. Có test chứng minh điều này.

## Phương án đã cân nhắc

| Phương án | Ưu | Nhược | Vì sao không chọn |
|---|---|---|---|
| Chỉ chỉnh chỉ số (máu, hệ số đòn, cửa sổ) | ít mã | bốn nhân vật vẫn đánh một kiểu; đúng lỗi G2-2 | không đạt tiêu chí "mỗi người một cách đánh" |
| Viết bốn bảng đòn riêng hoàn toàn | khác biệt tối đa | gấp bốn lượng cân bằng, gấp bốn hình vẽ; phá liên hoàn chung đã dạy ở màn tập | quá rộng so với mục tiêu và nguồn vẽ |
| Thêm thanh tài nguyên thứ hai cho mỗi người | linh hoạt | HUD điện thoại quá chật; người chơi portal đọc không kịp | vi phạm nguyên tắc dễ đọc |
| Hồi chiêu theo thời gian cho từng kỹ năng | quen thuộc | hệ tài nguyên thứ hai song song Bá Khí; khó giải thích | Bá Khí đã làm vai trò giới hạn |
| Đòn tầm xa có đạn bay thật cho Băng Nhi | trực quan, né được | cần thực thể đạn, va chạm mới, AI né đạn | xét trúng tức thời theo tầm, cộng vệt băng thấy được, là đủ cho bản thử |

## Hệ quả

**Tốt:**
- Mỗi nhân vật có một vòng lặp riêng, một sai lầm điển hình riêng, và số liệu riêng để đo.
- Chỉ thêm một bộ điều phối và một bảng dữ liệu; engine chung không bị viết lại.
- Luật miễn khống chế sửa luôn lỗi trùm bị đóng băng 1,5 s như quái thường.

**Xấu:**
- Thêm các điểm móc vào những hàm nóng (`resolveHit`, `heroInput`, `fightStep`). Mỗi điểm phải có test.
- **Đòn tầm xa của Băng Nhi:** cần hình vệt băng mới.
- **Vũ khí riêng:** cần hình vũ khí trên người cho cả bốn. Thương của Hỏa Yến đòi vẽ lại hình đánh.
- **Mốc mở mới:** tiến trình từ cửa 8 trở đi có thêm biến số.

**Rủi ro và cách giảm:**
- **"Đấm bừa" vẫn thắng với cả bốn.** Đo bằng bot ba lối chơi trước khi chốt (tiêu chí A1 trong đặc tả).
- **Băng Nhi khóa địch liên tục.** Luật không cộng dồn và miễn khống chế, cộng test âm.
- **Thạch Lão đứng thủ thắng dễ.** Đòn vật phá thế thủ và làm rơi điểm; AI nhận biết thế núi.
- **Người chơi không hiểu bộ kỹ năng.** Lời giới thiệu ở trận đầu, cộng câu hỏi phỏng vấn trong đợt chơi thử.
- **Áo đang chỉnh đúng thứ làm nên bản sắc:**
  - Áo tiên nới cửa sổ đỡ chuẩn lên 300 ms.
  - Áo dài đỏ tăng tốc nạp Bá Khí ×1,3.
  - Owner quyết, xem câu hỏi Q1 trong đặc tả.

## Phụ thuộc

**Dựa vào:**
- ADR-005 (engine đối kháng)
- ADR-006 (đồng hồ `gnow()`: mọi bộ đếm mới phải dùng nó)
- ADR-007 (giao diện theo kiểu điều khiển)
- định dạng số liệu `f1`
- `FIGHT_PLAN`

**Ràng buộc về sau:**
- Mọi hiệu ứng khống chế sau này phải đi qua luật miễn khống chế.
- Mọi nâng cấp vũ khí phải là lựa chọn mới, không chỉ cộng chỉ số.

**Thứ tự gộp:** nhánh `claude/telemetry-teaching` nên vào `main` trước khi làm bản thử.
