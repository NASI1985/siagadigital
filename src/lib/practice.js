// Aturan skor latihan. Semua konstanta ada di sini, bukan di komponen.

export const BADGE_MIN_SCORE = 60;
export const GUARDIAN_BADGE_COUNT = 3;

// Level per skenario, dicek dari atas.
export const SCORE_LEVELS = [
  { minScore: 100, label: 'Siaga' },
  { minScore: 60, label: 'Waspada' },
  { minScore: 0, label: 'Rawan' },
];

// Level pemain berdasarkan jumlah lencana, dicek dari atas.
export const PLAYER_LEVELS = [
  { minBadges: GUARDIAN_BADGE_COUNT, label: 'Guardian' },
  { minBadges: 2, label: 'Siaga' },
  { minBadges: 0, label: 'Pemula' },
];

export function computeScore(safeCount, totalSteps) {
  if (totalSteps <= 0) return 0;
  return Math.round((safeCount / totalSteps) * 100);
}

export function scoreLevel(score) {
  return SCORE_LEVELS.find((level) => score >= level.minScore).label;
}

export function earnsBadge(score) {
  return score >= BADGE_MIN_SCORE;
}

export function countBadges(scores) {
  return Object.values(scores).filter(earnsBadge).length;
}

export function playerLevel(badgeCount) {
  return PLAYER_LEVELS.find((level) => badgeCount >= level.minBadges).label;
}

export function badgesToGuardian(badgeCount) {
  return Math.max(0, GUARDIAN_BADGE_COUNT - badgeCount);
}

export function guardianLabel(badgeCount) {
  const remaining = badgesToGuardian(badgeCount);
  return remaining === 0 ? 'Level Guardian tercapai' : `Guardian: ${remaining} lencana lagi`;
}

// Yang disimpan adalah skor terbaik, bukan skor terakhir.
export function mergeBestScore(scores, scenarioId, score) {
  const previous = scores[scenarioId];
  if (previous !== undefined && previous >= score) return scores;
  return { ...scores, [scenarioId]: score };
}

export function countCompleted(scores, scenarios) {
  return scenarios.filter((scenario) => scores[scenario.id] !== undefined).length;
}

// Susun isi chat dari langkah pertama sampai langkah sekarang.
export function buildChatLog(scenario, answers, stepIndex) {
  const log = [];
  scenario.steps.slice(0, stepIndex + 1).forEach((step, index) => {
    step.messages.forEach((text) => log.push({ from: 'scammer', text }));
    const answer = answers.find((item) => item.stepIndex === index);
    if (!answer) return;
    const option = step.options[answer.optionIndex];
    log.push({ from: 'player', text: option.reply ?? option.text });
    if (!answer.safe) log.push({ from: 'scammer', text: step.scammerReply });
  });
  return log.map((entry, index) => ({ ...entry, id: index, showSender: index === 0 && entry.from === 'scammer' }));
}

// Validasi struktur skenario; dipakai test dan bisa dipakai saat menambah skenario.
export function validateScenario(scenario) {
  const problems = [];
  if (!scenario.id || !scenario.title || !scenario.badge) problems.push('id, title, dan badge wajib diisi');
  scenario.steps.forEach((step, index) => {
    const count = step.options.length;
    if (count < 2 || count > 3) problems.push(`langkah ${index + 1}: opsi harus 2-3`);
    if (!step.options.some((option) => option.safe)) problems.push(`langkah ${index + 1}: tidak ada opsi aman`);
    if (!step.options.some((option) => !option.safe)) problems.push(`langkah ${index + 1}: tidak ada opsi berisiko`);
    if (step.messages.length === 0) problems.push(`langkah ${index + 1}: pesan kosong`);
    if (!step.explanation || !step.riskyExplanation || !step.scammerReply) {
      problems.push(`langkah ${index + 1}: penjelasan atau balasan penipu kosong`);
    }
    if (step.missedFlags.length === 0) problems.push(`langkah ${index + 1}: missedFlags kosong`);
  });
  return problems;
}
