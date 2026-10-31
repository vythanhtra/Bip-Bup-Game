# Đặc tả: 19 nhân vật, 19 lối đánh, hoạt ảnh nhận diện được

- **ADR:** `.10x/adrs/009-roster-identity-and-animation.md` (Proposed).
- **Nguồn:** tài liệu của Owner gửi 2026-10-31. Đặc tả này giữ nguyên bản sắc, tên chiêu và tư thế Owner đặt. Phần thêm vào là ánh xạ sang engine, khối kỹ thuật cần làm, cách đo, và những chỗ cần Owner chốt.
- **Cơ sở mã:** `main` 4111ad7; nhánh `claude/hero-kits-proto` 58b7076. Số dòng tính tại 58b7076.
- **Quy ước:**
  - Mọi con số là giả thuyết (bảng H ở cuối) cho tới khi đo bằng bot và người chơi thật.
  - **SC** là đơn vị khoảng cách của engine, khoảng 1/30 chiều rộng sân. Đòn đấm hiện vươn 11 SC.

## 1. Nguyên tắc khóa (theo tài liệu của Owner)

1. Mỗi đối thủ có dáng riêng: nhìn bóng là nhận ra.
2. Mỗi chiêu có tư thế báo trước riêng: thấy địch chuẩn bị là đoán được loại đòn.
3. Mỗi đối thủ có cách khắc chế riêng: không thể đấm liên tục để hạ tất cả.
4. Trùm khác quái thường cả về hoạt ảnh lẫn AI, không chỉ thêm máu và sát thương.
5. Hoạt ảnh không làm sai cơ chế: hộp va chạm khớp động tác, hiệu ứng không gây sát thương ngoài thời điểm quy định.
6. Nhân vật chính: không được chỉ đổi màu nắm đấm hoặc thêm lửa/băng lên cùng một động tác. Nhìn dáng và chuyển động phải nhận ra ngay ai là ai.

## 2. Bốn nhân vật chính: bộ võ

### 2.1 Ánh xạ bộ đòn sang nút bấm của engine

Engine có sẵn các khe đòn sau (`ATK`, `src/game.html:789-799`); bộ đòn trong tài liệu của Owner khớp đúng các khe này:

| Khe engine | Nút | Tí Bụp | Hỏa Yến | Băng Nhi | Thạch Lão |
|---|---|---|---|---|---|
| Đòn 1 (`lt`) | 👊 | Bụp Thẳng | Hỏa Quyền | Băng Chưởng | Sơn Quyền |
| Đòn 2 (`lt2`, bấm 👊 lần 2) | 👊 | Bụp Nối | Liệt Chưởng | Tuyết Kích | Thiết Chưởng |
| Đòn 3 (`fin`, bấm 👊 lần 3) | 👊 | Móc Văng | Hỏa Cước | Hàn Phong (tầm xa) | Địa Chấn |
| Đòn 4 (`hv`) | 💥 | Song Bụp | Hỏa Thăng | Băng Trụ | Phá Sơn |
| Chiêu đặc biệt (`sp`, 50 % Bá Khí) | ✨ | Lướt Bụp | Hỏa Bộ | Băng Bộ | Thiết Sơn Thủ |
| Tuyệt chiêu (`sup`, 100 %) | ✨ khi đầy | BÍP BỤP LIÊN HOÀN | HỎA LONG BÙNG CHÁY | BĂNG PHONG | SƠN KÌNH PHẢN KÍCH |

- Mỗi đòn có thông số riêng theo nhân vật: thời gian chuẩn bị, ra đòn, hồi đòn, tầm, đẩy lùi, và đặc tính.
- Hiện cả bốn dùng chung một bảng `ATK`.
- Đề xuất bảng `HERO_ATK[hero][khe]` ghi đè lên `ATK`, tức là cùng cơ chế dữ liệu như `HERO_KIT` của ADR-008.

**Đặc tính đòn cần engine hỗ trợ:**

| Nhân vật | Đòn | Đặc tính |
|---|---|---|
| Tí Bụp | Song Bụp | 2 lần trúng trong một đòn. Engine đã có đòn nhiều lần trúng: kiểu `flurry` của tuyệt chiêu |
| Hỏa Yến | Hỏa Thăng | Hất lên, đánh trúng địch đang nhảy. Engine đã có: `upper`, `air: true` |
| Băng Nhi | Hàn Phong | Tầm xa, theo dải khoảng cách. Bản thử ADR-008 đã có, đang gắn vào nút 💥 |
| Băng Nhi | Băng Trụ | Cột băng mọc ở khoảng cách cố định trước mặt. **Khối mới:** đòn đặt tại vị trí |
| Băng Nhi | Băng Bộ | Lướt lùi, để lại vệt băng làm chậm. **Khối mới:** vùng trên sàn |
| Thạch Lão | Thiết Chưởng | Đẩy lùi xa (`kb` lớn) |
| Thạch Lão | Địa Chấn | Trúng địch đứng gần cả hai phía, không trúng địch đang nhảy |
| Thạch Lão | Thiết Sơn Thủ | Thế phản kích có giới hạn: Thế Núi của ADR-008, thay cho "Dỗi" |

