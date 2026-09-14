import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  DollarSign,
  AlertCircle,
  GraduationCap,
  Users,
  TrendingUp,
  BarChart3,
  Receipt,
  Landmark,
  ArrowUpRight,
  Award,
  ShieldCheck,
  Clock,
  ChevronRight,
  Activity,
  FileText,
  CheckCircle2,
  PieChart,
  RefreshCw,
  PlusCircle,
  CreditCard,
} from 'lucide-react';

interface DashboardViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectView, onShowToast }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Ano Lectivo 2025/2026');

  // Activity Feed Data
  const recentActivities = [
    { id: 'act-1', tipo: 'PAGAMENTO', desc: 'Propina Set/2026 — João Baptista', hora: '21:14', color: 'bg-success/15 text-success border-success/30' },
    { id: 'act-2', tipo: 'FACTURA', desc: 'FT-2026-0841 emitida — Ana Costa', hora: '20:58', color: 'bg-primary/15 text-primary border-primary/30' },
    { id: 'act-3', tipo: 'DÍVIDA', desc: 'Dívida escalada — Carlos Ferreira', hora: '20:31', color: 'bg-error/15 text-error border-error/30' },
    { id: 'act-4', tipo: 'PAGAMENTO', desc: 'Pagamento parcial — Filomena Costa', hora: '19:45', color: 'bg-success/15 text-success border-success/30' },
    { id: 'act-5', tipo: 'BENEFÍCIO', desc: 'Bolsa aplicada — Pedro Neto (50%)', hora: '18:22', color: 'bg-info/15 text-info border-info/30' },
    { id: 'act-6', tipo: 'CAIXA', desc: 'Fecho de caixa efectuado com sucesso', hora: '17:00', color: 'bg-secondary/15 text-secondary border-secondary/30' },
  ];

  return (
    <div className="mt-header-height p-4 sm:p-5 w-full flex flex-col gap-4">
      {/* 4 KPI Icon-Box Cards (Arquitetura Visual Anterior - h-[68px]) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Card 1: RECEITA DO MÊS */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              RECEITA DO MÊS
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
              4.280.500 Kz
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +8.3%
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">este mês</span>
          </div>
        </div>

        {/* Card 2: DÍVIDA ACTIVA */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              DÍVIDA ACTIVA
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
              1.142.200 Kz
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-warning bg-warning/10 text-[10px] font-bold">
              <AlertCircle className="w-3 h-3 mr-0.5" /> 48
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">devedores</span>
          </div>
        </div>

        {/* Card 3: MÉDIA ACADÉMICA (M02) */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                MÉDIA ACADÉMICA (M02)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-info font-bold text-[12px]">14.5<span className="text-[10px] font-normal text-outline">/20</span></span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-info h-full rounded-full" style={{ width: '72.5%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span className="text-info font-bold">89.2% Aproveitamento</span>
            </div>
          </div>
        </div>

        {/* Card 4: ASSIDUIDADE HOJE */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                ASSIDUIDADE HOJE
              </span>
              <div className="flex items-center gap-2">
                <span className="text-success font-bold text-[12px]">96.5%</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-success h-full rounded-full" style={{ width: '96.5%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span className="text-success flex items-center gap-0.5 font-bold">
                <CheckCircle2 className="w-3 h-3 text-success inline" /> 3 pendentes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Gráfico de Receitas vs Despesas + Card do Índice de Arrecadação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2/3 width): Receitas vs Despesas — ÚLTIMOS 6 MESES */}
        <div className="lg:col-span-2 bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-bold text-base text-primary flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-secondary stroke-[1.75]" />
                  Receitas vs Despesas — ÚLTIMOS 6 MESES
                </h3>
                <p className="text-xs text-outline font-medium">Valores em milhares de Kz</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <span className="w-3 h-3 rounded bg-[#051939] inline-block" />
                  Receita
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                  <span className="w-3 h-3 rounded bg-[#a54400] inline-block" />
                  Despesa
                </div>
              </div>
            </div>

            {/* Custom Interactive CSS Bar Chart (6 Meses: Abr, Mai, Jun, Jul, Ago, Set) */}
            <div className="h-56 relative flex items-end justify-between pt-6 pb-6 px-4 border-b border-l border-border-subtle/80 gap-2">
              {/* Y-Axis Grid Lines */}
              <div className="absolute inset-x-0 top-0 border-t border-dashed border-border-subtle/50 text-[9px] text-outline font-mono pl-1">
                5.000Kz
              </div>
              <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-border-subtle/50 text-[9px] text-outline font-mono pl-1">
                3.750Kz
              </div>
              <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-border-subtle/50 text-[9px] text-outline font-mono pl-1">
                2.500Kz
              </div>
              <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-border-subtle/50 text-[9px] text-outline font-mono pl-1">
                1.250Kz
              </div>

              {/* Month Bars */}
              {[
                { mes: 'Abr', receita: '3.800K', despesa: '2.900K', hRec: '76%', hDesp: '58%' },
                { mes: 'Mai', receita: '4.100K', despesa: '3.100K', hRec: '82%', hDesp: '62%' },
                { mes: 'Jun', receita: '3.950K', despesa: '3.000K', hRec: '79%', hDesp: '60%' },
                { mes: 'Jul', receita: '4.500K', despesa: '3.200K', hRec: '90%', hDesp: '64%' },
                { mes: 'Ago', receita: '4.150K', despesa: '3.050K', hRec: '83%', hDesp: '61%' },
                { mes: 'Set', receita: '4.280K', despesa: '3.120K', hRec: '85.6%', hDesp: '62.4%' },
              ].map((item) => (
                <div key={item.mes} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                  <div className="flex items-end gap-1.5 h-full w-full justify-center">
                    {/* Receita Bar (Dark Navy #051939) */}
                    <div
                      className="w-5 sm:w-7 bg-[#051939] dark:bg-[#0c2340] border border-[#051939]/30 dark:border-border-subtle/50 rounded-t-md transition-all group-hover:brightness-125 shadow-2xs relative"
                      style={{ height: item.hRec }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#051939] text-surface-white text-[10px] py-0.5 px-1.5 rounded shadow pointer-events-none whitespace-nowrap z-20 font-bold">
                        Rec: {item.receita}
                      </div>
                    </div>
                    {/* Despesa Bar (Terracotta Rust #a54400) */}
                    <div
                      className="w-5 sm:w-7 bg-[#a54400] dark:bg-[#8c3a00] border border-[#a54400]/30 dark:border-border-subtle/50 rounded-t-md transition-all group-hover:brightness-110 shadow-2xs relative"
                      style={{ height: item.hDesp }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#a54400] text-surface-white text-[10px] py-0.5 px-1.5 rounded shadow pointer-events-none whitespace-nowrap z-20 font-bold">
                        Desp: {item.despesa}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-primary mt-2">{item.mes}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center pt-3 mt-2 border-t border-border-subtle">
            <span className="text-xs text-outline font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Ano lectivo 2025/2026 · Actualizado hoje
            </span>
            <button
              onClick={() => {
                onSelectView('financeiro');
                onShowToast('Redirecionando para Relatórios Financeiros...');
              }}
              className="text-xs font-bold text-secondary hover:text-secondary/80 flex items-center gap-1 cursor-pointer transition-colors"
            >
              Ver Relatórios <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column (1/3 width): Card do Índice de Arrecadação */}
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-base text-primary flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-secondary stroke-[1.75]" />
                  Índice de Arrecadação
                </h3>
                <p className="text-xs text-outline font-medium">Balanço do Ciclo Letivo 2025/2026</p>
              </div>
              <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full border border-success/20">
                Meta 90% SLA
              </span>
            </div>

            {/* Gauge Conic Donut Visual */}
            <div className="flex flex-col items-center justify-center my-3">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center shadow-inner relative transition-transform hover:scale-105 cursor-pointer"
                style={{ background: 'conic-gradient(#041939 0% 88%, #e5e7eb 88% 100%)' }}
                onClick={() => onSelectView('financeiro')}
              >
                <div className="w-24 h-24 bg-surface-white rounded-full flex flex-col items-center justify-center shadow-xs">
                  <span className="text-[9px] uppercase font-bold text-outline tracking-wider">RECEBIDO</span>
                  <span className="text-2xl font-extrabold text-primary leading-none">88%</span>
                </div>
              </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-2 text-xs border-t border-border-subtle pt-3">
              <div className="flex justify-between items-center">
                <span className="text-outline font-medium">Valor Arrecadado:</span>
                <span className="font-bold text-primary">420.000.000 Kz</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-outline font-medium">Dívida Activa (12%):</span>
                <span className="font-bold text-error">57.500.000 Kz</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-border-subtle/50 font-bold">
                <span className="text-primary">Total Previsto:</span>
                <span className="text-secondary text-sm">477.500.000 Kz</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle">
            <span className="text-[11px] text-outline font-medium flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-secondary animate-spin" style={{ animationDuration: '6s' }} />
              Atualização em tempo real
            </span>
            <button
              onClick={() => {
                onSelectView('financeiro');
                onShowToast('Abrindo Balanço M05...');
              }}
              className="px-3 py-1.5 bg-secondary/10 hover:bg-secondary hover:text-surface-white text-secondary text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Ver Balanço M05
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Ações Rápidas & Atalhos + Actividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2/3 width): Ações Rápidas & Atalhos */}
        <div className="lg:col-span-2 bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs">
          <div className="mb-4">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary stroke-[1.75]" />
              Ações Rápidas & Atalhos
            </h3>
            <p className="text-xs text-outline font-medium">Operações frequentes da instituição</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              onClick={() => {
                onSelectView('financeiro');
                onShowToast('Abrindo formulário de Nova Cobrança / Fatura...');
              }}
              className="bg-surface-container-low/60 hover:bg-secondary/10 border border-border-subtle hover:border-secondary/40 p-3.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-surface-white flex items-center justify-center transition-colors">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-primary group-hover:text-secondary transition-colors">
                  Nova Cobrança / Factura
                </p>
                <p className="text-[10px] text-outline">Emitir recibos e faturas AGT</p>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectView('financeiro');
                onShowToast('Acedendo à Gestão de Caixas...');
              }}
              className="bg-surface-container-low/60 hover:bg-secondary/10 border border-border-subtle hover:border-secondary/40 p-3.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-surface-white flex items-center justify-center transition-colors">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-primary group-hover:text-secondary transition-colors">
                  Abrir / Ver Caixa
                </p>
                <p className="text-[10px] text-outline">Fecho diário e fluxo financeiro</p>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectView('financeiro');
                onShowToast('Abrindo módulo de Conciliação Bancária...');
              }}
              className="bg-surface-container-low/60 hover:bg-secondary/10 border border-border-subtle hover:border-secondary/40 p-3.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-info/10 text-info group-hover:bg-info group-hover:text-surface-white flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-primary group-hover:text-secondary transition-colors">
                  Conciliação Bancária
                </p>
                <p className="text-[10px] text-outline">Validar extratos EMIS/Multicaixa</p>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectView('financeiro');
                onShowToast('Formulário de atribuição de bolsas ativado.');
              }}
              className="bg-surface-container-low/60 hover:bg-secondary/10 border border-border-subtle hover:border-secondary/40 p-3.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-warning/10 text-warning group-hover:bg-warning group-hover:text-surface-white flex items-center justify-center transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-primary group-hover:text-secondary transition-colors">
                  Registar Benefício / Bolsa
                </p>
                <p className="text-[10px] text-outline">Descontos e bolsas sociais</p>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectView('academico');
                onShowToast('Navegando para Gestão Académica (M02)...');
              }}
              className="bg-surface-container-low/60 hover:bg-secondary/10 border border-border-subtle hover:border-secondary/40 p-3.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-success/10 text-success group-hover:bg-success group-hover:text-surface-white flex items-center justify-center transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-primary group-hover:text-secondary transition-colors">
                  Aceder à Gestão Académica (M02)
                </p>
                <p className="text-[10px] text-outline">Pautas, matrículas e pautas</p>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectView('utilizadores_permissoes');
                onShowToast('Navegando para Governação & Auditoria (M09)...');
              }}
              className="bg-surface-container-low/60 hover:bg-secondary/10 border border-border-subtle hover:border-secondary/40 p-3.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-surface-white flex items-center justify-center transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-primary group-hover:text-secondary transition-colors">
                  Governação & Auditoria (M09)
                </p>
                <p className="text-[10px] text-outline">Matriz RBAC e audit logs</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column (1/3 width): Actividade Recente */}
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-base text-primary flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary stroke-[1.75]" />
                  Actividade Recente
                </h3>
                <p className="text-xs text-outline font-medium">Eventos em tempo real nos módulos</p>
              </div>
              <span className="bg-surface-container text-primary font-bold text-[9px] px-2 py-0.5 rounded border border-border-subtle uppercase">
                HOJE - 11/09/2026
              </span>
            </div>

            {/* Event List */}
            <div className="space-y-2">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/50 hover:bg-surface-container-low transition-colors border border-border-subtle/50 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${act.color}`}>
                      {act.tipo}
                    </span>
                    <span className="font-semibold text-primary text-[11px] truncate">{act.desc}</span>
                  </div>
                  <span className="text-[10px] font-mono text-outline shrink-0 font-bold">{act.hora}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle">
            <span className="text-[10px] text-outline font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Sincronização em tempo real ativa
            </span>
            <button
              onClick={() => {
                onSelectView('utilizadores_permissoes');
                onShowToast('Carregando registos completos de auditoria...');
              }}
              className="text-xs font-bold text-secondary hover:text-secondary/80 flex items-center gap-1 cursor-pointer transition-colors"
            >
              Ver Log Completo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
