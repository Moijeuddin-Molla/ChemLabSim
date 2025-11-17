

import React, { useState, useMemo } from 'react';
import { InfoCard } from '../components/InfoCard';
import { CalculatorIcon } from '../components/icons/Icons';
import { BINDING_ENERGY_CONSTANTS, ISOTOPE_DATA, BINDING_CURVE_DATA } from '../data/binding-energy-data';

// --- Chart Component ---

interface BindingEnergyChartProps {
  selectedIsotope: { id: string; A: number; bePerNucleon: number };
}

const BindingEnergyChart: React.FC<BindingEnergyChartProps> = ({ selectedIsotope }) => {
  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const maxX = 250;
  const maxY = 9.5;

  const xScale = (A: number) => (A / maxX) * innerWidth;
  const yScale = (be: number) => innerHeight - (be / maxY) * innerHeight;

  const pathData = BINDING_CURVE_DATA.map(d => `${xScale(d[0])},${yScale(d[1])}`).join(' L ');
  const fe56Point = BINDING_CURVE_DATA.find(p => p[0] === 56)!;

  return (
    <div className="bg-lab-bg p-2 rounded-lg border border-lab-border mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Axes */}
          <line x1="0" y1={innerHeight} x2={innerWidth} y2={innerHeight} className="stroke-lab-border" strokeWidth="2" />
          <line x1="0" y1="0" x2="0" y2={innerHeight} className="stroke-lab-border" strokeWidth="2" />

          {/* Y-Axis Labels */}
          {[...Array(10)].map((_, i) => (
            <g key={i}>
              <text x="-10" y={yScale(i)} dy="0.32em" textAnchor="end" className="text-xs fill-current text-lab-text-secondary">{i}</text>
              <line x1="-5" y1={yScale(i)} x2={innerWidth} y2={yScale(i)} className="stroke-lab-border/50" strokeDasharray="2,2" />
            </g>
          ))}
          <text x={-35} y={innerHeight / 2} textAnchor="middle" transform={`rotate(-90, -35, ${innerHeight / 2})`} className="text-sm fill-current text-lab-text-secondary">BE / Nucleon (MeV)</text>
          
          {/* X-Axis Labels */}
          {[0, 50, 100, 150, 200, 250].map(val => (
            <text key={val} x={xScale(val)} y={innerHeight + 20} textAnchor="middle" className="text-xs fill-current text-lab-text-secondary">{val}</text>
          ))}
          <text x={innerWidth / 2} y={innerHeight + 35} textAnchor="middle" className="text-sm fill-current text-lab-text-secondary">Mass Number (A)</text>
          
          {/* Curve */}
          <path d={`M ${pathData}`} fill="none" className="stroke-accent-yellow" strokeWidth="2" />

          {/* Highlight Fe-56 Peak */}
          <circle cx={xScale(fe56Point[0])} cy={yScale(fe56Point[1])} r="4" className="fill-accent-green" />
          <text x={xScale(fe56Point[0])} y={yScale(fe56Point[1]) - 8} textAnchor="middle" className="text-xs font-bold fill-accent-green">Fe-56 (Peak Stability)</text>

          {/* Selected Isotope Point */}
          <circle cx={xScale(selectedIsotope.A)} cy={yScale(selectedIsotope.bePerNucleon)} r="5" className="fill-accent-blue stroke-white" strokeWidth="1" />
          <text x={xScale(selectedIsotope.A)} y={yScale(selectedIsotope.bePerNucleon) - 10} textAnchor="middle" className="text-xs font-bold fill-accent-blue">{selectedIsotope.id}</text>
        </g>
      </svg>
    </div>
  );
};


// --- Main Page Component ---

