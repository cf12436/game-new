import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameId = params.id;
  console.log('🔍 API Route called for game ID:', gameId);
  
  try {
    // Try multiple pages to find the game
    for (let page = 1; page <= 3; page++) {
      console.log(`📡 Trying GamePix API page ${page}...`);
      const apiUrl = `https://feeds.gamepix.com/v2/json?sid=34E14&pagination=48&page=${page}`;
      console.log('🌐 GamePix API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'GameHub/1.0',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(8000),
      });
      
      console.log(`📊 GamePix API Response page ${page}:`, response.status, response.statusText);
      
      if (!response.ok) {
        console.warn(`⚠️ GamePix API page ${page} error: ${response.status} ${response.statusText}`);
        continue; // Try next page
      }
      
      const data = await response.json();
      console.log(`📦 Games received on page ${page}:`, data.items?.length || 0);
      
      // Search for the game by ID or namespace
      const game = data.items?.find((item: any) => 
        item.id === gameId || 
        item.namespace === gameId ||
        item.id === parseInt(gameId, 10) ||
        item.namespace?.toLowerCase() === gameId.toLowerCase()
      );
      
      if (game) {
        console.log('✅ Game found:', { id: game.id, namespace: game.namespace, title: game.title });
        return NextResponse.json(game);
      }
      
      console.log(`🔍 Game not found on page ${page}, trying next page...`);
    }
    
    // If not found in any page
    console.log(`❌ Game not found: ${gameId} after checking 3 pages`);
    return NextResponse.json(
      { error: 'Game not found' },
      { status: 404 }
    );
    
  } catch (error) {
    console.error('💥 Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}



