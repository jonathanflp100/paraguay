import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { detectBrowserLang } from './lib/i18n';
import { PublicLayout } from './components/PublicLayout';
import { HomePage } from './pages/HomePage';
import { ServicePage } from './pages/ServicePage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TrackRedirectPage } from './pages/TrackRedirectPage';
import { NotFoundPage } from './pages/NotFoundPage';
// Admin carregado sob demanda: visitantes não baixam o código do painel
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));

function RootLangRedirect() {
  const targetLang = detectBrowserLang();
  return <Navigate to={`/${targetLang}`} replace />;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLangRedirect />} />
          <Route path="/acompanhar" element={<TrackRedirectPage />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="min-h-screen" />}>
                <AdminPage />
              </Suspense>
            }
          />

          <Route path="/:lang" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="acompanhar" element={<TrackRedirectPage />} />
            <Route path="servicos/:slug" element={<ServicePage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
            <Route path="privacidade" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="*" element={<RootLangRedirect />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
