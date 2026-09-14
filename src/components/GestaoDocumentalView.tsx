import React, { useMemo, useState } from 'react';
import { ActiveView } from '../types';
import { TriangleAlert as AlertTriangle, Archive, Calendar, Clock, Download, Pencil as Edit3, Eye, FileText, ListFilter as Filter, FolderOpen, History, Plus, Search, Trash2, Upload, User, X, FolderArchive, FileCheck, FileClock, Layers, List, LayoutGrid } from 'lucide-react';

interface Props { onSelectView: (view: ActiveView) => void; onShowToast: (msg: string) => void; }
type Tab = 'arquivo' | 'categorias' | 'historico';
type DocStatus = 'Arquivado' | 'Pendente' | 'Expirado' | 'Em Revisão';
type DocCategory = 'Académico' | 'Financeiro' | 'RH' | 'Jurídico' | 'Administrativo' | 'Comunicação';

interface ArchiveDoc {
  id: string;
  titulo: string;
  categoria: DocCategory;
  tipo: string;
  dataArquivo: string;
  dataValidade: string;
  tamanho: string;
  responsavel: string;
  estado: DocStatus;
  descricao: string;
}

interface Category {
  id: string;
  nome: DocCategory;
  icon: React.ReactNode;
  totalDocs: number;
  responsavel: string;
  cor: string;
}

interface HistoryEntry {
  id: string;
  documento: string;
  acao: 'Criação' | 'Edição' | 'Arquivo' | 'Download' | 'Validação' | 'Expiração';
  utilizador: string;
  data: string;
  hora: string;
}

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'arquivo', label: 'Arquivo Documental', icon: <Archive className="w-4 h-4" /> },
  { key: 'categorias', label: 'Categorias', icon: <Layers className="w-4 h-4" /> },
  { key: 'historico', label: 'Histórico', icon: <History className="w-4 h-4" /> },
];

const statusChip = (status: DocStatus) => {
  const map: Record<DocStatus, string> = {
    'Arquivado': 'bg-success/15 text-success',
    'Pendente': 'bg-warning/15 text-warning',
    'Expirado': 'bg-error/15 text-error',
    'Em Revisão': 'bg-info/15 text-info',
  };
  return map[status];
};

const categoryColors: Record<DocCategory, string> = {
  'Académico': 'bg-primary/10 text-primary',
  'Financeiro': 'bg-success/10 text-success',
  'RH': 'bg-secondary/10 text-secondary',
  'Jurídico': 'bg-error/10 text-error',
  'Administrativo': 'bg-info/10 text-info',
  'Comunicação': 'bg-warning/10 text-warning',
};

