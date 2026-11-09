// Audit daftar kata: npm run audit:words  (keluar dengan kode 1 bila ada masalah).
// Memeriksa: huruf besar, entri ganda (lintas kategori), words < 4 huruf, exact yang
// sebenarnya turunan sebuah words, words yang bentrok dengan safe.js, ambiguous tanpa jangkar,
// entri yang berubah saat dinormalisasi, kelompok yang tidak ada, dan jumlah minimum entri.
import { CATEGORY_FILES, GROUPS, SAFE_PHRASES } from '../src/data/words/index.js';
import { rootCandidates, tokenize, MIN_ROOT_LENGTH } from '../src/lib/affix.js';
import { normalize } from '../src/lib/normalize.js';
import { findEntryMatches } from '../src/lib/analyzer.js';

export const MINIMUMS = {
  'uang-di-muka': 120,
  'transfer-rekening': 150,
  'kode-rahasia': 60,
  'data-sensitif': 60,
  'imbalan-loker': 120,
  investasi: 100,
  'judi-online': 100,
  pinjol: 80,
  'hadiah-undian': 70,
  'tautan-aplikasi': 70,
  menyamar: 100,
  'tekanan-waktu': 80,
  'rahasia-isolasi': 40,
  'jual-beli-online': 80,
  'asmara-darurat-kerabat': 70,
  'kerja-luar-negeri-calo': 60,
  pemerasan: 40,
  'penggandaan-gaib': 25,
  'klaim-legal-palsu': 30,
};
export const MIN_TOTAL = 1500;
const MIN_SAFE = 80;

const errors = [];
const fail = (message) => errors.push(message);

const isSingleToken = (entry) => tokenize(entry).length === 1;
const lists = (rule) => [
  ['words', rule.words ?? []],
  ['exact', rule.exact ?? []],
  ['ambiguous', rule.ambiguous ?? []],
];

// 1. Huruf besar, normalisasi, entri ganda.
const seen = new Map();
for (const [file, rule] of CATEGORY_FILES) {
  for (const [kind, entries] of lists(rule)) {
    for (const entry of entries) {
      const where = `${file}.${kind}: "${entry}"`;
      if (entry !== entry.toLowerCase()) fail(`Huruf besar  ${where}`);
      if (entry.trim() !== entry || /\s{2,}/.test(entry)) fail(`Spasi berlebih  ${where}`);
      const normalized = normalize(entry).normalized;
      if (normalized !== entry) fail(`Berubah saat dinormalisasi ("${normalized}")  ${where}`);
      if (seen.has(entry)) fail(`Entri ganda  ${where}  (sudah ada di ${seen.get(entry)})`);
      else seen.set(entry, `${file}.${kind}`);
    }
  }
}

// 2. words satu kata harus >= 4 huruf.
for (const [file, rule] of CATEGORY_FILES) {
  for (const entry of rule.words ?? []) {
    if (isSingleToken(entry) && entry.length < MIN_ROOT_LENGTH) fail(`words < 4 huruf (pindahkan ke exact)  ${file}: "${entry}"`);
  }
}

// 3. exact yang sebenarnya turunan words (sudah tertangkap otomatis lewat imbuhan).
const wordRoots = new Map();
for (const [file, rule] of CATEGORY_FILES) {
  for (const entry of rule.words ?? []) if (isSingleToken(entry)) wordRoots.set(entry, file);
}
for (const [file, rule] of CATEGORY_FILES) {
  for (const entry of rule.exact ?? []) {
    if (!isSingleToken(entry)) continue;
    const root = rootCandidates(entry).find((candidate) => candidate !== entry && wordRoots.has(candidate));
    if (root) fail(`exact sebenarnya turunan words "${root}" (${wordRoots.get(root)})  ${file}: "${entry}"`);
  }
}

// 4. words yang bentrok dengan frasa aman.
const allWords = CATEGORY_FILES.flatMap(([file, rule]) => (rule.words ?? []).map((entry) => [file, entry]));
const wordFile = new Map(allWords.map(([file, entry]) => [entry, file]));
const allWordEntries = allWords.map(([, word]) => word);
for (const safe of SAFE_PHRASES) {
  for (const entry of findEntryMatches(safe, allWordEntries)) {
    fail(`words bentrok dengan safe.js "${safe}"  ${wordFile.get(entry)}: "${entry}"`);
  }
}
// Arah sebaliknya: frasa aman yang muat di dalam sebuah words (kecocokannya pasti dibuang).
for (const [file, entry] of allWords) {
  for (const safe of findEntryMatches(entry, SAFE_PHRASES)) {
    fail(`words memuat frasa aman "${safe}"  ${file}: "${entry}"`);
  }
}
if (SAFE_PHRASES.length < MIN_SAFE) fail(`safe.js baru ${SAFE_PHRASES.length} frasa (minimal ${MIN_SAFE})`);
const safeSeen = new Set();
for (const safe of SAFE_PHRASES) {
  if (safeSeen.has(safe)) fail(`Frasa aman ganda: "${safe}"`);
  safeSeen.add(safe);
}

// 5. ambiguous tanpa jangkar; kelompok yang dirujuk harus ada.
for (const [file, rule] of CATEGORY_FILES) {
  const groupNames = [...(rule.anchors ?? []), ...(rule.near ?? []).flatMap((near) => [near.a, near.b])];
  for (const name of groupNames) {
    if (typeof name === 'string' && !GROUPS[name]) fail(`Kelompok "${name}" tidak ada di groups.js  (${file})`);
  }
  const hasAnchor =
    (rule.words ?? []).length + (rule.exact ?? []).length + (rule.near ?? []).length + (rule.patterns ?? []).length > 0 ||
    (rule.anchors ?? []).length > 0;
  if ((rule.ambiguous ?? []).length > 0 && !hasAnchor) fail(`ambiguous tanpa jangkar  ${file}`);
  if (!rule.id || !rule.title || !rule.why || ![1, 2, 3].includes(rule.weight)) fail(`Aturan tidak lengkap  ${file}`);
}
for (const [name, entries] of Object.entries(GROUPS)) {
  for (const entry of entries) if (entry !== entry.toLowerCase()) fail(`Huruf besar di kelompok ${name}: "${entry}"`);
}

// 6. Hitungan entri.
export function countEntries(rule) {
  return (rule.words ?? []).length + (rule.exact ?? []).length + (rule.ambiguous ?? []).length;
}
let total = 0;
const rows = [];
for (const [file, rule] of CATEGORY_FILES) {
  const count = countEntries(rule);
  total += count;
  const minimum = MINIMUMS[file] ?? 0;
  rows.push({
    kategori: file,
    words: (rule.words ?? []).length,
    exact: (rule.exact ?? []).length,
    ambiguous: (rule.ambiguous ?? []).length,
    total: count,
    minimum,
    ok: count >= minimum ? 'ya' : 'TIDAK',
  });
  if (count < minimum) fail(`Kategori ${file} baru ${count} entri (minimal ${minimum})`);
}
if (total < MIN_TOTAL) fail(`Total entri ${total} (minimal ${MIN_TOTAL})`);

console.table(rows);
console.log(`Total entri: ${total} (minimal ${MIN_TOTAL}); frasa aman: ${SAFE_PHRASES.length}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} masalah ditemukan:`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log('\nAudit lulus: tidak ada masalah.');
