import React from 'react';
import type { Nuclide } from '../types';
import { AtomIcon } from './icons/Icons';

interface NuclideDetailModalProps {
  nuclide: Nuclide;
  onClose: () => void;
}

const formatHalfLife = (seconds: number | null): string => {
    if (seconds === null) return 'Stable';
    if (seconds < 1e-9) return `${(seconds * 1e12).toPrecision(3)} ps`;
    if (seconds < 1e-6) return `${(seconds * 1e9).toPrecision(3)} ns`;
    if (seconds < 1e-3) return `${(seconds * 1e6).toPrecision(3)} µs`;
    if (seconds < 1) return `${(seconds * 1e3).toPrecision(3)} ms`;
    if (seconds < 60) return `${seconds.toPrecision(3)} s`;
    if (seconds < 3600) return `${(seconds / 60).toPrecision(3)} min`;
    if (seconds < 86400) return `${(seconds / 3600).toPrecision(3)} h`;
    if (seconds < 3.154e7) return `${(seconds / 86400).toPrecision(3)} d`;
    if (seconds < 3.154e10) return `${(seconds / 3.154e7).toPrecision(4)} y`;
    if (seconds < 3.154e13) return `${(seconds / 3.154e10).toPrecision(4)} ky`;
    if (seconds < 3.154e16) return `${(seconds / 3.154e13).toPrecision(4)} My`;
    return `${(seconds / 3.154e16).toPrecision(4)} Gy`;
};

const getDecayModeInfo = (stability: Nuclide['stability']) => {
    switch (stability) {
        case 'Stable': return { name: "Stable", color: "text-accent-green" };
        case 'Alpha': return { name: "Alpha Decay", color: "text-accent-red" };
        case 'Beta-': return { name: "Beta-minus Decay", color: "text-accent-blue" };
        case 'EC/Beta+': return { name: "Positron Emission / Electron Capture", color: "text-accent-yellow" };
        case 'p': return { name: "Proton Emission", color: "text-orange-400" };
        case 'n': return { name: "Neutron Emission", color: "text-gray-400" };
        default: return { name: "Unknown", color: "text-lab-text" };
    }
}

export const NuclideDetailModal: React.FC<NuclideDetailModalProps> = ({ nuclide, onClose }) => {
    const decayInfo = getDecayModeInfo(nuclide.stability);
    const formattedHalfLife = nuclide.half_life_text || formatHalfLife(nuclide.half_life_sec);

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="nuclide-title"
        >
            <div 
                className="bg-lab-bg-light rounded-lg border border-lab-border shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-lab-border">
                    <h2 id="nuclide-title" className="text-2xl font-bold text-accent-blue flex items-center">
                        <AtomIcon className="w-6 h-6 mr-3" />
                        {nuclide.symbol}-{nuclide.mass_number}
                    </h2>
                    <button onClick={onClose} aria-label="Close modal" className="text-lab-text-secondary hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto font-mono">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-lg">
                        <span className="text-lab-text-secondary">Protons (Z):</span>
                        <span className="text-lab-text text-right font-bold">{nuclide.Z}</span>
                        
                        <span className="text-lab-text-secondary">Neutrons (N):</span>
                        <span className="text-lab-text text-right font-bold">{nuclide.N}</span>

                        <span className="text-lab-text-secondary">Mass (A):</span>
                        <span className="text-lab-text text-right font-bold">{nuclide.mass_number}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-lab-border">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-lg">
                            <span className="text-lab-text-secondary">Stability:</span>
                            <span className={`text-right font-bold ${decayInfo.color}`}>{decayInfo.name}</span>

                            <span className="text-lab-text-secondary">Half-life:</span>
                            <span className="text-lab-text text-right font-bold">{formattedHalfLife}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-4 border-t border-lab-border mt-auto">
                     <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-md font-medium bg-lab-border hover:bg-lab-border/80 text-white transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};