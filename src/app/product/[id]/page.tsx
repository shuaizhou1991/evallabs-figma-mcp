'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import ProductAvatar from '@/components/ProductAvatar';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  updated: string;
  intelligence: string;
  speed: string;
  price: number;
  input: string[];
  output: string[];
  license: string;
}

interface Benchmark {
  name: string;
  score: number;
  rank: number;
  total: number;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      const productId = parseInt(params.id as string);
      const stored = localStorage.getItem('products');
      if (stored) {
        const products = JSON.parse(stored);
        const foundProduct = products.find((p: Product) => p.id === productId);
        setProduct(foundProduct || null);
      }
      setLoading(false);
    }
  }, [params.id]);

  // Mock benchmarks data matching the Figma design
  const benchmarks: Benchmark[] = [
    { name: 'BooIQ', score: 84.8, rank: 3, total: 150 },
    { name: 'TriviaQA', score: 0, rank: 0, total: 150 },
    { name: 'CoQA', score: 0, rank: 0, total: 150 },
    { name: 'NQ', score: 86.1, rank: 5, total: 150 },
    { name: 'SQuAD', score: 75.0, rank: 8, total: 150 },
    { name: 'GPQA', score: 93.2, rank: 2, total: 150 },
    { name: 'ARC Challenge', score: 96.2, rank: 1, total: 150 },
    { name: 'MMLU', score: 61.3, rank: 12, total: 150 },
  ];

  // Mock suited tasks
  const suitedTasks = [
    'Text Generation',
    'Code Generation',
    'Question Answering',
    'Text Summarization',
    'Translation',
    'Sentiment Analysis',
  ];

  // Initialize edit data when product loads
  useEffect(() => {
    if (product) {
      setEditData({
        name: product.name,
        description: product.description,
        intelligence: product.intelligence,
        speed: product.speed,
        price: product.price,
        input: product.input,
        output: product.output,
        license: product.license,
        visibility: 'public', // Default value
        suitedTasks: suitedTasks,
        benchmarks: benchmarks,
      });
    }
  }, [product]);

  const handleDeleteProduct = async () => {
    if (deleteConfirmation !== product?.name) {
      return;
    }

    setIsDeleting(true);

    try {
      // Get existing products from localStorage
      const existingProducts = localStorage.getItem('products');
      const products = existingProducts ? JSON.parse(existingProducts) : [];
      
      // Filter out the product to delete
      const updatedProducts = products.filter((p: Product) => p.id !== product?.id);
      
      // Save updated products to localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Product Deleted",
        description: `${product?.name} has been successfully deleted`,
        variant: "success",
      });
      
      // Navigate back to products page
      router.push('/');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
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

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            Back to Products
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
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-slate-900 hover:text-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base font-normal">Products</span>
          </button>
        </div>

        {/* Product Details Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
          {/* Product Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center space-x-4">
              {/* Product Avatar */}
              <ProductAvatar product={product} size="lg" />
              
              {/* Product Info */}
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">{product.name}</h1>
                <p className="text-slate-600 text-sm">{product.description}</p>
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
                <span className="text-sm font-medium">Open the Product</span>
              </button>
            </div>
          </div>

          {/* Product Stats Grid */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* License */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-500 mb-2">LICENSE</div>
                <div className="text-lg font-bold text-black mb-1">{product.license.toLowerCase()}</div>
                <div className="text-sm text-slate-900">{product.license.toLowerCase()}</div>
              </div>
              
              {/* Speed */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-500 mb-2">SPEED</div>
                <div className="flex justify-center space-x-1 mb-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-5 h-5 bg-black rounded-full"></div>
                  ))}
                </div>
                <div className="text-sm text-slate-900">{product.speed}</div>
              </div>
              
              {/* Price */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-500 mb-2">PRICE</div>
                <div className="text-lg font-bold text-black mb-1">${product.price}</div>
                <div className="text-sm text-slate-900">Per 1M Tokens</div>
              </div>
              
              {/* Input */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-500 mb-2">INPUT</div>
                <div className="flex justify-center space-x-1 mb-1">
                  {product.input.map((type, index) => (
                    <div key={index} className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center">
                      <span className="text-xs font-medium">{type.charAt(0).toUpperCase()}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-slate-900">{product.input.join(' · ')}</div>
              </div>
              
              {/* Languages */}
              <div className="text-center">
                <div className="text-xs font-medium text-slate-500 mb-2">LANGUAGES</div>
                <div className="text-lg font-bold text-black mb-1">EN</div>
                <div className="text-sm text-slate-900">+ 25 More</div>
              </div>
            </div>
          </div>

          {/* Suited Tasks Description */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Suited Tasks</h2>
            <p className="text-sm text-slate-600">
              {product.name} is our flagship model for complex tasks. It is well suited for problem solving across domains.
            </p>
          </div>
        </div>

        {/* Plan B: Minimalist Dashboard Benchmarks */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          {/* Clean Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Benchmarks</h2>
              <p className="text-sm text-slate-500 mt-1">Performance metrics across datasets</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {benchmarks.filter(b => b.score > 0).length} active
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
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Dataset</th>
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

        {/* Delete Product Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Delete this product</h2>
          
          <div className="space-y-6">
            <p className="text-sm text-black">
              This action cannot be undone. This will permanently delete the {product.name} product and its files.
            </p>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-900">
                Please type {product.name} to confirm.
              </label>
              
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={product.name}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent placeholder:text-slate-400 text-slate-900 bg-white"
              />
            </div>
            
            <button 
              onClick={handleDeleteProduct}
              disabled={deleteConfirmation !== product.name || isDeleting}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                deleteConfirmation !== product.name || isDeleting
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
                'I understand, delete this product'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 