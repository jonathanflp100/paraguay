-- ============================================================================
-- Schema Supabase: Assessoria de Documentação no Paraguai
-- Execute este script no SQL Editor do seu projeto Supabase.
-- ============================================================================

-- 1. Tabela de Leads (captados pelo Verificador Rápido)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text,
  pais text not null,
  objetivo text not null,
  ja_no_paraguai boolean not null default false,
  servico text not null,
  idioma text not null,
  origem text not null default 'verificador',
  status text not null default 'novo' check (status in ('novo', 'em_contato', 'cliente', 'perdido')),
  telefone text,
  criado_em timestamptz not null default now()
);

-- 2. Tabela de Processos (gerenciada pelo Painel Admin)
create table if not exists public.processos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nome_cliente text not null,
  servico text not null,
  etapa integer not null default 1 check (etapa between 1 and 6),
  observacao_publica text,
  atualizado_em timestamptz not null default now(),
  criado_em timestamptz not null default now()
);

create index if not exists idx_processos_codigo on public.processos (upper(codigo));
create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_criado_em on public.leads (criado_em desc);

-- Trigger para atualizar atualizado_em automaticamente
create or replace function public.touch_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists trg_processos_atualizado_em on public.processos;
create trigger trg_processos_atualizado_em
before update on public.processos
for each row execute function public.touch_atualizado_em();

-- 3. Row Level Security (RLS)
alter table public.leads enable row level security;
alter table public.processos enable row level security;

-- Visitantes anônimos podem APENAS inserir leads (nunca listar nem editar)
drop policy if exists "Public insert leads" on public.leads;
create policy "Public insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Somente administradores autenticados podem ler, atualizar ou excluir leads
drop policy if exists "Authenticated manage leads" on public.leads;
create policy "Authenticated manage leads"
  on public.leads
  for all
  to authenticated
  using (true)
  with check (true);

-- Somente administradores autenticados acessam a tabela processos diretamente
drop policy if exists "Authenticated manage processos" on public.processos;
create policy "Authenticated manage processos"
  on public.processos
  for all
  to authenticated
  using (true)
  with check (true);

-- 4. Função RPC pública para acompanhamento seguro por código
-- Retorna apenas dados públicos (sem expor o nome do cliente nem listar outros processos)
create or replace function public.consultar_processo(p_codigo text)
returns table (
  codigo text,
  servico text,
  etapa integer,
  observacao text,
  atualizado_em timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    p.codigo,
    p.servico,
    p.etapa,
    p.observacao_publica as observacao,
    p.atualizado_em
  from public.processos p
  where upper(trim(p.codigo)) = upper(trim(p_codigo))
  limit 1;
$$;

grant execute on function public.consultar_processo(text) to anon, authenticated;
