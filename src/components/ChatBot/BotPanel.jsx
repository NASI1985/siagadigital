import { useEffect, useRef, useState } from 'react';
import { Send, Shield, X } from 'lucide-react';
import { BOT_NAME } from '../../data/chatbot.js';
import BotMessage from './BotMessage.jsx';

export const PANEL_ID = 'siagabot-panel';
const TITLE_ID = 'siagabot-judul';
const INPUT_ID = 'siagabot-input';

// Panel chat: layar penuh di HP, kotak mengambang di kanan bawah mulai lebar 640px.
export default function BotPanel({ messages, onSend, onAction, onClose }) {
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Gulir ke pesan terbaru di dalam panel saja.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (draft.trim() === '') return;
    onSend(draft);
    setDraft('');
  };

  return (
    <div
      id={PANEL_ID}
      role="dialog"
      aria-modal="false"
      aria-labelledby={TITLE_ID}
      className="fixed inset-0 z-30 flex flex-col bg-surface sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(600px,calc(100vh-8rem))] sm:w-[400px] sm:overflow-hidden sm:rounded-card sm:border sm:border-line sm:shadow-2xl"
    >
      <div className="on-brand flex items-center gap-3 bg-brand px-4 py-3 text-white">
        <Shield aria-hidden="true" className="h-6 w-6 shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 id={TITLE_ID} className="text-lg font-extrabold leading-tight">
            {BOT_NAME}
          </h2>
          <p className="text-xs">Bukan AI · diproses di browsermu</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Tutup ${BOT_NAME}`}
          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-brand-deep"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <ol
        ref={listRef}
        aria-live="polite"
        aria-label="Percakapan dengan SiagaBot"
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
      >
        {messages.map((message) => (
          <BotMessage key={message.id} message={message} onAction={onAction} />
        ))}
      </ol>

      <form onSubmit={handleSubmit} className="border-t border-line p-3">
        <div className="flex gap-2">
          <label htmlFor={INPUT_ID} className="sr-only">
            Tulis pesan untuk {BOT_NAME}
          </label>
          <input
            ref={inputRef}
            id={INPUT_ID}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ceritain aja, misal: aku ditawarin kerja"
            autoComplete="off"
            className="min-h-[44px] min-w-0 flex-1 rounded-xl border-2 border-line bg-surface px-3 text-[16px] text-ink placeholder:text-muted focus:border-brand-ink"
          />
          <button
            type="submit"
            aria-label="Kirim"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white hover:bg-brand-deep"
          >
            <Send aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">Jangan ketik nama, nomor, atau rekening asli. Chat hilang saat halaman ditutup.</p>
      </form>
    </div>
  );
}
