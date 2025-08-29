'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import CategorySidebar from '@/components/CategorySidebar';
import GameGrid from '@/components/GameGrid';
import ParticleBackground from '@/components/ParticleBackground';
import NeonGridBackground from '@/components/NeonGridBackground';
import FloatingCubes from '@/components/FloatingCubes';
import LoadingSpinner from '@/components/LoadingSpinner';
import RippleButton from '@/components/RippleButton';
import { Game } from '@/types/game';
import { fetchGames } from '@/lib/api';
import { useImagePreloader } from '@/hooks/useImagePreloader';

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 预加载首屏游戏图片
  useImagePreloader(games, 30);

  const loadGames = useCallback(async (
    category: string = '', 
    search: string = '', 
    pageNum: number = 1,
    append: boolean = false
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        category: category || undefined,
        search: search || undefined,
        page: pageNum,
        pagination: 48,
        order: 'quality' as const,
      };

      const response = await fetchGames(filters);
      
      if (append) {
        setGames(prev => [...prev, ...response.items]);
      } else {
        setGames(response.items);
        // 首次加载完成后，立即开始预加载图片
        // console.log('🎮 首次游戏数据加载完成，开始预加载图片');
      }
      
      // Check if there are more pages
      const hasNextPage = response.next_url !== undefined;
      setHasMore(hasNextPage);
      
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Failed to load games. Please try again.');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Handle category change
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setGames([]);
    loadGames(category, searchQuery, 1, false);
  }, [searchQuery, loadGames]);

  // Handle search change with debounce
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
    
    // Clear games immediately for better UX
    if (query.trim() !== searchQuery.trim()) {
      setGames([]);
    }
  }, [searchQuery]);

  // Separate effect for debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        // For search, only pass search query, ignore category
        loadGames('', searchQuery, 1, false);
      } else {
        // If search is cleared, reload with current category
        loadGames(selectedCategory, '', 1, false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, loadGames]);

  // Handle infinite scroll with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 1000 &&
            hasMore &&
            !loading
          ) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadGames(selectedCategory, searchQuery, nextPage, true);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, page, selectedCategory, searchQuery, loadGames]);

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* 多层炫酷背景效果 */}
      <div className="fixed inset-0 z-0">
        {/* 基础渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20"></div>

        {/* 霓虹网格背景 */}
        <NeonGridBackground />

        {/* 3D浮动立方体 */}
        <FloatingCubes />

        {/* 粒子网络背景 */}
        <ParticleBackground />

        {/* 动态光晕效果 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gaming-purple/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gaming-cyan/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gaming-green/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-gaming-pink/8 rounded-full blur-3xl animate-float" style={{animationDelay: '6s'}}></div>

        {/* 扫描线效果 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gaming-cyan/5 to-transparent animate-pulse"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <Header
          onSearchChange={handleSearchChange}
          onCategoryToggle={() => setIsCategoryOpen(!isCategoryOpen)}
          isCategoryOpen={isCategoryOpen}
        />

      <div className="flex">
        {/* Category Sidebar */}
        <CategorySidebar
          isOpen={isCategoryOpen}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onClose={() => setIsCategoryOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-80px)]">
          <div className="container mx-auto px-3 py-4">
            {/* Hero Section */}
            <div className="mb-6 text-center bg-gaming-dark/40 backdrop-blur-sm border border-gaming-purple/20 rounded-xl shadow-lg p-6">
              <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                Featured Games
              </h1>
              <p className="text-sm text-gray-300">
                Discover and play thousands of free online games
              </p>
              
              {/* Category Info */}
              {selectedCategory && (
                <div className="mt-6 inline-flex items-center space-x-2 bg-gaming-purple/20 rounded-full px-6 py-2 border border-gaming-purple/30">
                  <span className="text-gaming-purple font-medium">Category:</span>
                  <span className="text-white capitalize font-semibold">{selectedCategory}</span>
                </div>
              )}
              
              {searchQuery && (
                <div className="mt-4 inline-flex items-center space-x-2 bg-gaming-cyan/20 rounded-full px-6 py-2 border border-gaming-cyan/30">
                  <span className="text-gaming-cyan font-medium">Search:</span>
                  <span className="text-white font-semibold">"{searchQuery}"</span>
                </div>
              )}
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 p-6 bg-red-500/20 border border-red-500/50 rounded-xl text-center backdrop-blur-sm">
                <div className="text-4xl mb-3">😵</div>
                <p className="text-red-300 mb-4">{error}</p>
                <RippleButton
                  onClick={() => loadGames(selectedCategory, searchQuery, 1, false)}
                  variant="secondary"
                  size="medium"
                >
                  🔄 重新尝试
                </RippleButton>
              </div>
            )}

            {/* Games Grid */}
            <GameGrid games={games} isLoading={loading && games.length === 0} />

            {/* Loading More Indicator */}
            {loading && games.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="bg-gaming-dark/60 backdrop-blur-sm border border-gaming-purple/30 rounded-xl p-6">
                  <LoadingSpinner size="medium" text="加载更多精彩游戏..." />
                </div>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && games.length > 0 && (
              <div className="text-center mt-8 py-6">
                <p className="text-gray-400">🎮 You've reached the end! Thanks for exploring our games.</p>
              </div>
            )}
          </div>
        </main>
        </div>
      </div>
    </div>
  );
}
