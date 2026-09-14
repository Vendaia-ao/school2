import React, { useState } from 'react';
import { ActiveView } from '../types';
import { UserCheck, UserPlus, Clock, CheckCircle2, Star, Award, BookOpen, TrendingUp } from 'lucide-react';

interface ProfessoresViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

interface Professor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  disciplinas: string[];
  turmasAtribuidas: string[];
  cargaHorariaSemanal: number; // e.g. 24h
  assiduidadePerc: number; // e.g. 98%
  desempenhoNota: number; // e.g. 4.8 / 5.0
  estado: 'Ativo' | 'Licença' | 'Inativo';
}

export const ProfessoresView: React.FC<ProfessoresViewProps> = ({ onSelectView, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'lista' | 'atribuicao' | 'horarios' | 'assiduidade' | 'desempenho'>('lista');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnoLetivo, setFilterAnoLetivo] = useState('2026/2027');
  const [filterDisciplina, setFilterDisciplina] = useState('todas');
  const [filterRegime, setFilterRegime] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProfIds, setSelectedProfIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<Professor | null>(null);
  const [deletingProf, setDeletingProf] = useState<Professor | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form fields
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formDisciplinas, setFormDisciplinas] = useState('');
  const [formTurmas, setFormTurmas] = useState('10A-CIEN, 11A-INF');
  const [formCarga, setFormCarga] = useState(24);

  const openCreateModal = () => {
    setEditingProf(null);
    setFormNome('');
    setFormEmail('');
    setFormTelefone('');
    setFormDisciplinas('');
    setFormTurmas('10A-CIEN, 11A-INF');
    setFormCarga(24);
    setIsModalOpen(true);
  };

  const openEditModal = (prof: Professor) => {
    setEditingProf(prof);
    setFormNome(prof.nome);
    setFormEmail(prof.email);
    setFormTelefone(prof.telefone);
    setFormDisciplinas(prof.disciplinas.join(', '));
    setFormTurmas(prof.turmasAtribuidas.join(', '));
    setFormCarga(prof.cargaHorariaSemanal);
    setIsModalOpen(true);
  };

  const handleSaveProfessor = (e: React.FormEvent) => {
    e.preventDefault();
    const discArr = formDisciplinas.split(',').map((d) => d.trim()).filter(Boolean);
    const turmArr = formTurmas.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingProf) {
      setProfessores(
        professores.map((p) =>
          p.id === editingProf.id
            ? {
                ...p,
                nome: formNome,
                email: formEmail,
                telefone: formTelefone,
                disciplinas: discArr.length > 0 ? discArr : p.disciplinas,
                turmasAtribuidas: turmArr.length > 0 ? turmArr : p.turmasAtribuidas,
                cargaHorariaSemanal: Number(formCarga),
              }
            : p
        )
      );
      onShowToast(`Docente ${formNome} atualizado com sucesso!`);
    } else {
      const newProf: Professor = {
        id: `prof-${Date.now()}`,
        nome: formNome,
        email: formEmail,
        telefone: formTelefone,
        disciplinas: discArr.length > 0 ? discArr : ['Geral'],
        turmasAtribuidas: turmArr.length > 0 ? turmArr : ['10A-CIEN'],
        cargaHorariaSemanal: Number(formCarga),
        assiduidadePerc: 100.0,
        desempenhoNota: 5.0,
        estado: 'Ativo',
      };
      setProfessores([...professores, newProf]);
      onShowToast(`Docente ${formNome} cadastrado com sucesso!`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProfConfirm = () => {
    if (!deletingProf) return;
    setProfessores(professores.filter((p) => p.id !== deletingProf.id));
    onShowToast(`Docente ${deletingProf.nome} removido do sistema.`);
    setDeletingProf(null);
  };

  const [professores, setProfessores] = useState<Professor[]>([
    {
      id: 'prof-01',
      nome: 'Domingos Henriques',
      email: 'Domingoshenriques1@ispozango.com',
      telefone: '+244 923 456 789',
      disciplinas: ['Matemática I', 'Matemática II'],
      turmasAtribuidas: ['10A-CIEN', '11A-INF', '12A-GEST'],
      cargaHorariaSemanal: 26,
      assiduidadePerc: 99.2,
      desempenhoNota: 4.9,
      estado: 'Ativo',
    },
    {
      id: 'prof-02',
      nome: 'Dra. Maria Eunice',
      email: 'eunice.maria@vendaia.edu.pt',
      telefone: '+244 912 345 678',
      disciplinas: ['Química', 'Biologia'],
      turmasAtribuidas: ['10A-CIEN', '10B-HUM'],
      cargaHorariaSemanal: 22,
      assiduidadePerc: 97.5,
      desempenhoNota: 4.8,
      estado: 'Ativo',
    },
    {
      id: 'prof-03',
      nome: 'Prof. António Costa',
      email: 'antonio.costa@vendaia.edu.pt',
      telefone: '+244 934 567 890',
      disciplinas: ['Física', 'Informática Aplicada'],
      turmasAtribuidas: ['10A-CIEN', '11A-INF'],
      cargaHorariaSemanal: 20,
      assiduidadePerc: 95.0,
      desempenhoNota: 4.6,
      estado: 'Ativo',
    },
    {
      id: 'prof-04',
      nome: 'Prof.ª Teresa Bento',
      email: 'teresa.bento@vendaia.edu.pt',
      telefone: '+244 945 678 901',
      disciplinas: ['Língua Portuguesa', 'Literatura'],
      turmasAtribuidas: ['10B-HUM', '12A-GEST'],
      cargaHorariaSemanal: 24,
      assiduidadePerc: 98.8,
      desempenhoNota: 4.9,
      estado: 'Ativo',
    },
  ]);

  const filteredProfessores = professores.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.disciplinas.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDisciplina =
      filterDisciplina === 'todas' ||
      p.disciplinas.some((d) => d.toLowerCase().includes(filterDisciplina.toLowerCase()));
    const matchesEstado = filterEstado === 'todos' || p.estado.toLowerCase() === filterEstado.toLowerCase();

    return matchesSearch && matchesDisciplina && matchesEstado;
  });

  const totalPages = Math.ceil(filteredProfessores.length / rowsPerPage) || 1;
  const currentProfessores = filteredProfessores.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const isAllSelected =
    currentProfessores.length > 0 && currentProfessores.every((p) => selectedProfIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProfIds(selectedProfIds.filter((id) => !currentProfessores.some((p) => p.id === id)));
    } else {
      const newIds = [...selectedProfIds];
      currentProfessores.forEach((p) => {
        if (!newIds.includes(p.id)) newIds.push(p.id);
      });
      setSelectedProfIds(newIds);
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedProfIds.includes(id)) {
      setSelectedProfIds(selectedProfIds.filter((i) => i !== id));
    } else {
      setSelectedProfIds([...selectedProfIds, id]);
    }
  };

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* Quick Metrics Bar - Matching Students Reference Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Docentes */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div>
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Total Docentes</span>
            <span className="text-xl font-bold text-primary leading-none">{professores.length} <span className="text-xs font-normal text-outline">Ativos</span></span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> +1 este ano
          </span>
        </div>

        {/* Card 2: Carga Horária Média */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Carga Horária Média</span>
              <span className="text-success font-bold text-[12px]">
                23h <span className="text-[10px] font-medium text-outline ml-0.5">/semana</span>
              </span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-success h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>92 Tempos Letivos</span>
              <span className="text-outline">100% Cobertura</span>
            </div>
          </div>
        </div>

        {/* Card 3: Assiduidade Geral */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Assiduidade Geral</span>
              <span className="text-info font-bold text-[12px]">
                97.6% <span className="text-[10px] font-medium text-outline ml-0.5">Regular</span>
              </span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-info h-full rounded-full" style={{ width: '97.6%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>0 Faltas Injust.</span>
              <span className="text-info/70">2 Licenças</span>
            </div>
          </div>
        </div>

        {/* Card 4: Avaliação Média */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-2.5 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Avaliação Média
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-primary leading-none">4.8</span>
              <span className="text-[10px] text-outline font-medium">/ 5.0</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold">
              Excelente
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('lista')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'lista'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">group</span>
          Lista de Professores
        </button>

        <button
          onClick={() => setActiveTab('atribuicao')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'atribuicao'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">assignment_ind</span>
          Atribuição de Turmas
        </button>

        <button
          onClick={() => setActiveTab('horarios')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'horarios'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          Horários Docentes
        </button>

        <button
          onClick={() => setActiveTab('assiduidade')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'assiduidade'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">event_available</span>
          Assiduidade
        </button>

        <button
          onClick={() => setActiveTab('desempenho')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'desempenho'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">grade</span>
          Desempenho
        </button>
      </div>

      {/* Tab 1: Lista de Professores */}
      {activeTab === 'lista' && (
        <div className="flex flex-col gap-3">
          {/* Search & Filters Bar (Reference 2-Row Design Standard) */}
          <div className="bg-surface-white border border-outline-variant/30 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-sm p-3">
            <div className="flex flex-col w-full gap-1.5">
              {/* Row 1: Dropdown Filters */}
              <div className="flex items-center gap-1 w-full">
                <select
                  value={filterAnoLetivo}
                  onChange={(e) => {
                    setFilterAnoLetivo(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer font-medium"
                >
                  <option value="2026/2027">Ano: 2026/2027</option>
                  <option value="2025/2026">Ano: 2025/2026</option>
                  <option value="2024/2025">Ano: 2024/2025</option>
                </select>

                <select
                  value={filterDisciplina}
                  onChange={(e) => {
                    setFilterDisciplina(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
                >
                  <option value="todas">Disciplina: Todas</option>
                  <option value="Matemática">Matemática</option>
                  <option value="Física">Física</option>
                  <option value="Química">Química</option>
                  <option value="Biologia">Biologia</option>
                  <option value="Língua Portuguesa">Língua Portuguesa</option>
                  <option value="Informática">Informática</option>
                </select>

                <select
                  value={filterRegime}
                  onChange={(e) => {
                    setFilterRegime(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
                >
                  <option value="todos">Regime: Todos</option>
                  <option value="Integral">Tempo Inteiro</option>
                  <option value="Parcial">Tempo Parcial</option>
                </select>

                <select
                  value={filterEstado}
                  onChange={(e) => {
                    setFilterEstado(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
                >
                  <option value="todos">Estado: Todos</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Licença">Licença</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {/* Row 2: Search Input & Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 flex items-center bg-surface border border-border-subtle rounded-md px-2 h-7 focus-within:border-secondary transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-outline mr-1.5">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Pesquisar docente por nome, e-mail ou disciplina..."
                    className="w-full bg-transparent border-none p-0 text-xs focus:ring-0 outline-none placeholder-outline"
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={openCreateModal}
                    className="bg-primary text-surface-white px-2.5 h-7 rounded hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-1 font-semibold text-xs cursor-pointer"
                    title="Cadastrar Professor"
                  >
                    <UserPlus className="w-3.5 h-3.5 stroke-[1.75]" />
                    <span className="whitespace-nowrap">Cadastrar Professor</span>
                  </button>

                  <div className="flex items-center border border-border-subtle rounded overflow-hidden">
                    <button
                      onClick={() => onShowToast('Função de Importação de Docentes iniciada.')}
                      className="bg-surface text-on-surface-variant px-2.5 h-7 hover:bg-surface-container transition-colors flex items-center justify-center gap-1 font-medium text-xs border-r border-border-subtle"
                      title="Importar Docentes"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      <span className="whitespace-nowrap">Importar</span>
                    </button>
                    <button
                      onClick={() => onShowToast('Exportando Lista de Docentes em formato CSV...')}
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
                        setFilterAnoLetivo('2026/2027');
                        setFilterDisciplina('todas');
                        setFilterRegime('todos');
                        setFilterEstado('todos');
                        setSearchQuery('');
                        setRowsPerPage(10);
                        setCurrentPage(1);
                        onShowToast('Filtros de docentes repostos com sucesso.');
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
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-surface border border-border-subtle rounded-md pl-1.5 pr-6 text-xs focus:outline-none focus:border-secondary h-7 py-0.5 cursor-pointer font-medium"
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

          {/* Batch Actions Banner */}
          {selectedProfIds.length > 0 && (
            <div className="bg-[#FAF0E8] border border-[#E8D7C8] rounded-t-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b-0 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-[#4A382C] flex items-center gap-1.5">
                Acções em Lote Disponíveis:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onShowToast(`Notificações enviadas a ${selectedProfIds.length} docentes.`)}
                  className="bg-surface-white border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span> Enviar Notificação ({selectedProfIds.length})
                </button>
                <button
                  onClick={() => onShowToast(`Fichas individuais exportadas para ${selectedProfIds.length} docentes.`)}
                  className="bg-surface-white border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span> Exportar Fichas ({selectedProfIds.length})
                </button>
                <button
                  onClick={() => setSelectedProfIds([])}
                  className="bg-surface-white border border-outline-variant/30 text-outline hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-medium shadow-2xs cursor-pointer transition-colors"
                >
                  Desmarcar
                </button>
              </div>
            </div>
          )}

          {/* Data Table Container */}
          <div className={`bg-surface-white border border-border-subtle ${selectedProfIds.length > 0 ? 'rounded-b-xl border-t-0' : 'rounded-xl'} overflow-hidden shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-surface border-b border-border-subtle">
                    <th className="px-4 py-1.5 bg-surface-container-low w-10">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                      />
                    </th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">Docente</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">Contacto / E-mail</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">Disciplinas Lecionadas</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">Turmas Atribuídas</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase text-center py-1.5 bg-surface-container-low">Carga Letiva</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase text-center py-1.5 bg-surface-container-low">Assiduidade</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase text-center py-1.5 bg-surface-container-low">Estado</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase text-center w-16 py-1.5 bg-surface-container-low">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {currentProfessores.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-on-surface-variant font-medium">
                        Nenhum docente encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    currentProfessores.map((prof) => {
                      const isSelected = selectedProfIds.includes(prof.id);
                      return (
                        <tr
                          key={prof.id}
                          className={`hover:bg-surface-container transition-colors group ${
                            isSelected ? 'bg-primary/5' : 'even:bg-surface-container-low/50'
                          }`}
                        >
                          <td className="px-4 py-1.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(prof.id)}
                              className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                            />
                          </td>
                          <td className="px-4 font-bold text-primary py-1.5 font-label-md">{prof.nome}</td>
                          <td className="px-4 text-on-surface-variant text-xs py-1.5 font-label-md">
                            <div>{prof.email}</div>
                            <div className="text-outline text-[11px]">{prof.telefone}</div>
                          </td>
                          <td className="px-4 py-1.5 font-label-md">
                            <div className="flex flex-wrap gap-1">
                              {prof.disciplinas.map((d, i) => (
                                <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                                  {d}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 text-on-surface-variant font-semibold py-1.5 font-label-md">
                            {prof.turmasAtribuidas.join(', ')}
                          </td>
                          <td className="px-4 py-1.5 text-center font-bold text-primary font-label-md">{prof.cargaHorariaSemanal}h/sem</td>
                          <td className="px-4 py-1.5 text-center font-bold text-success font-label-md">{prof.assiduidadePerc}%</td>
                          <td className="px-4 py-1.5 text-center font-label-md">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-green-800 bg-green-100 text-[11px] font-semibold tracking-tight">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> {prof.estado}
                            </span>
                          </td>
                          <td className="px-4 text-center py-1.5 font-label-md relative">
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === prof.id ? null : prof.id)}
                              className="text-outline hover:text-primary transition-colors p-1 rounded hover:bg-surface-variant/50 cursor-pointer"
                              title="Opções"
                            >
                              <span className="material-symbols-outlined text-[18px]">more_vert</span>
                            </button>

                            {activeMenuId === prof.id && (
                              <>
                                <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                                <div className="absolute right-2 top-8 w-44 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      openEditModal(prof);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-primary"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">edit</span> Editar Docente
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setActiveTab('atribuicao');
                                      onShowToast(`Gerindo atribuição de turmas para ${prof.nome}`);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-on-surface"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">assignment</span> Atribuir Turmas
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setDeletingProf(prof);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-error"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">delete</span> Remover Docente
                                  </button>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar (Matching Students Reference Standard) */}
            <div className="px-4 py-2 border-t border-border-subtle flex items-center justify-between bg-surface-white text-xs">
              <p className="text-on-surface-variant">
                Mostrando {filteredProfessores.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}–
                {Math.min(currentPage * rowsPerPage, filteredProfessores.length)} de {filteredProfessores.length} professores
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
        </div>
      )}

      {/* Tab 2: Atribuição de Turmas e Disciplinas */}
      {activeTab === 'atribuicao' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-4">
          <h2 className="font-title-lg text-lg font-bold text-primary">Atribuição da Carga Letiva Ano 2026/2027</h2>
          <p className="text-xs text-on-surface-variant">
            Distribua turmas e disciplinas para garantir o cumprimento dos limites de tempos letivos por semana.
          </p>

          <div className="space-y-3">
            {professores.map((p) => (
              <div key={p.id} className="border border-border-subtle rounded-xl p-3 bg-surface-container-low/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-primary">{p.nome}</h3>
                  <p className="text-xs text-on-surface-variant">Disciplinas: {p.disciplinas.join(', ')}</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg">
                    {p.cargaHorariaSemanal} Tempos Letivos
                  </span>

                  <button
                    onClick={() => onShowToast(`Atribuindo nova turma a ${p.nome}...`)}
                    className="bg-primary text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-opacity-90 cursor-pointer"
                  >
                    + Atribuir Turma
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Horários Docentes */}
      {activeTab === 'horarios' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-3">
          <h2 className="font-title-lg text-lg font-bold text-primary">Consulta de Horário de Docentes</h2>
          <p className="text-xs text-on-surface-variant">Selecione o professor para emitir o seu mapa de tempo individual.</p>
          <div className="p-4 border border-border-subtle rounded-xl text-xs bg-surface-container-low/20">
            <span className="font-bold text-primary">Professor Selecionado: Domingos Henriques (Matemática I e II)</span>
            <p className="mt-2 text-on-surface-variant">Horário válido de Segunda a Sexta das 07:30 às 12:30.</p>
          </div>
        </div>
      )}

      {/* Tab 4: Assiduidade */}
      {activeTab === 'assiduidade' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-title-lg text-lg font-bold text-primary">Registo de Presenças e Ausências Docentes</h2>
            <button
              onClick={() => onShowToast('Lançando falta comunicada de docente...')}
              className="bg-primary text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 cursor-pointer"
            >
              Registar Falta / Subscrição
            </button>
          </div>

          <div className="border border-border-subtle rounded-xl p-3 text-xs bg-surface-container-low/30">
            <p className="font-bold text-primary mb-1">Resumo de Ausências do Mês de Agosto:</p>
            <p className="text-on-surface-variant">0 Faltas Injustificadas | 2 Faltas Justificadas por Licença Médica.</p>
          </div>
        </div>
      )}

      {/* Tab 5: Desempenho */}
      {activeTab === 'desempenho' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-3">
          <h2 className="font-title-lg text-lg font-bold text-primary">Avaliação de Desempenho Pedagógico</h2>
          <p className="text-xs text-on-surface-variant">
            Resultados dos questionários de satisfação dos alunos e inspeção pedagógica pela Direção.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {professores.map((p) => (
              <div key={p.id} className="p-3 border border-border-subtle rounded-xl bg-surface-container-low/30 flex justify-between items-center">
                <div>
                  <p className="font-bold text-primary">{p.nome}</p>
                  <p className="text-outline">{p.disciplinas.join(', ')}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-secondary">{p.desempenhoNota} / 5.0</span>
                  <p className="text-[10px] text-success font-bold">Excelente</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Cadastro / Edição Professor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-xl max-w-md w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2">
              <h3 className="font-bold text-primary text-base">
                {editingProf ? `Editar Docente: ${editingProf.nome}` : 'Cadastrar Novo Docente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-outline hover:text-primary cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfessor} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nome Completo:</label>
                <input
                  type="text"
                  placeholder="Ex: Prof. Miguel Ângelo"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">E-mail Institucional:</label>
                <input
                  type="email"
                  placeholder="miguel.angelo@vendaia.edu.pt"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Contacto Telefónico:</label>
                <input
                  type="text"
                  placeholder="+244 923 000 000"
                  value={formTelefone}
                  onChange={(e) => setFormTelefone(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Disciplinas (separadas por vírgula):</label>
                <input
                  type="text"
                  placeholder="Ex: Matemática, Física, Informática"
                  value={formDisciplinas}
                  onChange={(e) => setFormDisciplinas(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Turmas Atribuídas:</label>
                  <input
                    type="text"
                    placeholder="Ex: 10A-CIEN, 11A-INF"
                    value={formTurmas}
                    onChange={(e) => setFormTurmas(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Carga Horária (h/sem):</label>
                  <input
                    type="number"
                    value={formCarga}
                    onChange={(e) => setFormCarga(Number(e.target.value))}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface-white rounded-lg font-bold hover:bg-primary/90 cursor-pointer transition-all"
                >
                  {editingProf ? 'Guardar Alterações' : 'Salvar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminação de Docente */}
      {deletingProf && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-xl max-w-sm w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <h3 className="font-bold text-error text-base">Eliminar Docente</h3>
            <p className="text-xs text-on-surface-variant">
              Tem a certeza que deseja remover o docente <strong className="text-primary">{deletingProf.nome}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingProf(null)}
                className="px-3 py-1.5 border border-border-subtle rounded-lg text-xs font-bold text-on-surface-variant cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProfConfirm}
                className="px-4 py-1.5 bg-error text-surface-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer transition-all"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
