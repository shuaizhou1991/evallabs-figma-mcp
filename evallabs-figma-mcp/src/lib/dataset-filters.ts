import { Dataset } from './datasets';

export interface DatasetFilters {
  size: string[];
  format: string[];
  priceRange: [number, number];
  domain: string[];
  language: string[];
  license: string[];
  quality: string[];
  searchTerm: string;
}

export const filterDatasets = (datasets: Dataset[], filters: DatasetFilters): Dataset[] => {
  const { size, format, priceRange, domain, language, license, quality, searchTerm } = filters;
  
  return datasets.filter(dataset => {
    // Search filter
    if (searchTerm && !dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !dataset.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Size filter
    if (size.length > 0 && !size.some(s => 
      dataset.size.toLowerCase().includes(s.toLowerCase()))) {
      return false;
    }
    
    // Format filter
    if (format.length > 0 && !format.some(f => 
      dataset.format.toLowerCase().includes(f.toLowerCase()))) {
      return false;
    }
    
    // Price filter
    if (dataset.price < priceRange[0] || dataset.price > priceRange[1]) {
      return false;
    }
    
    // Domain filter
    if (domain.length > 0 && !domain.some(d => dataset.domain.includes(d))) {
      return false;
    }
    
    // Language filter
    if (language.length > 0 && !language.some(l => dataset.language.includes(l))) {
      return false;
    }
    
    // License filter
    if (license.length > 0 && !license.some(l => 
      dataset.license.toLowerCase().includes(l.toLowerCase()))) {
      return false;
    }
    
    // Quality filter
    if (quality.length > 0 && !quality.some(q => 
      dataset.quality.toLowerCase().includes(q.toLowerCase()))) {
      return false;
    }
    
    return true;
  });
};

export const getDatasetFilterCount = (filters: DatasetFilters): number => {
  return filters.size.length + 
         filters.format.length + 
         filters.domain.length + 
         filters.language.length + 
         filters.license.length +
         filters.quality.length +
         ((filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500) ? 1 : 0) +
         (filters.searchTerm ? 1 : 0);
}; 