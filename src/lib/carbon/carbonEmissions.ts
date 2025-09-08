// Carbon Emissions Database
// All values are in kg CO2e (Carbon Dioxide Equivalent)

export interface EmissionFactor {
  name: string;
  category: string;
  subcategory?: string;
  value: number; // kg CO2e per unit
  unit: string;
  source: string;
}

// Food emission factors (kg CO2e per kg of food unless otherwise specified)
export const foodEmissions: EmissionFactor[] = [
  // Meat & Protein
  { name: "beef", category: "food", subcategory: "meat", value: 60.0, unit: "kg", source: "FAO 2019" },
  { name: "lamb", category: "food", subcategory: "meat", value: 24.0, unit: "kg", source: "FAO 2019" },
  { name: "pork", category: "food", subcategory: "meat", value: 12.1, unit: "kg", source: "FAO 2019" },
  { name: "chicken", category: "food", subcategory: "meat", value: 6.9, unit: "kg", source: "FAO 2019" },
  { name: "turkey", category: "food", subcategory: "meat", value: 10.9, unit: "kg", source: "FAO 2019" },
  { name: "fish", category: "food", subcategory: "seafood", value: 6.1, unit: "kg", source: "FAO 2019" },
  { name: "salmon", category: "food", subcategory: "seafood", value: 11.9, unit: "kg", source: "FAO 2019" },
  { name: "tuna", category: "food", subcategory: "seafood", value: 6.1, unit: "kg", source: "FAO 2019" },
  { name: "shrimp", category: "food", subcategory: "seafood", value: 18.2, unit: "kg", source: "FAO 2019" },
  { name: "eggs", category: "food", subcategory: "protein", value: 4.2, unit: "kg", source: "FAO 2019" },
  
  // Dairy
  { name: "milk", category: "food", subcategory: "dairy", value: 3.2, unit: "liter", source: "FAO 2019" },
  { name: "cheese", category: "food", subcategory: "dairy", value: 13.5, unit: "kg", source: "FAO 2019" },
  { name: "butter", category: "food", subcategory: "dairy", value: 23.8, unit: "kg", source: "FAO 2019" },
  { name: "yogurt", category: "food", subcategory: "dairy", value: 2.2, unit: "kg", source: "FAO 2019" },
  
  // Grains & Starches
  { name: "rice", category: "food", subcategory: "grains", value: 4.0, unit: "kg", source: "FAO 2019" },
  { name: "wheat", category: "food", subcategory: "grains", value: 1.4, unit: "kg", source: "FAO 2019" },
  { name: "bread", category: "food", subcategory: "grains", value: 1.7, unit: "kg", source: "FAO 2019" },
  { name: "pasta", category: "food", subcategory: "grains", value: 1.1, unit: "kg", source: "FAO 2019" },
  { name: "oats", category: "food", subcategory: "grains", value: 2.5, unit: "kg", source: "FAO 2019" },
  { name: "potatoes", category: "food", subcategory: "vegetables", value: 0.3, unit: "kg", source: "FAO 2019" },
  
  // Vegetables
  { name: "tomatoes", category: "food", subcategory: "vegetables", value: 2.1, unit: "kg", source: "FAO 2019" },
  { name: "lettuce", category: "food", subcategory: "vegetables", value: 0.7, unit: "kg", source: "FAO 2019" },
  { name: "onions", category: "food", subcategory: "vegetables", value: 0.5, unit: "kg", source: "FAO 2019" },
  { name: "carrots", category: "food", subcategory: "vegetables", value: 0.4, unit: "kg", source: "FAO 2019" },
  { name: "broccoli", category: "food", subcategory: "vegetables", value: 0.4, unit: "kg", source: "FAO 2019" },
  { name: "spinach", category: "food", subcategory: "vegetables", value: 0.4, unit: "kg", source: "FAO 2019" },
  
  // Fruits
  { name: "apples", category: "food", subcategory: "fruits", value: 0.4, unit: "kg", source: "FAO 2019" },
  { name: "bananas", category: "food", subcategory: "fruits", value: 0.7, unit: "kg", source: "FAO 2019" },
  { name: "oranges", category: "food", subcategory: "fruits", value: 0.4, unit: "kg", source: "FAO 2019" },
  { name: "avocados", category: "food", subcategory: "fruits", value: 2.3, unit: "kg", source: "FAO 2019" },
  
  // Nuts & Legumes
  { name: "almonds", category: "food", subcategory: "nuts", value: 8.8, unit: "kg", source: "FAO 2019" },
  { name: "peanuts", category: "food", subcategory: "nuts", value: 3.2, unit: "kg", source: "FAO 2019" },
  { name: "beans", category: "food", subcategory: "legumes", value: 1.4, unit: "kg", source: "FAO 2019" },
  { name: "lentils", category: "food", subcategory: "legumes", value: 0.9, unit: "kg", source: "FAO 2019" },
  { name: "tofu", category: "food", subcategory: "protein", value: 3.0, unit: "kg", source: "FAO 2019" },
  
  // Beverages
  { name: "coffee", category: "food", subcategory: "beverages", value: 15.2, unit: "kg", source: "FAO 2019" },
  { name: "tea", category: "food", subcategory: "beverages", value: 6.3, unit: "kg", source: "FAO 2019" },
  { name: "wine", category: "food", subcategory: "alcohol", value: 1.8, unit: "liter", source: "FAO 2019" },
  { name: "beer", category: "food", subcategory: "alcohol", value: 0.9, unit: "liter", source: "FAO 2019" },
];

