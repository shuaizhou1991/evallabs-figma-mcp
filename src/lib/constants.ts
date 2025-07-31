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

// Dataset-specific constants
export const DATASET_SIZES = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
  { id: 'very-large', label: 'Very Large' },
] as const;

export const DATASET_FORMATS = [
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Image' },
  { id: 'audio', label: 'Audio' },
  { id: 'video', label: 'Video' },
  { id: 'tabular', label: 'Tabular' },
  { id: 'json', label: 'JSON' },
] as const;

export const DATASET_DOMAINS = [
  { id: 'web', label: 'Web' },
  { id: 'news', label: 'News' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'education', label: 'Education' },
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'literature', label: 'Literature' },
  { id: 'fiction', label: 'Fiction' },
  { id: 'non-fiction', label: 'Non-fiction' },
  { id: 'social-media', label: 'Social Media' },
  { id: 'academic', label: 'Academic' },
  { id: 'books', label: 'Books' },
  { id: 'general', label: 'General' },
] as const;

export const DATASET_LANGUAGES = [
  { id: 'english', label: 'English' },
  { id: 'multilingual', label: 'Multilingual' },
  { id: 'spanish', label: 'Spanish' },
  { id: 'french', label: 'French' },
  { id: 'german', label: 'German' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'japanese', label: 'Japanese' },
] as const;

export const DATASET_QUALITIES = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
  { id: 'very-high', label: 'Very High' },
] as const;

export const DATASET_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'size', label: 'Size' },
  { id: 'format', label: 'Format' },
  { id: 'price', label: 'Price' },
  { id: 'domain', label: 'Domain' },
  { id: 'language', label: 'Language' },
  { id: 'license', label: 'License' },
  { id: 'quality', label: 'Quality' },
] as const;

export const DEFAULT_PRICE_RANGE: [number, number] = [0, 500];
export const MAX_PRICE = 1000; 