// Mesin imbuhan: mengubah kata berimbuhan (baku dan gaul) menjadi kemungkinan kata dasarnya.
// Fungsi ini hanya mencocokkan BENTUK kata, tidak memahami arti. Kata yang punya arti lain
// (misalnya "kasihan" dari "kasih", "menarik" dari "tarik") harus masuk daftar ambiguous.

export const MIN_ROOT_LENGTH = 4;
const MAX_SUFFIX_ROUNDS = 2;
const MAX_PREFIX_ROUNDS = 2;

// Akhiran yang boleh dibuang (maksimal 2 kali berturut-turut). -in = gaul (bayarin),
// -ku/-mu = kata ganti milik (akunmu, rekeningku).
const SUFFIXES = ['kan', 'an', 'i', 'in', 'nya', 'lah', 'kah', 'pun', 'ku', 'mu'];

// [awalan, huruf awal kata dasar yang mungkin luluh]. '' berarti tanpa pengembalian huruf,
// selalu dicoba karena kata serapan tidak luluh (mendeposit, mentransfer).
const PREFIXES = [
  ['memper', ['']],
  ['diper', ['']],
  ['menge', ['']],
  ['meng', ['', 'k']],
  ['meny', ['', 's']],
  ['men', ['', 't', 's']],
  ['mem', ['', 'p']],
  ['me', ['']],
  ['penge', ['']],
  ['peng', ['', 'k']],
  ['peny', ['', 's']],
  ['pen', ['', 't', 's']],
  ['pem', ['', 'p']],
  ['pe', ['']],
  ['di', ['']],
  ['ter', ['']],
  ['ber', ['']],
  ['be', ['']],
  ['per', ['']],
  ['se', ['']],
  ['ke', ['']],
  // Gaul / chat
  ['nge', ['']],
  ['ng', ['', 'k']],
  ['ny', ['', 's', 'c']],
  ['n', ['', 't']],
  ['m', ['', 'p']],
];

const TOKEN_REGEX = /[\p{L}\p{N}]+/gu;
const REDUPLICATION_DIGIT = /\p{L}2$/u;

// Cache hasil per kata supaya teks panjang dengan kata berulang tetap cepat.
const CACHE_LIMIT = 50000;
const candidateCache = new Map();

function stripSuffixes(word) {
  const forms = [word];
  const seen = new Set(forms);
  let frontier = [word];
  for (let round = 0; round < MAX_SUFFIX_ROUNDS; round += 1) {
    const next = [];
    for (const form of frontier) {
      for (const suffix of SUFFIXES) {
        if (!form.endsWith(suffix) || form.length - suffix.length < MIN_ROOT_LENGTH) continue;
        const stripped = form.slice(0, -suffix.length);
        if (seen.has(stripped)) continue;
        seen.add(stripped);
        forms.push(stripped);
        next.push(stripped);
      }
    }
    frontier = next;
  }
  return forms;
}

function addPrefixCandidates(form, result, round = 0) {
  if (round === MAX_PREFIX_ROUNDS) return;
  for (const [prefix, restores] of PREFIXES) {
    if (!form.startsWith(prefix) || form.length <= prefix.length) continue;
    const rest = form.slice(prefix.length);
    for (const letter of restores) {
      const candidate = letter + rest;
      if (candidate.length < MIN_ROOT_LENGTH || result.has(candidate)) continue;
      result.add(candidate);
      addPrefixCandidates(candidate, result, round + 1);
    }
  }
}

function computeCandidates(word) {
  let base = word.toLowerCase();
  if (REDUPLICATION_DIGIT.test(base)) base = base.slice(0, -1); // bayar2 -> bayar

  const forms = stripSuffixes(base);
  const result = new Set(forms);
  for (const form of forms) addPrefixCandidates(form, result);
  return [...result].filter((candidate) => candidate.length >= MIN_ROOT_LENGTH);
}

// Semua kemungkinan kata dasar dari satu kata (kata asli selalu di urutan pertama
// bila panjangnya >= 4 huruf).
export function rootCandidates(word) {
  return [...candidateSet(word)];
}

// Versi Set (dipakai mesin pencocokan; jangan diubah isinya).
export function candidateSet(word) {
  const key = word.toLowerCase();
  let cached = candidateCache.get(key);
  if (!cached) {
    if (candidateCache.size >= CACHE_LIMIT) candidateCache.clear();
    cached = new Set(computeCandidates(key));
    candidateCache.set(key, cached);
  }
  return cached;
}

