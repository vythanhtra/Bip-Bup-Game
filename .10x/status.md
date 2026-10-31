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
- 2026-10-27 (Owner: review items 1 and 2 approved; 3 and 5 approved in direction only; 4 and 6 need design first; no commit/push without a separate instruction). Work kept uncommitted on local branch `claude/telemetry-teaching` (base 432c832).
  - Item 1, balance telemetry: gate_clear / gate_lose / quit from the fight engine send ms = fight time and x = `f1|mode|hero|W/L/Q|hp/hmax|rounds|tries|first|sup.rush|l h g s e r p|gear`, recorded where the engine takes the hero's HP (8 sites); tries per gate saved with progress; reflex `hearts`/`round` no longer sent from fights. docs/analytics.md: field table, SQL (first-try clear rate and win rate with 95 % Wilson intervals, time, damage sources, quit rate), verified on the live database inside a rolled-back transaction; two old queries fixed (`t` → `at`). tests/f8test.js 28/28.
  - Item 2, teaching: every player-facing line rewritten to the fight engine's real rules in vi/en/zh (gate dialogue, gate intros, world descriptions, hero perks/bios); `FIGHT_PLAN` introduces each world's threats one at a time (duck 9, grab 11, anti-air 13, ice 17, hook 19, smoke 25, hot ground 27, perfect block 29; hero tools jump 2, dash 4, tag team 7; mix 33), lesson gates open in the dialogue box and Gà Bíp repeats the lesson the first time it happens; the unblockable grab's 🤲 is redrawn above flash/hearts/smoke. tests/f9test.js 39/39, twice.
  - Regression: 18 of 20 suites pass; entest and zhtest fail only on checks that failed at 432c832 too (gate 1 line without "BOOP", "EN dialog", zhtest page lookup). f2test/f8test lava checks moved from gate 25 to 28 (25 now teaches smoke alone); entest/zhtest gate-14 checks now expect the fight-mode text instead of the removed reverse rule.
  - Owner feedback (same day): floating hit text covered the screen during combos. Hits from one attacker on one target within 0.7 s now share one label above the target's head ("MÓC · NGÃ ×3 -38"); hit labels are smaller, live 0.9 s instead of 1.4 s and stay inside the screen; the top hint line hides while Grandma's box is up or Gà Bíp is saying the same thing. Measured on a two-combo + super run: at most 4 labels on screen before, 2 after. f9test adds the check (41/41). Still uncommitted on `claude/telemetry-teaching`.

## 2026-10-28: ADR-008 bộ kỹ năng nhân vật (bản nháp, chờ duyệt)
- Owner chốt bốn quyết định:
  - vũ khí riêng thay 5 vũ khí dùng chung (cửa hàng cũ giữ sau công tắc)
  - mở nhân vật ở cửa 8/16/24
  - "Dỗi" thành thế phản kích có giới hạn
  - Băng Nhi có đòn tầm xa
- Đã đối chiếu nhánh và SHA mới nhất trước khi viết:
  - `origin/claude/telemetry-teaching` ở c5ae809. Hai commit của Owner sửa truy vấn qua cửa lần đầu trong `docs/analytics.md`; mã game giống 8880352.
  - `main` ở 432c832.
- Đã viết `.10x/adrs/008-hero-combat-kits.md` (Proposed) và `.10x/specs/2026-10-28-hero-kits-spec.md`:
  - 4 bộ kỹ năng theo khung trạng thái → kích hoạt → hủy → máu/tài nguyên → hiển thị → khắc chế → số liệu
  - luật miễn khống chế toàn engine
  - số liệu `f2`
  - bản thử trên cửa 12 và 16, tiêu chí A1–A5, 5 câu hỏi mở, 24 giả thuyết
