import { Titulo } from "./Titulo";

// Fotos do Unsplash (edite a lista para trocar). Se uma foto não carregar,
// aparece um bloco com gradiente no lugar.
const FOTOS = [
  { src: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1200&q=70", legenda: "Cadeira vintage", destaque: true },
  { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=70", legenda: "Degradê" },
  { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=70", legenda: "Barba na navalha" },
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1100&q=70", legenda: "Nosso ambiente", destaque: true },
  { src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=70", legenda: "Rock no palco" },
  { src: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=600&q=70", legenda: "Navalha afiada" },
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
                  backgroundImage: `url("${foto.src}"), linear-gradient(135deg, var(--color-couro-700), var(--color-asfalto-800) 60%, var(--color-asfalto-950))`,
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
