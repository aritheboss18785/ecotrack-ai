import { findEmissionFactor, calculateEmission, commonPortions, EmissionFactor } from './carbon/carbonEmissions';

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

// Keywords for each category
const categoryKeywords = {
  transport: [
    'drove', 'drive', 'driving', 'car', 'uber', 'lyft', 'taxi', 'bus', 'train', 'subway', 'metro', 
    'flight', 'flew', 'airplane', 'plane', 'walk', 'walked', 'bike', 'biked', 'cycling', 'motorcycle',
    'commute', 'travel', 'trip', 'miles', 'km', 'distance', 'rode', 'scooter'
  ],
  food: [
    'ate', 'eat', 'eating', 'breakfast', 'lunch', 'dinner', 'snack', 'meal', 'food', 'drink', 'drank',
    'coffee', 'tea', 'burger', 'pizza', 'salad', 'chicken', 'beef', 'pork', 'fish', 'vegetarian',
    'vegan', 'restaurant', 'cooked', 'cooking', 'groceries', 'shopping'
  ],
  energy: [
    'electricity', 'power', 'heating', 'cooling', 'ac', 'air conditioning', 'heater', 'lights', 'tv',
    'computer', 'laptop', 'gaming', 'charged', 'charging', 'kwh', 'thermostat', 'energy', 'bill'
  ],
  shopping: [
    'bought', 'buy', 'shopping', 'purchased', 'store', 'online', 'amazon', 'clothes', 'clothing',
    'shoes', 'electronics', 'phone', 'laptop', 'gadget', 'item', 'product', 'retail', 'mall'
  ],
  waste: [
    'threw away', 'garbage', 'trash', 'recycled', 'recycling', 'composted', 'waste', 'disposed',
    'bin', 'landfill', 'paper', 'plastic', 'bottles', 'bags', 'food waste'
  ]
};

// Common quantity patterns
const quantityPatterns = [
  // Exact numbers
  { pattern: /(\d+(?:\.\d+)?)\s*(kg|kilogram|kilograms|lb|lbs|pound|pounds|g|gram|grams|oz|ounce|ounces)/gi, type: 'weight' },
  { pattern: /(\d+(?:\.\d+)?)\s*(miles?|mi|km|kilometer|kilometers)/gi, type: 'distance' },
  { pattern: /(\d+(?:\.\d+)?)\s*(hours?|hr|hrs|h|minutes?|min|mins)/gi, type: 'time' },
  { pattern: /(\d+(?:\.\d+)?)\s*(gallons?|gal|liters?|l|ml|milliliters?)/gi, type: 'volume' },
  { pattern: /(\d+(?:\.\d+)?)\s*(dollars?|\$|euros?|€|pounds?|£)/gi, type: 'money' },
  { pattern: /(\d+(?:\.\d+)?)\s*(kwh|kilowatt.hours?|therms?)/gi, type: 'energy' },
  
  // Common portions and servings
  { pattern: /(\d+(?:\.\d+)?)\s*(slices?|pieces?|servings?|portions?|cups?|glasses?|bowls?)/gi, type: 'portion' },
  { pattern: /(a|an|one|1)\s+(slice|piece|serving|portion|cup|glass|bowl|burger|pizza|sandwich|apple|banana|egg)/gi, type: 'single' },
  { pattern: /(\d+)\s+(burgers?|pizzas?|sandwiches?|apples?|bananas?|eggs?|slices?)/gi, type: 'count' },
];

// Food item patterns with common descriptions
const foodPatterns = [
  // Meat dishes
  { pattern: /burger|hamburger|cheeseburger/gi, items: [{ name: 'beef', weight: 0.15 }, { name: 'bread', weight: 0.06 }, { name: 'cheese', weight: 0.02 }] },
  { pattern: /chicken sandwich/gi, items: [{ name: 'chicken', weight: 0.12 }, { name: 'bread', weight: 0.06 }] },
  { pattern: /pizza slice/gi, items: [{ name: 'cheese', weight: 0.03 }, { name: 'bread', weight: 0.08 }, { name: 'tomatoes', weight: 0.02 }] },
  { pattern: /beef steak/gi, items: [{ name: 'beef', weight: 0.25 }] },
  { pattern: /chicken breast/gi, items: [{ name: 'chicken', weight: 0.18 }] },
  
  // Common meals
  { pattern: /pasta/gi, items: [{ name: 'pasta', weight: 0.15 }] },
  { pattern: /rice bowl|rice dish/gi, items: [{ name: 'rice', weight: 0.2 }] },
  { pattern: /salad/gi, items: [{ name: 'lettuce', weight: 0.1 }, { name: 'tomatoes', weight: 0.05 }] },
  
  // Beverages
  { pattern: /coffee/gi, items: [{ name: 'coffee', weight: 0.01 }] },
  { pattern: /glass of milk/gi, items: [{ name: 'milk', weight: 0.25 }] },
  { pattern: /beer/gi, items: [{ name: 'beer', weight: 0.5 }] },
];

