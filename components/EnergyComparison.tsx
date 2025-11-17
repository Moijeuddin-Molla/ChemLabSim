import React from 'react';
import { ZapIcon, AtomIcon, FlaskConicalIcon } from './icons/Icons';

const energyData = [
  {
    type: 'Fusion',
    reaction: '²H + ³H → ⁴He + n',
    energyPerEvent: '17.6 MeV',
    energyPerKg: 337, // TJ/kg
    icon: <ZapIcon className="w-10 h-10" />,
    color: 'text-orange-400',
    barColor: 'bg-orange-400',
  },
  {
    type: 'Fission',
    reaction: '²³⁵U + n → ≈2 frags + 2-3n',
    energyPerEvent: '~200 MeV',
    energyPerKg: 82, // TJ/kg
    icon: <AtomIcon className="w-10 h-10" />,
    color: 'text-accent-red',
    barColor: 'bg-accent-red',
  },
  {
    type: 'Chemical',
    reaction: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    energyPerEvent: '~9.2 eV',
    energyPerKg: 0.000055, // TJ/kg
    icon: <FlaskConicalIcon className="w-10 h-10" />,
    color: 'text-accent-blue',
    barColor: 'bg-accent-blue',
  },
];

const MAX_BAR_HEIGHT_PX = 200;

const ComparisonCard: React.FC<{
  type: string;
  reaction: string;
  energyPerEvent: string;
  energyPerKg: number;
  icon: React.ReactNode;
  color: string;
  barColor: string;
  barHeight: number;
}> = ({ type, reaction, energyPerEvent, energyPerKg, icon, color, barColor, barHeight }) => {
  return (
    <div className="flex flex-col items-center bg-lab-bg p-4 rounded-lg border border-lab-border text-center h-full">
      <div className={`mb-3 ${color}`}>{icon}</div>
      <h3 className={`text-2xl font-bold ${color}`}>{type}</h3>
      <p className="font-mono text-sm text-lab-text-secondary mt-2 h-10 flex items-center">{reaction}</p>
      <div className="mt-4 text-left w-full space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-lab-text-secondary">Energy/Event:</span>
          <span className="font-bold text-lab-text">{energyPerEvent}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-lab-text-secondary">Energy/kg Fuel:</span>
          <span className={`font-bold ${color}`}>
            {energyPerKg < 0.01 ? `${(energyPerKg * 1e6).toFixed(0)} MJ` : `${energyPerKg.toLocaleString()} TJ`}
          </span>
        </div>
      </div>
      <div className="flex-grow flex items-end justify-center w-full mt-4">
        <div 
          className={`w-16 rounded-t-md transition-all duration-500 ease-out ${barColor}`}
          style={{ height: `${barHeight}px` }}
          title={`${energyPerKg.toLocaleString()} TJ/kg`}
        />
      </div>
    </div>
  );
};

export const EnergyComparison: React.FC = () => {
    const values = energyData.map(d => d.energyPerKg);
    const minLog = Math.log(Math.min(...values));
    const maxLog = Math.log(Math.max(...values));

    const calculateBarHeight = (value: number) => {
        if (value <= 0) return 1; // Give a minimum height of 1px for visibility
        const logValue = Math.log(value);
        const scale = (logValue - minLog) / (maxLog - minLog);
        return 1 + scale * (MAX_BAR_HEIGHT_PX - 1); // Scale from 1px to max height
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {energyData.map(data => (
                <ComparisonCard 
                    key={data.type}
                    {...data}
                    barHeight={calculateBarHeight(data.energyPerKg)}
                />
            ))}
        </div>
    );
};
