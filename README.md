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
| `src/game.html` | giao diện, HUD, trận đấu trên canvas, sao, chia sẻ, link thách cửa |
| `build.js` | gộp `src/` thành thư mục tĩnh `public/` (Vercel phục vụ thư mục này) |

```bash
node build.js https://ba-khi.vercel.app   # sinh public/index.html, sprites.js, world.js, game.js
```

Không có bước cài đặt. Mở `public/index.html` là chơi được.

## Luật
- Màn chờ: aura dâng. Màn xanh + Gà Bíp gáy = BỤP. Sát thương theo mili giây phản xạ (dưới 180ms là CHÍ MẠNG).
- 3 tim. Bụp sớm, mắc bẫy Vịt Giả Gà (màn đỏ, tiếng CẠC) hoặc ngủ quá 1 giây là mất 1 tim.
- Sao: ★ thắng · ★★ không mất tim · ★★★ phản xạ trung bình dưới 250ms.
- Cấp bá khí theo 60 cú bụp gần nhất: Tân Thủ Cỏ → Võ Giả Tre → Cao Thủ Sắt → Vương Giả Vàng → Đế Vương Bụp.
- Link thách cửa: `https://ba-khi.vercel.app#c12-231` (cửa 12, 231ms).

## Lộ trình
1. **Đợt 1 (xong):** vùng Làng Tre + Chợ Đêm, 16 cửa, trùm Lý Trưởng Ngáp và Anh Hai Hàng Hiệu, thẻ chia sẻ, link thách cửa, lưu tiến trình.
2. **Đợt 2:** Sông Băng (nhịp đôi, tích khí), Núi Lửa (khói che màn), Thiên Đình (trùm cuối Lão Rùa Thiên Tuế 3 hiệp). Mở Hỏa Yến, Băng Nhi, Thạch Lão.
3. **Đợt 3:** Cửa Hằng Ngày, bảng xếp hạng (Supabase), nhạc nền theo vùng.

Mọi tên, hình ảnh, thuật ngữ trong game là sáng tác mới.
