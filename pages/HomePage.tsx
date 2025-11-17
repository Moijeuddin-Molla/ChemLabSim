import React from 'react';
import { View } from '../types';
import { BeakerIcon } from '../components/icons/Icons';

interface HomePageProps {
  setCurrentView: (view: View) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentView }) => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
      <div className="max-w-2xl">
        <div className="flex justify-center items-center gap-4 mb-4">
            <BeakerIcon className="w-16 h-16 text-accent-blue" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-lab-text">
          Welcome to <span className="text-accent-blue">ChemLabSim</span>
        </h1>
        <p className="text-lg text-lab-text-secondary mb-8">
          An interactive virtual laboratory to safely explore the fascinating world of chemical reactions. Set conditions, mix elements, and discover the principles of chemistry.
        </p>
        <button
          onClick={() => setCurrentView(View.CHEMICAL_SHELF)}
          className="px-8 py-4 bg-accent-green hover:bg-accent-green/80 text-white font-bold rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Enter the Lab
        </button>
      </div>
    </main>
  );
};
