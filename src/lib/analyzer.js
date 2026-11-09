// Mesin pengecekan: pencocokan pola berbobot, BUKAN AI.
// Fungsi murni: teks masuk, hasil keluar. Tidak ada yang disimpan atau dikirim.
//
// Dua lintasan:
// 1. patterns (angka, mata uang, tautan, nomor rekening) dicari di teks ASLI.
// 2. words / exact / ambiguous / near dicari di teks TERNORMALISASI, berbasis token,
//    dengan pencocokan imbuhan (lib/affix.js). Posisi dikembalikan ke teks asli lewat peta.
import { DETECTION_RULES, DETECTION_COMBOS } from '../data/detectionRules.js';
import { GROUPS } from '../data/words/groups.js';
import { SAFE_PHRASES } from '../data/words/safe.js';
import { findMatches } from './patterns.js';
import { normalize } from './normalize.js';
import { candidateSet, tokenize, MIN_ROOT_LENGTH } from './affix.js';

export const LEVEL_LOW = 'rendah';
export const LEVEL_MEDIUM = 'sedang';
export const LEVEL_HIGH = 'tinggi';

export const MAX_INPUT_LENGTH = 8000;

const STRONG_WEIGHT = 3;
const HIGH_SCORE_THRESHOLD = 4;
const HIGH_MIN_RULES = 2;
const MAX_SAMPLE_MATCHES = 3;
const DEFAULT_NEAR_WITHIN = 4;

// Penanda kalimat peringatan/edukasi (sempit). "jangan lupa" / "jangan sampai" BUKAN penanda.
const WARNING_MARKERS = [
  /\bjangan\s+(?:pernah\s+)?(?:bagikan|berikan|beri|kasih(?!\s+(?:tahu|tau)\b)|kirim|kirimkan|share|sebarkan|sebutkan)\b/g,
  /\btidak\s+(?:akan|pernah)\s+(?:\S+\s+){0,2}?meminta\b/g,
  /\bgak\s+(?:akan|pernah)\s+(?:\S+\s+){0,2}?minta\b/g,
  /\btidak\s+boleh\s+dibagikan\b/g,
  /\bwaspada\b/g,
  /\bhati[\s-]?hati\b/g,
  /\bawas\s+(?:modus\s+)?penipuan\b/g,
];

// ---------------------------------------------------------------------------
// Kompilasi daftar kata (sekali per himpunan aturan).

// Pemisah antartoken dalam frasa: spasi dan tanda hubung dianggap sama ("bagi-bagi" = "bagi bagi").
// Baris baru memutus frasa.
function gapKey(gap) {
  if (gap.includes('\n')) return '\n';
  const trimmed = gap.trim();
  return trimmed === '-' ? '' : trimmed;
}

function compileEntry(entry, affix) {
  const normalized = normalize(entry).normalized.trim();
  const parts = tokenize(normalized);
  const tokens = parts.map((part) => ({ value: part.text, affix: affix && part.text.length >= MIN_ROOT_LENGTH }));
  const seps = parts.slice(1).map((part, index) => gapKey(normalized.slice(parts[index].end, part.start)));
  return { entry, tokens, seps };
}

function addToIndex(index, compiled, payload) {
  if (compiled.tokens.length === 0) return;
  const first = compiled.tokens[0];
  const key = `${first.affix ? 'r' : 'x'}:${first.value}`;
  if (!index.has(key)) index.set(key, []);
  index.get(key).push({ ...compiled, ...payload });
}

function buildIndex(entries, affix, payload) {
  const index = new Map();
  for (const entry of entries) addToIndex(index, compileEntry(entry, affix), payload);
  return index;
}

const compiledCache = new WeakMap();

function compileRules(rules) {
  if (compiledCache.has(rules)) return compiledCache.get(rules);

  const ruleIndex = new Map();
  const usedGroups = new Set();
  rules.forEach((rule, ruleIdx) => {
    const lists = [
      ['words', rule.words ?? [], true],
      ['exact', rule.exact ?? [], false],
      ['ambiguous', rule.ambiguous ?? [], true],
    ];
    for (const [kind, entries, affix] of lists) {
      for (const entry of entries) addToIndex(ruleIndex, compileEntry(entry, affix), { ruleIdx, kind });
    }
    for (const near of rule.near ?? []) {
      for (const side of [near.a, near.b]) if (typeof side === 'string') usedGroups.add(side);
    }
    for (const name of rule.anchors ?? []) usedGroups.add(name);
  });

  const groupIndexes = new Map();
  const groupSource = (side) => (typeof side === 'string' ? GROUPS[side] : side);
  for (const name of usedGroups) {
    if (!GROUPS[name]) throw new Error(`Kelompok kata "${name}" tidak ada di groups.js`);
    groupIndexes.set(name, buildIndex(GROUPS[name], true, {}));
  }
  const inlineIndexes = new Map();
  for (const rule of rules) {
    for (const near of rule.near ?? []) {
      for (const side of [near.a, near.b]) {
        if (Array.isArray(side) && !inlineIndexes.has(side)) inlineIndexes.set(side, buildIndex(groupSource(side), true, {}));
      }
    }
  }

  const compiled = {
    ruleIndex,
    groupIndexes,
    inlineIndexes,
    safeIndex: buildIndex(SAFE_PHRASES, true, {}),
  };
  compiledCache.set(rules, compiled);
  return compiled;
}

