import React, { useState } from 'react';
import { Send, Lock } from 'lucide-react';

interface MessageFormProps {
  onClose: () => void;
  metadata: {
    id: number;
    from: string;
    message: string;
    date: string;
    nftCollection: string;
    nftId: string;
    chainId: string;
  };
}

export function MessageForm({ onClose, metadata }: MessageFormProps) {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 加密訊息
    const encryptedMessage = btoa(message); // 使用 Base64 編碼作為示例

    // 準備上鏈的資料
    const dataToSend = {
      recipient,
      encryptedMessage,
      metadata,
    };

    // 在這裡實現上鏈邏輯
    console.log('Sending data to chain:', dataToSend);
    // 這裡可以調用合約的函數來上鏈

    // 清空輸入框
    setRecipient('');
    setMessage('');
    onClose(); // 關閉 modal
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Compose Message</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient's Telegram Username
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="@username"
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </div>
      </form>
    </div>
  );
}