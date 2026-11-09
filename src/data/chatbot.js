// Konten SiagaBot: bot tanya-jawab sederhana, BUKAN AI.
// Bot mengenali kata kunci (pakai helper kata() yang sama dengan mesin pengecekan)
// lalu menjawab dari data yang sudah ada (emergency.js, scenarios.js, analyzer).
// Cara menambah kata kunci: tambahkan frasa ke kata(...) di bawah, lalu jalankan `npm test`.
import { kata } from '../lib/patterns.js';

export const BOT_NAME = 'SiagaBot';

// Pesan yang panjangnya segini atau lebih dianggap pesan tempelan dan langsung dicek.
export const LONG_MESSAGE_LENGTH = 120;

export const QUICK_REPLIES = [
  { label: 'Aku udah transfer', message: 'Aku udah transfer ke penipu' },
  { label: 'Aku kasih OTP', message: 'Aku udah kasih kode OTP' },
  { label: 'Akunku dibajak', message: 'Akunku dibajak' },
  { label: 'Cek pesan', message: 'Cek pesan' },
  { label: 'Ciri loker palsu', message: 'Apa ciri loker palsu?' },
  { label: 'Cara lapor', message: 'Lapor ke mana?' },
];

// Sudah kena: dicocokkan ke kejadian di data/emergency.js.
// Frasanya sengaja berbentuk "sudah terjadi" (udah transfer, udah kasih OTP) supaya
// pesan penipu yang ditempel ("kasih kode OTP-nya ya") tidak salah dianggap kejadian.
export const EMERGENCY_INTENTS = [
  {
    incidentId: 'transfer',
    patterns: [
      kata(
        'udah transfer', 'sudah transfer', 'terlanjur transfer', 'telanjur transfer', 'udah tf', 'sudah tf',
        'udah bayar', 'sudah bayar', 'udah kirim uang', 'sudah kirim uang', 'saya transfer', 'aku transfer',
        'gue transfer', 'gw transfer', 'uangku hilang', 'uang saya hilang', 'duitku hilang', 'uang hilang',
      ),
    ],
  },
  {
    incidentId: 'otp',
    patterns: [
      kata(
        'udah kasih otp', 'sudah kasih otp', 'udah kasih kode', 'sudah kasih kode', 'terlanjur kasih',
        'telanjur kasih', 'udah ngasih', 'sudah ngasih', 'ngasih otp', 'ngasih kode', 'memberikan kode otp',
        'memberikan otp', 'memberikan kode', 'udah kirim otp', 'sudah kirim otp', 'udah kirim kode',
        'sudah kirim kode', 'otpku', 'kode otpku',
      ),
    ],
  },
  {
    incidentId: 'akun-dibajak',
    patterns: [
      kata(
        'dibajak', 'di bajak', 'dihack', 'di hack', 'kena hack', 'diretas', 'gak bisa login', 'ga bisa login',
        'nggak bisa login', 'tidak bisa login', 'gabisa login', 'diambil alih',
      ),
    ],
  },
  {
    incidentId: 'data-bocor',
    patterns: [kata('bocor', 'kebocoran', 'tersebar', 'disebar', 'kesebar', 'disalahgunakan')],
  },
  {
    incidentId: 'klik-link',
    patterns: [
      kata(
        'saya klik link', 'aku klik link', 'gw klik link', 'klik link mencurigakan', 'udah klik', 'sudah klik',
        'terlanjur klik', 'telanjur klik', 'kepencet', 'keklik', 'ke klik', 'udah install', 'sudah install',
        'udah pasang apk', 'sudah pasang apk', 'udah download apk', 'sudah download apk',
      ),
    ],
  },
];

// "Kena tipu" tanpa detail: bot bertanya dulu kejadiannya apa.
export const GENERAL_SCAM_PATTERNS = [
  kata('kena tipu', 'ketipu', 'tertipu', 'kena scam', 'kena penipuan', 'korban penipuan', 'jadi korban'),
];

