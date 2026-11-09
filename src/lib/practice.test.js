import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeScore,
  scoreLevel,
  earnsBadge,
  countBadges,
  playerLevel,
  badgesToGuardian,
  guardianLabel,
  mergeBestScore,
  countCompleted,
  buildChatLog,
  validateScenario,
} from './practice.js';
import { SCENARIOS } from '../data/scenarios.js';

const EXPECTED_SCENARIO_COUNT = 6;
const EXPECTED_STEP_COUNT = 5;

test('struktur data: 6 skenario x 5 langkah, 2-3 opsi, minimal 1 aman dan 1 berisiko', () => {
  assert.equal(SCENARIOS.length, EXPECTED_SCENARIO_COUNT);
  const ids = new Set(SCENARIOS.map((scenario) => scenario.id));
  assert.equal(ids.size, SCENARIOS.length, 'id skenario harus unik');
  for (const scenario of SCENARIOS) {
    assert.equal(scenario.steps.length, EXPECTED_STEP_COUNT, scenario.id);
    assert.deepEqual(validateScenario(scenario), [], scenario.id);
  }
});

test('langkah 1 Loker Palsu memakai teks screenshot', () => {
  const firstStep = SCENARIOS[0].steps[0];
  assert.equal(SCENARIOS[0].sender, 'HRD_Karir');
  assert.equal(firstStep.messages[1], 'Slot tinggal 2 orang, bayar hari ini ya!');
  assert.deepEqual(
    firstStep.options.map((option) => option.text),
    ['Transfer biar dapat slot', 'Minta alamat kantor dan cek di situs resmi', 'Blokir dan laporkan'],
  );
  assert.equal(firstStep.scammerReply, 'Sudah masuk! Sekarang kirim kode OTP untuk aktivasi akun pelatihan.');
});

test('skor dibulatkan dari jumlah langkah', () => {
  assert.equal(computeScore(4, 5), 80);
  assert.equal(computeScore(2, 3), 67);
  assert.equal(computeScore(0, 0), 0);
});

test('level skenario dan lencana', () => {
  assert.equal(scoreLevel(100), 'Siaga');
  assert.equal(scoreLevel(80), 'Waspada');
  assert.equal(scoreLevel(60), 'Waspada');
  assert.equal(scoreLevel(59), 'Rawan');
  assert.equal(earnsBadge(60), true);
  assert.equal(earnsBadge(40), false);
});

test('level pemain dan sisa lencana Guardian', () => {
  assert.equal(playerLevel(0), 'Pemula');
  assert.equal(playerLevel(1), 'Pemula');
  assert.equal(playerLevel(2), 'Siaga');
  assert.equal(playerLevel(3), 'Guardian');
  assert.equal(badgesToGuardian(1), 2);
  assert.equal(badgesToGuardian(5), 0);
  assert.equal(guardianLabel(1), 'Guardian: 2 lencana lagi');
  assert.equal(guardianLabel(3), 'Level Guardian tercapai');
  assert.equal(countBadges({ a: 80, b: 40, c: 100 }), 2);
});

test('yang disimpan skor terbaik', () => {
  assert.deepEqual(mergeBestScore({}, 'a', 40), { a: 40 });
  assert.deepEqual(mergeBestScore({ a: 80 }, 'a', 40), { a: 80 });
  assert.deepEqual(mergeBestScore({ a: 40 }, 'a', 100), { a: 100 });
  assert.equal(countCompleted({ 'loker-palsu': 80, lain: 20 }, SCENARIOS), 1);
});

test('log chat: balasan pemain, balasan penipu saat berisiko, nama pengirim hanya di gelembung pertama', () => {
  const scenario = SCENARIOS[0];
  const safeLog = buildChatLog(scenario, [{ stepIndex: 0, optionIndex: 1, safe: true }], 0);
  assert.deepEqual(
    safeLog.map((entry) => entry.from),
    ['scammer', 'scammer', 'player'],
  );
  assert.equal(safeLog[2].text, 'Ini perusahaan apa ya?');
  assert.equal(safeLog.filter((entry) => entry.showSender).length, 1);

  const riskyLog = buildChatLog(scenario, [{ stepIndex: 0, optionIndex: 0, safe: false }], 0);
  assert.equal(riskyLog.at(-2).text, 'Oke, saya transfer sekarang.');
  assert.equal(riskyLog.at(-1).text, scenario.steps[0].scammerReply);
});
