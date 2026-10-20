import type { Frame as FrameKind, Ornament } from '@/lib/themes';
import { Mandala } from './Mandala';

// Crest artwork and hero borders for each design. Pure SVG/CSS that uses
// currentColor and the theme variables, so it recolours with the template.

const svg = { viewBox: '0 0 200 200', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, 'aria-hidden': true } as const;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function Marigold(props: { className?: string }) {
  return (
    <svg {...svg} {...props}>
      {[64, 46, 28].map((r, ring) =>
        range(ring === 0 ? 20 : ring === 1 ? 16 : 12).map((i, _, arr) => {
          const a = (i / arr.length) * Math.PI * 2 + ring * 0.2;
          return <ellipse key={`${ring}-${i}`} cx={100 + Math.cos(a) * r} cy={100 + Math.sin(a) * r} rx={ring === 0 ? 9 : 8} ry={ring === 0 ? 6 : 5.5} transform={`rotate(${(a * 180) / Math.PI} ${100 + Math.cos(a) * r} ${100 + Math.sin(a) * r})`} opacity={1 - ring * 0.15} />;
        }),
      )}
      <circle cx="100" cy="100" r="12" fill="currentColor" />
    </svg>
  );
}

function Leaves(props: { className?: string }) {
  // A wreath: leaves along a circle, open at the top.
  const leaves = range(18).filter((i) => i !== 0 && i !== 17 && i !== 1);
  return (
    <svg {...svg} {...props}>
      <path d="M100 168 A68 68 0 1 1 100.1 168" strokeDasharray="300 200" opacity=".6" />
      {leaves.map((i) => {
        const a = (i / 18) * Math.PI * 2 - Math.PI / 2;
        const x = 100 + Math.cos(a) * 68, y = 100 + Math.sin(a) * 68;
        const deg = (a * 180) / Math.PI + (i < 9 ? 50 : -50);
        return <path key={i} d={`M${x} ${y} q 10 -6 20 0 q -10 6 -20 0Z`} transform={`rotate(${deg} ${x} ${y})`} fill="currentColor" fillOpacity=".35" />;
      })}
      <circle cx="100" cy="32" r="5" fill="currentColor" />
      {range(6).map((i) => (
        <ellipse key={i} cx="100" cy="88" rx="6" ry="12" transform={`rotate(${i * 60} 100 100)`} fill="currentColor" fillOpacity=".3" />
      ))}
      <circle cx="100" cy="100" r="5" fill="currentColor" />
    </svg>
  );
}

function Moon(props: { className?: string }) {
  const star = (x: number, y: number, s: number) => `M${x} ${y - s} L${x + s * 0.28} ${y - s * 0.28} L${x + s} ${y} L${x + s * 0.28} ${y + s * 0.28} L${x} ${y + s} L${x - s * 0.28} ${y + s * 0.28} L${x - s} ${y} L${x - s * 0.28} ${y - s * 0.28}Z`;
  return (
    <svg {...svg} {...props}>
      <path d="M122 46 A58 58 0 1 0 122 154 A46 46 0 1 1 122 46Z" fill="currentColor" fillOpacity=".2" />
      <path d={star(140, 70, 12)} fill="currentColor" />
      <path d={star(160, 112, 7)} fill="currentColor" />
      <path d={star(128, 140, 5)} fill="currentColor" />
      <circle cx="100" cy="100" r="86" strokeDasharray="1 7" opacity=".7" />
    </svg>
  );
}

function Paisley(props: { className?: string }) {
  // Peacock feather (mor-pankh): eye on top, barbs along the stem.
  return (
    <svg {...svg} {...props}>
      <path d="M100 190 C100 150 100 110 100 76" />
      {range(9).map((i) => {
        const y = 176 - i * 11;
        const w = 14 + i * 3.2;
        return (
          <g key={i} opacity={0.5 + i * 0.05}>
            <path d={`M100 ${y} q -${w / 2} -6 -${w} -16`} />
            <path d={`M100 ${y} q ${w / 2} -6 ${w} -16`} />
          </g>
        );
      })}
      <path d="M100 18 C136 30 140 80 100 96 C60 80 64 30 100 18Z" fill="currentColor" fillOpacity=".15" />
      <path d="M100 34 C122 42 124 72 100 84 C76 72 78 42 100 34Z" />
      <path d="M100 48 C112 52 113 68 100 74 C87 68 88 52 100 48Z" fill="currentColor" fillOpacity=".55" />
      <circle cx="100" cy="62" r="5" fill="currentColor" />
    </svg>
  );
}

