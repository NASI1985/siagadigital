// Otak SiagaBot: fungsi murni, tanpa React. Teks + konteks masuk -> balasan + konteks baru keluar.
// Tidak ada yang disimpan atau dikirim ke server.
import {
  ACK_PATTERNS,
  ANSWER_BUTTONS,
  BOT_TEXT,
  CANCEL_PATTERNS,
  CHECK_REQUEST_PATTERNS,
  EMERGENCY_INTENTS,
  FEELING_PATTERNS,
  FOLLOW_UP_MAX_LENGTH,
  FOLLOW_UP_PATTERNS,
  GENERAL_SCAM_PATTERNS,
  GREETING_PATTERNS,
  HELP_PATTERNS,
  INTERVIEWS,
  LONG_MESSAGE_LENGTH,
  NEGATION_WORDS,
  NO_PATTERNS,
  PREVENT_PATTERNS,
  QUICK_REPLIES,
  REAL_WORDS,
  REPORT_DESCRIPTIONS,
  REPORT_PATTERNS,
  SCAM_TOPICS,
  SLANG,
  THANKS_PATTERNS,
  UNSURE_PATTERNS,
  VOCABULARY,
  YES_PATTERNS,
} from '../data/chatbot.js';
import { INCIDENTS, REPORT_LINKS } from '../data/emergency.js';
import { SCENARIOS, PRACTICE_TIP } from '../data/scenarios.js';
import { SECURITY_CHECKLIST } from '../data/securityChecklist.js';
import { analyze, describeFinding, LEVEL_HIGH, LEVEL_LOW, LEVEL_MEDIUM } from './analyzer.js';
import { findById } from './emergency.js';
import { escapeRegex, findMatches } from './patterns.js';

// flow  = wawancara yang sedang berjalan: { scenarioId, answers: ['yes'|'no'|'unsure'|null], retried }
// topic = yang terakhir dibahas, untuk pertanyaan lanjutan:
//         { kind: 'scenario', id } atau { kind: 'incident', id, stage }
// turn  = jumlah pesan yang sudah dibalas, dipakai untuk memilih variasi kalimat.
export const INITIAL_BOT_CONTEXT = { awaitingCheck: false, flow: null, topic: null, turn: 0 };

// Bobot niat: kejadian darurat paling diutamakan, basa-basi paling rendah.
const EMERGENCY_WEIGHT = 3;
const TOPIC_WEIGHT = 2;
const SMALL_TALK_WEIGHT = 1;
const MAX_CHECK_ITEMS = 5;
const MAX_TOPIC_FLAGS = 5;
const MAX_PREVENT_ITEMS = 4;
const MAX_EXAMPLE_ITEMS = 3;

const CHECK_PREFIX = /^\s*(?:cek|periksa|check)\s*:\s*/i;
const LINK_HINT = /(https?:\/\/|www\.|bit\.ly|t\.me|wa\.me|s\.id\/|\.apk)/i;

// ---------- Merapikan teks: bahasa gaul dan salah ketik ----------

const REPEATED_LETTERS = /(\p{L})\1{2,}/gu;
const WORD = /[\p{L}\p{N}]+/gu;
const VOCABULARY_SET = new Set(VOCABULARY);
const REAL_WORDS_SET = new Set(REAL_WORDS);
const MIN_TYPO_LENGTH = 6;

// Jarak edit Damerau (tukar dua huruf bersebelahan dihitung 1 kesalahan).
function editDistance(a, b) {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
      }
    }
  }
  return rows[a.length][b.length];
}

// "trasnfer" -> "transfer", "dibjak" -> "dibajak". Hanya kata 6+ huruf, huruf awal sama,
// tepat satu kesalahan, dan bukan kata asli yang kebetulan mirip ("diajak").
export function correctTypo(word) {
  if (word.length < MIN_TYPO_LENGTH || /\d/.test(word) || VOCABULARY_SET.has(word) || REAL_WORDS_SET.has(word)) {
    return word;
  }
  const match = VOCABULARY.find(
    (candidate) => candidate[0] === word[0] && Math.abs(candidate.length - word.length) <= 1 && editDistance(word, candidate) === 1,
  );
  return match ?? word;
}