const initialDocuments: ArchiveDoc[] = [
  { id: 'DOC-001', titulo: 'Registo de Matrículas 2025/2026', categoria: 'Académico', tipo: 'PDF', dataArquivo: '10 Set 2025', dataValidade: '—', tamanho: '2.4 MB', responsavel: 'Sara Silva', estado: 'Arquivado', descricao: 'Registo completo das matrículas do ano letivo 2025/2026.' },
  { id: 'DOC-002', titulo: 'Balanço Financeiro Q2 2026', categoria: 'Financeiro', tipo: 'XLSX', dataArquivo: '15 Jul 2026', dataValidade: '—', tamanho: '1.8 MB', responsavel: 'Beatriz Ferreira', estado: 'Arquivado', descricao: 'Balanço financeiro do segundo trimestre de 2026.' },
  { id: 'DOC-003', titulo: 'Contrato de Trabalho — Domingos Henriques', categoria: 'RH', tipo: 'PDF', dataArquivo: '12 Set 2021', dataValidade: '12 Set 2026', tamanho: '850 KB', responsavel: 'Sara Silva', estado: 'Expirado', descricao: 'Contrato de trabalho do professor Domingos Henriques.' },
  { id: 'DOC-004', titulo: 'Estatutos da Instituição — Revisão 2024', categoria: 'Jurídico', tipo: 'PDF', dataArquivo: '03 Mar 2024', dataValidade: '—', tamanho: '3.2 MB', responsavel: 'Carlos Mendes', estado: 'Arquivado', descricao: 'Estatutos revisados e aprovados em assembleia geral.' },
  { id: 'DOC-005', titulo: 'Ata de Reunião Pedagógica — Agosto 2026', categoria: 'Administrativo', tipo: 'DOCX', dataArquivo: '08 Ago 2026', dataValidade: '—', tamanho: '420 KB', responsavel: 'Carlos Mendes', estado: 'Em Revisão', descricao: 'Ata da reunião pedagógica mensal de agosto.' },
  { id: 'DOC-006', titulo: 'Certificado de Habilitações — Eduardo Lima', categoria: 'RH', tipo: 'PDF', dataArquivo: '10 Jan 2026', dataValidade: '—', tamanho: '610 KB', responsavel: 'Sara Silva', estado: 'Pendente', descricao: 'Certificado de habilitações do técnico de informática.' },
  { id: 'DOC-007', titulo: 'Relatório de Auditoria Externa 2025', categoria: 'Financeiro', tipo: 'PDF', dataArquivo: '28 Fev 2026', dataValidade: '28 Fev 2028', tamanho: '5.1 MB', responsavel: 'Beatriz Ferreira', estado: 'Arquivado', descricao: 'Relatório de auditoria externa ao exercício de 2025.' },
  { id: 'DOC-008', titulo: 'Comunicado Institucional — Reabertura', categoria: 'Comunicação', tipo: 'PDF', dataArquivo: '01 Set 2026', dataValidade: '—', tamanho: '180 KB', responsavel: 'João Pinto', estado: 'Arquivado', descricao: 'Comunicado de reabertura do ano letivo 2026/2027.' },
  { id: 'DOC-009', titulo: 'Pauta Final — 10º Ano A — 2º Período', categoria: 'Académico', tipo: 'PDF', dataArquivo: '15 Jun 2026', dataValidade: '—', tamanho: '950 KB', responsavel: 'Domingos Henriques', estado: 'Arquivado', descricao: 'Pauta final do 2º período da turma 10º A.' },
  { id: 'DOC-010', titulo: 'Apólice de Seguro Escolar 2026/2027', categoria: 'Jurídico', tipo: 'PDF', dataArquivo: '01 Ago 2026', dataValidade: '31 Jul 2027', tamanho: '1.2 MB', responsavel: 'Carlos Mendes', estado: 'Arquivado', descricao: 'Apólice de seguro escolar para o ano letivo 2026/2027.' },
];

const initialCategories: Category[] = [
  { id: 'cat1', nome: 'Académico', icon: <FileText className="w-5 h-5" />, totalDocs: 142, responsavel: 'Carlos Mendes', cor: categoryColors['Académico'] },
  { id: 'cat2', nome: 'Financeiro', icon: <FileCheck className="w-5 h-5" />, totalDocs: 87, responsavel: 'Beatriz Ferreira', cor: categoryColors['Financeiro'] },
  { id: 'cat3', nome: 'RH', icon: <User className="w-5 h-5" />, totalDocs: 64, responsavel: 'Sara Silva', cor: categoryColors['RH'] },
  { id: 'cat4', nome: 'Jurídico', icon: <FileClock className="w-5 h-5" />, totalDocs: 38, responsavel: 'Carlos Mendes', cor: categoryColors['Jurídico'] },
  { id: 'cat5', nome: 'Administrativo', icon: <FolderOpen className="w-5 h-5" />, totalDocs: 95, responsavel: 'Sara Silva', cor: categoryColors['Administrativo'] },
  { id: 'cat6', nome: 'Comunicação', icon: <FileText className="w-5 h-5" />, totalDocs: 52, responsavel: 'João Pinto', cor: categoryColors['Comunicação'] },
];

