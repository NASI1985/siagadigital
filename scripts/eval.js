// npm run eval  — evaluasi korpus (juga dijalankan oleh npm test).
// tests/corpus/scam.jsonl   : {"text","category","minLevel"}  pesan penipuan FIKTIF
// tests/corpus/benign.jsonl : {"text","maxLevel"}             pesan normal
// Lulus bila recall >= 90% per kategori dan salah tuduh Tinggi <= 3%.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { analyze } from '../src/lib/analyzer.js';

const RANK = { rendah: 0, sedang: 1, tinggi: 2 };
const MIN_RECALL = 0.9;
const MAX_HIGH_FALSE_POSITIVE = 0.03;
const MIN_SCAM = 300;
const MIN_BENIGN = 300;
const MIN_PER_CATEGORY = 10;

const corpusPath = (name) => fileURLToPath(new URL(`../tests/corpus/${name}`, import.meta.url));

function readJsonl(name) {
  return readFileSync(corpusPath(name), 'utf8')
    .split(/\r?\n/)
    .map((line, index) => [line.trim(), index + 1])
    .filter(([line]) => line !== '')
    .map(([line, lineNumber]) => {
      try {
        return { ...JSON.parse(line), lineNumber };
      } catch (error) {
        throw new Error(`${name} baris ${lineNumber}: JSON tidak valid (${error.message})`);
      }
    });
}

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const short = (text) => (text.length > 110 ? `${text.slice(0, 107)}...` : text);

const scam = readJsonl('scam.jsonl');
const benign = readJsonl('benign.jsonl');
const problems = [];

// Penipuan: recall per kategori.
const perCategory = new Map();
const missed = [];
for (const item of scam) {
  if (!RANK[item.minLevel] && item.minLevel !== 'rendah') problems.push(`scam baris ${item.lineNumber}: minLevel tidak valid`);
  const result = analyze(item.text);
  const ok = RANK[result.level] >= RANK[item.minLevel];
  const stats = perCategory.get(item.category) ?? { total: 0, hit: 0 };
  stats.total += 1;
  if (ok) stats.hit += 1;
  perCategory.set(item.category, stats);
  if (!ok) missed.push({ ...item, got: result.level });
}

const rows = [...perCategory.entries()].map(([category, { total, hit }]) => ({
  kategori: category,
  pesan: total,
  terdeteksi: hit,
  recall: pct(hit / total),
  lulus: hit / total >= MIN_RECALL && total >= MIN_PER_CATEGORY ? 'ya' : 'TIDAK',
}));
console.log('RECALL PER KATEGORI (pesan penipuan fiktif)');
console.table(rows);
for (const row of rows) {
  const { total, hit } = perCategory.get(row.kategori);
  if (total < MIN_PER_CATEGORY) problems.push(`Kategori ${row.kategori} baru ${total} pesan (minimal ${MIN_PER_CATEGORY})`);
  if (hit / total < MIN_RECALL) problems.push(`Recall ${row.kategori} ${row.recall} < ${pct(MIN_RECALL)}`);
}
if (scam.length < MIN_SCAM) problems.push(`scam.jsonl baru ${scam.length} pesan (minimal ${MIN_SCAM})`);

// Pesan normal: salah tuduh.
let highCount = 0;
let anyFinding = 0;
const falsePositives = [];
for (const item of benign) {
  const result = analyze(item.text);
  if (result.findings.length > 0) anyFinding += 1;
  if (result.level === 'tinggi') highCount += 1;
  if (RANK[result.level] > RANK[item.maxLevel ?? 'sedang']) {
    falsePositives.push({ ...item, got: result.level, rules: result.findings.map((finding) => finding.rule.id) });
  }
}
const highRate = benign.length ? highCount / benign.length : 0;
if (benign.length < MIN_BENIGN) problems.push(`benign.jsonl baru ${benign.length} pesan (minimal ${MIN_BENIGN})`);
if (highRate > MAX_HIGH_FALSE_POSITIVE) problems.push(`Salah tuduh Tinggi ${pct(highRate)} > ${pct(MAX_HIGH_FALSE_POSITIVE)}`);

const totalHit = [...perCategory.values()].reduce((sum, stats) => sum + stats.hit, 0);
console.log(`\nPenipuan : ${totalHit}/${scam.length} terdeteksi sesuai minLevel (${pct(totalHit / scam.length)})`);
console.log(`Normal   : ${benign.length} pesan, salah tuduh Tinggi ${highCount} (${pct(highRate)}), ada temuan apa pun ${anyFinding} (${pct(anyFinding / benign.length)})`);

if (missed.length > 0) {
  console.log('\nPESAN PENIPUAN YANG LOLOS:');
  for (const item of missed) console.log(`  [${item.category}] baris ${item.lineNumber} (dapat ${item.got}, minimal ${item.minLevel}): ${short(item.text)}`);
}
if (falsePositives.length > 0) {
  console.log('\nPESAN NORMAL MELEBIHI maxLevel:');
  for (const item of falsePositives) {
    console.log(`  baris ${item.lineNumber} (dapat ${item.got}; ${item.rules.join(', ')}): ${short(item.text)}`);
  }
}

if (problems.length > 0) {
  console.error(`\nEVALUASI GAGAL:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`);
  process.exit(1);
}
console.log('\nEvaluasi lulus.');
