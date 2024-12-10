import { create } from 'zustand';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  setWallet: (address: string) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  address: null,
  setWallet: (address) => set({ isConnected: true, address }),
}));