# ADR-002: Portal edition as a build-time variant

**Status:** Accepted · **Date:** 2026-10-25 · **Feature:** portal-launch-sprint

## Context
CrazyGames/Poki run games in an iframe, disallow links that leave the portal, and expect their SDK hooks (loading start/stop, gameplay start/stop, ad breaks). Our public site needs the opposite (share links, Facebook button).

## Decision
`node build.js <url> <lang> portal` emits public-portal/ from the same sources with a `PORTAL=true` constant: share buttons reduced to "copy text" (no outbound links), challenge links keep working through the hash on the portal URL, title screen skips the language picker (language from build), SDK calls go through a tiny adapter `portal.js` with no-op defaults so one build serves both portals by swapping the adapter.

## Alternatives Considered
| Alternative | Pros | Cons | Why not |
|---|---|---|---|
| Runtime detection (window.top !== window) | one build | fragile, portals also test outside iframe | unreliable |
| Separate fork | freedom | two codebases to keep in sync | maintenance |

## Consequences
Positive: one source, deterministic output per portal. Negative: a third output folder to deploy; SDK adapters need per-portal testing. Risk: policy drift; re-read portal guidelines at submission.
