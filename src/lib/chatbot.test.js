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

// ---------- Percakapan interaktif ----------

import { normalize, classifyAnswer } from './chatbot.js';
import { INTERVIEWS } from '../data/chatbot.js';

// Kirim beberapa pesan berurutan, kembalikan semua balasan + konteks akhir.
function converse(...texts) {
  let context = INITIAL_BOT_CONTEXT;
  const replies = [];
  for (const text of texts) {
    const result = respond(text, context);
    replies.push(result.messages);
    context = result.context;
  }
  return { replies, context, last: replies.at(-1).at(-1) };
}

test('bahasa gaul dan salah ketik dirapikan', () => {
  assert.equal(normalize('gw udh tf'), 'aku udah transfer');
  assert.equal(normalize('akunku dibjak'), 'akunku dibajak');
  assert.equal(normalize('tolonggg aku trasnfer'), 'tolong aku transfer');
  assert.equal(normalize('aku lapar'), 'aku lapar');
  for (const word of ['diajak', 'terserah', 'tersebut', 'tertidur', 'rekeningku', 'installer']) {
    assert.equal(normalize(word), word, word);
  }
  assert.equal(firstReply('gw udh tf 500rb ke dia').actions[0].incidentId, 'transfer');
  assert.equal(firstReply('ig gw kebajak').actions[0].incidentId, 'akun-dibajak');
  assert.equal(firstReply('akunku dibjak orang').actions[0].incidentId, 'akun-dibajak');
});

test('kalimat menyangkal tidak dianggap kejadian', () => {
  assert.notEqual(detectIntent('gimana biar akun nggak dibajak?')?.kind, 'emergency');
  assert.notEqual(detectIntent('jangan sampai akunku dibajak')?.kind, 'emergency');
  assert.match(firstReply('gimana biar akun gak dibajak?').text, /lebih aman/);
  // Akun teman yang dibajak = modus teman dibajak, bukan akun sendiri.
  assert.equal(detectIntent('akun temenku dibajak terus minta pinjem duit').scenarioId, 'teman-dibajak');
});

test('jawaban iya / nggak / nggak tahu dikenali', () => {
  assert.equal(classifyAnswer('iyaa'), 'yes');
  assert.equal(classifyAnswer('udah'), 'yes');
  assert.equal(classifyAnswer('gak'), 'no');
  assert.equal(classifyAnswer('nggak ada'), 'no');
  assert.equal(classifyAnswer('gatau'), 'unsure');
  assert.equal(classifyAnswer('kurang tahu sih'), 'unsure');
  assert.equal(classifyAnswer('resep nasi goreng'), null);
});

test('cerita modus -> bot bertanya satu per satu lalu menyimpulkan', () => {
  const start = converse('Aku lagi ditawarin kerja');
  assert.match(start.replies[0][0].text, /loker palsu/);
  assert.equal(start.last.text, INTERVIEWS['loker-palsu'].questions[0].ask);
  assert.equal(start.last.note, 'Pertanyaan 1 dari 3');
  assert.deepEqual(start.last.actions.map((action) => action.label), ['Iya', 'Nggak', 'Nggak tahu']);

  const done = converse('Aku lagi ditawarin kerja', 'iya', 'iya bgt', 'nggak');
  assert.equal(done.last.level, 'tinggi');
  assert.equal(done.last.list.length, 2);
  assert.equal(done.context.flow, null);
  assert.deepEqual(done.context.topic, { kind: 'scenario', id: 'loker-palsu' });

  const calm = converse('Aku lagi ditawarin kerja', 'nggak', 'nggak', 'gatau');
  assert.equal(calm.last.level, 'rendah');
  assert.match(calm.last.note, /nggak tahu/);
});

test('detail di cerita langsung dihitung, pertanyaannya tidak diulang', () => {
  const { replies, last } = converse('ada yang chat nawarin kerja admin online gaji 8 juta tapi suruh bayar pelatihan 150rb');
  assert.match(replies[0][0].text, /sudah lihat 2 tanda bahaya/);
  assert.equal(last.text, INTERVIEWS['loker-palsu'].questions[2].ask);

  // Jawaban yang menyebut detail lain ikut mengisi pertanyaan berikutnya.
  const filled = converse('Aku lagi ditawarin kerja', 'iya, katanya gaji tinggi juga');
  assert.equal(filled.last.text, INTERVIEWS['loker-palsu'].questions[2].ask);
});

