// Label bulat penuh. Dengan onClick menjadi tombol pilihan (aria-pressed).
const TONES = {
  ink: 'bg-ink text-on-ink',
  light: 'bg-white text-brand',
  deep: 'bg-brand-deep text-white',
  soft: 'bg-subtle text-ink',
};

export default function Pill({ tone = 'ink', onClick, pressed, className = '', children }) {
  const classes = `inline-flex items-center rounded-full px-4 py-1.5 text-[15px] font-bold ${TONES[tone]} ${className}`;
  if (onClick) {
    return (
      <button type="button" aria-pressed={pressed} onClick={onClick} className={`min-h-[44px] ${classes}`}>
        {children}
      </button>
    );
  }
  return <span className={classes}>{children}</span>;
}