// Kata dasar pertama yang ada di rootSet, atau null.
export function findRoot(word, rootSet) {
  for (const candidate of candidateSet(word)) {
    if (rootSet.has(candidate)) return candidate;
  }
  return null;
}

// Pecah teks menjadi token huruf/angka beserta posisinya. Tanda hubung ikut memisahkan
// token, jadi "kirim-kirim" dan "nge-transfer" otomatis terurai.
export function tokenize(text) {
  const tokens = [];
  for (const match of text.matchAll(TOKEN_REGEX)) {
    tokens.push({ text: match[0], start: match.index, end: match.index + match[0].length });
  }
  return tokens;
}

export function findRootHits(text, rootSet) {
  const hits = [];
  for (const token of tokenize(text.toLowerCase())) {
    const root = findRoot(token.text, rootSet);
    if (root) hits.push({ ...token, root });
  }
  return hits;
}

// ---------------------------------------------------------------------------
// inflect(): kebalikan rootCandidates, membangkitkan bentuk turunan baku dan gaul.
// Dipakai test supaya setiap kata di daftar terbukti terdeteksi dalam bentuk berimbuhan.

const VOWELS = 'aeiou';
const isVowel = (letter) => VOWELS.includes(letter);
const startsWithCluster = (word) => !isVowel(word[0]) && word.length > 1 && !isVowel(word[1]);

// Bentuk meN-/peN- baku: [awalan me-, awalan pe-, sisa kata].
function nasalStems(root) {
  const first = root[0];
  const rest = root.slice(1);
  const cluster = startsWithCluster(root);
  if (isVowel(first)) return [['meng', 'peng', root]];
  if (first === 'k') return cluster ? [['meng', 'peng', root]] : [['meng', 'peng', rest]];
  if ('ghx'.includes(first)) return [['meng', 'peng', root]];
  if (first === 's') return cluster ? [['men', 'pen', root]] : [['meny', 'peny', rest], ['men', 'pen', root]];
  if (first === 't') return cluster ? [['men', 'pen', root]] : [['men', 'pen', rest]];
  if (first === 'p') return cluster ? [['mem', 'pem', root]] : [['mem', 'pem', rest]];
  if ('bfv'.includes(first)) return [['mem', 'pem', root]];
  if ('cdjz'.includes(first)) return [['men', 'pen', root]];
  return [['me', 'pe', root]];
}

// Bentuk N- gaul (ngirim, nyetor, narik, maksa, nyuri) dan nge- (ngetransfer).
function slangStems(root) {
  const first = root[0];
  const rest = root.slice(1);
  const stems = [`nge${root}`];
  if (startsWithCluster(root)) return stems;
  if (isVowel(first)) stems.push(`ng${root}`);
  else if (first === 'k') stems.push(`ng${rest}`);
  else if (first === 's' || first === 'c') stems.push(`ny${rest}`);
  else if (first === 't') stems.push(`n${rest}`);
  else if (first === 'p') stems.push(`m${rest}`);
  return stems;
}

export function inflect(root) {
  const word = root.toLowerCase();
  const forms = [
    word,
    `${word}kan`,
    `${word}i`,
    `${word}an`,
    `${word}nya`,
    `${word}lah`,
    `${word}kah`,
    `${word}pun`,
    `${word}kannya`,
    `${word}mu`,
    `di${word}`,
    `di${word}kan`,
    `di${word}i`,
    `di${word}nya`,
    `di${word}kannya`,
    `ter${word}`,
    `ter${word}kan`,
    `ber${word}`,
    `ber${word}an`,
    `per${word}an`,
    `ke${word}an`,
    `memper${word}kan`,
    `diper${word}kan`,
  ];
  for (const [me, pe, stem] of nasalStems(word)) {
    forms.push(`${me}${stem}`, `${me}${stem}kan`, `${me}${stem}i`, `${me}${stem}nya`, `${me}${stem}kannya`);
    forms.push(`${pe}${stem}`, `${pe}${stem}an`, `${pe}${stem}annya`);
  }
  for (const stem of slangStems(word)) {
    forms.push(stem, `${stem}in`, `${stem}kan`);
  }
  forms.push(
    `${word}in`,
    `di${word}in`,
    `di${word}innya`,
    `${word}2`,
    `${word}-${word}`,
    `nge-${word}`,
  );
  return [...new Set(forms)];
}
