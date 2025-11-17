import React from 'react';
import type { Chemical } from '../types';

interface ChemicalItemProps {
  chemical: Chemical;
  onAdd: (chemicalId: string) => void;
  onShowDetails?: (chemical: Chemical) => void;
}

export const ChemicalItem: React.FC<ChemicalItemProps> = ({ chemical, onAdd, onShowDetails }) => {
  const isLightBg = !['bg-gray-800', 'bg-orange-800', 'bg-red-600', 'bg-purple-700', 'bg-gray-500'].some(c => chemical.color.includes(c));
  const textColor = isLightBg ? 'text-black' : 'text-white';

  const handleClick = () => {
    if (chemical.atomicNumber && onShowDetails) {
        onShowDetails(chemical);
    } else {
        onAdd(chemical.id);
    }
  };
  
  const titleText = chemical.atomicNumber && chemical.ionizationEnergy
    ? `${chemical.name}\nIonization Energy: ${chemical.ionizationEnergy} kJ/mol`
    : chemical.name;

  return (
    <div
      onClick={handleClick}
      title={titleText}
      className="p-2 border border-lab-border rounded-lg text-center cursor-pointer transform hover:scale-105 hover:border-accent-blue transition-all duration-200 bg-lab-bg flex flex-col justify-between h-full"
    >
      {chemical.atomicNumber ? (
        // Periodic Table Tile for Elements as a "Logo"
        <div className={`w-full aspect-square ${chemical.color} rounded-md p-1 flex flex-col justify-between text-left shadow-lg border border-white/20 ${textColor}`}>
          <div className="text-xs font-medium opacity-80">{chemical.atomicNumber}</div>
          <div 
            className="text-center text-3xl font-bold leading-none select-none"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}
          >
            {chemical.formula}
          </div>
          <div className="text-center text-[10px] font-medium truncate">{chemical.name}</div>
        </div>
      ) : (
        // Circle for Compounds
        <div className="flex-grow flex flex-col items-center justify-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold ${chemical.color} ${textColor}`}>
                <span className="text-lg">{chemical.formula}</span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-lab-text">{chemical.name}</p>
              <p className="text-xs font-mono text-lab-text-secondary">{chemical.formula}</p>
            </div>
        </div>
      )}
      <p className="text-xs text-lab-text-secondary mt-1 shrink-0">({chemical.state})</p>
    </div>
  );
};