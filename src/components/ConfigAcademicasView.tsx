import React, { useState } from 'react';
import { ActiveView } from '../types';
import { SlidersHorizontal, Save, Calendar, Layers, BookOpen, CheckSquare, Plus, Trash2, Pencil as Edit3, X, TrendingUp, CheckCircle2, Award } from 'lucide-react';

interface ConfigAcademicasViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

interface CursoItem {
  id: string;
  nome: string;
  nivel: string;
  disciplinas: string[];
}

interface NivelEnsino {
  id: string;
  nome: string;
  descricao: string;
  classes: string[];
  ativo: boolean;
}

export const ConfigAcademicasView: React.FC<ConfigAcademicasViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'niveis_classes' | 'cursos_disciplinas' | 'criterios'>('geral');

  // Níveis de Ensino & Classes state
  const [niveis, setNiveis] = useState<NivelEnsino[]>([
    {
      id: 'niv-1',
      nome: 'Ensino Primário (I Ciclo Fundamental)',
      descricao: 'Etapa inicial da formação básica da instituição (1ª a 6ª classe)',
      classes: ['1ª Classe', '2ª Classe', '3ª Classe', '4ª Classe', '5ª Classe', '6ª Classe'],
      ativo: true,
    },
    {
      id: 'niv-2',
      nome: 'Ensino Geral (I Ciclo Secundário)',
      descricao: 'Ciclo preparatório do ensino secundário (7ª a 9ª classe)',
      classes: ['7ª Classe', '8ª Classe', '9ª Classe'],
      ativo: true,
    },
    {
      id: 'niv-3',
      nome: 'Ensino Secundário Técnico & Geral (II Ciclo)',
      descricao: 'Formação pré-universitária e técnica profissionalizante',
      classes: ['10º Ano', '11º Ano', '12º Ano', '13º Ano (Técnico)'],
      ativo: true,
    },
  ]);

  const [isNivelModalOpen, setIsNivelModalOpen] = useState(false);
  const [editingNivel, setEditingNivel] = useState<NivelEnsino | null>(null);
  const [deletingNivel, setDeletingNivel] = useState<NivelEnsino | null>(null);

  const [formNivelNome, setFormNivelNome] = useState('');
  const [formNivelDesc, setFormNivelDesc] = useState('');
  const [formNivelClasses, setFormNivelClasses] = useState('');
  const [formNivelAtivo, setFormNivelAtivo] = useState(true);

  const [addingClassNivelId, setAddingClassNivelId] = useState<string | null>(null);
  const [newClassNameInput, setNewClassNameInput] = useState('');
  const [activeNivelMenuId, setActiveNivelMenuId] = useState<string | null>(null);

  const openCreateNivelModal = () => {
    setEditingNivel(null);
    setFormNivelNome('');
    setFormNivelDesc('');
    setFormNivelClasses('');
    setFormNivelAtivo(true);
    setIsNivelModalOpen(true);
  };

  const openEditNivelModal = (nivel: NivelEnsino) => {
    setEditingNivel(nivel);
    setFormNivelNome(nivel.nome);
    setFormNivelDesc(nivel.descricao);
    setFormNivelClasses(nivel.classes.join(', '));
    setFormNivelAtivo(nivel.ativo);
    setIsNivelModalOpen(true);
  };

  const handleSaveNivel = (e: React.FormEvent) => {
    e.preventDefault();
    const classArr = formNivelClasses
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (editingNivel) {
      setNiveis(
        niveis.map((n) =>
          n.id === editingNivel.id
            ? {
                ...n,
                nome: formNivelNome,
                descricao: formNivelDesc,
                classes: classArr.length > 0 ? classArr : n.classes,
                ativo: formNivelAtivo,
              }
            : n
        )
      );
      onShowToast(`Nível de ensino "${formNivelNome}" atualizado com sucesso!`);
    } else {
      const newNivel: NivelEnsino = {
        id: `niv-${Date.now()}`,
        nome: formNivelNome,
        descricao: formNivelDesc,
        classes: classArr.length > 0 ? classArr : ['1ª Classe'],
        ativo: formNivelAtivo,
      };
      setNiveis([...niveis, newNivel]);
      onShowToast(`Novo nível de ensino "${formNivelNome}" criado com sucesso!`);
    }
    setIsNivelModalOpen(false);
  };

  const handleAddClassToNivel = (nivelId: string) => {
    if (!newClassNameInput.trim()) return;
    const newClass = newClassNameInput.trim();
    setNiveis(
      niveis.map((n) => {
        if (n.id === nivelId) {
          if (n.classes.includes(newClass)) return n;
          return { ...n, classes: [...n.classes, newClass] };
        }
        return n;
      })
    );
    onShowToast(`Classe "${newClass}" adicionada ao nível.`);
    setNewClassNameInput('');
    setAddingClassNivelId(null);
  };

  const handleRemoveClassFromNivel = (nivelId: string, className: string) => {
    setNiveis(
      niveis.map((n) => {
        if (n.id === nivelId) {
          return { ...n, classes: n.classes.filter((c) => c !== className) };
        }
        return n;
      })
    );
    onShowToast(`Classe "${className}" removida.`);
  };

  const handleToggleNivelStatus = (nivelId: string) => {
    setNiveis(
      niveis.map((n) => (n.id === nivelId ? { ...n, ativo: !n.ativo } : n))
    );
    onShowToast(`Estado do nível de ensino alterado.`);
  };

  const handleDeleteNivelConfirm = () => {
    if (!deletingNivel) return;
    setNiveis(niveis.filter((n) => n.id !== deletingNivel.id));
    onShowToast(`Nível de ensino "${deletingNivel.nome}" removido.`);
    setDeletingNivel(null);
  };

  // Cursos CRUD state
  const [cursos, setCursos] = useState<CursoItem[]>([
    {
      id: 'c-1',
      nome: 'Ciências Físicas e Biológicas',
      nivel: 'Secundário Geral',
      disciplinas: ['Matemática', 'Física', 'Química', 'Biologia', 'L. Portuguesa'],
    },
    {
      id: 'c-2',
      nome: 'Técnico de Informática',
      nivel: 'Secundário Técnico',
      disciplinas: ['Programação', 'Algoritmos', 'Redes', 'SEAC', 'Matemática'],
    },
    {
      id: 'c-3',
      nome: 'Ciências Humanas e Sociais',
      nivel: 'Secundário Geral',
      disciplinas: ['História', 'Geografia', 'Filosofia', 'L. Portuguesa', 'Inglês'],
    },
    {
      id: 'c-4',
      nome: 'Gestão e Economia',
      nivel: 'Secundário Técnico',
      disciplinas: ['Contabilidade', 'Economia', 'Gestão', 'Matemática', 'Direito'],
    },
  ]);

  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<CursoItem | null>(null);
  const [deletingCurso, setDeletingCurso] = useState<CursoItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [formCursoNome, setFormCursoNome] = useState('');
  const [formCursoNivel, setFormCursoNivel] = useState('Secundário Geral');
  const [formCursoDisciplinas, setFormCursoDisciplinas] = useState('');

  const openCreateCursoModal = () => {
    setEditingCurso(null);
    setFormCursoNome('');
    setFormCursoNivel('Secundário Geral');
    setFormCursoDisciplinas('');
    setIsCursoModalOpen(true);
  };

  const openEditCursoModal = (curso: CursoItem) => {
    setEditingCurso(curso);
    setFormCursoNome(curso.nome);
    setFormCursoNivel(curso.nivel);
    setFormCursoDisciplinas(curso.disciplinas.join(', '));
    setIsCursoModalOpen(true);
  };

  const handleSaveCurso = (e: React.FormEvent) => {
    e.preventDefault();
    const discArr = formCursoDisciplinas.split(',').map((d) => d.trim()).filter(Boolean);

    if (editingCurso) {
      setCursos(
        cursos.map((c) =>
          c.id === editingCurso.id
            ? {
                ...c,
                nome: formCursoNome,
                nivel: formCursoNivel,
                disciplinas: discArr.length > 0 ? discArr : c.disciplinas,
              }
            : c
        )
      );
      onShowToast(`Curso ${formCursoNome} atualizado com sucesso!`);
    } else {
      const newCurso: CursoItem = {
        id: `c-${Date.now()}`,
        nome: formCursoNome,
        nivel: formCursoNivel,
        disciplinas: discArr.length > 0 ? discArr : ['Geral'],
      };
      setCursos([...cursos, newCurso]);
      onShowToast(`Novo curso ${formCursoNome} criado com sucesso!`);
    }
    setIsCursoModalOpen(false);
  };

  const handleDeleteCursoConfirm = () => {
    if (!deletingCurso) return;
    setCursos(cursos.filter((c) => c.id !== deletingCurso.id));
    onShowToast(`Curso ${deletingCurso.nome} removido.`);
    setDeletingCurso(null);
  };

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* Quick Metrics Bar - Matching Reference Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Ano Letivo Corrente */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div>
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Ano Letivo Corrente</span>
            <span className="text-xl font-bold text-primary leading-none">2026/2027</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Em Curso
          </span>
        </div>

        {/* Card 2: Níveis & Classes */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Níveis & Classes</span>
              <span className="text-success font-bold text-[12px]">
                3 Níveis <span className="text-[10px] font-medium text-outline ml-0.5">/ 13 Classes</span>
              </span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-success h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>Primário • Geral • Técnico</span>
              <span className="text-success">100% Configurado</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cursos & Matriz */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Cursos & Disciplinas</span>
              <span className="text-info font-bold text-[12px]">
                4 Cursos <span className="text-[10px] font-medium text-outline ml-0.5">/ 20 Disciplinas</span>
              </span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-info h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>Matrizes Ativas</span>
              <span className="text-info">Atualizado</span>
            </div>
          </div>
        </div>

        {/* Card 4: Critérios de Aprovação */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-2.5 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Critérios de Transição
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-primary leading-none">≥ 10.0</span>
              <span className="text-[10px] text-outline font-medium">Valores</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold">
              3 Trimestres
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm">
        <h1 className="text-lg font-bold text-primary flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary stroke-[1.75]" />
          Configurações Académicas
        </h1>

        <button
          onClick={() => onShowToast('Todas as configurações académicas foram salvas e sincronizadas!')}
          className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 stroke-[1.75]" />
          Guardar Parâmetros
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('geral')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'geral'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          Ano Letivo & Períodos
        </button>

        <button
          onClick={() => setActiveTab('niveis_classes')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'niveis_classes'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">layers</span>
          Níveis de Ensino & Classes
        </button>

        <button
          onClick={() => setActiveTab('cursos_disciplinas')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'cursos_disciplinas'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">menu_book</span>
          Cursos & Disciplinas
        </button>

        <button
          onClick={() => setActiveTab('criterios')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'criterios'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">verified</span>
          Critérios de Aprovação
        </button>
      </div>

      {/* Tab 1: Ano Letivo */}
      {activeTab === 'geral' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-border-subtle rounded-xl bg-surface-container-low/30 space-y-3">
              <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">event_repeat</span>
                Ano Letivo Corrente
              </h3>
              <div>
                <label className="block font-bold mb-1">Designação do Ano Letivo:</label>
                <input
                  type="text"
                  defaultValue="2026/2027"
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Início:</label>
                  <input
                    type="date"
                    defaultValue="2026-09-01"
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Término:</label>
                  <input
                    type="date"
                    defaultValue="2027-06-30"
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-border-subtle rounded-xl bg-surface-container-low/30 space-y-3">
              <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-info text-[18px]">timelapse</span>
                Divisão dos Trimestres
              </h3>
              <p className="text-on-surface-variant">Sistema de 3 Trimestres Académicos Obrigatorios:</p>
              <ul className="space-y-1 list-disc pl-4 text-on-surface font-semibold">
                <li>1º Trimestre: 01 Setembro a 15 Dezembro</li>
                <li>2º Trimestre: 05 Janeiro a 28 Março</li>
                <li>3º Trimestre: 07 Abril a 30 Junho</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Níveis e Classes */}
      {activeTab === 'niveis_classes' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-title-lg text-lg font-bold text-primary">Níveis de Ensino e Classes Ativas</h2>
              <p className="text-on-surface-variant">
                Estrutura de níveis escolares da instituição e gestão individual de cada classe lecionada.
              </p>
            </div>
            <button
              onClick={openCreateNivelModal}
              className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[1.75]" />
              Novo Nível de Ensino
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {niveis.map((nivel) => (
              <div
                key={nivel.id}
                className={`p-4 border rounded-xl space-y-3 transition-all ${
                  nivel.ativo
                    ? 'border-border-subtle bg-surface-container-low/30'
                    : 'border-border-subtle/50 bg-surface-container-low/10 opacity-75'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-primary text-sm">{nivel.nome}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          nivel.ativo
                            ? 'bg-success/15 text-success'
                            : 'bg-outline/15 text-outline'
                        }`}
                      >
                        {nivel.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-[11px] mt-0.5">{nivel.descricao}</p>
                  </div>

                  {/* 3-dots Menu for Nível */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveNivelMenuId(activeNivelMenuId === nivel.id ? null : nivel.id)}
                      className="text-outline hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-variant/50 cursor-pointer"
                      title="Opções"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>

                    {activeNivelMenuId === nivel.id && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setActiveNivelMenuId(null)} />
                        <div className="absolute right-0 top-8 w-48 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                          <button
                            onClick={() => {
                              setActiveNivelMenuId(null);
                              openEditNivelModal(nivel);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-primary"
                          >
                            <Edit3 className="w-3.5 h-3.5 stroke-[1.75]" /> Editar Nível
                          </button>
                          <button
                            onClick={() => {
                              setActiveNivelMenuId(null);
                              setAddingClassNivelId(nivel.id);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-secondary"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[1.75]" /> Adicionar Classe
                          </button>
                          <button
                            onClick={() => {
                              setActiveNivelMenuId(null);
                              handleToggleNivelStatus(nivel.id);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-on-surface"
                          >
                            <span className="material-symbols-outlined text-[16px]">sync</span>
                            {nivel.ativo ? 'Desativar Nível' : 'Ativar Nível'}
                          </button>
                          <button
                            onClick={() => {
                              setActiveNivelMenuId(null);
                              setDeletingNivel(nivel);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-error"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" /> Eliminar Nível
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Classes list badges */}
                <div className="pt-1">
                  <p className="font-bold text-[11px] text-outline mb-1.5 uppercase tracking-wider">
                    Classes do Nível ({nivel.classes.length}):
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {nivel.classes.map((cName, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary border border-primary/20"
                      >
                        {cName}
                        <button
                          onClick={() => handleRemoveClassFromNivel(nivel.id, cName)}
                          className="hover:text-error transition-colors cursor-pointer ml-0.5"
                          title={`Remover ${cName}`}
                        >
                          <X className="w-3 h-3 stroke-[2]" />
                        </button>
                      </span>
                    ))}

                    {addingClassNivelId === nivel.id ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="Ex: 5ª Classe"
                          value={newClassNameInput}
                          onChange={(e) => setNewClassNameInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddClassToNivel(nivel.id);
                            }
                          }}
                          className="bg-surface-white border border-secondary rounded px-2 py-0.5 text-xs w-28 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddClassToNivel(nivel.id)}
                          className="bg-primary text-surface-white px-2 py-0.5 rounded text-xs font-bold hover:bg-primary/90 cursor-pointer"
                        >
                          OK
                        </button>
                        <button
                          onClick={() => setAddingClassNivelId(null)}
                          className="text-outline hover:text-primary cursor-pointer p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAddingClassNivelId(nivel.id);
                          setNewClassNameInput('');
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold border border-dashed border-primary text-primary hover:bg-primary/10 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3 stroke-[2]" />
                        Adicionar Classe
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Cursos e Disciplinas */}
      {activeTab === 'cursos_disciplinas' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-title-lg text-lg font-bold text-primary">Catálogo de Cursos & Matriz Curricular</h2>
              <p className="text-on-surface-variant">Gestão de cursos, áreas do conhecimento e disciplinas obrigatórias.</p>
            </div>
            <button
              onClick={openCreateCursoModal}
              className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 stroke-[1.75]" />
              Novo Curso
            </button>
          </div>

          <div className="border border-border-subtle rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3 py-1.5 font-bold">Curso</th>
                  <th className="px-3 py-1.5 font-bold">Nível</th>
                  <th className="px-3 py-1.5 font-bold">Disciplinas da Matriz</th>
                  <th className="px-3 py-1.5 font-bold text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {cursos.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-3 py-2 font-bold text-primary">{c.nome}</td>
                    <td className="px-3 py-2 text-on-surface-variant">{c.nivel}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {c.disciplinas.map((d, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === c.id ? null : c.id)}
                        className="text-outline hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-variant/50 cursor-pointer"
                        title="Opções"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>

                      {activeMenuId === c.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                          <div className="absolute right-2 top-8 w-44 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                openEditCursoModal(c);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-primary"
                            >
                              <Edit3 className="w-3.5 h-3.5 stroke-[1.75]" /> Editar Curso
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setDeletingCurso(c);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-error"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" /> Eliminar Curso
                            </button>
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

      {/* Tab 4: Critérios de Aprovação */}
      {activeTab === 'criterios' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm space-y-3 text-xs">
          <h2 className="font-title-lg text-lg font-bold text-primary">Critérios de Transição e Ponderação de Notas</h2>
          <div className="p-4 border border-border-subtle rounded-xl bg-surface-container-low/30 space-y-2">
            <p className="font-bold text-primary">Fórmula de Média Anual (MA):</p>
            <p className="text-on-surface font-mono bg-surface-white p-2 rounded border border-border-subtle">
              MA = (1º Trimestre * 0.30) + (2º Trimestre * 0.30) + (3º Trimestre * 0.40)
            </p>
            <p className="text-on-surface-variant">Nota Mínima de Transição Direta: 10.0 valores.</p>
            <p className="text-on-surface-variant">Número Máximo de Deficiências (Recurso): 2 Disciplinas.</p>
          </div>
        </div>
      )}

      {/* Modal Criar / Editar Curso */}
      {isCursoModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-surface-white rounded-xl max-w-md w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2">
              <h3 className="font-bold text-primary text-base">
                {editingCurso ? `Editar Curso: ${editingCurso.nome}` : 'Novo Curso Académico'}
              </h3>
              <button onClick={() => setIsCursoModalOpen(false)} className="text-outline hover:text-primary cursor-pointer">
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>

            <form onSubmit={handleSaveCurso} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Nome do Curso:</label>
                <input
                  type="text"
                  placeholder="Ex: Engenharia Mecatrónica"
                  value={formCursoNome}
                  onChange={(e) => setFormCursoNome(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Nível de Ensino:</label>
                <select
                  value={formCursoNivel}
                  onChange={(e) => setFormCursoNivel(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                >
                  <option value="Secundário Geral">Secundário Geral</option>
                  <option value="Secundário Técnico">Secundário Técnico</option>
                  <option value="Ensino Geral">Ensino Geral</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Disciplinas da Matriz (separadas por vírgula):</label>
                <input
                  type="text"
                  placeholder="Ex: Matemática, Física, Química, Programação"
                  value={formCursoDisciplinas}
                  onChange={(e) => setFormCursoDisciplinas(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCursoModalOpen(false)}
                  className="px-3 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface-white rounded-lg font-bold hover:bg-primary/90 cursor-pointer transition-all"
                >
                  {editingCurso ? 'Guardar Alterações' : 'Criar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminação de Curso */}
      {deletingCurso && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-surface-white rounded-xl max-w-sm w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <h3 className="font-bold text-error text-base">Eliminar Curso</h3>
            <p className="text-on-surface-variant">
              Tem a certeza que deseja remover o curso <strong className="text-primary">{deletingCurso.nome}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingCurso(null)}
                className="px-3 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCursoConfirm}
                className="px-4 py-1.5 bg-error text-surface-white rounded-lg font-bold hover:bg-red-700 cursor-pointer transition-all"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar/Editar Nível de Ensino */}
      {isNivelModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-surface-white rounded-xl max-w-md w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h3 className="font-bold text-primary text-base">
                {editingNivel ? 'Editar Nível de Ensino' : 'Novo Nível de Ensino'}
              </h3>
              <button
                onClick={() => setIsNivelModalOpen(false)}
                className="text-outline hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            <form onSubmit={handleSaveNivel} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Nome do Nível de Ensino:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ensino Primário (I Ciclo)"
                  value={formNivelNome}
                  onChange={(e) => setFormNivelNome(e.target.value)}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Descrição / Enquadramento:</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Formação inicial obrigatória para crianças dos 6 aos 12 anos..."
                  value={formNivelDesc}
                  onChange={(e) => setFormNivelDesc(e.target.value)}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Classes do Nível (separadas por vírgula):</label>
                <input
                  type="text"
                  placeholder="Ex: 1ª Classe, 2ª Classe, 3ª Classe, 4ª Classe"
                  value={formNivelClasses}
                  onChange={(e) => setFormNivelClasses(e.target.value)}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 focus:border-secondary focus:outline-none"
                />
                <p className="text-[10px] text-outline mt-1">
                  Pode introduzir várias classes separadas por vírgulas.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="nivelAtivoCheck"
                  checked={formNivelAtivo}
                  onChange={(e) => setFormNivelAtivo(e.target.checked)}
                  className="rounded text-secondary focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="nivelAtivoCheck" className="font-bold cursor-pointer">
                  Nível Ativo e Disponível para Matrículas
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsNivelModalOpen(false)}
                  className="px-3 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface-white rounded-lg font-bold hover:bg-primary/90 cursor-pointer transition-all"
                >
                  {editingNivel ? 'Guardar Alterações' : 'Criar Nível'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminação de Nível */}
      {deletingNivel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-surface-white rounded-xl max-w-sm w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <h3 className="font-bold text-error text-base">Eliminar Nível de Ensino</h3>
            <p className="text-on-surface-variant">
              Tem a certeza que deseja remover o nível de ensino <strong className="text-primary">{deletingNivel.nome}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingNivel(null)}
                className="px-3 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteNivelConfirm}
                className="px-4 py-1.5 bg-error text-surface-white rounded-lg font-bold hover:bg-red-700 cursor-pointer transition-all"
              >
                Sim, Remover Nível
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
