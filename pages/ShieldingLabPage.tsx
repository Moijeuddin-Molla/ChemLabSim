import React, { useState, useMemo, useCallback } from 'react';
import { InfoCard } from '../components/InfoCard';
import { ShieldIcon, RadioIcon, ZapIcon } from '../components/icons/Icons';
import { CHEMICALS } from '../constants';
import type { Chemical } from '../types';

type RadiationType = 'alpha' | 'beta' | 'gamma';

interface ShieldingOption {
  id: 'paper' | 'aluminum' | 'lead';
  name: string;
  chemical?: Chemical;
}

const SHIELDING_MATERIALS: ShieldingOption[] = [
  { id: 'paper', name: 'Paper' },
  { 
    id: 'aluminum', 
    name: 'Aluminum', 
    chemical: CHEMICALS.find(c => c.id === 'Al') 
  },
  { 
    id: 'lead', 
    name: 'Lead', 
    chemical: CHEMICALS.find(c => c.id === 'Pb') 
  },
];


interface SimulationResult {
  blocked: number;
  penetrated: number;
  explanation: string;
}

interface Particle {
  id: number;
  isBlocked: boolean;
  delay: number;
}

// --- Helper Components ---

const ControlButton: React.FC<{ label: string; onClick: () => void; isActive: boolean; disabled: boolean }> = ({ label, onClick, isActive, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 w-full ${
      isActive
        ? 'bg-accent-blue text-white shadow-md'
        : 'bg-lab-border text-lab-text-secondary hover:bg-lab-bg-light hover:text-white'
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {label}
  </button>
);

const RadiationParticle: React.FC<{ type: RadiationType, isBlocked: boolean, delay: number }> = ({ type, isBlocked, delay }) => {
    const baseClasses = "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full";
    const animationClass = isBlocked ? 'animate-[particle-blocked_2s_ease-in-out_forwards]' : 'animate-[particle-fly_2s_linear_forwards]';
    
    let styleClasses = '';
    switch (type) {
        case 'alpha': styleClasses = 'bg-accent-red scale-125'; break;
        case 'beta': styleClasses = 'bg-accent-blue'; break;
        case 'gamma': styleClasses = 'bg-accent-yellow w-8 h-1 rounded-none [clip-path:polygon(25%_0%,100%_0,75%_100%,0%_100%)]'; break; // Simple wave shape
    }

    return (
        <div 
            className={`${baseClasses} ${styleClasses} ${animationClass}`}
            style={{ top: `${Math.random() * 90 + 5}%`, animationDelay: `${delay}s` }}
        />
    );
};


// --- Main Page Component ---

export const ShieldingLabPage: React.FC = () => {
    const [radiationType, setRadiationType] = useState<RadiationType>('alpha');
    const [shieldingMaterial, setShieldingMaterial] = useState<ShieldingOption>(SHIELDING_MATERIALS[1]); // Default to Aluminum
    const [shieldingThickness, setShieldingThickness] = useState(1); // in mm
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    const calculateResults = useCallback((): SimulationResult => {
        let blocked = 0;
        let penetrated = 100;
        let explanation = '';
        const density = shieldingMaterial.chemical?.densityGPerCm3;
        const densityText = density ? ` (density: ${density} g/cm³)` : '';


        switch (radiationType) {
            case 'alpha':
                blocked = 100;
                explanation = `Alpha particles (Helium nuclei) are large and highly charged. They interact strongly with matter and lose energy rapidly, allowing even a thin material like ${shieldingMaterial.name} to stop them completely.`;
                break;
            case 'beta':
                if (shieldingMaterial.id === 'paper') {
                    blocked = 5;
                    explanation = `Beta particles (electrons) are much smaller and faster than alpha particles. They can easily pass through light materials like ${shieldingMaterial.name}, losing very little energy.`;
                } else if (shieldingMaterial.id === 'aluminum') {
                    blocked = Math.min(100, (shieldingThickness / 10) * 100); // 10mm for full blockage
                    explanation = `${shieldingMaterial.name}${densityText} is dense enough to effectively stop beta particles. As thickness increases, more particles are absorbed through collisions with its atoms.`;
                } else { // lead
                    blocked = Math.min(100, (shieldingThickness / 2) * 100); // 2mm for full blockage
                    explanation = `${shieldingMaterial.name}${densityText} is very dense and stops beta particles very effectively, requiring only a thin layer for complete absorption.`;
                }
                break;
            case 'gamma':
                 if (shieldingMaterial.id === 'paper') {
                    blocked = 0.1;
                    explanation = `Gamma rays (high-energy photons) have no mass or charge. They pass through light materials like ${shieldingMaterial.name} almost completely unimpeded.`;
                } else if (shieldingMaterial.id === 'aluminum') {
                    penetrated = 100 * (0.5 ** (shieldingThickness / 40)); // ~40mm half-value layer
                    blocked = 100 - penetrated;
                    explanation = `${shieldingMaterial.name}${densityText} is not very effective at stopping gamma rays. While some photons are absorbed or scattered, most pass through unless the shield is extremely thick.`;
                } else { // lead
                    penetrated = 100 * (0.5 ** (shieldingThickness / 10)); // ~10mm half-value layer
                    blocked = 100 - penetrated;
                    explanation = `${shieldingMaterial.name}'s high density${densityText} and large atoms make it an excellent shield for gamma radiation. It significantly attenuates gamma rays, with the effect increasing exponentially with thickness.`;
                }
                break;
        }

        return { blocked: parseFloat(blocked.toFixed(1)), penetrated: parseFloat((100 - blocked).toFixed(1)), explanation };
    }, [radiationType, shieldingMaterial, shieldingThickness]);

    const handleStartSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setSimulationResult(null);
        setAnimationKey(prev => prev + 1); // Reset animation state
        
        const results = calculateResults();

        setTimeout(() => {
            setSimulationResult(results);
            setIsSimulating(false);
        }, 2500); // Match animation duration + delay
    };

    const particles = useMemo<Particle[]>(() => {
        if (!isSimulating) return [];
        const results = calculateResults();
        const numParticles = 15;
        return Array.from({ length: numParticles }, (_, i) => ({
            id: i,
            isBlocked: Math.random() * 100 < results.blocked,
            delay: Math.random() * 0.5,
        }));
    }, [isSimulating, calculateResults]);

    const shieldStyle = useMemo(() => {
        const base = { width: `${Math.max(10, shieldingThickness * 1.5)}px` };
        switch(shieldingMaterial.id) {
            case 'paper': return {...base, background: '#e2e8f0' }; // Cool Gray 200
            case 'aluminum': return {...base, background: '#9ca3af' }; // Gray 400
            case 'lead': return {...base, background: '#4a5568' }; // Gray 600
        }
    }, [shieldingThickness, shieldingMaterial]);

    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <InfoCard title="Radiation & Shielding Lab" icon={<ShieldIcon className="w-6 h-6 text-lab-text" />}>
                    <p className="text-lab-text-secondary mb-6">
                        Test the effectiveness of different materials at blocking radiation. Select a source, a shield, and its thickness, then run the simulation to observe the outcome.
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Controls */}
                        <div className="lg:col-span-3 bg-lab-bg p-4 rounded-lg border border-lab-border space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">1. Radiation Source</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    <ControlButton label="α (Alpha)" onClick={() => setRadiationType('alpha')} isActive={radiationType === 'alpha'} disabled={isSimulating} />
                                    <ControlButton label="β (Beta)" onClick={() => setRadiationType('beta')} isActive={radiationType === 'beta'} disabled={isSimulating} />
                                    <ControlButton label="γ (Gamma)" onClick={() => setRadiationType('gamma')} isActive={radiationType === 'gamma'} disabled={isSimulating} />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">2. Shielding Material</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {SHIELDING_MATERIALS.map(material => (
                                        <ControlButton 
                                            key={material.id}
                                            label={material.name} 
                                            onClick={() => setShieldingMaterial(material)} 
                                            isActive={shieldingMaterial.id === material.id} 
                                            disabled={isSimulating} 
                                        />
                                    ))}
                                </div>
                                <div className="text-xs text-center text-lab-text-secondary mt-2 h-4">
                                    {shieldingMaterial.chemical ? `Density: ${shieldingMaterial.chemical.densityGPerCm3} g/cm³` : 'Material: Low-density cellulose'}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="thickness" className="font-semibold mb-2 block">3. Shielding Thickness</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        id="thickness"
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={shieldingThickness}
                                        onChange={(e) => setShieldingThickness(parseInt(e.target.value))}
                                        disabled={isSimulating}
                                        className="w-full h-2 bg-lab-border rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <span className="font-mono text-lab-text bg-lab-bg-light p-2 rounded-md w-20 text-center">{shieldingThickness}mm</span>
                                </div>
                            </div>
                            <button
                                onClick={handleStartSimulation}
                                disabled={isSimulating}
                                className="w-full flex items-center justify-center px-6 py-3 rounded-md font-bold bg-accent-green hover:bg-accent-green/80 text-white transition-colors duration-200 disabled:bg-lab-border disabled:cursor-not-allowed shadow-lg"
                            >
                                <ZapIcon className={`w-5 h-5 mr-2 ${isSimulating ? 'animate-pulse' : ''}`}/>
                                {isSimulating ? 'Simulating...' : 'Start Simulation'}
                            </button>
                        </div>

                        {/* Visualization */}
                        <div className="lg:col-span-6 bg-lab-bg p-4 rounded-lg border-2 border-dashed border-lab-border flex items-center justify-center min-h-[250px]">
                            <div className="w-full h-48 relative">
                                <RadioIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 text-lab-text-secondary" title="Radiation Source" />
                                <div className="absolute left-[180px] top-0 bottom-0 flex items-center justify-center" title="Shielding Material">
                                    <div className="h-full rounded-sm" style={shieldStyle}></div>
                                </div>
                                <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-12 bg-lab-border/50 rounded-r-lg border-2 border-lab-border p-1 ${simulationResult && simulationResult.penetrated > 0 ? 'animate-[detector-hit_0.5s_ease-in-out_2.2s]' : ''}`} title="Detector">
                                    <div className="w-full h-full bg-lab-bg-light rounded-sm"></div>
                                </div>
                                <div key={animationKey}>
                                    {particles.map(p => <RadiationParticle key={p.id} type={radiationType} isBlocked={p.isBlocked} delay={p.delay} />)}
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="lg:col-span-3 bg-lab-bg-light p-4 rounded-lg border border-lab-border flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-lab-text mb-4 text-center">Simulation Results</h3>
                            {simulationResult ? (
                                <div className="space-y-4">
                                    <div className="text-center font-mono">
                                        <p className="text-sm text-accent-red">Blocked</p>
                                        <p className="text-4xl font-bold text-accent-red">{simulationResult.blocked}%</p>
                                    </div>
                                    <div className="text-center font-mono">
                                        <p className="text-sm text-accent-green">Penetrated</p>
                                        <p className="text-4xl font-bold text-accent-green">{simulationResult.penetrated}%</p>
                                    </div>
                                    <div className="pt-4 border-t border-lab-border">
                                        <h4 className="font-semibold text-lab-text-secondary">Explanation:</h4>
                                        <p className="text-sm text-lab-text mt-1">{simulationResult.explanation}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-lab-text-secondary">
                                    <p>{isSimulating ? 'Simulation in progress...' : 'Results will appear here after simulation.'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </InfoCard>
            </div>
        </main>
    );
};