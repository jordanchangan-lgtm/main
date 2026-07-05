import React, { useSyncExternalStore } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import BrandLanding from './brands/BrandLanding.jsx';
import { BRANDS } from './brands/brands.js';

// Lightweight hash router — keeps the existing Mallouk homepage at "/" while
// exposing the three connected brand landing pages at #/changan, #/deepal,
// #/nevo.
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
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
