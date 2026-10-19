import { CalendarX2, Clock, LogOut, Phone, Scissors } from "lucide-react";
import { redirect } from "next/navigation";
import { IconeWhatsApp } from "@/components/IconesMarcas";
import { diaValido, formatarDia, hojeSP, horaSP, instante, somarDias } from "@/lib/datas";
import { linkWhatsApp, mascaraTelefone, precoBRL } from "@/lib/formatos";
import { supabaseConfigurado } from "@/lib/supabase/publico";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import type { AgendamentoDoBarbeiro } from "@/lib/tipos";
import { sair } from "../acoes";
import { FiltroData } from "./FiltroData";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ data?: string }> };

export default async function Dashboard({ searchParams }: Props) {
  if (!supabaseConfigurado()) redirect("/barbeiro/login");

  const { data: dataParam } = await searchParams;
  const hoje = hojeSP();
  const dia = diaValido(dataParam) ? dataParam : hoje;

  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/barbeiro/login");

  const { data: barbeiro } = await supabase.from("barbeiros").select("id, nome").eq("auth_user_id", user.id).maybeSingle();

  if (!barbeiro) {
    return (
      <Moldura nome={user.email ?? ""}>
        <Vazio titulo="Conta não vinculada" texto="Seu login ainda não está associado a um barbeiro. Fale com o administrador." />
      </Moldura>
    );
  }

  // O filtro por barbeiro_id é explícito, mas o isolamento é garantido pela RLS:
  // mesmo sem ele, o banco só devolveria agendamentos deste barbeiro.
  const { data, error } = await supabase
    .from("agendamentos")
    .select("id, inicio, fim, status, cliente_nome, cliente_telefone, servicos(nome, preco_centavos)")
    .eq("barbeiro_id", barbeiro.id)
    .neq("status", "cancelado")
    .gte("inicio", instante(dia, "00:00").toISOString())
    .lt("inicio", instante(somarDias(dia, 1), "00:00").toISOString())
    .order("inicio");

  const agendamentos = (data ?? []) as unknown as AgendamentoDoBarbeiro[];
  const total = agendamentos.reduce((soma, a) => soma + (a.servicos?.preco_centavos ?? 0), 0);
  const agora = Date.now();

  return (
    <Moldura nome={barbeiro.nome}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ambar-400">{dia === hoje ? "Hoje" : "Agenda"}</p>
          <h1 className="font-display text-4xl tracking-wide first-letter:uppercase sm:text-5xl">{formatarDia(dia)}</h1>
        </div>
        <FiltroData dia={dia} hoje={hoje} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Indicador rotulo="Atendimentos" valor={String(agendamentos.length)} />
        <Indicador rotulo="Previsto" valor={precoBRL(total)} />
      </div>

      {error && <Vazio titulo="Erro ao carregar" texto="Não foi possível carregar a agenda. Atualize a página." />}

      {!error && agendamentos.length === 0 && <Vazio titulo="Agenda livre" texto="Nenhum agendamento para este dia." />}

      {agendamentos.length > 0 && (
        <ol className="relative space-y-3 border-l-2 border-white/10 pl-6">
          {agendamentos.map((a) => {
            const passado = new Date(a.fim).getTime() < agora;
            const emAndamento = !passado && new Date(a.inicio).getTime() <= agora;
            const telefoneLocal = a.cliente_telefone.replace(/^55/, "");
            return (
              <li key={a.id} className={`relative ${passado ? "opacity-50" : ""}`}>
                <span
                  className={`absolute -left-[33px] top-5 size-4 rounded-full border-2 border-asfalto-950 ${
                    emAndamento ? "bg-sangue-500 ring-4 ring-sangue-500/30" : passado ? "bg-asfalto-600" : "bg-ambar-500"
                  }`}
                />
                <article className="rounded-xl border border-white/10 bg-asfalto-900 p-4 sm:flex sm:items-center sm:gap-5">
                  <div className="mb-3 flex items-center gap-2 font-display text-3xl tabular-nums text-ambar-400 sm:mb-0 sm:w-36 sm:flex-col sm:items-start sm:gap-0">
                    {horaSP(a.inicio)}
                    <span className="flex items-center gap-1 font-sans text-xs text-creme/40">
                      <Clock className="size-3" /> até {horaSP(a.fim)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">
                      {a.cliente_nome}
                      {emAndamento && <span className="ml-2 rounded bg-sangue-500 px-1.5 py-0.5 align-middle text-[10px] uppercase tracking-wider">Agora</span>}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-creme/60">
                      <Scissors className="size-3.5" /> {a.servicos?.nome ?? "Serviço"}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2 sm:mt-0">
                    <a
                      href={`tel:+${a.cliente_telefone}`}
                      className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                      <Phone className="size-4" /> {mascaraTelefone(telefoneLocal)}
                    </a>
                    <a
                      href={linkWhatsApp(a.cliente_telefone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp de ${a.cliente_nome}`}
                      className="inline-flex items-center rounded-md bg-[#25D366]/15 px-3 py-2 text-[#5ee69a] hover:bg-[#25D366]/25"
                    >
                      <IconeWhatsApp className="size-4" />
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </Moldura>
  );
}

function Moldura({ nome, children }: { nome: string; children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-white/5 bg-asfalto-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <p className="font-display text-2xl tracking-wider">
            Rota 66 <span className="text-ambar-400">· {nome}</span>
          </p>
          <form action={sair}>
            <button type="submit" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-creme/60 hover:bg-white/5 hover:text-creme">
              <LogOut className="size-4" /> Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}

function Indicador({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-asfalto-900 p-4">
      <p className="text-xs uppercase tracking-widest text-creme/50">{rotulo}</p>
      <p className="font-display text-3xl tracking-wide text-creme">{valor}</p>
    </div>
  );
}

function Vazio({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
      <CalendarX2 className="mx-auto mb-3 size-10 text-creme/30" />
      <p className="font-display text-2xl tracking-wide">{titulo}</p>
      <p className="text-sm text-creme/50">{texto}</p>
    </div>
  );
}
