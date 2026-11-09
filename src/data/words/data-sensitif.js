// Kategori 4: data sensitif (KTP, NIK, KK, selfie KTP, kartu kredit, ibu kandung).
// warnable: di kalimat peringatan temuan ini bobotnya 0.

export default {
  id: 'data-sensitif',
  weight: 2,
  warnable: true,
  title: 'Minta data pribadi',
  why: 'KTP, NIK, dan data kartu bisa dipakai untuk pinjol atas namamu atau membobol akun.',
  words: [
    'selfie ktp', 'foto ktp', 'foto kartu keluarga', 'kartu keluarga', 'nama ibu kandung', 'ibu kandung',
    'nomor kartu kredit', 'nomor kartu debit', 'masa berlaku kartu', 'tanggal kedaluwarsa kartu',
    'tanggal kadaluarsa kartu', 'tiga angka di belakang kartu', 'angka di belakang kartu', '3 angka di belakang kartu',
    'foto kartu atm', 'nomor kartu atm', 'foto buku tabungan', 'buku tabungan', 'foto wajah', 'video wajah',
    'verifikasi wajah', 'liveness', 'swafoto', 'swafoto dengan ktp', 'selfie sambil pegang ktp', 'selfie pegang ktp',
    'selfie dengan ktp', 'foto selfie', 'foto diri', 'data diri lengkap', 'nomor induk kependudukan', 'ijazah asli',
    'foto ijazah', 'kartu bpjs', 'nomor bpjs', 'foto paspor', 'nomor paspor', 'kartu identitas', 'tanda pengenal',
    'identitas lengkap', 'scan ktp', 'fotokopi ktp', 'foto npwp', 'nomor npwp', 'foto sim', 'nomor sim', 'kartu debit',
    'data kartu', 'data kartu kredit', 'nomor kartu', 'nomor kartu lengkap', '16 digit kartu', 'enam belas digit kartu',
    'foto akta kelahiran', 'akta kelahiran', 'foto kk', 'nomor kk', 'nomor kartu keluarga', 'rekam wajah',
    'rekaman wajah', 'gerakkan kepala', 'kedipkan mata', 'foto tanda tangan', 'contoh tanda tangan', 'tanda tangan basah',
    'data biometrik', 'sidik jari', 'nomor ibu kandung', 'nama gadis ibu', 'data nasabah', 'data rekening lengkap',
    'foto ktp dan kk', 'ktp dan selfie', 'ktp asli', 'nomor ktp', 'foto ktp asli', 'kirim data diri',
    'isi data diri', 'lengkapi data diri',
  ],
  exact: [
    'ktp', 'ektp', 'nik', 'npwp', 'fc ktp', 'fotocopy ktp', 'poto ktp', 'pp ktp', 'selfi ktp', 'selpi ktp',
    'swafoto ktp', 'no ktp', 'no kk', 'no nik', 'nik ktp', 'nik kk', 'cc number', 'card number', 'nomer ktp',
    'nomer kk', 'nmr ktp', 'kk asli', 'kk ktp', 'ktp kk', 'id card', 'identity card',
  ],
  ambiguous: [
    'kk', 'sim', 'paspor', 'passport', 'ijazah', 'selfie', 'foto', 'tanggal lahir', 'alamat lengkap',
    'alamat rumah', 'data pribadi', 'data diri', 'identitas', 'tempat lahir',
    'nama ibu', 'penghasilan per bulan', 'tanda tangan',
  ],
  anchors: ['ID_DOCS'],
  near: [{ a: 'VERB_SEND', b: 'ID_DOCS', within: 4, weak: true }],
  patterns: [],
};
