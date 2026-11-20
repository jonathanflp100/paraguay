import { SITE_CONFIG } from '../config';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let initialized = false;

export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const { ga4Id, metaPixelId } = SITE_CONFIG.analytics;

  if (ga4Id) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', ga4Id);
  }

  if (metaPixelId) {
    const fbqFn = function (...args: unknown[]) {
      const fn = fbqFn as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[][] };
      if (fn.callMethod) {
        fn.callMethod(...args);
      } else {
        fn.queue.push(args);
      }
    } as unknown as ((...args: unknown[]) => void) & {
      queue: unknown[][];
      loaded: boolean;
      version: string;
    };
    fbqFn.queue = [];
    fbqFn.loaded = true;
    fbqFn.version = '2.0';
    window.fbq = fbqFn;
    window._fbq = fbqFn;

    const pixelScript = document.createElement('script');
    pixelScript.async = true;
    pixelScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(pixelScript);

    window.fbq('init', metaPixelId);
    window.fbq('track', 'PageView');
  }
}

export function trackWhatsAppClick(params: {
  service: string;
  lang: string;
  source?: string;
}): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'engagement',
      service: params.service,
      language: params.lang,
      source: params.source || 'site',
    });
  }

  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', 'whatsapp_click', {
      service: params.service,
      language: params.lang,
      source: params.source || 'site',
    });
  }
}
