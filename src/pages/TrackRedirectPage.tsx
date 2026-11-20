import { Navigate, useParams } from 'react-router-dom';
import { detectBrowserLang, isValidLang } from '../lib/i18n';

export function TrackRedirectPage() {
  const { lang } = useParams<{ lang?: string }>();
  const targetLang = isValidLang(lang) ? lang : detectBrowserLang();
  return <Navigate to={`/${targetLang}#acompanhar`} replace />;
}