### 2.2 Chênh lệch giữa tài liệu của Owner và bản thử ADR-008 (58b7076)

| Nhân vật | Bản thử hiện tại | Theo tài liệu của Owner | Việc cần làm |
|---|---|---|---|
| Tí Bụp | Tuyệt chiêu giữ như cũ: 8 đòn × 6 | Tuyệt chiêu mạnh theo Chuỗi Bụp | Sát thương tuyệt chiêu = gốc × (1 + chuỗi hiện tại × hệ số), có trần (H1) |
| Hỏa Yến | Tuyệt chiêu tốn 100 Nhiệt, đốt một mục tiêu | Lửa diện rộng | Tuyệt chiêu trúng mọi địch trong 18 SC trước mặt (H2) |
| Băng Nhi | Tuyệt chiêu đóng băng một mục tiêu 1,5 s | Băng Phong: vùng băng lớn, làm chậm hoặc gián đoạn | Vùng 20 SC, làm chậm; trùm theo luật miễn khống chế sẵn có (H3) |
| Thạch Lão | Tuyệt chiêu = Thế Núi; đòn 💥 khi có đá = Sơn Kình | Chiêu đặc biệt = Thiết Sơn Thủ; tuyệt chiêu = Sơn Kình Phản Kích | Đổi chỗ: Thế Núi xuống ✨ 50 %, Sơn Kình Phản Kích lên tuyệt chiêu, tiêu hết đá (**Q4**) |

### 2.3 Hoạt ảnh bắt buộc cho từng nhân vật chính

Như tài liệu của Owner, mục "Hoạt ảnh bắt buộc" của từng người. Mỗi nhân vật cần 10 nhóm: tư thế thủ, di chuyển, đòn 1–4, chiêu đặc biệt, tuyệt chiêu, đỡ chuẩn, trúng đòn.

**Yêu cầu nhận diện:**

| Nhân vật | Yêu cầu |
|---|---|
| Tí Bụp | Đánh liên tục thì nhanh dần. Engine rút ngắn khung hồi đòn theo chuỗi; hình phải có khung "đấm nhanh" riêng |
| Hỏa Yến | Lửa quanh tay sáng theo mức Nhiệt (vẽ bằng engine, theo `B.kit.heat`). Đánh hụt thì lửa tắt tương ứng |
| Băng Nhi | Có động tác lùi, né ngang, phóng băng từ xa. Không đứng yên đánh gần |
| Thạch Lão | Nặng và vững: ít khung, mỗi đòn có khoảng dừng (hit-stop) dài hơn và rung màn hình riêng |

## 3. Mười lăm đối thủ: bộ hành vi

### 3.1 Hồ sơ AI riêng

Mỗi đối thủ khai báo `ai` trong `ENEMIES`. `aiProfile` (`src/game.html:805`) lấy hồ sơ này làm gốc, rồi nhân với hệ số độ khó theo vùng như hiện nay.

| Trường | Ý nghĩa |
|---|---|
| `range` | Khoảng cách ưa thích, đơn vị SC: `close` 8–10, `mid` 13–16, `far` 18–24 |
| `aggr` | Xác suất ra đòn khi đủ tầm |
| `block` | Xác suất chặn khi thấy người chơi ra đòn |
| `jump` | Xác suất nhảy |
| `retreat` | Xác suất lùi khi bị áp sát. Dùng cho đối thủ giữ khoảng cách |
| `moves` | Danh sách đòn riêng, có trọng số và điều kiện (khoảng cách, pha, trạng thái người chơi) |

### 3.2 Bảng hành vi

Cột "Khối" chỉ khối engine ở mục 4. "Báo trước" là tư thế và thời gian chuẩn bị ở vùng 1, sau đó ngắn dần theo vùng như hiện nay.

#### Vùng 1, Làng Tre (cửa 1–8): học đánh, quan sát, phòng thủ

**1. Lính Cỏ: đối thủ hướng dẫn.**
- **AI:** close; aggr 0,25; block 0; không nhảy.
- **Đòn:**
  - Rơm Quật: quật ngang chậm. Báo trước bằng giơ tay rơm, 600 ms.
  - Rơm Đâm: đâm thẳng, tầm 13 SC. Báo trước bằng thu bó rơm về sau, 500 ms.
  - Bão Rơm: xoay quét 3 lần trúng. Báo trước bằng xoay người, 700 ms. Dùng khối "đòn nhiều lần trúng".
- **Khắc chế:** chặn rồi đánh trả; tập đỡ chuẩn.
- **Mục tiêu đo:** chơi kiểu cân bằng thắng ≥ 95 %; đây là cửa dạy.

**2. Trâu Lười.**
- **AI:** close; ngủ 40 % thời gian; aggr 0,5 khi tỉnh.
- **Đòn:**
  - Húc Ngắn: gần, nhanh.
  - Húc Đại Địa: cào chân lấy đà 800 ms, rồi lao 24 SC. Phải nhảy qua hoặc chặn.
  - Ngủ Gục Đè Người: đổ về trước, trúng vùng 10 SC trước mặt.
