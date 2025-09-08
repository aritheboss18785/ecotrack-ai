import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Car, Utensils, Zap, ShoppingBag, Trash2, Sparkles, Info } from 'lucide-react';
import { toast } from 'sonner';
import { parseActivityText, formatParsedActivity, ParsedActivity } from '../../lib/activityParser';

import { Activity } from '../../types/activity';

interface LogActivityProps {
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
}

export function LogActivity({ onAddActivity }: LogActivityProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activityTexts, setActivityTexts] = useState<Record<string, string>>({
    transport: '',
    food: '',
    energy: '',
    shopping: '',
    waste: ''
  });
  const [parsedResults, setParsedResults] = useState<Record<string, ParsedActivity | null>>({
    transport: null,
    food: null,
    energy: null,
    shopping: null,
    waste: null
  });
  const [showBreakdown, setShowBreakdown] = useState<Record<string, boolean>>({
    transport: false,
    food: false,
    energy: false,
    shopping: false,
    waste: false
  });

  const categories = [
    { 
      id: 'transport', 
      label: 'Transport', 
      icon: Car, 
      placeholder: 'Example: "Drove 25 miles to work", "Took the bus downtown", "Flew to New York"',
      examples: ['Drove 15 miles to the grocery store', 'Took Uber for 8 miles', 'Walked 2 miles to the park']
    },
    { 
      id: 'food', 
      label: 'Food', 
      icon: Utensils, 
      placeholder: 'Example: "Had a burger for lunch", "Drank 2 cups of coffee", "Ate pasta with chicken"',
      examples: ['Had a cheeseburger and fries for lunch', 'Drank 3 cups of coffee today', 'Ate grilled chicken with rice for dinner']
    },
    { 
      id: 'energy', 
      label: 'Energy', 
      icon: Zap, 
      placeholder: 'Example: "Used 25 kWh of electricity", "Heated house for 8 hours", "Left lights on all day"',
      examples: ['Used air conditioning for 6 hours', 'Heated house with gas for 10 hours', 'Left TV and lights on all evening']
    },
    { 
      id: 'shopping', 
      label: 'Shopping', 
      icon: ShoppingBag, 
      placeholder: 'Example: "Bought new jeans", "Purchased a smartphone", "Spent $50 at the mall"',
      examples: ['Bought 2 t-shirts and a pair of jeans', 'Purchased a new laptop', 'Spent $100 on groceries']
    },
    { 
      id: 'waste', 
      label: 'Waste', 
      icon: Trash2, 
      placeholder: 'Example: "Threw away 2 kg of food waste", "Recycled plastic bottles", "Disposed of old electronics"',
      examples: ['Threw away leftover food from dinner', 'Recycled 5 plastic bottles', 'Disposed of 3 kg of general waste']
    },
  ];

  const handleTextChange = (category: string, text: string) => {
    setActivityTexts(prev => ({ ...prev, [category]: text }));
    
    // Parse the text in real-time
    if (text.trim()) {
      const parsed = parseActivityText(text, category);
      setParsedResults(prev => ({ ...prev, [category]: parsed }));
    } else {
      setParsedResults(prev => ({ ...prev, [category]: null }));
    }
  };

  const handleLogActivity = (category: string) => {
    const parsed = parsedResults[category];
    if (!parsed || parsed.items.length === 0) {
      toast.error('Please describe your activity first or try being more specific');
      return;
    }

    // Add each parsed item as a separate activity
    const now = new Date();
    
    parsed.items.forEach((item, index) => {
      onAddActivity({
        category,
        amount: item.quantity,
        unit: item.unit,
        co2Impact: item.co2Impact,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        itemName: item.name,
        confidence: item.confidence
      });
    });
    
    toast.success(
      `Activity logged! Added ${parsed.totalCO2Impact.toFixed(2)} kg CO₂e from ${parsed.items.length} item(s) to your footprint.`
    );

    // Clear the text for this category
    setActivityTexts(prev => ({ ...prev, [category]: '' }));
    setParsedResults(prev => ({ ...prev, [category]: null }));
    setShowBreakdown(prev => ({ ...prev, [category]: false }));
  };

  const toggleBreakdown = (category: string) => {
    setShowBreakdown(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="min-h-screen bg-nature-gradient particles relative">
      <div className="p-4">
        {/* Header */}
        <div className="text-center pt-4 mb-8 animate-slideInUp">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="animate-float">
              <Plus size={32} className="text-green-600 animate-carbon-glow" />
            </div>
            <h1 className="text-4xl gradient-text font-bold tracking-tight">Log Activity</h1>
          </div>
          <p className="text-gray-600 text-lg">Describe your daily activities naturally</p>
          <div className="text-sm text-blue-600 mt-2 flex items-center justify-center gap-2 glass-green px-4 py-2 rounded-full inline-flex">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-medium">AI-powered emission analysis</span>
          </div>
        </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {categories.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            onClick={() => {
              setSelectedCategory(selectedCategory === id ? '' : id);
            }}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 card-hover animate-fadeInScale ${
              selectedCategory === id
                ? 'glass-green border-green-400 shadow-lg scale-105'
                : 'glass border-gray-200 hover:border-green-300 hover:shadow-md'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`transition-all duration-300 ${
              selectedCategory === id ? 'animate-float' : ''
            }`}>
              <Icon size={40} className={`mx-auto mb-3 ${
                selectedCategory === id ? 'text-green-600' : 'text-gray-500'
              }`} />
              <div className={`text-sm font-medium ${
                selectedCategory === id ? 'gradient-text' : 'text-gray-600'
              }`}>{label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Activity Input Cards */}
      {selectedCategory && (
        <Card className="glass border-2 border-green-200/50 mb-6 card-hover shadow-xl animate-slideInUp">
          <CardHeader className="relative">
            <div className="absolute top-4 right-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-green"></div>
            </div>
            <CardTitle className="flex items-center gap-3 gradient-text text-xl">
              {categories.find(cat => cat.id === selectedCategory)?.icon && 
                <div className="p-2 bg-green-100 rounded-full animate-float">
                  {React.createElement(categories.find(cat => cat.id === selectedCategory)!.icon, { size: 24, className: "text-green-600" })}
                </div>
              }
              <span>Log {categories.find(cat => cat.id === selectedCategory)?.label} Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor={`${selectedCategory}-text`} className="text-gray-700">
                Describe your {selectedCategory} activity
              </Label>
              <Textarea
                id={`${selectedCategory}-text`}
                value={activityTexts[selectedCategory]}
                onChange={(e) => handleTextChange(selectedCategory, e.target.value)}
                placeholder={categories.find(cat => cat.id === selectedCategory)?.placeholder}
                className="min-h-[100px] text-base"
                rows={4}
              />
            </div>

            {/* Examples */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-700 mb-2 font-medium">💡 Example phrases:</div>
              <div className="text-xs text-blue-600 space-y-1">
                {categories.find(cat => cat.id === selectedCategory)?.examples.map((example, index) => (
                  <div key={index} className="cursor-pointer hover:text-blue-800" onClick={() => setActivityTexts(prev => ({ ...prev, [selectedCategory]: example }))}>
                    • {example}
                  </div>
                ))}
              </div>
            </div>

            {/* Parsed Results Preview */}
            {parsedResults[selectedCategory] && parsedResults[selectedCategory]!.items.length > 0 && (
              <div className="glass-green p-4 rounded-xl border border-green-200/50 animate-fadeInScale">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full animate-carbon-glow">
                      <Sparkles size={20} className="text-green-600" />
                    </div>
                    <div>
                      <span className="text-lg gradient-text font-bold">
                        {parsedResults[selectedCategory]!.totalCO2Impact.toFixed(2)} kg CO₂e
                      </span>
                      <div className="text-xs text-gray-600">AI Analysis Result</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBreakdown(selectedCategory)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-100 p-2 rounded-full"
                  >
                    <Info size={16} />
                  </Button>
                </div>
                
                {showBreakdown[selectedCategory] && (
                  <div className="mt-2 space-y-1">
                    {parsedResults[selectedCategory]!.items.map((item, index) => (
                      <div key={index} className="text-xs text-green-600 flex justify-between">
                        <span>• {item.name}: {item.quantity.toFixed(2)} {item.unit}</span>
                        <span>{item.co2Impact.toFixed(2)} kg CO₂e</span>
                      </div>
                    ))}
                    <div className="text-xs text-green-500 mt-1">
                      Confidence: {(parsedResults[selectedCategory]!.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Log Button */}
            <Button 
              onClick={() => handleLogActivity(selectedCategory)}
              className="w-full btn-eco text-white py-4 text-lg rounded-xl shadow-lg font-semibold transition-all duration-300"
              disabled={!parsedResults[selectedCategory] || parsedResults[selectedCategory]!.items.length === 0}
            >
              <div className="flex items-center justify-center gap-3">
                <Plus size={24} className="animate-float" />
                <span>Log {categories.find(cat => cat.id === selectedCategory)?.label} Activity</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <Card className="mt-6 glass border-blue-200/50 card-hover animate-slideInUp">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-full animate-float">
              <Sparkles size={24} className="text-blue-600" />
            </div>
            <h3 className="gradient-text-blue text-lg font-bold">How AI Analysis Works</h3>
          </div>
          <ul className="space-y-3 text-sm text-blue-600">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Use natural language to describe your activities</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <span>AI breaks down complex activities into components</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <span>Uses real emission factors from scientific sources</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              <span>More specific descriptions = more accurate results</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}