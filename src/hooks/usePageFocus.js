// Saat halaman atau langkah berganti: gulir ke atas dan pindahkan fokus ke judul utama.
import { useEffect, useRef } from 'react';

export function focusMainHeading() {
  window.scrollTo({ top: 0 });
  const heading = document.querySelector('[data-main-heading]');
  heading?.focus({ preventScroll: true });
}

// Tidak berjalan saat pertama dimuat (juga aman di StrictMode), hanya saat `key` berubah.
export function usePageFocus(key) {
  const previousKey = useRef(key);

  useEffect(() => {
    if (previousKey.current === key) return;
    previousKey.current = key;
    focusMainHeading();
  }, [key]);
}
