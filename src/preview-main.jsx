import React, { useSyncExternalStore } from 'react';
import ReactDOM from 'react-dom/client';
import BrandLanding from './brands/BrandLanding.jsx';
import BrandIntro from './brands/BrandIntro.jsx';
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
  const parts = hash.replace(/^#\/?/, '').split(/[/?]/);
  const slug = parts[0];
  const sub = parts[1];
  const brand = BRANDS[slug];
  // key by slug so switching brands remounts the page — you land back on the
  // brand's opening ("dive into") hero section instead of keeping the old scroll.
  if (brand) return sub === 'intro' ? <BrandIntro key={slug} brand={brand} /> : <BrandLanding key={slug} brand={brand} />;
  return <Hub />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
