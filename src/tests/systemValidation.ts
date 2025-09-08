// Test file to validate the EcoTrack AI system with real-world examples
import { parseActivityText, formatParsedActivity } from '../lib/activityParser';
import { calculateEmission, findEmissionFactor } from '../lib/carbon/carbonEmissions';

// Test cases for different categories
const testCases = [
  // Food tests
  {
    input: "Had a cheeseburger and fries for lunch",
    category: "food",
    expectedCO2Range: [10, 25] // Should break down to beef, bread, cheese
  },
  {
    input: "Drank 3 cups of coffee today",
    category: "food",
    expectedCO2Range: [0.4, 0.6] // 3 * 10g coffee * 15.2 kg CO2e/kg
  },
  {
    input: "Ate grilled chicken with rice for dinner",
    category: "food",
    expectedCO2Range: [1, 3] // Chicken + rice
  },

  // Transport tests
  {
    input: "Drove 25 miles to work",
    category: "transport",
    expectedCO2Range: [8, 12] // 25 miles * ~0.4 kg CO2e/mile
  },
  {
    input: "Took the bus for 10 miles",
    category: "transport",
    expectedCO2Range: [1, 3] // Bus is more efficient
  },
  {
    input: "Flew to New York (500 miles)",
    category: "transport", 
    expectedCO2Range: [90, 130] // Flight emissions are high
  },

  // Energy tests
  {
    input: "Used air conditioning for 8 hours",
    category: "energy",
    expectedCO2Range: [6, 12] // Rough estimate for AC usage
  },
  {
    input: "Heated house with gas for 6 hours",
    category: "energy",
    expectedCO2Range: [4, 8] // Natural gas heating
  },

  // Shopping tests
  {
    input: "Bought 2 t-shirts and jeans",
    category: "shopping",
    expectedCO2Range: [40, 60] // 2*8.5 + 33.4 = ~50 kg CO2e
  },
  {
    input: "Purchased a new smartphone",
    category: "shopping",
    expectedCO2Range: [65, 75] // ~70 kg CO2e for smartphone
  },

  // Waste tests
  {
    input: "Threw away leftover dinner food",
    category: "waste",
    expectedCO2Range: [2, 8] // Food waste has high emissions
  }
];

// Run tests
console.log("=== EcoTrack AI System Validation ===\n");

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.input}`);
  console.log(`Category: ${testCase.category}`);
  
  const parsed = parseActivityText(testCase.input, testCase.category);
  
  console.log(`Result: ${parsed.totalCO2Impact.toFixed(2)} kg CO₂e`);
  console.log(`Expected range: ${testCase.expectedCO2Range[0]}-${testCase.expectedCO2Range[1]} kg CO₂e`);
  console.log(`Confidence: ${(parsed.confidence * 100).toFixed(0)}%`);
  
  // Check if result is within expected range
  const inRange = parsed.totalCO2Impact >= testCase.expectedCO2Range[0] && 
                  parsed.totalCO2Impact <= testCase.expectedCO2Range[1];
  
  if (inRange) {
    console.log("✅ PASS");
    passedTests++;
  } else {
    console.log("❌ FAIL");
  }
  
  // Show breakdown
  if (parsed.items.length > 0) {
    console.log("Breakdown:");
    parsed.items.forEach(item => {
      console.log(`  • ${item.name}: ${item.quantity.toFixed(2)} ${item.unit} = ${item.co2Impact.toFixed(2)} kg CO₂e`);
    });
  }
  
  console.log("---");
});

console.log(`\n=== Summary ===`);
console.log(`Passed: ${passedTests}/${totalTests} tests`);
console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

// Test individual emission factors
console.log(`\n=== Emission Factors Test ===`);
const factorTests = [
  { item: "beef", expected: 60.0 },
  { item: "chicken", expected: 6.9 },
  { item: "car_gasoline", expected: 0.4 },
  { item: "flight_domestic", expected: 0.24 },
  { item: "electricity_us_avg", expected: 0.386 }
];

factorTests.forEach(test => {
  const factor = findEmissionFactor(test.item);
  if (factor && factor.value === test.expected) {
    console.log(`✅ ${test.item}: ${factor.value} ${factor.unit} - CORRECT`);
  } else {
    console.log(`❌ ${test.item}: Expected ${test.expected}, got ${factor?.value || 'not found'}`);
  }
});

export { testCases };