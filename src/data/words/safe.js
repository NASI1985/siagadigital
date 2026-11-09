// Frasa aman: kecocokan kata bahaya yang bertumpuk dengan frasa ini dikeluarkan.
// Contoh: "deposito bank", "membayar listrik", "transfer pemain", "menarik perhatian".
// Ditulis dalam bentuk dasar; imbuhan dikenali otomatis (membayar listrik -> bayar listrik).

export const SAFE_PHRASES = [
  // Perbankan dan keuangan sah
  'deposito bank', 'buka deposito', 'bunga deposito', 'deposito berjangka', 'tabungan berjangka', 'buka tabungan',
  'tabungan pendidikan', 'tabungan haji', 'reksa dana resmi', 'kantor cabang', 'aplikasi resmi bank',
  'datang ke kantor cabang', 'cek mutasi', 'mutasi rekening', 'saldo cukup', 'saldo tidak cukup',
  // Tagihan rutin
  'bayar listrik', 'tagihan listrik', 'token listrik pln', 'bayar air', 'tagihan air', 'bayar pdam', 'bayar internet',
  'tagihan internet', 'bayar wifi', 'bayar indihome', 'bayar bpjs', 'iuran bpjs', 'bayar pajak kendaraan',
  'pajak kendaraan', 'pajak motor', 'pajak mobil', 'bayar pbb', 'bayar kos', 'bayar kost', 'bayar kontrakan',
  'uang kos', 'uang kost', 'bayar cicilan rumah', 'bayar arisan keluarga', 'uang kas', 'bayar kas', 'iuran kas',
  'iuran warga', 'iuran rt', 'iuran sampah', 'bayar sampah', 'bayar parkir', 'bayar tol', 'isi pulsa sendiri',
  'beli pulsa sendiri', 'paket data', 'bayar makan', 'bayar makan siang', 'traktir makan', 'bayar bensin',
  'uang bensin', 'uang jajan', 'uang saku', 'bayar ojek', 'bayar belanja', 'bayar di kasir', 'bayar tunai di toko',
  // Pendidikan
  'pembayaran spp', 'bayar spp', 'uang spp', 'biaya kuliah', 'uang kuliah', 'bayar ukt', 'uang kuliah tunggal',
  'biaya sekolah', 'uang sekolah', 'uang buku', 'uang gedung', 'daftar kuliah', 'daftar sekolah', 'daftar ulang',
  'pendaftaran ulang', 'pendaftaran kuliah', 'pendaftaran sekolah', 'pendaftaran siswa baru', 'ppdb',
  'pendaftaran lomba', 'daftar lomba', 'daftar ekskul', 'daftar organisasi', 'daftar seminar', 'daftar webinar',
  'kirim tugas', 'kumpul tugas', 'kirim makalah', 'kirim laporan', 'kirim skripsi', 'kirim berkas tugas',
  'kirim file tugas', 'beasiswa kampus', 'kode kelas', 'kode mata kuliah', 'kode matkul', 'kode presensi',
  'kode absen', 'kode absensi',
  // Olahraga, hiburan, makna lain
  'transfer pemain', 'bursa transfer', 'jendela transfer', 'transfer musim', 'transfer ilmu', 'transfer pengetahuan',
  'transfer data kuliah', 'menarik perhatian', 'tarik napas', 'tarik nafas', 'tarik tambang', 'tarik kesimpulan',
  'kasihan', 'kasih sayang', 'terima kasih', 'makasih', 'kasih ibu', 'hadiah ulang tahun', 'kado ulang tahun',
  'hadiah wisuda', 'hadiah pernikahan', 'kado pernikahan', 'hadiah lomba sekolah', 'hadiah juara kelas',
  'segera pulih', 'segera sembuh', 'cepat sembuh', 'bandar udara', 'slot parkir', 'slot waktu', 'slot jadwal',
  'slot memori', 'slot kartu', 'kartu sim ganda', 'kode pos', 'kode warna', 'kode program', 'kode sumber',
  'source code', 'kode error', 'kode booking', 'kode tiket', 'kode promo resmi', 'kode diskon', 'kode voucher belanja',
  'kode referral teman', 'kode dress', 'dress code', 'kode etik', 'kode area', 'kode produk', 'kode barang',
  'kode resi', 'nomor resi', 'cek resi', 'lacak paket', 'paket sudah sampai', 'jam kerja', 'kerja kelompok',
  'kerja bakti', 'hari kerja', 'rapat kerja', 'lembur kerja', 'teman kerja', 'rekan kerja', 'tempat kerja',
  'denda perpustakaan', 'denda buku', 'denda telat buku', 'pajak penghasilan', 'lapor pajak', 'lapor spt',
  'spt tahunan', 'tagihan kartu kredit', 'kirim lokasi', 'share lokasi', 'kirim alamat', 'pin lokasi',
  'share loc', 'lupa pin', 'lupa password', 'lupa kata sandi', 'ganti pin', 'ubah pin',
  'ganti password', 'ubah kata sandi', 'password wifi', 'sandi wifi', 'kirim foto makanan', 'kirim foto liburan', 'foto keluarga', 'foto bersama',
];