- **Cơ chế:**
  - Đang ngủ thì nhận đòn bình thường.
  - Bị trúng 3 đòn khi ngủ thì giật mình tỉnh, kèm 1 đòn húc không bị ngắt.
  - Khối: trạng thái ngủ, lao dài, đòn không bị ngắt.
- **Khắc chế:** đánh 2 đòn lúc ngủ rồi lùi; nhảy qua cú húc dài.
- **Mục tiêu đo:** đấm bừa bị húc trúng ≥ 2 lần mỗi hiệp.

**3. Lý Trưởng Ngáp (trùm 1).**
- **AI:** mid; aggr 0,45; block 0,3.
- **Đòn:**
  - Ngáp Truyền Nhiễm: làm chậm, như hiện nay (kiểu `yawn`).
  - Thu Thuế: quật ngang bất ngờ sau một khoảng đứng yên, báo trước ngắn 300 ms.
  - Phạt Nhanh: lao tới ngay sau cú ngáp.
- **Cơ chế "gồng":** người chơi đánh trúng 4 đòn liên tiếp (không xen chặn hay lùi) thì Lý Trưởng gồng bụng 250 ms, miễn ngắt, rồi phản một đòn 16 sát thương đẩy lùi.
  - Có biểu tượng báo "gồng" từ đòn thứ 3.
  - Khối: đòn không bị ngắt, đếm đòn liên tiếp.
- **Khắc chế:** đánh 2–3 đòn rồi chặn hoặc lùi; trừng phạt sau cú phản hụt.
- **Mục tiêu đo:** đấm bừa thắng ≤ 50 %, cân bằng thắng ≥ 80 %.

#### Vùng 2, Chợ Đêm (cửa 9–16): đánh lừa, đổi hướng, áp sát

**4. Lính Đèn Lồng.**
- **AI:** mid; retreat 0,6 khi bị áp sát dưới 10 SC.
- **Đòn:**
  - Đèn Quật: cán đèn, tầm 15 SC.
  - Đèn Xoay: vòng đèn 2 lần trúng, trúng cả người đang nhảy.
  - Chụp Ảnh Lóe: lóe sáng gây mù, như hiện nay (kiểu `flash`).
- **Khắc chế:** lướt vào sau cú quật hụt; không đứng ở tầm trung.
- **Hình:** dùng bộ `linhdem-*.png` đã có (mục 6.3).

**5. Vịt Giả Gà.**
- **AI:** close; feint 0,35.
- **Đòn:**
  - Mổ Lén: báo trước rất ngắn 200 ms, sát thương thấp.
  - Cánh Quạt: 3 lần trúng.
  - BÍP Giả: như hiện nay.
- **Khắc chế:** không phản ứng theo tiếng; chờ BÍP thật; chặn rồi đánh trả.

**6. Anh Hai Hàng Hiệu (trùm 2).**
- **AI:** close; aggr 0,7; block 0,2.
- **Đòn:**
  - Chốt Đơn: lao 18 SC đánh mạnh.
  - Hàng Xịn: đòn nặng **không bị ngắt** bởi đòn thường. Báo trước bằng vuốt kính, 450 ms, kèm viền vàng.
  - Mua 2 Tặng 1: chuỗi 3 đòn, nhịp đòn thứ 3 trễ.
- **Khắc chế:** chặn cú Hàng Xịn rồi phạt; đừng đánh đổi đòn với nó.
- **Mục tiêu đo:** đấm bừa thắng ≤ 40 %.

#### Vùng 3, Sông Băng (cửa 17–24): nhịp điệu, băng giá, khống chế

**7. Cánh Cụt Múa Lân.**
- **AI:** close.
- **Đòn:**
  - Trống Tùng: theo nhịp chậm.
  - Trống Cắc: 3 đòn đảo nhịp.
  - Đầu Lân Húc: lao.
- **Cơ chế:** nhịp trống phát thành tiếng và vạch nhịp trên đầu. Đỡ chuẩn đúng nhịp cho cửa sổ phản đòn ×2 dài 900 ms.
  - Khối: nhịp báo trước.
- **Khắc chế:** nghe nhịp, chặn đúng phách.

**8. Người Tuyết Hắt Xì.**
- **AI:** mid.
- **Đòn:**
  - Hắt Hơi: luồng gió lạnh bay chậm, tầm 20 SC.
  - Sổ Mũi: 2 đòn.
  - Hắt Xì Bão Tuyết: hít hơi phồng má 1 000 ms, rồi gió đẩy lùi 9 SC.
- **Cơ chế:** đánh trúng lúc đang hít hơi thì hủy cú hắt xì nhưng nó phản ngay bằng Sổ Mũi. Rủi ro đổi lấy lợi thế.
  - Khối: đạn bay, hủy khi đang chuẩn bị.
- **Khắc chế:** nhận biết thời điểm phát nổ để nhảy hoặc chặn.

**9. Băng Vương Hắt Hơi (trùm 3).**
- **AI:** đổi giữa close và far mỗi 6–8 s.
- **Đòn:**
  - Khăn Tay Băng: quật dài 17 SC.
  - Hắt Hơi Hoàng Gia: bão tuyết bay.
  - Đóng Băng: vùng băng dưới chân người chơi, 2 s. Đứng trong vùng thì trơn trượt.
