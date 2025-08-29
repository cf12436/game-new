import { Game, GameFilters, GamesResponseV2 } from '@/types/game';

const getAPIBase = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return '/api/games';
  }
  // Server-side - try multiple ways to get the base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  'https://game-new-cf12436.pages.dev';
  return `${baseUrl}/api/games`;
};

const API_BASE = getAPIBase();

export async function fetchGames(filters: GameFilters = {}): Promise<GamesResponseV2> {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.order) params.append('order', filters.order);
  if (filters.pagination) params.append('pagination', filters.pagination.toString());
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.search) params.append('search', filters.search);

  const apiBase = getAPIBase();
  const url = `${apiBase}?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}

export async function fetchGameById(id: string): Promise<Game | null> {
  try {
    // console.log('📡 fetchGameById called with ID:', id);
    const apiBase = getAPIBase();
    const url = `${apiBase}/${encodeURIComponent(id)}`;
    // console.log('🌐 API URL constructed:', url);

    const response = await fetch(url, {
      next: { revalidate: 300 }
    });
    // console.log('📊 API Response status:', response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 404) {
        // console.log('🔍 Game not found (404)');
        return null;
      }
      console.error(`❌ API error for game ${id}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    // console.log('✅ Game data received:', data ? { id: data.id, namespace: data.namespace, title: data.title } : 'null');
    return data;
  } catch (error) {
    console.error('💥 Error fetching game by ID:', error);
    return null;
  }
}

export async function fetchRandomGames(count: number = 12): Promise<Game[]> {
  try {
    const response = await fetchGames({ pagination: count * 2 });
    // Shuffle and return subset
    const shuffled = response.items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Error fetching random games:', error);
    return [];
  }
}

export async function fetchGamesByCategory(category: string, limit: number = 12): Promise<Game[]> {
  try {
    const response = await fetchGames({ category, pagination: limit });
    return response.items;
  } catch (error) {
    console.error('Error fetching games by category:', error);
    return [];
  }
}
