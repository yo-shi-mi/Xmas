import { Routes, Route } from 'react-router-dom';
import { ChristmasTree } from './components/ChristmasTree';
import { ColorPicker } from './components/ColorPicker';
import { WalletConnect } from './components/WalletConnect';
import { GiftActions } from './components/GiftActions';
import { useWalletStore } from './stores/walletStore';
import { MyGiftsPage } from './pages/GiftPage';

// 添加 Telegram WebApp 類型聲明
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe: {
          user: {
            id: number;
          };
        };
        ready: () => void;
        openTelegramLink: (url: string) => void;
        expand: () => void;
      };
    };
    ethereum?: any; // 修正 ethereum 類型聲明
  }
}

function HomePage() {
  const { isConnected } = useWalletStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-red-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">
          Christmas Gift Exchange
        </h1>
        
        <div className="w-full max-w-md mx-auto mb-8">
          <ChristmasTree />
        </div>

        <div className="max-w-2xl mx-auto">
          {!isConnected && <ColorPicker />}
          <div className="mt-8">
            {!isConnected ? (
              <WalletConnect />
            ) : (
              <GiftActions />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gifts" element={<MyGiftsPage />} />
    </Routes>
  );
}

export default App;