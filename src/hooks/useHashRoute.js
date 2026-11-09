// Router hash sederhana: #beranda, #cek, #latih, #bantuan, #tentang.
import { useEffect, useState } from 'react';

export const DEFAULT_ROUTE = 'beranda';

export const NAV_ITEMS = [
  { route: 'cek', label: 'Cek Dulu' },
  { route: 'latih', label: 'Latihan' },
  { route: 'bantuan', label: 'Bantuan' },
  { route: 'tentang', label: 'Tentang' },
];

const KNOWN_ROUTES = new Set([DEFAULT_ROUTE, ...NAV_ITEMS.map((item) => item.route)]);

// Hash tak dikenal kembali ke beranda.
export function parseHash(hash) {
  const route = (hash ?? '').replace(/^#\/?/, '').toLowerCase();
  return KNOWN_ROUTES.has(route) ? route : DEFAULT_ROUTE;
}

export function navigateTo(route) {
  window.location.hash = route;
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  return route;
}
