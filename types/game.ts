// Represents the detailed game object from the v2 API
export interface GameFromV2 {
  id: string;
  title: string;
  namespace: string;
  description: string;
  category: string;
  orientation: 'landscape' | 'portrait' | 'all';
  quality_score: number;
  width: number;
  height: number;
  date_modified: string;
  date_published: string;
  banner_image: string;
  image: string;
  url: string;
}

// Represents a search result item from the v3 API
export interface GameSearchResult {
  gameId: string;
  gameNamespace: string;
  title: string;
  updatedAt: string;
  authorUsername: string;
  undefined?: string; // The actual key name in the API response
}

// A unified Game type for our application
// It will be constructed from either V2 or a combination of V3 search + V2 details
export interface Game extends Partial<GameFromV2>, Partial<GameSearchResult> {
  id: string; // Use gameId from V3 or id from V2
  namespace: string; // Use gameNamespace from V3 or namespace from V2
  title: string;
  banner_image: string; // This is crucial and must be fetched or constructed
}

export interface GameCategory {
  tagNamespace: string;
  title: string;
}

// For the v2 API response
export interface GamesResponseV2 {
  version: string;
  title: string;
  home_page_url: string;
  feed_url: string;
  next_url?: string;
  previous_url?: string;
  first_page_url: string;
  last_page_url: string;
  modified: string;
  items: GameFromV2[];
}

// For the v3 search API response
export interface GameSearchResponseV3 {
  items: GameSearchResult[];
}

export interface GameFilters {
  category?: string;
  order?: 'quality' | 'pubdate';
  pagination?: number;
  page?: number;
  search?: string;
}
