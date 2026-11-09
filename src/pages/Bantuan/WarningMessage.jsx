import { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';
import { WARNING_TONES } from '../../data/emergency.js';
import { buildWarningMessage, whatsappShareUrl } from '../../lib/emergency.js';
import { copyText } from '../../lib/clipboard.js';
import { useToast } from '../../components/Toast.jsx';
import Card from '../../components/Card.jsx';
import Heading from '../../components/Heading.jsx';
import Pill from '../../components/Pill.jsx';
import Button from '../../components/Button.jsx';

export default function WarningMessage({ incidentId }) {
  const [toneId, setToneId] = useState(WARNING_TONES[0].id);
  const showToast = useToast();
  const message = buildWarningMessage(toneId, incidentId);

  const handleCopy = async () => {
    const copied = await copyText(message);
    showToast(copied ? 'Tersalin' : 'Gagal menyalin. Coba salin manual ya');
  };

  return (
    <Card>
      <Heading>Peringatkan teman &amp; keluarga</Heading>
      <div role="group" aria-label="Nada pesan" className="mt-4 flex flex-wrap gap-2">
        {WARNING_TONES.map((tone) => (
          <Pill
            key={tone.id}
            tone={tone.id === toneId ? 'ink' : 'soft'}
            pressed={tone.id === toneId}
            onClick={() => setToneId(tone.id)}
          >
            {tone.label}
          </Pill>
        ))}
      </div>
      <p aria-live="polite" className="mt-4 rounded-xl bg-subtle px-5 py-4 leading-relaxed">
        {message}
      </p>
      <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
        <Button variant="outline" onClick={handleCopy}>
          <Copy aria-hidden="true" className="h-4 w-4" />
          Salin
        </Button>
        <Button href={whatsappShareUrl(message)} target="_blank" rel="noopener noreferrer">
          <Share2 aria-hidden="true" className="h-4 w-4" />
          Bagikan ke WhatsApp
        </Button>
      </div>
    </Card>
  );
}
