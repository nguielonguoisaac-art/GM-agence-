-- GM AGENCE: à exécuter dans Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  club text,
  country text,
  age integer check (age is null or (age >= 0 and age <= 100)),
  bio text,
  photo_url text,
  video_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.players enable row level security;
alter table public.contact_requests enable row level security;

-- Le public peut consulter les profils joueurs publiés.
drop policy if exists "Public can read players" on public.players;
create policy "Public can read players" on public.players for select to anon, authenticated using (true);

-- Seuls les utilisateurs connectés peuvent modifier les profils.
drop policy if exists "Admins manage players" on public.players;
create policy "Admins manage players" on public.players for all to authenticated using (true) with check (true);

-- Le formulaire public peut déposer une demande, sans lire les demandes.
drop policy if exists "Public can submit contact requests" on public.contact_requests;
create policy "Public can submit contact requests" on public.contact_requests for insert to anon, authenticated with check (true);

-- Les demandes ne sont lisibles que par les comptes authentifiés.
drop policy if exists "Admins read contact requests" on public.contact_requests;
create policy "Admins read contact requests" on public.contact_requests for select to authenticated using (true);

-- NOTE SÉCURITÉ : crée uniquement des comptes administrateurs de confiance dans
-- Supabase > Authentication > Users. N'active pas l'inscription publique.
