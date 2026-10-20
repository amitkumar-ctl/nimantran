// Decorative crest drawn in SVG (scales crisply, ~1 KB, no image request).
export function Mandala({ className = '' }: { className?: string }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="22" />
      <circle cx="100" cy="100" r="34" strokeDasharray="2 4" />
      {petals.map((deg) => (
        <g key={deg} transform={`rotate(${deg} 100 100)`}>
          <path d="M100 40 C112 58 112 70 100 78 C88 70 88 58 100 40Z" />
          <path d="M100 18 C120 44 118 62 100 72" opacity=".6" />
          <circle cx="100" cy="30" r="3" fill="currentColor" />
        </g>
      ))}
      <circle cx="100" cy="100" r="8" fill="currentColor" />
    </svg>
  );
}

export function Divider() {
  return (
    <svg viewBox="0 0 120 14" className="mx-auto mb-6 block h-3.5 w-28 text-gold" aria-hidden="true">
      <path d="M0 7h48M72 7h48" stroke="currentColor" />
      <path d="M60 1l6 6-6 6-6-6z" fill="currentColor" />
    </svg>
  );
}
