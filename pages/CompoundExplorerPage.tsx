import React, { useState } from 'react';
import { getCompoundSummary } from '../services/geminiService';
import { InfoCard } from '../components/InfoCard';
import { SearchIcon, BrainCircuitIcon } from '../components/icons/Icons';

export const CompoundExplorerPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [lastSearched, setLastSearched] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim() || isLoading) return;

        setIsLoading(true);
        setSummary('');
        setLastSearched(searchTerm);

        try {
            const result = await getCompoundSummary(searchTerm);
            setSummary(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setSummary(`Failed to generate summary for "${searchTerm}": ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const LoadingSkeleton: React.FC = () => (
        <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-lab-border rounded w-3/4"></div>
            <div className="h-4 bg-lab-border rounded"></div>
            <div className="h-4 bg-lab-border rounded"></div>
            <div className="h-4 bg-lab-border rounded w-5/6"></div>
        </div>
    );

    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <InfoCard title="Compound Explorer" icon={<BrainCircuitIcon className="w-6 h-6 text-accent-blue" />}>
                    <p className="text-lab-text-secondary mb-6">
                        Search for any chemical compound (e.g., "aspirin", "caffeine", "C6H12O6") to get an AI-generated educational summary about its properties, uses, and importance.
                    </p>
                    <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6">
                        <div className="relative flex-grow">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lab-text-secondary" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for a compound..."
                                disabled={isLoading}
                                className="w-full bg-lab-bg border border-lab-border rounded-lg pl-10 pr-4 py-2 text-lab-text focus:outline-none focus:ring-2 focus:ring-accent-blue disabled:cursor-not-allowed"
                            />
                        </div>
                        <button type="submit" disabled={isLoading || !searchTerm.trim()} className="px-6 py-2 rounded-md bg-accent-blue hover:bg-accent-blue/80 text-white font-medium transition-colors duration-200 disabled:bg-lab-border disabled:cursor-not-allowed">
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </form>

                    {isLoading && <LoadingSkeleton />}
                    
                    {summary && !isLoading && (
                        <div>
                             <h3 className="text-xl font-bold text-lab-text mb-2">
                                Summary for <span className="text-accent-green">{lastSearched}</span>
                            </h3>
                            <div className="text-lab-text-secondary space-y-4 whitespace-pre-wrap">
                                {summary.split('\n\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {!summary && !isLoading && !lastSearched && (
                         <p className="text-center text-lab-text-secondary">Your search results will appear here.</p>
                    )}
                </InfoCard>
            </div>
        </main>
    );
};
