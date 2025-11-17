export enum View {
  HOME = 'HOME',
  CHEMICAL_SHELF = 'CHEMICAL_SHELF',
  LAB_BENCH = 'LAB_BENCH',
  COMPOUND_EXPLORER = 'COMPOUND_EXPLORER',
  NUB_LAB = 'NUB_LAB',
  NUCLIDE_CHART = 'NUCLIDE_CHART',
  DECAY_CHAIN_VISUALIZER = 'DECAY_CHAIN_VISUALIZER',
  HALF_LIFE_SIMULATOR = 'HALF_LIFE_SIMULATOR',
  RADIATION_SHIELDING_LAB = 'RADIATION_SHIELDING_LAB',
  BINDING_ENERGY_CALCULATOR = 'BINDING_ENERGY_CALCULATOR',
}

export interface Nuclide {
  Z: number; // Proton number
  N: number; // Neutron number
  symbol: string;
  mass_number: number;
  stability: 'Stable' | 'Beta-' | 'Alpha' | 'EC/Beta+' | 'p' | 'n'; // Decay mode
  half_life_sec: number | null;
  half_life_text?: string;
}


export interface Chemical {
  id: string;
  name: string;
  formula: string;
  state: 's' | 'l' | 'g' | 'aq';
  color: string;
  molarMass: number;
  atomicNumber?: number;
  meltingPoint?: number; // °C
  boilingPoint?: number; // °C
  
  // New detailed properties for elements
  category?: string;
  group?: number;
  period?: number;
  block?: 's' | 'p' | 'd' | 'f';
  electronConfiguration?: string;
  valenceElectrons?: number;
  electronegativityPauling?: number;
  atomicRadius?: number; // pm
  ionizationEnergy?: number; // kJ/mol
  electronAffinity?: number; // kJ/mol
  densityGPerCm3?: number;
  crystalStructure?: string | null;
  commonOxidationStates?: number[];
  reactivity?: string;
  conductivity?: {
    thermal?: number; // W/(m·K)
    electrical?: number; // S/m
  } | null;
  safety?: {
    hazardClass?: string;
    ghsPictograms?: string[];
    handlingNote?: string;
    storage?: string;
  } | null;
  uses?: string[];
  discovery?: {
    year?: number;
    discoverer?: string;
  } | null;
}

export interface BeakerEntry {
  chemicalId: string;
  quantity: number; // Moles
  unit: 'mol' | 'g';
}

export interface Reaction {
  id:string;
  name?: string;
  reactants: { chemicalId: string; coefficient: number }[];
  products: { chemicalId: string; coefficient: number }[];
  equation: string;
  description: string;
  warning?: string;
  conditions?: {
    temp?: { min: number; max: number };
    pressure?: { min: number; max: number };
  };
  kinetics?: {
    baseDuration: number; // ms at 25°C
    tempFactor: number; // Multiplier for rate increase
  };
}

export interface SimulationResult {
  reaction: Reaction;
  products: BeakerEntry[];
  leftovers: BeakerEntry[];
  gasesProduced: BeakerEntry[];
  limitingReagentId: string | null;
  notes: string[];
}

export interface GasProperties {
    totalMoles: number;
    volumeL: number;
    temperature: number;
    pressure: number;
    gases: BeakerEntry[];
}


export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
}

export interface DecayStep {
  from: string; // e.g., '²³⁸U'
  to: string | null; // null for the final stable element
  type: 'alpha' | 'beta-' | 'beta+' | 'EC' | 'gamma' | 'stable';
  halfLife: string;
}

export interface DecayChain {
  id: string;
  name: string;
  start: string;
  end: string;
  description?: string;
  steps: DecayStep[];
}