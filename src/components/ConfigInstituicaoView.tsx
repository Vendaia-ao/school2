import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  Building2,
  FileText,
  Globe,
  Lock,
  Database,
  Plug,
  Code as Code2,
  Settings,
  Save,
  Upload,
  Download,
  RefreshCw,
  CircleCheck as CheckCircle2,
  TriangleAlert as AlertTriangle,
  X,
  Eye,
  Trash2,
  Plus,
  Key,
  Shield,
  Check,
  Server,
  KeyRound,
  HardDrive,
  Copy,
  MoreVertical,
} from 'lucide-react';
import { useAccess } from '../context/AccessContext';

interface Props {
  onSelectView?: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

type Tab = 'dados' | 'templates' | 'idioma' | 'seguranca' | 'backups' | 'integracoes' | 'apis' | 'geral';

interface BackupItem {
  id: string;
  nome: string;
  data: string;
  tamanho: string;
  tipo: 'Automático' | 'Manual';
  estado: 'Concluído' | 'Em curso' | 'Falhou';
}

interface IntegrationItem {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  estado: 'Conectado' | 'Desconectado' | 'Erro';
}

interface ApiKeyItem {
  id: string;
  nome: string;
  chave: string;
  criada: string;
  ultimaUsada: string;
  estado: 'Ativa' | 'Inativa';
}

const initialBackups: BackupItem[] = [
  { id: 'b1', nome: 'backup_2026-08-10_03h00', data: '10 Ago 2026, 03:00', tamanho: '248 MB', tipo: 'Automático', estado: 'Concluído' },
  { id: 'b2', nome: 'backup_2026-08-09_03h00', data: '09 Ago 2026, 03:00', tamanho: '246 MB', tipo: 'Automático', estado: 'Concluído' },
  { id: 'b3', nome: 'backup_manual_2026-08-08', data: '08 Ago 2026, 14:30', tamanho: '245 MB', tipo: 'Manual', estado: 'Concluído' },
  { id: 'b4', nome: 'backup_2026-08-08_03h00', data: '08 Ago 2026, 03:00', tamanho: '244 MB', tipo: 'Automático', estado: 'Concluído' },
  { id: 'b5', nome: 'backup_2026-08-07_03h00', data: '07 Ago 2026, 03:00', tamanho: '242 MB', tipo: 'Automático', estado: 'Falhou' },
  { id: 'b6', nome: 'backup_2026-08-06_03h00', data: '06 Ago 2026, 03:00', tamanho: '240 MB', tipo: 'Automático', estado: 'Concluído' },
];

const initialIntegrations: IntegrationItem[] = [
  { id: 'i1', nome: 'Supabase Postgres & Auth', descricao: 'Base de dados relacional e motor de autenticação RLS', categoria: 'Infraestrutura', estado: 'Conectado' },
  { id: 'i2', nome: 'Stripe Payments', descricao: 'Processamento de pagamentos globais e cartões', categoria: 'Financeiro', estado: 'Conectado' },
  { id: 'i3', nome: 'EMIS Multicaixa Express', descricao: 'Gateway de pagamentos Angolano por referência', categoria: 'Financeiro', estado: 'Conectado' },
  { id: 'i4', nome: 'Twilio SMS Gateway', descricao: 'Envio de SMS e notificações transacionais', categoria: 'Comunicação', estado: 'Conectado' },
  { id: 'i5', nome: 'Mailchimp Email Engine', descricao: 'Envio de circulares e newsletters institucionais', categoria: 'Comunicação', estado: 'Conectado' },
  { id: 'i6', nome: 'WhatsApp Business API', descricao: 'Envio de avisos e boletins via WhatsApp', categoria: 'Comunicação', estado: 'Conectado' },
  { id: 'i7', nome: 'Microsoft Graph (M365)', descricao: 'Sincronização de calendários e Single Sign-On (SSO)', categoria: 'Produtividade', estado: 'Desconectado' },
  { id: 'i8', nome: 'Google Workspace SSO', descricao: 'Autenticação unificada de professores e alunos', categoria: 'Produtividade', estado: 'Erro' },
];

const initialApiKeys: ApiKeyItem[] = [
  { id: 'k1', nome: 'Portal Web (Produção)', chave: 'vs_prod_••••••••••••3f8a', criada: '15 Jan 2025', ultimaUsada: '10 Ago 2026', estado: 'Ativa' },
  { id: 'k2', nome: 'App Mobile Estudante', chave: 'vs_mob_••••••••••••7c2d', criada: '20 Fev 2025', ultimaUsada: '09 Ago 2026', estado: 'Ativa' },
  { id: 'k3', nome: 'Integração Stripe', chave: 'vs_int_••••••••••••9e1f', criada: '05 Mar 2025', ultimaUsada: '10 Ago 2026', estado: 'Ativa' },
  { id: 'k4', nome: 'Webhook SMS Twilio', chave: 'vs_wh_••••••••••••4b6a', criada: '10 Mar 2025', ultimaUsada: '01 Ago 2026', estado: 'Inativa' },
];

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'dados', label: 'Dados Institucionais', icon: <Building2 className="w-4 h-4" /> },
  { key: 'templates', label: 'Templates de Documentos', icon: <FileText className="w-4 h-4" /> },
  { key: 'idioma', label: 'Idioma & Localização', icon: <Globe className="w-4 h-4" /> },
  { key: 'seguranca', label: 'Segurança & RLS', icon: <Lock className="w-4 h-4" /> },
  { key: 'backups', label: 'Backups do Sistema', icon: <Database className="w-4 h-4" /> },
  { key: 'integracoes', label: 'Integrações', icon: <Plug className="w-4 h-4" /> },
  { key: 'apis', label: 'APIs & Webhooks', icon: <Code2 className="w-4 h-4" /> },
  { key: 'geral', label: 'Configurações Gerais', icon: <Settings className="w-4 h-4" /> },
];

