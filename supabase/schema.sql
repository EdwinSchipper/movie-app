-- Movie App (Movie for Friends) - Supabase PostgreSQL Schema & RLS Bronwaarheid
-- Dit bestand fungeert als centrale referentie voor tabellen, constraints, indexen,
-- Row Level Security (RLS) policies, triggers en RPC-functies.

-- ============================================================================
-- 1. PROFILES TABEL & ROLBEHEER
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  tile_count_preference integer not null default 20 check (tile_count_preference between 5 and 100),
  tile_display_mode text not null default 'grid' check (tile_display_mode in ('grid', 'row')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_created_at_idx
  on public.profiles (created_at desc);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    coalesce(new.email, ''),
    case
      when coalesce(new.raw_app_meta_data ->> 'role', 'user') = 'admin' then 'admin'
      else 'user'
    end
  )
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_user_role(
  target_user_id uuid,
  new_role text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Toegang geweigerd: alleen administrators kunnen rollen wijzigen.';
  end if;

  if new_role not in ('user', 'admin') then
    raise exception 'Ongeldige rol opgegeven: %', new_role;
  end if;

  update public.profiles
  set
    role = new_role,
    updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception 'Gebruikersprofiel niet gevonden voor id: %', target_user_id;
  end if;

  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', new_role)
  where id = target_user_id;
end;
$$;

drop policy if exists "Gebruikers lezen eigen profiel" on public.profiles;
create policy "Gebruikers lezen eigen profiel"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Admins lezen alle profielen" on public.profiles;
create policy "Admins lezen alle profielen"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Gebruikers maken eigen profiel aan" on public.profiles;
create policy "Gebruikers maken eigen profiel aan"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id and role = 'user');

drop policy if exists "Gebruikers werken eigen instellingen bij" on public.profiles;
create policy "Gebruikers werken eigen instellingen bij"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (
      role = (
        select p.role
        from public.profiles p
        where p.id = auth.uid()
      )
      or public.is_admin()
    )
  );

drop policy if exists "Admins werken rollen en profielen bij" on public.profiles;
create policy "Admins werken rollen en profielen bij"
  on public.profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- 2. WATCHLIST TABEL (GEBRUIKER-SPECIFIEK VIA RLS)
-- ============================================================================
create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  release_date text,
  vote_average numeric,
  overview text,
  status text not null default 'want_to_watch' check (status in ('want_to_watch', 'watching', 'watched')),
  created_at timestamptz not null default now(),
  constraint watchlist_user_media_unique unique (user_id, tmdb_id, media_type)
);

create index if not exists watchlist_user_created_idx
  on public.watchlist (user_id, created_at desc);

create index if not exists watchlist_user_media_idx
  on public.watchlist (user_id, tmdb_id, media_type);

alter table public.watchlist enable row level security;

drop policy if exists "Gebruikers beheren eigen watchlist" on public.watchlist;
create policy "Gebruikers beheren eigen watchlist"
  on public.watchlist
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================================
-- 3. RECOMMENDATIONS TABEL (PUBLIEK LEESBAAR, ADMIN-ONLY SCHRIJVEN)
-- ============================================================================
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  sender_name text not null default 'Aanbeveling',
  receiver_name text not null default 'Iedereen',
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  release_date text,
  vote_average numeric,
  overview text,
  created_at timestamptz not null default now(),
  constraint recommendations_user_media_unique unique (user_id, tmdb_id, media_type)
);

create index if not exists recommendations_created_at_idx
  on public.recommendations (created_at desc);

create index if not exists recommendations_media_idx
  on public.recommendations (tmdb_id, media_type);

alter table public.recommendations enable row level security;

drop policy if exists "Aanbevelingen zijn publiek leesbaar" on public.recommendations;
create policy "Aanbevelingen zijn publiek leesbaar"
  on public.recommendations
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Alleen admins voegen aanbevelingen toe" on public.recommendations;
create policy "Alleen admins voegen aanbevelingen toe"
  on public.recommendations
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Alleen admins werken aanbevelingen bij" on public.recommendations;
create policy "Alleen admins werken aanbevelingen bij"
  on public.recommendations
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Alleen admins verwijderen aanbevelingen" on public.recommendations;
create policy "Alleen admins verwijderen aanbevelingen"
  on public.recommendations
  for delete
  to authenticated
  using (public.is_admin());
