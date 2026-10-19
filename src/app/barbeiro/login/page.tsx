"use client";

import { LoaderCircle, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Escudo } from "@/components/Escudo";
import { entrar, type EstadoLogin } from "../acoes";

export default function Login() {
  const [estado, acao, enviando] = useActionState<EstadoLogin, FormData>(entrar, {});

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Escudo className="mx-auto h-20 w-20 text-ambar-400" />
          <h1 className="mt-4 font-display text-4xl tracking-wide">Área do Barbeiro</h1>
          <p className="text-sm text-creme/50">Entre para ver sua agenda</p>
        </div>

        <form action={acao} className="space-y-4 rounded-2xl border border-white/10 bg-asfalto-900 p-6 shadow-2xl shadow-black/40">
          {estado.erro && (
            <p role="alert" className="rounded-md border border-sangue-500/40 bg-sangue-500/10 px-3 py-2 text-sm text-red-200">
              {estado.erro}
            </p>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-creme/70">E-mail</span>
            <span className="flex items-center gap-3 rounded-md border border-white/10 bg-asfalto-800 px-3 focus-within:border-ambar-400">
              <Mail className="size-4 text-creme/40" />
              <input name="email" type="email" required autoComplete="email" className="w-full bg-transparent py-3 outline-none" />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-creme/70">Senha</span>
            <span className="flex items-center gap-3 rounded-md border border-white/10 bg-asfalto-800 px-3 focus-within:border-ambar-400">
              <Lock className="size-4 text-creme/40" />
              <input name="senha" type="password" required autoComplete="current-password" className="w-full bg-transparent py-3 outline-none" />
            </span>
          </label>

          <button
            type="submit"
            disabled={enviando}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-ambar-500 py-3 font-display text-2xl tracking-wider text-asfalto-950 transition hover:bg-ambar-400 disabled:opacity-60"
          >
            {enviando && <LoaderCircle className="size-5 animate-spin" />}
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-creme/50 hover:text-ambar-400">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </main>
  );
}
