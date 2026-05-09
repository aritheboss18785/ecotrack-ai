# EcoTrack AI - Carbon Footprint Tracker

🌱 **READY TO USE** | ✅ **NO LOGIN REQUIRED** | 🚀 **Live Demo**: [EcoTrack AI](https://aritheboss18785.github.io/ecotrack-ai/)

EcoTrack AI revolutionizes personal carbon footprint tracking with intelligent activity parsing. Unlike traditional apps that require manual input of numerical values, EcoTrack AI lets users describe their activities in plain English and automatically calculates precise carbon emissions.

## 🎉 Key Features

### 🤖 Smart Activity Parsing
- **Natural Language Input**: Simply describe what you did - "Had a burger for lunch", "Drove 25 miles to work"
- **Intelligent Breakdown**: Automatically decomposes complex activities into components with emission factors
- **Real-time Analysis**: See CO₂ calculations as you type with confidence scores

### 📊 Scientific Accuracy
- **Real Emission Factors**: Uses data from EPA, FAO, DEFRA, and other scientific sources
- **Comprehensive Database**: 100+ emission factors covering food, transport, energy, shopping, and waste
- **Source Transparency**: Every calculation shows its data source and methodology

### 📱 Intuitive Interface
- **Category-Based Logging**: Five main categories (Transport, Food, Energy, Shopping, Waste)
- **Smart Suggestions**: Example phrases to guide users
- **Progress Tracking**: Streaks, achievements, and carbon budget monitoring

## 🚀 Getting Started

No setup required! The app works entirely in your browser.

```bash
npm install
npm run dev
```

## 📊 What You Get

**Dashboard** — Daily carbon budget, weekly trends, category breakdown, and activity history with streak tracking and XP levels.

**Log Activity** — Choose a category, describe your activity in plain English, and get instant CO₂ calculations with detailed component breakdown.

**Progress** — Monthly goals, week-by-week comparisons, achievements, and carbon reduction insights.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Charts**: Recharts
- **Parsing**: Custom rule-based activity parser
- **Data**: Scientific emission factors database

## 📈 Emission Factors

The app includes comprehensive emission factors for:
- **Food**: 40+ food items with precise CO₂e per kg/liter
- **Transport**: Cars, public transit, flights, cycling, walking
- **Energy**: Electricity (by grid mix), heating fuels
- **Shopping**: Consumer goods with dollar-based estimates
- **Waste**: Various waste types and disposal methods

All factors sourced from EPA, FAO, DEFRA, and peer-reviewed scientific literature.

## 🌍 Impact Tracking

- **Daily Budget**: Set and track against personal carbon goals
- **Weekly Trends**: Visualize your carbon footprint over time
- **Category Insights**: See where your emissions come from
- **Achievements**: Unlock badges for consistent low-carbon living
- **Streaks**: Build habits with consecutive day tracking

## 📝 Usage Examples

**Food**: "ate a cheeseburger and fries" → Beef (150g) + Bread (60g) + Cheese (20g) + Potatoes (200g)

**Transport**: "drove 25 miles to work in my gas car" → 0.4 kg CO₂e per mile × 25 miles

**Energy**: "used 50 kWh of electricity today" → Grid mix emission factor × 50 kWh

**Shopping**: "bought new jeans and a t-shirt" → Clothing emission factors

**Waste**: "threw away 2 kg of food waste" → Food waste emission factor × 2 kg

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📊 Data Sources

- EPA (US Environmental Protection Agency)
- FAO (Food and Agriculture Organization)
- DEFRA (UK Department for Environment, Food & Rural Affairs)
- IPCC (Intergovernmental Panel on Climate Change)
- Peer-reviewed scientific literature

## 🎯 Future Enhancements

- Data persistence across sessions
- Social features and leaderboards
- Advanced analytics and insights
- Integration with smart home devices
- Carbon offset recommendations

---

**Built with ❤️ for a sustainable future**
