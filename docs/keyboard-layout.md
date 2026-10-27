# Bố trí bàn phím (nghiên cứu 2026-10-27)

## Kết luận
Hai cách bấm cùng chạy song song; bảng phím, thanh phím và lời hướng dẫn tự đổi theo cách người chơi vừa dùng (lưu trong `save.layout`).

| Hành động | Cách 1 · hai tay (mặc định) | Cách 2 · mũi tên |
|---|---|---|
| Đi | A D | ← → |
| Nhảy | W | ↑ |
| Cúi | S | ↓ |
| Đấm | J | Z |
| Đòn nặng | K | X |
| Bá Khí | L | C |
| Chặn (giữ) | Space | Space |
| Tạm dừng | P (Esc cũng được) | P (Esc cũng được) |

## Lý do
- **WASD + J K L là quy ước của game đối kháng trên trình duyệt** (FIghtcore, Fighting game prototype, Super Color Combat, cộng đồng Tekken trên PC). Hai bàn tay tách rộng, tay phải nằm trên hàng phím chính (J có gờ), không phải với tới cụm mũi tên.
- **Laptop nhiều máy có phím ↑ ↓ nửa chiều cao** (MacBook, Framework), khó bấm nhanh; cách 1 không phụ thuộc cụm mũi tên.
- **Mũi tên + Z X C vẫn giữ** cho người quen kiểu game thùng/giả lập, và là đường lui khi bộ gõ tiếng Việt bật.
- **Unikey kiểu Telex nuốt phím W (thành ư), S, J (dấu)**: game phát hiện ký tự có dấu, Backspace giả hoặc `Process` trong lúc chơi, hiện cảnh báo một lần và chuyển sang cách 2.
- **Chặn bằng Space, không quảng bá Shift**: bấm Shift 5 lần liền bật hộp Sticky Keys của Windows và kéo người chơi ra khỏi game. Shift vẫn chạy cho ai quen.
- **Tạm dừng bằng P**: Esc trên trình duyệt còn thoát toàn màn hình; Esc vẫn tạm dừng khi không ở toàn màn hình.
- **Tránh Ctrl, Alt, Tab**: tổ hợp với Ctrl/Alt (Ctrl+W đóng tab) không chặn được trong trình duyệt.
- **Game chặn cuộn trang** khi bấm mũi tên và Space (yêu cầu của CrazyGames).
- Dùng `KeyboardEvent.code` (vị trí phím vật lý), nên bàn phím AZERTY vẫn bấm đúng vị trí.

## Nguồn
- Bố cục game đối kháng trình duyệt: https://biggpower08.itch.io/fightcore, https://jameseneir.itch.io/fighting-game, https://kbbasic16.itch.io/super-color-combat, https://gamersdecide.com/articles/tekken-7-best-keyboard-controls?page=1%2C0, https://www.crazygames.com/game/eko-elemental-knock-out
- Sticky Keys: https://www.digitalcitizen.life/problem-sticky-keys-takes-me-out-of-games/
- Unikey khi chơi game: https://quantrimang.com/cong-nghe/cach-dung-unikey-khong-nhay-phim-khi-choi-game-199424, https://gearvn.com/blogs/cong-nghe/meo-tat-unikey-nhanh-khi-choi-game-ma-khong-can-dung-chuot-tren-windows-10
- Phím mũi tên nửa chiều cao: https://morrick.me/archives/7451, https://community.frame.work/t/keyboard-arrow-keys/2275/8
- Ghosting khi bấm nhiều phím: https://www.hp.com/us-en/tech-takes/gaming/explainer/what-is-keyboard-ghosting.html
- Esc và toàn màn hình, Ctrl/Alt: https://developer.chrome.com/blog/better-full-screen-mode, https://www.abratabia.com/game-controls/keyboard-and-mouse.php
- Chặn cuộn trang: https://docs.crazygames.com/resources/html5-resources
