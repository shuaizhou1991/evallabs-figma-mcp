'use client';

import { useRouter } from 'next/navigation';
import { Dataset } from '@/lib/datasets';
import DatasetAvatar from './DatasetAvatar';

interface DatasetCardProps {
  dataset: Dataset;
}

export default function DatasetCard({ dataset }: DatasetCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dataset/${dataset.id}`);
  };

  return (
    <div 
      className="bg-white border border-slate-300 rounded-md p-3 lg:p-4 flex gap-3 lg:gap-4 items-start min-w-0 hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer"
      onClick={handleClick}
    >
      {/* Dataset Avatar */}
      <DatasetAvatar dataset={dataset} size="sm" />

      {/* Dataset Details */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {/* Title and Description */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1 min-w-0">
          <h3 className="text-sm font-semibold text-black truncate flex-shrink-0">
            {dataset.name}
          </h3>
          <span className="hidden sm:inline text-slate-500 flex-shrink-0">—</span>
          <p className="text-sm text-slate-500 truncate min-w-0">
            {dataset.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 text-sm text-gray-500">
          <span className="truncate">Updated: {dataset.updated}</span>
          <span className="truncate">Size: {dataset.size}</span>
          <span className="truncate">Rows: {(dataset.actualData?.length || 0).toLocaleString()}</span>
          <span className="truncate">Quality: {dataset.quality}</span>
        </div>
      </div>
    </div>
  );
} 