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

## Động cơ đối kháng, đợt 1 (2026-10-26)
- `B.fight` bật khi `FIGHT` (tắt bằng `window.__FIGHT_OFF` hoặc `CONFIG.fight=false`) và không phải run/daily/tutorial. Trạng thái: `count` → `fight` → `rend` → hiệp sau hoặc `endBattle`.
- Hàm: `startRound`, `tickFight`, `fightDown/fightUp`, `peck`, `punch(kind, charge)`, `superMove`, `heroHurt`, `endRound`. `planAttacks` nhận `atkProfileF()` và `B.eNext`; `tickAttacks`/`parry`/`swipe` chạy trong `fight` và gọi `heroHurt`.
- Số: đấm 9/9/móc 16, đòn nặng 14+22·charge, phản đòn ×2 trong 550 ms sau đỡ, đỡ-bị-gồng ×0.25 (40 % đầu telegraph), cắt đòn ×1.4, sau 4 đòn liên tiếp địch đỡ một đòn và phản công. Địch choáng 380 ms mỗi đòn trúng. Địch đánh 11+3·vùng (+4 trùm). Thanh Bá Khí +8/+14/+10 (đỡ)/+5 (bị đánh); tuyệt chiêu 40.
- Vẽ: `st` ảo (`hit`/`hurt`/`wait`/`ready`) để dùng lại hoạt ảnh cũ; KO bay/ngã khi `rend`. HUD: thanh HP hero + thanh Bá Khí thay tim, đồng hồ giây ở giữa.
- Test cũ chạy động cơ phản xạ qua `addInitScript(__FIGHT_OFF)` vì daily/run vẫn dùng nó.

## Động cơ đối kháng B (2026-10-26)
- Đấu sĩ `mkFighter` (`B.H`, `B.E`): x, y (âm = trên không), vx/vy, face, st (idle/walk/jump/crouch/block/atk/hit/down), atk/atkT/hitFlag, hp, meter, chain, blockHeld/blockT, hitUntil/downUntil/invUntil, counterUntil.
- `heroInput` đọc `IN` (giữ) + `PRESS` (bấm); `aiStep`/`aiAttack` quyết định mỗi 110–250 ms; `fightStep` chạy pha đòn, trọng lực, đẩy lùi, pushbox, phản chiếu `B.hhp/B.hp/B.meter` cho HUD; `resolveHit` xử chặn/đỡ chuẩn/sát thương/ngã.
- `drawFighters` vẽ từ trạng thái, có `a.mirror` trong `drawActor`; mũi tên báo đòn vẽ khi địch đang khởi động, '?' khi giả.
- Nút ảo `#pad` ẩn/hiện theo hiệp; `inClear()` khi thoát/kết thúc. `KEYMAP` cho bàn phím.
- Hook test: `__bakhi.key(k, v)`, `press(k)`, `fight()` trả cả hai đấu sĩ.
