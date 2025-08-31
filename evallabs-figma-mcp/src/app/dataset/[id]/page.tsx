'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDatasets } from '@/lib/datasets';
import { Dataset } from '@/lib/datasets';
import { getProducts, Product } from '@/lib/data';
import DatasetAvatar from '@/components/DatasetAvatar';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import DatasetContentDisplay from '@/components/DatasetContentDisplay';
import ProductAvatar from '@/components/ProductAvatar';

interface LeaderboardEntry {
  rank: number;
  product: Product;
  score: number | string;
  evaluationDate: string;
}

// New component for the score progress bar
const ScoreProgressBar = ({ score }: { score: number | string }) => {
  if (typeof score !== 'number') {
    return (
      <span className={`text-sm font-medium ${
        score === 'In Process' ? 'text-green-500' : 'text-slate-900'
      }`}>
        {score}
      </span>
    );
  }

  const width = `${score}%`;

  return (
    <div className="flex items-center">
      <span className="text-sm font-medium text-slate-900 w-12">{score.toFixed(1)}</span>
      <div className="w-full bg-slate-200 rounded-full h-2 ml-2">
        <div className="bg-slate-900 h-2 rounded-full" style={{ width }}></div>
      </div>
    </div>
  );
};

export default function DatasetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'dataset-card'>('leaderboard');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const datasets = getDatasets();
    const foundDataset = datasets.find(d => d.id === Number(params.id));
    if (foundDataset) {
      setDataset(foundDataset);
    }
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    const products = getProducts();
    const formattedLeaderboardData = products
      .map((product) => ({
        rank: 0, // Will be assigned after sorting
        product: product,
        score: parseFloat((Math.random() * (99.9 - 60) + 60).toFixed(1)), // Mock score
        evaluationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
      }))
      .sort((a, b) => (b.score as number) - (a.score as number)) // Sort by score descending
      .map((entry, index) => ({
        ...entry,
        rank: index + 1, // Assign rank based on sorted position
      }));
    setLeaderboardData(formattedLeaderboardData);
  }, []);


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
                <button 
                  onClick={() => router.push(`/dataset/${dataset.id}/edit`)}
                  className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="text-sm font-medium">Edit</span>
                </button>
                
              </div>
            </div>

            {/* Dataset Stats Grid */}
            <div className="bg-white border border-slate-200 rounded-lg py-5 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 min-w-0">
                {/* License */}
                <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                  <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                    <p className="block leading-[20px]">LICENSE</p>
                  </div>
                  <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                    <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap">
                      <p className="block leading-[20px] whitespace-pre">{dataset.license.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                    <p className="block leading-[24px]">{dataset.license.toLowerCase()}</p>
                  </div>
                </div>

                {/* Modalities */}
                <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                  <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                    <p className="block leading-[20px]">MODALITIES</p>
                  </div>
                  <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                    {/* Text Icon */}
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
                    {/* Image Icon */}
                    <div className="relative shrink-0 size-5">
                      <div className="absolute bottom-[-8.333%] left-[8.333%] right-[8.333%] top-[-8.333%]">
                        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7.50016 9.16668C8.42064 9.16668 9.16683 8.42049 9.16683 7.50001C9.16683 6.57954 8.42064 5.83334 7.50016 5.83334C6.57969 5.83334 5.8335 6.57954 5.8335 7.50001C5.8335 8.42049 6.57969 9.16668 7.50016 9.16668Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.5 12.5L14.9283 9.92835C14.6158 9.61589 14.1919 9.44037 13.75 9.44037C13.3081 9.44037 12.8842 9.61589 12.5717 9.92835L5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                  </div>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                    <p className="block leading-[24px]">Text · Image</p>
                  </div>
                </div>

                {/* Size */}
                <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                  <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                    <p className="block leading-[20px]">SIZE</p>
                  </div>
                  <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                    <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap">
                      <p className="block leading-[20px] whitespace-pre">{dataset.size}</p>
                    </div>
                  </div>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                    <p className="block leading-[24px]">KB</p>
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                  <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                    <p className="block leading-[20px]">TASKS</p>
                  </div>
                  <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                    <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap">
                      <p className="block leading-[20px] whitespace-pre">Reasoning</p>
                    </div>
                  </div>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                    <p className="block leading-[24px]">Reasoning</p>
                  </div>
                </div>

                {/* Languages */}
                <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                  <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                    <p className="block leading-[20px]">LANGUAGES</p>
                  </div>
                  <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                    <div className="font-bold leading-[0] not-italic relative shrink-0 text-[#000000] text-[18px] text-center text-nowrap">
                      <p className="block leading-[20px] whitespace-pre">EN</p>
                    </div>
                  </div>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                    <p className="block leading-[24px]">+ 25 More</p>
                  </div>
                </div>

                {/* Scalability */}
                <div className="flex flex-col gap-2 items-center justify-start p-3 min-w-[160px] border-r border-slate-200 last:border-r-0 sm:last:border-r sm:border-r-0 md:border-r md:last:border-r-0 lg:border-r lg:last:border-r-0 xl:border-r xl:last:border-r-0">
                  <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#acacbd] text-[12px] text-center w-full">
                    <p className="block leading-[20px]">SCALABILITY</p>
                  </div>
                  <div className="flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 w-full">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="relative shrink-0 size-5">
                        <div className="w-5 h-5 bg-black rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-center text-slate-900 w-full">
                    <p className="block leading-[24px]">Higher</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dataset Summary */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Dataset Summary</h2>
              <p className="text-sm text-slate-600">
                We introduce MMMU: a new benchmark designed to evaluate multimodal models on massive multi-discipline tasks demanding college-level subject knowledge and deliberate reasoning. MMMU includes 11.5K meticulously collected multimodal questions from college exams, quizzes, and textbooks, covering six core disciplines: Art & Design, Business, Science, Health & Medicine, Humanities & Social Science, and Tech & Engineering. These questions span 30 subjects and 183 subfields, comprising 30 highly heterogeneous image types, such as charts, diagrams, maps, tables, music sheets, and chemical structures. We believe MMMU will stimulate the community to build next-generation multimodal foundation models towards expert artificial general intelligence (AGI).
              </p>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="mb-6">
            {/* Tabs */}
            <div className="flex items-center space-x-1 mb-4">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`flex items-center space-x-2 px-4 py-2 transition-colors relative ${
                    activeTab === 'leaderboard'
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm">Leaderboard</span>
                  {activeTab === 'leaderboard' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('dataset-card')}
                  className={`flex items-center space-x-2 px-4 py-2 transition-colors relative ${
                    activeTab === 'dataset-card'
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="text-sm">Dataset Card</span>
                  {activeTab === 'dataset-card' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              {activeTab === 'leaderboard' ? (
                <div>
                  {/* Leaderboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Leaderboard</h2>
                      <p className="text-sm text-slate-500 mt-1">Performance rankings across products</p>
                    </div>
                    <button 
                        onClick={() => router.push(`/dataset/${params.id}/evaluate`)}
                        className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-sm font-medium">Add an evaluation</span>
                      </button>
                  </div>

                  {/* Leaderboard Table */}
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Products</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Scores</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Evaluated At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {leaderboardData.map((entry, index) => (
                          <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium text-slate-900">{entry.rank}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <ProductAvatar product={entry.product} size="sm" />
                                <div>
                                  <div className="font-medium text-slate-900">{entry.product.name}</div>
                                  <div className="text-xs text-slate-500">Dataset variant</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <ScoreProgressBar score={entry.score} />
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-slate-900">{entry.evaluationDate}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  <DatasetContentDisplay dataset={dataset} />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
