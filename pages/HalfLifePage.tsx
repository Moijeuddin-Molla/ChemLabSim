import React, { useState, useMemo } from 'react';
import { InfoCard } from '../components/InfoCard';
import { HourglassIcon } from '../components/icons/Icons';

// --- Helper Components ---

interface DecayChartProps {
  data: { time: number; remaining: number }[];
  currentTime: number;
  maxTime: number;
  timeUnit: string;
  remainingAtTime: number;
}

const DecayChart: React.FC<DecayChartProps> = ({ data, currentTime, maxTime, timeUnit, remainingAtTime }) => {
  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = (time: number) => (time / maxTime) * innerWidth;
  const yScale = (remaining: number) => innerHeight - (remaining / 100) * innerHeight;

  const pathData = data.map(d => `${xScale(d.time)},${yScale(d.remaining)}`).join(' L ');
  
  const markerX = xScale(currentTime);
  const markerY = yScale(remainingAtTime);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Axes */}
        <line x1="0" y1={innerHeight} x2={innerWidth} y2={innerHeight} className="stroke-lab-border" strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2={innerHeight} className="stroke-lab-border" strokeWidth="2" />
        
        {/* Y-Axis Labels */}
        {[0, 25, 50, 75, 100].map(val => (
          <g key={val}>
            <text x="-10" y={yScale(val)} dy="0.32em" textAnchor="end" className="text-xs fill-current text-lab-text-secondary">
              {val}%
            </text>
            <line x1="-5" y1={yScale(val)} x2={innerWidth} y2={yScale(val)} className="stroke-lab-border/50" strokeDasharray="2,2" />
          </g>
        ))}

        {/* X-Axis Labels */}
         {[0, 0.25, 0.5, 0.75, 1].map(frac => (
          <text key={frac} x={xScale(maxTime * frac)} y={innerHeight + 20} textAnchor="middle" className="text-xs fill-current text-lab-text-secondary">
            {(maxTime * frac).toPrecision(2)}
          </text>
        ))}
         <text x={innerWidth / 2} y={innerHeight + 35} textAnchor="middle" className="text-sm font-semibold fill-current text-lab-text">
            Time ({timeUnit})
        </text>

        {/* Decay Curve */}
        <path d={`M ${pathData}`} fill="none" className="stroke-accent-yellow" strokeWidth="3" />

        {/* Current Time Marker */}
        <line x1={markerX} y1={markerY} x2={markerX} y2={innerHeight} className="stroke-accent-blue" strokeDasharray="4,4" />
        <line x1={0} y1={markerY} x2={markerX} y2={markerY} className="stroke-accent-blue" strokeDasharray="4,4" />
        <circle cx={markerX} cy={markerY} r="5" className="fill-accent-blue" />
      </g>
    </svg>
  );
};

// --- Main Component ---

const isotopes = [
  { name: 'Carbon-14', halfLife: 5730, maxTime: 50000, unit: 'years' },
  { name: 'Iodine-131', halfLife: 8.02 / 365.25, maxTime: 60, unit: 'days' }, // halfLife in years for consistency
  { name: 'Uranium-238', halfLife: 4.5e9, maxTime: 10, unit: 'billion years' },
];

export const HalfLifePage: React.FC = () => {
    const [selectedIsotope, setSelectedIsotope] = useState(isotopes[0]);
    const [time, setTime] = useState(0);
    const [inputValue, setInputValue] = useState('Carbon-14');
    const [error, setError] = useState<string | null>(null);


    const handleIsotopeChange = (isotope: typeof isotopes[0]) => {
        setSelectedIsotope(isotope);
        setTime(0);
    };
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const searchTerm = inputValue.trim().toLowerCase();
        const foundIsotope = isotopes.find(iso => iso.name.toLowerCase() === searchTerm);
        if (foundIsotope) {
            handleIsotopeChange(foundIsotope);
        } else {
            setError(`Isotope "${inputValue}" not found. Try 'Carbon-14', 'Iodine-131', or 'Uranium-238'.`);
        }
    };


    // --- Calculations ---
    const timeInYears = useMemo(() => {
        switch(selectedIsotope.unit) {
            case 'days': return time / 365.25;
            case 'billion years': return time * 1e9;
            default: return time;
        }
    }, [time, selectedIsotope.unit]);

    const numHalfLives = timeInYears / selectedIsotope.halfLife;
    const remainingPercent = 100 * Math.pow(0.5, numHalfLives);

    // --- Chart Data Generation ---
    const chartData = useMemo(() => {
        const points = [];
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * selectedIsotope.maxTime;
            let tInYears;
             switch(selectedIsotope.unit) {
                case 'days': tInYears = t / 365.25; break;
                case 'billion years': tInYears = t * 1e9; break;
                default: tInYears = t;
            }
            const r = 100 * Math.pow(0.5, tInYears / selectedIsotope.halfLife);
            points.push({ time: t, remaining: r });
        }
        return points;
    }, [selectedIsotope]);
    
    // --- Educational Output ---
    const formatTime = (t: number, unit: string) => {
        if (unit === 'billion years') return t.toFixed(2);
        return Math.round(t);
    }
    const educationalText = `After ${formatTime(time, selectedIsotope.unit)} ${selectedIsotope.unit}, ${numHalfLives.toFixed(2)} half-lives have passed. ${remainingPercent.toFixed(2)}% of the original sample remains.`;

    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <InfoCard title="Half-Life Simulator" icon={<HourglassIcon className="w-6 h-6 text-accent-yellow" />}>
                    <p className="text-lab-text-secondary mb-6">
                        Enter a radioactive material and use the time slider to see how its quantity decreases over time. The graph shows the percentage of the original sample remaining.
                    </p>
                    
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2 mb-6">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter radioactive material name..."
                            className="flex-grow bg-lab-bg border border-lab-border rounded-lg px-4 py-2 text-lab-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                            aria-label="Radioactive material name"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-md bg-accent-blue hover:bg-accent-blue/80 text-white font-medium transition-colors duration-200"
                        >
                            Simulate
                        </button>
                    </form>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center text-accent-red">
                            {error}
                        </div>
                    )}


                    {/* Simulator UI */}
                    <div className="bg-lab-bg p-4 rounded-lg border border-lab-border">
                        <DecayChart 
                            data={chartData}
                            currentTime={time}
                            maxTime={selectedIsotope.maxTime}
                            timeUnit={selectedIsotope.unit}
                            remainingAtTime={remainingPercent}
                        />
                        <div className="mt-4 px-4">
                            <label className="flex items-center text-sm font-medium text-lab-text-secondary mb-1">
                                Time Elapsed
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="range"
                                    min="0"
                                    max={selectedIsotope.maxTime}
                                    step={selectedIsotope.maxTime / 1000}
                                    value={time}
                                    onChange={(e) => setTime(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-lab-border rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-sm font-mono text-lab-text bg-lab-bg-light p-2 rounded-md w-36 text-center">{formatTime(time, selectedIsotope.unit)} {selectedIsotope.unit}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Educational Output */}
                    <div className="mt-6 p-4 bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg text-center">
                        <p className="text-accent-yellow font-medium">{educationalText}</p>
                    </div>

                </InfoCard>
            </div>
        </main>
    );
};
