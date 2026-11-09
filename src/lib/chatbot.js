// Otak SiagaBot: fungsi murni, tanpa React. Teks masuk -> balasan keluar.
// Tidak ada yang disimpan atau dikirim ke server.
import {
  BOT_TEXT,
  CHECK_REQUEST_PATTERNS,
  EMERGENCY_INTENTS,
  GENERAL_SCAM_PATTERNS,
  GREETING_PATTERNS,
  HELP_PATTERNS,
  LONG_MESSAGE_LENGTH,
  QUICK_REPLIES,
  REPORT_DESCRIPTIONS,
  REPORT_PATTERNS,
  SCAM_TOPICS,
  THANKS_PATTERNS,
} from '../data/chatbot.js';
import { INCIDENTS, REPORT_LINKS } from '../data/emergency.js';
import { SCENARIOS, PRACTICE_TIP } from '../data/scenarios.js';
import { analyze, describeFinding, LEVEL_LOW } from './analyzer.js';
import { findById } from './emergency.js';
import { findMatches } from './patterns.js';

export const INITIAL_BOT_CONTEXT = { awaitingCheck: false };

// Bobot niat: kejadian darurat paling diutamakan, basa-basi paling rendah.
const EMERGENCY_WEIGHT = 3;
const TOPIC_WEIGHT = 2;
const SMALL_TALK_WEIGHT = 1;
const MAX_CHECK_ITEMS = 5;
const MAX_TOPIC_FLAGS = 5;

const CHECK_PREFIX = /^\s*(?:cek|periksa|check)\s*:\s*/i;
const LINK_HINT = /(https?:\/\/|www\.|bit\.ly|t\.me|wa\.me|s\.id\/|\.apk)/i;

const INTENT_CANDIDATES = [
  ...EMERGENCY_INTENTS.map((intent) => ({
    kind: 'emergency',
    weight: EMERGENCY_WEIGHT,
    patterns: intent.patterns,
    incidentId: intent.incidentId,
  })),
  { kind: 'emergency-ask', weight: TOPIC_WEIGHT, patterns: GENERAL_SCAM_PATTERNS },
  { kind: 'check-request', weight: TOPIC_WEIGHT, patterns: CHECK_REQUEST_PATTERNS },
  { kind: 'report', weight: TOPIC_WEIGHT, patterns: REPORT_PATTERNS },
  ...SCAM_TOPICS.map((topic) => ({
    kind: 'topic',
    weight: TOPIC_WEIGHT,
    patterns: topic.patterns,
    scenarioId: topic.scenarioId,
  })),
  { kind: 'help', weight: SMALL_TALK_WEIGHT, patterns: HELP_PATTERNS },
  { kind: 'thanks', weight: SMALL_TALK_WEIGHT, patterns: THANKS_PATTERNS },
  { kind: 'greeting', weight: SMALL_TALK_WEIGHT, patterns: GREETING_PATTERNS },
];

function countHits(patterns, text) {
  return patterns.reduce((total, pattern) => total + findMatches(pattern, text).length, 0);
}

// Niat dengan skor tertinggi (jumlah kata kunci x bobot). Seri -> yang lebih dulu di daftar.
export function detectIntent(text) {
  let best = null;
  for (const candidate of INTENT_CANDIDATES) {
    const score = countHits(candidate.patterns, text) * candidate.weight;
    if (score > 0 && (!best || score > best.score)) best = { ...candidate, score };
  }
  return best;
}

function botMessage(fields) {
  return { text: '', list: [], note: '', actions: [], ...fields };
}

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const quickActions = () => QUICK_REPLIES.map((reply) => ({ type: 'send', label: reply.label, message: reply.message }));

export function greetingMessage() {
  return botMessage({ text: BOT_TEXT.greeting, actions: quickActions() });
}

function emergencyReply(incidentId) {
  const incident = findById(INCIDENTS, incidentId);
  return botMessage({
    text: fill(BOT_TEXT.emergencyIntro, { title: incident.title }),
    list: incident.now,
    note: BOT_TEXT.reportLine,
    actions: [
      { type: 'emergency', label: 'Buka langkah lengkap', incidentId },
      { type: 'send', label: 'Cara lapor', message: 'Lapor ke mana?' },
    ],
    tone: 'danger',
  });
}

