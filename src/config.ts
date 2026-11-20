import type { LangCode, ServiceSlug } from './types';

export interface LanguageOption {
  code: LangCode;
  hreflang: string;
  label: string;
  shortLabel: string;
  flag: string;
  ogLocale: string;
}

export const SITE_CONFIG = {
  // Altere para o nome real da sua empresa
  companyName: 'Avenida Paraguai',
  whatsappNumber: '+595 993 016769',
  whatsappDigits: '595993016769',
  email: 'contato@avenidaparaguai.com',
  address: 'Av. Santa Teresa 2106, Paseo La Galería, Torre 2 — Asunción, Paraguay',
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined) || '',
  social: {
    instagram: 'https://instagram.com/avenidaparaguai',
    facebook: 'https://facebook.com/avenidaparaguai',
    linkedin: 'https://linkedin.com/company/avenidaparaguai',
    youtube: 'https://youtube.com/@avenidaparaguai',
  },
  analytics: {
    // Preencha com os IDs reais quando publicar (ex: 'G-XXXXXXXXXX' e '123456789012345')
    ga4Id: '',
    metaPixelId: '',
  },
  images: {
    skyline: '/src/assets/images/hero_asuncion_skyline_1795208654909.webp',
    office: '/src/assets/images/about_advisory_office_1795208654291.webp',
    documents: '/src/assets/images/documents_passport_desk_1795208653941.webp',
    family: '/src/assets/images/family_asuncion_lifestyle_1795208655064.webp',
    corporate: '/src/assets/images/business_asuncion_corporate_1795208654056.webp',
  },
} as const;

export const DEFAULT_LANG: LangCode = 'es';

export const LANGUAGES: LanguageOption[] = [
  { code: 'es', hreflang: 'es', label: 'Español', shortLabel: 'ES', flag: '🇵🇾', ogLocale: 'es_PY' },
  { code: 'pt-br', hreflang: 'pt-BR', label: 'Português (BR)', shortLabel: 'PT', flag: '🇧🇷', ogLocale: 'pt_BR' },
  { code: 'en', hreflang: 'en', label: 'English', shortLabel: 'EN', flag: '🇺🇸', ogLocale: 'en_US' },
  { code: 'de', hreflang: 'de', label: 'Deutsch', shortLabel: 'DE', flag: '🇩🇪', ogLocale: 'de_DE' },
  { code: 'ru', hreflang: 'ru', label: 'Русский', shortLabel: 'RU', flag: '🇷🇺', ogLocale: 'ru_RU' },
  { code: 'uk', hreflang: 'uk', label: 'Українська', shortLabel: 'UK', flag: '🇺🇦', ogLocale: 'uk_UA' },
  { code: 'fr', hreflang: 'fr', label: 'Français', shortLabel: 'FR', flag: '🇫🇷', ogLocale: 'fr_FR' },
  { code: 'it', hreflang: 'it', label: 'Italiano', shortLabel: 'IT', flag: '🇮🇹', ogLocale: 'it_IT' },
  { code: 'zh-tw', hreflang: 'zh-TW', label: '繁體中文', shortLabel: '繁中', flag: '🇹🇼', ogLocale: 'zh_TW' },
  { code: 'ko', hreflang: 'ko', label: '한국어', shortLabel: 'KO', flag: '🇰🇷', ogLocale: 'ko_KR' },
  { code: 'ja', hreflang: 'ja', label: '日本語', shortLabel: 'JA', flag: '🇯🇵', ogLocale: 'ja_JP' },
];

export const SERVICE_SLUGS: ServiceSlug[] = [
  'residencia-temporaria',
  'residencia-permanente',
  'cedula-identidade',
  'ruc',
  'abertura-empresa',
  'carteira-motorista',
  'traducao-apostilamento',
  'conta-bancaria',
];

export const SERVICE_IMAGE_MAP: Record<ServiceSlug, keyof typeof SITE_CONFIG.images> = {
  'residencia-temporaria': 'documents',
  'residencia-permanente': 'family',
  'cedula-identidade': 'documents',
  ruc: 'corporate',
  'abertura-empresa': 'corporate',
  'carteira-motorista': 'skyline',
  'traducao-apostilamento': 'office',
  'conta-bancaria': 'corporate',
};

export function getSiteBaseUrl(): string {
  if (SITE_CONFIG.siteUrl) {
    return SITE_CONFIG.siteUrl.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}