// "gw udh tf" -> "aku udah transfer". Huruf berulang ("tolonggg") diringkas dulu.
export function normalize(text) {
  return text
    .toLowerCase()
    .replace(REPEATED_LETTERS, '$1')
    .replace(WORD, (word) => (Object.prototype.hasOwnProperty.call(SLANG, word) ? SLANG[word] : correctTypo(word)));
}

// Teks asli dan versi rapi sama-sama dicocokkan, supaya pola lama tetap jalan.
const textForms = (text) => {
  const normalized = normalize(text);
  return normalized === text ? [text] : [text, normalized];
};

// ---------- Pencocokan kata kunci ----------

// Regex "ada kata penyangkal tepat sebelum frasa", boleh diselingi satu kata.
function guardRegex(words) {
  const alternatives = words.map(escapeRegex).join('|');
  return new RegExp(`(?:^|[^\\p{L}\\p{N}])(?:${alternatives})(?:\\s+[\\p{L}\\p{N}]+){0,2}\\s*$`, 'iu');
}
const NEGATION_GUARD = guardRegex(NEGATION_WORDS);
const GUARD_WINDOW = 30;

function countHits(patterns, text, guard = null) {
  let total = 0;
  for (const pattern of patterns) {
    for (const match of findMatches(pattern, text)) {
      if (guard && guard.test(text.slice(Math.max(0, match.start - GUARD_WINDOW), match.start))) continue;
      total += 1;
    }
  }
  return total;
}

const mentions = (patterns, forms) => forms.some((form) => countHits(patterns, form) > 0);

const INTENT_CANDIDATES = [
  ...EMERGENCY_INTENTS.map((intent) => ({
    kind: 'emergency',
    weight: EMERGENCY_WEIGHT,
    patterns: intent.patterns,
    incidentId: intent.incidentId,
    // "belum transfer", "biar nggak dibajak" bukan kejadian.
    guard: guardRegex([...NEGATION_WORDS, ...(intent.notAfter ?? [])]),
  })),
  { kind: 'emergency-ask', weight: TOPIC_WEIGHT, patterns: GENERAL_SCAM_PATTERNS, guard: NEGATION_GUARD },
  { kind: 'check-request', weight: TOPIC_WEIGHT, patterns: CHECK_REQUEST_PATTERNS },
  { kind: 'report', weight: TOPIC_WEIGHT, patterns: REPORT_PATTERNS },
  ...SCAM_TOPICS.map((topic) => ({
    kind: 'topic',
    weight: TOPIC_WEIGHT,
    patterns: topic.patterns,
    scenarioId: topic.scenarioId,
  })),
  { kind: 'prevent', weight: TOPIC_WEIGHT, patterns: PREVENT_PATTERNS },
  { kind: 'help', weight: SMALL_TALK_WEIGHT, patterns: HELP_PATTERNS },
  { kind: 'feeling', weight: SMALL_TALK_WEIGHT, patterns: FEELING_PATTERNS },
  { kind: 'thanks', weight: SMALL_TALK_WEIGHT, patterns: THANKS_PATTERNS },
  { kind: 'ack', weight: SMALL_TALK_WEIGHT, patterns: ACK_PATTERNS },
  { kind: 'greeting', weight: SMALL_TALK_WEIGHT, patterns: GREETING_PATTERNS },
];

// Niat dengan skor tertinggi (jumlah kata kunci x bobot). Seri -> yang lebih dulu di daftar.
function bestIntent(candidates, forms) {
  let best = null;
  for (const candidate of candidates) {
    const hits = Math.max(...forms.map((form) => countHits(candidate.patterns, form, candidate.guard)));
    const score = hits * candidate.weight;
    if (score > 0 && (!best || score > best.score)) best = { ...candidate, score };
  }
  return best;
}

export function detectIntent(text) {
  return bestIntent(INTENT_CANDIDATES, textForms(text));
}

const TOPIC_CANDIDATES = INTENT_CANDIDATES.filter((candidate) => candidate.kind === 'topic');
const detectScenario = (forms) => bestIntent(TOPIC_CANDIDATES, forms)?.scenarioId ?? null;

// Pertanyaan lanjutan: urutan menentukan prioritas.
const FOLLOW_UP_ORDER = ['already', 'avoid', 'example', 'traits', 'next'];
function detectFollowUp(forms) {
  return FOLLOW_UP_ORDER.find((kind) => mentions(FOLLOW_UP_PATTERNS[kind], forms)) ?? null;
}

