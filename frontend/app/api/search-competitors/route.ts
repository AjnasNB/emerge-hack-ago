import { NextRequest } from 'next/server';
import { searchWeb, scrapeUrl } from '@/lib/scraper';

export async function POST(req: NextRequest) {
  try {
    const { query, brand, count = 3 } = (await req.json()) as {
      query: string;
      brand?: string;
      count?: number;
    };

    if (!query?.trim()) {
      return Response.json({ error: 'Query is required' }, { status: 400 });
    }

    // Search the web for competitor content
    const searchQuery = brand
      ? `${query} -site:${brand.toLowerCase().replace(/\s+/g, '')}.com`
      : query;

    const searchResults = await searchWeb(searchQuery, Math.min(count + 2, 8));

    if (searchResults.length === 0) {
      return Response.json({
        competitors: [],
        message: 'Web search returned no results. Try the synthetic competitor generator instead.',
      });
    }

    // Scrape top results in parallel (with error tolerance)
    const scrapePromises = searchResults.slice(0, count + 2).map(async (result) => {
      try {
        const scraped = await scrapeUrl(result.url);
        if (scraped.content.length < 100) return null;
        return {
          brand: scraped.brand || result.title.split(' - ')[0].split(' | ')[0].trim(),
          content: scraped.content,
          url: result.url,
          title: scraped.title || result.title,
          wordCount: scraped.wordCount,
        };
      } catch {
        return null;
      }
    });

    const scraped = await Promise.all(scrapePromises);
    const competitors = scraped.filter(Boolean).slice(0, count);

    return Response.json({
      competitors,
      searchResults: searchResults.map((r) => ({
        title: r.title,
        url: r.url,
        snippet: r.snippet,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Search failed';
    console.error('Search error:', error);
    return Response.json({ error: message }, { status: 500 });
  }
}
