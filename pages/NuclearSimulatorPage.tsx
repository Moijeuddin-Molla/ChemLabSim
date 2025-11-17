import React from 'react';
import { NuclearSimulator } from '../components/NuclearSimulator';

export const NuclearSimulatorPage: React.FC = () => {
    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <NuclearSimulator />
        </main>
    );
};
