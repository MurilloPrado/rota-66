import { CalendarDays, MapPin } from "lucide-react";
import { Escudo } from "@/components/Escudo";
import { BARBEARIA } from "@/lib/config";

export function Hero() {
  return (
    <section id="inicio" className="textura relative flex min-h-[100svh] items-center overflow-hidden pt-16">
      {/* Brilho âmbar de "luz de bar" */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ambar-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="text-center lg:text-left">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ambar-500/30 bg-ambar-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-ambar-300">
            Barbearia desde a estrada
          </p>
          <h1 className="font-display text-7xl leading-[0.85] tracking-wide sm:text-8xl lg:text-9xl">
            {BARBEARIA.nome}
            <span className="block text-ambar-400">{BARBEARIA.sobrenome}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-creme/70 lg:mx-0">
            {BARBEARIA.slogan} Navalha afiada, toalha quente e rock tocando alto.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#agendar"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ambar-500 px-8 py-4 font-display text-2xl tracking-wider text-asfalto-950 shadow-lg shadow-ambar-500/20 transition hover:-translate-y-0.5 hover:bg-ambar-400 sm:w-auto"
            >
              <CalendarDays className="size-6" />
              Agendar horário
            </a>
            <a
              href="#contato"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 px-8 py-4 font-display text-2xl tracking-wider text-creme transition hover:border-ambar-400 hover:text-ambar-400 sm:w-auto"
            >
              <MapPin className="size-5" />
              Como chegar
            </a>
          </div>
        </div>

        <div className="hidden justify-center lg:flex">
          <Escudo className="w-72 text-ambar-400 drop-shadow-[0_0_40px_rgb(227_149_31/0.35)]" />
        </div>
      </div>

      <div className="faixa-estrada absolute inset-x-0 bottom-0 h-1 opacity-60" />
    </section>
  );
}
