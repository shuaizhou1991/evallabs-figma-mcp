'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import DatasetSidebar from '@/components/DatasetSidebar';
import DatasetList from '@/components/DatasetList';
import ProtectedRoute from '@/components/ProtectedRoute';
import { DEFAULT_PRICE_RANGE } from '@/lib/constants';

export default function DatasetsPage() {
  // Filter states
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [selectedDomain, setSelectedDomain] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<string[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="bg-slate-50 min-h-screen">
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex min-w-0">
          {/* Mobile Sidebar Overlay */}
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setIsSidebarOpen(false)}></div>
          
          {/* Sidebar */}
          <div className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
            <DatasetSidebar
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedFormat={selectedFormat}
              setSelectedFormat={setSelectedFormat}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              selectedLicense={selectedLicense}
              setSelectedLicense={setSelectedLicense}
              selectedQuality={selectedQuality}
              setSelectedQuality={setSelectedQuality}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
          
          <main className="flex-1 p-4 lg:p-6 min-w-0">
            <DatasetList 
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedFormat={selectedFormat}
              setSelectedFormat={setSelectedFormat}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              selectedLicense={selectedLicense}
              setSelectedLicense={setSelectedLicense}
              selectedQuality={selectedQuality}
              setSelectedQuality={setSelectedQuality}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              itemsPerPage={20}
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 