// Transportation emission factors
export const transportEmissions: EmissionFactor[] = [
  // Personal Vehicles (kg CO2e per mile)
  { name: "car_gasoline", category: "transport", subcategory: "personal", value: 0.4, unit: "mile", source: "EPA 2023" },
  { name: "car_diesel", category: "transport", subcategory: "personal", value: 0.35, unit: "mile", source: "EPA 2023" },
  { name: "car_hybrid", category: "transport", subcategory: "personal", value: 0.25, unit: "mile", source: "EPA 2023" },
  { name: "car_electric", category: "transport", subcategory: "personal", value: 0.15, unit: "mile", source: "EPA 2023" },
  { name: "suv_gasoline", category: "transport", subcategory: "personal", value: 0.55, unit: "mile", source: "EPA 2023" },
  { name: "truck_gasoline", category: "transport", subcategory: "personal", value: 0.65, unit: "mile", source: "EPA 2023" },
  { name: "motorcycle", category: "transport", subcategory: "personal", value: 0.25, unit: "mile", source: "EPA 2023" },
  
  // Public Transport (kg CO2e per mile per passenger)
  { name: "bus", category: "transport", subcategory: "public", value: 0.18, unit: "mile", source: "EPA 2023" },
  { name: "train", category: "transport", subcategory: "public", value: 0.12, unit: "mile", source: "EPA 2023" },
  { name: "subway", category: "transport", subcategory: "public", value: 0.08, unit: "mile", source: "EPA 2023" },
  { name: "tram", category: "transport", subcategory: "public", value: 0.09, unit: "mile", source: "EPA 2023" },
  
  // Air Travel (kg CO2e per mile per passenger)
  { name: "flight_domestic", category: "transport", subcategory: "air", value: 0.24, unit: "mile", source: "DEFRA 2023" },
  { name: "flight_international", category: "transport", subcategory: "air", value: 0.19, unit: "mile", source: "DEFRA 2023" },
  
  // Active Transport
  { name: "walking", category: "transport", subcategory: "active", value: 0.0, unit: "mile", source: "N/A" },
  { name: "cycling", category: "transport", subcategory: "active", value: 0.0, unit: "mile", source: "N/A" },
  { name: "escooter", category: "transport", subcategory: "active", value: 0.02, unit: "mile", source: "EPA 2023" },
];

// Energy emission factors
export const energyEmissions: EmissionFactor[] = [
  // Electricity (kg CO2e per kWh - varies by grid mix)
  { name: "electricity_us_avg", category: "energy", subcategory: "electricity", value: 0.386, unit: "kWh", source: "EPA eGRID 2023" },
  { name: "electricity_renewable", category: "energy", subcategory: "electricity", value: 0.05, unit: "kWh", source: "EPA eGRID 2023" },
  { name: "electricity_coal", category: "energy", subcategory: "electricity", value: 0.82, unit: "kWh", source: "EPA eGRID 2023" },
  { name: "electricity_natural_gas", category: "energy", subcategory: "electricity", value: 0.35, unit: "kWh", source: "EPA eGRID 2023" },
  
  // Heating (kg CO2e per unit)
  { name: "natural_gas", category: "energy", subcategory: "heating", value: 2.04, unit: "therm", source: "EPA 2023" },
  { name: "heating_oil", category: "energy", subcategory: "heating", value: 10.15, unit: "gallon", source: "EPA 2023" },
  { name: "propane", category: "energy", subcategory: "heating", value: 5.75, unit: "gallon", source: "EPA 2023" },
  { name: "wood", category: "energy", subcategory: "heating", value: 1.8, unit: "kg", source: "EPA 2023" },
];

