import React, { useMemo, useState } from 'react';
import { ActiveView } from '../types';
import {
  Award,
  Building2,
  CircleCheck as CheckCircle2,
  Download,
  Pencil as Edit3,
  ChartBar as FileBarChart,
  Landmark,
  Percent,
  Plus,
  Printer,
  Receipt,
  Search,
  Scale,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
  TriangleAlert as AlertTriangle,
  Upload,
  RotateCw,
  Calendar,
  Filter
} from 'lucide-react';

interface Props {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

type Tab = 'fluxo' | 'caixa' | 'bancos' | 'conciliacao' | 'bolsas' | 'descontos' | 'relatorios';

type Movement = {
  id: string;
  type: 'Receita' | 'Despesa';
  date: string;
  description: string;
  category: string;
  account: string;
  amount: number;
  status: 'Confirmado' | 'Pendente';
};

type BankAccount = {
  id: string;
  bank: string;
  iban: string;
  holder: string;
  balance: number;
  active: boolean;
};

const money = (value: number) =>
  new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(value);

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'fluxo', label: 'Fluxo & Movimentos', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'caixa', label: 'Caixa', icon: <Wallet className="w-4 h-4" /> },
  { key: 'bancos', label: 'Bancos', icon: <Landmark className="w-4 h-4" /> },
  { key: 'conciliacao', label: 'Conciliação Bancária', icon: <Scale className="w-4 h-4" /> },
  { key: 'bolsas', label: 'Bolsas', icon: <Award className="w-4 h-4" /> },
  { key: 'descontos', label: 'Descontos', icon: <Percent className="w-4 h-4" /> },
  { key: 'relatorios', label: 'Relatórios Financeiros', icon: <FileBarChart className="w-4 h-4" /> },
];

const initialMovements: Movement[] = [
  { id: 'r1', type: 'Receita', date: '08 Ago 2026', description: 'Propina Mensal — Setembro 2026 (Turma 10ºA)', category: 'Propinas', account: 'Caixa Principal', amount: 4200000, status: 'Confirmado' },
  { id: 'd1', type: 'Despesa', date: '09 Ago 2026', description: 'Salários Docentes — Folha 08/2026', category: 'Salários', account: 'BAI — Conta Operacional', amount: 3850000, status: 'Confirmado' },
  { id: 'r2', type: 'Receita', date: '07 Ago 2026', description: 'Matrícula Anual — 45 novos estudantes', category: 'Matrículas', account: 'BAI — Conta Operacional', amount: 1125000, status: 'Confirmado' },
  { id: 'd2', type: 'Despesa', date: '06 Ago 2026', description: 'Compra de Material Didático — Lote Trimestral', category: 'Material', account: 'Caixa Principal', amount: 320000, status: 'Confirmado' },
  { id: 'r3', type: 'Receita', date: '05 Ago 2026', description: 'Venda de Uniformes Oficiais — Lote 3', category: 'Uniformes', account: 'Caixa Principal', amount: 840000, status: 'Confirmado' },
  { id: 'd3', type: 'Despesa', date: '04 Ago 2026', description: 'Manutenção do Laboratório de Informática', category: 'Manutenção', account: 'BAF — Conta Investimento', amount: 180000, status: 'Pendente' },
  { id: 'd4', type: 'Despesa', date: '03 Ago 2026', description: 'Fornecimento de Gás e Água — Campus Principal', category: 'Utilidades', account: 'BAI — Conta Operacional', amount: 95000, status: 'Confirmado' },
  { id: 'r4', type: 'Receita', date: '02 Ago 2026', description: 'Emolumentos — Emissão de declarações', category: 'Emolumentos', account: 'Caixa Principal', amount: 77000, status: 'Pendente' },
  { id: 'd5', type: 'Despesa', date: '01 Ago 2026', description: 'Seguro Escolar Anual — Apólice 2026/2027', category: 'Seguros', account: 'BAF — Conta Investimento', amount: 450000, status: 'Confirmado' },
  { id: 'r5', type: 'Receita', date: '01 Ago 2026', description: 'Transporte Escolar — Passe Mensal Rota A', category: 'Transporte', account: 'BAI — Conta Operacional', amount: 1540000, status: 'Confirmado' },
];

