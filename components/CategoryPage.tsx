'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameCategory, Game } from '@/types/game';
import { fetchGames } from '@/lib/api';
import Header from './Header';
import GameGrid from './GameGrid';
import Link from 'next/link';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

interface CategoryPageProps {
  category: GameCategory;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'quality' | 'pubdate'>('quality');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadGames = useCallback(async (
    search: string = '', 
    order: 'quality' | 'pubdate' = 'quality',
    pageNum: number = 1,
    append: boolean = false
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        category: category.tagNamespace,
        search: search || undefined,
        order,
        page: pageNum,
        pagination: 48,
      };

      const response = await fetchGames(filters);
      
      if (append) {
        setGames(prev => [...prev, ...response.items]);
      } else {
        setGames(response.items);
      }
      
      const hasNextPage = response.next_url !== undefined;
      setHasMore(hasNextPage);
      
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Failed to load games. Please try again.');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [category.tagNamespace]);

  // Initial load
  useEffect(() => {
    loadGames(searchQuery, sortOrder);
  }, [loadGames, searchQuery, sortOrder]);

  // Handle search change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
    setGames([]);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      loadGames(query, sortOrder, 1, false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [sortOrder, loadGames]);

  // Handle sort change
  const handleSortChange = (newOrder: 'quality' | 'pubdate') => {
    setSortOrder(newOrder);
    setPage(1);
    setGames([]);
    loadGames(searchQuery, newOrder, 1, false);
  };

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loading
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadGames(searchQuery, sortOrder, nextPage, true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, page, searchQuery, sortOrder, loadGames]);

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <Header onSearchChange={handleSearchChange} />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link
            href="/"
            className="text-gaming-cyan hover:text-cyan-300 transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-white capitalize">{category.title} Games</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gaming-cyan hover:text-cyan-300 transition-colors"
            >
              <FiArrowLeft size={20} />
              <span>Back to All Games</span>
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {category.title} Games
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Discover the best free {category.title.toLowerCase()} games. 
            Play instantly in your browser, no downloads required!
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-2 text-gray-400">
            <FiFilter size={18} />
            <span>Sort by:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSortChange('quality')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                sortOrder === 'quality'
                  ? 'bg-gaming-cyan text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Best Quality
            </button>
            <button
              onClick={() => handleSortChange('pubdate')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                sortOrder === 'pubdate'
                  ? 'bg-gaming-cyan text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Newest First
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6 inline-flex items-center space-x-2 bg-gaming-cyan/20 rounded-full px-6 py-2">
            <span className="text-gaming-cyan font-medium">Search in {category.title}:</span>
            <span className="text-white font-semibold">"{searchQuery}"</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => loadGames(searchQuery, sortOrder, 1, false)}
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
            <p className="text-gray-400">
              🎮 You've seen all {category.title.toLowerCase()} games! 
              <Link href="/" className="text-gaming-cyan hover:text-cyan-300 ml-2">
                Explore other categories
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



