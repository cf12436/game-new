'use client';

import { Game } from '@/types/game';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlay, FiStar } from 'react-icons/fi';
import { memo } from 'react';

interface GameCardProps {
  game: Game;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const GameCard = memo(function GameCard({ game, size = 'medium', className = '' }: GameCardProps) {
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
      <div 
        className="game-card group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-gaming-dark to-gray-900"
        style={{
          aspectRatio: '1',
          width: '100%',
          height: 'auto'
        }}
      >
        {/* Game Image */}
        <Image
          src={game.banner_image}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 16vw, (max-width: 1200px) 12vw, 8vw"
          loading="lazy"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Game title overlay (only visible on hover for cleaner look) */}
        <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-sm truncate drop-shadow-lg">
            {game.title}
          </h3>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-lg ring-1 ring-white/10 group-hover:ring-gaming-cyan/30 transition-all duration-300" />
      </div>
    </Link>
  );
});

export default GameCard;
