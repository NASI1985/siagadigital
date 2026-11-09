// Badge merah kecil, misalnya "4 tanda bahaya".
export default function Badge({ children }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-danger px-4 py-1.5 text-[15px] font-bold text-white">
      {children}
    </span>
  );
}
