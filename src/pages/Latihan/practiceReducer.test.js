import { test } from 'node:test';
import assert from 'node:assert/strict';
import { practiceReducer, initialPracticeState, getSafeCount, getScore, getMissedFlags } from './practiceReducer.js';

// Skenario palsu kecil supaya test tidak bergantung pada isi data.
const step = (label) => ({
  messages: [`pesan ${label}`],
  options: [
    { text: 'aman', reply: 'aman', safe: true },
    { text: 'berisiko', reply: 'berisiko', safe: false },
  ],
  explanation: 'ok',
  riskyExplanation: 'bahaya',
  missedFlags: [{ title: `Tanda ${label}`, detail: 'detail' }],
  scammerReply: 'balasan penipu',
});
const SCENARIO = { id: 'uji', title: 'Uji', badge: 'Anti-Uji', steps: [step('a'), step('b'), step('c')] };

const run = (actions, state = initialPracticeState) => actions.reduce(practiceReducer, state);
const SAFE = 0;
const RISKY = 1;

test('start membuka chat di langkah pertama', () => {
  const state = run([{ type: 'start', scenario: SCENARIO }]);
  assert.equal(state.view, 'chat');
  assert.equal(state.stepIndex, 0);
  assert.equal(state.picked, null);
  assert.deepEqual(state.answers, []);
});

test('pick mencatat jawaban; pick kedua di langkah yang sama diabaikan', () => {
  const state = run([
    { type: 'start', scenario: SCENARIO },
    { type: 'pick', optionIndex: SAFE },
    { type: 'pick', optionIndex: RISKY },
  ]);
  assert.equal(state.picked, SAFE);
  assert.equal(state.answers.length, 1);
  assert.equal(state.endedByRisk, false);
});

test('pick dengan indeks tidak ada atau di luar chat diabaikan', () => {
  const started = run([{ type: 'start', scenario: SCENARIO }]);
  assert.equal(practiceReducer(started, { type: 'pick', optionIndex: 9 }), started);
  assert.equal(practiceReducer(initialPracticeState, { type: 'pick', optionIndex: 0 }), initialPracticeState);
});

test('next butuh pilihan dulu, lalu maju ke langkah berikutnya', () => {
  const started = run([{ type: 'start', scenario: SCENARIO }]);
  assert.equal(practiceReducer(started, { type: 'next' }), started);
  const moved = run([{ type: 'pick', optionIndex: SAFE }, { type: 'next' }], started);
  assert.equal(moved.stepIndex, 1);
  assert.equal(moved.picked, null);
});

test('next di langkah terakhir membuka hasil dengan skor 100', () => {
  const state = run([
    { type: 'start', scenario: SCENARIO },
    { type: 'pick', optionIndex: SAFE },
    { type: 'next' },
    { type: 'pick', optionIndex: SAFE },
    { type: 'next' },
    { type: 'pick', optionIndex: SAFE },
    { type: 'next' },
  ]);
  assert.equal(state.view, 'result');
  assert.equal(getSafeCount(state), 3);
  assert.equal(getScore(state), 100);
  assert.deepEqual(getMissedFlags(state), []);
});

test('pilihan berisiko mengakhiri putaran; langkah sisa dihitung tidak aman', () => {
  const risky = run([
    { type: 'start', scenario: SCENARIO },
    { type: 'pick', optionIndex: SAFE },
    { type: 'next' },
    { type: 'pick', optionIndex: RISKY },
  ]);
  assert.equal(risky.endedByRisk, true);
  // next diblokir setelah pilihan berisiko
  assert.equal(practiceReducer(risky, { type: 'next' }), risky);
  const finished = practiceReducer(risky, { type: 'finish' });
  assert.equal(finished.view, 'result');
  assert.equal(getScore(finished), 33);
  assert.deepEqual(getMissedFlags(finished).map((flag) => flag.title), ['Tanda b']);
});

test('finish ditolak kalau putaran belum selesai', () => {
  const state = run([{ type: 'start', scenario: SCENARIO }, { type: 'pick', optionIndex: SAFE }]);
  assert.equal(practiceReducer(state, { type: 'finish' }), state);
});

test('retry mengulang skenario yang sama dari awal', () => {
  const state = run([
    { type: 'start', scenario: SCENARIO },
    { type: 'pick', optionIndex: RISKY },
    { type: 'retry' },
  ]);
  assert.equal(state.view, 'chat');
  assert.equal(state.scenario, SCENARIO);
  assert.equal(state.endedByRisk, false);
  assert.deepEqual(state.answers, []);
});

test('exit kembali ke daftar', () => {
  const state = run([{ type: 'start', scenario: SCENARIO }, { type: 'exit' }]);
  assert.deepEqual(state, initialPracticeState);
});

test('aksi tak dikenal tidak mengubah state', () => {
  assert.equal(practiceReducer(initialPracticeState, { type: 'tidak-ada' }), initialPracticeState);
});
