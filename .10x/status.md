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
