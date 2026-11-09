// Logika checklist kesiapan. `checked` berbentuk { idItem: true }.

const NEXT_STEP_PREVIEW_COUNT = 2;

export function uncheckedItems(items, checked) {
  return items.filter((item) => checked[item.id] !== true);
}

export function readinessPercent(items, checked) {
  if (items.length === 0) return 0;
  const doneCount = items.length - uncheckedItems(items, checked).length;
  return Math.round((doneCount / items.length) * 100);
}

// "kunci profil dan tinjau izin aplikasi." atau satu frasa saja kalau tinggal satu.
export function nextStepSentence(items, checked) {
  const phrases = uncheckedItems(items, checked)
    .slice(0, NEXT_STEP_PREVIEW_COUNT)
    .map((item) => item.nextStep);
  return phrases.length === 0 ? '' : `${phrases.join(' dan ')}.`;
}

export function toggleChecked(checked, id) {
  const next = { ...checked };
  if (next[id] === true) delete next[id];
  else next[id] = true;
  return next;
}
