import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Área do Barbeiro | Rota 66",
  robots: { index: false, follow: false },
};

export default function LayoutBarbeiro({ children }: { children: React.ReactNode }) {
  return <div className="textura min-h-svh">{children}</div>;
}
