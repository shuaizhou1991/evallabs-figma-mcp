'use client';

import { Dataset } from '@/lib/datasets';

interface DatasetAvatarProps {
  dataset: Dataset;
  size?: 'sm' | 'md' | 'lg';
}

export default function DatasetAvatar({ dataset, size = 'md' }: DatasetAvatarProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-10 h-10 text-xs';
      case 'lg':
        return 'w-16 h-16 text-lg';
      default:
        return 'w-12 h-12 text-sm';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'text':
        return '📄';
      case 'image':
        return '🖼️';
      case 'audio':
        return '🎵';
      case 'video':
        return '🎬';
      case 'code':
        return '💻';
      case 'image-text':
        return '📸';
      default:
        return '📊';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'very high':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'high':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className={`flex-shrink-0 ${getSizeClasses()} rounded-lg border-2 flex items-center justify-center font-semibold ${getQualityColor(dataset.quality)}`}>
      {getFormatIcon(dataset.format)}
    </div>
  );
}
