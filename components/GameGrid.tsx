'use client';

import { Game } from '@/types/game';
import GameCard from './GameCard';
import { useMemo } from 'react';

interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
}

export default function GameGrid({ games, isLoading }: GameGridProps) {
  // Perfect tile-packing algorithm inspired by Poki.com
  const gameLayout = useMemo(() => {
    const layout: Array<{ game: Game; size: 'small' | 'medium' | 'large'; span: string }> = [];
    
    // Perfect distribution pattern: 1 large (3x3) + 2 medium (2x2) + 13 small (1x1) = 26 games per cycle
    // This creates a balanced, visually appealing pattern that fills space efficiently
    const getSizeForIndex = (index: number): 'small' | 'medium' | 'large' => {
      const cyclePosition = index % 26;
      
      // One 3x3 large tile per cycle (takes 9 grid units)
      if (cyclePosition === 0) return 'large';
      
      // Two 2x2 medium tiles per cycle (takes 4 grid units each = 8 total)
      if (cyclePosition === 1 || cyclePosition === 10) return 'medium';
      
      // Remaining positions are 1x1 small tiles (13 tiles = 13 grid units)
      return 'small';
    };
    
    // For search results with fewer games, use simpler layout
    const useSimpleLayout = games.length <= 12;
    
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      let size: 'small' | 'medium' | 'large';
      
      if (useSimpleLayout) {
        // Simple layout: all medium tiles for clean, uniform appearance
        size = 'medium';
      } else {
        // Complex layout for many games
        size = getSizeForIndex(i);
      }
      
      let span = '';
      if (size === 'large') {
        span = 'col-span-3 row-span-3';
      } else if (size === 'medium') {
        span = 'col-span-2 row-span-2';
      } else {
        span = 'col-span-1 row-span-1';
      }
      
      layout.push({ game, size, span });
    }
    
    return layout;
  }, [games]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-18 gap-1">
        {Array.from({ length: 48 }).map((_, i) => {
          const getSizeForIndex = (index: number): string => {
            const cyclePosition = index % 26;
            if (cyclePosition === 0) return 'col-span-3 row-span-3';
            if (cyclePosition === 1 || cyclePosition === 10) return 'col-span-2 row-span-2';
            return 'col-span-1 row-span-1';
          };
          
          return (
            <div
              key={i}
              className={`animate-pulse bg-gray-700/30 rounded-lg ${getSizeForIndex(i)}`}
              style={{ aspectRatio: '1' }}
            />
          );
        })}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-6xl text-gray-600 mb-4">🎮</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No games found</h3>
        <p className="text-gray-500 text-center max-w-md">
          Try adjusting your search terms or browse different categories to discover amazing games.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Grid - Perfect square grid system like Poki.com */}
      <div 
        className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-18 gap-1"
        style={{
          gridAutoRows: '1fr',
          minHeight: '100vh'
        }}
      >
        {gameLayout.map(({ game, size, span }, index) => (
          <GameCard
            key={`${game.id}-${index}`}
            game={game}
            size={size}
            className={span}
          />
        ))}
      </div>

      {/* Load More Indicator */}
      {games.length > 0 && games.length % 48 === 0 && (
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-gaming-cyan rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gaming-purple rounded-full animate-bounce delay-75" />
            <div className="w-2 h-2 bg-gaming-green rounded-full animate-bounce delay-150" />
            <span className="ml-3 text-sm">Scroll down for more games</span>
          </div>
        </div>
      )}
    </div>
  );
}
