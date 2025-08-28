import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GameDetailPage from '@/components/GameDetailPage';
import { fetchGameById, fetchGamesByCategory } from '@/lib/api';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await fetchGameById(params.slug);
  
  if (!game) {
    return {
      title: 'Game Not Found - Game Hub',
      description: 'The requested game could not be found.',
    };
  }

  return {
    title: `${game.title} - Play Free Online | Game Hub`,
    description: game.description,
    keywords: `${game.title}, ${game.category}, free online game, browser game`,
    openGraph: {
      title: `${game.title} - Play Free Online`,
      description: game.description,
      images: [game.banner_image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${game.title} - Play Free Online`,
      description: game.description,
      images: [game.banner_image],
    },
    alternates: {
      canonical: `https://game-hub.site/game/${game.namespace}`,
    },
  };
}

export default async function GamePage({ params }: Props) {
  console.log('🎯 GamePage called with slug:', params.slug);
  
  const game = await fetchGameById(params.slug);
  console.log('🎮 Game fetched:', game ? { id: game.id, title: game.title, namespace: game.namespace } : 'null');
  
  if (!game) {
    console.log('❌ Game not found, calling notFound()');
    notFound();
  }

  // Fetch related games from the same category
  const relatedGames = await fetchGamesByCategory(game.category || 'action', 12);
  // Filter out the current game
  const filteredRelatedGames = relatedGames.filter(g => g.id !== game.id);

  return (
    <GameDetailPage 
      game={game} 
      relatedGames={filteredRelatedGames} 
    />
  );
}



