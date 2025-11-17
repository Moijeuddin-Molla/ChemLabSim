import React, { useState } from 'react';
import { Beaker } from '../components/Beaker';
import { ReactionResult } from '../components/ReactionResult';
import { InfoCard } from '../components/InfoCard';
import { RefreshCwIcon, SearchIcon, ZapIcon } from '../components/icons/Icons';
import type { Chemical, BeakerEntry, SimulationResult, GasProperties } from '../types';
import { CHEMICALS } from '../constants';
import { ExperimentControls } from '../components/ExperimentControls';
import { BeakerContentsList } from '../components/BeakerContentsList';
import { GasSyringe } from '../components/GasSyringe';

interface LabBenchPageProps {
    chemicalsInBeaker: BeakerEntry[];
    simulationResult: SimulationResult | null;
    reactionEffect: string | null;
    beakerContents: {
        liquidLayer: { color: string; level: number; opacity: number } | null;
        solidLayers: { color: string; height: number }[];
        vaporOpacity: number;
    };
    gasProperties: GasProperties | null;
    resetLab: () => void;
    onAddChemical: (chemicalId: string) => void;
    onRemoveChemical: (chemicalId: string) => void;
    onUpdateChemical: (chemicalId: string, quantity: number, unit: 'mol' | 'g') => void;
    startSimulation: () => void;
    simulationAttempted: boolean;
    isSimulating: boolean;
    temperature: number;
    setTemperature: (t: number) => void;
    pressure: number;
    setPressure: (p: number) => void;
    stirringSpeed: number;
    setStirringSpeed: (s: number) => void;
    reactionTime: number;
    setReactionTime: (t: number) => void;
}

export const ChemistryLabPage: React.FC<LabBenchPageProps> = ({
    chemicalsInBeaker,
    simulationResult,
    reactionEffect,
    beakerContents,
    gasProperties,
    resetLab,
    onAddChemical,
    onRemoveChemical,
    onUpdateChemical,
    startSimulation,
    simulationAttempted,
    isSimulating,
    temperature,
    setTemperature,
    pressure,
    setPressure,
    stirringSpeed,
    setStirringSpeed,
    reactionTime,
    setReactionTime
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Chemical[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
        const availableChemicals = CHEMICALS.filter(c => !chemicalsInBeaker.some(b => b.chemicalId === c.id));
        const filtered = availableChemicals.filter(chemical =>
            chemical.name.toLowerCase().includes(value.toLowerCase()) ||
            chemical.formula.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setIsSuggestionsVisible(true);
    } else {
        setSuggestions([]);
        setIsSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (chemicalId: string) => {
    onAddChemical(chemicalId);
    setInputValue('');
    setSuggestions([]);
    setIsSuggestionsVisible(false);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0].id);
    }
  };

  return (
    <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex flex-col space-y-8">
            <div className="bg-lab-bg-light p-6 rounded-lg border border-lab-border">
                <div className="flex items-center justify-between w-full mb-4">
                    <h2 className="text-2xl font-bold text-lab-text">Lab Bench</h2>
                    <button onClick={resetLab} className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-accent-red/80 hover:bg-accent-red text-white transition-colors duration-200">
                        <RefreshCwIcon className="w-4 h-4 mr-2"/>
                        Reset
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Inputs & Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div 
                            className="relative"
                            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsSuggestionsVisible(false); }}
                        >
                            <form onSubmit={handleFormSubmit}>
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lab-text-secondary" />
                                <input
                                  type="text"
                                  value={inputValue}
                                  onChange={handleInputChange}
                                  onFocus={() => inputValue && setIsSuggestionsVisible(true)}
                                  placeholder="Search to add a chemical..."
                                  className="w-full bg-lab-bg border border-lab-border rounded-lg pl-10 pr-4 py-2 text-lab-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                  disabled={isSimulating}
                                />
                            </form>
                            {isSuggestionsVisible && suggestions.length > 0 && (
                                <ul className="absolute z-20 w-full bg-lab-bg border border-lab-border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                                    {suggestions.map(s => (
                                        <li 
                                            key={s.id} 
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleSuggestionClick(s.id)} 
                                            className="px-4 py-2 hover:bg-accent-blue/20 cursor-pointer flex justify-between items-center"
                                        >
                                            <span>{s.name}</span>
                                            <span className="font-mono text-lab-text-secondary">{s.formula}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <BeakerContentsList entries={chemicalsInBeaker} onRemove={onRemoveChemical} onUpdate={onUpdateChemical} disabled={isSimulating} />
                        <ExperimentControls 
                            temperature={temperature}
                            setTemperature={setTemperature}
                            pressure={pressure}
                            setPressure={setPressure}
                            stirringSpeed={stirringSpeed}
                            setStirringSpeed={setStirringSpeed}
                            reactionTime={reactionTime}
                            setReactionTime={setReactionTime}
                            disabled={isSimulating}
                        />

                    </div>
                    {/* Middle Column: Beaker & Simulation */}
                    <div className="lg:col-span-1 flex flex-col items-center justify-between bg-lab-bg p-4 rounded-lg border-2 border-dashed border-lab-border">
                        <Beaker reactionEffect={reactionEffect} contents={beakerContents} stirringSpeed={stirringSpeed} />
                         <button 
                            onClick={startSimulation} 
                            disabled={chemicalsInBeaker.length === 0 || isSimulating}
                            className="w-full mt-6 flex items-center justify-center px-6 py-3 rounded-md font-bold bg-accent-green hover:bg-accent-green/80 text-white transition-colors duration-200 disabled:bg-lab-border disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
                        >
                            <ZapIcon className={`w-5 h-5 mr-2 ${isSimulating ? 'animate-pulse' : ''}`}/>
                            {isSimulating ? 'Simulating...' : 'Simulate Reaction'}
                        </button>
                    </div>

                    {/* Right Column: Gas Syringe */}
                    <div className="lg:col-span-1">
                        <GasSyringe gasProperties={gasProperties} />
                    </div>
                </div>
            </div>

            {simulationResult ? (
                <ReactionResult result={simulationResult} />
            ) : simulationAttempted && !isSimulating ? (
                <InfoCard title="No Reaction Occurred">
                    <p className="text-lab-text-secondary">The combination of chemicals in the beaker does not produce a known reaction under the current conditions (temperature, pressure, etc.).</p>
                </InfoCard>
            ) : (
                <InfoCard title="Awaiting Simulation">
                    <p className="text-lab-text-secondary">Add chemicals, set your conditions, and click "Simulate Reaction" to see the results.</p>
                </InfoCard>
            )}
        </div>
    </main>
  );
};