function Lotus(props: { className?: string }) {
  return (
    <svg {...svg} {...props}>
      <path d="M100 52 C118 76 118 112 100 140 C82 112 82 76 100 52Z" fill="currentColor" fillOpacity=".25" />
      <path d="M96 140 C70 128 58 104 62 76 C80 90 94 110 100 140" />
      <path d="M104 140 C130 128 142 104 138 76 C120 90 106 110 100 140" />
      <path d="M94 142 C64 142 40 128 30 104 C54 104 80 116 100 142" />
      <path d="M106 142 C136 142 160 128 170 104 C146 104 120 116 100 142" />
      <path d="M40 156 q15 -8 30 0 t30 0 t30 0 t30 0" opacity=".7" />
      <path d="M56 170 q11 -6 22 0 t22 0 t22 0 t22 0" opacity=".45" />
      <circle cx="100" cy="36" r="4" fill="currentColor" />
    </svg>
  );
}

function Arch(props: { className?: string }) {
  // Mughal arch with a small dome finial.
  return (
    <svg {...svg} {...props}>
      <path d="M40 180 V100 C40 66 70 50 100 26 C130 50 160 66 160 100 V180" />
      <path d="M56 180 V104 C56 78 80 64 100 46 C120 64 144 78 144 104 V180" opacity=".7" />
      <path d="M100 26 V12" /><circle cx="100" cy="9" r="3.5" fill="currentColor" />
      <path d="M72 180 V110 C72 92 88 82 100 72 C112 82 128 92 128 110 V180" fill="currentColor" fillOpacity=".15" />
      <path d="M30 180 H170" />
      {range(5).map((i) => <circle key={i} cx={64 + i * 18} cy={190} r={2.5} fill="currentColor" />)}
    </svg>
  );
}

function Lamp(props: { className?: string }) {
  // Traditional brass lamp (nilavilakku / deepam).
  return (
    <svg {...svg} {...props}>
      <path d="M100 18 C110 32 110 44 100 52 C90 44 90 32 100 18Z" fill="currentColor" fillOpacity=".5" />
      <path d="M100 30 C104 36 104 42 100 46 C96 42 96 36 100 30Z" fill="currentColor" />
      <path d="M62 64 H138 C134 80 118 86 100 86 C82 86 66 80 62 64Z" fill="currentColor" fillOpacity=".25" />
      <path d="M52 64 H148" />
      <path d="M96 86 V150 M104 86 V150" />
      {[104, 122, 140].map((y) => <ellipse key={y} cx="100" cy={y} rx="9" ry="4" fill="currentColor" fillOpacity=".4" />)}
      <path d="M70 168 C76 154 124 154 130 168Z" fill="currentColor" fillOpacity=".3" />
      <path d="M58 178 H142" /><path d="M66 168 H134" />
    </svg>
  );
}

function Sun(props: { className?: string }) {
  return (
    <svg {...svg} {...props}>
      <path d="M48 124 A52 52 0 0 1 152 124Z" fill="currentColor" fillOpacity=".3" />
      {range(9).map((i) => {
        const a = Math.PI + (i / 8) * Math.PI;
        return <path key={i} d={`M${100 + Math.cos(a) * 62} ${124 + Math.sin(a) * 62} L${100 + Math.cos(a) * 82} ${124 + Math.sin(a) * 82}`} strokeLinecap="round" />;
      })}
      <path d="M24 134 q19 -9 38 0 t38 0 t38 0 t38 0" />
      <path d="M38 150 q15.5 -8 31 0 t31 0 t31 0 t31 0" opacity=".7" />
      <path d="M56 166 q11 -6 22 0 t22 0 t22 0 t22 0" opacity=".45" />
    </svg>
  );
}

