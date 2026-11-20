import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Check,
  Copy,
  Edit3,
  FileCheck2,
  Lock,
  LogOut,
  MessageCircle,
  Plus,
  RefreshCw,
  Users,
  X,
} from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { buildClientTrackingMessage, generateProcessCode } from '../lib/codes';
import {
  getLocalDemoLeads,
  getLocalDemoProcesses,
  isSupabaseConfigured,
  saveLocalDemoProcesses,
  supabase,
  updateLeadStatus,
} from '../lib/supabase';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { AdminPwa } from '../components/AdminPwa';
import type { LeadRecord, LeadStatus, ProcessRecord } from '../types';

const STAGE_LABELS: Record<number, string> = {
  1: '1. Documentos recebidos',
  2: '2. Em análise',
  3: '3. Protocolado',
  4: '4. Em andamento',
  5: '5. Pronto para retirada',
  6: '6. Concluído',
};

const SERVICE_OPTIONS = [
  'Residência temporária',
  'Residência permanente',
  'Cédula de identidade',
  'RUC',
  'Abertura de empresa',
  'Carteira de motorista',
  'Tradução e apostilamento',
  'Apoio para abrir conta bancária',
  'Pacote Essencial (Residência)',
  'Pacote Completo (Residência + Cédula + RUC)',
  'Pacote Empresário (Completo + Abertura de empresa)',
];

const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: 'Novo',
  em_contato: 'Em contato',
  cliente: 'Cliente',
  perdido: 'Perdido',
};

