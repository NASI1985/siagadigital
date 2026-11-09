import { countBadges, countCompleted, playerLevel } from '../../lib/practice.js';
import Eyebrow from '../../components/Eyebrow.jsx';
import Heading from '../../components/Heading.jsx';
import Pill from '../../components/Pill.jsx';

function ScenarioCard({ scenario, score, onStart }) {
  const isDone = score !== undefined;
  return (
    <button
      type="button"
      onClick={() => onStart(scenario)}
      className={`flex min-h-[200px] flex-col rounded-card border-2 bg-surface p-7 text-left transition hover:border-line lg:min-h-[300px] ${
        isDone ? 'border-brand-ink hover:border-brand-ink' : 'border-transparent'
      }`}
    >
      <span className="text-xl font-extrabold tracking-tight">{scenario.title}</span>
      <span className="mt-3 leading-relaxed text-muted">{scenario.description}</span>
      <span className={`mt-auto pt-6 font-bold ${isDone ? 'text-brand-ink' : 'text-ink'}`}>
        {isDone ? `Selesai · ${score}%` : 'Mulai'}
      </span>
    </button>
  );
}

export default function ScenarioList({ scenarios, scores, onStart }) {
  const level = playerLevel(countBadges(scores));
  const completed = countCompleted(scores, scenarios);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Latih · Daftar skenario</Eyebrow>
          <Heading as="h1" main className="mt-3">
            Pilih skenario latihan
          </Heading>
        </div>
        <Pill tone="ink">
          Level {level} · {completed} dari {scenarios.length} selesai
        </Pill>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <li key={scenario.id} className="flex">
            <ScenarioCard scenario={scenario} score={scores[scenario.id]} onStart={onStart} />
          </li>
        ))}
      </ul>
    </>
  );
}
