import { Gift, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../stores/walletStore';
import { useEffect, useState } from 'react';
import { MessageForm } from '../components/MessageForm';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { AvalancheFuji } from '@thirdweb-dev/chains';
import { metamaskWallet } from '@thirdweb-dev/react';

interface Gift {
  recipient: string;
    style?: string;
    color?: string;
    message: string;
    tokenURI: string;
}

const GIFT_STYLES = {
  PURPLE: {
    color: '#800080',
    uri: 'ipfs://bafkreicxyr4q4is44pkjoazlug2t3sqzua7tkuscpts6xkiuf4tsfaacxy/'
  },
  RED: {
    color: '#FF0000',
    uri: 'ipfs://bafkreigpqwykzf475mgnol2yoiacmklx4pmwj54ehte5wiu5n4knpvkx6e/'
  },
  YELLOW: {
    color: '#FFFF00',
    uri: 'ipfs://bafkreie2qzwhcs5yjsq5mibitdosoz4dhm72ve7a4wq52mc72hcpuxqjpq/'
  }
};

export function MyGiftsPage() {
  const navigate = useNavigate();
  const { isConnected, address } = useWalletStore();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  const handleDrawGift = () => {
    const lastDrawDate = localStorage.getItem('lastDrawDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastDrawDate === today) {
      alert('您今天已經抽取過禮物，請明天再試！');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const giftStyles = Object.values(GIFT_STYLES);
      const randomStyle = giftStyles[Math.floor(Math.random() * giftStyles.length)];
      const newGift: Gift = {
        recipient: address || 'Anonymous',
        color: randomStyle.color,
        style: randomStyle.uri,
        message: '',
        tokenURI: randomStyle.uri
      };

      setGifts((prevGifts) => [...prevGifts, newGift]);
      localStorage.setItem('lastDrawDate', today);
      setLoading(false);
    }, 2000);
  };

  const handleGiftClick = (gift: Gift) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-red-50">
      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-green-800 hover:text-green-600 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回
        </button>

        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">
          我的禮物
        </h1>

        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {gifts.map((gift) => (
            <div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              onClick={() => handleGiftClick(gift)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: gift.color }}>
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">來自</p>
                  <p className="text-gray-800 font-medium">{gift.recipient}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && selectedGift && (
          <ThirdwebProvider
            activeChain={AvalancheFuji}
            clientId={process.env.VITE_TEMPLATE_CLIENT_ID}
            supportedWallets={[
              metamaskWallet(),
            ]}
            authConfig={{
              authUrl: "/api/auth",
              domain: window.location.origin,
            }}
          >
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-black opacity-50 absolute inset-0" onClick={() => setIsModalOpen(false)} />
              <div className="bg-white rounded-lg p-6 z-10">
                <MessageForm 
                  onClose={() => setIsModalOpen(false)} 
                  metadata={{
                    recipient: selectedGift.recipient,
                    style: selectedGift.style || "default",
                    color: selectedGift.color || "#000000",
                    message: selectedGift.message || "",
                    tokenURI: selectedGift.tokenURI || ""
                  }} 
                />
              </div>
            </div>
          </ThirdwebProvider>
        )}

        <button
          onClick={handleDrawGift}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mb-4"
          disabled={loading}
        >
          {loading ? '抽取中...' : '抽取禮物'}
        </button>
      </main>
    </div>
  );
} 