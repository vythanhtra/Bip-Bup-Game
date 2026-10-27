# Status

**Phase:** Implementation — increment 1 live (66bdacf); increment 2 revised 2026-10-26 with Stardew-style art (ADR-003), starting with the art pipeline

## Review 2026-10-25
Đánh giá 12 trụ cột: `.10x/reviews/2026-10-25-game-pillars-review.md`. Điểm thấp nhất: sẵn sàng ra mắt 4/10, hình ảnh/UI 5/10, chuyển động 5/10. Bổ sung vào tăng 1 (trước test 50 người): sửa 4 lỗi chữ/HUD, ẩn tim cửa 0, og:image + favicon + manifest. Bổ sung vào tăng 2: khung hình đấm/đỡ/ngã, nhạc A/B + nhạc màn chính, chạy 60 giây theo vùng, listing quay sau khung hình mới.

## Tasks (increment 1)
- [~] 1 Supabase events table + RLS (project restored; migration awaiting owner approval in the Supabase MCP prompt)
- [x] 2 analytics.js + config + hooks + test
- [x] 3 straight-into-play
- [x] 4 tutorial gate 0
- [x] 5 portal build variant
- [ ] 6 50-stranger test (owner)
- [x] 7 Sửa 4 lỗi chữ/HUD + ẩn tim cửa 0 + tư thế thua (từ review) — bằng chứng reviews/shots/f-*.png
- [ ] 8 og:image, favicon, manifest.json (từ review, nay dùng bộ hình mới)

## Tasks (increment 2, revised 2026-10-26)
- [x] 8 Art pipeline (tools/art-build.py: key-out, trim, resize, quantise; manifest; ART=1 build flag; portal copy)
- [x] 9 Generate base assets — 47/47 (21 portraits, 20 sprites, 5 vertical backgrounds); still 200 px previews until full-res originals are downloaded; poses attack/hurt done for all 19 fighters (38 images; 85 total)
- [x] 10 assets.js loader + drawActor images (pose idle/attack/hurt, white-flash tint) + face() portraits + drawBg image + preload per gate + text-sprite fallback; 12 suites green with ART=1
- [~] 11 Wood UI, dialog portraits, og:image/favicon/manifest — scenery layer done (world intro cinematic, ambient life, camera breathing, map banners); wood UI + og/favicon pending
- [x] 12 Per-enemy move sets — MOVES in world.js (15 enemies, 2–4 combos each, Lão Rùa per phase), planner picks combos by gate difficulty, call-outs vi/en/zh, telegraph floor 420 ms; sim: 3–21 patterns per enemy
- [ ] 13 Near-miss feedback
- [ ] 14 Listing assets + submit
**Blocker:** Canva hosts blocked by the environment network policy; full-res originals cannot be downloaded in-session. Art preview edition lives at /preview/ (ART=1 OUT_DIR=public/preview), production stays on text sprites until full-res lands.
**Product:** BÁ KHÍ: Battle Aura / Don't Trust the Duck / 别信鸭子 — one-finger reflex brawler, browser, no install.
**Live:** https://ba-khi.vercel.app (Vercel, static). Repo: vythanhtra/Bip-Bup-Game, branch main. Deploy = push main + Vercel create_deployment.

## Built so far (32 commits)
- Core 1: beep→boop reflex with 40 gates, 5 worlds, 4 heroes, 15 enemies, fake signals, mechanics normal/double/hold/spot/reverse/count.
- Core 2 (2026-10-25): enemy attacks with telegraph arrows, parry by swipe or tap on arrow, feints, parry combo multiplier, hold-to-bet x2.2, 60-second run mode, dialog boxes replaced by bubbles, bigger sprites, camera zoom.
- Retention/social: Daily Gate (seeded, streak), 2-player same-phone versus, challenge links with ghost, result cards, share text.
- i18n: vi/en/zh with transcreated content, first-visit picker.
- Trailers v3/v4 (vi + en), launch docs, strategy docs.
- Tests: 11 Playwright scripts in tests/ (hooks via window.__bakhi), all green at HEAD.

## Not built
- Analytics (zero measurement), leaderboards/backend, per-enemy move sets, collection/meta progression, onboarding gate 0, shareable clip, PWA, distribution (portals, HN, creators).

## Blockers
- No usage data: every product judgement is still a guess. Supabase project exists but is paused.