- **Khối:** đạn bay, vùng trên sàn.
- **Khắc chế:** ra khỏi vùng băng; áp sát giữa hai lần phóng.

#### Vùng 4, Núi Lửa (cửa 25–32): tốc độ, khói, nhiệt, áp lực

**10. Khỉ Lửa.**
- **AI:** mid; jump 0,35.
- **Đòn:**
  - Chuối Bay: đạn bay vòng cung.
  - Khỉ Nhảy: nhảy qua đầu, đổi phía, nên hướng chặn đổi theo.
  - Hỏa Cước: đá từ trên xuống.
- **Khối:** đạn bay, nhảy qua đầu.
- **Khắc chế:** chống trên không bằng cú hất (`upper`); nhìn phía tiếp đất để chặn.

**11. Gà Nướng Hồi Sinh.**
- **AI:** close.
- **Đòn:**
  - Cánh Nướng: quạt ngang.
  - Mật Ong Dính: vùng làm chậm.
  - Hồi Sinh Giòn: đứng niệm 1 500 ms, hồi 25 máu và tạo giáp.
- **Cơ chế:** gây đủ 20 sát thương trong lúc niệm thì hủy hồi máu và gà bị choáng 800 ms.
  - Khối: hồi máu có thể ngắt, vùng trên sàn.
- **Khắc chế:** dồn sát thương đúng lúc gà niệm.

**12. Hỏa Long Nấu Lẩu (trùm 4).**
- **AI:** mid.
- **Đòn:**
  - Muôi Quay: 4 lần trúng.
  - Lẩu Sôi: phun lửa hình nón 16 SC trước mặt.
  - Khói Lẩu: khói che dấu hiệu báo đòn, như hiện nay.
- **Khối:** đạn bay hoặc vùng hình nón.
- **Khắc chế:** nhìn nắm đấm dưới khói; đứng ngoài nón lửa.

#### Vùng 5, Thiên Đình (cửa 33–40): tổng hợp, đánh lừa, thử thách cuối

**13. Thiên Binh Ngủ Gật.**
- **AI:** gật gù 30 % thời gian; đang gật mà bị đánh thì có 50 % "giả vờ" và phản ngay.
- **Đòn:**
  - Giáo Quét: tầm 18 SC, đánh thấp, phải nhảy.
  - Tỉnh Rồi: lao nhanh.
  - Ngủ Gật Đè: nhảy lên rồi đè xuống.
- **Khối:** trạng thái ngủ, lao dài.
- **Khắc chế:** không lao bừa vào lúc nó gật; nhảy qua cú quét.

**14. Tiên Nữ Livestream.**
- **AI:** mid; feint 0,4.
- **Đòn:**
  - Tạo Dáng: tư thế giả, có viền hồng nhưng không phải đòn thật.
  - Thả Tim: che màn hình, như hiện nay.
  - Lên Sóng: chuỗi đòn đổi phía, có lướt ra sau lưng.
- **Khắc chế:** chỉ phản ứng với viền đỏ của đòn thật.

**15. Lão Rùa Thiên Tuế (trùm cuối, 3 hiệp).**
- **Hiệp 1, Chậm:** Gậy Rùa, Ngáp Chậm. Báo trước dài; dạy quan sát.
- **Hiệp 2, Phản:** Mai Rùa thu vào mai 1,5 s, đòn thường bị dội lại, rồi bật ra phản đòn. Đòn Lừa.
  - Khối: thế phản kích của đối thủ, dùng chung mã với Thế Núi.
- **Hiệp 3, Bá Khí:** Chậm Chạp Chi Thuật và Bão Bá Khí. Trộn cơ chế đã gặp: đạn bay, vùng sàn, đòn không bị ngắt.

## 4. Khối engine mới

Mỗi khối là một hàm hoặc một trường dữ liệu dùng chung, có test âm riêng. Tất cả dùng đồng hồ `gnow()` (ADR-006) và nằm sau công tắc `?foes=1` cho tới khi Owner cho gộp.

