import { Agendamento } from "@/components/agendamento/Agendamento";
import { Cabecalho } from "@/components/landing/Cabecalho";
import { Galeria } from "@/components/landing/Galeria";
import { Hero } from "@/components/landing/Hero";
import { Rodape } from "@/components/landing/Rodape";
import { Sobre } from "@/components/landing/Sobre";
import { TabelaPrecos } from "@/components/landing/TabelaPrecos";
import { buscarCatalogo } from "@/lib/catalogo";

// Recarrega serviços/barbeiros do banco a cada 5 minutos.
export const revalidate = 300;

export default async function Home() {
  const { servicos, barbeiros, demo } = await buscarCatalogo();

  return (
    <>
      <Cabecalho />
      <main>
        <Hero />
        <Sobre />
        <Galeria />
        <TabelaPrecos servicos={servicos} />
        <Agendamento servicos={servicos} barbeiros={barbeiros} demo={demo} />
      </main>
      <Rodape />
    </>
  );
}
