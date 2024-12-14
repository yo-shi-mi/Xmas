import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThirdwebProvider } from 'thirdweb/react';
import { avalancheFuji } from "thirdweb/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

// 等待 DOM 加載完成
document.addEventListener('DOMContentLoaded', () => {
  // 初始化 Telegram WebApp
  if (window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    } catch (error) {
      console.warn('Telegram WebApp initialization error:', error);
    }
  } else {
    console.warn("Not running in Telegram environment");
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        chains={[avalancheFuji]}
        clientId={process.env.VITE_TEMPLATE_CLIENT_ID}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThirdwebProvider>
    </QueryClientProvider>
  </StrictMode>
);
