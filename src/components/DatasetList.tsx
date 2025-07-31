'use client';

import { useState, useEffect, useMemo } from 'react';
import DatasetCard from './DatasetCard';
import Pagination from './Pagination';
import { getDatasets } from '@/lib/datasets';
import { filterDatasets, DatasetFilters } from '@/lib/dataset-filters';

interface DatasetListProps {
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
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  itemsPerPage?: number;
}

export default function DatasetList({
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
  searchTerm,
  setSearchTerm,
  itemsPerPage = 20,
}: DatasetListProps) {
  const [sortBy] = useState('trending');
  const [currentPage, setCurrentPage] = useState(1);

  // Get datasets once and memoize
  const datasets = useMemo(() => getDatasets(), []);

  // Memoize filters object to prevent unnecessary re-renders
  const filters: DatasetFilters = useMemo(() => ({
    size: selectedSize,
    format: selectedFormat,
    priceRange: selectedPriceRange,
    domain: selectedDomain,
    language: selectedLanguage,
    license: selectedLicense,
    quality: selectedQuality,
    searchTerm,
  }), [selectedSize, selectedFormat, selectedPriceRange, selectedDomain, selectedLanguage, selectedLicense, selectedQuality, searchTerm]);

  // Memoize filtered datasets
  const filteredDatasets = useMemo(() => filterDatasets(datasets, filters), [datasets, filters]);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDatasets = filteredDatasets.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const clearAllFilters = () => {
    setSelectedSize([]);
    setSelectedFormat([]);
    setSelectedPriceRange([0, 500]);
    setSelectedDomain([]);
    setSelectedLanguage([]);
    setSelectedLicense([]);
    setSelectedQuality([]);
    setSearchTerm('');
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between min-w-0 gap-3 sm:gap-0">
        <div className="flex items-end gap-4 min-w-0">
          <h2 className="text-xl lg:text-2xl font-semibold text-black tracking-tight truncate">
            Datasets
          </h2>
          <span className="text-lg lg:text-xl text-slate-500 tracking-tight flex-shrink-0">
            {filteredDatasets.length}
          </span>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          {/* Search Input */}
          <div className="relative min-w-0 flex-1 lg:flex-none">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search datasets..."
              className="w-full lg:w-[360px] min-w-0 pl-3 pr-10 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent placeholder:text-slate-400 text-slate-900 bg-white"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <span className="text-slate-400">🔍</span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sort Button */}
          <button className="bg-white border border-slate-200 px-3 lg:px-4 py-2 rounded-md flex items-center gap-1 lg:gap-2 text-sm font-medium hover:bg-slate-50 transition-colors self-end text-slate-900 cursor-pointer">
            <span>↕️</span>
            <span className="hidden sm:inline">Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
            <span className="sm:hidden">Sort</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200"></div>

      {/* Dataset Cards */}
      <div className="space-y-4">
        {currentDatasets.length > 0 ? (
          currentDatasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🗄️</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No datasets found
            </h3>
            <p className="text-slate-600 text-center max-w-md mb-6">
              {searchTerm 
                ? `No datasets match "${searchTerm}". Try adjusting your search terms or filters.`
                : "No datasets match your current filters. Try adjusting your filter criteria."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer text-sm font-medium"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors cursor-pointer text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredDatasets.length > 0 && (
        <Pagination 
          totalItems={filteredDatasets.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
} 