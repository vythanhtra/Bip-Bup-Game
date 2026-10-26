# Handoff

## Current Handoff
**From:** Architect (2026-10-26) → **To:** Staff Engineer + Engineering Manager (after Owner alignment)
**Context:** Design in `.10x/decisions/architect/portal-submission.md`, ADR-006 (pausable game clock `gnow()`/`PAUSE`), ADR-007 (presentation by input kind and aspect). Seven components: editions under `public/portal/<portal>/` with relative `imgBase` + zip script; `portal.js` gains `onPause/onResume`; `gnow()` replaces 53 `performance.now()` call sites with a build-time grep guard; `INPUT.kind` drives pad/hints, HUD scales with min(W,H), wide frames get height-fit background + blurred side extension; portal edition Play → tutorial/gate with prologue behind Story; `ADS.maybe(done)` at the result-continue seam (≥ 3 min apart, never before gate 1, 12 s watchdog); Supabase `events` migration + `first_beep`, `input_kind`, `ad` events. Migration order: clock first (all suites green), then editions, then presentation, then ads + events, then listing. Owner decisions already taken: both desktop and phone, Supabase measurement, 2 weeks, one ad break after results.

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