- Đính chính G4-1 trong biên bản thẩm định: nhân vật chính có 6–8 hình, đối thủ có 4.
- Chưa sửa mã. Chưa commit: nhánh cục bộ `claude/hero-kits-adr`, tách từ c5ae809.
- 2026-10-28: Owner trả lời ba câu, đã ghi vào ADR-008 và đặc tả (chưa commit):
  - **Q2:** nâng cấp vũ khí mua bằng xu. Bậc 2–4 bày bán khi qua cửa 16/24/32, giá 110/180/260 (H25). Phải đo kinh tế xu: đủ bốn bộ là 2 200 xu so với 910 trước đây (H26).
  - **Q3:** bỏ "được tha" của Băng Nhi.
  - **Q5:** thêm hai luật AI. Mục 10 của đặc tả liệt kê 10 test âm và 2 test dương.
  - Còn mở: Q1 (áo đè bản sắc nhân vật), Q4 (hệ số đòn Hỏa Yến), duyệt ADR-008.
- 2026-10-28: Owner duyệt ADR-008 (Accepted) và giao Implementer chọn Q1, Q4:
  - **Q1:** khi công tắc bật, Áo tiên chỉ cộng +50 ms vào cửa sổ đỡ chuẩn riêng của từng người; Áo dài đỏ ×1,3 áp cho cả Nhiệt (H27).
  - **Q4:** Hỏa Yến 1,15 trong bản thử (H7).
  - Owner yêu cầu gộp vào `main`: gồm phần ghi số liệu, lời dạy 40 cửa, chữ nổi gọn (`claude/telemetry-teaching`) và ADR-008 cùng đặc tả (`claude/hero-kits-adr`).
- 2026-10-28, trước khi gộp vào `main`:
  - **Lỗi:** f9test lỗi 1 trong 4 lần chạy. Nguyên nhân là lời nhắc của Gà Bíp dùng chung bong bóng với câu thoại của địch, nên bị đè ("Cạc... cục!", "Ai bảo bụp!").
  - **Sửa:** lời nhắc có bong bóng riêng, giữ 2,6 s. Câu thoại của địch nằm phía trên biểu tượng 🤲/⬆️, không che lên. f9test qua 6/6.
  - **Hồi quy:** 18/20 bộ test qua. entest và zhtest giữ đúng các lỗi có từ trước. p3test (engine phản xạ cũ, `__FIGHT_OFF`) lỗi ngẫu nhiên ở cả c5ae809 (4/10) lẫn bản này (3/10), là lỗi có sẵn.

## 2026-10-28: bản thử bộ kỹ năng (`?kits=1`)
- Nhánh cục bộ `claude/hero-kits-proto`, tách từ `main` 4111ad7. **Chưa commit.**
- **Đã làm:**
  - Bốn bộ kỹ năng theo đặc tả: chuỗi của Tí, Nhiệt của Hỏa Yến, Hàn Kình theo ba khoảng cách của Băng Nhi, đá và Thế Núi của Thạch Lão.
  - Luật miễn khống chế: đóng băng 2 s; trùm chỉ bị cắt 0,4 s, sau đó miễn 8 s.
  - Hai luật AI: H14 với Băng Nhi, H22 với Thế Núi.
  - Q1, Q3, Q4; số liệu `f2`.
  - Tất cả nằm sau công tắc. Khi công tắc tắt, đường mã cũ giữ nguyên.
- **Test:**
  - `tests/k1test.js` ALL PASS ×3, gồm 10 test âm và 2 test dương của hai luật AI.
  - Tắt công tắc: 18/20 bộ test như trước. entest, zhtest và p3test có lỗi từ trước.
- **Chữ nổi của bộ kỹ năng:**
  - Mỗi nhân vật chỉ có một dòng, dòng mới thay dòng cũ, nằm trên nhãn đòn.
  - Số chuỗi của Tí hiển thị dưới chân để không đè nhãn đòn.
  - Đã chụp màn hình kiểm tra.
