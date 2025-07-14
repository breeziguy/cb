drop function if exists get_monthly_stats();

create or replace function get_briefs_last_12_months()
returns table(month text, value bigint) as $$
begin
  return query
  with month_series as (
    select date_trunc('month', generate_series(
      now() - interval '11 months',
      now(),
      '1 month'
    )) as month_start
  )
  select
    to_char(ms.month_start, 'Mon') as month,
    count(b.id)::bigint as value
  from month_series ms
  left join briefs b on date_trunc('month', b.created_at) = ms.month_start
  group by ms.month_start
  order by ms.month_start;
end;
$$ language plpgsql; 