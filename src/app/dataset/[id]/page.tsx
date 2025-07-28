'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import DatasetAvatar from '@/components/DatasetAvatar';
import { useToast } from '@/hooks/use-toast';

interface Dataset {
  id: number;
  name: string;
  description: string;
  updated: string;
  size: string;
  format: string;
  price: number;
  domain: string[];
  language: string[];
  license: string;
  quality: string;
  version: string;
}

interface Benchmark {
  name: string;
  score: number;
  rank: number;
  total: number;
}

export default function DatasetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      const datasetId = parseInt(params.id as string);
      const stored = localStorage.getItem('datasets');
      if (stored) {
        const datasets = JSON.parse(stored);
        const foundDataset = datasets.find((d: Dataset) => d.id === datasetId);
        setDataset(foundDataset || null);
      }
      setLoading(false);
    }
  }, [params.id]);

  // Mock benchmarks data for datasets
  const benchmarks: Benchmark[] = [
    { name: 'Data Quality', score: 94.2, rank: 2, total: 150 },
    { name: 'Coverage', score: 87.5, rank: 5, total: 150 },
    { name: 'Diversity', score: 91.8, rank: 3, total: 150 },
    { name: 'Consistency', score: 89.1, rank: 4, total: 150 },
    { name: 'Accessibility', score: 96.7, rank: 1, total: 150 },
    { name: 'Documentation', score: 82.3, rank: 8, total: 150 },
    { name: 'Licensing', score: 95.4, rank: 2, total: 150 },
    { name: 'Community', score: 78.9, rank: 12, total: 150 },
  ];

  // Mock use cases
  const useCases = [
    'Language Model Training',
    'Computer Vision Research',
    'Speech Recognition',
    'Natural Language Processing',
    'Machine Learning Evaluation',
    'Academic Research',
  ];

  // Initialize edit data when dataset loads
  useEffect(() => {
    if (dataset) {
      setEditData({
        name: dataset.name,
        description: dataset.description,
        size: dataset.size,
        format: dataset.format,
        price: dataset.price,
        domain: dataset.domain,
        language: dataset.language,
        license: dataset.license,
        quality: dataset.quality,
        version: dataset.version,
        useCases: useCases,
        benchmarks: benchmarks,
      });
    }
  }, [dataset]);

  const handleDeleteDataset = async () => {
    if (deleteConfirmation !== dataset?.name) {
      return;
    }

    setIsDeleting(true);

    try {
      // Get existing datasets from localStorage
      const existingDatasets = localStorage.getItem('datasets');
      const datasets = existingDatasets ? JSON.parse(existingDatasets) : [];
      
      // Filter out the dataset to delete
      const updatedDatasets = datasets.filter((d: Dataset) => d.id !== dataset?.id);
      
      // Save updated datasets to localStorage
      localStorage.setItem('datasets', JSON.stringify(updatedDatasets));
      
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Dataset Deleted",
        description: `${dataset?.name} has been successfully deleted`,
        variant: "success",
      });
      
      // Navigate back to datasets page
      router.push('/datasets');
    } catch (error) {
      console.error('Error deleting dataset:', error);
      toast({
        title: "Error",
        description: "Failed to delete dataset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-4">Dataset Not Found</h1>
          <button
            onClick={() => router.push('/datasets')}
            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            Back to Datasets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/datasets')}
            className="flex items-center space-x-2 text-slate-900 hover:text-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base font-normal">Datasets</span>
          </button>
        </div>

        {/* Dataset Details Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
          {/* Dataset Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center space-x-4">
              {/* Dataset Avatar */}
              <DatasetAvatar dataset={dataset} size="lg" />
              
              {/* Dataset Info */}
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">{dataset.name}</h1>
                <p className="text-slate-600 text-sm">{dataset.description}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
                <span className="text-sm font-medium">Download Dataset</span>
              </button>
            </div>
          </div>

          {/* Dataset Stats Grid */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* License */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-500 mb-2">LICENSE</div>
                <div className="text-lg font-bold text-black mb-1">{dataset.license.toLowerCase()}</div>
                <div className="text-sm text-slate-900">{dataset.license}</div>
              </div>
              
              {/* Size */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-500 mb-2">SIZE</div>
                <div className="text-lg font-bold text-black mb-1">{dataset.size}</div>
                <div className="text-sm text-slate-900">Dataset Size</div>
              </div>
              
              {/* Format */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-500 mb-2">FORMAT</div>
                <div className="text-lg font-bold text-black mb-1">{dataset.format}</div>
                <div className="text-sm text-slate-900">Data Format</div>
              </div>
              
              {/* Quality */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-500 mb-2">QUALITY</div>
                <div className="text-lg font-bold text-black mb-1">{dataset.quality}</div>
                <div className="text-sm text-slate-900">Data Quality</div>
              </div>
              
              {/* Version */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-500 mb-2">VERSION</div>
                <div className="text-lg font-bold text-black mb-1">{dataset.version}</div>
                <div className="text-sm text-slate-900">Current Version</div>
              </div>
            </div>
          </div>

          {/* Use Cases Description */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Use Cases</h2>
            <p className="text-sm text-slate-600">
              {dataset.name} is designed for {dataset.domain.join(', ').toLowerCase()} applications. It is well suited for {useCases.slice(0, 3).join(', ').toLowerCase()} and related tasks.
            </p>
          </div>
        </div>

        {/* Benchmarks */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          {/* Clean Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Dataset Metrics</h2>
              <p className="text-sm text-slate-500 mt-1">Quality and performance metrics</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {benchmarks.filter(b => b.score > 0).length} metrics
              </div>
              <button className="text-slate-600 hover:text-slate-900 p-2 rounded-md hover:bg-slate-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Compact Table Layout */}
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Metric</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {benchmarks.map((benchmark, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-slate-900">{benchmark.name}</div>
                        <div className="text-xs text-slate-500">#{benchmark.rank} of {benchmark.total}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          benchmark.score > 0 ? 'bg-green-500' : 'bg-slate-300'
                        }`}></div>
                        <span className="text-sm font-medium text-slate-900">
                          {benchmark.score > 0 ? `${benchmark.score}%` : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-900">
                        {benchmark.rank > 0 ? `#${benchmark.rank}` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-slate-900 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(benchmark.score / 100) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Dataset Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Delete this dataset</h2>
          
          <div className="space-y-6">
            <p className="text-sm text-black">
              This action cannot be undone. This will permanently delete the {dataset.name} dataset and its files.
            </p>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-900">
                Please type {dataset.name} to confirm.
              </label>
              
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={dataset.name}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent placeholder:text-slate-400 text-slate-900 bg-white"
              />
            </div>
            
            <button 
              onClick={handleDeleteDataset}
              disabled={deleteConfirmation !== dataset.name || isDeleting}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                deleteConfirmation !== dataset.name || isDeleting
                  ? 'bg-slate-900/50 text-white cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
              }`}
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                'I understand, delete this dataset'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 