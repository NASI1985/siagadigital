// Skenario latihan. Semua percakapan FIKTIF: tanpa nama, nomor, atau merek asli.
// Struktur langkah:
//   messages      pesan dari penipu
//   options       { text: label tombol, reply: gelembung chat pemain, safe }
//   explanation   penjelasan setelah pilihan aman
//   riskyExplanation  penjelasan setelah pilihan berisiko
//   missedFlags   tanda bahaya yang terlewat kalau memilih berisiko
//   scammerReply  balasan penipu setelah pilihan berisiko

export const PRACTICE_TIP = 'Kalau diminta uang atau OTP, berhenti. Verifikasi lewat kanal resmi.';

export const SCENARIOS = [
  {
    id: 'loker-palsu',
    title: 'Loker Palsu',
    description: 'Admin online gaji tinggi, minta biaya pelatihan.',
    sender: 'HRD_Karir',
    badge: 'Anti-Loker Palsu',
    steps: [
      {
        messages: [
          'Hai! CV kamu lolos seleksi admin online WFH, gaji Rp8 juta. Tinggal bayar biaya pelatihan Rp150 ribu.',
          'Slot tinggal 2 orang, bayar hari ini ya!',
        ],
        options: [
          { text: 'Transfer biar dapat slot', reply: 'Oke, saya transfer sekarang.', safe: false },
          { text: 'Minta alamat kantor dan cek di situs resmi', reply: 'Ini perusahaan apa ya?', safe: true },
          { text: 'Blokir dan laporkan', reply: 'Maaf, saya tidak tertarik. Nomor ini saya laporkan.', safe: true },
        ],
        explanation:
          'Verifikasi dulu lewat kanal resmi menghentikan tekanan waktu. Tanda bahaya: biaya di muka dan batas waktu.',
        riskyExplanation:
          'Transfer sebelum verifikasi adalah pola utama loker palsu. Perusahaan resmi tidak memungut biaya dari pelamar.',
        missedFlags: [
          { title: 'Biaya di muka', detail: 'Kamu diminta bayar “biaya pelatihan” sebelum mulai kerja.' },
          { title: 'Tekanan waktu', detail: 'Kamu sempat membalas saat diburu “slot tinggal 2”.' },
          { title: 'Gaji tak masuk akal', detail: 'Gaji Rp8 juta untuk admin online tanpa seleksi yang jelas.' },
        ],
        scammerReply: 'Sudah masuk! Sekarang kirim kode OTP untuk aktivasi akun pelatihan.',
      },
      {
        messages: ['Kantor kami sedang renovasi. Biar cepat, isi formulir data diri di link ini ya: bit.ly/form-hrd-fiktif'],
        options: [
          { text: 'Isi formulir lewat link itu', reply: 'Oke, sudah saya isi.', safe: false },
          { text: 'Cari lowongan ini di situs karier resmi perusahaan', reply: 'Saya cek dulu di situs resminya ya.', safe: true },
        ],
        explanation: 'Lowongan asli bisa ditemukan di situs atau akun resmi perusahaan. Tanda bahaya: tautan pendek.',
        riskyExplanation: 'Link pendek bisa membawa ke formulir palsu yang mencuri datamu.',
        missedFlags: [{ title: 'Tautan mencurigakan', detail: 'Kamu mengisi formulir dari link pendek yang tidak jelas asalnya.' }],
        scammerReply: 'Data kamu sudah kami terima. Sekarang tinggal transfer biaya pelatihan.',
      },
      {
        messages: ['Untuk kontrak kerja, kirim foto KTP dan selfie sambil pegang KTP ya.'],
        options: [
          { text: 'Kirim foto KTP dan selfie', reply: 'Ini foto KTP dan selfie saya.', safe: false },
          { text: 'Tolak, data diberikan setelah ada kontrak resmi', reply: 'Saya kirim data setelah tanda tangan kontrak di kantor ya.', safe: true },
        ],
        explanation: 'Data KTP diserahkan lewat proses rekrutmen resmi, bukan lewat chat. Tanda bahaya: minta data sensitif.',
        riskyExplanation: 'Foto KTP dan selfie bisa dipakai untuk mengajukan pinjol atas namamu.',
        missedFlags: [{ title: 'Minta data pribadi', detail: 'Kamu mengirim foto KTP dan selfie ke orang yang belum jelas.' }],
        scammerReply: 'Oke, datanya sudah kami pakai. Jangan kaget kalau ada SMS tagihan ya.',
      },
      {
        messages: ['Kalau keberatan, biaya bisa dipotong dari gaji pertama. Tapi transfer jaminan Rp50 ribu dulu ke rekening pribadi HRD ya.'],
        options: [
          { text: 'Transfer Rp50 ribu, kan kecil', reply: 'Ya sudah, saya transfer Rp50 ribu.', safe: false },
          { text: 'Tanya kenapa rekening pribadi, lalu cek di cekrekening.id', reply: 'Kenapa ke rekening pribadi? Saya cek dulu.', safe: true },
          { text: 'Hentikan percakapan', reply: 'Saya tidak jadi lanjut, terima kasih.', safe: true },
        ],
        explanation: 'Perusahaan resmi memakai rekening atas nama perusahaan, dan nomor rekening bisa dicek di cekrekening.id.',
        riskyExplanation: 'Nominal kecil dipakai supaya kamu lengah. Setelah transfer pertama, permintaan biasanya bertambah.',
        missedFlags: [{ title: 'Rekening pribadi', detail: 'Uang diminta ke rekening pribadi, bukan rekening perusahaan.' }],
        scammerReply: 'Makasih! Ternyata ada biaya seragam Rp200 ribu lagi ya.',
      },
      {
        messages: ['Terakhir, kami kirim kode OTP ke HP kamu untuk aktivasi akun karyawan. Sebutkan kodenya dalam 5 menit ya!'],
        options: [
          { text: 'Sebutkan kode OTP-nya', reply: 'Ini kodenya.', safe: false },
          { text: 'Jangan berikan, OTP hanya untuk kamu', reply: 'Maaf, OTP tidak saya berikan ke siapa pun.', safe: true },
        ],
        explanation: 'OTP adalah kunci akunmu. Tidak ada perusahaan resmi yang memintanya.',
        riskyExplanation: 'Dengan OTP, pelaku bisa mengambil alih akun WhatsApp atau e-wallet-mu.',
        missedFlags: [
          { title: 'Minta kode OTP', detail: 'Kamu memberikan OTP kepada orang yang mengaku HRD.' },
          { title: 'Tekanan waktu', detail: 'Kamu sempat membalas saat diburu “dalam 5 menit”.' },
        ],
        scammerReply: 'Berhasil! Akunmu sekarang kami pegang.',
      },
    ],
  },
  {
    id: 'giveaway-palsu',
    title: 'Giveaway Palsu',
    description: 'Akun brand minta isi data dan klik tautan.',
    sender: 'Official_HadiahKita',
    badge: 'Anti-Giveaway Palsu',
    steps: [
      {
        messages: ['Selamat! Akunmu terpilih jadi pemenang giveaway HP terbaru dari kami 🎉', 'Klaim hadiahmu sebelum 1 jam lagi ya!'],
        options: [
          { text: 'Langsung balas, mau klaim!', reply: 'Wah, mau! Gimana caranya?', safe: false },
          { text: 'Cek pengumuman pemenang di akun resminya', reply: 'Pengumumannya di unggahan mana ya?', safe: true },
          { text: 'Abaikan, aku tidak pernah ikut', reply: 'Saya tidak pernah ikut giveaway ini.', safe: true },
        ],
        explanation: 'Akun resmi mengumumkan pemenang di unggahan publiknya. Tanda bahaya: menang tanpa ikut dan batas waktu.',
        riskyExplanation: 'Membalas dengan antusias membuat penipu tahu kamu mudah dipancing.',
        missedFlags: [
          { title: 'Umpan hadiah', detail: 'Kamu “menang” padahal tidak pernah ikut.' },
          { title: 'Tekanan waktu', detail: 'Hadiah harus diklaim “sebelum 1 jam lagi”.' },
        ],
        scammerReply: 'Mantap! Isi data penerima di link berikut ya.',
      },
      {
        messages: ['Isi data penerima di link ini ya: s.id/klaim-hadiah-fiktif'],
        options: [
          { text: 'Klik dan isi datanya', reply: 'Sudah saya isi.', safe: false },
          { text: 'Jangan klik, buka situs resminya sendiri', reply: 'Saya cek dari situs resminya saja.', safe: true },
        ],
        explanation: 'Ketik alamat situs resmi sendiri, jangan lewat link kiriman. Tanda bahaya: link pendek.',
        riskyExplanation: 'Halaman klaim palsu biasanya meminta login lalu mencuri akunmu.',
        missedFlags: [{ title: 'Tautan mencurigakan', detail: 'Link pendek menyembunyikan alamat situs yang asli.' }],
        scammerReply: 'Data diterima! Tinggal bayar ongkir ya.',
      },
      {
        messages: ['Hadiah siap dikirim. Tinggal transfer ongkir dan asuransi Rp75 ribu.'],
        options: [
          { text: 'Transfer ongkirnya', reply: 'Oke, saya transfer ongkirnya.', safe: false },
          { text: 'Tolak, hadiah asli tidak minta ongkir', reply: 'Hadiah resmi tidak minta ongkir, kan?', safe: true },
        ],
        explanation: 'Penyelenggara resmi menanggung biaya pengiriman hadiah. Tanda bahaya: biaya di muka.',
        riskyExplanation: 'Ongkir hanya pancingan. Setelah itu akan muncul biaya lain.',
        missedFlags: [{ title: 'Biaya di muka', detail: 'Kamu diminta bayar ongkir untuk hadiah yang katanya gratis.' }],
        scammerReply: 'Diterima. Ada pajak hadiah Rp300 ribu lagi ya.',
      },
      {
        messages: ['Untuk verifikasi pemenang, kirim foto KTP dan nomor kartu ATM kamu.'],
        options: [
          { text: 'Kirim foto KTP dan nomor kartu', reply: 'Ini KTP dan nomor kartu saya.', safe: false },
          { text: 'Tolak dan laporkan akunnya', reply: 'Saya tidak akan mengirim data itu.', safe: true },
        ],
        explanation: 'Nomor kartu dan KTP tidak diperlukan untuk menerima hadiah. Tanda bahaya: minta data sensitif.',
        riskyExplanation: 'Data kartu dan KTP bisa dipakai untuk transaksi atau pinjol atas namamu.',
        missedFlags: [{ title: 'Minta data pribadi', detail: 'Kamu mengirim KTP dan nomor kartu ATM.' }],
        scammerReply: 'Terima kasih, datanya sudah kami simpan.',
      },
      {
        messages: ['Kami kirim kode verifikasi ke nomormu. Kirim balik kodenya biar hadiah langsung dikirim!'],
        options: [
          { text: 'Kirim kode verifikasinya', reply: 'Ini kodenya.', safe: false },
          { text: 'Jangan kirim, kode itu untuk masuk ke akunmu', reply: 'Kode verifikasi tidak akan saya bagikan.', safe: true },
        ],
        explanation: 'Kode verifikasi dipakai untuk masuk ke akunmu. Siapa pun yang memintanya sedang mencoba membajak akun.',
        riskyExplanation: 'Dengan kode itu, pelaku bisa masuk dan mengambil alih akunmu.',
        missedFlags: [{ title: 'Minta kode OTP', detail: 'Kamu mengirim kode verifikasi kepada orang lain.' }],
        scammerReply: 'Akunmu sekarang milik kami. Terima kasih!',
      },
    ],
  },
  {
    id: 'teman-dibajak',
    title: 'Teman Dibajak',
    description: '“Teman” minta pulsa darurat lewat chat.',
    sender: 'Teman_Sekelas',
    badge: 'Anti-Akun Dibajak',
    steps: [
      {
        messages: ['Eh, lagi sibuk nggak? Aku butuh bantuan darurat nih 😭'],
        options: [
          { text: 'Langsung tawarkan bantuan uang', reply: 'Butuh berapa? Nanti aku transfer.', safe: false },
          { text: 'Telepon temanmu untuk memastikan', reply: 'Aku telepon kamu dulu ya.', safe: true },
          { text: 'Tanya hal yang cuma kalian berdua tahu', reply: 'Eh, kita terakhir ketemu di mana?', safe: true },
        ],
        explanation: 'Memastikan lewat telepon atau pertanyaan pribadi bisa membongkar akun yang dibajak.',
        riskyExplanation: 'Menawarkan uang sebelum memastikan identitas adalah celah utama penipuan akun dibajak.',
        missedFlags: [{ title: 'Akun bisa dibajak', detail: 'Pesan darurat dari akun teman belum tentu dikirim temanmu.' }],
        scammerReply: 'Makasih banget! Butuh pulsa Rp200 ribu dulu.',
      },
      {
        messages: ['Jangan telepon dulu ya, mic HP-ku lagi rusak. Chat aja.'],
        options: [
          { text: 'Oke, lanjut lewat chat saja', reply: 'Oke deh, chat aja.', safe: false },
          { text: 'Hubungi lewat nomor lain atau keluarganya', reply: 'Aku coba hubungi lewat kakakmu ya.', safe: true },
        ],
        explanation: 'Menolak ditelepon adalah tanda kuat. Cari jalur lain untuk memastikan.',
        riskyExplanation: 'Alasan “mic rusak” dipakai supaya suaranya tidak ketahuan.',
        missedFlags: [{ title: 'Menolak ditelepon', detail: 'Pelaku menghindari telepon supaya suaranya tidak dikenali.' }],
        scammerReply: 'Sip. Tolong isiin pulsa ke nomor ini ya.',
      },
      {
        messages: ['Tolong isiin pulsa Rp200 ribu ke nomor ini ya, nanti sore aku ganti. Buruan, penting banget!'],
        options: [
          { text: 'Isikan pulsa sekarang', reply: 'Oke, sudah aku isi.', safe: false },
          { text: 'Tunggu sampai bisa bicara langsung', reply: 'Nanti aku bantu setelah kita ngobrol langsung ya.', safe: true },
        ],
        explanation: 'Permintaan uang mendesak lewat chat harus dipastikan dulu. Tanda bahaya: tekanan waktu.',
        riskyExplanation: 'Pulsa sulit dilacak, makanya sering dipakai pelaku.',
        missedFlags: [{ title: 'Tekanan waktu', detail: 'Kamu didesak dengan kata “buruan”.' }],
        scammerReply: 'Makasih! Sekalian transfer Rp500 ribu ke rekening ini ya.',
      },
      {
        messages: ['Satu lagi, transfer Rp500 ribu ke rekening sepupuku ya. Atas nama orang lain nggak apa-apa.'],
        options: [
          { text: 'Transfer ke rekening itu', reply: 'Sudah aku transfer ya.', safe: false },
          { text: 'Tolak, rekeningnya bukan atas nama temanmu', reply: 'Kok rekeningnya atas nama orang lain? Aku nggak bisa.', safe: true },
        ],
        explanation: 'Rekening atas nama orang lain adalah tanda bahaya. Uang yang terkirim sulit kembali.',
        riskyExplanation: 'Rekening penampung sering dipakai penipu supaya jejaknya terputus.',
        missedFlags: [{ title: 'Rekening atas nama orang lain', detail: 'Uang diminta ke rekening yang bukan milik temanmu.' }],
        scammerReply: 'Sudah masuk. Kirim kode yang barusan masuk ke HP-mu ya.',
      },
      {
        messages: ['Eh, aku nggak sengaja kirim kode 6 digit ke nomormu. Tolong kirim balik ya. Jangan bilang siapa-siapa.'],
        options: [
          { text: 'Kirim balik kodenya', reply: 'Ini kodenya.', safe: false },
          { text: 'Jangan kirim, lalu kabari teman-teman lain', reply: 'Itu kode akun. Aku nggak kirim, dan aku kabari yang lain.', safe: true },
        ],
        explanation: 'Kode 6 digit itu untuk mendaftarkan akunmu di HP pelaku. Kabari teman lain supaya tidak ikut tertipu.',
        riskyExplanation: 'Dengan kode itu, akunmu ikut dibajak dan dipakai menipu kontakmu.',
        missedFlags: [
          { title: 'Minta kode OTP', detail: 'Kode yang “nyasar” sebenarnya OTP akunmu.' },
          { title: 'Diminta merahasiakan', detail: 'Kamu diminta tidak bilang siapa-siapa.' },
        ],
        scammerReply: 'Berhasil, akunmu sekarang kami ambil alih.',
      },
    ],
  },
  {
    id: 'pinjol-ilegal',
    title: 'Pinjol Ilegal',
    description: 'Dana cepat dengan akses kontak dan galeri.',
    sender: 'DanaKilat_Cair',
    badge: 'Anti-Pinjol Ilegal',
    steps: [
      {
        messages: ['Butuh dana cepat? Cair 5 menit tanpa BI checking, cukup KTP!'],
        options: [
          { text: 'Tertarik, daftar sekarang', reply: 'Mau dong, daftarnya gimana?', safe: false },
          { text: 'Cek nama aplikasinya di daftar resmi OJK', reply: 'Aplikasi ini terdaftar di OJK nggak?', safe: true },
        ],
        explanation: 'Pinjol legal terdaftar di OJK dan bisa dicek di situs resminya atau lewat OJK 157.',
        riskyExplanation: 'Pinjol ilegal memikat dengan syarat mudah, lalu menjerat dengan bunga dan teror.',
        missedFlags: [{ title: 'Syarat terlalu mudah', detail: '“Cair 5 menit cukup KTP” adalah umpan pinjol ilegal.' }],
        scammerReply: 'Gampang! Download aplikasinya di link ini.',
      },
      {
        messages: ['Download aplikasinya di sini ya: www.danakilat-fiktif.test/app.apk'],
        options: [
          { text: 'Download file apk-nya', reply: 'Sudah saya download.', safe: false },
          { text: 'Hanya pasang aplikasi dari toko aplikasi resmi', reply: 'Saya cuma pasang aplikasi dari toko resmi.', safe: true },
        ],
        explanation: 'File apk dari link bisa berisi program jahat. Pasang aplikasi hanya dari toko resmi.',
        riskyExplanation: 'File apk dari luar toko resmi bisa membaca SMS dan mencuri OTP.',
        missedFlags: [{ title: 'File apk', detail: 'Kamu memasang aplikasi dari link, bukan dari toko resmi.' }],
        scammerReply: 'Sip! Izinkan akses kontak dan galeri ya.',
      },
      {
        messages: ['Supaya dana cair, izinkan akses kontak, galeri, dan lokasi ya.'],
        options: [
          { text: 'Izinkan semua akses', reply: 'Sudah saya izinkan semua.', safe: false },
          { text: 'Tolak, pinjol legal tidak boleh akses kontak dan galeri', reply: 'Kenapa harus akses kontak dan galeri?', safe: true },
        ],
        explanation: 'Pinjol legal hanya boleh mengakses kamera, mikrofon, dan lokasi. Tanda bahaya: minta akses kontak.',
        riskyExplanation: 'Akses kontak dipakai untuk meneror teman dan keluargamu saat menagih.',
        missedFlags: [{ title: 'Akses kontak', detail: 'Kamu memberi akses kontak dan galeri ke aplikasi pinjaman.' }],
        scammerReply: 'Data kontak sudah masuk. Dana segera cair.',
      },
      {
        messages: ['Dana Rp1 juta cair, dipotong biaya admin 40%. Bunga 2% per hari, tenor 7 hari ya.'],
        options: [
          { text: 'Terima saja, yang penting cair', reply: 'Ya sudah, nggak apa-apa.', safe: false },
          { text: 'Tolak, potongan dan bunganya tidak wajar', reply: 'Potongan dan bunganya terlalu besar, saya batalkan.', safe: true },
        ],
        explanation: 'Potongan besar di depan dan bunga harian tinggi adalah ciri pinjol ilegal.',
        riskyExplanation: 'Utang bisa membengkak berkali lipat hanya dalam beberapa minggu.',
        missedFlags: [{ title: 'Bunga tidak wajar', detail: 'Bunga 2% per hari dan potongan 40% jauh di atas aturan.' }],
        scammerReply: 'Jatuh tempo besok. Telat sehari, kontakmu kami hubungi.',
      },
      {
        messages: ['Kalau tidak bayar hari ini, fotomu kami sebar ke semua kontak!'],
        options: [
          { text: 'Pinjam dari pinjol lain untuk bayar', reply: 'Iya, saya cari pinjaman lain dulu.', safe: false },
          { text: 'Simpan bukti ancaman, lapor ke OJK 157 dan polisi', reply: 'Ancaman ini saya laporkan.', safe: true },
        ],
        explanation: 'Ancaman penyebaran data bisa dilaporkan. Simpan bukti dan hubungi OJK 157 atau polisi.',
        riskyExplanation: 'Gali lubang tutup lubang membuat utangmu makin dalam.',
        missedFlags: [{ title: 'Ancaman', detail: 'Pelaku menakutimu supaya panik dan menuruti permintaan.' }],
        scammerReply: 'Bagus. Bunga kami naikkan jadi 5% per hari.',
      },
    ],
  },
  {
    id: 'kurir-palsu',
    title: 'Paket Kurir Palsu',
    description: 'Diminta pasang file apk untuk lacak paket.',
    sender: 'Kurir_Ekspres',
    badge: 'Anti-Kurir Palsu',
    steps: [
      {
        messages: ['Halo kak, paket atas nama kakak tertahan di gudang. Mohon dicek ya.'],
        options: [
          { text: 'Kirim alamat lengkap supaya paket diantar', reply: 'Ini alamat lengkap saya, tolong diantar ya.', safe: false },
          { text: 'Cek resi di aplikasi resmi toko tempat kamu belanja', reply: 'Saya cek di aplikasi toko dulu ya.', safe: true },
        ],
        explanation: 'Status paket asli bisa dicek di aplikasi toko atau situs resmi ekspedisi.',
        riskyExplanation: 'Alamat lengkap membantu pelaku membuat penipuan lebih meyakinkan.',
        missedFlags: [{ title: 'Mengaku kurir', detail: 'Nomor tak dikenal mengaku kurir tanpa nomor resi yang jelas.' }],
        scammerReply: 'Baik kak, foto paketnya ada di file berikut.',
      },
      {
        messages: ['Foto paketnya ada di file ini ya kak: LIHAT_FOTO_PAKET.apk'],
        options: [
          { text: 'Buka filenya', reply: 'Sudah saya buka.', safe: false },
          { text: 'Jangan buka, foto tidak pernah berbentuk apk', reply: 'Foto kok bentuknya apk? Tidak saya buka.', safe: true },
        ],
        explanation: 'Foto berformat jpg atau png, bukan apk. File apk adalah aplikasi yang bisa mencuri data.',
        riskyExplanation: 'File apk itu bisa membaca SMS dan mencuri OTP mobile banking.',
        missedFlags: [{ title: 'File apk', detail: 'Kamu membuka file apk yang menyamar sebagai foto.' }],
        scammerReply: 'Sudah terpasang ya kak. Sekarang lacak paketnya di aplikasi itu.',
      },
      {
        messages: ['Untuk lacak paket, masuk ke aplikasi itu pakai akun m-banking kakak ya.'],
        options: [
          { text: 'Masuk pakai akun m-banking', reply: 'Sudah saya login.', safe: false },
          { text: 'Tolak, lacak paket tidak butuh m-banking', reply: 'Lacak paket tidak perlu akun bank.', safe: true },
        ],
        explanation: 'Lacak paket cukup dengan nomor resi. Tanda bahaya: diminta login akun bank.',
        riskyExplanation: 'Kata sandi m-banking yang kamu masukkan langsung terkirim ke pelaku.',
        missedFlags: [{ title: 'Minta kata sandi', detail: 'Kamu memasukkan data m-banking ke aplikasi palsu.' }],
        scammerReply: 'Terima kasih. Ada biaya gudang yang harus dibayar.',
      },
      {
        messages: ['Paket kena biaya gudang Rp35 ribu. Bayar dalam 30 menit lagi atau paket dikembalikan.'],
        options: [
          { text: 'Bayar biaya gudangnya', reply: 'Oke, saya bayar sekarang.', safe: false },
          { text: 'Hubungi layanan pelanggan resmi ekspedisi', reply: 'Saya tanya ke layanan resmi ekspedisi dulu.', safe: true },
        ],
        explanation: 'Biaya resmi tercantum di aplikasi ekspedisi, bukan ditagih lewat chat. Tanda bahaya: tekanan waktu.',
        riskyExplanation: 'Biaya kecil plus batas waktu adalah trik supaya kamu buru-buru.',
        missedFlags: [
          { title: 'Tekanan waktu', detail: 'Kamu diberi batas “30 menit lagi”.' },
          { title: 'Biaya di muka', detail: 'Kamu diminta bayar biaya gudang lewat chat.' },
        ],
        scammerReply: 'Pembayaran diterima. Tinggal konfirmasi kode OTP ya.',
      },
      {
        messages: ['Kami kirim kode OTP untuk konfirmasi pengiriman, tolong sebutkan ya kak.'],
        options: [
          { text: 'Sebutkan OTP-nya', reply: 'Kodenya ini kak.', safe: false },
          { text: 'Jangan sebutkan dan blokir nomornya', reply: 'OTP tidak saya bagikan. Nomor ini saya blokir.', safe: true },
        ],
        explanation: 'Kurir tidak pernah butuh OTP. Blokir dan laporkan nomornya.',
        riskyExplanation: 'OTP itu bisa dipakai untuk menguras saldo m-banking.',
        missedFlags: [{ title: 'Minta kode OTP', detail: 'Kamu menyebutkan OTP ke orang yang mengaku kurir.' }],
        scammerReply: 'Terima kasih kak, saldonya sudah kami pindahkan.',
      },
    ],
  },
  {
    id: 'investasi-instan',
    title: 'Investasi Instan',
    description: 'Grup Telegram penuh testimoni profit.',
    sender: 'Admin_ProfitHarian',
    badge: 'Anti-Investasi Bodong',
    steps: [
      {
        messages: [
          'Selamat datang di grup Profit Harian! Member kami untung 30% per minggu 🚀',
          'Testimoni member hari ini: “Modal 1 juta jadi 1,3 juta dalam seminggu!”',
        ],
        options: [
          { text: 'Tertarik, ikut juga', reply: 'Mau ikut juga dong!', safe: false },
          { text: 'Cek izin usahanya di OJK', reply: 'Izin OJK-nya ada?', safe: true },
        ],
        explanation: 'Investasi legal berizin OJK dan tidak menjanjikan untung pasti. Tanda bahaya: untung tetap yang tinggi.',
        riskyExplanation: 'Untung pasti 30% per minggu tidak masuk akal untuk investasi apa pun.',
        missedFlags: [
          { title: 'Untung dijamin', detail: 'Janji 30% per minggu jauh di atas investasi yang wajar.' },
          { title: 'Testimoni palsu', detail: 'Testimoni di grup mudah dibuat-buat.' },
        ],
        scammerReply: 'Gas! Deposit minimal Rp500 ribu ya.',
      },
      {
        messages: ['Untuk mulai, deposit minimal Rp500 ribu. Tanpa risiko, modal dijamin kembali!'],
        options: [
          { text: 'Deposit Rp500 ribu', reply: 'Oke, saya deposit.', safe: false },
          { text: 'Tolak, tidak ada investasi tanpa risiko', reply: 'Investasi kok tanpa risiko? Saya tidak ikut.', safe: true },
        ],
        explanation: 'Semua investasi punya risiko. “Tanpa risiko” adalah ciri investasi bodong.',
        riskyExplanation: 'Uang deposit langsung masuk ke kantong pelaku.',
        missedFlags: [{ title: 'Tanpa risiko', detail: 'Klaim “modal dijamin kembali” tidak mungkin di investasi asli.' }],
        scammerReply: 'Deposit masuk! Profit pertama sudah tampil di dashboard.',
      },
      {
        messages: ['Lihat, saldomu sudah naik! Upgrade ke member VIP Rp2 juta biar profit 2x lipat. Promo cuma hari ini!'],
        options: [
          { text: 'Upgrade ke VIP', reply: 'Saya upgrade ke VIP.', safe: false },
          { text: 'Coba tarik dana dulu sebelum menambah', reply: 'Saya mau tarik dana dulu.', safe: true },
        ],
        explanation: 'Saldo di layar bisa angka palsu. Coba tarik dana dulu sebelum menambah. Tanda bahaya: promo hari ini.',
        riskyExplanation: 'Saldo yang “naik” hanya angka di layar supaya kamu menambah modal.',
        missedFlags: [
          { title: 'Tekanan waktu', detail: 'Promo “cuma hari ini” membuatmu buru-buru.' },
          { title: 'Member VIP', detail: 'Paket VIP adalah cara memancing setoran lebih besar.' },
        ],
        scammerReply: 'Mantap! Profit VIP kamu sudah aktif.',
      },
      {
        messages: ['Penarikan dana kena pajak pencairan 20%. Transfer dulu ya, baru dana cair.'],
        options: [
          { text: 'Bayar pajaknya', reply: 'Oke, saya bayar pajaknya.', safe: false },
          { text: 'Tolak, pajak tidak dibayar ke admin grup', reply: 'Pajak tidak dibayar lewat admin grup.', safe: true },
        ],
        explanation: 'Pajak investasi dipotong secara resmi, bukan ditransfer ke admin. Tanda bahaya: biaya di muka.',
        riskyExplanation: 'Setelah “pajak” dibayar, dana tetap tidak akan cair.',
        missedFlags: [{ title: 'Biaya di muka', detail: 'Kamu diminta bayar “pajak pencairan” sebelum dana keluar.' }],
        scammerReply: 'Pajak diterima. Ada biaya admin lagi ya.',
      },
      {
        messages: ['Ajak 3 teman gabung, nanti danamu langsung cair plus bonus 10%!'],
        options: [
          { text: 'Ajak teman-teman', reply: 'Oke, saya ajak teman-teman.', safe: false },
          { text: 'Keluar dari grup dan lapor ke OJK 157', reply: 'Saya keluar dan melapor ke OJK.', safe: true },
        ],
        explanation: 'Skema yang mewajibkan merekrut orang adalah skema piramida. Laporkan ke OJK 157.',
        riskyExplanation: 'Mengajak teman membuat mereka ikut jadi korban.',
        missedFlags: [{ title: 'Skema berantai', detail: 'Dana baru “cair” kalau kamu merekrut orang lain.' }],
        scammerReply: 'Terima kasih, teman-temanmu sudah deposit.',
      },
    ],
  },
];
