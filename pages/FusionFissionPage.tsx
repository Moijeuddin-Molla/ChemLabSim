import React from 'react';
import { InfoCard } from '../components/InfoCard';
import { ZapIcon } from '../components/icons/Icons';
import { EnergyComparison } from '../components/EnergyComparison';

export const FusionFissionPage: React.FC = () => {
    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <InfoCard title="Nuclear Energy: Fusion & Fission" icon={<ZapIcon className="w-6 h-6 text-orange-400" />}>
                    <p className="text-lab-text-secondary mb-4">
                        Both nuclear fusion and fission release immense amounts of energy by converting a tiny fraction of mass directly into energy, as described by Einstein's famous equation, E=mc². This energy release is governed by the principle of <span className="font-bold text-accent-yellow">nuclear binding energy</span>.
                    </p>
                    <p className="text-lab-text-secondary mb-6">
                        Lighter elements like hydrogen can <span className="font-bold text-orange-400">fuse</span> together, moving "up" the binding energy curve toward more stable configurations and releasing energy. Conversely, very heavy elements like uranium can <span className="font-bold text-accent-red">split apart (fission)</span>, also moving toward the stable peak from the other direction and releasing energy. The following comparison illustrates the staggering difference in energy density between these nuclear processes and conventional chemical reactions.
                    </p>

                    <EnergyComparison />
                    
                    <div className="mt-8 pt-4 border-t border-lab-border">
                        <h3 className="text-xl font-bold text-lab-text">Why the Massive Difference?</h3>
                        <p className="text-lab-text-secondary mt-2">
                           Chemical reactions, like burning methane, only rearrange the electrons orbiting atomic nuclei, releasing energy stored in chemical bonds. Nuclear reactions, however, reconfigure the very protons and neutrons within the nucleus, tapping into the powerful <span className="font-bold">strong nuclear force</span>. This force is orders of magnitude stronger than the electromagnetic forces governing chemical bonds, resulting in an energy release that is millions of times greater per unit of mass.
                        </p>
                    </div>
                </InfoCard>
            </div>
        </main>
    );
};