| # | Khối | Mô tả kỹ thuật | Dùng bởi | Test âm bắt buộc |
|---|---|---|---|---|
| K1 | Hồ sơ AI theo đối thủ | `ENEMIES[k].ai` ghi đè `aiProfile` | Tất cả | Công tắc tắt thì `aiProfile` trả đúng giá trị cũ cho cả 15 đối thủ |
| K2 | Đòn theo tên | `ENEMIES[k].moves`: đòn riêng có `su/ac/re/rg/dmg/kb/pose`, thay hướng `L/R/U` | Tất cả | Đòn không có `pose` vẫn vẽ bằng hình "đánh" cũ, không lỗi |
| K3 | Đạn bay | Vật thể có vị trí, tốc độ, tầm, chặn được, biến mất khi trúng hoặc hết tầm | Người Tuyết, Băng Vương, Khỉ Lửa, Hỏa Long, Băng Nhi | Đạn không gây sát thương 2 lần; chặn đúng hướng thì mất sát thương |
| K4 | Lao dài | Đòn có `dash` lớn và hộp va chạm đi theo người | Trâu Lười, Anh Hai, Thiên Binh, Cánh Cụt | Nhảy qua thì không trúng; không xuyên tường sân |
| K5 | Đòn không bị ngắt | `saUntil`, đã có trong bản thử ADR-008, dùng cho đối thủ | Anh Hai, Lý Trưởng, Trâu Lười, Thạch Lão | Vẫn nhận sát thương; chặn được |
| K6 | Đếm đòn liên tiếp | Đếm đòn trúng liên tiếp lên một đối thủ; reset khi người chơi chặn, lùi, hoặc sau 900 ms | Lý Trưởng | Đánh 3 đòn, nghỉ 1 s, đánh 3 đòn thì không gồng |
| K7 | Ngủ hoặc mở thế | Trạng thái `sleep`: không chặn, đếm đòn để tỉnh | Trâu Lười, Thiên Binh | Không bao giờ ngủ khi đang bị đánh liên tục quá 3 đòn |
| K8 | Vùng trên sàn | Vùng có tâm, bán kính, thời hạn, hiệu ứng (chậm, trơn, đốt) | Băng Vương, Gà Nướng, Băng Nhi | Hiệu ứng không cộng dồn; hết hạn thì mất |
| K9 | Nhịp báo trước | Đồng hồ nhịp theo trận, phát tiếng và vạch nhịp; đòn rơi đúng phách | Cánh Cụt | Tạm dừng game thì nhịp dừng theo |
| K10 | Niệm có thể ngắt | Trạng thái niệm có ngưỡng sát thương để hủy | Gà Nướng, Người Tuyết | Đủ ngưỡng thì hủy; dưới ngưỡng thì hoàn tất |
| K11 | Nhảy qua đầu | Nhảy với `jumpVx` đủ vượt người chơi; hướng chặn tính lại khi tiếp đất | Khỉ Lửa, Tiên Nữ | Không kẹt trong người chơi; chặn theo hướng mới thì được |

**Chống khóa vô hạn chung:** không đưa vào bản thử trừ khi Owner chọn (Q2). Nếu có: sau 6 đòn trúng liên tiếp lên cùng một đối thủ thường, đối thủ thoát và đẩy lùi.

## 5. Chuẩn hoạt ảnh

### 5.1 Mười hai nhóm cho mọi nhân vật

Lấy đúng bảng của Owner: đứng/thở, di chuyển, chuẩn bị ra đòn, đòn thường 1–3, đòn đặc biệt, tuyệt chiêu, trúng đòn, đỡ/chặn, ngã, thắng.
- Nhân vật chính thêm đòn 4, tổng 13 nhóm.
- 5 trùm thêm 5 nhóm: chuyển pha, tích lực, báo tuyệt chiêu, choáng/mất thế, kết thúc trận.

### 5.2 Yêu cầu kỹ thuật (8 điểm của Owner) và cách engine đáp ứng

| # | Yêu cầu | Cách làm |
|---|---|---|
| 1 | Mỗi chiêu có hoạt ảnh riêng | Dữ liệu đòn (K2) trỏ tới nhóm hoạt ảnh của nó |
| 2 | Có chuẩn bị, ra đòn, va chạm, hồi đòn | Mỗi nhóm khai báo khung nào thuộc `su`, `ac`, `re`. Engine chọn khung theo thời gian trong pha, nên hình luôn khớp thời điểm gây sát thương |
| 3 | Hộp va chạm theo tư thế | Mỗi đòn có `rg` và chiều cao trúng. Hộp va chạm vẽ được bằng chế độ gỡ lỗi để kiểm bằng mắt |
| 4 | Lửa, băng, Sơn Kình đúng thời điểm | Hiệu ứng gắn vào khung `ac` đầu tiên, không gắn vào lúc bấm nút |
| 5 | Không làm sai vị trí, hướng mặt, va chạm | Gốc tọa độ là điểm giữa hai chân, chung cho mọi khung; test tự động so vị trí trước và sau khi đổi hình |
| 6 | Lật trái phải đúng | Lật quanh gốc chân; cấm hình có chữ hoặc chi tiết bất đối xứng quan trọng |
| 7 | Tuyệt chiêu tách rõ chuẩn bị, sát thương, kết thúc | Như điểm 2, thêm khung dừng hình (freeze) có sẵn của engine |
| 8 | Dễ nhìn trên điện thoại | Kiểm ở 360 × 740 px: bóng nhân vật cao ≥ 120 px và tư thế báo trước nhận ra được trong 1 khung |

### 5.3 Định dạng tài sản

- Mỗi nhân vật một ảnh dải khung `img/a/<nhân vật>.png` kèm tệp mô tả `img/a/<nhân vật>.json`. Tệp mô tả ghi:
  - tên nhóm, toạ độ khung, gốc chân;
  - khung nào thuộc pha nào.
- **Tương thích ngược:** thiếu dải khung thì engine dùng hình 1 khung như bây giờ (`sprite()`, `src/assets.js:19`), nên có thể thay từng nhân vật một.

## 6. Kiểm kê tài sản hình

### 6.1 Hiện có

`public/img/s/`, mỗi tư thế 1 khung:

