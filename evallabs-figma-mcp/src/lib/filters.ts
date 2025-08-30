import { Product } from './data';

export interface Filters {
  intelligence: string[];
  speed: string[];
  priceRange: [number, number];
  input: string[];
  output: string[];
  license: string[];
  searchTerm: string;
}

export const filterProducts = (products: Product[], filters: Filters): Product[] => {
  const { intelligence, speed, priceRange, input, output, license, searchTerm } = filters;
  
  return products.filter(product => {
    // Search filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Intelligence filter
    if (intelligence.length > 0 && !intelligence.some(intel => 
      product.intelligence.toLowerCase().includes(intel.toLowerCase()))) {
      return false;
    }
    
    // Speed filter
    if (speed.length > 0 && !speed.some(s => 
      product.speed.toLowerCase().includes(s.toLowerCase()))) {
      return false;
    }
    
    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Input filter
    if (input.length > 0 && !input.some(i => product.input.includes(i))) {
      return false;
    }
    
    // Output filter
    if (output.length > 0 && !output.some(o => product.output.includes(o))) {
      return false;
    }
    
    // License filter
    if (license.length > 0 && !license.some(l => 
      product.license.toLowerCase().includes(l.toLowerCase()))) {
      return false;
    }
    
    return true;
  });
};

export const getFilterCount = (filters: Filters): number => {
  return filters.intelligence.length + 
         filters.speed.length + 
         filters.input.length + 
         filters.output.length + 
         filters.license.length +
         ((filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500) ? 1 : 0) +
         (filters.searchTerm ? 1 : 0);
}; 