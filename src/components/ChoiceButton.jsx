// Pilihan berbentuk tombol (Cek Dulu langkah 1, wizard Bantuan, balasan Latihan).
export default function ChoiceButton({ selected, onClick, disabled = false, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[48px] w-full items-center rounded-xl border-2 px-4 py-2.5 text-left text-[15px] font-semibold transition ${
        selected ? 'border-brand-ink bg-brand-tint' : 'border-line bg-surface hover:border-muted'
      } ${disabled && !selected ? 'cursor-default hover:border-line' : ''}`}
    >
      {children}
    </button>
  );
}
