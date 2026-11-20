import { SITE_CONFIG } from '../config';
import { trackWhatsAppClick } from './analytics';
import type { LangCode } from '../types';

export function buildWhatsAppUrl(message: string, phoneDigits?: string): string {
  const digits = (phoneDigits || SITE_CONFIG.whatsappDigits).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function triggerWhatsAppLink(params: {
  message: string;
  service: string;
  lang: LangCode;
  source?: string;
  phoneDigits?: string;
}): string {
  trackWhatsAppClick({
    service: params.service,
    lang: params.lang,
    source: params.source,
  });

  const url = buildWhatsAppUrl(params.message, params.phoneDigits);

  // Trigger navigation safely via an anchor element without calling window.open
  if (typeof document !== 'undefined') {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return url;
}
