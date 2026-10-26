# SDE: portal-launch-sprint — increment 1

Built (commit after this file):
- src/analytics.js: queue + fetch keepalive to Supabase REST, lazy CONFIG, 30-s heartbeat, flush on hide. Hooks in game.html: load, play, gate_start, gate_clear, gate_lose (with last hurt kind), quit, run_end, share (text/link/fb).
- src/portal.js: adapter for CrazyGames SDK v3 / Poki SDK, no-ops otherwise. Calls: init, gameplayStart (startGate), gameplayStop (result/quit), happy (boss KO), adBreak (unused yet).
- build.js: `node build.js <url> [lang] [crazygames|poki]` → public/ or public-portal/ plus generated config.js (analytics URL/key, portal, version=git sha).
- Straight-into-play: PLAY → tutorial on first visit, else next unlocked gate; map via new title button, quit and result.
- Tutorial gate 0: synthetic gate (Grass Guard Trainee, 34 hp), scripted steps parry → feint → beep, every mistake forgiven, finishes into gate 1; `save.seen.t0`.
- Portal edition hides Facebook button, language bar and picker; language fixed at build.
Deviations: analytics key baked in build.js (public anon key by design). Tech debt: public-portal/ committed as an artifact; no automated deploy for it yet.
Tests: tests/p8test.js (11 checks) + all previous suites green. Console shows failed POSTs in the sandbox (no network) — expected.

## Cảnh phụ theo cửa (2026-10-26)
- `BG_SCENES`/`sceneKey(w, n)` trong `src/world.js`; `BG_PICK` đặt ở `startGate` (chạy: ngẫu nhiên trong `nextRunEnemy`; màn chính luôn `langtre`); `drawBg` dùng `BG_PICK` khi cùng vùng, rơi về nền chính nếu thiếu ảnh.
- `tools/art-build.py`: nền từ nguồn thumbnail xuất tối đa 3× (336×597), 96 màu; khi có bản gốc full-res sẽ tự ra 540×960.
- Thẻ bản đồ giữ nền chính của vùng.

## Prologue chơi được (2026-10-26)
- Máy trạng thái `PRO` trong game.js (`startPrologue`, `proScene`, `proTap`, `proLoop`, `proFinish`), tách khỏi `B`; vòng vẽ riêng `proRaf`. Cảnh 3 dùng lại hộp thoại DOM `#dlg` với `DIALOG[1]`.
- Vào: `btn-play` khi `!save.seen.pro && IMG_MODE()`, kết thúc rơi vào tutorial hoặc cửa đang mở. Replay: `btn-story` ở bản ảnh. Bỏ qua: giữ 650 ms trên canvas hoặc Escape.
- Nhạc: `AUDIO.musicRate(r)` trượt bpm về `bpm0*r` trong `tick` (cảnh 1–3 ở 0.5, về 1 khi bụp trúng).
- Không ảnh (`pro-rua`, `pro-banoi`) thì rơi về nền thủ tục của Làng Tre; bản text không bao giờ mở prologue (test `text edition`).
- Hook test: `__bakhi.startPrologue/pro/proTap/proSkip`.
