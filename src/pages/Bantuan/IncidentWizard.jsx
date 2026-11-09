import { INCIDENTS, PLATFORMS } from '../../data/emergency.js';
import Card from '../../components/Card.jsx';
import Eyebrow from '../../components/Eyebrow.jsx';
import Heading from '../../components/Heading.jsx';
import ChoiceButton from '../../components/ChoiceButton.jsx';
import Button from '../../components/Button.jsx';

const QUESTION_COUNT = 2;

function ChoiceList({ items, selectedId, onSelect, label }) {
  return (
    <ul className="mt-5 space-y-3" aria-label={label}>
      {items.map((item) => (
        <li key={item.id}>
          <ChoiceButton selected={item.id === selectedId} onClick={() => onSelect(item.id)}>
            {item.label}
          </ChoiceButton>
        </li>
      ))}
    </ul>
  );
}

export default function IncidentWizard({ incidentId, platformId, onIncidentChange, onPlatformChange, onSubmit }) {
  return (
    <div className="feature-grid">
      <Card>
        <Eyebrow tone="danger">Bertindak · Pertanyaan 1 dari {QUESTION_COUNT}</Eyebrow>
        <Heading as="h1" main className="mt-3">
          Apa yang terjadi?
        </Heading>
        <ChoiceList items={INCIDENTS} selectedId={incidentId} onSelect={onIncidentChange} label="Kejadian" />
      </Card>

      <Card>
        <Eyebrow tone="danger">Pertanyaan 2 dari {QUESTION_COUNT}</Eyebrow>
        <Heading className="mt-3">Di platform apa?</Heading>
        <ChoiceList items={PLATFORMS} selectedId={platformId} onSelect={onPlatformChange} label="Platform" />
        <div className="mt-auto pt-8">
          <Button variant="danger" fullWidth onClick={onSubmit}>
            Tampilkan langkahku
          </Button>
        </div>
      </Card>
    </div>
  );
}
