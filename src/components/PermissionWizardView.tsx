import React, { useState } from 'react';
import {
  X,
  Save,
  Building2,
  Lock,
  ChevronDown,
  ChevronRight,
  Filter,
  Briefcase,
  Globe,
} from 'lucide-react';
import { useAccess } from '../context/AccessContext';

export interface WizardTarget {
  type: 'user' | 'group';
  id: string;
  name: string;
  role?: string;
}

interface Props {
  target: WizardTarget;
  onBack: () => void;
  onSave: (targetId: string, data: any) => void;
  onShowToast: (msg: string) => void;
}

// Matrix Resource Items
interface ResourceItem {
  id: string;
  module: string;
  domain: 'Geral' | 'Académico' | 'Financeiro' | 'Utilizadores' | 'Administração';
  name: string;
}

const MATRIX_RESOURCES: ResourceItem[] = [
  { id: 'dashboard', module: 'DASHBOARD', domain: 'Geral', name: 'Dashboard' },
  { id: 'estudantes', module: 'GESTÃO ACADÉMICA', domain: 'Académico', name: 'Estudantes' },
  { id: 'turmas', module: 'GESTÃO ACADÉMICA', domain: 'Académico', name: 'Turmas' },
  { id: 'professores', module: 'GESTÃO ACADÉMICA', domain: 'Académico', name: 'Professores' },
  { id: 'pautas', module: 'GESTÃO ACADÉMICA', domain: 'Académico', name: 'Pautas & Notas' },
  { id: 'gestao_financeira', module: 'SERVIÇOS FINANCEIROS', domain: 'Financeiro', name: 'Contas & Propinas' },
  { id: 'precarios', module: 'SERVIÇOS FINANCEIROS', domain: 'Financeiro', name: 'Tabelas de Preços' },
  { id: 'utilizadores_sistema', module: 'UTILIZADORES & ACESSOS', domain: 'Utilizadores', name: 'Utilizadores' },
  { id: 'grupos_acesso', module: 'UTILIZADORES & ACESSOS', domain: 'Utilizadores', name: 'Grupos & Perfis' },
  { id: 'config_academicas', module: 'ADMINISTRAÇÃO DA PLATAFORMA', domain: 'Administração', name: 'Estruturas & Polos' },
  { id: 'auditoria_logs', module: 'ADMINISTRAÇÃO DA PLATAFORMA', domain: 'Administração', name: 'Auditoria & Logs' },
];

const OPERATIONS = ['VER', 'CRIAR', 'EDITAR', 'APROVAR', 'EXPORTAR', 'SUSPENDER', 'ENCERRAR', 'ADMINISTRAR'] as const;
type Operation = typeof OPERATIONS[number];

type MatrixMap = Record<string, Set<Operation>>;

