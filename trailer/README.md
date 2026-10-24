# Trailer ra mắt

Dựng video dọc 1080×1920 hoàn toàn bằng code, không cần phần mềm dựng phim.

1. `cards.html`: màn mở đầu (`#intro`) và màn kết (`#outro`), nhúng sprite và nền từ `src/`.
2. `record.js`: Playwright + CDP screencast (khung hình có dấu thời gian thật, dựng CFR 30fps) quay màn mở đầu, màn kết và phần bot tự chơi (cửa 1, thua ở cửa 2, 9, 16) kèm phụ đề; ghi `marks.json` mốc cảnh.
3. `music2.py`: nhạc chiptune theo cảnh (mở đầu u ám, cú đánh ở logo, chủ đề chính, tụt nhịp lúc bụp sớm, trùm dồn dập, K.O., kết nhẹ), đọc mốc thời gian từ `marks.json`.
4. Ghép bằng ffmpeg (libx264 + aac).

```bash
cd trailer
node -e "const fs=require('fs');fs.writeFileSync('cards.built.html',fs.readFileSync('cards.html','utf8').replace('/*SPRITES*/',fs.readFileSync('../src/sprites.js','utf8')).replace('/*WORLD*/',fs.readFileSync('../src/world.js','utf8')))"
node record.js            # tạo raw/intro.mp4, raw/game.mp4, raw/outro.mp4
python3 music2.py         # nhạc theo từng cảnh, đọc marks.json do record.js ghi ra
ffmpeg -i raw/intro.webm -i raw/game.webm -i raw/outro.webm -i music.wav \
  -filter_complex "[0:v]scale=1080:1920,fps=30,setsar=1[v0];[1:v]scale=1080:1920:flags=neighbor,fps=30,setsar=1[v1];[2:v]scale=1080:1920,fps=30,setsar=1[v2];[v0][v1][v2]concat=n=3:v=1:a=0[v];[3:a]loudnorm=I=-10:TP=-0.8:LRA=8[a]" \
  -map "[v]" -map "[a]" -shortest -c:v libx264 -crf 21 -pix_fmt yuv420p -movflags +faststart -c:a aac ba-khi-trailer.mp4
```

Lời giới thiệu nằm trong `record.js` (các dòng `sub(...)`) và `cards.html`. Sửa ở đó rồi quay lại.

## Giọng dẫn tiếng Anh

- `vo/script.json`: kịch bản lời dẫn, mốc thời gian theo cảnh (`gate1+0.3`, `boss+6.0`, `ko+0.9`...). Tên riêng viết theo cách phát âm (`Bah Key`, `Tee Boop`) vì từ điển tiếng Anh không có.
- `vo/synth.py`: sinh giọng bằng Kokoro 82M qua `sherpa-onnx` (chạy offline), ghép vào `music.wav`, hạ nhạc 9 dB khi có lời, xuất `final_audio.wav`.

```bash
pip install sherpa-onnx numpy
mkdir -p models && cd models && curl -L -O https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2 && tar xjf kokoro-multi-lang-v1_0.tar.bz2 && cd ..
python3 vo/synth.py 16      # 16 = am_michael (mặc định, không vang), 17 = am_onyx, 26 = bm_george
# rồi ghép video với -i final_audio.wav thay cho music.wav
```

## v3 (bản dựng theo kế hoạch "VN Ad studio")

Thứ tự: hook (bị vịt lừa, 0s) → logo → 10 cảnh chơi → outro. Toàn bộ nhịp cắt, zoom, flash, SFX lấy từ **log sự kiện trong trang** (`window.__ev`: go/fakesig/hit/hurt/won/lost với timestamp thật), không canh tay.

```
node record3.js                 # raw/{hook,logo,game,outro}.mp4 + .json (marks, events)
python3 edit3.py                # v3/video.mp4 + v3/timeline.json  (punch-in zoom ở hit/KO, flash trắng ở crit, flash đỏ ở hurt, dip đen ở đầu cảnh, upscale lanczos)
python3 music3.py               # v3/music.wav   (nhạc theo cảnh + SFX bíp/bụp/cạc/buzzer/sad-trombone đúng thời điểm sự kiện)
python3 vo/synth3.py            # v3/final_audio.wav (Kokoro am_michael, không vang; nhạc duck 0.3 dưới lời)
ffmpeg -i v3/video.mp4 -i v3/final_audio.wav -map 0:v -map 1:a -af loudnorm=I=-10:TP=-0.8:LRA=8 -c:v copy -c:a aac -b:a 192k ba-khi-trailer-v3.mp4
```

`SEG=hook` / `SEG=game` ghi lại một đoạn. Bot trong trang: `react` (ms), `earlyN` (bụp sớm n lần), `fakeOnce/foolOnce` (ép tín hiệu giả / mắc bẫy 1 lần), `fakeMax` (giới hạn số tín hiệu giả), `hpCap` (rút ngắn trận).
