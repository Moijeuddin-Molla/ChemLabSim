
import React, { useState } from 'react';
import { InfoCard } from './InfoCard';
import { AtomIcon, AlertTriangleIcon, RadioIcon } from './icons/Icons';

const UraniumAtom: React.FC = () => (
    <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-2 border-lab-border rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
        <div className="absolute inset-2 border-2 border-lab-border rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-glow">
                U-238
            </div>
        </div>
    </div>
);

const ThoriumAtom: React.FC = () => (
    <div className="relative w-20 h-20">
        <div className="absolute inset-0 border border-lab-border rounded-full animate-spin" style={{ animationDuration: '3.5s' }}></div>
        <div className="absolute inset-2 border border-lab-border rounded-full animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                Th-234
            </div>
        </div>
    </div>
);

const AlphaParticle: React.FC = () => (
    <div className="w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center text-black font-bold shadow-md">
        α
    </div>
);

export const NuclearSimulator: React.FC = () => {
  const [decayed, setDecayed] = useState(false);

  const simulateDecay = () => {
    setDecayed(false);
    setTimeout(() => setDecayed(true), 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <InfoCard title="Nuclear Decay Simulator" icon={<AtomIcon className="w-6 h-6 text-accent-blue" />}>
        <p className="text-lab-text-secondary mb-4">
          This simulator provides a simplified visual representation of nuclear decay. Here, we observe the alpha decay of Uranium-238.
        </p>

        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center mb-6">
          <AlertTriangleIcon className="w-5 h-5 text-accent-red mr-3 flex-shrink-0" />
          <p className="text-sm text-accent-red">This is a simplified educational model. Real nuclear processes are vastly more complex and require licensed facilities.</p>
        </div>

        <div className="bg-lab-bg p-6 rounded-lg border border-lab-border min-h-[250px] flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center justify-center space-x-4 w-full">
            <div className={`transition-all duration-1000 ${decayed ? 'opacity-0 -translate-x-1/2' : 'opacity-100'}`}>
              <UraniumAtom />
            </div>
            
            <div className={`flex items-center justify-center space-x-4 transition-all duration-1000 ease-out ${decayed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1/2'}`}>
                <ThoriumAtom />
                <span className="text-2xl font-bold">+</span>
                <AlphaParticle />
            </div>
          </div>

           <div className="font-mono text-lg text-center text-accent-yellow p-3 rounded-md w-full">
                <span className={decayed ? 'opacity-50' : ''}>²³⁸U</span>
                <span className={`inline-block transition-opacity duration-500 mx-2 ${decayed ? 'opacity-100' : 'opacity-0'}`}>→</span>
                <span className={decayed ? 'opacity-100' : 'opacity-0'}>²³⁴Th + ⁴He (α)</span>
           </div>

        </div>

        <div className="mt-6 text-center">
          <button onClick={simulateDecay} className="px-6 py-3 rounded-md font-bold bg-accent-blue hover:bg-accent-blue/80 text-white transition-colors duration-200 flex items-center justify-center mx-auto">
            <RadioIcon className="w-5 h-5 mr-2"/>
            Simulate U-238 Alpha Decay
          </button>
        </div>
      </InfoCard>
    </div>
  );
};
