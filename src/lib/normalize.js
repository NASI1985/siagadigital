// Normalisasi anti-penyamaran. normalize(text) -> { normalized, map, mapEnd }.
// map[i]    = posisi awal (di teks asli) dari karakter ke-i hasil normalisasi.
// mapEnd[i] = posisi akhir (eksklusif, di teks asli) dari karakter ke-i.
// Dengan peta ini sorotan tetap jatuh tepat di teks asli.
//
// Langkah: huruf kecil + NFKC, buang karakter lebar-nol dan diakritik, huruf mirip -> ASCII,
// leet (d3posit) hanya bila diapit huruf, gabung tanda hubung pendek (de-posit, nge-transfer),
// gabung huruf tersela (d e p o s i t, d.e.p.o.s.i.t), lipat huruf berulang >= 3 (depositttt).
// Angka murni dan nominal (Rp150.000, $2000, 30%, 04232346) tidak diubah.

const ZERO_WIDTH = /^[­͏؜ᅟᅠ឴឵᠋-᠎​-‏‪-‮⁠-⁯ㅤ︀-️﻿ﾠ]$/u;
const COMBINING_MARK = /\p{M}/gu;
const LETTER = /^\p{L}$/u;

// Huruf mirip (Kiril, Yunani, kapital kecil, tanda hubung khusus) -> ASCII. Kunci huruf kecil.
const HOMOGLYPHS = {
  // Kiril
  а: 'a', в: 'b', е: 'e', ё: 'e', к: 'k', м: 'm', н: 'h', о: 'o', р: 'p', с: 'c', т: 't', у: 'y', х: 'x',
  і: 'i', ї: 'i', ј: 'j', ѕ: 's', һ: 'h', ԁ: 'd', ԛ: 'q', ԝ: 'w', ӏ: 'l', ь: 'b', г: 'r', п: 'n', з: '3',
  // Yunani
  α: 'a', β: 'b', ε: 'e', η: 'n', ι: 'i', κ: 'k', ν: 'v', ο: 'o', ρ: 'p', τ: 't', υ: 'u', χ: 'x', ω: 'w', γ: 'y',
  // Kapital kecil dan huruf Latin lain
  ᴀ: 'a', ʙ: 'b', ᴄ: 'c', ᴅ: 'd', ᴇ: 'e', ꜰ: 'f', ғ: 'f', ɢ: 'g', ʜ: 'h', ɪ: 'i', ᴊ: 'j', ᴋ: 'k', ʟ: 'l',
  ᴍ: 'm', ɴ: 'n', ᴏ: 'o', ᴘ: 'p', ǫ: 'q', ʀ: 'r', ꜱ: 's', ᴛ: 't', ᴜ: 'u', ᴠ: 'v', ᴡ: 'w', ʏ: 'y', ᴢ: 'z',
  ı: 'i', ł: 'l', ø: 'o', đ: 'd', ð: 'd', ħ: 'h', ŧ: 't', ß: 'ss', æ: 'ae', œ: 'oe', ɑ: 'a', ɡ: 'g', ɩ: 'i',
  // Tanda hubung dan titik khusus
  '‐': '-', '‑': '-', '‒': '-', '–': '-', '—': '-', '−': '-', '·': '.', '•': '.',
};

// Leet: hanya diterapkan pada deretan pendek yang diapit huruf di kiri dan kanan.
const LEET = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a', $: 's' };
const MAX_LEET_RUN = 3;

// Pemisah yang boleh menyela huruf tunggal: "d e p o", "d.e.p.o", "d-e-p-o", "d_e_p_o", "d*e*p*o".
const SPACED_SEPARATORS = new Set([' ', '.', '-', '_', '*', '\t']);
const MIN_SPACED_LETTERS = 3;
const SHORT_HYPHEN_PART = 3;

const isLetter = (char) => char !== undefined && LETTER.test(char);

function convertCodePoint(codePoint) {
  if (ZERO_WIDTH.test(codePoint)) return '';
  const code = codePoint.codePointAt(0);
  if (code < 128) return codePoint.toLowerCase();
  const lowered = codePoint.toLowerCase();
  if (HOMOGLYPHS[lowered]) return HOMOGLYPHS[lowered];
  const decomposed = lowered.normalize('NFKC').normalize('NFD').replace(COMBINING_MARK, '').toLowerCase();
  let output = '';
  for (const char of decomposed) output += HOMOGLYPHS[char] ?? char;
  return output;
}