export const PermissionWizardView: React.FC<Props> = ({ target, onBack, onSave, onShowToast }) => {
  const { structures } = useAccess();

  // Form State — Scope & Mode (Defaults matching reference image: Por Polos & Acórdão por Polo)
  const [scopeType, setScopeType] = useState<'global' | 'restricted'>('restricted');
  const [scopeMode, setScopeMode] = useState<'uniform' | 'contextual'>('contextual');
  const [selectedStructures, setSelectedStructures] = useState<string[]>(['str-02']); // Talatona default active
  const [domainFilter, setDomainFilter] = useState<string>('Todos');

  // Accordion Expanded State (Key: structure ID)
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({
    'str-02': true, // Talatona expanded by default matching reference image
  });

  const toggleAccordion = (key: string) => {
    setExpandedAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Matrix State per Structure (Key: structure ID or 'global')
  const [structureMatrices, setStructureMatrices] = useState<Record<string, MatrixMap>>(() => {
    // Global Matrix defaults matching reference screenshot: 19 active rules
    const globalMatrix: MatrixMap = {
      pautas: new Set<Operation>(['VER', 'CRIAR', 'EDITAR', 'APROVAR']),
      gestao_financeira: new Set<Operation>(['VER', 'CRIAR', 'EDITAR', 'APROVAR', 'EXPORTAR']),
      estudantes: new Set<Operation>(['VER', 'CRIAR', 'EDITAR', 'APROVAR', 'EXPORTAR']),
      turmas: new Set<Operation>(['VER', 'CRIAR', 'EDITAR', 'ADMINISTRAR']),
      dashboard: new Set<Operation>(['VER']),
    };

    // Talatona matrix matching reference screenshot: 3 active rules (Estudantes VER, Turmas VER, Pautas & Notas VER)
    const talatonaMatrix: MatrixMap = {
      estudantes: new Set<Operation>(['VER']),
      turmas: new Set<Operation>(['VER']),
      pautas: new Set<Operation>(['VER']),
    };

    const kilambaMatrix: MatrixMap = {
      estudantes: new Set<Operation>(['VER', 'CRIAR', 'EDITAR']),
      turmas: new Set<Operation>(['VER', 'EDITAR']),
    };

    return {
      global: globalMatrix,
      'str-01': kilambaMatrix,
      'str-02': talatonaMatrix,
    };
  });

  // Calculate Total Active Rules across Global Base + Active Selected Polos
  const calculateActiveRulesCount = (): number => {
    let globalTotal = 0;
    const globalMat = structureMatrices['global'] || {};
    (Object.values(globalMat) as Set<Operation>[]).forEach((set) => {
      globalTotal += set.size;
    });

    if (scopeType === 'global' || scopeMode === 'uniform') {
      return globalTotal;
    }

    let poloTotal = 0;
    selectedStructures.forEach((strId) => {
      const mat = structureMatrices[strId] || {};
      (Object.values(mat) as Set<Operation>[]).forEach((set) => {
        poloTotal += set.size;
      });
    });

    return globalTotal + poloTotal;
  };

  const activeRulesCount = calculateActiveRulesCount();

  const toggleMatrixCell = (targetKey: string, resourceId: string, op: Operation) => {
    setStructureMatrices((prev) => {
      const targetMat = prev[targetKey] || {};
      const nextMat = { ...targetMat };
      const set = new Set(nextMat[resourceId] || []);
      if (set.has(op)) {
        set.delete(op);
      } else {
        set.add(op);
      }
      nextMat[resourceId] = set;
      return { ...prev, [targetKey]: nextMat };
    });
  };

  const toggleResourceAll = (targetKey: string, resourceId: string) => {
    setStructureMatrices((prev) => {
      const targetMat = prev[targetKey] || {};
      const nextMat = { ...targetMat };
      const currentSet = nextMat[resourceId] || new Set();
      if (currentSet.size === OPERATIONS.length) {
        nextMat[resourceId] = new Set();
      } else {
        nextMat[resourceId] = new Set(OPERATIONS);
      }
      return { ...prev, [targetKey]: nextMat };
    });
  };

  const toggleStructureSelection = (strId: string) => {
    if (selectedStructures.includes(strId)) {
      setSelectedStructures(selectedStructures.filter((id) => id !== strId));
    } else {
      setSelectedStructures([...selectedStructures, strId]);
    }
  };

  const handleSave = () => {
    onSave(target.id, {
      scopeType,
      scopeMode,
      selectedStructures,
      structureMatrices,
    });
    onShowToast(`Permissões salvas com sucesso para ${target.name}!`);
    onBack();
  };

  const filteredResources = MATRIX_RESOURCES.filter(
    (r) => domainFilter === 'Todos' || r.domain === domainFilter
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden backdrop-blur-xs">
      {/* Fixed Height Modal Container */}
      <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
        
        {/* Modal Header (Dark Navy Theme matching reference image) */}
        <div className="px-5 py-3.5 bg-primary border-b border-primary-container flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary-container/20 border border-secondary-container/40 text-secondary-container flex items-center justify-center font-bold shrink-0 shadow-inner">
              <Lock className="w-4.5 h-4.5 text-secondary-container stroke-[2.25]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-surface-white flex items-center gap-1.5 leading-tight">
                Atribuir Permissões: <span className="text-secondary-container font-bold">{target.name}</span>
              </h2>
              <p className="text-[11px] text-[#b5c7ef] font-medium leading-tight">
                Perfil Base: <span className="font-semibold text-surface-white">{target.role || 'Administrador'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="bg-surface-white/10 border border-surface-white/20 px-2.5 py-1 rounded-lg text-center backdrop-blur-xs">
                <span className="text-[8px] uppercase font-bold text-surface-white/60 block leading-none tracking-wider">ALVO</span>
                <span className="font-bold text-surface-white text-[11px] leading-tight">
                  {target.type === 'user' ? 'Utilizador Individual' : 'Grupo'}
                </span>
              </div>
              <div className="bg-success/20 border border-success/40 px-2.5 py-1 rounded-lg text-center backdrop-blur-xs">
                <span className="text-[8px] uppercase font-bold text-green-300 block leading-none tracking-wider">REGRAS</span>
                <span className="font-bold text-green-200 text-[11px] leading-tight">{activeRulesCount} Ativas</span>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-surface-white/70 hover:text-surface-white p-1.5 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Controls */}
        <div className="bg-surface-container-low border-b border-border-subtle px-4 py-2 text-xs shrink-0">
          <div className="flex items-center justify-between gap-3 overflow-x-auto">
            {/* Left Group: Escopo & Modo */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Scope Type Toggle */}
              <div className="flex items-center gap-1 bg-surface-white border border-border-subtle p-1 rounded-xl shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-outline px-1 flex items-center gap-1">
                  ESCOPO:
                </span>
                <button
                  onClick={() => setScopeType('global')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    scopeType === 'global'
                      ? 'bg-secondary text-surface-white shadow-xs'
                      : 'bg-surface-white text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Global
                </button>
                <button
                  onClick={() => setScopeType('restricted')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    scopeType === 'restricted'
                      ? 'bg-secondary text-surface-white shadow-xs'
                      : 'bg-surface-white text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" /> Por Polos
                </button>
              </div>

              {/* Scope Mode Toggle (Only when Restricted / Por Polos) */}
              {scopeType === 'restricted' && (
                <div className="flex items-center gap-1 bg-surface-white border border-border-subtle p-1 rounded-xl shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-outline px-1 flex items-center gap-1">
                    MATRIZ:
                  </span>
                  <button
                    onClick={() => setScopeMode('uniform')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 ${
                      scopeMode === 'uniform'
                        ? 'bg-primary text-surface-white shadow-xs'
                        : 'bg-surface-white text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-success inline-block"></span> Uniforme
                  </button>
                  <button
                    onClick={() => setScopeMode('contextual')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 ${
                      scopeMode === 'contextual'
                        ? 'bg-primary text-surface-white shadow-xs'
                        : 'bg-surface-white text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Acórdão por Polo
                  </button>
                </div>
              )}
            </div>

            {/* Right Group: Domain Filter Pills */}
            <div className="flex items-center gap-1 bg-surface-white border border-border-subtle p-1 rounded-xl shadow-2xs shrink-0">
              <span className="text-[9px] uppercase font-bold text-outline px-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-secondary" /> DOMÍNIOS:
              </span>
              {['Todos', 'Geral', 'Académico', 'Financeiro', 'Utilizadores', 'Administração'].map((domain) => {
                const isSelected = domainFilter === domain;
                return (
                  <button
                    key={domain}
                    onClick={() => setDomainFilter(domain)}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary text-surface-white shadow-2xs'
                        : 'text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    {domain}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3 overflow-y-auto flex-1 min-h-0 text-xs space-y-3">
          
          {/* Base / Global Matrix Table Section (ONLY Visible when Escopo === 'global') */}
          {scopeType === 'global' && (
            <div className="border border-border-subtle rounded-xl bg-surface-white shadow-2xs overflow-hidden">
              <div className="bg-surface-container-low px-4 py-2 border-b border-border-subtle flex items-center justify-between">
                <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-secondary" /> Matriz de Permissões de Escopo Global
                </span>
                <span className="text-[10px] text-outline font-semibold">
                  Aplica-se a toda a instituição globalmente
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead className="sticky top-0 z-10 bg-surface-container-low border-b border-border-subtle text-[8px]">
                    <tr>
                      <th className="px-3 py-2 font-bold text-primary min-w-[200px]">MÓDULO / RECURSO</th>
                      {OPERATIONS.map((op) => (
                        <th key={op} className="px-1 py-2 text-center font-bold text-outline min-w-[60px]">
                          {op}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredResources.map((res) => {
                      const set = (structureMatrices['global'] || {})[res.id] || new Set();
                      const isAll = set.size === OPERATIONS.length;
                      return (
                        <tr key={res.id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-3 py-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <span className="text-[7px] uppercase font-bold text-outline leading-none block tracking-wider">{res.module}</span>
                                <span className="font-bold text-primary text-[11px] leading-tight">{res.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleResourceAll('global', res.id)}
                                className="text-[9px] text-secondary hover:underline font-semibold cursor-pointer shrink-0"
                              >
                                [{isAll ? 'Desmarcar' : 'Marcar'}]
                              </button>
                            </div>
                          </td>

                          {OPERATIONS.map((op) => {
                            const checked = set.has(op);
                            return (
                              <td key={op} className="px-1 py-1.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleMatrixCell('global', res.id, op)}
                                  className="w-3.5 h-3.5 rounded border-border-subtle text-secondary focus:ring-secondary cursor-pointer"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Uniform Polo Matrix (Visible in Restricted + Uniform mode) */}
          {scopeType === 'restricted' && scopeMode === 'uniform' && (
            <div className="space-y-3">
              <div className="p-3 bg-surface-white border border-border-subtle rounded-xl shadow-2xs flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-secondary" /> Polos Selecionados para Matriz Uniforme:
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  {structures.map((s) => (
                    <label key={s.id} className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-primary">
                      <input
                        type="checkbox"
                        checked={selectedStructures.includes(s.id)}
                        onChange={() => toggleStructureSelection(s.id)}
                        className="w-3.5 h-3.5 rounded border-border-subtle text-secondary focus:ring-secondary"
                      />
                      {s.nome}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border border-border-subtle rounded-xl bg-surface-white shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead className="sticky top-0 z-10 bg-surface-container-low border-b border-border-subtle text-[8px]">
                      <tr>
                        <th className="px-3 py-2 font-bold text-primary min-w-[200px]">MÓDULO / RECURSO</th>
                        {OPERATIONS.map((op) => (
                          <th key={op} className="px-1 py-2 text-center font-bold text-outline min-w-[60px]">
                            {op}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filteredResources.map((res) => {
                        const targetId = selectedStructures[0] || 'str-02';
                        const set = (structureMatrices[targetId] || {})[res.id] || new Set();
                        const isAll = set.size === OPERATIONS.length;
                        return (
                          <tr key={res.id} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="px-3 py-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <span className="text-[7px] uppercase font-bold text-outline leading-none block tracking-wider">{res.module}</span>
                                  <span className="font-bold text-primary text-[11px] leading-tight">{res.name}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    selectedStructures.forEach((sId) => toggleResourceAll(sId, res.id));
                                  }}
                                  className="text-[9px] text-secondary hover:underline font-semibold cursor-pointer shrink-0"
                                >
                                  [{isAll ? 'Desmarcar' : 'Marcar'}]
                                </button>
                              </div>
                            </td>

                            {OPERATIONS.map((op) => {
                              const checked = set.has(op);
                              return (
                                <td key={op} className="px-1 py-1.5 text-center">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      selectedStructures.forEach((sId) => toggleMatrixCell(sId, res.id, op));
                                    }}
                                    className="w-3.5 h-3.5 rounded border-border-subtle text-secondary focus:ring-secondary cursor-pointer"
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Per-Polo Accordions (Visible in Restricted + Contextual / Acórdão por Polo mode) */}
          {scopeType === 'restricted' && scopeMode === 'contextual' && (
            <div className="space-y-2">
              {structures.map((s) => {
                const isSelected = selectedStructures.includes(s.id);
                const isExpanded = expandedAccordions[s.id] === true;
                const itemMatrix = structureMatrices[s.id] || {};
                const rulesCount = (Object.values(itemMatrix) as Set<Operation>[]).reduce((acc, curr) => acc + curr.size, 0);

                return (
                  <div key={s.id} className="border border-[#f0d8c8] rounded-xl overflow-hidden shadow-2xs transition-all bg-surface-white">
                    {/* Warm Accordion Banner Matching Reference Screenshot */}
                    <div className="bg-[#fdf4ef] px-3.5 py-2 flex items-center justify-between border-b border-[#f5e6dc] select-none">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleStructureSelection(s.id)}
                          className="w-4 h-4 rounded border-secondary/40 text-secondary focus:ring-secondary cursor-pointer"
                        />
                        <button
                          onClick={() => toggleAccordion(s.id)}
                          className="flex items-center gap-2 cursor-pointer focus:outline-none"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-secondary font-bold" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-secondary/70 font-bold" />
                          )}

                          <div className="w-6 h-6 rounded-md bg-[#faebe1] border border-[#f0d8c8] text-secondary flex items-center justify-center">
                            <Building2 className="w-3.5 h-3.5 text-secondary" />
                          </div>

                          <span className="font-bold text-xs text-primary">{s.nome}</span>
                          <span className="text-[10px] text-outline font-medium">({s.codigo})</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fbebe1] text-secondary border border-[#f5e6dc]">
                          {rulesCount} regras ativas
                        </span>
                      </div>
                    </div>

                    {/* Accordion Body — Specific Polo Matrix Table */}
                    {isExpanded && (
                      <div className="p-2 bg-surface-white">
                        <div className="overflow-x-auto border border-border-subtle rounded-lg max-h-[300px] overflow-y-auto">
                          <table className="w-full text-left border-collapse text-[10px]">
                            <thead className="sticky top-0 z-10 bg-surface-container-low border-b border-border-subtle text-[8px]">
                              <tr>
                                <th className="px-3 py-2 font-bold text-primary min-w-[200px]">MÓDULO / RECURSO</th>
                                {OPERATIONS.map((op) => (
                                  <th key={op} className="px-1 py-2 text-center font-bold text-outline min-w-[60px]">
                                    {op}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                              {filteredResources.map((res) => {
                                const set = itemMatrix[res.id] || new Set();
                                const isAll = set.size === OPERATIONS.length;
                                return (
                                  <tr key={res.id} className="hover:bg-surface-container-low/30 transition-colors">
                                    <td className="px-3 py-1.5">
                                      <div className="flex items-center justify-between gap-2">
                                        <div>
                                          <span className="text-[7px] uppercase font-bold text-outline leading-none block tracking-wider">{res.module}</span>
                                          <span className="font-bold text-primary text-[11px] leading-tight">{res.name}</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => toggleResourceAll(s.id, res.id)}
                                          className="text-[9px] text-secondary hover:underline font-semibold cursor-pointer shrink-0"
                                        >
                                          [{isAll ? 'Desmarcar' : 'Marcar'}]
                                        </button>
                                      </div>
                                    </td>

                                    {OPERATIONS.map((op) => {
                                      const checked = set.has(op);
                                      return (
                                        <td key={op} className="px-1 py-1.5 text-center">
                                          <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleMatrixCell(s.id, res.id, op)}
                                            className="w-3.5 h-3.5 rounded border-border-subtle text-secondary focus:ring-secondary cursor-pointer"
                                          />
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-border-subtle bg-surface-white flex justify-between items-center shrink-0">
          <button
            onClick={onBack}
            className="text-outline hover:text-primary font-semibold text-xs px-4 py-2 rounded-lg hover:bg-surface-container transition-all cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="bg-primary hover:bg-primary-container text-surface-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-surface-white" /> Guardar Permissões
          </button>
        </div>
      </div>
    </div>
  );
};
