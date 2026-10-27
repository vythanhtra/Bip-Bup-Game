# Đo lường (ADR-001)

Sự kiện ẩn danh gửi vào bảng `events` của dự án Supabase `iyabxhznvcmgbpjzzyta` (khóa anon chỉ được INSERT; đọc bằng SQL trong Supabase). Không cookie, không dữ liệu cá nhân. `sid` là mã phiên ngẫu nhiên mỗi lần mở trang, `d` là mã máy ngẫu nhiên trong localStorage chỉ để đếm quay lại.

Sự kiện: `load` (x: direct|hash), `play`, `gate_start` (g, x: gate|daily|run|practice|tutorial|versus), `gate_clear` / `gate_lose` / `quit` (g, ms, x: dạng `f1`, xem mục dưới), `run_end` (ms = điểm), `share` (x: text|link|fb), `hb` mỗi 30 giây khi đang chơi, `bye` khi rời trang.

## Truy vấn phễu (7 ngày)
```sql
with s as (select sid, min(at) t0, max(secs) secs, bool_or(ev='play') played,
  bool_or(ev='gate_clear' and g=1 and x not like 'tutorial%' and x not like 'f1|tutorial%') g1, bool_or(ev='gate_start' and g>=5) g5,
  bool_or(ev in ('share')) shared, bool_or(ev='gate_start' and x in ('run','daily')) loop2
  from events where at > now() - interval '7 days' group by sid)
select count(*) sessions, round(100.0*avg(played::int)) pct_play, round(100.0*avg(g1::int)) pct_gate1,
  round(100.0*avg(g5::int)) pct_gate5, round(100.0*avg(loop2::int)) pct_second_loop, round(100.0*avg(shared::int)) pct_share,
  percentile_cont(0.5) within group (order by secs) median_secs from s;
```

## Rơi ở đâu
```sql
select g, x, count(*) from events where ev='gate_lose' and at > now() - interval '7 days' group by 1,2 order by 3 desc limit 20;
```

## Quay lại (máy có từ 2 ngày chơi)
```sql
select count(distinct d) devices, count(distinct d) filter (where days>1) returned from (select d, count(distinct date_trunc('day', at)) days from events where d is not null group by d) q;
```

## Funnel queries (portal-submission, 2026-10-26)
```sql
-- sessions by edition and input kind, last 7 days
select portal, split_part(x, ':', 1) as input, count(distinct sid) from events where ev = 'input_kind' and at > now() - interval '7 days' group by 1, 2;
-- time to first BEEP (seconds since load), median per edition
select portal, percentile_cont(.5) within group (order by secs) as median_s from events where ev = 'first_beep' and at > now() - interval '7 days' group by 1;
-- gate 1 start → gate 1 clear → gate 5 reached
with s as (select distinct sid from events where ev = 'gate_start' and g = 1),
 c1 as (select distinct sid from events where ev = 'gate_clear' and g = 1),
 g5 as (select distinct sid from events where ev = 'gate_start' and g >= 5)
select (select count(*) from s) as started, (select count(*) from c1 where sid in (select sid from s)) as cleared1, (select count(*) from g5 where sid in (select sid from s)) as reached5;
-- median session length (last heartbeat/bye per session)
select portal, percentile_cont(.5) within group (order by secs) from (select sid, portal, max(secs) secs from events group by 1, 2) t group by 1;
-- ads
select x, count(*) from events where ev = 'ad' group by 1;
```

## Số liệu cân bằng: dạng `f1` (Owner 2026-10-27)

Từ bản này, `gate_clear`, `gate_lose` và `quit` của chế độ đánh gửi:
- `g`: số cửa
- `ms`: tổng thời gian đánh thật, cộng các hiệp, không tính lúc đếm chờ BÍP hay lúc tạm dừng
- `x`: chuỗi 11 trường ngăn bằng `|`, tối đa 120 ký tự

```
f1|mode|hero|res|hp/hmax|rounds|tries|first|sup.rush|l…h…g…s…e…r…p…|cos,wpn,banh
f1|gate|tibup|W|109/170|1-0|1|1|1.1|l8h19g13s21e0r0p0|giaprom,duaca,1
```

