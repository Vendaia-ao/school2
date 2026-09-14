import React, { useState } from 'react';
import { ActiveView } from '../types';
import { BookOpen, Users, Clock, Pencil as Edit3, CheckSquare, MessageCircle, FileText, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

interface ProfessorPortalViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

export const ProfessorPortalView: React.FC<ProfessorPortalViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'turmas' | 'notas' | 'assiduidade' | 'planos' | 'materiais' | 'mensagens'>('notas');
  const [selectedTurma, setSelectedTurma] = useState('10A-CIEN');

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* Quick Metrics Bar - Matching Reference Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Docente */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div>
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Professor Docente</span>
            <span className="text-sm font-bold text-primary truncate leading-none">Prof. Domingos Henriques</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
            Docente Efetivo
          </span>
        </div>

        {/* Card 2: Turmas Atribuídas */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div>
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Turmas Atribuídas</span>
            <span className="text-xl font-bold text-primary leading-none">3 <span className="text-xs font-normal text-outline">Turmas</span></span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">
            10ºA • 11ºA • 12ºA
          </span>
        </div>

        {/* Card 3: Carga Horária */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Carga Letiva Semanal</span>
              <span className="text-primary font-bold text-[12px]">26 Temps/sem</span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '86%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>Capacidade Semanal</span>
              <span className="text-success font-bold">Normal</span>
            </div>
          </div>
        </div>

        {/* Card 4: Lançamento de Notas */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-2.5 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Lançamento de Notas
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-primary leading-none">1º Trim.</span>
              <span className="text-[10px] text-outline font-medium">85%</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold">
              Em Lançamento
            </span>
          </div>
        </div>
      </div>

      {/* Header Profile Banner */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary text-surface-white font-bold text-xl flex items-center justify-center border-2 border-primary/40 shadow">
            DH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-lg font-bold text-primary">Prof. Domingos Henriques</h1>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                Docente Efetivo
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              E-mail: <span className="text-primary font-bold">Domingoshenriques1@ispozango.com</span> | Carga Letiva: <span className="font-bold text-primary">26 Temps/sem</span>
            </p>
            <p className="text-[11px] text-outline">
              Disciplinas: <span className="font-semibold text-on-surface">Matemática I, Matemática II</span> | Direção de Turma: <span className="font-semibold text-on-surface">10º Ano A</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs font-semibold text-outline">Turma Atual:</span>
          <select
            value={selectedTurma}
            onChange={(e) => {
              setSelectedTurma(e.target.value);
              onShowToast(`Turma selecionada: ${e.target.value}`);
            }}
            className="text-xs bg-surface-container-low border border-border-subtle font-bold text-primary rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="10A-CIEN">10º Ano A - Ciências Físicas</option>
            <option value="11A-INF">11º Ano A - Informática</option>
            <option value="12A-GEST">12º Ano A - Gestão</option>
          </select>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('notas')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'notas'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">edit_note</span>
          Lançamento de Notas
        </button>

        <button
          onClick={() => setActiveTab('assiduidade')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'assiduidade'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">fact_check</span>
          Registo de Assiduidade
        </button>

        <button
          onClick={() => setActiveTab('planos')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'planos'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">menu_book</span>
          Planos de Aula
        </button>

        <button
          onClick={() => setActiveTab('materiais')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'materiais'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          Materiais Didáticos
        </button>

        <button
          onClick={() => setActiveTab('mensagens')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'mensagens'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">chat</span>
          Comunicação Família/Alunos
        </button>
      </div>

      {/* Tab: Lançamento de Notas */}
      {activeTab === 'notas' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-bold text-primary text-sm">Pauta de Lançamento de Notas (1º Trimestre)</h2>
              <p className="text-on-surface-variant">Turma: {selectedTurma} | Disciplina: Matemática I</p>
            </div>

            <button
              onClick={() => onShowToast('Notas submetidas e guardadas com sucesso!')}
              className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              Guardar e Publicar Notas
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3 py-1.5 font-bold">Nº</th>
                  <th className="px-3 py-1.5 font-bold">Nome do Aluno</th>
                  <th className="px-3 py-1.5 font-bold text-center">MAC (Aval. Contínua)</th>
                  <th className="px-3 py-1.5 font-bold text-center">NPP (Prova Parcial)</th>
                  <th className="px-3 py-1.5 font-bold text-center">NPT (Prova Trimestral)</th>
                  <th className="px-3 py-1.5 font-bold text-center">Média Trimestral</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                <tr>
                  <td className="px-3 py-1.5">01</td>
                  <td className="px-3 py-1.5 font-bold text-primary">Afonso Mateus Lemba</td>
                  <td className="px-3 py-1.5 text-center">
                    <input type="number" defaultValue={16} className="w-16 text-center border border-border-subtle rounded p-1 font-bold" />
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <input type="number" defaultValue={15} className="w-16 text-center border border-border-subtle rounded p-1 font-bold" />
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <input type="number" defaultValue={17} className="w-16 text-center border border-border-subtle rounded p-1 font-bold" />
                  </td>
                  <td className="px-3 py-1.5 text-center font-bold text-secondary text-sm">16.0 v.</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5">02</td>
                  <td className="px-3 py-1.5 font-bold text-primary">Beatriz Domingos Neto</td>
                  <td className="px-3 py-1.5 text-center">
                    <input type="number" defaultValue={10} className="w-16 text-center border border-border-subtle rounded p-1 font-bold" />
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <input type="number" defaultValue={8} className="w-16 text-center border border-border-subtle rounded p-1 font-bold" />
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <input type="number" defaultValue={11} className="w-16 text-center border border-border-subtle rounded p-1 font-bold" />
                  </td>
                  <td className="px-3 py-1.5 text-center font-bold text-outline text-sm">9.6 v.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Registo de Assiduidade */}
      {activeTab === 'assiduidade' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-primary text-sm">Livro de Sumários e Chamada do Dia</h2>
            <button onClick={() => onShowToast('Sumário e chamada do dia assinados e registados!')} className="bg-primary text-surface-white px-3 py-1.5 rounded-lg font-bold">
              Submeter Sumário
            </button>
          </div>
          <div>
            <label className="block font-bold mb-1">Sumário da Aula:</label>
            <textarea placeholder="Tema: Equações do 2º Grau e Resolução de Exercícios..." className="w-full border border-border-subtle rounded-lg p-2 h-16 bg-surface-container-low"></textarea>
          </div>
        </div>
      )}

      {/* Fallback for other tabs */}
      {['planos', 'materiais', 'mensagens'].includes(activeTab) && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-sm text-center text-xs text-on-surface-variant space-y-2">
          <span className="material-symbols-outlined text-secondary text-4xl">cast_for_education</span>
          <p className="font-bold text-primary text-sm">Portal do Professor: {activeTab.toUpperCase()}</p>
          <p>Módulo de apoio pedagógico configurado conforme as regras da instituição.</p>
        </div>
      )}
    </div>
  );
};
