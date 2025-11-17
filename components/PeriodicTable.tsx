import React from 'react';
import { CHEMICALS } from '../constants';
import { ChemicalItem } from './ChemicalItem';
import { Chemical } from '../types';

interface PeriodicTableProps {
  onAddChemical: (chemicalId: string) => void;
}

const elementPositions: { [key: number]: { row: number, col: number } } = {
  1: { row: 1, col: 1 }, 2: { row: 1, col: 18 },
  3: { row: 2, col: 1 }, 4: { row: 2, col: 2 },
  5: { row: 2, col: 13 }, 6: { row: 2, col: 14 }, 7: { row: 2, col: 15 }, 8: { row: 2, col: 16 }, 9: { row: 2, col: 17 }, 10: { row: 2, col: 18 },
  11: { row: 3, col: 1 }, 12: { row: 3, col: 2 },
  13: { row: 3, col: 13 }, 14: { row: 3, col: 14 }, 15: { row: 3, col: 15 }, 16: { row: 3, col: 16 }, 17: { row: 3, col: 17 }, 18: { row: 3, col: 18 },
  19: { row: 4, col: 1 }, 20: { row: 4, col: 2 }, 21: { row: 4, col: 3 }, 22: { row: 4, col: 4 }, 23: { row: 4, col: 5 }, 24: { row: 4, col: 6 }, 25: { row: 4, col: 7 }, 26: { row: 4, col: 8 }, 27: { row: 4, col: 9 }, 28: { row: 4, col: 10 }, 29: { row: 4, col: 11 }, 30: { row: 4, col: 12 },
  31: { row: 4, col: 13 }, 32: { row: 4, col: 14 }, 33: { row: 4, col: 15 }, 34: { row: 4, col: 16 }, 35: { row: 4, col: 17 }, 36: { row: 4, col: 18 },
  37: { row: 5, col: 1 }, 38: { row: 5, col: 2 }, 39: { row: 5, col: 3 }, 40: { row: 5, col: 4 }, 41: { row: 5, col: 5 }, 42: { row: 5, col: 6 }, 43: { row: 5, col: 7 }, 44: { row: 5, col: 8 }, 45: { row: 5, col: 9 }, 46: { row: 5, col: 10 }, 47: { row: 5, col: 11 }, 48: { row: 5, col: 12 },
  49: { row: 5, col: 13 }, 50: { row: 5, col: 14 }, 51: { row: 5, col: 15 }, 52: { row: 5, col: 16 }, 53: { row: 5, col: 17 }, 54: { row: 5, col: 18 },
  55: { row: 6, col: 1 }, 56: { row: 6, col: 2 }, 57: { row: 9, col: 3 }, 58: { row: 9, col: 4 }, 59: { row: 9, col: 5 }, 60: { row: 9, col: 6 }, 61: { row: 9, col: 7 }, 62: { row: 9, col: 8 }, 63: { row: 9, col: 9 }, 64: { row: 9, col: 10 }, 65: { row: 9, col: 11 }, 66: { row: 9, col: 12 }, 67: { row: 9, col: 13 }, 68: { row: 9, col: 14 }, 69: { row: 9, col: 15 }, 70: { row: 9, col: 16 }, 71: { row: 9, col: 17 },
  72: { row: 6, col: 4 }, 73: { row: 6, col: 5 }, 74: { row: 6, col: 6 }, 75: { row: 6, col: 7 }, 76: { row: 6, col: 8 }, 77: { row: 6, col: 9 }, 78: { row: 6, col: 10 }, 79: { row: 6, col: 11 }, 80: { row: 6, col: 12 },
  81: { row: 6, col: 13 }, 82: { row: 6, col: 14 }, 83: { row: 6, col: 15 }, 84: { row: 6, col: 16 }, 85: { row: 6, col: 17 }, 86: { row: 6, col: 18 },
  87: { row: 7, col: 1 }, 88: { row: 7, col: 2 }, 89: { row: 10, col: 3 }, 90: { row: 10, col: 4 }, 91: { row: 10, col: 5 }, 92: { row: 10, col: 6 }, 93: { row: 10, col: 7 }, 94: { row: 10, col: 8 }, 95: { row: 10, col: 9 }, 96: { row: 10, col: 10 }, 97: { row: 10, col: 11 }, 98: { row: 10, col: 12 }, 99: { row: 10, col: 13 }, 100: { row: 10, col: 14 }, 101: { row: 10, col: 15 }, 102: { row: 10, col: 16 }, 103: { row: 10, col: 17 },
  104: { row: 7, col: 4 }, 105: { row: 7, col: 5 }, 106: { row: 7, col: 6 }, 107: { row: 7, col: 7 }, 108: { row: 7, col: 8 }, 109: { row: 7, col: 9 }, 110: { row: 7, col: 10 }, 111: { row: 7, col: 11 }, 112: { row: 7, col: 12 },
  113: { row: 7, col: 13 }, 114: { row: 7, col: 14 }, 115: { row: 7, col: 15 }, 116: { row: 7, col: 16 }, 117: { row: 7, col: 17 }, 118: { row: 7, col: 18 },
};

const Placeholder: React.FC<{ row: number, col: number, text: string, color: string }> = ({ row, col, text, color }) => (
  <div style={{ gridRow: row, gridColumn: col }} className={`flex items-center justify-center text-center text-xs p-1 rounded-md ${color}`}>
    {text}
  </div>
);

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ onAddChemical }) => {
  const elements = CHEMICALS.filter(c => c.atomicNumber) as (Chemical & { atomicNumber: number })[];
  
  return (
    <div className="grid grid-cols-18 gap-1" style={{gridAutoRows: '1fr'}}>
      {elements.map(element => {
        const pos = elementPositions[element.atomicNumber];
        return (
          <div key={element.id} style={{ gridRow: pos.row, gridColumn: pos.col }} className="aspect-square">
            <ChemicalItem chemical={element} onAdd={onAddChemical} />
          </div>
        );
      })}
      <Placeholder row={6} col={3} text="57-71" color="bg-yellow-300/50" />
      <Placeholder row={7} col={3} text="89-103" color="bg-purple-300/50" />
      <div style={{gridRow: 8, gridColumn: 'span 18', height: '1rem'}}></div> {/* Spacer row */}
    </div>
  );
};