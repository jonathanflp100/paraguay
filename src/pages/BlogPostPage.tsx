import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Info, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { getBlogPost } from '../lib/blog';
import { formatTemplate, useI18n } from '../lib/i18n';
import { triggerWhatsAppLink } from '../lib/whatsapp';
import { SEOHead } from '../components/SEOHead';
import { SafeImage } from '../components/SafeImage';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { NotFoundPage } from './NotFoundPage';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useI18n();

  const post = slug ? getBlogPost(lang, slug) : undefined;
  if (!post) {
    return <NotFoundPage />;
  }

  const handleWhatsApp = () => {
    triggerWhatsAppLink({
      message: formatTemplate(t.whatsapp.serviceTemplate, { service: post.title }),
      service: `blog:${post.slug}`,
      lang,
      source: 'blog_post',
    });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.companyName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.companyName,
    },
  };

  return (
    <>
      <SEOHead
        lang={lang}
        title={`${post.title} — ${SITE_CONFIG.companyName}`}
        description={post.excerpt}
        pathWithoutLang={`/blog/${post.slug}`}
        ogType="article"
        jsonLd={jsonLd}
      />

      <article className="py-12 lg:py-16 bg-[#F8F9FB]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/${lang}/blog`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B1F3A] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t.blog.backToBlog}</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <span className="font-semibold text-[#B08A36]">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.date}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A] leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">{post.excerpt}</p>

          <div className="mt-8 aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200">
            <SafeImage
              src={SITE_CONFIG.images[post.imageKey]}
              alt={post.title}
              priority
              lazy={false}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-10 rounded-2xl bg-white border border-slate-200 p-6 sm:p-10">
            <MarkdownRenderer content={post.content} />

            {/* Explicit general disclaimer box */}
            <div className="mt-10 rounded-xl bg-[#F8F9FB] border border-slate-200 p-5 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#B08A36] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-[#0B1F3A]">{t.blog.disclaimerTitle}</p>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  {t.blog.disclaimerText}
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Conversion CTA */}
          <div className="mt-8 rounded-2xl bg-[#0B1F3A] text-white p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">{t.blog.ctaTitle}</h2>
              <p className="mt-1.5 text-sm text-slate-200">{t.blog.ctaDesc}</p>
            </div>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#C9A24B] text-[#0B1F3A] text-sm font-bold hover:bg-[#D9B768] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>{t.blog.ctaButton}</span>
            </button>
          </div>
        </div>
      </article>
    </>
  );
}
