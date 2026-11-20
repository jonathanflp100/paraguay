import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { LANGUAGES, SERVICE_SLUGS, SITE_CONFIG } from '../config';
import { useI18n } from '../lib/i18n';
import { triggerWhatsAppLink } from '../lib/whatsapp';

export function Footer() {
  const { lang, t } = useI18n();
  const year = new Date().getFullYear();

  const handleWhatsApp = () => {
    triggerWhatsAppLink({
      message: t.whatsapp.defaultMessage,
      service: 'footer_contact',
      lang,
      source: 'footer',
    });
  };

  return (
    <footer className="bg-[#061224] text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & WhatsApp-only note */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              to={`/${lang}`}
              className="inline-flex items-center gap-2.5 text-white font-extrabold text-lg tracking-tight"
            >
              <span
                aria-hidden="true"
                className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#B8333A] via-[#C9A24B] to-white"
              />
              <span>{SITE_CONFIG.companyName}</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-300/90 max-w-sm">
              {t.footer.description}
            </p>
            <div className="flex items-start gap-2.5 pt-2 text-xs leading-relaxed text-slate-300/80">
              <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{t.footer.whatsappOnlyNote}</span>
            </div>
          </div>

          {/* Services links */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white mb-4">{t.footer.servicesHeading}</h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    to={`/${lang}/servicos/${slug}`}
                    className="text-slate-300/85 hover:text-[#C9A24B] transition-colors"
                  >
                    {t.services[slug].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">{t.footer.linksHeading}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to={`/${lang}`} className="text-slate-300/85 hover:text-[#C9A24B] transition-colors">
                  {t.footer.homeLink}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${lang}#acompanhar`}
                  className="text-slate-300/85 hover:text-[#C9A24B] transition-colors"
                >
                  {t.footer.trackLink}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${lang}/blog`}
                  className="text-slate-300/85 hover:text-[#C9A24B] transition-colors"
                >
                  {t.footer.blogLink}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${lang}/privacidade`}
                  className="text-slate-300/85 hover:text-[#C9A24B] transition-colors"
                >
                  {t.footer.privacyLink}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="lg:col-span-3 space-y-3.5 text-sm">
            <h3 className="text-sm font-semibold text-white mb-4">{t.footer.contactHeading}</h3>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex items-center gap-2.5 text-slate-200 hover:text-[#C9A24B] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
              <span>{SITE_CONFIG.whatsappNumber}</span>
            </button>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-2.5 text-slate-300/90 hover:text-[#C9A24B] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
              <span>{SITE_CONFIG.email}</span>
            </a>
            <div className="flex items-start gap-2.5 text-slate-300/80">
              <MapPin className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{SITE_CONFIG.address}</span>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Facebook
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={SITE_CONFIG.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Language links strip for SEO & accessibility */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
          {LANGUAGES.map((item) => (
            <Link
              key={item.code}
              to={`/${item.code}`}
              className={`hover:text-white transition-colors ${
                item.code === lang ? 'text-[#C9A24B] font-semibold' : ''
              }`}
            >
              {item.flag} {item.label}
            </Link>
          ))}
        </div>

        {/* Bottom legal line */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © {year} {SITE_CONFIG.companyName}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>{t.footer.privacyNotice}</span>
            <Link to="/admin" className="text-slate-500 hover:text-slate-300 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