const initialHistory: HistoryEntry[] = [
  { id: 'h1', documento: 'Registo de Matrículas 2025/2026', acao: 'Arquivo', utilizador: 'Sara Silva', data: '10 Ago 2026', hora: '14:32' },
  { id: 'h2', documento: 'Contrato de Trabalho — Domingos Henriques', acao: 'Expiração', utilizador: 'Sistema', data: '12 Set 2026', hora: '00:01' },
  { id: 'h3', documento: 'Balanço Financeiro Q2 2026', acao: 'Download', utilizador: 'Beatriz Ferreira', data: '09 Ago 2026', hora: '11:15' },
  { id: 'h4', documento: 'Ata de Reunião Pedagógica — Agosto 2026', acao: 'Edição', utilizador: 'Carlos Mendes', data: '08 Ago 2026', hora: '16:45' },
  { id: 'h5', documento: 'Apólice de Seguro Escolar 2026/2027', acao: 'Criação', utilizador: 'Carlos Mendes', data: '01 Ago 2026', hora: '09:20' },
  { id: 'h6', documento: 'Relatório de Auditoria Externa 2025', acao: 'Validação', utilizador: 'Beatriz Ferreira', data: '28 Fev 2026', hora: '17:00' },
  { id: 'h7', documento: 'Certificado de Habilitações — Eduardo Lima', acao: 'Criação', utilizador: 'Sara Silva', data: '10 Jan 2026', hora: '10:30' },
  { id: 'h8', documento: 'Pauta Final — 10º Ano A — 2º Período', acao: 'Arquivo', utilizador: 'Domingos Henriques', data: '15 Jun 2026', hora: '12:00' },
];

const actionChip = (acao: HistoryEntry['acao']) => {
  const map: Record<HistoryEntry['acao'], string> = {
    'Criação': 'bg-success/15 text-success',
    'Edição': 'bg-info/15 text-info',
    'Arquivo': 'bg-primary/10 text-primary',
    'Download': 'bg-surface-container text-on-surface-variant',
    'Validação': 'bg-success/15 text-success',
    'Expiração': 'bg-error/15 text-error',
  };
  return map[acao];
};

