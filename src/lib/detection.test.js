// Test mesin deteksi versi daftar kata + imbuhan + normalisasi (poin 6B-6H).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { analyze, explain } from './analyzer.js';
import { inflect, tokenize, MIN_ROOT_LENGTH } from './affix.js';
import { CATEGORY_FILES, SAFE_PHRASES } from '../data/words/index.js';
import { findEntryMatches } from './analyzer.js';

const ROOT_DIR = fileURLToPath(new URL('../../', import.meta.url));
const ruleIds = (result) => result.findings.map((finding) => finding.rule.id);
const joined = (result) => result.segments.map((segment) => segment.text).join('');
const highlighted = (result) => result.segments.filter((segment) => segment.weight > 0).map((segment) => segment.text);

// ---------------------------------------------------------------------------
// B. Regresi: semua contoh di poin 2 terdeteksi, sorotan menutupi kata UTUH.
const REGRESSION = [
  ['mendeposit', 'mendeposit'],
  ['didepositkan', 'didepositkan'],
  ['mentransfer dulu', 'mentransfer dulu'],
  ['ditransfer dulu', 'ditransfer dulu'],
  ['mensetor jaminan', 'mensetor jaminan'],
  ['ditebus dulu', 'ditebus dulu'],
  ['jangan memberitahu siapa-siapa', 'jangan memberitahu'],
  ['dirahasiakan ya', 'dirahasiakan'],
  ['akun akan dihanguskan', 'dihanguskan'],
  ['kamu memenangkan hadiah', 'kamu memenangkan'],
  ['mengklik tautan ini', 'mengklik tautan'],
  ['memblokir akunmu', 'memblokir akunmu'],
  ['tolong tranfer dulu', 'tranfer dulu'],
  ['ngirim kode OTP', 'ngirim kode OTP'],
  ['ditransferin dulu', 'ditransferin dulu'],
  ['bayarin dulu', 'bayarin dulu'],
  ['D E P O S I T', 'D E P O S I T'],
  ['d3posit', 'd3posit'],
  ['depositttt', 'depositttt'],
  ['de-posit', 'de-posit'],
  ['ᴅeposit', 'ᴅeposit'],
];

test('B. semua contoh regresi terdeteksi dan sorotannya menutupi kata utuh', () => {
  for (const [text, mustContain] of REGRESSION) {
    const result = analyze(text);
    assert.notEqual(result.level, 'rendah', `"${text}" harus terdeteksi`);
    const marks = highlighted(result).join(' | ');
    assert.ok(marks.includes(mustContain), `"${text}": sorotan "${marks}" harus memuat "${mustContain}"`);
    assert.equal(joined(result), text);
  }
});

test('B. kata berimbuhan disorot utuh, bukan potongan kata dasarnya', () => {
  const result = analyze('Kamu harus mendeposit sekarang');
  assert.ok(highlighted(result).includes('mendeposit'));
  assert.ok(!highlighted(result).includes('deposit'));
});

// ---------------------------------------------------------------------------
// C. Table-driven: setiap entri words di setiap kategori, semua turunan inflect() terdeteksi.

function firstAffixableToken(entry) {
  return tokenize(entry).find((token) => token.text.length >= MIN_ROOT_LENGTH);
}

test('C. setiap entri words terdeteksi dalam semua bentuk turunan (baku dan gaul)', () => {
  const failures = [];
  let checked = 0;
  for (const [file, rule] of CATEGORY_FILES) {
    for (const entry of rule.words) {
      const token = firstAffixableToken(entry);
      if (!token) continue;
      const isPhrase = tokenize(entry).length > 1;
      const forms = inflect(token.text)
        // Bentuk ulang "kirim-kirim" hanya untuk kata tunggal.
        .filter((form) => !(isPhrase && form.includes('-')))
        // "bayar2" hanya berlaku bila kata berakhir huruf (bukan "slot88").
        .filter((form) => !/\d2$/.test(form))
        // Imbuhan yang menempel jadi 3 huruf kembar ("installlah") dilipat normalisasi; bentuk ini tidak wajar.
        .filter((form) => !/(\p{L})\1\1/u.test(form))
        // Bentuk yang kebetulan sama dengan frasa aman ("kasihan") memang sengaja dikeluarkan.
        .filter((form) => findEntryMatches(form, SAFE_PHRASES).length === 0)
        .map((form) => entry.slice(0, token.start) + form + entry.slice(token.end));
      // Satu baris per bentuk; satu analyze per entri supaya cepat.
      const text = forms.join('\n');
      const hits = explain(text).hits.filter((hit) => hit.rule === rule.id);
      let offset = 0;
      for (const form of forms) {
        const lineStart = offset;
        const lineEnd = offset + form.length;
        offset = lineEnd + 1;
        checked += 1;
        if (!hits.some((hit) => hit.start >= lineStart && hit.end <= lineEnd)) failures.push(`${file}: "${form}"`);
      }
    }
  }
  assert.ok(checked > 10000, `baru ${checked} bentuk diperiksa`);
  assert.deepEqual(failures.slice(0, 30), [], `${failures.length} bentuk tidak terdeteksi`);
});

