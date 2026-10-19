import { Titulo } from "./Titulo";

// Coloque as fotos em /public/galeria com estes nomes (ou edite a lista).
// Enquanto a foto não existir, aparece um bloco com gradiente no lugar.
const FOTOS = [
  { src: "/galeria/01.jpg", legenda: "Pompadour clássico", destaque: true },
  { src: "/galeria/02.jpg", legenda: "Barba na navalha" },
  { src: "/galeria/03.jpg", legenda: "Degradê" },
  { src: "/galeria/04.jpg", legenda: "Nosso ambiente" },
  { src: "/galeria/05.jpg", legenda: "Toalha quente" },
  { src: "/galeria/06.jpg", legenda: "Cadeiras de couro", destaque: true },
  { src: "/galeria/07.jpg", legenda: "Acabamento" },
  { src: "/galeria/08.jpg", legenda: "Rock na vitrola" },
];

export function Galeria() {
  return (
    <section id="galeria" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Titulo chapeu="Trabalhos & ambiente">Galeria</Titulo>

        <div className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4">
          {FOTOS.map((foto) => (
            <figure
              key={foto.src}
              className={`group relative overflow-hidden rounded-lg border border-white/10 ${foto.destaque ? "row-span-2" : ""}`}
            >
              <div
                role="img"
                aria-label={foto.legenda}
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${foto.src}), linear-gradient(135deg, var(--color-couro-700), var(--color-asfalto-800) 60%, var(--color-asfalto-950))`,
                }}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 font-display text-lg tracking-wider text-creme">
                {foto.legenda}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
