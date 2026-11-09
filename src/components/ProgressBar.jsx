// Progress bar yang bisa dibaca pembaca layar.
const TONES = {
  brand: { track: 'bg-line', fill: 'bg-brand' },
  light: { track: 'bg-brand-deep', fill: 'bg-white' },
};

export default function ProgressBar({ value, max = 100, label, tone = 'brand', className = '' }) {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));
  const colors = TONES[tone];

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`h-2.5 w-full overflow-hidden rounded-full ${colors.track} ${className}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-500 ${colors.fill}`} style={{ width: `${percent}%` }} />
    </div>
  );
}
