'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import CategorySidebar from '@/components/CategorySidebar';
import GameGrid from '@/components/GameGrid';
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
        console.log('🎮 首次游戏数据加载完成，开始预加载图片');
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
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-dark"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gaming-purple/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gaming-cyan/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gaming-green/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
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
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
                <p className="text-red-300">{error}</p>
                <button
                  onClick={() => loadGames(selectedCategory, searchQuery, 1, false)}
                  className="mt-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Games Grid */}
            <GameGrid games={games} isLoading={loading && games.length === 0} />

            {/* Loading More Indicator */}
            {loading && games.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="inline-flex items-center space-x-2 bg-gaming-purple/20 rounded-full px-6 py-3">
                  <div className="w-4 h-4 border-2 border-gaming-purple border-t-transparent rounded-full animate-spin" />
                  <span className="text-gaming-purple font-medium">Loading more games...</span>
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
