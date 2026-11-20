import { MessageCircle } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { triggerWhatsAppLink } from '../lib/whatsapp';

export function FloatingWhatsApp() {
  const { lang, t } = useI18n();

  const handleClick = () => {
    triggerWhatsAppLink({
      message: t.whatsapp.defaultMessage,
      service: 'floating_button',
      lang,
      source: 'floating_button',
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t.whatsapp.floatingLabel}
      className="whatsapp-pulse fixed bottom-5 right-5 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#16A34A] text-white shadow-lg hover:bg-[#15803D] transition-transform duration-200 hover:scale-105 cursor-pointer"
    >
      <MessageCircle className="w-7 h-7" aria-hidden="true" />
    </button>
  );
}
