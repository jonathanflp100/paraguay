import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';
import { formatTemplate, useI18n } from '../lib/i18n';
import { saveLead } from '../lib/supabase';
import { buildWhatsAppUrl, triggerWhatsAppLink } from '../lib/whatsapp';

type ObjectiveKey = 'morar' | 'investir' | 'aposentar' | 'trabalhar' | 'estudar';

export function QuickChecker() {
  const { lang, t } = useI18n();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [objective, setObjective] = useState<ObjectiveKey | ''>('');
  const [inParaguay, setInParaguay] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completedUrl, setCompletedUrl] = useState<string | null>(null);

  const resolvedCountry = country === '__other__' ? customCountry.trim() : country;

  const getSuggestedService = (obj: ObjectiveKey | ''): string => {
    if (obj === 'investir') return t.services['abertura-empresa'].title;
    if (obj === 'trabalhar') return `${t.packages.items[1]?.name || 'Completo'} (${t.services['residencia-temporaria'].title} + ${t.services.ruc.title})`;
    if (obj === 'aposentar') return t.services['residencia-permanente'].title;
    return t.services['residencia-temporaria'].title;
  };

  const canAdvance = (): boolean => {
    if (step === 1) return resolvedCountry.length >= 2;
    if (step === 2) return objective !== '';
    if (step === 3) return inParaguay !== null;
    return true;
  };

  const handleFinish = async () => {
    if (!objective || inParaguay === null || !resolvedCountry) return;

    setSubmitting(true);
    const suggestedService = getSuggestedService(objective);
    const objectiveLabel = t.checker.objectives[objective];

    const message = formatTemplate(t.whatsapp.checkerTemplate, {
      name: name.trim() || t.whatsapp.notProvided,
      country: resolvedCountry,
      objective: objectiveLabel,
      inParaguay: inParaguay ? t.whatsapp.yesLabel : t.whatsapp.noLabel,
      service: suggestedService,
    });

    // Save to Supabase leads table (never blocks WhatsApp on failure)
    try {
      await saveLead({
        nome: name.trim() || null,
        pais: resolvedCountry,
        objetivo: objective,
        ja_no_paraguai: inParaguay,
        servico: suggestedService,
        idioma: lang,
        origem: 'verificador',
      });
    } catch {
      // Proceed to WhatsApp even if persistence fails
    }

    const url = buildWhatsAppUrl(message);
    setCompletedUrl(url);
    setSubmitting(false);

    triggerWhatsAppLink({
      message,
      service: `verificador:${suggestedService}`,
      lang,
      source: 'verificador',
    });
  };

  const handleReset = () => {
    setStep(1);
    setCountry('');
    setCustomCountry('');
    setObjective('');
    setInParaguay(null);
    setName('');
    setCompletedUrl(null);
  };

  const progressPercent = completedUrl ? 100 : (step / 4) * 100;

  return (
    <section id="verificador" className="py-20 lg:py-24 bg-[#0B1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-semibold text-[#C9A24B] mb-2">{t.checker.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.checker.title}
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">{t.checker.subtitle}</p>
        </div>

        <div className="bg-white text-[#0B1F3A] rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
          {/* Progress header */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2.5 tabular-nums">
              <span>
                {formatTemplate(t.checker.stepOf, {
                  current: String(completedUrl ? 4 : step),
                  total: '4',
                })}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A24B] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {completedUrl ? (
            <div className="text-center py-4 space-y-6">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-2xl font-bold text-[#0B1F3A]">{t.checker.doneTitle}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t.checker.doneDesc}</p>
              </div>

              <div className="max-w-md mx-auto text-left bg-[#F8F9FB] rounded-xl p-4 border border-slate-200 text-sm space-y-1.5">
                <p className="font-semibold text-[#0B1F3A]">{t.checker.summaryTitle}</p>
                <p className="text-slate-600">
                  {resolvedCountry} · {objective ? t.checker.objectives[objective] : ''} ·{' '}
                  {inParaguay ? t.whatsapp.yesLabel : t.whatsapp.noLabel}
                </p>
                <p className="text-xs text-[#B08A36] font-semibold">
                  {t.checker.recommendedPrefix}: {getSuggestedService(objective)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={completedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#16A34A] text-white font-semibold hover:bg-[#15803D] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  <span>{t.checker.openWhatsappNow}</span>
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>{t.checker.restart}</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Step 1: Country */}
              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2.5">
                    <Globe className="w-5 h-5 text-[#C9A24B]" aria-hidden="true" />
                    <span>{t.checker.step1Title}</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {t.checker.countries.map((item) => {
                      const active = country === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setCountry(item);
                            setCustomCountry('');
                          }}
                          className={`px-3.5 py-2.5 rounded-xl text-sm font-medium text-left border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-[#C9A24B]'
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setCountry('__other__')}
                      className={`px-3.5 py-2.5 rounded-xl text-sm font-medium text-left border transition-colors cursor-pointer ${
                        country === '__other__'
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#C9A24B]'
                      }`}
                    >
                      {t.checker.otherCountry}
                    </button>
                  </div>

                  {country === '__other__' && (
                    <div className="pt-1">
                      <input
                        type="text"
                        value={customCountry}
                        onChange={(e) => setCustomCountry(e.target.value)}
                        placeholder={t.checker.step1Placeholder}
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Objective */}
              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-[#0B1F3A]">{t.checker.step2Title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(t.checker.objectives) as ObjectiveKey[]).map((key) => {
                      const active = objective === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setObjective(key)}
                          className={`p-4 rounded-xl text-left border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                              : 'bg-white text-[#0B1F3A] border-slate-200 hover:border-[#C9A24B]'
                          }`}
                        >
                          <span className="font-semibold text-sm sm:text-base">
                            {t.checker.objectives[key]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Already in Paraguay */}
              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-[#0B1F3A]">{t.checker.step3Title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setInParaguay(true)}
                      className={`p-5 rounded-xl text-left border transition-colors cursor-pointer ${
                        inParaguay === true
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                          : 'bg-white text-[#0B1F3A] border-slate-200 hover:border-[#C9A24B]'
                      }`}
                    >
                      <span className="font-semibold text-base block">{t.checker.inParaguayYes}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInParaguay(false)}
                      className={`p-5 rounded-xl text-left border transition-colors cursor-pointer ${
                        inParaguay === false
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                          : 'bg-white text-[#0B1F3A] border-slate-200 hover:border-[#C9A24B]'
                      }`}
                    >
                      <span className="font-semibold text-base block">{t.checker.inParaguayNo}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Optional Name + Summary */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">{t.checker.step4Title}</h3>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.checker.step4Placeholder}
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 text-base text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                    />
                    <p className="mt-2 text-xs text-slate-500">{t.checker.step4Optional}</p>
                  </div>

                  <div className="rounded-xl bg-[#F8F9FB] border border-slate-200 p-4 space-y-1.5 text-sm">
                    <p className="font-semibold text-[#0B1F3A]">{t.checker.summaryTitle}</p>
                    <p className="text-slate-600">
                      {resolvedCountry} · {objective ? t.checker.objectives[objective] : ''} ·{' '}
                      {inParaguay ? t.whatsapp.yesLabel : t.whatsapp.noLabel}
                    </p>
                    <p className="text-xs font-semibold text-[#B08A36]">
                      {t.checker.recommendedPrefix}: {getSuggestedService(objective)}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>{t.checker.back}</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    disabled={!canAdvance()}
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#132D52] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <span>{t.checker.next}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleFinish}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{submitting ? t.checker.saving : t.checker.finish}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
