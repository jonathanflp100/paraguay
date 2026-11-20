import { useEffect, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { initAnalytics } from '../lib/analytics';
import { I18nContext, LOCALE_MAP, isValidLang, loadLocale, saveLang } from '../lib/i18n';
import type { LocaleDictionary } from '../lib/i18n';
import { DEFAULT_LANG } from '../config';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { NotFoundPage } from '../pages/NotFoundPage';

export function PublicLayout() {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const valid = isValidLang(lang);
  const resolvedLang = valid ? lang : DEFAULT_LANG;
  const [dictionary, setDictionary] = useState<LocaleDictionary | undefined>(
    () => LOCALE_MAP[resolvedLang]
  );
  const [loadedLang, setLoadedLang] = useState(resolvedLang);

  useEffect(() => {
    let active = true;
    loadLocale(resolvedLang)
      .then((dict) => {
        if (!active) return;
        setDictionary(dict);
        setLoadedLang(resolvedLang);
      })
      .catch(() => {
        if (!active) return;
        setDictionary(LOCALE_MAP.es);
        setLoadedLang(resolvedLang);
      });
    return () => {
      active = false;
    };
  }, [resolvedLang]);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (valid) {
      saveLang(lang);
    }
  }, [lang, valid]);

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const timer = window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  if (!valid) {
    return (
      <I18nContext.Provider value={{ lang: DEFAULT_LANG, t: LOCALE_MAP[DEFAULT_LANG]! }}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <NotFoundPage />
          </main>
          <Footer />
          <FloatingWhatsApp />
        </div>
      </I18nContext.Provider>
    );
  }

  if (!dictionary || loadedLang !== resolvedLang) {
    return <div className="min-h-screen bg-[#F8F9FB]" />;
  }

  return (
    <I18nContext.Provider value={{ lang: resolvedLang, t: dictionary }}>
      <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </I18nContext.Provider>
  );
}
