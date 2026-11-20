import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { getBlogPostsByLang } from '../lib/blog';
import { formatTemplate, useI18n } from '../lib/i18n';
import { triggerWhatsAppLink } from '../lib/whatsapp';
import { SEOHead } from '../components/SEOHead';
import { SafeImage } from '../components/SafeImage';

export function BlogListPage() {
  const { lang, t } = useI18n();
  const posts = getBlogPostsByLang(lang);

  const handleWhatsApp = () => {
    triggerWhatsAppLink({
      message: t.whatsapp.defaultMessage,
      service: 'blog_list_cta',
      lang,
      source: 'blog_list',
    });
  };

  return (
    <>
      <SEOHead
        lang={lang}
        title={formatTemplate(t.meta.blogTitle, { company: SITE_CONFIG.companyName })}
        description={t.meta.blogDesc}
        pathWithoutLang="/blog"
      />

      <section className="bg-[#0B1F3A] text-white py-14 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#C9A24B] mb-2">{t.blog.eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl">
            {t.blog.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200/90 max-w-2xl leading-relaxed">
            {t.blog.subtitle}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-[#F8F9FB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#C9A24B] transition-colors"
              >
                <div>
                  <Link to={`/${lang}/blog/${post.slug}`} className="block aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={SITE_CONFIG.images[post.imageKey]}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                      <span className="font-semibold text-[#B08A36]">{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-lg font-bold text-[#0B1F3A] leading-snug">
                      <Link
                        to={`/${lang}/blog/${post.slug}`}
                        className="hover:text-[#1D3E6D] transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{post.excerpt}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link
                    to={`/${lang}/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1F3A] hover:text-[#B08A36] transition-colors"
                  >
                    <span>{t.blog.readArticle}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* General Disclaimer & CTA */}
          <div className="mt-14 rounded-2xl bg-white border border-slate-200 p-7 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-xl font-bold text-[#0B1F3A]">{t.blog.ctaTitle}</h2>
              <p className="mt-1.5 text-sm text-slate-600">{t.blog.ctaDesc}</p>
            </div>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#132D52] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
              <span>{t.blog.ctaButton}</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