export const BindingEnergyPage: React.FC = () => {
    const [userInput, setUserInput] = useState('');
    const [calculatedIsotopeId, setCalculatedIsotopeId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setCalculatedIsotopeId(null); // Clear previous result
        
        const searchTerm = userInput.trim();
        if (!searchTerm) return;

        // First, try a direct match on the ID, which is usually SYMBOL-A (e.g., 'Fe-56')
        const directMatch = ISOTOPE_DATA.find(iso => iso.id.toLowerCase() === searchTerm.toLowerCase());
        if (directMatch) {
            setCalculatedIsotopeId(directMatch.id);
            return;
        }
        
        // If no direct match, parse for 'Element-A' or 'Element A'
        const match = searchTerm.match(/^([a-zA-Z]+)\s*-?\s*(\d+)$/);

        if (match) {
            const [, nameOrSymbol, massNumStr] = match;
            const A = parseInt(massNumStr, 10);
            const key = nameOrSymbol.toLowerCase();

            const foundIsotope = ISOTOPE_DATA.find(iso => 
                iso.A === A && (
                    iso.symbol.toLowerCase() === key || 
                    iso.elementName.toLowerCase() === key
                )
            );

            if (foundIsotope) {
                setCalculatedIsotopeId(foundIsotope.id);
            } else {
                 setError(`Isotope '${nameOrSymbol}-${A}' not found in the database. Please try a common isotope.`);
            }
        } else {
            setError(`Invalid format. Please use 'Element-MassNumber' (e.g., 'Fe-56', 'Carbon-12').`);
        }
    };
    
    const calculations = useMemo(() => {
        if (!calculatedIsotopeId) return null;

        const isotope = ISOTOPE_DATA.find(iso => iso.id === calculatedIsotopeId)!;
        const { Z, N, A, actualMassU } = isotope;
        const { PROTON_MASS_U, NEUTRON_MASS_U, U_TO_MEV } = BINDING_ENERGY_CONSTANTS;

        const massOfNucleons = (Z * PROTON_MASS_U) + (N * NEUTRON_MASS_U);
        const massDefectU = massOfNucleons - actualMassU;
        const bindingEnergyMeV = massDefectU * U_TO_MEV;
        const bePerNucleon = bindingEnergyMeV / A;
        
        return {
            isotope,
            massOfNucleons,
            massDefectU,
            bindingEnergyMeV,
            bePerNucleon,
        };
    }, [calculatedIsotopeId]);

    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <InfoCard title="Binding Energy Calculator" icon={<CalculatorIcon className="w-6 h-6 text-purple-400" />}>
                    <p className="text-lab-text-secondary mb-4">
                        Nuclear binding energy is the energy required to disassemble a nucleus into its constituent protons and neutrons. This energy comes from the "mass defect," a tiny amount of mass that is converted into energy (E=mc²) when nucleons bind together. A higher binding energy per nucleon indicates a more stable nucleus.
                    </p>

                    <form onSubmit={handleCalculate} className="flex items-center gap-2 my-6">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Enter an isotope (e.g., Fe-56, Carbon-12)"
                            className="flex-grow bg-lab-bg border border-lab-border rounded-lg px-4 py-2 text-lab-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-md bg-accent-blue hover:bg-accent-blue/80 text-white font-medium transition-colors duration-200"
                        >
                            Calculate
                        </button>
                    </form>

                     {error && (
                        <div className="my-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center text-accent-red">
                            {error}
                        </div>
                    )}

                    {calculations && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          {/* Calculation Display */}
                          <div className="bg-lab-bg p-4 rounded-lg border border-lab-border space-y-3 font-mono text-sm">
                             <h3 className="text-lg font-sans font-bold text-accent-blue mb-2">Calculations for {calculations.isotope.name}</h3>
                             
                             <div className="flex justify-between items-center">
                                 <span className="text-lab-text-secondary">Protons (Z):</span>
                                 <span className="font-bold text-lab-text">{calculations.isotope.Z}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                 <span className="text-lab-text-secondary">Neutrons (N):</span>
                                 <span className="font-bold text-lab-text">{calculations.isotope.N}</span>
                             </div>
                             <hr className="border-lab-border my-2"/>
                             
                             <div className="flex justify-between items-center">
                                 <span className="text-lab-text-secondary">Mass of Nucleons:</span>
                                 <span className="font-bold text-lab-text">{calculations.massOfNucleons.toFixed(6)} u</span>
                             </div>
                             <div className="flex justify-between items-center">
                                 <span className="text-lab-text-secondary">Actual Nuclear Mass:</span>
                                 <span className="font-bold text-lab-text">{calculations.isotope.actualMassU.toFixed(6)} u</span>
                             </div>
                             <hr className="border-lab-border my-2"/>
                             
                             <div className="flex justify-between items-center bg-yellow-500/10 p-2 rounded">
                                 <span className="text-accent-yellow">Mass Defect (u):</span>
                                 <span className="font-bold text-accent-yellow">{calculations.massDefectU.toFixed(6)} u</span>
                             </div>
                             <hr className="border-lab-border my-2"/>

                             <div className="flex justify-between items-center">
                                  <span className="text-lab-text-secondary">Binding Energy (MeV):</span>
                                  <span className="font-bold text-lab-text">{calculations.bindingEnergyMeV.toFixed(3)} MeV</span>
                             </div>
                             <div className="flex justify-between items-center bg-green-500/10 p-2 rounded">
                                 <span className="text-accent-green">BE per Nucleon:</span>
                                 <span className="font-bold text-accent-green">{calculations.bePerNucleon.toFixed(3)} MeV</span>
                             </div>
                          </div>

                          {/* Chart and Explanation */}
                          <div>
                              <BindingEnergyChart selectedIsotope={{ id: calculations.isotope.id, A: calculations.isotope.A, bePerNucleon: calculations.bePerNucleon }} />
                              <p className="text-xs text-lab-text-secondary mt-2 text-center">
                                  This chart shows that nuclei with intermediate mass numbers (around Iron-56) have the highest binding energy per nucleon, making them the most stable. Energy is released when light nuclei fuse (fusion) or heavy nuclei split (fission), as both processes move towards this stable peak.
                              </p>
                          </div>
                      </div>
                    )}
                </InfoCard>
            </div>
        </main>
    );
};
