import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const adsPath = join(process.cwd(), 'ads.txt');
    const adsContent = await readFile(adsPath, 'utf-8');
    
    return new NextResponse(adsContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error reading ads.txt:', error);
    return new NextResponse('ads.txt not found', { status: 404 });
  }
}