// Jawaban iya/nggak/nggak tahu. "nggak ada" harus terbaca "nggak", jadi urutannya penting.
export function classifyAnswer(text) {
  const forms = textForms(text);
  if (mentions(UNSURE_PATTERNS, forms)) return 'unsure';
  if (mentions(NO_PATTERNS, forms)) return 'no';
  if (mentions(YES_PATTERNS, forms)) return 'yes';
  return null;
}

// ---------- Penyusun pesan ----------

function botMessage(fields) {
  return { text: '', list: [], note: '', actions: [], ...fields };
}

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const pick = (value, turn) => (Array.isArray(value) ? value[turn % value.length] : value);
const sendAction = (label, message) => ({ type: 'send', label, message });
const quickActions = () => QUICK_REPLIES.map((quick) => sendAction(quick.label, quick.message));
const incidentActions = () => INCIDENTS.map((incident) => sendAction(incident.label, incident.label));
const scenarioTitle = (scenarioId) => findById(SCENARIOS, scenarioId).title.toLowerCase();

export function greetingMessage() {
  return botMessage({ text: BOT_TEXT.greeting, actions: quickActions() });
}

function emergencyReply(incidentId, turn) {
  const incident = findById(INCIDENTS, incidentId);
  return botMessage({
    text: fill(pick(BOT_TEXT.emergencyIntro, turn), { title: incident.title }),
    list: incident.now,
    note: BOT_TEXT.reportLine,
    actions: [
      { type: 'emergency', label: 'Buka langkah lengkap', incidentId },
      sendAction('Terus apa lagi?', 'Terus apa lagi?'),
      sendAction('Cara lapor', 'Lapor ke mana?'),
    ],
    tone: 'danger',
  });
}

function emergencyTodayReply(incidentId) {
  const incident = findById(INCIDENTS, incidentId);
  return botMessage({
    text: BOT_TEXT.emergencyToday,
    list: incident.today,
    note: BOT_TEXT.reportLine,
    actions: [{ type: 'emergency', label: 'Buka langkah lengkap', incidentId }, sendAction('Terus?', 'Terus?')],
  });
}

function emergencyLaterReply(incidentId) {
  return botMessage({
    text: BOT_TEXT.emergencyLater,
    actions: [{ type: 'emergency', label: 'Buat pesan peringatan', incidentId }, sendAction('Cara lapor', 'Lapor ke mana?')],
  });
}

function reportReply() {
  return botMessage({
    text: BOT_TEXT.reportIntro,
    list: REPORT_LINKS.map((link) => `${link.label}: ${REPORT_DESCRIPTIONS[link.href] ?? ''}`),
    actions: REPORT_LINKS.map((link) => ({ type: 'link', label: link.label, href: link.href, external: link.external })),
  });
}

function preventReply() {
  return botMessage({
    text: BOT_TEXT.preventIntro,
    list: SECURITY_CHECKLIST.slice(0, MAX_PREVENT_ITEMS).map((item) => item.label),
    actions: [{ type: 'navigate', label: 'Buka checklist keamanan', route: 'bantuan' }],
  });
}

function traitsReply(scenarioId) {
  const scenario = findById(SCENARIOS, scenarioId);
  const flagTitles = [...new Set(scenario.steps.flatMap((step) => step.missedFlags.map((flag) => flag.title)))];
  return botMessage({
    text: fill(BOT_TEXT.topicIntro, { title: scenario.title.toLowerCase() }),
    list: flagTitles.slice(0, MAX_TOPIC_FLAGS),
    note: PRACTICE_TIP,
    actions: [
      { type: 'navigate', label: 'Latih skenario ini', route: 'latih' },
      sendAction('Aku lagi ngalamin ini', INTERVIEWS[scenarioId].storyMessage),
      sendAction('Contohnya?', 'Contohnya?'),
    ],
  });
}

function avoidReply(scenarioId) {
  return botMessage({
    text: fill(BOT_TEXT.avoidIntro, { title: scenarioTitle(scenarioId) }),
    list: INTERVIEWS[scenarioId].avoid,
    note: PRACTICE_TIP,
    actions: [
      { type: 'navigate', label: 'Latih skenario ini', route: 'latih' },
      sendAction('Kalau udah telanjur?', 'Kalau udah telanjur gimana?'),
    ],
  });
}

