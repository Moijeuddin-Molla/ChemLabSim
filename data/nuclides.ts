import type { Nuclide } from '../types';

// A curated list of nuclides for the first 20 elements.
// Data is simplified for this educational simulation.
// Stability: 'Stable', 'Beta-' (n->p), 'EC/Beta+' (p->n), 'Alpha'
export const NUCLIDES_DATA: Nuclide[] = [
  // H (Z=1)
  { Z: 1, N: 0, symbol: 'H', mass_number: 1, stability: 'Stable', half_life_sec: null },
  { Z: 1, N: 1, symbol: 'H', mass_number: 2, stability: 'Stable', half_life_sec: null },
  { Z: 1, N: 2, symbol: 'H', mass_number: 3, stability: 'Beta-', half_life_sec: 3.888e8, half_life_text: '12.32 y' },
  // He (Z=2)
  { Z: 2, N: 1, symbol: 'He', mass_number: 3, stability: 'Stable', half_life_sec: null },
  { Z: 2, N: 2, symbol: 'He', mass_number: 4, stability: 'Stable', half_life_sec: null },
  { Z: 2, N: 4, symbol: 'He', mass_number: 6, stability: 'Beta-', half_life_sec: 0.8067, half_life_text: '806.7 ms' },
  // Li (Z=3)
  { Z: 3, N: 3, symbol: 'Li', mass_number: 6, stability: 'Stable', half_life_sec: null },
  { Z: 3, N: 4, symbol: 'Li', mass_number: 7, stability: 'Stable', half_life_sec: null },
  { Z: 3, N: 5, symbol: 'Li', mass_number: 8, stability: 'Beta-', half_life_sec: 0.840, half_life_text: '840 ms' },
  // Be (Z=4)
  { Z: 4, N: 3, symbol: 'Be', mass_number: 7, stability: 'EC/Beta+', half_life_sec: 4.618e6, half_life_text: '53.22 d' },
  { Z: 4, N: 5, symbol: 'Be', mass_number: 9, stability: 'Stable', half_life_sec: null },
  { Z: 4, N: 6, symbol: 'Be', mass_number: 10, stability: 'Beta-', half_life_sec: 4.858e13, half_life_text: '1.51 My' },
  // B (Z=5)
  { Z: 5, N: 5, symbol: 'B', mass_number: 10, stability: 'Stable', half_life_sec: null },
  { Z: 5, N: 6, symbol: 'B', mass_number: 11, stability: 'Stable', half_life_sec: null },
  { Z: 5, N: 7, symbol: 'B', mass_number: 12, stability: 'Beta-', half_life_sec: 0.0202, half_life_text: '20.2 ms' },
  { Z: 5, N: 3, symbol: 'B', mass_number: 8, stability: 'EC/Beta+', half_life_sec: 0.770, half_life_text: '770 ms' },
  // C (Z=6)
  { Z: 6, N: 5, symbol: 'C', mass_number: 11, stability: 'EC/Beta+', half_life_sec: 1222.2, half_life_text: '20.37 min' },
  { Z: 6, N: 6, symbol: 'C', mass_number: 12, stability: 'Stable', half_life_sec: null },
  { Z: 6, N: 7, symbol: 'C', mass_number: 13, stability: 'Stable', half_life_sec: null },
  { Z: 6, N: 8, symbol: 'C', mass_number: 14, stability: 'Beta-', half_life_sec: 1.806e11, half_life_text: '5730 y' },
  // N (Z=7)
  { Z: 7, N: 6, symbol: 'N', mass_number: 13, stability: 'EC/Beta+', half_life_sec: 597.9, half_life_text: '9.965 min' },
  { Z: 7, N: 7, symbol: 'N', mass_number: 14, stability: 'Stable', half_life_sec: null },
  { Z: 7, N: 8, symbol: 'N', mass_number: 15, stability: 'Stable', half_life_sec: null },
  { Z: 7, N: 9, symbol: 'N', mass_number: 16, stability: 'Beta-', half_life_sec: 7.13, half_life_text: '7.13 s' },
  // O (Z=8)
  { Z: 8, N: 7, symbol: 'O', mass_number: 15, stability: 'EC/Beta+', half_life_sec: 122.24, half_life_text: '122.24 s' },
  { Z: 8, N: 8, symbol: 'O', mass_number: 16, stability: 'Stable', half_life_sec: null },
  { Z: 8, N: 9, symbol: 'O', mass_number: 17, stability: 'Stable', half_life_sec: null },
  { Z: 8, N: 10, symbol: 'O', mass_number: 18, stability: 'Stable', half_life_sec: null },
  { Z: 8, N: 11, symbol: 'O', mass_number: 19, stability: 'Beta-', half_life_sec: 26.91, half_life_text: '26.91 s' },
  // F (Z=9)
  { Z: 9, N: 9, symbol: 'F', mass_number: 18, stability: 'EC/Beta+', half_life_sec: 6586.2, half_life_text: '109.77 min' },
  { Z: 9, N: 10, symbol: 'F', mass_number: 19, stability: 'Stable', half_life_sec: null },
  { Z: 9, N: 11, symbol: 'F', mass_number: 20, stability: 'Beta-', half_life_sec: 11.0, half_life_text: '11.0 s' },
  // Ne (Z=10)
  { Z: 10, N: 9, symbol: 'Ne', mass_number: 19, stability: 'EC/Beta+', half_life_sec: 17.22, half_life_text: '17.22 s' },
  { Z: 10, N: 10, symbol: 'Ne', mass_number: 20, stability: 'Stable', half_life_sec: null },
  { Z: 10, N: 11, symbol: 'Ne', mass_number: 21, stability: 'Stable', half_life_sec: null },
  { Z: 10, N: 12, symbol: 'Ne', mass_number: 22, stability: 'Stable', half_life_sec: null },
  // Na (Z=11)
  { Z: 11, N: 11, symbol: 'Na', mass_number: 22, stability: 'EC/Beta+', half_life_sec: 8.219e7, half_life_text: '2.605 y' },
  { Z: 11, N: 12, symbol: 'Na', mass_number: 23, stability: 'Stable', half_life_sec: null },
  { Z: 11, N: 13, symbol: 'Na', mass_number: 24, stability: 'Beta-', half_life_sec: 53892, half_life_text: '14.97 h' },
  // Mg (Z=12)
  { Z: 12, N: 11, symbol: 'Mg', mass_number: 23, stability: 'EC/Beta+', half_life_sec: 11.317, half_life_text: '11.317 s' },
  { Z: 12, N: 12, symbol: 'Mg', mass_number: 24, stability: 'Stable', half_life_sec: null },
  { Z: 12, N: 13, symbol: 'Mg', mass_number: 25, stability: 'Stable', half_life_sec: null },
  { Z: 12, N: 14, symbol: 'Mg', mass_number: 26, stability: 'Stable', half_life_sec: null },
  // Al (Z=13)
  { Z: 13, N: 13, symbol: 'Al', mass_number: 26, stability: 'EC/Beta+', half_life_sec: 2.29e13, half_life_text: '7.2e5 y' },
  { Z: 13, N: 14, symbol: 'Al', mass_number: 27, stability: 'Stable', half_life_sec: null },
  { Z: 13, N: 15, symbol: 'Al', mass_number: 28, stability: 'Beta-', half_life_sec: 134.4, half_life_text: '2.24 min' },
  // Si (Z=14)
  { Z: 14, N: 14, symbol: 'Si', mass_number: 28, stability: 'Stable', half_life_sec: null },
  { Z: 14, N: 15, symbol: 'Si', mass_number: 29, stability: 'Stable', half_life_sec: null },
  { Z: 14, N: 16, symbol: 'Si', mass_number: 30, stability: 'Stable', half_life_sec: null },
  { Z: 14, N: 18, symbol: 'Si', mass_number: 32, stability: 'Beta-', half_life_sec: 4.418e9, half_life_text: '140 y' },
  // P (Z=15)
  { Z: 15, N: 15, symbol: 'P', mass_number: 30, stability: 'EC/Beta+', half_life_sec: 150, half_life_text: '2.5 min' },
  { Z: 15, N: 16, symbol: 'P', mass_number: 31, stability: 'Stable', half_life_sec: null },
  { Z: 15, N: 17, symbol: 'P', mass_number: 32, stability: 'Beta-', half_life_sec: 1.236e6, half_life_text: '14.29 d' },
  // S (Z=16)
  { Z: 16, N: 16, symbol: 'S', mass_number: 32, stability: 'Stable', half_life_sec: null },
  { Z: 16, N: 17, symbol: 'S', mass_number: 33, stability: 'Stable', half_life_sec: null },
  { Z: 16, N: 18, symbol: 'S', mass_number: 34, stability: 'Stable', half_life_sec: null },
  { Z: 16, N: 19, symbol: 'S', mass_number: 35, stability: 'Beta-', half_life_sec: 7.55e6, half_life_text: '87.4 d' },
  { Z: 16, N: 20, symbol: 'S', mass_number: 36, stability: 'Stable', half_life_sec: null },
  // Cl (Z=17)
  { Z: 17, N: 18, symbol: 'Cl', mass_number: 35, stability: 'Stable', half_life_sec: null },
  { Z: 17, N: 19, symbol: 'Cl', mass_number: 36, stability: 'Beta-', half_life_sec: 9.5e12, half_life_text: '3.01e5 y' },
  { Z: 17, N: 20, symbol: 'Cl', mass_number: 37, stability: 'Stable', half_life_sec: null },
  // Ar (Z=18)
  { Z: 18, N: 18, symbol: 'Ar', mass_number: 36, stability: 'Stable', half_life_sec: null },
  { Z: 18, N: 20, symbol: 'Ar', mass_number: 38, stability: 'Stable', half_life_sec: null },
  { Z: 18, N: 21, symbol: 'Ar', mass_number: 39, stability: 'Beta-', half_life_sec: 8.48e9, half_life_text: '269 y' },
  { Z: 18, N: 22, symbol: 'Ar', mass_number: 40, stability: 'Stable', half_life_sec: null },
  // K (Z=19)
  { Z: 19, N: 20, symbol: 'K', mass_number: 39, stability: 'Stable', half_life_sec: null },
  { Z: 19, N: 21, symbol: 'K', mass_number: 40, stability: 'Beta-', half_life_sec: 3.94e16, half_life_text: '1.25e9 y' },
  { Z: 19, N: 22, symbol: 'K', mass_number: 41, stability: 'Stable', half_life_sec: null },
  // Ca (Z=20)
  { Z: 20, N: 20, symbol: 'Ca', mass_number: 40, stability: 'Stable', half_life_sec: null },
  { Z: 20, N: 21, symbol: 'Ca', mass_number: 41, stability: 'EC/Beta+', half_life_sec: 3.25e12, half_life_text: '1.03e5 y' },
  { Z: 20, N: 22, symbol: 'Ca', mass_number: 42, stability: 'Stable', half_life_sec: null },
  { Z: 20, N: 23, symbol: 'Ca', mass_number: 43, stability: 'Stable', half_life_sec: null },
  { Z: 20, N: 24, symbol: 'Ca', mass_number: 44, stability: 'Stable', half_life_sec: null },
  { Z: 20, N: 25, symbol: 'Ca', mass_number: 45, stability: 'Beta-', half_life_sec: 1.41e7, half_life_text: '163 d' },
  { Z: 20, N: 26, symbol: 'Ca', mass_number: 46, stability: 'Stable', half_life_sec: null },
  { Z: 20, N: 28, symbol: 'Ca', mass_number: 48, stability: 'Stable', half_life_sec: null },
];
