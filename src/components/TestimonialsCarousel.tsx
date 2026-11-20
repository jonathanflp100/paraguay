import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export function TestimonialsCarousel() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const items = t.testimonials.items;

  const prev = () => setIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  const current = items[index] || items[0];

  return (
    <section className="py-20 lg:py-24 bg-[#F8F9FB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#B08A36] mb-2">{t.testimonials.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
              {t.testimonials.title}
            </h2>
            <p className="mt-2.5 text-sm text-slate-500">{t.testimonials.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={prev}
              aria-label={t.testimonials.prevLabel}
              className="w-11 h-11 rounded-xl border border-slate-200 bg-white text-[#0B1F3A] flex items-center justify-center hover:border-[#C9A24B] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t.testimonials.nextLabel}
              className="w-11 h-11 rounded-xl border border-slate-200 bg-white text-[#0B1F3A] flex items-center justify-center hover:border-[#C9A24B] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/90 p-7 sm:p-10 shadow-sm">
          <Quote className="w-8 h-8 text-[#C9A24B] mb-5" aria-hidden="true" />
          <blockquote className="text-lg sm:text-xl font-medium text-[#0B1F3A] leading-relaxed min-h-[96px]">
            “{current.quote}”
          </blockquote>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[#0B1F3A]">{current.author}</p>
              <p className="text-sm text-slate-500 mt-0.5">
                {current.origin} · {current.service}
              </p>
            </div>

            <div className="flex items-center gap-2" role="tablist" aria-label={t.testimonials.eyebrow}>
              {items.map((item, i) => (
                <button
                  key={item.author}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === index ? 'w-7 bg-[#0B1F3A]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
