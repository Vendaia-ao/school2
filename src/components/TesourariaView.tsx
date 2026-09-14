import React, { useMemo, useState } from 'react';
import { ActiveView } from '../types';
import {
  Search, Plus, Receipt, Download, Printer, Send, Wallet,
  Clock, TriangleAlert as AlertTriangle, FileText, X, Trash2, Eye,
  TrendingUp, CreditCard, Filter, Upload, RotateCw, Calendar,
} from 'lucide-react';

interface Props { onSelectView: (view: ActiveView) => void; onShowToast: (msg: string) => void; }

type Tab = 'faturas' | 'recibos';
type InvoiceStatus = 'Pago' | 'Emitido' | 'Parcial' | 'Atrasado' | 'Pendente';
type PaymentMethod = 'Numerário' | 'Multicaixa' | 'Transferência' | 'Referência MB' | 'Cartão';

interface InvoiceItem {
  id: string; numero: string; estudante: string; matricula: string;
  descricao: string; itens: { nome: string; valor: number }[];
  valorTotal: number; valorPago: number; dataEmissao: string; dataVencimento: string;
  estado: InvoiceStatus; multaAplicada: number; jurosAplicados: number;
}
interface ReceiptItem {
  id: string; numero: string; faturaRef: string; estudante: string;
  valor: number; metodo: PaymentMethod; data: string; operador: string;
}
interface ServiceProduct { id: string; nome: string; categoria: string; preco: number; }
interface StudentOption { id: string; nome: string; matricula: string; classe: string; turma: string; ultimoMesPago: string; }

const money = (v: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(v);

const statusChip = (e: InvoiceStatus): string => ({
  Pago: 'bg-success/15 text-success', Emitido: 'bg-info/15 text-info',
  Parcial: 'bg-warning/15 text-warning', Atrasado: 'bg-error/15 text-error',
  Pendente: 'bg-warning/15 text-warning',
}[e]);

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'faturas', label: 'Gestão de Faturas & Cobranças', icon: <FileText className="w-4 h-4" /> },
  { key: 'recibos', label: 'Recibos Emitidos', icon: <Receipt className="w-4 h-4" /> },
];

const mockStudentsList: StudentOption[] = [
  { id: 'st1', nome: 'Afonso Mateus Lemba', matricula: '3798', classe: '10ª Classe', turma: 'Turma A', ultimoMesPago: 'Setembro 2026' },
  { id: 'st2', nome: 'Beatriz Lemba Neto', matricula: '4102', classe: '11ª Classe', turma: 'Turma B', ultimoMesPago: 'Julho 2026' },
  { id: 'st3', nome: 'Carlos Eduardo Ferreira', matricula: '20230512', classe: '12ª Classe', turma: 'IG12A', ultimoMesPago: 'Junho 2026' },
  { id: 'st4', nome: 'Daniela Sofia Santos', matricula: '20230891', classe: '10ª Classe', turma: 'CONT10A', ultimoMesPago: 'Agosto 2026' },
  { id: 'st5', nome: 'João Miguel Santos Almeida', matricula: '20230145', classe: '10º Ano', turma: 'Turma A', ultimoMesPago: 'Setembro 2026' },
  { id: 'st6', nome: 'Maria Joana Silva Santos', matricula: '20230911', classe: '13ª Classe', turma: 'ENF13A', ultimoMesPago: 'Setembro 2026' },
  { id: 'st7', nome: 'Ana Catarina Mendes Silva', matricula: '20230722', classe: '11ª Classe', turma: 'CC11A', ultimoMesPago: 'Agosto 2026' },
  { id: 'st8', nome: 'Eduardo Manuel Kiala', matricula: '20230488', classe: '12ª Classe', turma: 'IG12B', ultimoMesPago: 'Setembro 2026' },
  { id: 'st9', nome: 'Francisca Paula Domingos', matricula: '20230301', classe: '10ª Classe', turma: 'CONT10B', ultimoMesPago: 'Julho 2026' },
];

const availableServices: ServiceProduct[] = [
  { id: 's1', nome: 'Propina Mensal', categoria: 'Propinas', preco: 35000 },
  { id: 's2', nome: 'Matrícula Anual', categoria: 'Matrículas', preco: 25000 },
  { id: 's3', nome: 'Seguro Escolar', categoria: 'Emolumentos', preco: 5000 },
  { id: 's4', nome: 'Uniforme Completo', categoria: 'Uniformes', preco: 18000 },
  { id: 's5', nome: 'Transporte Escolar — Mensal', categoria: 'Transporte', preco: 15000 },
  { id: 's6', nome: 'Emissão de Declaração', categoria: 'Emolumentos', preco: 2000 },
  { id: 's7', nome: 'Certificado de Conclusão', categoria: 'Emolumentos', preco: 8000 },
  { id: 's8', nome: 'Segunda Via do Cartão', categoria: 'Emolumentos', preco: 1500 },
  { id: 's9', nome: 'Atividade Extracurricular — Robótica', categoria: 'Extracurricular', preco: 10000 },
  { id: 's10', nome: 'Livro Didático — Matemática', categoria: 'Material', preco: 6500 },
];

