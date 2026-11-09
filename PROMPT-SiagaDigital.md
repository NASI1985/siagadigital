# TUGAS CLAUDE CODE: Bangun aplikasi "SiagaDigital" (React + Vite)

Kamu bekerja langsung di folder proyek ini. Buat semua file di disk, jalankan perintahnya,
lalu perbaiki sendiri sampai semua syarat lulus di bagian 11 terpenuhi. Kode jangan ditempel
ke chat. Tulis file-nya, jalankan, dan laporkan hasilnya.

## 00. GIT & GITHUB (WAJIB)
Konfigurasi (boleh saya ubah sebelum menjalankan):
- **Branch kerja:** `nasi-1985`
- **Repo:** remote `origin` dari folder ini (saya sudah meng-clone repo GitHub saya ke sini).

Aturan:
1. Sebelum menulis file apa pun, jalankan `git status` dan `git remote -v`. Kalau folder ini
   belum repo git atau belum punya remote `origin`, BERHENTI dan minta saya mengisi URL repo.
2. Pindah ke branch `nasi-1985`:
   - kalau sudah ada di remote: `git fetch origin` lalu `git switch nasi-1985`;
   - kalau belum ada: `git switch -c nasi-1985`.
   Jangan pernah commit langsung ke `main`/`master`.
3. Satu commit per fase (bagian 0), pesan commit berbahasa Indonesia yang jelas, misalnya
   `Fase 1: fondasi Vite, Tailwind, mesin analyzer + test`.
4. Sebelum commit, pastikan `node_modules/` dan `dist/` ada di `.gitignore`. Folder
   `referensi/` dan file prompt ini ikut di-commit.
5. Setelah setiap fase hijau, `git push -u origin nasi-1985`. Kalau push gagal karena
   otentikasi, jangan coba mengakali; laporkan pesan error-nya dan lanjutkan kerja lokal.
6. Jangan pakai `git push --force`, jangan rebase/merge branch lain, dan jangan menghapus
   branch apa pun tanpa izin saya.
7. Di akhir (bagian 12), tampilkan `git log --oneline` untuk branch ini. Kalau `gh` CLI
   tersedia dan sudah login, tawarkan (jangan langsung buat) Pull Request ke branch utama.

## 0. CARA KERJA (WAJIB DIIKUTI BERURUTAN)
1. **Baca dulu** seluruh dokumen ini dan **lihat 10 screenshot** di folder `./referensi/`
   (daftarnya ada di bagian 2). Pakai tool Read untuk membuka setiap gambar.
2. **Susun rencana** maksimal 15 baris: urutan fase, asumsi, dan keputusan atas hal yang
   belum jelas. Tampilkan rencana itu, lalu **tunggu persetujuan saya** sebelum menulis kode.
3. Kerjakan per fase. Di akhir setiap fase, jalankan pemeriksaan fase itu. Fase berikutnya
   baru boleh dimulai kalau pemeriksaan hijau.
   - **Fase 1 – Fondasi:** scaffold Vite (tulis file manual, jangan `npm create` yang
     interaktif), Tailwind v3.4, `lib/`, `data/detectionRules.js`, `analyzer.test.js`.
     Cek: `npm install`, `npm test` lulus.
   - **Fase 2 – Kerangka UI:** komponen dasar, hooks, App + router hash, Beranda, Tentang.
     Cek: `npm run build` bersih.
   - **Fase 3 – Cek Dulu** (3 langkah + hasil). Cek: build dan test.
   - **Fase 4 – Latihan:** `data/scenarios.js` (6 skenario × 5 langkah), reducer + test,
     semua layar. Cek: build dan test.
   - **Fase 5 – Bantuan:** wizard, panduan, pesan peringatan, checklist. Cek: build dan test.
   - **Fase 6 – README + verifikasi akhir** (bagian 11).
4. Commit dan push per fase sesuai bagian 00 (branch `nasi-1985`).
5. Jangan bertanya lagi untuk hal yang sudah diputuskan di dokumen ini. Kalau menemukan
   konflik baru, ambil keputusan yang paling konsisten, catat di README, lalu lanjut.
6. Jangan menghapus atau mengubah folder `referensi/` dan file prompt ini.

## 1. PERAN DAN TUJUAN
Kamu senior front-end engineer sekaligus desainer UI. Bangun SPA **SiagaDigital**, platform
edukasi dan tanggap insiden keamanan digital untuk anak muda Indonesia. Aplikasi harus bisa
dijalankan di laptop (Windows, lewat cmd) dengan `npm install` lalu `npm run dev`.
Aplikasi 100% client-side: tanpa login, tanpa backend, dan teks pengguna tidak dikirim ke
server mana pun.

