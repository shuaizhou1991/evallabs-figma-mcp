'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { DEFAULT_PRICE_RANGE, MAX_PRICE } from '@/lib/constants';
import { getDatasetFilterCount } from '@/lib/dataset-filters';

// Dataset-specific constants
const DATASET_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'size', label: 'Size' },
  { id: 'format', label: 'Format' },
  { id: 'price', label: 'Price' },
  { id: 'domain', label: 'Domain' },
  { id: 'language', label: 'Language' },
  { id: 'license', label: 'License' },
  { id: 'quality', label: 'Quality' },
] as const;

const SIZE_LEVELS = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
  { id: 'very large', label: 'Very Large' },
] as const;

const FORMAT_TYPES = [
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Image' },
  { id: 'audio', label: 'Audio' },
  { id: 'video', label: 'Video' },
  { id: 'code', label: 'Code' },
  { id: 'image-text', label: 'Image-Text' },
] as const;

const DOMAIN_TYPES = [
  { id: 'Web', label: 'Web' },
  { id: 'News', label: 'News' },
  { id: 'Blogs', label: 'Blogs' },
  { id: 'Education', label: 'Education' },
  { id: 'Knowledge', label: 'Knowledge' },
  { id: 'Literature', label: 'Literature' },
  { id: 'Fiction', label: 'Fiction' },
  { id: 'Non-fiction', label: 'Non-fiction' },
  { id: 'Social Media', label: 'Social Media' },
  { id: 'General', label: 'General' },
  { id: 'Academic', label: 'Academic' },
  { id: 'Books', label: 'Books' },
  { id: 'Images', label: 'Images' },
  { id: 'Computer Vision', label: 'Computer Vision' },
  { id: 'Object Detection', label: 'Object Detection' },
  { id: 'Classification', label: 'Classification' },
  { id: 'Speech', label: 'Speech' },
  { id: 'Audio', label: 'Audio' },
  { id: 'Question Answering', label: 'Question Answering' },
  { id: 'NLP', label: 'NLP' },
  { id: 'Evaluation', label: 'Evaluation' },
  { id: 'Programming', label: 'Programming' },
  { id: 'Code', label: 'Code' },
  { id: 'Mathematics', label: 'Mathematics' },
  { id: 'Reasoning', label: 'Reasoning' },
  { id: 'Problem Solving', label: 'Problem Solving' },
  { id: 'Science', label: 'Science' },
  { id: 'Commonsense', label: 'Commonsense' },
  { id: 'Truthfulness', label: 'Truthfulness' },
  { id: 'Toxicity', label: 'Toxicity' },
  { id: 'Safety', label: 'Safety' },
  { id: 'Bias', label: 'Bias' },
  { id: 'Fairness', label: 'Fairness' },
  { id: 'Coreference', label: 'Coreference' },
  { id: 'Face Recognition', label: 'Face Recognition' },
  { id: 'Face Generation', label: 'Face Generation' },
  { id: 'Urban Scenes', label: 'Urban Scenes' },
  { id: 'Scene Parsing', label: 'Scene Parsing' },
] as const;

const LANGUAGE_TYPES = [
  { id: 'English', label: 'English' },
  { id: 'Multilingual', label: 'Multilingual' },
  { id: 'Python', label: 'Python' },
  { id: 'JavaScript', label: 'JavaScript' },
  { id: 'Java', label: 'Java' },
  { id: 'Go', label: 'Go' },
  { id: 'PHP', label: 'PHP' },
  { id: 'Ruby', label: 'Ruby' },
] as const;

const LICENSE_TYPES = [
  { id: 'CC0', label: 'CC0' },
  { id: 'CC BY-SA', label: 'CC BY-SA' },
  { id: 'Fair Use', label: 'Fair Use' },
  { id: 'MIT', label: 'MIT' },
  { id: 'Apache 2.0', label: 'Apache 2.0' },
  { id: 'CC BY 4.0', label: 'CC BY 4.0' },
  { id: 'CC BY-NC 4.0', label: 'CC BY-NC 4.0' },
] as const;

