import React, { useState } from 'react';
import { ActiveView } from '../types';
import { School, Plus, Sparkles, UserCheck, Clock, DoorClosed, Trash2, Pencil as Edit3, Users, AlertCircle, X, CheckCircle2, TrendingUp } from 'lucide-react';

interface TurmasViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

interface Turma {
  id: string;
  codigo: string;
  nome: string;
  curso: string;
  classe: string;
  periodo: 'Manhã' | 'Tarde' | 'Noite';
  sala: string;
  capacidadeMax: number;
  estudantesInscritos: number;
  diretorTurma: string;
  anoLetivo: string;
  estado: 'Ativa' | 'Completa' | 'Pendente';
}

interface StudentGrade {
  num: string;
  nome: string;
  matematica: number;
  fisica: number;
  quimica: number;
  portugues: number;
}

interface ScheduleCell {
  disciplina: string;
  professor: string;
  cor?: 'primary' | 'secondary' | 'info' | 'warning' | 'success';
}

interface TimeSlotRow {
  id: string;
  horario: string;
  isIntervalo?: boolean;
  descricaoIntervalo?: string;
  dias: (ScheduleCell | null)[];
}

export const TurmasView: React.FC<TurmasViewProps> = ({ onSelectView, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'lista' | 'distribuicao' | 'horarios' | 'pautas' | 'calendario'>('lista');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriodo, setFilterPeriodo] = useState('todos');
  const [filterCurso, setFilterCurso] = useState('todos');
  const [filterAnoLetivo, setFilterAnoLetivo] = useState('2026/2027');
  const [filterClasse, setFilterClasse] = useState('todas');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTurmaIds, setSelectedTurmaIds] = useState<string[]>([]);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [deletingTurma, setDeletingTurma] = useState<Turma | null>(null);
  const [viewingTurmaStudents, setViewingTurmaStudents] = useState<Turma | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Mock Students for Turma Student Management
  const [turmaStudentsMap, setTurmaStudentsMap] = useState<Record<string, string[]>>({
    'tur-101': ['Afonso Mateus Lemba', 'Beatriz Domingos Neto', 'Carlos Eduardo Vendaia', 'Diana Sofia Paiva', 'Eduardo Manuel Silva'],
    'tur-102': ['Fernando Gabriel Lopes', 'Gisela Maria Santos', 'Helder João Kwanza'],
    'tur-103': ['Inês Patricia Matos', 'João Miguel Santos Almeida', 'Katia Regina Cruz'],
    'tur-104': ['Leonardo Ferreira', 'Mariana Isabel Costa'],
  });

  // Interactive Pauta Grades State
  const [pautaGrades, setPautaGrades] = useState<StudentGrade[]>([
    { num: '01', nome: 'Afonso Mateus Lemba', matematica: 16, fisica: 15, quimica: 17, portugues: 14 },
    { num: '02', nome: 'Beatriz Domingos Neto', matematica: 8, fisica: 12, quimica: 10, portugues: 13 },
    { num: '03', nome: 'Carlos Eduardo Vendaia', matematica: 18, fisica: 19, quimica: 17, portugues: 16 },
    { num: '04', nome: 'Diana Sofia Paiva', matematica: 14, fisica: 13, quimica: 15, portugues: 15 },
  ]);

  // Interactive Schedules State per Turma
  const [selectedTurmaScheduleId, setSelectedTurmaScheduleId] = useState('tur-101');

  const defaultScheduleRows: TimeSlotRow[] = [
    {
      id: 'ts-1',
      horario: '07:30 - 08:15',
      dias: [
        { disciplina: 'Matemática', professor: 'Prof. Domingos', cor: 'primary' },
        { disciplina: 'Física', professor: 'Prof. António', cor: 'secondary' },
        { disciplina: 'Matemática', professor: 'Prof. Domingos', cor: 'primary' },
        { disciplina: 'Química', professor: 'Dra. Eunice', cor: 'info' },
        { disciplina: 'L. Portuguesa', professor: 'Prof.ª Teresa', cor: 'primary' },
      ],
    },
    {
      id: 'ts-2',
      horario: '08:20 - 09:05',
      dias: [
        { disciplina: 'Matemática', professor: 'Prof. Domingos', cor: 'primary' },
        { disciplina: 'Física', professor: 'Prof. António', cor: 'secondary' },
        { disciplina: 'Biologia', professor: 'Dra. Eunice', cor: 'info' },
        { disciplina: 'Química', professor: 'Dra. Eunice', cor: 'info' },
        { disciplina: 'L. Portuguesa', professor: 'Prof.ª Teresa', cor: 'primary' },
      ],
    },
    {
      id: 'ts-intervalo',
      horario: '09:05 - 09:25',
      isIntervalo: true,
      descricaoIntervalo: 'INTERVALO PRINCIPAL (09:05 - 09:25)',
      dias: [],
    },
    {
      id: 'ts-3',
      horario: '09:25 - 10:10',
      dias: [
        { disciplina: 'Inglês', professor: 'Prof. Marc', cor: 'warning' },
        { disciplina: 'L. Portuguesa', professor: 'Prof.ª Teresa', cor: 'primary' },
        { disciplina: 'Biologia', professor: 'Dra. Eunice', cor: 'info' },
        { disciplina: 'Ed. Física', professor: 'Prof. Carlos', cor: 'success' },
        { disciplina: 'Filosofia', professor: 'Prof. Gabriel', cor: 'secondary' },
      ],
    },
    {
      id: 'ts-4',
      horario: '10:15 - 11:00',
      dias: [
        { disciplina: 'História', professor: 'Prof. Gabriel', cor: 'warning' },
        { disciplina: 'Geografia', professor: 'Prof.ª Helena', cor: 'warning' },
        { disciplina: 'Ed. Física', professor: 'Prof. Carlos', cor: 'success' },
        { disciplina: 'Informática', professor: 'Prof. Vendaia', cor: 'info' },
        { disciplina: 'Física', professor: 'Prof. António', cor: 'secondary' },
      ],
    },
  ];

  const [schedulesMap, setSchedulesMap] = useState<Record<string, TimeSlotRow[]>>({
    'tur-101': defaultScheduleRows,
  });

  // Cell Edit Modal State
  const [editingCell, setEditingCell] = useState<{
    slotId: string;
    dayIdx: number;
    dayName: string;
    horario: string;
    currentCell: ScheduleCell | null;
  } | null>(null);

  const [cellDisciplina, setCellDisciplina] = useState('');
  const [cellProfessor, setCellProfessor] = useState('');
  const [cellCor, setCellCor] = useState<'primary' | 'secondary' | 'info' | 'warning' | 'success'>('primary');

  // Add Slot Row Modal State
  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
  const [newSlotHorario, setNewSlotHorario] = useState('11:05 - 11:50');
  const [newSlotIsIntervalo, setNewSlotIsIntervalo] = useState(false);
  const [newSlotDescIntervalo, setNewSlotDescIntervalo] = useState('INTERVALO DA TARDE');

  // Edit Row Time State
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingRowTimeInput, setEditingRowTimeInput] = useState('');

  const currentSchedule = schedulesMap[selectedTurmaScheduleId] || defaultScheduleRows;

  const openEditCellModal = (slotId: string, dayIdx: number, dayName: string, horario: string, cell: ScheduleCell | null) => {
    setEditingCell({ slotId, dayIdx, dayName, horario, currentCell: cell });
    setCellDisciplina(cell ? cell.disciplina : '');
    setCellProfessor(cell ? cell.professor : '');
    setCellCor(cell?.cor || 'primary');
  };

  const handleSaveCell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCell) return;

    const newCell: ScheduleCell | null = cellDisciplina.trim()
      ? {
          disciplina: cellDisciplina.trim(),
          professor: cellProfessor.trim() || 'Docente a atribuir',
          cor: cellCor,
        }
      : null;

    const updatedRows = currentSchedule.map((row) => {
      if (row.id === editingCell.slotId) {
        const newDias = [...row.dias];
        newDias[editingCell.dayIdx] = newCell;
        return { ...row, dias: newDias };
      }
      return row;
    });

    setSchedulesMap({
      ...schedulesMap,
      [selectedTurmaScheduleId]: updatedRows,
    });

    onShowToast(`Horário atualizado para ${editingCell.dayName} (${editingCell.horario})`);
    setEditingCell(null);
  };

  const handleRemoveCell = () => {
    if (!editingCell) return;
    const updatedRows = currentSchedule.map((row) => {
      if (row.id === editingCell.slotId) {
        const newDias = [...row.dias];
        newDias[editingCell.dayIdx] = null;
        return { ...row, dias: newDias };
      }
      return row;
    });

    setSchedulesMap({
      ...schedulesMap,
      [selectedTurmaScheduleId]: updatedRows,
    });

    onShowToast(`Aula removida do horário.`);
    setEditingCell(null);
  };

  const handleAddSlotRow = (e: React.FormEvent) => {
    e.preventDefault();
    const newRow: TimeSlotRow = {
      id: `ts-${Date.now()}`,
      horario: newSlotHorario,
      isIntervalo: newSlotIsIntervalo,
      descricaoIntervalo: newSlotIsIntervalo ? newSlotDescIntervalo : undefined,
      dias: newSlotIsIntervalo ? [] : [null, null, null, null, null],
    };

    const updatedRows = [...currentSchedule, newRow];
    setSchedulesMap({
      ...schedulesMap,
      [selectedTurmaScheduleId]: updatedRows,
    });

    onShowToast(`Novo bloco de horário (${newSlotHorario}) adicionado.`);
    setIsAddSlotModalOpen(false);
  };

  const handleDeleteSlotRow = (rowId: string) => {
    const updatedRows = currentSchedule.filter((r) => r.id !== rowId);
    setSchedulesMap({
      ...schedulesMap,
      [selectedTurmaScheduleId]: updatedRows,
    });
    onShowToast(`Bloco de horário removido.`);
  };

  const handleSaveRowTime = (rowId: string) => {
    if (!editingRowTimeInput.trim()) return;
    const updatedRows = currentSchedule.map((r) =>
      r.id === rowId ? { ...r, horario: editingRowTimeInput.trim() } : r
    );
    setSchedulesMap({
      ...schedulesMap,
      [selectedTurmaScheduleId]: updatedRows,
    });
    onShowToast(`Horário do bloco alterado para ${editingRowTimeInput.trim()}`);
    setEditingRowId(null);
  };

  const [newStudentName, setNewStudentName] = useState('');

  // Form input state for Create / Edit modal
  const [formCodigo, setFormCodigo] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formCurso, setFormCurso] = useState('Ciências Físicas e Biológicas');
  const [formClasse, setFormClasse] = useState('10º Ano');
  const [formPeriodo, setFormPeriodo] = useState<'Manhã' | 'Tarde' | 'Noite'>('Manhã');
  const [formSala, setFormSala] = useState('Sala 10 - Bloco A');
  const [formCapacidade, setFormCapacidade] = useState(35);
  const [formDiretor, setFormDiretor] = useState('Prof. Domingos Henriques');

  // Initial Mock Turmas
  const [turmas, setTurmas] = useState<Turma[]>([
    {
      id: 'tur-101',
      codigo: '10A-CIEN',
      nome: '10º Ano A - Ciências Físicas e Biológicas',
      curso: 'Ciências Físicas e Biológicas',
      classe: '10º Ano',
      periodo: 'Manhã',
      sala: 'Sala 12 - Bloco B',
      capacidadeMax: 35,
      estudantesInscritos: 32,
      diretorTurma: 'Prof. Domingos Henriques',
      anoLetivo: '2026/2027',
      estado: 'Ativa',
    },
    {
      id: 'tur-102',
      codigo: '10B-HUM',
      nome: '10º Ano B - Ciências Humanas e Sociais',
      curso: 'Ciências Humanas e Sociais',
      classe: '10º Ano',
      periodo: 'Manhã',
      sala: 'Sala 14 - Bloco B',
      capacidadeMax: 35,
      estudantesInscritos: 35,
      diretorTurma: 'Dra. Maria Eunice',
      anoLetivo: '2026/2027',
      estado: 'Completa',
    },
    {
      id: 'tur-103',
      codigo: '11A-INF',
      nome: '11º Ano A - Técnico de Informática',
      curso: 'Técnico de Informática',
      classe: '11º Ano',
      periodo: 'Tarde',
      sala: 'Lab 03 - Informática',
      capacidadeMax: 30,
      estudantesInscritos: 28,
      diretorTurma: 'Prof. António Costa',
      anoLetivo: '2026/2027',
      estado: 'Ativa',
    },
    {
      id: 'tur-104',
      codigo: '12A-GEST',
      nome: '12º Ano A - Gestão e Economia',
      curso: 'Gestão e Economia',
      classe: '12º Ano',
      periodo: 'Manhã',
      sala: 'Sala 08 - Bloco A',
      capacidadeMax: 35,
      estudantesInscritos: 30,
      diretorTurma: 'Prof.ª Teresa Bento',
      anoLetivo: '2026/2027',
      estado: 'Ativa',
    },
  ]);

  const openCreateModal = () => {
    setEditingTurma(null);
    setFormCodigo('');
    setFormNome('');
    setFormCurso('Ciências Físicas e Biológicas');
    setFormClasse('10º Ano');
    setFormPeriodo('Manhã');
    setFormSala('Sala 10 - Bloco A');
    setFormCapacidade(35);
    setFormDiretor('Prof. Domingos Henriques');
    setIsModalOpen(true);
  };

  const openEditModal = (turma: Turma) => {
    setEditingTurma(turma);
    setFormCodigo(turma.codigo);
    setFormNome(turma.nome);
    setFormCurso(turma.curso);
    setFormClasse(turma.classe);
    setFormPeriodo(turma.periodo);
    setFormSala(turma.sala);
    setFormCapacidade(turma.capacidadeMax);
    setFormDiretor(turma.diretorTurma);
    setIsModalOpen(true);
  };

  const handleSaveTurma = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTurma) {
      setTurmas(
        turmas.map((t) =>
          t.id === editingTurma.id
            ? {
                ...t,
                codigo: formCodigo,
                nome: formNome,
                curso: formCurso,
                classe: formClasse,
                periodo: formPeriodo,
                sala: formSala,
                capacidadeMax: Number(formCapacidade),
                diretorTurma: formDiretor,
              }
            : t
        )
      );
      onShowToast(`Turma ${formCodigo} atualizada com sucesso!`);
    } else {
      const newTurma: Turma = {
        id: `tur-${Date.now()}`,
        codigo: formCodigo,
        nome: formNome,
        curso: formCurso,
        classe: formClasse,
        periodo: formPeriodo,
        sala: formSala,
        capacidadeMax: Number(formCapacidade),
        estudantesInscritos: 0,
        diretorTurma: formDiretor,
        anoLetivo: '2026/2027',
        estado: 'Pendente',
      };
      setTurmas([...turmas, newTurma]);
      setTurmaStudentsMap({ ...turmaStudentsMap, [newTurma.id]: [] });
      onShowToast(`Nova turma ${formCodigo} criada com sucesso!`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTurmaConfirm = () => {
    if (!deletingTurma) return;
    setTurmas(turmas.filter((t) => t.id !== deletingTurma.id));
    onShowToast(`Turma ${deletingTurma.codigo} eliminada com sucesso!`);
    setDeletingTurma(null);
  };

  const handleRemoveStudentFromTurma = (turmaId: string, studentName: string) => {
    const updatedList = (turmaStudentsMap[turmaId] || []).filter((s) => s !== studentName);
    setTurmaStudentsMap({ ...turmaStudentsMap, [turmaId]: updatedList });
    setTurmas(
      turmas.map((t) => (t.id === turmaId ? { ...t, estudantesInscritos: Math.max(0, t.estudantesInscritos - 1) } : t))
    );
    onShowToast(`${studentName} removido da turma.`);
  };

  const handleAddStudentToTurma = (turmaId: string) => {
    if (!newStudentName.trim()) return;
    const currentList = turmaStudentsMap[turmaId] || [];
    setTurmaStudentsMap({ ...turmaStudentsMap, [turmaId]: [...currentList, newStudentName.trim()] });
    setTurmas(
      turmas.map((t) => (t.id === turmaId ? { ...t, estudantesInscritos: t.estudantesInscritos + 1 } : t))
    );
    onShowToast(`${newStudentName} associado à turma com sucesso!`);
    setNewStudentName('');
  };

  const handleGradeChange = (index: number, subject: keyof Omit<StudentGrade, 'num' | 'nome'>, value: number) => {
    const updated = [...pautaGrades];
    updated[index][subject] = Math.min(20, Math.max(0, value));
    setPautaGrades(updated);
  };

  const filteredTurmas = turmas.filter((t) => {
    const matchesSearch =
      t.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.diretorTurma.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPeriodo = filterPeriodo === 'todos' || t.periodo.toLowerCase() === filterPeriodo.toLowerCase();
    const matchesCurso = filterCurso === 'todos' || t.curso === filterCurso;
    const matchesClasse = filterClasse === 'todas' || t.classe.toLowerCase() === filterClasse.toLowerCase();
    const matchesEstado = filterEstado === 'todos' || t.estado.toLowerCase() === filterEstado.toLowerCase();
    const matchesAno = filterAnoLetivo === 'todos' || t.anoLetivo === filterAnoLetivo;

    return matchesSearch && matchesPeriodo && matchesCurso && matchesClasse && matchesEstado && matchesAno;
  });

  const totalPages = Math.ceil(filteredTurmas.length / rowsPerPage) || 1;
  const currentTurmas = filteredTurmas.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const isAllSelected = currentTurmas.length > 0 && currentTurmas.every((t) => selectedTurmaIds.includes(t.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTurmaIds(selectedTurmaIds.filter((id) => !currentTurmas.some((t) => t.id === id)));
    } else {
      const newIds = [...selectedTurmaIds];
      currentTurmas.forEach((t) => {
        if (!newIds.includes(t.id)) newIds.push(t.id);
      });
      setSelectedTurmaIds(newIds);
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedTurmaIds.includes(id)) {
      setSelectedTurmaIds(selectedTurmaIds.filter((i) => i !== id));
    } else {
      setSelectedTurmaIds([...selectedTurmaIds, id]);
    }
  };

  const handleRunAutoDistribution = () => {
    onShowToast('Distribuição automática de estudantes executada! 42 novos inscritos foram alocados conforme as regras.');
  };

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* Quick Metrics Bar - Matching Students Reference Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total de Turmas */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div>
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Total de Turmas</span>
            <span className="text-xl font-bold text-primary leading-none">{turmas.length} <span className="text-xs font-normal text-outline">Ativas</span></span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> +2 este ano
          </span>
        </div>

        {/* Card 2: Ocupação Média */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Ocupação Média</span>
              <span className="text-success font-bold text-[12px]">
                92.8% <span className="text-[10px] font-medium text-outline ml-0.5">Vagas</span>
              </span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-success h-full rounded-full" style={{ width: '92.8%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>123 Inscritos</span>
              <span className="text-outline">12 Vagas Liberais</span>
            </div>
          </div>
        </div>

        {/* Card 3: Diretores de Turma */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Diretores de Turma</span>
              <span className="text-info font-bold text-[12px]">
                100% <span className="text-[10px] font-medium text-outline ml-0.5">Atribuídos</span>
              </span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-info h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>12 Atribuídos</span>
              <span className="text-info/70">0 Pendentes</span>
            </div>
          </div>
        </div>

        {/* Card 4: Horários Gerados */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-2.5 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Horários Gerados
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-primary leading-none">100%</span>
              <span className="text-[10px] text-outline font-medium">válidos</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
              {turmas.length} Turmas OK
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
          <span className="material-symbols-outlined text-[16px]">list_alt</span>
          Lista de Turmas
        </button>

        <button
          onClick={() => setActiveTab('distribuicao')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'distribuicao'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">alt_route</span>
          Regras de Distribuição
        </button>

        <button
          onClick={() => setActiveTab('horarios')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'horarios'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">calendar_view_week</span>
          Horários Escolares
        </button>

        <button
          onClick={() => setActiveTab('pautas')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'pautas'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">fact_check</span>
          Pautas & Avaliações
        </button>

        <button
          onClick={() => setActiveTab('calendario')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'calendario'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">event</span>
          Calendário Escolar
        </button>
      </div>

      {/* Tab 1: Lista de Turmas */}
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
                  value={filterPeriodo}
                  onChange={(e) => {
                    setFilterPeriodo(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
                >
                  <option value="todos">Período: Todos</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>

                <select
                  value={filterClasse}
                  onChange={(e) => {
                    setFilterClasse(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
                >
                  <option value="todas">Classe: Todas</option>
                  <option value="10º Ano">10º Ano</option>
                  <option value="11º Ano">11º Ano</option>
                  <option value="12º Ano">12º Ano</option>
                </select>

                <select
                  value={filterCurso}
                  onChange={(e) => {
                    setFilterCurso(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 min-w-0 appearance-none bg-surface border border-border-subtle rounded-md px-1.5 text-[11px] focus:outline-none focus:border-secondary h-7 py-0.5 text-ellipsis overflow-hidden cursor-pointer"
                >
                  <option value="todos">Curso: Todos os Cursos</option>
                  <option value="Ciências Físicas e Biológicas">Ciências Físicas</option>
                  <option value="Ciências Humanas e Sociais">Ciências Humanas</option>
                  <option value="Técnico de Informática">Informática</option>
                  <option value="Gestão e Economia">Gestão e Economia</option>
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
                  <option value="Ativa">Ativa</option>
                  <option value="Completa">Completa</option>
                  <option value="Pendente">Pendente</option>
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
                    placeholder="Pesquisar por Código, Turma ou Diretor..."
                    className="w-full bg-transparent border-none p-0 text-xs focus:ring-0 outline-none placeholder-outline"
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={openCreateModal}
                    className="bg-primary text-surface-white px-2.5 h-7 rounded hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-1 font-semibold text-xs cursor-pointer"
                    title="Criar Turma"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span className="whitespace-nowrap">Criar Turma</span>
                  </button>

                  <div className="flex items-center border border-border-subtle rounded overflow-hidden">
                    <button
                      onClick={() => onShowToast('Função de Importação de Turmas iniciada.')}
                      className="bg-surface text-on-surface-variant px-2.5 h-7 hover:bg-surface-container transition-colors flex items-center justify-center gap-1 font-medium text-xs border-r border-border-subtle"
                      title="Importar Turmas"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      <span className="whitespace-nowrap">Importar</span>
                    </button>
                    <button
                      onClick={() => onShowToast('Exportando Lista de Turmas em formato CSV...')}
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
                        setFilterPeriodo('todos');
                        setFilterClasse('todas');
                        setFilterCurso('todos');
                        setFilterEstado('todos');
                        setSearchQuery('');
                        setRowsPerPage(10);
                        setCurrentPage(1);
                        onShowToast('Filtros de turmas repostos com sucesso.');
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
          {selectedTurmaIds.length > 0 && (
            <div className="bg-[#FAF0E8] border border-[#E8D7C8] rounded-t-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b-0 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-[#4A382C] flex items-center gap-1.5">
                Acções em Lote Disponíveis:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onShowToast(`Notificações enviadas aos diretores de ${selectedTurmaIds.length} turmas.`)}
                  className="bg-surface-white border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span> Notificar Diretores ({selectedTurmaIds.length})
                </button>
                <button
                  onClick={() => onShowToast(`Pautas em lote exportadas para ${selectedTurmaIds.length} turmas.`)}
                  className="bg-surface-white border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span> Pautas em Lote ({selectedTurmaIds.length})
                </button>
                <button
                  onClick={() => setSelectedTurmaIds([])}
                  className="bg-surface-white border border-outline-variant/30 text-outline hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-medium shadow-2xs cursor-pointer transition-colors"
                >
                  Desmarcar
                </button>
              </div>
            </div>
          )}

          {/* Data Table Container */}
          <div className={`bg-surface-white border border-border-subtle ${selectedTurmaIds.length > 0 ? 'rounded-b-xl border-t-0' : 'rounded-xl'} overflow-hidden shadow-sm`}>
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
                    <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">Código</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">Designação da Turma</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">Curso / Classe</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">Período</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">Sala</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase text-center py-1.5 bg-surface-container-low">Inscritos / Vagas</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">Diretor de Turma</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase text-center py-1.5 bg-surface-container-low">Estado</th>
                    <th className="px-4 font-semibold text-xs text-outline uppercase text-center w-16 py-1.5 bg-surface-container-low">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {currentTurmas.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-6 text-on-surface-variant font-medium">
                        Nenhuma turma encontrada para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    currentTurmas.map((turma) => {
                      const isSelected = selectedTurmaIds.includes(turma.id);
                      return (
                        <tr
                          key={turma.id}
                          className={`hover:bg-surface-container transition-colors group ${
                            isSelected ? 'bg-primary/5' : 'even:bg-surface-container-low/50'
                          }`}
                        >
                          <td className="px-4 py-1.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(turma.id)}
                              className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                            />
                          </td>
                          <td className="px-4 font-bold text-primary py-1.5 font-label-md">{turma.codigo}</td>
                          <td className="px-4 font-semibold text-on-surface py-1.5 font-label-md">{turma.nome}</td>
                          <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{turma.curso} ({turma.classe})</td>
                          <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{turma.periodo}</td>
                          <td className="px-4 text-outline py-1.5 font-label-md">{turma.sala}</td>
                          <td className="px-4 py-1.5 text-center font-bold font-label-md">
                            <span className={turma.estudantesInscritos >= turma.capacidadeMax ? 'text-error' : 'text-success'}>
                              {turma.estudantesInscritos}
                            </span>{' '}
                            / {turma.capacidadeMax}
                          </td>
                          <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{turma.diretorTurma}</td>
                          <td className="px-4 py-1.5 text-center font-label-md">
                            {turma.estado === 'Ativa' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-green-800 bg-green-100 text-[11px] font-semibold tracking-tight">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Ativa
                              </span>
                            ) : turma.estado === 'Completa' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-amber-800 bg-amber-100 text-[11px] font-semibold tracking-tight">
                                Completa
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-blue-800 bg-blue-100 text-[11px] font-semibold tracking-tight">
                                Pendente
                              </span>
                            )}
                          </td>
                          <td className="px-4 text-center py-1.5 font-label-md relative">
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === turma.id ? null : turma.id)}
                              className="text-outline hover:text-primary transition-colors p-1 rounded hover:bg-surface-variant/50 cursor-pointer"
                              title="Opções"
                            >
                              <span className="material-symbols-outlined text-[18px]">more_vert</span>
                            </button>

                            {activeMenuId === turma.id && (
                              <>
                                <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                                <div className="absolute right-2 top-8 w-44 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setViewingTurmaStudents(turma);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-primary"
                                  >
                                    <Users className="w-3.5 h-3.5 stroke-[1.75]" /> Gerir Alunos
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      openEditModal(turma);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-on-surface"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 stroke-[1.75]" /> Editar Turma
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setDeletingTurma(turma);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-error"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" /> Eliminar Turma
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
                Mostrando {filteredTurmas.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}–
                {Math.min(currentPage * rowsPerPage, filteredTurmas.length)} de {filteredTurmas.length} turmas
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

      {/* Tab 2: Regras de Distribuição Automática */}
      {activeTab === 'distribuicao' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="font-title-lg text-lg font-bold text-primary mb-1">Algoritmo de Distribuição de Alunos</h2>
            <p className="text-xs text-on-surface-variant">
              Configure as regras de associação automática de estudantes em turmas na renovação ou primeira matrícula.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border-subtle rounded-xl p-4 bg-surface-container-low/30 space-y-3">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">tune</span>
                Critérios de Alocação
              </h3>

              <label className="flex items-center justify-between text-xs font-medium cursor-pointer">
                <span>1. Priorizar Período Solicitado (Manhã / Tarde / Noite)</span>
                <input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary" />
              </label>

              <label className="flex items-center justify-between text-xs font-medium cursor-pointer">
                <span>2. Equilíbrio de Média de Notas Académicas</span>
                <input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary" />
              </label>

              <label className="flex items-center justify-between text-xs font-medium cursor-pointer">
                <span>3. Balanceamento de Género (50/50 em cada turma)</span>
                <input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary" />
              </label>

              <label className="flex items-center justify-between text-xs font-medium cursor-pointer">
                <span>4. Manter colegas da mesma turma anterior</span>
                <input type="checkbox" className="rounded border-outline-variant text-secondary" />
              </label>
            </div>

            <div className="border border-border-subtle rounded-xl p-4 bg-surface-container-low/30 space-y-3">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-info text-[18px]">rule</span>
                Capacidade & Limites
              </h3>

              <div>
                <label className="block text-xs font-bold mb-1">Capacidade Padrão por Turma:</label>
                <input
                  type="number"
                  defaultValue={35}
                  className="w-full text-xs bg-surface-white border border-border-subtle rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Margem de Excesso Permitida (Vagas de reserva):</label>
                <input
                  type="number"
                  defaultValue={2}
                  className="w-full text-xs bg-surface-white border border-border-subtle rounded-lg p-2"
                />
              </div>

              <button
                onClick={() => onShowToast('Parâmetros de distribuição guardados com sucesso!')}
                className="w-full bg-primary text-surface-white py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors mt-2 cursor-pointer"
              >
                Guardar Regras de Alocação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Horários Escolares */}
      {activeTab === 'horarios' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-title-lg text-lg font-bold text-primary">Grelha de Horários Escolares (Editável)</h2>
              <p className="text-xs text-on-surface-variant">
                Selecione a turma para gerir e editar a distribuição semanal de aulas, tempos e docentes. Clique numa aula para alterar.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedTurmaScheduleId}
                onChange={(e) => setSelectedTurmaScheduleId(e.target.value)}
                className="text-xs bg-surface-container-low border border-border-subtle rounded-lg px-3 py-1.5 focus:outline-none focus:border-secondary font-bold cursor-pointer"
              >
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome} ({t.periodo})
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setNewSlotHorario('11:05 - 11:50');
                  setNewSlotIsIntervalo(false);
                  setIsAddSlotModalOpen(true);
                }}
                className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2]" />
                Adicionar Bloco de Horário
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-border-subtle rounded-xl">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3 py-2.5 text-xs font-bold text-outline w-28 text-left pl-3">Horário</th>
                  {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'].map((d, idx) => (
                    <th key={idx} className="px-2 py-2.5 text-xs font-bold text-primary">
                      {d}
                    </th>
                  ))}
                  <th className="px-2 py-2.5 text-xs font-bold text-outline w-12">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs">
                {currentSchedule.map((row) => {
                  if (row.isIntervalo) {
                    return (
                      <tr key={row.id} className="bg-surface-container-low/60">
                        <td className="px-3 py-1.5 font-bold text-outline text-left">
                          {editingRowId === row.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editingRowTimeInput}
                                onChange={(e) => setEditingRowTimeInput(e.target.value)}
                                className="w-24 bg-surface-white border border-secondary px-1 py-0.5 rounded text-xs"
                              />
                              <button
                                onClick={() => handleSaveRowTime(row.id)}
                                className="text-success font-bold"
                              >
                                OK
                              </button>
                            </div>
                          ) : (
                            <span
                              onClick={() => {
                                setEditingRowId(row.id);
                                setEditingRowTimeInput(row.horario);
                              }}
                              className="cursor-pointer hover:underline"
                              title="Clique para editar horário"
                            >
                              {row.horario}
                            </span>
                          )}
                        </td>
                        <td colSpan={5} className="py-2 text-[11px] font-bold text-outline tracking-wider uppercase text-center">
                          {row.descricaoIntervalo || `INTERVALO (${row.horario})`}
                        </td>
                        <td className="px-2 py-1.5">
                          <button
                            onClick={() => handleDeleteSlotRow(row.id)}
                            className="text-outline hover:text-error p-1 transition-colors cursor-pointer"
                            title="Eliminar bloco de intervalo"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  const dayNames = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];

                  return (
                    <tr key={row.id} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="px-3 py-2 font-bold text-outline text-left">
                        {editingRowId === row.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingRowTimeInput}
                              onChange={(e) => setEditingRowTimeInput(e.target.value)}
                              className="w-24 bg-surface-white border border-secondary px-1 py-0.5 rounded text-xs"
                            />
                            <button
                              onClick={() => handleSaveRowTime(row.id)}
                              className="text-success font-bold cursor-pointer"
                            >
                              OK
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingRowId(row.id);
                              setEditingRowTimeInput(row.horario);
                            }}
                            className="group flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                            title="Clique para editar horário"
                          >
                            <span>{row.horario}</span>
                            <Edit3 className="w-3 h-3 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </td>

                      {dayNames.map((dName, dayIdx) => {
                        const cell = row.dias[dayIdx];

                        const colorClasses = {
                          primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
                          secondary: 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20',
                          info: 'bg-info/10 text-info border-info/20 hover:bg-info/20',
                          warning: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
                          success: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
                        };

                        const badgeColor = cell?.cor ? colorClasses[cell.cor] : colorClasses.primary;

                        return (
                          <td key={dayIdx} className="p-1">
                            {cell ? (
                              <button
                                onClick={() => openEditCellModal(row.id, dayIdx, dName, row.horario, cell)}
                                className={`w-full p-2 rounded-lg border font-bold text-xs text-center transition-all cursor-pointer flex flex-col items-center justify-center ${badgeColor}`}
                                title="Clique para editar ou remover esta aula"
                              >
                                <span>{cell.disciplina}</span>
                                <span className="text-[10px] font-normal opacity-85 mt-0.5">({cell.professor})</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => openEditCellModal(row.id, dayIdx, dName, row.horario, null)}
                                className="w-full p-2.5 rounded-lg border border-dashed border-border-subtle hover:border-secondary/50 text-outline hover:text-secondary font-medium text-[11px] text-center transition-all cursor-pointer hover:bg-secondary/5"
                                title="Atribuir aula para este horário"
                              >
                                + Adicionar
                              </button>
                            )}
                          </td>
                        );
                      })}

                      <td className="px-2 py-2">
                        <button
                          onClick={() => handleDeleteSlotRow(row.id)}
                          className="text-outline hover:text-error p-1 transition-colors cursor-pointer"
                          title="Eliminar este bloco de horário"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Pautas & Avaliações */}
      {activeTab === 'pautas' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-title-lg text-lg font-bold text-primary">Pautas e Emissão de Notas</h2>
              <p className="text-xs text-on-surface-variant">
                Consulte e emita as pautas trimestrais aprovadas pelo conselho pedagógico.
              </p>
            </div>
            <button
              onClick={() => onShowToast('Exportando Pauta Trimestral em PDF assinado digitalmente...')}
              className="bg-primary hover:bg-primary/90 text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
              Emitir Pauta Oficial (PDF)
            </button>
          </div>

          <div className="border border-border-subtle rounded-xl p-4 bg-surface-container-low/30 text-xs">
            <p className="font-bold text-primary mb-2">Turma Selecionada: 10º Ano A - Ciências Físicas (1º Trimestre)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-white border-b border-border-subtle">
                    <th className="px-3 py-1.5 font-bold">Nº</th>
                    <th className="px-3 py-1.5 font-bold">Nome do Estudante</th>
                    <th className="px-3 py-1.5 font-bold text-center">Matemática</th>
                    <th className="px-3 py-1.5 font-bold text-center">Física</th>
                    <th className="px-3 py-1.5 font-bold text-center">Química</th>
                    <th className="px-3 py-1.5 font-bold text-center">Português</th>
                    <th className="px-3 py-1.5 font-bold text-center">Média Geral</th>
                    <th className="px-3 py-1.5 font-bold text-center">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  <tr>
                    <td className="px-3 py-1.5">01</td>
                    <td className="px-3 py-1.5 font-bold text-primary">Afonso Mateus Lemba</td>
                    <td className="px-3 py-1.5 text-center font-bold text-success">16</td>
                    <td className="px-3 py-1.5 text-center font-bold text-success">15</td>
                    <td className="px-3 py-1.5 text-center font-bold text-success">17</td>
                    <td className="px-3 py-1.5 text-center font-bold text-success">14</td>
                    <td className="px-3 py-1.5 text-center font-bold text-secondary">15.5 v.</td>
                    <td className="px-3 py-1.5 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">Transita</span></td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5">02</td>
                    <td className="px-3 py-1.5 font-bold text-primary">Beatriz Domingos Neto</td>
                    <td className="px-3 py-1.5 text-center font-bold text-error">08</td>
                    <td className="px-3 py-1.5 text-center font-bold text-success">12</td>
                    <td className="px-3 py-1.5 text-center font-bold text-success">10</td>
                    <td className="px-3 py-1.5 text-center font-bold text-success">13</td>
                    <td className="px-3 py-1.5 text-center font-bold text-outline">10.8 v.</td>
                    <td className="px-3 py-1.5 text-center"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">Recurso</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Calendário Escolar */}
      {activeTab === 'calendario' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-3">
          <h2 className="font-title-lg text-lg font-bold text-primary">Calendário Escolar Oficial 2026/2027</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 border border-border-subtle rounded-xl bg-surface-container-low/30">
              <span className="font-bold text-secondary uppercase text-[10px] block mb-1">1º TRIMESTRE</span>
              <p className="font-bold text-primary text-sm mb-1">01 Set 2026 - 15 Dez 2026</p>
              <p className="text-on-surface-variant">Exames de Fim do 1º Trimestre: 01 a 10 de Dezembro.</p>
            </div>
            <div className="p-3 border border-border-subtle rounded-xl bg-surface-container-low/30">
              <span className="font-bold text-secondary uppercase text-[10px] block mb-1">2º TRIMESTRE</span>
              <p className="font-bold text-primary text-sm mb-1">05 Jan 2027 - 28 Mar 2027</p>
              <p className="text-on-surface-variant">Pausa do Carnaval: 15 a 17 de Fevereiro.</p>
            </div>
            <div className="p-3 border border-border-subtle rounded-xl bg-surface-container-low/30">
              <span className="font-bold text-secondary uppercase text-[10px] block mb-1">3º TRIMESTRE</span>
              <p className="font-bold text-primary text-sm mb-1">07 Abr 2027 - 30 Jun 2027</p>
              <p className="text-on-surface-variant">Exames Nacionais e Defesa de Trabalhos Finais.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar / Editar Turma */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-xl max-w-md w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2">
              <h3 className="font-bold text-primary text-base">
                {editingTurma ? `Editar Turma: ${editingTurma.codigo}` : 'Nova Turma Académica'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-outline hover:text-primary cursor-pointer">
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>

            <form onSubmit={handleSaveTurma} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Código da Turma:</label>
                <input
                  type="text"
                  placeholder="Ex: 11C-BIO"
                  value={formCodigo}
                  onChange={(e) => setFormCodigo(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Designação / Nome:</label>
                <input
                  type="text"
                  placeholder="Ex: 11º Ano C - Biologia e Geologia"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Curso:</label>
                  <select
                    value={formCurso}
                    onChange={(e) => setFormCurso(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  >
                    <option value="Ciências Físicas e Biológicas">Ciências Físicas</option>
                    <option value="Ciências Humanas e Sociais">Ciências Humanas</option>
                    <option value="Técnico de Informática">Informática</option>
                    <option value="Gestão e Economia">Gestão e Economia</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Classe:</label>
                  <select
                    value={formClasse}
                    onChange={(e) => setFormClasse(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  >
                    <option value="10º Ano">10º Ano</option>
                    <option value="11º Ano">11º Ano</option>
                    <option value="12º Ano">12º Ano</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Período:</label>
                  <select
                    value={formPeriodo}
                    onChange={(e) => setFormPeriodo(e.target.value as any)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  >
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Capacidade Máx.:</label>
                  <input
                    type="number"
                    value={formCapacidade}
                    onChange={(e) => setFormCapacidade(Number(e.target.value))}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Sala de Aula:</label>
                <input
                  type="text"
                  value={formSala}
                  onChange={(e) => setFormSala(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Diretor de Turma (Docente):</label>
                <select
                  value={formDiretor}
                  onChange={(e) => setFormDiretor(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                >
                  <option value="Prof. Domingos Henriques">Prof. Domingos Henriques</option>
                  <option value="Dra. Maria Eunice">Dra. Maria Eunice</option>
                  <option value="Prof. António Costa">Prof. António Costa</option>
                  <option value="Prof.ª Teresa Bento">Prof.ª Teresa Bento</option>
                </select>
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
                  {editingTurma ? 'Guardar Alterações' : 'Criar Turma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminação de Turma */}
      {deletingTurma && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-xl max-w-sm w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex items-center gap-3 text-error">
              <AlertCircle className="w-6 h-6 stroke-[1.75]" />
              <h3 className="font-bold text-primary text-base">Eliminar Turma</h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              Tem a certeza que deseja eliminar a turma <strong className="text-primary">{deletingTurma.codigo} - {deletingTurma.nome}</strong>? Esta ação removerá a associação de horários e pautas.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingTurma(null)}
                className="px-3 py-1.5 border border-border-subtle rounded-lg text-xs font-bold text-on-surface-variant cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteTurmaConfirm}
                className="px-4 py-1.5 bg-error text-surface-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer transition-all"
              >
                Sim, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gerir Alunos da Turma */}
      {viewingTurmaStudents && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-xl max-w-lg w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2">
              <div>
                <h3 className="font-bold text-primary text-base">Estudantes Inscritos na Turma</h3>
                <p className="text-xs text-outline">{viewingTurmaStudents.codigo} - {viewingTurmaStudents.nome}</p>
              </div>
              <button onClick={() => setViewingTurmaStudents(null)} className="text-outline hover:text-primary cursor-pointer">
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>

            {/* Form Add Student */}
            <div className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="Nome do novo estudante para inscrever..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="flex-1 bg-surface-container-low border border-border-subtle rounded-lg p-2"
              />
              <button
                onClick={() => handleAddStudentToTurma(viewingTurmaStudents.id)}
                className="bg-primary text-surface-white px-3 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap"
              >
                + Adicionar
              </button>
            </div>

            {/* List of Students */}
            <div className="max-h-60 overflow-y-auto divide-y divide-border-subtle border border-border-subtle rounded-lg text-xs">
              {(turmaStudentsMap[viewingTurmaStudents.id] || []).length === 0 ? (
                <div className="p-4 text-center text-outline">Nenhum estudante associado a esta turma.</div>
              ) : (
                (turmaStudentsMap[viewingTurmaStudents.id] || []).map((studentName, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between hover:bg-surface-container-low/50">
                    <span className="font-bold text-primary">{i + 1}. {studentName}</span>
                    <button
                      onClick={() => handleRemoveStudentFromTurma(viewingTurmaStudents.id, studentName)}
                      className="text-error hover:text-red-700 font-semibold cursor-pointer"
                      title="Remover da Turma"
                    >
                      Remover
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingTurmaStudents(null)}
                className="px-4 py-1.5 bg-primary text-surface-white rounded-lg text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Aula no Horário */}
      {editingCell && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-surface-white rounded-xl max-w-md w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <div>
                <h3 className="font-bold text-primary text-base">Atribuir / Editar Aula</h3>
                <p className="text-on-surface-variant text-[11px]">
                  {editingCell.dayName} • {editingCell.horario}
                </p>
              </div>
              <button
                onClick={() => setEditingCell(null)}
                className="text-outline hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            <form onSubmit={handleSaveCell} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Disciplina / Matéria:</label>
                <input
                  type="text"
                  placeholder="Ex: Matemática, Física, Química, Língua Portuguesa..."
                  value={cellDisciplina}
                  onChange={(e) => setCellDisciplina(e.target.value)}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 focus:border-secondary focus:outline-none font-bold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Docente / Professor Responsável:</label>
                <input
                  type="text"
                  placeholder="Ex: Prof. Domingos Henriques, Dra. Eunice..."
                  value={cellProfessor}
                  onChange={(e) => setCellProfessor(e.target.value)}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Cor do Bloco Visual:</label>
                <div className="flex gap-2">
                  {[
                    { id: 'primary', label: 'Azul (Geral)', class: 'bg-primary/20 text-primary border-primary' },
                    { id: 'secondary', label: 'Verde/Secundário', class: 'bg-secondary/20 text-secondary border-secondary' },
                    { id: 'info', label: 'Ciano/Ciências', class: 'bg-info/20 text-info border-info' },
                    { id: 'warning', label: 'Âmbar/Línguas', class: 'bg-warning/20 text-warning border-warning' },
                    { id: 'success', label: 'Esmeralda/Atividades', class: 'bg-success/20 text-success border-success' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCellCor(c.id as any)}
                      className={`px-2.5 py-1 rounded border text-[11px] font-bold cursor-pointer transition-all ${c.class} ${
                        cellCor === c.id ? 'ring-2 ring-primary ring-offset-1 font-extrabold' : 'opacity-60'
                      }`}
                    >
                      {c.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border-subtle">
                {editingCell.currentCell ? (
                  <button
                    type="button"
                    onClick={handleRemoveCell}
                    className="px-3 py-1.5 bg-error/10 text-error border border-error/20 hover:bg-error/20 rounded-lg font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Deixar Horário Livre
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCell(null)}
                    className="px-3 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-primary text-surface-white rounded-lg font-bold hover:bg-primary/90 cursor-pointer transition-all"
                  >
                    Guardar Aula
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Bloco de Horário */}
      {isAddSlotModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-surface-white rounded-xl max-w-md w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h3 className="font-bold text-primary text-base">Adicionar Bloco de Horário</h3>
              <button
                onClick={() => setIsAddSlotModalOpen(false)}
                className="text-outline hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            <form onSubmit={handleAddSlotRow} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Intervalo de Tempo (Horário):</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 11:05 - 11:50 ou 12:00 - 12:45"
                  value={newSlotHorario}
                  onChange={(e) => setNewSlotHorario(e.target.value)}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 focus:border-secondary focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isIntervaloCheck"
                  checked={newSlotIsIntervalo}
                  onChange={(e) => setNewSlotIsIntervalo(e.target.checked)}
                  className="rounded text-secondary focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="isIntervaloCheck" className="font-bold cursor-pointer">
                  Este bloco é um Intervalo / Pausa Lectiva
                </label>
              </div>

              {newSlotIsIntervalo && (
                <div>
                  <label className="block font-bold mb-1">Descrição do Intervalo:</label>
                  <input
                    type="text"
                    placeholder="Ex: INTERVALO DE ALMOÇO (12:00 - 13:00)"
                    value={newSlotDescIntervalo}
                    onChange={(e) => setNewSlotDescIntervalo(e.target.value)}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 focus:border-secondary focus:outline-none font-bold"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsAddSlotModalOpen(false)}
                  className="px-3 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface-white rounded-lg font-bold hover:bg-primary/90 cursor-pointer transition-all"
                >
                  Criar Bloco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
