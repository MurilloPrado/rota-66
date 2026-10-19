import { Clock } from "lucide-react";
import { duracao, precoBRL } from "@/lib/formatos";
import type { Servico } from "@/lib/tipos";
import { Titulo } from "./Titulo";

export function TabelaPrecos({ servicos }: { servicos: Servico[] }) {
  return (
    <section id="precos" className="textura bg-asfalto-900 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Titulo chapeu="Cardápio da casa">Serviços & preços</Titulo>

        <ul className="rounded-xl border border-ambar-500/20 bg-asfalto-950/60 p-6 sm:p-10">
          {servicos.map((s) => (
            <li key={s.id} className="border-b border-dashed border-white/10 py-5 first:pt-0 last:border-0 last:pb-0">
              <div className="flex items-baseline gap-3">
                <h3 className="font-display text-2xl tracking-wider sm:text-3xl">{s.nome}</h3>
                <span className="mb-1.5 hidden flex-1 border-b border-dotted border-white/20 sm:block" />
                <span className="ml-auto font-display text-2xl text-ambar-400 sm:ml-0 sm:text-3xl">{precoBRL(s.preco_centavos)}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-sm text-creme/60">
                <p>{s.descricao}</p>
                <span className="inline-flex items-center gap-1 text-creme/50">
                  <Clock className="size-3.5" /> {duracao(s.duracao_min)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <a
            href="#agendar"
            className="inline-block rounded-md bg-sangue-500 px-8 py-3 font-display text-2xl tracking-wider text-creme transition hover:bg-sangue-600"
          >
            Quero agendar
          </a>
        </div>
      </div>
    </section>
  );
}
