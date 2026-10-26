# Handoff

## Current Handoff
**From:** Product Manager (2026-10-26) → **To:** Architect (after Owner alignment)
**Context:** Owner chose: strangers via international portals, both desktop 16:9 (keyboard) and phone portrait, Supabase 4-event measurement approved, 2-week deadline. Recommendation B in `.10x/decisions/product-manager/portal-submission.md`: increment 1 (days 1–5) portal build + SDK adapter for CrazyGames and Poki, pad hidden on keyboard/mouse + key hints, events table migration + `gate_clear`/`first_beep`/`input_kind`, Play → gate 1 in ≤ 10 s with prologue optional, no outbound links in the portal build, internal playtest link by day 5; increment 2 (days 6–14) 16:9 background treatment (height-fit + blurred side extension), desktop HUD scale, tuning from playtest, listing assets, submit. P3: run mode on fight engine, landscape phones, leaderboard, monetization, new content. Architect: decide portal adapter boundary (one `portal.js` with two drivers), the 16:9 background treatment (code only, no new art), and the events schema (reuse ADR-001).

## Previous Handoff

**From:** QA review → **To:** SDE (và Owner cho hộp thoại Supabase)
**Context:** Review 12 trụ cột ở `.10x/reviews/2026-10-25-game-pillars-review.md`. Làm ngay mục A (1,5 ngày): 4 lỗi chữ/HUD (src/game.html:88-89, 593, 595, 617), ẩn tim cửa 0, tư thế thua, og:image + favicon + manifest. Rồi tiếp đợt 2 với 3 mục bổ sung (khung hình, nhạc A/B, chạy 60 giây theo vùng). Bảng events vẫn chờ Owner duyệt.

## Previous Handoff
**From:** EM/Senior → **To:** SDE
**Context:** Approach B accepted. ADR-001 (analytics) and ADR-002 (portal variant) written. Ordered tasks in .10x/decisions/engineering-manager/portal-launch-sprint.md; implementation notes in senior-engineer/portal-launch-sprint.md. Start with tasks 1–5 of increment 1.

## Older Handoff
**From:** 10x-team Discovery → **To:** Product Manager
**Context:** Owner reports "nobody plays, game feels monotonous". Two rounds of upgrades shipped (retention layer, then Core 2 gameplay) without any measurement. PM must decide the next sprint. Candidate items are listed in docs/upgrade-plan.md and the gap review in the conversation of 2026-10-25: analytics + 100-stranger playtest, per-enemy move sets, collection, near-miss feedback, leaderboard (needs backend), time-to-fun under 5 s, shareable KO clip, tutorial gate 0, distribution.
**Feature slug for the next sprint:** `portal-launch-sprint`. PM recommendation written to .10x/decisions/product-manager/portal-launch-sprint.md (approach B, two increments). Waiting for owner alignment before Architect starts.

## Handoff History
- 2026-10-25 Discovery → PM (this entry)

- Prologue xong (xem status). Còn: Bà Nội toàn thân (cảnh 3–4 hiện chỉ có bong bóng + chân dung), bản gốc full-res, wood UI, og/favicon, task 13, 14.
