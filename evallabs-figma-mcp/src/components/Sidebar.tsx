'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { 
  CATEGORIES, 
  INTELLIGENCE_LEVELS, 
  SPEED_LEVELS, 
  LICENSE_TYPES, 
  INPUT_TYPES, 
  OUTPUT_TYPES,
  DEFAULT_PRICE_RANGE,
  MAX_PRICE
} from '@/lib/constants';
import { getFilterCount } from '@/lib/filters';

interface SidebarProps {
  selectedIntelligence: string[];
  setSelectedIntelligence: (value: string[]) => void;
  selectedSpeed: string[];
  setSelectedSpeed: (value: string[]) => void;
  selectedPriceRange: [number, number];
  setSelectedPriceRange: (value: [number, number]) => void;
  selectedInput: string[];
  setSelectedInput: (value: string[]) => void;
  selectedOutput: string[];
  setSelectedOutput: (value: string[]) => void;
  selectedLicense: string[];
  setSelectedLicense: (value: string[]) => void;
  searchTerm?: string;
  setSearchTerm: (value: string) => void;
  onClose?: () => void;
}

export default function Sidebar({
  selectedIntelligence,
  setSelectedIntelligence,
  selectedSpeed,
  setSelectedSpeed,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedInput,
  setSelectedInput,
  selectedOutput,
  setSelectedOutput,
  selectedLicense,
  setSelectedLicense,
  setSearchTerm
}: SidebarProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterSearchTerm, setFilterSearchTerm] = useState('');

  // Memoize filter counts
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach(category => {
      switch (category.id) {
        case 'intelligence':
          counts[category.id] = selectedIntelligence.length;
          break;
        case 'speed':
          counts[category.id] = selectedSpeed.length;
          break;
        case 'price':
          counts[category.id] = (selectedPriceRange[0] !== DEFAULT_PRICE_RANGE[0] || selectedPriceRange[1] !== DEFAULT_PRICE_RANGE[1]) ? 1 : 0;
          break;
        case 'input':
          counts[category.id] = selectedInput.length;
          break;
        case 'output':
          counts[category.id] = selectedOutput.length;
          break;
        case 'license':
          counts[category.id] = selectedLicense.length;
          break;
        case 'all':
          counts[category.id] = getFilterCount({
            intelligence: selectedIntelligence,
            speed: selectedSpeed,
            priceRange: selectedPriceRange,
            input: selectedInput,
            output: selectedOutput,
            license: selectedLicense,
            searchTerm: ''
          });
          break;
      }
    });
    return counts;
  }, [selectedIntelligence, selectedSpeed, selectedPriceRange, selectedInput, selectedOutput, selectedLicense]);

  const handleToggle = (type: string, value: string, currentValues: string[], setValues: (values: string[]) => void) => {
    if (currentValues.includes(value)) {
      setValues(currentValues.filter(item => item !== value));
    } else {
      setValues([...currentValues, value]);
    }
  };

  const handleReset = () => {
    setSelectedIntelligence([]);
    setSelectedSpeed([]);
    setSelectedPriceRange(DEFAULT_PRICE_RANGE);
    setSelectedInput([]);
    setSelectedOutput([]);
    setSelectedLicense([]);
    setSearchTerm('');
    setFilterSearchTerm('');
    setActiveCategory('intelligence');
  };

  const renderFilterButtons = (
    items: readonly { id: string; label: string }[],
    selectedValues: string[],
    setValues: (values: string[]) => void,
    icon: string
  ) => (
    <div className="flex flex-wrap gap-2">
      {items
        .filter(item => 
          filterSearchTerm === '' || 
          item.label.toLowerCase().includes(filterSearchTerm.toLowerCase())
        )
        .map((item) => (
          <button
            key={item.id}
            onClick={() => handleToggle(activeCategory, item.id, selectedValues, setValues)}
            className={`px-2 py-1.5 rounded-lg text-xs font-normal transition-colors flex items-center gap-2 ${
              selectedValues.includes(item.id)
                ? 'border border-slate-900 text-slate-900'
                : 'border border-slate-200 text-slate-900 hover:border-slate-300'
            }`}
          >
            <span>{icon}</span>
            {item.label}
            {selectedValues.includes(item.id) && (
              <span className="text-slate-900">✕</span>
            )}
          </button>
        ))}
    </div>
  );

  const renderSection = (
    title: string,
    icon: string,
    items: readonly { id: string; label: string }[],
    selectedValues: string[],
    setValues: (value: string[]) => void,
    resetFn?: () => void
  ) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h3>
        {selectedValues.length > 0 && resetFn && (
          <button
            onClick={resetFn}
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors border border-slate-300 hover:border-slate-400 px-2 py-1 rounded"
          >
            Reset
          </button>
        )}
      </div>
      {renderFilterButtons(items, selectedValues, setValues, icon)}
    </div>
  );

  return (
    <aside className="w-[440px] h-full bg-white border-r border-slate-200 p-6 space-y-6 overflow-y-auto">
      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setFilterSearchTerm('');
            }}
            className={`px-3 py-1 rounded-2xl text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {category.label}
            {filterCounts[category.id] > 0 && (
              <span className={`ml-1 text-xs rounded-full px-1.5 py-0.5 ${
                activeCategory === category.id
                  ? 'bg-white text-black'
                  : 'bg-slate-900 text-white'
              }`}>
                {filterCounts[category.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search and Filter - Hidden for All tab */}
      {activeCategory !== 'all' && (
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={filterSearchTerm}
                onChange={(e) => setFilterSearchTerm(e.target.value)}
                placeholder={`Filter ${activeCategory} by name`}
                className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent placeholder:text-slate-400 text-slate-900 bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <span className="text-slate-400">🔍</span>
                {filterSearchTerm && (
                  <button
                    onClick={() => setFilterSearchTerm('')}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="bg-white border border-slate-200 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-700"
          >
            <span>🔄</span>
            Reset
          </button>
        </div>
      )}

      {/* Dynamic Filter Content Based on Active Category */}
      {activeCategory === 'intelligence' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">Intelligence Level</h3>
          {renderFilterButtons(INTELLIGENCE_LEVELS, selectedIntelligence, setSelectedIntelligence, '🧠')}
        </div>
      )}

      {activeCategory === 'speed' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">Speed Level</h3>
          {renderFilterButtons(SPEED_LEVELS, selectedSpeed, setSelectedSpeed, '⚡')}
        </div>
      )}

      {activeCategory === 'price' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
            <span>💰</span>
            Price Range
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-2">
                ${selectedPriceRange[0]} - ${selectedPriceRange[1]}
              </label>
              <Slider
                value={selectedPriceRange}
                onValueChange={setSelectedPriceRange}
                max={MAX_PRICE}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'input' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">Input Types</h3>
          {renderFilterButtons(INPUT_TYPES, selectedInput, setSelectedInput, '📥')}
        </div>
      )}

      {activeCategory === 'output' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">Output Types</h3>
          {renderFilterButtons(OUTPUT_TYPES, selectedOutput, setSelectedOutput, '📤')}
        </div>
      )}

      {activeCategory === 'license' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">License Types</h3>
          {renderFilterButtons(LICENSE_TYPES, selectedLicense, setSelectedLicense, '📋')}
        </div>
      )}

      {activeCategory === 'all' && (
        <div className="space-y-6">
          {renderSection('Intelligence Level', '🧠', INTELLIGENCE_LEVELS, selectedIntelligence, setSelectedIntelligence, () => setSelectedIntelligence([]))}
          {renderSection('Speed Level', '⚡', SPEED_LEVELS, selectedSpeed, setSelectedSpeed, () => setSelectedSpeed([]))}
          
          {/* Price Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                <span>💰</span>
                Price Range
              </h3>
              {(selectedPriceRange[0] !== DEFAULT_PRICE_RANGE[0] || selectedPriceRange[1] !== DEFAULT_PRICE_RANGE[1]) && (
                <button
                  onClick={() => setSelectedPriceRange(DEFAULT_PRICE_RANGE)}
                  className="text-xs text-slate-500 hover:text-slate-700 transition-colors border border-slate-300 hover:border-slate-400 px-2 py-1 rounded"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  ${selectedPriceRange[0]} - ${selectedPriceRange[1]}
                </label>
                <Slider
                  value={selectedPriceRange}
                  onValueChange={setSelectedPriceRange}
                  max={MAX_PRICE}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {renderSection('Input Types', '📥', INPUT_TYPES, selectedInput, setSelectedInput, () => setSelectedInput([]))}
          {renderSection('Output Types', '📤', OUTPUT_TYPES, selectedOutput, setSelectedOutput, () => setSelectedOutput([]))}
          {renderSection('License Types', '📋', LICENSE_TYPES, selectedLicense, setSelectedLicense, () => setSelectedLicense([]))}
        </div>
      )}
    </aside>
  );
}
