import { NextResponse } from 'next/server';
import { sitemapManager } from '@/lib/sitemap-manager';

export const runtime = 'edge';

export async function GET() {
  try {
    const stats = sitemapManager.getSitemapStats();
    
    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        message: `当前站点地图包含 ${stats.currentGameCount} 个游戏页面，${stats.nextIncrementDays} 天后将增加更多页面`,
        strategy: '渐进式SEO策略：从少量高质量页面开始，根据Google收录情况逐步增加'
      }
    });
  } catch (error) {
    console.error('获取站点地图统计失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取统计信息失败'
    }, { status: 500 });
  }
}
