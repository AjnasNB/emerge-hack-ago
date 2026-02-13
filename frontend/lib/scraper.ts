import * as cheerio from 'cheerio';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// ─── Scrape a URL and extract readable text ─────────────────

export interface ScrapeResult {
  title: string;
  brand: string;
  content: string;
  url: string;
  wordCount: number;
}

export async function scrapeUrl(rawUrl: string): Promise<ScrapeResult> {
  // Normalize URL
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': UA,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return extractContent(html, url);
  } finally {
    clearTimeout(timeout);
  }
}

function extractContent(html: string, url: string): ScrapeResult {
  const $ = cheerio.load(html);

  // Remove noisy elements
  $(
    'script, style, nav, footer, header, iframe, noscript, svg, ' +
      '[role="navigation"], [role="banner"], [role="complementary"], ' +
      '.nav, .footer, .header, .sidebar, .menu, .ad, .advertisement, ' +
      '.cookie-banner, .popup, .modal, .social-share, .comments, ' +
      '#comments, .related-posts, .breadcrumb'
  ).remove();

  // Extract title
  const title =
    $('meta[property="og:title"]').attr('content')?.trim() ||
    $('title').text().trim() ||
    $('h1').first().text().trim() ||
    '';

  // Extract brand/site name
  const hostname = new URL(url).hostname.replace('www.', '');
  const brand =
    $('meta[property="og:site_name"]').attr('content')?.trim() ||
    $('meta[name="application-name"]').attr('content')?.trim() ||
    capitalizeFirst(hostname.split('.')[0]);

  // Find main content area
  const selectors = [
    'main',
    'article',
    '[role="main"]',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.page-content',
    '#content',
    '#main-content',
    '.content',
    '#main',
  ];

  let contentSelector = 'body';
  for (const sel of selectors) {
    if ($(sel).length && $(sel).text().trim().length > 200) {
      contentSelector = sel;
      break;
    }
  }
  const contentEl = $(contentSelector).first();

  // Structured text extraction (preserves headings, lists, paragraphs)
  const parts: string[] = [];

  contentEl
    .find('h1, h2, h3, h4, h5, h6, p, li, td, th, blockquote, figcaption, dt, dd')
    .each((_, el) => {
      const tag = ($(el).prop('tagName') || '').toLowerCase();
      const txt = $(el).text().replace(/\s+/g, ' ').trim();
      if (!txt || txt.length < 3) return;

      if (tag.startsWith('h')) {
        parts.push(`\n## ${txt}\n`);
      } else if (tag === 'li') {
        parts.push(`- ${txt}`);
      } else if (tag === 'blockquote') {
        parts.push(`> ${txt}`);
      } else {
        parts.push(txt);
      }
    });

  let content = parts.join('\n');

  // Fallback: if structured extraction got too little, use raw text
  if (content.trim().length < 150) {
    content = contentEl
      .text()
      .replace(/\s+/g, ' ')
      .replace(/(.{80,}?)\s/g, '$1\n')
      .trim();
  }

  // Clean up
  content = content
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 8000);

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return { title, brand, content, url, wordCount };
}

// ─── Search the web for competitor URLs ─────────────────────

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export async function searchWeb(
  query: string,
  maxResults: number = 5
): Promise<SearchResult[]> {
  // Try DuckDuckGo HTML (lite version for reliability)
  try {
    return await searchDuckDuckGo(query, maxResults);
  } catch {
    // Fallback: return empty if search fails
    return [];
  }
}

async function searchDuckDuckGo(
  query: string,
  maxResults: number
): Promise<SearchResult[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'User-Agent': UA,
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `q=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Search HTTP ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    const results: SearchResult[] = [];

    $('.result, .web-result').each((i, el) => {
      if (results.length >= maxResults) return false;

      const linkEl = $(el).find('.result__a, .result-link, a').first();
      const snippetEl = $(el).find('.result__snippet, .result-snippet').first();

      const title = linkEl.text().trim();
      let url = linkEl.attr('href') || '';
      const snippet = snippetEl.text().trim();

      // DuckDuckGo wraps URLs in redirects
      if (url.includes('uddg=')) {
        const match = url.match(/uddg=([^&]+)/);
        if (match) url = decodeURIComponent(match[1]);
      }

      // Clean URL
      if (url.startsWith('//duckduckgo.com/l/?')) {
        const match = url.match(/uddg=([^&]+)/);
        if (match) url = decodeURIComponent(match[1]);
      }

      if (title && url && url.startsWith('http')) {
        results.push({ title, url, snippet });
      }
    });

    return results;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Utility ────────────────────────────────────────────────

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
