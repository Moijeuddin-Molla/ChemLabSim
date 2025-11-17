
import React from 'react';
import { ChemicalShelf } from './ChemicalShelf';
import { Beaker } from './Beaker';
import { ReactionResult } from './ReactionResult';
import { useChemLab } from '../hooks/useChemLab';
import { InfoCard } from './InfoCard';
import { RefreshCwIcon } from './icons/Icons';

export const LabBench: React.FC = () => {
  const { chemicalsInBeaker, currentReaction, addChemical, resetLab, reactionEffect, beakerContents } = useChemLab();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const chemicalId = e.dataTransfer.getData('chemicalId');
    if (chemicalId) {
      addChemical(chemicalId);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-1">
        <ChemicalShelf />
      </div>
      <div className="lg:col-span-2 flex flex-col space-y-8">
        <div 
            className="bg-lab-bg-light p-6 rounded-lg border-2 border-dashed border-lab-border flex-grow flex flex-col items-center justify-center transition-all duration-300"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
          <div className="flex items-center justify-between w-full mb-4">
            <h2 className="text-2xl font-bold text-lab-text">Lab Bench</h2>
            <button onClick={resetLab} className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-accent-red/80 hover:bg-accent-red text-white transition-colors duration-200">
                <RefreshCwIcon className="w-4 h-4 mr-2"/>
                Reset
            </button>
          </div>
          <Beaker chemicals={chemicalsInBeaker} reactionEffect={reactionEffect} contents={beakerContents} />
          <p className="mt-4 text-lab-text-secondary">Drag chemicals from the shelf and drop them into the beaker.</p>
        </div>
        {currentReaction ? (
          <ReactionResult reaction={currentReaction} />
        ) : (
          <InfoCard title="Awaiting Reaction">
            <p className="text-lab-text-secondary">Combine the correct reactants in the beaker to initiate a chemical reaction. Results and explanations will appear here.</p>
          </InfoCard>
        )}
      </div>
    </div>
  );
};
