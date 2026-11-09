import { Check } from 'lucide-react';
import Heading from '../../components/Heading.jsx';
import ChoiceButton from '../../components/ChoiceButton.jsx';
import Button from '../../components/Button.jsx';

export default function ReplyPanel({ state, onPick, onNext, onExit }) {
  const { scenario, stepIndex, picked } = state;
  const step = scenario.steps[stepIndex];
  const hasPicked = picked !== null;
  const isLastStep = stepIndex === scenario.steps.length - 1;

  return (
    <section className="flex flex-col" aria-label="Pilihan balasan">
      <Heading main>Kamu mau balas apa?</Heading>
      <ul className="mt-4 space-y-3">
        {step.options.map((option, index) => (
          <li key={option.text}>
            <ChoiceButton selected={picked === index} disabled={hasPicked} onClick={() => onPick(index)}>
              {option.text}
            </ChoiceButton>
          </li>
        ))}
      </ul>

      {hasPicked ? (
        <div role="status" className="mt-4 rounded-xl bg-brand-tint px-4 py-4 leading-relaxed">
          <strong className="inline-flex items-center gap-1.5 font-extrabold text-brand-ink">
            <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} />
            Pilihan aman.
          </strong>{' '}
          {step.explanation}
        </div>
      ) : null}

      <div className="mt-auto space-y-3 pt-8">
        {hasPicked ? (
          <Button variant="dark" fullWidth onClick={onNext}>
            {isLastStep ? 'Lihat hasil akhir' : 'Lanjut ke pesan berikutnya'}
          </Button>
        ) : null}
        <button
          type="button"
          onClick={onExit}
          className="min-h-[44px] w-full rounded-xl text-sm font-semibold text-muted underline-offset-4 hover:underline"
        >
          Keluar ke daftar skenario
        </button>
      </div>
    </section>
  );
}
