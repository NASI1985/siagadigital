// useState yang disimpan di localStorage. Data rusak atau storage diblokir -> nilai default.
import { useEffect, useState } from 'react';
import { readStored, writeStored } from '../lib/storage.js';

export function usePersistedState(key, fallback, isValid) {
  const [value, setValue] = useState(() => readStored(key, isValid, fallback));

  useEffect(() => {
    writeStored(key, value);
  }, [key, value]);

  return [value, setValue];
}
