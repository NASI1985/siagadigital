import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rootCandidates, findRoot, findRootHits, inflect, tokenize } from './affix.js';
import { DANGER_WORDS } from '../data/words/index.js';

test('rootCandidates: tolok ukur bentuk baku dan gaul kembali ke kata dasarnya', () => {
  const cases = {
    mengirimkannya: 'kirim',
    dibayarkan: 'bayar',
    pembayaran: 'bayar',
    penyetoran: 'setor',
    mensetor: 'setor',
    memverifikasi: 'verifikasi',
    pengunduhan: 'unduh',
    menginstalkan: 'instal',
    memenangkan: 'menang',
    merahasiakan: 'rahasia',
    berinvestasi: 'investasi',
    peminjaman: 'pinjam',
    penipuan: 'tipu',
    ngirim: 'kirim',
    nyetorin: 'setor',
    bayarin: 'bayar',
    ditransferin: 'transfer',
    ngetransfer: 'transfer',
    narik: 'tarik',
    maksa: 'paksa',
    nipu: 'tipu',
    mendeposit: 'deposit',
    mentransfer: 'transfer',
    membayar: 'bayar',
    menarik: 'tarik',
    akunmu: 'akun',
    bayar2: 'bayar',
    menyebarkannya: 'sebar',
    diperjualbelikan: 'jualbeli',
    memperjualbelikan: 'jualbeli',
  };
  for (const [word, root] of Object.entries(cases)) {
    assert.ok(rootCandidates(word).includes(root), `${word} -> ${root} (dapat: ${rootCandidates(word).join(', ')})`);
  }
});

test('rootCandidates: kandidat minimal 4 huruf, kata asli di urutan pertama', () => {
  const candidates = rootCandidates('mengirimkannya');
  assert.equal(candidates[0], 'mengirimkannya');
  assert.ok(candidates.every((candidate) => candidate.length >= 4));
  assert.deepEqual(rootCandidates('tf'), []);
});

test('findRoot dan findRootHits: tanda hubung memisahkan token, posisi tepat', () => {
  const roots = new Set(['kirim', 'transfer', 'bayar']);
  assert.equal(findRoot('dikirimin', roots), 'kirim');
  assert.equal(findRoot('makan', roots), null);
  const hits = findRootHits('Aku kirim-kirim dulu, nanti nge-transfer', roots);
  assert.deepEqual(
    hits.map((hit) => [hit.text, hit.root, hit.start, hit.end]),
    [
      ['kirim', 'kirim', 4, 9],
      ['kirim', 'kirim', 10, 15],
      ['transfer', 'transfer', 32, 40],
    ],
  );
  assert.deepEqual(tokenize('a-b c').map((token) => token.text), ['a', 'b', 'c']);
});

test('inflect: >= 30 bentuk per kata dasar dan semuanya kembali ke kata dasar', () => {
  for (const root of ['kirim', 'setor', 'transfer', 'bayar', 'tarik', 'paksa', 'deposit', 'ancam', 'klik', 'unduh']) {
    const forms = inflect(root);
    assert.ok(forms.length >= 30, `${root}: ${forms.length} bentuk`);
    for (const form of forms) {
      const ok = findRootHits(form, new Set([root])).length > 0;
      assert.ok(ok, `${form} harus kembali ke ${root}`);
    }
  }
});

test('6C gaul wajib dikenali', () => {
  const roots = new Set(['kirim', 'setor', 'bayar', 'transfer', 'tarik', 'paksa', 'tipu', 'ancam', 'sebar', 'janji']);
  const expected = {
    ngirim: 'kirim',
    ngirimin: 'kirim',
    dikirimin: 'kirim',
    nyetor: 'setor',
    disetorin: 'setor',
    bayarin: 'bayar',
    dibayarin: 'bayar',
    transferin: 'transfer',
    ditransferin: 'transfer',
    ngetransfer: 'transfer',
    narik: 'tarik',
    maksa: 'paksa',
    nipu: 'tipu',
    ngancam: 'ancam',
    nyebar: 'sebar',
    dijanjiin: 'janji',
    bayar2: 'bayar',
  };
  for (const [word, root] of Object.entries(expected)) assert.equal(findRoot(word, roots), root, word);
  assert.deepEqual(findRootHits('kirim-kirim', roots).map((hit) => hit.root), ['kirim', 'kirim']);
  assert.deepEqual(findRootHits('nge-transfer', roots).map((hit) => hit.root), ['transfer']);
});

test('6C kata obrolan biasa tidak boleh kembali ke kata dasar mana pun di daftar', () => {
  const rootSet = new Set();
  for (const rule of DANGER_WORDS) {
    for (const entry of [...(rule.words ?? []), ...(rule.ambiguous ?? [])]) {
      if (tokenize(entry).length === 1 && entry.length >= 4) rootSet.add(entry);
    }
  }
  const everyday = ['nyaman', 'nonton', 'nasi', 'ngobrol', 'ngopi', 'nyata', 'ngantuk', 'nyanyi', 'nulis', 'ngerjain', 'nunggu', 'nanya', 'nyari', 'makan', 'malam', 'mulai'];
  for (const word of everyday) assert.equal(findRoot(word, rootSet), null, word);
});
