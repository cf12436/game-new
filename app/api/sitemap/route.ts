import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://game-hub.site';
  const currentDate = new Date().toISOString();
  
  // Start with static pages
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  try {
    // Add category pages
    const categoriesResponse = await fetch('https://feeds.gamepix.com/v2/json?sid=34E14&pagination=1');
    if (categoriesResponse.ok) {
      // Add popular categories
      const popularCategories = [
        'action', 'puzzle', 'racing', 'sports', 'adventure', 'arcade',
        'shooting', 'strategy', 'casual', 'educational'
      ];
      
      for (const category of popularCategories) {
        sitemap += `
  <url>
    <loc>${baseUrl}/category/${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    }

    // Add some popular games (we'll expand this gradually)
    const gamesResponse = await fetch('https://feeds.gamepix.com/v2/json?sid=34E14&pagination=20&order=quality');
    if (gamesResponse.ok) {
      const gamesData = await gamesResponse.json();
      const topGames = gamesData.items?.slice(0, 10) || [];
      
      for (const game of topGames) {
        sitemap += `
  <url>
    <loc>${baseUrl}/game/${game.namespace}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  sitemap += `
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}



