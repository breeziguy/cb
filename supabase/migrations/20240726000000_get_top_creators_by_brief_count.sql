create or replace function get_top_creators_by_brief_count()
returns table (
    name text,
    username text,
    avatar_url text,
    brief_count bigint
) as $$
begin
    return query
    select
        c.name,
        c.username,
        c.avatar_url,
        count(b.id) as brief_count
    from
        public.creators c
    join
        public.briefs b on c.id = b.creator_id
    group by
        c.id
    order by
        brief_count desc
    limit 6;
end;
$$ language plpgsql; 