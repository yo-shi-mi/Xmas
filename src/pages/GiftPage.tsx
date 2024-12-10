import { Gift, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../stores/walletStore';
import { useEffect, useState } from 'react';
import { MessageForm } from '../components/MessageForm';

interface Gift {
  id: number;
  from: string;
  color: string;
}

export function MyGiftsPage() {
  const navigate = useNavigate();
  const { isConnected } = useWalletStore();
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
      const colors = ['#800080', '#FFFF00', '#FF0000'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newGift: Gift = {
        id: gifts.length + 1,
        from: '0x123...',
        color: randomColor,
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
              key={gift.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              onClick={() => handleGiftClick(gift)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: gift.color }}>
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">來自</p>
                  <p className="text-gray-800 font-medium">{gift.from}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && selectedGift && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black opacity-50 absolute inset-0" onClick={() => setIsModalOpen(false)} />
            <div className="bg-white rounded-lg p-6 z-10">
              <MessageForm onClose={() => setIsModalOpen(false)} metadata={{
                id: selectedGift.id,
                from: selectedGift.from,
                message: '',
                date: '',
                nftCollection: '',
                nftId: '',
                chainId: ''
              }} />
            </div>
          </div>
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