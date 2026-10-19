import { Clock, MapPin, Phone } from "lucide-react";
import { IconeInstagram, IconeWhatsApp } from "@/components/IconesMarcas";
import { BARBEARIA, ENDERECO_COMPLETO, HORARIO_FUNCIONAMENTO, MAPS_EMBED_URL, MAPS_URL } from "@/lib/config";
import { linkWhatsApp, mascaraTelefone } from "@/lib/formatos";
import { Titulo } from "./Titulo";

const NOMES_DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Agrupa dias consecutivos com o mesmo horário: "Terça a Sexta · 09:00 – 20:00".
function linhasHorario() {
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  const grupos: { dias: number[]; texto: string }[] = [];
  for (const d of ordem) {
    const h = HORARIO_FUNCIONAMENTO[d];
    const texto = h ? `${h.abre} – ${h.fecha}` : "Fechado";
    const ultimo = grupos.at(-1);
    if (ultimo && ultimo.texto === texto) ultimo.dias.push(d);
    else grupos.push({ dias: [d], texto });
  }
  return grupos.map((g) => ({
    dias: g.dias.length > 1 ? `${NOMES_DIAS[g.dias[0]]} a ${NOMES_DIAS[g.dias.at(-1)!]}` : NOMES_DIAS[g.dias[0]],
    texto: g.texto,
  }));
}

export function Sobre() {
  const telefone = mascaraTelefone(BARBEARIA.whatsapp.slice(2));

  return (
    <section id="sobre" className="bg-asfalto-900 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Titulo chapeu="Bem-vindo à estrada">A barbearia</Titulo>

        <p className="mx-auto mb-14 max-w-2xl text-center text-lg leading-relaxed text-creme/70">
          A Rota 66 nasceu da paixão por cortes clássicos e pelo bom e velho rock&apos;n&apos;roll. Aqui o atendimento é sem pressa:
          cadeira de couro, cerveja gelada, navalha precisa e uma trilha sonora à altura.
        </p>

        <div id="contato" className="grid scroll-mt-20 gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <Cartao icone={<MapPin className="size-5" />} titulo="Endereço">
              <p>{ENDERECO_COMPLETO}</p>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-ambar-400 hover:underline">
                Abrir no Google Maps →
              </a>
            </Cartao>

            <Cartao icone={<Clock className="size-5" />} titulo="Horário de funcionamento">
              <ul className="space-y-1">
                {linhasHorario().map((l) => (
                  <li key={l.dias} className="flex justify-between gap-4">
                    <span>{l.dias}</span>
                    <span className={l.texto === "Fechado" ? "text-sangue-500" : "text-creme"}>{l.texto}</span>
                  </li>
                ))}
              </ul>
            </Cartao>

            <Cartao icone={<Phone className="size-5" />} titulo="Contato & redes">
              <div className="flex flex-wrap gap-3">
                <a
                  href={linkWhatsApp(BARBEARIA.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#25D366]/15 px-3 py-2 text-sm font-semibold text-[#5ee69a] hover:bg-[#25D366]/25"
                >
                  <IconeWhatsApp /> {telefone}
                </a>
                <a
                  href={BARBEARIA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  <IconeInstagram /> Instagram
                </a>
              </div>
            </Cartao>
          </div>

          <div className="min-h-80 overflow-hidden rounded-xl border border-white/10">
            <iframe
              title="Mapa da Rota 66 Navalha & Rock"
              src={MAPS_EMBED_URL}
              className="h-full min-h-80 w-full grayscale invert-[0.9] hue-rotate-180"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Cartao({ icone, titulo, children }: { icone: React.ReactNode; titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-asfalto-800 p-5">
      <h3 className="mb-3 flex items-center gap-2 font-display text-2xl tracking-wider text-ambar-400">
        {icone} {titulo}
      </h3>
      <div className="text-creme/75">{children}</div>
    </div>
  );
}
