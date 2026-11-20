import { createContext, useContext } from 'react';
import { DEFAULT_LANG, LANGUAGES } from '../config';
import type { LangCode, ServiceSlug } from '../types';

import es from '../locales/es.json';
import ptBr from '../locales/pt-br.json';
import en from '../locales/en.json';
import de from '../locales/de.json';
import ru from '../locales/ru.json';
import uk from '../locales/uk.json';
import fr from '../locales/fr.json';
import it from '../locales/it.json';
import zhTw from '../locales/zh-tw.json';
import ko from '../locales/ko.json';
import ja from '../locales/ja.json';

export interface ServiceLocaleContent {
  title: string;
  shortDesc: string;
  whatIs: string;
  whoIsFor: string[];
  howItWorks: string[];
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDesc: string;
}

export interface LocaleDictionary {
  meta: {
    homeTitle: string;
    homeDesc: string;
    blogTitle: string;
    blogDesc: string;
    privacyTitle: string;
    privacyDesc: string;
    notFoundTitle: string;
  };
  nav: {
    services: string;
    packages: string;
    track: string;
    blog: string;
    about: string;
    ctaWhatsapp: string;
    menuLabel: string;
    languageLabel: string;
  };
  whatsapp: {
    floatingLabel: string;
    defaultMessage: string;
    serviceTemplate: string;
    packageTemplate: string;
    notFoundProcessMessage: string;
    checkerTemplate: string;
    yesLabel: string;
    noLabel: string;
    notProvided: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust1: string;
    trust2: string;
    trust3: string;
    imageAlt: string;
  };
  audience: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    items: {
      id: string;
      title: string;
      desc: string;
    }[];
  };
  whyParaguay: {
    eyebrow: string;
    title: string;
    subtitle: string;
    imageAlt: string;
    note: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
  servicesSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaWant: string;
    ctaDetails: string;
    consultNotice: string;
  };
  services: Record<ServiceSlug, ServiceLocaleContent>;
  packages: {
    eyebrow: string;
    title: string;
    subtitle: string;
    mostPopular: string;
    ctaQuote: string;
    consultNote: string;
    items: {
      id: string;
      name: string;
      subtitle: string;
      description: string;
      features: string[];
      featured?: boolean;
    }[];
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    securityTitle: string;
    securityDesc: string;
    steps: {
      number: string;
      title: string;
      desc: string;
    }[];
  };
  checker: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stepOf: string;
    next: string;
    back: string;
    finish: string;
    saving: string;
    step1Title: string;
    step1Placeholder: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    step4Placeholder: string;
    step4Optional: string;
    summaryTitle: string;
    doneTitle: string;
    doneDesc: string;
    openWhatsappNow: string;
    restart: string;
    objectives: {
      morar: string;
      investir: string;
      aposentar: string;
      trabalhar: string;
      estudar: string;
    };
    inParaguayYes: string;
    inParaguayNo: string;
    countries: string[];
    otherCountry: string;
    recommendedPrefix: string;
  };
  tracker: {
    eyebrow: string;
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    searching: string;
    demoHint: string;
    serviceLabel: string;
    codeLabel: string;
    updatedLabel: string;
    noteLabel: string;
    noNote: string;
    notFoundTitle: string;
    notFoundDesc: string;
    notFoundCta: string;
    stages: [string, string, string, string, string, string];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    subtitle: string;
    prevLabel: string;
    nextLabel: string;
    items: {
      quote: string;
      author: string;
      origin: string;
      service: string;
    }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrompt: string;
    ctaButton: string;
    items: { q: string; a: string }[];
  };
  about: {
    eyebrow: string;
    title: string;
    story1: string;
    story2: string;
    imageAlt: string;
    differentials: {
      title: string;
      desc: string;
    }[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    button: string;
    note: string;
  };
  footer: {
    description: string;
    servicesHeading: string;
    linksHeading: string;
    contactHeading: string;
    privacyLink: string;
    blogLink: string;
    trackLink: string;
    homeLink: string;
    whatsappOnlyNote: string;
    rights: string;
    privacyNotice: string;
  };
  servicePage: {
    backHome: string;
    whatIsTitle: string;
    whoIsForTitle: string;
    howItWorksTitle: string;
    faqTitle: string;
    otherServicesTitle: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
    whatsappNotice: string;
    consultBanner: string;
  };
  blog: {
    eyebrow: string;
    title: string;
    subtitle: string;
    readArticle: string;
    backToBlog: string;
    disclaimerTitle: string;
    disclaimerText: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
  };
  privacy: {
    eyebrow: string;
    title: string;
    updated: string;
    intro: string;
    sections: {
      title: string;
      body: string;
    }[];
  };
  notFound: {
    code: string;
    title: string;
    desc: string;
    backHome: string;
    contactWhatsapp: string;
  };
}

export const LOCALE_MAP: Record<LangCode, LocaleDictionary> = {
  es: es as unknown as LocaleDictionary,
  'pt-br': ptBr as unknown as LocaleDictionary,
  en: en as unknown as LocaleDictionary,
  de: de as unknown as LocaleDictionary,
  ru: ru as unknown as LocaleDictionary,
  uk: uk as unknown as LocaleDictionary,
  fr: fr as unknown as LocaleDictionary,
  it: it as unknown as LocaleDictionary,
  'zh-tw': zhTw as unknown as LocaleDictionary,
  ko: ko as unknown as LocaleDictionary,
  ja: ja as unknown as LocaleDictionary,
};

const LANG_STORAGE_KEY = 'avenida_py_preferred_lang';

export function isValidLang(value: string | undefined): value is LangCode {
  return Boolean(value && LANGUAGES.some((item) => item.code === value));
}

export function getSavedLang(): LangCode | null {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return isValidLang(saved || undefined) ? (saved as LangCode) : null;
  } catch {
    return null;
  }
}

export function saveLang(lang: LangCode): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // ignore storage errors
  }
}

export function detectBrowserLang(): LangCode {
  const saved = getSavedLang();
  if (saved) return saved;

  if (typeof navigator === 'undefined') return DEFAULT_LANG;

  const candidates = [...(navigator.languages || []), navigator.language].filter(Boolean);
  for (const raw of candidates) {
    const lower = raw.toLowerCase();
    if (lower.startsWith('pt')) return 'pt-br';
    if (lower.startsWith('es')) return 'es';
    if (lower.startsWith('en')) return 'en';
    if (lower.startsWith('de')) return 'de';
    if (lower.startsWith('ru')) return 'ru';
    if (lower.startsWith('uk')) return 'uk';
    if (lower.startsWith('fr')) return 'fr';
    if (lower.startsWith('it')) return 'it';
    if (lower.startsWith('zh')) return 'zh-tw';
    if (lower.startsWith('ko')) return 'ko';
    if (lower.startsWith('ja')) return 'ja';
  }
  return DEFAULT_LANG;
}

export function formatTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');
}

export interface I18nContextValue {
  lang: LangCode;
  t: LocaleDictionary;
}

export const I18nContext = createContext<I18nContextValue>({
  lang: DEFAULT_LANG,
  t: LOCALE_MAP[DEFAULT_LANG],
});

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
