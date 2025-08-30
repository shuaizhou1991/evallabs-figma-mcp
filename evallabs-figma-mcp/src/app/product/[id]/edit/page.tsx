'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/data';
import ProductAvatar from '@/components/ProductAvatar';

interface ProductEditData {
  name: string;
  description: string;
  intelligence: string;
  speed: string;
  price: number;
  input: string[];
  output: string[];
  license: string;
  productLink: string;
  suitedTasks: string;
  visibility: 'public' | 'private';
  languages: string[];
  scalability: string;
}

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<ProductEditData | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [nameError, setNameError] = useState(false);
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
        
        if (foundProduct) {
          setEditData({
            name: foundProduct.name,
            description: foundProduct.description,
            intelligence: foundProduct.intelligence,
            speed: foundProduct.speed,
            price: foundProduct.price,
            input: foundProduct.input,
            output: foundProduct.output,
            license: foundProduct.license,
            productLink: foundProduct.productLink || '',
            suitedTasks: foundProduct.suitedTasks || 'This product is suitable for any personal related tasks.',
            visibility: foundProduct.visibility || 'private',
            languages: foundProduct.languages || ['English'],
            scalability: foundProduct.scalability || 'Medium',
          });
        }
      }
      setLoading(false);
    }
  }, [params.id]);

  const handleSave = async () => {
    if (!product || !editData) return;

    // Validate required fields
    if (!editData.name || editData.name.trim() === '') {
      setNameError(true);
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }
    
    setNameError(false);

    setIsSaving(true);

    try {
      const existingProducts = localStorage.getItem('products');
      const products = existingProducts ? JSON.parse(existingProducts) : [];
      
      const updatedProducts = products.map((p: Product) => 
        p.id === product.id 
          ? { ...p, ...editData, updated: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          : p
      );
      
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Product Updated",
        description: `${editData.name} has been successfully updated`,
        variant: "success",
      });
      
      router.push(`/product/${product.id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/product/${product?.id}`);
  };

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

  const handleInputChange = (field: keyof ProductEditData, value: string | number | string[]) => {
    setEditData((prev) => (prev ? {
      ...prev,
      [field]: value
    } : null));
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleInputChange(name as keyof ProductEditData, value);
  };

  const [hiddenTags, setHiddenTags] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleRemoveTag = (tagToRemove: string) => {
    setHiddenTags(prev => [...prev, tagToRemove]);
  };

  const handleAddTag = () => {
    if (hiddenTags.length > 0) {
      // Restore the first hidden tag
      const tagToRestore = hiddenTags[0];
      setHiddenTags(prev => prev.filter(tag => tag !== tagToRestore));
    } else {
      // Create a new dynamic tag if no hidden tags exist
      const newTag = `tag-${Date.now()}`;
      setTags(prev => [...prev, newTag]);
    }
  };

  const handleDropdownToggle = (field: string) => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  const handleDropdownSelect = (field: string, value: string) => {
    if (!editData) return;
    if (field === 'input' || field === 'languages') {
      // For multi-select fields, toggle the value in the array
      const currentValues = editData[field as keyof ProductEditData] || [];
      if (Array.isArray(currentValues)) {
        const newValues = currentValues.includes(value)
          ? currentValues.filter((item: string) => item !== value)
          : [...currentValues, value];
        handleInputChange(field as keyof ProductEditData, newValues);
      }
      // Don't close dropdown for multi-select fields
    } else {
      // For other fields, replace the value
      handleInputChange(field as keyof ProductEditData, value);
      setOpenDropdown(null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!product || !editData) {
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
    <div className="bg-slate-50 relative size-full min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-50">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">E</span>
            </div>
            <h1 className="text-xl font-semibold text-black tracking-tight">Eval Labs</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="bg-white border border-slate-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isSaving
                  ? 'bg-slate-900/50 text-white cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Card */}
      <div className="mx-auto bg-white border border-slate-200 box-border content-stretch flex flex-col gap-8 items-start justify-start px-8 py-6 rounded-lg mt-6 w-[1200px] max-w-[calc(100vw-48px)]">
        <div className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-lg" />
        
        {/* Product Header Section */}
        <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
          <div className="basis-0 box-border content-stretch flex flex-row gap-4 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
            {/* Product Avatar */}
            <div className="w-[84px] h-[84px] bg-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-slate-600 font-bold text-2xl">
                {(() => {
                  const name = product.name.toLowerCase();
                  if (name.includes('gpt') || name.includes('claude') || name.includes('gemini') || name.includes('llama') || name.includes('mistral')) return '🤖';
                  if (name.includes('dall-e') || name.includes('stable') || name.includes('midjourney')) return '🎨';
                  if (name.includes('whisper') || name.includes('tts') || name.includes('voice') || name.includes('audio')) return '🎵';
                  if (name.includes('video') || name.includes('gen-') || name.includes('pika') || name.includes('synthesia')) return '🎬';
                  if (name.includes('code') || name.includes('stable code')) return '💻';
                  return '📦';
                })()}
              </span>
            </div>
            
            {/* Product Info */}
            <div className="basis-0 box-border content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
              <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                <div className="font-semibold leading-0 not-italic relative shrink-0 text-[20px] text-left text-slate-900 tracking-[-0.1px] w-[480px]">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => {
                      handleInputChange('name', e.target.value);
                      if (nameError && e.target.value.trim() !== '') {
                        setNameError(false);
                      }
                    }}
                    className={`block leading-[28px] bg-transparent border-none outline-none w-full text-[20px] font-semibold ${
                      nameError ? 'text-red-600' : 'text-slate-900'
                    }`}
                    placeholder="Enter product name... *"
                    required
                  />
                  {nameError && (
                    <div className="text-red-500 text-sm mt-1">
                      Product name is required
                    </div>
                  )}
                </div>
                <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center px-4 py-0.5 relative rounded-2xl shrink-0">
                  <div className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-2xl" />
                  <div className="font-normal relative shrink-0 text-black text-[14px] text-left text-nowrap leading-[24px]">
                    <select
                      value={editData.visibility}
                      onChange={(e) => handleInputChange('visibility', e.target.value)}
                      className="bg-transparent border-none outline-none cursor-pointer font-normal text-[14px] text-black appearance-none pr-1 leading-[24px]"
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                  <div className="overflow-clip relative shrink-0 size-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Description Input */}
              <div className="box-border content-stretch flex flex-col gap-1.5 items-start justify-start p-0 relative shrink-0 w-full">
                <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shrink-0 w-full">
                  <div className="basis-0 box-border content-stretch flex flex-col gap-1.5 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
                    <div className="bg-white box-border content-stretch flex flex-row items-center justify-start pl-3 pr-3 py-2 relative rounded-md shrink-0 w-full">
                      <div className="absolute border border-slate-300 border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
                      <input
                        type="text"
                        value={editData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="font-normal leading-0 not-italic relative shrink-0 text-[16px] text-left text-nowrap text-slate-900 bg-transparent border-none outline-none w-full placeholder:text-slate-400"
                        placeholder="Enter a short description of your product..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

                {/* Product Link Input */}
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full">
          <div className="font-medium leading-0 not-italic relative shrink-0 text-[14px] text-left text-nowrap text-slate-900">
            Product link
          </div>
          <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shrink-0 w-full">
            <div className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
              <div className="bg-white box-border content-stretch flex flex-row items-center justify-start pl-3 pr-3 py-2 relative rounded-md shrink-0 w-full">
                <div className="absolute border border-slate-300 border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
                <input
                  type="text"
                  value={editData.productLink}
                  onChange={(e) => handleInputChange('productLink', e.target.value)}
                  className="font-normal leading-0 not-italic relative shrink-0 text-[16px] text-left text-nowrap text-slate-900 bg-transparent border-none outline-none w-full"
                  placeholder="Enter product URL (e.g., https://www.mynewproduct.com)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Stats Grid */}
        <div className="bg-white border border-slate-200 rounded-lg py-5 mb-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 w-full">
            {/* License */}
            <div className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0 relative">
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                <p className="block leading-[20px]">LICENSE</p>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap">
                  <p className="block leading-[20px]">{editData.license}</p>
                </div>
              </div>
              <div className="relative dropdown-container">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDropdownToggle('license')}>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900">
                    <p className="block leading-[24px]">{editData.license}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openDropdown === 'license' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 min-w-[200px]">
                    {['apache-2.0', 'MIT', 'GPL 3.0', 'BSD 3-Clause', 'Proprietary'].map((option) => {
                      const isSelected = editData.license === option;
                      return (
                        <div
                          key={option}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-900 hover:bg-slate-50'
                          }`}
                          onClick={() => handleDropdownSelect('license', option)}
                        >
                          <span>{option}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Speed */}
            {!hiddenTags.includes('speed') && (
            <div className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0 relative">
              <button 
                onClick={() => handleRemoveTag('speed')}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                <p className="block leading-[20px]">SPEED</p>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                {(() => {
                  const speedLevels = ['Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast'];
                  const currentSpeedIndex = speedLevels.indexOf(editData.speed);
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
              <div className="relative dropdown-container">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDropdownToggle('speed')}>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900">
                    <p className="block leading-[24px]">{editData.speed}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openDropdown === 'speed' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 min-w-[200px]">
                    {['Very Slow', 'Slow', 'Medium', 'Fast', 'Very Fast'].map((option) => {
                      const isSelected = editData.speed === option;
                      return (
                        <div
                          key={option}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-900 hover:bg-slate-50'
                          }`}
                          onClick={() => handleDropdownSelect('speed', option)}
                        >
                          <span>{option}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Input */}
            {!hiddenTags.includes('input') && (
            <div className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0 relative">
              <button 
                onClick={() => handleRemoveTag('input')}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                <p className="block leading-[20px]">INPUT</p>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                {/* Text Icon - only show if product has text input */}
                {editData.input.some((input: string) => input.toLowerCase() === 'text') && (
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
                {editData.input.some((input: string) => input.toLowerCase() === 'image') && (
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
                {editData.input.some((input: string) => input.toLowerCase() === 'audio') && (
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
              <div className="relative dropdown-container">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDropdownToggle('input')}>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900">
                    <p className="block leading-[24px]">
                      {editData.input.length === 0 
                        ? 'Select input types...' 
                        : editData.input.map((input: string) => input.charAt(0).toUpperCase() + input.slice(1)).join(' · ')
                      }
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openDropdown === 'input' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 min-w-[200px]">
                    {['Text', 'Image', 'Audio', 'Video'].map((option) => {
                      const isSelected = editData.input.some((input: string) => input.toLowerCase() === option.toLowerCase());
                      return (
                        <div
                          key={option}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-900 hover:bg-slate-50'
                          }`}
                          onClick={() => handleDropdownSelect('input', option)}
                        >
                          <span>{option}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Languages */}
            {!hiddenTags.includes('languages') && (
            <div className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0 relative">
              <button 
                onClick={() => handleRemoveTag('languages')}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
                      
                      const selectedLanguages = Array.isArray(editData.languages) ? editData.languages : [];
                      const firstThree = selectedLanguages.slice(0, 3);
                      const abbreviations = firstThree.map((lang: string) => languageAbbrs[lang] || lang.substring(0, 2).toUpperCase());
                      
                      return abbreviations.length > 0 ? abbreviations.join(', ') : 'EN';
                    })()}
                  </p>
                </div>
              </div>
              <div className="relative dropdown-container">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDropdownToggle('languages')}>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900">
                    <p className="block leading-[24px]">
                                             {(() => {
                         const selectedLanguages = Array.isArray(editData.languages) ? editData.languages : [];
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
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openDropdown === 'languages' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 min-w-[200px]">
                    {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Portuguese'].map((option) => {
                      const isSelected = Array.isArray(editData.languages) ? editData.languages.includes(option) : false;
                      return (
                        <div
                          key={option}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-900 hover:bg-slate-50'
                          }`}
                          onClick={() => handleDropdownSelect('languages', option)}
                        >
                          <span>{option}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Scalability */}
            {!hiddenTags.includes('scalability') && (
            <div className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0 relative">
              <button 
                onClick={() => handleRemoveTag('scalability')}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                <p className="block leading-[20px]">SCALABILITY</p>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                {(() => {
                  const scalabilityLevels = ['Low', 'Medium', 'High', 'Higher', 'Highest'];
                  const currentScalabilityIndex = scalabilityLevels.indexOf(editData.scalability || 'Medium');
                  const dotCount = currentScalabilityIndex + 1;

                  return Array.from({ length: dotCount }, (_, i) => (
                    <div key={i} className="relative shrink-0 size-5">
                      <div className="w-5 h-5 bg-black rounded-full"></div>
                    </div>
                  ));
                })()}
              </div>
              <div className="relative dropdown-container">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDropdownToggle('scalability')}>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900">
                    <p className="block leading-[24px]">{editData.scalability || 'Medium'}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openDropdown === 'scalability' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 min-w-[200px]">
                    {['Low', 'Medium', 'High', 'Higher', 'Highest'].map((option) => {
                      const isSelected = editData.scalability === option;
                      return (
                        <div
                          key={option}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-900 hover:bg-slate-50'
                          }`}
                          onClick={() => handleDropdownSelect('scalability', option)}
                        >
                          <span>{option}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Add New Tags */}
            {hiddenTags.length > 0 && (
            <div className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                <p className="block leading-[20px]">ADD</p>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                <button 
                  onClick={handleAddTag}
                  className="overflow-clip relative shrink-0 size-5 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                <p className="block leading-[24px]">New tags</p>
              </div>
            </div>
            )}

            {/* Dynamic Tags */}
            {tags.filter(tag => !hiddenTags.includes(tag)).map((tag, index) => (
              <div key={tag} className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0 relative">
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                  <p className="block leading-[20px]">TAG {index + 1}</p>
                </div>
                <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                  <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                </div>
                <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                  <p className="block leading-[24px]">{tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suited Tasks */}
        <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
          <div className="font-semibold leading-0 not-italic relative shrink-0 text-[18px] text-left text-nowrap text-slate-900">
            Suited Tasks
          </div>
          <div className="box-border content-stretch flex flex-col gap-1.5 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shrink-0 w-full">
              <div className="basis-0 box-border content-stretch flex flex-col gap-1.5 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
                <div className="bg-white box-border content-stretch flex flex-row items-start justify-start pl-3 pr-3 py-3 relative rounded-md shrink-0 w-full">
                  <div className="absolute border border-slate-300 border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
                  <textarea
                    value={editData.suitedTasks}
                    onChange={(e) => handleInputChange('suitedTasks', e.target.value)}
                    className="font-normal text-[16px] text-left text-slate-900 bg-transparent border-none outline-none w-full resize-none min-h-[80px]"
                    placeholder="Describe what tasks this product is suitable for..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Product Card - Outside main content */}
      <div className="mx-auto bg-white border border-slate-200 box-border content-stretch flex flex-col gap-6 items-start justify-start px-8 py-6 rounded-lg mt-6 w-[1200px] max-w-[calc(100vw-48px)]">
        <div className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-lg" />
        
        <h2 className="text-lg font-semibold text-slate-900">Delete this product</h2>
        
        <div className="space-y-6 w-full">
          <p className="text-sm text-black">
            This action cannot be undone. This will permanently delete the {product?.name} product and its files.
          </p>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-900">
              Please type {product?.name} to confirm.
            </label>
            
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={product?.name}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent placeholder:text-slate-400 text-slate-900 bg-white"
            />
          </div>
          
          <button 
            onClick={handleDeleteProduct}
            disabled={deleteConfirmation !== product?.name || isDeleting}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              deleteConfirmation !== product?.name || isDeleting
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
  );
} 