| # | Trường | Ý nghĩa |
|---|---|---|
| 1 | `f1` | phiên bản định dạng. Dòng cũ (`hearts3`, `r0:`, `tutorial:hearts9`…) không có tiền tố này. Mọi truy vấn cân bằng phải lọc `x like 'f1|%'` |
| 2 | mode | `gate` · `daily` · `practice` · `tutorial`. Chỉ `gate` mới tính lần thử |
| 3 | hero | `tibup` · `hoayen` · `bangnhi` · `thachlao` |
| 4 | res | `W` thắng · `L` thua · `Q` thoát giữa trận |
| 5 | hp/hmax | máu còn và máu tối đa (đã cộng trang bị) ở hiệp cuối. Thua thì 0 |
| 6 | rounds | tỷ số hiệp, Tí trước. Trùm đánh 3 hiệp |
| 7 | tries | lần thử thứ mấy của máy này ở cửa này, gồm cả lần này (lưu trong tiến trình). 0 nếu không phải `gate` |
| 8 | first | 1 nếu đây là lần đầu tiên qua cửa này |
| 9 | sup.rush | số tuyệt chiêu (thanh đầy) và số xung Bá Khí (nửa thanh) Tí đã dùng |
| 10 | nguồn sát thương | Tổng máu Tí mất trong **toàn trận/cửa**, cộng qua mọi hiệp, theo nguồn: `l` đòn nhẹ (đấm, đấm 2, trên không) · `h` đòn nặng (nặng, móc, upper) · `g` vật · `s` tuyệt chiêu hoặc xung của địch · `e` sân đấu (dung nham, BÍP giả của Vịt) · `r` trọng tài · `p` đánh trước tiếng BÍP. Mỗi lần chỉ tính phần máu thật sự mất. Với trùm nhiều hiệp, các bộ đếm nguồn là tổng cả trận, còn `hp/hmax` chỉ phản ánh hiệp cuối; không so tổng nguồn sát thương với mức giảm HP của riêng hiệp cuối. |
| 11 | trang bị | áo, vũ khí (`-` nếu không mặc), số bánh chưng |

Dữ liệu được ghi ngay tại chỗ engine đánh trừ máu, không lấy từ tim hay bộ đếm hiệp của chế độ phản xạ cũ. Kiểm chứng bằng `tests/f8test.js`: thắng, thua, chơi lại, thoát giữa trận, luyện tập, đổi nhân vật.

### Bảng tách trường (dán trước mỗi truy vấn)
```sql
with f as (
  select at, sid, d, ev, g, ms, v, portal, lang,
    split_part(x,'|',2) as mode, split_part(x,'|',3) as hero, split_part(x,'|',4) as res,
    split_part(split_part(x,'|',5),'/',1)::int as hp, split_part(split_part(x,'|',5),'/',2)::int as hmax,
    split_part(x,'|',6) as rounds, split_part(x,'|',7)::int as tries, split_part(x,'|',8)::int as first_clear,
    split_part(split_part(x,'|',9),'.',1)::int as supers, split_part(split_part(x,'|',9),'.',2)::int as rushes,
    substring(split_part(x,'|',10) from 'l(\d+)')::int as d_light, substring(split_part(x,'|',10) from 'h(\d+)')::int as d_heavy,
    substring(split_part(x,'|',10) from 'g(\d+)')::int as d_grab, substring(split_part(x,'|',10) from 's(\d+)')::int as d_super,
    substring(split_part(x,'|',10) from 'e(\d+)')::int as d_stage, substring(split_part(x,'|',10) from 'r(\d+)')::int as d_ref,
    substring(split_part(x,'|',10) from 'p(\d+)')::int as d_early, split_part(x,'|',11) as gear,
    (g - 1) / 8 + 1 as world
  from events where ev in ('gate_clear','gate_lose','quit') and x like 'f1|%'
)
```

### Tỷ lệ qua cửa ngay lần thử đầu, kèm khoảng tin cậy
Mẫu số là **mọi máy đã bắt đầu cửa ở chế độ `gate`**, kể cả máy không có kết quả kết thúc được ghi nhận. Mỗi máy/cửa chỉ lấy lần `gate_start` đầu tiên; thành công lần đầu khi kết quả kết thúc đầu tiên của lần thử đó là `gate_clear` với `tries = 1`. Lượt thua, thoát, hoặc bắt đầu nhưng không có sự kiện kết thúc được tính là không qua cửa lần đầu. Nếu `d` không có, truy vấn chỉ có thể nhận diện trong phạm vi `sid` của phiên đó.

