// Aturan deteksi pola penipuan. File ini hanya merakit DATA.
// Daftar kata ada di src/data/words/ (satu file per kategori). Bobot: 3 = kuat (sorot merah),
// 2 = mencurigakan, 1 = lemah (sorot kuning).
import { pola } from '../lib/patterns.js';
import { DANGER_WORDS } from './words/index.js';

// Aturan khusus pola (bukan daftar kata): nama pemilik rekening "a.n. Budi", "a/n Budi".
const ATAS_NAMA = {
  id: 'atas-nama',
  weight: 1,
  title: 'Rekening atas nama orang',
  why: 'Nama pemilik rekening yang berbeda dari nama perusahaan adalah tanda bahaya.',
  words: [],
  exact: [],
  ambiguous: [],
  patterns: [pola(String.raw`(?:a\.n\.?|a\/n|atas\s+nama)\s+\p{L}+`)],
};

export const DETECTION_RULES = [...DANGER_WORDS, ATAS_NAMA];

// Peringatan khusus kalau beberapa aturan muncul bersama.
export const DETECTION_COMBOS = [
  {
    id: 'loker-palsu',
    rules: ['imbalan-tidak-wajar', 'uang-di-muka'],
    title: 'Pola khas loker palsu',
    message: 'Gaji tinggi tanpa syarat ditambah permintaan biaya hampir selalu berarti lowongan palsu.',
  },
  {
    id: 'cek-rekening',
    rules: ['uang-di-muka', 'rekening-pribadi'],
    title: 'Jangan transfer sebelum cek rekening di cekrekening.id',
    message: 'Masukkan nomor rekening tujuan di cekrekening.id untuk melihat apakah pernah dilaporkan.',
  },
  {
    id: 'phishing-hadiah',
    rules: ['umpan-hadiah', 'tautan'],
    title: 'Pola phishing berkedok hadiah',
    message: 'Kabar menang ditambah tautan biasanya dipakai untuk mencuri akun atau data.',
  },
  {
    id: 'investasi-bodong',
    rules: ['untung-pasti', 'tekanan-waktu'],
    title: 'Pola investasi bodong',
    message: 'Janji untung pasti yang dipaksa cepat adalah ciri investasi ilegal. Cek izinnya di OJK 157.',
  },
  {
    id: 'petugas-palsu',
    rules: ['menyamar', 'kode-rahasia'],
    title: 'Pola petugas palsu',
    message: 'Petugas asli tidak pernah meminta OTP atau PIN. Tutup chat dan hubungi nomor resmi lembaganya.',
  },
  {
    id: 'pinjol-ilegal',
    rules: ['pinjol', 'data-sensitif'],
    title: 'Pola pinjol ilegal',
    message: 'Pinjaman lewat chat yang meminta KTP/selfie sering berujung data disalahgunakan. Cek daftar resmi di OJK.',
  },
  {
    id: 'kerabat-palsu',
    rules: ['darurat-kerabat', 'rekening-pribadi'],
    title: 'Pola mengaku kerabat',
    message: 'Sebelum transfer, telepon nomor lama orangnya atau tanya hal yang hanya kalian berdua tahu.',
  },
  {
    id: 'judi-deposit',
    rules: ['judi-online', 'rekening-pribadi'],
    title: 'Ajakan deposit judi online',
    message: 'Uang yang masuk ke situs judi ilegal hampir tidak mungkin kembali, dan datamu bisa disalahgunakan.',
  },
];
