import type { BlogPost, LangCode } from '../types';

const rawMarkdownFiles = import.meta.glob('/src/content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

interface ParsedFrontmatter {
  meta: Record<string, string>;
  body: string;
}

function parseFrontmatter(raw: string): ParsedFrontmatter {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return { meta: {}, body: normalized.trim() };
  }

  const endIndex = normalized.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return { meta: {}, body: normalized.trim() };
  }

  const header = normalized.slice(4, endIndex);
  const body = normalized.slice(endIndex + 5).trim();
  const meta: Record<string, string> = {};

  for (const line of header.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line
      .slice(colonIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    meta[key] = val;
  }

  return { meta, body };
}

const VALID_IMAGE_KEYS = new Set(['skyline', 'documents', 'family', 'corporate', 'office']);

let cachedPosts: BlogPost[] | null = null;

function loadAllPosts(): BlogPost[] {
  if (cachedPosts) return cachedPosts;

  const posts: BlogPost[] = [];
  for (const [filePath, rawContent] of Object.entries(rawMarkdownFiles)) {
    // Path format: /src/content/blog/<lang>/<slug>.md
    const match = filePath.match(/\/src\/content\/blog\/([^/]+)\/([^/]+)\.md$/);
    if (!match) continue;

    const lang = match[1] as LangCode;
    const slug = match[2];
    const { meta, body } = parseFrontmatter(rawContent);
    const imageKey = VALID_IMAGE_KEYS.has(meta.image || '')
      ? (meta.image as BlogPost['imageKey'])
      : 'skyline';

    posts.push({
      slug,
      lang,
      title: meta.title || slug,
      excerpt: meta.excerpt || '',
      date: meta.date || '2026',
      readTime: meta.readTime || '4 min',
      category: meta.category || 'Paraguay',
      imageKey,
      content: body,
    });
  }

  posts.sort((a, b) => a.slug.localeCompare(b.slug));
  cachedPosts = posts;
  return posts;
}

export function getBlogPostsByLang(lang: LangCode): BlogPost[] {
  return loadAllPosts().filter((post) => post.lang === lang);
}

export function getBlogPost(lang: LangCode, slug: string): BlogPost | undefined {
  return loadAllPosts().find((post) => post.lang === lang && post.slug === slug);
}
