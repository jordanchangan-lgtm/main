import React, { useSyncExternalStore } from 'react';
import ReactDOM from 'react-dom/client';
import BrandLanding from './brands/BrandLanding.jsx';
import Hub from './brands/Hub.jsx';
import { BRANDS } from './brands/brands.js';

// Preview entry — the connected brand site as one page: a hub selector at the
// root, and the three brand landing pages at #/changan, #/deepal, #/nevo.
function subscribe(cb) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}
function useHash() {
  return useSyncExternalStore(subscribe, () => window.location.hash);
}

function Root() {
  const hash = useHash();
  const slug = hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  const brand = BRANDS[slug];
  if (brand) return <BrandLanding brand={brand} />;
  return <Hub />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