const initialBanks: BankAccount[] = [
  { id: 'b1', bank: 'Banco Angolano de Investimentos (BAI)', iban: 'AO06.0000.0000.0000.0000.0000.0', holder: 'Vendaia School® — Conta Operacional', balance: 8420000, active: true },
  { id: 'b2', bank: 'Banco de Fomento Angola (BAF)', iban: 'AO06.0040.0000.0000.0000.0000.0', holder: 'Vendaia School® — Conta Investimento', balance: 24500000, active: true },
  { id: 'b3', bank: 'Standard Bank Angola', iban: 'AO06.0003.0000.0000.0000.0000.0', holder: 'Vendaia School® — Conta Reserva', balance: 5800000, active: false },
];

export const GestaoFinanceiraView: React.FC<Props> = ({ onShowToast }) => {
  const [tab, setTab] = useState<Tab>('fluxo');
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [banks, setBanks] = useState<BankAccount[]>(initialBanks);

  // Filters State for Fluxo & Movimentos
  const [search, setSearch] = useState('');
  const [filterAno, setFilterAno] = useState('2026/2027');
  const [filterDataInicio, setFilterDataInicio] = useState('');
  const [filterDataFim, setFilterDataFim] = useState('');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterCategoria, setFilterCategoria] = useState('Todas');
  const [filterConta, setFilterConta] = useState('Todas');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [modal, setModal] = useState<'movement' | 'bank' | null>(null);
  const [editing, setEditing] = useState<Movement | BankAccount | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ kind: 'movement' | 'bank'; item: Movement | BankAccount } | null>(null);
  const [form, setForm] = useState({
    type: 'Receita' as 'Receita' | 'Despesa',
    description: '',
    category: 'Propinas',
    account: 'Caixa Principal',
    amount: 0,
    bank: '',
    iban: '',
    holder: '',
    balance: 0
  });

  const revenueTotal = movements
    .filter((x) => x.type === 'Receita' && x.status === 'Confirmado')
    .reduce((sum, x) => sum + x.amount, 0);
  const expenseTotal = movements
    .filter((x) => x.type === 'Despesa' && x.status === 'Confirmado')
    .reduce((sum, x) => sum + x.amount, 0);
  const bankTotal = banks.filter((x) => x.active).reduce((sum, x) => sum + x.balance, 0);
  const result = revenueTotal - expenseTotal;

  const openMovementModal = (item?: Movement) => {
    setModal('movement');
    setEditing(item || null);
    setForm({
      type: item?.type || 'Receita',
      description: item?.description || '',
      category: item?.category || 'Propinas',
      account: item?.account || 'Caixa Principal',
      amount: item?.amount || 0,
      bank: '',
      iban: '',
      holder: '',
      balance: 0
    });
  };

  const openBankModal = (item?: BankAccount) => {
    setModal('bank');
    setEditing(item || null);
    setForm({
      type: 'Receita',
      description: '',
      category: 'Propinas',
      account: 'Caixa Principal',
      amount: 0,
      bank: item?.bank || '',
      iban: item?.iban || '',
      holder: item?.holder || '',
      balance: item?.balance || 0
    });
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (modal === 'bank') {
      const item: BankAccount = {
        id: (editing as BankAccount)?.id || `b${Date.now()}`,
        bank: form.bank,
        iban: form.iban,
        holder: form.holder,
        balance: form.balance,
        active: (editing as BankAccount)?.active ?? true
      };
      setBanks(editing ? banks.map((x) => (x.id === item.id ? item : x)) : [...banks, item]);
      onShowToast(editing ? 'Conta bancária atualizada.' : 'Conta bancária adicionada.');
    } else if (modal === 'movement') {
      const item: Movement = {
        id: (editing as Movement)?.id || `m-${Date.now()}`,
        type: form.type,
        date: '10 Ago 2026',
        description: form.description,
        category: form.category,
        account: form.account,
        amount: form.amount,
        status: 'Confirmado'
      };
      setMovements(editing ? movements.map((x) => (x.id === item.id ? item : x)) : [item, ...movements]);
      onShowToast(editing ? 'Lançamento atualizado.' : 'Lançamento registado com sucesso.');
    }
    setModal(null);
  };

  const remove = () => {
    if (!confirmDelete) return;
    if (confirmDelete.kind === 'bank') setBanks(banks.filter((x) => x.id !== confirmDelete.item.id));
    if (confirmDelete.kind === 'movement') setMovements(movements.filter((x) => x.id !== confirmDelete.item.id));
    setConfirmDelete(null);
    onShowToast('Registo removido com sucesso.');
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterAno('2026/2027');
    setFilterDataInicio('');
    setFilterDataFim('');
    setFilterTipo('Todos');
    setFilterCategoria('Todas');
    setFilterConta('Todas');
    setFilterStatus('Todos');
    onShowToast('Filtros reiniciados.');
  };

  // Filter logic for combined movements table
  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      const matchSearch = `${m.description} ${m.category} ${m.account}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchTipo = filterTipo === 'Todos' || m.type === filterTipo;
      const matchCategoria = filterCategoria === 'Todas' || m.category === filterCategoria;
      const matchConta = filterConta === 'Todas' || m.account === filterConta;
      const matchStatus = filterStatus === 'Todos' || m.status === filterStatus;

      return matchSearch && matchTipo && matchCategoria && matchConta && matchStatus;
    });
  }, [movements, search, filterTipo, filterCategoria, filterConta, filterStatus]);

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Kpi label="Total Receitas" value={money(revenueTotal)} tone="text-success" note="+12% vs mês anterior" icon={<TrendingUp className="w-4 h-4" />} />
        <Kpi label="Total Despesas" value={money(expenseTotal)} tone="text-error" note="+3% vs mês anterior" icon={<TrendingDown className="w-4 h-4" />} />
        <Kpi label="Resultado Operacional" value={money(result)} tone="text-primary" note={result >= 0 ? 'Superávit' : 'Défice'} icon={<Scale className="w-4 h-4" />} />
        <Kpi label="Saldo em Bancos" value={money(bankTotal)} tone="text-primary" note={`${banks.filter((x) => x.active).length} contas ativas`} icon={<Landmark className="w-4 h-4" />} />
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setTab(item.key);
              setSearch('');
            }}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === item.key
                ? 'bg-primary text-surface-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Fluxo & Movimentos (Unificado com Inteligência nos Filtros) */}
      {tab === 'fluxo' && (
        <div className="space-y-3">
          {/* Detailed Enterprise Filter Bar & Table (Unified Movimentos) */}
          <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-3">
            {/* Row 1: Contextual Filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs border-b border-border-subtle/60 pb-2.5">
              {/* Ano Letivo */}
              <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
                <span className="font-bold text-primary">Ano:</span>
                <select
                  value={filterAno}
                  onChange={(e) => setFilterAno(e.target.value)}
                  className="bg-transparent text-xs focus:outline-none font-bold text-primary cursor-pointer"
                >
                  <option value="2026/2027">2026/2027</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2024/2025">2024/2025</option>
                </select>
              </div>

              {/* Data Inicio */}
              <div className="relative flex items-center bg-surface border border-border-subtle rounded-lg px-2 py-1">
                <input
                  type="date"
                  value={filterDataInicio}
                  onChange={(e) => setFilterDataInicio(e.target.value)}
                  className="bg-transparent text-xs text-on-surface-variant focus:outline-none font-medium cursor-pointer"
                />
              </div>

              {/* Data Fim */}
              <div className="relative flex items-center bg-surface border border-border-subtle rounded-lg px-2 py-1">
                <input
                  type="date"
                  value={filterDataFim}
                  onChange={(e) => setFilterDataFim(e.target.value)}
                  className="bg-transparent text-xs text-on-surface-variant focus:outline-none font-medium cursor-pointer"
                />
              </div>

              {/* Tipo de Movimento */}
              <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
                <span className="font-bold text-primary">Tipo:</span>
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
                >
                  <option value="Todos">Todos os Movimentos</option>
                  <option value="Receita">Receitas (Entradas)</option>
                  <option value="Despesa">Despesas (Saídas)</option>
                </select>
              </div>

              {/* Categoria */}
              <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
                <span className="font-bold text-primary">Categoria:</span>
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
                >
                  <option value="Todas">Todas</option>
                  <option value="Propinas">Propinas</option>
                  <option value="Matrículas">Matrículas</option>
                  <option value="Uniformes">Uniformes</option>
                  <option value="Salários">Salários</option>
                  <option value="Material">Material Didático</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Utilidades">Utilidades</option>
                  <option value="Seguros">Seguros</option>
                  <option value="Emolumentos">Emolumentos</option>
                  <option value="Transporte">Transporte</option>
                </select>
              </div>

              {/* Conta / Origem */}
              <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
                <span className="font-bold text-primary">Conta:</span>
                <select
                  value={filterConta}
                  onChange={(e) => setFilterConta(e.target.value)}
                  className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
                >
                  <option value="Todas">Todas as Contas</option>
                  <option value="Caixa Principal">Caixa Principal</option>
                  <option value="BAI — Conta Operacional">BAI — Conta Operacional</option>
                  <option value="BAF — Conta Investimento">BAF — Conta Investimento</option>
                </select>
              </div>

              {/* Estado */}
              <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
                <span className="font-bold text-primary">Estado:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
                >
                  <option value="Todos">Todos</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </div>

            {/* Row 2: Search Input, Primary Action (+ Novo Lançamento), Import & Utility Buttons */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar descrição, categoria ou conta..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium"
                />
              </div>

              {/* Actions & Utilities */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openMovementModal()}
                  className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2]" />
                  <span>+ Novo Lançamento</span>
                </button>

                <button
                  onClick={() => onShowToast('Ficheiro de lançamentos importado.')}
                  className="bg-surface-white border border-border-subtle hover:bg-surface-container-low text-primary text-xs px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  <span>Importar</span>
                </button>

                <button
                  onClick={() => onShowToast('Lançamentos exportados para Excel.')}
                  title="Exportar Registos"
                  className="p-1.5 border border-border-subtle rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={handleResetFilters}
                  title="Atualizar / Reset Filtros"
                  className="p-1.5 border border-border-subtle rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-surface border border-border-subtle rounded-lg px-2 py-1 text-xs text-on-surface focus:outline-none font-medium cursor-pointer"
                >
                  <option value={10}>10 por pág.</option>
                  <option value={25}>25 por pág.</option>
                  <option value={50}>50 por pág.</option>
                  <option value={100}>100 por pág.</option>
                </select>
              </div>
            </div>

            {/* Unified Movements Data Table */}
            <div className="overflow-x-auto border border-border-subtle rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary">
                    <th className="px-3.5 py-3">Data</th>
                    <th className="px-3.5 py-3">Tipo</th>
                    <th className="px-3.5 py-3">Descrição</th>
                    <th className="px-3.5 py-3">Categoria</th>
                    <th className="px-3.5 py-3">Conta / Origem</th>
                    <th className="px-3.5 py-3 text-right">Valor</th>
                    <th className="px-3.5 py-3 text-center">Estado</th>
                    <th className="px-3.5 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-xs">
                  {filteredMovements.length ? (
                    filteredMovements.slice(0, itemsPerPage).map((row) => (
                      <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-3.5 py-3 text-on-surface-variant font-medium whitespace-nowrap">{row.date}</td>
                        <td className="px-3.5 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.type === 'Receita'
                                ? 'bg-success/15 text-success'
                                : 'bg-error/15 text-error'
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 font-bold text-primary">{row.description}</td>
                        <td className="px-3.5 py-3">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                            {row.category}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-on-surface-variant font-medium">{row.account}</td>
                        <td
                          className={`px-3.5 py-3 text-right font-bold whitespace-nowrap ${
                            row.type === 'Receita' ? 'text-success' : 'text-error'
                          }`}
                        >
                          {row.type === 'Receita' ? `+${money(row.amount)}` : `-${money(row.amount)}`}
                        </td>
                        <td className="px-3.5 py-3 text-center">
                          <span
                            className={`${
                              row.status === 'Confirmado'
                                ? 'bg-success/15 text-success'
                                : 'bg-warning/15 text-warning'
                            } px-2.5 py-1 rounded-full text-[11px] font-bold`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => openMovementModal(row)}
                            className="p-1.5 text-outline hover:text-info cursor-pointer"
                            title="Editar Lançamento"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ kind: 'movement', item: row })}
                            className="p-1.5 text-outline hover:text-error cursor-pointer"
                            title="Remover Lançamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-on-surface-variant">
                        Nenhum registo financeiro encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'caixa' && <Cash onShowToast={onShowToast} />}
      {tab === 'bancos' && <Banks rows={banks} onAdd={() => openBankModal()} onEdit={openBankModal} onDelete={(row) => setConfirmDelete({ kind: 'bank', item: row })} />}
      {tab === 'conciliacao' && <Reconciliation onShowToast={onShowToast} />}
      {tab === 'bolsas' && (
        <SimpleCards
          title="Bolsas de Estudo & Apoios Sociais"
          action="Nova Bolsa"
          icon={<Award className="w-5 h-5" />}
          items={[
            'Bolsa Mérito Académico 2026 — Ana Catarina Mendes Silva',
            'Bolsa Social Família Numerosa — Carlos Eduardo Ferreira',
            'Bolsa Integral Orçamento Estatal — Eduardo Jorge Lima'
          ]}
          onAction={() => onShowToast('Formulário de bolsa aberto.')}
        />
      )}
      {tab === 'descontos' && (
        <SimpleCards
          title="Configuração de Descontos"
          action="Novo Desconto"
          icon={<Percent className="w-5 h-5" />}
          items={[
            'Desconto Pontualidade — 5% nas propinas',
            'Desconto Irmandade — 15% para 3 ou mais irmãos',
            'Desconto Fixo Funcionários Vendaia — 12.000 Kz'
          ]}
          onAction={() => onShowToast('Formulário de desconto aberto.')}
        />
      )}
      {tab === 'relatorios' && <Reports onShowToast={onShowToast} />}

      {/* Modal for Movements & Bank Accounts */}
      {modal && (
        <Modal
          title={modal === 'bank' ? 'Conta Bancária' : editing ? 'Editar Lançamento' : 'Novo Lançamento Financeiro'}
          onClose={() => setModal(null)}
        >
          <form onSubmit={save} className="space-y-3 text-xs">
            {modal === 'bank' ? (
              <>
                <Field label="Banco / Instituição" value={form.bank} onChange={(v) => setForm({ ...form, bank: v })} required />
                <Field label="IBAN" value={form.iban} onChange={(v) => setForm({ ...form, iban: v })} required />
                <Field label="Titular da Conta" value={form.holder} onChange={(v) => setForm({ ...form, holder: v })} required />
                <Field
                  label="Saldo disponível (Kz)"
                  type="number"
                  value={String(form.balance)}
                  onChange={(v) => setForm({ ...form, balance: Number(v) })}
                />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-outline font-bold">
                    Tipo de Lançamento
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as 'Receita' | 'Despesa' })}
                      className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none font-bold"
                    >
                      <option value="Receita">Receita (Entrada)</option>
                      <option value="Despesa">Despesa (Saída)</option>
                    </select>
                  </label>
                  <Field
                    label="Valor (Kz)"
                    type="number"
                    value={String(form.amount)}
                    onChange={(v) => setForm({ ...form, amount: Number(v) })}
                    required
                  />
                </div>
                <Field label="Descrição" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Categoria" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
                  <Field label="Conta / Origem" value={form.account} onChange={(v) => setForm({ ...form, account: v })} />
                </div>
              </>
            )}
            <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-2 rounded-lg font-bold cursor-pointer transition-all shadow-sm">
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {confirmDelete && (
        <Modal title="Confirmar remoção" onClose={() => setConfirmDelete(null)}>
          <div className="space-y-4 text-xs">
            <p className="text-on-surface-variant flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Esta ação não pode ser desfeita. Deseja remover este registo?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button onClick={remove} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer">
                Sim, Remover
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Kpi = ({ label, value, tone, note, icon }: { label: string; value: string; tone: string; note: string; icon: React.ReactNode }) => (
  <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-[68px]">
    <div>
      <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">{label}</span>
      <span className={`text-xl font-bold leading-none ${tone}`}>{value}</span>
    </div>
    <div className="text-right">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
        {icon}
        {note}
      </span>
    </div>
  </div>
);

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">{children}</div>
);

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) => (
  <label className="block text-outline font-bold">
    {label}
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none"
    />
  </label>
);

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-lg p-6">
      <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          {title}
        </h2>
        <button onClick={onClose} className="text-outline hover:text-primary p-1 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Cash = ({ onShowToast }: { onShowToast: (x: string) => void }) => (
  <Panel>
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg font-bold text-primary">Caixa Principal — 10 Ago 2026</h2>
        <p className="text-xs text-on-surface-variant">Turno da manhã · Operador: Sara Silva</p>
      </div>
      <div className="flex gap-2 items-center">
        <span className="bg-success/15 text-success px-2.5 py-1 rounded-full text-[11px] font-bold">Caixa Aberto</span>
        <button onClick={() => onShowToast('Fecho de caixa iniciado.')} className="border border-border-subtle px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
          Fechar Caixa
        </button>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        ['Fundo Inicial', 50000],
        ['Entradas', 78500],
        ['Saídas', 8500],
        ['Saldo Atual', 120000]
      ].map(([label, value]) => (
        <div key={String(label)} className="border border-border-subtle rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-outline">{label}</span>
          <p className="text-lg font-bold text-primary mt-1">{money(Number(value))}</p>
        </div>
      ))}
    </div>
  </Panel>
);

const Banks = ({
  rows,
  onAdd,
  onEdit,
  onDelete
}: {
  rows: BankAccount[];
  onAdd: () => void;
  onEdit: (x: BankAccount) => void;
  onDelete: (x: BankAccount) => void;
}) => (
  <Panel>
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg font-bold text-primary">Contas Bancárias da Instituição</h2>
        <p className="text-xs text-on-surface-variant">Saldos e dados das contas utilizadas pela escola.</p>
      </div>
      <button onClick={onAdd} className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm">
        <Plus className="w-4 h-4" />
        Nova Conta
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {rows.map((row) => (
        <div key={row.id} className="border border-border-subtle rounded-lg p-4 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-primary">{row.bank}</h3>
                <p className="text-[10px] text-outline font-mono">{row.iban}</p>
              </div>
            </div>
            <span className={`${row.active ? 'bg-success/15 text-success' : 'bg-surface-container text-outline'} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
              {row.active ? 'Ativa' : 'Inativa'}
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-3">{row.holder}</p>
          <div className="border-t border-border-subtle mt-3 pt-3 flex justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-outline">Saldo Disponível</span>
              <p className="font-bold text-success">{money(row.balance)}</p>
            </div>
            <div>
              <button onClick={() => onEdit(row)} className="p-1.5 text-outline hover:text-info cursor-pointer">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(row)} className="p-1.5 text-outline hover:text-error cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