## 2. SUMBER KEBENARAN
Screenshot desktop (lebar 1280px) di `./referensi/`:

| File | Layar |
|---|---|
| 01-beranda.png | Beranda |
| 02-cek-langkah-1-2.png | Cek Dulu, langkah 1 dan 2 |
| 03-cek-hasil.png | Cek Dulu, hasil (langkah 3) |
| 04-latih-daftar.png | Latihan, daftar skenario |
| 05-latih-simulasi-aman.png | Latihan, simulasi chat (pilihan aman) |
| 06-latih-umpan-balik-berisiko.png | Latihan, umpan balik pilihan berisiko |
| 07-latih-hasil-akhir.png | Latihan, hasil akhir |
| 08-bantuan-wizard.png | Bantuan, pertanyaan wizard |
| 09-bantuan-langkah-dan-pesan.png | Bantuan, langkah darurat dan pesan peringatan |
| 10-bantuan-checklist.png | Bantuan, checklist keamanan |

Kalau ada konflik, pakai urutan prioritas ini:
1. Tata letak, hierarki visual, dan teks UI mengikuti screenshot. Salin teks Bahasa Indonesia
   persis, kecuali yang sudah diputuskan di bagian 2a.
2. Nilai warna hex mengikuti token di bagian 4 (warna di screenshot hanya perkiraan).
3. Layar yang tidak ada di screenshot (mobile, state kosong, mode gelap) kamu putuskan
   sendiri secara konsisten, lalu dicatat di README.

### 2a. Konflik yang SUDAH diputuskan
- Tombol di halaman hasil Cek Dulu: screenshot menulis "Periksa", tetapi labelnya
  **"Periksa ulang"**. Tombol ini kembali ke langkah 2 dengan teks tetap terisi.
- Tombol "Coba contoh fiktif" tidak terlihat di screenshot langkah 2, tetapi **tetap dibuat**.
  Letakkan sebagai tombol kecil di bawah textarea, di atas kotak kuning.
- Toast setelah tombol "Salin" berbunyi **"Tersalin"**.
- "Aku sudah transfer" membuka `#bantuan` dengan kejadian "Saya transfer uang" sudah terpilih.
  Platform **belum** terpilih, jadi pengguna tetap memilih platform dulu.
- "Langkah berikutnya: …" di checklist memakai field `nextStep` (frasa pendek huruf kecil)
  dari item pertama yang belum dicentang. Contoh dari screenshot: dua item pertama yang
  belum dicentang digabung dengan "dan", menjadi "kunci profil dan tinjau izin aplikasi."
  Kalau hanya tersisa satu item, tampilkan satu frasa saja.
- Pill "Guardian: N lencana lagi": kalau N = 0, tampilkan "Level Guardian tercapai".
- Badge di hasil Cek Dulu menampilkan **jumlah temuan sebenarnya**. Untuk teks contoh di
  screenshot, angkanya boleh 5 (misalnya karena `umpan-hadiah` ikut terdeteksi), asalkan
  empat temuan wajib ada.

## 3. TECH STACK (WAJIB)
- React 18 + Vite, JavaScript (bukan TypeScript). `package.json` memakai `"type": "module"`
  dan `"engines": { "node": ">=20" }`.
- Script: `dev`, `build`, `preview`, `test` (`node --test`). Pastikan `npm test` berjalan di
  Windows cmd. Kalau penemuan otomatis file test bermasalah, sebut path file test secara
  eksplisit di script.
- Tailwind CSS **v3.4** (bukan v4) dengan postcss + autoprefixer + `tailwind.config.js`.
  Token warna didaftarkan di `theme.extend.colors`.
- lucide-react untuk ikon: Check, TriangleAlert (alias lama AlertTriangle), Shield, Copy,
  Share2. Periksa nama ekspor yang benar-benar tersedia di versi yang terpasang.
- Router hash buatan sendiri (`#beranda`, `#cek`, `#latih`, `#bantuan`, `#tentang`). Tanpa
  react-router. Hash tak dikenal kembali ke beranda. Sub-langkah di dalam halaman memakai
  state, bukan hash.
- State: useState / useReducer / Context saja. Tanpa library state.
- Font: Plus Jakarta Sans (Google Fonts via `<link>` di index.html), fallback system-ui.
- Penyimpanan: localStorage dengan try/catch dan validasi bentuk data. Kalau data rusak
  atau storage diblokir, pakai nilai default tanpa crash.
