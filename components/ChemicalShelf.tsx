import React, { useState } from 'react';
import { CHEMICALS } from '../constants';
import { ChemicalItem } from './ChemicalItem';
import { FlaskConicalIcon, SearchIcon } from './icons/Icons';

interface ChemicalShelfProps {
  onAddChemical: (chemicalId: string) => void;
}

export const ChemicalShelf: React.FC<ChemicalShelfProps> = ({ onAddChemical }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChemicals = CHEMICALS.filter(chemical =>
    !chemical.atomicNumber && // Only show compounds
    (
      chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chemical.formula.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-lab-bg-light p-4 rounded-lg border border-lab-border h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 flex items-center shrink-0">
        <FlaskConicalIcon className="w-5 h-5 mr-2 text-accent-blue"/>Compound Shelf
      </h2>
      <div className="relative mb-4 shrink-0">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lab-text-secondary" />
        <input
          type="text"
          placeholder="Search for a compound..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-lab-bg border border-lab-border rounded-lg pl-10 pr-4 py-2 text-lab-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto pr-2">
        {filteredChemicals.length > 0 ? (
          filteredChemicals.map(chemical => (
             <ChemicalItem key={chemical.id} chemical={chemical} onAdd={onAddChemical} />
          ))
        ) : (
          <p className="col-span-full text-center text-lab-text-secondary">No compounds found.</p>
        )}
      </div>
    </div>
  );
};