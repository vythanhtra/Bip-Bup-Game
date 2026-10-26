# Feature: portal-launch-sprint

**Status:** Accepted by owner 2026-10-25 (approach B) · **Priority:** P0 · **Date:** 2026-10-25

## Problem statement
Strangers who open the link play 1–2 minutes and quit after gates 1–2 (observed on the pre-Core-2 build; Core 2 has not been seen by any stranger yet). The owner's goal is to be live on an international web-game portal (CrazyGames/Poki) within 2–3 weeks, where the portal itself measures first-session playtime and retention to decide whether to promote the game.

## Target user
Portal player, 13–30, mobile-first, arrives with zero context, gives a game 30 seconds. Second audience: the portal's review team (QA bot + editor) who check load time, mobile input, iframe behaviour, no outbound links, SDK hooks.

## What we know
- Drop-off happened after gates 1–2 on the old core: players understood the rule and saw nothing new. Core 2 adds parry/feint/bet but is unvalidated and may be too hard.
- We have zero measurement. Any sprint must end with readable numbers.
- Portal constraints (to verify against current docs at submission): run inside an iframe, no links that leave the portal, their SDK for ads/loading events, fast load, responsive, English.

## Success criteria (measured in our own analytics on a 50-stranger test, then confirmed by portal data)
| Metric | Target | Why |
|---|---|---|
| Median first session | ≥ 3 min | portals promote games with long first sessions |
| Players who start gate 1 and reach gate 5 | ≥ 40 % | fixes the observed gate 1–2 drop |
| Players who try the 60-second run or Daily | ≥ 30 % of gate-5 reachers | proves the second loop is visible |
| Time from load to first boop | ≤ 5 s | time-to-fun |
| Portal acceptance | submitted to CrazyGames and Poki by day 21 | the actual goal |

## Approaches
**A. Minimum (1 week):** analytics + straight-into-play + 15-s tutorial gate 0 + portal build variant (iframe-safe, no outbound links, SDK hooks stubbed) → submit as is. Risk: Core 2 difficulty unvalidated; "same for all enemies" monotony remains.
**B. Recommended (2–3 weeks):** A, plus per-enemy move sets for all 15 enemies (the thing that makes gates 1–10 feel different), near-miss feedback, collection v1 (defeated-idiot cards), a 50-stranger playtest in the middle with one tuning pass, then submit. Risk: scope; mitigated by shipping A's items first.
**C. Full (1–2 months):** B + leaderboard backend + shareable KO clip + cosmetics. Misses the 2–3 week window.

## Recommendation: B, shipped as two increments
1. **Week 1 — measure + first minute:** analytics (4 events + session length), play button straight into the next gate, tutorial gate 0 (one slow attack, one feint, one beep), portal build (`node build.js <url> en portal`), 50-stranger test via the Facebook group link.
2. **Week 2–3 — feel + submit:** per-enemy move sets, near-miss feedback, collection v1, tuning from week-1 numbers, screenshots + 30-s clip from the new build, submit to CrazyGames and Poki.

## User stories
- As a new player, I want to be fighting within 5 seconds of opening the link so that I decide to stay before I decide to leave.
- As a new player, I want the first opponent to teach me parry, feint and beep by doing them slowly so that gate 3 does not feel like a punishment.
- As a player at gate 4, I want the buffalo, the duck and the penguin to attack differently so that I feel the opponents, not the text.
- As a player who lost, I want to see how close I was (ms, hp left) so that I tap "again" instead of closing.
- As a player who beat someone, I want their card in my collection so that there is something that grows.
- As the owner, I want to see where strangers drop so that the next sprint is decided by numbers.

## Out of scope (explicit)
Leaderboard/backend beyond the events table, cosmetics/monetization, new languages, Traditional Chinese, trailer re-record (a 30-s clip for the portal listing only), app stores, PWA.

## Prioritization
P0: analytics, straight-into-play, tutorial gate 0, portal build, playtest. P1: per-enemy move sets, near-miss feedback, tuning. P2: collection v1, listing clip. P3: everything out of scope.

## Risks
- Core 2 too hard for first-timers → tutorial + week-1 numbers; fallback: delay attacks until gate 3 and slow telegraphs in world 1.
- Portal rejects outbound share links → portal build removes Facebook/link buttons and uses copy-text only; verify each portal's current policy before submission.
- Analytics needs storage → restore the paused Supabase project (free tier) with one `events` table and anonymous insert; no cookies, no personal data.
- Owner's time for the 50-stranger test → the Facebook group post (docs/social-launch.md §10) is ready; needs 2 days of replies.


## 2026-10-26 — Scope change accepted by Owner
Owner reviewed the 32 px code-drawn sample vs. a Stardew Valley screenshot and chose the Stardew-style direction after an AI-generated test (2 portraits, 2 sprites, 1 background). Merged into increment 2; collection v1 and number-driven tuning move after portal submission. Rationale: portals judge by screenshots before anyone plays; the art was the lowest-scoring launch-blocking pillar. Success criterion added: a cold viewer shown one screenshot can tell who is fighting whom without reading text.
