export type LangCode =
  | 'es'
  | 'pt-br'
  | 'en'
  | 'de'
  | 'ru'
  | 'uk'
  | 'fr'
  | 'it'
  | 'zh-tw'
  | 'ko'
  | 'ja';

export type ServiceSlug =
  | 'residencia-temporaria'
  | 'residencia-permanente'
  | 'cedula-identidade'
  | 'ruc'
  | 'abertura-empresa'
  | 'carteira-motorista'
  | 'traducao-apostilamento'
  | 'conta-bancaria';

export type LeadStatus = 'novo' | 'em_contato' | 'cliente' | 'perdido';

export interface LeadRecord {
  id: string;
  nome: string | null;
  pais: string;
  objetivo: string;
  ja_no_paraguai: boolean;
  servico: string;
  idioma: string;
  origem: string;
  status: LeadStatus;
  telefone?: string | null;
  criado_em: string;
}

export interface ProcessRecord {
  id: string;
  codigo: string;
  nome_cliente: string;
  servico: string;
  etapa: number; // 1 to 6
  observacao_publica: string | null;
  atualizado_em: string;
  criado_em?: string;
}

export interface PublicProcessResult {
  codigo: string;
  servico: string;
  etapa: number;
  observacao: string | null;
  atualizado_em: string;
}

export interface BlogPost {
  slug: string;
  lang: LangCode;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  imageKey: 'skyline' | 'documents' | 'family' | 'corporate' | 'office';
  content: string;
}
