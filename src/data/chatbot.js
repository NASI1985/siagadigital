// Konten SiagaBot: bot tanya-jawab offline, BUKAN AI.
// Bot mengenali kata kunci (pakai helper kata() yang sama dengan mesin pengecekan),
// merapikan bahasa gaul dan salah ketik, bertanya balik lewat wawancara per modus,
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
  { label: 'Ditawarin kerja', message: 'Aku lagi ditawarin kerja' },
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
    // "akun temenku dibajak" = modus teman dibajak, bukan akun pengguna sendiri.
    notAfter: ['teman', 'temen', 'temanku', 'temenku', 'temannya', 'temennya'],
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
  {
    scenarioId: 'loker-palsu',
    patterns: [kata('loker', 'lowongan', 'kerja', 'kerjaan', 'pekerjaan', 'gaji', 'hrd', 'admin online', 'biaya pelatihan', 'freelance')],
  },
  { scenarioId: 'giveaway-palsu', patterns: [kata('giveaway', 'hadiah', 'undian', 'menang', 'pemenang')] },
  {
    scenarioId: 'teman-dibajak',
    patterns: [
      kata(
        'teman minta', 'temen minta', 'temanku minta', 'temenku minta', 'minta pulsa', 'pulsa', 'pinjam uang',
        'pinjem duit', 'akun teman', 'akun temen', 'akun temanku', 'akun temenku', 'teman dibajak', 'temen dibajak',
        'temanku dibajak', 'temenku dibajak',
      ),
    ],
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
    // Dapat kontak mencurigakan: minta pesannya ditempel.
    'sms aneh', 'chat aneh', 'pesan aneh', 'dm aneh', 'telepon aneh', 'telpon aneh', 'nomor asing', 'nomor aneh',
    'nomor tak dikenal', 'nomor nggak dikenal', 'nomor tidak dikenal', 'nomor gak dikenal', 'chat mencurigakan',
    'pesan mencurigakan', 'sms mencurigakan',
  ),
];