const initialInvoices: InvoiceItem[] = [
  { id: 'inv1', numero: 'FT 2026/1042', estudante: 'Afonso Mateus Lemba', matricula: '3798', descricao: 'Propina Mensal — Setembro 2026', itens: [{ nome: 'Propina Mensal — Setembro 2026', valor: 35000 }], valorTotal: 35000, valorPago: 35000, dataEmissao: '01 Set 2026', dataVencimento: '10 Set 2026', estado: 'Pago', multaAplicada: 0, jurosAplicados: 0 },
  { id: 'inv2', numero: 'FT 2026/1043', estudante: 'Afonso Mateus Lemba', matricula: '3798', descricao: 'Propina Mensal — Outubro 2026', itens: [{ nome: 'Propina Mensal — Outubro 2026', valor: 35000 }], valorTotal: 35000, valorPago: 0, dataEmissao: '01 Out 2026', dataVencimento: '10 Out 2026', estado: 'Pendente', multaAplicada: 0, jurosAplicados: 0 },
  { id: 'inv3', numero: 'FT 2026/1038', estudante: 'Beatriz Lemba Neto', matricula: '4102', descricao: 'Propina + Transporte — Agosto 2026', itens: [{ nome: 'Propina Mensal — Agosto 2026', valor: 35000 }, { nome: 'Transporte Escolar — Agosto 2026', valor: 15000 }], valorTotal: 50000, valorPago: 25000, dataEmissao: '01 Ago 2026', dataVencimento: '10 Ago 2026', estado: 'Parcial', multaAplicada: 700, jurosAplicados: 350 },
  { id: 'inv4', numero: 'FT 2026/1030', estudante: 'Carlos Eduardo Ferreira', matricula: '20230512', descricao: 'Matrícula + Seguro — Ano Letivo 2026/2027', itens: [{ nome: 'Matrícula Anual', valor: 25000 }, { nome: 'Seguro Escolar', valor: 5000 }], valorTotal: 30000, valorPago: 0, dataEmissao: '15 Ago 2026', dataVencimento: '25 Ago 2026', estado: 'Atrasado', multaAplicada: 600, jurosAplicados: 300 },
  { id: 'inv5', numero: 'FT 2026/1051', estudante: 'Daniela Sofia Santos', matricula: '20230891', descricao: 'Uniforme + Material — Setembro 2026', itens: [{ nome: 'Uniforme Completo', valor: 18000 }, { nome: 'Livro Didático — Matemática', valor: 6500 }], valorTotal: 24500, valorPago: 0, dataEmissao: '05 Set 2026', dataVencimento: '20 Set 2026', estado: 'Emitido', multaAplicada: 0, jurosAplicados: 0 },
];

const initialReceipts: ReceiptItem[] = [
  { id: 'rc1', numero: 'REC 2026/0892', faturaRef: 'FT 2026/1042', estudante: 'Afonso Mateus Lemba', valor: 35000, metodo: 'Referência MB', data: '08 Set 2026', operador: 'Sara Silva' },
  { id: 'rc2', numero: 'REC 2026/0885', faturaRef: 'FT 2026/1038', estudante: 'Beatriz Lemba Neto', valor: 25000, metodo: 'Numerário', data: '05 Ago 2026', operador: 'Sara Silva' },
  { id: 'rc3', numero: 'REC 2026/0870', faturaRef: 'FT 2026/1025', estudante: 'Maria Joana Silva Santos', valor: 42000, metodo: 'Transferência', data: '02 Ago 2026', operador: 'Beatriz Ferreira' },
  { id: 'rc4', numero: 'REC 2026/0865', faturaRef: 'FT 2026/1020', estudante: 'Ana Catarina Mendes Silva', valor: 35000, metodo: 'Multicaixa', data: '28 Jul 2026', operador: 'Sara Silva' },
];