- 2026-10-26: thêm 2 cảnh phụ mỗi vùng (10 nền mới, 15 sân đấu): cửa 1–3 cảnh chính, 4–5 cảnh hai, 6–8 cảnh ba, chế độ chạy chọn ngẫu nhiên. Nền từ thumbnail xuất 336×597 @96 màu, bộ ảnh 2.4 MB/3 MB. 10 suite Playwright: 0 lỗi.
- 2026-10-26: cảnh mở đầu chơi được (prologue, 5 cảnh, Owner chốt kịch bản): làng bình minh → Lão Rùa thả Chậm Chạp (nhạc chậm 50%) → bụp thử mà trượt → Bà Nội dạy luật + một lần BÍP/BỤP thật → ra cổng làng, thẻ tên BÁ KHÍ. Chạy một lần trước tutorial ở bản ảnh, giữ để bỏ qua, nút Cốt truyện thành Xem mở đầu. 2 nền mới (pro-rua, pro-banoi), `AUDIO.musicRate`. tests/protest.js 24/24, 10 suite cũ 0 lỗi.
- 2026-10-26 (fighting-pivot đợt 1): động cơ đối kháng chạy ở bản preview và production (cửa thường/luyện tập), daily/run/tutorial/versus còn ở động cơ phản xạ. tests/ftest.js 27/27, protest 24/24, 10 suite cũ 0 lỗi (chạy với `__FIGHT_OFF`). Còn đợt 2 (tuyệt chiêu riêng, trọng tài, bình luận, mánh vùng) và đợt 3 (tutorial, prologue cảnh 4, daily, thách đấu, versus, chỉ số hiển thị).
- 2026-10-26 (fighting-pivot, Owner chọn B): động cơ đối kháng 2D đầy đủ thay động cơ một ngón: di chuyển, nhảy, cúi, chặn/đỡ chuẩn, liên hoàn 👊👊💥, đá bay, Xung Bá Khí, tuyệt chiêu, AI địch máy trạng thái, nút ảo hai cụm + bàn phím. ADR-005. tests/ftest.js viết lại. Đợt 2: tư thế mới bằng ảnh, tuyệt chiêu riêng, trọng tài, bình luận, mánh vùng; đợt 3: tutorial, prologue, daily, thách đấu, versus.
- 2026-10-26 (đợt 2): tuyệt chiêu riêng 4 hero + 15 địch với 14 loại hiệu ứng (liên hoàn, cháy, đóng băng, dỗi dội ngược, ngã đè rồi ngủ, lóa, gáy giả, ngáp, bán hàng, thổi bay, hồi máu + giáp, khói, tim che màn, chậm); trọng tài Gà Bíp chạy ngang sân, ai đánh trúng bị mổ, địch bị mổ thì choáng 1,5 s; Bà Nội bình luận từ góc trên có chân dung; mánh vùng (giả đòn + vịt giả gà ở Chợ Đêm, sàn trơn Sông Băng, khói che đòn + đất nóng Núi Lửa, trộn ngẫu nhiên Thiên Đình); 15 hoạt cảnh KO riêng; 29 tư thế mới bằng ảnh (hero: đi, nhảy, chặn, ngã, chiêu; địch: chặn hoặc ngã). tests/f2test.js 19/19.
- 2026-10-26 (đợt 3): tutorial 5 bước theo lối đối kháng (chờ BÍP, đi tới, 3 đòn, chặn, tuyệt chiêu, hạ gục; không chết, không giờ); prologue cảnh 4 cần 3 cú đấm sau BÍP; lời luật mới ở STORY, Bà Nội, tagline (vi/zh/en); Cửa Hằng Ngày chạy động cơ đối kháng; mọi chỉ số ms thành thời gian KO qua `fmtMs` (màn kết quả, huy hiệu ngày, thách đấu, chia sẻ, thẻ ảnh, xếp hạng); Đấu Tay Đôi viết lại thành chuyền tay (chọn đấu sĩ, cùng cửa, so KO → thời gian → máu). tests/f3test.js 23/23; tests/vstest.js bỏ (phủ bởi f3test). Chế độ chạy 60 giây vẫn ở động cơ phản xạ (đợt sau).
- 2026-10-26 (đợt 4, Owner yêu cầu): kinh tế bánh Bà Nội (qua cửa 10+6×vùng, +5 mỗi sao, lần đầu ×2, trùm ×2, liên thủ ×1,5, daily 30, chạy điểm/40); cửa hàng 10 món 5 bậc theo vùng đã tới (3 bánh chưng +20 máu, 4 trang phục đổi màu + hiệu ứng, 5 vũ khí có hiệu ứng và biểu tượng tay); gear áp vào máu, tầm, sát thương, chip, cửa sổ đỡ chuẩn, phản đòn, Bá Khí, tốc độ. Địch tinh quái từ Chợ Đêm: ôm vật xuyên chặn khi hay chặn, đánh đón khi nhảy, chặn gấp đôi khi spam đấm, đỡ chuẩn từ Núi Lửa. 5 cửa liên thủ (7, 15, 23, 31, 39): hai địch thay phiên công/che, gục một con thì con kia nổi điên. tests/f4test.js 21/21.

