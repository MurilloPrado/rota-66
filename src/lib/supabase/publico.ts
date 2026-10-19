import { createClient } from "@supabase/supabase-js";

export function supabaseConfigurado(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Cliente anônimo, sem cookies: usado na área pública (catálogo, disponibilidade,
// criação de agendamento). Tudo que ele pode fazer é limitado pelas policies/RPCs.
export function criarClientePublico() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}
