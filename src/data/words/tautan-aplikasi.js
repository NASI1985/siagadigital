// Kategori 10: tautan dan aplikasi berbahaya (link pendek, .apk, undangan/resi/tilang palsu).
import { pola } from '../../lib/patterns.js';
import { URL_TAIL } from './shared.js';

const RISKY_TLD = 'xyz|top|click|icu|buzz|cfd|sbs|cyou|monster|quest|online|site|vip|shop|store|live|info|club|tk|ml|cf|gq|pw';

export default {
  id: 'tautan',
  weight: 2,
  title: 'Ada tautan atau aplikasi',
  why: 'Tautan bisa membawa ke situs palsu, dan file APK bisa mencuri SMS/OTP. Jangan klik atau pasang sebelum dicek.',
  words: [
    'klik tautan', 'klik link', 'klik link berikut', 'klik link ini', 'klik tautan berikut', 'klik tautan ini',
    'buka tautan', 'buka link', 'buka link berikut', 'akses link', 'akses tautan', 'kunjungi link', 'kunjungi tautan',
    'isi formulir di link', 'isi form di link', 'login melalui link', 'login lewat link', 'masuk lewat link',
    'masuk melalui link', 'instal aplikasi', 'install aplikasi', 'pasang aplikasi', 'unduh aplikasi',
    'download aplikasi', 'instal apk', 'install apk', 'download apk', 'unduh apk', 'pasang apk', 'file apk',
    'aplikasi apk', 'undangan digital', 'undangan pernikahan digital', 'lihat undangan', 'buka undangan',
    'surat tilang', 'tilang elektronik', 'surat tilang elektronik', 'lihat surat tilang', 'resi pengiriman apk',
    'lihat foto paket', 'cek foto paket', 'buka foto paket', 'konfirmasi alamat di link', 'foto paket anda', 'tagihan bpjs apk', 'apk undangan', 'apk resi',
    'apk tilang', 'apk kurir', 'apk bank', 'apk surat', 'apk tagihan', 'apk pengumuman', 'apk lowongan',
    'scan barcode berikut', 'scan qr berikut', 'scan kode qr berikut', 'pindai qr', 'pindai kode qr', 'qris palsu',
    'klik untuk klaim', 'klik untuk verifikasi', 'klik untuk aktivasi', 'klik untuk konfirmasi',
    'perbarui data di link', 'update data di link', 'link verifikasi', 'link aktivasi', 'link pendaftaran',
    'link klaim', 'link hadiah', 'link resmi kami', 'tautan resmi kami', 'link di bio', 'cek link di bio',
    'gabung grup telegram', 'join grup telegram', 'masuk grup telegram', 'izinkan instal dari sumber tidak dikenal',
    'sumber tidak dikenal', 'unknown sources', 'aktifkan aksesibilitas', 'izin aksesibilitas',
    'izinkan aksesibilitas', 'aplikasi remote', 'anydesk', 'teamviewer', 'rustdesk', 'airdroid', 'quicksupport',
    'bagikan layar', 'share layar', 'share screen', 'berbagi layar', 'aplikasi pengendali jarak jauh',
    'tautan berikut', 'link berikut', 'formulir online berikut', 'klik di sini', 'tekan link', 'ketuk tautan',
    'ketuk link', 'buka aplikasi berikut', 'lampiran apk', 'file undangan', 'file resi', 'file surat tilang',
    'perbarui aplikasi lewat link', 'update aplikasi lewat link', 'versi terbaru di link',
  ],
  exact: [
    'bit.ly', 'bitly', 'tinyurl', 's.id', 't.me', 'wa.me', 'cutt.ly', 'shorturl', 'rebrand.ly', 'lnk.bio',
    'linktr.ee', 'heylink', 'heylink.me', 'ow.ly', 'is.gd', 'rb.gy', 'tiny.cc', 'goo.gl', 'apk', 'klik link dbwh',
    'klik link d bawah', 'klik link dibawah', 'klik link di bawah', 'klik lnk', 'klk link', 'clik link', 'click link',
    'click here', 'download here', 'tap link', 'link bio', 'apknya', 'apk nya', 'file.apk', 'surat.apk',
    'undangan.apk', 'resi.apk', 'tilang.apk',
  ],
  ambiguous: [
    'link', 'tautan', 'aplikasi', 'klik', 'download', 'unduh', 'instal', 'install', 'resi', 'undangan',
    'scan', 'qr', 'telegram', 'formulir', 'form', 'website', 'situs', 'login', 'update aplikasi',
  ],
  patterns: [
    pola(
      String.raw`https?:\/\/${URL_TAIL}`,
      String.raw`www\.${URL_TAIL}`,
      String.raw`(?:bit\.ly|t\.me|wa\.me|s\.id|cutt\.ly|tinyurl\.com|rb\.gy|is\.gd|ow\.ly|tiny\.cc|rebrand\.ly|linktr\.ee|heylink\.me|lnk\.bio|goo\.gl)(?:\/${URL_TAIL})?`,
      String.raw`[^\s]*\.apk`,
      String.raw`[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)*\.(?:${RISKY_TLD})(?:\/${URL_TAIL})?`,
    ),
  ],
};
