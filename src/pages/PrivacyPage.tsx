import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { formatTemplate, useI18n } from '../lib/i18n';
import { SEOHead } from '../components/SEOHead';

export function PrivacyPage() {
  const { lang, t } = useI18n();

  return (
    <>
      <SEOHead
        lang={lang}
        title={formatTemplate(t.meta.privacyTitle, { company: SITE_CONFIG.companyName })}
        description={t.meta.privacyDesc}
        pathWithoutLang="/privacidade"
      />

      <section className="py-14 lg:py-20 bg-[#F8F9FB]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B1F3A] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t.servicePage.backHome}</span>
          </Link>

          <p className="text-sm font-semibold text-[#B08A36] mb-2">{t.privacy.eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
            {t.privacy.title}
          </h1>
          <p className="mt-2 text-xs text-slate-500">{t.privacy.updated}</p>

          <div className="mt-8 rounded-2xl bg-white border border-slate-200 p-6 sm:p-10 space-y-8">
            <p className="text-base text-slate-700 leading-relaxed">
              {formatTemplate(t.privacy.intro, { company: SITE_CONFIG.companyName })}
            </p>

            {t.privacy.sections.map((sec) => (
              <div key={sec.title} className="space-y-2">
                <h2 className="text-lg font-bold text-[#0B1F3A]">{sec.title}</h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{sec.body}</p>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100 text-sm text-slate-600">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="font-semibold text-[#0B1F3A] hover:text-[#B08A36] transition-colors"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