const QUALITY_LEVELS = [
  { id: 'very high', label: 'Very High' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
] as const;

interface DatasetSidebarProps {
  selectedSize: string[];
  setSelectedSize: (value: string[]) => void;
  selectedFormat: string[];
  setSelectedFormat: (value: string[]) => void;
  selectedPriceRange: [number, number];
  setSelectedPriceRange: (value: [number, number]) => void;
  selectedDomain: string[];
  setSelectedDomain: (value: string[]) => void;
  selectedLanguage: string[];
  setSelectedLanguage: (value: string[]) => void;
  selectedLicense: string[];
  setSelectedLicense: (value: string[]) => void;
  selectedQuality: string[];
  setSelectedQuality: (value: string[]) => void;
  searchTerm?: string;
  setSearchTerm: (value: string) => void;
  onClose?: () => void;
}

export default function DatasetSidebar({
  selectedSize,
  setSelectedSize,
  selectedFormat,
  setSelectedFormat,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedDomain,
  setSelectedDomain,
  selectedLanguage,
  setSelectedLanguage,
  selectedLicense,
  setSelectedLicense,
  selectedQuality,
  setSelectedQuality,
  setSearchTerm
}: DatasetSidebarProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterSearchTerm, setFilterSearchTerm] = useState('');

  // Memoize filter counts
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DATASET_CATEGORIES.forEach(category => {
      switch (category.id) {
        case 'size':
          counts[category.id] = selectedSize.length;
          break;
        case 'format':
          counts[category.id] = selectedFormat.length;
          break;
        case 'price':
          counts[category.id] = (selectedPriceRange[0] !== DEFAULT_PRICE_RANGE[0] || selectedPriceRange[1] !== DEFAULT_PRICE_RANGE[1]) ? 1 : 0;
          break;
        case 'domain':
          counts[category.id] = selectedDomain.length;
          break;
        case 'language':
          counts[category.id] = selectedLanguage.length;
          break;
        case 'license':
          counts[category.id] = selectedLicense.length;
          break;
        case 'quality':
          counts[category.id] = selectedQuality.length;
          break;
        case 'all':
          counts[category.id] = getDatasetFilterCount({
            size: selectedSize,
            format: selectedFormat,
            priceRange: selectedPriceRange,
            domain: selectedDomain,
            language: selectedLanguage,
            license: selectedLicense,
            quality: selectedQuality,
            searchTerm: ''
          });
          break;
      }
    });
    return counts;
  }, [selectedSize, selectedFormat, selectedPriceRange, selectedDomain, selectedLanguage, selectedLicense, selectedQuality]);

  const handleToggle = (type: string, value: string, currentValues: string[], setValues: (values: string[]) => void) => {
    if (currentValues.includes(value)) {
      setValues(currentValues.filter(item => item !== value));
    } else {
      setValues([...currentValues, value]);
    }
  };

  const handleReset = () => {
    setSelectedSize([]);
    setSelectedFormat([]);
    setSelectedPriceRange(DEFAULT_PRICE_RANGE);
    setSelectedDomain([]);
    setSelectedLanguage([]);
    setSelectedLicense([]);
    setSelectedQuality([]);
    setSearchTerm('');
    setFilterSearchTerm('');
    setActiveCategory('size');
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
        {DATASET_CATEGORIES.map((category) => (
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
      {activeCategory === 'size' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">Dataset Size</h3>
          {renderFilterButtons(SIZE_LEVELS, selectedSize, setSelectedSize, '📊')}
        </div>
      )}

      {activeCategory === 'format' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">Data Format</h3>
          {renderFilterButtons(FORMAT_TYPES, selectedFormat, setSelectedFormat, '📄')}
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

      {activeCategory === 'domain' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">Domain</h3>
          {renderFilterButtons(DOMAIN_TYPES, selectedDomain, setSelectedDomain, '🏷️')}
        </div>
      )}

      {activeCategory === 'language' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">Language</h3>
          {renderFilterButtons(LANGUAGE_TYPES, selectedLanguage, setSelectedLanguage, '🌐')}
        </div>
      )}

      {activeCategory === 'license' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">License Types</h3>
          {renderFilterButtons(LICENSE_TYPES, selectedLicense, setSelectedLicense, '📋')}
        </div>
      )}

      {activeCategory === 'quality' && (
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-2">Data Quality</h3>
          {renderFilterButtons(QUALITY_LEVELS, selectedQuality, setSelectedQuality, '⭐')}
        </div>
      )}

      {activeCategory === 'all' && (
        <div className="space-y-6">
          {renderSection('Dataset Size', '📊', SIZE_LEVELS, selectedSize, setSelectedSize, () => setSelectedSize([]))}
          {renderSection('Data Format', '📄', FORMAT_TYPES, selectedFormat, setSelectedFormat, () => setSelectedFormat([]))}
          
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

          {renderSection('Domain', '🏷️', DOMAIN_TYPES, selectedDomain, setSelectedDomain, () => setSelectedDomain([]))}
          {renderSection('Language', '🌐', LANGUAGE_TYPES, selectedLanguage, setSelectedLanguage, () => setSelectedLanguage([]))}
          {renderSection('License Types', '📋', LICENSE_TYPES, selectedLicense, setSelectedLicense, () => setSelectedLicense([]))}
          {renderSection('Data Quality', '⭐', QUALITY_LEVELS, selectedQuality, setSelectedQuality, () => setSelectedQuality([]))}
        </div>
      )}
    </aside>
  );
} 