import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { avalanche } from "thirdweb/chains";
import { client } from "../client";
import { useWalletStore } from '../stores/walletStore';
import { useNavigate } from 'react-router-dom';

export function WalletConnect() {
  const setWallet = useWalletStore((state) => state.setWallet);
  const { isConnected, address } = useWalletStore();
  const navigate = useNavigate();

  const handleConnect = (wallet: any) => {
    console.log("Connected wallet object:", wallet);
    console.log("Connected wallet address:", wallet.address);
    console.log("Wallet chain ID:", wallet.chainId);
    setWallet(wallet.address);
  };

  const handleDisconnect = () => {
    setWallet(''); // 清除錢包地址
  };

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
          <span className="ml-4">已連接: {address}</span>
          <button
            onClick={() => navigate('/gifts')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            My Gifts
          </button>
          <button
            onClick={() => {
              window.Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=' + window.location.href);
            }}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
          >
            Share My Links
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