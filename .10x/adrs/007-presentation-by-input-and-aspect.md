# ADR-007: Presentation decided by input kind and aspect ratio, not by device

**Status:** Proposed · **Date:** 2026-10-26 · **Feature:** portal-submission · **Author:** 10x-Team (Architect + Staff Engineer)

## Context
Portal players are 60–70 % desktop with a keyboard in a 16:9 iframe, the rest phones in portrait. The game was laid out for portrait touch: pad always shown in a fight, HUD sized by the sprite scale, 9:16 backgrounds cover-cropped. Device sniffing (user agent, "is mobile") misclassifies touch laptops, tablets and phones in landscape.

## Decision
Two runtime signals drive presentation: `INPUT.kind` (touch | keys, from the first pointer/keyboard event, default from `(pointer: coarse)`) decides pad visibility and key hints; aspect ratio (W/H against the background image aspect) decides the background treatment (cover for portrait, height-fit with a blurred, darkened side extension of the same image for wide frames) and HUD scaling uses `min(W, H)`. No separate desktop layout mode, no device table, no new art.

## Alternatives Considered
| Alternative | Pros | Cons | Why not |
|---|---|---|---|
| Separate desktop layout state chosen at load | freedom for a desktop look | second UI code path, wrong guess is sticky | doubles UI surface in a 2-week window |
| Letterbox 9:16 inside 16:9 | zero layout work | black bars for most portal sessions | portal QA and players dislike it |
| Generate 16:9 backgrounds | best looking | 15–17 new images, art budget 3 MB already spent, Canva originals blocked | later, data permitting |

## Consequences
Positive: one layout path that adapts within a session (touch laptop works), no asset growth. Negative: wide frames show a blurred extension on the sides rather than painted scenery; `ctx.filter` needs a colour fallback on old Safari. Risk: the first-input heuristic hides the pad when a phone user presses a Bluetooth key; a later touch re-shows it.

## Dependencies
ADR-003 (image backgrounds), ADR-005 (fight engine camera; the arena already exceeds the screen width).