// ---------------------------------------------------------------------------
// Pencocokan token.

function tokenMatches(spec, token) {
  return spec.affix ? candidateSet(token.text).has(spec.value) : token.text === spec.value;
}

// Apakah entri (frasa) cocok mulai token ke-i? Kembalikan indeks token terakhir atau -1.
function matchEntryAt(entry, tokens, i, text) {
  const length = entry.tokens.length;
  if (i + length > tokens.length) return -1;
  for (let j = 1; j < length; j += 1) {
    if (gapKey(text.slice(tokens[i + j - 1].end, tokens[i + j].start)) !== entry.seps[j - 1]) return -1;
    if (!tokenMatches(entry.tokens[j], tokens[i + j])) return -1;
  }
  return i + length - 1;
}

function bucketsFor(index, token) {
  const buckets = [];
  const exact = index.get(`x:${token.text}`);
  if (exact) buckets.push(exact);
  if (token.text.length >= MIN_ROOT_LENGTH) {
    for (const candidate of candidateSet(token.text)) {
      const bucket = index.get(`r:${candidate}`);
      if (bucket) buckets.push(bucket);
    }
  }
  return buckets;
}

// Semua kecocokan entri dari sebuah indeks: [{ i, last, entry }].
function scanIndex(index, tokens, text) {
  const found = [];
  tokens.forEach((token, i) => {
    for (const bucket of bucketsFor(index, token)) {
      for (const entry of bucket) {
        const last = matchEntryAt(entry, tokens, i, text);
        if (last >= 0) found.push({ i, last, entry });
      }
    }
  });
  return found;
}

// Kecocokan terpanjang per posisi awal (untuk kelompok kata).
function longestByStart(matches) {
  const byStart = new Map();
  for (const match of matches) {
    const current = byStart.get(match.i);
    if (current === undefined || match.last > current) byStart.set(match.i, match.last);
  }
  return byStart;
}

// ---------------------------------------------------------------------------
// Kalimat: batas . ! ? (diikuti spasi/akhir teks) dan baris baru, dihitung di teks asli.

function sentenceIds(text) {
  const ids = new Int32Array(text.length + 1);
  let current = 0;
  for (let i = 0; i < text.length; i += 1) {
    ids[i] = current;
    const char = text[i];
    if (char === '\n' || ((char === '.' || char === '!' || char === '?') && (i + 1 === text.length || /\s/.test(text[i + 1])))) {
      current += 1;
    }
  }
  ids[text.length] = current;
  return ids;
}

// ---------------------------------------------------------------------------
// Penyusunan hasil (bentuk keluaran sama seperti versi sebelumnya).

export function scoreToLevel(score) {
  if (score >= 3) return LEVEL_HIGH;
  if (score > 0) return LEVEL_MEDIUM;
  return LEVEL_LOW;
}

// Tinggi hanya jika ada temuan kuat (bukan ambigu) berbobot 3, ATAU skor >= 4 dari >= 2 aturan
// (dengan minimal satu temuan kuat, supaya kumpulan kata ambigu saja tidak menjadi Tinggi).
export function levelFor(findings) {
  const score = findings.reduce((total, finding) => total + finding.rule.weight, 0);
  if (score === 0) return LEVEL_LOW;
  const hasStrongHeavy = findings.some((finding) => finding.strong && finding.rule.weight >= STRONG_WEIGHT);
  const manyRules = score >= HIGH_SCORE_THRESHOLD && findings.length >= HIGH_MIN_RULES && findings.some((finding) => finding.strong);
  if (hasStrongHeavy || manyRules) return LEVEL_HIGH;
  return LEVEL_MEDIUM;
}

function sampleMatches(matches) {
  const samples = [];
  // Urut kemunculan; bila mulai di posisi sama, frasa terpanjang lebih dulu.
  for (const match of [...matches].sort((a, b) => a.start - b.start || b.end - a.end)) {
    const isDuplicate = samples.some((sample) => sample.toLowerCase() === match.text.toLowerCase());
    if (!isDuplicate) samples.push(match.text);
    if (samples.length === MAX_SAMPLE_MATCHES) break;
  }
  return samples;
}

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

