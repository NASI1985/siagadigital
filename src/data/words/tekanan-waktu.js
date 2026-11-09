// Kategori 12: tekanan waktu dan ancaman (segera, hangus, diblokir, denda, pidana).
import { pola } from '../../lib/patterns.js';

export default {
  id: 'tekanan-waktu',
  weight: 1,
  title: 'Tekanan waktu',
  // {match} diisi frasa pertama yang ditemukan, misalnya “Hari ini saja”.
  why: '“{match}” dipakai agar kamu tidak sempat berpikir.',
  words: [
    'buruan', 'secepatnya', 'sesegera mungkin', 'sekarang juga', 'saat ini juga', 'hari ini saja', 'hari ini juga',
    'hanya hari ini', 'khusus hari ini', 'malam ini juga', 'detik ini juga', 'dalam 24 jam', 'dalam 1x24 jam',
    'dalam 2x24 jam', 'dalam 1 jam', 'dalam 30 menit', 'dalam 10 menit', 'batas waktu', 'tenggat waktu',
    'kuota terbatas', 'slot terbatas', 'tempat terbatas', 'penawaran terbatas', 'waktu terbatas', 'kesempatan terakhir',
    'kesempatan emas', 'jangan sampai terlewat', 'jangan sampai ketinggalan', 'sebelum terlambat', 'sebelum hangus',
    'sebelum kehabisan', 'sebelum ditutup', 'sebelum diblokir', 'hangus', 'akan hangus', 'dihanguskan',
    'akan diblokir', 'diblokir permanen', 'blokir permanen', 'dinonaktifkan', 'akan dinonaktifkan', 'akun dibekukan',
    'akun ditutup', 'rekening ditutup', 'rekening diblokir', 'kartu diblokir', 'akun diblokir', 'blokir akun',
    'akun akan dihapus', 'dihapus permanen', 'akun ditangguhkan', 'penangguhan akun', 'dikenakan denda',
    'sanksi pidana', 'ancaman pidana', 'dipidana', 'dipenjara', 'diproses hukum', 'diproses secara hukum',
    'dilaporkan ke polisi', 'surat panggilan', 'surat penangkapan', 'surat penahanan', 'tunggu apa lagi',
    'cepetan', 'gercep', 'tidak ada waktu lagi', 'waktunya hampir habis', 'waktu hampir habis', 'tersisa sedikit',
    'tinggal sedikit lagi', 'tinggal hari ini', 'terakhir hari ini', 'berakhir hari ini', 'berakhir malam ini',
    'berlaku sampai hari ini', 'promo berakhir', 'segera hubungi', 'segera transfer', 'segera bayar',
    'segera konfirmasi', 'segera klaim', 'segera daftar', 'segera klik', 'segera lakukan', 'segera verifikasi',
    'harus segera', 'wajib segera', 'mohon segera', 'tidak bisa ditunda', 'tanpa ditunda', 'jangan ditunda',
    'jangan menunda', 'langsung sekarang', 'lakukan sekarang', 'bayar sekarang', 'transfer sekarang',
    'klaim sekarang juga', 'daftar sekarang juga', 'nomor akan diblokir', 'kartu sim diblokir', 'whatsapp diblokir',
    'akun whatsapp diblokir', 'saldo akan hangus', 'poin hangus', 'hadiah hangus', 'hadiah akan hangus',
    'kesempatan hilang', 'dianggap mengundurkan diri', 'dianggap gugur', 'pendaftaran ditutup hari ini',
  ],
  exact: [
    'asap', 'urgent', 'urgen', 'gpl', 'buru2', 'cpt', 'cepet2', 'skrg juga', 'skrng juga', 'skr juga', 'hr ini aja',
    'hari ini aja', 'skrg jg', 'now', 'hurry', 'limited', 'last chance', 'today only', 'expired hari ini',
  ],
  ambiguous: [
    'segera', 'cepat', 'cepet', 'sekarang', 'deadline', 'terbatas', 'hari ini', 'diblokir', 'blokir', 'expired',
    'kedaluwarsa', 'kadaluarsa', 'kadaluwarsa', 'tenggat', 'pidana', 'penjara', 'ditangkap', 'sidang',
    'pemanggilan', 'ditutup', 'dibekukan', 'ditangguhkan', 'mendesak', 'darurat sekali', 'secepat mungkin',
  ],
  patterns: [pola(String.raw`slot\s+tinggal\s+\d+(?:\s+orang)?`, String.raw`\d+\s+(?:menit|jam)\s+lagi`, String.raw`tinggal\s+\d+\s+(?:slot|kuota|orang|tempat)`)],
};