- Dependency runtime hanya react, react-dom, dan lucide-react. Dev dependency hanya yang
  perlu untuk Vite, plugin React, Tailwind, postcss, dan autoprefixer.
- Test memakai `node --test` bawaan Node, tanpa library test. Karena itu semua import di
  `lib/`, `data/`, dan `practiceReducer.js` WAJIB memakai ekstensi `.js`
  (contoh: `'../data/detectionRules.js'`) dan tidak boleh berisi JSX.

## 4. DESIGN TOKENS
Background `#F8F9FA` | Primary teal `#0D6E5D` | tint teal `#E3F1EF` | Danger `#C02626` |
tint merah `#FDE9E7` | Ink/slate `#1A2B27` | teks redup `#4A5D58` | border `#D9DEDB` |
banner penafian bg `#FFF1D6`, teks `#6B4A0A` | sorotan kuning `#FFD9A0` | sorotan merah
`#F6B5AD` | oranye garis fase "Hari ini" `#B45309`.

Tipografi: H1 `clamp(36px,7vw,64px)` weight 800, tracking rapat; H2 28–30px weight 800;
eyebrow 12px bold UPPERCASE dengan letter-spacing lebar; isi 15–17px.
Radius: kartu besar 16–24px, tombol/input/pilihan 12px, pill/badge penuh.
Gaya: modern berbasis kartu, bersih. Padding luar halaman 48px (desktop) / 16–24px (mobile).
Jarak antarkolom 32px (desktop). Padding dalam kartu 28–32px.
Mode gelap otomatis lewat `prefers-color-scheme` (variabel CSS atau kelas `dark:` dengan
`darkMode: 'media'`). Kontras di mode gelap tetap memenuhi WCAG AA.

## 5. ARSITEKTUR
```
src/
  main.jsx, index.css
  App.jsx                    header, menu, pemilih halaman
  pages/ Beranda.jsx, Tentang.jsx
         CekDulu/  index.jsx, InputStep.jsx, ResultStep.jsx
         Latihan/  index.jsx, ScenarioList.jsx, ChatPanel.jsx, ReplyPanel.jsx,
                   FinalResult.jsx, practiceReducer.js, practiceReducer.test.js
         Bantuan/  index.jsx, IncidentWizard.jsx, ActionPlan.jsx, WarningMessage.jsx,
                   ReadinessChecklist.jsx
  data/    detectionRules.js, checkInput.js, scenarios.js, emergency.js,
           securityChecklist.js        <- KONTEN murni, tanpa React
  lib/     analyzer.js, analyzer.test.js, patterns.js, practice.js, clipboard.js
  hooks/   usePersistedState.js, useHashRoute.js
  components/ Card, Button (varian: primary, outline, dark, danger, light), Pill, Badge,
           Notice, ProgressBar, Toast (Context + useToast)
```
Prinsip:
- Konten ada di `data/`. Logika murni ada di `lib/` (tanpa React, dilengkapi test).
- Komponen kecil, idealnya kurang dari 120 baris.
- Nama variabel/fungsi deskriptif dalam bahasa Inggris. Komentar dalam bahasa Indonesia yang
  sederhana.
- Tidak ada angka ajaib: jumlah skenario, langkah, dan item checklist selalu dihitung dari
  panjang array datanya.
- Tidak ada gaya inline yang berulang.

README.md berbahasa Indonesia berisi: cara menjalankan (Windows cmd), peta folder, cara
menambah kata deteksi / skenario / item checklist, dan daftar keputusan desain (bagian 2a
plus keputusanmu sendiri).

## 6. LAYOUT UMUM
- Header sticky: logo "Siaga" (ink) + "Digital" (teal), bold sekitar 22px, di kiri. Menu di
  kanan: Cek Dulu, Latihan, Bantuan, Tentang (14–15px semibold, item aktif bergaris bawah,
  `aria-current="page"`). Klik logo menuju `#beranda`.
- Halaman fitur memakai 2 kolom dengan tinggi sama. Tombol aksi utama menempel di dasar
  kartu (`mt-auto`). Di layar di bawah 820px kolom menumpuk jadi satu.
- Mobile: tanpa scroll horizontal, target sentuh minimal 44px, menu header boleh wrap.

## 7. SPESIFIKASI LAYAR

