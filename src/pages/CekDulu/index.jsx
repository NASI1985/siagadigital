import { useState } from 'react';
import { analyze, MAX_INPUT_LENGTH } from '../../lib/analyzer.js';
import { DEFAULT_CATEGORY_ID, findCategory } from '../../data/checkInput.js';
import { TRANSFER_INCIDENT_ID } from '../../data/emergency.js';
import { useToast } from '../../components/Toast.jsx';
import { usePageFocus } from '../../hooks/usePageFocus.js';
import InputStep from './InputStep.jsx';
import ResultStep from './ResultStep.jsx';

// Teks hanya hidup di state komponen: tidak disimpan dan tidak dikirim ke mana pun.
export default function CekDulu({ onOpenEmergency }) {
  const [step, setStep] = useState('input');
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORY_ID);
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const showToast = useToast();
  usePageFocus(step);

  const category = findCategory(categoryId);

  // Batasi 8.000 karakter supaya pengecekan tetap cepat di HP.
  const handleTextChange = (value) => {
    if (value.length > MAX_INPUT_LENGTH) {
      setText(value.slice(0, MAX_INPUT_LENGTH));
      showToast('Teks terlalu panjang, dipotong');
      return;
    }
    setText(value);
  };

  const handleSubmit = () => {
    if (text.trim() === '') {
      showToast('Tempel teksnya dulu ya');
      return;
    }
    setResult(analyze(text));
    setStep('result');
  };

  if (step === 'result' && result) {
    return (
      <ResultStep
        category={category}
        text={text}
        result={result}
        onRecheck={() => setStep('input')}
        onReportTransfer={() => onOpenEmergency(TRANSFER_INCIDENT_ID)}
      />
    );
  }

  return (
    <InputStep
      category={category}
      onCategoryChange={setCategoryId}
      text={text}
      onTextChange={handleTextChange}
      onUseExample={() => setText(category.example)}
      onSubmit={handleSubmit}
    />
  );
}
