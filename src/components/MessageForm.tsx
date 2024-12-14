import React, { useState, useEffect } from 'react';
import { Lock, Send } from 'lucide-react';
import { useContract, useContractWrite, useSDK, useConnect, metamaskWallet } from '@thirdweb-dev/react';
import { useActiveAccount } from 'thirdweb/react';
import { contractABI } from '../contractABI';

const CONTRACT_ADDRESS = "0x007E3B0f772a5012CC1e3FEF67Bcd87167DB2FAD";


interface MessageFormProps {
  onClose: () => void;
  metadata: {
    recipient: string;
    style?: string;
    color?: string;
    message: string;
    tokenURI: string;
  }
}

export function MessageForm({ onClose, metadata }: MessageFormProps) {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeAccount = useActiveAccount();
  const { contract } = useContract(CONTRACT_ADDRESS, contractABI[0].abi);
  const { mutateAsync: send } = useContractWrite(contract, "send");
  const sdk = useSDK();
  const connect = useConnect();
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  useEffect(() => {
    const initWallet = async () => {
      if (!activeAccount && sdk && !hasAttemptedConnection) {
        setHasAttemptedConnection(true);
        try {
          const connected = await connect(metamaskWallet());
          console.log("錢包連接狀態:", connected);
        } catch (error) {
          console.error("錢包連接失敗:", error);
        }
      }
    };
    
    initWallet();
  }, [activeAccount, sdk, hasAttemptedConnection]);

useEffect(() => {
  if (contract) {
    console.log("合約地址:", CONTRACT_ADDRESS);
    const functions = contractABI[0].abi
      .filter((item: any) => item.type === "function")
      .map((item: any) => ({
        name: item.name,
        inputs: item.inputs,
        stateMutability: item.stateMutability
      }));
    
    console.log("合約函數列表:", functions);
  }
}, [contract]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!contract) {
        throw new Error("合約未初始化");
      }

      console.log("準備調用合約函數，參數:", {
        recipient,
        style: metadata.style,
        color: metadata.color,
        message: message,
        tokenURI: metadata.tokenURI
      });

      const tx = await send({
        overrides: {
          gasLimit: 500000,
        },
        args: [
          recipient,
          metadata.style,
          metadata.color,
          message,
          metadata.style
        ]
      });

      console.log("交易發送成功:", tx);
      const receipt = await tx.receipt;
      console.log("交易已確認:", receipt);
      onClose();
    } catch (error: any) {
      console.error("交易失敗:", error);
      alert(`儲存禮物資訊失敗: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Compose Message</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient's Wallet Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="0x..."
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Christmas Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Write your special Christmas message here..."
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Lock className="w-4 h-4 mr-1" />
            <span>Message will be encrypted until Christmas</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:bg-purple-400"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}