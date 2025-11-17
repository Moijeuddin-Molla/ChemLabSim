import React from 'react';
import { GasProperties } from '../types';
import { SyringeIcon } from './icons/Icons';
import { CHEMICALS } from '../constants';

interface GasSyringeProps {
  gasProperties: GasProperties | null;
}

const MAX_VOLUME_L = 50; // Arbitrary max volume for visualization scaling

export const GasSyringe: React.FC<GasSyringeProps> = ({ gasProperties }) => {
  const { totalMoles = 0, volumeL = 0 } = gasProperties || {};
  
  // Calculate plunger position as a percentage of the syringe height
  const plungerPosition = Math.min((volumeL / MAX_VOLUME_L) * 100, 100);

  return (
    <div className="bg-lab-bg-light p-4 rounded-lg border border-lab-border h-full flex flex-col">
      <h3 className="text-lg font-semibold text-lab-text mb-4 flex items-center">
        <SyringeIcon className="w-5 h-5 mr-2 text-accent-blue" />
        Gas Collection
      </h3>

      {gasProperties ? (
        <div className="flex-grow flex flex-col justify-between">
          {/* Syringe Visualization */}
          <div className="w-full h-48 bg-lab-bg p-2 rounded-lg border border-lab-border flex items-end">
             <div className="relative w-1/3 mx-auto h-full bg-lab-bg-light rounded-t-lg">
                <div 
                    className="absolute bottom-0 left-0 right-0 bg-accent-blue/50 rounded-t-lg transition-all duration-500 ease-out"
                    style={{ height: `${plungerPosition}%` }}
                >
                </div>
                {/* Plunger */}
                <div 
                    className="absolute left-[-50%] right-[-50%] bg-lab-border h-2 transition-all duration-500 ease-out"
                    style={{ bottom: `${plungerPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-lab-text rounded-full"></div>
                </div>
             </div>
          </div>

          {/* Data Readout */}
          <div className="mt-4 space-y-2 text-sm">
             <div className="grid grid-cols-2 gap-2 font-mono">
                <span className="text-lab-text-secondary">Pressure (P):</span>
                <span className="text-lab-text text-right">{gasProperties.pressure.toFixed(2)} atm</span>
                
                <span className="text-lab-text-secondary">Volume (V):</span>
                <span className="text-lab-text text-right font-bold text-accent-green">{volumeL.toFixed(3)} L</span>
                
                <span className="text-lab-text-secondary">Moles (n):</span>
                <span className="text-lab-text text-right">{totalMoles.toFixed(3)} mol</span>

                <span className="text-lab-text-secondary">Temperature (T):</span>
                <span className="text-lab-text text-right">{gasProperties.temperature}°C</span>
             </div>
             <div className="pt-2 border-t border-lab-border">
                <p className="text-xs text-lab-text-secondary">Contents: {gasProperties.gases.map(g => CHEMICALS.find(c => c.id === g.chemicalId)?.formula).join(', ')}</p>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lab-text-secondary text-center">No gas produced or collected yet.</p>
        </div>
      )}
    </div>
  );
};