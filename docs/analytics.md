# Đo lường (ADR-001)

Sự kiện ẩn danh gửi vào bảng `events` của dự án Supabase `iyabxhznvcmgbpjzzyta` (khóa anon chỉ được INSERT; đọc bằng SQL trong Supabase). Không cookie, không dữ liệu cá nhân. `sid` là mã phiên ngẫu nhiên mỗi lần mở trang, `d` là mã máy ngẫu nhiên trong localStorage chỉ để đếm quay lại.

Sự kiện: `load` (x: direct|hash), `play`, `gate_start` (g, x: gate|daily|run|practice|tutorial), `gate_clear` (g, ms, x: hearts), `gate_lose` (g, ms, x: round:lý do), `quit` (g), `run_end` (ms = điểm), `share` (x: text|link|fb), `hb` mỗi 30 giây khi đang chơi, `bye` khi rời trang.

## Truy vấn phễu (7 ngày)
```sql
with s as (select sid, min(t) t0, max(secs) secs, bool_or(ev='play') played,
  bool_or(ev='gate_clear' and g=1 and x not like 'tutorial%') g1, bool_or(ev='gate_start' and g>=5) g5,
  bool_or(ev in ('share')) shared, bool_or(ev='gate_start' and x in ('run','daily')) loop2
  from events where t > now() - interval '7 days' group by sid)
select count(*) sessions, round(100.0*avg(played::int)) pct_play, round(100.0*avg(g1::int)) pct_gate1,
  round(100.0*avg(g5::int)) pct_gate5, round(100.0*avg(loop2::int)) pct_second_loop, round(100.0*avg(shared::int)) pct_share,
  percentile_cont(0.5) within group (order by secs) median_secs from s;
```

## Rơi ở đâu
```sql
select g, x, count(*) from events where ev='gate_lose' and t > now() - interval '7 days' group by 1,2 order by 3 desc limit 20;
```

## Quay lại (máy có từ 2 ngày chơi)
```sql
select count(distinct d) devices, count(distinct d) filter (where days>1) returned from (select d, count(distinct date_trunc('day', t)) days from events where d is not null group by d) q;
```
