# Chiến lược vươn ra quốc tế: BÁ KHÍ → thế giới

## 1. Sự thật cần chấp nhận trước khi đi

- Thị trường web game hyper-casual toàn cầu rất đông, nhưng ngách "test phản xạ" đang do các trang tiện ích vô hồn chiếm (Human Benchmark, các reaction test). Không ai trong số đó có nhân vật, cốt truyện, hay một con vịt. Đây là khoảng trống.
- Lợi thế thật của game không phải cơ chế (dễ copy trong một ngày) mà là **cá tính** và **tốc độ lan truyền bằng link**. Chiến lược quốc tế phải bảo vệ hai thứ này.
- Hài Việt không dịch được. Phải **viết lại** (transcreation), không dịch. Giữ hương vị Việt làm bản sắc (như Cuphead giữ hoạt hình thập niên 30, Katamari giữ chất Nhật), nhưng mỗi câu đùa phải tự đứng được mà không cần chú thích.

## 2. Định vị

**Một câu:** *"The reflex game with a soul. One rule, forty idiots, and a duck you should never trust."*

**Khung định vị**
- **Cho ai:** người 14 đến 35 tuổi, chơi trên điện thoại trong 3 phút, thích khoe số, thích thách bạn bè. Nhóm thứ hai: streamer và creator phản ứng (reaction content).
- **Game là gì:** game đấu phản xạ một ngón tay, 40 cửa, 5 thế giới, chơi trên trình duyệt, không cài, không tài khoản.
- **Khác gì:** các reaction test chỉ cho bạn một con số. Game này cho bạn một con số *và* một thằng trâu lười gym cười vào mặt bạn. Wordle tạo nghi thức mỗi ngày bằng một ô chữ; đây tạo nghi thức bằng một tiếng gà gáy.
- **Bằng chứng:** 40 đối thủ có thoại riêng, tín hiệu giả, Cửa Hằng Ngày cùng seed toàn cầu, Đấu Tay Đôi một máy, link thách đấu kèm bóng ma.
- **Tính cách thương hiệu:** hài, ngang, hơi vô lý, không bao giờ tự nghiêm túc. Con vịt là biểu tượng.

**Câu móc cho báo chí và mạng xã hội** (chọn theo kênh)
- "Wordle for reflexes."
- "A fighting game you play with one finger and lose to a duck."
- "60 KB. No assets. No install. Forty idiots to punch." (góc kỹ thuật cho Hacker News)
- "Don't trust the duck." (tagline chính, in lên mọi thứ)

## 3. Tên quốc tế

"BÁ KHÍ" không đọc được và không tìm được ở nước ngoài. Đề xuất:

| Phương án | Ưu | Nhược |
|---|---|---|
| **BEEP BOOP: Battle Aura** (khuyên dùng) | Ai cũng đọc được, mô tả đúng luật, nghe vui, giữ "Battle Aura" làm phụ đề nối với bản Việt | Khá generic, cần kiểm tra trùng tên trên store |
| DON'T TRUST THE DUCK | Nhớ ngay, là meme sẵn | Không nói game là gì, khó mở rộng khi vịt chỉ là một nhân vật |
| BA KHI | Giữ nguyên bản sắc | Không đọc được, không search được |

Giữ "Bá Khí" cho thị trường Việt, dùng "Beep Boop" ở nước ngoài, cùng logo và cùng bản build (đổi theo ngôn ngữ). Trước khi chốt: kiểm tra tên miền, App Store, Steam, nhãn hiệu ở Mỹ và EU.

## 4. Chuyển ngữ: viết lại hài, không dịch

Nguyên tắc: giữ **kiểu nhân vật** (archetype), đổi **chất liệu đùa**.

| Nhân vật Việt | Giữ gì | Viết lại ra sao (ví dụ tiếng Anh) |
|---|---|---|
| Bà Nội Bụp | Bà nội huấn luyện viên không nhận phản hồi | "Grandma Boop. Fed you. Trained you. Will not hear feedback." |
| Trâu lười gym | Kẻ to xác lười biếng khoe cơ | "Buffalo. Has a gym membership. Has never gone." |
| Vịt Giả Gà có chứng chỉ | Kẻ lừa đảo có giấy tờ | "Certified Rooster (certificate from an online course, 3 days)." |
| Tiên nữ bán hàng online | Người bán hàng livestream | "Fairy Influencer. 40% commission. No ethics module." |
| Lý Trưởng đánh thuế | Quan chức thu phí mọi thứ | "The Village Chief. Taxes your hunger." |
| Lão Rùa Thiên Tuế | Trùm chậm chạp nhưng lợi hại | "Turtle Lord. Ten thousand years old. Three rounds. Every trick at once." |

Thứ tự ngôn ngữ (theo kích thước thị trường web game và độ hợp hài): **Anh → Bồ Đào Nha (Brazil) → Tây Ban Nha → Indonesia → Thái → Nhật → Hàn**. Mỗi ngôn ngữ cần một người bản xứ biết đùa, không cần dịch giả chuyên nghiệp. Khối lượng: khoảng 600 dòng thoại, 2 đến 3 ngày một người.

Kỹ thuật: tách toàn bộ chuỗi trong `world.js`, `story2.js` và `game.html` ra file ngôn ngữ, chọn theo `navigator.language` hoặc tham số `?lang=`. Giọng "blip" theo dấu thanh hiện tại là trung tính ngôn ngữ, giữ nguyên. Trailer đã có bản thuyết minh tiếng Anh.