### Beranda (01-beranda.png)
H1 "Kenali tipuan sebelum kamu klik." (2 baris di desktop), lalu subjudul "Cek pesan
mencurigakan, latih instingmu lewat simulasi, dan tahu langkah pasti kalau sudah terlanjur
kena. Tanpa login, tanpa data pribadi."
Tiga kartu fitur (teks persis seperti di screenshot):
- **01 · KENALI**: kartu teal penuh, teks putih, tombol putih teks teal "Periksa sekarang"
  menuju `#cek`.
- **02 · LATIH**: kartu putih border 2px ink, tombol ink "Mulai latihan" menuju `#latih`.
- **03 · BERTINDAK**: kartu tint merah border 2px merah, tombol merah "Lihat langkahnya"
  menuju `#bantuan`.

Di bawahnya, banner kuning penafian dengan ikon TriangleAlert: "Hasil pengecekan hanyalah
indikasi dari pola umum. Hasil “rendah” bukan bukti aman. Selalu verifikasi lewat kanal
resmi."

### Cek Dulu (02, 03)
**Langkah 1** (kartu kiri, eyebrow "KENALI · LANGKAH 1 DARI 3", judul "Apa yang mau
dicek?"): 4 pilihan, yaitu Pesan (WhatsApp, DM, SMS); Link atau URL; Tawaran kerja atau
investasi; Profil akun. Pilihan terpilih berlatar tint teal dengan border teal 2px. Pakai
`aria-pressed`. Default: Pesan.

**Langkah 2** (kartu kanan, eyebrow "LANGKAH 2 · TEMPEL TEKS", judul "Tempel pesannya"):
textarea dengan placeholder berbeda per kategori (diambil dari `data/checkInput.js`), tombol
kecil "Coba contoh fiktif" (mengisi contoh sesuai kategori), kotak kuning "Hapus nama, nomor,
dan rekening asli dulu. Teks diproses di browsermu dan tidak dikirim ke server.", lalu tombol
teal penuh di dasar kartu "Periksa (langkah 3: lihat hasil)". Kalau teks kosong atau hanya
spasi, muncul toast "Tempel teksnya dulu ya".

**Langkah 3, hasil** (2 kolom):
- Kiri (tanpa latar kartu): eyebrow "CEK DULU · PESAN" (kata terakhir mengikuti kategori),
  H2 "Pesan yang kamu terima", kotak putih ber-border berisi teks dengan sorotan
  (`<mark>`), catatan kecil "Contoh fiktif. Hapus nama, nomor, dan rekening asli sebelum
  menempel.", dan tombol teal "Periksa ulang".
- Kanan (kartu putih): "Kewaspadaan: Tinggi/Sedang/Rendah" + badge merah "N tanda bahaya".
  Daftar temuan dipisah garis tipis: judul tebal + alasan, lalu frasa yang ditemukan. Combo
  tampil sebagai kotak peringatan khusus di atas daftar. Dua tombol di dasar kartu:
  "Latih skenario serupa" (outline, menuju `#latih`) dan "Aku sudah transfer" (merah, lihat
  2a). Catatan kecil: "Indikasi saja, bukan bukti. Verifikasi lewat kanal resmi."
- Kalau levelnya Rendah, tampilkan "Kewaspadaan: Rendah" + kalimat "Tidak ada pola umum
  penipuan yang terdeteksi, tapi ini bukan bukti aman. Tetap verifikasi lewat kanal resmi."
  dan badge tidak ditampilkan.

Teks contoh di screenshot (pakai sebagai contoh fiktif kategori Pesan):
"Selamat! Kamu terpilih sebagai admin online, gaji Rp8.000.000/bulan tanpa pengalaman.
Transfer biaya pelatihan Rp150.000 hari ini saja, lalu kirim kode OTP untuk verifikasi."
Sorotan kuning: "terpilih sebagai admin online", "Rp8.000.000/bulan tanpa pengalaman",
"hari ini saja". Sorotan merah: "biaya pelatihan Rp150.000", "kirim kode OTP".
Temuan minimal beserta judul tampilannya:
- Biaya di muka. "Perusahaan resmi tidak meminta uang dari pelamar."
- Minta kode OTP. "OTP tidak boleh dibagikan ke siapa pun."
- Gaji tidak masuk akal. "Imbalan besar tanpa syarat adalah umpan umum."
- Tekanan waktu. "“Hari ini saja” dipakai agar kamu tidak sempat berpikir." (kutipan diisi
  dari frasa yang ditemukan)

### Latihan (04–07)
**Daftar:** eyebrow "LATIH · DAFTAR SKENARIO" + H2 "Pilih skenario latihan" di kiri, pill
ink "Level Pemula · 1 dari 6 selesai" di kanan (dihitung dari data dan progres). Grid 3×2
kartu putih (judul, deskripsi, status di dasar). Seluruh kartu adalah `<button>`. Kartu yang
selesai: border teal 2px + "Selesai · 80%" berwarna teal. Kartu yang belum: "Mulai".

Enam skenario beserta deskripsinya:
1. Loker Palsu (pengirim HRD_Karir): "Admin online gaji tinggi, minta biaya pelatihan."
2. Giveaway Palsu: "Akun brand minta isi data dan klik tautan."
3. Teman Dibajak: "“Teman” minta pulsa darurat lewat chat."
4. Pinjol Ilegal: "Dana cepat dengan akses kontak dan galeri."
5. Paket Kurir Palsu: "Diminta pasang file apk untuk lacak paket."
6. Investasi Instan: "Grup Telegram penuh testimoni profit."

**Chat (05):**
- Kiri, kartu putih: eyebrow "LATIHAN · SKENARIO 1 DARI 6 · LOKER PALSU", progress bar teal,
  gelembung abu dari penipu (nama pengirim tebal di gelembung pertama), gelembung teal rata
  kanan untuk balasan pemain, dan catatan "Semua percakapan fiktif untuk latihan." di dasar
  kartu. Chat memakai `aria-live="polite"` dan otomatis scroll ke pesan terbaru.
- Kanan (tanpa latar kartu): "Kamu mau balas apa?" + 2–3 pilihan balasan.
- **Pilihan aman:** pilihan terpilih berlatar tint teal. Muncul kotak tint berisi "Pilihan
  aman." (teal tebal + ikon Check) dan penjelasan, lalu tombol ink penuh "Lanjut ke pesan
  berikutnya". Di langkah terakhir tombolnya "Lihat hasil akhir".

**Pilihan berisiko (06):** balasan pemain dan balasan penipu (`scammerReply`) muncul di chat.
Eyebrow kiri berubah menjadi "LATIH · UMPAN BALIK PILIHAN BERISIKO". Kotak pink di dasar kiri
berisi "Dalam simulasi ini, uangmu hilang dan akunmu bisa diambil alih." Kolom kanan menjadi
kartu ber-border merah 2px: judul merah "Pilihan berisiko", penjelasan, kotak abu "Tanda
bahaya yang terlewat" berisi bullet, lalu tombol "Ulangi skenario" (outline) dan "Lanjut ke
ringkasan" (ink). Pilihan berisiko MENGAKHIRI putaran, dan langkah yang belum dijawab dihitung
tidak aman.

**Hasil akhir (07):**
- Kiri, kartu teal: eyebrow "HASIL AKHIR · LOKER PALSU", "Level: Waspada" besar, "4 dari 5
  keputusan aman (80%)", progress bar putih, pill putih "Lencana Anti-Loker Palsu" (hanya
  jika lulus), pill teal gelap "Guardian: 2 lencana lagi", dan catatan di dasar "Skor adalah
  latihan, bukan jaminan kebal tipuan."
