"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { somarDias } from "@/lib/datas";

const estiloBotao = "rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-wider transition";
const ativo = "bg-ambar-500 text-asfalto-950";
const inativo = "bg-asfalto-800 text-creme/70 hover:bg-asfalto-700";

export function FiltroData({ dia, hoje }: { dia: string; hoje: string }) {
  const router = useRouter();
  const amanha = somarDias(hoje, 1);
  const outraData = dia !== hoje && dia !== amanha;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href="/barbeiro/dashboard" className={`${estiloBotao} ${dia === hoje ? ativo : inativo}`}>
        Hoje
      </Link>
      <Link href={`/barbeiro/dashboard?data=${amanha}`} className={`${estiloBotao} ${dia === amanha ? ativo : inativo}`}>
        Amanhã
      </Link>
      <input
        type="date"
        value={dia}
        onChange={(e) => e.target.value && router.push(`/barbeiro/dashboard?data=${e.target.value}`)}
        aria-label="Escolher data"
        className={`rounded-md border px-3 py-2 text-sm outline-none ${
          outraData ? "border-ambar-400 bg-ambar-500/10 text-ambar-300" : "border-white/10 bg-asfalto-800 text-creme/70"
        }`}
      />
    </div>
  );
}
