import React, { useState } from 'react';
import { CHEMICALS } from '../constants';
import { ChemicalItem } from './ChemicalItem';
import { AtomIcon, SearchIcon } from './icons/Icons';
import type { Chemical } from '../types';

interface ElementShelfProps {
  onShowDetails: (chemical: Chemical) => void;
}

export const ElementShelf: React.FC<ElementShelfProps> = ({ onShowDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredElements = CHEMICALS.filter(chemical =>
    !!chemical.atomicNumber && // Only show elements
    (
      chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chemical.formula.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-lab-bg-light p-4 rounded-lg border border-lab-border flex flex-col" style={{ minHeight: '400px', maxHeight: '70vh' }}>
      <h2 className="text-xl font-semibold mb-4 flex items-center shrink-0">
        <AtomIcon className="w-5 h-5 mr-2 text-accent-blue"/>Element Shelf
      </h2>
      <div className="relative mb-4 shrink-0">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lab-text-secondary" />
        <input
          type="text"
          placeholder="Search for an element..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-lab-bg border border-lab-border rounded-lg pl-10 pr-4 py-2 text-lab-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4 overflow-y-auto pr-2">
        {filteredElements.length > 0 ? (
          filteredElements.map(element => (
             <ChemicalItem 
                key={element.id} 
                chemical={element} 
                onShowDetails={onShowDetails} 
                onAdd={() => { /* No-op; adding is handled in the modal */ }} 
            />
          ))
        ) : (
          <p className="col-span-full text-center text-lab-text-secondary">No elements found.</p>
        )}
      </div>
    </div>
  );
};