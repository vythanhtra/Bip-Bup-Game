# Trailer ra mắt

Dựng video dọc 1080×1920 hoàn toàn bằng code, không cần phần mềm dựng phim.

1. `cards.html`: màn mở đầu (`#intro`) và màn kết (`#outro`), nhúng sprite và nền từ `src/`.
2. `record.js`: Playwright quay màn mở đầu, màn kết và phần bot tự chơi (cửa 1, 2, 9, 16) kèm phụ đề giới thiệu.
3. `music.py`: sinh nhạc chiptune 8-bit bằng numpy.
4. Ghép bằng ffmpeg (libx264 + aac).

```bash
cd trailer
node -e "const fs=require('fs');fs.writeFileSync('cards.built.html',fs.readFileSync('cards.html','utf8').replace('/*SPRITES*/',fs.readFileSync('../src/sprites.js','utf8')).replace('/*WORLD*/',fs.readFileSync('../src/world.js','utf8')))"
node record.js            # tạo raw/intro.webm, raw/game.webm, raw/outro.webm
python3 music.py 160      # tạo music.wav dài 160 giây
ffmpeg -i raw/intro.webm -i raw/game.webm -i raw/outro.webm -i music.wav \
  -filter_complex "[0:v]scale=1080:1920,fps=30,setsar=1[v0];[1:v]scale=1080:1920:flags=neighbor,fps=30,setsar=1[v1];[2:v]scale=1080:1920,fps=30,setsar=1[v2];[v0][v1][v2]concat=n=3:v=1:a=0[v];[3:a]afade=t=in:st=0:d=1,volume=0.9[a]" \
  -map "[v]" -map "[a]" -shortest -c:v libx264 -crf 21 -pix_fmt yuv420p -movflags +faststart -c:a aac ba-khi-trailer.mp4
```

Lời giới thiệu nằm trong `record.js` (các dòng `sub(...)`) và `cards.html`. Sửa ở đó rồi quay lại.
