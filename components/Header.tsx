import React, { useState, useRef, useEffect } from 'react';
import { View } from '../types';
import { BeakerIcon, FlaskConicalIcon, BrainCircuitIcon, GridIcon } from './icons/Icons';
import { AppLauncher } from './AppLauncher';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { view: View.CHEMICAL_SHELF, label: 'Chemical Shelf', icon: <FlaskConicalIcon className="w-5 h-5 mr-2" /> },
    { view: View.LAB_BENCH, label: 'Lab Bench', icon: <BeakerIcon className="w-5 h-5 mr-2" /> },
    { view: View.COMPOUND_EXPLORER, label: 'Explorer', icon: <BrainCircuitIcon className="w-5 h-5 mr-2" /> },
  ];
  
  // Close launcher when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (launcherRef.current && !launcherRef.current.contains(event.target as Node)) {
        setIsAppLauncherOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [launcherRef]);

  return (
    <header className="bg-lab-bg-light shadow-md sticky top-0 z-20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-accent-blue cursor-pointer" onClick={() => setCurrentView(View.HOME)}>ChemLabSim</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {navItems.map(item => (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentView === item.view
                    ? 'bg-accent-blue text-white'
                    : 'text-lab-text-secondary hover:bg-lab-border hover:text-white'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
            <div className="relative" ref={launcherRef}>
              <button
                onClick={() => setIsAppLauncherOpen(prev => !prev)}
                className={`p-2 rounded-full transition-colors duration-200 ${isAppLauncherOpen ? 'bg-lab-border text-white' : 'text-lab-text-secondary hover:bg-lab-border hover:text-white'}`}
                aria-label="Open applications library"
              >
                <GridIcon className="w-5 h-5" />
              </button>
              {isAppLauncherOpen && (
                <AppLauncher 
                  setCurrentView={setCurrentView} 
                  closeLauncher={() => setIsAppLauncherOpen(false)} 
                />
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};