// Sorotan bertumpuk: bobot lebih besar menang, lalu yang lebih panjang.
function pickHighlights(candidates) {
  const byPriority = [...candidates].sort(
    (a, b) => b.weight - a.weight || b.end - b.start - (a.end - a.start) || a.start - b.start,
  );
  const chosen = [];
  for (const candidate of byPriority) {
    if (!chosen.some((highlight) => overlaps(highlight, candidate))) chosen.push(candidate);
  }
  return chosen.sort((a, b) => a.start - b.start);
}

function buildSegments(text, highlights) {
  const segments = [];
  let cursor = 0;
  for (const highlight of highlights) {
    if (highlight.start > cursor) segments.push({ text: text.slice(cursor, highlight.start), weight: 0 });
    segments.push({ text: text.slice(highlight.start, highlight.end), weight: highlight.weight });
    cursor = highlight.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), weight: 0 });
  return segments;
}

// ---------------------------------------------------------------------------
// Inti: kumpulkan semua "hit" lalu saring.
// hit = { ruleIdx, start, end (posisi teks asli), sentence, kind, strong }

const sideLabel = (side) => (typeof side === 'string' ? side : side.join('|'));

function collectHits(source, rules) {
  const compiled = compileRules(rules);
  const sentenceOf = sentenceIds(source);
  const hits = [];

  // Lintasan 1: patterns di teks asli.
  rules.forEach((rule, ruleIdx) => {
    for (const pattern of rule.patterns ?? []) {
      for (const match of findMatches(pattern, source)) {
        hits.push({ ruleIdx, start: match.start, end: match.end, kind: 'pattern', strong: Boolean(rule.patternsStrong), entry: 'pola angka/tautan' });
      }
    }
  });

  // Lintasan 2: teks ternormalisasi.
  const { normalized, map, mapEnd } = normalize(source);
  const tokens = tokenize(normalized);
  const toOriginal = (firstToken, lastToken) => ({
    start: map[tokens[firstToken].start],
    end: mapEnd[tokens[lastToken].end - 1],
  });

  for (const { i, last, entry } of scanIndex(compiled.ruleIndex, tokens, normalized)) {
    hits.push({
      ruleIdx: entry.ruleIdx,
      ...toOriginal(i, last),
      kind: entry.kind,
      strong: entry.kind !== 'ambiguous',
      entry: entry.entry,
    });
  }

  // Kelompok kata (untuk near dan jangkar).
  const groupMatches = new Map();
  const groupMatchesFor = (side) => {
    if (!groupMatches.has(side)) {
      const index = typeof side === 'string' ? compiled.groupIndexes.get(side) : compiled.inlineIndexes.get(side);
      groupMatches.set(side, longestByStart(scanIndex(index, tokens, normalized)));
    }
    return groupMatches.get(side);
  };
  const tokenSentence = (index) => sentenceOf[map[tokens[index].start]];

  rules.forEach((rule, ruleIdx) => {
    for (const near of rule.near ?? []) {
      const within = near.within ?? DEFAULT_NEAR_WITHIN;
      const aMatches = groupMatchesFor(near.a);
      const bMatches = groupMatchesFor(near.b);
      for (const [aStart, aLast] of aMatches) {
        const sentence = tokenSentence(aStart);
        for (let j = aLast + 1; j <= aLast + within && j < tokens.length; j += 1) {
          if (tokenSentence(j) !== sentence) break;
          if (!bMatches.has(j)) continue;
          const label = `${sideLabel(near.a)} ~ ${sideLabel(near.b)}`;
          hits.push({ ruleIdx, ...toOriginal(aStart, bMatches.get(j)), kind: 'near', strong: !near.weak, entry: label });
          break;
        }
      }
    }
  });

  // Frasa aman: kecocokan yang bertumpuk dengan frasa aman dikeluarkan.
  const safeSpans = scanIndex(compiled.safeIndex, tokens, normalized).map(({ i, last }) => toOriginal(i, last));
  const notSafe = (hit) => !safeSpans.some((span) => overlaps(span, hit));

  // Jangkar per kalimat: kelompok anchors milik aturan.
  const anchorSentences = new Map();
  const anchorSentencesFor = (name) => {
    if (!anchorSentences.has(name)) {
      const sentences = new Set();
      for (const start of groupMatchesFor(name).keys()) sentences.add(tokenSentence(start));
      anchorSentences.set(name, sentences);
    }
    return anchorSentences.get(name);
  };

  let kept = hits.filter(notSafe).map((hit) => ({ ...hit, sentence: sentenceOf[hit.start] }));

  const ruleSentences = new Map();
  for (const hit of kept) {
    if (hit.kind === 'ambiguous') continue;
    if (!ruleSentences.has(hit.ruleIdx)) ruleSentences.set(hit.ruleIdx, new Set());
    ruleSentences.get(hit.ruleIdx).add(hit.sentence);
  }
  kept = kept.filter((hit) => {
    if (hit.kind !== 'ambiguous') return true;
    if (ruleSentences.get(hit.ruleIdx)?.has(hit.sentence)) return true;
    return (rules[hit.ruleIdx].anchors ?? []).some((name) => anchorSentencesFor(name).has(hit.sentence));
  });

  // Konteks peringatan: temuan aturan "warnable" di kalimat peringatan bobotnya 0 (dibuang).
  const warningSentences = new Set();
  for (const marker of WARNING_MARKERS) {
    for (const match of normalized.matchAll(marker)) warningSentences.add(sentenceOf[map[match.index]]);
  }
  // Kalimat tetangga (mis. "Kode OTP Anda 1234. Jangan berikan ke siapa pun.") juga dihitung,
  // kecuali kalimat itu sendiri berisi permintaan kirim (near), misalnya "Kirim kode OTP sekarang.".
  const nearSentences = new Set(kept.filter((hit) => hit.kind === 'near' && hit.strong).map((hit) => `${hit.ruleIdx}:${hit.sentence}`));
  const isWarned = (hit) => {
    if (warningSentences.has(hit.sentence)) return true;
    const neighbour = warningSentences.has(hit.sentence - 1) || warningSentences.has(hit.sentence + 1);
    return neighbour && !nearSentences.has(`${hit.ruleIdx}:${hit.sentence}`);
  };
  let warningContext = false;
  kept = kept.filter((hit) => {
    if (!rules[hit.ruleIdx].warnable || !isWarned(hit)) return true;
    warningContext = true;
    return false;
  });

  return { hits: kept, warningContext };
}

