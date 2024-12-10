import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThirdwebProvider } from 'thirdweb/react';
import { avalanche } from "thirdweb/chains";
import App from './App.tsx';
import './index.css';

const tg = window.Telegram.WebApp;
tg.ready();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider 
      activeChain={avalanche}
      clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThirdwebProvider>
  </StrictMode>
);
