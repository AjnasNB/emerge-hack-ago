import { NextRequest } from 'next/server';
import { scrapeUrl } from '@/lib/scraper';

export async function POST(req: NextRequest) {
  try {
    const { url } = (await req.json()) as { url: string };

    if (!url?.trim()) {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await scrapeUrl(url);

    if (!result.content || result.content.length < 20) {
      return Response.json(
        { error: 'Could not extract meaningful content from this URL. The page may require JavaScript rendering.' },
        { status: 422 }
      );
    }

    return Response.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to scrape URL';
    console.error('Scrape error:', error);
    return Response.json({ error: message }, { status: 500 });
  }
}
