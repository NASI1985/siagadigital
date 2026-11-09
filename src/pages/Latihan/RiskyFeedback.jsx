import Card from '../../components/Card.jsx';
import Heading from '../../components/Heading.jsx';
import Button from '../../components/Button.jsx';

// Kolom kanan setelah pilihan berisiko: putaran berakhir di sini.
export default function RiskyFeedback({ step, onRetry, onFinish }) {
  return (
    <Card tone="danger-outline">
      <Heading main className="text-danger-ink">
        Pilihan berisiko
      </Heading>
      <p className="mt-4 leading-relaxed">{step.riskyExplanation}</p>
      <div className="mt-5 rounded-xl bg-subtle px-4 py-4">
        <h3 className="font-extrabold">Tanda bahaya yang terlewat</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 leading-relaxed">
          {step.missedFlags.map((flag) => (
            <li key={flag.title}>{flag.title}</li>
          ))}
        </ul>
      </div>
      <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
        <Button variant="outline" onClick={onRetry}>
          Ulangi skenario
        </Button>
        <Button variant="dark" onClick={onFinish}>
          Lanjut ke ringkasan
        </Button>
      </div>
    </Card>
  );
}
