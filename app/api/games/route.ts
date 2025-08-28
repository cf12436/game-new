import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get('category');
  const order = searchParams.get('order');
  const pagination = searchParams.get('pagination') || '48';
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search');
  
  // If search query is provided, use v3 search API
  if (search) {
    const searchUrl = `https://api.gamepix.com/v3/games/search/partners?ts=${encodeURIComponent(search)}`;
    
    try {
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'GameHub/1.0',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`GamePix v3 API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform v3 search results to match v2 format for consistency
      const transformedData = {
        items: data.items.map((item: any) => ({
          id: item.gameId,
          title: item.title,
          namespace: item.gameNamespace,
          description: '', // v3 doesn't provide description in search
          category: '', // v3 doesn't provide category in search
          date_modified: item.updatedAt,
          author: item.authorUsername,
          status: item.undefined || 'live', // Handle the undefined key as status
          // Add placeholder values for missing v2 fields
          orientation: 'all',
          quality_score: 0,
          width: 800,
          height: 600,
          date_published: item.updatedAt,
          banner_image: `https://img.gamepix.com/games/${item.gameNamespace}/cover/${item.gameNamespace}.png?w=320`,
          image: `https://img.gamepix.com/games/${item.gameNamespace}/icon/${item.gameNamespace}.png?w=105`,
          url: `https://games.gamepix.com/games/${item.gameNamespace}/`
        }))
      };
      
      return NextResponse.json(transformedData);
    } catch (error) {
      console.error('Error fetching search results:', error);
      
      // Fallback to v2 API with search filter if v3 fails
      console.log('Falling back to v2 API for search...');
      try {
        const fallbackParams = new URLSearchParams();
        fallbackParams.append('sid', '34E14');
        fallbackParams.append('pagination', '48');
        
        const fallbackUrl = `https://feeds.gamepix.com/v2/json?${fallbackParams.toString()}`;
        const fallbackResponse = await fetch(fallbackUrl, {
          headers: {
            'User-Agent': 'GameHub/1.0',
          },
          next: { revalidate: 300 },
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          
          // Filter by search term
          if (fallbackData.items) {
            const searchLower = search.toLowerCase();
            fallbackData.items = fallbackData.items.filter((game: any) =>
              game.title.toLowerCase().includes(searchLower) ||
              game.description.toLowerCase().includes(searchLower) ||
              game.namespace.toLowerCase().includes(searchLower)
            );
          }
          
          return NextResponse.json(fallbackData);
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
      
      return NextResponse.json(
        { error: 'Failed to search games', items: [] },
        { status: 500 }
      );
    }
  }
  
  // For non-search requests, use v2 API as before
  const gamepixParams = new URLSearchParams();
  gamepixParams.append('sid', '34E14');
  
  if (category) gamepixParams.append('category', category);
  if (order) gamepixParams.append('order', order);
  gamepixParams.append('pagination', pagination);
  gamepixParams.append('page', page);
  
  const apiUrl = `https://feeds.gamepix.com/v2/json?${gamepixParams.toString()}`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'GameHub/1.0',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`GamePix API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}



