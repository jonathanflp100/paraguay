import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Car,
  Check,
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
  Globe,
  HeartHandshake,
  IdCard,
  Landmark,
  Languages,
  Laptop,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { SERVICE_SLUGS, SITE_CONFIG } from '../config';
import { formatTemplate, useI18n } from '../lib/i18n';
import { triggerWhatsAppLink } from '../lib/whatsapp';
import type { ServiceSlug } from '../types';
import { SEOHead } from '../components/SEOHead';
import { SafeImage } from '../components/SafeImage';
import { QuickChecker } from '../components/QuickChecker';
import { ProcessTracker } from '../components/ProcessTracker';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';
import { FaqAccordion } from '../components/FaqAccordion';

const SERVICE_ICONS: Record<ServiceSlug, ComponentType<{ className?: string }>> = {
  'residencia-temporaria': FileCheck2,
  'residencia-permanente': BadgeCheck,
  'cedula-identidade': IdCard,
  ruc: FileText,
  'abertura-empresa': Building2,
  'carteira-motorista': Car,
  'traducao-apostilamento': Languages,
  'conta-bancaria': Landmark,
};

const AUDIENCE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  retirees: HeartHandshake,
  entrepreneurs: Briefcase,
  nomads: Laptop,
  families: Users,
  neighbors: Globe,
};

