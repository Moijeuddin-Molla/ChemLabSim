import React, { useState } from 'react';
import { View } from './types';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ChemicalShelfPage } from './pages/ChemicalShelfPage';
import { ChemistryLabPage } from './pages/ChemistryLabPage';
import { useSimulation } from './hooks/useSimulation';
import { CompoundExplorerPage } from './pages/CompoundExplorerPage';
import { NubLabPage } from './pages/NubLabPage';
import { NuclideChartPage } from './pages/NuclideChartPage';
import { DecayChainPage } from './pages/DecayChainPage';
import { HalfLifePage } from './pages/HalfLifePage';
import { ShieldingLabPage } from './pages/ShieldingLabPage';
import { BindingEnergyPage } from './pages/BindingEnergyPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const simulation = useSimulation();

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <HomePage setCurrentView={setCurrentView} />;
      case View.CHEMICAL_SHELF:
        return <ChemicalShelfPage onAddChemical={simulation.addChemical} />;
      case View.LAB_BENCH:
        return <ChemistryLabPage {...simulation} />;
      case View.COMPOUND_EXPLORER:
        return <CompoundExplorerPage />;
      case View.NUB_LAB:
        return <NubLabPage />;
      case View.NUCLIDE_CHART:
        return <NuclideChartPage />;
      case View.DECAY_CHAIN_VISUALIZER:
        return <DecayChainPage />;
      case View.HALF_LIFE_SIMULATOR:
        return <HalfLifePage />;
      case View.RADIATION_SHIELDING_LAB:
        return <ShieldingLabPage />;
      case View.BINDING_ENERGY_CALCULATOR:
        return <BindingEnergyPage />;
      default:
        return <HomePage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-lab-bg text-lab-text font-sans flex flex-col">
      {currentView !== View.HOME && <Header currentView={currentView} setCurrentView={setCurrentView} />}
      {renderView()}
    </div>
  );
};

export default App;