function Monogram({ initials, className = '' }: { initials: string; className?: string }) {
  return (
    <div className={`grid place-items-center rounded-full border-[1.5px] border-current p-1.5 ${className}`} aria-hidden="true">
      <div className="grid h-full w-full place-items-center rounded-full border border-current/50">
        <span className="font-display text-[2.1em] font-semibold tracking-[0.12em] leading-none">{initials}</span>
      </div>
    </div>
  );
}

export function Crest({ ornament, initials, className = '' }: { ornament: Ornament; initials: string; className?: string }) {
  switch (ornament) {
    case 'marigold': return <Marigold className={className} />;
    case 'leaves': return <Leaves className={className} />;
    case 'moon': return <Moon className={className} />;
    case 'paisley': return <Paisley className={className} />;
    case 'lotus': return <Lotus className={className} />;
    case 'arch': return <Arch className={className} />;
    case 'lamp': return <Lamp className={className} />;
    case 'sun': return <Sun className={className} />;
    case 'monogram': return <Monogram initials={initials} className={`${className} text-[14px] sm:text-[18px]`} />;
    default: return <Mandala className={className} />;
  }
}

const Corner = ({ className }: { className: string }) => (
  <svg viewBox="0 0 60 60" className={`absolute h-12 w-12 text-inv-accent sm:h-16 sm:w-16 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M4 56 V12 Q4 4 12 4 H56" />
    <path d="M12 56 V20 Q12 12 20 12 H56" opacity=".5" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path d="M22 22 q8 -2 10 -10 q2 8 10 10 q-8 2 -10 10 q-2 -8 -10 -10Z" fill="currentColor" fillOpacity=".35" />
  </svg>
);

/** Decorative border inside the hero. */
export function HeroFrame({ frame }: { frame: FrameKind }) {
  const base = 'pointer-events-none absolute';
  switch (frame) {
    case 'single':
      return <div className={`${base} inset-4 rounded-[14px] border border-inv-accent/60 sm:inset-7`} />;
    case 'corners':
      return (
        <div className={`${base} inset-3 sm:inset-5`}>
          <Corner className="top-0 left-0" />
          <Corner className="top-0 right-0 -scale-x-100" />
          <Corner className="bottom-0 left-0 -scale-y-100" />
          <Corner className="right-0 bottom-0 -scale-100" />
        </div>
      );
    case 'arch':
      // Jharokha / Mughal arch: the border curves to a point at the top.
      return (
        <div className={`${base} inset-x-4 top-6 bottom-4 border-[1.5px] border-inv-accent/60 sm:inset-x-8`} style={{ borderRadius: '50% 50% 16px 16px / 150px 150px 16px 16px' }}>
          <div className="absolute inset-1.5 border border-inv-accent/30" style={{ borderRadius: '50% 50% 12px 12px / 144px 144px 12px 12px' }} />
        </div>
      );
    case 'kasavu': {
      // Gold saree-border bands top and bottom.
      const band = 'absolute inset-x-0 h-5 sm:h-6';
      const stripes = { backgroundImage: 'linear-gradient(var(--color-inv-accent) 0 3px, transparent 3px 7px, var(--color-inv-accent) 7px 9px, transparent 9px 12px, var(--color-inv-accent) 12px 13px, transparent 13px)' };
      return (
        <div className={`${base} inset-0`}>
          <div className={`${band} top-0`} style={stripes} />
          <div className={`${band} bottom-0 rotate-180`} style={stripes} />
          <div className="absolute inset-x-5 top-9 bottom-9 border-x border-inv-accent/40 sm:inset-x-8" />
        </div>
      );
    }
    default:
      return (
        <div className={`${base} inset-3.5 rounded-[18px] border-[1.5px] border-inv-accent/50 sm:inset-6`}>
          <div className="absolute inset-1.5 rounded-[14px] border border-inv-accent/25" />
        </div>
      );
  }
}

export const initialsOf = (a: string, b: string) => `${(a.trim()[0] ?? '').toUpperCase()}${(b.trim()[0] ?? '').toUpperCase()}`;
