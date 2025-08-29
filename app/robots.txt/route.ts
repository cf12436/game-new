import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://game-hub.site';
  
  const robotsTxt = `User-agent: *
Allow: /

# 站点地图
Sitemap: ${baseUrl}/api/sitemap

# 禁止爬取的路径
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# 爬取延迟（毫秒）
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // 缓存24小时
    },
  });
}
