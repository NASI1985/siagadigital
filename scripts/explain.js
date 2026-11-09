// npm run explain -- "teks"
// Mencetak teks ternormalisasi, kata/aturan yang cocok, dan potongan yang disorot.
import { analyze, explain } from '../src/lib/analyzer.js';

const text = process.argv.slice(2).join(' ');
if (!text) {
  console.error('Pakai: npm run explain -- "teks yang mau dicek"');
  process.exit(1);
}

const details = explain(text);
const result = analyze(text);

console.log(`Teks ternormalisasi:\n  ${details.normalized}\n`);
console.log('Kecocokan (aturan | jenis | entri kamus -> potongan teks):');
if (details.hits.length === 0) console.log('  (tidak ada)');
for (const hit of details.hits) {
  const strength = hit.strong ? 'kuat' : 'lemah';
  console.log(`  ${hit.rule.padEnd(20)} | ${hit.kind.padEnd(9)} ${strength.padEnd(5)} | "${hit.entry}" -> "${hit.text}"`);
}

const highlighted = result.segments
  .map((segment) => (segment.weight > 0 ? `[[${segment.text}]]${segment.weight}` : segment.text))
  .join('');
console.log(`\nSorotan ([[...]]bobot):\n  ${highlighted}\n`);
console.log(`Temuan: ${result.findings.map((finding) => `${finding.rule.id}(${finding.rule.weight}${finding.strong ? '' : ', lemah'})`).join(', ') || '-'}`);
console.log(`Combo : ${result.combos.map((combo) => combo.id).join(', ') || '-'}`);
console.log(`Skor  : ${result.score}   Level: ${result.level.toUpperCase()}${result.warningContext ? '   (konteks peringatan/edukasi)' : ''}`);