- Kanan, kartu putih: "Yang terlewat" (judul merah tebal + kalimat konteks, misalnya
  'Tekanan waktu. Kamu sempat membalas saat diburu “slot tinggal 2”.'). Kalau tidak ada yang
  terlewat, tampilkan "Tidak ada tanda bahaya yang terlewat. Mantap!". Berikutnya "Tips kunci"
  (kotak tint: "Kalau diminta uang atau OTP, berhenti. Verifikasi lewat kanal resmi."), lalu
  tombol "Coba skenario lain" (outline) dan "Bagikan tips ke teman" (ink;
  `navigator.share`, dengan fallback salin + toast "Tersalin").

**Aturan skor** (semua konstanta di `lib/practice.js`, bukan di komponen):
- skor = `round(aman / jumlahLangkah * 100)`. Setiap skenario punya 5 langkah, tetapi kode
  HARUS membaca jumlah langkah dari data.
- Level: 100 = Siaga; 60–99 = Waspada; di bawah 60 = Rawan. Lencana didapat jika skor ≥ 60.
- Level pemain: 0–1 lencana = Pemula, 2 = Siaga, 3 atau lebih = Guardian.
  "Guardian: N lencana lagi" dengan N = `max(0, 3 - jumlahLencana)`.
- Skor per skenario disimpan di localStorage sebagai `{ idSkenario: skor }`. Skor yang
  disimpan adalah skor terbaik, bukan skor terakhir.