// Transportation patterns
const transportPatterns = [
  { pattern: /drove.*(\d+(?:\.\d+)?)\s*(miles?|mi|km)/gi, mode: 'car_gasoline' },
  { pattern: /uber|lyft|taxi/gi, mode: 'car_gasoline' },
  { pattern: /bus/gi, mode: 'bus' },
  { pattern: /train|subway|metro/gi, mode: 'train' },
  { pattern: /flight|flew|plane|airplane/gi, mode: 'flight_domestic' },
  { pattern: /walk|walked/gi, mode: 'walking' },
  { pattern: /bike|biked|cycling/gi, mode: 'cycling' },
];

// Helper function to extract numbers from text
const extractNumbers = (text: string): number[] => {
  const numbers = text.match(/\d+(?:\.\d+)?/g);
  return numbers ? numbers.map(num => parseFloat(num)) : [];
};

// Helper function to determine category based on keywords
export const determineCategory = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return 'general'; // fallback category
};

// Parse food-related text
const parseFoodText = (text: string): ParsedActivity['items'] => {
  const items: ParsedActivity['items'] = [];
  const lowerText = text.toLowerCase();
  
  // Check for complex food patterns first
  for (const pattern of foodPatterns) {
    const matches = text.match(pattern.pattern);
    if (matches) {
      for (const match of matches) {
        const multiplier = extractNumbers(match)[0] || 1;
        
        for (const item of pattern.items) {
          const factor = findEmissionFactor(item.name, 'food');
          if (factor) {
            const quantity = item.weight * multiplier;
            const co2Impact = calculateEmission(item.name, quantity, 'food');
            
            items.push({
              name: item.name,
              quantity,
              unit: 'kg',
              co2Impact,
              confidence: 0.8
            });
          }
        }
      }
    }
  }
  
  // If no complex patterns found, try to extract individual food items
  if (items.length === 0) {
    const words = lowerText.split(/\s+/);
    const numbers = extractNumbers(text);
    
    for (const word of words) {
      const factor = findEmissionFactor(word, 'food');
      if (factor) {
        // Try to find associated quantity
        const quantity = numbers.length > 0 ? numbers[0] : 1;
        
        // Check if it's a common portion
        const portion = commonPortions[word] || commonPortions[`${word}s`];
        const finalQuantity = portion ? portion.weight * quantity : quantity * 0.1; // default 100g
        
        const co2Impact = calculateEmission(word, finalQuantity, 'food');
        
        items.push({
          name: word,
          quantity: finalQuantity,
          unit: 'kg',
          co2Impact,
          confidence: 0.6
        });
      }
    }
  }
  
  return items;
};

// Parse transport-related text
const parseTransportText = (text: string): ParsedActivity['items'] => {
  const items: ParsedActivity['items'] = [];
  const lowerText = text.toLowerCase();
  
  for (const pattern of transportPatterns) {
    const matches = text.match(pattern.pattern);
    if (matches) {
      // Extract distance if mentioned
      const distanceMatch = text.match(/(\d+(?:\.\d+)?)\s*(miles?|mi|km)/i);
      let distance = 5; // default 5 miles if not specified
      let unit = 'mile';
      
      if (distanceMatch) {
        distance = parseFloat(distanceMatch[1]);
        unit = distanceMatch[2].toLowerCase().includes('km') ? 'km' : 'mile';
        
        // Convert km to miles for consistency
        if (unit === 'km') {
          distance = distance * 0.621371;
        }
      }
      
      const factor = findEmissionFactor(pattern.mode, 'transport');
      if (factor) {
        const co2Impact = calculateEmission(pattern.mode, distance, 'transport');
        
        items.push({
          name: pattern.mode,
          quantity: distance,
          unit: 'mile',
          co2Impact,
          confidence: distanceMatch ? 0.9 : 0.6
        });
      }
      
      break; // Only match first transport pattern
    }
  }
  
  return items;
};

// Parse energy-related text
const parseEnergyText = (text: string): ParsedActivity['items'] => {
  const items: ParsedActivity['items'] = [];
  const lowerText = text.toLowerCase();
  
  // Look for specific energy mentions
  const kwhMatch = text.match(/(\d+(?:\.\d+)?)\s*kwh/i);
  if (kwhMatch) {
    const kwh = parseFloat(kwhMatch[1]);
    const co2Impact = calculateEmission('electricity_us_avg', kwh, 'energy');
    
    items.push({
      name: 'electricity_us_avg',
      quantity: kwh,
      unit: 'kWh',
      co2Impact,
      confidence: 0.9
    });
  }
  
  // Look for heating mentions
  const heatingMatch = text.match(/heat|heating|thermostat/i);
  if (heatingMatch) {
    const hours = extractNumbers(text)[0] || 8; // default 8 hours
    const therms = hours * 0.5; // rough estimate
    const co2Impact = calculateEmission('natural_gas', therms, 'energy');
    
    items.push({
      name: 'natural_gas',
      quantity: therms,
      unit: 'therm',
      co2Impact,
      confidence: 0.5
    });
  }
  
  return items;
};