// Tanya ciri-ciri modus: dicocokkan ke skenario di data/scenarios.js.
export const SCAM_TOPICS = [
  { scenarioId: 'loker-palsu', patterns: [kata('loker', 'lowongan', 'kerja', 'gaji', 'hrd', 'admin online', 'biaya pelatihan')] },
  { scenarioId: 'giveaway-palsu', patterns: [kata('giveaway', 'hadiah', 'undian', 'menang', 'pemenang')] },
  {
    scenarioId: 'teman-dibajak',
    patterns: [kata('teman minta', 'temen minta', 'minta pulsa', 'pulsa', 'pinjam uang', 'pinjem duit', 'akun teman', 'akun temen')],
  },
  {
    scenarioId: 'pinjol-ilegal',
    patterns: [kata('pinjol', 'pinjaman online', 'pinjaman', 'dana cepat', 'utang', 'hutang', 'debt collector', 'teror')],
  },
  { scenarioId: 'kurir-palsu', patterns: [kata('kurir', 'paket', 'resi', 'apk', 'ekspedisi')] },
  {
    scenarioId: 'investasi-instan',
    patterns: [kata('investasi', 'invest', 'trading', 'profit', 'saham', 'kripto', 'crypto', 'robot trading', 'member vip')],
  },
];

export const REPORT_PATTERNS = [
  kata('lapor', 'melapor', 'laporin', 'ngelapor', 'aduan', 'mengadu', 'ojk', 'cekrekening', 'aduannomor', 'polisi'),
];

export const CHECK_REQUEST_PATTERNS = [
  kata(
    'cek pesan', 'cek link', 'cek chat', 'cek dong', 'tolong cek', 'periksa pesan', 'ngecek', 'dicek',
    'penipuan bukan', 'penipuan gak', 'penipuan nggak', 'penipuan ga', 'penipu bukan', 'penipu gak',
    'aman gak', 'aman ga', 'aman nggak', 'aman tidak', 'asli gak', 'asli nggak', 'asli ga',
  ),
];

export const HELP_PATTERNS = [kata('kamu siapa', 'siapa kamu', 'bisa apa', 'bisa bantu apa', 'cara pakai', 'help', 'menu')];
export const GREETING_PATTERNS = [
  kata('halo', 'hallo', 'hai', 'hi', 'hello', 'hey', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum', 'permisi'),
];
export const THANKS_PATTERNS = [kata('makasih', 'terima kasih', 'thanks', 'thank you', 'thx', 'tengkyu')];

// Keterangan singkat kanal lapor, dikunci dengan href di data/emergency.js.
export const REPORT_DESCRIPTIONS = {
  'https://cekrekening.id': 'cek dan laporkan rekening penipu',
  'tel:157': 'kontak OJK untuk pinjol dan investasi ilegal',
  'https://aduannomor.id': 'laporkan nomor HP penipu',
};

// Teks jawaban. {title} dan {level} diisi oleh lib/chatbot.js.
export const BOT_TEXT = {
  greeting:
    'Halo! Aku SiagaBot. Ceritakan apa yang terjadi, tanya ciri-ciri modus penipuan, atau tempel pesan mencurigakan dengan awalan "cek:".',
  help: 'Aku bisa bantu tiga hal: kasih langkah darurat kalau kamu sudah kena, menjelaskan ciri-ciri modus penipuan, dan mengecek pesan mencurigakan. Aku bukan AI, jadi pakai kalimat sederhana ya.',
  thanks: 'Sama-sama! Tetap waspada ya. Ada lagi yang bisa kubantu?',
  checkPrompt:
    'Siap. Tempel pesannya di sini, nanti aku cek. Hapus dulu nama, nomor, dan rekening asli.',
  emergencyIntro: 'Tenang, kamu nggak sendirian. Untuk kejadian {title}, lakukan sekarang:',
  emergencyAsk: 'Waduh. Biar aku bisa bantu, apa yang terjadi?',
  reportIntro: 'Kanal lapor resmi:',
  reportLine: 'Lapor: cekrekening.id · OJK 157 · aduannomor.id',
  topicIntro: 'Ciri-ciri {title} yang sering muncul:',
  checkHigh: 'Kewaspadaan: {level}. Aku menemukan tanda bahaya ini:',
  checkLow:
    'Kewaspadaan: Rendah. Tidak ada pola umum penipuan yang terdeteksi, tapi ini bukan bukti aman. Tetap verifikasi lewat kanal resmi.',
  checkNote: 'Indikasi saja, bukan bukti. Verifikasi lewat kanal resmi.',
  fallback:
    'Maaf, aku belum paham. Aku bot sederhana (bukan AI) yang mengenali kata kunci. Coba pilih salah satu ini:',
};