export const HELP_PATTERNS = [kata('kamu siapa', 'siapa kamu', 'bisa apa', 'bisa bantu apa', 'cara pakai', 'help', 'menu')];
export const GREETING_PATTERNS = [
  kata('halo', 'hallo', 'hai', 'hi', 'hello', 'hey', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum', 'permisi'),
];
export const THANKS_PATTERNS = [kata('makasih', 'terima kasih', 'thanks', 'thank you', 'thx', 'tengkyu')];

// Saran pencegahan umum (tanpa modus tertentu): "gimana biar aman?", "tips dong".
export const PREVENT_PATTERNS = [
  kata(
    'biar aman', 'supaya aman', 'agar aman', 'cara aman', 'tips', 'cara mencegah', 'mencegah', 'cara menghindari',
    'menghindari', 'biar nggak kena', 'supaya nggak kena', 'biar ga kena', 'biar gak kena', 'amankan akun',
    'amanin akun', 'jaga akun', 'jangan sampai', 'biar nggak', 'biar gak', 'supaya nggak', 'supaya tidak',
    'agar tidak', 'nggak dibajak', 'tidak dibajak', 'nggak kena', 'tidak kena',
  ),
];

// Perasaan: bot menenangkan dulu, lalu bertanya.
export const FEELING_PATTERNS = [
  kata('takut', 'panik', 'bingung', 'cemas', 'khawatir', 'was-was', 'stres', 'stress', 'sedih', 'nangis', 'gelisah'),
];

export const ACK_PATTERNS = [kata('oke', 'ok', 'okay', 'okee', 'sip', 'siap', 'oh gitu', 'paham', 'ngerti', 'mengerti', 'noted')];
export const CANCEL_PATTERNS = [kata('batal', 'gak jadi', 'nggak jadi', 'ga jadi', 'udahan', 'stop', 'skip', 'lewati')];

// Jawaban pertanyaan iya/nggak. Urutan cek: nggak tahu -> nggak -> iya.
export const UNSURE_PATTERNS = [
  kata(
    'nggak tahu', 'nggak tau', 'gak tau', 'ga tau', 'gatau', 'gk tau', 'tidak tahu', 'belum tahu', 'belum tau',
    'kurang tahu', 'kurang tau', 'lupa', 'ragu', 'mungkin', 'entah', 'kayaknya', 'sepertinya',
  ),
];
export const NO_PATTERNS = [
  kata('nggak', 'ngga', 'enggak', 'engga', 'gak', 'ga', 'gk', 'tidak', 'tdk', 'belum', 'blm', 'bukan', 'no', 'nope', 'kagak'),
];
export const YES_PATTERNS = [
  kata(
    'iya', 'iyaa', 'iyap', 'ya', 'yaa', 'y', 'yup', 'yap', 'yes', 'betul', 'bener', 'benar', 'he eh', 'heem', 'hooh',
    'udah', 'sudah', 'pernah', 'ada', 'emang', 'memang',
  ),
];

// Pertanyaan lanjutan tentang topik yang sedang dibahas.
export const FOLLOW_UP_PATTERNS = {
  // "Kalau sudah telanjur?" -> langkah darurat untuk kejadian yang paling cocok.
  already: [
    kata('telanjur', 'terlanjur', 'udah kena', 'sudah kena', 'udah kejadian', 'sudah kejadian', 'udah ikut', 'sudah ikut'),
  ],
  avoid: [
    kata(
      'cara menghindari', 'menghindari', 'menghindarinya', 'biar nggak kena', 'biar gak kena', 'biar ga kena',
      'supaya nggak kena', 'cara mencegah', 'mencegah', 'mencegahnya', 'biar aman', 'supaya aman', 'harus gimana',
      'harus apa', 'aku harus', 'saya harus', 'sebaiknya',
    ),
  ],
  example: [kata('contoh', 'contohnya', 'kayak gimana', 'seperti apa', 'kaya gimana', 'misalnya', 'gimana chatnya')],
  traits: [
    kata('ciri', 'ciri-ciri', 'cirinya', 'ciri ciri', 'tanda', 'tandanya', 'tanda-tanda', 'modus', 'modusnya', 'bedain', 'membedakan', 'apa itu'),
  ],
  next: [
    kata(
      'terus', 'trus', 'terus gimana', 'lalu', 'lanjut', 'selanjutnya', 'habis itu', 'abis itu', 'setelah itu',
      'ngapain lagi', 'gimana lagi', 'apa lagi', 'terus aku', 'lagi dong',
    ),
  ],
};

// Pesan pendek yang dianggap pertanyaan lanjutan (bukan cerita baru).
export const FOLLOW_UP_MAX_LENGTH = 80;

// Wawancara per modus. Bot menanyakan tanda bahaya satu per satu, lalu menyimpulkan.
// detect: kata kunci yang, kalau sudah muncul di cerita pengguna, membuat pertanyaan itu
//         dianggap terjawab "iya" (bot tidak bertanya ulang).
// incidentId: kejadian di data/emergency.js untuk "kalau udah telanjur".
// storyMessage: kalimat contoh yang memulai wawancara ini (dipakai tombol dan dites).
export const INTERVIEWS = {
  'loker-palsu': {
    incidentId: 'transfer',
    storyMessage: 'Aku lagi ditawarin kerja',
    questions: [
      {
        ask: 'Kamu diminta bayar sesuatu dulu? Misalnya biaya pelatihan, seragam, atau administrasi.',
        detect: [kata('bayar', 'biaya', 'transfer', 'administrasi', 'seragam', 'deposit', 'pelatihan', 'jaminan')],
        flag: 'Diminta bayar di muka. Perusahaan resmi tidak memungut biaya dari pelamar.',
      },
      {
        ask: 'Gajinya tinggi banget padahal syaratnya gampang atau tanpa pengalaman?',
        detect: [kata('gaji tinggi', 'gaji besar', 'tanpa pengalaman', 'juta', 'kerja santai', 'wfh', 'kerja dari rumah')],
        flag: 'Gaji tidak masuk akal untuk syarat semudah itu.',
      },
      {
        ask: 'Dia minta data pribadi (foto KTP, selfie, kode OTP) atau suruh isi link?',
        detect: [kata('ktp', 'selfie', 'otp', 'link', 'formulir', 'apk', 'data diri')],
        flag: 'Minta data pribadi atau mengarahkan ke link yang tidak jelas.',
      },
    ],
    avoid: [
      'Cari lowongan itu di situs atau akun resmi perusahaan',
      'Jangan pernah bayar apa pun untuk melamar kerja',
      'Tanya alamat kantor dan cek sendiri, jangan lewat link dari dia',
    ],
  },
  'giveaway-palsu': {
    incidentId: 'klik-link',
    storyMessage: 'Aku dapat chat menang giveaway',
    questions: [
      {
        ask: 'Kamu dibilang menang, padahal nggak pernah ikut apa-apa?',
        detect: [kata('menang', 'pemenang', 'terpilih', 'selamat')],
        flag: 'Menang undian yang tidak pernah kamu ikuti.',
      },
      {
        ask: 'Kamu disuruh bayar ongkir, pajak hadiah, atau biaya admin dulu?',
        detect: [kata('ongkir', 'pajak', 'biaya', 'bayar', 'transfer', 'asuransi')],
        flag: 'Hadiah asli tidak meminta biaya di muka.',
      },
      {
        ask: 'Ada link buat klaim hadiah, atau kamu diminta kode OTP?',
        detect: [kata('link', 'klaim', 'otp', 'kode', 'bit.ly', 's.id')],
        flag: 'Link klaim dan permintaan OTP dipakai untuk membobol akun.',
      },
    ],
    avoid: [
      'Cek pengumuman pemenang di akun resmi penyelenggara',
      'Jangan klik link klaim dari chat atau DM',
      'Kode OTP tidak pernah dibutuhkan untuk menerima hadiah',
    ],
  },
  'teman-dibajak': {
    incidentId: 'transfer',
    storyMessage: 'Temenku tiba-tiba minta pinjem duit',
    questions: [
      {
        ask: 'Dia minta transfer, pulsa, atau pinjam uang mendadak?',
        detect: [kata('pinjam', 'pinjem', 'pulsa', 'transfer', 'uang', 'duit', 'darurat', 'top up')],
        flag: 'Minta uang mendadak lewat chat.',
      },
      {
        ask: 'Gaya bahasanya beda dari biasanya?',
        detect: [kata('bahasanya beda', 'gaya bahasa', 'nggak kayak biasanya', 'gak kayak biasanya', 'ga kayak biasanya', 'aneh')],
        flag: 'Gaya bahasanya tidak seperti temanmu.',
      },
      {
        ask: 'Dia nolak waktu kamu ajak telepon atau video call?',
        detect: [
          kata(
            'nolak ditelepon', 'nolak ditelpon', 'gak mau ditelpon', 'nggak mau ditelepon', 'ga mau ditelpon',
            'jangan telepon', 'jangan telpon', 'nolak telepon', 'nggak bisa ditelepon', 'gak bisa ditelpon',
          ),
        ],
        flag: 'Menolak dihubungi lewat telepon.',
      },
    ],
    avoid: [
      'Telepon temanmu langsung ke nomor yang kamu simpan',
      'Tanya hal yang cuma kalian berdua yang tahu',
      'Jangan transfer sebelum yakin itu benar dia',
    ],
  },
  'pinjol-ilegal': {
    incidentId: 'data-bocor',
    storyMessage: 'Aku lagi mau pakai pinjol',
    questions: [
      {
        ask: 'Aplikasinya minta akses kontak atau galeri HP-mu?',
        detect: [kata('akses kontak', 'kontak', 'galeri', 'izin akses')],
        flag: 'Minta akses kontak atau galeri. Pinjol legal hanya boleh mengakses kamera, mikrofon, dan lokasi.',
      },
      {
        ask: 'Bunga atau potongannya besar banget, atau tenornya pendek sekali?',
        detect: [kata('bunga', 'potongan', 'dipotong', 'tenor', 'denda')],
        flag: 'Bunga atau potongan tidak wajar.',
      },
      {
        ask: 'Ada teror, ancaman, atau penagih yang nyebar data kamu?',
        detect: [kata('teror', 'neror', 'ancam', 'ancaman', 'mengancam', 'debt collector', 'disebar', 'nyebar')],
        flag: 'Penagihan dengan teror atau ancaman.',
      },
    ],
    avoid: [
      'Cek dulu apakah pinjolnya terdaftar di OJK (telepon 157)',
      'Jangan beri izin akses kontak dan galeri',
      'Baca total bunga dan denda sebelum setuju',
    ],
  },
  'kurir-palsu': {
    incidentId: 'klik-link',
    storyMessage: 'Ada yang ngaku kurir chat aku',
    questions: [
      {
        ask: 'Kamu disuruh buka file .apk atau install aplikasi buat lihat resi atau foto paket?',
        detect: [kata('apk', 'install', 'instal', 'aplikasi', 'file', 'unduh', 'download')],
        flag: 'File .apk bisa mencuri isi HP, termasuk SMS kode OTP.',
      },
      {
        ask: 'Kamu sebenarnya lagi nggak nunggu paket apa pun?',
        detect: [kata('nggak pesan', 'gak pesan', 'ga pesan', 'tidak pesan', 'nggak nunggu paket', 'gak merasa pesan', 'nggak merasa pesan')],
        flag: 'Ada "paket" yang tidak pernah kamu pesan.',
      },
      {
        ask: 'Dia minta bayar ongkir atau biaya tambahan lewat link?',
        detect: [kata('ongkir', 'biaya tambahan', 'bayar', 'link')],
        flag: 'Minta bayar lewat link di luar aplikasi resmi.',
      },
    ],
    avoid: [
      'Cek resi hanya di aplikasi atau situs resmi ekspedisi',
      'Jangan pernah buka file .apk dari chat',
      'Kurir asli tidak mengirim aplikasi untuk melihat foto paket',
    ],
  },
  'investasi-instan': {
    incidentId: 'transfer',
    storyMessage: 'Aku diajak ikut investasi',
    questions: [
      {
        ask: 'Kamu dijanjikan untung pasti atau cepat, misalnya 10% seminggu?',
        detect: [kata('untung pasti', 'pasti untung', 'profit', 'cuan', 'keuntungan', 'return', 'persen', 'balik modal')],
        flag: 'Janji untung pasti dan cepat.',
      },
      {
        ask: 'Kamu disuruh ngajak orang lain, atau gabung grup member VIP?',
        detect: [kata('ajak teman', 'ajak orang', 'rekrut', 'member', 'vip', 'downline', 'referral')],
        flag: 'Untung dari merekrut orang baru, pola skema ponzi.',
      },
      {
        ask: 'Uangnya ditransfer ke rekening pribadi, bukan atas nama perusahaan?',
        detect: [kata('rekening pribadi', 'atas nama pribadi', 'rekening admin', 'rek pribadi', 'rekening mentor')],
        flag: 'Dana dikirim ke rekening pribadi.',
      },
    ],
    avoid: [
      'Cek izin perusahaannya di OJK (telepon 157)',
      'Curigai janji untung pasti, investasi asli selalu ada risiko',
      'Jangan transfer ke rekening atas nama pribadi',
    ],
  },
};

// Tombol jawaban wawancara.
export const ANSWER_BUTTONS = [
  { label: 'Iya', message: 'Iya' },
  { label: 'Nggak', message: 'Nggak' },
  { label: 'Nggak tahu', message: 'Nggak tahu' },
];

// Bahasa gaul dan singkatan -> bentuk baku, dipakai sebelum mencocokkan niat.
export const SLANG = {
  gw: 'aku', gue: 'aku', gua: 'aku', aq: 'aku', ane: 'aku', sy: 'saya',
  udh: 'udah', sdh: 'sudah', dah: 'udah', udach: 'udah',
  tf: 'transfer', trf: 'transfer', trnsfr: 'transfer', transper: 'transfer', ditf: 'ditransfer',
  ga: 'nggak', gak: 'nggak', gk: 'nggak', ngga: 'nggak', engga: 'nggak', enggak: 'nggak', kagak: 'nggak', ndak: 'nggak',
  tdk: 'tidak', blm: 'belum', gatau: 'nggak tahu', gtau: 'nggak tahu', tau: 'tahu',
  trs: 'terus', trus: 'terus', truss: 'terus', lnjt: 'lanjut', yg: 'yang', dgn: 'dengan', krn: 'karena', jd: 'jadi', bgt: 'banget', tp: 'tapi', sm: 'sama', org: 'orang',
  gmn: 'gimana', gmna: 'gimana', gimn: 'gimana', bgmn: 'bagaimana', knp: 'kenapa', napa: 'kenapa', kalo: 'kalau',
  temen: 'teman', tmn: 'teman', duit: 'uang', wa: 'whatsapp', ig: 'instagram', fb: 'facebook',
  kebajak: 'dibajak', dibajek: 'dibajak', kehack: 'dihack', dihek: 'dihack', diheck: 'dihack', hek: 'hack',
  ditipu: 'tertipu', nipu: 'menipu', penipuu: 'penipu',
  pinjem: 'pinjam', minjem: 'pinjam', ol: 'online', olshop: 'toko online', otw: 'mau',
  instal: 'install', donlod: 'download', ngeklik: 'klik',
};

// Kata penting untuk koreksi salah ketik (jarak edit kecil).
export const VOCABULARY = [
  'transfer', 'dibajak', 'diretas', 'dihack', 'penipuan', 'penipu', 'tertipu', 'ketipu', 'pinjol', 'pinjaman',
  'investasi', 'trading', 'giveaway', 'hadiah', 'undian', 'pemenang', 'lowongan', 'pelatihan', 'ekspedisi',
  'rekening', 'laporan', 'kebocoran', 'tersebar', 'kepencet', 'administrasi', 'aplikasi', 'install', 'whatsapp',
  'instagram', 'verifikasi', 'mencurigakan', 'darurat', 'ancaman', 'menghindari', 'mencegah', 'contohnya',
];

// Kata asli yang hanya beda satu huruf dari VOCABULARY; jangan "dikoreksi".
// Kalau menemukan koreksi yang salah, tambahkan katanya di sini.
export const REAL_WORDS = ['diajak', 'mencegat', 'pinjamin', 'laporin', 'pelapor'];

// Pesan dengan kata-kata ini dianggap menyangkal kejadian ("belum transfer", "biar nggak dibajak").
export const NEGATION_WORDS = ['belum', 'nggak', 'tidak', 'jangan', 'biar', 'supaya', 'agar', 'mencegah', 'hindari', 'bukan'];

// Keterangan singkat kanal lapor, dikunci dengan href di data/emergency.js.
export const REPORT_DESCRIPTIONS = {
  'https://cekrekening.id': 'cek dan laporkan rekening penipu',
  'tel:157': 'kontak OJK untuk pinjol dan investasi ilegal',
  'https://aduannomor.id': 'laporkan nomor HP penipu',
};

// Teks jawaban. {title}, {level}, {n}, {total} diisi oleh lib/chatbot.js.
// Nilai berupa daftar = beberapa variasi kalimat; bot bergantian memakainya supaya tidak monoton.
export const BOT_TEXT = {
  greeting:
    'Halo! Aku SiagaBot. Ceritain aja apa yang kamu alami, nanti aku tanya-tanya biar jelas. Bisa juga tanya ciri modus penipuan, atau tempel pesan mencurigakan buat aku cek.',
  help: 'Aku bisa bantu tiga hal: kasih langkah darurat kalau kamu sudah kena, menjelaskan ciri-ciri modus penipuan (sambil tanya-tanya soal kasusmu), dan mengecek pesan mencurigakan. Aku bukan AI, jadi kalimat sederhana paling gampang kupahami.',
  thanks: [
    'Sama-sama! Tetap waspada ya. Ada lagi yang bisa kubantu?',
    'Sama-sama! Kalau ada chat aneh lagi, tempel aja di sini.',
  ],
  ack: ['Sip. Ada lagi yang mau ditanyain?', 'Oke! Kalau masih ada yang bikin ragu, cerita aja.'],
  feeling: 'Wajar kok kalau panik. Tarik napas dulu, kita beresin pelan-pelan. Apa yang sudah terjadi?',
  cancel: 'Oke, nggak apa-apa. Kalau mau lanjut lagi, cerita aja kapan pun.',
  checkPrompt:
    'Siap. Tempel pesannya di sini, nanti aku cek. Hapus dulu nama, nomor, dan rekening asli.',
  emergencyIntro: [
    'Tenang, kamu nggak sendirian. Untuk kejadian {title}, lakukan sekarang:',
    'Oke, kita gerak cepat. Untuk kejadian {title}, lakukan ini sekarang juga:',
  ],
  emergencyToday: 'Setelah itu, masih hari ini:',
  emergencyLater:
    'Kalau langkah tadi sudah, kabari teman dan keluarga supaya mereka nggak jadi korban berikutnya. Di halaman Bantuan ada pesan peringatan yang tinggal kamu salin.',
  emergencyAsk: 'Waduh. Biar aku bisa bantu, apa yang terjadi?',
  reportIntro: 'Kanal lapor resmi:',
  reportLine: 'Lapor: cekrekening.id · OJK 157 · aduannomor.id',
  topicIntro: 'Ciri-ciri {title} yang sering muncul:',
  interviewIntro: [
    'Hmm, ini mirip modus {title}. Aku tanya sebentar ya biar jelas.',
    'Oke, kedengarannya seperti modus {title}. Jawab beberapa pertanyaan ini ya.',
  ],
  interviewKnown: 'Dari ceritamu, aku sudah lihat {n} tanda bahaya.',
  questionNote: 'Pertanyaan {n} dari {total}',
  answerRetry: 'Jawab "iya", "nggak", atau "nggak tahu" aja ya, biar aku bisa menilai.',
  verdictHigh: 'Hati-hati, ini kemungkinan besar penipuan modus {title}. Tanda bahayanya:',
  verdictMedium: 'Waspada. Ada tanda bahaya modus {title}:',
  verdictLow:
    'Dari jawabanmu, belum ada tanda bahaya utama modus {title}. Ini bukan bukti aman, jadi tetap lakukan ini:',
  verdictUnsure: 'Yang kamu jawab "nggak tahu", tanyakan atau cek dulu sebelum lanjut.',
  avoidIntro: 'Biar nggak kena {title}:',
  exampleIntro: 'Contoh chat {title} (fiktif):',
  preventIntro: 'Biar akunmu lebih aman, mulai dari ini:',
  topicHint:
    'Kalau soal {title} tadi, kamu bisa tanya contohnya, cara menghindarinya, atau langkahnya kalau sudah telanjur.',
  checkHigh: 'Kewaspadaan: {level}. Aku menemukan tanda bahaya ini:',
  checkLow:
    'Kewaspadaan: Rendah. Tidak ada pola umum penipuan yang terdeteksi, tapi ini bukan bukti aman. Tetap verifikasi lewat kanal resmi.',
  checkTopic: 'Polanya mirip modus {title}.',
  checkNote: 'Indikasi saja, bukan bukti. Verifikasi lewat kanal resmi.',
  fallback: [
    'Maaf, aku belum paham. Aku bot sederhana (bukan AI) yang mengenali kata kunci. Coba pilih salah satu ini:',
    'Hmm, aku belum paham maksudnya. Coba ceritain pakai kata lain, atau pilih salah satu ini:',
  ],
};