| Nhân vật | Nhóm đã có (theo 12 nhóm) | Số nhóm |
|---|---|---|
| Tí Bụp | đứng, đi, đòn (1 hình), tuyệt chiêu, trúng đòn, chặn, ngã. Có thêm "nhảy" | 7 / 13 |
| Hỏa Yến, Băng Nhi, Thạch Lão | đứng, đòn (1 hình), tuyệt chiêu, trúng đòn, chặn, ngã | 6 / 13 |
| Lính Cỏ, Lính Đèn Lồng, Vịt Giả Gà, Anh Hai | đứng, đòn (1 hình), trúng đòn, chặn; chưa có hình ngã | 4 / 12 (Anh Hai: 4 / 17) |
| 11 đối thủ còn lại | đứng, đòn (1 hình), trúng đòn, ngã | 4 / 12 (trùm: 4 / 17) |

### 6.2 Cần có để đủ chuẩn

- Nhân vật chính: 4 × 13 = 52 nhóm.
- Đối thủ: 15 × 12 = 180 nhóm, cộng 5 trùm × 5 = 25. Tổng 205.
- **Tổng 257 nhóm; đã có 85; thiếu 172 nhóm.** Mỗi nhóm có thể cần 2–6 khung.

### 6.3 Việc nhỏ làm được ngay

**Lính Đèn Lồng dùng đúng hình của mình.** Bộ `linhdem-*.png` đã có nhưng `src/world.js:29` vẫn trỏ `spr: 'linhco'`.
- **Sửa:** bản có tranh dùng `linhdem`; bản vẽ bằng mã (không tranh) giữ Lính Cỏ đổi màu.

**Kiểm lại khi sửa (2026-10-31, CONFIRMED):**
- Trong trận, bản tranh **đã** vẽ đúng hình `linhdem`, vì engine chọn hình theo mã đối thủ (`a.key`), không theo `spr`.
- Chỗ còn sai: các câu thoại mở màn của Lính Đèn Lồng (cửa 10, 12, 14) được gắn cho Lính Cỏ (`spr: 'linhco'`).
  - Các cửa này hiện chỉ dùng bong bóng thoại không có chân dung, nên người chơi chưa thấy.
  - Đã sửa: bản tranh gắn câu thoại cho chân dung riêng nếu có.
  - Test: `tests/ldtest.js`.
- **Test:** màn đấu cửa 10 ở bản tranh vẽ hình `linhdem-idle`.
- Làm khi Owner cho phép; không cần chờ ADR-009.

## 7. Bản thử trên 2 cửa mẫu

### 7.1 Đề xuất: cửa 6 (Trâu Lười) và cửa 8 (Lý Trưởng, trùm 1)

**Lý do:**
- **Ai cũng chơi tới.** Vùng 1 là nơi mọi người chơi đi qua; cảm giác "nhàm" ở đây ảnh hưởng nhiều nhất.
- **Hai kiểu trị đấm bừa khác nhau.** Trâu Lười trừng phạt người đánh lúc nó tỉnh bằng cú húc dài. Lý Trưởng trừng phạt chuỗi đấm dài bằng cú gồng.
- **Ít khối mới.** Cần K1, K2, K4, K5, K6, K7. Chưa cần đạn bay, vùng sàn, nhịp.
- **Đủ hình để bắt đầu.** Cả hai đã có 4 tư thế; chỉ cần thêm tư thế báo trước cho húc, ngủ và gồng.

**Phương án khác:** cửa 12 và 16 (Lính Đèn Lồng, Anh Hai), để dùng lại số đo bot của ADR-008. Cần thêm K3 nếu muốn Lính Đèn Lồng ném đèn; tài liệu của Owner không yêu cầu điều đó.

### 7.2 Thứ tự làm

1. K1, K2 và dữ liệu hồ sơ AI cho Trâu Lười, Lý Trưởng. Chạy với hình hiện có; tư thế báo trước tạm vẽ bằng engine (viền, rung, co giãn).
2. K4–K7 kèm test âm.
3. Bot: thêm lối chơi "khắc chế" riêng cho từng đối thủ (mục 8). Chạy 50 trận mỗi ô.
4. Song song, nếu Owner chọn cách sản xuất (Q1): làm thử hoạt ảnh đủ chuẩn cho **một** nhân vật, đề xuất Trâu Lười. Chấm theo 8 yêu cầu ở mục 5.2.
5. Báo cáo Owner, chỉnh thông số, rồi mới mở rộng.

## 8. Tiêu chí nghiệm thu bản thử

**Đo bằng bot:** `tools/kitbot.js`, mở rộng cho cửa 6, 8; mỗi ô 50 trận; khoảng tin cậy Wilson 95 %.