**Struktur data skenario:**
`{ id, title, description, sender, badge, steps: [{ messages[], options: [{ text, safe }],
explanation, missedFlags: [{ title, detail }], scammerReply }] }`.
Setiap langkah punya 2–3 opsi (minimal satu aman dan satu berisiko). Tulis sendiri 5 langkah
yang realistis untuk setiap skenario, dengan tanda bahaya yang berbeda di tiap langkah (biaya
di muka, tekanan waktu, minta OTP, tautan/apk, minta data, akses kontak, testimoni palsu, dan
seterusnya). Langkah 1 Loker Palsu memakai teks persis seperti screenshot 05 dan 06. Semua
contoh FIKTIF: tanpa nama, nomor, atau merek asli.

**practiceReducer** (useReducer) dengan aksi: `start`, `pick`, `next`, `retry`, `finish`,
`exit`. Pick kedua di langkah yang sama diabaikan. Tulis `practiceReducer.test.js` yang
menguji setiap aksi, termasuk aturan "berisiko mengakhiri putaran" dan pick ganda.

### Bantuan (08–10)
**Wizard (08):** dua kartu dengan eyebrow merah ("BERTINDAK · PERTANYAAN 1 DARI 2" dan
"PERTANYAAN 2 DARI 2").
- "Apa yang terjadi?": Saya klik link mencurigakan; Saya memberikan kode OTP; Saya transfer
  uang; Data pribadi saya bocor; Akun saya dibajak.
- "Di platform apa?": WhatsApp; Instagram atau TikTok; Bank atau e-wallet; Lainnya.
- Tombol merah "Tampilkan langkahku". Kalau belum lengkap, muncul toast "Jawab kedua
  pertanyaan dulu ya".

**Panduan (09):**
- Kiri: eyebrow "BANTUAN · AKU SUDAH KENA TIPU", H2 "Kejadian: kode OTP terlanjur diberikan"
  (judul per kejadian diambil dari `data/emergency.js`). Ada 3 blok bergaris kiri 5px:
  - "Sekarang juga (0–1 jam)", garis merah: langkah khusus platform + langkah kejadian.
  - "Hari ini", garis oranye.
  - "Lapor", garis teal: tautan cekrekening.id, OJK 157 (`href="tel:157"`), dan
    aduannomor.id (tab baru, `rel="noopener noreferrer"`).

  Langkah-langkahnya berupa checkbox interaktif (`<input type="checkbox">` + `<label>`).
  Mengganti kejadian mereset centang. Ada tombol kecil "Ubah jawaban" untuk kembali ke
  wizard. Catatan di dasar: "Periksa ulang kanal resmi sebelum menghubungi."
- Kanan: "Peringatkan teman & keluarga". Pill nada: Santai (aktif = ink penuh), Untuk orang
  tua, Grup kelas. Kotak preview abu berubah sesuai nada dan kejadian (template dengan
  placeholder `{topic}`). Contoh nada Santai: "Hati-hati, lagi marak loker palsu bermodus
  biaya pelatihan. Ciri-cirinya: gaji tinggi tanpa syarat, minta transfer duluan, dan memaksa
  cepat. Jangan kasih OTP ke siapa pun!" Tombol "Salin" (outline, ikon Copy, toast
  "Tersalin") dan "Bagikan ke WhatsApp" (teal, ikon Share2, link
  `https://wa.me/?text=<encodeURIComponent>`, tab baru).

**Checklist kesiapan (10):** tampil di bawah wizard/panduan pada halaman `#bantuan`.
- Kiri: eyebrow merah "BERTINDAK · CHECKLIST KEAMANAN AKUN", judul "Cek perlindunganmu", dan
  6 item: Verifikasi 2 langkah aktif; Kata sandi unik tiap akun; Nomor HP tidak tampil
  publik; Profil dikunci atau privat; Izin aplikasi sudah ditinjau; Perangkat tak dikenal
  sudah dikeluarkan. Setiap item punya `id` unik, `label`, `nextStep`, dan `howTo`.
- Kanan, kartu teal: "KESIAPAN PERLINDUNGAN", angka persen besar, progress bar, "Langkah
  berikutnya: …" (lihat 2a), dan tombol putih "Lihat cara melakukannya" yang membuka panel
  `howTo` item pertama yang belum dicentang. Pada 100% tampil "Mantap! Semua perlindungan
  dasar sudah aktif." dan tombolnya hilang.
- Centang disimpan di localStorage sebagai `{ idItem: true }`.

