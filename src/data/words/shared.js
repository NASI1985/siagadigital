// Potongan regex bersama untuk patterns (HANYA angka, mata uang, tautan, nomor rekening).

// Nominal uang: Rp150.000, Rp 8 juta, $2000, Rp150k, 500rb
export const NOMINAL = String.raw`(?:(?:rp\.?\s?|\$\s?|idr\s?|usd\s?)\d+(?:[.,]\d+)*(?:\s?(?:ribu|rb|juta|jt|k))?|\d+(?:[.,]\d+)*\s?(?:ribu|rb|juta|jt|k)\b)`;
// Nominal wajib ada setelah frasa: "biaya pelatihan Rp150.000"
export const AMOUNT = String.raw`\s*:?\s+(?:sebesar\s+|senilai\s+)?${NOMINAL}`;
// Ekor tautan: berhenti sebelum tanda baca penutup kalimat.
export const URL_TAIL = String.raw`[^\s]*[^\s.,!?)"'”]`;
