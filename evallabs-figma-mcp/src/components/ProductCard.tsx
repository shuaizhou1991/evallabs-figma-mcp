'use client';

import { useRouter } from 'next/navigation';
import { Product } from '@/lib/data';
import ProductAvatar from './ProductAvatar';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div 
      className="bg-white border border-slate-300 rounded-md p-3 lg:p-4 flex gap-3 lg:gap-4 items-start min-w-0 hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer"
      onClick={handleClick}
    >
      {/* Product Avatar */}
      <ProductAvatar product={product} size="sm" />

      {/* Product Details */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {/* Title and Description */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1 min-w-0">
          <h3 className="text-sm font-semibold text-black truncate flex-shrink-0">
            {product.name}
          </h3>
          <span className="hidden sm:inline text-slate-500 flex-shrink-0">—</span>
          <p className="text-sm text-slate-500 truncate min-w-0">
            {product.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 text-sm text-gray-500">
          <span className="truncate">Updated: {product.updated}</span>
          <span className="truncate">Intelligence: {product.intelligence}</span>
          <span className="truncate">Speed: {product.speed}</span>
        </div>
      </div>
    </div>
  );
}
