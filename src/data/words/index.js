// Array master kata bahaya. Satu file per kategori; urutan di sini = urutan aturan.
// Cara menambah kata: buka file kategorinya, tambahkan ke words / exact / ambiguous,
// lalu jalankan `npm run audit:words` dan `npm test`.
import uangDiMuka from './uang-di-muka.js';
import transferRekening from './transfer-rekening.js';
import kodeRahasia from './kode-rahasia.js';
import dataSensitif from './data-sensitif.js';
import imbalanLoker from './imbalan-loker.js';
import investasi from './investasi.js';
import judiOnline from './judi-online.js';
import pinjol from './pinjol.js';
import hadiahUndian from './hadiah-undian.js';
import tautanAplikasi from './tautan-aplikasi.js';
import menyamar from './menyamar.js';
import tekananWaktu from './tekanan-waktu.js';
import rahasiaIsolasi from './rahasia-isolasi.js';
import jualBeliOnline from './jual-beli-online.js';
import asmaraDaruratKerabat from './asmara-darurat-kerabat.js';
import kerjaLuarNegeriCalo from './kerja-luar-negeri-calo.js';
import pemerasan from './pemerasan.js';
import penggandaanGaib from './penggandaan-gaib.js';
import klaimLegalPalsu from './klaim-legal-palsu.js';

export { GROUPS } from './groups.js';
export { SAFE_PHRASES } from './safe.js';

// [nama file kategori, objek aturan]
export const CATEGORY_FILES = [
  ['uang-di-muka', uangDiMuka],
  ['transfer-rekening', transferRekening],
  ['kode-rahasia', kodeRahasia],
  ['data-sensitif', dataSensitif],
  ['imbalan-loker', imbalanLoker],
  ['investasi', investasi],
  ['judi-online', judiOnline],
  ['pinjol', pinjol],
  ['hadiah-undian', hadiahUndian],
  ['tautan-aplikasi', tautanAplikasi],
  ['menyamar', menyamar],
  ['tekanan-waktu', tekananWaktu],
  ['rahasia-isolasi', rahasiaIsolasi],
  ['jual-beli-online', jualBeliOnline],
  ['asmara-darurat-kerabat', asmaraDaruratKerabat],
  ['kerja-luar-negeri-calo', kerjaLuarNegeriCalo],
  ['pemerasan', pemerasan],
  ['penggandaan-gaib', penggandaanGaib],
  ['klaim-legal-palsu', klaimLegalPalsu],
];

export const DANGER_WORDS = CATEGORY_FILES.map(([, rule]) => rule);
