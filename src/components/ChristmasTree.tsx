import { useTreeStore } from '../stores/treeStore';
import { useWalletStore } from '../stores/walletStore';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

// 在 App.tsx 或其他合適的地方定義 collection 地址
const BSC_COLLECTION_ADDRESS = 'YOUR_BSC_COLLECTION_ADDRESS';
const AVALANCHE_COLLECTION_ADDRESS = 'YOUR_AVALANCHE_COLLECTION_ADDRESS';

// 定義 NFT ABI
const NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

export function ChristmasTree() {
  const { treeColor, trunkColor } = useTreeStore();
  const { address } = useWalletStore();
  const [ballColors, setBallColors] = useState<string[]>(['#FF0000', '#0000FF', '#FFD700']); // 預設顏色

  useEffect(() => {
    const checkNFTs = async () => {
      if (!address) return;

      try {
        const [bscHasNFT, avalancheHasNFT, solanaHasNFT] = await Promise.all([
          checkNFTExists(address, 'BSC'),
          checkNFTExists(address, 'Avalanche'),
          checkNFTExists(address, 'Solana')
        ]);

        const colors = [];
        if (solanaHasNFT) colors.push('#800080'); // 紫色
        if (bscHasNFT) colors.push('#FFFF00'); // 黃色
        if (avalancheHasNFT) colors.push('#FF0000'); // 紅色

        setBallColors(colors.length > 0 ? colors : ['#FF0000', '#0000FF', '#FFD700']);
      } catch (error) {
        console.error('檢查 NFT 時出錯:', error);
      }
    };

    checkNFTs();
  }, [address]);

  return (
    <svg
      viewBox="0 0 100 120"
      className="w-full h-full"
      style={{ maxHeight: '60vh' }}
    >
      {/* 樹幹 */}
      <rect
        x="45"
        y="90"
        width="10"
        height="20"
        fill={trunkColor}
      />
      
      {/* 樹的三層 */}
      <polygon
        points="50,10 20,40 80,40"
        fill={treeColor}
      />
      <polygon
        points="50,30 15,65 85,65"
        fill={treeColor}
      />
      <polygon
        points="50,50 10,90 90,90"
        fill={treeColor}
      />
      
      {/* 星星 */}
      <polygon
        points="50,5 45,15 35,15 43,22 40,32 50,25 60,32 57,22 65,15 55,15"
        fill="#FFD700"
      />
      
      {/* 裝飾品 */}
      {ballColors.map((color, index) => (
        <circle key={index} cx={40 + index * 10} cy={35} r="3" fill={color} />
      ))}
    </svg>
  );
}

// 更新 checkNFTExists 函數
async function checkNFTExists(address: string, chain: string): Promise<boolean> {
  let provider;
  let collectionAddress;

  switch (chain) {
    case 'BSC':
      provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      collectionAddress = BSC_COLLECTION_ADDRESS;
      break;
    case 'Avalanche':
      provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');
      collectionAddress = AVALANCHE_COLLECTION_ADDRESS;
      break;
    case 'Solana':
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const publicKey = new PublicKey(address);
      const nfts = await Metadata.findDataByOwner(connection, publicKey);
      return nfts.length > 0; // 如果擁有 NFT，返回 true
    default:
      throw new Error('Unsupported chain');
  }

  const contract = new ethers.Contract(collectionAddress, NFT_ABI, provider);
  const balance = await contract.balanceOf(address);
  return balance.gt(0); // 如果擁有 NFT，返回 true
}
