# Feature: portal-submission

**Status:** Accepted by Owner 2026-10-26 (approach B, 2 weeks) · **Priority:** P0 · **Supersedes:** portal-launch-sprint (the product became a 2D fighting game; that sprint's items 1–6, 12 are done or obsolete)

## Problem statement
A 2D comedy fighting game with 40 gates, an economy and five content increments has still never been played by a stranger, so every balance, pacing and feel decision is a guess. The Owner wants the first 50–100 strangers to come from an international web portal (CrazyGames / Poki) within 2 weeks, with our own funnel numbers next to the portal's.

## Target user
1. Portal player, 13–30, English, arrives from a thumbnail with zero context, gives the game 30 seconds. **60–70 % on desktop with a keyboard inside a 16:9 iframe**, the rest on a phone in portrait.
2. Portal QA (bot + editor): load size and time, iframe behaviour, no outbound links, SDK events, mobile input, English text, no dead ends.

## What we know (evidence)
- Desktop 16:9 already runs on the fight engine (arena 1664 px, camera works) but: the virtual pad stays on screen next to a keyboard, there is no key hint, HUD text is phone-sized, and the 9:16 background is cover-cropped to a blurry strip (screenshot 2026-10-26 `land-fight.png`).
- First minute on the art edition today: prologue (5 scenes) → tutorial (5 steps) → gate 1. Time-to-first-BEEP is well over the 5 s target. Prologue must become optional for strangers.
- Payload: 3.06 MB art + 0.34 MB JS. Under typical portal limits, no work needed.
- Analytics code exists (`A.ev`: load, play, gate_start, quit, share, shop, coins, run_end, prologue) but no events table was ever created; `gate_clear` is missing, so the gate-1→gate-5 funnel cannot be read.
- Portal constraints to re-verify on day 1 against current docs: SDK init + gameplayStart/Stop + loading-finished events, no outbound links (our share links and challenge URLs leave the portal), mute/pause on tab blur, works in iframe without top-level storage assumptions.

## Success criteria
| Metric | Source | Target |
|---|---|---|
| Submitted to CrazyGames and Poki | calendar | by day 14 |
| Time from load to first BEEP (new player, desktop) | our event `first_beep` − `load` | median ≤ 10 s |
| Gate 1 start → gate 1 clear | `gate_start` / `gate_clear` | ≥ 70 % |
| Gate 1 start → gate 5 reached | same | ≥ 40 % |
| Median first session | portal + our `quit`/`load` | ≥ 3 min |
| Portal thumbs-up ratio (CrazyGames) | portal | ≥ 80 % after 200 plays |
| Desktop players who use the keyboard | `input_kind` on first gate | ≥ 80 % of desktop sessions (proves the hint works) |
If any funnel number is below target after 100 sessions, the next sprint is tuning, not features.

## Approaches
**A. Minimum (1 week):** portal build variant + SDK adapter for both portals, hide pad when a keyboard/mouse is used + key hints, Supabase events table + `gate_clear`/`first_beep`/`input_kind`, Play goes straight to gate 1 (prologue optional), strip outbound links in the portal build, listing assets, submit. Backgrounds stay cover-cropped on 16:9. Risk: QA dislikes the blurry desktop background; difficulty of gates 1–5 unvalidated.
**B. Recommended (2 weeks):** A + a 16:9 presentation pass (scale 9:16 backgrounds to height and extend the sides with a blurred, darkened copy so the real scene stays sharp; HUD scaled for desktop), an internal 10-person playtest in week 1 on the portal build (Owner's network, desktop + phone) with one tuning pass on gates 1–5, dash window and pre-jump timing, then submit. Risk: 2 weeks is tight if the portal SDKs need a deeper integration than event hooks; mitigated by doing SDK + measurement first.
**C. Full (1 month):** B + 60-second run on the fight engine + five generated landscape backgrounds + full-res art + balance over all 40 gates. Misses the window and still has no stranger data in the meantime.

## Recommendation: B, two increments
1. **Days 1–5, measure + portal skeleton:** read both SDK docs, portal build (`node build.js <url> en portal`), SDK adapter (init, loading-finished, gameplay start/stop, mute on blur), Supabase migration (events table, Owner approved 2026-10-26), new events, Play → gate 1 in ≤ 10 s with prologue behind a Story button, pad hidden on keyboard/mouse with a one-line key hint, no outbound links in portal build. Internal playtest link goes out on day 5.
2. **Days 6–14, present + submit:** 16:9 background treatment, desktop HUD scale, tuning from the playtest (gates 1–5 clear rate, dash/pre-jump windows), 16:9 + 9:16 screenshots and a 30 s English clip, submit CrazyGames then Poki. Then stop building and read numbers for a week.

## User stories
- As a desktop portal player, I want to be in the first fight within 10 seconds using the arrow keys and two buttons the game told me about, so that I do not leave before I understand it.
- As a phone portal player, I want the same game in portrait with the pad, so that nothing is lost when I switch devices.
- As a new player, I want gate 1 to be beatable on the first try and gate 5 to need one new idea (block, then special), so that I feel progress before the game gets hard.
- As a curious player, I want the story prologue one tap away but not in my way.
- As the Owner, I want to see where the first 100 strangers drop (gate, time, device, input kind) so that the next sprint is decided by numbers.
- As a portal editor, I want the build to behave inside the iframe (no outbound links, SDK events, mute on blur) so that it passes QA the first time.

## Prioritization
- **P0:** portal build + SDK adapter (both portals); desktop input (pad hidden, key hints); events table + `gate_clear`, `first_beep`, `input_kind`, session length; Play → gate 1 ≤ 10 s, prologue optional; no outbound links in portal build; listing assets; submission.
- **P1:** 16:9 background treatment + desktop HUD scale; 10-person internal playtest + one tuning pass on gates 1–5, dash window, pre-jump; gate 1 clear rate ≥ 70 % before submission.
- **P2:** og:image/favicon/manifest; near-miss feedback on loss screen (time left, hp left); Vietnamese and Chinese listing variants.
- **P3 (won't do this sprint):** 60-second run on the fight engine; landscape on phones; leaderboard/backend; monetization; full-res art; new mechanics, enemies or shop items.

## Explicitly not building
Anything that adds content. The game has 40 gates, 19 fighters, 15 stages, a shop and five increments that nobody outside has played. Two weeks of presentation, measurement and submission, then numbers decide.

## Risks and early signals
- Portal SDK needs more than hooks (ads, auth, specific loader): known by day 1 after reading docs; fallback is submitting CrazyGames only.
- Gates 1–5 too hard for strangers (fighting game depth): known on day 5 from the internal playtest; tuning knobs exist (AI aggr/tel per world, hp).
- Supabase project paused: restore on day 1; if it fails, fall back to portal numbers only and say so.
- Canva/network: no new art is required for B; the 16:9 treatment is code only.
- Owner availability: playtest recruitment and the two portal accounts are the Owner's; both needed by day 5.
