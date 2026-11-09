// Kategori 1: uang di muka (biaya pendaftaran, deposit, tebusan, pajak hadiah).
import { pola } from '../../lib/patterns.js';
import { AMOUNT, NOMINAL } from './shared.js';

export default {
  id: 'uang-di-muka',
  weight: 3,
  title: 'Biaya di muka',
  why: 'Perusahaan, panitia, atau lembaga resmi tidak meminta uang di muka lewat chat.',
  words: [
    'biaya pendaftaran', 'biaya registrasi', 'biaya pelatihan', 'biaya training', 'biaya seragam', 'biaya aktivasi',
    'biaya pencairan', 'biaya asuransi pengiriman', 'biaya materai', 'biaya meterai', 'biaya verifikasi',
    'biaya pengurusan', 'biaya proses', 'biaya penarikan', 'biaya pengambilan hadiah', 'biaya pengiriman hadiah',
    'biaya klaim', 'biaya balik nama hadiah', 'biaya legalitas', 'biaya sertifikat', 'biaya pemberkasan',
    'biaya berkas', 'biaya interview', 'biaya psikotes', 'biaya penempatan', 'biaya keanggotaan', 'biaya member',
    'biaya upgrade', 'biaya unlock', 'biaya buka blokir', 'biaya pembukaan blokir', 'biaya pemulihan akun',
    'biaya pemulihan dana', 'biaya pengembalian dana', 'biaya refund', 'biaya penebusan', 'biaya tebusan',
    'biaya booking tempat', 'biaya jaminan', 'biaya kontrak kerja', 'biaya pajak hadiah', 'biaya pajak pemenang',
    'biaya aktivasi akun', 'biaya pembukaan akun', 'biaya verifikasi akun', 'biaya sertifikasi', 'biaya kode unik',
    'biaya pelunasan', 'biaya penyelesaian', 'biaya penarikan saldo', 'biaya withdraw', 'biaya pencairan dana',
    'biaya pencairan pinjaman', 'biaya pencairan hadiah', 'biaya pengurusan hadiah', 'biaya pengurusan dokumen',
    'uang pendaftaran', 'uang registrasi', 'uang administrasi', 'uang jaminan', 'uang pelicin', 'uang tebusan',
    'uang komitmen', 'uang keamanan', 'uang pengurusan', 'uang seragam', 'uang pelatihan', 'uang deposit',
    'uang materai', 'uang asuransi', 'uang verifikasi', 'uang aktivasi', 'uang pencairan', 'uang penarikan',
    'pajak hadiah', 'pajak pemenang', 'pajak undian', 'pajak pencairan', 'pajak penarikan', 'pajak withdraw',
    'deposit', 'tebusan', 'transfer dulu', 'transfer duluan', 'transfer di awal', 'transfer di muka', 'bayar dulu',
    'bayar duluan', 'bayar di awal', 'bayar di muka', 'setor dulu', 'setor duluan', 'setor di awal', 'setor jaminan',
    'setor deposit', 'tebus dulu', 'lunasi dulu', 'kirim dulu uangnya', 'kirim uang dulu', 'transfer uang dulu',
    'transfer jaminan', 'bayar jaminan', 'bayar pajak hadiah', 'bayar pajak dulu', 'bayar administrasi dulu',
    'bayar biaya admin dulu', 'ongkir dulu', 'transfer ongkir dulu', 'bayar ongkir dulu', 'bayar pendaftaran',
    'bayar registrasi', 'transfer pendaftaran', 'transfer registrasi', 'bayar aktivasi', 'transfer aktivasi',
    'bayar materai', 'transfer materai', 'bayar seragam', 'transfer seragam', 'bayar pelatihan', 'transfer pelatihan',
    'deposit jaminan', 'deposit awal', 'deposit dulu', 'dana jaminan', 'jaminan keanggotaan', 'syarat transfer',
    'wajib transfer', 'wajib bayar', 'wajib deposit', 'harus transfer dulu', 'harus bayar dulu', 'tanda keseriusan',
    'bukti keseriusan', 'uang keseriusan', 'biaya daftar', 'biaya pelepasan paket', 'biaya pelepasan barang',
  ],
  exact: [
    'tf dulu', 'trf dulu', 'tf duluan', 'trf duluan', 'tf di awal', 'tf di muka', 'byr dulu', 'bayr dulu',
    'tranfer dulu', 'trasnfer dulu', 'transper dulu', 'tranfer duluan', 'depozit', 'deposite', 'deposid', 'deposut',
    'admin fee', 'registration fee', 'processing fee', 'upfront fee', 'advance fee', 'security deposit',
    'refundable deposit', 'fee pendaftaran', 'fee admin', 'fee registrasi', 'tf ongkir', 'trf ongkir', 'tf jaminan',
    'tf deposit', 'tf biaya', 'trf biaya', 'tf pendaftaran', 'tf registrasi', 'tf admin', 'tf pajak', 'bya admin',
    'biaya adm', 'by admin', 'biaya regist', 'biaya regis', 'biaya pendaftran', 'biaya regristasi', 'biaya registasi',
    'biaya adminstrasi', 'biaya administarsi', 'biaya aktifasi', 'biaya pndftrn', 'byr pendaftaran', 'byr admin',
  ],
  ambiguous: [
    'biaya admin', 'biaya administrasi', 'biaya layanan', 'denda', 'ongkos kirim', 'ongkir', 'pajak', 'jaminan',
    'materai', 'meterai', 'uang muka', 'tanda jadi', 'pelunasan', 'administrasi', 'registrasi', 'pendaftaran',
  ],
  near: [{ a: 'VERB_PAY', b: 'FEE_NOUNS', within: 4 }],
  // Biaya + nominal (nominal wajib ada) disorot utuh: "biaya pelatihan Rp150.000",
  // dan "transfer 2jt dulu". Pola di aturan ini dihitung kuat.
  patternsStrong: true,
  patterns: [
    pola(
      String.raw`biaya\s+(?:pendaftaran|registrasi|pelatihan|training|aktivasi|seragam|pencairan|materai|meterai|verifikasi|pengurusan)${AMOUNT}`,
      String.raw`(?:deposit|tebusan|pajak\s+(?:hadiah|pencairan|pemenang))${AMOUNT}`,
    ),
    pola(String.raw`(?:transfer|tranfer|tf|trf|bayar|setor|kirim)\s+(?:uang\s+)?${NOMINAL}\s+(?:dulu|duluan|dl|dlu|di\s+awal|di\s+muka)`),
  ],
};
