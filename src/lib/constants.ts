export const INTELLIGENCE_LEVELS = [
  { id: 'very-low', label: 'Very Low' },
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
  { id: 'very-high', label: 'Very High' },
] as const;

export const SPEED_LEVELS = [
  { id: 'very-slow', label: 'Very Slow' },
  { id: 'slow', label: 'Slow' },
  { id: 'medium', label: 'Medium' },
  { id: 'fast', label: 'Fast' },
  { id: 'very-fast', label: 'Very Fast' },
] as const;

export const LICENSE_TYPES = [
  { id: 'mit', label: 'MIT' },
  { id: 'apache-2.0', label: 'Apache 2.0' },
  { id: 'gpl-3.0', label: 'GPL 3.0' },
  { id: 'bsd-3', label: 'BSD 3-Clause' },
] as const;

export const INPUT_TYPES = [
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Image' },
  { id: 'audio', label: 'Audio' },
  { id: 'video', label: 'Video' },
] as const;

export const OUTPUT_TYPES = [
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Image' },
  { id: 'audio', label: 'Audio' },
  { id: 'video', label: 'Video' },
] as const;

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'speed', label: 'Speed' },
  { id: 'price', label: 'Price' },
  { id: 'input', label: 'Input' },
  { id: 'output', label: 'Output' },
  { id: 'license', label: 'License' },
] as const;

export const DEFAULT_PRICE_RANGE: [number, number] = [0, 500];
export const MAX_PRICE = 1000; 