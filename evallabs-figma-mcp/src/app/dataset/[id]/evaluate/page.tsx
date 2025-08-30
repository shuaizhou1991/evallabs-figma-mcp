'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDatasets } from '@/lib/datasets';
import { getProducts } from '@/lib/data';
import { Dataset } from '@/lib/datasets';
import { Product } from '@/lib/data';
import DatasetAvatar from '@/components/DatasetAvatar';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';

interface EvaluationConfig {
  datasetId: number;
  selectedProducts: number[];
  evaluationType: 'full' | 'sample';
  sampleSize?: number;
  priority: 'speed' | 'accuracy' | 'balanced';
}

export default function DatasetEvaluatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [evaluationType, setEvaluationType] = useState<'full' | 'sample'>('sample');
  const [sampleSize, setSampleSize] = useState(100);
  const [priority, setPriority] = useState<'speed' | 'accuracy' | 'balanced'>('balanced');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'image' | 'audio' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'intelligence' | 'speed' | 'price'>('name');
  const [isStartingEvaluation, setIsStartingEvaluation] = useState(false);

  useEffect(() => {
    const datasets = getDatasets();
    const foundDataset = datasets.find(d => d.id === Number(params.id));
    if (foundDataset) {
      setDataset(foundDataset);
    }
    
    const allProducts = getProducts();
    setProducts(allProducts);
    setLoading(false);
  }, [params.id]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || 
                         product.input.includes(filterType) || 
                         product.output.includes(filterType);
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'intelligence':
          const intelligenceOrder = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return intelligenceOrder[b.intelligence as keyof typeof intelligenceOrder] - 
                 intelligenceOrder[a.intelligence as keyof typeof intelligenceOrder];
        case 'speed':
          const speedOrder = { 'Fast': 3, 'Medium': 2, 'Slow': 1 };
          return speedOrder[b.speed as keyof typeof speedOrder] - 
                 speedOrder[a.speed as keyof typeof speedOrder];
        case 'price':
          return a.price - b.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleProductToggle = useCallback((productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedProducts(filteredProducts.map(p => p.id));
  }, [filteredProducts]);

  const handleDeselectAll = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const handleStartEvaluation = useCallback(async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product to evaluate",
        variant: "destructive",
      });
      return;
    }

    setIsStartingEvaluation(true);

    try {
      // Simulate evaluation start
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save evaluation configuration
      const evaluationConfig: EvaluationConfig = {
        datasetId: Number(params.id),
        selectedProducts,
        evaluationType,
        sampleSize: evaluationType === 'sample' ? sampleSize : undefined,
        priority,
      };

      // Store evaluation config in localStorage
      const existingEvaluations = localStorage.getItem('evaluations') || '[]';
      const evaluations = JSON.parse(existingEvaluations);
      evaluations.push({
        ...evaluationConfig,
        id: Date.now(),
        status: 'running',
        startTime: new Date().toISOString(),
        progress: 0,
      });
      localStorage.setItem('evaluations', JSON.stringify(evaluations));

      toast({
        title: "Evaluation Started",
        description: `Started evaluation for ${selectedProducts.length} product(s) on ${dataset?.name}`,
        variant: "success",
      });

      // Navigate back to dataset detail page
      router.push(`/dataset/${params.id}`);
    } catch (error) {
      console.error('Failed to start evaluation:', error);
      toast({
        title: "Error",
        description: "Failed to start evaluation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStartingEvaluation(false);
    }
  }, [selectedProducts, evaluationType, sampleSize, priority, params.id, dataset?.name, router, toast]);

  const handleCancel = useCallback(() => {
    router.push(`/dataset/${params.id}`);
  }, [router, params.id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!dataset) {
    return (
      <ProtectedRoute>
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
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 text-slate-900 hover:text-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-base font-normal">Back to Dataset</span>
            </button>
          </div>

          {/* Header */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <DatasetAvatar dataset={dataset} size="lg" />
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Evaluate Dataset</h1>
                <p className="text-slate-600">{dataset.name}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Select products to run evaluation on this dataset
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500">
                  {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">Select Products</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={handleDeselectAll}
                      className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'text' | 'image' | 'audio' | 'video')}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'intelligence' | 'speed' | 'price')}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="intelligence">Sort by Intelligence</option>
                    <option value="speed">Sort by Speed</option>
                    <option value="price">Sort by Price</option>
                  </select>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedProducts.includes(product.id)
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleProductToggle(product.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleProductToggle(product.id)}
                          className="mt-1 h-4 w-4 text-slate-900 focus:ring-slate-500 border-slate-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-medium text-slate-900 truncate">
                              {product.name}
                            </h3>
                            <span className="text-xs text-slate-500">${product.price}</span>
                          </div>
                          <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>{product.intelligence} Intelligence</span>
                            <span>{product.speed} Speed</span>
                            <span>{product.input.join(', ')} → {product.output.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    No products found matching your criteria
                  </div>
                )}
              </div>
            </div>

            {/* Evaluation Configuration */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Evaluation Settings</h2>

                <div className="space-y-6">
                  {/* Evaluation Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Evaluation Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="sample"
                          checked={evaluationType === 'sample'}
                          onChange={(e) => setEvaluationType(e.target.value as 'full' | 'sample')}
                          className="h-4 w-4 text-slate-900 focus:ring-slate-500 border-slate-300"
                        />
                        <span className="ml-2 text-sm text-slate-900">Sample Evaluation</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="full"
                          checked={evaluationType === 'full'}
                          onChange={(e) => setEvaluationType(e.target.value as 'full' | 'sample')}
                          className="h-4 w-4 text-slate-900 focus:ring-slate-500 border-slate-300"
                        />
                        <span className="ml-2 text-sm text-slate-900">Full Dataset</span>
                      </label>
                    </div>
                  </div>

                  {/* Sample Size */}
                  {evaluationType === 'sample' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Sample Size
                      </label>
                      <select
                        value={sampleSize}
                        onChange={(e) => setSampleSize(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      >
                        <option value={50}>50 samples</option>
                        <option value={100}>100 samples</option>
                        <option value={250}>250 samples</option>
                        <option value={500}>500 samples</option>
                        <option value={1000}>1000 samples</option>
                      </select>
                    </div>
                  )}

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Evaluation Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as 'speed' | 'accuracy' | 'balanced')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="balanced">Balanced</option>
                      <option value="speed">Speed</option>
                      <option value="accuracy">Accuracy</option>
                    </select>
                  </div>

                  {/* Summary */}
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="text-sm font-medium text-slate-900 mb-2">Summary</h3>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div>Products: {selectedProducts.length}</div>
                      <div>Type: {evaluationType === 'sample' ? `Sample (${sampleSize})` : 'Full'}</div>
                      <div>Priority: {priority}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleStartEvaluation}
                      disabled={selectedProducts.length === 0 || isStartingEvaluation}
                      className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProducts.length === 0 || isStartingEvaluation
                          ? 'bg-slate-900/50 text-white cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                      }`}
                    >
                      {isStartingEvaluation ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Starting Evaluation...
                        </div>
                      ) : (
                        'Start Evaluation'
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full px-4 py-2 border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors text-slate-900"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 