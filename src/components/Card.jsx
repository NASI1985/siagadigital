// Kartu dasar. Isi tersusun vertikal supaya tombol bisa menempel di dasar (mt-auto).
const TONES = {
  surface: 'bg-surface',
  brand: 'on-brand bg-brand text-white',
  'ink-outline': 'border-2 border-ink bg-surface',
  'brand-outline': 'border-2 border-brand-ink bg-surface',
  'danger-outline': 'border-2 border-danger-ink bg-surface',
  'danger-soft': 'border-2 border-danger-ink bg-danger-tint',
};

export default function Card({ as: Tag = 'section', tone = 'surface', className = '', children, ...rest }) {
  return (
    <Tag className={`flex flex-col rounded-card p-6 sm:p-8 ${TONES[tone]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
