export function precoBRL(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function duracao(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const resto = min % 60;
  return resto ? `${h}h${String(resto).padStart(2, "0")}` : `${h}h`;
}

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

// (11) 99999-9999
export function mascaraTelefone(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function linkWhatsApp(numero: string, mensagem?: string): string {
  const base = `https://api.whatsapp.com/send?phone=${somenteDigitos(numero)}`;
  return mensagem ? `${base}&text=${encodeURIComponent(mensagem)}` : base;
}
