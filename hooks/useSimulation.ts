import { useState, useCallback, useMemo } from 'react';
import { CHEMICALS, REACTIONS } from '../constants';
import type { Chemical, Reaction, BeakerEntry, SimulationResult, GasProperties } from '../types';

const R = 0.0821; // Ideal gas constant in L·atm/(mol·K)

const getChemical = (id: string): Chemical | undefined => CHEMICALS.find(c => c.id === id);

export const useSimulation = () => {
  const [chemicalsInBeaker, setChemicalsInBeaker] = useState<BeakerEntry[]>([]);
  const [temperature, setTemperature] = useState(25);
  const [pressure, setPressure] = useState(1);
  const [stirringSpeed, setStirringSpeed] = useState(0);
  const [reactionTime, setReactionTime] = useState(60);

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [gasProperties, setGasProperties] = useState<GasProperties | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationAttempted, setSimulationAttempted] = useState(false);
  const [reactionEffect, setReactionEffect] = useState<string | null>(null);

  const resetLab = useCallback(() => {
    setChemicalsInBeaker([]);
    setTemperature(25);
    setPressure(1);
    setStirringSpeed(0);
    setReactionTime(60);
    setSimulationResult(null);
    setGasProperties(null);
    setIsSimulating(false);
    setSimulationAttempted(false);
    setReactionEffect(null);
  }, []);

  const addChemical = useCallback((chemicalId: string) => {
    if (chemicalsInBeaker.some(c => c.chemicalId === chemicalId)) return;
    const chemical = getChemical(chemicalId);
    if (!chemical) return;
    
    const defaultEntry: BeakerEntry = {
      chemicalId,
      quantity: chemical.state === 's' ? 10 : 1,
      unit: chemical.state === 's' ? 'g' : 'mol',
    };
    setChemicalsInBeaker(prev => [...prev, defaultEntry]);
  }, [chemicalsInBeaker]);

  const removeChemical = useCallback((chemicalId: string) => {
    setChemicalsInBeaker(prev => prev.filter(c => c.chemicalId !== chemicalId));
  }, []);

  const updateChemical = useCallback((chemicalId: string, quantity: number, unit: 'mol' | 'g') => {
    setChemicalsInBeaker(prev => prev.map(c => 
      c.chemicalId === chemicalId ? { ...c, quantity: Math.max(0, quantity), unit } : c
    ));
  }, []);

  const startSimulation = useCallback(async () => {
    setIsSimulating(true);
    setSimulationAttempted(true);
    setSimulationResult(null);
    setGasProperties(null);
    setReactionEffect(null);

    const beakerMoles = new Map<string, number>();
    chemicalsInBeaker.forEach(entry => {
        const chemical = getChemical(entry.chemicalId);
        if (!chemical) return;
        const moles = entry.unit === 'mol' ? entry.quantity : entry.quantity / chemical.molarMass;
        beakerMoles.set(entry.chemicalId, (beakerMoles.get(entry.chemicalId) || 0) + moles);
    });

    const reactantIds = new Set(beakerMoles.keys());
    
    const reaction = REACTIONS.find(r => {
        const reactionReactantIds = new Set(r.reactants.map(re => re.chemicalId));
        if (r.reactants.length !== reactantIds.size) return false;
        return [...reactantIds].every(id => reactionReactantIds.has(id));
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!reaction || beakerMoles.size === 0) {
        setIsSimulating(false);
        return;
    }

    let limitingReagentId: string | null = null;
    let reactionMultiplier = Infinity;

    reaction.reactants.forEach(reactant => {
        const molesAvailable = beakerMoles.get(reactant.chemicalId) || 0;
        const potentialMultiplier = molesAvailable / reactant.coefficient;
        if (potentialMultiplier < reactionMultiplier) {
            reactionMultiplier = potentialMultiplier;
            limitingReagentId = reactant.chemicalId;
        }
    });

    if (reactionMultiplier === 0 || limitingReagentId === null) {
        setIsSimulating(false);
        return;
    }

    const products: BeakerEntry[] = [];
    const gasesProduced: BeakerEntry[] = [];
    const leftovers: BeakerEntry[] = [];
    const notes: string[] = [];

    reaction.products.forEach(p => {
        const chemical = getChemical(p.chemicalId);
        if (!chemical) return;
        const molesProduced = p.coefficient * reactionMultiplier;
        const entry: BeakerEntry = { chemicalId: p.chemicalId, quantity: molesProduced, unit: 'mol' };
        if (chemical.state === 'g') {
            gasesProduced.push(entry);
        } else {
            products.push(entry);
        }
    });

    reaction.reactants.forEach(r => {
        const molesUsed = r.coefficient * reactionMultiplier;
        const molesInitial = beakerMoles.get(r.chemicalId)!;
        const molesLeft = molesInitial - molesUsed;
        if (molesLeft > 1e-6) {
            leftovers.push({ chemicalId: r.chemicalId, quantity: molesLeft, unit: 'mol' });
        }
    });
    
    if (gasesProduced.length > 0) {
        const totalGasMoles = gasesProduced.reduce((sum, gas) => sum + gas.quantity, 0);
        const tempKelvin = temperature + 273.15;
        const volumeL = (totalGasMoles * R * tempKelvin) / pressure;
        
        setGasProperties({
            totalMoles: totalGasMoles,
            volumeL: volumeL,
            temperature: temperature,
            pressure: pressure,
            gases: gasesProduced,
        });
    }

    const result: SimulationResult = { reaction, products, leftovers, gasesProduced, limitingReagentId, notes };
    setSimulationResult(result);

    const finalBeakerContents = [...products, ...leftovers];
    setChemicalsInBeaker(finalBeakerContents);

    if (reaction.warning?.includes('Explosive') || reaction.warning?.includes('Violent')) {
      setReactionEffect('explosion');
    } else if (gasesProduced.length > 0) {
      setReactionEffect('bubble');
    } else {
      setReactionEffect('bubble'); // Default effect for non-gaseous reactions
    }

    setTimeout(() => setReactionEffect(null), 2000);
    setIsSimulating(false);
  }, [chemicalsInBeaker, temperature, pressure]);

  const beakerContents = useMemo(() => {
    let liquidLayer: { color: string, level: number, opacity: number } | null = null;
    const solidLayers: { color: string, height: number }[] = [];
    let vaporOpacity = 0;

    const allEntries = [...chemicalsInBeaker, ...(simulationResult?.products || [])];

    const totalMoles = allEntries.reduce((sum, entry) => {
        const chemical = getChemical(entry.chemicalId);
        if (!chemical) return sum;
        return sum + (entry.unit === 'mol' ? entry.quantity : entry.quantity / chemical.molarMass);
    }, 0);

    if (totalMoles === 0) {
        return { liquidLayer: null, solidLayers: [], vaporOpacity: 0 };
    }
    
    const liquids = allEntries.filter(e => ['l', 'aq'].includes(getChemical(e.chemicalId)?.state || ''));
    const solids = allEntries.filter(e => getChemical(e.chemicalId)?.state === 's');

    let totalSolidMoles = solids.reduce((sum, s) => {
        const chemical = getChemical(s.chemicalId)!;
        return sum + (s.unit === 'mol' ? s.quantity : s.quantity / chemical.molarMass);
    }, 0);

    solids.forEach(s => {
        const chemical = getChemical(s.chemicalId)!;
        const moles = (s.unit === 'mol' ? s.quantity : s.quantity / chemical.molarMass);
        solidLayers.push({
            color: chemical.color,
            height: totalSolidMoles > 0 ? (moles / totalSolidMoles) * 30 : 0
        });
    });

    if (liquids.length > 0) {
        const lastLiquid = getChemical(liquids[liquids.length-1].chemicalId)!;
        const totalLiquidMoles = liquids.reduce((sum, entry) => {
            const chemical = getChemical(entry.chemicalId)!;
            return sum + (entry.unit === 'mol' ? entry.quantity : entry.quantity / chemical.molarMass);
        }, 0);
        
        const level = Math.min((totalLiquidMoles / totalMoles) * 80, 80);
        const opacity = Math.min(30 + liquids.length * 20, 90);
        const colorClass = getChemical(lastLiquid.id)?.color || 'bg-gray-500';

        liquidLayer = { color: colorClass.replace('bg-','text-'), level, opacity };
    }
    
    if (temperature > 100 && liquids.some(l => getChemical(l.chemicalId)?.id === 'H2O')) {
        vaporOpacity = Math.min((temperature - 100) / 100, 1) * 0.5;
    }
    
    return { liquidLayer, solidLayers, vaporOpacity };
  }, [chemicalsInBeaker, temperature, simulationResult]);

  return {
    chemicalsInBeaker,
    simulationResult,
    reactionEffect,
    beakerContents,
    gasProperties,
    resetLab,
    addChemical,
    removeChemical,
    updateChemical,
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
    setReactionTime,
  };
};
