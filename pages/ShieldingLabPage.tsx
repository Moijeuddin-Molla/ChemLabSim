import React from 'react';
import { InfoCard } from '../components/InfoCard';
import { ShieldIcon } from '../components/icons/Icons';

export const ShieldingLabPage: React.FC = () => {
    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <InfoCard title="Radiation & Shielding Lab" icon={<ShieldIcon className="w-6 h-6 text-lab-text" />}>
                    <p className="text-lab-text-secondary">
                        This feature is coming soon! In this virtual experiment, you will be able to test the effectiveness of different materials (like paper, aluminum, and lead) at blocking alpha, beta, and gamma radiation.
                    </p>
                </InfoCard>
            </div>
        </main>
    );
};
