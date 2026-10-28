# rota-66
Academic project focused on developing a website for Rota 66 Navalha &amp; Rock barbershop with the assistance of artificial intelligence, by a person with no prior software development knowledge, to analyze the possibilities and limitations of this approach.

---

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Lucide React · Supabase (Postgres + Auth)

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem Supabase configurado o site roda em **modo demonstração**:
dados de exemplo, agendamento simulado e nada é salvo.

## Configurando o Supabase

1. Crie um projeto em https://supabase.com.
2. Em **SQL Editor**, rode `supabase/schema.sql` e depois `supabase/seed.sql`.
3. Em **Authentication > Sign In / Providers**, desative "Allow new users to sign up"
   (só o administrador cria contas de barbeiro).
4. Copie `.env.example` para `.env.local` e preencha com a URL e a chave `anon`
   (**Project Settings > API**). Reinicie o `npm run dev`.

### Dando acesso a um barbeiro

1. **Authentication > Users > Add user** (e-mail + senha).
2. Copie o *User UID* e rode no SQL Editor:
   ```sql
   update public.barbeiros set auth_user_id = 'UID-AQUI' where nome = 'Elvis';
   ```
3. O barbeiro entra em `/barbeiro/login`.

## Onde editar o quê

| O quê | Arquivo |
|---|---|
| Endereço, WhatsApp, Instagram | `src/lib/config.ts` |
| Horário de funcionamento, intervalo entre horários | `src/lib/config.ts` |
| Serviços, preços, barbeiros | tabelas `servicos` e `barbeiros` no Supabase |
| Fotos da galeria | lista `FOTOS` em `src/components/landing/Galeria.tsx` |
| Cores do tema | `src/app/globals.css` (`@theme`) |

## Estrutura

```
supabase/
  schema.sql            tabelas, RLS e funções (horarios_ocupados, criar_agendamento)
  seed.sql              serviços e barbeiros de exemplo
src/
  middleware.ts         renova a sessão e protege /barbeiro/dashboard
  app/
    page.tsx            landing page
    acoes/agendamento.ts  server actions: buscar horários e criar agendamento
    barbeiro/
      login/            tela de login
      dashboard/        agenda do barbeiro logado
      acoes.ts          entrar / sair
  components/
    landing/            Cabecalho, Hero, Sobre, Galeria, TabelaPrecos, Rodape
    agendamento/        fluxo de agendamento em 5 passos
  lib/
    config.ts           dados da barbearia
    horarios.ts         cálculo dos horários livres
    catalogo.ts         carrega serviços/barbeiros
    supabase/           clientes Supabase (público, servidor, middleware)
```

## Segurança

- Visitantes **não leem** a tabela `agendamentos`. Eles só veem os intervalos ocupados
  (sem nome/telefone) e criam agendamentos por funções no banco.
- Cada barbeiro só vê os próprios agendamentos, garantido por Row Level Security no banco
  (não só pelo código do site).
- Uma constraint no banco impede dois agendamentos sobrepostos para o mesmo barbeiro,
  mesmo que dois clientes confirmem ao mesmo tempo.
