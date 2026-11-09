// Kelompok kata bersama. Dipakai oleh "near" (dua kelompok berdekatan) dan "anchors"
// (jangkar untuk kata ambigu). Isi kelompok BUKAN kata bahaya: nama bank atau "kirim"
// saja tidak membuat pesan dianggap berbahaya.
// Token >= 4 huruf cocok berimbuhan (kirim -> mengirimkan), token < 4 huruf harus persis.

export const GROUPS = {
  // Kata kerja membayar
  VERB_PAY: [
    'bayar', 'byr', 'bayr', 'setor', 'setoran', 'transfer', 'tranfer', 'trasnfer', 'transper', 'tf', 'trf', 'tebus',
    'lunas', 'lunasi', 'top up', 'topup', 'isi saldo', 'deposit', 'depo', 'kirim uang', 'kirim dana', 'patungan',
  ],
  // Kata kerja mengirim / menyerahkan
  VERB_SEND: [
    'kirim', 'krm', 'kasih', 'beri', 'share', 'bagi', 'sebut', 'bacakan', 'baca', 'ketik', 'masukkan', 'input',
    'isi', 'balas', 'forward', 'teruskan', 'serahkan', 'tunjukkan', 'foto', 'screenshot', 'upload', 'unggah',
    'tf', 'trf', 'transfer', 'tranfer', 'trasnfer', 'setor', 'bayar', 'kasi', 'kasih tau', 'kasih tahu', 'info',
    'infokan', 'sms', 'chat', 'japri', 'dm',
  ],
  // Kata kerja memberi tahu
  VERB_TELL: [
    'beritahu', 'beri tahu', 'kasih tahu', 'kasih tau', 'kasi tau', 'bilang', 'cerita', 'lapor', 'hubungi',
    'kabari', 'ngadu', 'adukan', 'curhat', 'omong', 'ngomong', 'bocorkan', 'sebar', 'sebarin', 'share',
  ],
  // Jenis biaya yang lazim dipakai penipu untuk meminta uang di muka
  FEE_NOUNS: [
    'pendaftaran', 'registrasi', 'regristasi', 'administrasi', 'aktivasi', 'jaminan', 'uang jaminan', 'deposit',
    'uang muka', 'dp', 'pajak hadiah', 'pajak pemenang', 'tebusan', 'uang tebusan', 'pelatihan', 'training',
    'seragam', 'pelicin', 'uang pelicin', 'pencairan', 'materai', 'meterai', 'uang komitmen', 'komitmen',
    'ongkos kirim', 'ongkir', 'mahar ritual', 'mahar penarikan', 'mahar pusaka', 'biaya admin', 'biaya proses', 'biaya pengurusan', 'pengurusan', 'verifikasi akun',
    'sertifikasi', 'asuransi pengiriman', 'bea masuk', 'biaya pembukaan', 'pembukaan akun', 'upgrade akun',
    'biaya penarikan', 'penarikan dana', 'biaya pengiriman',
  ],
  // Barang rahasia yang tidak boleh dibagikan
  SECRET_NOUNS: [
    'otp', 'kode otp', 'kode verifikasi', 'kode sms', 'kode keamanan', 'kode aktivasi', 'kode akses',
    'pin atm', 'pin kartu', 'pin m banking', 'pin mbanking', 'pin dana', 'pin ovo', 'pin gopay', 'pin bank',
    'cvv', 'cvc', 'password', 'pasword', 'passwd', 'kata sandi', 'sandi', 'mpin', 'kode token bank',
    'backup code', 'kode cadangan', 'kode login', 'kode masuk', 'kode wa', 'kode whatsapp', 'kode tautan',
    'kode pemulihan', 'kode 6 digit', 'kode enam digit', 'kode yang masuk', 'kode yang dikirim', 'kodenya',
  ],
  // Kata "kode" saja (umum: kode promo, kode booking) dipakai sebagai near lemah
  CODE_WORD: ['kode', 'code'],
  // Nama bank (jangkar, BUKAN kata bahaya)
  BANKS: [
    'bca', 'bri', 'bni', 'bsi', 'btn', 'btpn', 'mandiri', 'cimb', 'cimb niaga', 'niaga', 'jago', 'bank jago',
    'seabank', 'sea bank', 'permata', 'danamon', 'jenius', 'ocbc', 'maybank', 'panin', 'bank mega', 'bjb',
    'bank dki', 'bpd', 'muamalat', 'blu', 'allo bank', 'line bank', 'digibank', 'uob', 'bank', 'rekening',
    'rek', 'norek', 'no rek', 'nomor rekening', 'virtual account', 'va', 'atm',
  ],
  // Dompet digital (jangkar)
  EWALLETS: [
    'dana', 'ovo', 'gopay', 'shopeepay', 'shopee pay', 'linkaja', 'link aja', 'sakuku', 'jenius pay', 'isaku',
    'doku', 'astrapay', 'flip', 'e wallet', 'ewallet', 'dompet digital', 'saldo',
  ],
  // Dokumen identitas
  ID_DOCS: [
    'ktp', 'ektp', 'e ktp', 'nik', 'kartu keluarga', 'npwp', 'kitas', 'akta kelahiran', 'kartu atm', 'kartu debit',
    'kartu kredit', 'buku tabungan', 'foto wajah', 'swafoto', 'nomor induk kependudukan', 'ibu kandung',
  ],
  // Pekerjaan (untuk near dengan negara tujuan)
  JOB_NOUNS: [
    'kerja', 'pekerjaan', 'kerjaan', 'bekerja', 'lowongan', 'loker', 'lamaran', 'magang', 'penempatan', 'job',
    'kontrak kerja', 'tki', 'tkw', 'pmi', 'buruh migran', 'pekerja',
  ],
  // Negara / wilayah tujuan kerja luar negeri yang sering dipakai penipu
  COUNTRIES: [
    'amerika', 'usa', 'kanada', 'dubai', 'uea', 'arab', 'saudi', 'arab saudi', 'qatar', 'kuwait', 'oman',
    'jepang', 'korea', 'korea selatan', 'taiwan', 'hongkong', 'hong kong', 'singapura', 'malaysia', 'brunei',
    'australia', 'selandia baru', 'eropa', 'jerman', 'belanda', 'inggris', 'polandia', 'turki', 'kamboja',
    'myanmar', 'laos', 'thailand', 'filipina', 'vietnam', 'tiongkok', 'china', 'luar negeri', 'mancanegara',
  ],
  // Kata ancaman (pemerasan)
  THREATS: [
    'sebar', 'sebarin', 'viralkan', 'viral', 'upload', 'posting', 'kirim ke keluarga', 'kirim ke teman',
    'kirim ke kantor', 'kirim ke semua kontak', 'bocorkan', 'publikasikan', 'laporkan', 'polisikan', 'penjarakan',
  ],
  // Benda yang diancam disebar
  EXPOSE_NOUNS: [
    'foto', 'video', 'vidio', 'vcs', 'foto bugil', 'video bugil', 'foto syur', 'video syur', 'aib', 'data',
    'kontak', 'chat', 'percakapan', 'rekaman', 'screenshot', 'tangkapan layar',
  ],
  // Kata uang (untuk near pinjol / darurat)
  MONEY_NOUNS: [
    'uang', 'duit', 'dana', 'pulsa', 'saldo', 'transfer', 'pinjaman', 'utang', 'hutang', 'cash', 'tunai',
    'biaya', 'ongkos', 'rupiah', 'juta', 'ribu', 'rb', 'jt',
  ],
  // Darurat / kemalangan
  EMERGENCY_NOUNS: [
    'kecelakaan', 'rumah sakit', 'rs', 'operasi', 'ugd', 'igd', 'darurat', 'ditahan', 'ditangkap', 'kantor polisi',
    'meninggal', 'kritis', 'koma', 'kecopetan', 'kerampokan', 'kemalingan', 'dirampok',
  ],
  // Akun yang diancam
  ACCOUNT_NOUNS: [
    'akun', 'account', 'rekening', 'kartu atm', 'atm', 'whatsapp', 'wa', 'kartu sim', 'simcard',
    'm banking', 'mbanking', 'mobile banking', 'internet banking', 'ibanking', 'saldo', 'dompet', 'e wallet',
    'paylater', 'kartu kredit',
  ],
  // Kata kerja investasi
  VERB_INVEST: ['investasi', 'invest', 'tanam modal', 'tanam saham', 'gabung', 'join', 'titip dana', 'titip modal', 'modal'],
};
