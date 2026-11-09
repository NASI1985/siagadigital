import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readinessPercent, nextStepSentence, toggleChecked, uncheckedItems } from './checklist.js';
import { SECURITY_CHECKLIST } from '../data/securityChecklist.js';

const firstThreeChecked = Object.fromEntries(SECURITY_CHECKLIST.slice(0, 3).map((item) => [item.id, true]));

test('data checklist: id unik dan semua field terisi', () => {
  const ids = new Set(SECURITY_CHECKLIST.map((item) => item.id));
  assert.equal(ids.size, SECURITY_CHECKLIST.length);
  for (const item of SECURITY_CHECKLIST) {
    assert.ok(item.label && item.nextStep && item.howTo, item.id);
    assert.equal(item.nextStep, item.nextStep.toLowerCase().replace('hp', 'HP'));
  }
});

test('contoh screenshot: 3 dari 6 tercentang = 50%, dua langkah berikutnya digabung', () => {
  assert.equal(readinessPercent(SECURITY_CHECKLIST, firstThreeChecked), 50);
  assert.equal(nextStepSentence(SECURITY_CHECKLIST, firstThreeChecked), 'kunci profil dan tinjau izin aplikasi.');
});

test('tinggal satu item -> satu frasa; semua selesai -> 100% tanpa kalimat', () => {
  const allButLast = Object.fromEntries(SECURITY_CHECKLIST.slice(0, -1).map((item) => [item.id, true]));
  assert.equal(nextStepSentence(SECURITY_CHECKLIST, allButLast), 'keluarkan perangkat tak dikenal.');
  const all = Object.fromEntries(SECURITY_CHECKLIST.map((item) => [item.id, true]));
  assert.equal(readinessPercent(SECURITY_CHECKLIST, all), 100);
  assert.equal(nextStepSentence(SECURITY_CHECKLIST, all), '');
  assert.equal(uncheckedItems(SECURITY_CHECKLIST, all).length, 0);
});

test('toggle menambah dan menghapus centang', () => {
  const once = toggleChecked({}, 'a');
  assert.deepEqual(once, { a: true });
  assert.deepEqual(toggleChecked(once, 'a'), {});
  assert.equal(readinessPercent([], {}), 0);
});
