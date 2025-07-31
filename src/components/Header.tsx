'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const TABS = [
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'datasets', label: 'Datasets', icon: '🗄️' },
  { id: 'evaluations', label: 'Evaluations', icon: '🧭' },
] as const;

export default function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, userEmail } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCreateMenu(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update active tab based on current pathname
  useEffect(() => {
    if (pathname === '/' || pathname.startsWith('/product/') || pathname.startsWith('/create-product')) {
      setActiveTab('products');
    } else if (pathname === '/datasets' || pathname.startsWith('/dataset/') || pathname.startsWith('/create-dataset')) {
      setActiveTab('datasets');
    } else if (pathname.startsWith('/evaluation/') || pathname.startsWith('/create-evaluation')) {
      setActiveTab('evaluations');
    }
  }, [pathname]);

  const toggleCreateMenu = useCallback(() => {
    setShowCreateMenu(prev => !prev);
    setShowUserMenu(false);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
    setShowCreateMenu(false);
  }, []);

  const handleLogout = useCallback(() => {
    setShowUserMenu(false);
    logout();
  }, [logout]);

  const handleCreateProduct = useCallback(() => {
    setShowCreateMenu(false);
    router.push('/create-product');
  }, [router]);

  const handleCreateDataset = useCallback(() => {
    setShowCreateMenu(false);
    router.push('/create-dataset');
  }, [router]);

  const handleCreateEvaluation = useCallback(() => {
    setShowCreateMenu(false);
    router.push('/create-evaluation');
  }, [router]);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    switch (tabId) {
      case 'products':
        router.push('/');
        break;
      case 'datasets':
        router.push('/datasets');
        break;
      case 'evaluations':
        router.push('/evaluations');
        break;
    }
  }, [router]);

  return (
    <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          {/* Hamburger Menu Button - Mobile Only */}
          <button 
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
              <div className="w-4 h-0.5 bg-slate-600"></div>
              <div className="w-4 h-0.5 bg-slate-600"></div>
              <div className="w-4 h-0.5 bg-slate-600"></div>
            </div>
          </button>
          
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">E</span>
          </div>
          <h1 className="text-xl font-semibold text-black tracking-tight">
            Eval Labs
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-neutral-100 rounded-xl p-1 flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-2.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-900 hover:bg-white/50'
              }`}
            >
              <span className="text-sm lg:text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="relative" ref={dropdownRef}>
            <button 
              className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer h-9 flex items-center gap-1 lg:gap-2"
              onClick={toggleCreateMenu}
            >
              <span className="text-base lg:text-lg">+</span>
              <span className="hidden sm:inline">Create</span>
            </button>
    
            {/* Dropdown Menu */}
            {showCreateMenu && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button 
                    onClick={handleCreateProduct}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>📦</span>
                    Create a product
                  </button>
                  <button 
                    onClick={handleCreateDataset}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🗄️</span>
                    Create a dataset
                  </button>
                  <button 
                    onClick={handleCreateEvaluation}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🧭</span>
                    Create an evaluation
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={userDropdownRef}>
            <button 
              onClick={toggleUserMenu}
              className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-colors"
            >
              <span className="text-slate-600 font-medium text-sm lg:text-base">U</span>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">
                    <div className="font-medium">User</div>
                    <div className="text-slate-500">{userEmail || 'user@example.com'}</div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
