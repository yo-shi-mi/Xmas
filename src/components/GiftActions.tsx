import { Gift, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function GiftActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => navigate('/gifts')}
        className="bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold transition-colors"
      >
        <Gift className="w-6 h-6" />
        View My Gifts
      </button>
      <button
        onClick={() => {
          // 使用 Telegram 的分享功能
          window.Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=' + window.location.href);
        }}
        className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold transition-colors"
      >
        <Share2 className="w-6 h-6" />
        Share Tree
      </button>
    </div>
  );
}