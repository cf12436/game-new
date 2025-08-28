export const SITE_CONFIG = {
  name: 'Game Hub',
  domain: 'game-hub.site',
  url: 'https://game-hub.site',
  description: 'Play thousands of free online games including action, puzzle, racing, sports and more. No downloads required!',
  keywords: 'free games, online games, browser games, action games, puzzle games, racing games',
} as const;

export const GAMEPIX_CONFIG = {
  apiUrl: 'https://feeds.gamepix.com/v2/json',
  sid: '34E14',
  defaultPagination: 48,
} as const;

export const GAME_CATEGORIES = {
  POPULAR: ['action', 'puzzle', 'racing', 'sports', 'adventure', 'arcade'],
  ALL: [
    'action', 'puzzle', 'racing', 'sports', 'adventure', 'arcade',
    'shooter', 'strategy', 'casual', 'educational', 'platformer',
    'rpg', 'simulation', 'fighting', 'horror', 'music'
  ],
} as const;

export const SEO_DEFAULTS = {
  title: `${SITE_CONFIG.name} - Best Free Online Games`,
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  openGraph: {
    type: 'website' as const,
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image' as const,
  },
} as const;