`lo95` và `hi95` là khoảng Wilson 95 %. Với n nhỏ, khoảng này rất rộng: n = 10 và tỷ lệ 70 % cho khoảng xấp xỉ 40–89 %.
```sql
, entrants as (
  select coalesce(d, 'sid:' || sid) as actor, g, min(at) as first_start
  from events
  where ev = 'gate_start' and x = 'gate' and g between 1 and 40
  group by 1, 2
), first_attempt_result as (
  select coalesce(d, 'sid:' || sid) as actor, g, at, ev,
    split_part(x, '|', 7)::int as tries,
    split_part(x, '|', 8)::int as first_clear,
    row_number() over (partition by coalesce(d, 'sid:' || sid), g order by at) as rn
  from events
  where ev in ('gate_clear', 'gate_lose', 'quit')
    and x like 'f1|%' and split_part(x, '|', 2) = 'gate'
    and split_part(x, '|', 7)::int = 1
), c as (
  select e.g, (e.g - 1) / 8 + 1 as world, count(*) as n,
    avg(case when r.ev = 'gate_clear' and r.tries = 1 and r.first_clear = 1 then 1.0 else 0.0 end) as p
  from entrants e
  left join first_attempt_result r on r.actor = e.actor and r.g = e.g and r.at >= e.first_start and r.rn = 1
  group by e.g, (e.g - 1) / 8 + 1
)
select g, world, n, round(100 * p, 1) as pct_first_try,
  round(100 * (p + 1.92 / n - 1.96 * sqrt(p * (1 - p) / n + 0.96 / (n * n))) / (1 + 3.84 / n), 1) as lo95,
  round(100 * (p + 1.92 / n + 1.96 * sqrt(p * (1 - p) / n + 0.96 / (n * n))) / (1 + 3.84 / n), 1) as hi95
from c order by g;
```

Kiểm tra logic truy vấn với ba trường hợp: (1) một máy thắng ở `tries = 1` — tính thành công; (2) một máy thua lần đầu rồi thắng ở `tries = 2` — chỉ tính là đã tham gia nhưng không qua lần đầu; (3) một máy bắt đầu cửa nhưng không có kết quả kết thúc — vẫn nằm trong mẫu số và không tính thành công.

### Tỷ lệ thắng theo nhân vật và vùng
Tính trên lượt đánh, không tính `Q`.
```sql
, h as (select hero, world, count(*) n, avg((res = 'W')::int) p from f where mode = 'gate' and res in ('W','L') group by 1, 2)
select hero, world, n, round(100 * p, 1) win_pct,
  round(100 * (p + 1.92 / n - 1.96 * sqrt(p * (1 - p) / n + 0.96 / (n * n))) / (1 + 3.84 / n), 1) lo95,
  round(100 * (p + 1.92 / n + 1.96 * sqrt(p * (1 - p) / n + 0.96 / (n * n))) / (1 + 3.84 / n), 1) hi95
from h order by world, hero;
```

Chưa dùng ngưỡng "chênh không quá 5 điểm" để kết luận. Theo quyết định của Owner, trước đó phải chốt ba thứ:
- **Cỡ mẫu:** cần khoảng 400 lượt cho mỗi nhân vật trong một vùng thì khoảng 95 % mới hẹp còn ±5 điểm.
- **Mức bất định chấp nhận được.**
- **Phân nhóm theo kỹ năng.** Gợi ý: chia theo số cửa đã qua của máy (`max(g)` có `first_clear = 1`). Mỗi lượt phải được gán nhóm theo tiến trình của máy đó *trước* lượt chơi, không phải sau.

### Thời gian và máu còn khi qua cửa
```sql
select g, count(*) n, percentile_cont(.5) within group (order by ms) / 1000 as median_s,
  percentile_cont(.9) within group (order by ms) / 1000 as p90_s, round(avg(100.0 * hp / hmax)) as avg_hp_left_pct, round(avg(supers), 2) supers
from f where ev = 'gate_clear' and mode = 'gate' group by 1 order by 1;
```

### Nguồn sát thương theo vùng
Cho biết người chơi chết vì cái gì.
```sql
select world, sum(d_light) light, sum(d_heavy) heavy, sum(d_grab) grab, sum(d_super) super, sum(d_stage) stage, sum(d_ref) ref, sum(d_early) early
from f where mode = 'gate' group by 1 order by 1;
```

### Bỏ giữa chừng
Số lần thoát trên số lần bắt đầu, theo cửa.
```sql
select s.g, s.n starts, coalesce(q.n, 0) quits, round(100.0 * coalesce(q.n, 0) / s.n, 1) quit_pct
from (select g, count(*) n from events where ev = 'gate_start' and x = 'gate' group by 1) s
left join (select g, count(*) n from f where res = 'Q' and mode = 'gate' group by 1) q using (g) order by 1;
```

### Xuất ra CSV
SQL editor của Supabase có nút **Download CSV** dưới kết quả. Hoặc chạy `select * from f` (sau `with f as …`) rồi tải về.
