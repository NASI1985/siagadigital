// Kategori di Cek Dulu langkah 1, beserta placeholder dan contoh fiktif.
// Semua contoh FIKTIF: tanpa nama, nomor, atau merek asli.

export const CHECK_CATEGORIES = [
  {
    id: 'pesan',
    label: 'Pesan (WhatsApp, DM, SMS)',
    shortLabel: 'Pesan',
    resultHeading: 'Pesan yang kamu terima',
    placeholder:
      'Selamat! Kamu terpilih sebagai admin online, gaji Rp8.000.000. Transfer biaya pelatihan hari ini...',
    example:
      'Selamat! Kamu terpilih sebagai admin online, gaji Rp8.000.000/bulan tanpa pengalaman. Transfer biaya pelatihan Rp150.000 hari ini saja, lalu kirim kode OTP untuk verifikasi.',
  },
  {
    id: 'link',
    label: 'Link atau URL',
    shortLabel: 'Link',
    resultHeading: 'Link yang kamu terima',
    placeholder: 'Tempel link beserta pesan yang menyertainya, misalnya: Klaim hadiahmu di bit.ly/...',
    example:
      'Selamat kamu menang giveaway! Klaim hadiah gratis di bit.ly/hadiah-fiktif sebelum hangus, cuma 10 menit lagi.',
  },
  {
    id: 'tawaran',
    label: 'Tawaran kerja atau investasi',
    shortLabel: 'Tawaran',
    resultHeading: 'Tawaran yang kamu terima',
    placeholder: 'Tempel isi tawaran kerja atau investasi, misalnya: Untung 30% per minggu, tanpa risiko...',
    example:
      'Gabung member VIP sekarang! Pasti untung 30% per minggu tanpa risiko. Slot tinggal 3 orang, buruan transfer deposit Rp500.000.',
  },
  {
    id: 'profil',
    label: 'Profil akun',
    shortLabel: 'Profil',
    resultHeading: 'Profil yang kamu cek',
    placeholder: 'Tempel bio atau pesan dari akun yang kamu curigai, misalnya: Akun resmi CS bank...',
    example:
      'Akun resmi CS Bank Fiktif. Kami petugas bank, kirim kode OTP dan foto KTP untuk verifikasi. Rahasiakan percakapan ini.',
  },
];

export const DEFAULT_CATEGORY_ID = CHECK_CATEGORIES[0].id;

export function findCategory(id) {
  return CHECK_CATEGORIES.find((category) => category.id === id) ?? CHECK_CATEGORIES[0];
}