const Reconciliation = ({ onShowToast }: { onShowToast: (x: string) => void }) => (
  <Panel>
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg font-bold text-primary">Conciliação Bancária</h2>
        <p className="text-xs text-on-surface-variant">Compare os movimentos importados com os registos internos.</p>
      </div>
      <button
        onClick={() => onShowToast('Todos os movimentos pendentes foram conciliados.')}
        className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
      >
        <CheckCircle2 className="w-4 h-4" />
        Conciliar Todos
      </button>
    </div>
    <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-xs text-on-surface-variant mb-3">
      Existem <strong className="text-warning">3 movimentos</strong> bancários por conciliar.
    </div>
    <div className="border border-border-subtle rounded-lg p-3 space-y-2">
      {['Transferência recebida — Propinas 10ºA', 'Juros de depósito a prazo — Agosto', 'Pagamento fornecedor — Material didático'].map((item) => (
        <div key={item} className="flex justify-between items-center border-b border-border-subtle last:border-0 pb-2 last:pb-0">
          <span className="text-xs font-bold text-primary">{item}</span>
          <button onClick={() => onShowToast('Movimento conciliado com sucesso.')} className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-md font-bold cursor-pointer">
            Conciliar
          </button>
        </div>
      ))}
    </div>
  </Panel>
);

