import React from 'react';
import { InfoCard } from '../components/InfoCard';
import { LightbulbIcon } from '../components/icons/Icons';

export const ApplicationsPage: React.FC = () => {
    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <InfoCard title="Real-World Applications Explorer" icon={<LightbulbIcon className="w-6 h-6 text-teal-400" />}>
                    <p className="text-lab-text-secondary">
                        This feature is coming soon! You will be able to explore an interactive gallery of common radioactive isotopes and learn about their important applications in medicine, industry, and scientific research.
                    </p>
                </InfoCard>
            </div>
        </main>
    );
};
