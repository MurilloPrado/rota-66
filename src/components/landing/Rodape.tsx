import Link from "next/link";
import { Escudo } from "@/components/Escudo";
import { IconeInstagram, IconeWhatsApp } from "@/components/IconesMarcas";
import { BARBEARIA, ENDERECO_COMPLETO } from "@/lib/config";
import { linkWhatsApp } from "@/lib/formatos";

export function Rodape() {
  return (
    <footer className="border-t border-white/5 bg-asfalto-950 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-3">
          <Escudo className="h-10 w-10 text-ambar-400" />
          <div>
            <p className="font-display text-xl tracking-wider">
              {BARBEARIA.nome} {BARBEARIA.sobrenome}
            </p>
            <p className="text-xs text-creme/50">{ENDERECO_COMPLETO}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-creme/60">
          <a href={BARBEARIA.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-ambar-400">
            <IconeInstagram className="size-6" />
          </a>
          <a href={linkWhatsApp(BARBEARIA.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-ambar-400">
            <IconeWhatsApp className="size-6" />
          </a>
          <Link href="/barbeiro/login" className="text-xs uppercase tracking-widest hover:text-ambar-400">
            Área do barbeiro
          </Link>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-creme/30">
        © {new Date().getFullYear()} {BARBEARIA.nome} {BARBEARIA.sobrenome}. Todos os direitos reservados.
      </p>
    </footer>
  );
}