function emergencyAskReply() {
  return botMessage({
    text: BOT_TEXT.emergencyAsk,
    actions: INCIDENTS.map((incident) => ({ type: 'send', label: incident.label, message: incident.label })),
  });
}

function topicReply(scenarioId) {
  const scenario = findById(SCENARIOS, scenarioId);
  const flagTitles = [...new Set(scenario.steps.flatMap((step) => step.missedFlags.map((flag) => flag.title)))];
  return botMessage({
    text: fill(BOT_TEXT.topicIntro, { title: scenario.title.toLowerCase() }),
    list: flagTitles.slice(0, MAX_TOPIC_FLAGS),
    note: PRACTICE_TIP,
    actions: [
      { type: 'navigate', label: 'Latih skenario ini', route: 'latih' },
      { type: 'send', label: 'Cek pesan', message: 'Cek pesan' },
    ],
  });
}

function reportReply() {
  return botMessage({
    text: BOT_TEXT.reportIntro,
    list: REPORT_LINKS.map((link) => `${link.label}: ${REPORT_DESCRIPTIONS[link.href] ?? ''}`),
    actions: REPORT_LINKS.map((link) => ({ type: 'link', label: link.label, href: link.href, external: link.external })),
  });
}

export function checkReply(text) {
  const result = analyze(text);
  if (result.level === LEVEL_LOW) {
    return botMessage({ text: BOT_TEXT.checkLow, actions: [{ type: 'navigate', label: 'Buka Cek Dulu', route: 'cek' }] });
  }
  const items = [
    ...result.combos.map((combo) => `${combo.title}.`),
    ...result.findings.map((finding) => `${finding.rule.title}: ${describeFinding(finding)}`),
  ];
  return botMessage({
    text: fill(BOT_TEXT.checkHigh, { level: capitalize(result.level) }),
    list: items.slice(0, MAX_CHECK_ITEMS),
    note: BOT_TEXT.checkNote,
    actions: [
      { type: 'navigate', label: 'Buka Cek Dulu', route: 'cek' },
      { type: 'emergency', label: 'Aku sudah transfer', incidentId: 'transfer' },
    ],
    tone: 'danger',
    level: result.level,
  });
}

function intentReply(intent) {
  switch (intent.kind) {
    case 'emergency':
      return emergencyReply(intent.incidentId);
    case 'emergency-ask':
      return emergencyAskReply();
    case 'check-request':
      return botMessage({ text: BOT_TEXT.checkPrompt });
    case 'report':
      return reportReply();
    case 'topic':
      return topicReply(intent.scenarioId);
    case 'help':
      return botMessage({ text: BOT_TEXT.help, actions: quickActions() });
    case 'thanks':
      return botMessage({ text: BOT_TEXT.thanks });
    default:
      return greetingMessage();
  }
}

const reply = (message, awaitingCheck = false) => ({ messages: [message], context: { awaitingCheck } });

// Urutan keputusan:
// 1. awalan "cek:"  2. kejadian darurat  3. sedang menunggu pesan untuk dicek
// 4. pesan panjang / ada tautan  5. niat lain  6. analyzer menemukan pola  7. tidak paham
export function respond(text, context = INITIAL_BOT_CONTEXT) {
  const input = typeof text === 'string' ? text.trim() : '';
  if (input === '') return { messages: [], context };

  const prefix = input.match(CHECK_PREFIX);
  if (prefix) {
    const content = input.slice(prefix[0].length).trim();
    return content ? reply(checkReply(content)) : reply(botMessage({ text: BOT_TEXT.checkPrompt }), true);
  }

  const intent = detectIntent(input);
  if (intent?.kind === 'emergency') return reply(intentReply(intent));
  if (context.awaitingCheck) return reply(checkReply(input));
  if (input.length >= LONG_MESSAGE_LENGTH || LINK_HINT.test(input)) return reply(checkReply(input));
  if (intent) return reply(intentReply(intent), intent.kind === 'check-request');
  if (analyze(input).score > 0) return reply(checkReply(input));

  return reply(botMessage({ text: BOT_TEXT.fallback, actions: quickActions() }));
}
