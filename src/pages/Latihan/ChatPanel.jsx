import { useEffect, useRef } from 'react';
import { buildChatLog } from '../../lib/practice.js';
import Card from '../../components/Card.jsx';
import Eyebrow from '../../components/Eyebrow.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import Notice from '../../components/Notice.jsx';

function Bubble({ entry, sender }) {
  if (entry.from === 'player') {
    return (
      <li className="max-w-[85%] self-end rounded-2xl bg-brand px-4 py-2.5 leading-relaxed text-white">{entry.text}</li>
    );
  }
  return (
    <li className="max-w-[85%] self-start rounded-2xl bg-subtle px-4 py-3 leading-relaxed">
      {entry.showSender ? <strong className="block font-extrabold">{sender}</strong> : null}
      {entry.text}
    </li>
  );
}

export default function ChatPanel({ state, scenarioNumber, totalScenarios }) {
  const { scenario, answers, stepIndex, endedByRisk } = state;
  const log = buildChatLog(scenario, answers, stepIndex);
  const listRef = useRef(null);

  // Gulir otomatis ke pesan terbaru (hanya di dalam kotak chat, bukan seluruh halaman).
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [log.length]);

  return (
    <Card aria-label={`Percakapan latihan: ${scenario.title}`}>
      <Eyebrow>
        {endedByRisk
          ? 'Latih · Umpan balik pilihan berisiko'
          : `Latihan · Skenario ${scenarioNumber} dari ${totalScenarios} · ${scenario.title}`}
      </Eyebrow>
      {endedByRisk ? null : (
        <ProgressBar
          value={answers.length}
          max={scenario.steps.length}
          label={`Langkah dijawab: ${answers.length} dari ${scenario.steps.length}`}
          className="mt-3"
        />
      )}
      <ul
        ref={listRef}
        aria-live="polite"
        aria-label="Isi chat"
        className="mt-4 flex max-h-[440px] min-h-[200px] flex-col gap-3 overflow-y-auto pr-1"
      >
        {log.map((entry) => (
          <Bubble key={entry.id} entry={entry} sender={scenario.sender} />
        ))}
      </ul>
      <div className="mt-auto pt-6">
        {endedByRisk ? (
          <Notice tone="danger" className="text-[15px]">
            Dalam simulasi ini, uangmu hilang dan akunmu bisa diambil alih.
          </Notice>
        ) : (
          <p className="text-sm text-muted">Semua percakapan fiktif untuk latihan.</p>
        )}
      </div>
    </Card>
  );
}
