import { Shield, TriangleAlert } from 'lucide-react';
import Card from '../components/Card.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import Heading from '../components/Heading.jsx';
import Button from '../components/Button.jsx';
import Notice from '../components/Notice.jsx';

const SECTIONS = [
  {
    title: 'Kenapa SiagaDigital ada',
    body: 'Penipuan digital makin rapi: loker palsu, giveaway palsu, akun teman yang dibajak, pinjol ilegal, sampai investasi bodong. SiagaDigital membantu anak muda Indonesia mengenali polanya sebelum terlanjur, berlatih lewat simulasi, dan tahu langkah pasti kalau sudah kena.',
  },
  {
    title: 'Privasimu aman',
    body: 'Semua pengecekan berjalan di browsermu. Teks yang kamu tempel tidak dikirim ke server mana pun dan tidak disimpan. Yang disimpan di perangkatmu hanya skor latihan dan centang checklist, supaya progresmu tidak hilang.',
  },
  {
    title: 'Cara kerja pengecekan',
    body: 'Mesin pengecekan bukan AI. Ia mencocokkan kata dan pola yang sering dipakai penipu, misalnya permintaan biaya di muka, kode OTP, atau tekanan waktu, lalu memberi bobot pada setiap temuan.',
  },
  {
    title: 'Tentang SiagaBot',
    body: 'SiagaBot di pojok kanan bawah adalah asisten tanya-jawab offline, juga bukan AI. Ia mengenali kata kunci (termasuk bahasa gaul dan salah ketik), bertanya balik untuk menilai kasusmu, lalu menjawab dari panduan yang sudah disiapkan. Percakapannya diproses di browsermu, tidak dikirim ke mana pun, dan hilang saat halaman ditutup.',
  },
];

export default function Tentang() {
  return (
    <div className="grid gap-8 two:grid-cols-2">
      <div className="flex flex-col">
        <Eyebrow>Tentang</Eyebrow>
        <Heading as="h1" main className="mt-3">
          Tentang SiagaDigital
        </Heading>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          Platform edukasi dan tanggap insiden keamanan digital. Gratis, tanpa login, dan tanpa data pribadi.
        </p>
        <Notice icon={TriangleAlert} className="mt-6">
          <strong>Penafian.</strong> Hasil pengecekan hanyalah indikasi dari pola umum. Hasil “rendah” bukan bukti
          aman, dan skor latihan bukan jaminan kebal tipuan. Selalu verifikasi lewat kanal resmi.
        </Notice>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="#cek">Mulai cek pesan</Button>
          <Button href="#bantuan" variant="outline">
            Aku sudah kena tipu
          </Button>
        </div>
      </div>

      <Card>
        <Shield aria-hidden="true" className="h-8 w-8 text-brand-ink" />
        {SECTIONS.map((section) => (
          <div key={section.title} className="mt-6 border-t border-line pt-6 first-of-type:mt-4 first-of-type:border-0 first-of-type:pt-0">
            <h2 className="text-xl font-extrabold">{section.title}</h2>
            <p className="mt-2 leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
