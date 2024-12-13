import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Avalanche } from '@thirdweb-dev/chains';
import App from './App.tsx';
import './index.css';

<<<<<<< Updated upstream
// 確保 Telegram WebApp 正確初始化
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
=======
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
} else {
  console.warn("Not running in Telegram environment");
>>>>>>> Stashed changes
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
