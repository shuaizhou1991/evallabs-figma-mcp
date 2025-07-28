'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dataset } from '@/lib/datasets';
import { useToast } from '@/hooks/use-toast';

export default function CreateDatasetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [datasetName, setDatasetName] = useState('');
  const [license, setLicense] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [format, setFormat] = useState('');
  const [size, setSize] = useState('');
  const [quality, setQuality] = useState('');

  const handleCreate = useCallback(() => {
    if (!datasetName.trim() || !license || !format || !size || !quality) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newDataset: Dataset = {
      id: Date.now(),
      name: datasetName.trim(),
      description: `A new ${visibility} dataset with ${format} format and ${quality} quality`,
      updated: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      size: size,
      format: format,
      price: 0,
      domain: ['General'],
      language: ['English'],
      license: license.toUpperCase(),
      quality: quality,
      version: '1.0',
    };
    
    try {
      const existingDatasets = localStorage.getItem('datasets');
      const datasets = existingDatasets ? JSON.parse(existingDatasets) : [];
      datasets.unshift(newDataset);
      localStorage.setItem('datasets', JSON.stringify(datasets));
      
      toast({
        title: "Dataset Created",
        description: `${datasetName.trim()} has been successfully created`,
        variant: "success",
      });
      
      router.push('/datasets');
    } catch (error) {
      console.error('Failed to create dataset:', error);
      toast({
        title: "Error",
        description: "Failed to create dataset. Please try again.",
        variant: "destructive",
      });
    }
  }, [datasetName, license, visibility, format, size, quality, router, toast]);

  const handleCancel = useCallback(() => {
    router.push('/datasets');
  }, [router]);

  const isFormValid = datasetName.trim() && license && format && size && quality;

  return (
    <div className="bg-white min-h-screen">
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

      <div className="flex flex-col items-center pt-16 pb-8">
        <h2 className="text-2xl font-semibold text-black tracking-tight mb-10">
          Create a new dataset
        </h2>

        <div className="w-full max-w-md space-y-6 px-4">
          <div className="space-y-1.5">
            <Label htmlFor="dataset-name" className="text-sm font-medium text-slate-900">
              Dataset name <span className="text-red-500">*</span>
            </Label>
            <input
              id="dataset-name"
              type="text"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              placeholder="Give your dataset a name"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent placeholder:text-slate-400 text-slate-900 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="format" className="text-sm font-medium text-slate-900">
              Format <span className="text-red-500">*</span>
            </Label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
            >
              <option value="">Select a format *</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
              <option value="code">Code</option>
              <option value="image-text">Image-Text</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="size" className="text-sm font-medium text-slate-900">
              Size <span className="text-red-500">*</span>
            </Label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
            >
              <option value="">Select a size *</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Very Large">Very Large</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quality" className="text-sm font-medium text-slate-900">
              Quality <span className="text-red-500">*</span>
            </Label>
            <select
              id="quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
            >
              <option value="">Select quality level *</option>
              <option value="Very High">Very High</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="license" className="text-sm font-medium text-slate-900">
              License <span className="text-red-500">*</span>
            </Label>
            <select
              id="license"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
            >
              <option value="">Select a license *</option>
              <option value="CC0">CC0</option>
              <option value="CC BY-SA">CC BY-SA</option>
              <option value="Fair Use">Fair Use</option>
              <option value="MIT">MIT</option>
              <option value="Apache 2.0">Apache 2.0</option>
              <option value="CC BY 4.0">CC BY 4.0</option>
              <option value="CC BY-NC 4.0">CC BY-NC 4.0</option>
            </select>
          </div>

          <div className="border-t border-slate-200"></div>

          <RadioGroup value={visibility} onValueChange={setVisibility} className="space-y-4">
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="public" id="public" className="mt-0.5" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="public" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Public
                </Label>
                <p className="text-sm text-slate-500">
                  Anyone on the internet can see this dataset. Only you can commit.
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
                  Only you can see and commit to this dataset.
                </p>
              </div>
            </div>
          </RadioGroup>

          <div className="border-t border-slate-200"></div>

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