export function AdminPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Tabs & data
  const [activeTab, setActiveTab] = useState<'leads' | 'processos'>('leads');
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<'todos' | LeadStatus>('todos');
  const [processes, setProcesses] = useState<ProcessRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Process modal form
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formCode, setFormCode] = useState('');
  const [formClientName, setFormClientName] = useState('');
  const [formService, setFormService] = useState(SERVICE_OPTIONS[0]);
  const [formStage, setFormStage] = useState(1);
  const [formNote, setFormNote] = useState('');
  const [savingProcess, setSavingProcess] = useState(false);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    if (!supabase) {
      setLeads(getLocalDemoLeads());
      setProcesses(getLocalDemoProcesses());
      setDataLoading(false);
      return;
    }

    const [leadsRes, procsRes] = await Promise.all([
      supabase.from('leads').select('*').order('criado_em', { ascending: false }),
      supabase.from('processos').select('*').order('atualizado_em', { ascending: false }),
    ]);

    if (!leadsRes.error && leadsRes.data) {
      setLeads(leadsRes.data as LeadRecord[]);
    }
    if (!procsRes.error && procsRes.data) {
      setProcesses(procsRes.data as ProcessRecord[]);
    }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setAuthenticated(true);
        setUserEmail(data.session.user.email || null);
      }
      setAuthLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session?.user));
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authenticated || demoMode) {
      loadData();
    }
  }, [authenticated, demoMode, loadData]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!supabase) {
      setLoginError(
        'Supabase não configurado no .env. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ou use o modo demonstração abaixo.'
      );
      return;
    }

    setLoginSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoginSubmitting(false);

    if (error) {
      setLoginError('E-mail ou senha inválidos. Verifique suas credenciais no Supabase Auth.');
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthenticated(false);
    setDemoMode(false);
    setUserEmail(null);
  };

  const handleLeadStatusChange = async (leadId: string, nextStatus: LeadStatus) => {
    const ok = await updateLeadStatus(leadId, nextStatus);
    if (ok) {
      setLeads((prev) =>
        prev.map((item) => (item.id === leadId ? { ...item, status: nextStatus } : item))
      );
      setFeedback('Status do lead atualizado.');
      window.setTimeout(() => setFeedback(null), 2500);
    }
  };

  const openNewProcessModal = () => {
    setEditingId(null);
    setFormCode(generateProcessCode());
    setFormClientName('');
    setFormService(SERVICE_OPTIONS[0]);
    setFormStage(1);
    setFormNote('');
    setEditorOpen(true);
  };

  const openEditProcessModal = (proc: ProcessRecord) => {
    setEditingId(proc.id);
    setFormCode(proc.codigo);
    setFormClientName(proc.nome_cliente);
    setFormService(proc.servico);
    setFormStage(proc.etapa);
    setFormNote(proc.observacao_publica || '');
    setEditorOpen(true);
  };

  const handleSaveProcess = async (e: FormEvent) => {
    e.preventDefault();
    if (!formClientName.trim() || !formService.trim()) return;

    setSavingProcess(true);

    if (!supabase) {
      const now = new Date().toISOString();
      const existing = getLocalDemoProcesses();
      let updated: ProcessRecord[];
      if (editingId) {
        updated = existing.map((p) =>
          p.id === editingId
            ? {
                ...p,
                nome_cliente: formClientName.trim(),
                servico: formService.trim(),
                etapa: formStage,
                observacao_publica: formNote.trim() || null,
                atualizado_em: now,
              }
            : p
        );
      } else {
        const created: ProcessRecord = {
          id: `local-proc-${Date.now()}`,
          codigo: formCode,
          nome_cliente: formClientName.trim(),
          servico: formService.trim(),
          etapa: formStage,
          observacao_publica: formNote.trim() || null,
          atualizado_em: now,
          criado_em: now,
        };
        updated = [created, ...existing];
      }
      saveLocalDemoProcesses(updated);
      setProcesses(updated);
      setSavingProcess(false);
      setEditorOpen(false);
      setFeedback(editingId ? 'Processo atualizado.' : `Processo criado com o código ${formCode}.`);
      window.setTimeout(() => setFeedback(null), 4000);
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('processos')
        .update({
          nome_cliente: formClientName.trim(),
          servico: formService.trim(),
          etapa: formStage,
          observacao_publica: formNote.trim() || null,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (!error) {
        await loadData();
        setEditorOpen(false);
        setFeedback('Processo atualizado com sucesso.');
      }
    } else {
      const { error } = await supabase.from('processos').insert([
        {
          codigo: formCode,
          nome_cliente: formClientName.trim(),
          servico: formService.trim(),
          etapa: formStage,
          observacao_publica: formNote.trim() || null,
        },
      ]);

      if (!error) {
        await loadData();
        setEditorOpen(false);
        setFeedback(`Processo criado com o código ${formCode}.`);
      }
    }

    setSavingProcess(false);
    window.setTimeout(() => setFeedback(null), 4000);
  };

  const handleCopyClientMessage = async (code: string) => {
    const text = buildClientTrackingMessage(code);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 2500);
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const filteredLeads =
    statusFilter === 'todos' ? leads : leads.filter((item) => item.status === statusFilter);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center text-sm text-slate-500">
        Carregando painel...
      </div>
    );
  }

  // LOGIN VIEW (sem tela de cadastro)
  if (!authenticated && !demoMode) {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex flex-col items-center justify-center px-4 py-12">
        <Helmet>
          <html lang="pt-BR" />
          <title>Painel Administrativo — {SITE_CONFIG.companyName}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <AdminPwa />

        <div className="w-full max-w-md rounded-2xl bg-white p-7 sm:p-9 shadow-xl">
          <div className="flex items-center gap-2.5 text-[#0B1F3A] font-extrabold text-lg mb-6">
            <span className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#B8333A] via-[#C9A24B] to-[#0B1F3A]" />
            <span>{SITE_CONFIG.companyName}</span>
          </div>

          <h1 className="text-2xl font-bold text-[#0B1F3A]">Acesso Administrativo</h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Entre com o e-mail e senha cadastrados no Supabase Auth.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                E-mail
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@empresa.com"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="admin-pass" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Senha
              </label>
              <input
                id="admin-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
              />
            </div>

            {loginError && (
              <p className="text-xs font-medium text-[#B8333A] bg-[#B8333A]/10 rounded-lg p-3">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#132D52] disabled:opacity-60 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
              <span>{loginSubmitting ? 'Entrando...' : 'Entrar'}</span>
            </button>
          </form>

          {!isSupabaseConfigured && (
            <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Variáveis <code className="font-mono text-[#0B1F3A]">VITE_SUPABASE_URL</code> e{' '}
                <code className="font-mono text-[#0B1F3A]">VITE_SUPABASE_ANON_KEY</code> ainda não
                configuradas. Você pode testar o painel localmente enquanto configura o Supabase:
              </p>
              <button
                type="button"
                onClick={() => setDemoMode(true)}
                className="w-full h-10 rounded-xl border border-[#C9A24B] bg-[#F7F1E1] text-[#0B1F3A] text-xs font-bold hover:bg-[#efe4c5] transition-colors cursor-pointer"
              >
                Testar painel em modo demonstração local
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-medium text-slate-500 hover:text-[#0B1F3A]">
              Voltar para o site público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0B1F3A]">
      <Helmet>
        <html lang="pt-BR" />
        <title>Painel Admin — {SITE_CONFIG.companyName}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminPwa />

      {/* Top Bar */}
      <header className="bg-[#0B1F3A] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-extrabold text-base tracking-tight whitespace-nowrap">
              {SITE_CONFIG.companyName}
            </Link>
            <span className="text-xs text-slate-400 hidden sm:inline">Painel Administrativo</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-300 hidden md:inline">
              {demoMode ? 'Modo demonstração local' : userEmail}
            </span>
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {demoMode && (
          <div className="rounded-xl bg-[#F7F1E1] border border-[#C9A24B]/60 px-4 py-3 text-xs text-[#0B1F3A]">
            <strong>Modo demonstração local:</strong> os dados exibidos ficam salvos no navegador.
            Configure <code className="font-mono">VITE_SUPABASE_URL</code> e{' '}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> no <code className="font-mono">.env</code> para usar o Supabase real.
          </div>
        )}

        {feedback && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-800">
            {feedback}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-white text-[#0B1F3A] shadow-sm'
                  : 'text-slate-600 hover:text-[#0B1F3A]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Leads ({leads.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('processos')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'processos'
                  ? 'bg-white text-[#0B1F3A] shadow-sm'
                  : 'text-slate-600 hover:text-[#0B1F3A]'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Processos ({processes.length})</span>
            </button>
          </div>

          {activeTab === 'processos' && (
            <button
              type="button"
              onClick={openNewProcessModal}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#132D52] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C9A24B]" />
              <span>Novo processo</span>
            </button>
          )}
        </div>

        {/* ABA LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {(['todos', 'novo', 'em_contato', 'cliente', 'perdido'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-[#C9A24B]'
                  }`}
                >
                  {status === 'todos' ? 'Todos' : STATUS_LABELS[status]}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
              {filteredLeads.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  Nenhum lead encontrado neste filtro. Leads preenchidos no Verificador Rápido
                  aparecerão aqui automaticamente.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3.5">Nome / País</th>
                        <th className="px-4 py-3.5">Objetivo / Serviço</th>
                        <th className="px-4 py-3.5">No PY?</th>
                        <th className="px-4 py-3.5">Idioma</th>
                        <th className="px-4 py-3.5">Data</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5 text-right">WhatsApp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.map((lead) => {
                        const waMsg = `Olá${lead.nome ? ` ${lead.nome}` : ''}! Recebemos sua consulta pelo site (${lead.servico} — ${lead.pais}) e estamos à disposição para fazer a análise gratuita do seu caso.`;
                        const waUrl = buildWhatsAppUrl(waMsg, lead.telefone || undefined);
                        return (
                          <tr key={lead.id} className="hover:bg-slate-50/70">
                            <td className="px-4 py-3.5">
                              <p className="font-semibold text-[#0B1F3A]">
                                {lead.nome || 'Sem nome'}
                              </p>
                              <p className="text-xs text-slate-500">{lead.pais}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="font-medium text-slate-800">{lead.servico}</p>
                              <p className="text-xs text-slate-500">
                                {lead.objetivo} · {lead.origem}
                              </p>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-700">
                              {lead.ja_no_paraguai ? 'Sim' : 'Não'}
                            </td>
                            <td className="px-4 py-3.5 text-xs font-mono uppercase text-slate-600">
                              {lead.idioma}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-500 tabular-nums whitespace-nowrap">
                              {formatDate(lead.criado_em)}
                            </td>
                            <td className="px-4 py-3.5">
                              <select
                                value={lead.status}
                                onChange={(e) =>
                                  handleLeadStatusChange(lead.id, e.target.value as LeadStatus)
                                }
                                aria-label="Alterar status do lead"
                                className="h-8 px-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                              >
                                <option value="novo">Novo</option>
                                <option value="em_contato">Em contato</option>
                                <option value="cliente">Cliente</option>
                                <option value="perdido">Perdido</option>
                              </select>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16A34A] text-white text-xs font-semibold hover:bg-[#15803D] transition-colors whitespace-nowrap"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Abrir WhatsApp</span>
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA PROCESSOS */}
        {activeTab === 'processos' && (
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
            {processes.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Nenhum processo cadastrado ainda. Clique em <strong>Novo processo</strong> para
                gerar um código de acompanhamento.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <tr>
                      <th className="px-4 py-3.5">Código</th>
                      <th className="px-4 py-3.5">Cliente</th>
                      <th className="px-4 py-3.5">Serviço</th>
                      <th className="px-4 py-3.5">Etapa</th>
                      <th className="px-4 py-3.5">Observação pública</th>
                      <th className="px-4 py-3.5">Atualizado</th>
                      <th className="px-4 py-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {processes.map((proc) => (
                      <tr key={proc.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3.5 font-mono font-bold text-[#0B1F3A] whitespace-nowrap">
                          {proc.codigo}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800">
                          {proc.nome_cliente}
                        </td>
                        <td className="px-4 py-3.5 text-slate-700">{proc.servico}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-[#0B1F3A] whitespace-nowrap tabular-nums">
                          {STAGE_LABELS[proc.etapa] || `Etapa ${proc.etapa}`}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-600 max-w-xs truncate">
                          {proc.observacao_publica || '—'}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500 tabular-nums whitespace-nowrap">
                          {formatDate(proc.atualizado_em)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyClientMessage(proc.codigo)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1F3A] hover:border-[#C9A24B] transition-colors whitespace-nowrap cursor-pointer"
                            >
                              {copiedCode === proc.codigo ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#B08A36]" />
                                  <span>Copiar mensagem para o cliente</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditProcessModal(proc)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#132D52] transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create / Edit Process Modal */}
      {editorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0B1F3A]">
                {editingId ? 'Editar processo' : 'Novo processo'}
              </h2>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                aria-label="Fechar"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProcess} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Código de acompanhamento
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={formCode}
                    className="flex-1 h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-sm text-[#0B1F3A]"
                  />
                  {!editingId && (
                    <button
                      type="button"
                      onClick={() => setFormCode(generateProcessCode())}
                      className="h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Gerar outro
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nome do cliente
                </label>
                <input
                  type="text"
                  required
                  value={formClientName}
                  onChange={(e) => setFormClientName(e.target.value)}
                  placeholder="Ex.: Maria Fernanda Silva"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Serviço</label>
                <select
                  value={formService}
                  onChange={(e) => setFormService(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Etapa atual (1 a 6)
                </label>
                <select
                  value={formStage}
                  onChange={(e) => setFormStage(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {STAGE_LABELS[n]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Observação pública (visível ao cliente)
                </label>
                <textarea
                  rows={3}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Ex.: Documentação conferida e protocolada em Assunção."
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-[#0B1F3A] focus:border-[#0B1F3A] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingProcess}
                  className="h-10 px-5 rounded-xl bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#132D52] disabled:opacity-60 cursor-pointer"
                >
                  {savingProcess ? 'Salvando...' : 'Salvar processo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