- **Bot đo:** `tools/kitbot.js`, 720 trận cộng 240 trận đối chứng; kết quả ở mục 8 của đặc tả.
  - A3, A4, A5 đạt.
  - **A1 không đạt, nhưng lỗi có từ trước:** đấm bừa thắng 100 % cửa 12 và 16 kể cả khi tắt bộ kỹ năng.
  - A2 không đo được vì tỷ lệ thắng bão hòa.
  - Đây là vấn đề độ khó của engine chiến đấu (giả thuyết: khóa địch bằng đòn nhẹ), nằm ngoài phạm vi ADR-008. Cần Owner quyết định có mở việc riêng không.
- **Bot không gửi dữ liệu:** bot chặn yêu cầu tới Supabase. Trong lần chạy này, proxy của môi trường cũng đã từ chối, nên không có trận bot nào vào bảng `events`.
- 2026-10-29: Owner báo chữ còn đè nhau khi ra đòn liên tục (ảnh: "ĐẤM ×4 / -33" đè lên bong bóng "Au!" của địch, "CHUỖI" đè nhãn đòn).
  - **Sửa:** câu kêu của địch khi trúng đòn chờ trong lúc nhãn đòn còn hiện trên đầu địch. Nhãn tắt thì câu đó mới hiện, trong phần còn lại của 1,6 s. Câu BÍP thật/giả và lời Gà Bíp luôn hiện vì là luật chơi. Áp dụng cả khi tắt bộ kỹ năng.
  - Số chuỗi của Tí đã chuyển xuống dưới chân từ hôm trước.
  - **Test:** f9test thêm 3 kiểm tra (ẩn khi có nhãn, hiện lại khi nhãn tắt, câu BÍP vẫn hiện), qua 3/3.
  - **Toàn bộ test:** như trước. entest và zhtest giữ lỗi cũ. p3test lỗi ngẫu nhiên 1/4, như ở c5ae809. p2test chỉ báo yêu cầu mạng bị chặn trong môi trường này.
  - Chưa commit.

## 2026-10-31: khoảng cách dòng (Owner: "hàng trên và hàng dưới bị dính vào nhau")
- **Nguyên nhân:** nhiều đoạn chữ dùng giãn dòng mặc định của trình duyệt. Với Be Vietnam Pro mức này chỉ khoảng 1,23–1,29 lần cỡ chữ. Vài chỗ còn đặt cứng thấp hơn:
  - mô tả món đồ: 1,3
  - mô tả nhân vật: 1,2
  - tiêu đề kết quả: 1,05
  - logo tiếng Anh: 1,0
  - Chữ hoa tiếng Việt chồng hai dấu (Ấ, Ể) nên dòng dưới chạm dòng trên.
- **Đã đo, không chỉ nhìn:** script đo mọi đoạn chữ xuống dòng trên tiêu đề, bản đồ, cửa hàng, bảng phím, hộp thoại 4 cửa, màn thắng/thua. Chạy cho vi/en/zh ở 360 px, 430 px, 1280 px. Có 80+ chỗ dưới 1,3.
- **Sửa:**
  - Giãn dòng chung 1,45 cho cả trang.
  - Nút 1,4; mô tả món đồ 1,45; mô tả nhân vật 1,4; tiêu đề kết quả 1,2; logo tiếng Anh 1,1 (chữ in hoa không dấu).
  - Bong bóng thoại và gợi ý của Bà Nội trên canvas: 1,2/1,25 → 1,4.
  - Thanh trên cùng trong trận giữ nguyên ('normal'): đã đo, vị trí từng phần tử khớp bản cũ ở 430 px và 1280 px.
- **Ảnh hưởng bố cục:**
  - Trên điện thoại, màn tiêu đề dài thêm 34–42 px. Màn này vốn đã cuộn, và nút "VÀO GAME" vẫn nằm trong màn đầu.
  - Trên máy tính, màn tiêu đề không đổi.
- **Test:**
  - Mới: `tests/lhtest.js`, đo trên 4 cấu hình. Lỗi trên bản trước khi sửa, qua trên bản sau khi sửa.
  - Toàn bộ test như trước: entest/zhtest giữ lỗi cũ, p3test lỗi ngẫu nhiên.
- Chưa commit.
