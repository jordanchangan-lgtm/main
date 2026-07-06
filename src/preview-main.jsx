import React, { useSyncExternalStore } from 'react';
import ReactDOM from 'react-dom/client';
import BrandLanding from './brands/BrandLanding.jsx';
import { BRANDS } from './brands/brands.js';

// Preview entry — renders only the three connected brand landing pages
// (no unrelated Mallouk homepage / assets), so the self-contained preview
// build stays small. Defaults to Changan.
function subscribe(cb) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}
function useHash() {
  return useSyncExternalStore(subscribe, () => window.location.hash);
}

function Root() {
  const hash = useHash();
  const slug = hash.replace(/^#\/?/, '').split(/[/?]/)[0] || 'changan';
  const brand = BRANDS[slug] || BRANDS.changan;
  return <BrandLanding brand={brand} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
