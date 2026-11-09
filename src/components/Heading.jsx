// Judul H2 halaman fitur. `main` = judul utama yang menerima fokus saat berpindah langkah.
export default function Heading({ as: Tag = 'h2', main = false, className = '', children }) {
  return (
    <Tag
      tabIndex={main ? -1 : undefined}
      data-main-heading={main ? '' : undefined}
      className={`text-title font-extrabold ${className}`}
    >
      {children}
    </Tag>
  );
}
