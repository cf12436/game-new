import { NextResponse } from 'next/server';
import { sitemapManager } from '@/lib/sitemap-manager';

export const runtime = 'edge';

// 渐进式站点地图配置
const SITEMAP_CONFIG = {
  // 基础URL
  BASE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://game-hub.site',
  // 缓存时间（小时）
  CACHE_HOURS: 6
};

// 获取高质量游戏列表
async function getQualityGames(count: number): Promise<any[]> {
  try {
    const games: any[] = [];
    const gamesPerPage = 48;
    const pagesNeeded = Math.ceil(count / gamesPerPage);
    
    for (let page = 1; page <= pagesNeeded && games.length < count; page++) {
      const response = await fetch(
        `https://feeds.gamepix.com/v2/json?sid=34E14&pagination=${gamesPerPage}&page=${page}&order=quality`,
        { next: { revalidate: 3600 } }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.items) {
          // 只选择高质量游戏（质量分数 > 0.7）
          const qualityGames = data.items.filter((game: any) => 
            game.quality_score > 0.7 && game.namespace
          );
          games.push(...qualityGames);
        }
      }
      
      // 避免请求过快
      if (page < pagesNeeded) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return games.slice(0, count);
  } catch (error) {
    console.error('Error fetching quality games:', error);
    return [];
  }
}

export async function GET() {
  const baseUrl = SITEMAP_CONFIG.BASE_URL;
  const currentDate = new Date().toISOString();
  const currentGameCount = sitemapManager.getCurrentGameCount();
  
  console.log(`🗺️ 生成站点地图，当前游戏数量: ${currentGameCount}`);
  
  // 开始构建站点地图
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  try {
    // 添加分类页面（使用SEO优化的分类数据）
    const categoryData = sitemapManager.getCategorySEOData();
    
    for (const category of categoryData) {
      sitemap += `
  <!-- 分类页面: ${category.url} -->
  <url>
    <loc>${baseUrl}${category.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${category.priority}</priority>
  </url>`;
    }

    // 渐进式添加游戏页面（使用SEO优化的游戏数据）
    const games = await sitemapManager.getOptimizedGameList(currentGameCount);
    console.log(`🎮 获取到 ${games.length} 个SEO优化游戏`);
    
    for (const game of games) {
      sitemap += `
  <!-- 游戏页面: ${game.title} (质量分数: ${game.quality_score}) -->
  <url>
    <loc>${baseUrl}/game/${game.namespace}</loc>
    <lastmod>${game.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${game.priority}</priority>
  </url>`;
    }

    // 添加robots.txt页面
    sitemap += `
  <!-- Robots.txt -->
  <url>
    <loc>${baseUrl}/robots.txt</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>`;

  } catch (error) {
    console.error('❌ 生成站点地图时出错:', error);
  }

  sitemap += `
</urlset>`;

  const stats = sitemapManager.getSitemapStats();
  console.log(`✅ 站点地图生成完成:`, stats);

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `public, max-age=${SITEMAP_CONFIG.CACHE_HOURS * 3600}`,
      'X-Robots-Tag': 'noindex', // 防止站点地图本身被索引
    },
  });
}