function exampleReply(scenarioId) {
  const scenario = findById(SCENARIOS, scenarioId);
  return botMessage({
    text: fill(BOT_TEXT.exampleIntro, { title: scenario.title.toLowerCase() }),
    list: scenario.steps.flatMap((step) => step.messages).slice(0, MAX_EXAMPLE_ITEMS).map((line) => `“${line}”`),
    actions: [
      sendAction('Cara menghindarinya?', 'Cara menghindarinya?'),
      { type: 'navigate', label: 'Latih skenario ini', route: 'latih' },
    ],
  });
}

export function checkReply(text, scenarioId = null) {
  const result = analyze(text);
  const topicNote = scenarioId ? `${fill(BOT_TEXT.checkTopic, { title: scenarioTitle(scenarioId) })} ` : '';
  if (result.level === LEVEL_LOW) {
    return botMessage({
      text: BOT_TEXT.checkLow,
      note: topicNote.trim(),
      actions: [{ type: 'navigate', label: 'Buka Cek Dulu', route: 'cek' }],
    });
  }
  const items = [
    ...result.combos.map((combo) => `${combo.title}.`),
    ...result.findings.map((finding) => `${finding.rule.title}: ${describeFinding(finding)}`),
  ];
  return botMessage({
    text: fill(BOT_TEXT.checkHigh, { level: capitalize(result.level) }),
    list: items.slice(0, MAX_CHECK_ITEMS),
    note: `${topicNote}${BOT_TEXT.checkNote}`,
    actions: [
      { type: 'navigate', label: 'Buka Cek Dulu', route: 'cek' },
      { type: 'emergency', label: 'Aku sudah transfer', incidentId: 'transfer' },
    ],
    tone: 'danger',
    level: result.level,
  });
}

// ---------- Wawancara per modus ----------

function questionMessage(flow, index, retry = false) {
  const { questions } = INTERVIEWS[flow.scenarioId];
  return botMessage({
    text: questions[index].ask,
    note: retry ? BOT_TEXT.answerRetry : fill(BOT_TEXT.questionNote, { n: index + 1, total: questions.length }),
    actions: ANSWER_BUTTONS.map((button) => sendAction(button.label, button.message)),
  });
}

function verdictMessage(flow) {
  const interview = INTERVIEWS[flow.scenarioId];
  const title = scenarioTitle(flow.scenarioId);
  const flags = interview.questions.filter((_, index) => flow.answers[index] === 'yes').map((question) => question.flag);
  const unsure = flow.answers.includes('unsure');

  let level = LEVEL_LOW;
  if (flags.length >= 2) level = LEVEL_HIGH;
  else if (flags.length === 1) level = LEVEL_MEDIUM;

  const template = { [LEVEL_HIGH]: BOT_TEXT.verdictHigh, [LEVEL_MEDIUM]: BOT_TEXT.verdictMedium }[level] ?? BOT_TEXT.verdictLow;
  return botMessage({
    text: fill(template, { title }),
    list: level === LEVEL_LOW ? interview.avoid : flags,
    note: unsure ? BOT_TEXT.verdictUnsure : PRACTICE_TIP,
    actions: [
      sendAction('Cara menghindarinya', 'Cara menghindarinya?'),
      { type: 'emergency', label: 'Aku udah telanjur', incidentId: interview.incidentId },
      { type: 'navigate', label: 'Latih skenario ini', route: 'latih' },
    ],
    tone: level === LEVEL_LOW ? undefined : 'danger',
    level,
  });
}

// Tanya pertanyaan berikutnya yang belum terjawab, atau simpulkan kalau semua sudah.
function continueInterview(flow, leadMessages) {
  const index = flow.answers.indexOf(null);
  if (index === -1) {
    return { messages: [...leadMessages, verdictMessage(flow)], flow: null, topic: { kind: 'scenario', id: flow.scenarioId } };
  }
  return { messages: [...leadMessages, questionMessage(flow, index)], flow, topic: { kind: 'scenario', id: flow.scenarioId } };
}

// Detail yang disebut tanpa penyangkal ("ga mau ditelpon" ya, "belum bayar" tidak).
const statesDetail = (question, forms) => forms.some((form) => countHits(question.detect, form, NEGATION_GUARD) > 0);

