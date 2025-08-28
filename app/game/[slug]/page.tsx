import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GameDetailPage from '@/components/GameDetailPage';
import { Game } from '@/types/game';

export const runtime = 'edge';

// Direct API call to avoid internal routing issues in Edge Runtime
async function fetchGameByIdDirect(gameId: string): Promise<Game | null> {
  try {
    console.log('🔍 Direct API call for game:', gameId);
    
    // Try multiple pages to find the game
    for (let page = 1; page <= 3; page++) {
      const url = `https://api.gamepix.com/v2/games?sid=34E14&pagination=48&page=${page}`;
      console.log(`📡 Fetching page ${page}:`, url);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'GameHub/1.0',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        console.error(`❌ API error on page ${page}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`📊 Page ${page} returned ${data.items?.length || 0} games`);
      
      if (data.items) {
        const game = data.items.find((g: any) => g.namespace === gameId || g.id === gameId);
        if (game) {
          console.log('✅ Game found:', { id: game.id, namespace: game.namespace, title: game.title });
          return game;
        }
      }
    }
    
    console.log('❌ Game not found in any page');
    return null;
  } catch (error) {
    console.error('💥 Error in direct API call:', error);
    return null;
  }
}

async function fetchRelatedGamesDirect(category: string = 'action'): Promise<Game[]> {
  try {
    const url = `https://api.gamepix.com/v2/games?sid=34E14&category=${category}&pagination=12`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GameHub/1.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching related games:', error);
    return [];
  }
}

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await fetchGameByIdDirect(params.slug);
  
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
  
  const game = await fetchGameByIdDirect(params.slug);
  console.log('🎮 Game fetched:', game ? { id: game.id, title: game.title, namespace: game.namespace } : 'null');
  
  if (!game) {
    console.log('❌ Game not found, calling notFound()');
    notFound();
  }

  // Fetch related games from the same category
  const relatedGames = await fetchRelatedGamesDirect(game.category || 'action');
  // Filter out the current game
  const filteredRelatedGames = relatedGames.filter((g: Game) => g.id !== game.id);

  return (
    <GameDetailPage 
      game={game} 
      relatedGames={filteredRelatedGames} 
    />
  );
}



