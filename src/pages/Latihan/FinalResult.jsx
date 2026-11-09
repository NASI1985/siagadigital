import { PRACTICE_TIP } from '../../data/scenarios.js';
import { countBadges, earnsBadge, guardianLabel, mergeBestScore, scoreLevel } from '../../lib/practice.js';
import { shareOrCopy } from '../../lib/clipboard.js';
import { useToast } from '../../components/Toast.jsx';
import Card from '../../components/Card.jsx';
import Eyebrow from '../../components/Eyebrow.jsx';
import Heading from '../../components/Heading.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import Pill from '../../components/Pill.jsx';
import Button from '../../components/Button.jsx';
import { getMissedFlags, getSafeCount, getScore } from './practiceReducer.js';

const SHARE_TEXT = `Tips dari SiagaDigital: ${PRACTICE_TIP}`;

export default function FinalResult({ state, scores, onExit }) {
  const showToast = useToast();
  const { scenario } = state;
  const totalSteps = scenario.steps.length;
  const safeCount = getSafeCount(state);
  const score = getScore(state);
  const missedFlags = getMissedFlags(state);
  // Hitung lencana dengan skor putaran ini, walau penyimpanan belum selesai.
  const badgeCount = countBadges(mergeBestScore(scores, scenario.id, score));

  const handleShare = async () => {
    const outcome = await shareOrCopy(SHARE_TEXT);
    if (outcome === 'copied') showToast('Tersalin');
    if (outcome === 'failed') showToast('Gagal menyalin. Coba salin manual ya');
  };

  return (
    <div className="feature-grid">
      <Card tone="brand">
        <Eyebrow tone="light">Hasil akhir · {scenario.title}</Eyebrow>
        <h1 tabIndex={-1} data-main-heading="" className="mt-4 text-hero font-extrabold">
          Level: {scoreLevel(score)}
        </h1>
        <p className="mt-4 text-lg">
          {safeCount} dari {totalSteps} keputusan aman ({score}%)
        </p>
        <ProgressBar value={score} label="Skor latihan" tone="light" className="mt-3" />
        <div className="mt-5 flex flex-wrap gap-2">
          {earnsBadge(score) ? <Pill tone="light">Lencana {scenario.badge}</Pill> : null}
          <Pill tone="deep">{guardianLabel(badgeCount)}</Pill>
        </div>
        <p className="mt-auto pt-10 text-sm">Skor adalah latihan, bukan jaminan kebal tipuan.</p>
      </Card>

      <Card>
        <Heading>Yang terlewat</Heading>
        {missedFlags.length === 0 ? (
          <p className="mt-3 leading-relaxed">Tidak ada tanda bahaya yang terlewat. Mantap!</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {missedFlags.map((flag) => (
              <li key={flag.title} className="leading-relaxed">
                <strong className="font-extrabold text-danger-ink">{flag.title}.</strong> {flag.detail}
              </li>
            ))}
          </ul>
        )}
        <Heading className="mt-8">Tips kunci</Heading>
        <p className="mt-4 rounded-xl bg-brand-tint px-4 py-4 leading-relaxed">{PRACTICE_TIP}</p>
        <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
          <Button variant="outline" onClick={onExit}>
            Coba skenario lain
          </Button>
          <Button variant="dark" onClick={handleShare}>
            Bagikan tips ke teman
          </Button>
        </div>
      </Card>
    </div>
  );
}
