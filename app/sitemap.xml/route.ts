import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  // 重定向到 /api/sitemap
  return NextResponse.redirect(new URL('/api/sitemap', 'https://game-hub.site'));
}