// Jawaban "iya" yang tersirat di cerita: pertanyaan itu tidak ditanyakan lagi.
// Detail yang baru disebut belakangan juga mengoreksi jawaban "nggak"/"nggak tahu" sebelumnya.
function prefillAnswers(scenarioId, answers, forms, skipIndex = -1) {
  return answers.map((answer, index) =>
    answer !== 'yes' && index !== skipIndex && statesDetail(INTERVIEWS[scenarioId].questions[index], forms) ? 'yes' : answer,
  );
}

function startInterview(scenarioId, forms, turn) {
  const empty = INTERVIEWS[scenarioId].questions.map(() => null);
  const answers = prefillAnswers(scenarioId, empty, forms);
  const known = answers.filter(Boolean).length;
  const intro = fill(pick(BOT_TEXT.interviewIntro, turn), { title: scenarioTitle(scenarioId) });
  const text = known > 0 ? `${intro} ${fill(BOT_TEXT.interviewKnown, { n: known })}` : intro;
  return continueInterview({ scenarioId, answers, retried: false }, [botMessage({ text })]);
}

// null = pesan ini bukan jawaban; wawancara ditinggalkan dan pesan diproses seperti biasa.
function answerInterview(flow, forms, intent) {
  const index = flow.answers.indexOf(null);
  const { questions } = INTERVIEWS[flow.scenarioId];
  const answers = prefillAnswers(flow.scenarioId, flow.answers, forms, index);

  // Detail spesifik ("dia ga mau ditelpon") lebih kuat daripada kata "ga" di dalamnya.
  let answer = statesDetail(questions[index], forms) ? 'yes' : classifyAnswer(forms[0]);
  if (!answer) {
    const switchesTopic = intent && intent.weight >= TOPIC_WEIGHT && intent.scenarioId !== flow.scenarioId;
    if (switchesTopic) return null;
    // Pesan berisi info untuk pertanyaan lain: catat, lalu tanya ulang pertanyaan ini dengan biasa.
    const addedInfo = answers.some((value, i) => value !== flow.answers[i]);
    if (addedInfo) return continueInterview({ ...flow, answers }, []);
    if (!flow.retried) {
      const retryFlow = { ...flow, answers, retried: true };
      return { messages: [questionMessage(retryFlow, index, true)], flow: retryFlow, topic: { kind: 'scenario', id: flow.scenarioId } };
    }
    answer = 'unsure';
  }
  answers[index] = answer;
  return continueInterview({ ...flow, answers, retried: false }, []);
}

// ---------- Pertanyaan lanjutan ----------

function scenarioFollowUp(scenarioId, kind, turn) {
  if (kind === 'already') {
    const incidentId = INTERVIEWS[scenarioId].incidentId;
    return { messages: [emergencyReply(incidentId, turn)], topic: { kind: 'incident', id: incidentId, stage: 0 } };
  }
  const topic = { kind: 'scenario', id: scenarioId };
  if (kind === 'avoid' || kind === 'next') return { messages: [avoidReply(scenarioId)], topic };
  if (kind === 'example') return { messages: [exampleReply(scenarioId)], topic };
  if (kind === 'traits') return { messages: [traitsReply(scenarioId)], topic };
  return null;
}

function incidentFollowUp(topic, kind) {
  if (kind === 'avoid') return { messages: [preventReply()], topic };
  if (kind !== 'next' && kind !== 'already') return null;
  if (topic.stage === 0) return { messages: [emergencyTodayReply(topic.id)], topic: { ...topic, stage: 1 } };
  return { messages: [emergencyLaterReply(topic.id)], topic: { ...topic, stage: 2 } };
}

function followUpReply(topic, kind, turn) {
  if (!topic || !kind) return null;
  return topic.kind === 'scenario' ? scenarioFollowUp(topic.id, kind, turn) : incidentFollowUp(topic, kind);
}

function fallbackMessage(topic, turn) {
  const text = pick(BOT_TEXT.fallback, turn);
  if (topic?.kind !== 'scenario') return botMessage({ text, actions: quickActions() });
  return botMessage({
    text,
    note: fill(BOT_TEXT.topicHint, { title: scenarioTitle(topic.id) }),
    actions: [
      sendAction('Contohnya?', 'Contohnya?'),
      sendAction('Cara menghindarinya?', 'Cara menghindarinya?'),
      sendAction('Kalau udah telanjur?', 'Kalau udah telanjur gimana?'),
    ],
  });
}

// ---------- Niat biasa ----------

