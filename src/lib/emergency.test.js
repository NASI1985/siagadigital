import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildActionPlan, buildWarningMessage, fillTemplate, whatsappShareUrl } from './emergency.js';
import { INCIDENTS, PLATFORMS, WARNING_TONES, TRANSFER_INCIDENT_ID } from '../data/emergency.js';

test('rencana aksi menggabungkan langkah kejadian dan platform', () => {
  const plan = buildActionPlan('otp', 'whatsapp');
  assert.equal(plan.title, 'kode OTP terlanjur diberikan');
  assert.deepEqual(plan.now.slice(0, 3), [
    'Ganti kata sandi akun terkait',
    'Keluar dari semua perangkat',
    'Telepon call center resmi bank',
  ]);
  assert.equal(plan.now.length, 4);
  assert.equal(buildActionPlan('otp', null), null);
  assert.equal(buildActionPlan('tidak-ada', 'whatsapp'), null);
});

test('setiap kombinasi kejadian x platform punya rencana', () => {
  for (const incident of INCIDENTS) {
    for (const platform of PLATFORMS) {
      const plan = buildActionPlan(incident.id, platform.id);
      assert.ok(plan.now.length > 0 && plan.today.length > 0);
    }
  }
});

test('pesan peringatan nada Santai untuk kejadian OTP sesuai screenshot', () => {
  assert.equal(
    buildWarningMessage('santai', 'otp'),
    'Hati-hati, lagi marak loker palsu bermodus biaya pelatihan. Ciri-cirinya: gaji tinggi tanpa syarat, minta transfer duluan, dan memaksa cepat. Jangan kasih OTP ke siapa pun!',
  );
  for (const tone of WARNING_TONES) {
    assert.ok(!buildWarningMessage(tone.id, 'otp').includes('{topic}'));
  }
});

test('helper template dan tautan WhatsApp', () => {
  assert.equal(fillTemplate('a {topic} b {topic}', 'x'), 'a x b x');
  assert.equal(whatsappShareUrl('Halo & OTP!'), 'https://wa.me/?text=Halo%20%26%20OTP!');
  assert.ok(INCIDENTS.some((incident) => incident.id === TRANSFER_INCIDENT_ID));
});