export function analyze(text, rules = DETECTION_RULES, combos = DETECTION_COMBOS) {
  const source = typeof text === 'string' ? text : '';
  const { hits, warningContext } = source ? collectHits(source, rules) : { hits: [], warningContext: false };

  const byRule = new Map();
  for (const hit of hits) {
    if (!byRule.has(hit.ruleIdx)) byRule.set(hit.ruleIdx, []);
    byRule.get(hit.ruleIdx).push({ ...hit, text: source.slice(hit.start, hit.end) });
  }

  const candidates = [];
  const findings = [];
  rules.forEach((rule, ruleIdx) => {
    const ruleHits = byRule.get(ruleIdx);
    if (!ruleHits) return;
    ruleHits.forEach((hit) => candidates.push({ start: hit.start, end: hit.end, weight: rule.weight }));
    findings.push({ rule, matches: sampleMatches(ruleHits), strong: ruleHits.some((hit) => hit.strong) });
  });

  // Urutkan temuan dari yang terberat; urutan aturan dipertahankan untuk bobot yang sama.
  findings.sort((a, b) => b.rule.weight - a.rule.weight);

  const foundIds = new Set(findings.map((finding) => finding.rule.id));
  const matchedCombos = combos.filter((combo) => combo.rules.every((id) => foundIds.has(id)));
  const score = findings.reduce((total, finding) => total + finding.rule.weight, 0);

  return {
    segments: buildSegments(source, pickHighlights(candidates)),
    findings,
    combos: matchedCombos,
    score,
    level: levelFor(findings),
    warningContext,
  };
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Isi {match} di alasan dengan frasa pertama yang ditemukan.
export function describeFinding(finding) {
  const firstMatch = finding.matches[0] ?? '';
  return finding.rule.why.replace('{match}', capitalize(firstMatch.toLowerCase()));
}

// Untuk audit: entri mana saja (dari daftar entries) yang cocok di dalam teks.
const entryIndexCache = new WeakMap();

export function findEntryMatches(text, entries, affix = true) {
  if (!entryIndexCache.has(entries)) entryIndexCache.set(entries, buildIndex(entries, affix, {}));
  const index = entryIndexCache.get(entries);
  const { normalized } = normalize(text);
  return [...new Set(scanIndex(index, tokenize(normalized), normalized).map(({ entry }) => entry.entry))];
}

// Untuk skrip explain: rincian per hit (teks ternormalisasi + aturan + potongan).
export function explain(text, rules = DETECTION_RULES) {
  const source = typeof text === 'string' ? text : '';
  const { hits, warningContext } = source ? collectHits(source, rules) : { hits: [], warningContext: false };
  return {
    normalized: normalize(source).normalized,
    warningContext,
    hits: hits
      .sort((a, b) => a.start - b.start)
      .map((hit) => ({
        rule: rules[hit.ruleIdx].id,
        kind: hit.kind,
        entry: hit.entry,
        strong: hit.strong,
        start: hit.start,
        end: hit.end,
        text: source.slice(hit.start, hit.end),
      })),
  };
}
