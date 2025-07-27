'use client';

import { Product } from '@/lib/data';

interface ProductAvatarProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProductAvatar({ product, size = 'md', className = '' }: ProductAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  };

  const paddingClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  // Get appropriate emoji based on product type
  const getProductEmoji = (product: Product): string => {
    const name = product.name.toLowerCase();
    
    // Language models
    if (name.includes('gpt') || name.includes('claude') || name.includes('gemini') || name.includes('llama') || name.includes('mistral')) {
      return '🤖';
    }
    
    // Image generation models
    if (name.includes('dall-e') || name.includes('stable') || name.includes('midjourney')) {
      return '🎨';
    }
    
    // Audio models
    if (name.includes('whisper') || name.includes('tts') || name.includes('voice') || name.includes('audio')) {
      return '🎵';
    }
    
    // Video models
    if (name.includes('video') || name.includes('gen-') || name.includes('pika') || name.includes('synthesia')) {
      return '🎬';
    }
    
    // Code models
    if (name.includes('code') || name.includes('stable code')) {
      return '💻';
    }
    
    // Default
    return '📦';
  };

  return (
    <div 
      className={`
        bg-slate-200 
        rounded-xl flex items-center justify-center flex-shrink-0
        ${sizeClasses[size]} 
        ${paddingClasses[size]}
        ${className}
      `}
    >
      <span className="text-slate-600 font-bold">
        {getProductEmoji(product)}
      </span>
    </div>
  );
} 