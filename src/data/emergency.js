// Konten Bantuan: kejadian, platform, kanal lapor, dan template pesan peringatan.
// Hanya data, tanpa React.

export const TRANSFER_INCIDENT_ID = 'transfer';

export const INCIDENTS = [
  {
    id: 'klik-link',
    label: 'Saya klik link mencurigakan',
    title: 'link mencurigakan terlanjur diklik',
    now: [
      'Tutup halaman itu dan jangan isi data apa pun',
      'Hapus aplikasi atau file yang baru terpasang',
      'Ganti kata sandi akun yang sempat kamu buka',
    ],
    today: ['Pindai HP dengan fitur keamanan bawaan', 'Pantau notifikasi login dan transaksi yang aneh'],
    topic:
      'link hadiah palsu yang menyebar lewat chat. Ciri-cirinya: mengaku kamu menang, link pendek yang aneh, dan minta login ulang',
  },
  {
    id: 'otp',
    label: 'Saya memberikan kode OTP',
    title: 'kode OTP terlanjur diberikan',
    now: ['Ganti kata sandi akun terkait', 'Keluar dari semua perangkat', 'Telepon call center resmi bank'],
    today: ['Simpan tangkapan layar dan nomor rekening pelaku', 'Beri tahu keluarga terdekat'],
    topic:
      'loker palsu bermodus biaya pelatihan. Ciri-cirinya: gaji tinggi tanpa syarat, minta transfer duluan, dan memaksa cepat',
  },
  {
    id: TRANSFER_INCIDENT_ID,
    label: 'Saya transfer uang',
    title: 'uang terlanjur ditransfer',
    now: [
      'Telepon call center resmi bank atau e-wallet untuk minta transaksi diblokir',
      'Simpan bukti transfer dan nomor rekening tujuan',
      'Jangan transfer lagi walau dijanjikan uang kembali',
    ],
    today: ['Laporkan rekening pelaku di cekrekening.id', 'Buat laporan polisi dengan membawa bukti'],
    topic:
      'penipuan yang minta transfer duluan. Ciri-cirinya: janji hadiah atau gaji besar, rekening atas nama pribadi, dan memaksa cepat',
  },
  {
    id: 'data-bocor',
    label: 'Data pribadi saya bocor',
    title: 'data pribadi bocor',
    now: ['Ganti kata sandi akun penting, mulai dari email', 'Aktifkan verifikasi 2 langkah'],
    today: [
      'Waspadai telepon atau chat yang mengaku dari bank',
      'Cek apakah ada pinjaman atas namamu lewat layanan resmi OJK',
    ],
    topic:
      'penyalahgunaan data pribadi. Ciri-cirinya: minta foto KTP, selfie dengan KTP, atau kode OTP lewat chat',
  },
  {
    id: 'akun-dibajak',
    label: 'Akun saya dibajak',
    title: 'akun dibajak',
    now: [
      'Pulihkan akun lewat fitur pemulihan resmi',
      'Kabari kontakmu bahwa akunmu dibajak supaya tidak ada yang transfer',
    ],
    today: ['Aktifkan verifikasi 2 langkah setelah akun kembali', 'Keluarkan perangkat yang tidak kamu kenal'],
    topic:
      'akun teman yang dibajak lalu dipakai pinjam uang. Ciri-cirinya: minta pulsa atau transfer darurat, gaya bahasa beda, dan menolak ditelepon',
  },
];

export const PLATFORMS = [
  { id: 'whatsapp', label: 'WhatsApp', now: ['Aktifkan verifikasi 2 langkah di pengaturan WhatsApp'] },
  { id: 'sosmed', label: 'Instagram atau TikTok', now: ['Amankan akun lewat pusat bantuan resmi aplikasinya'] },
  { id: 'bank', label: 'Bank atau e-wallet', now: ['Blokir kartu atau akun lewat aplikasi resmi atau nomor di balik kartu'] },
  { id: 'lainnya', label: 'Lainnya', now: ['Hubungi layanan resmi platform itu dari situs atau aplikasinya, bukan dari link di chat'] },
];

export const REPORT_LINKS = [
  { label: 'cekrekening.id', href: 'https://cekrekening.id', external: true },
  { label: 'OJK 157', href: 'tel:157', external: false },
  { label: 'aduannomor.id', href: 'https://aduannomor.id', external: true },
];

// {topic} diganti dengan topik dari kejadian yang dipilih.
export const WARNING_TONES = [
  {
    id: 'santai',
    label: 'Santai',
    template: 'Hati-hati, lagi marak {topic}. Jangan kasih OTP ke siapa pun!',
  },
  {
    id: 'orang-tua',
    label: 'Untuk orang tua',
    template:
      'Bapak/Ibu, mohon waspada. Sekarang sedang marak {topic}. Kalau ada yang minta uang atau kode OTP, jangan dituruti dan tanya saya dulu ya.',
  },
  {
    id: 'grup-kelas',
    label: 'Grup kelas',
    template:
      'Info penting buat teman-teman: lagi marak {topic}. Kalau dapat pesan seperti ini, jangan klik dan jangan transfer. Langsung lapor ke wali kelas ya!',
  },
];
