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
  productLink?: string;
  suitedTasks?: string;
  visibility?: string;
  languages?: string[];
  scalability?: string;
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

  // Function to validate URL
  const isValidUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

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
        productLink: product.productLink || '',
        visibility: product.visibility || 'public',
        suitedTasks: product.suitedTasks || '',
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
              <button 
                onClick={() => router.push(`/product/${product.id}/edit`)}
                className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium">Edit</span>
              </button>
              {product.productLink && isValidUrl(product.productLink) && (
                <button 
                  onClick={() => window.open(product.productLink, '_blank')}
                  className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
                >
                  <span className="text-sm font-medium">Open the Product</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Stats Grid */}
          <div className="bg-white border border-slate-200 rounded-lg py-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 min-w-0">
              {/* License */}
              <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                  <p className="block leading-[20px]">LICENSE</p>
                </div>
                <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                  <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap">
                    <p className="block leading-[20px] whitespace-pre">{product.license.toLowerCase()}</p>
                  </div>
                </div>
                <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                  <p className="block leading-[24px]">{product.license.toLowerCase()}</p>
                </div>
              </div>

              {/* Speed */}
              <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                  <p className="block leading-[20px]">SPEED</p>
                </div>
                <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                  {(() => {
                    const speedLevels = ['Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast'];
                    const currentSpeedIndex = speedLevels.indexOf(product.speed);
                    const thunderCount = currentSpeedIndex + 1;

                    return Array.from({ length: thunderCount }, (_, i) => (
                      <div key={i} className="relative shrink-0 size-5">
                        <div className="absolute bottom-[-8.333%] left-[8.333%] right-[8.333%] top-[-8.333%]">
                          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.35751 10.6291L12.4399 1.47397C13.1904 0.717497 14.4458 1.50301 14.0937 2.50872L12.5493 6.91954C12.3216 7.56974 12.8042 8.25001 13.4931 8.25001H15.8589C16.7582 8.25001 17.2005 9.34445 16.5537 9.96924L7.61222 18.6067C6.84658 19.3463 5.60902 18.5365 5.9802 17.5388L7.41501 13.682C7.65807 13.0287 7.17486 12.3333 6.47777 12.3333H4.06742C3.17844 12.3333 2.73141 11.2602 3.35751 10.6291Z" fill="black" strokeWidth="1"/>
                          </svg>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                  <p className="block leading-[24px]">{product.speed}</p>
                </div>
              </div>



              {/* Input */}
              <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                  <p className="block leading-[20px]">INPUT</p>
                </div>
                <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                  {/* Text Icon - only show if product has text input */}
                  {product.input.some(input => input.toLowerCase() === 'text') && (
                    <div className="relative shrink-0 size-5">
                      <div className="absolute bottom-[-8.333%] left-[8.333%] right-[8.333%] top-[-8.333%]">
                        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6.6665 6.66666H13.3332" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M9 14.1667C9 14.719 9.44772 15.1667 10 15.1667C10.5523 15.1667 11 14.719 11 14.1667H9ZM10 7.5H9V14.1667H10H11V7.5H10Z" fill="currentColor"/>
                          <path d="M5.6665 8.33332C5.6665 8.88561 6.11422 9.33332 6.6665 9.33332C7.21879 9.33332 7.6665 8.88561 7.6665 8.33332H5.6665ZM6.6665 6.66666H5.6665V8.33332H6.6665H7.6665V6.66666H6.6665Z" fill="currentColor"/>
                          <path d="M12.3335 8.33332C12.3335 8.88561 12.7812 9.33332 13.3335 9.33332C13.8858 9.33332 14.3335 8.88561 14.3335 8.33332H12.3335ZM13.3335 6.66666H12.3335V8.33332H13.3335H14.3335V6.66666H13.3335Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  {/* Image Icon - only show if product has image input */}
                  {product.input.some(input => input.toLowerCase() === 'image') && (
                    <div className="relative shrink-0 size-5">
                      <div className="absolute bottom-[-8.333%] left-[8.333%] right-[8.333%] top-[-8.333%]">
                        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7.50016 9.16668C8.42064 9.16668 9.16683 8.42049 9.16683 7.50001C9.16683 6.57954 8.42064 5.83334 7.50016 5.83334C6.57969 5.83334 5.8335 6.57954 5.8335 7.50001C5.8335 8.42049 6.57969 9.16668 7.50016 9.16668Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.5 12.5L14.9283 9.92835C14.6158 9.61589 14.1919 9.44037 13.75 9.44037C13.3081 9.44037 12.8842 9.61589 12.5717 9.92835L5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  {/* Audio Icon - only show if product has audio input */}
                  {product.input.some(input => input.toLowerCase() === 'audio') && (
                    <div className="relative shrink-0 size-5">
                      <div className="absolute bottom-[-8.333%] left-[8.333%] right-[8.333%] top-[-8.333%]">
                        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 6.66666V13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M6.6665 8.33334V11.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M13.3335 8.33334V11.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                  <p className="block leading-[24px]">
                    {product.input.length === 0 
                      ? 'Select input types...' 
                      : product.input.map(input => input.charAt(0).toUpperCase() + input.slice(1)).join(' · ')
                    }
                  </p>
                </div>
              </div>

              {/* Languages */}
              <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                  <p className="block leading-[20px]">LANGUAGES</p>
                </div>
                <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                  <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap">
                    <p className="block leading-[20px]">
                      {(() => {
                        const languageAbbrs: { [key: string]: string } = {
                          'English': 'EN',
                          'Spanish': 'ES',
                          'French': 'FR',
                          'German': 'DE',
                          'Chinese': 'ZH',
                          'Japanese': 'JA',
                          'Korean': 'KO',
                          'Arabic': 'AR',
                          'Hindi': 'HI',
                          'Portuguese': 'PT'
                        };

                        const selectedLanguages = Array.isArray(product.languages) ? product.languages : [];
                        const firstThree = selectedLanguages.slice(0, 3);
                        const abbreviations = firstThree.map((lang: string) => languageAbbrs[lang] || lang.substring(0, 2).toUpperCase());

                        return abbreviations.length > 0 ? abbreviations.join(', ') : 'EN';
                      })()}
                    </p>
                  </div>
                </div>
                <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                  <p className="block leading-[24px]">
                    {(() => {
                      const selectedLanguages = Array.isArray(product.languages) ? product.languages : [];
                      if (selectedLanguages.length === 0) {
                        return 'Select languages...';
                      } else if (selectedLanguages.length <= 3) {
                        return selectedLanguages.join(' · ');
                      } else {
                        return `+ ${selectedLanguages.length - 3} more`;
                      }
                    })()}
                  </p>
                </div>
              </div>

              {/* Scalability */}
              <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                  <p className="block leading-[20px]">SCALABILITY</p>
                </div>
                <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                  {(() => {
                    const scalabilityLevels = ['Low', 'Medium', 'High', 'Higher', 'Highest'];
                    const currentScalabilityIndex = scalabilityLevels.indexOf(product.scalability || 'Medium');
                    const dotCount = currentScalabilityIndex + 1;

                    return Array.from({ length: dotCount }, (_, i) => (
                      <div key={i} className="relative shrink-0 size-5">
                        <div className="w-5 h-5 bg-black rounded-full"></div>
                      </div>
                    ));
                  })()}
                </div>
                <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                  <p className="block leading-[24px]">{product.scalability || 'Medium'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Suited Tasks Description */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Suited Tasks</h2>
            <p className="text-sm text-slate-600">
              {product.suitedTasks || `${product.name} is our flagship model for complex tasks. It is well suited for problem solving across domains.`}
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