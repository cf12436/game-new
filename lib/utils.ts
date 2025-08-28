import { type ClassValue, clsx } from 'clsx';
import { Game } from '@/types/game';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatQualityScore(score: number): string {
  return (score * 5).toFixed(1);
}

export function getQualityColor(score: number): string {
  if (score >= 0.8) return 'text-green-400';
  if (score >= 0.6) return 'text-yellow-400';
  return 'text-red-400';
}

export function getQualityBadge(score: number): string {
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.6) return 'Good';
  if (score >= 0.4) return 'Fair';
  return 'Poor';
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateGameSlug(game: Game): string {
  return game.namespace || game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function getImageUrl(url: string, width?: number): string {
  if (!url) return '';
  
  // If GamePix image, add width parameter for optimization
  if (url.includes('img.gamepix.com') && width) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}`;
  }
  
  return url;
}

export function isValidGameOrientation(orientation: string): boolean {
  return ['landscape', 'portrait', 'all'].includes(orientation);
}