### Tentang
Penjelasan singkat tentang tujuan aplikasi, privasi (semua diproses di browser), dan
penafian. Gunakan kartu yang sama gayanya dengan halaman lain.

## 8. MESIN PENGECEKAN (bagian paling penting)
Mesin ini bukan AI, melainkan pencocokan kata/pola berbobot. Logikanya di `lib/analyzer.js`
(fungsi murni) dan datanya di `data/detectionRules.js` (hanya data).

Helper `kata('a', 'b c')` di `lib/patterns.js` membuat regex yang berbatas kata, tidak peka
huruf besar-kecil, menganggap spasi cocok dengan `\s+`, dan mencoba frasa terpanjang lebih
dulu. Pencocokan memakai `matchAll`; flag `g` ditambahkan otomatis kalau terlupa. JANGAN
memakai lookbehind regex (supaya jalan di Safari lama). Batas kata dibuat manual dengan grup
`(^|[^\p{L}\p{N}])` atau sejenisnya, lalu offset disesuaikan.

Output `analyze(text)`: `{ segments[{text, weight}], findings[{rule, matches[<=3]}],
combos[], score, level }`.
- Bobot 3 = kuat (sorot merah), 2 = mencurigakan, 1 = lemah (sorot kuning). Bobot 0 berarti
  teks biasa.
- Skor = jumlah bobot aturan yang ditemukan (satu aturan dihitung sekali).
  0 = `'rendah'`, 1–2 = `'sedang'`, ≥ 3 = `'tinggi'`.
- Kalau sorotan bertumpuk, bobot lebih besar menang, lalu yang lebih panjang.
- `segments.map(s => s.text).join('')` HARUS sama persis dengan teks asli.

Aturan minimal (id: bobot):
- `uang-di-muka`:3 — biaya pendaftaran/registrasi/admin/pelatihan, uang muka, deposit,
  tebusan, ongkir, pajak pencairan; pola "pembayaran/bayar/setor/transfer/tf …
  pendaftaran/registrasi/seragam/aktivasi/jaminan"; "transfer dulu"/"bayar di awal".
  Nominal setelah frasa biaya (misalnya "biaya pelatihan Rp150.000") ikut disorot.
- `rekening-pribadi`:3 — tf/trf/transfer/kirim … bca/bri/bni/bsi/mandiri/dana/ovo/gopay/
  rekening/norek; "norek 04232346", "no. rekening: 123…".
- `kode-rahasia`:3 — OTP, kode verifikasi, kode SMS, CVV, password, kata sandi, "kirim PIN"
  (frasa "kirim kode OTP" disorot utuh).
- `data-sensitif`:2 — KTP, NIK, kartu kredit, selfie KTP.
- `imbalan-tidak-wajar`:2 — "$2000 per jam", "Rp500.000/hari",
  "gaji Rp8.000.000/bulan tanpa pengalaman", tanpa pengalaman/interview/tes, komisi per tugas,
  like dan subscribe.
- `untung-pasti`:2 — "untung 30%", "bunga 1% per hari", pasti untung, tanpa risiko,
  member VIP.
- `tautan`:2 — http(s), www, bit.ly, t.me, wa.me, s.id, .apk.
- `menyamar`:2 — mengaku petugas bank/polisi/bea cukai.
- `rahasia`:2 — jangan beri tahu, rahasiakan.
- `atas-nama`:1 — "a.n. Andina", "atas nama X".
- `umpan-hadiah`:1 — "Selamat, kamu terpilih/menang/mendapatkan…", "terpilih sebagai …".
- `luar-negeri`:1 — "pekerjaan terbaik di Amerika", kerja di Dubai/Jepang/luar negeri.
- `tekanan-waktu`:1 — segera, buruan, hari ini saja, slot tinggal N, hangus, N menit lagi.

Setiap aturan punya `title` (judul tampilan, misalnya "Biaya di muka", "Minta kode OTP",
"Gaji tidak masuk akal", "Tekanan waktu") dan `why` (alasan singkat).

COMBOS (peringatan khusus kalau beberapa aturan muncul bersama), minimal:
- `loker-palsu`: imbalan-tidak-wajar + uang-di-muka → "Pola khas loker palsu"
- uang-di-muka + rekening-pribadi → "Jangan transfer sebelum cek rekening di cekrekening.id"
- umpan-hadiah + tautan → pola phishing
- untung-pasti + tekanan-waktu → pola investasi bodong

