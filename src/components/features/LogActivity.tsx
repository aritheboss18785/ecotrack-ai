import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Car, Utensils, Zap, ShoppingBag, Trash2, Sparkles, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ParsedActivity } from '../../lib/activityParser';
import { parseActivityWithAI } from '../../lib/llmParser';
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
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
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
    setParsedResults(prev => ({ ...prev, [category]: null }));
  };

  const handleAnalyse = async (category: string) => {
    const text = activityTexts[category];
    if (!text.trim()) return;

    setIsLoading(prev => ({ ...prev, [category]: true }));
    try {
      const result = await parseActivityWithAI(text, category);
      setParsedResults(prev => ({ ...prev, [category]: result }));
      if (result.items.length === 0) {
        toast.error('Could not identify any activities. Try being more specific.');
      }
    } catch (error) {
      toast.error('Analysis failed. Check your API key and try again.');
      console.error(error);
    } finally {
      setIsLoading(prev => ({ ...prev, [category]: false }));
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
    <div className="min-h-screen bg-parchment font-sans">
      <div className="p-4 flex flex-col gap-[14px] animate-craft-fade-in max-w-5xl mx-auto">

        {/* Header */}
        <div className="pt-4 pb-2">
          <div className="craft-label mb-1">LOG ACTIVITY</div>
          <h1 className="text-3xl font-bold text-forest tracking-tight">Log Activity</h1>
          <p className="text-bark text-sm mt-1">Describe your daily activities naturally</p>
        </div>

        {/* Category Selection */}
        <div>
          <div className="craft-label border-b border-[#d8cfc0] pb-[6px] mb-3">SELECT CATEGORY</div>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(selectedCategory === id ? '' : id)}
                className={`tile tile-hover p-5 flex flex-col items-center gap-2 ${
                  selectedCategory === id ? 'tile-forest' : ''
                }`}
              >
                <Icon size={32} className={selectedCategory === id ? 'text-forest-light' : 'text-forest'} />
                <span className={`text-sm font-medium ${selectedCategory === id ? 'text-forest-light' : 'text-forest'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Input Card */}
        {selectedCategory && (
          <div className="tile overflow-hidden">
            <div className="bg-forest px-4 py-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-light">
              Log {categories.find(cat => cat.id === selectedCategory)?.label} Activity
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor={`${selectedCategory}-text`} className="text-forest text-sm font-medium">
                  Describe your {selectedCategory} activity
                </Label>
                <Textarea
                  id={`${selectedCategory}-text`}
                  value={activityTexts[selectedCategory]}
                  onChange={(e) => handleTextChange(selectedCategory, e.target.value)}
                  placeholder={categories.find(cat => cat.id === selectedCategory)?.placeholder}
                  className="min-h-[100px] bg-parchment border-forest text-forest text-sm rounded-[8px]"
                  rows={4}
                />
              </div>

              <div className="bg-parchment border border-[#d8cfc0] rounded-[8px] p-3">
                <div className="craft-label mb-2">EXAMPLE PHRASES</div>
                <div className="flex flex-col gap-1">
                  {categories.find(cat => cat.id === selectedCategory)?.examples.map((example, index) => (
                    <div
                      key={index}
                      className="text-xs text-bark cursor-pointer hover:text-forest transition-colors"
                      onClick={() => handleTextChange(selectedCategory, example)}
                    >
                      · {example}
                    </div>
                  ))}
                </div>
              </div>

              {isLoading[selectedCategory] && (
                <div className="tile-forest rounded-[8px] px-4 py-3 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-forest-light border-t-transparent rounded-full animate-spin" />
                  <span className="text-forest-light text-sm">Analysing your activity...</span>
                </div>
              )}

              {!isLoading[selectedCategory] && parsedResults[selectedCategory] && parsedResults[selectedCategory]!.items.length > 0 && (
                <div className="tile tile-forest p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-forest-light font-bold text-2xl tracking-[-0.04em]">
                        {parsedResults[selectedCategory]!.totalCO2Impact.toFixed(2)} kg CO₂e
                      </div>
                      <div className="text-[10px] text-forest-light/60 uppercase tracking-wide">Gemini Analysis Result</div>
                    </div>
                    <button
                      onClick={() => toggleBreakdown(selectedCategory)}
                      className="text-forest-light hover:bg-white/10 p-2 rounded-full transition-colors"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                  {showBreakdown[selectedCategory] && (
                    <div className="flex flex-col gap-1 border-t border-forest-light/20 pt-2 mt-1">
                      {parsedResults[selectedCategory]!.items.map((item, index) => (
                        <div key={index} className="text-xs text-forest-light/70 flex justify-between">
                          <span>· {item.name}: {item.quantity.toFixed(2)} {item.unit}</span>
                          <span>{item.co2Impact.toFixed(2)} kg CO₂e</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(() => {
                const loading = isLoading[selectedCategory];
                const parsed = parsedResults[selectedCategory];
                const hasText = activityTexts[selectedCategory].trim().length > 0;
                const hasResult = parsed && parsed.items.length > 0;
                return (
                  <button
                    onClick={() => hasResult ? handleLogActivity(selectedCategory) : handleAnalyse(selectedCategory)}
                    disabled={loading || (!hasResult && !hasText)}
                    className="w-full bg-forest text-parchment font-semibold py-3 rounded-[8px] text-sm flex items-center justify-center gap-2 shadow-craft disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-craft-lg hover:-translate-y-px transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-parchment border-t-transparent rounded-full animate-spin" />
                        <span>Analysing...</span>
                      </>
                    ) : hasResult ? (
                      <>
                        <Plus size={18} />
                        <span>Log {categories.find(cat => cat.id === selectedCategory)?.label} Activity</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Analyse Activity</span>
                      </>
                    )}
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* How AI Analysis Works */}
        <div className="tile overflow-hidden">
          <div className="bg-forest px-4 py-[10px] text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-light">
            How AI Analysis Works
          </div>
          <div className="p-4 flex flex-col gap-2">
            {[
              'Use natural language to describe your activities',
              'AI breaks down complex activities into components',
              'Uses real emission factors from scientific sources',
              'More specific descriptions = more accurate results',
            ].map((tip, i) => (
              <div key={i} className="text-xs text-bark flex items-start gap-2">
                <span className="text-forest mt-0.5">·</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}