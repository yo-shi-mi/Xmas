import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Avalanche } from '@thirdweb-dev/chains';
import App from './App.tsx';
import './index.css';

if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
} else {
  console.warn("Not running in Telegram environment");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider 
      activeChain={Avalanche}
      clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThirdwebProvider>
  </StrictMode>
);
