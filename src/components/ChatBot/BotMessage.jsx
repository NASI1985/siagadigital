import { ExternalLink } from 'lucide-react';

const ACTION_CLASS =
  'inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-2 border-brand-ink bg-surface px-3.5 py-1.5 text-left text-sm font-bold text-brand-ink hover:bg-brand-tint';

function ActionButton({ action, onAction }) {
  if (action.type === 'link') {
    return (
      <a
        href={action.href}
        className={ACTION_CLASS}
        {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {action.label}
        {action.external ? <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" /> : null}
      </a>
    );
  }
  return (
    <button type="button" className={ACTION_CLASS} onClick={() => onAction(action)}>
      {action.label}
    </button>
  );
}

// Satu gelembung chat. Pesan pengguna rata kanan (teal), pesan bot rata kiri (abu).
export default function BotMessage({ message, onAction }) {
  if (message.from === 'user') {
    return (
      <li className="max-w-[85%] self-end whitespace-pre-wrap break-words rounded-2xl bg-brand px-4 py-2.5 leading-relaxed text-white">
        <span className="sr-only">Kamu: </span>
        {message.text}
      </li>
    );
  }

  return (
    <li
      className={`max-w-[92%] self-start rounded-2xl px-4 py-3 leading-relaxed ${
        message.tone === 'danger' ? 'border-l-4 border-danger-ink bg-subtle' : 'bg-subtle'
      }`}
    >
      <span className="sr-only">SiagaBot: </span>
      <p className="break-words">{message.text}</p>
      {message.list.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {message.list.map((item) => (
            <li key={item} className="break-words">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {message.note ? <p className="mt-2 text-sm text-muted">{message.note}</p> : null}
      {message.actions.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {message.actions.map((action) => (
            <ActionButton key={`${action.type}-${action.label}`} action={action} onAction={onAction} />
          ))}
        </div>
      ) : null}
    </li>
  );
}
