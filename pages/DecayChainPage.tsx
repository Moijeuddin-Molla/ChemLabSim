import React, { useState, useEffect, useRef, useMemo } from 'react';
import { InfoCard } from '../components/InfoCard';
import { Share2Icon, PlayIcon, PauseIcon, RefreshCwIcon, ClockIcon } from '../components/icons/Icons';
import { DECAY_SERIES } from '../data/decay-chains';
import type { DecayChain, DecayStep } from '../types';

// --- Helper Components ---

const NuclideTile: React.FC<{ nuclide: string, isStable?: boolean }> = ({ nuclide, isStable }) => (
  <div className={`relative shrink-0 w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-500 transform scale-100
    ${isStable ? 'bg-accent-green border-accent-green/50' : 'bg-lab-border border-lab-border/50'}`}>
    <span className="text-3xl font-bold text-lab-text">{nuclide.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '')}</span>
    <span className="absolute top-1 left-2 text-sm text-lab-text-secondary">{nuclide.match(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g)?.[0]}</span>
  </div>
);

const DecayParticle: React.FC<{ type: DecayStep['type'] }> = ({ type }) => {
    const particleMap: Record<DecayStep['type'], { symbol: string, color: string }> = {
        'alpha': { symbol: 'α', color: 'bg-accent-red' },
        'beta-': { symbol: 'β⁻', color: 'bg-accent-blue' },
        'beta+': { symbol: 'β⁺', color: 'bg-purple-400' },
        'EC': { symbol: 'EC', color: 'bg-indigo-400' },
        'gamma': { symbol: 'γ', color: 'bg-accent-yellow' },
        'stable': { symbol: '', color: '' },
    };

    const { symbol, color } = particleMap[type] || { symbol: '?', color: 'bg-gray-500' };

    if (!symbol) return null;

    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-xl font-bold ${color} text-white`}>
            {symbol}
        </div>
    );
};

const DecayArrow: React.FC<{ step: DecayStep }> = ({ step }) => (
    <div className="shrink-0 flex flex-col items-center justify-center w-48 text-center px-2">
        <div className="w-full h-0.5 bg-lab-border relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-lab-border"></div>
        </div>
        <div className="mt-2">
             <DecayParticle type={step.type} />
        </div>
        <div className="mt-2 text-xs text-lab-text-secondary flex items-center">
            <ClockIcon className="w-3 h-3 mr-1" />
            {step.halfLife}
        </div>
    </div>
);


// --- Main Component ---

export const DecayChainPage: React.FC = () => {
    const [selectedChainId, setSelectedChainId] = useState<string>('U-238');
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const chainContainerRef = useRef<HTMLDivElement>(null);
    const endOfChainRef = useRef<HTMLDivElement>(null);
    
    const chain: DecayChain | null = useMemo(() => {
        if (!selectedChainId) return null;
        for (const series of DECAY_SERIES) {
            if (series.chains[selectedChainId]) {
                return series.chains[selectedChainId];
            }
        }
        return null;
    }, [selectedChainId]);

    const isAtEnd = chain ? currentStep >= chain.steps.length - 1 : true;

    // Auto-play interval
    useEffect(() => {
        if (isPlaying && !isAtEnd) {
            const interval = setInterval(() => {
                setCurrentStep(prev => prev + 1);
            }, 1200);
            return () => clearInterval(interval);
        }
    }, [isPlaying, isAtEnd]);
    
    // Auto-scroll logic
    useEffect(() => {
        if (endOfChainRef.current) {
            endOfChainRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
        }
    }, [currentStep]);

    const handleSelectChain = (id: string) => {
        setSelectedChainId(id);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const handleNext = () => {
        if (!isAtEnd) {
            setCurrentStep(s => s + 1);
        }
    };
    
    const handleReset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const handlePlayPause = () => {
        if (!isAtEnd) {
            setIsPlaying(prev => !prev);
        }
    };

    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <InfoCard title="Decay Chain Visualizer" icon={<Share2Icon className="w-6 h-6 text-accent-green" />}>
                    <p className="text-lab-text-secondary mb-4">
                        Select a radioactive series to see its entire decay path visualized, step-by-step, until it reaches a stable isotope.
                    </p>

                    <div className="flex flex-col items-center gap-4 mb-6">
                        {DECAY_SERIES.map(series => (
                            <div key={series.id} className="w-full bg-lab-bg p-3 rounded-lg border border-lab-border">
                                <h3 className="text-md font-semibold text-lab-text-secondary mb-3 text-center">{series.name}</h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {Object.values(series.chains).map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => handleSelectChain(c.id)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                                                selectedChainId === c.id
                                                    ? 'bg-accent-blue text-white'
                                                    : 'bg-lab-border text-lab-text-secondary hover:bg-lab-bg-light hover:text-white'
                                            }`}
                                        >
                                            {c.name} ({c.start})
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {chain ? (
                        <div className="bg-lab-bg p-4 rounded-lg border border-lab-border space-y-4">
                           <div ref={chainContainerRef} className="w-full overflow-x-auto pb-4">
                               <div className="flex items-center space-x-2 min-w-max h-40">
                                   {currentStep >= 0 && <NuclideTile nuclide={chain.steps[0].from} />}
                                   
                                   {chain.steps.slice(0, currentStep).map((step, index) => (
                                       <React.Fragment key={index}>
                                            <div className="transition-opacity duration-500 ease-in-out flex items-center">
                                                <DecayArrow step={step} />
                                                {step.to && <NuclideTile nuclide={step.to} isStable={step.type === 'stable'} />}
                                            </div>
                                       </React.Fragment>
                                   ))}
                                   <div ref={endOfChainRef} />
                               </div>
                           </div>
                           
                           {/* Progress & Controls */}
                           <div>
                               <div className="w-full bg-lab-border rounded-full h-2.5 mb-4">
                                    <div className="bg-accent-blue h-2.5 rounded-full transition-all duration-500" style={{width: `${(currentStep / (chain.steps.length-1)) * 100}%`}}></div>
                               </div>
                               <div className="flex items-center justify-center gap-4">
                                   <button onClick={handlePlayPause} disabled={isAtEnd} className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-accent-green hover:bg-accent-green/80 text-white transition-colors duration-200 disabled:bg-lab-border disabled:cursor-not-allowed">
                                        {isPlaying ? <PauseIcon className="w-5 h-5 mr-2"/> : <PlayIcon className="w-5 h-5 mr-2"/>}
                                        {isPlaying ? 'Pause' : 'Play'}
                                   </button>
                                   <button onClick={handleNext} disabled={isAtEnd} className="px-4 py-2 rounded-md text-sm font-medium bg-lab-bg-light hover:bg-lab-border text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                       Next Step
                                   </button>
                                   <button onClick={handleReset} className="p-2 rounded-full bg-lab-bg-light hover:bg-lab-border text-white transition-colors duration-200">
                                       <RefreshCwIcon className="w-5 h-5"/>
                                   </button>
                               </div>
                           </div>
                           
                           {/* Current Step Info */}
                            <div className="text-center pt-4 border-t border-lab-border min-h-[6rem] flex flex-col justify-center">
                                {chain.description && <p className="text-sm italic text-lab-text-secondary mb-2">{chain.description}</p>}
                                {isAtEnd ? (
                                     <p className="font-semibold text-accent-green text-lg">Decay chain complete: {chain.end} is stable.</p>
                                ) : (
                                    <p className="text-lab-text-secondary">
                                        Step {currentStep + 1}/{chain.steps.length-1}: <span className="font-bold text-lab-text">{chain.steps[currentStep].from}</span> decays via <span className="font-bold text-lab-text">{chain.steps[currentStep].type} emission</span> to <span className="font-bold text-lab-text">{chain.steps[currentStep].to}</span>.
                                    </p>
                                )}
                           </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-lab-text-secondary">
                            <p>Please select a decay series to begin the visualization.</p>
                        </div>
                    )}
                </InfoCard>
            </div>
        </main>
    );
};