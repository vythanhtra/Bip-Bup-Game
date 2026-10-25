# CTO: portal-launch-sprint

**Verdict:** Build. The game exists; the missing piece is evidence and the first minute. No buy option covers "make our first minute work".
**Direction:** Stay static-first. The only server-side addition is an append-only events table (Supabase, free tier, restored from pause) written via anonymous REST insert; nothing else moves off the client. Portal build is a build-time variant of the same code (flag `portal`), not a fork.
**Opportunity cost:** Leaderboard, cosmetics and more languages wait; they do not change the portal's first-session metric.
**Kill criteria:** if after the 50-stranger test fewer than 25 % reach gate 3 even with the tutorial, the parry core is wrong for this audience and we revert attacks to a later world before submitting.
