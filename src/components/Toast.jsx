// Toast global: panggil useToast()("Pesan") dari komponen mana pun.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const TOAST_DURATION_MS = 2600;
const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast({ message, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4"
      >
        {toast ? (
          <p key={toast.id} className="rounded-full bg-ink px-5 py-3 text-[15px] font-semibold text-on-ink shadow-lg">
            {toast.message}
          </p>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
