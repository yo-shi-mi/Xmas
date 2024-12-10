import React from 'react';
import { useTreeStore } from '../stores/treeStore';

const treeColors = [
  { name: 'Forest Green', value: '#228B22' },
  { name: 'Pine Green', value: '#2E8B57' },
  { name: 'Dark Green', value: '#006400' },
];

const trunkColors = [
  { name: 'Brown', value: '#8B4513' },
  { name: 'Dark Brown', value: '#654321' },
  { name: 'Light Brown', value: '#A0522D' },
];

export function ColorPicker() {
  const { setTreeColor, setTrunkColor } = useTreeStore();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tree Color</h3>
        <div className="flex gap-4">
          {treeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setTreeColor(color.value)}
              className="w-12 h-12 rounded-full shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Trunk Color</h3>
        <div className="flex gap-4">
          {trunkColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setTrunkColor(color.value)}
              className="w-12 h-12 rounded-full shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}