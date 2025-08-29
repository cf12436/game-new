'use client';

import { Game } from '@/types/game';
import GameCard from './GameCard';
import LoadingSpinner from './LoadingSpinner';
import { useMemo, useEffect, useRef, useState } from 'react';

interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
}

export default function GameGrid({ games, isLoading }: GameGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(30); // 初始显示30个游戏为优先加载

  // 简化的首屏游戏数量计算
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calculateVisibleGames = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // 简单估算首屏可见游戏数量
      const estimatedCellSize = viewportWidth >= 1280 ? 140 :
                               viewportWidth >= 1024 ? 130 :
                               viewportWidth >= 768 ? 120 :
                               viewportWidth >= 640 ? 110 : 100;

      const columnsPerRow = Math.floor(viewportWidth / estimatedCellSize);
      const rowsVisible = Math.ceil(viewportHeight / estimatedCellSize) + 1;
      const estimatedVisible = columnsPerRow * rowsVisible;

      setVisibleCount(Math.min(estimatedVisible, 48));
      // console.log(`📱 简化计算: ${estimatedVisible}个游戏优先加载`);
    };

    calculateVisibleGames();
    window.addEventListener('resize', calculateVisibleGames);

    return () => window.removeEventListener('resize', calculateVisibleGames);
  }, []);

  // 统一布局算法 - 使用统一的small尺寸保持整齐
  const gameLayout = useMemo(() => {
    const layout: Array<{ game: Game; size: 'small' | 'medium' | 'large'; span: string }> = [];

    // 所有游戏都使用small尺寸，确保网格整齐统一
    for (let i = 0; i < games.length; i++) {
      const game = games[i];

      layout.push({
        game,
        size: 'small',
        span: 'grid-item-small'
      });
    }

    return layout;
  }, [games]);

  if (isLoading) {
    return (
      <div className="w-full">
        {/* 炫酷的加载动画 */}
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="large" text="正在加载精彩游戏..." />
        </div>

        {/* 骨架屏效果 */}
        <div className="game-grid mt-8">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="grid-item-small relative overflow-hidden bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-lg border border-gray-700/30"
              style={{ aspectRatio: '1' }}
            >
              {/* 骨架屏动画 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent animate-pulse"
                   style={{
                     animation: `shimmer 2s infinite`,
                     animationDelay: `${i * 50}ms`
                   }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 text-gray-600">🎮</div>
              </div>
            </div>
          ))}
        </div>
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
        ref={gridRef}
        className="game-grid"
      >
        {gameLayout.map(({ game, size, span }, index) => {
          // 使用动态计算的可见数量来决定优先加载
          const isPriorityLoad = index < visibleCount;

          return (
            <GameCard
              key={`${game.id}-${index}`}
              game={game}
              size={size}
              className={span}
              priority={isPriorityLoad}
            />
          );
        })}
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
