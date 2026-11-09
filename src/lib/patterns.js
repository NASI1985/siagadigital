// Helper pembuat regex untuk mesin pengecekan.
// Batas kata dibuat manual (tanpa lookbehind) supaya tetap jalan di Safari lama:
// grup 1 menampung karakter sebelum kata, grup 2 berisi frasa yang dicari.

export const BOUNDARY_START = '(^|[^\\p{L}\\p{N}])';
const BOUNDARY_END = '(?=$|[^\\p{L}\\p{N}])';

export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Spasi di frasa cocok dengan satu atau lebih spasi/baris baru.
function phraseToSource(phrase) {
  return phrase.trim().split(/\s+/).map(escapeRegex).join('\\s+');
}

function byLengthDesc(a, b) {
  return b.length - a.length;
}

function wrapWithBoundary(body) {
  return new RegExp(`${BOUNDARY_START}(${body})${BOUNDARY_END}`, 'giu');
}

// kata('a', 'b c') -> regex berbatas kata, tidak peka huruf besar-kecil,
// frasa terpanjang dicoba lebih dulu.
export function kata(...phrases) {
  const sources = phrases.map(phraseToSource).sort(byLengthDesc);
  return wrapWithBoundary(sources.join('|'));
}

// pola(...) sama seperti kata(), tetapi isinya potongan regex (bukan teks biasa).
// Pakai grup non-capturing (?:...) di dalam potongan.
export function pola(...sources) {
  const sorted = [...sources].sort(byLengthDesc);
  return wrapWithBoundary(sorted.map((source) => `(?:${source})`).join('|'));
}

// Tambahkan flag g kalau terlupa, karena matchAll mewajibkannya.
export function ensureGlobal(regex) {
  return regex.flags.includes('g') ? regex : new RegExp(regex.source, `${regex.flags}g`);
}

// Kembalikan semua kecocokan sebagai { start, end, text } dengan offset yang sudah
// dikoreksi (karakter pembatas di depan tidak ikut disorot).
export function findMatches(regex, text) {
  const globalRegex = ensureGlobal(regex);
  const hasBoundary = regex.source.startsWith(BOUNDARY_START);
  const matches = [];

  for (const match of text.matchAll(globalRegex)) {
    const prefix = hasBoundary ? match[1] ?? '' : '';
    const matchedText = hasBoundary ? match[2] : match[0];
    if (!matchedText) continue;
    const start = match.index + prefix.length;
    matches.push({ start, end: start + matchedText.length, text: matchedText });
  }
  return matches;
}
