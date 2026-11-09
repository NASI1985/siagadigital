import { test } from 'node:test';
import assert from 'node:assert/strict';
import { respond, detectIntent, greetingMessage, INITIAL_BOT_CONTEXT } from './chatbot.js';
import { QUICK_REPLIES } from '../data/chatbot.js';
import { INCIDENTS } from '../data/emergency.js';

const firstReply = (text, context) => respond(text, context).messages[0];
const actionTypes = (message) => message.actions.map((action) => action.type);

test('pesan kosong tidak dibalas', () => {
  assert.deepEqual(respond('   ').messages, []);
  assert.deepEqual(respond(undefined).messages, []);
});

test('sapaan awal punya tombol pertanyaan cepat', () => {
  const greeting = greetingMessage();
  assert.equal(greeting.actions.length, QUICK_REPLIES.length);
  assert.ok(greeting.actions.every((action) => action.type === 'send'));
});

test('kejadian darurat: langkah "Sekarang juga" + tombol ke Bantuan', () => {
  const otp = firstReply('bang aku udah kasih kode OTP ke orang, gimana?');
  assert.match(otp.text, /kode OTP terlanjur diberikan/);
  assert.deepEqual(otp.list.slice(0, 2), ['Ganti kata sandi akun terkait', 'Keluar dari semua perangkat']);
  assert.deepEqual(otp.actions[0], { type: 'emergency', label: 'Buka langkah lengkap', incidentId: 'otp' });

  assert.equal(firstReply('Aku udah transfer ke penipu').actions[0].incidentId, 'transfer');
  assert.equal(firstReply('akun IG ku dihack').actions[0].incidentId, 'akun-dibajak');
  assert.equal(firstReply('KTP ku kesebar di grup').actions[0].incidentId, 'data-bocor');
  assert.equal(firstReply('waduh kepencet link aneh').actions[0].incidentId, 'klik-link');
});

test('setiap label kejadian di wizard dikenali sebagai kejadian yang sama', () => {
  for (const incident of INCIDENTS) {
    const intent = detectIntent(incident.label);
    assert.equal(intent?.kind, 'emergency', incident.label);
    assert.equal(intent.incidentId, incident.id, incident.label);
  }
});

test('"kena tipu" tanpa detail -> bot menanyakan kejadiannya', () => {
  const message = firstReply('bang aku kena tipu');
  assert.equal(message.actions.length, INCIDENTS.length);
  assert.ok(message.actions.every((action) => action.type === 'send'));
});

test('kejadian darurat lebih diutamakan daripada sapaan dan lapor', () => {
  assert.equal(firstReply('halo min, aku udah transfer, lapor ke mana?').actions[0].type, 'emergency');
});

test('tanya ciri modus -> daftar tanda bahaya dari skenario + tombol latihan', () => {
  const message = firstReply('Apa ciri loker palsu?');
  assert.match(message.text, /loker palsu/);
  assert.ok(message.list.includes('Biaya di muka'));
  assert.ok(message.list.length > 0 && message.list.length <= 5);
  assert.deepEqual(message.actions[0], { type: 'navigate', label: 'Latih skenario ini', route: 'latih' });
  assert.match(firstReply('pinjol legal gimana cirinya').text, /pinjol ilegal/);
  assert.match(firstReply('ada yang ngaku kurir paket').text, /paket kurir palsu/);
});

test('lapor -> tiga kanal resmi dengan tautan', () => {
  const message = firstReply('Lapor ke mana?');
  assert.equal(message.list.length, 3);
  assert.ok(message.actions.some((action) => action.type === 'link' && action.href === 'tel:157'));
});

test('cek pesan: minta pesan dulu, lalu pesan berikutnya dianalisis', () => {
  const ask = respond('Cek pesan', INITIAL_BOT_CONTEXT);
  assert.equal(ask.context.awaitingCheck, true);
  const result = respond('transfer dulu ya ke BCA 123', ask.context);
  assert.match(result.messages[0].text, /^Kewaspadaan: Tinggi/);
  assert.equal(result.context.awaitingCheck, false);
});

test('awalan "cek:" langsung menganalisis', () => {
  const message = firstReply(
    'cek: Selamat! Kamu terpilih sebagai admin online, gaji Rp8.000.000/bulan tanpa pengalaman. Transfer biaya pelatihan Rp150.000 hari ini saja, lalu kirim kode OTP untuk verifikasi.',
  );
  assert.match(message.text, /^Kewaspadaan: Tinggi/);
  assert.equal(message.list[0], 'Pola khas loker palsu.');
  assert.ok(message.list.length <= 5);
  assert.ok(actionTypes(message).includes('navigate'));
  assert.equal(respond('cek:').context.awaitingCheck, true);
});

test('pesan penipu yang ditempel tidak dianggap "sudah kasih OTP"', () => {
  const message = firstReply('Kak, kasih kode OTP-nya ya biar hadiahnya cepat dikirim. Buruan!');
  assert.match(message.text, /^Kewaspadaan/);
});

test('pesan panjang atau berisi tautan langsung dicek', () => {
  assert.match(firstReply('Klaim hadiahmu di bit.ly/hadiah-fiktif').text, /^Kewaspadaan/);
  assert.match(firstReply('Halo, besok kita makan siang jam 12 ya. '.repeat(4)).text, /^Kewaspadaan: Rendah/);
});

test('basa-basi dan tidak paham', () => {
  assert.match(firstReply('makasih bang').text, /Sama-sama/);
  assert.match(firstReply('kamu bisa apa?').text, /bantu tiga hal/);
  assert.match(firstReply('halo').text, /Aku SiagaBot/);
  const fallback = firstReply('resep nasi goreng');
  assert.match(fallback.text, /belum paham/);
  assert.equal(fallback.actions.length, QUICK_REPLIES.length);
});

test('semua tombol pertanyaan cepat menghasilkan jawaban yang bukan "tidak paham"', () => {
  for (const quick of QUICK_REPLIES) {
    assert.doesNotMatch(firstReply(quick.message).text, /belum paham/, quick.label);
  }
});
