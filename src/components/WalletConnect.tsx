import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { avalanche } from "thirdweb/chains";
import { client } from "../client";
import { useWalletStore } from '../stores/walletStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Share2 } from "lucide-react";
import { useEffect } from 'react';

export function WalletConnect() {
  const setWallet = useWalletStore((state) => state.setWallet);
  const { isConnected, address: storeAddress } = useWalletStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlAddress = queryParams.get('address');

  // 如果 URL 中有地址但 store 中沒有，則更新 store
  useEffect(() => {
    if (urlAddress && !storeAddress) {
      setWallet(urlAddress);
    }
  }, [urlAddress, storeAddress, setWallet]);

  const handleConnect = (wallet: any) => {
    console.log("Connected wallet object:", wallet);
    console.log("Connected wallet address:", wallet.address);
    console.log("Wallet chain ID:", wallet.chainId);
    setWallet(wallet.address);
    navigate(`/?address=${wallet.address}`);
  };

  const handleDisconnect = () => {
    setWallet('');
    navigate('/');
  };

  // 優先使用 store 中的地址，如果沒有則使用 URL 中的地址
  const displayAddress = storeAddress || urlAddress;

  return (
    <div className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold transition-colors">
      {!isConnected ? (
        <ConnectButton
          client={client}
          accountAbstraction={{
            chain: avalanche,
            sponsorGas: true
          }}
          wallets={[
            inAppWallet({
              auth: {
                options: ["telegram", "email", "passkey", "phone"]
              }
            })
          ]}
          onConnect={handleConnect}
        />
      ) : (
        <>
            <span className="ml-4">已連接: {displayAddress}</span>
          <button
            onClick={() => navigate('/gifts')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            My Gifts
          </button>
          <button
            onClick={() => {
                const currentUrl = window.location.href;
                window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${currentUrl}`);
            }}
              className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold transition-colors"
          >
              <Share2 className="w-6 h-6" />
              Share Tree
          </button>
          <button
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
          >
            登出
          </button>
        </>
      )}
    </div>
  );
}