test('C. kata obrolan sehari-hari tidak memicu temuan', () => {
  const everyday = 'nyaman nonton nasi ngobrol ngopi nyata ngantuk nyanyi nulis ngerjain nunggu nanya nyari makan malam mulai';
  for (const word of everyday.split(' ')) assert.equal(analyze(word).findings.length, 0, word);
  assert.equal(analyze(everyday).findings.length, 0);
});

// ---------------------------------------------------------------------------
// D. Normalisasi dan keutuhan segmen.

test('D. nominal dan nomor rekening tetap terbaca utuh di sorotan', () => {
  const text = 'Gaji $2000 per jam, untung 30% per minggu, biaya pelatihan Rp150.000, norek 04232346';
  const marks = highlighted(analyze(text));
  assert.ok(marks.includes('$2000 per jam'), marks.join(' | '));
  assert.ok(marks.some((mark) => mark.includes('30% per minggu')), marks.join(' | '));
  assert.ok(marks.includes('biaya pelatihan Rp150.000'), marks.join(' | '));
  assert.ok(marks.includes('norek 04232346'), marks.join(' | '));
});

test('D. segmen digabung = teks asli untuk emoji, baris baru, tab, karakter lebar-nol', () => {
  const samples = [
    'Halo 😀\nBuruan TF dulu 🙏\n\nke bit.ly/abc 🎁 ya',
    'de​posit\tsekarang\r\nya 👍🏽',
    'ᴅ ᴇ ᴘ ᴏ s ɪ ᴛ dulu‼️ 👨‍👩‍👧',
    'Ｔｒａｎｓｆｅｒ dulu ke ＢＣＡ\n\t‍',
    'İstanbul ß ﬁle 💸💸💸 depositttt',
  ];
  for (const text of samples) assert.equal(joined(analyze(text)), text);
});

test('D. biaya dalam mata uang asing tetap dikenali sebelum dan sesudah nominal', () => {
  const examples = [
    'Biaya pelatihan EUR 250',
    'Biaya pelatihan 250 SGD',
    'Biaya pelatihan £250',
    'Biaya pelatihan US$250',
    'Biaya pelatihan 250 euros',
    'Biaya bea cukai 100 MYR',
    'Biaya bea cukai SEK 100',
    'Biaya clearance paket yen 50000',
  ];
  for (const text of examples) {
    const result = analyze(text);
    assert.ok(ruleIds(result).includes('uang-di-muka'), text);
    assert.ok(highlighted(result).some((mark) => mark === text), `${text}: ${highlighted(result).join(' | ')}`);
  }
});

test('D. imbuhan pada kata bahaya tetap dikenali dalam pesan utuh', () => {
  const paymentText = 'Kamu wajib membayar dulu.';
  const paymentResult = analyze(paymentText);
  assert.ok(ruleIds(paymentResult).includes('uang-di-muka'));
  assert.ok(highlighted(paymentResult).some((mark) => mark.includes('membayar')));
  assert.equal(joined(paymentResult), paymentText);

  const transferText = 'Dana ditransferkan ke rekening pribadi.';
  const transferResult = analyze(transferText);
  assert.ok(ruleIds(transferResult).includes('rekening-pribadi'));
  assert.ok(highlighted(transferResult).some((mark) => mark.includes('ditransferkan ke rekening pribadi')));
  assert.equal(joined(transferResult), transferText);
});

// ---------------------------------------------------------------------------
// E. Negatif: tidak boleh Tinggi; yang jelas aman harus Rendah tanpa temuan.