| # | Tiêu chí (giả thuyết) |
|---|---|
| F1 | Đấm bừa thắng ≤ 50 % ở cửa 8 và ≤ 70 % ở cửa 6, với cả 4 nhân vật |
| F2 | Lối "khắc chế" riêng của mỗi đối thủ thắng ≥ 85 %, cao hơn đấm bừa ít nhất 25 điểm |
| F3 | Mỗi đòn đặc trưng có tư thế báo trước ≥ 400 ms ở vùng 1, và bot "chặn khi thấy báo trước" chặn được ≥ 90 % |
| F4 | Công tắc tắt: toàn bộ test như hiện nay (entest, zhtest lỗi cũ; p3test lỗi ngẫu nhiên) |
| F5 | Người chơi thật, chơi thử nội bộ: ≥ 7/10 người nói đúng cách thắng từng đối thủ mẫu sau 2 lần chơi |
| F6 | Tỷ lệ qua cửa lần đầu ở cửa 6, 8 sau phát hành không giảm quá 15 điểm so với hiện tại (đo bằng `f1`/`f2`, `docs/analytics.md`) |

**Lối chơi bot mới:**

| Lối chơi | Hành vi |
|---|---|
| Khắc chế Trâu Lười | Đánh 2 đòn khi nó ngủ rồi lùi; nhảy khi thấy cào chân |
| Khắc chế Lý Trưởng | Đánh tối đa 3 đòn rồi chặn 400 ms |

## 8b. Kết quả bản thử lần 1 (2026-10-31, nhánh `claude/foes-proto`, chưa commit)

**Đã làm sau `?foes=1`:**
- K1, K2, K4–K7 và luật chung chống đấm bừa.
- Tư thế báo trước vẽ bằng engine:
  - vệt đỏ đường húc và dấu "!";
  - vòng vàng khi đang ra đòn không bị ngắt;
  - "Sắp gồng!" ở đòn thứ 3;
  - chữ "z" chỉ hiện khi trâu ngủ thật. Đã tắt hai chữ "z" trang trí cũ vì gây hiểu sai.
- Số liệu `f2`, trường 13: `o<húc>.<trúng>.<chặn>.<hụt>.<tỉnh>.<gồng>.<thoát>.<ngủ ×100 ms>`.

**Test:**
- `tests/fo1test.js`: 29 kiểm tra, gồm test âm cho từng khối, kiểm khi tắt công tắc, và kiểm bằng phím bấm thật. Qua 2/2 lần.
- `tests/ldtest.js` qua. k1test qua 2/2 sau khi đổi chỗ chiêu Thạch Lão.

**Đo bằng bot** (không bật bộ kỹ năng, 4 nhân vật; Wilson 95 %):

*Lượt 1:* thông số đặc tả gốc, 30 trận mỗi ô, kèm đối chứng tắt công tắc.

| Cửa · lối chơi | Thắng: bản thử / tắt | Máu mất hiệp cuối: bản thử / tắt |
|---|---|---|
| 6 · đấm bừa | 100 % / 100 % | 16 % / 5 % |
| 6 · cân bằng | 97 % / 100 % | 34 % / 10 % |
| 6 · khắc chế | 100 % / — | 16 % / — |
| 8 · đấm bừa | 98 % / 100 % | 50 % / 10 % |
| 8 · cân bằng | 93 % / 100 % | 57 % / 11 % |
| 8 · khắc chế | 91 % / — | 52 % / — |

- **Đối thủ nguy hiểm hơn khoảng 3–5 lần** (máu mất), trận dài hơn: cửa 8 từ 23 s lên 27–38 s.
- **F1 không đạt:** đấm bừa vẫn thắng ≥ 90 %.
- **Nguyên nhân (CONFIRMED bằng số đếm):**
  - Chuỗi đấm–đấm–móc làm ngã sau 3 đòn, và địch đứng dậy mất hơn 900 ms, nên bộ đếm "liên tiếp" luôn bị đặt lại.
  - Luật chung chỉ kích hoạt 0,1–0,5 lần mỗi trận.
  - Trâu Lười chỉ húc 0,6–0,8 lần mỗi trận vì bị đấm liên tục.

*Lượt 2:* chỉnh trong phạm vi giả thuyết, 10 trận mỗi ô.
- Cửa sổ đếm 900 → 1 500 ms; luật chung 6 → 5 đòn; cú phản sau gồng 16 → 28 sát thương, kèm làm ngã.
- **Cửa 8:**
  - đấm bừa thắng 70–100 % tùy nhân vật, mất 72 % máu;
  - cân bằng 50–100 %;
  - khắc chế 50–100 %.
- **Cửa 6:** đấm bừa vẫn 100 %.
- **F1, F2 chưa đạt.** Lối khắc chế chưa thắng rõ hơn đấm bừa.

**Kết luận:**
- Cơ chế riêng làm đối thủ khác nhau và nguy hiểm hơn, nhưng chưa đủ để đấm bừa thua.
- Với quái thường (cửa 6), chỉ đẩy lùi khi thoát khóa là chưa đủ.
- Đề xuất bước tiếp (cần Owner chọn):
  - (a) khi thoát khóa, đối thủ có cơ chế riêng phản ngay một đòn;
  - (b) khi đứng dậy sau khi ngã, đối thủ được miễn ngắt 300–400 ms và có thể đánh trả;
  - (c) tăng máu đối thủ ở bản thử.
- Thông số hiện để ở lượt 2 (H7, H8, H11 cập nhật bên dưới).

