import React from 'react';
import { ThermometerIcon, WindIcon, RefreshCwIcon, ClockIcon } from './icons/Icons';

interface ExperimentControlsProps {
  temperature: number;
  setTemperature: (t: number) => void;
  pressure: number;
  setPressure: (p: number) => void;
  stirringSpeed: number;
  setStirringSpeed: (s: number) => void;
  reactionTime: number;
  setReactionTime: (t: number) => void;
  disabled: boolean;
}

const ControlSlider: React.FC<{
    icon: React.ReactNode,
    label: string,
    value: number,
    setValue: (n: number) => void,
    min: number,
    max: number,
    step: number,
    unit: string,
    disabled: boolean,
}> = ({ icon, label, value, setValue, min, max, step, unit, disabled }) => {
    return (
        <div className={disabled ? 'opacity-50' : ''}>
            <label className="flex items-center text-sm font-medium text-lab-text-secondary mb-1">
                {icon}
                <span className="ml-2">{label}</span>
            </label>
            <div className="flex items-center space-x-2">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => setValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-lab-border rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    disabled={disabled}
                />
                <span className="text-sm font-mono text-lab-text bg-lab-bg-light p-1 rounded-md w-24 text-center">{value} {unit}</span>
            </div>
        </div>
    );
}

// Helper functions for logarithmic time slider
const formatTime = (seconds: number): string => {
    if (seconds < 1) seconds = 1;
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const MIN_SECONDS = 1;
const MAX_SECONDS = 24 * 3600; // 24 hours in seconds
const MIN_LOG = Math.log(MIN_SECONDS);
const MAX_LOG = Math.log(MAX_SECONDS);

const secondsToSliderValue = (s: number) => {
    const log_s = Math.log(Math.max(MIN_SECONDS, Math.min(MAX_SECONDS, s)));
    const scale = (log_s - MIN_LOG) / (MAX_LOG - MIN_LOG);
    return scale * 100;
};

const sliderValueToSeconds = (v: number) => {
    const scale = v / 100;
    const log_val = MIN_LOG + scale * (MAX_LOG - MIN_LOG);
    return Math.exp(log_val);
};


export const ExperimentControls: React.FC<ExperimentControlsProps> = ({ 
    temperature, setTemperature, 
    pressure, setPressure, 
    stirringSpeed, setStirringSpeed,
    reactionTime, setReactionTime,
    disabled
}) => {
  
  const handleTimeChange = (sliderValue: number) => {
    const seconds = sliderValueToSeconds(sliderValue);
    setReactionTime(seconds);
  };

  const timeSliderPosition = secondsToSliderValue(reactionTime);

  return (
    <div className="space-y-4 bg-lab-bg p-4 rounded-lg border border-lab-border">
        <h3 className="text-lg font-semibold text-lab-text">Experiment Conditions</h3>
        <ControlSlider 
            icon={<ThermometerIcon className="w-5 h-5 text-accent-red" />}
            label="Temperature"
            value={temperature}
            setValue={setTemperature}
            min={-273}
            max={1500}
            step={1}
            unit="°C"
            disabled={disabled}
        />
         <ControlSlider 
            icon={<WindIcon className="w-5 h-5 text-accent-blue" />}
            label="Pressure"
            value={pressure}
            setValue={setPressure}
            min={0.1}
            max={100}
            step={0.1}
            unit="atm"
            disabled={disabled}
        />
        <ControlSlider 
            icon={<RefreshCwIcon className="w-5 h-5 text-accent-green" />}
            label="Stirring Speed"
            value={stirringSpeed}
            setValue={setStirringSpeed}
            min={0}
            max={2000}
            step={50}
            unit="RPM"
            disabled={disabled}
        />
        {/* Reaction Time Slider */}
        <div className={disabled ? 'opacity-50' : ''}>
            <label className="flex items-center text-sm font-medium text-lab-text-secondary mb-1">
                <ClockIcon className="w-5 h-5 text-accent-yellow" />
                <span className="ml-2">Reaction Time</span>
            </label>
            <div className="flex items-center space-x-2">
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={timeSliderPosition}
                    onChange={(e) => handleTimeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-lab-border rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    disabled={disabled}
                />
                <span className="text-sm font-mono text-lab-text bg-lab-bg-light p-1 rounded-md w-24 text-center">{formatTime(reactionTime)}</span>
            </div>
        </div>
    </div>
  );
};