## Đợt 5 (2026-10-26): cảm giác chuyển động, giữ khung dọc
- Sân rộng 1,3 lần màn hình, camera trôi theo Tí và đối thủ gần nhất, thu nhỏ tới 0,78 khi hai người cách xa hơn màn hình; nền trôi 35 % (parallax). `B.arenaW`, `B.camX`, `B.camZ`, `camTick`.
- Nhảy: 60 ms lấy đà (`prejump`) rồi mới rời đất, 90 ms hạ đất (`land`) không được ra đòn; kéo dãn theo vận tốc dọc, bẹp khi chạm đất, bụi ở chân.
- Lướt: chạm đúp ◀ ▶ trong 260 ms (`inSet` → PRESS `dl`/`dr`); lướt tới 180 ms, có thể hủy bằng đòn sau 90 ms; lùi nhanh 220 ms, bất tử 160 ms; bóng mờ 2 lớp. AI lướt vào từ vùng 2.
- Đi bộ: luân phiên sprite đi/đứng 3,5 Hz khớp nhịp nhún, bụi mỗi bước. Hitstop 55/75/100 ms theo sát thương; rung khi dính đòn; bụi khi trượt sau knockback.
- Chữ nổi: `scr: 1` cho chữ neo màn hình, còn lại quy đổi qua `w2s`. Bong bóng thoại cũng quy đổi.
- Kiểm chứng: `tests/f5test.js` 20/20; f1–f4, protest qua (f2test đổi fixture trọng tài sang `B.arenaW`); 9 suite cũ 0 lỗi.
- Chưa làm: khung ngang (Owner giữ dọc), thêm khung vẽ đi bộ thật (dung lượng), AI lùi nhanh.

## PM 2026-10-26: portal-submission proposed
Phase: Strategy Complete — Owner accepted approach B 2026-10-26; next: Design (Architect) (2 weeks: measure + portal skeleton, then present + submit). File: .10x/decisions/product-manager/portal-submission.md. Content increments paused until 100 strangers have played.

## Architect 2026-10-26: portal-submission design proposed
Phase: Design (Architect) — architecture 1 proposed (one source, editions by build, presentation by input kind and aspect, pausable game clock, one ad seam). ADR-006, ADR-007 proposed. Waiting for Owner alignment, then Staff Engineer + EM.

## 2026-10-26: Design Complete — Owner accepted architecture 1, ADR-006, ADR-007. Next: Staff Engineer + EM plan, then implementation.

## portal-submission — implementation log (2026-10-26)
- [x] 1–2 Game clock `gnow()` + `PAUSE` + paused overlay + resume on gesture + build guard; hooks pause/resume/clock/paused; tests/f6test.js. 15 suites green after the swap.
- [x] 3 Editions: relative imgBase by depth, `public/portal/crazygames` and `public/portal/poki` (art, en, SDK), `tools/portal-zip.sh` → dist/<portal>.zip (ignored).
- [x] 4 `INPUT.kind` + `setPad()` + key hint (vi/en/zh) + `input_kind` event.
- [x] 5 HUD scale `--ui` from min(W,H).
- [x] 6 Wide-frame background: height-fit + mirrored side tiles (ADR-007 consequence updated); `bgMode()` hook; 5 worlds checked at 1280×720.
- [x] 7 Portal edition: Play skips the prologue; `first_beep` event.
- [x] 9 `ADS.maybe(done, gate)` at the result-continue seam and the won auto-advance; wall-clock throttle 3 min; pause + mute around the ad; 12 s watchdog; `ad` event. `portal.js` unchanged (adBreak already covers both SDKs).
- [x] 8 Supabase: `public.events` created 2026-10-27 (Owner ran `supabase/migrations/0001_events.sql` in the SQL editor). Verified: RLS on, one policy `events_anon_insert` (INSERT, anon); anon can insert (test row in a rolled-back transaction), anon SELECT is denied (42501), anon DELETE not granted; table empty after verification. The build's ANALYTICS url/key point at the same project. Funnel queries: docs/analytics.md.
- [ ] 10 Internal playtest (Owner), 11 tuning, 12 listing assets, 13 submission.
- Tests: 17 suites green (ftest…f6test, portaltest, protest, 9 legacy).

