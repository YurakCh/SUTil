import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LandingPage from './components/LandingPage.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import { injectMaze } from './logic/maze-loader'
import './index.css'

function Router() {
  const [hash, setHash] = useState(window.location.hash);
  const [authorized, setAuthorized] = useState(sessionStorage.getItem('sutil_auth') === 'true');
  
  useEffect(() => {
    const onHashChange = () => {
       const newHash = window.location.hash;
       if (newHash === '#/app' && sessionStorage.getItem('sutil_auth') !== 'true') {
           window.location.hash = '';
       } else {
           setHash(newHash);
       }
    };
    
    if (window.location.hash === '#/app' && !authorized) {
       window.location.hash = '';
       setHash('');
    }

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [authorized]);

  const handleEnterApp = () => {
     sessionStorage.setItem('sutil_auth', 'true');
     setAuthorized(true);
     window.location.hash = '#/app';
  };

  return (
    <>
      {hash === '#/app' && authorized ? <App /> : <LandingPage onEnter={handleEnterApp} />}
      <CookieConsent onAccept={injectMaze} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
