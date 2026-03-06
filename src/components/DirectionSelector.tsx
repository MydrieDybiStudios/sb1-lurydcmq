import React, { useState } from 'react';
import { X } from 'lucide-react';
import { directions } from '../data/directionsData';

interface DirectionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (directionId: string) => void;
  currentDirection?: string;
}

const DirectionSelector: React.FC<DirectionSelectorProps> = ({
  isOpen, onClose, onSelect, currentDirection
}) => {
  const [selected, setSelected] = useState(currentDirection || '');

  if (!isOpen) return null;

  const handleSelect = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Выберите направление</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        <div className="space-y-3">
          {directions.map(dir => (
            <div
              key={dir.id}
              className={`p-3 border rounded-lg cursor-pointer transition ${
                selected === dir.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelected(dir.id)}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{dir.icon}</span>
                <div>
                  <p className="font-bold">{dir.name}</p>
                  <p className="text-sm text-gray-600">{dir.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Отмена
          </button>
          <button
            onClick={handleSelect}
            disabled={!selected}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg disabled:opacity-50"
          >
            Выбрать
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectionSelector;
