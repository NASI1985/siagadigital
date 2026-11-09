// Kategori 2: transfer ke rekening / dompet pribadi.
// Nama bank dan e-wallet ada di groups.js sebagai JANGKAR, bukan kata bahaya.
// Permintaan transfer biasa (tanpa tanda lain) hanya "lemah": skor naik, tapi tidak langsung Tinggi.
import { pola } from '../../lib/patterns.js';

export default {
  id: 'rekening-pribadi',
  weight: 3,
  title: 'Transfer ke rekening pribadi',
  why: 'Rekening perorangan sulit ditelusuri. Cek dulu nomornya di cekrekening.id.',
  words: [
    'rekening pribadi', 'rekening perorangan', 'rekening penampung', 'rekening pengganti', 'rekening sementara',
    'rekening cadangan', 'rekening alternatif', 'rekening titipan', 'rekening penerima baru', 'rekening baru kami',
    'rekening agen', 'rekening marketing', 'rekening admin kami', 'rekening atas nama pribadi', 'rekening atas nama admin',
    'rekening atas nama staf', 'rekening staf kami', 'rekening karyawan kami', 'rekening bendahara pribadi',
    'rekening perusahaan sedang bermasalah', 'rekening perusahaan sedang diaudit', 'rekening kantor sedang gangguan',
    'rekening utama sedang gangguan', 'rekening sedang offline', 'rekening sedang dibekukan', 'ganti rekening tujuan',
    'nomor rekening baru kami', 'pindah rekening tujuan', 'bukan rekening perusahaan', 'transfer ke rekening pribadi',
    'kirim ke rekening pribadi', 'setor ke rekening pribadi', 'transfer ke dompet pribadi', 'rekening tujuan berbeda',
    'nama penerima berbeda', 'belikan voucher google play', 'belikan kartu hadiah', 'belikan voucher steam',
    'belikan voucher itunes', 'belikan kartu itunes', 'kirim kode voucher', 'kirim kode voucher game',
    'foto kode voucher', 'kirim nomor voucher', 'kirim foto voucher', 'foto bagian belakang voucher',
    'gosok kode voucher', 'bayar pakai usdt', 'bayar dengan usdt', 'bayar pakai bitcoin', 'bayar dengan kripto',
    'bayar pakai kripto', 'transfer lewat atm saja', 'ikuti instruksi di atm', 'ikuti panduan di atm',
    'rekening bersama kami', 'virtual account pribadi', 'kode bayar pribadi',
  ],
  exact: ['rek pribadi', 'rek pengganti', 'rek a/n', 'a/n pribadi', 'rek perorangan', 'rek titipan', 'rek penampung'],
  ambiguous: [
    'transfer', 'kirim', 'kirim uang', 'kirim dana', 'setor', 'setoran', 'bayar', 'pembayaran', 'top up', 'topup',
    'isi saldo', 'saldo', 'rekening', 'nomor rekening', 'rekber', 'rekening bersama', 'pulsa', 'voucher',
    'token listrik', 'kartu hadiah', 'virtual account', 'kode bayar', 'atas nama', 'penerima', 'tujuan transfer',
    'bukti transfer', 'konfirmasi pembayaran', 'mutasi', 'crypto', 'wallet', 'bitcoin', 'ethereum', 'tf', 'trf', 'krm',
    'va', 'tujuan rekening', 'rekening tujuan', 'nominal transfer', 'total transfer', 'total pembayaran',
    'norek', 'no rek', 'no.rek', 'nomer rek', 'nomer rekening', 'nmr rek', 'rek baru', 'rek an', 'tf ke', 'trf ke',
    'tf ke rek', 'trf ke rek', 'tf ke dana', 'tf ke ovo', 'tf ke gopay', 'tf ke bca', 'tf ke bri', 'tf ke bni',
    'tf ke mandiri', 'tf ke bsi', 'tf via', 'trf via', 'tf lewat', 'tranfer', 'trasnfer', 'transper', 'transfr',
    'trnsfer', 'tranfser', 'tf in', 'tfin', 'tf an', 'tfan', 'trf in', 'kirim ke va', 'tf ke va', 'bayar ke va',
    'usdt', 'btc', 'eth', 'bnb', 'trc20', 'erc20', 'bep20', 'wallet address', 'gift code', 'redeem code',
    'kode redeem', 'transfer ke rekening berikut', 'kirim ke rekening berikut', 'transfer ke rekening ini',
    'kirim ke rekening ini', 'transfer ke nomor ini', 'kirim ke nomor dana ini', 'transfer ke nomor dana',
    'kirim ke nomor ovo', 'kirim ke nomor gopay', 'kirim ke nomor shopeepay', 'beli voucher google play',
    'beli kartu hadiah', 'beli voucher steam', 'beli voucher itunes', 'beli kartu itunes', 'gift card',
    'kartu google play', 'voucher google play', 'kirim token listrik', 'belikan token listrik', 'beli token listrik untuk',
    'kirim pulsa ke nomor ini', 'transfer pulsa ke nomor ini', 'isikan pulsa ke nomor ini', 'beli pulsa ke nomor ini',
    'dompet kripto', 'dompet crypto', 'alamat wallet', 'alamat dompet kripto', 'kirim usdt', 'transfer usdt',
    'kirim bitcoin', 'transfer bitcoin', 'kirim ethereum', 'ke atm terdekat', 'pergi ke atm', 'datang ke atm',
    'setor tunai ke rekening', 'setor tunai lewat agen', 'kirim lewat agen brilink', 'transfer lewat agen',
    'transfer sesuai kode unik', 'kode unik transfer', 'nominal unik', 'pastikan nominal sesuai',
    'kirim bukti transfer', 'kirim bukti tf', 'kirimkan bukti transfer', 'foto bukti transfer',
    'screenshot bukti transfer', 'konfirmasi setelah transfer', 'konfirmasi transfer ke admin', 'rekening penerima',
  ],
  anchors: ['BANKS', 'EWALLETS'],
  near: [
    { a: 'VERB_SEND', b: 'BANKS', within: 4, weak: true },
    { a: 'VERB_SEND', b: 'EWALLETS', within: 4, weak: true },
  ],
  // Nomor rekening: "norek 04232346", "no. rek: 1234-5678", "BCA 1234567890"
  patterns: [
    pola(
      String.raw`(?:norek|no\.?\s*rek(?:ening)?\.?|nomor\s+rek(?:ening)?|nmr\s+rek)\s*:?\s*\d[\d\s-]{3,}\d`,
      String.raw`(?:bca|bri|bni|bsi|btn|mandiri|cimb|jago|seabank|permata|danamon|dana|ovo|gopay|shopeepay|linkaja)\s*:?\s*\d[\d\s-]{6,}\d`,
      String.raw`(?:rekening|rek)\s+(?:\p{L}+\s+)?\d[\d\s-]{6,}\d`,
    ),
  ],
};
