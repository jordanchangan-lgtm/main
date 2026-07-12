import React, { useSyncExternalStore } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import BrandLanding from './brands/BrandLanding.jsx';
import BrandIntro from './brands/BrandIntro.jsx';
import Hub from './brands/Hub.jsx';
import { BRANDS } from './brands/brands.js';

// Lightweight hash router — keeps the existing Mallouk homepage at "/" while
// exposing the connected brand experience: the hub selector at #/home (or
// #/brands) and the three brand landing pages at #/changan, #/deepal, #/nevo.
function subscribe(cb) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}
function useHash() {
  return useSyncExternalStore(subscribe, () => window.location.hash);
}

function Root() {
  const hash = useHash();
  const parts = hash.replace(/^#\/?/, '').split(/[/?]/);
  const slug = parts[0];
  const sub = parts[1];
  const brand = BRANDS[slug];
  // key by slug so switching brands remounts the page — you land back on the
  // brand's opening ("dive into") hero section instead of keeping the old scroll.
  if (brand) return sub === 'intro' ? <BrandIntro key={slug} brand={brand} /> : <BrandLanding key={slug} brand={brand} />;
  if (slug === 'home' || slug === 'brands') return <Hub />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
