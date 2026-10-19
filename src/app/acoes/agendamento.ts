"use server";

import { buscarCatalogo } from "@/lib/catalogo";
import { DIAS_AGENDAMENTO } from "@/lib/config";
import { diaValido, hojeSP, instante, somarDias } from "@/lib/datas";
import { somenteDigitos } from "@/lib/formatos";
import { gerarHorariosLivres } from "@/lib/horarios";
import { criarClientePublico } from "@/lib/supabase/publico";
import type { IntervaloOcupado } from "@/lib/tipos";

type EntradaHorarios = { dia: string; servicoId: string; barbeiroId: string | null };

export async function buscarHorarios({ dia, servicoId, barbeiroId }: EntradaHorarios): Promise<{ horarios: string[]; erro?: string }> {
  const hoje = hojeSP();
  if (!diaValido(dia) || dia < hoje || dia > somarDias(hoje, DIAS_AGENDAMENTO)) {
    return { horarios: [], erro: "Data inválida." };
  }

  const { servicos, barbeiros, demo } = await buscarCatalogo();
  const servico = servicos.find((s) => s.id === servicoId);
  if (!servico) return { horarios: [], erro: "Serviço não encontrado." };

  const barbeiroIds = barbeiroId ? barbeiros.filter((b) => b.id === barbeiroId).map((b) => b.id) : barbeiros.map((b) => b.id);
  if (barbeiroIds.length === 0) return { horarios: [], erro: "Barbeiro não encontrado." };

  let ocupados: IntervaloOcupado[] = [];
  if (!demo) {
    const { data, error } = await criarClientePublico().rpc("horarios_ocupados", { p_dia: dia });
    if (error) {
      console.error("horarios_ocupados", error);
      return { horarios: [], erro: "Não foi possível consultar a agenda. Tente novamente." };
    }
    ocupados = data as IntervaloOcupado[];
  }

  return { horarios: gerarHorariosLivres({ dia, duracaoMin: servico.duracao_min, barbeiroIds, ocupados }) };
}

type EntradaAgendamento = EntradaHorarios & { hora: string; nome: string; telefone: string };

export type ResultadoAgendamento =
  | { ok: true; barbeiroNome: string; demo: boolean }
  | { ok: false; erro: string; horarioOcupado?: boolean };

const MENSAGENS_ERRO: Record<string, string> = {
  HORARIO_INDISPONIVEL: "Esse horário acabou de ser reservado. Escolha outro, por favor.",
  HORARIO_INVALIDO: "Horário inválido.",
  SERVICO_INVALIDO: "Serviço indisponível.",
  BARBEIRO_INVALIDO: "Barbeiro indisponível.",
};

export async function criarAgendamento(entrada: EntradaAgendamento): Promise<ResultadoAgendamento> {
  const nome = entrada.nome.trim();
  const telefone = somenteDigitos(entrada.telefone);
  if (nome.length < 2 || nome.length > 80) return { ok: false, erro: "Informe seu nome." };
  if (telefone.length < 10 || telefone.length > 11) return { ok: false, erro: "Informe um telefone válido com DDD." };

  // Revalida no servidor: o horário precisa estar entre os horários livres agora.
  const { horarios, erro } = await buscarHorarios(entrada);
  if (erro) return { ok: false, erro };
  if (!horarios.includes(entrada.hora)) {
    return { ok: false, erro: MENSAGENS_ERRO.HORARIO_INDISPONIVEL, horarioOcupado: true };
  }

  const { barbeiros, demo } = await buscarCatalogo();
  if (demo) {
    const barbeiro = barbeiros.find((b) => b.id === entrada.barbeiroId) ?? barbeiros[0];
    return { ok: true, barbeiroNome: barbeiro.nome, demo: true };
  }

  const { data, error } = await criarClientePublico()
    .rpc("criar_agendamento", {
      p_servico_id: entrada.servicoId,
      p_barbeiro_id: entrada.barbeiroId,
      p_inicio: instante(entrada.dia, entrada.hora).toISOString(),
      p_cliente_nome: nome,
      p_cliente_telefone: `55${telefone}`,
    })
    .single<{ out_barbeiro_nome: string }>();

  if (error || !data) {
    const codigo = Object.keys(MENSAGENS_ERRO).find((c) => error?.message.includes(c));
    if (!codigo) console.error("criar_agendamento", error);
    return {
      ok: false,
      erro: codigo ? MENSAGENS_ERRO[codigo] : "Não foi possível concluir o agendamento. Tente novamente.",
      horarioOcupado: codigo === "HORARIO_INDISPONIVEL",
    };
  }

  return { ok: true, barbeiroNome: data.out_barbeiro_nome, demo: false };
}
