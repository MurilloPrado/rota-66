-- =============================================================================
-- Rota 66 Navalha & Rock — schema do banco (Supabase / PostgreSQL)
-- Rode este arquivo inteiro em: Supabase > SQL Editor > New query > Run
-- =============================================================================

create extension if not exists btree_gist;

-- -----------------------------------------------------------------------------
-- Tabelas
-- -----------------------------------------------------------------------------

-- Cada barbeiro pode ser vinculado a um usuário do Supabase Auth (login).
create table if not exists public.barbeiros (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid unique references auth.users (id) on delete set null,
  nome          text not null,
  bio           text,
  foto_url      text,
  ativo         boolean not null default true,
  criado_em     timestamptz not null default now()
);

create table if not exists public.servicos (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  descricao       text,
  preco_centavos  integer not null check (preco_centavos >= 0),
  duracao_min     integer not null check (duracao_min between 5 and 480),
  ordem           integer not null default 0,
  ativo           boolean not null default true
);

do $$ begin
  create type public.status_agendamento as enum ('confirmado', 'concluido', 'cancelado');
exception when duplicate_object then null; end $$;

create table if not exists public.agendamentos (
  id                uuid primary key default gen_random_uuid(),
  barbeiro_id       uuid not null references public.barbeiros (id),
  servico_id        uuid not null references public.servicos (id),
  cliente_nome      text not null check (char_length(cliente_nome) between 2 and 80),
  cliente_telefone  text not null check (cliente_telefone ~ '^[0-9]{10,13}$'),
  inicio            timestamptz not null,
  fim               timestamptz not null,
  status            public.status_agendamento not null default 'confirmado',
  criado_em         timestamptz not null default now(),
  check (fim > inicio),
  -- Impede dois agendamentos sobrepostos para o mesmo barbeiro (inclusive em
  -- requisições simultâneas). Agendamentos cancelados liberam o horário.
  constraint agendamentos_sem_conflito exclude using gist (
    barbeiro_id with =,
    tstzrange(inicio, fim) with &&
  ) where (status <> 'cancelado')
);

create index if not exists agendamentos_barbeiro_inicio_idx
  on public.agendamentos (barbeiro_id, inicio);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.barbeiros    enable row level security;
alter table public.servicos     enable row level security;
alter table public.agendamentos enable row level security;

-- Visitantes veem serviços e barbeiros ativos (sem a coluna auth_user_id).
revoke select on public.barbeiros from anon;
grant select (id, nome, bio, foto_url, ativo) on public.barbeiros to anon;

drop policy if exists "servicos ativos sao publicos" on public.servicos;
create policy "servicos ativos sao publicos" on public.servicos
  for select using (ativo);

drop policy if exists "barbeiros ativos sao publicos" on public.barbeiros;
create policy "barbeiros ativos sao publicos" on public.barbeiros
  for select using (ativo or auth_user_id = auth.uid());

-- ISOLAMENTO: o barbeiro logado só enxerga/altera os próprios agendamentos.
-- Visitantes (anon) não têm nenhuma policy aqui, logo não leem nada da tabela:
-- consultam disponibilidade e criam agendamentos só pelas funções abaixo.
drop policy if exists "barbeiro ve os proprios agendamentos" on public.agendamentos;
create policy "barbeiro ve os proprios agendamentos" on public.agendamentos
  for select to authenticated
  using (barbeiro_id in (select id from public.barbeiros where auth_user_id = auth.uid()));

drop policy if exists "barbeiro atualiza os proprios agendamentos" on public.agendamentos;
create policy "barbeiro atualiza os proprios agendamentos" on public.agendamentos
  for update to authenticated
  using (barbeiro_id in (select id from public.barbeiros where auth_user_id = auth.uid()))
  with check (barbeiro_id in (select id from public.barbeiros where auth_user_id = auth.uid()));

-- -----------------------------------------------------------------------------
-- Funções públicas (chamadas pelo site via RPC)
-- -----------------------------------------------------------------------------

-- Intervalos ocupados de um dia (horário de Brasília). Não expõe dados do cliente.
create or replace function public.horarios_ocupados(p_dia date)
returns table (barbeiro_id uuid, inicio timestamptz, fim timestamptz)
language sql stable security definer set search_path = public as $$
  select a.barbeiro_id, a.inicio, a.fim
  from agendamentos a
  where a.status <> 'cancelado'
    and a.inicio < ((p_dia + 1)::timestamp at time zone 'America/Sao_Paulo')
    and a.fim    > (p_dia::timestamp       at time zone 'America/Sao_Paulo');
$$;

-- Cria o agendamento. Com p_barbeiro_id nulo ("qualquer barbeiro"), escolhe o
-- barbeiro livre com menos atendimentos no dia.
create or replace function public.criar_agendamento(
  p_servico_id       uuid,
  p_barbeiro_id      uuid,
  p_inicio           timestamptz,
  p_cliente_nome     text,
  p_cliente_telefone text
)
returns table (out_agendamento_id uuid, out_barbeiro_id uuid, out_barbeiro_nome text)
language plpgsql security definer set search_path = public as $$
declare
  v_duracao  integer;
  v_fim      timestamptz;
  v_barbeiro uuid;
  v_id       uuid;
  v_dia      date := (p_inicio at time zone 'America/Sao_Paulo')::date;
begin
  if p_inicio < now() or p_inicio > now() + interval '60 days' then
    raise exception 'HORARIO_INVALIDO';
  end if;

  select s.duracao_min into v_duracao from servicos s where s.id = p_servico_id and s.ativo;
  if v_duracao is null then
    raise exception 'SERVICO_INVALIDO';
  end if;
  v_fim := p_inicio + make_interval(mins => v_duracao);

  if p_barbeiro_id is not null then
    select b.id into v_barbeiro from barbeiros b where b.id = p_barbeiro_id and b.ativo;
    if v_barbeiro is null then
      raise exception 'BARBEIRO_INVALIDO';
    end if;
  else
    select b.id into v_barbeiro
    from barbeiros b
    where b.ativo
      and not exists (
        select 1 from agendamentos a
        where a.barbeiro_id = b.id
          and a.status <> 'cancelado'
          and tstzrange(a.inicio, a.fim) && tstzrange(p_inicio, v_fim)
      )
    order by (
      select count(*) from agendamentos a
      where a.barbeiro_id = b.id
        and a.status <> 'cancelado'
        and (a.inicio at time zone 'America/Sao_Paulo')::date = v_dia
    ), random()
    limit 1;
    if v_barbeiro is null then
      raise exception 'HORARIO_INDISPONIVEL';
    end if;
  end if;

  begin
    insert into agendamentos (barbeiro_id, servico_id, cliente_nome, cliente_telefone, inicio, fim)
    values (v_barbeiro, p_servico_id, trim(p_cliente_nome), p_cliente_telefone, p_inicio, v_fim)
    returning id into v_id;
  exception when exclusion_violation then
    raise exception 'HORARIO_INDISPONIVEL';
  end;

  return query select v_id, b.id, b.nome from barbeiros b where b.id = v_barbeiro;
end;
$$;

revoke execute on function public.horarios_ocupados(date) from public;
revoke execute on function public.criar_agendamento(uuid, uuid, timestamptz, text, text) from public;
grant execute on function public.horarios_ocupados(date) to anon, authenticated;
grant execute on function public.criar_agendamento(uuid, uuid, timestamptz, text, text) to anon, authenticated;
