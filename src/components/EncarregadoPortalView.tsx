import React, { useState } from 'react';
import { ActiveView } from '../types';
import { Users, UserCheck, CreditCard, Wallet, Award, CalendarCheck, Clock, MessageSquare, TrendingUp, CheckCircle2 } from 'lucide-react';

interface EncarregadoPortalViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

interface Educando {
  id: string;
  processo: string;
  nome: string;
  turma: string;
  curso: string;
  mediaGeral: number;
  propinaStatus: 'Regular' | 'Pendente';
}

export const EncarregadoPortalView: React.FC<EncarregadoPortalViewProps> = ({ onShowToast }) => {
  // Mock 2 or more students under this guardian
  const [educandos] = useState<Educando[]>([
    {
      id: 'est-3798',
      processo: '3798',
      nome: 'Afonso Mateus Lemba',
      turma: '10º Ano A',
      curso: 'Ciências Físicas e Biológicas',
      mediaGeral: 15.5,
      propinaStatus: 'Regular',
    },
    {
      id: 'est-4102',
      processo: '4102',
      nome: 'Beatriz Lemba Neto',
      turma: '8ª Classe B',
      curso: 'Ensino Geral',
      mediaGeral: 14.2,
      propinaStatus: 'Pendente',
    },
    {
      id: 'est-5011',
      processo: '5011',
      nome: 'Carlos Lemba Neto',
      turma: '7ª Classe A',
      curso: 'Ensino Geral',
      mediaGeral: 16.8,
      propinaStatus: 'Regular',
    },
  ]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(educandos[0].id);
  const [activeTab, setActiveTab] = useState<'notas' | 'assiduidade' | 'horario' | 'financeiro' | 'comunicacao'>('notas');

  const selectedEducando = educandos.find((e) => e.id === selectedStudentId) || educandos[0];

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* Title Header */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Portal da Família & Encarregado</span>
          <h1 className="font-headline-sm text-lg font-bold text-primary">Acompanhamento Educacional e Financeiro</h1>
          <p className="text-xs text-on-surface-variant">
            Encarregado: <span className="font-bold text-primary">Sr. António Lemba</span> | Contacto: <span className="text-primary font-bold">948729630@ispozango.com</span>
          </p>
        </div>

        {/* MANDATORY: Student Switcher when Guardian has >1 students */}
        <div className="bg-surface-container-low p-2 rounded-xl border border-border-subtle w-full md:w-auto">
          <label className="block text-[11px] font-bold text-outline mb-1">
            Selecione o Educando ({educandos.length} Registados):
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              onShowToast(`Alternado para o educando: ${educandos.find((x) => x.id === e.target.value)?.nome}`);
            }}
            className="w-full text-xs font-bold bg-surface-white border border-border-subtle rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-primary"
          >
            {educandos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome} ({e.turma} - Proc. {e.processo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Student Banner */}
      <div className="bg-surface-container-low/50 border border-border-subtle rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary text-surface-white font-bold flex items-center justify-center text-lg border-2 border-secondary">
            {selectedEducando.nome.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-sm text-primary">{selectedEducando.nome}</p>
            <p className="text-on-surface-variant">
              Turma: <span className="font-semibold text-on-surface">{selectedEducando.turma}</span> | Curso: <span className="font-semibold text-on-surface">{selectedEducando.curso}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-outline font-bold block">MÉDIA ATUAL</span>
            <span className="text-base font-bold text-success">{selectedEducando.mediaGeral} Valores</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-outline font-bold block">ESTADO FINANCEIRO</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedEducando.propinaStatus === 'Regular' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {selectedEducando.propinaStatus === 'Regular' ? 'Propinas Em Dia' : 'Mensalidade Pendente'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar - Positioned directly above Tabs Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Educando Selecionado */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div>
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Educando em Foco</span>
            <span className="text-sm font-bold text-primary truncate leading-none">{selectedEducando.nome}</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">
            {selectedEducando.turma}
          </span>
        </div>

        {/* Card 2: Média do Educando */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div>
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Média Académica</span>
            <span className="text-xl font-bold text-primary leading-none">{selectedEducando.mediaGeral} <span className="text-xs font-normal text-outline">Valores</span></span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Bom Aproveitamento
          </span>
        </div>

        {/* Card 3: Propinas */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div>
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Estado das Propinas</span>
            <span className="text-sm font-bold text-primary leading-none">
              {selectedEducando.propinaStatus === 'Regular' ? 'Propinas Em Dia' : 'Propina Pendente'}
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              selectedEducando.propinaStatus === 'Regular' ? 'bg-success/10 text-success' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {selectedEducando.propinaStatus === 'Regular' ? 'Regularizado' : 'Atenção'}
          </span>
        </div>

        {/* Card 4: Total Educandos */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-2.5 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Educandos Registados
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-primary leading-none">{educandos.length}</span>
              <span className="text-[10px] text-outline font-medium">Alunos</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
              Família Lemba
            </span>
          </div>
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
          <span className="material-symbols-outlined text-[16px]">grade</span>
          Notas & Aproveitamento
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
          Assiduidade & Faltas
        </button>

        <button
          onClick={() => setActiveTab('financeiro')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'financeiro'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">payments</span>
          Pagamento de Propinas
        </button>

        <button
          onClick={() => setActiveTab('comunicacao')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'comunicacao'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">mail</span>
          Contacto Direção & Professores
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'notas' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-3 text-xs">
          <h2 className="font-bold text-primary text-sm">Resumo Académico de {selectedEducando.nome}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3 py-1.5 font-bold">Disciplina</th>
                  <th className="px-3 py-1.5 font-bold text-center">1º Trimestre</th>
                  <th className="px-3 py-1.5 font-bold text-center">2º Trimestre</th>
                  <th className="px-3 py-1.5 font-bold text-center">Aproveitamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                <tr>
                  <td className="px-3 py-1.5 font-bold text-primary">Língua Portuguesa</td>
                  <td className="px-3 py-1.5 text-center font-bold text-success">15</td>
                  <td className="px-3 py-1.5 text-center text-outline">--</td>
                  <td className="px-3 py-1.5 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">Satisfatório</span></td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-bold text-primary">Matemática</td>
                  <td className="px-3 py-1.5 text-center font-bold text-success">16</td>
                  <td className="px-3 py-1.5 text-center text-outline">--</td>
                  <td className="px-3 py-1.5 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">Bom</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'financeiro' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-primary text-sm">Liquidação de Propinas Escolares</h2>
            <button
              onClick={() => onShowToast('Acedendo ao sistema de pagamento via Multicaixa...')}
              className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              Pagar Propinas Online
            </button>
          </div>
          <p className="text-on-surface-variant">Valor da Propina Mensal: 35.000,00 Kz (Vencimento até ao dia 10 de cada mês).</p>
        </div>
      )}

      {['assiduidade', 'comunicacao'].includes(activeTab) && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-sm text-center text-xs text-on-surface-variant space-y-2">
          <span className="material-symbols-outlined text-secondary text-4xl">contact_mail</span>
          <p className="font-bold text-primary text-sm">Portal do Encarregado: {activeTab.toUpperCase()}</p>
          <p>Modulo de acompanhamento direto e envio de mensagens para a Direção da Vendaia School®.</p>
        </div>
      )}
    </div>
  );
};