**Thử sinh khung chính bằng AI (Q1):**
- Sinh 1 khung "cào chân lấy đà" cho Trâu Lười bằng Canva (chỉ mô tả chữ, vì môi trường chặn tải ảnh tham chiếu lên canva.com).
- Xóa nền, đưa vào game làm tư thế báo trước của cú húc: `s/traului-windup.png`, `pose: 'windup'`.
- **Chấm theo mục 5.2:**
  - Đạt: (1) động tác riêng; (2) gắn đúng pha chuẩn bị; (6) lật trái phải đúng; (8) đọc được trên điện thoại.
  - Một phần: phong cách gần giống, nhưng thân to và ít "chibi" hơn hình gốc; mép còn viền trắng mờ.
  - Ảnh nhận về chỉ 199 × 149 px (bản đầy đủ nằm trên Canva, không tải được từ môi trường này), nên phải phóng lên 192 px chiều cao.
- **Phát hiện thêm:** hình đứng gốc `traului-idle.png` có sẵn chữ "z" vẽ trong ảnh, nên kể cả lúc tỉnh trâu vẫn trông như ngủ. Cần thêm một hình "đứng tỉnh" thì cơ chế ngủ mới đọc rõ.
- Để sinh đủ 172 nhóm còn thiếu với chất lượng đồng đều, cần ảnh tham chiếu và bản đầy đủ độ phân giải. Hiện chỉ làm được nếu Owner tải giúp ảnh tham chiếu lên Canva hoặc mở mạng cho canva.com trong môi trường.

## 9. Câu hỏi cho Owner

**Đã chốt 2026-10-31:**
- Q1: (a), sinh bằng AI.
- Q2: có.
- Q3: cửa 6 và 8.
- Q4: Implementer chọn đổi chỗ, giữ "Dỗi" trong câu thoại.
- Q5: có.
- Q6: Implementer chọn tách nhánh.


| # | Câu hỏi | Đề xuất của Implementer |
|---|---|---|
| Q1 | Sản xuất hoạt ảnh bằng cách nào: (a) sinh khung chính bằng AI theo ADR-003 rồi engine nội suy; (b) thuê họa sĩ vẽ dải khung; (c) trộn: AI cho đối thủ thường, họa sĩ cho nhân vật chính và trùm | Làm thử (a) trên Trâu Lười trước, chấm theo mục 5.2 rồi quyết |
| Q2 | Có thêm luật chung chống khóa vô hạn (mục 4) ngoài cách khắc chế riêng không? | Có, làm lưới an toàn cho 13 đối thủ chưa làm lại; tắt cho đối thủ đã có cơ chế riêng |
| Q3 | 2 cửa mẫu: 6 và 8, hay 12 và 16? | 6 và 8 |
| Q4 | Thạch Lão: đổi chỗ như mục 2.2 (Thiết Sơn Thủ thành chiêu đặc biệt, Sơn Kình Phản Kích thành tuyệt chiêu)? Có giữ tên "Dỗi" cho thế thủ không? | Đổi chỗ; giữ tên "Dỗi" trong câu thoại cho vui, tên chiêu là Thiết Sơn Thủ |
| Q5 | Mức khó mục tiêu cho vùng 1 (người chơi chính là trẻ em) | Giữ báo trước dài; F6 làm chốt chặn |
| Q6 | Bản thử bộ kỹ năng nhân vật chính (ADR-008) và bản thử đối thủ: làm chung một nhánh hay tách nhánh? | Tách nhánh `claude/foes-proto` từ 58b7076, để review từng phần |

## Bảng giả thuyết

| # | Giả thuyết | Giá trị đề xuất |
|---|---|---|
| H1 | Tuyệt chiêu Tí theo chuỗi | +6 % mỗi đòn trong chuỗi, trần +60 % |
| H2 | Tầm lửa diện rộng của Hỏa Yến | 18 SC trước mặt |
| H3 | Vùng Băng Phong | 20 SC, làm chậm ×1,3 trong 2 s |
| H4 | Trâu Lười ngủ | 40 % thời gian, mỗi lần 1,5–3 s |
| H5 | Đòn để Trâu tỉnh | 3 đòn |
| H6 | Báo trước Húc Đại Địa | 800 ms |
| H7 | Lý Trưởng gồng | sau 4 đòn liên tiếp, reset sau 1 500 ms không đánh (lượt 2; gốc 900 ms) |
| H8 | Sát thương phản của Lý Trưởng | 28 và làm ngã (lượt 2; gốc 16, đẩy lùi 6 SC) |
| H9 | Hàng Xịn báo trước | 450 ms |
| H10 | Ngưỡng hủy hồi máu của Gà Nướng | 20 sát thương trong 1 500 ms |
| H11 | Luật chung chống khóa (Owner chọn có) | 5 đòn liên tiếp, đẩy lùi, đối thủ bất tử 300 ms (lượt 2; gốc 6) |
| H12 | Báo trước tối thiểu vùng 1 | 400 ms |
| H13 | Tiêu chí F1, F2, F5, F6 | Như mục 8 |
| H28 | Thạch Lão (Q4): Thiết Sơn Thủ tốn 50 Bá Khí, phản cố định 20; Sơn Kình Phản Kích = 30 + 10 × số đá, không bị ngắt | Như cột trái |
