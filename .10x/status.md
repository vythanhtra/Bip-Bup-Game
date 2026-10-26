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
