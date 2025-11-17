import React from 'react';
import { View } from '../types';
import { 
    AtomIcon, 
    ChartBarIcon, 
    Share2Icon, 
    HourglassIcon, 
    ShieldIcon, 
    CalculatorIcon, 
} from './icons/Icons';

interface AppLauncherProps {
  setCurrentView: (view: View) => void;
  closeLauncher: () => void;
}

export const AppLauncher: React.FC<AppLauncherProps> = ({ setCurrentView, closeLauncher }) => {
    const apps = [
        { view: View.NUB_LAB, label: 'Nuclear Explorer', icon: <AtomIcon className="w-8 h-8 mx-auto" />, color: 'text-accent-red' },
        { view: View.NUCLIDE_CHART, label: 'Nuclide Chart', icon: <ChartBarIcon className="w-8 h-8 mx-auto" />, color: 'text-accent-blue' },
        { view: View.DECAY_CHAIN_VISUALIZER, label: 'Decay Chain', icon: <Share2Icon className="w-8 h-8 mx-auto" />, color: 'text-accent-green' },
        { view: View.HALF_LIFE_SIMULATOR, label: 'Half-Life Sim', icon: <HourglassIcon className="w-8 h-8 mx-auto" />, color: 'text-accent-yellow' },
        { view: View.RADIATION_SHIELDING_LAB, label: 'Shielding Lab', icon: <ShieldIcon className="w-8 h-8 mx-auto" />, color: 'text-lab-text' },
        { view: View.BINDING_ENERGY_CALCULATOR, label: 'Binding Energy', icon: <CalculatorIcon className="w-8 h-8 mx-auto" />, color: 'text-purple-400' },
    ];

    const handleClick = (view: View) => {
        setCurrentView(view);
        closeLauncher();
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-lab-bg-light border border-lab-border rounded-lg shadow-2xl p-4 z-30">
            <div className="grid grid-cols-3 gap-4">
                {apps.map(app => (
                    <button 
                        key={app.view}
                        onClick={() => handleClick(app.view)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg text-center cursor-pointer transform hover:scale-105 hover:bg-lab-border transition-all duration-200 ${app.color} text-lab-text-secondary hover:text-white`}
                    >
                        {app.icon}
                        <span className="text-xs mt-2 text-current">{app.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
