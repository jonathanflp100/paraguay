# Site Institucional — Assessoria de Documentação no Paraguai

Site multilíngue (11 idiomas) de alta conversão para assessoria de documentação no Paraguai, com foco em contato via WhatsApp, captação de leads pelo Verificador Rápido, acompanhamento público de processos por código (`PY-XXXXXX`), blog em Markdown e painel administrativo em `/admin`.

> **Importante:** Este site funciona como vitrine informativa e acompanhamento de status. **Nenhum documento pessoal é enviado ou armazenado pelo site** — todo envio documental ocorre exclusivamente pelo WhatsApp oficial.

---

## Stack utilizada

- **React 19 + Vite + TypeScript + Tailwind CSS v4**
- **React Router** (rotas por idioma: `/es`, `/pt-br`, `/en`, `/de`, `/ru`, `/uk`, `/fr`, `/it`, `/zh-tw`, `/ko`, `/ja`, além de `/acompanhar` e `/admin`)
- **Supabase (`@supabase/supabase-js`)** para tabela `leads`, tabela `processos`, RPC segura `consultar_processo(p_codigo)` e autenticação do `/admin`
- **react-helmet-async** para SEO completo (título, meta description, Open Graph, canonical, `hreflang` nos 11 idiomas e JSON-LD)
- **i18n** em `/src/locales/*.json` (sem textos fixos no código)
- **Blog em Markdown** em `/src/content/blog/[lang]/*.md`

---

## 1. Personalizar dados da empresa

Edite `/src/config.ts` para ajustar em um único lugar:

- `companyName`: nome da sua empresa
- `whatsappNumber` e `whatsappDigits`: número do WhatsApp (padrão `+595 993 016769`)
- `email`, `address` e links de `social`
- `analytics.ga4Id` (Google Analytics 4) e `analytics.metaPixelId` (Meta Pixel)

Para trocar os depoimentos de exemplo (`[PLACEHOLDER]`), edite a chave `"testimonials"` nos arquivos `/src/locales/*.json`.

---

## 2. Configurar o Supabase

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Abra **SQL Editor** no painel do Supabase e execute todo o conteúdo do arquivo `supabase/schema.sql`.
   - Ele cria as tabelas `leads` e `processos`, configura **Row Level Security (RLS)** e cria a função RPC `consultar_processo(p_codigo)`.
3. Em **Authentication → Users**, clique em **Add user** e crie o e-mail e senha do administrador (o painel `/admin` não possui tela pública de cadastro).
4. Em **Project Settings → API**, copie o **Project URL** e a chave **anon public**.

---

## 3. Configurar o arquivo `.env` e rodar localmente

Copie o `.env.example` para `.env`:

```bash
cp .env.example .env
```

Preencha suas variáveis:

```env
VITE_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
VITE_SUPABASE_ANON_KEY="SUA-CHAVE-ANON-PUBLICA"
VITE_SITE_URL="https://seusite.com"
```

Instale as dependências e rode o servidor local:

```bash
npm install
npm run dev
```

Para gerar o build de produção:

```bash
npm run build
```

---

## 4. Deploy na Vercel

1. Suba o repositório para o GitHub, GitLab ou Bitbucket.
2. Acesse [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` (URL final do seu domínio, ex.: `https://suaempresa.com`)
4. Clique em **Deploy**. O arquivo `vercel.json` já está configurado com rewrites para todas as rotas SPA (`/es`, `/pt-br/servicos/...`, `/acompanhar`, `/admin`).
