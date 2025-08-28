'use client';

import { Game } from '@/types/game';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlay, FiStar } from 'react-icons/fi';
import { memo, useState } from 'react';

interface GameCardProps {
  game: Game;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  priority?: boolean; // 用于首屏游戏的优先加载
}

const GameCard = memo(function GameCard({ game, size = 'medium', className = '', priority = false }: GameCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    console.log('🎮 Game card clicked:', {
      id: game.id,
      namespace: game.namespace,
      title: game.title,
      routeUrl: `/game/${game.namespace}`,
      gameIframeUrl: game.url
    });
  };

  return (
    <Link href={`/game/${game.namespace}`} className={`${className} block`} onClick={handleClick}>
      <div className="game-card-container group perspective-1000">
        {/* 3D 卡片内容 */}
        <div className="game-card-inner relative w-full h-full transition-all duration-500 transform-style-preserve-3d group-hover:rotate-y-12 group-hover:rotate-x-6">
          {/* 图片容器 - 确保固定宽高比 */}
          <div className="game-image-container">
            {/* 加载占位符 - 始终显示，图片加载后覆盖 */}
            <div className="game-image-placeholder">
              🎮
            </div>

            {/* 游戏图片 */}
            <Image
              src={game.banner_image}
              alt={game.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 z-10"
              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 15vw"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              quality={priority ? 85 : 75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              unoptimized={false}
              onLoad={() => {
                setImageLoaded(true);
                if (priority) console.log(`🎮 图片加载完成: ${game.title}`);
              }}
            />
          </div>

          {/* 彩虹光效扫过动画 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gaming-cyan/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-25" />

          {/* 悬停渐变覆盖层 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

          {/* 游戏标题覆盖层 */}
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30">
            <h3 className="text-white font-bold text-sm truncate drop-shadow-lg mb-1">
              {game.title}
            </h3>
            <div className="flex items-center space-x-2">
              <FiPlay className="text-gaming-cyan text-xs" />
              <span className="text-gaming-cyan text-xs font-medium">play now</span>
            </div>
          </div>

          {/* 发光边框效果 */}
          <div className="absolute inset-0 rounded-lg ring-1 ring-white/10 group-hover:ring-2 group-hover:ring-gaming-cyan/50 transition-all duration-500 z-20" />

          {/* 外发光效果 */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-15"
               style={{
                 boxShadow: '0 0 30px rgba(6, 182, 212, 0.4), 0 0 60px rgba(6, 182, 212, 0.2)'
               }} />
        </div>
      </div>
    </Link>
  );
});

export default GameCard;
