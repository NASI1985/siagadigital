import { useId, useState } from 'react';
import { SECURITY_CHECKLIST } from '../../data/securityChecklist.js';
import { nextStepSentence, readinessPercent, toggleChecked, uncheckedItems } from '../../lib/checklist.js';
import { STORAGE_KEYS, isCheckedMap } from '../../lib/storage.js';
import { usePersistedState } from '../../hooks/usePersistedState.js';
import Card from '../../components/Card.jsx';
import Eyebrow from '../../components/Eyebrow.jsx';
import Heading from '../../components/Heading.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import Button from '../../components/Button.jsx';

export default function ReadinessChecklist() {
  const [checked, setChecked] = usePersistedState(STORAGE_KEYS.checklist, {}, isCheckedMap);
  const [isHowToOpen, setHowToOpen] = useState(false);
  const panelId = useId();

  const percent = readinessPercent(SECURITY_CHECKLIST, checked);
  const nextItem = uncheckedItems(SECURITY_CHECKLIST, checked)[0];

  return (
    <div className="grid gap-8 two:grid-cols-2">
      <Card>
        <Eyebrow tone="danger">Bertindak · Checklist keamanan akun</Eyebrow>
        <Heading className="mt-3">Cek perlindunganmu</Heading>
        <ul className="mt-4">
          {SECURITY_CHECKLIST.map((item) => (
            <li key={item.id}>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-3 py-1 leading-snug">
                <input
                  type="checkbox"
                  checked={checked[item.id] === true}
                  onChange={() => setChecked((previous) => toggleChecked(previous, item.id))}
                  className="h-5 w-5 shrink-0 accent-brand"
                />
                <span>{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </Card>

      <Card tone="brand">
        <Eyebrow tone="light">Kesiapan perlindungan</Eyebrow>
        <p className="mt-4 text-[clamp(56px,9vw,80px)] font-extrabold leading-none tracking-tight">{percent}%</p>
        <ProgressBar value={percent} label="Kesiapan perlindungan" tone="light" className="mt-5" />
        <p aria-live="polite" className="mt-4 text-lg leading-relaxed">
          {nextItem
            ? `Langkah berikutnya: ${nextStepSentence(SECURITY_CHECKLIST, checked)}`
            : 'Mantap! Semua perlindungan dasar sudah aktif.'}
        </p>

        {nextItem && isHowToOpen ? (
          <div id={panelId} className="mt-4 rounded-xl bg-brand-deep px-4 py-4 leading-relaxed">
            <p className="font-extrabold">{nextItem.label}</p>
            <p className="mt-1">{nextItem.howTo}</p>
          </div>
        ) : null}

        {nextItem ? (
          <div className="mt-auto pt-8">
            <Button
              variant="light"
              fullWidth
              aria-expanded={isHowToOpen}
              aria-controls={isHowToOpen ? panelId : undefined}
              onClick={() => setHowToOpen((open) => !open)}
            >
              {isHowToOpen ? 'Tutup panduan' : 'Lihat cara melakukannya'}
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
