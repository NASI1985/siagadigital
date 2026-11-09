import { useEffect, useState } from 'react';
import { ToastProvider } from './components/Toast.jsx';
import ChatBot from './components/ChatBot/ChatBot.jsx';
import { useHashRoute, navigateTo, NAV_ITEMS } from './hooks/useHashRoute.js';
import { usePageFocus } from './hooks/usePageFocus.js';
import Beranda from './pages/Beranda.jsx';
import Tentang from './pages/Tentang.jsx';
import CekDulu from './pages/CekDulu/index.jsx';
import Latihan from './pages/Latihan/index.jsx';
import Bantuan from './pages/Bantuan/index.jsx';

function Header({ route }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/60 bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 sm:px-6 lg:px-12 lg:py-5">
        <a href="#beranda" className="flex min-h-[44px] items-center text-[22px] font-extrabold tracking-tight">
          <span className="text-ink">Siaga</span>
          <span className="text-brand-ink">Digital</span>
        </a>
        <nav aria-label="Menu utama">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:gap-x-7">
            {NAV_ITEMS.map((item) => {
              const isActive = item.route === route;
              return (
                <li key={item.route}>
                  <a
                    href={`#${item.route}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex min-h-[44px] items-center text-[15px] font-semibold underline-offset-[6px] hover:underline ${
                      isActive ? 'underline decoration-2 decoration-brand-ink' : ''
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  const route = useHashRoute();
  // Niat dari halaman lain, misalnya "Aku sudah transfer" -> Bantuan dengan kejadian terpilih.
  const [emergencyIntent, setEmergencyIntent] = useState(null);
  usePageFocus(route);

  // Niat hanya berlaku sekali: buang saat pengguna meninggalkan Bantuan.
  useEffect(() => {
    if (route !== 'bantuan') setEmergencyIntent(null);
  }, [route]);

  const openEmergency = (incidentId) => {
    setEmergencyIntent({ incidentId, id: Date.now() });
    navigateTo('bantuan');
  };

  let page;
  if (route === 'cek') page = <CekDulu onOpenEmergency={openEmergency} />;
  else if (route === 'latih') page = <Latihan />;
  else if (route === 'bantuan') page = <Bantuan key={emergencyIntent?.id ?? 'awal'} intent={emergencyIntent} />;
  else if (route === 'tentang') page = <Tentang />;
  else page = <Beranda />;

  return (
    <ToastProvider>
      <a
        href="#konten"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('konten')?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-30 focus:rounded-xl focus:bg-ink focus:px-4 focus:py-3 focus:text-on-ink"
      >
        Lewati ke konten
      </a>
      <Header route={route} />
      {/* pb-28 supaya tombol SiagaBot tidak menutupi tombol di dasar halaman. */}
      <main id="konten" tabIndex={-1} className="mx-auto w-full max-w-[1280px] px-4 pb-28 pt-6 outline-none sm:px-6 lg:px-12 lg:pt-12">
        {page}
      </main>
      <ChatBot onOpenEmergency={openEmergency} />
    </ToastProvider>
  );
}