test('jawaban tidak jelas ditanya ulang sekali, lalu dianggap nggak tahu', () => {
  const once = converse('Aku lagi ditawarin kerja', 'hmm');
  assert.equal(once.last.text, INTERVIEWS['loker-palsu'].questions[0].ask);
  assert.match(once.last.note, /Jawab "iya"/);
  const twice = converse('Aku lagi ditawarin kerja', 'hmm', 'hmm');
  assert.equal(twice.last.text, INTERVIEWS['loker-palsu'].questions[1].ask);
});

test('di tengah wawancara: kejadian darurat, ganti topik, dan batal tetap ditangani', () => {
  assert.equal(converse('Aku lagi ditawarin kerja', 'iya aku udah transfer').last.actions[0].incidentId, 'transfer');
  assert.match(converse('Aku lagi ditawarin kerja', 'lapor ke mana?').last.text, /Kanal lapor/);
  const cancelled = converse('Aku lagi ditawarin kerja', 'batal');
  assert.match(cancelled.last.text, /nggak apa-apa/);
  assert.equal(cancelled.context.flow, null);
});

test('setiap modus punya wawancara dan kalimat pembuka yang memulainya', () => {
  for (const [scenarioId, interview] of Object.entries(INTERVIEWS)) {
    assert.equal(detectIntent(interview.storyMessage)?.scenarioId, scenarioId, interview.storyMessage);
    assert.ok(interview.questions.length >= 2, scenarioId);
    assert.ok(INCIDENTS.some((incident) => incident.id === interview.incidentId), scenarioId);
    const { context } = converse(interview.storyMessage);
    assert.ok(context.flow || context.topic, scenarioId);
  }
});

test('pertanyaan lanjutan nyambung ke topik terakhir', () => {
  assert.match(converse('Apa ciri loker palsu?', 'contohnya?').last.text, /Contoh chat loker palsu/);
  assert.match(converse('Apa ciri loker palsu?', 'cara menghindarinya?').last.text, /Biar nggak kena loker palsu/);
  assert.equal(converse('ciri investasi bodong apa?', 'kalau udah telanjur gimana?').last.actions[0].incidentId, 'transfer');
  assert.match(converse('cara menghindari pinjol ilegal').last.text, /Biar nggak kena pinjol ilegal/);
});

test('setelah langkah darurat, "terus?" memberi langkah berikutnya', () => {
  const steps = converse('aku udah kasih OTP', 'terus?', 'terus apa lagi?');
  assert.deepEqual(steps.replies[1][0].list, INCIDENTS.find((incident) => incident.id === 'otp').today);
  assert.match(steps.last.text, /pesan peringatan/);
});

test('perasaan ditanggapi, tidak paham memberi petunjuk sesuai topik', () => {
  assert.match(firstReply('aku panik banget').text, /Tarik napas/);
  const lost = converse('Apa ciri loker palsu?', 'resep nasi goreng');
  assert.match(lost.last.text, /belum paham/);
  assert.match(lost.last.note, /loker palsu/);
});

test('variasi kalimat bergantian', () => {
  const { replies } = converse('makasih', 'makasih');
  assert.notEqual(replies[0][0].text, replies[1][0].text);
});

test('detail spesifik mengalahkan kata "ga" di dalamnya, penyangkal tetap dihormati', () => {
  const refused = converse('Temenku tiba-tiba minta pinjem duit', 'iya bahasanya aneh', 'dia ga mau ditelpon');
  assert.equal(refused.last.list.length, 3);
  const unpaid = converse('Aku lagi ditawarin kerja', 'belum bayar sih');
  assert.equal(unpaid.last.text, INTERVIEWS['loker-palsu'].questions[1].ask);
  assert.equal(unpaid.context.flow.answers[0], 'no');
});

test('info yang disebut belakangan mengoreksi jawaban sebelumnya', () => {
  const { last } = converse('aku dapet dm menang giveaway', 'nggak', 'disuruh bayar ongkir 50rb', 'nggak');
  assert.equal(last.level, 'tinggi');
  assert.ok(last.list.includes(INTERVIEWS['giveaway-palsu'].questions[1].flag));
});

test('singkatan lanjutan dan kontak mencurigakan dikenali', () => {
  assert.match(converse('aku udah transfer', 'trs gmn').last.text, /masih hari ini/);
  const sms = respond('knp ya aku sering dapat sms aneh', INITIAL_BOT_CONTEXT);
  assert.equal(sms.context.awaitingCheck, true);
});
