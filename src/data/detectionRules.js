// Aturan deteksi pola penipuan. File ini hanya berisi DATA.
// Bobot: 3 = kuat (sorot merah), 2 = mencurigakan, 1 = lemah (sorot kuning).
// Cara menambah kata: tambahkan frasa ke kata(...) atau potongan regex ke pola(...).
import { kata, pola } from '../lib/patterns.js';

// Nominal uang: Rp150.000, Rp 8 juta, $2000, Rp150k
const NOMINAL = String.raw`(?:rp\.?\s?|\$\s?)\d+(?:[.,]\d+)*(?:\s?(?:ribu|rb|juta|jt|k))?`;
const OPTIONAL_AMOUNT = String.raw`(?:\s+(?:sebesar\s+)?${NOMINAL})?`;
// Ekor tautan: berhenti sebelum tanda baca penutup kalimat.
const URL_TAIL = String.raw`[^\s]*[^\s.,!?)"'”]`;
// 0 sampai 4 kata di antara dua kata kunci.
const FEW_WORDS = String.raw`(?:\S+\s+){0,4}?`;

export const DETECTION_RULES = [
  {
    id: 'uang-di-muka',
    weight: 3,
    title: 'Biaya di muka',
    why: 'Perusahaan resmi tidak meminta uang dari pelamar.',
    patterns: [
      pola(
        String.raw`biaya\s+(?:pendaftaran|registrasi|admin(?:istrasi)?|pelatihan|training|aktivasi|seragam|pencairan|asuransi)${OPTIONAL_AMOUNT}`,
        String.raw`(?:uang\s+muka|deposit|tebusan|ongkir|pajak\s+pencairan)${OPTIONAL_AMOUNT}`,
        String.raw`(?:pembayaran|bayar|setor|transfer|tf|trf)\s+${FEW_WORDS}(?:pendaftaran|registrasi|seragam|aktivasi|jaminan)`,
        String.raw`(?:transfer|tf|trf|bayar|setor)\s+(?:dulu|duluan|di\s+awal|di\s+muka)`,
      ),
    ],
  },
  {
    id: 'rekening-pribadi',
    weight: 3,
    title: 'Transfer ke rekening pribadi',
    why: 'Rekening perorangan sulit ditelusuri. Cek dulu nomornya di cekrekening.id.',
    patterns: [
      pola(
        String.raw`(?:tf|trf|transfer|kirim(?:kan)?|setor)\s+${FEW_WORDS}(?:bca|bri|bni|bsi|mandiri|dana|ovo|gopay|rekening|norek)`,
        String.raw`(?:norek|no\.?\s*rek(?:ening)?\.?)\s*:?\s*\d[\d\s-]{3,}\d`,
        String.raw`rekening\s+pribadi`,
      ),
    ],
  },
  {
    id: 'kode-rahasia',
    weight: 3,
    title: 'Minta kode OTP',
    why: 'OTP tidak boleh dibagikan ke siapa pun.',
    patterns: [
      pola(
        String.raw`kirim(?:kan)?\s+(?:kode\s+)?(?:otp|pin|password|kata\s+sandi|cvv)`,
        String.raw`(?:kode\s+)?otp`,
        String.raw`kode\s+(?:verifikasi|sms|aktivasi|keamanan)`,
        String.raw`cvv|password|kata\s+sandi`,
      ),
    ],
  },
  {
    id: 'data-sensitif',
    weight: 2,
    title: 'Minta data pribadi',
    why: 'KTP, NIK, dan data kartu bisa dipakai untuk pinjol atas namamu atau membobol akun.',
    patterns: [kata('selfie ktp', 'foto ktp', 'ktp', 'nik', 'kartu kredit', 'nama ibu kandung')],
  },
  {
    id: 'imbalan-tidak-wajar',
    weight: 2,
    title: 'Gaji tidak masuk akal',
    why: 'Imbalan besar tanpa syarat adalah umpan umum.',
    patterns: [
      pola(
        String.raw`${NOMINAL}\s*(?:\/|per\s+)\s*(?:jam|hari|minggu|bulan|tugas)(?:\s+tanpa\s+(?:pengalaman|interview|wawancara|tes|modal))?`,
        String.raw`tanpa\s+(?:pengalaman|interview|wawancara|tes)`,
        String.raw`gaji\s+(?:tinggi|besar|jutaan|fantastis)`,
        String.raw`komisi\s+per\s+tugas`,
        String.raw`like\s+dan\s+subscribe`,
      ),
    ],
  },
  {
    id: 'untung-pasti',
    weight: 2,
    title: 'Untung dijamin',
    why: 'Investasi resmi selalu punya risiko. Janji untung pasti adalah ciri investasi bodong.',
    patterns: [
      pola(
        String.raw`(?:untung|profit|bunga|return)\s+\d+(?:[.,]\d+)?\s?%(?:\s+per\s+(?:hari|minggu|bulan))?`,
        String.raw`pasti\s+untung|dijamin\s+untung|profit\s+pasti|tanpa\s+risiko|member\s+vip`,
      ),
    ],
  },
  {
    id: 'tautan',
    weight: 2,
    title: 'Ada tautan',
    why: 'Tautan bisa membawa ke situs palsu atau memasang aplikasi berbahaya. Jangan klik sebelum dicek.',
    patterns: [
      pola(
        String.raw`https?:\/\/${URL_TAIL}`,
        String.raw`www\.${URL_TAIL}`,
        String.raw`(?:bit\.ly|t\.me|wa\.me|s\.id)(?:\/${URL_TAIL})?`,
        String.raw`[^\s]*\.apk`,
      ),
    ],
  },
  {
    id: 'menyamar',
    weight: 2,
    title: 'Mengaku petugas',
    why: 'Petugas resmi tidak meminta data rahasia atau uang lewat chat.',
    patterns: [
      kata('petugas bank', 'pihak bank', 'cs bank', 'petugas bea cukai', 'bea cukai', 'polisi', 'mengaku petugas'),
    ],
  },
  {
    id: 'rahasia',
    weight: 2,
    title: 'Diminta merahasiakan',
    why: 'Penipu memintamu diam supaya tidak ada yang sempat mengingatkanmu.',
    patterns: [kata('jangan beri tahu', 'jangan kasih tahu', 'jangan bilang siapa', 'rahasiakan', 'rahasia ya')],
  },
  {
    id: 'atas-nama',
    weight: 1,
    title: 'Rekening atas nama orang',
    why: 'Nama pemilik rekening yang berbeda dari nama perusahaan adalah tanda bahaya.',
    patterns: [pola(String.raw`(?:a\.n\.?|a\/n|atas\s+nama)\s+\p{L}+`)],
  },
  {
    id: 'tekanan-waktu',
    weight: 1,
    title: 'Tekanan waktu',
    // {match} diisi frasa pertama yang ditemukan, misalnya “Hari ini saja”.
    why: '“{match}” dipakai agar kamu tidak sempat berpikir.',
    patterns: [
      kata('segera', 'buruan', 'hari ini saja', 'hari ini juga', 'sekarang juga', 'hangus', 'kuota terbatas', 'batas waktu'),
      pola(String.raw`slot\s+tinggal\s+\d+(?:\s+orang)?`, String.raw`\d+\s+(?:menit|jam)\s+lagi`),
    ],
  },
  {
    id: 'umpan-hadiah',
    weight: 1,
    title: 'Umpan hadiah',
    why: 'Kabar “terpilih” atau “menang” padahal kamu tidak pernah ikut adalah pancingan.',
    patterns: [
      pola(
        String.raw`terpilih(?:\s+sebagai\s+\p{L}+(?:\s+\p{L}+)?)?`,
        String.raw`selamat[!,.]?\s+(?:kamu|anda)\s+(?:menang|mendapatkan|berhak)`,
        String.raw`(?:kamu|anda)\s+(?:menang|memenangkan)`,
        String.raw`hadiah\s+gratis|pemenang\s+giveaway`,
      ),
    ],
  },
  {
    id: 'luar-negeri',
    weight: 1,
    title: 'Kerja di luar negeri',
    why: 'Tawaran kerja luar negeri lewat chat sering berujung penipuan atau perdagangan orang.',
    patterns: [
      pola(
        String.raw`(?:pekerjaan|kerja|kerjaan|bekerja|lowongan|loker)\s+(?:\S+\s+){0,2}?di\s+(?:amerika|dubai|jepang|eropa|kamboja|myanmar|luar\s+negeri)`,
        String.raw`luar\s+negeri`,
      ),
    ],
  },
];

// Peringatan khusus kalau beberapa aturan muncul bersama.
export const DETECTION_COMBOS = [
  {
    id: 'loker-palsu',
    rules: ['imbalan-tidak-wajar', 'uang-di-muka'],
    title: 'Pola khas loker palsu',
    message: 'Gaji tinggi tanpa syarat ditambah permintaan biaya hampir selalu berarti lowongan palsu.',
  },
  {
    id: 'cek-rekening',
    rules: ['uang-di-muka', 'rekening-pribadi'],
    title: 'Jangan transfer sebelum cek rekening di cekrekening.id',
    message: 'Masukkan nomor rekening tujuan di cekrekening.id untuk melihat apakah pernah dilaporkan.',
  },
  {
    id: 'phishing-hadiah',
    rules: ['umpan-hadiah', 'tautan'],
    title: 'Pola phishing berkedok hadiah',
    message: 'Kabar menang ditambah tautan biasanya dipakai untuk mencuri akun atau data.',
  },
  {
    id: 'investasi-bodong',
    rules: ['untung-pasti', 'tekanan-waktu'],
    title: 'Pola investasi bodong',
    message: 'Janji untung pasti yang dipaksa cepat adalah ciri investasi ilegal. Cek izinnya di OJK 157.',
  },
];
