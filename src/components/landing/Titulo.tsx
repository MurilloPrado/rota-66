export function Titulo({ chapeu, children }: { chapeu: string; children: React.ReactNode }) {
  return (
    <div className="mb-12 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ambar-400">{chapeu}</p>
      <h2 className="mt-2 font-display text-5xl tracking-wide sm:text-6xl">{children}</h2>
      <div className="mx-auto mt-4 h-0.5 w-16 bg-sangue-500" />
    </div>
  );
}
