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
- [ ] 8 Art pipeline + manifest + build step
- [ ] 9 Generate + curate assets (4 heroes, 15 enemies, 5 backgrounds)
- [ ] 10 assets.js loader + drawActor images + fallback
- [ ] 11 Wood UI, dialog portraits, og:image/favicon/manifest
- [ ] 12 Per-enemy move sets
- [ ] 13 Near-miss feedback
- [ ] 14 Listing assets + submit
**Blocker:** Canva hosts blocked by the environment network policy; full-res originals cannot be downloaded in-session.
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