// Shopping/Consumer goods emission factors
export const shoppingEmissions: EmissionFactor[] = [
  // Clothing (kg CO2e per item)
  { name: "t_shirt", category: "shopping", subcategory: "clothing", value: 8.5, unit: "item", source: "Ellen MacArthur Foundation 2021" },
  { name: "jeans", category: "shopping", subcategory: "clothing", value: 33.4, unit: "item", source: "Ellen MacArthur Foundation 2021" },
  { name: "dress", category: "shopping", subcategory: "clothing", value: 47.0, unit: "item", source: "Ellen MacArthur Foundation 2021" },
  { name: "shoes", category: "shopping", subcategory: "clothing", value: 14.0, unit: "pair", source: "Ellen MacArthur Foundation 2021" },
  { name: "jacket", category: "shopping", subcategory: "clothing", value: 45.0, unit: "item", source: "Ellen MacArthur Foundation 2021" },
  
  // Electronics (kg CO2e per item)
  { name: "smartphone", category: "shopping", subcategory: "electronics", value: 70.0, unit: "item", source: "Apple Environmental Report 2023" },
  { name: "laptop", category: "shopping", subcategory: "electronics", value: 300.0, unit: "item", source: "Dell Carbon Footprint Report 2023" },
  { name: "tablet", category: "shopping", subcategory: "electronics", value: 130.0, unit: "item", source: "Apple Environmental Report 2023" },
  { name: "television", category: "shopping", subcategory: "electronics", value: 500.0, unit: "item", source: "Samsung Sustainability Report 2023" },
  
  // General spending (kg CO2e per dollar - rough estimates)
  { name: "general_retail", category: "shopping", subcategory: "general", value: 0.5, unit: "dollar", source: "UC Berkeley CoolClimate 2020" },
  { name: "luxury_goods", category: "shopping", subcategory: "general", value: 1.2, unit: "dollar", source: "UC Berkeley CoolClimate 2020" },
];

// Waste emission factors
export const wasteEmissions: EmissionFactor[] = [
  // Waste types (kg CO2e per kg of waste)
  { name: "food_waste", category: "waste", subcategory: "organic", value: 3.3, unit: "kg", source: "EPA WARM 2023" },
  { name: "paper", category: "waste", subcategory: "recyclable", value: 1.8, unit: "kg", source: "EPA WARM 2023" },
  { name: "plastic", category: "waste", subcategory: "recyclable", value: 2.9, unit: "kg", source: "EPA WARM 2023" },
  { name: "glass", category: "waste", subcategory: "recyclable", value: 0.3, unit: "kg", source: "EPA WARM 2023" },
  { name: "aluminum", category: "waste", subcategory: "recyclable", value: 11.5, unit: "kg", source: "EPA WARM 2023" },
  { name: "general_waste", category: "waste", subcategory: "landfill", value: 0.5, unit: "kg", source: "EPA WARM 2023" },
];

// Combine all emissions data
export const allEmissions: EmissionFactor[] = [
  ...foodEmissions,
  ...transportEmissions,
  ...energyEmissions,
  ...shoppingEmissions,
  ...wasteEmissions,
];

// Helper functions for emission calculations
export const findEmissionFactor = (itemName: string, category?: string): EmissionFactor | null => {
  const searchTerm = itemName.toLowerCase();
  
  // Try exact match first
  let match = allEmissions.find(emission => 
    emission.name.toLowerCase() === searchTerm && 
    (!category || emission.category === category)
  );
  
  if (match) return match;
  
  // Try partial match
  match = allEmissions.find(emission => 
    emission.name.toLowerCase().includes(searchTerm) && 
    (!category || emission.category === category)
  );
  
  if (match) return match;
  
  // Try fuzzy search (item name contains search term or vice versa)
  match = allEmissions.find(emission => 
    (searchTerm.includes(emission.name.toLowerCase()) || 
     emission.name.toLowerCase().includes(searchTerm)) && 
    (!category || emission.category === category)
  );
  
  return match || null;
};

export const calculateEmission = (itemName: string, quantity: number, category?: string): number => {
  const factor = findEmissionFactor(itemName, category);
  if (!factor) return 0;
  
  return factor.value * quantity;
};

// Common food portions for better user experience
export const commonPortions: Record<string, { weight: number; unit: string }> = {
  "burger": { weight: 0.25, unit: "kg" }, // 250g burger
  "slice of bread": { weight: 0.03, unit: "kg" }, // 30g slice
  "cup of rice": { weight: 0.2, unit: "kg" }, // 200g cooked rice
  "glass of milk": { weight: 0.25, unit: "liter" }, // 250ml
  "egg": { weight: 0.06, unit: "kg" }, // 60g egg
  "slice of cheese": { weight: 0.02, unit: "kg" }, // 20g slice
  "cup of coffee": { weight: 0.01, unit: "kg" }, // 10g coffee beans
  "banana": { weight: 0.12, unit: "kg" }, // 120g banana
  "apple": { weight: 0.18, unit: "kg" }, // 180g apple
  "slice of pizza": { weight: 0.15, unit: "kg" }, // 150g slice
};