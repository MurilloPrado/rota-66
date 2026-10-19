// Datas como "AAAA-MM-DD" e horas como "HH:MM", sempre no fuso de Brasília.
// O Brasil não tem horário de verão desde 2019, então o offset é fixo.
export const FUSO = "America/Sao_Paulo";
const OFFSET = "-03:00";

export function hojeSP(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(new Date());
}

export function somarDias(dia: string, n: number): string {
  const d = new Date(`${dia}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function diaValido(valor: unknown): valor is string {
  return typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(Date.parse(`${valor}T12:00:00Z`));
}

export function diaDaSemana(dia: string): number {
  return new Date(`${dia}T12:00:00Z`).getUTCDay();
}

export function instante(dia: string, hora: string): Date {
  return new Date(`${dia}T${hora}:00${OFFSET}`);
}

export function horaSP(data: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit" }).format(new Date(data));
}

export function formatarDia(dia: string, opcoes: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }): string {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", ...opcoes }).format(new Date(`${dia}T12:00:00Z`));
}
