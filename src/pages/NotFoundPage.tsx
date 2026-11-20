import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { formatTemplate, useI18n } from '../lib/i18n';
import { triggerWhatsAppLink } from '../lib/whatsapp';
import { SEOHead } from '../components/SEOHead';

export function NotFoundPage() {
  const { lang, t } = useI18n();

  const handleWhatsApp = () => {
    triggerWhatsAppLink({
      message: t.whatsapp.defaultMessage,
      service: '404_page',
      lang,
      source: '404',
    });
  };

  return (
    <>
      <SEOHead
        lang={lang}
        title={formatTemplate(t.meta.notFoundTitle, { company: SITE_CONFIG.companyName })}
        description={t.notFound.desc}
        noIndex
      />

      <section className="py-24 lg:py-32 bg-[#F8F9FB]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-6xl font-extrabold text-[#C9A24B] tabular-nums">{t.notFound.code}</p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
            {t.notFound.title}
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">{t.notFound.desc}</p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/${lang}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#132D52] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{t.notFound.backHome}</span>
            </Link>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl border border-slate-300 bg-white text-[#0B1F3A] text-sm font-semibold hover:border-[#C9A24B] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#16A34A]" aria-hidden="true" />
              <span>{t.notFound.contactWhatsapp}</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
