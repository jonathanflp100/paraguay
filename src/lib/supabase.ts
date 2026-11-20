import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { LeadRecord, LeadStatus, ProcessRecord, PublicProcessResult } from '../types';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('SEU-PROJETO') &&
    !supabaseAnonKey.includes('SUA-CHAVE')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface CreateLeadPayload {
  nome: string | null;
  pais: string;
  objetivo: string;
  ja_no_paraguai: boolean;
  servico: string;
  idioma: string;
  origem: string;
}

// Local preview store used ONLY when Supabase env vars are not yet configured
const LOCAL_LEADS_KEY = 'avenida_py_demo_leads';
const LOCAL_PROCESSES_KEY = 'avenida_py_demo_processes';

const DEFAULT_DEMO_PROCESSES: ProcessRecord[] = [
  {
    id: 'demo-proc-1',
    codigo: 'PY-7K3M9Q',
    nome_cliente: 'Cliente Exemplo',
    servico: 'Residência Permanente + Cédula',
    etapa: 4,
    observacao_publica:
      'Protocolo validado em Assunção. Acompanhe os próximos avanços por aqui ou fale com seu assessor no WhatsApp.',
    atualizado_em: new Date().toISOString(),
  },
];

export function getLocalDemoProcesses(): ProcessRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_PROCESSES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PROCESSES_KEY, JSON.stringify(DEFAULT_DEMO_PROCESSES));
      return DEFAULT_DEMO_PROCESSES;
    }
    return JSON.parse(raw) as ProcessRecord[];
  } catch {
    return DEFAULT_DEMO_PROCESSES;
  }
}

export function saveLocalDemoProcesses(items: ProcessRecord[]): void {
  try {
    localStorage.setItem(LOCAL_PROCESSES_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

export function getLocalDemoLeads(): LeadRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_LEADS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeadRecord[];
  } catch {
    return [];
  }
}

export function saveLocalDemoLeads(items: LeadRecord[]): void {
  try {
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

export async function saveLead(payload: CreateLeadPayload): Promise<{ ok: boolean }> {
  if (!supabase) {
    const existing = getLocalDemoLeads();
    const record: LeadRecord = {
      id: `local-${Date.now()}`,
      ...payload,
      status: 'novo',
      criado_em: new Date().toISOString(),
    };
    saveLocalDemoLeads([record, ...existing]);
    return { ok: true };
  }

  try {
    const { error } = await supabase.from('leads').insert([
      {
        nome: payload.nome,
        pais: payload.pais,
        objetivo: payload.objetivo,
        ja_no_paraguai: payload.ja_no_paraguai,
        servico: payload.servico,
        idioma: payload.idioma,
        origem: payload.origem,
      },
    ]);
    if (error) {
      return { ok: false };
    }
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function consultarProcesso(
  rawCode: string
): Promise<{ data: PublicProcessResult | null; error?: string }> {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) {
    return { data: null };
  }

  if (!supabase) {
    const list = getLocalDemoProcesses();
    const found = list.find((p) => p.codigo.toUpperCase() === normalized);
    if (!found) return { data: null };
    return {
      data: {
        codigo: found.codigo,
        servico: found.servico,
        etapa: found.etapa,
        observacao: found.observacao_publica,
        atualizado_em: found.atualizado_em,
      },
    };
  }

  try {
    const { data, error } = await supabase.rpc('consultar_processo', {
      p_codigo: normalized,
    });
    if (error) {
      return { data: null, error: error.message };
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) {
      return { data: null };
    }
    return {
      data: {
        codigo: row.codigo,
        servico: row.servico,
        etapa: Number(row.etapa) || 1,
        observacao: row.observacao ?? row.observacao_publica ?? null,
        atualizado_em: row.atualizado_em,
      },
    };
  } catch {
    return { data: null, error: 'network_error' };
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  if (!supabase) {
    const leads = getLocalDemoLeads().map((item) =>
      item.id === id ? { ...item, status } : item
    );
    saveLocalDemoLeads(leads);
    return true;
  }
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  return !error;
}