function intentReply(intent, forms, turn) {
  switch (intent.kind) {
    case 'emergency':
      return { messages: [emergencyReply(intent.incidentId, turn)], topic: { kind: 'incident', id: intent.incidentId, stage: 0 } };
    case 'emergency-ask':
      return { messages: [botMessage({ text: BOT_TEXT.emergencyAsk, actions: incidentActions() })] };
    case 'feeling':
      return { messages: [botMessage({ text: BOT_TEXT.feeling, actions: incidentActions() })] };
    case 'check-request':
      return { messages: [botMessage({ text: BOT_TEXT.checkPrompt })], awaitingCheck: true };
    case 'report':
      return { messages: [reportReply()] };
    case 'prevent':
      return { messages: [preventReply()] };
    case 'topic': {
      // "ciri loker?" -> daftar ciri; "kalau udah telanjur ikut investasi?" -> darurat;
      // cerita ("aku ditawarin kerja") -> wawancara.
      const kind = detectFollowUp(forms);
      return (kind && kind !== 'next' && scenarioFollowUp(intent.scenarioId, kind, turn)) || startInterview(intent.scenarioId, forms, turn);
    }
    case 'help':
      return { messages: [botMessage({ text: BOT_TEXT.help, actions: quickActions() })] };
    case 'thanks':
      return { messages: [botMessage({ text: pick(BOT_TEXT.thanks, turn) })] };
    case 'ack':
      return { messages: [botMessage({ text: pick(BOT_TEXT.ack, turn) })] };
    default:
      return { messages: [greetingMessage()] };
  }
}

function checkResult(input, forms) {
  const scenarioId = detectScenario(forms);
  return {
    messages: [checkReply(input, scenarioId)],
    ...(scenarioId ? { topic: { kind: 'scenario', id: scenarioId } } : {}),
  };
}

// Urutan keputusan:
// 1. awalan "cek:"  2. batal  3. kejadian darurat  4. jawaban wawancara  5. menunggu pesan untuk dicek
// 6. pesan panjang / ada tautan  7. pertanyaan lanjutan soal topik terakhir  8. niat lain
// 9. analyzer menemukan pola  10. tidak paham
export function respond(text, context = INITIAL_BOT_CONTEXT) {
  const input = typeof text === 'string' ? text.trim() : '';
  if (input === '') return { messages: [], context };

  const state = { ...INITIAL_BOT_CONTEXT, ...context };
  const turn = state.turn;
  // Setiap balasan bawaan: wawancara & mode cek selesai, topik terakhir diingat.
  const finish = (result) => ({
    messages: result.messages,
    context: {
      awaitingCheck: result.awaitingCheck ?? false,
      flow: result.flow ?? null,
      topic: result.topic === undefined ? state.topic : result.topic,
      turn: turn + 1,
    },
  });

  const prefix = input.match(CHECK_PREFIX);
  if (prefix) {
    const content = input.slice(prefix[0].length).trim();
    if (!content) return finish({ messages: [botMessage({ text: BOT_TEXT.checkPrompt })], awaitingCheck: true });
    return finish(checkResult(content, textForms(content)));
  }

  const forms = textForms(input);
  const isShort = input.length < LONG_MESSAGE_LENGTH && !LINK_HINT.test(input);

  if ((state.flow || state.awaitingCheck) && isShort && mentions(CANCEL_PATTERNS, forms)) {
    return finish({ messages: [botMessage({ text: BOT_TEXT.cancel })] });
  }

  const intent = bestIntent(INTENT_CANDIDATES, forms);
  if (intent?.kind === 'emergency') return finish(intentReply(intent, forms, turn));

  if (state.flow && isShort) {
    const answered = answerInterview(state.flow, forms, intent);
    if (answered) return finish(answered);
  }

  if (state.awaitingCheck || !isShort) return finish(checkResult(input, forms));

  const canFollowUp = input.length <= FOLLOW_UP_MAX_LENGTH && (!intent || intent.weight < TOPIC_WEIGHT || intent.kind === 'prevent');
  if (canFollowUp) {
    const followUp = followUpReply(state.topic, detectFollowUp(forms), turn);
    if (followUp) return finish(followUp);
  }

  if (intent) return finish(intentReply(intent, forms, turn));
  if (analyze(input).score > 0) return finish(checkResult(input, forms));

  return finish({ messages: [fallbackMessage(state.topic, turn)] });
}
