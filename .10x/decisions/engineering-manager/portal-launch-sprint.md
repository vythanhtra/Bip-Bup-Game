# EM: portal-launch-sprint — task breakdown

Increment 1 (target: 3 working days)
1. Restore Supabase, create `events` table + RLS policy (0.5 d)
2. analytics.js + build-time config + hooks in game.html + test with page.route (0.5 d)
3. Straight-into-play + map accessible from result/quit; update tests that assume PLAY→map (0.5 d)
4. Tutorial gate 0 (scripted attacks, forgiveness, strings vi/en/zh) + test (1 d)
5. Portal build variant + portal.js adapter (CrazyGames + Poki no-op) + public-portal deploy path (0.5 d)
6. Owner posts the Facebook group link; 48 h of data; SQL funnel queries documented in docs/analytics.md

Increment 2 — REVISED 2026-10-26 (Owner chốt hướng hình Stardew, ADR-003; target 7 working days)
7. Fix 4 text/HUD bugs + hide hearts in gate 0 + lose pose (from review) (0.5 d)
8. Art pipeline: style-guide prompts, `docs/art-manifest.json` (media ids), `img-src/` → `public/img/` build step with keying + resize + compression (0.5 d)
9. Generate assets in batches: 4 heroes + 15 enemies × (portrait + 3 poses), 5 vertical stage backgrounds; curate for consistency (2 d, Canva quota permitting)
10. `src/assets.js` loader with per-gate preload, progress, fallback to text sprites; `drawActor` takes images; palette-swap variants via filter (1 d)
11. Stardew-style wood UI: HUD, dialog with portrait, result screen; og:image + favicon + manifest from the new art (1 d)
12. Per-enemy move sets for 15 enemies (data + planner) (1 d)
13. Near-miss feedback on lose/early/fooled (0.5 d)
14. Portal listing assets from the new build: 4 screenshots per language, 30-s clip; submit CrazyGames and Poki (0.5 d)
Deferred after submission: collection v1, tuning from numbers (needs events table), final-boss arena, ending scene.
Blockers: Owner must allow Canva hosts in the environment network policy (or download full-res manually) before step 8 can produce real files; Supabase events table still awaiting Owner approval.

Risks: Supabase restore time; portal SDK specifics (read docs at step 5); owner availability for step 6.
