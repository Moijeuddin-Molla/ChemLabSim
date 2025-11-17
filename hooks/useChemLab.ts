

import { useState, useCallback, useMemo } from 'react';
import { REACTIONS, CHEMICALS } from '../constants';
import type { Chemical, Reaction } from '../types';

export const useChemLab = () => {
  const [chemicalsInBeaker, setChemicalsInBeaker] = useState<Chemical[]>([]);
  const [currentReaction, setCurrentReaction] = useState<Reaction | null>(null);
  const [reactionEffect, setReactionEffect] = useState<string | null>(null);

  const addChemical = useCallback((chemicalId: string) => {
    const chemicalToAdd = CHEMICALS.find(c => c.id === chemicalId);
    if (chemicalToAdd && !chemicalsInBeaker.find(c => c.id === chemicalId)) {
      const newChemicals = [...chemicalsInBeaker, chemicalToAdd];
      setChemicalsInBeaker(newChemicals);
      checkForReaction(newChemicals);
    }
  }, [chemicalsInBeaker]);

  const checkForReaction = (currentChemicals: Chemical[]) => {
    const chemicalIds = new Set(currentChemicals.map(c => c.id));
    const foundReaction = REACTIONS.find(reaction => {
      // FIX: map reactants to their chemicalId to create a Set of strings instead of a Set of objects.
      const reactantIds = new Set(reaction.reactants.map(r => r.chemicalId));
      if (reactantIds.size !== chemicalIds.size) return false;
      for (const id of reactantIds) {
        if (!chemicalIds.has(id)) return false;
      }
      return true;
    });

    if (foundReaction) {
      setCurrentReaction(foundReaction);
      
      // Trigger visual effect
      if(foundReaction.warning?.includes('Explosive') || foundReaction.warning?.includes('Violent')){
          setReactionEffect('explosion');
      } else {
          setReactionEffect('bubble');
      }
      
      setTimeout(() => {
          setReactionEffect(null);
          // Clear beaker after reaction, but keep products
          const productChemicals = foundReaction.products
            .map(p => CHEMICALS.find(c => c.id === p.chemicalId))
            .filter((c): c is Chemical => c !== undefined);
            
          setChemicalsInBeaker(productChemicals);
      }, 2000);

    } else {
      setCurrentReaction(null);
    }
  };

  const resetLab = useCallback(() => {
    setChemicalsInBeaker([]);
    setCurrentReaction(null);
    setReactionEffect(null);
  }, []);

  const beakerContents = useMemo(() => {
    if (chemicalsInBeaker.length === 0) {
      return { color: 'transparent', level: 0, opacity: 0 };
    }

    // Use the color of the last chemical added for visual feedback
    const lastChemical = chemicalsInBeaker[chemicalsInBeaker.length - 1];
    const color = lastChemical.color
        .replace('bg-', 'text-')
        .replace('-200', '-400')
        .replace('-300', '-500')
        .replace('-800', '-600');
    
    // Liquid level increases with each chemical, maxes out at 80%
    const level = Math.min(chemicalsInBeaker.length * 20, 80);

    // Color intensity (opacity) increases with more chemicals, maxes out at 90%
    const opacity = Math.min(30 + chemicalsInBeaker.length * 20, 90);

    return { color, level, opacity };

  }, [chemicalsInBeaker]);

  return {
    chemicalsInBeaker,
    currentReaction,
    addChemical,
    resetLab,
    reactionEffect,
    beakerContents,
  };
};