function toChars(text) {
  const chars = [];
  let position = 0;
  for (const codePoint of text) {
    const start = position;
    position += codePoint.length;
    // Per unit UTF-16 supaya panjang hasil = panjang peta (emoji = 2 unit).
    const converted = convertCodePoint(codePoint);
    for (let k = 0; k < converted.length; k += 1) chars.push({ c: converted[k], s: start, e: position });
  }
  return chars;
}

function applyLeet(chars) {
  for (let i = 0; i < chars.length; i += 1) {
    if (!(chars[i].c in LEET)) continue;
    let end = i;
    while (end < chars.length && chars[end].c in LEET) end += 1;
    const before = chars[i - 1]?.c;
    const after = chars[end]?.c;
    // "rp5k" / "rp150" adalah nominal, bukan leet.
    const isNominal = before === 'p' && chars[i - 2]?.c === 'r' && !isLetter(chars[i - 3]?.c);
    if (end - i <= MAX_LEET_RUN && isLetter(before) && isLetter(after) && !isNominal) {
      for (let k = i; k < end; k += 1) chars[k].c = LEET[chars[k].c];
    }
    i = end - 1;
  }
  return chars;
}

function letterRunLength(chars, from, step) {
  let length = 0;
  for (let i = from; i >= 0 && i < chars.length && isLetter(chars[i].c); i += step) length += 1;
  return length;
}

// "de-posit" -> "deposit", "nge-transfer" -> "ngetransfer"; "kirim-kirim" tetap.
function joinShortHyphens(chars) {
  return chars.filter((char, i) => {
    if (char.c !== '-') return true;
    if (!isLetter(chars[i - 1]?.c) || !isLetter(chars[i + 1]?.c)) return true;
    const left = letterRunLength(chars, i - 1, -1);
    const right = letterRunLength(chars, i + 1, 1);
    return Math.min(left, right) > SHORT_HYPHEN_PART;
  });
}

const isSingleLetterAt = (chars, i) =>
  isLetter(chars[i]?.c) && !/[\p{L}\p{N}]/u.test(chars[i - 1]?.c ?? ' ') && !/[\p{L}\p{N}]/u.test(chars[i + 1]?.c ?? ' ');

// "d e p o s i t" -> "deposit": >= 3 huruf tunggal yang dipisah satu karakter pemisah yang sama.
function joinSpacedLetters(chars) {
  const remove = new Uint8Array(chars.length);
  let i = 0;
  while (i < chars.length) {
    if (!isSingleLetterAt(chars, i)) {
      i += 1;
      continue;
    }
    const separator = chars[i + 1]?.c;
    let count = 1;
    let last = i;
    if (SPACED_SEPARATORS.has(separator)) {
      let next = i + 2;
      while (chars[next - 1]?.c === separator && isLetter(chars[next]?.c) && isSingleLetterAt(chars, next)) {
        count += 1;
        last = next;
        next += 2;
      }
    }
    if (count >= MIN_SPACED_LETTERS) {
      for (let k = i + 1; k < last; k += 2) remove[k] = 1;
    }
    i = last + 1;
  }
  return chars.filter((_, index) => !remove[index]);
}

// Huruf yang sama berulang >= 3 kali dilipat jadi satu (depositttt -> deposit).
// Deretan di AWAL kata tidak dilipat, supaya singkatan seperti "pppk" tetap utuh.
function foldRepeats(chars) {
  const result = [];
  for (let i = 0; i < chars.length; ) {
    let end = i + 1;
    while (end < chars.length && chars[end].c === chars[i].c) end += 1;
    const runLength = end - i;
    const atWordStart = !isLetter(chars[i - 1]?.c);
    if (runLength >= 3 && isLetter(chars[i].c) && !atWordStart) {
      result.push({ c: chars[i].c, s: chars[i].s, e: chars[end - 1].e });
    } else {
      for (let k = i; k < end; k += 1) result.push(chars[k]);
    }
    i = end;
  }
  return result;
}

export function normalize(text) {
  const source = typeof text === 'string' ? text : '';
  let chars = toChars(source);
  chars = applyLeet(chars);
  chars = joinShortHyphens(chars);
  chars = joinSpacedLetters(chars);
  chars = foldRepeats(chars);

  let normalized = '';
  const map = new Array(chars.length);
  const mapEnd = new Array(chars.length);
  chars.forEach((char, index) => {
    normalized += char.c;
    map[index] = char.s;
    mapEnd[index] = char.e;
  });
  return { normalized, map, mapEnd };
}
