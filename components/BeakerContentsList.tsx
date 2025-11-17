import React from 'react';
import { BeakerEntry, Chemical } from '../types';
import { CHEMICALS } from '../constants';

interface BeakerContentsListProps {
  entries: BeakerEntry[];
  onRemove: (chemicalId: string) => void;
  onUpdate: (chemicalId: string, quantity: number, unit: 'mol' | 'g') => void;
  disabled: boolean;
}

export const BeakerContentsList: React.FC<BeakerContentsListProps> = ({ entries, onRemove, onUpdate, disabled }) => {

  const getChemical = (id: string): Chemical | undefined => CHEMICALS.find(c => c.id === id);

  if (entries.length === 0) {
    return (
      <div className="min-h-[150px] flex items-center justify-center bg-lab-bg p-4 rounded-lg border border-lab-border">
        <p className="text-lab-text-secondary">Beaker is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
      {entries.map(entry => {
        const chemical = getChemical(entry.chemicalId);
        if (!chemical) return null;

        return (
          <div key={entry.chemicalId} className={`flex items-center justify-between bg-lab-bg p-2 rounded-lg border border-lab-border text-sm ${disabled ? 'opacity-50' : ''}`}>
            <div className="flex-grow">
                <p className="font-semibold text-lab-text">{chemical.name}</p>
                <p className="font-mono text-xs text-lab-text-secondary">{chemical.formula}</p>
            </div>
            <div className="flex items-center space-x-2">
                <input 
                    type="number"
                    value={entry.quantity}
                    onChange={(e) => onUpdate(entry.chemicalId, parseFloat(e.target.value) || 0, entry.unit)}
                    className="w-20 bg-lab-bg-light border border-lab-border rounded-md px-2 py-1 text-right text-lab-text focus:outline-none focus:ring-1 focus:ring-accent-blue disabled:cursor-not-allowed"
                    min="0"
                    step="0.01"
                    disabled={disabled}
                />
                <select 
                    value={entry.unit}
                    onChange={(e) => onUpdate(entry.chemicalId, entry.quantity, e.target.value as 'mol' | 'g')}
                    className="bg-lab-bg-light border border-lab-border rounded-md px-2 py-1 text-lab-text focus:outline-none focus:ring-1 focus:ring-accent-blue disabled:cursor-not-allowed"
                    disabled={disabled}
                >
                    <option value="mol">mol</option>
                    <option value="g">g</option>
                </select>
                <button 
                    onClick={() => onRemove(entry.chemicalId)} 
                    className="ml-2 text-red-400 hover:text-red-200 text-xl font-bold leading-none flex-shrink-0 disabled:cursor-not-allowed disabled:text-gray-500"
                    aria-label={`Remove ${chemical.name}`}
                    disabled={disabled}
                >
                    &times;
                </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};