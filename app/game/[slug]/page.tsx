import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GameDetailPage from '@/components/GameDetailPage';
import { Game } from '@/types/game';

export const runtime = 'edge';

// Direct API call using correct search and game detail APIs
async function fetchGameByIdDirect(gameId: string): Promise<Game | null> {
  try {
    console.log('🔍 Fetching game details for:', gameId);

    // Step 1: 直接尝试获取游戏详情（如果已知namespace）
    try {
      const gameDetailUrl = `https://feeds.gamepix.com/v2/games/${gameId}`;
      console.log(`📡 Fetching game details:`, gameDetailUrl);
      
      const detailResponse = await fetch(gameDetailUrl, {
        headers: {
          'User-Agent': 'GameHub/1.0',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 },
      });

      if (detailResponse.ok) {
        const gameData = await detailResponse.json();
        if (gameData && gameData.namespace === gameId) {
          console.log('✅ Game found via direct API:', { id: gameData.id, namespace: gameData.namespace, title: gameData.title });
          return gameData;
        }
      }
    } catch (directError) {
      console.log('⚠️ Direct game API failed, trying search');
    }

    // Step 2: 使用搜索API查找游戏
    try {
      const searchUrl = `https://api.gamepix.com/v3/games/search/partners?ts=${encodeURIComponent(gameId)}`;
      console.log(`🔍 Searching for game:`, searchUrl);
      
      const searchResponse = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'GameHub/1.0',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 },
      });

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.items && searchData.items.length > 0) {
          // 查找匹配的游戏
          const matchedGame = searchData.items.find((item: any) => 
            item.gameNamespace === gameId || item.gameNamespace?.includes(gameId)
          );
          
          if (matchedGame) {
            console.log('🎯 Found game in search results:', matchedGame.gameNamespace);
            
            // Step 3: 使用找到的namespace获取完整游戏信息
            const gameDetailUrl = `https://feeds.gamepix.com/v2/games/${matchedGame.gameNamespace}`;
            const detailResponse = await fetch(gameDetailUrl, {
              headers: {
                'User-Agent': 'GameHub/1.0',
                'Accept': 'application/json',
              },
              next: { revalidate: 300 },
            });

            if (detailResponse.ok) {
              const gameData = await detailResponse.json();
              console.log('✅ Game details retrieved:', { id: gameData.id, namespace: gameData.namespace, title: gameData.title });
              return gameData;
            }
          }
        }
      }
    } catch (searchError) {
      console.error('❌ Search API failed:', searchError);
    }

    console.log('❌ Game not found');
    return null;
  } catch (error) {
    console.error('💥 Error in fetchGameByIdDirect:', error);
    return null;
  }
}

async function fetchRelatedGamesDirect(category: string = 'action'): Promise<Game[]> {
  try {
    const url = `https://feeds.gamepix.com/v2/json?sid=34E14&category=${category}&pagination=12`;
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



