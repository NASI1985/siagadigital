import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BOT_NAME } from '../../data/chatbot.js';
import { greetingMessage, respond, INITIAL_BOT_CONTEXT } from '../../lib/chatbot.js';
import { navigateTo } from '../../hooks/useHashRoute.js';
import BotPanel, { PANEL_ID } from './BotPanel.jsx';

// Tombol mengambang + panel SiagaBot. Riwayat chat hanya ada di memori (state),
// tidak disimpan ke localStorage dan tidak dikirim ke mana pun.
export default function ChatBot({ onOpenEmergency }) {
  const [isOpen, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [{ ...greetingMessage(), from: 'bot', id: 0 }]);
  const [context, setContext] = useState(INITIAL_BOT_CONTEXT);
  const nextId = useRef(1);
  const launcherRef = useRef(null);

  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  // Escape menutup panel.
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const withId = (message) => ({ ...message, id: nextId.current++ });

  const send = (text) => {
    const result = respond(text, context);
    setMessages((previous) => [
      ...previous,
      withId({ from: 'user', text: text.trim() }),
      ...result.messages.map((message) => withId({ ...message, from: 'bot' })),
    ]);
    setContext(result.context);
  };

  const handleAction = (action) => {
    if (action.type === 'send') send(action.message);
    if (action.type === 'navigate') {
      setOpen(false);
      navigateTo(action.route);
    }
    if (action.type === 'emergency') {
      setOpen(false);
      onOpenEmergency(action.incidentId);
    }
  };

  return (
    <>
      {isOpen ? <BotPanel messages={messages} onSend={send} onAction={handleAction} onClose={close} /> : null}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (isOpen ? close() : setOpen(true))}
        aria-expanded={isOpen}
        aria-controls={isOpen ? PANEL_ID : undefined}
        aria-label={isOpen ? `Tutup ${BOT_NAME}` : `Buka ${BOT_NAME}`}
        className={`fixed bottom-5 right-5 z-30 h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-deep sm:bottom-6 sm:right-6 ${
          isOpen ? 'hidden sm:flex' : 'flex'
        }`}
      >
        {isOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <MessageCircle aria-hidden="true" className="h-6 w-6" />}
      </button>
    </>
  );
}
