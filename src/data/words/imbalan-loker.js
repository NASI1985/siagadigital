// Kategori 5: imbalan tidak wajar / loker palsu (gaji fantastis, tugas like, admin online).
import { pola } from '../../lib/patterns.js';
import { NOMINAL } from './shared.js';

export default {
  id: 'imbalan-tidak-wajar',
  weight: 2,
  title: 'Gaji tidak masuk akal',
  why: 'Imbalan besar tanpa syarat adalah umpan umum.',
  words: [
    'terpilih sebagai admin online', 'terpilih sebagai karyawan', 'terpilih sebagai mitra', 'terpilih sebagai reseller',
    'terpilih sebagai agen', 'terpilih sebagai pegawai', 'gaji fantastis', 'gaji tinggi', 'gaji besar', 'gaji jutaan',
    'gaji puluhan juta', 'gaji harian', 'gaji mingguan', 'gaji dibayar harian', 'dibayar harian', 'dibayar per tugas',
    'dibayar per jam', 'dibayar setiap hari', 'komisi per tugas', 'komisi harian', 'komisi besar', 'komisi tinggi',
    'komisi menarik', 'komisi langsung cair', 'bonus harian', 'bonus mingguan', 'bonus tugas', 'tanpa pengalaman',
    'tanpa interview', 'tanpa wawancara', 'tanpa tes', 'tanpa seleksi', 'tanpa ijazah', 'tanpa syarat', 'tanpa target',
    'langsung diterima', 'pasti diterima', 'dijamin diterima', 'langsung kerja hari ini',
    'kerja santai gaji besar', 'kerja santai', 'kerja dari rumah', 'kerja dari hp', 'kerja lewat hp', 'kerja pakai hp',
    'kerja online', 'kerja paruh waktu', 'kerja sampingan', 'kerja part time', 'kerja rebahan', 'kerja tanpa modal',
    'part time', 'paruh waktu', 'freelance online', 'admin online', 'operator online', 'admin sosmed online',
    'penilai produk', 'rating produk', 'beri rating', 'kasih rating', 'beri ulasan', 'kasih ulasan bintang lima',
    'review produk', 'like dan subscribe', 'like dan follow', 'like video', 'like postingan', 'follow akun',
    'subscribe channel', 'tugas like', 'tugas subscribe', 'tugas follow', 'tugas review',
    'misi harian', 'misi like', 'tugas premium', 'tugas vip', 'tugas berbayar',
    'tugas prabayar', 'tugas gabungan', 'tugas kombinasi', 'penghasilan harian',
    'penghasilan jutaan', 'cuan harian', 'hanya modal hp', 'cukup modal hp', 'modal hp',
    'modal kuota', 'hanya 1 jam sehari', 'cuma 1 jam sehari', 'kerja 1 jam sehari', 'kerja 2 jam sehari',
    'ketik ulang dokumen', 'ketik captcha', 'input data online', 'entry data online', 'data entry online',
    'pengetik online', 'kerja ketik online', 'packing barang di rumah', 'merakit barang di rumah', 'lowongan wfh',
    'work from home', 'remote job', 'reseller tanpa modal', 'dropship tanpa modal', 'rebahan dapat uang',
    'rebahan dapet duit', 'duit gampang', 'uang gampang', 'gampang dapet duit', 'modal jempol', 'cuma like',
    'cuma follow', 'cuma klik', 'tinggal klik', 'tinggal like', 'auto cuan', 'cuan gede', 'gaji gede',
    'gaji langsung cair', 'gaji dibayar di muka', 'langsung digaji', 'komisi per like', 'komisi per follow',
    'bayaran per like', 'upah per tugas', 'upah harian besar', 'pendapatan harian', 'income harian',
    'penghasilan pasti', 'lowongan online',
    'lowongan admin online', 'loker admin online', 'mitra online', 'agen online', 'karyawan online',
    'staf online', 'kerja shift fleksibel', 'fleksibel gaji besar', 'lowongan tanpa syarat',
    'rekrutmen tanpa tes', 'penerimaan tanpa tes',
  ],
  exact: [
    'wfh', 'loker wfh', 'lowker', 'lowker online', 'loker ol', 'kerja ol', 'fee per task', 'per task', 'task harian',
    'daily task', 'daily bonus', 'high salary', 'easy job', 'no experience', 'part timer', 'parttime', 'paruhwaktu',
    'gaji gde', 'gaji gedhe', 'cuan gde', 'duit gmpng', 'job desk santai', 'pt online', 'ptk online', 'like n subscribe',
    'like & subscribe', 'l&s', 'fb ads tugas', 'yt tugas', 'tiktok tugas', 'job like', 'job follow', 'job ngelike',
    'gj harian', 'gji harian', 'komisi 30%', 'komisi 20%', 'komisi 10%',
  ],
  ambiguous: [
    'lowongan', 'loker', 'admin', 'freelance', 'gaji', 'komisi', 'penghasilan', 'pendapatan', 'hrd', 'rekrutmen',
    'rekrut', 'bonus', 'reward', 'tugas', 'misi', 'cuan', 'upah', 'bayaran', 'income', 'pendapatan pasif',
    'lamaran', 'magang', 'bekerja', 'dibutuhkan segera', 'dicari', 'peluang',
    'tanpa ribet', 'tugas online', 'tugas harian', 'tugas sederhana', 'tugas mudah', 'pekerjaan mudah', 'kerja mudah', 'kerja ringan', 'pekerjaan ringan', 'uang tambahan', 'penghasilan tambahan',
  ],
  // Dua regex terpisah supaya keduanya bisa cocok di posisi yang bertumpuk (yang terpanjang disorot).
  patterns: [
    pola(String.raw`${NOMINAL}\s*(?:\/|per\s+)\s*(?:jam|hari|minggu|bulan|tugas|task|like|follow)(?:\s+tanpa\s+(?:pengalaman|interview|wawancara|tes|modal))?`),
    pola(String.raw`(?:gaji|komisi|penghasilan|upah)\s+(?:sampai|hingga|s\/d|up\s+to)?\s*${NOMINAL}`),
  ],
};