export const TesourariaView: React.FC<Props> = ({ onShowToast }) => {
  const [tab, setTab] = useState<Tab>('faturas');
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [receipts, setReceipts] = useState<ReceiptItem[]>(initialReceipts);
  const [search, setSearch] = useState('');
  const [filterAno, setFilterAno] = useState('2026/2027');
  const [filterDataInicio, setFilterDataInicio] = useState('');
  const [filterDataFim, setFilterDataFim] = useState('');
  const [filterClasse, setFilterClasse] = useState('Todas');
  const [filterCurso, setFilterCurso] = useState('Todos');
  const [filterTurma, setFilterTurma] = useState('Todas');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterMetodo, setFilterMetodo] = useState('Todos');
  const [filterFinanceiro, setFilterFinanceiro] = useState('Todos');
  const [filterDocPendente, setFilterDocPendente] = useState('Todos');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceStudent, setInvoiceStudent] = useState('');
  const [invoiceMatricula, setInvoiceMatricula] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [selectedStudentObj, setSelectedStudentObj] = useState<StudentOption | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<{ nome: string; valor: number }[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');

  const filteredStudentSuggestions = useMemo(() => {
    if (!studentSearchQuery.trim()) return mockStudentsList;
    const q = studentSearchQuery.toLowerCase();
    return mockStudentsList.filter(
      (s) => s.nome.toLowerCase().includes(q) || s.matricula.toLowerCase().includes(q) || s.classe.toLowerCase().includes(q)
    );
  }, [studentSearchQuery]);

  const [payInvoice, setPayInvoice] = useState<InvoiceItem | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Numerário');

  const [viewInvoice, setViewInvoice] = useState<InvoiceItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<InvoiceItem | null>(null);

  const totalCobrado = invoices.reduce((s, i) => s + i.valorTotal, 0);
  const totalRecebido = invoices.reduce((s, i) => s + i.valorPago, 0);
  const totalPendente = invoices.filter((i) => i.estado !== 'Pago').reduce((s, i) => s + (i.valorTotal - i.valorPago), 0);
  const totalAtrasado = invoices.filter((i) => i.estado === 'Atrasado').reduce((s, i) => s + (i.valorTotal - i.valorPago), 0);
  const invoiceTotal = invoiceItems.reduce((s, i) => s + i.valor, 0);
  const pendingInvoices = invoices.filter((i) => i.estado !== 'Pago');

  const addServiceToInvoice = () => {
    const svc = availableServices.find((s) => s.id === selectedServiceId);
    if (!svc) return;
    setInvoiceItems([...invoiceItems, { nome: svc.nome, valor: svc.preco }]);
    setSelectedServiceId('');
  };
  const removeInvoiceItem = (idx: number) => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceStudent.trim() || invoiceItems.length === 0) { onShowToast('Preencha o nome do estudante e adicione pelo menos um item.'); return; }
    const newNum = `FT 2026/${String(1052 + invoices.length).padStart(4, '0')}`;
    const newInvoice: InvoiceItem = {
      id: `inv-${Date.now()}`, numero: newNum, estudante: invoiceStudent, matricula: invoiceMatricula || '—',
      descricao: invoiceItems.map((i) => i.nome).join(', '), itens: invoiceItems,
      valorTotal: invoiceTotal, valorPago: 0, dataEmissao: '10 Ago 2026', dataVencimento: '25 Ago 2026',
      estado: 'Emitido', multaAplicada: 0, jurosAplicados: 0,
    };
    setInvoices([newInvoice, ...invoices]);
    onShowToast(`Fatura ${newNum} emitida com sucesso para ${invoiceStudent}.`);
    setIsInvoiceModalOpen(false); setInvoiceStudent(''); setInvoiceMatricula(''); setInvoiceItems([]);
  };

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payInvoice) return;
    const remaining = payInvoice.valorTotal - payInvoice.valorPago;
    if (payAmount <= 0 || payAmount > remaining + 0.01) { onShowToast('Valor de pagamento inválido.'); return; }
    const newValorPago = payInvoice.valorPago + payAmount;
    const newEstado: InvoiceStatus = newValorPago >= payInvoice.valorTotal ? 'Pago' : newValorPago > 0 ? 'Parcial' : payInvoice.estado;
    const newReceipt: ReceiptItem = {
      id: `rc-${Date.now()}`, numero: `REC 2026/${String(893 + receipts.length).padStart(4, '0')}`,
      faturaRef: payInvoice.numero, estudante: payInvoice.estudante, valor: payAmount, metodo: payMethod,
      data: '10 Ago 2026', operador: 'Sara Silva',
    };
    setInvoices(invoices.map((inv) => inv.id === payInvoice.id ? { ...inv, valorPago: newValorPago, estado: newEstado } : inv));
    setReceipts([newReceipt, ...receipts]);
    onShowToast(`Pagamento de ${money(payAmount)} registado. Recibo ${newReceipt.numero} emitido.`);
    setPayInvoice(null); setPayAmount(0); setPayMethod('Numerário');
  };

  const handleDeleteInvoice = () => {
    if (!confirmDelete) return;
    setInvoices(invoices.filter((i) => i.id !== confirmDelete.id));
    onShowToast(`Fatura ${confirmDelete.numero} anulada.`);
    setConfirmDelete(null);
  };

  const filteredInvoices = useMemo(() => invoices.filter((inv) => {
    const ms = `${inv.numero} ${inv.estudante} ${inv.matricula} ${inv.descricao}`.toLowerCase().includes(search.toLowerCase());
    
    let mf = true;
    if (filterStatus === 'Todos') mf = true;
    else if (filterStatus === 'Pendente') mf = inv.estado === 'Pendente' || inv.estado === 'Emitido';
    else if (filterStatus === 'Atrasado') mf = inv.estado === 'Atrasado';
    else if (filterStatus === 'Parcial') mf = inv.estado === 'Parcial';
    else if (filterStatus === 'Pago') mf = inv.estado === 'Pago';

    return ms && mf;
  }), [invoices, search, filterStatus]);

  const filteredReceipts = useMemo(() => receipts.filter((rc) => {
    const ms = `${rc.numero} ${rc.faturaRef} ${rc.estudante} ${rc.operador} ${rc.metodo}`.toLowerCase().includes(search.toLowerCase());
    const mm = filterMetodo === 'Todos' || rc.metodo === filterMetodo;
    return ms && mm;
  }), [receipts, search, filterMetodo]);

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-[68px]"><div><span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Total Cobrado</span><span className="text-xl font-bold text-primary leading-none">{money(totalCobrado)}</span></div><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-info bg-info/10 text-[10px] font-bold"><FileText className="w-3.5 h-3.5" />{invoices.length} faturas</span></div>
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-[68px]"><div><span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Total Recebido</span><span className="text-xl font-bold text-success leading-none">{money(totalRecebido)}</span></div><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold"><TrendingUp className="w-3.5 h-3.5" />{receipts.length} recibos</span></div>
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-[68px]"><div><span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Pendente</span><span className="text-xl font-bold text-warning leading-none">{money(totalPendente)}</span></div><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-warning bg-warning/15 text-[10px] font-bold"><Clock className="w-3.5 h-3.5" />{pendingInvoices.length} pendentes</span></div>
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-[68px]"><div><span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Em Atraso</span><span className="text-xl font-bold text-error leading-none">{money(totalAtrasado)}</span></div><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-error bg-error/15 text-[10px] font-bold"><AlertTriangle className="w-3.5 h-3.5" />{invoices.filter((i) => i.estado === 'Atrasado').length} dívidas</span></div>
      </div>

      {/* Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => { setTab(item.key); setSearch(''); setFilterStatus('Todos'); }}
            className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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

      {/* Tab: Gestão Unificada de Faturas & Cobranças */}
      {tab === 'faturas' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-3">
          {/* Detailed Enterprise Filters Bar (Row 1) */}
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
                <option value="2023/2024">2023/2024</option>
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

            {/* Classe */}
            <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
              <span className="font-bold text-primary">Classe:</span>
              <select
                value={filterClasse}
                onChange={(e) => setFilterClasse(e.target.value)}
                className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
              >
                <option value="Todas">Todas</option>
                <option value="10ª Classe">10ª Classe</option>
                <option value="11ª Classe">11ª Classe</option>
                <option value="12ª Classe">12ª Classe</option>
                <option value="13ª Classe">13ª Classe</option>
              </select>
            </div>

            {/* Curso */}
            <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
              <span className="font-bold text-primary">Curso:</span>
              <select
                value={filterCurso}
                onChange={(e) => setFilterCurso(e.target.value)}
                className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
              >
                <option value="Todos">Todos</option>
                <option value="Informática de Gestão">Informática de Gestão</option>
                <option value="Contabilidade">Contabilidade</option>
                <option value="Enfermagem">Enfermagem</option>
                <option value="Construção Civil">Construção Civil</option>
              </select>
            </div>

            {/* Turma */}
            <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
              <span className="font-bold text-primary">Turma:</span>
              <select
                value={filterTurma}
                onChange={(e) => setFilterTurma(e.target.value)}
                className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
              >
                <option value="Todas">Todas</option>
                <option value="IG10A">IG10A</option>
                <option value="IG11B">IG11B</option>
                <option value="CONT12A">CONT12A</option>
                <option value="ENF10A">ENF10A</option>
                <option value="CC13A">CC13A</option>
              </select>
            </div>

            {/* Estado (Fusão Inteligente: Estado Fatura + Estado Financeiro) */}
            <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
              <span className="font-bold text-primary">Estado:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
              >
                <option value="Todos">Todos</option>
                <option value="Pendente">Pendentes</option>
                <option value="Atrasado">Em Atraso</option>
                <option value="Parcial">Pagamento Parcial</option>
                <option value="Pago">Pagas (Total)</option>
              </select>
            </div>


          </div>

          {/* Row 2: Search Input, Primary Action (+ Emitir Fatura), Import & Utility Buttons */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar Nome, Nº de Matrícula ou Contacto..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium"
              />
            </div>

            {/* Action & Utility Controls */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => {
                  setInvoiceStudent('');
                  setInvoiceMatricula('');
                  setStudentSearchQuery('');
                  setSelectedStudentObj(null);
                  setIsStudentDropdownOpen(false);
                  setInvoiceItems([]);
                  setSelectedServiceId('');
                  setIsInvoiceModalOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 text-surface-white text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[2]" />
                <span className="whitespace-nowrap">Emitir Fatura</span>
              </button>

              <button
                onClick={() => onShowToast('Importação de faturas/cobranças iniciada.')}
                className="bg-surface border border-border-subtle hover:bg-surface-container-low text-primary text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-outline" />
                <span>Importar</span>
              </button>

              <button
                onClick={() => onShowToast('Lista de faturas descarregada em ficheiro Excel/CSV.')}
                className="p-1.5 bg-surface border border-border-subtle hover:bg-surface-container-low text-on-surface rounded-lg transition-all cursor-pointer"
                title="Descarregar Faturas"
              >
                <Download className="w-4 h-4 text-outline" />
              </button>

              <button
                onClick={() => onShowToast('Documento enviado para a impressora.')}
                className="p-1.5 bg-surface border border-border-subtle hover:bg-surface-container-low text-on-surface rounded-lg transition-all cursor-pointer"
                title="Imprimir"
              >
                <Printer className="w-4 h-4 text-outline" />
              </button>

              <button
                onClick={() => {
                  setSearch('');
                  setFilterAno('2026/2027');
                  setFilterDataInicio('');
                  setFilterDataFim('');
                  setFilterClasse('Todas');
                  setFilterCurso('Todos');
                  setFilterTurma('Todas');
                  setFilterStatus('Todos');
                  setFilterFinanceiro('Todos');
                  setFilterDocPendente('Todos');
                  onShowToast('Filtros reinicializados.');
                }}
                className="p-1.5 bg-surface border border-border-subtle hover:bg-surface-container-low text-on-surface rounded-lg transition-all cursor-pointer"
                title="Atualizar / Limpar Filtros"
              >
                <RotateCw className="w-4 h-4 text-outline" />
              </button>

              <div className="border-l border-border-subtle pl-1.5">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                  className="bg-surface border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary focus:outline-none cursor-pointer"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Unified Smart Table */}
          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary">
                  <th className="px-3.5 py-3">Nº Fatura</th>
                  <th className="px-3.5 py-3">Estudante</th>
                  <th className="px-3.5 py-3">Descrição / Serviços</th>
                  <th className="px-3.5 py-3">Vencimento</th>
                  <th className="px-3.5 py-3 text-right">Valor Total</th>
                  <th className="px-3.5 py-3 text-right">Valor Pago</th>
                  <th className="px-3.5 py-3 text-right">Saldo Devedor</th>
                  <th className="px-3.5 py-3 text-center">Estado</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs">
                {filteredInvoices.length ? (
                  filteredInvoices.map((inv) => {
                    const saldoDevedor = inv.valorTotal - inv.valorPago;
                    return (
                      <tr key={inv.id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-3.5 py-3 font-bold text-primary font-mono text-[11px]">{inv.numero}</td>
                        <td className="px-3.5 py-3">
                          <div className="font-bold text-primary">{inv.estudante}</div>
                          <div className="text-[10px] text-outline">Proc. {inv.matricula}</div>
                        </td>
                        <td className="px-3.5 py-3 text-on-surface-variant max-w-xs truncate">{inv.descricao}</td>
                        <td className="px-3.5 py-3 text-on-surface-variant whitespace-nowrap">{inv.dataVencimento}</td>
                        <td className="px-3.5 py-3 text-right font-bold text-primary">{money(inv.valorTotal)}</td>
                        <td className="px-3.5 py-3 text-right text-success font-medium">{money(inv.valorPago)}</td>
                        <td className="px-3.5 py-3 text-right font-bold">
                          {saldoDevedor > 0 ? (
                            <span className="text-error">{money(saldoDevedor)}</span>
                          ) : (
                            <span className="text-outline">0 Kz</span>
                          )}
                        </td>
                        <td className="px-3.5 py-3 text-center">
                          <span className={`${statusChip(inv.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>
                            {inv.estado}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            {saldoDevedor > 0 && (
                              <button
                                onClick={() => {
                                  setPayInvoice(inv);
                                  setPayAmount(saldoDevedor);
                                }}
                                className="px-2 py-1 bg-success/10 text-success hover:bg-success hover:text-white rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer mr-1"
                                title="Registar Pagamento de Fatura"
                              >
                                <Wallet className="w-3.5 h-3.5" />
                                Pagar
                              </button>
                            )}
                            <button
                              onClick={() => setViewInvoice(inv)}
                              className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer"
                              title="Ver Detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === inv.id ? null : inv.id)}
                              className="p-1.5 text-outline hover:text-primary rounded hover:bg-surface-variant/50 cursor-pointer"
                              title="Mais Opções"
                            >
                              <span className="material-symbols-outlined text-[18px]">more_vert</span>
                            </button>
                          </div>

                          {activeMenuId === inv.id && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                              <div className="absolute right-2 top-8 w-48 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setViewInvoice(inv);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-primary"
                                >
                                  <Eye className="w-3.5 h-3.5" /> Ver Detalhes
                                </button>
                                {saldoDevedor > 0 && (
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setPayInvoice(inv);
                                      setPayAmount(saldoDevedor);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-success"
                                  >
                                    <Wallet className="w-3.5 h-3.5" /> Registar Pagamento
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onShowToast(`Fatura ${inv.numero} descarregada em PDF.`);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-info"
                                >
                                  <Download className="w-3.5 h-3.5" /> Descarregar PDF
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onShowToast(`Fatura ${inv.numero} enviada para impressão.`);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-on-surface"
                                >
                                  <Printer className="w-3.5 h-3.5" /> Imprimir
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onShowToast(`Fatura ${inv.numero} enviada por email/SMS.`);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-secondary"
                                >
                                  <Send className="w-3.5 h-3.5" /> Enviar
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setConfirmDelete(inv);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-error/10 rounded flex items-center gap-2 cursor-pointer font-medium text-error"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Anular Fatura
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-on-surface-variant font-medium">
                      Nenhuma fatura encontrada com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Recibos Emitidos */}
      {tab === 'recibos' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-3">
          {/* Detailed Enterprise Filters Bar (Row 1) */}
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

            {/* Classe */}
            <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
              <span className="font-bold text-primary">Classe:</span>
              <select
                value={filterClasse}
                onChange={(e) => setFilterClasse(e.target.value)}
                className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
              >
                <option value="Todas">Todas</option>
                <option value="10ª Classe">10ª Classe</option>
                <option value="11ª Classe">11ª Classe</option>
                <option value="12ª Classe">12ª Classe</option>
                <option value="13ª Classe">13ª Classe</option>
              </select>
            </div>

            {/* Curso */}
            <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
              <span className="font-bold text-primary">Curso:</span>
              <select
                value={filterCurso}
                onChange={(e) => setFilterCurso(e.target.value)}
                className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
              >
                <option value="Todos">Todos</option>
                <option value="Informática de Gestão">Informática de Gestão</option>
                <option value="Contabilidade">Contabilidade</option>
                <option value="Enfermagem">Enfermagem</option>
                <option value="Construção Civil">Construção Civil</option>
              </select>
            </div>

            {/* Turma */}
            <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
              <span className="font-bold text-primary">Turma:</span>
              <select
                value={filterTurma}
                onChange={(e) => setFilterTurma(e.target.value)}
                className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
              >
                <option value="Todas">Todas</option>
                <option value="IG10A">IG10A</option>
                <option value="IG11B">IG11B</option>
                <option value="CONT12A">CONT12A</option>
                <option value="ENF10A">ENF10A</option>
                <option value="CC13A">CC13A</option>
              </select>
            </div>

            {/* Método de Pagamento */}
            <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium">
              <span className="font-bold text-primary">Método:</span>
              <select
                value={filterMetodo}
                onChange={(e) => setFilterMetodo(e.target.value)}
                className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
              >
                <option value="Todos">Todos os Métodos</option>
                <option value="Numerário">Numerário</option>
                <option value="Multicaixa">Multicaixa</option>
                <option value="Transferência">Transferência</option>
                <option value="Referência MB">Referência MB</option>
              </select>
            </div>
          </div>

          {/* Row 2: Search Input & Utility Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar Nº Recibo, Fatura Ref., Estudante ou Operador..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border-subtle rounded-lg focus:outline-none focus:border-secondary font-medium"
              />
            </div>

            {/* Utility Controls */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => onShowToast('Importação de recibos iniciada.')}
                className="bg-surface border border-border-subtle hover:bg-surface-container-low text-primary text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-outline" />
                <span>Importar</span>
              </button>

              <button
                onClick={() => onShowToast('Lista de recibos descarregada em PDF/Excel.')}
                className="p-1.5 bg-surface border border-border-subtle hover:bg-surface-container-low text-on-surface rounded-lg transition-all cursor-pointer"
                title="Exportar Recibos"
              >
                <Download className="w-4 h-4 text-outline" />
              </button>

              <button
                onClick={() => onShowToast('Lista de recibos enviada para a impressora.')}
                className="p-1.5 bg-surface border border-border-subtle hover:bg-surface-container-low text-on-surface rounded-lg transition-all cursor-pointer"
                title="Imprimir"
              >
                <Printer className="w-4 h-4 text-outline" />
              </button>

              <button
                onClick={() => {
                  setSearch('');
                  setFilterAno('2026/2027');
                  setFilterDataInicio('');
                  setFilterDataFim('');
                  setFilterClasse('Todas');
                  setFilterCurso('Todos');
                  setFilterTurma('Todas');
                  setFilterMetodo('Todos');
                  onShowToast('Filtros reinicializados.');
                }}
                className="p-1.5 bg-surface border border-border-subtle hover:bg-surface-container-low text-on-surface rounded-lg transition-all cursor-pointer"
                title="Atualizar / Limpar Filtros"
              >
                <RotateCw className="w-4 h-4 text-outline" />
              </button>

              <div className="border-l border-border-subtle pl-1.5">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                  className="bg-surface border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary focus:outline-none cursor-pointer"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary">
                  <th className="px-3.5 py-3">Nº Recibo</th>
                  <th className="px-3.5 py-3">Fatura Ref.</th>
                  <th className="px-3.5 py-3">Estudante</th>
                  <th className="px-3.5 py-3 text-right">Valor</th>
                  <th className="px-3.5 py-3 text-center">Método</th>
                  <th className="px-3.5 py-3">Data</th>
                  <th className="px-3.5 py-3">Operador</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs">
                {filteredReceipts.length ? (
                  filteredReceipts.map((rc) => (
                    <tr key={rc.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-3.5 py-3 font-bold text-primary font-mono text-[11px]">{rc.numero}</td>
                      <td className="px-3.5 py-3 text-on-surface-variant font-mono text-[11px]">{rc.faturaRef}</td>
                      <td className="px-3.5 py-3 font-bold text-primary">{rc.estudante}</td>
                      <td className="px-3.5 py-3 text-right font-bold text-success">{money(rc.valor)}</td>
                      <td className="px-3.5 py-3 text-center">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{rc.metodo}</span>
                      </td>
                      <td className="px-3.5 py-3 text-on-surface-variant">{rc.data}</td>
                      <td className="px-3.5 py-3 text-on-surface-variant">{rc.operador}</td>
                      <td className="px-3.5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onShowToast(`Recibo ${rc.numero} descarregado em PDF.`)}
                            className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer"
                            title="Descarregar PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onShowToast(`Recibo ${rc.numero} enviado por email.`)}
                            className="p-1.5 text-outline hover:text-secondary rounded hover:bg-secondary/10 transition-colors cursor-pointer"
                            title="Enviar por Email"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onShowToast(`Recibo ${rc.numero} enviado para impressão.`)}
                            className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer"
                            title="Imprimir"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-on-surface-variant font-medium">
                      Nenhum recibo emitido encontrado com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Emitir Fatura */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-2xl p-6 my-8 transition-all">
            <div className="flex justify-between items-center border-b border-border-subtle/60 pb-3.5 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-primary">Emitir Nova Fatura</h2>
                  <p className="text-[11px] text-on-surface-variant font-medium">Preencha os dados do estudante e selecione os serviços a faturar.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="text-outline hover:text-primary p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-5 text-xs">
              {/* Section 1: Pesquisar Estudante - Barra Única com Select Inteligente */}
              <div className="bg-surface-container-low/50 p-4 rounded-xl border border-border-subtle/60 space-y-3">
                <h3 className="font-extrabold text-primary uppercase text-[10px] tracking-wider border-b border-border-subtle/60 pb-1.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-primary text-surface-white flex items-center justify-center text-[9px] font-bold">1</span>
                  Pesquisar Estudante
                </h3>

                <div className="relative">
                  <label className="block text-primary font-bold mb-1.5">
                    Nome do Estudante / Nº de Processo ou Matrícula *
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
                    <input
                      type="text"
                      required
                      value={invoiceStudent ? (invoiceMatricula ? `${invoiceStudent} (${invoiceMatricula})` : invoiceStudent) : studentSearchQuery}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStudentSearchQuery(val);
                        setInvoiceStudent(val);
                        setInvoiceMatricula('');
                        setSelectedStudentObj(null);
                        setIsStudentDropdownOpen(true);
                      }}
                      onFocus={() => setIsStudentDropdownOpen(true)}
                      placeholder="Pesquise por Nome do Estudante ou Nº de Processo/Matrícula (Ex: Afonso ou 3798)..."
                      className="w-full bg-surface-white border border-border-subtle rounded-xl pl-9 pr-9 py-2 text-xs font-semibold text-primary focus:border-primary focus:outline-none transition-all shadow-2xs"
                    />
                    {(invoiceStudent || studentSearchQuery) && (
                      <button
                        type="button"
                        onClick={() => {
                          setInvoiceStudent('');
                          setInvoiceMatricula('');
                          setStudentSearchQuery('');
                          setSelectedStudentObj(null);
                          setIsStudentDropdownOpen(false);
                        }}
                        className="absolute right-2.5 top-2 text-outline hover:text-error p-0.5 rounded-full hover:bg-surface-container cursor-pointer transition-colors"
                        title="Limpar seleção"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {isStudentDropdownOpen && (
                    <div className="absolute z-30 left-0 right-0 top-full mt-1.5 bg-surface-white border border-border-subtle rounded-xl shadow-xl max-h-52 overflow-y-auto divide-y divide-border-subtle/60">
                      {filteredStudentSuggestions.length > 0 ? (
                        filteredStudentSuggestions.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => {
                              setInvoiceStudent(st.nome);
                              setInvoiceMatricula(st.matricula);
                              setSelectedStudentObj(st);
                              setStudentSearchQuery(`${st.nome} (${st.matricula})`);
                              setIsStudentDropdownOpen(false);
                            }}
                            className="w-full p-2.5 text-left hover:bg-primary/5 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-extrabold text-xs flex items-center justify-center border border-primary/20 shrink-0 group-hover:bg-primary group-hover:text-surface-white transition-colors">
                                {st.nome.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-bold text-primary text-xs leading-tight">{st.nome}</p>
                                <p className="text-[10px] text-outline mt-0.5">
                                  Matrícula: <strong className="text-primary font-mono">{st.matricula}</strong> • {st.classe} ({st.turma})
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-surface-container rounded-md text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              Selecionar
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="p-3.5 text-center text-outline text-xs">
                          Nenhum estudante encontrado com "<strong className="text-primary">{studentSearchQuery}</strong>". Pressione Enter para usar o nome introduzido.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Student Card Summary */}
                {selectedStudentObj && (
                  <div className="bg-surface-white p-3.5 rounded-xl border border-primary/30 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-surface-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {selectedStudentObj.nome.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-extrabold text-primary text-xs">{selectedStudentObj.nome}</p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-bold bg-success/15 text-success">
                            ✓ Selecionado
                          </span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                          Matrícula: <strong className="text-primary font-mono">{selectedStudentObj.matricula}</strong> • {selectedStudentObj.classe} • {selectedStudentObj.turma}
                        </p>
                      </div>
                    </div>

                    {/* Badge: Último Mês Pago */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-1.5 flex items-center gap-2 self-start sm:self-center shrink-0">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <div className="text-[10px]">
                        <span className="text-outline font-medium block leading-none">Último Mês Pago:</span>
                        <span className="font-extrabold text-primary text-xs leading-tight">{selectedStudentObj.ultimoMesPago}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2 */}
              <div className="bg-surface-container-low/50 p-4 rounded-xl border border-border-subtle/60 space-y-3">
                <h3 className="font-extrabold text-primary uppercase text-[10px] tracking-wider border-b border-border-subtle/60 pb-1.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-primary text-surface-white flex items-center justify-center text-[9px] font-bold">2</span>
                  Adicionar Produtos / Serviços
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="flex-1 bg-surface-white border border-border-subtle rounded-lg px-3 py-2 text-xs font-medium text-primary focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="">Selecione um produto/serviço...</option>
                    {availableServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome} — {money(s.preco)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addServiceToInvoice}
                    disabled={!selectedServiceId}
                    className="bg-primary text-surface-white px-3.5 py-2 rounded-lg font-bold disabled:opacity-50 cursor-pointer hover:bg-primary/90 transition-all shadow-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    Adicionar
                  </button>
                </div>

                {invoiceItems.length > 0 && (
                  <div className="mt-3 border border-border-subtle rounded-xl overflow-hidden bg-surface-white shadow-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary">
                          <th className="px-3.5 py-2.5">Item</th>
                          <th className="px-3.5 py-2.5 text-right">Valor</th>
                          <th className="px-3.5 py-2.5 text-right w-12">Remover</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle text-xs">
                        {invoiceItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="px-3.5 py-2.5 font-bold text-primary">{item.nome}</td>
                            <td className="px-3.5 py-2.5 text-right font-bold text-primary">{money(item.valor)}</td>
                            <td className="px-3.5 py-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => removeInvoiceItem(idx)}
                                className="p-1 text-outline hover:text-error rounded hover:bg-error/10 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-surface-container-low/70 border-t border-border-subtle">
                          <td className="px-3.5 py-2.5 font-extrabold text-primary text-right">TOTAL FATURA:</td>
                          <td className="px-3.5 py-2.5 text-right font-black text-primary text-sm">{money(invoiceTotal)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2.5 border-t border-border-subtle/60 pt-4">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="border border-border-subtle px-4 py-2 rounded-xl text-xs font-bold text-primary cursor-pointer hover:bg-surface-container transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary text-surface-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-primary/90 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  Emitir Fatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registar Pagamento */}
      {payInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle/60 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Wallet className="w-5 h-5 stroke-[2]" />
                </div>
                <h2 className="text-base font-extrabold text-primary">Registar Pagamento</h2>
              </div>
              <button
                type="button"
                onClick={() => setPayInvoice(null)}
                className="text-outline hover:text-primary p-1.5 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleRegisterPayment} className="space-y-4 text-xs">
              <div className="bg-surface-container-low/60 border border-border-subtle rounded-xl p-3.5 space-y-1.5">
                <div className="flex justify-between"><span className="text-outline font-bold">Fatura:</span><span className="font-bold text-primary font-mono">{payInvoice.numero}</span></div>
                <div className="flex justify-between"><span className="text-outline font-bold">Estudante:</span><span className="font-bold text-primary">{payInvoice.estudante}</span></div>
                <div className="flex justify-between"><span className="text-outline font-bold">Valor Total:</span><span className="font-bold text-primary">{money(payInvoice.valorTotal)}</span></div>
                <div className="flex justify-between"><span className="text-outline font-bold">Já Pago:</span><span className="font-bold text-success">{money(payInvoice.valorPago)}</span></div>
                <div className="flex justify-between border-t border-border-subtle pt-1.5"><span className="text-outline font-bold">Saldo Devedor:</span><span className="font-bold text-error">{money(payInvoice.valorTotal - payInvoice.valorPago)}</span></div>
                {payInvoice.multaAplicada + payInvoice.jurosAplicados > 0 && <div className="flex justify-between"><span className="text-outline font-bold">Multa + Juros:</span><span className="font-bold text-error">{money(payInvoice.multaAplicada + payInvoice.jurosAplicados)}</span></div>}
              </div>
              <div>
                <label className="block text-primary font-bold mb-1">Valor a Pagar (Kz)</label>
                <input type="number" required value={payAmount} onChange={(e) => setPayAmount(Number(e.target.value))} max={payInvoice.valorTotal - payInvoice.valorPago} className="w-full bg-surface-white border border-border-subtle rounded-lg px-3 py-2 text-xs font-medium text-primary focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-primary font-bold mb-1">Método de Pagamento</label>
                <select value={payMethod} onChange={(e) => setPayMethod(e.target.value as PaymentMethod)} className="w-full bg-surface-white border border-border-subtle rounded-lg px-3 py-2 text-xs font-medium text-primary focus:border-primary focus:outline-none cursor-pointer">
                  <option value="Numerário">Numerário</option>
                  <option value="Multicaixa">Multicaixa</option>
                  <option value="Transferência">Transferência Bancária</option>
                  <option value="Referência MB">Referência MB</option>
                  <option value="Cartão">Cartão</option>
                </select>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-info/10 border border-info/20 rounded-xl text-info font-medium">
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Recibo emitido automaticamente após confirmação.</span>
              </div>
              <div className="flex justify-end gap-2 border-t border-border-subtle/60 pt-3">
                <button type="button" onClick={() => setPayInvoice(null)} className="border border-border-subtle px-4 py-2 rounded-xl text-xs font-bold text-primary cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
                <button type="submit" className="bg-primary text-surface-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-primary/90 transition-all shadow-sm">Confirmar Pagamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ver Detalhes */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-lg p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle/60 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-5 h-5 stroke-[2]" />
                </div>
                <h2 className="text-base font-extrabold text-primary">Detalhes da Fatura</h2>
              </div>
              <button type="button" onClick={() => setViewInvoice(null)} className="text-outline hover:text-primary p-1.5 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 bg-surface-container-low/60 p-3 rounded-xl border border-border-subtle">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-primary">{viewInvoice.numero}</h3>
                  <span className="text-[10px] text-outline font-medium">{viewInvoice.dataEmissao} · Venc: {viewInvoice.dataVencimento}</span>
                </div>
                <span className={`${statusChip(viewInvoice.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold ml-auto`}>{viewInvoice.estado}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-surface-container-low/30 p-3 rounded-xl border border-border-subtle">
                <div><span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-0.5">Estudante</span><span className="text-primary font-bold">{viewInvoice.estudante}</span></div>
                <div><span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-0.5">Nº Processo</span><span className="text-primary font-bold">{viewInvoice.matricula}</span></div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-1">Itens da Fatura</span>
                <div className="border border-border-subtle rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary">
                        <th className="px-3.5 py-2">Descrição</th>
                        <th className="px-3.5 py-2 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {viewInvoice.itens.map((item, idx) => (
                        <tr key={idx}><td className="px-3.5 py-2 font-bold text-primary">{item.nome}</td><td className="px-3.5 py-2 text-right font-bold text-primary">{money(item.valor)}</td></tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-surface-container-low/70"><td className="px-3.5 py-2 font-extrabold text-primary text-right">TOTAL:</td><td className="px-3.5 py-2 text-right font-black text-primary text-sm">{money(viewInvoice.valorTotal)}</td></tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="border border-border-subtle rounded-xl p-2.5 bg-surface-container-low/40"><span className="text-[9px] uppercase font-bold text-outline block">Total</span><span className="font-extrabold text-primary">{money(viewInvoice.valorTotal)}</span></div>
                <div className="border border-border-subtle rounded-xl p-2.5 bg-surface-container-low/40"><span className="text-[9px] uppercase font-bold text-outline block">Pago</span><span className="font-extrabold text-success">{money(viewInvoice.valorPago)}</span></div>
                <div className="border border-border-subtle rounded-xl p-2.5 bg-surface-container-low/40"><span className="text-[9px] uppercase font-bold text-outline block">Saldo</span><span className="font-extrabold text-error">{money(viewInvoice.valorTotal - viewInvoice.valorPago)}</span></div>
              </div>
              {viewInvoice.multaAplicada + viewInvoice.jurosAplicados > 0 && (
                <div className="bg-error/10 border border-error/30 rounded-xl p-3 flex items-center gap-2 text-error font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Multa: {money(viewInvoice.multaAplicada)} · Juros: {money(viewInvoice.jurosAplicados)}</span>
                </div>
              )}
              <div className="flex justify-end gap-2 border-t border-border-subtle/60 pt-3">
                <button type="button" onClick={() => setViewInvoice(null)} className="border border-border-subtle px-4 py-2 rounded-xl text-xs font-bold text-primary cursor-pointer hover:bg-surface-container transition-all">Fechar</button>
                <button type="button" onClick={() => onShowToast(`Fatura ${viewInvoice.numero} descarregada em PDF.`)} className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />Descarregar</button>
                {viewInvoice.estado !== 'Pago' && (
                  <button type="button" onClick={() => { const inv = viewInvoice; setViewInvoice(null); setPayInvoice(inv); setPayAmount(inv.valorTotal - inv.valorPago); }} className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"><Wallet className="w-3.5 h-3.5" />Pagar</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Anulação */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle/60 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 stroke-[2]" />
                </div>
                <h2 className="text-base font-extrabold text-primary">Anular Fatura</h2>
              </div>
              <button type="button" onClick={() => setConfirmDelete(null)} className="text-outline hover:text-primary p-1.5 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-5 font-medium leading-relaxed">
              Esta ação não pode ser desfeita. Deseja anular a fatura <strong className="text-primary font-mono">{confirmDelete.numero}</strong> de <strong className="text-primary font-bold">{confirmDelete.estudante}</strong>?
            </p>
            <div className="flex justify-end gap-2 border-t border-border-subtle/60 pt-3">
              <button type="button" onClick={() => setConfirmDelete(null)} className="border border-border-subtle px-4 py-2 rounded-xl text-xs font-bold text-primary cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button type="button" onClick={handleDeleteInvoice} className="bg-error text-surface-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-error/90 transition-all shadow-sm">Sim, Anular</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
