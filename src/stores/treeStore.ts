import { create } from 'zustand';

interface TreeState {
  treeColor: string;
  trunkColor: string;
  setTreeColor: (color: string) => void;
  setTrunkColor: (color: string) => void;
}

export const useTreeStore = create<TreeState>((set) => ({
  treeColor: '#228B22',
  trunkColor: '#8B4513',
  setTreeColor: (color) => set({ treeColor: color }),
  setTrunkColor: (color) => set({ trunkColor: color }),
}));