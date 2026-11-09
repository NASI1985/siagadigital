// Checklist keamanan akun. `nextStep` = frasa pendek huruf kecil untuk "Langkah berikutnya: ...".
// Cara menambah item: tambahkan objek baru dengan id unik.

export const SECURITY_CHECKLIST = [
  {
    id: 'verifikasi-2-langkah',
    label: 'Verifikasi 2 langkah aktif',
    nextStep: 'aktifkan verifikasi 2 langkah',
    howTo:
      'Buka Pengaturan > Akun > Verifikasi 2 langkah di aplikasi penting seperti WhatsApp, email, dan media sosial. Buat PIN yang hanya kamu tahu.',
  },
  {
    id: 'kata-sandi-unik',
    label: 'Kata sandi unik tiap akun',
    nextStep: 'buat kata sandi unik',
    howTo:
      'Pakai kata sandi berbeda untuk setiap akun, minimal 12 karakter. Pengelola kata sandi bawaan HP bisa membantu mengingatnya.',
  },
  {
    id: 'nomor-hp-privat',
    label: 'Nomor HP tidak tampil publik',
    nextStep: 'sembunyikan nomor HP',
    howTo: 'Hapus nomor HP dari bio, lalu atur siapa yang bisa melihat nomormu di pengaturan privasi setiap aplikasi.',
  },
  {
    id: 'profil-privat',
    label: 'Profil dikunci atau privat',
    nextStep: 'kunci profil',
    howTo:
      'Aktifkan mode akun privat di media sosial, dan batasi siapa yang bisa melihat foto profil serta unggahanmu.',
  },
  {
    id: 'izin-aplikasi',
    label: 'Izin aplikasi sudah ditinjau',
    nextStep: 'tinjau izin aplikasi',
    howTo:
      'Buka Pengaturan > Aplikasi > Izin. Cabut akses kontak, galeri, SMS, dan lokasi dari aplikasi yang tidak membutuhkannya.',
  },
  {
    id: 'perangkat-asing',
    label: 'Perangkat tak dikenal sudah dikeluarkan',
    nextStep: 'keluarkan perangkat tak dikenal',
    howTo:
      'Cek menu Perangkat tertaut atau Aktivitas login di WhatsApp, email, dan media sosial. Keluarkan perangkat yang tidak kamu kenali.',
  },
];
