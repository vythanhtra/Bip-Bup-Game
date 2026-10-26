# ADR-006: Pausable game clock

**Status:** Accepted (Owner 2026-10-26) · **Date:** 2026-10-26 · **Feature:** portal-submission · **Author:** 10x-Team (Architect + Staff Engineer)

## Context
Every timer in the fight engine (round end, countdown, hitstun, knockdown, AI decision, dash, pre-jump) is an absolute `performance.now()` timestamp. `requestAnimationFrame` stops while the tab is hidden and portals pause games for ads, so on return the hidden time is lost from the round and every timed state resolves at once. Poki QA checks hidden-tab and ad behaviour explicitly.

## Decision
Introduce one engine clock `gnow()` = `performance.now() − PAUSE.off`. `PAUSE.enter()` records wall time, `PAUSE.leave()` adds the elapsed hidden time to `PAUSE.off`. The frame loop passes `gnow()` as `now`; all engine call sites of `performance.now()` become `gnow()`. Pause sources: tab hidden, portal ad break, future pause button. While paused the loop renders a paused overlay and ignores input. Analytics and audio keep wall time.

## Alternatives Considered
| Alternative | Pros | Cons | Why not |
|---|---|---|---|
| Shift every stored timestamp on resume | no clock abstraction | 30+ fields across fighters, AI, round, referee, timers; easy to miss one | fragile |
| Restart the round on resume | trivial | punishes the player; Poki QA treats it as a bug | user-hostile |
| Per-frame dt accumulation instead of timestamps | clean long-term | rewrite of the engine's timing model | not in a 2-week window |

## Consequences
Positive: one mechanical change (53 call sites in game.html, done by script and verified by the 14 suites), correct behaviour for hidden tab and ads, enables a pause button. Negative: any new code must use `gnow()`, enforced by a lint grep in the build (`performance.now()` allowed only in `gnow`, analytics and audio). Risk: a missed call site mixes clocks; the build check and tests cover it.

## Dependencies
None. Enables ADR-002's ad break to be used safely.
