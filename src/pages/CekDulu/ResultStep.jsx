import { Info, TriangleAlert } from 'lucide-react';
import { describeFinding, LEVEL_LOW } from '../../lib/analyzer.js';
import Card from '../../components/Card.jsx';
import Eyebrow from '../../components/Eyebrow.jsx';
import Heading from '../../components/Heading.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Notice from '../../components/Notice.jsx';

const STRONG_WEIGHT = 3;

function HighlightedText({ segments }) {
  return segments.map((segment, index) => {
    if (segment.weight === 0) return <span key={index}>{segment.text}</span>;
    const color = segment.weight >= STRONG_WEIGHT ? 'bg-mark-danger' : 'bg-mark-warn';
    return (
      <mark key={index} className={color}>
        {segment.text}
      </mark>
    );
  });
}

function FindingList({ findings }) {
  return (
    <ul className="divide-y divide-line">
      {findings.map((finding) => (
        <li key={finding.rule.id} className="py-4">
          <p className="leading-relaxed">
            <strong className="font-extrabold">{finding.rule.title}.</strong> {describeFinding(finding)}
          </p>
          <p className="mt-1 text-sm text-muted">
            Ditemukan: {finding.matches.map((match) => `“${match}”`).join(', ')}
          </p>
        </li>
      ))}
    </ul>
  );
}

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export default function ResultStep({ category, text, result, onRecheck, onReportTransfer }) {
  const isLow = result.level === LEVEL_LOW;

  return (
    <div className="feature-grid">
      <div className="flex flex-col">
        <Eyebrow>Cek Dulu · {category.shortLabel}</Eyebrow>
        <Heading as="h1" main className="mt-3">
          {category.resultHeading}
        </Heading>
        <div className="mt-5 whitespace-pre-wrap break-words rounded-card border-2 border-line bg-surface p-6 text-[17px] leading-8">
          <HighlightedText segments={result.segments} />
        </div>
        <p className="mt-3 text-sm text-muted">Contoh fiktif. Hapus nama, nomor, dan rekening asli sebelum menempel.</p>
        <Button fullWidth onClick={onRecheck} className="mt-4">
          Periksa ulang
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <h2 className="text-title font-extrabold">Kewaspadaan: {capitalize(result.level)}</h2>
          {isLow ? null : <Badge>{result.findings.length} tanda bahaya</Badge>}
        </div>

        {result.warningContext ? (
          <Notice tone="brand" icon={Info} className="mt-4 text-[15px]">
            Teks ini tampak seperti peringatan/edukasi, jadi permintaan kode atau data di dalamnya tidak dihitung. Tetap
            waspada kalau pengirimnya meminta sesuatu darimu.
          </Notice>
        ) : null}

        {isLow ? (
          <p className="mt-4 leading-relaxed">
            Tidak ada pola penipuan umum yang terdeteksi. Itu belum berarti aman: tetap cek lewat kanal resmi.
          </p>
        ) : (
          <>
            {result.combos.map((combo) => (
              <Notice key={combo.id} tone="danger" icon={TriangleAlert} className="mt-4 text-[15px]">
                <strong className="font-extrabold">{combo.title}.</strong> {combo.message}
              </Notice>
            ))}
            <FindingList findings={result.findings} />
          </>
        )}

        <div className="mt-auto pt-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button href="#latih" variant="outline">
              Latih skenario serupa
            </Button>
            <Button variant="danger" onClick={onReportTransfer}>
              Aku sudah transfer
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">Indikasi saja, bukan bukti. Verifikasi lewat kanal resmi.</p>
        </div>
      </Card>
    </div>
  );
}
