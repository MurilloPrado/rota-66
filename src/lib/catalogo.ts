import { cache } from "react";
import { BARBEIROS_DEMO, SERVICOS_DEMO } from "./config";
import { criarClientePublico, supabaseConfigurado } from "./supabase/publico";
import type { Barbeiro, Servico } from "./tipos";

export type Catalogo = { servicos: Servico[]; barbeiros: Barbeiro[]; demo: boolean };

export const buscarCatalogo = cache(async (): Promise<Catalogo> => {
  if (!supabaseConfigurado()) {
    return { servicos: SERVICOS_DEMO, barbeiros: BARBEIROS_DEMO, demo: true };
  }

  const supabase = criarClientePublico();
  const [servicos, barbeiros] = await Promise.all([
    supabase.from("servicos").select("id, nome, descricao, preco_centavos, duracao_min").eq("ativo", true).order("ordem"),
    supabase.from("barbeiros").select("id, nome, bio, foto_url").eq("ativo", true).order("nome"),
  ]);

  if (servicos.error || barbeiros.error) {
    console.error("Erro ao carregar catálogo", servicos.error ?? barbeiros.error);
  }

  return {
    servicos: (servicos.data ?? []) as Servico[],
    barbeiros: (barbeiros.data ?? []) as Barbeiro[],
    demo: false,
  };
});
