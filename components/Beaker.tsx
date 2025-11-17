import React from 'react';
import { BeakerIcon } from './icons/Icons';

interface BeakerProps {
  reactionEffect: string | null;
  contents: {
    liquidLayer: {
      color: string;
      level: number;
      opacity: number;
    } | null;
    solidLayers: {
      color: string;
      height: number;
    }[];
    vaporOpacity: number;
  };
  stirringSpeed: number;
}

export const Beaker: React.FC<BeakerProps> = ({ reactionEffect, contents, stirringSpeed }) => {
  const { liquidLayer, solidLayers, vaporOpacity } = contents;
  const bubbleAnimationDuration = stirringSpeed > 0 ? Math.max(0.2, 1.2 - stirringSpeed / 2000) : 1.2;
  
  let bottomOffset = 0;

  return (
    <div className="relative w-48 h-64 flex flex-col items-center justify-center">
      <BeakerIcon className={`w-full h-full text-lab-border transition-colors duration-500`} />
      <div className="absolute bottom-[20px] left-[20px] right-[20px] h-full overflow-hidden">
        {/* Solid Layers */}
        {solidLayers.map((layer, index) => {
          const currentOffset = bottomOffset;
          bottomOffset += layer.height;
          return (
            <div
              key={index}
              className={`absolute left-0 right-0 ${layer.color}`}
              style={{
                bottom: `${currentOffset}%`,
                height: `${layer.height}%`,
                opacity: 0.8,
                transition: 'all 0.5s ease-out'
              }}
            />
          );
        })}

        {/* Liquid Layer */}
        {liquidLayer && (
          <div
            className={`absolute left-0 right-0 transition-all duration-500 ease-out ${liquidLayer.color} bg-current`}
            style={{
              bottom: `${bottomOffset}%`,
              height: `${liquidLayer.level}%`,
              opacity: liquidLayer.opacity / 100,
            }}
          >
              {(reactionEffect === 'bubble' || (stirringSpeed > 0 && liquidLayer.level > 0)) && (
                  <div className="absolute inset-0 flex justify-around items-end">
                      {[...Array(5)].map((_, i) => (
                          <div 
                              key={i} 
                              className="w-2 h-2 bg-white/50 rounded-full" 
                              style={{
                                  animation: `bubble ${bubbleAnimationDuration}s ease-in-out infinite`,
                                  animationDelay: `${i * (bubbleAnimationDuration / 5)}s`
                              }}>
                          </div>
                      ))}
                  </div>
              )}
          </div>
        )}
        
        {/* Vapor Layer */}
        <div
            className="absolute top-0 left-0 right-0 bg-gray-400"
            style={{
                height: '100%',
                opacity: vaporOpacity,
                maskImage: 'linear-gradient(to top, transparent 40%, black 80%)',
                WebkitMaskImage: 'linear-gradient(to top, transparent 40%, black 80%)',
                transition: 'opacity 0.5s ease-out'
            }}
        />
      </div>
       {reactionEffect === 'explosion' && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-accent-yellow rounded-full animate-ping opacity-75"></div>
            </div>
        )}
    </div>
  );
};