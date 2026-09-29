-- =====================================================================
-- Inglês em Família — tabelas do app de inglês (todas com prefixo en_)
-- =====================================================================
-- Usa o MESMO projeto Supabase do Alfa-Alfa, só que com tabelas novas.
-- Nenhuma tabela existente (profiles, acessos, resultados...) é alterada.
--
-- COMO USAR
-- 1. Supabase → SQL Editor → New query
-- 2. Cole este arquivo inteiro e clique em Run
-- 3. Pode rodar de novo sem medo: tudo usa "if not exists" / "drop policy if exists".
--
-- Já cria também as tabelas das Fases 3 e 4 (palavras e conquistas), para
-- não precisar voltar aqui a cada fase.
-- =====================================================================

-- Perfil do aluno no app de inglês (XP, sequência, meta diária)
create table if not exists public.en_profile (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  display_name     text,
  xp               integer not null default 0,
  streak           integer not null default 0,
  last_study_date  date,
  daily_goal_min   integer not null default 10,
  today_date       date,
  today_seconds    integer not null default 0,
  total_seconds    integer not null default 0,
  study_days       integer not null default 0,
  updated_at       timestamptz not null default now()
);

-- Lições concluídas
create table if not exists public.en_lesson_progress (
  user_id       uuid not null references auth.users (id) on delete cascade,
  lesson_id     text not null,
  completed_at  timestamptz not null default now(),
  last_at       timestamptz,
  score         integer,
  times         integer not null default 1,
  primary key (user_id, lesson_id)
);

-- Histórico de atividades (alimenta "Últimas atividades" e, na Fase 4, os gráficos)
create table if not exists public.en_activity (
  id          uuid primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  type        text not null,
  ref         text,
  title       text,
  xp          integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists en_activity_user_created on public.en_activity (user_id, created_at desc);

-- Fase 3: domínio de cada palavra (0 = nova ... 4 = dominada) e agenda de revisão
create table if not exists public.en_word_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  word_id      text not null,
  mastery      smallint not null default 0 check (mastery between 0 and 4),
  reviews      integer not null default 0,
  correct      integer not null default 0,
  wrong        integer not null default 0,
  last_review  timestamptz,
  next_review  timestamptz,
  primary key (user_id, word_id)
);
create index if not exists en_word_progress_due on public.en_word_progress (user_id, next_review);

-- Fase 4: conquistas desbloqueadas
create table if not exists public.en_achievement (
  user_id         uuid not null references auth.users (id) on delete cascade,
  achievement_id  text not null,
  unlocked_at     timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- Segurança: cada pessoa só lê e grava as PRÓPRIAS linhas
do $$
declare t text;
begin
  foreach t in array array['en_profile', 'en_lesson_progress', 'en_activity', 'en_word_progress', 'en_achievement']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "dono le e grava" on public.%I', t);
    execute format(
      'create policy "dono le e grava" on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t
    );
  end loop;
end $$;

-- =====================================================================
-- Ranking (geral e da semana)
-- =====================================================================
-- As tabelas continuam protegidas: cada aluno só lê as próprias linhas.
-- Esta função devolve SÓ o necessário para o ranking (primeiro nome, XP,
-- sequência e palavras estudadas) de quem usa o app de inglês.
create or replace function public.en_ranking(p_period text default 'geral')
returns table (pos bigint, user_id uuid, name text, xp bigint, streak integer, words bigint, is_me boolean)
language sql
security definer
set search_path = public
stable
as $$
  with base as (
    select
      p.user_id,
      coalesce(nullif(split_part(trim(p.display_name), ' ', 1), ''), 'Aluno') as name,
      case
        when p_period = 'semana' then coalesce((
          select sum(a.xp) from public.en_activity a
          where a.user_id = p.user_id and a.created_at >= date_trunc('week', now())
        ), 0)
        else p.xp
      end::bigint as xp,
      case when p.last_study_date >= current_date - 1 then p.streak else 0 end as streak,
      (select count(*) from public.en_word_progress w where w.user_id = p.user_id and w.mastery > 0) as words
    from public.en_profile p
  )
  select rank() over (order by b.xp desc) as pos, b.user_id, b.name, b.xp, b.streak, b.words, b.user_id = auth.uid() as is_me
  from base b
  where b.xp > 0 or b.user_id = auth.uid()
  order by b.xp desc, b.name
  limit 100;
$$;

revoke all on function public.en_ranking(text) from public, anon;
grant execute on function public.en_ranking(text) to authenticated;
