import { Helmet } from 'react-helmet-async';
import { DEFAULT_LANG, LANGUAGES, SITE_CONFIG, getSiteBaseUrl } from '../config';
import type { LangCode } from '../types';

interface SEOHeadProps {
  lang: LangCode;
  title: string;
  description: string;
  pathWithoutLang?: string; // e.g. "" or "/servicos/ruc" or "/blog"
  ogType?: 'website' | 'article';
  jsonLd?: Record<string, unknown>;
  noIndex?: boolean;
}

export function SEOHead({
  lang,
  title,
  description,
  pathWithoutLang = '',
  ogType = 'website',
  jsonLd,
  noIndex = false,
}: SEOHeadProps) {
  const langMeta = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const baseUrl = getSiteBaseUrl();
  const cleanSubPath = pathWithoutLang
    ? pathWithoutLang.startsWith('/')
      ? pathWithoutLang
      : `/${pathWithoutLang}`
    : '';

  const canonicalUrl = baseUrl ? `${baseUrl}/${lang}${cleanSubPath}` : `/${lang}${cleanSubPath}`;
  const defaultUrl = baseUrl
    ? `${baseUrl}/${DEFAULT_LANG}${cleanSubPath}`
    : `/${DEFAULT_LANG}${cleanSubPath}`;

  return (
    <Helmet>
      <html lang={langMeta.hreflang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <link rel="canonical" href={canonicalUrl} />

      {!noIndex &&
        LANGUAGES.map((item) => (
          <link
            key={item.code}
            rel="alternate"
            hrefLang={item.hreflang}
            href={baseUrl ? `${baseUrl}/${item.code}${cleanSubPath}` : `/${item.code}${cleanSubPath}`}
          />
        ))}
      {!noIndex && <link rel="alternate" hrefLang="x-default" href={defaultUrl} />}

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_CONFIG.companyName} />
      <meta property="og:locale" content={langMeta.ogLocale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
