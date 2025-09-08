export interface Activity {
  id: string;
  category: string;
  amount: number;
  unit: string;
  co2Impact: number;
  date: string;
  time: string;
  itemName?: string; // Optional: specific item name for better tracking
  confidence?: number; // Optional: AI parsing confidence (0-1)
}

export interface ParsedActivity {
  originalText: string;
  category: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
    co2Impact: number;
    confidence: number; // 0-1 scale
  }[];
  totalCO2Impact: number;
  confidence: number;
}

export interface EmissionFactor {
  name: string;
  category: string;
  subcategory?: string;
  value: number; // kg CO2e per unit
  unit: string;
  source: string;
}