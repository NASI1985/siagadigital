import { TriangleAlert } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import Notice from '../components/Notice.jsx';

const FEATURES = [
  {
    eyebrow: '01 · Kenali',
    title: 'Cek pesan atau link mencurigakan',
    description: 'Tempel teks, lihat tanda bahaya yang disorot beserta alasannya.',
    action: 'Periksa sekarang',
    href: '#cek',
    cardTone: 'brand',
    eyebrowTone: 'light',
    buttonVariant: 'light',
    textClass: 'text-white',
  },
  {
    eyebrow: '02 · Latih',
    title: 'Uji kewaspadaanku',
    description: 'Simulasi chat bercabang: loker palsu, giveaway, teman dibajak, pinjol ilegal.',
    action: 'Mulai latihan',
    href: '#latih',
    cardTone: 'ink-outline',
    eyebrowTone: 'brand',
    buttonVariant: 'dark',
    textClass: 'text-muted',
  },
  {
    eyebrow: '03 · Bertindak',
    title: 'Aku sudah kena tipu',
    description: 'Langkah darurat 0–1 jam, cara lapor, dan pesan peringatan untuk teman.',
    action: 'Lihat langkahnya',
    href: '#bantuan',
    cardTone: 'danger-soft',
    eyebrowTone: 'danger',
    buttonVariant: 'danger',
    textClass: 'text-ink',
  },
];

export default function Beranda() {
  return (
    <>
      <h1 tabIndex={-1} data-main-heading="" className="max-w-[720px] text-hero font-extrabold">
        Kenali tipuan sebelum kamu klik.
      </h1>
      <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-muted sm:text-xl">
        Cek pesan mencurigakan, latih instingmu lewat simulasi, dan tahu langkah pasti kalau sudah terlanjur kena.
        Tanpa login, tanpa data pribadi.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.href} tone={feature.cardTone} className="!p-7">
            <Eyebrow tone={feature.eyebrowTone}>{feature.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight">{feature.title}</h2>
            <p className={`mb-6 mt-3 text-[16px] leading-relaxed ${feature.textClass}`}>{feature.description}</p>
            <Button href={feature.href} variant={feature.buttonVariant} fullWidth className="mt-auto">
              {feature.action}
            </Button>
          </Card>
        ))}
      </div>

      <Notice icon={TriangleAlert} className="mt-12 !px-5 !py-4 text-[15px]">
        Hasil pengecekan hanyalah indikasi dari pola umum. Hasil “rendah” bukan bukti aman. Selalu verifikasi lewat
        kanal resmi.
      </Notice>
    </>
  );
}
