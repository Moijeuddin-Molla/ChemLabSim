import React, { useState, useEffect } from 'react';
import type { Chemical } from '../types';
import { getElementDescription } from '../services/geminiService';
import { FlaskConicalIcon, InfoIcon } from './icons/Icons';

interface ElementDetailModalProps {
  element: Chemical;
  onClose: () => void;
  onAddChemical: (chemicalId: string) => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-lab-border rounded w-3/4"></div>
        <div className="h-4 bg-lab-border rounded"></div>
        <div className="h-4 bg-lab-border rounded"></div>
        <div className="h-4 bg-lab-border rounded w-5/6"></div>
        <div className="h-4 bg-lab-border rounded w-1/2 mt-6"></div>
    </div>
);


export const ElementDetailModal: React.FC<ElementDetailModalProps> = ({ element, onClose, onAddChemical }) => {
    const [description, setDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDescription = async () => {
            setIsLoading(true);
            const desc = await getElementDescription(element);
            setDescription(desc);
            setIsLoading(false);
        };

        if (element) {
            fetchDescription();
        }
    }, [element]);

    const handleAddToLab = () => {
        onAddChemical(element.id);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="element-title"
        >
            <div 
                className="bg-lab-bg-light rounded-lg border border-lab-border shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-lab-border">
                    <h2 id="element-title" className="text-2xl font-bold text-accent-blue">{element.name} ({element.formula})</h2>
                    <button onClick={onClose} aria-label="Close modal" className="text-lab-text-secondary hover:text-white">
                        <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {/* Key Properties Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-6 pb-4 border-b border-lab-border font-mono text-sm">
                        {element.atomicRadius && (
                            <div className="flex justify-between items-center">
                                <span className="text-lab-text-secondary">Atomic Radius:</span>
                                <span className="font-bold text-lab-text">{element.atomicRadius} pm</span>
                            </div>
                        )}
                        {element.ionizationEnergy && (
                             <div className="flex justify-between items-center">
                                <span className="text-lab-text-secondary">Ionization Energy:</span>
                                <span className="font-bold text-lab-text">{element.ionizationEnergy} kJ/mol</span>
                            </div>
                        )}
                        {element.electronAffinity !== undefined && (
                             <div className="flex justify-between items-center">
                                <span className="text-lab-text-secondary flex items-center">
                                    Electron Affinity
                                    <InfoIcon className="w-4 h-4 ml-1.5 cursor-help text-lab-text-secondary" title="Energy released when an electron is added. Higher values indicate stronger attraction." />
                                </span>
                                <span className="font-bold text-lab-text">{element.electronAffinity} kJ/mol</span>
                            </div>
                        )}
                         {element.electronegativityPauling !== undefined && (
                             <div className="flex justify-between items-center">
                                <span className="text-lab-text-secondary">Electronegativity:</span>
                                <span className="font-bold text-lab-text">{element.electronegativityPauling} (Pauling)</span>
                            </div>
                        )}
                    </div>
                    
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <div className="text-lab-text-secondary space-y-4 whitespace-pre-wrap">
                            {description.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-4 border-t border-lab-border mt-auto">
                    <button 
                        onClick={handleAddToLab}
                        className="flex items-center px-4 py-2 rounded-md font-medium bg-accent-green hover:bg-accent-green/80 text-white transition-colors duration-200"
                    >
                        <FlaskConicalIcon className="w-5 h-5 mr-2" />
                        Add to Lab Bench
                    </button>
                </div>
            </div>
        </div>
    );
};