`analyzer.test.js` (node --test). Semua test WAJIB lulus:
- **A.** Teks berikut harus menghasilkan level `'tinggi'`, menemukan `uang-di-muka`,
  `rekening-pribadi`, `imbalan-tidak-wajar`, `luar-negeri`, dan combo `loker-palsu`:
  "selamat anda mendapatkan peluang untuk mendapatkan pekerjaan terbaik di amerika dengan
  pembayaran seharga $2000 per jam, untuk mengikuti kami membutuhkan pembayaran untuk proses
  pendaftaran agar lancar dan sentosa. bisa tf langsung dari bsi a.n. andina dengan norek
  04232346"
- **B.** Teks contoh Cek Dulu (bagian 7) harus menghasilkan `'tinggi'` dengan temuan
  `uang-di-muka`, `kode-rahasia`, `imbalan-tidak-wajar`, `tekanan-waktu`. Uji juga bahwa
  frasa-frasa sorotan di bagian 7 muncul sebagai segmen dengan bobot yang benar (merah = 3,
  kuning = 1 atau 2).
- **C.** "Halo, besok kita makan siang jam 12 ya." harus menghasilkan `'rendah'` dengan
  0 temuan.
- **D.** `segments` digabung harus sama dengan teks asli untuk teks kosong, teks biasa,
  teks penipuan, dan teks dengan emoji/baris baru.
- **E.** "TF DULU ya ke BCA 123" dan "Klik bit.ly/hadiah" harus terdeteksi (tidak peka huruf
  besar-kecil).

## 9. AKSESIBILITAS DAN KUALITAS UI
`lang="id"`; elemen semantik (`button` untuk aksi, `a` untuk navigasi); focus ring yang
jelas; `aria-live="polite"` pada chat dan toast; `role="progressbar"` + `aria-valuenow`/
`aria-valuemin`/`aria-valuemax` pada progress bar; kontras teks memenuhi WCAG AA; hormati
`prefers-reduced-motion`; tidak ada tombol mati (setiap tombol berfungsi, atau tidak
ditampilkan sama sekali). Saat berpindah halaman/langkah, scroll ke atas dan fokus pindah ke
judul utama.

## 10. PRIVASI DAN JARINGAN
Satu-satunya request jaringan adalah Google Fonts. Tidak ada analytics, tidak ada `fetch`.
Teks yang ditempel tidak disimpan ke localStorage dan tidak keluar dari browser.

## 11. VERIFIKASI AKHIR (jalankan sendiri, jangan cuma diasumsikan)
Jalankan dan tunjukkan ringkasan output-nya:
- [ ] `npm install` sukses.
- [ ] `npm test`: semua test lulus (analyzer + practiceReducer + test lain di `lib/`).
- [ ] `npm run build`: tanpa error dan tanpa warning.
- [ ] `grep` untuk `TODO`, `FIXME`, `...` di tempat kode, dan `console.log` di `src/` hasilnya
      kosong (kecuali `...` yang memang spread operator atau teks UI yang sah).
- [ ] Semua import valid; nama file dan huruf besar-kecilnya cocok (penting untuk build di
      Linux/Vercel). Import di `lib/`, `data/`, dan `practiceReducer.js` memakai `.js`.
- [ ] Jumlah skenario 6, setiap skenario 5 langkah, setiap langkah 2–3 opsi dengan minimal
      satu aman dan satu berisiko. Verifikasi dengan skrip kecil atau test, jangan dengan
      mata saja.
- [ ] localStorage rusak (isi JSON tidak valid / bentuk salah) tidak membuat crash. Buktikan
      dengan test di `usePersistedState` atau helper validasi di `lib/`.
- [ ] Kalau tersedia tool browser atau screenshot: buka `npm run preview`, cek console
      (StrictMode tanpa error/warning), bandingkan tampilan 1280px dengan screenshot
      referensi, dan pastikan tidak ada scroll horizontal di 375px. Kalau tool itu tidak
      tersedia, tulis daftar cek manual untuk saya di laporan akhir.

## 12. LAPORAN AKHIR
Setelah semua fase selesai, tulis laporan singkat:
1. Ringkasan apa yang dibangun (maksimal 10 baris).
2. Hasil `npm test` dan `npm run build`.
3. Daftar centang bagian 11. Sebutkan dengan jujur apa yang belum terpenuhi atau belum bisa
   kamu verifikasi sendiri.
4. Keputusan desain yang kamu ambil sendiri (juga tercatat di README).
5. Perintah untuk saya jalankan: `npm run dev`, lalu buka alamat yang muncul di terminal.
