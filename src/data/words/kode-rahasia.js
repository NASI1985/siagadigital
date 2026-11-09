// Kategori 3: kode rahasia (OTP, PIN, CVV, kata sandi, login QR).
// warnable: di kalimat peringatan ("jangan berikan kode OTP") temuan ini bobotnya 0.

export default {
  id: 'kode-rahasia',
  weight: 3,
  warnable: true,
  title: 'Minta kode OTP',
  why: 'OTP, PIN, dan kata sandi tidak boleh dibagikan ke siapa pun, termasuk yang mengaku petugas.',
  words: [
    'kode otp', 'kode verifikasi', 'kode keamanan', 'kode aktivasi akun', 'kode akses', 'kode login', 'kode masuk',
    'kode whatsapp', 'kode pemulihan', 'kode cadangan', 'backup code', 'kode sms', 'kode 6 digit', 'kode enam digit',
    'kode yang masuk', 'kode yang barusan masuk', 'kode yang baru masuk', 'kode yang dikirim', 'kode yang terkirim',
    'salah kirim kode', 'kode tadi salah kirim', 'tolong kirim kodenya', 'kirimkan kodenya', 'kirim balik kodenya',
    'kode rahasia', 'one time password', 'verification code', 'security code', 'kode autentikasi', 'kode otentikasi',
    'kode authenticator', 'scan kode qr whatsapp', 'scan qr whatsapp web', 'scan barcode whatsapp',
    'izinkan login', 'izinkan masuk', 'konfirmasi login', 'setujui login', 'setujui permintaan masuk',
    'tautkan perangkat', 'perangkat tertaut', 'sambungkan perangkat', 'masuk ke whatsapp web', 'pin atm',
    'pin kartu', 'pin mbanking', 'pin m banking', 'nomor pin', 'kode pin', 'pin transaksi', 'pin ewallet', 'pin dana',
    'pin ovo', 'pin gopay', 'kartu token', 'token bank', 'kode token bank', 'user id dan password',
    'username dan password', 'email dan password', 'id dan password', 'id dan pin', 'user dan pin',
    'nomor kartu dan pin', 'kode dari bank', 'kode dari whatsapp', 'kode dari shopee', 'kode dari gojek',
    'kode dari dana', 'kode akun', 'kode transaksi rahasia',
  ],
  exact: [
    'otp', '0tp', 'otpnya', 'otp nya', 'kode otpnya', 'cvv', 'cvc', 'cvv2', 'cvvnya', 'pinnya', 'mpin',
    'kode 2fa', 'kode verifkasi',
    'kode verivikasi', 'kode veryfikasi', 'kode verfikasi', 'kode ferifikasi', 'kd otp', 'kode otep', 'otepe',
  ],
  ambiguous: [
    'password', 'kata sandi', 'sandi', 'pin', 'kode', 'kodenya', 'code', 'token', 'verifikasi', 'kode unik',
    'kode aktivasi', 'autentikasi', 'barcode', 'kode qr', 'qr code', 'reset kata sandi', 'kode reset', '2fa', 'pw',
    'pswd', 'pasword', 'paswot', 'pasaword', 'passwrd', 'passwd', 'paswod',
  ],
  anchors: ['BANKS', 'EWALLETS', 'ACCOUNT_NOUNS', 'VERB_SEND'],
  near: [
    { a: 'VERB_SEND', b: 'SECRET_NOUNS', within: 4 },
    { a: 'VERB_SEND', b: 'CODE_WORD', within: 2, weak: true },
  ],
  patterns: [],
};
