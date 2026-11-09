// Teks kecil kapital di atas judul, misalnya "KENALI · LANGKAH 1 DARI 3".
const TONES = {
  brand: 'text-brand-ink',
  danger: 'text-danger-ink',
  light: 'text-white',
};

export default function Eyebrow({ tone = 'brand', className = '', children }) {
  return <p className={`text-eyebrow font-bold uppercase ${TONES[tone]} ${className}`}>{children}</p>;
}
