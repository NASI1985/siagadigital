# SiagaDigital

Platform edukasi dan tanggap insiden keamanan digital untuk anak muda Indonesia.
Fiturnya ada tiga: **Cek Dulu** (periksa pesan atau link mencurigakan), **Latihan** (simulasi
chat dengan penipu), dan **Bantuan** (langkah darurat, pesan peringatan, dan checklist keamanan
akun). Ditambah **SiagaBot**, asisten tanya-jawab di pojok kanan bawah setiap halaman.

Versi online: https://siagadigital.vercel.app

Aplikasi ini 100% berjalan di browser: tanpa login, tanpa backend, dan teks yang kamu tempel
tidak dikirim ke server mana pun. Satu-satunya request jaringan adalah Google Fonts.

## Cara menjalankan (Windows, cmd)

Butuh **Node.js 20 atau lebih baru**.

```cmd
cd siagadigital
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan dengan hot reload |
| `npm test` | Menjalankan semua test (`node --test`, tanpa library tambahan) |
| `npm run build` | Build produksi ke folder `dist/` |
| `npm run preview` | Menjalankan hasil build secara lokal |

## Peta folder

```
referensi/              10 screenshot desain (sumber kebenaran tampilan)
PROMPT-SiagaDigital.md  spesifikasi lengkap
src/
  main.jsx, index.css   titik masuk + token warna (variabel CSS, termasuk mode gelap)
  App.jsx               header, menu, pemilih halaman
  pages/
    Beranda.jsx, Tentang.jsx
    CekDulu/            index (state), InputStep (langkah 1-2), ResultStep (langkah 3)
    Latihan/            index, ScenarioList, ChatPanel, ReplyPanel, RiskyFeedback,
                        FinalResult, practiceReducer (+ test)
    Bantuan/            index, IncidentWizard, ActionPlan, WarningMessage, ReadinessChecklist
  data/                 KONTEN murni, tanpa React
    detectionRules.js   aturan deteksi + combo
    checkInput.js       kategori Cek Dulu, placeholder, contoh fiktif
    scenarios.js        6 skenario latihan
    emergency.js        kejadian, platform, kanal lapor, template pesan peringatan
    securityChecklist.js item checklist keamanan akun
    chatbot.js          kata kunci & teks jawaban SiagaBot
  lib/                  logika murni (tanpa React), semuanya dites
    patterns.js         helper regex kata() dan pola()
    analyzer.js         mesin pengecekan
    practice.js         aturan skor, level, lencana, log chat
    emergency.js        rencana aksi & pesan peringatan
    checklist.js        persentase & "langkah berikutnya"
    chatbot.js          otak SiagaBot: kenali niat, susun jawaban
    storage.js          baca/tulis localStorage yang aman + validasi bentuk data
    clipboard.js        salin & bagikan
  hooks/                usePersistedState, useHashRoute, usePageFocus
  components/           Card, Button, Pill, Badge, Notice, ProgressBar, Toast,
                        Eyebrow, Heading, ChoiceButton
    ChatBot/            ChatBot (tombol + state), BotPanel, BotMessage
