import React, { useState } from 'react';
import { ActiveView, Structure, StructureType } from '../types';
import { useAccess } from '../context/AccessContext';
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Power,
  Users,
  GraduationCap,
  MapPin,
  X,
  TriangleAlert as AlertTriangle,
  School,
  Landmark,
  BookOpen,
  Briefcase,
  Layers,
  MoreVertical,
} from 'lucide-react';

interface Props {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

const tipoOptions: { value: StructureType; label: string; icon: React.ReactNode }[] = [
  { value: 'college', label: 'Colégio', icon: <School className="w-4 h-4 text-secondary" /> },
  { value: 'campus', label: 'Campus Universitário', icon: <Landmark className="w-4 h-4 text-primary" /> },
  { value: 'faculty', label: 'Faculdade', icon: <BookOpen className="w-4 h-4 text-info" /> },
  { value: 'polo', label: 'Polo de Formação', icon: <MapPin className="w-4 h-4 text-success" /> },
  { value: 'center', label: 'Centro de Estudos', icon: <Briefcase className="w-4 h-4 text-warning" /> },
  { value: 'unit', label: 'Unidade Operacional', icon: <Layers className="w-4 h-4 text-outline" /> },
];

export const EstruturasView: React.FC<Props> = ({ onShowToast }) => {
  const { structures, addStructure, updateStructure, toggleStructureStatus, switchStructure, currentStructureId } =
    useAccess();

  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterEstado, setFilterEstado] = useState('Todos');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStruct, setEditingStruct] = useState<Structure | null>(null);
  const [confirmStatusStruct, setConfirmStatusStruct] = useState<Structure | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const [form, setForm] = useState({
    codigo: '',
    nome: '',
    tipo: 'college' as StructureType,
    morada: '',
    diretorResponsavel: '',
    estudantesCount: 0,
    professoresCount: 0,
    estado: 'Ativo' as 'Ativo' | 'Inativo',
  });

  const totalEstudantes = structures.reduce((acc, s) => acc + s.estudantesCount, 0);
  const totalProfessores = structures.reduce((acc, s) => acc + s.professoresCount, 0);
  const estruturasAtivas = structures.filter((s) => s.estado === 'Ativo').length;

  const openCreateModal = () => {
    setEditingStruct(null);
    setForm({
      codigo: `EST-0${structures.length + 1}`,
      nome: '',
      tipo: 'college',
      morada: '',
      diretorResponsavel: '',
      estudantesCount: 0,
      professoresCount: 0,
      estado: 'Ativo',
    });
    setModalOpen(true);
  };

  const openEditModal = (struct: Structure) => {
    setEditingStruct(struct);
    setForm({
      codigo: struct.codigo,
      nome: struct.nome,
      tipo: struct.tipo,
      morada: struct.morada,
      diretorResponsavel: struct.diretorResponsavel,
      estudantesCount: struct.estudantesCount,
      professoresCount: struct.professoresCount,
      estado: struct.estado,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tipoObj = tipoOptions.find((t) => t.value === form.tipo);
    const tipoLabel = tipoObj ? tipoObj.label : 'Estrutura';

    if (editingStruct) {
      updateStructure(editingStruct.id, {
        ...form,
        tipoLabel,
      });
      onShowToast(`Estrutura "${form.nome}" atualizada com sucesso!`);
    } else {
      addStructure({
        institutionId: 'inst-01',
        codigo: form.codigo,
        nome: form.nome,
        tipo: form.tipo,
        tipoLabel,
        morada: form.morada,
        diretorResponsavel: form.diretorResponsavel,
        estudantesCount: Number(form.estudantesCount),
        professoresCount: Number(form.professoresCount),
        estado: form.estado,
      });
      onShowToast(`Estrutura "${form.nome}" criada com sucesso!`);
    }
    setModalOpen(false);
  };

  const handleToggleStatus = () => {
    if (!confirmStatusStruct) return;
    toggleStructureStatus(confirmStatusStruct.id);
    const newEstado = confirmStatusStruct.estado === 'Ativo' ? 'Inativa' : 'Ativada';
    onShowToast(`Estrutura "${confirmStatusStruct.nome}" ${newEstado} com sucesso.`);
    setConfirmStatusStruct(null);
  };

  const filteredStructures = structures.filter((s) => {
    const matchSearch = `${s.nome} ${s.codigo} ${s.diretorResponsavel} ${s.morada}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchTipo = filterTipo === 'Todos' || s.tipo === filterTipo;
    const matchEstado = filterEstado === 'Todos' || s.estado === filterEstado;
    return matchSearch && matchTipo && matchEstado;
  });

  return (
    <div className="mt-header-height w-full flex flex-col gap-4 p-4">
      {/* Header Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary stroke-[1.75]" />
            Estruturas & Unidades Operacionais
          </h1>
          <p className="text-xs text-on-surface-variant">
            Gestão de colégios, campi, faculdades e polos pertencentes à instituição.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary-container text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2]" /> Nova Estrutura
        </button>
      </div>

      {/* KPI Cards — Enterprise Compact (68px height) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-border-subtle/30 rounded-lg p-3.5 h-[68px] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Total de Estruturas</p>
            <p className="text-lg font-bold text-primary leading-tight mt-0.5">{structures.length}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle/30 rounded-lg p-3.5 h-[68px] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Estudantes Consolidados</p>
            <p className="text-lg font-bold text-primary leading-tight mt-0.5">{totalEstudantes.toLocaleString('pt-PT')}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle/30 rounded-lg p-3.5 h-[68px] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Corpo Docente Ativo</p>
            <p className="text-lg font-bold text-primary leading-tight mt-0.5">{totalProfessores.toLocaleString('pt-PT')}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle/30 rounded-lg p-3.5 h-[68px] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Unidades Operacionais</p>
            <p className="text-lg font-bold text-primary leading-tight mt-0.5">{estruturasAtivas} Ativas</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Power className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-primary py-1.5 cursor-pointer font-medium"
            >
              <option value="Todos">Tipo: Todos</option>
              <option value="college">Colégios</option>
              <option value="campus">Campi Universitários</option>
              <option value="faculty">Faculdades</option>
              <option value="polo">Polos de Formação</option>
              <option value="center">Centros de Estudos</option>
              <option value="unit">Unidades Operacionais</option>
            </select>

            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-primary py-1.5 cursor-pointer font-medium"
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Ativo">Ativos</option>
              <option value="Inativo">Inativos</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, código ou diretor..."
              className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium w-64"
            />
          </div>
        </div>

        {/* Structures Table */}
        <div className="overflow-x-auto border border-border-subtle rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-3.5 py-3 text-left">Estrutura / Código</th>
                <th className="px-3.5 py-3 text-left">Tipo</th>
                <th className="px-3.5 py-3 text-left">Diretor Responsável</th>
                <th className="px-3.5 py-3 text-center">Estudantes</th>
                <th className="px-3.5 py-3 text-center">Professores</th>
                <th className="px-3.5 py-3 text-center">Estado</th>
                <th className="px-3.5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredStructures.length ? (
                filteredStructures.map((s) => {
                  const isSelected = currentStructureId === s.id;
                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-surface-container-low/30 transition-colors ${
                        isSelected ? 'bg-primary/5 font-semibold' : ''
                      }`}
                    >
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {s.codigo.slice(0, 3)}
                          </div>
                          <div>
                            <p className="font-bold text-primary text-xs flex items-center gap-1.5">
                              {s.nome}
                              {isSelected && (
                                <span className="bg-primary text-surface-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                                  Contexto Ativo
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-outline flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-outline shrink-0" />
                              {s.morada}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3.5 py-3">
                        <span className="bg-primary/10 text-primary px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 w-fit">
                          {tipoOptions.find((t) => t.value === s.tipo)?.icon}
                          {s.tipoLabel}
                        </span>
                      </td>

                      <td className="px-3.5 py-3 text-on-surface-variant text-xs font-medium">
                        {s.diretorResponsavel}
                      </td>

                      <td className="px-3.5 py-3 text-center font-bold text-primary text-xs">
                        {s.estudantesCount.toLocaleString('pt-PT')}
                      </td>

                      <td className="px-3.5 py-3 text-center font-bold text-primary text-xs">
                        {s.professoresCount.toLocaleString('pt-PT')}
                      </td>

                      <td className="px-3.5 py-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            s.estado === 'Ativo' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                          }`}
                        >
                          {s.estado}
                        </span>
                      </td>

                      <td className="px-3.5 py-3 text-right relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu === s.id ? null : s.id); }}
                          className={`p-1.5 text-outline hover:text-primary rounded-lg transition-colors cursor-pointer ${openActionMenu === s.id ? 'bg-surface-container-high text-primary' : 'hover:bg-surface-container'}`}
                          title="Ações"
                        >
                          <MoreVertical className="w-4 h-4 stroke-[2]" />
                        </button>

                        {openActionMenu === s.id && (
                          <>
                            <div className="fixed inset-0 z-20 cursor-default" onClick={(e) => { e.stopPropagation(); setOpenActionMenu(null); }} />
                            <div className="absolute right-3 top-10 z-30 w-52 bg-surface-white border border-border-subtle rounded-xl shadow-xl py-1 text-left text-xs divide-y divide-border-subtle animate-in fade-in zoom-in-95 duration-100 font-normal">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    switchStructure(s.id);
                                    onShowToast(`Contexto alterado para "${s.nome}".`);
                                    setOpenActionMenu(null);
                                  }}
                                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-primary/10 hover:text-primary font-medium cursor-pointer transition-colors"
                                >
                                  <Briefcase className="w-4 h-4 text-primary stroke-[2]" />
                                  <span>Trabalhar Aqui</span>
                                </button>
                                <button
                                  onClick={() => { openEditModal(s); setOpenActionMenu(null); }}
                                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-primary/10 hover:text-primary font-medium cursor-pointer transition-colors"
                                >
                                  <Pencil className="w-4 h-4 text-primary stroke-[2]" />
                                  <span>Editar Estrutura</span>
                                </button>
                                <button
                                  onClick={() => { setConfirmStatusStruct(s); setOpenActionMenu(null); }}
                                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-warning/10 hover:text-warning font-medium cursor-pointer transition-colors"
                                >
                                  <Power className="w-4 h-4 text-warning stroke-[2]" />
                                  <span>{s.estado === 'Ativo' ? 'Desativar Estrutura' : 'Ativar Estrutura'}</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-on-surface-variant font-medium">
                    Nenhuma estrutura encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Criar / Editar Estrutura */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-primary text-surface-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/20 border border-secondary-container/40 flex items-center justify-center text-secondary-container font-bold shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight">
                    {editingStruct ? `Editar Estrutura: ${editingStruct.nome}` : 'Criar Nova Estrutura'}
                  </h2>
                  <p className="text-[11px] text-surface-white/70">
                    {editingStruct ? 'Atualize os dados e responsáveis da unidade.' : 'Preencha a identificação e localização da nova unidade.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-surface-white/70 hover:text-surface-white p-1 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-outline font-bold">
                  Código da Unidade
                  <input
                    type="text"
                    required
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                    className="mt-1 w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
                    placeholder="Ex: COL-01, CAM-02"
                  />
                </label>

                <label className="block text-outline font-bold">
                  Tipo de Estrutura
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value as StructureType })}
                    className="mt-1 w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none bg-surface-white"
                  >
                    {tipoOptions.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-outline font-bold">
                Nome da Estrutura
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="mt-1 w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
                  placeholder="Ex: Colégio Talatona, Campus Universitário Central"
                />
              </label>

              <label className="block text-outline font-bold">
                Morada / Localização
                <input
                  type="text"
                  required
                  value={form.morada}
                  onChange={(e) => setForm({ ...form, morada: e.target.value })}
                  className="mt-1 w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
                  placeholder="Ex: Via S10, Talatona, Luanda"
                />
              </label>

              <label className="block text-outline font-bold">
                Diretor Responsável
                <input
                  type="text"
                  required
                  value={form.diretorResponsavel}
                  onChange={(e) => setForm({ ...form, diretorResponsavel: e.target.value })}
                  className="mt-1 w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
                  placeholder="Ex: Dra. Sara Silva, Prof. Carlos Mendes"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-outline font-bold">
                  Nº Inicial de Estudantes
                  <input
                    type="number"
                    value={form.estudantesCount}
                    onChange={(e) => setForm({ ...form, estudantesCount: Number(e.target.value) })}
                    className="mt-1 w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="block text-outline font-bold">
                  Nº Inicial de Professores
                  <input
                    type="number"
                    value={form.professoresCount}
                    onChange={(e) => setForm({ ...form, professoresCount: Number(e.target.value) })}
                    className="mt-1 w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
                  />
                </label>
              </div>

              <label className="block text-outline font-bold">
                Estado Operacional
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value as 'Ativo' | 'Inativo' })}
                  className="mt-1 w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none bg-surface-white"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </label>

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4 mt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-border-subtle hover:bg-surface-container rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-surface-white rounded-xl px-5 py-2 text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  {editingStruct ? 'Guardar Alterações' : 'Criar Estrutura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Ativação / Desativação */}
      {confirmStatusStruct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-md overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-primary text-surface-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/20 border border-secondary-container/40 flex items-center justify-center text-secondary-container font-bold shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight">
                    {confirmStatusStruct.estado === 'Ativo' ? 'Desativar Estrutura' : 'Ativar Estrutura'}
                  </h2>
                  <p className="text-[11px] text-surface-white/70">
                    Confirmação de alteração do estado operacional.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfirmStatusStruct(null)}
                className="text-surface-white/70 hover:text-surface-white p-1 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs">
              <p className="text-on-surface-variant mb-5 leading-relaxed">
                Deseja alterar o estado da estrutura{' '}
                <strong className="text-primary font-bold">{confirmStatusStruct.nome}</strong> para{' '}
                <strong className="text-primary font-bold">
                  {confirmStatusStruct.estado === 'Ativo' ? 'Inativo' : 'Ativo'}
                </strong>
                ?
              </p>

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4">
                <button
                  onClick={() => setConfirmStatusStruct(null)}
                  className="border border-border-subtle hover:bg-surface-container rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleToggleStatus}
                  className="bg-primary hover:bg-primary/90 text-surface-white rounded-xl px-5 py-2 text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  Confirmar Alteração
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
