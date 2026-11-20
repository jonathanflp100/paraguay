import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const LANGS = ['es', 'pt-br', 'en', 'de', 'ru', 'uk', 'fr', 'it', 'zh-tw', 'ko', 'ja'];
const SERVICES = [
  'residencia-temporaria',
  'residencia-permanente',
  'cedula-identidade',
  'ruc',
  'abertura-empresa',
  'carteira-motorista',
  'traducao-apostilamento',
  'conta-bancaria',
];

// Gera sitemap.xml e robots.txt no build (usa VITE_SITE_URL)
function seoFiles(siteUrl: string) {
  return {
    name: 'seo-files',
    apply: 'build' as const,
    closeBundle(): void {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;
      const base = siteUrl.replace(/\/$/, '');
      const robots = ['User-agent: *', 'Allow: /', 'Disallow: /admin'];
      if (base) robots.push(`Sitemap: ${base}/sitemap.xml`);
      fs.writeFileSync(path.join(distDir, 'robots.txt'), robots.join('\n') + '\n');
      if (!base) return;

      const paths: string[] = [];
      for (const lang of LANGS) {
        paths.push(`/${lang}`, `/${lang}/blog`, `/${lang}/privacidade`);
        for (const s of SERVICES) paths.push(`/${lang}/servicos/${s}`);
        const blogDir = path.resolve(__dirname, 'src/content/blog', lang);
        if (fs.existsSync(blogDir)) {
          for (const f of fs.readdirSync(blogDir)) {
            if (f.endsWith('.md')) paths.push(`/${lang}/blog/${f.replace(/\.md$/, '')}`);
          }
        }
      }
      const today = new Date().toISOString().slice(0, 10);
      const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        paths.map((p) => `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
        '\n</urlset>\n';
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      seoFiles(env.VITE_SITE_URL || process.env.VITE_SITE_URL || ''),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
