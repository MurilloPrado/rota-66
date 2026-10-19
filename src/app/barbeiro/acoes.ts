"use server";

import { redirect } from "next/navigation";
import { supabaseConfigurado } from "@/lib/supabase/publico";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoLogin = { erro?: string };

export async function entrar(_anterior: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  if (!supabaseConfigurado()) return { erro: "Supabase não configurado. Veja o README." };

  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  if (!email || !senha) return { erro: "Preencha e-mail e senha." };

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return { erro: "E-mail ou senha inválidos." };

  redirect("/barbeiro/dashboard");
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  redirect("/barbeiro/login");
}
