import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Share, X } from 'lucide-react';

// Evento do Chrome/Android que permite mostrar o botão "Instalar"
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'admin_pwa_banner_dismissed';

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(ua) || iPadOS;
}

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Transforma o /admin em app instalável (PWA):
 * manifest próprio, ícones, service worker e banner de instalação.
 * O site público não é afetado: o manifest só existe nas telas do admin.
 */
export function AdminPwa() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [hidden, setHidden] = useState(() => isStandalone() || wasDismissed());

  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(() => {
        // sem service worker o painel continua funcionando normalmente
      });
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setHidden(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    if (isIos() && !isStandalone()) setShowIosHint(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore
    }
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setHidden(true);
    setInstallEvent(null);
  };

  const showBanner = !hidden && (installEvent || showIosHint);

  return (
    <>
      <Helmet>
        <link rel="manifest" href="/admin.webmanifest" />
        <meta name="theme-color" content="#0B1F3A" />
        <link rel="apple-touch-icon" href="/icons/admin-apple-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Admin PY" />
      </Helmet>

      {showBanner && (
        <div
          className="fixed inset-x-3 z-50 rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 flex items-start gap-3"
          style={{ bottom: 'calc(12px + env(safe-area-inset-bottom))' }}
          role="dialog"
          aria-label="Instalar o painel no celular"
        >
          <img src="/icons/admin-192.png" alt="" className="w-11 h-11 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0 text-[#0B1F3A]">
            <p className="text-sm font-bold">Instale o painel no celular</p>
            {installEvent ? (
              <p className="text-xs text-slate-600 mt-0.5">
                Abra os leads e processos direto da tela inicial, como um app.
              </p>
            ) : (
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                No Safari, toque em{' '}
                <Share className="inline w-3.5 h-3.5 -mt-0.5" aria-label="Compartilhar" /> e depois
                em <strong>"Adicionar à Tela de Início"</strong>.
              </p>
            )}
            {installEvent && (
              <button
                type="button"
                onClick={install}
                className="mt-2.5 inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#0B1F3A] text-white text-xs font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Instalar app
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
