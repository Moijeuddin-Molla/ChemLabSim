import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { InfoCard } from '../components/InfoCard';
import { ChartBarIcon, ZoomInIcon, ZoomOutIcon, MoveIcon, InfoIcon } from '../components/icons/Icons';
import { NUCLIDES_DATA } from '../data/nuclides';
import type { Nuclide } from '../types';
import { NuclideDetailModal } from '../components/NuclideDetailModal';


const decayModeColors: Record<Nuclide['stability'], string> = {
    'Stable': 'fill-accent-green',
    'Beta-': 'fill-accent-blue',
    'Alpha': 'fill-accent-red',
    'EC/Beta+': 'fill-accent-yellow',
    'p': 'fill-orange-400',
    'n': 'fill-gray-400',
};

const Legend: React.FC = () => (
    <div className="bg-lab-bg p-3 rounded-lg border border-lab-border">
        <h3 className="text-sm font-semibold text-lab-text mb-2 flex items-center"><InfoIcon className="w-4 h-4 mr-2" />Legend</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {Object.entries(decayModeColors).map(([mode, color]) => (
                <div key={mode} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-sm ${color.replace('fill-', 'bg-')}`} />
                    <span className="text-lab-text-secondary">{mode}</span>
                </div>
            ))}
        </div>
    </div>
);

const ZOOM_LABEL_THRESHOLD = 20;

export const NuclideChartPage: React.FC = () => {
    const [selectedNuclide, setSelectedNuclide] = useState<Nuclide | null>(null);
    const [viewBox, setViewBox] = useState({ x: -1, y: -1, width: 30, height: 30 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [hoveredNuclide, setHoveredNuclide] = useState<Nuclide | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const svgRef = useRef<SVGSVGElement>(null);

    const { nuclides, maxN, maxZ } = useMemo(() => {
        const data = NUCLIDES_DATA;
        const maxN = Math.max(...data.map(n => n.N)) + 1;
        const maxZ = Math.max(...data.map(n => n.Z)) + 1;
        return { nuclides: data, maxN, maxZ };
    }, []);

    const handleZoom = useCallback((factor: number) => {
        setViewBox(prev => {
            const newWidth = prev.width * factor;
            const newHeight = prev.height * factor;
            // Zoom centered on the current viewbox center
            const newX = prev.x + (prev.width - newWidth) / 2;
            const newY = prev.y + (prev.height - newHeight) / 2;
            return { x: newX, y: newY, width: newWidth, height: newHeight };
        });
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1; // Zoom in on scroll up, out on scroll down
        handleZoom(zoomFactor);
    }, [handleZoom]);

    const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        if (!isPanning || !svgRef.current) return;
        const svg = svgRef.current;
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        
        const dx = (e.clientX - panStart.x) / ctm.a;
        const dy = (e.clientY - panStart.y) / ctm.d;

        setViewBox(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
        setPanStart({ x: e.clientX, y: e.clientY });

        if (hoveredNuclide) {
             setTooltipPos({ x: e.clientX, y: e.clientY });
        }
    }, [isPanning, panStart, hoveredNuclide]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);
    
    const handleMouseLeave = useCallback(() => {
        setIsPanning(false);
        setHoveredNuclide(null);
    }, []);

    const resetView = () => {
        setViewBox({ x: -1, y: -1, width: 30, height: 30 });
    };

    return (
        <main className="flex-grow p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <InfoCard title="Interactive Nuclide Chart" icon={<ChartBarIcon className="w-6 h-6 text-accent-blue" />}>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-grow relative border border-lab-border rounded-lg bg-lab-bg overflow-hidden">
                             {hoveredNuclide && (
                                <div 
                                    className="absolute z-20 p-2 text-sm bg-black/80 text-white rounded-md pointer-events-none"
                                    style={{ top: tooltipPos.y + 15, left: tooltipPos.x + 15, transform: `translate(-50%, -100%)` }}
                                >
                                    {hoveredNuclide.symbol}-{hoveredNuclide.mass_number}
                                </div>
                            )}
                            <svg
                                ref={svgRef}
                                className={`w-full h-[60vh] cursor-grab ${isPanning ? 'cursor-grabbing' : ''}`}
                                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                                onWheel={handleWheel}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                            >
                                <g>
                                    {nuclides.map((nuclide) => (
                                        <rect
                                            key={`${nuclide.Z}-${nuclide.N}`}
                                            x={nuclide.N + 0.05}
                                            y={maxZ - nuclide.Z - 1 + 0.05} // Invert Y-axis
                                            width="0.9"
                                            height="0.9"
                                            rx="0.1"
                                            className={`${decayModeColors[nuclide.stability]} transition-opacity duration-200 hover:opacity-70 cursor-pointer`}
                                            onClick={() => setSelectedNuclide(nuclide)}
                                            onMouseEnter={(e) => {
                                                setHoveredNuclide(nuclide);
                                                setTooltipPos({ x: e.clientX, y: e.clientY });
                                            }}
                                            onMouseLeave={() => setHoveredNuclide(null)}
                                        />
                                    ))}
                                    {viewBox.width < ZOOM_LABEL_THRESHOLD && nuclides.map((nuclide) => (
                                        <text
                                            key={`label-${nuclide.Z}-${nuclide.N}`}
                                            x={nuclide.N + 0.5}
                                            y={maxZ - nuclide.Z - 1 + 0.55} // Centered with slight baseline adjustment
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className={nuclide.stability === 'EC/Beta+' ? 'fill-black' : 'fill-white'}
                                            stroke={nuclide.stability === 'EC/Beta+' ? '#FFFFFF99' : '#00000099'}
                                            strokeWidth="0.035"
                                            paintOrder="stroke"
                                            style={{ fontSize: 0.35 }}
                                            fontFamily="sans-serif"
                                            fontWeight="bold"
                                            pointerEvents="none"
                                        >
                                            {`${nuclide.symbol}-${nuclide.mass_number}`}
                                        </text>
                                    ))}
                                </g>
                                {/* Axes Labels */}
                                <text x={viewBox.x + viewBox.width / 2} y={viewBox.y + viewBox.height - 1} textAnchor="middle" className="fill-current text-lab-text-secondary" style={{fontSize: viewBox.width * 0.03}}>
                                    Neutron Number (N)
                                </text>
                                <text x={viewBox.x + 1} y={viewBox.y + viewBox.height / 2} textAnchor="middle" transform={`rotate(-90, ${viewBox.x + 1}, ${viewBox.y + viewBox.height / 2})`} className="fill-current text-lab-text-secondary" style={{fontSize: viewBox.height * 0.03}}>
                                    Proton Number (Z)
                                </text>
                            </svg>
                            <div className="absolute top-2 right-2 flex flex-col space-y-1">
                                <button onClick={() => handleZoom(0.8)} className="p-2 bg-lab-bg-light rounded-md text-lab-text-secondary hover:text-white hover:bg-lab-border"><ZoomInIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleZoom(1.25)} className="p-2 bg-lab-bg-light rounded-md text-lab-text-secondary hover:text-white hover:bg-lab-border"><ZoomOutIcon className="w-5 h-5"/></button>
                                <button onClick={resetView} className="p-2 bg-lab-bg-light rounded-md text-lab-text-secondary hover:text-white hover:bg-lab-border"><MoveIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                        <div className="md:w-56 flex-shrink-0">
                            <Legend />
                             <p className="text-xs text-lab-text-secondary mt-4">
                                Use scroll wheel to zoom and drag to pan. This chart displays a subset of known nuclides for educational purposes.
                            </p>
                        </div>
                    </div>
                </InfoCard>
            </div>
            {selectedNuclide && (
                <NuclideDetailModal nuclide={selectedNuclide} onClose={() => setSelectedNuclide(null)} />
            )}
        </main>
    );
};
