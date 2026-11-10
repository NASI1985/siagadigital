// Potongan regex bersama untuk patterns (HANYA angka, mata uang, tautan, nomor rekening).

// Nominal uang: format rupiah, kode/simbol mata uang asing, dan nominal bersufiks mata uang.
const CURRENCY_CODES = String.raw`(?:idr|usd|eur|gbp|jpy|cny|rmb|aud|cad|sgd|myr|hkd|nzd|chf|inr|krw|thb|php|aed|sar|qar|kwd|bnd|vnd|twd|try|rub|zar|brl|mxn|sek|nok|dkk|pln|czk|huf|ils|clp|cop|ars|egp|ngn|kes|ghs|bhd|omr|jod|isk|pkr|bdt|lkr|kzt|uzs)`;
const CURRENCY_WORDS = String.raw`(?:dollars?|euros?|pounds?|yen|yuan|rupees?|won|baht|ringgit|dirhams?|riyals?|francs?|pesos?|reais)`;
const CURRENCY_SYMBOLS = String.raw`(?:US\$|CA\$|AU\$|NZ\$|HK\$|S\$|NT\$|R\$|[$€£¥₹₩₽])`;
const NUMBER = String.raw`\d+(?:[.,]\d+)*(?:\s?(?:ribu|rb|juta|jt|k))?`;
export const NOMINAL = String.raw`(?:(?:rp\.?\s?|${CURRENCY_CODES}\s?|${CURRENCY_WORDS}\s+|${CURRENCY_SYMBOLS}\s*)${NUMBER}|${NUMBER}(?:\s?(?:${CURRENCY_CODES}|${CURRENCY_WORDS})|\s*${CURRENCY_SYMBOLS})?)`;
// Nominal wajib ada setelah frasa: "biaya pelatihan Rp150.000"
export const AMOUNT = String.raw`\s*:?\s+(?:sebesar\s+|senilai\s+)?${NOMINAL}`;
// Ekor tautan: berhenti sebelum tanda baca penutup kalimat.
export const URL_TAIL = String.raw`[^\s]*[^\s.,!?)"'”]`;
