'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    } else {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleContinueWithEmail = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use auth context to login
      login(email);
      
      // Redirect to main page
      router.push('/');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'google') {
      loginWithGoogle();
    } else {
      // Fallback for other providers
      console.log(`Logging in with ${provider}`);
      login(`user@${provider}.com`);
      router.push('/');
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 relative min-h-screen flex items-center justify-center">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Background Card */}
        <div className="absolute bg-[#f7f7f7] h-[529px] w-[400px] rounded-2xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)]" />
        
        {/* Main Login Card */}
        <div className="relative bg-white border border-slate-200 flex flex-col gap-[27px] items-center justify-start p-10 rounded-2xl w-[400px]">
          {/* Logo */}
          <div className="relative">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-4xl tracking-[-0.48px]">E</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="font-semibold text-2xl text-black tracking-[-0.144px] leading-8">
              Continue with Eval Labs
            </h1>
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-2 w-full">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="flex-1 bg-white border border-slate-200 flex items-center justify-center p-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleSocialLogin('facebook')}
              className="flex-1 bg-white border border-slate-200 flex items-center justify-center p-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className="flex-1 bg-white border border-slate-200 flex items-center justify-center p-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="#333" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-[27px] w-full">
            <div className="flex-1 h-0">
              <div className="border-t border-slate-200" />
            </div>
            <div className="text-sm text-black">or</div>
            <div className="flex-1 h-0">
              <div className="border-t border-slate-200" />
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1.5 w-80">
            <label className="font-medium text-sm text-slate-900">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your personal or work email"
              className="w-full bg-white border border-slate-300 pl-3 pr-3 py-2 rounded-md text-base text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <p className="text-sm text-slate-500">
              Enter your email address
            </p>
          </div>

          {/* Continue with Email Button */}
          <button
            onClick={handleContinueWithEmail}
            disabled={isLoading}
            className="bg-slate-900 flex items-center justify-center px-4 py-2 rounded-md text-white font-medium text-sm w-80 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Continuing...
              </div>
            ) : (
              'Continue with Email'
            )}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="absolute left-1/2 top-[630px] -translate-x-1/2 text-center">
          <p className="text-sm text-[#787a7b]">
            Don&apos;t have an account?{' '}
            <span className="font-medium text-[#464548]">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
} 