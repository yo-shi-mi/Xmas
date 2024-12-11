import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Avalanche } from '@thirdweb-dev/chains';
import App from './App.tsx';
import './index.css';

const tg = window.Telegram.WebApp;
tg.ready();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider 
      activeChain={Avalanche}
      clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
      dAppMeta={{
        name: "Christmas Gift Exchange",
        description: "Exchange Christmas gifts on blockchain",
        logoUrl: "https://example.com/logo.png",
        url: "https://your-dapp-url.com",
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThirdwebProvider>
  </StrictMode>
);
