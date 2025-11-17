import type { DecayChain } from '../types';

export interface DecaySeries {
  id: string;
  name: string;
  chains: { [id: string]: DecayChain };
}

export const DECAY_SERIES: DecaySeries[] = [
  {
    id: 'natural-series',
    name: 'Natural Decay Series',
    chains: {
      'U-238': {
        id: 'U-238',
        name: 'Uranium Series',
        start: '²³⁸U',
        end: '²⁰⁶Pb',
        description: 'The most common decay chain, starting with Uranium-238 and ending in stable Lead-206.',
        steps: [
          { from: '²³⁸U', to: '²³⁴Th', type: 'alpha', halfLife: '4.468 billion years' },
          { from: '²³⁴Th', to: '²³⁴Pa', type: 'beta-', halfLife: '24.1 days' },
          { from: '²³⁴Pa', to: '²³⁴U', type: 'beta-', halfLife: '1.17 minutes' },
          { from: '²³⁴U', to: '²³⁰Th', type: 'alpha', halfLife: '245,500 years' },
          { from: '²³⁰Th', to: '²²⁶Ra', type: 'alpha', halfLife: '75,380 years' },
          { from: '²²⁶Ra', to: '²²²Rn', type: 'alpha', halfLife: '1,600 years' },
          { from: '²²²Rn', to: '²¹⁸Po', type: 'alpha', halfLife: '3.82 days' },
          { from: '²¹⁸Po', to: '²¹⁴Pb', type: 'alpha', halfLife: '3.10 minutes' },
          { from: '²¹⁴Pb', to: '²¹⁴Bi', type: 'beta-', halfLife: '26.8 minutes' },
          { from: '²¹⁴Bi', to: '²¹⁴Po', type: 'beta-', halfLife: '19.9 minutes' },
          { from: '²¹⁴Po', to: '²¹⁰Pb', type: 'alpha', halfLife: '164.3 µs' },
          { from: '²¹⁰Pb', to: '²¹⁰Bi', type: 'beta-', halfLife: '22.3 years' },
          { from: '²¹⁰Bi', to: '²¹⁰Po', type: 'beta-', halfLife: '5.01 days' },
          { from: '²¹⁰Po', to: '²⁰⁶Pb', type: 'alpha', halfLife: '138.4 days' },
          { from: '²⁰⁶Pb', to: null, type: 'stable', halfLife: 'Stable' },
        ],
      },
      'Th-232': {
        id: 'Th-232',
        name: 'Thorium Series',
        start: '²³²Th',
        end: '²⁰⁸Pb',
        description: 'The decay series starting with Thorium-232, the most abundant thorium isotope.',
        steps: [
            { from: '²³²Th', to: '²²⁸Ra', type: 'alpha', halfLife: '14.05 billion years' },
            { from: '²²⁸Ra', to: '²²⁸Ac', type: 'beta-', halfLife: '5.75 years' },
            { from: '²²⁸Ac', to: '²²⁸Th', type: 'beta-', halfLife: '6.15 hours' },
            { from: '²²⁸Th', to: '²²⁴Ra', type: 'alpha', halfLife: '1.91 years' },
            { from: '²²⁴Ra', to: '²²⁰Rn', type: 'alpha', halfLife: '3.66 days' },
            { from: '²²⁰Rn', to: '²¹⁶Po', type: 'alpha', halfLife: '55.6 seconds' },
            { from: '²¹⁶Po', to: '²¹²Pb', type: 'alpha', halfLife: '0.145 seconds' },
            { from: '²¹²Pb', to: '²¹²Bi', type: 'beta-', halfLife: '10.64 hours' },
            { from: '²¹²Bi', to: '²¹²Po', type: 'beta-', halfLife: '60.55 minutes' }, // Major branch (64%)
            { from: '²¹²Po', to: '²⁰⁸Pb', type: 'alpha', halfLife: '299 nanoseconds' },
            { from: '²⁰⁸Pb', to: null, type: 'stable', halfLife: 'Stable' },
        ]
      },
      'U-235': {
        id: 'U-235',
        name: 'Actinium Series',
        start: '²³⁵U',
        end: '²⁰⁷Pb',
        description: 'The decay series for Uranium-235, a fissile isotope used in nuclear power.',
        steps: [
            { from: '²³⁵U', to: '²³¹Th', type: 'alpha', halfLife: '704 million years' },
            { from: '²³¹Th', to: '²³¹Pa', type: 'beta-', halfLife: '25.5 hours' },
            { from: '²³¹Pa', to: '²²⁷Ac', type: 'alpha', halfLife: '32,760 years' },
            { from: '²²⁷Ac', to: '²²⁷Th', type: 'beta-', halfLife: '21.77 years' }, // Major branch (98.6%)
            { from: '²²⁷Th', to: '²²³Ra', type: 'alpha', halfLife: '18.7 days' },
            { from: '²²³Ra', to: '²¹⁹Rn', type: 'alpha', halfLife: '11.4 days' },
            { from: '²¹⁹Rn', to: '²¹⁵Po', type: 'alpha', halfLife: '3.96 seconds' },
            { from: '²¹⁵Po', to: '²¹¹Pb', type: 'alpha', halfLife: '1.78 milliseconds' },
            { from: '²¹¹Pb', to: '²¹¹Bi', type: 'beta-', halfLife: '36.1 minutes' },
            { from: '²¹¹Bi', to: '²⁰⁷Tl', type: 'alpha', halfLife: '2.14 minutes' },
            { from: '²⁰⁷Tl', to: '²⁰⁷Pb', type: 'beta-', halfLife: '4.77 minutes' },
            { from: '²⁰⁷Pb', to: null, type: 'stable', halfLife: 'Stable' },
        ]
      },
    }
  },
  {
    id: 'common-cosmogenic',
    name: 'Common & Cosmogenic Isotopes',
    chains: {
        'H-3': {
            id: 'H-3', name: 'Tritium', start: '³H', end: '³He',
            steps: [
                { from: '³H', to: '³He', type: 'beta-', halfLife: '12.32 years' },
                { from: '³He', to: null, type: 'stable', halfLife: 'Stable' },
            ]
        },
        'C-14': {
            id: 'C-14', name: 'Carbon-14', start: '¹⁴C', end: '¹⁴N',
            steps: [
                { from: '¹⁴C', to: '¹⁴N', type: 'beta-', halfLife: '5,730 years' },
                { from: '¹⁴N', to: null, type: 'stable', halfLife: 'Stable' },
            ]
        },
        'K-40': {
            id: 'K-40', name: 'Potassium-40', start: '⁴⁰K', end: '⁴⁰Ca',
            description: 'Potassium-40 has a branching decay. The most common path (89%) is shown.',
            steps: [
                { from: '⁴⁰K', to: '⁴⁰Ca', type: 'beta-', halfLife: '1.25 billion years' },
                { from: '⁴⁰Ca', to: null, type: 'stable', halfLife: 'Stable' },
            ]
        },
    }
  },
  {
    id: 'medical-isotopes',
    name: 'Medical Isotopes',
    chains: {
        'Mo-99': {
            id: 'Mo-99', name: 'Molybdenum-99', start: '⁹⁹Mo', end: '⁹⁹Tc',
            description: '⁹⁹Mo is used in generators to produce ⁹⁹ᵐTc, the most common medical radioisotope.',
            steps: [
                { from: '⁹⁹Mo', to: '⁹⁹ᵐTc', type: 'beta-', halfLife: '66 hours' },
                { from: '⁹⁹ᵐTc', to: '⁹⁹Tc', type: 'gamma', halfLife: '6 hours' },
                { from: '⁹⁹Tc', to: null, type: 'stable', halfLife: 'Effectively Stable (211,000 years)' },
            ]
        },
        'Co-60': {
            id: 'Co-60', name: 'Cobalt-60', start: '⁶⁰Co', end: '⁶⁰Ni',
            description: 'Used in radiation therapy and sterilization.',
            steps: [
                { from: '⁶⁰Co', to: '⁶⁰Ni', type: 'beta-', halfLife: '5.27 years' },
                { from: '⁶⁰Ni', to: null, type: 'stable', halfLife: 'Stable' },
            ]
        },
        'I-131': {
            id: 'I-131', name: 'Iodine-131', start: '¹³¹I', end: '¹³¹Xe',
            description: 'Used for treating thyroid disorders.',
            steps: [
                { from: '¹³¹I', to: '¹³¹Xe', type: 'beta-', halfLife: '8.02 days' },
                { from: '¹³¹Xe', to: null, type: 'stable', halfLife: 'Stable' },
            ]
        },
        'F-18': {
            id: 'F-18', name: 'Fluorine-18', start: '¹⁸F', end: '¹⁸O',
            description: 'A key positron emitter used in PET scans.',
            steps: [
                { from: '¹⁸F', to: '¹⁸O', type: 'beta+', halfLife: '109.8 minutes' },
                { from: '¹⁸O', to: null, type: 'stable', halfLife: 'Stable' },
            ]
        }
    }
  },
  {
    id: 'other-interest',
    name: 'Other Isotopes of Interest',
    chains: {
        'Am-241': {
            id: 'Am-241', name: 'Americium-241', start: '²⁴¹Am', end: '²³⁷Np',
            description: 'Used in most common household smoke detectors.',
            steps: [
                { from: '²⁴¹Am', to: '²³⁷Np', type: 'alpha', halfLife: '432.2 years' },
                { from: '²³⁷Np', to: null, type: 'stable', halfLife: 'Effectively Stable (2.14 My)' },
            ]
        },
        'Cs-137': {
            id: 'Cs-137', name: 'Cesium-137', start: '¹³⁷Cs', end: '¹³⁷Ba',
            description: 'A fission product used in various industrial gauges.',
            steps: [
                { from: '¹³⁷Cs', to: '¹³⁷ᵐBa', type: 'beta-', halfLife: '30.17 years' },
                { from: '¹³⁷ᵐBa', to: '¹³⁷Ba', type: 'gamma', halfLife: '2.55 minutes' },
                { from: '¹³⁷Ba', to: null, type: 'stable', halfLife: 'Stable' },
            ]
        },
        'Sr-90': {
            id: 'Sr-90', name: 'Strontium-90', start: '⁹⁰Sr', end: '⁹⁰Zr',
            description: 'A fission product of concern in nuclear fallout.',
            steps: [
                { from: '⁹⁰Sr', to: '⁹⁰Y', type: 'beta-', halfLife: '28.8 years' },
                { from: '⁹⁰Y', to: '⁹⁰Zr', type: 'beta-', halfLife: '64 hours' },
                { from: '⁹⁰Zr', to: null, type: 'stable', halfLife: 'Stable' },
            ]
        },
        'Pu-239': {
            id: 'Pu-239', name: 'Plutonium-239', start: '²³⁹Pu', end: '²³⁵U',
            description: 'A primary fissile isotope produced in nuclear reactors.',
            steps: [
                { from: '²³⁹Pu', to: '²³⁵U', type: 'alpha', halfLife: '24,110 years' },
                { from: '²³⁵U', to: null, type: 'stable', halfLife: 'Effectively Stable (704 My)' },
            ]
        }
    }
  }
];