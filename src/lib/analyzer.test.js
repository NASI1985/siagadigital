import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, describeFinding } from './analyzer.js';
import { kata, pola, findMatches, ensureGlobal } from './patterns.js';
import { CHECK_CATEGORIES } from '../data/checkInput.js';

const ruleIds = (result) => result.findings.map((finding) => finding.rule.id);
const comboIds = (result) => result.combos.map((combo) => combo.id);
const joined = (result) => result.segments.map((segment) => segment.text).join('');

const TEXT_A =
  'selamat anda mendapatkan peluang untuk mendapatkan pekerjaan terbaik di amerika dengan pembayaran seharga $2000 per jam, untuk mengikuti kami membutuhkan pembayaran untuk proses pendaftaran agar lancar dan sentosa. bisa tf langsung dari bsi a.n. andina dengan norek 04232346';

const TEXT_B =
  'Selamat! Kamu terpilih sebagai admin online, gaji Rp8.000.000/bulan tanpa pengalaman. Transfer biaya pelatihan Rp150.000 hari ini saja, lalu kirim kode OTP untuk verifikasi.';

test('A. loker luar negeri terdeteksi tinggi dengan combo loker-palsu', () => {
  const result = analyze(TEXT_A);
  assert.equal(result.level, 'tinggi');
  for (const id of ['uang-di-muka', 'rekening-pribadi', 'imbalan-tidak-wajar', 'luar-negeri']) {
    assert.ok(ruleIds(result).includes(id), `aturan ${id} harus ditemukan`);
  }
  assert.ok(comboIds(result).includes('loker-palsu'));
});

test('B. contoh Cek Dulu: temuan wajib dan sorotan dengan bobot yang benar', () => {
  const result = analyze(TEXT_B);
  assert.equal(result.level, 'tinggi');
  for (const id of ['uang-di-muka', 'kode-rahasia', 'imbalan-tidak-wajar', 'tekanan-waktu']) {
    assert.ok(ruleIds(result).includes(id), `aturan ${id} harus ditemukan`);
  }
  const weightOf = (phrase) => result.segments.find((segment) => segment.text === phrase)?.weight;
  assert.equal(weightOf('biaya pelatihan Rp150.000'), 3);
  assert.equal(weightOf('kirim kode OTP'), 3);
  for (const yellow of ['terpilih sebagai admin online', 'Rp8.000.000/bulan tanpa pengalaman', 'hari ini saja']) {
    assert.ok([1, 2].includes(weightOf(yellow)), `"${yellow}" harus sorotan kuning`);
  }
  assert.equal(joined(result), TEXT_B);
});

test('B. alasan tekanan waktu memakai kutipan dari frasa yang ditemukan', () => {
  const finding = analyze(TEXT_B).findings.find((item) => item.rule.id === 'tekanan-waktu');
  assert.equal(describeFinding(finding), '“Hari ini saja” dipakai agar kamu tidak sempat berpikir.');
});

test('C. pesan biasa menghasilkan rendah tanpa temuan', () => {
  const result = analyze('Halo, besok kita makan siang jam 12 ya.');
  assert.equal(result.level, 'rendah');
  assert.equal(result.findings.length, 0);
  assert.equal(result.score, 0);
});

test('D. segmen digabung selalu sama dengan teks asli', () => {
  const samples = ['', 'Halo, apa kabar?', TEXT_A, TEXT_B, 'Halo 😀\nBuruan TF dulu 🙏\n\nke bit.ly/abc 🎁 ya'];
  for (const text of samples) {
    assert.equal(joined(analyze(text)), text);
  }
  assert.deepEqual(analyze('').segments, []);
});

test('E. tidak peka huruf besar-kecil', () => {
  const transfer = analyze('TF DULU ya ke BCA 123');
  assert.ok(ruleIds(transfer).includes('uang-di-muka'));
  assert.ok(ruleIds(transfer).includes('rekening-pribadi'));
  assert.ok(ruleIds(analyze('Klik bit.ly/hadiah')).includes('tautan'));
});

test('skor dan level: satu aturan dihitung sekali', () => {
  const result = analyze('Buruan, segera, hangus!');
  assert.equal(result.findings.length, 1);
  assert.equal(result.score, 1);
  assert.equal(result.level, 'sedang');
  assert.ok(result.findings[0].matches.length <= 3);
});

test('combo lain terdeteksi', () => {
  assert.ok(comboIds(analyze('Selamat kamu menang! Klaim di https://contoh.test/hadiah')).includes('phishing-hadiah'));
  assert.ok(comboIds(analyze('Pasti untung 30% per minggu, buruan gabung!')).includes('investasi-bodong'));
});

test('kata(): batas kata, spasi fleksibel, tanpa lookbehind', () => {
  const regex = kata('otp', 'kode otp');
  assert.ok(!regex.source.includes('(?<'), 'tidak boleh memakai lookbehind');
  assert.deepEqual(findMatches(regex, 'kirim KODE   OTP'), [{ start: 6, end: 16, text: 'KODE   OTP' }]);
  assert.equal(findMatches(regex, 'botpx').length, 0);
  assert.equal(findMatches(regex, 'otp.').length, 1);
});

test('ensureGlobal menambahkan flag g', () => {
  assert.ok(ensureGlobal(/abc/i).flags.includes('g'));
  assert.equal(findMatches(/abc/i, 'ABC abc').length, 2);
  assert.equal(findMatches(pola(String.raw`\d+\s?%`), 'untung 30%').length, 1);
});

test('setiap contoh fiktif Cek Dulu terdeteksi minimal sedang', () => {
  for (const category of CHECK_CATEGORIES) {
    assert.notEqual(analyze(category.example).level, 'rendah', category.id);
  }
});
