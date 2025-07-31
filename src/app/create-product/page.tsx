'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Product } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function CreateProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [license, setLicense] = useState('');
  const [visibility, setVisibility] = useState('public');

  const handleCreate = useCallback(() => {
    if (!productName.trim() || !license) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newProduct: Product = {
      id: Date.now(),
      name: productName.trim(),
      description: `A new ${visibility} product with ${license} license`,
      updated: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      intelligence: 'High',
      speed: 'Medium',
      price: 0,
      input: ['text'],
      output: ['text'],
      license: license.toUpperCase(),
      languages: ['English'],
      scalability: 'Medium',
    };
    
    try {
      const existingProducts = localStorage.getItem('products');
      const products = existingProducts ? JSON.parse(existingProducts) : [];
      products.unshift(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
      
      toast({
        title: "Product Created",
        description: `${productName.trim()} has been successfully created`,
        variant: "success",
      });
      
      router.push('/');
    } catch (error) {
      console.error('Failed to create product:', error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  }, [productName, license, visibility, router, toast]);

  const handleCancel = useCallback(() => {
    router.push('/');
  }, [router]);

  const isFormValid = productName.trim() && license;

  return (
    <div className="bg-white min-h-screen">
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
              onClick={handleCreate}
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isFormValid
                  ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                  : 'bg-slate-900/50 text-white cursor-not-allowed'
              }`}
            >
              Create
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center pt-16 pb-8">
        <h2 className="text-2xl font-semibold text-black tracking-tight mb-10">
          Create a new product
        </h2>

        <div className="w-full max-w-md space-y-6 px-4">
          {/* Product Name */}
          <div className="space-y-1.5">
            <Label htmlFor="product-name" className="text-sm font-medium text-slate-900">
              Product name <span className="text-red-500">*</span>
            </Label>
            <input
              id="product-name"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Give your product a name"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent placeholder:text-slate-400 text-slate-900 bg-white"
            />
          </div>

          {/* License */}
          <div className="space-y-1.5">
            <Label htmlFor="license" className="text-sm font-medium text-slate-900">
              License <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <select
                id="license"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white appearance-none cursor-pointer"
              >
                <option value="">Select a license *</option>
                <option value="mit">MIT</option>
                <option value="apache-2.0">Apache 2.0</option>
                <option value="gpl-3.0">GPL 3.0</option>
                <option value="bsd-3">BSD 3-Clause</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200"></div>

          {/* Visibility */}
          <RadioGroup value={visibility} onValueChange={setVisibility} className="space-y-4">
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="public" id="public" className="mt-0.5" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="public" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Public
                </Label>
                <p className="text-sm text-slate-500">
                  Anyone on the internet can see this product. Only you can commit.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem value="private" id="private" className="mt-0.5" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="private" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Private
                </Label>
                <p className="text-sm text-slate-500">
                  Only you can see and commit to this product.
                </p>
              </div>
            </div>
          </RadioGroup>

          <div className="border-t border-slate-200"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreate}
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isFormValid
                  ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                  : 'bg-slate-900/50 text-white cursor-not-allowed'
              }`}
            >
              Create
            </button>
            <button
              onClick={handleCancel}
              className="bg-white border border-slate-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors text-slate-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 