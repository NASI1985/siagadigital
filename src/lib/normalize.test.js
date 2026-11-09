import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from './normalize.js';

const norm = (text) => normalize(text).normalized;

test('penyamaran diubah menjadi kata biasa', () => {
  assert.equal(norm('D E P O S I T'), 'deposit');
  assert.equal(norm('d.e.p.o.s.i.t'), 'deposit');
  assert.equal(norm('d3posit'), 'deposit');
  assert.equal(norm('dep0s1t'), 'deposit');
  assert.equal(norm('depositttt'), 'deposit');
  assert.equal(norm('de-posit'), 'deposit');
  assert.equal(norm('nge-transfer'), 'ngetransfer');
  assert.equal(norm('ᴅeposit'), 'deposit');
  assert.equal(norm('dеposit'), 'deposit'); // е Kiril
  assert.equal(norm('ＤＥＰＯＳＩＴ'), 'deposit'); // fullwidth
  assert.equal(norm('dep​osit'), 'deposit');
  assert.equal(norm('trânsfér'), 'transfer');
  assert.equal(norm('tr@nsfer'), 'transfer');
});

test('angka murni dan nominal tidak berubah', () => {
  assert.equal(norm('Rp150.000'), 'rp150.000');
  assert.equal(norm('$2000 per jam'), '$2000 per jam');
  assert.equal(norm('30%'), '30%');
  assert.equal(norm('norek 04232346'), 'norek 04232346');
  assert.equal(norm('Rp5k'), 'rp5k');
  assert.equal(norm('1000000'), '1000000');
});

test('kata biasa dengan huruf ganda, tanda hubung panjang, dan singkatan tetap', () => {
  assert.equal(norm('kirim-kirim'), 'kirim-kirim');
  assert.equal(norm('maaf saat'), 'maaf saat');
  assert.equal(norm('pppk'), 'pppk');
  assert.equal(norm('a.n. andina'), 'a.n. andina');
});

test('peta posisi menunjuk ke teks asli', () => {
  const text = 'Tolong D E P O S I T 😀 sekarang';
  const { normalized, map, mapEnd } = normalize(text);
  const start = normalized.indexOf('deposit');
  assert.equal(text.slice(map[start], mapEnd[start + 'deposit'.length - 1]), 'D E P O S I T');
  assert.equal(map.length, normalized.length);
  assert.equal(mapEnd.length, normalized.length);
});
