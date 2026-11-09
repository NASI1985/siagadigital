// Tombol dengan varian warna. Pakai `href` untuk navigasi (jadi <a>), selain itu <button>.
const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-deep',
  outline: 'border-2 border-ink bg-surface text-ink hover:bg-subtle',
  dark: 'bg-ink text-on-ink hover:opacity-90',
  danger: 'bg-danger text-white hover:brightness-95',
  light: 'bg-white text-brand hover:bg-brand-tint',
};

const SIZES = {
  md: 'min-h-[48px] px-5 py-2 text-[15px]',
  sm: 'min-h-[44px] px-4 py-2 text-sm',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  className = '',
  children,
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl text-center font-bold transition ${
    VARIANTS[variant]
  } ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
