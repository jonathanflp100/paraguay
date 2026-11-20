import { useState, type FormEvent } from 'react';
import { Check, Clock, MessageCircle, Search, AlertCircle } from 'lucide-react';
import { formatTemplate, useI18n } from '../lib/i18n';
import { consultarProcesso, isSupabaseConfigured } from '../lib/supabase';
import { triggerWhatsAppLink } from '../lib/whatsapp';
import type { PublicProcessResult } from '../types';

export function ProcessTracker() {
  const { lang, t } = useI18n();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicProcessResult | null>(null);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleaned = code.trim().toUpperCase();
    if (!cleaned) return;

    setLoading(true);
    setResult(null);
    setNotFoundCode(null);

    const { data } = await consultarProcesso(cleaned);
    setLoading(false);

    if (data) {
      setResult(data);
    } else {
      setNotFoundCode(cleaned);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(lang === 'pt-br' ? 'pt-BR' : lang, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const handleNotFoundWhatsApp = () => {
    const message = formatTemplate(t.whatsapp.notFoundProcessMessage, {
      code: notFoundCode || code.trim().toUpperCase(),
    });
    triggerWhatsAppLink({
      message,
      service: 'process_tracker_help',
      lang,
      source: 'tracker_not_found',
    });
  };

  return (
    <section id="acompanhar" className="py-20 lg:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-semibold text-[#B08A36] mb-2">{t.tracker.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
            {t.tracker.title}
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">{t.tracker.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={t.tracker.placeholder}
              aria-label={t.tracker.placeholder}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-white text-base font-mono uppercase tracking-wider text-[#0B1F3A] placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#0B1F3A] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="h-12 px-6 rounded-xl bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#132D52] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loading ? t.tracker.searching : t.tracker.button}
          </button>
        </form>

        {!isSupabaseConfigured && (
          <p className="mt-3 text-center text-xs text-slate-500">
            {t.tracker.demoHint}
          </p>
        )}

        {/* Result card */}
        {result && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-[#F8F9FB] p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {t.tracker.serviceLabel}
                </p>
                <h3 className="text-xl font-bold text-[#0B1F3A] mt-0.5">{result.servico}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 tabular-nums">
                <span>
                  {t.tracker.codeLabel}:{' '}
                  <strong className="font-mono text-[#0B1F3A]">{result.codigo}</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#B08A36]" aria-hidden="true" />
                  {t.tracker.updatedLabel}: {formatDate(result.atualizado_em)}
                </span>
              </div>
            </div>

            {/* 6-step visual progress bar */}
            <div>
              <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {t.tracker.stages.map((label, idx) => {
                  const stageNum = idx + 1;
                  const completed = stageNum < result.etapa;
                  const current = stageNum === result.etapa;
                  return (
                    <li
                      key={stageNum}
                      className={`rounded-xl p-3.5 border transition-colors ${
                        current
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                          : completed
                            ? 'bg-white text-[#0B1F3A] border-[#C9A24B]/60'
                            : 'bg-white/60 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 tabular-nums">
                        <span
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                            current
                              ? 'bg-[#C9A24B] text-[#0B1F3A]'
                              : completed
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {completed ? <Check className="w-3.5 h-3.5" /> : stageNum}
                        </span>
                      </div>
                      <p
                        className={`text-xs font-semibold leading-snug ${
                          current
                            ? 'text-white'
                            : completed
                              ? 'text-[#0B1F3A]'
                              : 'text-slate-500'
                        }`}
                      >
                        {label}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Public note */}
            <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5">
              <p className="text-xs font-semibold text-[#B08A36] mb-1">{t.tracker.noteLabel}</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {result.observacao || t.tracker.noNote}
              </p>
            </div>
          </div>
        )}

        {/* Friendly not found state */}
        {notFoundCode && (
          <div className="mt-8 max-w-xl mx-auto rounded-2xl border border-slate-200 bg-[#F8F9FB] p-6 text-center space-y-4">
            <div className="w-11 h-11 rounded-full bg-[#B8333A]/10 text-[#B8333A] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#0B1F3A]">{t.tracker.notFoundTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.tracker.notFoundDesc}</p>
            </div>
            <button
              type="button"
              onClick={handleNotFoundWhatsApp}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>{t.tracker.notFoundCta}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
