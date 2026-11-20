import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MessageCircle, ShieldCheck } from 'lucide-react';
import { SERVICE_IMAGE_MAP, SERVICE_SLUGS, SITE_CONFIG } from '../config';
import { formatTemplate, useI18n } from '../lib/i18n';
import { triggerWhatsAppLink } from '../lib/whatsapp';
import type { ServiceSlug } from '../types';
import { SEOHead } from '../components/SEOHead';
import { SafeImage } from '../components/SafeImage';
import { FaqAccordion } from '../components/FaqAccordion';
import { NotFoundPage } from './NotFoundPage';

export function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useI18n();

  if (!slug || !SERVICE_SLUGS.includes(slug as ServiceSlug)) {
    return <NotFoundPage />;
  }

  const serviceSlug = slug as ServiceSlug;
  const service = t.services[serviceSlug];
  const imageKey = SERVICE_IMAGE_MAP[serviceSlug];
  const otherSlugs = SERVICE_SLUGS.filter((s) => s !== serviceSlug).slice(0, 4);

  const handleWhatsApp = () => {
    triggerWhatsAppLink({
      message: formatTemplate(t.whatsapp.serviceTemplate, { service: service.title }),
      service: serviceSlug,
      lang,
      source: 'service_page',
    });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.seoDesc,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.companyName,
    },
    areaServed: 'PY',
  };

  return (
    <>
      <SEOHead
        lang={lang}
        title={formatTemplate(service.seoTitle, { company: SITE_CONFIG.companyName })}
        description={service.seoDesc}
        pathWithoutLang={`/servicos/${serviceSlug}`}
        jsonLd={jsonLd}
      />

      {/* Top Hero Banner */}
      <section className="bg-[#0B1F3A] text-white py-14 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-[#C9A24B] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t.servicePage.backHome}</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-sm font-semibold text-[#C9A24B] mb-2">
                {t.servicesSection.eyebrow}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                {service.title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-200/90 leading-relaxed">
                {service.shortDesc}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-xl bg-[#C9A24B] text-[#0B1F3A] text-sm sm:text-base font-bold hover:bg-[#D9B768] transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  <span>{t.servicePage.ctaButton}</span>
                </button>
              </div>
              <p className="mt-4 text-xs text-slate-300/80 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
                <span>{t.servicePage.whatsappNotice}</span>
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="h-60 sm:h-72 lg:h-full rounded-2xl overflow-hidden border border-white/15">
                <SafeImage
                  src={SITE_CONFIG.images[imageKey]}
                  alt={service.title}
                  priority
                  lazy={false}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-20 bg-[#F8F9FB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* What is it */}
          <div className="rounded-2xl bg-white border border-slate-200 p-7 sm:p-9">
            <h2 className="text-2xl font-bold text-[#0B1F3A]">{t.servicePage.whatIsTitle}</h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">{service.whatIs}</p>
            <p className="mt-4 text-sm font-medium text-[#B08A36]">
              {t.servicePage.consultBanner}
            </p>
          </div>

          {/* Who it's for + How it works */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-7">
              <h2 className="text-xl font-bold text-[#0B1F3A] mb-5">
                {t.servicePage.whoIsForTitle}
              </h2>
              <ul className="space-y-3.5">
                {service.whoIsFor.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-[#C9A24B] shrink-0 mt-1" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-7">
              <h2 className="text-xl font-bold text-[#0B1F3A] mb-5">
                {t.servicePage.howItWorksTitle}
              </h2>
              <ol className="space-y-3.5">
                {service.howItWorks.map((step, idx) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="font-bold text-[#B08A36] tabular-nums shrink-0">
                      0{idx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Service FAQ */}
          <div className="rounded-2xl bg-white border border-slate-200 p-7 sm:p-9">
            <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">{t.servicePage.faqTitle}</h2>
            <FaqAccordion items={service.faq} compact />
          </div>

          {/* CTA Box */}
          <div className="rounded-2xl bg-[#0B1F3A] text-white p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.servicePage.ctaTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
              {t.servicePage.ctaDesc}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#C9A24B] text-[#0B1F3A] text-sm font-bold hover:bg-[#D9B768] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span>{t.servicePage.ctaButton}</span>
              </button>
            </div>
          </div>

          {/* Other Services */}
          <div className="pt-4">
            <h2 className="text-xl font-bold text-[#0B1F3A] mb-5">
              {t.servicePage.otherServicesTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherSlugs.map((other) => (
                <Link
                  key={other}
                  to={`/${lang}/servicos/${other}`}
                  className="rounded-xl bg-white border border-slate-200 p-5 hover:border-[#C9A24B] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1F3A]">
                      {t.services[other].title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 line-clamp-2">
                      {t.services[other].shortDesc}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#B08A36]">
                    {t.servicesSection.ctaDetails}
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