const SimpleCards = ({
  title,
  action,
  icon,
  items,
  onAction
}: {
  title: string;
  action: string;
  icon: React.ReactNode;
  items: string[];
  onAction: () => void;
}) => (
  <Panel>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold text-primary flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <button onClick={onAction} className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm">
        <Plus className="w-4 h-4" />
        {action}
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {items.map((item, index) => (
        <div key={item} className="border border-border-subtle rounded-lg p-4 hover:shadow-md transition-all">
          <div className="flex justify-between">
            <span className="bg-success/15 text-success px-2 py-0.5 rounded-full text-[10px] font-bold">
              {index === 2 ? 'Suspensa' : 'Ativa'}
            </span>
            <Award className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-bold text-primary mt-3">{item}</p>
          <p className="text-[11px] text-on-surface-variant mt-2">Validade: Junho 2027 · Gestão financeira</p>
        </div>
      ))}
    </div>
  </Panel>
);

const Reports = ({ onShowToast }: { onShowToast: (x: string) => void }) => (
  <Panel>
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg font-bold text-primary">Relatórios Financeiros</h2>
        <p className="text-xs text-on-surface-variant">Relatórios para a direção e auditoria.</p>
      </div>
      <button
        onClick={() => onShowToast('Relatório consolidado exportado.')}
        className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
      >
        <Download className="w-4 h-4" />
        Exportar Consolidado
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {[
        'Demonstração de Resultados',
        'Mapa de Fluxo de Caixa',
        'Relatório de Conciliação Bancária',
        'Relatório de Bolsas e Descontos',
        'Relatório de Dívidas e Cobrança',
        'Fecho de Caixa Mensal'
      ].map((item) => (
        <button
          key={item}
          onClick={() => onShowToast(`Relatório “${item}” gerado.`)}
          className="text-left border border-border-subtle rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
        >
          <FileBarChart className="w-5 h-5 text-primary mb-2" />
          <h3 className="text-sm font-bold text-primary">{item}</h3>
          <p className="text-[11px] text-on-surface-variant mt-1">Gerar e descarregar relatório detalhado.</p>
        </button>
      ))}
    </div>
  </Panel>
);
