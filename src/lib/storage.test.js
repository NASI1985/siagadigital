import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStored, readStored, writeStored, isScoreMap, isCheckedMap } from './storage.js';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = value;
    },
    data,
  };
}

const blockedStorage = {
  getItem() {
    throw new Error('SecurityError');
  },
  setItem() {
    throw new Error('QuotaExceededError');
  },
};

test('JSON tidak valid -> nilai default', () => {
  assert.deepEqual(parseStored('{rusak', isScoreMap, {}), {});
  assert.deepEqual(parseStored('undefined', isCheckedMap, {}), {});
});

test('bentuk data salah -> nilai default', () => {
  assert.deepEqual(parseStored('[1,2,3]', isScoreMap, {}), {});
  assert.deepEqual(parseStored('{"loker":"80"}', isScoreMap, {}), {});
  assert.deepEqual(parseStored('{"loker":250}', isScoreMap, {}), {});
  assert.deepEqual(parseStored('null', isScoreMap, {}), {});
  assert.deepEqual(parseStored('{"2fa":"ya"}', isCheckedMap, {}), {});
});

test('data valid dibaca apa adanya', () => {
  assert.deepEqual(parseStored('{"loker-palsu":80}', isScoreMap, {}), { 'loker-palsu': 80 });
  assert.deepEqual(parseStored('{"2fa":true}', isCheckedMap, {}), { '2fa': true });
});

test('storage diblokir atau tidak ada -> default tanpa crash', () => {
  assert.deepEqual(readStored('kunci', isScoreMap, {}, blockedStorage), {});
  assert.equal(writeStored('kunci', { a: 1 }, blockedStorage), false);
  assert.deepEqual(readStored('kunci', isScoreMap, {}, null), {});
});

test('tulis lalu baca kembali', () => {
  const storage = memoryStorage({ rusak: '{oops' });
  assert.deepEqual(readStored('rusak', isScoreMap, { awal: 0 }, storage), { awal: 0 });
  assert.equal(writeStored('skor', { loker: 100 }, storage), true);
  assert.deepEqual(readStored('skor', isScoreMap, {}, storage), { loker: 100 });
});