const estadoChip = (estado: string): string => {
  const map: Record<string, string> = {
    'Concluído': 'bg-success/15 text-success border border-success/20',
    'Em curso': 'bg-warning/15 text-warning border border-warning/20',
    'Falhou': 'bg-error/15 text-error border border-error/20',
    'Conectado': 'bg-success/15 text-success border border-success/20',
    'Desconectado': 'bg-surface-container text-outline border border-border-subtle',
    'Erro': 'bg-error/15 text-error border border-error/20',
    'Ativa': 'bg-success/15 text-success border border-success/20',
    'Inativa': 'bg-warning/15 text-warning border border-warning/20',
  };
  return map[estado] || 'bg-surface-container text-outline';
};

export const ConfigInstituicaoView: React.FC<Props> = ({ onShowToast }) => {
  const { structures } = useAccess();
  const [tab, setTab] = useState<Tab>('dados');
  const [selectedStructureId, setSelectedStructureId] = useState<string>('global');

  // Interactive Form State for Institutional Data
  const [dadosForm, setDadosForm] = useState({
    nome: 'Vendaia School®',
    designacao: 'Instituto Vendaia de Ensino Secundário',
    nif: '5412 0098 3',
    telefone: '+244 923 000 000',
    email: 'geral@vendaia.edu',
    website: 'www.vendaia.edu',
    morada: 'Av. Comandante Valódia, nº 120, Luanda, Angola',
    anoFundacao: '1998',
    diretorGeral: 'Dra. Sara Silva',
  });

  // State Lists
  const [backups, setBackups] = useState<BackupItem[]>(initialBackups);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(initialApiKeys);
  const [integrations] = useState<IntegrationItem[]>(initialIntegrations);

  // Modals State
  const [apiModal, setApiModal] = useState(false);
  const [confirmDeleteApi, setConfirmDeleteApi] = useState<ApiKeyItem | null>(null);
  const [confirmDeleteBackup, setConfirmDeleteBackup] = useState<BackupItem | null>(null);
  const [restoreBackup, setRestoreBackup] = useState<BackupItem | null>(null);
  const [newApiName, setNewApiName] = useState('');
  const [openBackupMenu, setOpenBackupMenu] = useState<string | null>(null);
  const [openApiMenu, setOpenApiMenu] = useState<string | null>(null);

  // General Settings Toggles
  const [manutencaoModo, setManutencaoModo] = useState(false);

  const templates = [
    { id: 't1', nome: 'Declaração de Matrícula', tipo: 'PDF', atualizado: '05 Ago 2026', icon: <FileText className="w-5 h-5 text-primary" /> },
    { id: 't2', nome: 'Certificado de Conclusão', tipo: 'PDF', atualizado: '22 Jul 2026', icon: <FileText className="w-5 h-5 text-primary" /> },
    { id: 't3', nome: 'Recibo de Propina (AGT)', tipo: 'PDF', atualizado: '10 Jul 2026', icon: <FileText className="w-5 h-5 text-primary" /> },
    { id: 't4', nome: 'Cartão do Estudante Digital', tipo: 'PDF', atualizado: '15 Jun 2026', icon: <FileText className="w-5 h-5 text-primary" /> },
    { id: 't5', nome: 'Fatura / Recibo Institucional', tipo: 'PDF', atualizado: '01 Jun 2026', icon: <FileText className="w-5 h-5 text-primary" /> },
    { id: 't6', nome: 'Boletim de Notas & Caderneta', tipo: 'PDF', atualizado: '20 Mai 2026', icon: <FileText className="w-5 h-5 text-primary" /> },
    { id: 't7', nome: 'Contrato de Prestação de Serviços', tipo: 'DOCX', atualizado: '10 Mai 2026', icon: <FileText className="w-5 h-5 text-primary" /> },
    { id: 't8', nome: 'Termo de Responsabilidade', tipo: 'DOCX', atualizado: '05 Abr 2026', icon: <FileText className="w-5 h-5 text-primary" /> },
  ];

  const handleSaveDados = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Dados institucionais guardados com sucesso no Vendaia OS®!');
  };

  const createApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiName.trim()) return;
    const newKey: ApiKeyItem = {
      id: `k${Date.now()}`,
      nome: newApiName,
      chave: `vs_prod_••••••••••••${Math.random().toString(16).slice(2, 6)}`,
      criada: '10 Ago 2026',
      ultimaUsada: 'Nunca',
      estado: 'Ativa',
    };
    setApiKeys([newKey, ...apiKeys]);
    onShowToast(`API Key "${newApiName}" gerada com sucesso!`);
    setApiModal(false);
    setNewApiName('');
  };

  const removeApiKey = () => {
    if (!confirmDeleteApi) return;
    setApiKeys(apiKeys.filter((k) => k.id !== confirmDeleteApi.id));
    onShowToast(`API Key "${confirmDeleteApi.nome}" revogada.`);
    setConfirmDeleteApi(null);
  };

  const removeBackup = () => {
    if (!confirmDeleteBackup) return;
    setBackups(backups.filter((b) => b.id !== confirmDeleteBackup.id));
    onShowToast(`Backup "${confirmDeleteBackup.nome}" removido.`);
    setConfirmDeleteBackup(null);
  };

  const doRestore = () => {
    if (!restoreBackup) return;
    onShowToast(`Restauro a partir de "${restoreBackup.nome}" iniciado com sucesso.`);
    setRestoreBackup(null);
  };

  const createBackup = () => {
    const newBackup: BackupItem = {
      id: `b${Date.now()}`,
      nome: `backup_manual_${new Date().toISOString().slice(0, 10)}`,
      data: '10 Ago 2026, 16:00',
      tamanho: '248 MB',
      tipo: 'Manual',
      estado: 'Concluído',
    };
    setBackups([newBackup, ...backups]);
    onShowToast('Backup manual instantâneo criado com sucesso!');
  };

  const activeIntegrationsCount = integrations.filter(i => i.estado === 'Conectado').length;

  return (
    <div className="mt-header-height w-full flex flex-col gap-4 p-4">
      {/* Top Header Flush */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary stroke-[1.75]" />
            Configurações da Instituição
          </h1>
          <p className="text-xs text-outline">
            Parametrização global da instituição, segurança RLS, conectores e templates corporativos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Structure Selector RN9.08 */}
          <div className="flex items-center gap-1.5 bg-surface-white border border-border-subtle rounded-xl px-3 py-1.5 shadow-2xs text-xs">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-outline font-medium text-[11px]">Estrutura:</span>
            <select
              value={selectedStructureId}
              onChange={(e) => setSelectedStructureId(e.target.value)}
              className="bg-transparent font-bold text-primary focus:outline-none cursor-pointer text-xs"
            >
              <option value="global">🌐 Global Institucional (Todas)</option>
              {structures.map((s) => (
                <option key={s.id} value={s.id}>
                  🏢 {s.nome} ({s.codigo})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onShowToast('Todas as alterações de configuração foram salvas!')}
            className="bg-primary hover:bg-primary-container text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Guardar Alterações
          </button>
        </div>
      </div>

      {/* 4-KPI Grid (Padrão Dashboard — h-[68px], sem redundâncias) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card 1: IDENTIDADE LEGAL */}
        <div className="bg-surface-white border border-border-subtle/30 rounded-lg px-4 py-3 shadow-xs flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-outline text-[10px] uppercase font-bold tracking-wider mb-0.5">
              IDENTIDADE LEGAL
            </span>
            <span className="text-sm font-bold text-primary leading-none truncate">
              NIF {dadosForm.nif}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <Check className="w-3 h-3 mr-0.5" /> Ativo
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">registo</span>
          </div>
        </div>

        {/* Card 2: SEGURANÇA & RLS */}
        <div className="bg-surface-white border border-border-subtle/30 rounded-lg px-4 py-3 shadow-xs flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-outline text-[10px] uppercase font-bold tracking-wider mb-0.5">
              SEGURANÇA & RLS
            </span>
            <span className="text-sm font-bold text-primary leading-none">
              2FA • 30m
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <Shield className="w-3 h-3 mr-0.5" /> Auditoria
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">ativa</span>
          </div>
        </div>

        {/* Card 3: CONECTORES */}
        <div className="bg-surface-white border border-border-subtle/30 rounded-lg px-4 py-3 shadow-xs flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-outline text-[10px] uppercase font-bold tracking-wider mb-0.5">
              CONECTORES
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
              {activeIntegrationsCount} / {integrations.length}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-info bg-info/10 text-[10px] font-bold">
              <Server className="w-3 h-3 mr-0.5" /> EMIS OK
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">gateway</span>
          </div>
        </div>

        {/* Card 4: BACKUPS */}
        <div className="bg-surface-white border border-border-subtle/30 rounded-lg px-4 py-3 shadow-xs flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-outline text-[10px] uppercase font-bold tracking-wider mb-0.5">
              BACKUPS
            </span>
            <span className="text-sm font-bold text-primary leading-none truncate">
              Hoje, 03:00
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">
              248 MB
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">30d retenção</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-2xs flex items-center gap-1 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === item.key
                ? 'bg-primary text-surface-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Dados Institucionais */}
      {tab === 'dados' && (
        <form onSubmit={handleSaveDados} className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs space-y-5 text-xs">
          <div>
            <h2 className="text-base font-bold text-primary">Dados Institucionais</h2>
            <p className="text-outline text-[11px]">
              Informações oficiais e legais da instituição apresentadas em documentos, faturas e portais.
            </p>
          </div>

          {/* Logótipo */}
          <div className="border border-border-subtle rounded-xl p-4 bg-surface-container-low/30 space-y-3">
            <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              Logótipo e Identidade Visual
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl bg-primary text-surface-white flex items-center justify-center font-bold text-2xl shadow-sm">
                VS
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => onShowToast('Seletor de logótipo aberto.')}
                  className="bg-primary hover:bg-primary-container text-surface-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all w-fit shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" /> Carregar Novo Logótipo
                </button>
                <span className="text-[10px] text-outline">Ficheiros PNG, SVG ou JPG até 2MB. Dimensão recomendada: 512x512px.</span>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-outline font-bold mb-1">Nome da Instituição</label>
              <input
                type="text"
                value={dadosForm.nome}
                onChange={(e) => setDadosForm({ ...dadosForm, nome: e.target.value })}
                className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-outline font-bold mb-1">Designação Oficial / Razão Social</label>
              <input
                type="text"
                value={dadosForm.designacao}
                onChange={(e) => setDadosForm({ ...dadosForm, designacao: e.target.value })}
                className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-outline font-bold mb-1">NIF / Identificação Fiscal</label>
              <input
                type="text"
                value={dadosForm.nif}
                onChange={(e) => setDadosForm({ ...dadosForm, nif: e.target.value })}
                className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-outline font-bold mb-1">Telefone Geral</label>
              <input
                type="text"
                value={dadosForm.telefone}
                onChange={(e) => setDadosForm({ ...dadosForm, telefone: e.target.value })}
                className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-outline font-bold mb-1">Email Geral Institucional</label>
              <input
                type="email"
                value={dadosForm.email}
                onChange={(e) => setDadosForm({ ...dadosForm, email: e.target.value })}
                className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-outline font-bold mb-1">Website Oficial</label>
              <input
                type="text"
                value={dadosForm.website}
                onChange={(e) => setDadosForm({ ...dadosForm, website: e.target.value })}
                className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-outline font-bold mb-1">Morada da Sede</label>
              <input
                type="text"
                value={dadosForm.morada}
                onChange={(e) => setDadosForm({ ...dadosForm, morada: e.target.value })}
                className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-outline font-bold mb-1">Ano de Fundação</label>
              <input
                type="text"
                value={dadosForm.anoFundacao}
                onChange={(e) => setDadosForm({ ...dadosForm, anoFundacao: e.target.value })}
                className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-outline font-bold mb-1">Diretor(a) Geral</label>
              <input
                type="text"
                value={dadosForm.diretorGeral}
                onChange={(e) => setDadosForm({ ...dadosForm, diretorGeral: e.target.value })}
                className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-border-subtle">
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-surface-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            >
              <Save className="w-4 h-4" /> Guardar Dados Institucionais
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Templates de Documentos */}
      {tab === 'templates' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-primary">Templates de Documentos</h2>
              <p className="text-outline text-[11px]">
                Modelos de documentos PDF e DOCX utilizados pelo sistema para emissão automática.
              </p>
            </div>
            <button
              onClick={() => onShowToast('Seletor de ficheiro de template aberto.')}
              className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Carregar Novo Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.map((t) => (
              <div key={t.id} className="border border-border-subtle rounded-xl p-3.5 flex items-center justify-between hover:border-primary/40 transition-all bg-surface-white shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {t.icon}
                  </div>
                  <div>
                    <p className="font-bold text-primary text-xs">{t.nome}</p>
                    <p className="text-[10px] text-outline">{t.tipo} • Atualizado em {t.atualizado}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onShowToast(`Pré-visualização do template "${t.nome}" aberta.`)}
                    className="p-1.5 text-outline hover:text-info rounded-lg hover:bg-info/10 transition-colors cursor-pointer"
                    title="Pré-visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onShowToast(`Download do template "${t.nome}" iniciado.`)}
                    className="p-1.5 text-outline hover:text-success rounded-lg hover:bg-success/10 transition-colors cursor-pointer"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Idioma & Localização */}
      {tab === 'idioma' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs space-y-4 text-xs">
          <div>
            <h2 className="text-base font-bold text-primary">Idioma e Localização</h2>
            <p className="text-outline text-[11px]">
              Definições de idioma nativo, moedas de faturação e formatação regional de datas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-outline font-bold mb-1">Idioma Principal da Plataforma</label>
              <select className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none bg-surface-white cursor-pointer">
                <option>Português (Angola) — pt-AO</option>
                <option>Português (Portugal) — pt-PT</option>
                <option>Português (Brasil) — pt-BR</option>
                <option>English — en-GB</option>
                <option>Français — fr-FR</option>
              </select>
            </div>
            <div>
              <label className="block text-outline font-bold mb-1">Formato de Data Oficial</label>
              <select className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none bg-surface-white cursor-pointer">
                <option>DD MMM AAAA (10 Ago 2026)</option>
                <option>DD/MM/AAAA (10/08/2026)</option>
                <option>AAAA-MM-DD (2026-08-10)</option>
              </select>
            </div>
            <div>
              <label className="block text-outline font-bold mb-1">Moeda Principal de Faturação</label>
              <select className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none bg-surface-white cursor-pointer">
                <option>Kwanza Angolano (Kz / AOA)</option>
                <option>Euro (€ / EUR)</option>
                <option>Dólar Americano ($ / USD)</option>
              </select>
            </div>
            <div>
              <label className="block text-outline font-bold mb-1">Fuso Horário de Referência</label>
              <select className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none bg-surface-white cursor-pointer">
                <option>África/Luanda (WAT, UTC+1)</option>
                <option>Europe/Lisbon (WET, UTC+0)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-border-subtle">
            <button
              onClick={() => onShowToast('Configurações de localização guardadas!')}
              className="bg-primary hover:bg-primary/90 text-surface-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            >
              <Save className="w-4 h-4" /> Guardar Localização
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Segurança & RLS */}
      {tab === 'seguranca' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs space-y-5 text-xs">
          <div>
            <h2 className="text-base font-bold text-primary">Segurança & Políticas RLS</h2>
            <p className="text-outline text-[11px]">
              Políticas de palavras-passe, autenticação forte (2FA), gestão de sessões e proteção de dados.
            </p>
          </div>

          <div className="space-y-5">
            {/* Pwd Policies */}
            <div className="space-y-3">
              <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider border-b border-border-subtle pb-1">
                Políticas de Palavra-passe
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-outline font-bold mb-1">Comprimento Mínimo (Caracteres)</label>
                  <input type="number" defaultValue={8} className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-outline font-bold mb-1">Expiração Obrigatoria (Dias)</label>
                  <input type="number" defaultValue={90} className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-surface-container-low/40 transition-colors">
                  <input type="checkbox" defaultChecked className="rounded border-border-subtle text-primary focus:ring-primary cursor-pointer" />
                  <span className="font-semibold text-primary">Exigir letras maiúsculas e caracteres especiais</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-surface-container-low/40 transition-colors">
                  <input type="checkbox" defaultChecked className="rounded border-border-subtle text-primary focus:ring-primary cursor-pointer" />
                  <span className="font-semibold text-primary">Forçar alteração de palavra-passe no primeiro acesso</span>
                </label>
              </div>
            </div>

            {/* Session Policies */}
            <div className="space-y-3 pt-3 border-t border-border-subtle">
              <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider border-b border-border-subtle pb-1">
                Gestão de Sessões & Autenticação 2FA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-outline font-bold mb-1">Tempo limite de inatividade (minutos)</label>
                  <input type="number" defaultValue={30} className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-outline font-bold mb-1">Tentativas de login falhadas antes de bloqueio</label>
                  <input type="number" defaultValue={5} className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-border-subtle">
            <button
              onClick={() => onShowToast('Políticas de segurança guardadas com sucesso!')}
              className="bg-primary hover:bg-primary/90 text-surface-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            >
              <Save className="w-4 h-4" /> Guardar Segurança
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Backups */}
      {tab === 'backups' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-primary">Backups do Sistema</h2>
              <p className="text-outline text-[11px]">
                Cópias de segurança automáticas e manuais da base de dados Supabase e ficheiros.
              </p>
            </div>
            <button
              onClick={createBackup}
              className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <Database className="w-4 h-4" /> Criar Backup Agora
            </button>
          </div>

          <div className="overflow-x-auto border border-border-subtle rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-subtle">
                  <th className="px-3.5 py-3 font-bold text-primary">Nome</th>
                  <th className="px-3.5 py-3 font-bold text-primary">Data</th>
                  <th className="px-3.5 py-3 font-bold text-primary">Tamanho</th>
                  <th className="px-3.5 py-3 text-center font-bold text-primary">Tipo</th>
                  <th className="px-3.5 py-3 text-center font-bold text-primary">Estado</th>
                  <th className="px-3.5 py-3 text-right font-bold text-primary">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {backups.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-3.5 py-3 font-bold text-primary font-mono text-[11px]">{b.nome}</td>
                    <td className="px-3.5 py-3 text-outline">{b.data}</td>
                    <td className="px-3.5 py-3 text-on-surface-variant font-semibold">{b.tamanho}</td>
                    <td className="px-3.5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.tipo === 'Automático' ? 'bg-info/10 text-info' : 'bg-primary/10 text-primary'}`}>
                        {b.tipo}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <span className={`${estadoChip(b.estado)} px-2.5 py-1 rounded-full text-[10px] font-bold`}>{b.estado}</span>
                    </td>
                    <td className="px-3.5 py-3 text-right relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenBackupMenu(openBackupMenu === b.id ? null : b.id); }}
                        className={`p-1.5 text-outline hover:text-primary rounded-lg transition-colors cursor-pointer ${openBackupMenu === b.id ? 'bg-surface-container-high text-primary' : 'hover:bg-surface-container'}`}
                        title="Ações"
                      >
                        <MoreVertical className="w-4 h-4 stroke-[2]" />
                      </button>

                      {openBackupMenu === b.id && (
                        <>
                          <div className="fixed inset-0 z-20 cursor-default" onClick={(e) => { e.stopPropagation(); setOpenBackupMenu(null); }} />
                          <div className="absolute right-3 top-10 z-30 w-48 bg-surface-white border border-border-subtle rounded-xl shadow-xl py-1 text-left text-xs divide-y divide-border-subtle animate-in fade-in zoom-in-95 duration-100 font-normal">
                            <div className="py-1">
                              <button
                                onClick={() => { onShowToast(`Download do backup "${b.nome}" iniciado.`); setOpenBackupMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-success/10 hover:text-success font-medium cursor-pointer transition-colors"
                              >
                                <Download className="w-4 h-4 text-success stroke-[2]" />
                                <span>Download Backup</span>
                              </button>
                              <button
                                onClick={() => { setRestoreBackup(b); setOpenBackupMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-info/10 hover:text-info font-medium cursor-pointer transition-colors"
                              >
                                <RefreshCw className="w-4 h-4 text-info stroke-[2]" />
                                <span>Restaurar Backup</span>
                              </button>
                              <button
                                onClick={() => { setConfirmDeleteBackup(b); setOpenBackupMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-error/10 hover:text-error font-medium cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-error stroke-[2]" />
                                <span>Remover Backup</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Integrações */}
      {tab === 'integracoes' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-primary">Integrações de Terceiros</h2>
            <p className="text-outline text-[11px]">
              Serviços externos e conectores integrados ao ecossistema Vendaia School®.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {integrations.map((int) => (
              <div key={int.id} className="border border-border-subtle rounded-xl p-4 flex items-center justify-between bg-surface-white shadow-2xs hover:border-primary/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${int.estado === 'Conectado' ? 'bg-success/10 text-success' : int.estado === 'Erro' ? 'bg-error/10 text-error' : 'bg-surface-container text-outline'}`}>
                    <Plug className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-primary text-xs">{int.nome}</p>
                    <p className="text-[11px] text-outline leading-tight">{int.descricao}</p>
                    <span className="text-[9px] text-primary uppercase font-bold tracking-wider">{int.categoria}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`${estadoChip(int.estado)} px-2.5 py-0.5 rounded-full text-[10px] font-bold`}>{int.estado}</span>
                  <button
                    onClick={() => onShowToast(`Configuração de "${int.nome}" aberta.`)}
                    className="text-[11px] text-primary font-bold hover:underline cursor-pointer"
                  >
                    {int.estado === 'Conectado' ? 'Configurar' : 'Conectar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: APIs */}
      {tab === 'apis' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-primary">APIs e Chaves de Acesso</h2>
              <p className="text-outline text-[11px]">
                Gestão de chaves de API para aplicações externas e webhooks.
              </p>
            </div>
            <button
              onClick={() => setApiModal(true)}
              className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Gerar Nova API Key
            </button>
          </div>

          <div className="overflow-x-auto border border-border-subtle rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-subtle">
                  <th className="px-3.5 py-3 font-bold text-primary">Nome</th>
                  <th className="px-3.5 py-3 font-bold text-primary">Chave (Token)</th>
                  <th className="px-3.5 py-3 font-bold text-primary">Criada</th>
                  <th className="px-3.5 py-3 font-bold text-primary">Última Utilização</th>
                  <th className="px-3.5 py-3 text-center font-bold text-primary">Estado</th>
                  <th className="px-3.5 py-3 text-right font-bold text-primary">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-3.5 py-3 font-bold text-primary">{k.nome}</td>
                    <td className="px-3.5 py-3">
                      <span className="font-mono text-[11px] text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded border border-border-subtle">
                        {k.chave}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-outline">{k.criada}</td>
                    <td className="px-3.5 py-3 text-outline">{k.ultimaUsada}</td>
                    <td className="px-3.5 py-3 text-center">
                      <span className={`${estadoChip(k.estado)} px-2.5 py-1 rounded-full text-[10px] font-bold`}>{k.estado}</span>
                    </td>
                    <td className="px-3.5 py-3 text-right relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenApiMenu(openApiMenu === k.id ? null : k.id); }}
                        className={`p-1.5 text-outline hover:text-primary rounded-lg transition-colors cursor-pointer ${openApiMenu === k.id ? 'bg-surface-container-high text-primary' : 'hover:bg-surface-container'}`}
                        title="Ações"
                      >
                        <MoreVertical className="w-4 h-4 stroke-[2]" />
                      </button>

                      {openApiMenu === k.id && (
                        <>
                          <div className="fixed inset-0 z-20 cursor-default" onClick={(e) => { e.stopPropagation(); setOpenApiMenu(null); }} />
                          <div className="absolute right-3 top-10 z-30 w-44 bg-surface-white border border-border-subtle rounded-xl shadow-xl py-1 text-left text-xs divide-y divide-border-subtle animate-in fade-in zoom-in-95 duration-100 font-normal">
                            <div className="py-1">
                              <button
                                onClick={() => { onShowToast(`Chave de "${k.nome}" copiada!`); setOpenApiMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-info/10 hover:text-info font-medium cursor-pointer transition-colors"
                              >
                                <Copy className="w-4 h-4 text-info stroke-[2]" />
                                <span>Copiar Chave</span>
                              </button>
                              <button
                                onClick={() => { setConfirmDeleteApi(k); setOpenApiMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-error/10 hover:text-error font-medium cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-error stroke-[2]" />
                                <span>Revogar Key</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 8: Configurações Gerais */}
      {tab === 'geral' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs space-y-4 text-xs">
          <div>
            <h2 className="text-base font-bold text-primary">Configurações Gerais da Plataforma</h2>
            <p className="text-outline text-[11px]">
              Opções globais de manutenção, termos de serviço e privacidade.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-border-subtle rounded-xl bg-surface-container-low/30 flex items-center justify-between">
              <div>
                <p className="font-bold text-primary text-xs">Modo de Manutenção Global</p>
                <p className="text-[11px] text-outline">Bloqueia o acesso temporário de alunos e encarregados no portal.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-bold">
                <input
                  type="checkbox"
                  checked={manutencaoModo}
                  onChange={(e) => {
                    setManutencaoModo(e.target.checked);
                    onShowToast(`Modo de manutenção ${e.target.checked ? 'ativado' : 'desativado'}.`);
                  }}
                  className="w-4 h-4 rounded border-border-subtle text-primary focus:ring-primary cursor-pointer"
                />
                {manutencaoModo ? 'Ativo' : 'Desativado'}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Gerar API Key */}
      {apiModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-md overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-primary text-surface-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-white/10 border border-surface-white/20 flex items-center justify-center text-surface-white font-bold shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight">Gerar Nova API Key</h2>
                  <p className="text-[11px] text-surface-white/70">
                    Crie uma nova chave de acesso para aplicações externas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApiModal(false)}
                className="text-surface-white/70 hover:text-surface-white p-1 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={createApiKey} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-outline font-bold mb-1">Nome da Aplicação / Integração</label>
                <input
                  type="text"
                  required
                  placeholder="ex: App Móvil Professores"
                  value={newApiName}
                  onChange={(e) => setNewApiName(e.target.value)}
                  className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4 mt-5">
                <button
                  type="button"
                  onClick={() => setApiModal(false)}
                  className="border border-border-subtle hover:bg-surface-container rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-surface-white rounded-xl px-5 py-2 text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  Gerar Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de API Key */}
      {confirmDeleteApi && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-md overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-primary text-surface-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-white/10 border border-surface-white/20 flex items-center justify-center text-surface-white font-bold shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight">Revogar API Key</h2>
                  <p className="text-[11px] text-surface-white/70">
                    Confirmação de revogação de credencial.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfirmDeleteApi(null)}
                className="text-surface-white/70 hover:text-surface-white p-1 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs">
              <p className="text-on-surface-variant mb-5 leading-relaxed">
                Esta ação é irreversível. Deseja revogar a chave <strong className="text-primary font-bold">{confirmDeleteApi.nome}</strong>?
              </p>

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4">
                <button
                  onClick={() => setConfirmDeleteApi(null)}
                  className="border border-border-subtle hover:bg-surface-container rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={removeApiKey}
                  className="bg-primary hover:bg-primary/90 text-surface-white rounded-xl px-5 py-2 text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  Sim, Revogar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Restauro de Backup */}
      {restoreBackup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-md overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-primary text-surface-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-white/10 border border-surface-white/20 flex items-center justify-center text-surface-white font-bold shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight">Confirmar Restauro de Backup</h2>
                  <p className="text-[11px] text-surface-white/70">
                    Restauração da base de dados.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRestoreBackup(null)}
                className="text-surface-white/70 hover:text-surface-white p-1 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs">
              <p className="text-on-surface-variant mb-5 leading-relaxed">
                Deseja restaurar a base de dados a partir do ponto de restauração <strong className="text-primary font-bold">{restoreBackup.nome}</strong> ({restoreBackup.data})?
              </p>

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4">
                <button
                  onClick={() => setRestoreBackup(null)}
                  className="border border-border-subtle hover:bg-surface-container rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={doRestore}
                  className="bg-primary hover:bg-primary/90 text-surface-white rounded-xl px-5 py-2 text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  Restaurar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Backup */}
      {confirmDeleteBackup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-md overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-primary text-surface-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-white/10 border border-surface-white/20 flex items-center justify-center text-surface-white font-bold shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight">Remover Backup</h2>
                  <p className="text-[11px] text-surface-white/70">
                    Exclusão de cópia de segurança.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfirmDeleteBackup(null)}
                className="text-surface-white/70 hover:text-surface-white p-1 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs">
              <p className="text-on-surface-variant mb-5 leading-relaxed">
                Deseja remover o ficheiro de backup <strong className="text-primary font-bold">{confirmDeleteBackup.nome}</strong>?
              </p>

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4">
                <button
                  onClick={() => setConfirmDeleteBackup(null)}
                  className="border border-border-subtle hover:bg-surface-container rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={removeBackup}
                  className="bg-primary hover:bg-primary/90 text-surface-white rounded-xl px-5 py-2 text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