test('E. kalimat sehari-hari yang mirip kata bahaya tetap Rendah tanpa temuan', () => {
  const safe = [
    'Saya mau buka deposito di bank',
    'Dia mendaftar kuliah di universitas negeri',
    'Ibu membayar listrik lewat aplikasi',
    'Pembayaran SPP sudah lunas',
    'Tolong kirim tugas kuliah ke emailku',
    'Transfer pemain bola ramai banget',
    'Kasihan sekali dia',
    'Filmnya menarik banget',
  ];
  for (const text of safe) {
    const result = analyze(text);
    assert.equal(result.level, 'rendah', text);
    assert.equal(result.findings.length, 0, `${text}: ${ruleIds(result).join(', ')}`);
  }
});

// ---------------------------------------------------------------------------
// F. Ambigu dan konteks peringatan.

test('F. kata ambigu butuh jangkar di kalimat yang sama', () => {
  assert.equal(analyze('tolong kirim').level, 'rendah');
  const withAnchor = analyze('tolong kirim ke rekening BCA 12345');
  assert.notEqual(withAnchor.level, 'rendah');
  assert.ok(ruleIds(withAnchor).includes('rekening-pribadi'));
  // Jangkar di kalimat lain tidak dihitung.
  assert.equal(analyze('Tolong kirim ya.\nRekening BCA ada di dompet.').findings.some((f) => f.matches.includes('kirim')), false);
});

test('F. kalimat peringatan/edukasi bukan Tinggi dan menampilkan catatan', () => {
  const warning = analyze('Jangan berikan kode OTP ke siapa pun');
  assert.notEqual(warning.level, 'tinggi');
  assert.equal(warning.warningContext, true);

  const bank = analyze('Kode OTP Anda 482913. JANGAN BERIKAN kode ini kepada siapa pun, termasuk petugas.');
  assert.notEqual(bank.level, 'tinggi');
  assert.equal(bank.warningContext, true);

  // "jangan lupa" bukan penanda peringatan.
  const notWarning = analyze('Jangan lupa kirim kode OTP ke saya sekarang');
  assert.equal(notWarning.level, 'tinggi');
  assert.equal(notWarning.warningContext, false);

  const scam = analyze('Kirim kode OTP sekarang, jangan bilang siapa-siapa');
  assert.equal(scam.level, 'tinggi');
  assert.equal(scam.warningContext, false);
});

test('F. level Tinggi: temuan kuat berbobot 3, atau skor >= 4 dari >= 2 aturan', () => {
  assert.equal(analyze('Transfer ke BCA ya').level, 'sedang'); // transfer biasa = lemah
  assert.equal(analyze('Transfer ke rekening pribadi saya ya').level, 'tinggi');
  assert.equal(analyze('Buruan transfer ke BCA sekarang juga, cuma hari ini saja').level, 'tinggi'); // 3 + 1
});

// ---------------------------------------------------------------------------
// G. Performa.

function timeOf(text) {
  const start = performance.now();
  analyze(text);
  return performance.now() - start;
}

test('G. 8.000 karakter < 150 ms; masukan patologis < 300 ms', () => {
  analyze('pemanasan'); // kompilasi daftar kata sekali
  const scam =
    'Selamat! Kamu terpilih sebagai admin online, gaji Rp8.000.000/bulan tanpa pengalaman. Transfer biaya pelatihan Rp150.000 hari ini saja, lalu kirim kode OTP. ';
  const long = scam.repeat(Math.ceil(8000 / scam.length)).slice(0, 8000);
  assert.ok(timeOf(long) < 150, '8.000 karakter terlalu lambat');
  for (const text of ['transfer '.repeat(2000), 'a '.repeat(5000), 'd'.repeat(10000)]) {
    assert.ok(timeOf(text) < 300, `terlalu lambat untuk ${text.slice(0, 12)}...`);
  }
});

// ---------------------------------------------------------------------------
// H. Audit daftar kata dan skrip explain.

test('H. npm run audit:words lulus', () => {
  const audit = spawnSync(process.execPath, ['scripts/audit-words.js'], { cwd: ROOT_DIR, encoding: 'utf8' });
  assert.equal(audit.status, 0, audit.stderr || audit.stdout);
});

test('H. npm run explain mencetak teks ternormalisasi dan kecocokan', () => {
  const run = spawnSync(process.execPath, ['scripts/explain.js', 'Tolong d3posit dulu'], { cwd: ROOT_DIR, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /tolong deposit dulu/);
  assert.match(run.stdout, /uang-di-muka/);
  assert.match(run.stdout, /\[\[d3posit dulu\]\]3/);
});