export function HomePage() {
  const { lang, t } = useI18n();

  const handleWhatsApp = (message: string, service: string, source: string) => {
    triggerWhatsAppLink({ message, service, lang, source });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_CONFIG.companyName,
    description: t.meta.homeDesc,
    telephone: SITE_CONFIG.whatsappNumber,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address,
      addressLocality: 'Asunción',
      addressCountry: 'PY',
    },
    areaServed: 'PY',
  };

  return (
    <>
      <SEOHead
        lang={lang}
        title={formatTemplate(t.meta.homeTitle, { company: SITE_CONFIG.companyName })}
        description={t.meta.homeDesc}
        pathWithoutLang=""
        jsonLd={jsonLd}
      />

      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B1F3A] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <p className="text-sm font-semibold text-[#C9A24B] mb-4">{t.hero.eyebrow}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-[3.1rem] font-extrabold tracking-tight leading-[1.12] text-white">
                {t.hero.title}
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-xl">
                {t.hero.subtitle}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  type="button"
                  onClick={() =>
                    handleWhatsApp(t.whatsapp.defaultMessage, 'hero_primary', 'hero')
                  }
                  className="inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-xl bg-[#C9A24B] text-[#0B1F3A] text-sm sm:text-base font-bold hover:bg-[#D9B768] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  <span>{t.hero.ctaPrimary}</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('servicos')}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-white/25 text-white text-sm sm:text-base font-semibold hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{t.hero.ctaSecondary}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="lg:col-span-6"
            >
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[320px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
                <SafeImage
                  src={SITE_CONFIG.images.skyline}
                  alt={t.hero.imageAlt}
                  priority
                  lazy={false}
                  className="w-full h-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#061224]/55 via-transparent to-transparent"
                />
              </div>
            </motion.div>
          </div>

          {/* Unboxed trust markers row below the hero split */}
          <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#C9A24B] shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-slate-100">{t.hero.trust1}</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C9A24B] shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-slate-100">{t.hero.trust2}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#C9A24B] shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-slate-100">{t.hero.trust3}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARA QUEM É */}
      <section className="py-20 lg:py-24 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-[#B08A36] mb-2">{t.audience.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
              {t.audience.title}
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">{t.audience.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
            {t.audience.items.map((item, idx) => {
              const Icon = AUDIENCE_ICONS[item.id] || Users;
              const spanClass = idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className={`${spanClass} rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between hover:border-[#C9A24B]/70 transition-colors`}
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-[#0B1F3A]/5 text-[#0B1F3A] flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-[#B08A36]" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0B1F3A]">{item.title}</h3>
                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        handleWhatsApp(
                          formatTemplate(t.whatsapp.serviceTemplate, { service: item.title }),
                          `profile:${item.id}`,
                          'audience_card'
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1F3A] hover:text-[#B08A36] transition-colors cursor-pointer"
                    >
                      <span>{t.audience.cta}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. POR QUE O PARAGUAI */}
      <section className="py-20 lg:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-5">
              <div className="h-72 sm:h-96 lg:h-full rounded-2xl overflow-hidden border border-slate-200">
                <SafeImage
                  src={SITE_CONFIG.images.family}
                  alt={t.whyParaguay.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-sm font-semibold text-[#B08A36] mb-2">{t.whyParaguay.eyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
                {t.whyParaguay.title}
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                {t.whyParaguay.subtitle}
              </p>

              <div className="mt-8 divide-y divide-slate-200 border-t border-slate-200">
                {t.whyParaguay.items.map((benefit, idx) => (
                  <div key={benefit.title} className="py-5 flex items-start gap-4">
                    <span className="text-sm font-bold text-[#C9A24B] tabular-nums pt-0.5">
                      0{idx + 1}.
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[#0B1F3A]">{benefit.title}</h3>
                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs font-medium text-slate-500">{t.whyParaguay.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVIÇOS (8 CARDS) */}
      <section id="servicos" className="py-20 lg:py-24 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#B08A36] mb-2">
                {t.servicesSection.eyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
                {t.servicesSection.title}
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                {t.servicesSection.subtitle}
              </p>
            </div>
            <p className="text-xs font-medium text-slate-500 max-w-xs">
              {t.servicesSection.consultNotice}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICE_SLUGS.map((slug, idx) => {
              const service = t.services[slug];
              const Icon = SERVICE_ICONS[slug] || CreditCard;
              return (
                <motion.article
                  key={slug}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, delay: idx * 0.03 }}
                  className="rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between hover:border-[#C9A24B]/80 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] text-[#C9A24B] flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0B1F3A]">{service.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleWhatsApp(
                          formatTemplate(t.whatsapp.serviceTemplate, { service: service.title }),
                          slug,
                          'services_grid'
                        )
                      }
                      className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#0B1F3A] text-white text-xs sm:text-sm font-semibold hover:bg-[#132D52] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                      <span>{t.servicesSection.ctaWant}</span>
                    </button>
                    <Link
                      to={`/${lang}/servicos/${slug}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 h-9 text-xs font-semibold text-slate-600 hover:text-[#0B1F3A] transition-colors"
                    >
                      <span>{t.servicesSection.ctaDetails}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PACOTES */}
      <section id="pacotes" className="py-20 lg:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-[#B08A36] mb-2">{t.packages.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
              {t.packages.title}
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">{t.packages.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {t.packages.items.map((pkg) => {
              const isFeatured = Boolean(pkg.featured);
              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all ${
                    isFeatured
                      ? 'bg-[#0B1F3A] text-white border-2 border-[#C9A24B] shadow-lg'
                      : 'bg-[#F8F9FB] text-[#0B1F3A] border border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-xs font-bold tracking-wide ${
                          isFeatured ? 'text-[#C9A24B]' : 'text-[#B08A36]'
                        }`}
                      >
                        {pkg.subtitle}
                      </span>
                      {isFeatured && (
                        <span className="text-xs font-bold text-[#0B1F3A] bg-[#C9A24B] px-2.5 py-1 rounded-md whitespace-nowrap">
                          {t.packages.mostPopular}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-2xl font-extrabold ${
                        isFeatured ? 'text-white' : 'text-[#0B1F3A]'
                      }`}
                    >
                      {pkg.name}
                    </h3>
                    <p
                      className={`mt-2.5 text-sm leading-relaxed ${
                        isFeatured ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {pkg.description}
                    </p>

                    <ul className="mt-6 pt-6 border-t border-current/10 space-y-3">
                      {pkg.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-sm">
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isFeatured ? 'text-[#C9A24B]' : 'text-[#0B1F3A]'
                            }`}
                            aria-hidden="true"
                          />
                          <span className={isFeatured ? 'text-slate-100' : 'text-slate-700'}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={() =>
                        handleWhatsApp(
                          formatTemplate(t.whatsapp.packageTemplate, {
                            package: `${pkg.name} (${pkg.subtitle})`,
                          }),
                          `package:${pkg.id}`,
                          'packages_section'
                        )
                      }
                      className={`w-full inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                        isFeatured
                          ? 'bg-[#C9A24B] text-[#0B1F3A] hover:bg-[#D9B768]'
                          : 'bg-[#0B1F3A] text-white hover:bg-[#132D52]'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>{t.packages.ctaQuote}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">{t.packages.consultNote}</p>
        </div>
      </section>

      {/* 6. COMO FUNCIONA */}
      <section className="py-20 lg:py-24 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-[#B08A36] mb-2">{t.howItWorks.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
              {t.howItWorks.title}
            </h2>
            <p className="mt-3 text-base text-slate-600">{t.howItWorks.subtitle}</p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.howItWorks.steps.map((step) => (
              <li
                key={step.number}
                className="rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col"
              >
                <span className="text-2xl font-extrabold text-[#C9A24B] tabular-nums mb-4">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-[#0B1F3A]">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>

          {/* WhatsApp-only security highlight */}
          <div className="mt-10 rounded-2xl bg-white border border-[#C9A24B]/50 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F7F1E1] text-[#B08A36] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
                {t.howItWorks.securityTitle}
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                {t.howItWorks.securityDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VERIFICADOR RÁPIDO */}
      <QuickChecker />

      {/* 8. ACOMPANHE SEU PROCESSO */}
      <ProcessTracker />

      {/* 9. DEPOIMENTOS */}
      <TestimonialsCarousel />

      {/* 10. PERGUNTAS FREQUENTES */}
      <FaqAccordion />

      {/* 11. SOBRE NÓS */}
      <section id="sobre" className="py-20 lg:py-24 bg-[#F8F9FB] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-semibold text-[#B08A36] mb-2">{t.about.eyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
                {t.about.title}
              </h2>
              <p className="mt-5 text-base text-slate-600 leading-relaxed">{t.about.story1}</p>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">{t.about.story2}</p>

              <div className="mt-8 space-y-5 pt-6 border-t border-slate-200">
                {t.about.differentials.map((diff) => (
                  <div key={diff.title} className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h3 className="text-sm font-bold text-[#0B1F3A]">{diff.title}</h3>
                      <p className="text-sm text-slate-600 mt-0.5">{diff.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-72 sm:h-96 lg:h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <SafeImage
                  src={SITE_CONFIG.images.office}
                  alt={t.about.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CHAMADA FINAL */}
      <section className="py-16 lg:py-20 bg-[#0B1F3A] text-white relative overflow-hidden">
        <div
          aria-hidden="true"
          className="h-1 w-full bg-gradient-to-r from-[#B8333A] via-[#C9A24B] to-[#0B1F3A] absolute top-0 left-0"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.finalCta.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto leading-relaxed">
            {t.finalCta.subtitle}
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() =>
                handleWhatsApp(t.whatsapp.defaultMessage, 'final_cta', 'final_banner')
              }
              className="inline-flex items-center justify-center gap-2.5 h-13 px-7 rounded-xl bg-[#C9A24B] text-[#0B1F3A] text-base font-bold hover:bg-[#D9B768] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <span>{t.finalCta.button}</span>
            </button>
          </div>
          <p className="mt-4 text-xs text-slate-300/80">{t.finalCta.note}</p>
        </div>
      </section>
    </>
  );
}
