import React, { useSyncExternalStore } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ChanganLanding from './brands/changan/ChanganLanding.jsx';

// Lightweight hash router — keeps the existing Mallouk homepage at "/" while
// exposing the brand landing pages at #/changan, #/deepal, #/nevo.
function subscribe(cb) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}
function useHash() {
  return useSyncExternalStore(subscribe, () => window.location.hash);
}

function Root() {
  const hash = useHash();
  if (hash.startsWith('#/changan')) return <ChanganLanding />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
