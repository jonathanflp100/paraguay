import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, MessageCircle, X } from 'lucide-react';
import { LANGUAGES, SITE_CONFIG } from '../config';
import { saveLang, useI18n } from '../lib/i18n';
import { triggerWhatsAppLink } from '../lib/whatsapp';
import type { LangCode } from '../types';

export function Header() {
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentLangObj = LANGUAGES.find((item) => item.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setLangMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const switchLanguage = (nextLang: LangCode) => {
    saveLang(nextLang);
    setLangMenuOpen(false);
    setMobileMenuOpen(false);

    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0 && LANGUAGES.some((l) => l.code === pathSegments[0])) {
      pathSegments[0] = nextLang;
      navigate(`/${pathSegments.join('/')}${location.hash}`);
    } else {
      navigate(`/${nextLang}`);
    }
  };

  const handleSectionLink = (sectionId: string) => {
    setMobileMenuOpen(false);
    const homePath = `/${lang}`;
    if (location.pathname === homePath || location.pathname === `${homePath}/`) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(`${homePath}#${sectionId}`);
  };

  const handleHeaderWhatsApp = () => {
    setMobileMenuOpen(false);
    triggerWhatsAppLink({
      message: t.whatsapp.defaultMessage,
      service: 'header_cta',
      lang,
      source: 'header',
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single-line brand wordmark */}
        <Link
          to={`/${lang}`}
          className="flex items-center gap-2.5 text-[#0B1F3A] font-extrabold text-lg tracking-tight whitespace-nowrap shrink-0"
        >
          <span
            aria-hidden="true"
            className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#B8333A] via-[#C9A24B] to-[#0B1F3A]"
          />
          <span>{SITE_CONFIG.companyName}</span>
        </Link>

        {/* Zone 2: Clean single-line text links */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => handleSectionLink('servicos')}
            className="hover:text-[#0B1F3A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.nav.services}
          </button>
          <button
            type="button"
            onClick={() => handleSectionLink('pacotes')}
            className="hover:text-[#0B1F3A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.nav.packages}
          </button>
          <button
            type="button"
            onClick={() => handleSectionLink('acompanhar')}
            className="hover:text-[#0B1F3A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.nav.track}
          </button>
          <Link
            to={`/${lang}/blog`}
            className="hover:text-[#0B1F3A] transition-colors whitespace-nowrap shrink-0"
          >
            {t.nav.blog}
          </Link>
          <button
            type="button"
            onClick={() => handleSectionLink('sobre')}
            className="hover:text-[#0B1F3A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.nav.about}
          </button>
        </nav>

        {/* Zone 3: Language selector + Primary CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              aria-expanded={langMenuOpen}
              aria-haspopup="listbox"
              aria-label={t.nav.languageLabel}
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-[#0B1F3A] hover:border-[#C9A24B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span aria-hidden="true" className="text-base leading-none">
                {currentLangObj.flag}
              </span>
              <span>{currentLangObj.shortLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                  langMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {langMenuOpen && (
              <div
                role="listbox"
                aria-label={t.nav.languageLabel}
                className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-50 max-h-80 overflow-y-auto"
              >
                {LANGUAGES.map((item) => {
                  const active = item.code === lang;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => switchLanguage(item.code)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#F7F1E1] text-[#0B1F3A] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span aria-hidden="true">{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      {active && <span className="text-[#C9A24B] text-xs font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleHeaderWhatsApp}
            className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#132D52] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
            <span>{t.nav.ctaWhatsapp}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={t.nav.menuLabel}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-[#0B1F3A] hover:bg-slate-50 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-sm">
          <button
            type="button"
            onClick={() => handleSectionLink('servicos')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0B1F3A] hover:bg-slate-50"
          >
            {t.nav.services}
          </button>
          <button
            type="button"
            onClick={() => handleSectionLink('pacotes')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0B1F3A] hover:bg-slate-50"
          >
            {t.nav.packages}
          </button>
          <button
            type="button"
            onClick={() => handleSectionLink('acompanhar')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0B1F3A] hover:bg-slate-50"
          >
            {t.nav.track}
          </button>
          <Link
            to={`/${lang}/blog`}
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0B1F3A] hover:bg-slate-50"
          >
            {t.nav.blog}
          </Link>
          <button
            type="button"
            onClick={() => handleSectionLink('sobre')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0B1F3A] hover:bg-slate-50"
          >
            {t.nav.about}
          </button>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleHeaderWhatsApp}
              className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#132D52]"
            >
              <MessageCircle className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
              <span>{t.nav.ctaWhatsapp}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
