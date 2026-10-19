// Escudo estilo placa da Route 66, usado como logo.
export function Escudo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 110" className={`font-display ${className}`} aria-hidden="true">
      <path
        d="M10 10 Q50 0 90 10 L90 42 Q90 84 50 104 Q10 84 10 42 Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <text x="50" y="33" textAnchor="middle" fontSize="17" fill="currentColor" letterSpacing="2">
        ROTA
      </text>
      <line x1="16" y1="40" x2="84" y2="40" stroke="currentColor" strokeWidth="3" />
      <text x="50" y="86" textAnchor="middle" fontSize="48" fill="currentColor">
        66
      </text>
    </svg>
  );
}