// Parse shopping-related text
const parseShoppingText = (text: string): ParsedActivity['items'] => {
  const items: ParsedActivity['items'] = [];
  const lowerText = text.toLowerCase();
  const numbers = extractNumbers(text);
  
  // Look for specific items
  const words = lowerText.split(/\s+/);
  for (const word of words) {
    const factor = findEmissionFactor(word, 'shopping');
    if (factor) {
      const quantity = numbers.length > 0 ? numbers[0] : 1;
      const co2Impact = calculateEmission(word, quantity, 'shopping');
      
      items.push({
        name: word,
        quantity,
        unit: factor.unit,
        co2Impact,
        confidence: 0.7
      });
    }
  }
  
  // If no specific items, estimate based on spending
  if (items.length === 0) {
    const dollarMatch = text.match(/\$(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*dollars?/i);
    if (dollarMatch) {
      const amount = parseFloat(dollarMatch[1] || dollarMatch[2]);
      const co2Impact = calculateEmission('general_retail', amount, 'shopping');
      
      items.push({
        name: 'general_retail',
        quantity: amount,
        unit: 'dollar',
        co2Impact,
        confidence: 0.5
      });
    }
  }
  
  return items;
};

// Parse waste-related text
const parseWasteText = (text: string): ParsedActivity['items'] => {
  const items: ParsedActivity['items'] = [];
  const lowerText = text.toLowerCase();
  const numbers = extractNumbers(text);
  
  // Look for specific waste types
  const words = lowerText.split(/\s+/);
  for (const word of words) {
    const factor = findEmissionFactor(word, 'waste');
    if (factor) {
      const quantity = numbers.length > 0 ? numbers[0] : 1; // default 1 kg
      const co2Impact = calculateEmission(word, quantity, 'waste');
      
      items.push({
        name: word,
        quantity,
        unit: 'kg',
        co2Impact,
        confidence: 0.6
      });
    }
  }
  
  // Default to general waste if nothing specific found
  if (items.length === 0) {
    const weight = numbers.length > 0 ? numbers[0] : 2; // default 2 kg
    const co2Impact = calculateEmission('general_waste', weight, 'waste');
    
    items.push({
      name: 'general_waste',
      quantity: weight,
      unit: 'kg',
      co2Impact,
      confidence: 0.4
    });
  }
  
  return items;
};

// Main parsing function
export const parseActivityText = (text: string, category?: string): ParsedActivity => {
  const detectedCategory = category || determineCategory(text);
  let items: ParsedActivity['items'] = [];
  
  switch (detectedCategory) {
    case 'food':
      items = parseFoodText(text);
      break;
    case 'transport':
      items = parseTransportText(text);
      break;
    case 'energy':
      items = parseEnergyText(text);
      break;
    case 'shopping':
      items = parseShoppingText(text);
      break;
    case 'waste':
      items = parseWasteText(text);
      break;
    default:
      // Try to parse as food first, then transport
      items = parseFoodText(text);
      if (items.length === 0) {
        items = parseTransportText(text);
      }
  }
  
  const totalCO2Impact = items.reduce((sum, item) => sum + item.co2Impact, 0);
  const avgConfidence = items.length > 0 
    ? items.reduce((sum, item) => sum + item.confidence, 0) / items.length 
    : 0;
  
  return {
    originalText: text,
    category: detectedCategory,
    items,
    totalCO2Impact,
    confidence: avgConfidence
  };
};

// Helper function to format parsed results for display
export const formatParsedActivity = (parsed: ParsedActivity): string => {
  if (parsed.items.length === 0) {
    return `No recognizable activities found in: "${parsed.originalText}"`;
  }
  
  const itemsList = parsed.items.map(item => 
    `• ${item.name}: ${item.quantity.toFixed(2)} ${item.unit} (${item.co2Impact.toFixed(2)} kg CO₂e)`
  ).join('\n');
  
  return `Parsed from: "${parsed.originalText}"
Category: ${parsed.category}
Items breakdown:
${itemsList}

Total CO₂ Impact: ${parsed.totalCO2Impact.toFixed(2)} kg CO₂e
Confidence: ${(parsed.confidence * 100).toFixed(0)}%`;
};