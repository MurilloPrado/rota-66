import type { Barbeiro, Servico } from "./tipos";

// Dados da barbearia — edite aqui endereço, contatos e redes sociais.
export const BARBEARIA = {
  nome: "Rota 66",
  sobrenome: "Navalha & Rock",
  slogan: "Corte clássico, atitude rock'n'roll.",
  endereco: {
    rua: "Av. Exemplo, 66",
    bairro: "Centro",
    cidade: "São Paulo",
    uf: "SP",
    cep: "00000-000",
  },
  // Número com DDI + DDD, só dígitos (usado no link do WhatsApp).
  whatsapp: "5511999999999",
  instagram: "https://instagram.com/rota66navalharock",
};

export const ENDERECO_COMPLETO = `${BARBEARIA.endereco.rua} - ${BARBEARIA.endereco.bairro}, ${BARBEARIA.endereco.cidade} - ${BARBEARIA.endereco.uf}, ${BARBEARIA.endereco.cep}`;
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ENDERECO_COMPLETO)}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ENDERECO_COMPLETO)}&output=embed`;

// Horário de funcionamento por dia da semana (0 = domingo). null = fechado.
export const HORARIO_FUNCIONAMENTO: Record<number, { abre: string; fecha: string } | null> = {
  0: null,
  1: null,
  2: { abre: "09:00", fecha: "20:00" },
  3: { abre: "09:00", fecha: "20:00" },
  4: { abre: "09:00", fecha: "20:00" },
  5: { abre: "09:00", fecha: "20:00" },
  6: { abre: "08:00", fecha: "18:00" },
};

export const INTERVALO_SLOTS_MIN = 30; // de quanto em quanto tempo oferecer horários
export const ANTECEDENCIA_MIN = 30; // antecedência mínima para agendar
export const DIAS_AGENDAMENTO = 14; // quantos dias à frente o cliente pode agendar

// Usados quando o Supabase ainda não está configurado (modo demonstração).
export const SERVICOS_DEMO: Servico[] = [
  { id: "demo-corte", nome: "Corte de Cabelo", descricao: "Tesoura e/ou máquina, lavagem e finalização.", preco_centavos: 5000, duracao_min: 40 },
  { id: "demo-barba", nome: "Barba", descricao: "Navalha, toalha quente e balm hidratante.", preco_centavos: 4000, duracao_min: 30 },
  { id: "demo-combo", nome: "Combo Cabelo + Barba", descricao: "O pacote completo da estrada.", preco_centavos: 8000, duracao_min: 70 },
  { id: "demo-toalha", nome: "Toalha Quente", descricao: "Ritual de toalha quente com óleos essenciais.", preco_centavos: 2000, duracao_min: 15 },
  { id: "demo-pezinho", nome: "Pezinho / Acabamento", descricao: "Contorno e acabamento entre um corte e outro.", preco_centavos: 2000, duracao_min: 15 },
];

export const BARBEIROS_DEMO: Barbeiro[] = [
  { id: "demo-elvis", nome: "Elvis", bio: "Pompadour, degradê e clássicos dos anos 50.", foto_url: null },
  { id: "demo-johnny", nome: "Johnny", bio: "Especialista em barba e navalha.", foto_url: null },
  { id: "demo-joan", nome: "Joan", bio: "Cortes modernos, freestyle e desenhos.", foto_url: null },
];
