-- ThaiType schema for Supabase
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  display_name text not null default 'Learner',
  avatar_url text,
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists country_code text;
create unique index if not exists profiles_username_unique_idx on public.profiles (lower(username)) where username is not null;

-- Every completed typing session
create table if not exists public.user_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  wpm integer not null check (wpm >= 0),
  accuracy integer not null check (accuracy >= 0 and accuracy <= 100),
  mode text not null default 'words',
  duration_seconds integer not null default 60,
  created_at timestamptz not null default now()
);

create index if not exists user_scores_user_id_idx on public.user_scores (user_id);
create index if not exists user_scores_wpm_idx on public.user_scores (wpm desc);
create index if not exists user_scores_created_at_idx on public.user_scores (created_at desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url, country_code)
  values (
    new.id,
    nullif(lower(new.raw_user_meta_data->>'username'), ''),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      'Learner'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      null
    ),
    nullif(upper(new.raw_user_meta_data->>'country_code'), '')
  )
  on conflict (id) do update set
    username = coalesce(excluded.username, profiles.username),
    display_name = excluded.display_name,
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    country_code = coalesce(excluded.country_code, profiles.country_code),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.user_scores enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Public avatar bucket. Users can only write files inside their own user-id folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar uploads by owner" on storage.objects;
create policy "Avatar uploads by owner" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Avatar updates by owner" on storage.objects;
create policy "Avatar updates by owner" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and owner_id = (select auth.uid())::text);

drop policy if exists "Avatar reads" on storage.objects;
create policy "Avatar reads" on storage.objects for select to public
  using (bucket_id = 'avatars');

drop policy if exists "Scores are viewable by everyone" on public.user_scores;
create policy "Scores are viewable by everyone"
  on public.user_scores for select
  using (true);

drop policy if exists "Users can insert own scores" on public.user_scores;
create policy "Users can insert own scores"
  on public.user_scores for insert
  with check (auth.uid() = user_id);

-- Personal best per user: highest WPM with accuracy >= 90
create or replace function public.personal_bests()
returns table (
  user_id uuid,
  best_wpm integer,
  best_accuracy integer,
  achieved_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (s.user_id)
    s.user_id,
    s.wpm as best_wpm,
    s.accuracy as best_accuracy,
    s.created_at as achieved_at
  from public.user_scores s
  where s.accuracy >= 90
  order by s.user_id, s.wpm desc, s.created_at desc;
$$;

-- Top 50 global leaderboard
create or replace function public.get_leaderboard(limit_count integer default 50)
returns table (
  rank bigint,
  user_id uuid,
  display_name text,
  avatar_url text,
  country_code text,
  best_wpm integer,
  best_accuracy integer,
  achieved_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    row_number() over (order by pb.best_wpm desc, pb.achieved_at asc) as rank,
    pb.user_id,
    p.display_name,
    p.avatar_url,
    p.country_code,
    pb.best_wpm,
    pb.best_accuracy,
    pb.achieved_at
  from public.personal_bests() pb
  join public.profiles p on p.id = pb.user_id
  order by pb.best_wpm desc, pb.achieved_at asc
  limit greatest(limit_count, 1);
$$;

-- Percentile: (users with lower PB / total users) * 100
create or replace function public.get_percentile(score_wpm integer)
returns table (
  beat_percent numeric,
  total_users bigint,
  users_below bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with pb as (
    select best_wpm from public.personal_bests()
  ),
  totals as (
    select
      count(*)::bigint as total_users,
      count(*) filter (where best_wpm < score_wpm)::bigint as users_below
    from pb
  )
  select
    case
      when total_users = 0 then 100::numeric
      else round((users_below::numeric / total_users::numeric) * 100, 1)
    end as beat_percent,
    total_users,
    users_below
  from totals;
$$;

grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
grant select, insert on public.user_scores to authenticated;
grant select on public.user_scores to anon;
grant execute on function public.get_leaderboard(integer) to anon, authenticated;
grant execute on function public.get_percentile(integer) to anon, authenticated;
grant execute on function public.personal_bests() to anon, authenticated;
