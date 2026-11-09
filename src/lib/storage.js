// Baca/tulis localStorage dengan aman: try/catch + validasi bentuk data.

export const STORAGE_KEYS = {
  practiceScores: 'siagadigital.skorLatihan.v1',
  checklist: 'siagadigital.checklist.v1',
};

function getDefaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    // Akses localStorage bisa melempar error kalau diblokir browser.
    return null;
  }
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// { idSkenario: skor } dengan skor bilangan bulat 0-100.
export function isScoreMap(value) {
  return (
    isPlainObject(value) &&
    Object.values(value).every((score) => Number.isInteger(score) && score >= 0 && score <= 100)
  );
}

// { idItem: true }
export function isCheckedMap(value) {
  return isPlainObject(value) && Object.values(value).every((checked) => checked === true);
}

export function parseStored(raw, isValid, fallback) {
  if (raw === null || raw === undefined) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function readStored(key, isValid, fallback, storage = getDefaultStorage()) {
  try {
    return parseStored(storage?.getItem(key) ?? null, isValid, fallback);
  } catch {
    return fallback;
  }
}

export function writeStored(key, value, storage = getDefaultStorage()) {
  try {
    storage?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
