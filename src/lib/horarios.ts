import { ANTECEDENCIA_MIN, HORARIO_FUNCIONAMENTO, INTERVALO_SLOTS_MIN } from "./config";
import { diaDaSemana, horaSP, instante } from "./datas";
import type { IntervaloOcupado } from "./tipos";

type Parametros = {
  dia: string;
  duracaoMin: number;
  barbeiroIds: string[]; // um único barbeiro, ou todos para "qualquer barbeiro"
  ocupados: IntervaloOcupado[];
  agora?: Date;
};

// Retorna os horários ("HH:MM") em que pelo menos um dos barbeiros está livre
// durante toda a duração do serviço, dentro do horário de funcionamento.
export function gerarHorariosLivres({ dia, duracaoMin, barbeiroIds, ocupados, agora = new Date() }: Parametros): string[] {
  const expediente = HORARIO_FUNCIONAMENTO[diaDaSemana(dia)];
  if (!expediente || barbeiroIds.length === 0) return [];

  const abre = instante(dia, expediente.abre).getTime();
  const fecha = instante(dia, expediente.fecha).getTime();
  const duracao = duracaoMin * 60_000;
  const passo = INTERVALO_SLOTS_MIN * 60_000;
  const limite = agora.getTime() + ANTECEDENCIA_MIN * 60_000;

  const intervalos = ocupados.map((o) => ({
    barbeiro: o.barbeiro_id,
    inicio: new Date(o.inicio).getTime(),
    fim: new Date(o.fim).getTime(),
  }));

  const livres: string[] = [];
  for (let inicio = abre; inicio + duracao <= fecha; inicio += passo) {
    if (inicio < limite) continue;
    const fim = inicio + duracao;
    const algumLivre = barbeiroIds.some(
      (id) => !intervalos.some((o) => o.barbeiro === id && o.inicio < fim && o.fim > inicio),
    );
    if (algumLivre) livres.push(horaSP(new Date(inicio)));
  }
  return livres;
}
