import React, { useState } from 'react';
import { ElementShelf } from '../components/ElementShelf';
import { ElementDetailModal } from '../components/ElementDetailModal';
import type { Chemical } from '../types';

interface ChemicalShelfPageProps {
    onAddChemical: (chemicalId: string) => void;
}

export const ChemicalShelfPage: React.FC<ChemicalShelfPageProps> = ({ onAddChemical }) => {
    const [selectedElement, setSelectedElement] = useState<Chemical | null>(null);

    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <ElementShelf onShowDetails={setSelectedElement} />
            {selectedElement && (
                <ElementDetailModal 
                    element={selectedElement}
                    onClose={() => setSelectedElement(null)}
                    onAddChemical={onAddChemical}
                />
            )}
        </main>
    );
};