export const GestaoDocumentalView: React.FC<Props> = ({ onShowToast }) => {
  const [tab, setTab] = useState<Tab>('arquivo');
  const [documents, setDocuments] = useState<ArchiveDoc[]>(initialDocuments);
  const [categories] = useState<Category[]>(initialCategories);
  const [history] = useState<HistoryEntry[]>(initialHistory);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterValidade, setFilterValidade] = useState('Todos');
  const [filterResponsavel, setFilterResponsavel] = useState('Todos');
  const [viewMode, setViewMode] = useState<'tabela' | 'grelha'>('tabela');
  const [modal, setModal] = useState<'document' | null>(null);
  const [viewDoc, setViewDoc] = useState<ArchiveDoc | null>(null);
  const [editing, setEditing] = useState<ArchiveDoc | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ArchiveDoc | null>(null);
  const [form, setForm] = useState({ titulo: '', categoria: 'Académico' as DocCategory, tipo: 'PDF', descricao: '', dataValidade: '', responsavel: '' });

  const archivedCount = documents.filter((d) => d.estado === 'Arquivado').length;
  const pendingCount = documents.filter((d) => d.estado === 'Pendente' || d.estado === 'Em Revisão').length;
  const expiredCount = documents.filter((d) => d.estado === 'Expirado').length;
  const totalSizeMB = documents.reduce((sum, d) => sum + parseFloat(d.tamanho), 0);

  const openDocument = (item?: ArchiveDoc) => {
    setModal('document');
    setEditing(item || null);
    setForm({
      titulo: item?.titulo || '',
      categoria: item?.categoria || 'Académico',
      tipo: item?.tipo || 'PDF',
      descricao: item?.descricao || '',
      dataValidade: item?.dataValidade === '—' ? '' : item?.dataValidade || '',
      responsavel: item?.responsavel || '',
    });
  };

  const saveDocument = (event: React.FormEvent) => {
    event.preventDefault();
    const item: ArchiveDoc = {
      id: editing?.id || `DOC-${String(documents.length + 1).padStart(3, '0')}`,
      titulo: form.titulo,
      categoria: form.categoria,
      tipo: form.tipo,
      dataArquivo: '10 Ago 2026',
      dataValidade: form.dataValidade || '—',
      tamanho: '1.0 MB',
      responsavel: form.responsavel || 'Sara Silva',
      estado: 'Pendente',
      descricao: form.descricao,
    };
    setDocuments(editing ? documents.map((x) => (x.id === item.id ? item : x)) : [item, ...documents]);
    onShowToast(editing ? 'Documento atualizado no arquivo.' : 'Documento arquivado com sucesso.');
    setModal(null);
  };

  const removeDocument = () => {
    if (!confirmDelete) return;
    setDocuments(documents.filter((x) => x.id !== confirmDelete.id));
    setConfirmDelete(null);
    onShowToast('Documento removido do arquivo.');
  };

  const filteredDocs = useMemo(() => documents.filter((d) => {
    const matchSearch = `${d.titulo} ${d.categoria} ${d.responsavel} ${d.descricao}`.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'Todos' || d.categoria === filterCat;
    const matchStatus = filterStatus === 'Todos' || d.estado === filterStatus;
    const matchTipo = filterTipo === 'Todos' || d.tipo === filterTipo;
    const matchValidade = filterValidade === 'Todos' ||
      (filterValidade === 'Sem Validade' && d.dataValidade === '—') ||
      (filterValidade === 'Com Validade' && d.dataValidade !== '—' && d.estado !== 'Expirado') ||
      (filterValidade === 'Expirados' && d.estado === 'Expirado');
    const matchResponsavel = filterResponsavel === 'Todos' || d.responsavel === filterResponsavel;

    return matchSearch && matchCat && matchStatus && matchTipo && matchValidade && matchResponsavel;
  }), [documents, search, filterCat, filterStatus, filterTipo, filterValidade, filterResponsavel]);

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Kpi label="Total Documentos" value={String(documents.length)} tone="text-primary" note={`${archivedCount} arquivados`} icon={<Archive className="w-4 h-4" />} />
        <Kpi label="Pendentes / Em Revisão" value={String(pendingCount)} tone="text-warning" note="Aguarda ação" icon={<Clock className="w-4 h-4" />} />
        <Kpi label="Documentos Expirados" value={String(expiredCount)} tone="text-error" note="Requer renovação" icon={<AlertTriangle className="w-4 h-4" />} />
        <Kpi label="Categorias Ativas" value={String(categories.length)} tone="text-primary" note={`${totalSizeMB.toFixed(1)} MB total`} icon={<Layers className="w-4 h-4" />} />
      </div>

      {/* Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        {tabs.map((item) => (
          <button key={item.key} onClick={() => { setTab(item.key); setSearch(''); setFilterCat('Todos'); setFilterStatus('Todos'); setFilterTipo('Todos'); setFilterValidade('Todos'); setFilterResponsavel('Todos'); }} className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${tab === item.key ? 'bg-primary text-surface-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`}>
            {item.icon}{item.label}
          </button>
        ))}
      </div>

      {/* Tab: Arquivo Documental (Fusão com Consulta) */}
      {tab === 'arquivo' && (
        <Panel>
          <FilterBar
            search={search} setSearch={setSearch}
            filters={[
              { label: 'Categoria', value: filterCat, set: setFilterCat, options: ['Todos', 'Académico', 'Financeiro', 'RH', 'Jurídico', 'Administrativo', 'Comunicação'] },
              { label: 'Estado', value: filterStatus, set: setFilterStatus, options: ['Todos', 'Arquivado', 'Pendente', 'Em Revisão', 'Expirado'] },
              { label: 'Tipo', value: filterTipo, set: setFilterTipo, options: ['Todos', 'PDF', 'DOCX', 'XLSX'] },
              { label: 'Validade', value: filterValidade, set: setFilterValidade, options: ['Todos', 'Sem Validade', 'Com Validade', 'Expirados'] },
              { label: 'Responsável', value: filterResponsavel, set: setFilterResponsavel, options: ['Todos', 'Sara Silva', 'Carlos Mendes', 'Beatriz Ferreira', 'João Pinto', 'Domingos Henriques'] },
            ]}
            actions={
              <>
                <div className="flex items-center bg-surface border border-border-subtle rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('tabela')}
                    className={`p-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'tabela'
                        ? 'bg-surface-white text-primary shadow-xs'
                        : 'text-outline hover:text-on-surface'
                    }`}
                    title="Vista em Tabela"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grelha')}
                    className={`p-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'grelha'
                        ? 'bg-surface-white text-primary shadow-xs'
                        : 'text-outline hover:text-on-surface'
                    }`}
                    title="Vista em Cartões"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => onShowToast('Inventário documental exportado.')} className="bg-surface-white border border-border-subtle hover:bg-surface-container-low text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
                <button onClick={() => openDocument()} className="bg-primary text-surface-white hover:bg-primary/90 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm">
                  <Upload className="w-4 h-4" />
                  Arquivar Documento
                </button>
              </>
            }
          />

          {viewMode === 'tabela' ? (
            <DataTable
              headers={['Documento', 'Categoria', 'Tipo', 'Data Arquivo', 'Validade', 'Responsável', 'Estado', 'Ações']}
              rows={filteredDocs.map((d) => ({
                id: d.id,
                cells: [
                  <div className="flex items-center gap-2"><div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center"><FileText className="w-4 h-4" /></div><div><div className="font-bold text-primary">{d.titulo}</div><div className="text-[10px] text-outline">{d.id} · {d.tamanho}</div></div></div>,
                  <span className={`${categoryColors[d.categoria]} px-2 py-0.5 rounded text-[10px] font-bold`}>{d.categoria}</span>,
                  <span className="text-on-surface-variant font-medium">{d.tipo}</span>,
                  d.dataArquivo,
                  d.dataValidade,
                  <span className="text-on-surface-variant">{d.responsavel}</span>,
                  <span className={`${statusChip(d.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{d.estado}</span>,
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setViewDoc(d)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer" title="Consultar"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openDocument(d)} className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer" title="Editar"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => onShowToast(`Documento "${d.titulo}" descarregado.`)} className="p-1.5 text-outline hover:text-success rounded hover:bg-success/10 transition-colors cursor-pointer" title="Download"><Download className="w-4 h-4" /></button>
                    <button onClick={() => setConfirmDelete(d)} className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer" title="Remover"><Trash2 className="w-4 h-4" /></button>
                  </div>,
                ],
              }))}
              emptyMessage="Nenhum documento encontrado."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {filteredDocs.map((d) => (
                <div key={d.id} className="border border-border-subtle rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-surface-white" onClick={() => setViewDoc(d)}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded bg-primary/10 text-primary flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                      <div>
                        <h3 className="text-sm font-bold text-primary line-clamp-1">{d.titulo}</h3>
                        <span className="text-[10px] text-outline">{d.id} · {d.tipo} · {d.tamanho}</span>
                      </div>
                    </div>
                    <span className={`${statusChip(d.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{d.estado}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2">{d.descricao}</p>
                  <div className="border-t border-border-subtle mt-3 pt-2 flex items-center justify-between text-[10px]">
                    <span className={`${categoryColors[d.categoria]} px-2 py-0.5 rounded font-bold`}>{d.categoria}</span>
                    <span className="text-outline">Arquivado: {d.dataArquivo}</span>
                  </div>
                </div>
              ))}
              {filteredDocs.length === 0 && <div className="col-span-2 text-center py-8 text-on-surface-variant font-medium text-xs">Nenhum documento encontrado.</div>}
            </div>
          )}
        </Panel>
      )}

      {/* Tab: Histórico */}
      {tab === 'historico' && (
        <Panel>
          <SectionTitle title="Histórico de Atividades" subtitle="Registo de todas as ações sobre documentos arquivados." />
          <DataTable
            headers={['Documento', 'Ação', 'Utilizador', 'Data', 'Hora']}
            rows={history.map((h) => ({
              id: h.id,
              cells: [
                <div className="flex items-center gap-2"><History className="w-4 h-4 text-outline" /><span className="font-bold text-primary">{h.documento}</span></div>,
                <span className={`${actionChip(h.acao)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{h.acao}</span>,
                <div className="flex items-center gap-1.5"><div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold">{h.utilizador.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div><span className="text-on-surface-variant">{h.utilizador}</span></div>,
                h.data,
                <span className="text-outline font-medium">{h.hora}</span>,
              ],
            }))}
            emptyMessage="Nenhuma atividade registada."
          />
        </Panel>
      )}

      {/* Document Modal */}
      {modal === 'document' && (
        <Modal title={editing ? 'Editar Documento' : 'Arquivar Novo Documento'} onClose={() => setModal(null)}>
          <form onSubmit={saveDocument} className="space-y-3 text-xs">
            <Field label="Título do Documento" value={form.titulo} onChange={(v) => setForm({ ...form, titulo: v })} required />
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-outline font-bold">Categoria<select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value as DocCategory })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none bg-surface-white"><option>Académico</option><option>Financeiro</option><option>RH</option><option>Jurídico</option><option>Administrativo</option><option>Comunicação</option></select></label>
              <label className="block text-outline font-bold">Tipo de Ficheiro<select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none bg-surface-white"><option>PDF</option><option>DOCX</option><option>XLSX</option><option>JPG</option><option>PNG</option></select></label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Responsável" value={form.responsavel} onChange={(v) => setForm({ ...form, responsavel: v })} placeholder="Nome do responsável" />
              <Field label="Data de Validade (opcional)" type="text" value={form.dataValidade} onChange={(v) => setForm({ ...form, dataValidade: v })} placeholder="ex: 31 Dez 2027" />
            </div>
            <label className="block text-outline font-bold">Descrição<textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none resize-none" placeholder="Breve descrição do conteúdo do documento..." /></label>
            <div className="border-t border-border-subtle pt-3">
              <div className="flex items-center gap-2 text-[10px] text-outline font-bold uppercase tracking-wider mb-2"><Upload className="w-3.5 h-3.5" />Anexar Ficheiro</div>
              <div className="border-2 border-dashed border-border-subtle rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer" onClick={() => onShowToast('Seletor de ficheiro aberto.')}>
                <Upload className="w-5 h-5 text-outline mx-auto mb-1" />
                <p className="text-[10px] text-on-surface-variant">Clique para selecionar ou arraste o ficheiro aqui</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
              <button type="button" onClick={() => setModal(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-2 rounded-lg font-bold cursor-pointer transition-all shadow-sm">Arquivar</button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Document Modal */}
      {viewDoc && (
        <Modal title="Consulta de Documento" onClose={() => setViewDoc(null)}>
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-primary/10 text-primary flex items-center justify-center"><FileText className="w-6 h-6" /></div>
              <div>
                <h3 className="text-sm font-bold text-primary">{viewDoc.titulo}</h3>
                <span className="text-[10px] text-outline">{viewDoc.id} · {viewDoc.tipo} · {viewDoc.tamanho}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InfoField label="Categoria" value={viewDoc.categoria} />
              <InfoField label="Estado" value={viewDoc.estado} />
              <InfoField label="Data de Arquivo" value={viewDoc.dataArquivo} />
              <InfoField label="Data de Validade" value={viewDoc.dataValidade} />
              <InfoField label="Responsável" value={viewDoc.responsavel} />
              <InfoField label="Tipo de Ficheiro" value={viewDoc.tipo} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-1">Descrição</span>
              <p className="text-on-surface-variant bg-surface-container-low/40 border border-border-subtle rounded-lg p-3">{viewDoc.descricao}</p>
            </div>
            <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
              <button onClick={() => setViewDoc(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Fechar</button>
              <button onClick={() => { setViewDoc(null); openDocument(viewDoc); }} className="border border-border-subtle px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-surface-container transition-all flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5" />Editar</button>
              <button onClick={() => onShowToast(`Documento "${viewDoc.titulo}" descarregado.`)} className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-2 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"><Download className="w-3.5 h-3.5" />Download</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <Modal title="Confirmar Remoção" onClose={() => setConfirmDelete(null)}>
          <div className="space-y-4 text-xs">
            <p className="text-on-surface-variant flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Esta ação não pode ser desfeita. Deseja remover o documento <strong className="text-primary">{confirmDelete.titulo}</strong> do arquivo?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={removeDocument} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Remover</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* Shared components */
const Kpi = ({ label, value, tone, note, icon }: { label: string; value: string; tone: string; note: string; icon: React.ReactNode }) => (
  <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
    <div className="flex flex-col justify-center">
      <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">{label}</span>
      <span className={`text-2xl font-bold leading-none ${tone}`}>{value}</span>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">{icon}{note}</span>
    </div>
  </div>
);

const Panel = ({ children }: { children: React.ReactNode }) => <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">{children}</div>;

const SectionTitle = ({ title, subtitle, inline = false }: { title: string; subtitle: string; inline?: boolean }) => (
  <div className={inline ? '' : 'mb-4'}>
    <h2 className="text-lg font-bold text-primary">{title}</h2>
    <p className="text-xs text-on-surface-variant">{subtitle}</p>
  </div>
);

const Field = ({ label, value, onChange, type = 'text', required = false, placeholder = '' }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) => (
  <label className="block text-outline font-bold">{label}<input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none" /></label>
);

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-0.5">{label}</span>
    <span className="text-on-surface font-medium">{value}</span>
  </div>
);

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-lg p-6 my-8">
      <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2"><Archive className="w-5 h-5 text-primary" />{title}</h2>
        <button onClick={onClose} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
      </div>
      {children}
    </div>
  </div>
);

const FilterBar = ({ search, setSearch, filters, actions }: { search: string; setSearch: (x: string) => void; filters: { label?: string; value: string; set: (x: string) => void; options: string[] }[]; actions?: React.ReactNode }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f, i) => (
        <div key={i} className="flex items-center gap-1.5 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium text-xs">
          {f.label && <span className="font-bold text-primary">{f.label}:</span>}
          <select
            value={f.value}
            onChange={(e) => f.set(e.target.value)}
            className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
          >
            {f.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium" />
      </div>
      {actions}
    </div>
  </div>
);

const DataTable = ({ headers, rows, emptyMessage }: { headers: string[]; rows: { id: string; cells: React.ReactNode[] }[]; emptyMessage: string }) => (
  <div className="overflow-x-auto border border-border-subtle rounded-lg">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary">
          {headers.map((h, i) => <th key={i} className={`px-3.5 py-3 ${h === 'Ações' ? 'text-right' : h === 'Estado' || h === 'Ação' ? 'text-center' : ''}`}>{h}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-border-subtle text-xs">
        {rows.length ? rows.map((row) => (
          <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors">
            {row.cells.map((cell, i) => <td key={i} className={`px-3.5 py-3 ${headers[i] === 'Ações' ? 'text-right' : headers[i] === 'Estado' || headers[i] === 'Ação' ? 'text-center' : ''}`}>{cell}</td>)}
          </tr>
        )) : (
          <tr><td colSpan={headers.length} className="text-center py-8 text-on-surface-variant font-medium">{emptyMessage}</td></tr>
        )}
      </tbody>
    </table>
  </div>
);
