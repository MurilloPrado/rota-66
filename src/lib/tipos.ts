export type Servico = {
  id: string;
  nome: string;
  descricao: string | null;
  preco_centavos: number;
  duracao_min: number;
};

export type Barbeiro = {
  id: string;
  nome: string;
  bio: string | null;
  foto_url: string | null;
};

export type IntervaloOcupado = {
  barbeiro_id: string;
  inicio: string;
  fim: string;
};

export type AgendamentoDoBarbeiro = {
  id: string;
  inicio: string;
  fim: string;
  status: "confirmado" | "concluido" | "cancelado";
  cliente_nome: string;
  cliente_telefone: string;
  servicos: { nome: string; preco_centavos: number } | null;
};
