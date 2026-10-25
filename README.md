# Bá Khí: Battle Aura (Bíp Bụp Game)

Game phản xạ nhiều cửa. **Gà gáy BÍP thì BỤP. Chưa gáy mà bụp là ăn đòn.**

- 🎮 Chơi: https://ba-khi.vercel.app
- 📜 Kinh thánh game (cốt truyện, nhân vật, 5 vùng đất, lời thoại, lộ trình): `bible/index.html`
- 🕹️ Bản 5 lượt cũ (Bíp Bụp gốc): `legacy/bip-bup-5-luot.html`, đang chạy ở https://bip-bup.vercel.app

## Cấu trúc
| Đường dẫn | Nội dung |
|---|---|
| `src/sprites.js` | 12 nhân vật pixel art vẽ bằng text, không cần file ảnh |
| `src/world.js` | cốt truyện, 5 vùng, kẻ địch, cấu hình 16 cửa, lời thoại, vẽ nền |
| `src/audio.js` | mixer 3 bus, hiệu ứng tổng hợp, giọng blip theo dấu tiếng Việt, nhạc nền theo vùng |
| `src/game.html` | giao diện, HUD, trận đấu trên canvas, sao, chia sẻ, link thách cửa |
| `build.js` | gộp `src/` thành thư mục tĩnh `public/` (Vercel phục vụ thư mục này) |

```bash
node build.js https://ba-khi.vercel.app   # sinh public/index.html, sprites.js, world.js, game.js
```

Không có bước cài đặt. Mở `public/index.html` là chơi được. Toàn bộ âm thanh, nhạc và tiếng nói nhân vật được tổng hợp bằng WebAudio, không có file âm thanh.

## Luật
- Màn chờ: aura dâng. Màn xanh + Gà Bíp gáy = BỤP. Sát thương theo mili giây phản xạ (dưới 180ms là CHÍ MẠNG).
- 3 tim. Bụp sớm, mắc bẫy Vịt Giả Gà (màn đỏ, tiếng CẠC), thả sớm khi tích khí, bụp trượt điểm sáng hoặc ngủ quá 1 giây là mất 1 tim.
- Nhịp đôi: bụp cái thứ hai trong 0,45 giây được +25% đòn. Tích khí: giữ trên 0,6 giây rồi thả đúng lúc được +60%. Điểm sáng nhỏ: +30%.
- Sao: ★ thắng · ★★ không mất tim · ★★★ phản xạ trung bình dưới 250ms.
- Cấp bá khí theo 60 cú bụp gần nhất: Tân Thủ Cỏ → Võ Giả Tre → Cao Thủ Sắt → Vương Giả Vàng → Đế Vương Bụp.
- Link thách cửa: `https://ba-khi.vercel.app#c12-231` (cửa 12, 231ms).

## Lộ trình
1. **Đợt 1 (xong):** vùng Làng Tre + Chợ Đêm, 16 cửa, trùm Lý Trưởng Ngáp và Anh Hai Hàng Hiệu, thẻ chia sẻ, link thách cửa, lưu tiến trình.
2. **Đợt 2 (xong):** Sông Băng (nhịp đôi: BÍP BÍP bụp hai cái; tích khí: giữ rồi thả), Núi Lửa (khói che màn, bụp đúng điểm sáng đang nhỏ dần), Thiên Đình (trộn mọi mánh, Gà Bíp hô trước), trùm cuối Lão Rùa Thiên Tuế 3 hiệp, chế độ luyện tập trùm (5 tim, không tính sao). Nhân vật: Hỏa Yến (mở sau cửa 16, đòn +30%, cửa sổ hẹp hơn), Băng Nhi (sau cửa 24, tha 1 lần bụp sớm), Thạch Lão (sau cửa 32, 5 tim, cửa sổ rộng, đòn yếu).
3. **Đợt 3:** Cửa Hằng Ngày, bảng xếp hạng (Supabase), nhạc nền theo vùng.

Mọi tên, hình ảnh, thuật ngữ trong game là sáng tác mới.


## Lõi 2 (10/2025)

Trong lúc chờ gà gáy, đối thủ ra đòn có mũi tên báo trước: vuốt theo mũi tên để đỡ (chuỗi đỡ nhân sát thương cú bụp), mũi tên hồng run rẩy là đòn giả. Giữ ngón tay là cược x2.2, thả dưới 160ms thì thắng. Chế độ Chạy 60 giây: đối thủ ngẫu nhiên, tính điểm, kỷ lục. Chi tiết ở `docs/upgrade-plan.md`.

## Ngôn ngữ / Languages

Ba ngôn ngữ: tiếng Việt (BÁ KHÍ: Battle Aura), tiếng Anh (**Don't Trust the Duck**), tiếng Trung giản thể (**别信鸭子**). Lần đầu vào có hộp chọn ngôn ngữ, sau đó đổi bằng thanh 🇻🇳 🇬🇧 🇨🇳 trên trang chính hoặc `?lang=vi|en|zh`. Mỗi bản là viết lại hài (transcreation), không dịch: `src/lang/<mã>-world.js` và `src/lang/<mã>-story.js`; chuỗi giao diện ở `src/i18n.js`.

Build bản quốc tế (meta và mặc định theo ngôn ngữ): `node build.js https://donttrusttheduck.com en` hoặc `... zh`.