## 5. Kênh phát hành, theo thứ tự chi phí thấp đến cao

**Giai đoạn 0 (2 tuần): sẵn sàng**
- Bản tiếng Anh hoàn chỉnh, tên quốc tế, tên miền riêng, trang đích một màn hình có nút Play và trailer.
- Thẻ kết quả và văn bản chia sẻ bằng tiếng Anh, Open Graph image cho link.
- Press kit: 10 ảnh, trailer, logo, 3 câu mô tả, câu chuyện "làm bằng text sprite, 60 KB".

**Giai đoạn 1 (tháng 1): nền tảng web và cộng đồng, chi phí 0**
- **Cổng web game**: CrazyGames, Poki, Newgrounds, itch.io. Hai cổng đầu có hàng chục triệu người chơi mỗi tháng và chia doanh thu quảng cáo; họ ưu tiên game không cài, tải nhanh, chơi bằng một tay. Game này trúng cả ba.
- **Hacker News "Show HN"** với góc kỹ thuật: một file HTML, sprite là chuỗi text, không asset, âm thanh và giọng tổng hợp bằng WebAudio. Cộng đồng này thích đúng kiểu này.
- **Reddit**: r/WebGames, r/IndieGaming, r/playmygame, r/incremental_games không hợp. Mỗi nơi một bài, giọng dev, không giọng quảng cáo.
- **Product Hunt**: một buổi ra mắt, tagline "Wordle for reflexes".
- **TikTok và Shorts tiếng Anh**: clip 15 giây bị vịt lừa, chữ overlay, không cần giọng. Gửi game cho 20 creator reaction nhỏ (10 đến 100 nghìn follower) kèm link thách đấu có ms của bạn: "beat my time".

**Giai đoạn 2 (tháng 2 đến 3): nghi thức hằng ngày toàn cầu**
- Bảng xếp hạng Cửa Hằng Ngày theo múi giờ toàn cầu, trung bình thế giới trên thẻ. Đây là thứ biến người chơi một lần thành người chơi mỗi sáng. Cần backend nhẹ (Supabase hoặc Cloudflare Workers).
- PWA: thêm vào màn hình chính, thông báo "cửa mới" mỗi sáng (chỉ khi người dùng bật).
- Discord nhỏ cho người chơi dưới 120ms.

**Giai đoạn 3 (tháng 4 trở đi): cửa hàng ứng dụng, chỉ khi có số liệu**
- Đóng gói Capacitor lên iOS và Android khi D7 trên web vượt 15% và có hơn 50 nghìn người chơi tháng. Store không tạo người chơi, store chỉ giữ người chơi đã có.

## 6. Kiếm tiền: không đụng vào thứ làm game lan truyền

- Giữ miễn phí, không tài khoản, không quảng cáo xen giữa trận. Đây là lý do link được gửi đi.
- Doanh thu giai đoạn 1: chia sẻ quảng cáo từ cổng web game (Poki, CrazyGames trả theo lượt chơi).
- Giai đoạn 2: trang phục nhân vật và "vịt vàng" mua một lần, giá 1 đến 3 USD, chỉ để khoe trên thẻ kết quả. Nút tip "mua cho vịt một cái chứng chỉ thật".
- Không bán sức mạnh. Không bán thêm tim. Phản xạ không mua được là toàn bộ lời hứa của game.

## 7. Số đo thành công

| Chỉ số | Hiện tại cần đo | Mốc để sang giai đoạn tiếp |
|---|---|---|
| Tỷ lệ chia sẻ (người bấm sao chép hoặc link thách / người chơi xong cửa 1) | chưa đo | trên 8% |
| K-factor (người mới đến từ link thách / người chia sẻ) | chưa đo | trên 0.3 |
| D1 / D7 | chưa đo | 25% / 10% trên web |
| Tham gia Cửa Hằng Ngày | chưa đo | 30% người chơi quay lại chơi daily |
| Thời gian đến lần cười đầu tiên | quan sát | dưới 20 giây (cảnh vịt) |

Cần gắn đo lường trước khi phát hành quốc tế: một endpoint nhỏ ghi sự kiện ẩn danh (play, share, challenge_open, daily_play), không cookie, không định danh.

## 8. Rủi ro và cách đỡ

- **Hài không bật ở nước ngoài**: thử nghiệm bản tiếng Anh với 20 người bản xứ trước, đo "cười hay không" theo từng câu, cắt câu không cười.
- **Trần phản xạ làm người chơi bỏ sau một giờ**: Cửa Hằng Ngày và Đấu Tay Đôi là lớp giữ chân, phải lên trước khi đẩy mạnh truyền thông.
- **Bị copy**: cơ chế copy được, vịt và 40 thằng kỳ cục thì không. Đăng ký nhãn hiệu tên và hình vịt sớm, đẩy nhân vật ra mọi nơi để người ta nhớ nguồn.
- **Tên trùng**: kiểm tra "Beep Boop" trên App Store, Steam, USPTO và EUIPO trước khi in lên bất cứ thứ gì.

## 9. Việc làm ngay tuần này

1. Chốt tên quốc tế và kiểm tra nhãn hiệu, tên miền.
2. Tách chuỗi ra file ngôn ngữ, viết bản tiếng Anh 600 dòng theo bảng archetype ở mục 4.
3. Gắn đo lường ẩn danh cho 4 sự kiện.
4. Chuẩn bị press kit và bài "Show HN".
5. Nộp game lên CrazyGames và Poki (quy trình duyệt 1 đến 3 tuần, nộp sớm).
