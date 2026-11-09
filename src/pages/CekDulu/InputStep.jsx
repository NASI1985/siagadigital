import { CHECK_CATEGORIES } from '../../data/checkInput.js';
import Card from '../../components/Card.jsx';
import Eyebrow from '../../components/Eyebrow.jsx';
import Heading from '../../components/Heading.jsx';
import ChoiceButton from '../../components/ChoiceButton.jsx';
import Button from '../../components/Button.jsx';
import Notice from '../../components/Notice.jsx';

const TOTAL_STEPS = 3;

export default function InputStep({ category, onCategoryChange, text, onTextChange, onUseExample, onSubmit }) {
  return (
    <div className="grid gap-8 two:grid-cols-2">
      <Card>
        <Eyebrow>Kenali · Langkah 1 dari {TOTAL_STEPS}</Eyebrow>
        <Heading as="h1" main className="mt-3">
          Apa yang mau dicek?
        </Heading>
        <ul className="mt-5 space-y-3" aria-label="Jenis yang dicek">
          {CHECK_CATEGORIES.map((item) => (
            <li key={item.id}>
              <ChoiceButton selected={item.id === category.id} onClick={() => onCategoryChange(item.id)}>
                {item.label}
              </ChoiceButton>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <Eyebrow>Langkah 2 · Tempel teks</Eyebrow>
        <Heading className="mt-3">
          <label htmlFor="teks-cek">Tempel pesannya</label>
        </Heading>
        <textarea
          id="teks-cek"
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder={category.placeholder}
          rows={8}
          className="mt-5 min-h-[240px] w-full resize-y rounded-xl border-2 border-line bg-surface p-4 text-[16px] leading-relaxed text-ink placeholder:text-muted focus:border-brand-ink"
        />
        <Button variant="outline" size="sm" onClick={onUseExample} className="mt-3 self-start">
          Coba contoh fiktif
        </Button>
        <Notice className="mt-3">
          Hapus nama, nomor, dan rekening asli dulu. Teks diproses di browsermu dan tidak dikirim ke server.
        </Notice>
        <div className="mt-auto pt-8">
          <Button fullWidth onClick={onSubmit}>
            Periksa (langkah {TOTAL_STEPS}: lihat hasil)
          </Button>
        </div>
      </Card>
    </div>
  );
}
