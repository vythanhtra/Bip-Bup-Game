# ADR-001: Anonymous gameplay events via Supabase REST

**Status:** Accepted · **Date:** 2026-10-25 · **Feature:** portal-launch-sprint · **Author:** 10x-Team (Architect + Staff Engineer)

## Context
The game has no measurement. The sprint's success criteria need per-session funnel events from strangers. Constraints: static hosting, no accounts, no cookies/PII, portals may sandbox storage, must not block gameplay if the endpoint is down.

## Decision
Client posts small JSON events with `navigator.sendBeacon` (fallback `fetch keepalive`) to the Supabase REST endpoint of the existing (restored) project, table `events`, using the publishable anon key. Row-level security allows INSERT for anon and denies SELECT/UPDATE/DELETE. Session id is a random 8-char string per page load (not persisted); a `d` (device) id is a random id in localStorage used only to count returns, never linked to anything. Events: `load`, `play`, `gate_start`, `gate_clear`, `gate_lose`, `run_start`, `daily_start`, `share`, `heartbeat` (every 30 s with seconds played). Reading is done by the owner via the Supabase MCP/SQL, not by the game.

## Alternatives Considered
| Alternative | Pros | Cons | Why not |
|---|---|---|---|
| Vercel Web Analytics | zero code | page views only, no gameplay funnel | cannot answer "where do they drop" |
| Vercel serverless + KV/Blob | same vendor as hosting | needs provisioning, code for an API, quotas | more moving parts than one REST insert |
| Third-party game analytics SDK (GameAnalytics) | dashboards | external script, consent questions, portal policy friction | avoid external scripts before portal review |

## Consequences
Positive: one table, one fetch call, readable with SQL in minutes. Negative: anon key is public (acceptable: insert-only; abuse limited by RLS and row size); no dashboards (SQL queries documented instead). Risk: project paused again on inactivity → restore before each campaign; events silently lost if Supabase is down (game unaffected by design).

## Dependencies
Supabase project iyabxhznvcmgbpjzzyta restored; `SUPABASE_URL` and anon key baked at build time by build.js.
