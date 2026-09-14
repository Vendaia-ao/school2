import React, { useState, useMemo } from 'react';
import { CreditCard, Award, GraduationCap, FileText, RefreshCw, UserX, AlertTriangle, CheckCircle2, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { Student, StudentFilters } from '../types';

interface StudentsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onToggleStatus: (studentId: string) => void;
  onOpenBatchAction: (actionType: 'card' | 'declaration' | 'status' | 'notify') => void;
  onShowToast: (message: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSelectStudent,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteStudent,
  onToggleStatus,
  onOpenBatchAction,
  onShowToast,
}) => {
  // Filter state
  const [filters, setFilters] = useState<StudentFilters>({
    anoLetivo: '2023/2024',
    dataInicio: '',
    dataFim: '',
    classe: 'Todas',
    curso: 'Todos',
    estado: 'Todos',
    financeiro: 'Todos',
    docPendente: '',
    searchQuery: '',
    rowsPerPage: 10,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modals for Academics expansion
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewTargetStudent, setRenewTargetStudent] = useState<Student | null>(null);
  const [offboardingStudent, setOffboardingStudent] = useState<Student | null>(null);
  const [cardModalStudent, setCardModalStudent] = useState<Student | null>(null);

  // Form states for Renew modal
  const [renewTargetYear, setRenewTargetYear] = useState('24/25');
  const [renewPromotionRule, setRenewPromotionRule] = useState('auto');
  const [renewCheckFinancial, setRenewCheckFinancial] = useState(true);

  // Form states for Offboarding modal
  const [offboardingNewStatus, setOffboardingNewStatus] = useState<'Suspenso' | 'Cancelado'>('Suspenso');
  const [offboardingReason, setOffboardingReason] = useState('Transferência de Escola');
  const [offboardingDate, setOffboardingDate] = useState(new Date().toISOString().split('T')[0]);
  const [offboardingNotes, setOffboardingNotes] = useState('');

  // Form states for 2nd Card modal
  const [cardReason, setCardReason] = useState('Perda / Extravio');

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = s.nomeCompleto.toLowerCase().includes(q);
        const matchMatricula = s.matricula.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
        const matchContact = s.contactoEstudante.includes(q) || s.encarregadoTelefone.includes(q);
        if (!matchName && !matchMatricula && !matchContact) return false;
      }

      // Classe
      if (filters.classe !== 'Todas' && s.classe !== filters.classe) return false;

      // Curso
      if (filters.curso !== 'Todos' && s.curso !== filters.curso) return false;

      // Estado
      if (filters.estado !== 'Todos' && s.estadoMatricula !== filters.estado) return false;

      // Financeiro
      if (filters.financeiro !== 'Todos' && s.situacaoFinanceira !== filters.financeiro) return false;

      // Doc Pendente
      if (filters.docPendente) {
        if (filters.docPendente === 'ok' && s.documentacaoPendente !== 'ok') return false;
        if (filters.docPendente === 'bi' && s.documentacaoPendente !== 'bi') return false;
        if (filters.docPendente === 'cert' && s.documentacaoPendente !== 'cert') return false;
        if (filters.docPendente === 'foto' && s.documentacaoPendente !== 'foto') return false;
      }

      return true;
    });
  }, [students, filters]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / filters.rowsPerPage));
  const currentStudents = useMemo(() => {
    const start = (currentPage - 1) * filters.rowsPerPage;
    return filteredStudents.slice(start, start + filters.rowsPerPage);
  }, [filteredStudents, currentPage, filters.rowsPerPage]);

  // Row selection
  const isAllSelected = currentStudents.length > 0 && currentStudents.every((s) => selectedIds.includes(s.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentStudents.map((s) => s.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`Contacto copiado: ${text}`);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Nº Matrícula,Nome Completo,Classe,Turma,Curso,Encarregado,Contacto,Estado,Financeiro']
        .concat(
          filteredStudents.map(
            (s) =>
              `${s.matricula},"${s.nomeCompleto}",${s.classe},${s.turma},"${s.curso}","${s.encarregadoNome}",${s.contactoEstudante},${s.estadoMatricula},${s.situacaoFinanceira}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `estudantes_vendaia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Lista de estudantes exportada com sucesso (CSV)');
  };

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* Top Summary Panel (KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Card 1: Total Students */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Total Estudantes
            </span>
            <span className="text-2xl font-bold text-primary leading-none">1.432</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> +12
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">Este mês</span>
          </div>
        </div>

        {/* Card 2: Status da Matrícula */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Matrícula</span>
              <div className="flex items-center gap-2">
                <span className="text-success font-bold text-[12px]">
                  96% <span className="text-[10px] font-medium text-outline ml-0.5">Ativos</span>
                </span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-success h-full rounded-full" style={{ width: '96%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>1.375 Ativos</span>
              <span className="text-error/70">57 Inativos</span>
            </div>
          </div>
        </div>

        {/* Card 3: Situação Financeira */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Financeiro</span>
              <div className="flex items-center gap-2">
                <span className="text-info font-bold text-[12px]">
                  88% <span className="text-[10px] font-medium text-outline ml-0.5">Regular</span>
                </span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-info h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>1.260 Regular</span>
              <span className="text-amber-600/80">172 Pendente</span>
            </div>
          </div>
        </div>

        {/* Card 4: Emissões Pendentes */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-2.5 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Emissões Pendentes
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-error leading-none">42</span>
              <span className="text-[10px] text-outline font-medium">por emitir</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={() => onShowToast('Notificações de emissão pendente enviadas para todos os alunos.')}
              className="px-2 py-0.5 rounded bg-error/10 text-error hover:bg-error/20 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3 h-3" /> Emitir Tudo
            </button>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant">
              <span title="Cartões de Estudante" className="flex items-center gap-0.5 text-error font-bold">
                <CreditCard className="w-3 h-3" /> 14
              </span>
              <span className="text-outline/40">·</span>
              <span title="Certificados" className="flex items-center gap-0.5 text-amber-600 font-bold">
                <Award className="w-3 h-3" /> 5
              </span>
              <span className="text-outline/40">·</span>
              <span title="Declarações" className="flex items-center gap-0.5 text-info font-bold">
                <GraduationCap className="w-3 h-3" /> 8
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-surface-white border border-outline-variant/30 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-sm p-3">
        <div className="flex flex-col w-full gap-1.5">
          {/* Dropdowns Row - Perfect Single Line Fit (Zero Scrollbar) */}
          <div className="flex items-center gap-1 w-full">
            <select
              value={filters.anoLetivo}
              onChange={(e) => setFilters({ ...filters, anoLetivo: e.target.value })}
              className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer font-medium"
            >
              <option value="2023/2024">Ano: 2023/2024</option>
              <option value="2022/2023">Ano: 2022/2023</option>
              <option value="2021/2022">Ano: 2021/2022</option>
            </select>

            <input
              type="date"
              value={filters.dataInicio}
              onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
              className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 cursor-pointer"
            />
            <input
              type="date"
              value={filters.dataFim}
              onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
              className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 cursor-pointer"
            />

            <select
              value={filters.classe}
              onChange={(e) => setFilters({ ...filters, classe: e.target.value })}
              className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
            >
              <option value="Todas">Classe: Todas</option>
              <option value="10º Ano">10º Ano</option>
              <option value="11º Ano">11º Ano</option>
              <option value="12º Ano">12º Ano</option>
            </select>

            <select
              value={filters.curso}
              onChange={(e) => setFilters({ ...filters, curso: e.target.value })}
              className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
            >
              <option value="Todos">Curso: Todos</option>
              <option value="Ciências Físicas">Ciências Físicas</option>
              <option value="Ciências e Tecnologias">Ciências e Tecnologias</option>
              <option value="Economia">Economia</option>
              <option value="Artes Visuais">Artes Visuais</option>
              <option value="Engenharia Informática">Engenharia Informática</option>
            </select>

            <select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>

            <select
              value={filters.financeiro}
              onChange={(e) => setFilters({ ...filters, financeiro: e.target.value })}
              className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
            >
              <option value="Todos">Financeiro: Todos</option>
              <option value="Regularizada">Regularizada</option>
              <option value="Pendente">Pendente</option>
              <option value="Dívida">Dívida</option>
            </select>

            <select
              value={filters.docPendente}
              onChange={(e) => setFilters({ ...filters, docPendente: e.target.value })}
              className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
            >
              <option value="">Doc. Pendente</option>
              <option value="bi">BI/Passaporte</option>
              <option value="cert">Cert. Habilitações</option>
              <option value="foto">Fotografia</option>
              <option value="ok">Tudo OK</option>
            </select>
          </div>

          {/* Search Input & Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 flex items-center bg-surface border border-border-subtle rounded-md px-2 h-7 focus-within:border-secondary transition-colors">
              <span className="material-symbols-outlined text-[16px] text-outline mr-1.5">search</span>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="Pesquisar Nome, Nº de Matrícula ou Contacto..."
                className="w-full bg-transparent border-none p-0 text-xs focus:ring-0 outline-none placeholder-outline"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onOpenAddModal}
                className="bg-primary text-surface-white px-2.5 h-7 rounded hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-1 font-semibold text-xs cursor-pointer"
                title="Nova Inscrição"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span className="whitespace-nowrap">Nova Inscrição</span>
              </button>

              <div className="flex items-center border border-border-subtle rounded overflow-hidden">
                <button
                  onClick={() => onShowToast('Função de Importação iniciada.')}
                  className="bg-surface text-on-surface-variant px-2.5 h-7 hover:bg-surface-container transition-colors flex items-center justify-center gap-1 font-medium text-xs border-r border-border-subtle"
                  title="Importar"
                >
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  <span className="whitespace-nowrap">Importar</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="bg-surface text-on-surface-variant w-7 h-7 hover:bg-surface-container transition-colors flex items-center justify-center border-r border-border-subtle"
                  title="Exportar"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-surface text-on-surface-variant w-7 h-7 hover:bg-surface-container transition-colors flex items-center justify-center border-r border-border-subtle"
                  title="Imprimir"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                </button>
                <button
                  onClick={() => {
                    setFilters({
                      anoLetivo: '2023/2024',
                      dataInicio: '',
                      dataFim: '',
                      classe: 'Todas',
                      curso: 'Todos',
                      estado: 'Todos',
                      financeiro: 'Todos',
                      docPendente: '',
                      searchQuery: '',
                      rowsPerPage: 10,
                    });
                    onShowToast('Filtros e dados atualizados com sucesso.');
                  }}
                  className="bg-surface text-on-surface-variant w-7 h-7 hover:bg-surface-container transition-colors flex items-center justify-center"
                  title="Atualizar"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
              </div>

              <div className="w-px h-5 bg-border-subtle mx-0.5"></div>

              <div className="flex items-center gap-1.5">
                <select
                  value={filters.rowsPerPage}
                  onChange={(e) => {
                    setFilters({ ...filters, rowsPerPage: Number(e.target.value) });
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-surface border border-border-subtle rounded-md pl-1.5 pr-6 text-xs focus:outline-none focus:border-secondary h-7 py-0.5"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Batch Actions Banner (Estilo Fiel à Imagem de Referência) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#FAF0E8] border border-[#E8D7C8] rounded-t-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b-0 animate-in fade-in duration-200">
          <span className="text-xs font-bold text-[#4A382C] flex items-center gap-1.5">
            Acções em Lote Disponíveis:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setRenewTargetStudent(null);
                setShowRenewModal(true);
              }}
              className="bg-surface-white border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-on-surface-variant" /> Renovar Matrícula ({selectedIds.length})
            </button>
            <button
              onClick={() => onOpenBatchAction('card')}
              className="bg-surface-white border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">badge</span> Emitir Cartão ({selectedIds.length})
            </button>
            <button
              onClick={() => onOpenBatchAction('declaration')}
              className="bg-surface-white border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">description</span> Declaração ({selectedIds.length})
            </button>
            <button
              onClick={() => onOpenBatchAction('status')}
              className="bg-[#047857] hover:bg-[#0369a1] text-surface-white rounded-md px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">published_with_changes</span> Alterar Estado ({selectedIds.length})
            </button>
            <button
              onClick={() => onOpenBatchAction('notify')}
              className="bg-[#B45309] hover:bg-[#92400E] text-surface-white rounded-md px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">notification_important</span> Notificar ({selectedIds.length})
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="bg-surface-white border border-outline-variant/30 text-outline hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-medium shadow-2xs cursor-pointer transition-colors"
            >
              Desmarcar
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className={`bg-surface-white border border-border-subtle ${selectedIds.length > 0 ? 'rounded-b-xl border-t-0' : 'rounded-xl'} overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface border-b border-border-subtle">
                <th className="px-4 py-1.5 bg-surface-container-low w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer"
                  />
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Nº de Matrícula
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Nome Completo
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Classe
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Turma
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Curso
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Encarregado
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Contacto
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Estado
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Financeiro
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase text-center w-16 py-1.5 bg-surface-container-low">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-on-surface-variant font-medium">
                    Nenhum estudante encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => {
                  const isSelected = selectedIds.includes(student.id);
                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-surface-container transition-colors group ${
                        isSelected ? 'bg-secondary/5' : 'even:bg-surface-container-low/50'
                      }`}
                    >
                      <td className="px-4 py-1.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(student.id)}
                          className="rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer"
                        />
                      </td>
                      <td className="px-4 font-medium text-on-surface-variant py-1.5 font-label-md">
                        {student.matricula}
                      </td>
                      <td className="px-4 font-medium text-on-surface py-1.5 font-label-md">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="hover:text-secondary text-left font-semibold hover:underline"
                        >
                          {student.nomeCompleto}
                        </button>
                      </td>
                      <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{student.classe}</td>
                      <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{student.turma}</td>
                      <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{student.curso}</td>
                      <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{student.encarregadoNome}</td>
                      <td className="px-4 text-on-surface-variant py-1.5 font-label-md">
                        <span
                          className="has-tooltip cursor-pointer hover:text-primary"
                          onClick={() => copyToClipboard(student.contactoEstudante)}
                        >
                          {student.contactoEstudante}
                          <span className="tooltip">Clique p/ copiar</span>
                        </span>
                      </td>
                      <td className="px-4 py-1.5 font-label-md">
                        {student.estadoMatricula === 'Ativo' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-green-800 bg-green-100 text-[11px] font-semibold tracking-tight">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-red-800 bg-red-100 text-[11px] font-semibold tracking-tight">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-1.5 font-label-md">
                        {student.situacaoFinanceira === 'Regularizada' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-green-800 bg-green-100 text-[11px] font-semibold tracking-tight">
                            Regularizada
                          </span>
                        ) : student.situacaoFinanceira === 'Pendente' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-amber-800 bg-amber-100 text-xs font-medium">
                            Pendente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-red-800 bg-red-100 text-[11px] font-semibold tracking-tight">
                            Dívida
                          </span>
                        )}
                      </td>
                      <td className="px-4 text-center py-1.5 font-label-md relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === student.id ? null : student.id)}
                          className="text-outline hover:text-primary transition-colors p-1 rounded hover:bg-surface-variant/50"
                          title="Opções"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>

                        {activeMenuId === student.id && (
                          <div className="absolute right-2 top-10 w-44 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onSelectStudent(student);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span> Ver Perfil
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onOpenEditModal(student);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span> Editar Dados
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setRenewTargetStudent(student);
                                setShowRenewModal(true);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 text-primary font-medium"
                            >
                              <RefreshCw className="w-4 h-4 text-primary" /> Renovar Matrícula
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setCardModalStudent(student);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2"
                            >
                              <CreditCard className="w-4 h-4 text-secondary" /> Solicitar 2ª Via Cartão
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setOffboardingStudent(student);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-amber-50 text-amber-800 rounded flex items-center gap-2 font-medium"
                            >
                              <UserX className="w-4 h-4 text-amber-600" /> Offboarding / Estado
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onDeleteStudent(student.id);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-error/10 text-error rounded flex items-center gap-2 font-medium"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span> Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-2 border-t border-border-subtle flex items-center justify-between bg-surface-white text-xs">
          <p className="text-on-surface-variant">
            Mostrando {filteredStudents.length === 0 ? 0 : (currentPage - 1) * filters.rowsPerPage + 1}–
            {Math.min(currentPage * filters.rowsPerPage, filteredStudents.length)} de {filteredStudents.length} estudantes
          </p>
          <div className="flex gap-1 items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-2 py-1 border border-border-subtle rounded text-outline hover:bg-surface-container-low disabled:opacity-50 cursor-pointer"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 border rounded font-medium cursor-pointer ${
                  currentPage === page
                    ? 'border-primary text-surface-white bg-primary'
                    : 'border-border-subtle text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-2 py-1 border border-border-subtle rounded text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 cursor-pointer"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>


      {/* MODAL 1: Central de Renovação & Reconfirmação de Matrícula */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white border border-border-subtle rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-primary text-surface-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-surface-white/10 rounded-xl">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Central de Renovação de Matrícula</h3>
                  <p className="text-[11px] text-surface-white/80">Transição de Ano Letivo e Promoção Académica</p>
                </div>
              </div>
              <button onClick={() => setShowRenewModal(false)} className="hover:bg-surface-white/20 p-1.5 rounded-lg transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3 text-primary">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-[11px] font-medium leading-relaxed">
                  {renewTargetStudent 
                    ? `A renovar matrícula de ${renewTargetStudent.nomeCompleto} (${renewTargetStudent.matricula})` 
                    : selectedIds.length > 0 
                      ? `Renovação em massa para ${selectedIds.length} estudantes selecionados.`
                      : `Renovação global para todos os alunos elegíveis com aproveitamento positivo.`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface-variant text-[11px]">Ano Letivo Destino</label>
                  <select 
                    value={renewTargetYear} 
                    onChange={(e) => setRenewTargetYear(e.target.value)}
                    className="p-2 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-primary"
                  >
                    <option value="24/25">Ano Letivo 2024 / 2025</option>
                    <option value="25/26">Ano Letivo 2025 / 2026</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface-variant text-[11px]">Regra de Promoção</label>
                  <select 
                    value={renewPromotionRule} 
                    onChange={(e) => setRenewPromotionRule(e.target.value)}
                    className="p-2 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-primary"
                  >
                    <option value="auto">Promover (+1 Classe)</option>
                    <option value="keep">Manter Mesma Classe (Repetição)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 p-3 bg-surface-container-low border border-border-subtle rounded-xl">
                <span className="font-bold text-[11px] text-on-surface-variant uppercase">Verificações de Segurança & Validação</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={renewCheckFinancial} 
                    onChange={(e) => setRenewCheckFinancial(e.target.checked)}
                    className="rounded border-border-subtle text-primary focus:ring-primary"
                  />
                  <span>Bloquear renovação se existirem propinas ou dívidas pendentes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-border-subtle text-primary focus:ring-primary" />
                  <span>Gerar automaticamente novo Contrato Pedagógico 2024/2025</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-border-subtle text-primary focus:ring-primary" />
                  <span>Atualizar validade do Cartão Digital do Estudante</span>
                </label>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-surface-container-low border-t border-border-subtle flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRenewModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border-subtle hover:bg-surface-container transition-colors font-medium text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowRenewModal(false);
                  onShowToast(
                    renewTargetStudent
                      ? `Matrícula de ${renewTargetStudent.nomeCompleto} renovada com sucesso para o Ano Letivo ${renewTargetYear}.`
                      : `Processo de renovação concluído com sucesso para ${selectedIds.length || filteredStudents.length} estudantes.`
                  );
                }}
                className="px-4 py-1.5 rounded-lg bg-primary text-surface-white hover:bg-primary/90 transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirmar Renovação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Offboarding (Suspensão e Cancelamento de Matrícula) */}
      {offboardingStudent && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white border border-border-subtle rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-amber-600 text-surface-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-surface-white/10 rounded-xl">
                  <UserX className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Offboarding & Alteração de Estado</h3>
                  <p className="text-[11px] text-surface-white/80">{offboardingStudent.nomeCompleto} ({offboardingStudent.matricula})</p>
                </div>
              </div>
              <button onClick={() => setOffboardingStudent(null)} className="hover:bg-surface-white/20 p-1.5 rounded-lg transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface-variant text-[11px]">Novo Estado Académico</label>
                  <select
                    value={offboardingNewStatus}
                    onChange={(e) => setOffboardingNewStatus(e.target.value as any)}
                    className="p-2 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-amber-600"
                  >
                    <option value="Suspenso">Suspenso (Temporário)</option>
                    <option value="Cancelado">Cancelado / Desistente (Definitivo)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface-variant text-[11px]">Data Efetiva</label>
                  <input
                    type="date"
                    value={offboardingDate}
                    onChange={(e) => setOffboardingDate(e.target.value)}
                    className="p-2 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface-variant text-[11px]">Motivo Oficial</label>
                <select
                  value={offboardingReason}
                  onChange={(e) => setOffboardingReason(e.target.value)}
                  className="p-2 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-amber-600"
                >
                  <option value="Transferência de Escola">Transferência de Instituição</option>
                  <option value="Desistência Voluntária">Desistência Voluntária</option>
                  <option value="Inadimplência Financeira">Inadimplência / Questões Financeiras</option>
                  <option value="Medida Disciplinar">Medida Disciplinar Pedagógica</option>
                  <option value="Mudança de Residência">Mudança de Residência / País</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface-variant text-[11px]">Parecer / Observações Administrativas</label>
                <textarea
                  rows={3}
                  value={offboardingNotes}
                  onChange={(e) => setOffboardingNotes(e.target.value)}
                  placeholder="Introduza notas sobre a devolução de manuais, guia de transferência ou observações..."
                  className="p-2.5 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-amber-600 resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-amber-900">
                <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
                <div className="text-[11px]">
                  <p className="font-bold">Ação com impacto no histórico e acessos</p>
                  <p className="text-amber-800">Será emitida a Guia de Transferência e desativadas as credenciais de portal do aluno e encarregado.</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-surface-container-low border-t border-border-subtle flex items-center justify-end gap-2">
              <button
                onClick={() => setOffboardingStudent(null)}
                className="px-3.5 py-1.5 rounded-lg border border-border-subtle hover:bg-surface-container transition-colors font-medium text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onToggleStatus(offboardingStudent.id);
                  setOffboardingStudent(null);
                  onShowToast(`Offboarding concluído. Estado de ${offboardingStudent.nomeCompleto} alterado para ${offboardingNewStatus}.`);
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-600 text-surface-white hover:bg-amber-700 transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <UserX className="w-4 h-4" /> Confirmar Offboarding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Quiosque de Segunda Via do Cartão de Estudante */}
      {cardModalStudent && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white border border-border-subtle rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-secondary text-surface-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-surface-white/10 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Solicitar 2ª Via do Cartão</h3>
                  <p className="text-[11px] text-surface-white/80">{cardModalStudent.nomeCompleto}</p>
                </div>
              </div>
              <button onClick={() => setCardModalStudent(null)} className="hover:bg-surface-white/20 p-1.5 rounded-lg transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface-variant text-[11px]">Motivo da Emissão</label>
                <select
                  value={cardReason}
                  onChange={(e) => setCardReason(e.target.value)}
                  className="p-2 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-secondary"
                >
                  <option value="Perda / Extravio">Perda / Extravio do Cartão Original</option>
                  <option value="Danificação Física">Danificação Física ou Desgaste</option>
                  <option value="Atualização de Foto">Atualização de Foto / Dados Pessoais</option>
                  <option value="Roubo / Furto">Roubo / Furto (Com Participação)</option>
                </select>
              </div>

              <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center justify-between text-secondary">
                <div>
                  <p className="font-bold text-xs">Taxa de Emolumento (2ª Via)</p>
                  <p className="text-[11px] text-secondary/80">Lançamento automático na Tesouraria</p>
                </div>
                <span className="text-base font-bold">2.500 Kz</span>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-surface-container-low border-t border-border-subtle flex items-center justify-end gap-2">
              <button
                onClick={() => setCardModalStudent(null)}
                className="px-3.5 py-1.5 rounded-lg border border-border-subtle hover:bg-surface-container transition-colors font-medium text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setCardModalStudent(null);
                  onShowToast(`2ª Via do Cartão gerada para ${cardModalStudent.nomeCompleto}. Emolumento de 2.500 Kz debitado na Tesouraria.`);
                }}
                className="px-4 py-1.5 rounded-lg bg-secondary text-surface-white hover:bg-opacity-90 transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CreditCard className="w-4 h-4" /> Emitir & Faturar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
