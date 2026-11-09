// Mesin pengecekan: pencocokan pola berbobot, BUKAN AI.
// Fungsi murni: teks masuk, hasil keluar. Tidak ada yang disimpan atau dikirim.
import { DETECTION_RULES, DETECTION_COMBOS } from '../data/detectionRules.js';
import { findMatches } from './patterns.js';

export const LEVEL_LOW = 'rendah';
export const LEVEL_MEDIUM = 'sedang';
export const LEVEL_HIGH = 'tinggi';

const HIGH_SCORE_THRESHOLD = 3;
const MAX_SAMPLE_MATCHES = 3;

export function scoreToLevel(score) {
  if (score >= HIGH_SCORE_THRESHOLD) return LEVEL_HIGH;
  if (score > 0) return LEVEL_MEDIUM;
  return LEVEL_LOW;
}

// Ambil maksimal 3 frasa unik (urut kemunculan) sebagai contoh temuan.
function sampleMatches(matches) {
  const samples = [];
  for (const match of [...matches].sort((a, b) => a.start - b.start)) {
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

// Potong teks menjadi segmen; segmen digabung lagi = teks asli.
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

export function analyze(text, rules = DETECTION_RULES, combos = DETECTION_COMBOS) {
  const source = typeof text === 'string' ? text : '';
  const candidates = [];
  const findings = [];

  for (const rule of rules) {
    const ruleMatches = rule.patterns.flatMap((pattern) => findMatches(pattern, source));
    if (ruleMatches.length === 0) continue;
    ruleMatches.forEach((match) => candidates.push({ ...match, weight: rule.weight }));
    findings.push({ rule, matches: sampleMatches(ruleMatches) });
  }

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
    level: scoreToLevel(score),
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
