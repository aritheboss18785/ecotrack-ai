import { calculateEmission } from './carbon/carbonEmissions';
import { ParsedActivity } from './activityParser';

const SYSTEM_PROMPT = `You are a carbon footprint calculator. Decompose the described activity into its raw components using ONLY the known items below, with realistic quantities.

Food (quantity = kg): beef, lamb, pork, chicken, turkey, fish, salmon, tuna, shrimp, eggs, milk, cheese, butter, yogurt, rice, wheat, bread, pasta, oats, potatoes, tomatoes, lettuce, onions, carrots, broccoli, spinach, apples, bananas, oranges, avocados, almonds, peanuts, beans, lentils, tofu, coffee, tea, wine, beer
Transport (quantity = miles): car_gasoline, car_diesel, car_hybrid, car_electric, suv_gasoline, truck_gasoline, motorcycle, bus, train, subway, tram, flight_domestic, flight_international, walking, cycling, escooter
Energy — electricity (quantity = kWh): electricity_us_avg, electricity_renewable, electricity_coal, electricity_natural_gas
Energy — heating (quantity = therms for natural_gas, gallons for heating_oil/propane, kg for wood): natural_gas, heating_oil, propane, wood
Shopping (quantity = count per item, or dollar amount for general_retail/luxury_goods): t_shirt, jeans, dress, shoes, jacket, smartphone, laptop, tablet, television, general_retail, luxury_goods
Waste (quantity = kg): food_waste, paper, plastic, glass, aluminum, general_waste

Respond ONLY with valid JSON matching this schema exactly:
{
  "components": [
    { "name": "beef", "quantity": 0.15 },
    { "name": "bread", "quantity": 0.06 }
  ]
}

Rules:
- Use exact names from the list above only
- A hamburger → beef 0.15 kg, bread 0.06 kg, cheese 0.02 kg
- Omit items with zero or negligible contribution
- For beverages sold in liters (milk, wine, beer) the emission factor uses liters, so quantity is liters`;

// Maps each known item name to the display unit shown in the breakdown
const UNIT_MAP: Record<string, string> = {
  car_gasoline: 'mile', car_diesel: 'mile', car_hybrid: 'mile', car_electric: 'mile',
  suv_gasoline: 'mile', truck_gasoline: 'mile', motorcycle: 'mile',
  bus: 'mile', train: 'mile', subway: 'mile', tram: 'mile',
  flight_domestic: 'mile', flight_international: 'mile',
  walking: 'mile', cycling: 'mile', escooter: 'mile',
  electricity_us_avg: 'kWh', electricity_renewable: 'kWh',
  electricity_coal: 'kWh', electricity_natural_gas: 'kWh',
  natural_gas: 'therm', heating_oil: 'gallon', propane: 'gallon', wood: 'kg',
  milk: 'liter', wine: 'liter', beer: 'liter',
  t_shirt: 'item', jeans: 'item', dress: 'item', shoes: 'pair',
  jacket: 'item', smartphone: 'item', laptop: 'item', tablet: 'item',
  television: 'item', general_retail: 'dollar', luxury_goods: 'dollar',
};

export const parseActivityWithAI = async (
  text: string,
  category: string
): Promise<ParsedActivity> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: `Category: ${category}\nActivity: ${text}` }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const content: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error('Empty response from Gemini API');

  let parsed: { components: Array<{ name: string; quantity: number }> };
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid JSON from Gemini API');
  }

  const items = (parsed.components ?? [])
    .filter((c) => c.name && c.quantity > 0)
    .map((component) => ({
      name: component.name,
      quantity: component.quantity,
      unit: UNIT_MAP[component.name] ?? 'kg',
      co2Impact: calculateEmission(component.name, component.quantity, category),
      confidence: 0.9,
    }))
    .filter((item) => item.co2Impact > 0);

  const totalCO2Impact = items.reduce((sum, item) => sum + item.co2Impact, 0);

  return {
    originalText: text,
    category,
    items,
    totalCO2Impact,
    confidence: items.length > 0 ? 0.9 : 0,
  };
};
