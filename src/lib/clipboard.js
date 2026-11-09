// Salin teks ke clipboard. Cadangan untuk browser lama: textarea tersembunyi + execCommand.
export async function copyText(text) {
  try {
    if (globalThis.navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Lanjut ke cara cadangan di bawah.
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

// Bagikan lewat menu bawaan perangkat. Kalau tidak ada, salin ke clipboard.
// Hasil: 'shared' | 'copied' | 'cancelled' | 'failed'
export async function shareOrCopy(text) {
  if (globalThis.navigator?.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelled';
    }
  }
  return (await copyText(text)) ? 'copied' : 'failed';
}
