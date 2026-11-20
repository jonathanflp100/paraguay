import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { triggerWhatsAppLink } from '../lib/whatsapp';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items?: FaqItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function FaqAccordion({
  items,
  eyebrow,
  title,
  subtitle,
  compact = false,
}: FaqAccordionProps) {
  const { lang, t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqItems = items || t.faq.items;

  const handleCta = () => {
    triggerWhatsAppLink({
      message: t.whatsapp.defaultMessage,
      service: 'faq_cta',
      lang,
      source: 'faq',
    });
  };

  return (
    <section id={compact ? undefined : 'faq'} className={compact ? 'py-10' : 'py-20 lg:py-24 bg-white'}>
      <div className={compact ? '' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'}>
        {!compact && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-[#B08A36] mb-2">
              {eyebrow || t.faq.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
              {title || t.faq.title}
            </h2>
            <p className="mt-3 text-base text-slate-600">{subtitle || t.faq.subtitle}</p>
          </div>
        )}

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-5 text-left flex items-center justify-between gap-4 group cursor-pointer"
                >
                  <span className="text-base font-semibold text-[#0B1F3A] group-hover:text-[#1D3E6D] transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#B08A36] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="pb-5 pr-8 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!compact && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#F8F9FB] border border-slate-200 p-6">
            <p className="text-sm sm:text-base font-semibold text-[#0B1F3A]">{t.faq.ctaPrompt}</p>
            <button
              type="button"
              onClick={handleCta}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#132D52] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
              <span>{t.faq.ctaButton}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
