import { Fragment, useState } from 'react';
import { REPORT_LINKS } from '../../data/emergency.js';
import Card from '../../components/Card.jsx';
import Eyebrow from '../../components/Eyebrow.jsx';
import Heading from '../../components/Heading.jsx';
import Button from '../../components/Button.jsx';

const PHASE_LINES = {
  now: 'border-danger-ink',
  today: 'border-today',
  report: 'border-brand-ink',
};

function PhaseBlock({ title, line, children }) {
  return (
    <section className={`border-l-[5px] pl-4 ${PHASE_LINES[line]}`}>
      <h3 className="font-extrabold">{title}</h3>
      {children}
    </section>
  );
}

function StepChecklist({ prefix, steps, checked, onToggle }) {
  return (
    <ul className="mt-1">
      {steps.map((step, index) => {
        const id = `${prefix}-${index}`;
        return (
          <li key={id}>
            <label htmlFor={id} className="flex min-h-[40px] cursor-pointer items-start gap-3 py-1.5 leading-snug">
              <input
                id={id}
                type="checkbox"
                checked={checked.has(id)}
                onChange={() => onToggle(id)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
              />
              <span>{step}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

// Centang langkah tidak disimpan; ganti kejadian = komponen dipasang ulang (key) = centang direset.
export default function ActionPlan({ plan, onEditAnswers }) {
  const [checked, setChecked] = useState(() => new Set());

  const toggle = (id) =>
    setChecked((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <Card>
      <Eyebrow tone="danger">Bantuan · Aku sudah kena tipu</Eyebrow>
      <Heading as="h1" main className="mt-3">
        Kejadian: {plan.title}
      </Heading>
      <Button variant="outline" size="sm" onClick={onEditAnswers} className="mt-3 self-start">
        Ubah jawaban
      </Button>

      <div className="mt-5 space-y-4">
        <PhaseBlock title="Sekarang juga (0–1 jam)" line="now">
          <StepChecklist prefix="sekarang" steps={plan.now} checked={checked} onToggle={toggle} />
        </PhaseBlock>
        <PhaseBlock title="Hari ini" line="today">
          <StepChecklist prefix="hari-ini" steps={plan.today} checked={checked} onToggle={toggle} />
        </PhaseBlock>
        <PhaseBlock title="Lapor" line="report">
          <p className="mt-1 leading-loose">
            {REPORT_LINKS.map((link, index) => (
              <Fragment key={link.href}>
                {index > 0 ? ' · ' : null}
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="font-semibold underline decoration-line underline-offset-4 hover:decoration-ink"
                >
                  {link.label}
                </a>
              </Fragment>
            ))}
          </p>
        </PhaseBlock>
      </div>

      <p className="mt-auto pt-8 text-sm text-muted">Periksa ulang kanal resmi sebelum menghubungi.</p>
    </Card>
  );
}