## 2026-10-27: phone / computer choice (Owner feedback: "on a computer I don't know how to play with the keyboard")
- Title: 📱 Phone / 💻 Computer bar (preselected from the pointer type, saved in `save.device`; an explicit choice disables auto-switching).
- Computer: key legend along the bottom instead of the pad (keys light up, clickable with the mouse), keyboard sheet before the first computer fight (game clock paused behind it; K or ⌨️ Controls reopens it), Esc/P pause, Space blocks only (it also threw a jab before), Enter plays / next gate, R retry, M map, Esc home; tutorial and prologue prompts name the keys (`TK()` picks `…PC` texts).
- Phone: unchanged (pad).
- Tests: tests/f7test.js 27/27; 18 suites green (ftest and p7test flaky once each; p7test flakes at the previous commit too).
- 2026-10-27: keyboard layout research (docs/keyboard-layout.md): layout 1 WASD + J K L (default), layout 2 arrows + Z X C, both live; legend/sheet/prompts follow the last-used cluster; Space blocks, P pauses; Unikey/IME detection warns once and falls back to arrows; H opens the sheet. f7test extended (34 checks); 17 suites green.
- 2026-10-27: hold back = block (one hand moves/blocks, the other attacks); I blocks for the right hand; desktop two-column title and result, wider map/shop grids, compact keyboard sheet on short screens. No overflow at 1280×600, 1366×625, 1280×720, 1536×730, 1920×940. 17 suites green.
- 2026-10-27 (Owner feedback round): (1) language bar back on portal editions, player choice beats the build default; (2) pause overlay keeps the frozen fight under one dim layer and says why it paused (tab switch / P key); (3) HUD hero HP bar fixed — it shared the `.hero` hero-card class and always looked nearly empty since the fight engine; (4) progression: items unlock by clearing a set gate (2, 3, 5, 8, 11, 16, 19, 24, 28, 32), replays pay a quarter plus 10 per new star, daily pays once a day, result screen announces newly unlocked items; (5) gear is visible: outfit colour over the sprite, bigger weapon in hand, gear icons beside Tí's name, round-start "Gear: … · HP n" toast, shop shows what is worn, max HP and plain-language effects with numbers. 17 suites green.
- 2026-10-27: 17 painted 16:9 desktop stages (img-src/bgw, Canva ids in docs/art-manifest.json, kind bgw) drawn cover-fit on wide frames (W/H ≥ 1.2) instead of the mirrored, darkened 9:16 sides; title canvas and prologue use them too. Built from Canva 200-px previews at 3x (597×336), the same detail level as the portrait set; +1.07 MB loaded only on wide screens. media.canva.com still answers 403 in this session, so the full-res originals are pending; re-run tools/art-build.py after dropping originals into img-src/bgw/ (the script caps output at 1280 wide). 17 suites green.
- 2026-10-27 (Owner: "the intro does not tell why Tí has to save the world"): prologue scene 3 now opens with Grandma's mission talk (`PRO_DLG`, vi/en/zh) before the rule: the curse got into Tí's fist too; Gà Bíp is the only rooster still crowing on time and the curse can't hold a fist that strikes on its BEEP (that is Bá Khí, which Grandma trained Tí in for ten years); Grandma is 78 and cursed, Tí is her only student; the Turtle sits in Thiên Đình, his goons hold 40 gates across 5 lands, each gate broken makes that land faster; stake: the Tết bánh chưng (paid off in the gate-40 ending). STORY narration names Thiên Đình, Tết and the route. Gate 1 dialogue unchanged. protest/f3test tap through `PRO_DLG.length + 1` lines; entest/zhtest check the en/zh merge. 16 suites green; entest/zhtest fail on the same older checks at the previous commit (text-edition versus/dialog expectations), unrelated.
