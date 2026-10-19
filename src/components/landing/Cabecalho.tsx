"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Escudo } from "@/components/Escudo";

const LINKS = [
  { href: "#sobre", rotulo: "Sobre" },
  { href: "#galeria", rotulo: "Galeria" },
  { href: "#precos", rotulo: "Preços" },
  { href: "#contato", rotulo: "Contato" },
];

export function Cabecalho() {
  const [aberto, setAberto] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-asfalto-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2 text-ambar-400">
          <Escudo className="h-9 w-9" />
          <span className="font-display text-2xl leading-none tracking-wider text-creme">
            Rota 66 <span className="text-ambar-400">Navalha & Rock</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium uppercase tracking-widest text-creme/70 transition hover:text-ambar-400">
                {l.rotulo}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#agendar"
              className="rounded-md bg-ambar-500 px-4 py-2 text-sm font-bold uppercase tracking-wider text-asfalto-950 transition hover:bg-ambar-400"
            >
              Agendar
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          className="rounded-md p-2 text-creme md:hidden"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
        >
          {aberto ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {aberto && (
        <ul className="space-y-1 border-t border-white/5 bg-asfalto-950 px-4 pb-4 pt-2 md:hidden">
          {[...LINKS, { href: "#agendar", rotulo: "Agendar horário" }].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setAberto(false)}
                className="block rounded-md px-3 py-3 font-display text-xl tracking-wider text-creme hover:bg-white/5 hover:text-ambar-400"
              >
                {l.rotulo}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
