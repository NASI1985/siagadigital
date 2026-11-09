// Kotak pemberitahuan: kuning (penafian), merah muda (bahaya), tint teal (info), abu.
const TONES = {
  notice: 'bg-notice text-notice-ink',
  danger: 'bg-danger-tint text-ink',
  brand: 'bg-brand-tint text-ink',
  subtle: 'bg-subtle text-ink',
};

export default function Notice({ tone = 'notice', icon: Icon, className = '', children }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${TONES[tone]} ${className}`}>
      {Icon ? <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" /> : null}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
