'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Dataset } from '@/lib/datasets';
import DatasetAvatar from '@/components/DatasetAvatar';

interface DatasetEditData {
  name: string;
  description: string;
  size: string;
  format: string;
  price: number;
  domain: string[];
  language: string[];
  license: string;
  quality: string;
  version: string;
}

export default function DatasetEditPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<DatasetEditData | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [nameError, setNameError] = useState(false);
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
        
        if (foundDataset) {
          setEditData({
            name: foundDataset.name,
            description: foundDataset.description,
            size: foundDataset.size,
            format: foundDataset.format,
            price: foundDataset.price,
            domain: foundDataset.domain,
            language: foundDataset.language,
            license: foundDataset.license,
            quality: foundDataset.quality,
            version: foundDataset.version,
          });
        }
      }
      setLoading(false);
    }
  }, [params.id]);

  const handleSave = async () => {
    if (!dataset || !editData) return;

    // Validate required fields
    if (!editData.name || editData.name.trim() === '') {
      setNameError(true);
      toast({
        title: "Validation Error",
        description: "Dataset name is required",
        variant: "destructive",
      });
      return;
    }
    
    setNameError(false);

    setIsSaving(true);

    try {
      const existingDatasets = localStorage.getItem('datasets');
      const datasets = existingDatasets ? JSON.parse(existingDatasets) : [];
      
      const updatedDatasets = datasets.map((d: Dataset) => 
        d.id === dataset.id 
          ? { ...d, ...editData, updated: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          : d
      );
      
      localStorage.setItem('datasets', JSON.stringify(updatedDatasets));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Dataset Updated",
        description: `${editData.name} has been successfully updated`,
        variant: "success",
      });
      
      router.push(`/dataset/${dataset.id}`);
    } catch (error) {
      console.error('Error updating dataset:', error);
      toast({
        title: "Error",
        description: "Failed to update dataset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dataset/${dataset?.id}`);
  };

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

  const handleInputChange = (field: keyof DatasetEditData, value: string | number | string[]) => {
    setEditData((prev) => (prev ? {
      ...prev,
      [field]: value
    } : null));
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleInputChange(name as keyof DatasetEditData, value);
  };

  const [hiddenTags, setHiddenTags] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleRemoveTag = (tagToRemove: string) => {
    setHiddenTags(prev => [...prev, tagToRemove]);
  };

  const handleAddTag = () => {
    if (hiddenTags.length > 0) {
      const tagToRestore = hiddenTags[0];
      setHiddenTags(prev => prev.filter(tag => tag !== tagToRestore));
    } else {
      const newTag = `tag-${Date.now()}`;
      setTags(prev => [...prev, newTag]);
    }
  };

  const handleDropdownToggle = (field: string) => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  const handleDropdownSelect = (field: string, value: string) => {
    if (!editData) return;
    if (field === 'domain' || field === 'language') {
      const currentValues = editData[field as keyof DatasetEditData];
      if (Array.isArray(currentValues)) {
        const newValues = currentValues.includes(value)
          ? currentValues.filter((item: string) => item !== value)
          : [...currentValues, value];
        handleInputChange(field as keyof DatasetEditData, newValues);
      }
    } else {
      handleInputChange(field as keyof DatasetEditData, value);
      setOpenDropdown(null);
    }
  };

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

  if (!dataset || !editData) {
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
        
        {/* Dataset Header Section */}
        <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
          <div className="basis-0 box-border content-stretch flex flex-row gap-4 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
            {/* Dataset Avatar */}
            <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative shrink-0">
              <DatasetAvatar dataset={dataset} size="lg" />
            </div>
            
            {/* Dataset Info */}
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
                    placeholder="Enter dataset name... *"
                    required
                  />
                  {nameError && (
                    <div className="text-red-500 text-sm mt-1">
                      Dataset name is required
                    </div>
                  )}
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
                        placeholder="Enter a short description of your dataset..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dataset Link Input */}
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full">
          <div className="font-medium leading-0 not-italic relative shrink-0 text-[14px] text-left text-nowrap text-slate-900">
            Version
          </div>
          <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shrink-0 w-full">
            <div className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
              <div className="bg-white box-border content-stretch flex flex-row items-center justify-start pl-3 pr-3 py-2 relative rounded-md shrink-0 w-full">
                <div className="absolute border border-slate-300 border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
                <input
                  type="text"
                  value={editData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  className="font-normal leading-0 not-italic relative shrink-0 text-[16px] text-left text-nowrap text-slate-900 bg-transparent border-none outline-none w-full"
                  placeholder="Enter version (e.g., 1.0.0)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dataset Stats Grid */}
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
                    {['CC0', 'CC BY-SA', 'MIT', 'Apache 2.0', 'Fair Use'].map((option) => {
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

            {/* Size */}
            <div className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0 relative">
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                <p className="block leading-[20px]">SIZE</p>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                {(() => {
                  const sizeLevels = ['Small', 'Medium', 'Large', 'Very Large'];
                  const currentSizeIndex = sizeLevels.indexOf(editData.size);
                  const barCount = currentSizeIndex + 1;

                  return Array.from({ length: barCount }, (_, i) => (
                    <div key={i} className="relative shrink-0 size-5">
                      <div className="w-5 h-2 bg-black rounded-full"></div>
                    </div>
                  ));
                })()}
              </div>
              <div className="relative dropdown-container">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDropdownToggle('size')}>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900">
                    <p className="block leading-[24px]">{editData.size}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openDropdown === 'size' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 min-w-[200px]">
                    {['Small', 'Medium', 'Large', 'Very Large'].map((option) => {
                      const isSelected = editData.size === option;
                      return (
                        <div
                          key={option}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-900 hover:bg-slate-50'
                          }`}
                          onClick={() => handleDropdownSelect('size', option)}
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

            {/* Format */}
            <div className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0 relative">
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                <p className="block leading-[20px]">FORMAT</p>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap">
                  <p className="block leading-[20px]">{editData.format}</p>
                </div>
              </div>
              <div className="relative dropdown-container">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDropdownToggle('format')}>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900">
                    <p className="block leading-[24px]">{editData.format}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openDropdown === 'format' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 min-w-[200px]">
                    {['Text', 'CSV', 'JSON', 'XML', 'Parquet'].map((option) => {
                      const isSelected = editData.format === option;
                      return (
                        <div
                          key={option}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-900 hover:bg-slate-50'
                          }`}
                          onClick={() => handleDropdownSelect('format', option)}
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

            {/* Domain */}
            <div className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0 relative">
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                <p className="block leading-[20px]">DOMAIN</p>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap">
                  <p className="block leading-[20px]">
                    {(() => {
                      const selectedDomains = Array.isArray(editData.domain) ? editData.domain : [];
                      const firstThree = selectedDomains.slice(0, 3);
                      return firstThree.length > 0 ? firstThree.join(', ') : 'General';
                    })()}
                  </p>
                </div>
              </div>
              <div className="relative dropdown-container">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDropdownToggle('domain')}>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900">
                    <p className="block leading-[24px]">
                      {(() => {
                        const selectedDomains = Array.isArray(editData.domain) ? editData.domain : [];
                        if (selectedDomains.length === 0) {
                          return 'Select domains...';
                        } else if (selectedDomains.length <= 3) {
                          return selectedDomains.join(' · ');
                        } else {
                          return `+ ${selectedDomains.length - 3} more`;
                        }
                      })()}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openDropdown === 'domain' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 min-w-[200px]">
                    {['General', 'Web', 'News', 'Blogs', 'Education', 'Knowledge', 'Literature', 'Fiction', 'Non-fiction', 'Social Media', 'Academic', 'Books'].map((option) => {
                      const isSelected = Array.isArray(editData.domain) ? editData.domain.includes(option) : false;
                      return (
                        <div
                          key={option}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-900 hover:bg-slate-50'
                          }`}
                          onClick={() => handleDropdownSelect('domain', option)}
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

            {/* Quality */}
            <div className="flex flex-col gap-2 items-center justify-start p-3 border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0 relative">
              <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                <p className="block leading-[20px]">QUALITY</p>
              </div>
              <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                {(() => {
                  const qualityLevels = ['Low', 'Medium', 'High', 'Very High'];
                  const currentQualityIndex = qualityLevels.indexOf(editData.quality);
                  const starCount = currentQualityIndex + 1;

                  return Array.from({ length: starCount }, (_, i) => (
                    <div key={i} className="relative shrink-0 size-5">
                      <div className="absolute bottom-[-8.333%] left-[8.333%] right-[8.333%] top-[-8.333%]">
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  ));
                })()}
              </div>
              <div className="relative dropdown-container">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDropdownToggle('quality')}>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900">
                    <p className="block leading-[24px]">{editData.quality}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openDropdown === 'quality' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 min-w-[200px]">
                    {['Low', 'Medium', 'High', 'Very High'].map((option) => {
                      const isSelected = editData.quality === option;
                      return (
                        <div
                          key={option}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'text-slate-900 hover:bg-slate-50'
                          }`}
                          onClick={() => handleDropdownSelect('quality', option)}
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
          </div>
        </div>

        {/* Description */}
        <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full">
          <div className="font-semibold leading-0 not-italic relative shrink-0 text-[18px] text-left text-nowrap text-slate-900">
            Description
          </div>
          <div className="box-border content-stretch flex flex-col gap-1.5 items-start justify-start p-0 relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shrink-0 w-full">
              <div className="basis-0 box-border content-stretch flex flex-col gap-1.5 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0">
                <div className="bg-white box-border content-stretch flex flex-row items-start justify-start pl-3 pr-3 py-3 relative rounded-md shrink-0 w-full">
                  <div className="absolute border border-slate-300 border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
                  <textarea
                    value={editData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="font-normal text-[16px] text-left text-slate-900 bg-transparent border-none outline-none w-full resize-none min-h-[80px]"
                    placeholder="Describe what this dataset contains..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Dataset Card - Outside main content */}
      <div className="mx-auto bg-white border border-slate-200 box-border content-stretch flex flex-col gap-6 items-start justify-start px-8 py-6 rounded-lg mt-6 w-[1200px] max-w-[calc(100vw-48px)]">
        <div className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-lg" />
        
        <h2 className="text-lg font-semibold text-slate-900">Delete this dataset</h2>
        
        <div className="space-y-6 w-full">
          <p className="text-sm text-black">
            This action cannot be undone. This will permanently delete the {dataset?.name} dataset and its files.
          </p>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-900">
              Please type {dataset?.name} to confirm.
            </label>
            
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={dataset?.name}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent placeholder:text-slate-400 text-slate-900 bg-white"
            />
          </div>
          
          <button 
            onClick={handleDeleteDataset}
            disabled={deleteConfirmation !== dataset?.name || isDeleting}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              deleteConfirmation !== dataset?.name || isDeleting
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
  );
}
