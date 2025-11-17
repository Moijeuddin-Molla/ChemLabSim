
export const BINDING_ENERGY_CONSTANTS = {
  PROTON_MASS_U: 1.00727647,
  NEUTRON_MASS_U: 1.00866492,
  U_TO_MEV: 931.494102, // MeV/c^2
};

export interface IsotopeBindingData {
  id: string;
  name: string;
  elementName: string;
  symbol: string;
  Z: number; // Protons
  N: number; // Neutrons
  A: number; // Mass Number
  actualMassU: number;
}

export const ISOTOPE_DATA: IsotopeBindingData[] = [
  // Light Elements
  { id: 'H-1', name: 'Protium', elementName: 'Hydrogen', symbol: '¹H', Z: 1, N: 0, A: 1, actualMassU: 1.007825032 },
  { id: 'H-2', name: 'Deuterium', elementName: 'Hydrogen', symbol: '²H', Z: 1, N: 1, A: 2, actualMassU: 2.01410178 },
  { id: 'H-3', name: 'Tritium', elementName: 'Hydrogen', symbol: '³H', Z: 1, N: 2, A: 3, actualMassU: 3.01604928 },
  { id: 'He-3', name: 'Helium-3', elementName: 'Helium', symbol: '³He', Z: 2, N: 1, A: 3, actualMassU: 3.01602932 },
  { id: 'He-4', name: 'Helium-4', elementName: 'Helium', symbol: '⁴He', Z: 2, N: 2, A: 4, actualMassU: 4.00260325 },
  { id: 'Li-6', name: 'Lithium-6', elementName: 'Lithium', symbol: '⁶Li', Z: 3, N: 3, A: 6, actualMassU: 6.01512289 },
  { id: 'Li-7', name: 'Lithium-7', elementName: 'Lithium', symbol: '⁷Li', Z: 3, N: 4, A: 7, actualMassU: 7.01600344 },
  { id: 'Be-9', name: 'Beryllium-9', elementName: 'Beryllium', symbol: '⁹Be', Z: 4, N: 5, A: 9, actualMassU: 9.01218307 },
  { id: 'B-10', name: 'Boron-10', elementName: 'Boron', symbol: '¹⁰B', Z: 5, N: 5, A: 10, actualMassU: 10.0129370 },
  { id: 'B-11', name: 'Boron-11', elementName: 'Boron', symbol: '¹¹B', Z: 5, N: 6, A: 11, actualMassU: 11.0093054 },
  { id: 'C-12', name: 'Carbon-12', elementName: 'Carbon', symbol: '¹²C', Z: 6, N: 6, A: 12, actualMassU: 12.0000000 },
  { id: 'C-13', name: 'Carbon-13', elementName: 'Carbon', symbol: '¹³C', Z: 6, N: 7, A: 13, actualMassU: 13.00335484 },
  { id: 'C-14', name: 'Carbon-14', elementName: 'Carbon', symbol: '¹⁴C', Z: 6, N: 8, A: 14, actualMassU: 14.00324199 },
  { id: 'N-14', name: 'Nitrogen-14', elementName: 'Nitrogen', symbol: '¹⁴N', Z: 7, N: 7, A: 14, actualMassU: 14.00307400 },
  { id: 'N-15', name: 'Nitrogen-15', elementName: 'Nitrogen', symbol: '¹⁵N', Z: 7, N: 8, A: 15, actualMassU: 15.00010889 },
  { id: 'O-16', name: 'Oxygen-16', elementName: 'Oxygen', symbol: '¹⁶O', Z: 8, N: 8, A: 16, actualMassU: 15.99491462 },
  { id: 'O-17', name: 'Oxygen-17', elementName: 'Oxygen', symbol: '¹⁷O', Z: 8, N: 9, A: 17, actualMassU: 16.99913176 },
  { id: 'O-18', name: 'Oxygen-18', elementName: 'Oxygen', symbol: '¹⁸O', Z: 8, N: 10, A: 18, actualMassU: 17.99915961 },
  { id: 'F-19', name: 'Fluorine-19', elementName: 'Fluorine', symbol: '¹⁹F', Z: 9, N: 10, A: 19, actualMassU: 18.99840316},
  { id: 'Ne-20', name: 'Neon-20', elementName: 'Neon', symbol: '²⁰Ne', Z: 10, N: 10, A: 20, actualMassU: 19.99244018},

  // Mid-weight Elements
  { id: 'Na-23', name: 'Sodium-23', elementName: 'Sodium', symbol: '²³Na', Z: 11, N: 12, A: 23, actualMassU: 22.98976928 },
  { id: 'Mg-24', name: 'Magnesium-24', elementName: 'Magnesium', symbol: '²⁴Mg', Z: 12, N: 12, A: 24, actualMassU: 23.98504170 },
  { id: 'Al-27', name: 'Aluminum-27', elementName: 'Aluminum', symbol: '²⁷Al', Z: 13, N: 14, A: 27, actualMassU: 26.98153853 },
  { id: 'Si-28', name: 'Silicon-28', elementName: 'Silicon', symbol: '²⁸Si', Z: 14, N: 14, A: 28, actualMassU: 27.97692653 },
  { id: 'P-31', name: 'Phosphorus-31', elementName: 'Phosphorus', symbol: '³¹P', Z: 15, N: 16, A: 31, actualMassU: 30.97376199 },
  { id: 'S-32', name: 'Sulfur-32', elementName: 'Sulfur', symbol: '³²S', Z: 16, N: 16, A: 32, actualMassU: 31.97207117 },
  { id: 'Cl-35', name: 'Chlorine-35', elementName: 'Chlorine', symbol: '³⁵Cl', Z: 17, N: 18, A: 35, actualMassU: 34.96885268 },
  { id: 'Ar-40', name: 'Argon-40', elementName: 'Argon', symbol: '⁴⁰Ar', Z: 18, N: 22, A: 40, actualMassU: 39.96238312 },
  { id: 'K-39', name: 'Potassium-39', elementName: 'Potassium', symbol: '³⁹K', Z: 19, N: 20, A: 39, actualMassU: 38.96370649 },
  { id: 'K-40', name: 'Potassium-40', elementName: 'Potassium', symbol: '⁴⁰K', Z: 19, N: 21, A: 40, actualMassU: 39.96399817 },
  { id: 'Ca-40', name: 'Calcium-40', elementName: 'Calcium', symbol: '⁴⁰Ca', Z: 20, N: 20, A: 40, actualMassU: 39.9625909 },
  { id: 'Sc-45', name: 'Scandium-45', elementName: 'Scandium', symbol: '⁴⁵Sc', Z: 21, N: 24, A: 45, actualMassU: 44.955908 },
  { id: 'Ti-48', name: 'Titanium-48', elementName: 'Titanium', symbol: '⁴⁸Ti', Z: 22, N: 26, A: 48, actualMassU: 47.94794198 },
  { id: 'V-51', name: 'Vanadium-51', elementName: 'Vanadium', symbol: '⁵¹V', Z: 23, N: 28, A: 51, actualMassU: 50.9439572 },
  { id: 'Cr-52', name: 'Chromium-52', elementName: 'Chromium', symbol: '⁵²Cr', Z: 24, N: 28, A: 52, actualMassU: 51.9405062 },
  { id: 'Mn-55', name: 'Manganese-55', elementName: 'Manganese', symbol: '⁵⁵Mn', Z: 25, N: 30, A: 55, actualMassU: 54.9380439 },
  { id: 'Fe-54', name: 'Iron-54', elementName: 'Iron', symbol: '⁵⁴Fe', Z: 26, N: 28, A: 54, actualMassU: 53.9396090 },
  { id: 'Fe-56', name: 'Iron-56', elementName: 'Iron', symbol: '⁵⁶Fe', Z: 26, N: 30, A: 56, actualMassU: 55.9349363 },
  { id: 'Fe-57', name: 'Iron-57', elementName: 'Iron', symbol: '⁵⁷Fe', Z: 26, N: 31, A: 57, actualMassU: 56.9353928 },
  { id: 'Co-59', name: 'Cobalt-59', elementName: 'Cobalt', symbol: '⁵⁹Co', Z: 27, N: 32, A: 59, actualMassU: 58.9331941 },
  { id: 'Ni-58', name: 'Nickel-58', elementName: 'Nickel', symbol: '⁵⁸Ni', Z: 28, N: 30, A: 58, actualMassU: 57.9353421 },
  { id: 'Ni-62', name: 'Nickel-62', elementName: 'Nickel', symbol: '⁶²Ni', Z: 28, N: 34, A: 62, actualMassU: 61.9283459 },
  { id: 'Cu-63', name: 'Copper-63', elementName: 'Copper', symbol: '⁶³Cu', Z: 29, N: 34, A: 63, actualMassU: 62.9295977 },
  { id: 'Zn-64', name: 'Zinc-64', elementName: 'Zinc', symbol: '⁶⁴Zn', Z: 30, N: 34, A: 64, actualMassU: 63.9291419 },
  { id: 'Ga-69', name: 'Gallium-69', elementName: 'Gallium', symbol: '⁶⁹Ga', Z: 31, N: 38, A: 69, actualMassU: 68.925574 },
  { id: 'Ge-74', name: 'Germanium-74', elementName: 'Germanium', symbol: '⁷⁴Ge', Z: 32, N: 42, A: 74, actualMassU: 73.9211777 },
  { id: 'As-75', name: 'Arsenic-75', elementName: 'Arsenic', symbol: '⁷⁵As', Z: 33, N: 42, A: 75, actualMassU: 74.9215942 },
  { id: 'Br-79', name: 'Bromine-79', elementName: 'Bromine', symbol: '⁷⁹Br', Z: 35, N: 44, A: 79, actualMassU: 78.9183379 },
  { id: 'Kr-84', name: 'Krypton-84', elementName: 'Krypton', symbol: '⁸⁴Kr', Z: 36, N: 48, A: 84, actualMassU: 83.9114977 },
  { id: 'Sr-88', name: 'Strontium-88', elementName: 'Strontium', symbol: '⁸⁸Sr', Z: 38, N: 50, A: 88, actualMassU: 87.9056125 },
  { id: 'Sr-90', name: 'Strontium-90', elementName: 'Strontium', symbol: '⁹⁰Sr', Z: 38, N: 52, A: 90, actualMassU: 89.907738 },
  { id: 'Zr-90', name: 'Zirconium-90', elementName: 'Zirconium', symbol: '⁹⁰Zr', Z: 40, N: 50, A: 90, actualMassU: 89.9047026 },
  { id: 'Mo-98', name: 'Molybdenum-98', elementName: 'Molybdenum', symbol: '⁹⁸Mo', Z: 42, N: 56, A: 98, actualMassU: 97.9054048 },
  { id: 'Ru-102', name: 'Ruthenium-102', elementName: 'Ruthenium', symbol: '¹⁰²Ru', Z: 44, N: 58, A: 102, actualMassU: 101.9043482 },
  { id: 'Pd-106', name: 'Palladium-106', elementName: 'Palladium', symbol: '¹⁰⁶Pd', Z: 46, N: 60, A: 106, actualMassU: 105.903483 },
  { id: 'Ag-107', name: 'Silver-107', elementName: 'Silver', symbol: '¹⁰⁷Ag', Z: 47, N: 60, A: 107, actualMassU: 106.905092 },
  { id: 'Cd-114', name: 'Cadmium-114', elementName: 'Cadmium', symbol: '¹¹⁴Cd', Z: 48, N: 66, A: 114, actualMassU: 113.9033612 },
  { id: 'Sn-120', name: 'Tin-120', elementName: 'Tin', symbol: '¹²⁰Sn', Z: 50, N: 70, A: 120, actualMassU: 119.902201 },
  { id: 'I-127', name: 'Iodine-127', elementName: 'Iodine', symbol: '¹²⁷I', Z: 53, N: 74, A: 127, actualMassU: 126.904473 },
  { id: 'I-131', name: 'Iodine-131', elementName: 'Iodine', symbol: '¹³¹I', Z: 53, N: 78, A: 131, actualMassU: 130.9061246 },
  { id: 'Xe-132', name: 'Xenon-132', elementName: 'Xenon', symbol: '¹³²Xe', Z: 54, N: 78, A: 132, actualMassU: 131.9041551 },
  { id: 'Cs-133', name: 'Cesium-133', elementName: 'Cesium', symbol: '¹³³Cs', Z: 55, N: 78, A: 133, actualMassU: 132.9054519 },
  { id: 'Cs-137', name: 'Cesium-137', elementName: 'Cesium', symbol: '¹³⁷Cs', Z: 55, N: 82, A: 137, actualMassU: 136.9070895 },
  { id: 'Ba-138', name: 'Barium-138', elementName: 'Barium', symbol: '¹³⁸Ba', Z: 56, N: 82, A: 138, actualMassU: 137.9052472 },

  // Heavy Elements
  { id: 'W-184', name: 'Tungsten-184', elementName: 'Tungsten', symbol: '¹⁸⁴W', Z: 74, N: 110, A: 184, actualMassU: 183.950931 },
  { id: 'Pt-195', name: 'Platinum-195', elementName: 'Platinum', symbol: '¹⁹⁵Pt', Z: 78, N: 117, A: 195, actualMassU: 194.964791 },
  { id: 'Au-197', name: 'Gold-197', elementName: 'Gold', symbol: '¹⁹⁷Au', Z: 79, N: 118, A: 197, actualMassU: 196.966570 },
  { id: 'Hg-202', name: 'Mercury-202', elementName: 'Mercury', symbol: '²⁰²Hg', Z: 80, N: 122, A: 202, actualMassU: 201.970643 },
  { id: 'Pb-206', name: 'Lead-206', elementName: 'Lead', symbol: '²⁰⁶Pb', Z: 82, N: 124, A: 206, actualMassU: 205.974465 },
  { id: 'Pb-207', name: 'Lead-207', elementName: 'Lead', symbol: '²⁰⁷Pb', Z: 82, N: 125, A: 207, actualMassU: 206.975897 },
  { id: 'Pb-208', name: 'Lead-208', elementName: 'Lead', symbol: '²⁰⁸Pb', Z: 82, N: 126, A: 208, actualMassU: 207.976652 },
  { id: 'Bi-209', name: 'Bismuth-209', elementName: 'Bismuth', symbol: '²⁰⁹Bi', Z: 83, N: 126, A: 209, actualMassU: 208.980399 },
  { id: 'Th-232', name: 'Thorium-232', elementName: 'Thorium', symbol: '²³²Th', Z: 90, N: 142, A: 232, actualMassU: 232.038055 },
  { id: 'U-233', name: 'Uranium-233', elementName: 'Uranium', symbol: '²³³U', Z: 92, N: 141, A: 233, actualMassU: 233.039635 },
  { id: 'U-235', name: 'Uranium-235', elementName: 'Uranium', symbol: '²³⁵U', Z: 92, N: 143, A: 235, actualMassU: 235.043930 },
  { id: 'U-238', name: 'Uranium-238', elementName: 'Uranium', symbol: '²³⁸U', Z: 92, N: 146, A: 238, actualMassU: 238.050788 },
  { id: 'Np-237', name: 'Neptunium-237', elementName: 'Neptunium', symbol: '²³⁷Np', Z: 93, N: 144, A: 237, actualMassU: 237.048173 },
  { id: 'Pu-239', name: 'Plutonium-239', elementName: 'Plutonium', symbol: '²³⁹Pu', Z: 94, N: 145, A: 239, actualMassU: 239.052163 },
  { id: 'Pu-244', name: 'Plutonium-244', elementName: 'Plutonium', symbol: '²⁴⁴Pu', Z: 94, N: 150, A: 244, actualMassU: 244.064104 },
  { id: 'Am-241', name: 'Americium-241', elementName: 'Americium', symbol: '²⁴¹Am', Z: 95, N: 146, A: 241, actualMassU: 241.056829 },
];


// Data points for the binding energy curve plot: [Mass Number, BE per Nucleon in MeV]
export const BINDING_CURVE_DATA: [number, number][] = [
  [1, 0],
  [2, 1.112],
  [3, 2.573],
  [4, 7.074],
  [6, 5.332],
  [12, 7.680],
  [16, 7.976],
  [20, 8.032],
  [28, 8.448],
  [40, 8.551],
  [56, 8.790], // Peak (Iron-56)
  [62, 8.795], // True peak is Ni-62, but Fe-56 is famously cited
  [84, 8.714],
  [100, 8.611],
  [120, 8.517],
  [140, 8.384],
  [160, 8.243],
  [180, 8.089],
  [208, 7.867],
  [235, 7.591],
  [238, 7.570],
];