```

## SiagaBot

SiagaBot adalah bot tanya-jawab sederhana, **bukan AI**. Ia tidak memanggil server mana pun:
pesan dicocokkan dengan kata kunci di `src/data/chatbot.js` (memakai helper `kata()` yang sama
dengan mesin pengecekan), lalu dijawab dari data yang sudah ada. Riwayat chat hanya ada di memori
dan hilang saat halaman ditutup.

Urutan keputusan bot (`respond()` di `src/lib/chatbot.js`):
1. Pesan berawalan `cek:` → isi pesannya dicek dengan analyzer.
2. Cerita "sudah kena" (udah transfer, udah kasih OTP, akun dibajak, data bocor, kepencet link)
   → langkah "Sekarang juga" dari `emergency.js` + tombol ke Bantuan dengan kejadian terpilih.
3. Bot sedang menunggu pesan (setelah "Cek pesan") → pesan dicek.
4. Pesan panjang (≥ 120 karakter) atau berisi tautan → dianggap pesan tempelan dan dicek.
5. Niat lain: "kena tipu" tanpa detail (bot bertanya kejadiannya), ciri-ciri modus (dari
   `scenarios.js` + tombol latihan), lapor, minta cek, bantuan, terima kasih, sapaan.
6. Analyzer menemukan pola penipuan → hasil cek.
7. Selain itu → bot bilang belum paham dan menawarkan tombol pertanyaan cepat.

Frasa kejadian darurat sengaja berbentuk "sudah terjadi" (`udah kasih kode`, bukan `kasih kode`)
supaya pesan penipu yang ditempel ("kasih kode OTP-nya ya kak") tidak dikira pengakuan korban.
Untuk menambah kata kunci, tambahkan frasa ke `kata(...)` yang sesuai di `src/data/chatbot.js`
lalu jalankan `npm test` (`src/lib/chatbot.test.js`).

## Cara menambah konten

### Kata deteksi baru
Buka `src/data/detectionRules.js`, cari aturan yang cocok, lalu:
- untuk **frasa biasa**, tambahkan ke `kata(...)`, misalnya `kata('segera', 'buruan', 'detik terakhir')`.
  Spasi otomatis cocok dengan satu atau lebih spasi, huruf besar-kecil diabaikan, dan batas kata dijaga.
- untuk **pola**, tambahkan potongan regex ke `pola(...)` dengan `String.raw`. Pakai grup
  non-capturing `(?:...)` dan **jangan pakai lookbehind** (`(?<=`, `(?<!`) supaya tetap jalan di Safari lama.

Aturan baru cukup ditambahkan sebagai objek `{ id, weight, title, why, patterns }`.
Bobot 3 = kuat (sorot merah), 2 = mencurigakan, 1 = lemah (sorot kuning). Di teks `why`, `{match}`
akan diganti dengan frasa pertama yang ditemukan. Setelah itu jalankan `npm test`.

### Skenario latihan baru
Tambahkan objek ke `SCENARIOS` di `src/data/scenarios.js`:

```js
{
  id: 'unik', title: 'Judul', description: 'Satu kalimat.', sender: 'Nama_Pengirim', badge: 'Anti-Sesuatu',
  steps: [
    {
      messages: ['pesan penipu'],
      options: [
        { text: 'label tombol', reply: 'gelembung chat pemain', safe: true },
        { text: '...', reply: '...', safe: false },
      ],
      explanation: 'tampil setelah pilihan aman',
      riskyExplanation: 'tampil setelah pilihan berisiko',
      missedFlags: [{ title: 'Tanda bahaya', detail: 'Kalimat konteks.' }],
      scammerReply: 'balasan penipu setelah pilihan berisiko',
    },
  ],
}
```

Setiap langkah butuh 2–3 opsi, minimal satu aman dan satu berisiko. Jumlah skenario dan langkah
dihitung otomatis dari data. Test `src/lib/practice.test.js` memvalidasi struktur ini (dan saat ini
juga mengunci jumlahnya di 6 × 5; ubah konstanta di test kalau jumlahnya memang sengaja ditambah).

### Item checklist baru
Tambahkan objek `{ id, label, nextStep, howTo }` ke `src/data/securityChecklist.js`.
`nextStep` ditulis sebagai frasa pendek huruf kecil, misalnya `'kunci profil'`.

## Penyimpanan

Hanya dua hal yang disimpan di `localStorage`:
- `siagadigital.skorLatihan.v1` → `{ idSkenario: skorTerbaik }`
- `siagadigital.checklist.v1` → `{ idItem: true }`

Kalau datanya rusak (JSON tidak valid atau bentuknya salah) atau storage diblokir, aplikasi memakai
nilai default tanpa crash (dites di `src/lib/storage.test.js`). Teks yang ditempel di Cek Dulu
**tidak pernah** disimpan.

## Keputusan desain

### Sudah diputuskan di spesifikasi (bagian 2a)
- Tombol di hasil Cek Dulu berlabel **"Periksa ulang"** dan kembali ke langkah 2 dengan teks tetap terisi.
- Tombol **"Coba contoh fiktif"** ada di bawah textarea, di atas kotak kuning.
- Toast setelah "Salin" berbunyi **"Tersalin"**.
- **"Aku sudah transfer"** membuka `#bantuan` dengan "Saya transfer uang" sudah terpilih, platform belum.
- **"Langkah berikutnya: …"** menggabungkan `nextStep` dua item pertama yang belum dicentang dengan "dan",
  atau satu frasa kalau tinggal satu.
- Pill Guardian menampilkan **"Level Guardian tercapai"** kalau sisa lencana 0.
- Badge Cek Dulu menampilkan **jumlah temuan sebenarnya**. Untuk teks contoh hasilnya **5**, karena
  `umpan-hadiah` ("terpilih sebagai admin online") ikut terdeteksi.

### Keputusan sendiri
- **Branch kerja `NASI1985`** (bukan `nasi-1985` seperti di spesifikasi), sesuai permintaan pemilik repo.
- **Vite 6.4.5**, bukan Vite 5: Vite 5 punya beberapa kerentanan di dev server (sebagian khusus Windows).
  Setelah upgrade, `npm audit` bersih.
- **Opsi latihan punya field `reply`**: teks gelembung chat pemain bisa berbeda dari label tombol
  (contoh screenshot: tombol "Minta alamat kantor…" → gelembung "Ini perusahaan apa ya?").
- **Langkah punya field `riskyExplanation`**: penjelasan setelah pilihan aman dan berisiko berbeda
  (screenshot 05 vs 06), sehingga satu field `explanation` tidak cukup.
- **Chat menampilkan seluruh riwayat** saat pilihan berisiko lalu menggulir ke pesan terbaru.
  Screenshot 06 hanya menunjukkan dua gelembung terakhir.
- **"Yang terlewat"** di hasil akhir berisi `missedFlags` dari langkah tempat pilihan berisiko diambil.
  Langkah yang tidak sempat dijawab tetap dihitung tidak aman di skor, tapi tidak dianggap "terlewat".
- **Tombol kecil "Keluar ke daftar skenario"** di panel balasan supaya pemain bisa berhenti di tengah
  skenario (tidak ada di screenshot).
- **Blok "Sekarang juga"** berisi langkah kejadian dulu, lalu langkah khusus platform, supaya tiga langkah
  pertama untuk OTP sama dengan screenshot 09.
- **Topik pesan peringatan diatur per kejadian.** Untuk kejadian OTP, topiknya loker palsu bermodus biaya
  pelatihan, persis seperti contoh nada Santai di screenshot.
- **Centang langkah darurat tidak disimpan** (hanya berlaku selama panduan terbuka, dan direset saat
  kejadian atau platform diganti). Centang checklist keamanan akun **disimpan**.
- **Checkbox asli** (`<input type="checkbox">`), bukan simbol ☑ seperti di screenshot. Blok "Lapor"
  berisi tautan, bukan checkbox.
- **Tombol "Lihat cara melakukannya"** berubah menjadi "Tutup panduan" saat panel terbuka.
- **Setiap temuan Cek Dulu menampilkan frasa yang ditemukan** ("Ditemukan: “…”", maksimal 3), dan combo
  tampil sebagai kotak merah muda dengan ikon peringatan di atas daftar.
- **Setiap kategori Cek Dulu punya contoh fiktif dan judul hasilnya sendiri** ("Link yang kamu terima",
  "Tawaran yang kamu terima", "Profil yang kamu cek").
- **Mode gelap** memakai variabel CSS. Warna teks teal dan merah dibuat lebih terang di mode gelap
  supaya kontras tetap memenuhi WCAG AA; latar tombol teal dan merah tetap sama karena teks putihnya
  sudah lolos AA.
- **Grid dua kolom** punya tinggi minimum 640px di desktop supaya proporsinya mendekati screenshot.
  Di bawah 820px, kolom menumpuk jadi satu dan menu header boleh turun ke baris kedua.
- **Fokus dan scroll** berpindah ke judul utama saat halaman atau langkah berganti, kecuali saat aplikasi
  pertama kali dimuat. Ada juga tautan "Lewati ke konten" untuk pengguna keyboard.
- **Favicon** berupa SVG inline (data URI), supaya tidak ada request 404 atau request jaringan tambahan.
- **Bagikan tips** memakai `navigator.share`. Kalau tidak tersedia, teks disalin dan muncul toast
  "Tersalin". Kalau menyalin juga gagal, muncul toast "Gagal menyalin. Coba salin manual ya".
- **SiagaBot dibuat offline (tanpa AI)** supaya janji privasi tetap utuh: tidak ada teks yang keluar
  dari browser. Panelnya layar penuh di HP dan kotak mengambang 400px mulai lebar 640px, bisa ditutup
  dengan Escape, dan tidak menyimpan riwayat. Padding bawah halaman ditambah supaya tombol bot tidak
  menutupi tombol di dasar kartu.
- **Script `npm test`** menyebut glob file test secara eksplisit
  (`src/lib/*.test.js src/pages/Latihan/*.test.js`) supaya jalan sama di Windows cmd dan Linux.

## Penafian

Hasil pengecekan hanyalah indikasi dari pola umum. Hasil “rendah” bukan bukti aman, dan skor latihan
bukan jaminan kebal tipuan. Selalu verifikasi lewat kanal resmi (cekrekening.id, OJK 157, aduannomor.id).
Semua contoh dan percakapan di aplikasi ini fiktif.
