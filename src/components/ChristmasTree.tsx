import { useTreeStore } from '../stores/treeStore';
import { useWalletStore } from '../stores/walletStore';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

const BSC_COLLECTION_ADDRESS = '0x9b4f143098596edf962e27c7f358a86e3a4683a4';
const AVALANCHE_COLLECTION_ADDRESS = '0x9b4f143098596edf962e27c7f358a86e3a4683a4';

// 定義 NFT ABI
const NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

// 在 checkNFTExists 函數中，我們需要返回實際的數量而不是布林值
async function checkNFTExists(address: string, chain: string): Promise<number> {
  console.log(`開始檢查 ${chain} 鏈上的 NFT，地址:`, address);
  
  try {
    switch (chain) {
      case 'BSC': {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const collectionAddress = BSC_COLLECTION_ADDRESS;
        console.log('BSC Collection 地址:', collectionAddress);
        
        const contract = new ethers.Contract(collectionAddress, NFT_ABI, provider);
        const balance = await contract.balanceOf(address);
        console.log('BSC NFT 餘額:', balance.toString());
        return balance.toNumber();
      }
      
      case 'Avalanche': {
        const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');
        const collectionAddress = AVALANCHE_COLLECTION_ADDRESS;
        console.log('Avalanche Collection 地址:', collectionAddress);
        
        const contract = new ethers.Contract(collectionAddress, NFT_ABI, provider);
        const balance = await contract.balanceOf(address);
        console.log('Avalanche NFT 餘額:', balance.toString());
        return balance.toNumber();
      }
      
      case 'Solana': {
        try {
          const connection = new Connection('https://api.mainnet-beta.solana.com');
          if (address.startsWith('0x')) {
            console.log('跳過 Solana NFT 檢查 - 不是 Solana 地址格式');
            return 0;
          }
          const publicKey = new PublicKey(address);
          const nfts = await Metadata.findDataByOwner(connection, publicKey);
          console.log('Solana NFTs:', nfts.length);
          return nfts.length;
        } catch (error) {
          console.log('Solana 檢查錯誤，可能是地址格式不兼容:', error);
          return 0;
        }
      }
      
      default:
        throw new Error('不支援的鏈');
    }
  } catch (error) {
    console.error(`檢查 ${chain} NFT 時出錯:`, error);
    return 0;
  }
}

// 修改球的渲染邏輯
function generateBallPositions(count: number, color: string) {
  const positions = [];
  const treeTop = 10;    // 樹頂點的 y 座標
  const treeBottom = 90; // 樹底部的 y 座標
  const treeCenterX = 50; // 樹的中心 x 座標
  
  for (let i = 0; i < count; i++) {
    // 在樹的高度範圍內隨機選擇 y 座標
    const y = treeTop + Math.random() * (treeBottom - treeTop);
    
    // 根據 y 座標計算該高度的樹寬
    // 樹的形狀是三角形，所以寬度隨高度變化
    const treeWidth = ((y - treeTop) / (treeBottom - treeTop)) * 80; // 最大寬度是 80
    
    // 計算在該高度下的有效 x 範圍
    const minX = treeCenterX - (treeWidth / 2);
    const maxX = treeCenterX + (treeWidth / 2);
    
    // 在有效範圍內隨機選擇 x 座標
    const x = minX + Math.random() * (maxX - minX);
    
    positions.push({ x, y, color });
  }
  return positions;
}

export function ChristmasTree() {
  const { treeColor, trunkColor } = useTreeStore();
  const { address } = useWalletStore();
  const [ballPositions, setBallPositions] = useState<Array<{x: number, y: number, color: string}>>([]);

  useEffect(() => {
    const checkNFTs = async () => {
      if (!address) {
        console.log("沒有錢包地址，跳過 NFT 檢查");
        return;
      }

      console.log("開始檢查地址的 NFT:", address);
      try {
        const [bscCount, avalancheCount, solanaCount] = await Promise.all([
          checkNFTExists(address, 'BSC'),
          checkNFTExists(address, 'Avalanche'),
          checkNFTExists(address, 'Solana')
        ]);

        console.log("NFT 數量:", { BSC: bscCount, Avalanche: avalancheCount, Solana: solanaCount });

        const positions = [
          ...generateBallPositions(bscCount, '#FFFF00'),
          ...generateBallPositions(avalancheCount, '#FF0000'),
          ...generateBallPositions(solanaCount, '#800080')
        ];

        setBallPositions(positions);
      } catch (error) {
        console.error('檢查 NFT 時出錯:', error);
      }
    };

    checkNFTs();
  }, [address]);

  return (
    <svg viewBox="0 0 100 120" className="w-full h-full" style={{ maxHeight: '60vh' }}>
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
      
      {/* 渲染所有球 */}
      {ballPositions.map((ball, index) => (
        <circle
          key={index}
          cx={ball.x}
          cy={ball.y}
          r="3"
          fill={ball.color}
        />
      ))}
    </svg>
  );
}
