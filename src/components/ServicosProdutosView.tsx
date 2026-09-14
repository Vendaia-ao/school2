import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Pencil as Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Tag,
  RefreshCw,
  Clock,
  Settings,
  ShieldAlert,
  Percent,
  Calendar,
  Layers,
  FileText,
  X,
  Copy,
  DollarSign,
  Award
} from 'lucide-react';

interface ServicosProdutosViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

export interface ServicoProdutoItem {
  id: string;
  codigo: string;
  nome: string;
  categoria:
    | 'Inscrições'
    | 'Matrículas'
    | 'Propinas'
    | 'Emolumentos'
    | 'Certificados'
    | 'Declarações'
    | '2ª Via Cartão'
    | 'Transporte Escolar'
    | 'Atividades Extracurriculares'
    | 'Uniformes'
    | 'Livros & Manuais'
    | 'Material Escolar'
    | 'Outros Serviços'
    | 'Outros Produtos';
  precoBase: number;
  tipoRecorrencia: 'Recorrente Mensal' | 'Recorrente Semestral' | 'Recorrente Anual' | 'Ocasionais / Avulso';
  diaVencimentoPadrão?: number;
  temMultaAtraso: boolean;
  multaAtrasoPct: number; // e.g. 5%
  jurosMoraDiarioPct: number; // e.g. 0.1%
  diasTolerancia: number; // e.g. 5 dias
  ativo: boolean;
  descricao?: string;
  codigoContabilistico?: string;
}

export const ServicosProdutosView: React.FC<ServicosProdutosViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'catalogo' | 'regras' | 'categorias_bolsas'>('catalogo');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('todas');
  const [filterTipo, setFilterTipo] = useState<string>('todos');

  // List of Services and Products (Módulo 4 - Tela 1)
  const [items, setItems] = useState<ServicoProdutoItem[]>([
    {
      id: 'sp-1',
      codigo: 'PROP-PRIM-01',
      nome: 'Propina Mensal - Ensino Primário (1ª a 6ª Classe)',
      categoria: 'Propinas',
      precoBase: 35000,
      tipoRecorrencia: 'Recorrente Mensal',
      diaVencimentoPadrão: 10,
      temMultaAtraso: true,
      multaAtrasoPct: 5,
      jurosMoraDiarioPct: 0.1,
      diasTolerancia: 5,
      ativo: true,
      descricao: 'Propina mensal obrigatória para o I Ciclo do Ensino Primário.',
      codigoContabilistico: '71101',
    },
    {
      id: 'sp-2',
      codigo: 'PROP-SEC-01',
      nome: 'Propina Mensal - II Ciclo / Ensino Secundário',
      categoria: 'Propinas',
      precoBase: 48000,
      tipoRecorrencia: 'Recorrente Mensal',
      diaVencimentoPadrão: 10,
      temMultaAtraso: true,
      multaAtrasoPct: 5,
      jurosMoraDiarioPct: 0.1,
      diasTolerancia: 5,
      ativo: true,
      descricao: 'Propina mensal para o II Ciclo Geral e Cursos Técnico-Profissionais.',
      codigoContabilistico: '71102',
    },
    {
      id: 'sp-3',
      codigo: 'MATR-ANO-01',
      nome: 'Matrícula Anual & Confirmação de Vaga',
      categoria: 'Matrículas',
      precoBase: 25000,
      tipoRecorrencia: 'Recorrente Anual',
      diaVencimentoPadrão: 15,
      temMultaAtraso: false,
      multaAtrasoPct: 0,
      jurosMoraDiarioPct: 0,
      diasTolerancia: 0,
      ativo: true,
      descricao: 'Taxa anual de renovação e confirmação da matrícula escolar.',
      codigoContabilistico: '71201',
    },
    {
      id: 'sp-4',
      codigo: 'INSC-NOVO-01',
      nome: 'Inscrição de Novos Estudantes & Teste de Admissão',
      categoria: 'Inscrições',
      precoBase: 15000,
      tipoRecorrencia: 'Ocasionais / Avulso',
      temMultaAtraso: false,
      multaAtrasoPct: 0,
      jurosMoraDiarioPct: 0,
      diasTolerancia: 0,
      ativo: true,
      descricao: 'Taxa de abertura de processo de candidatura e exame de acesso.',
      codigoContabilistico: '71202',
    },
    {
      id: 'sp-5',
      codigo: 'DECL-NOTAS-01',
      nome: 'Declaração de Matrícula com Aproveitamento de Notas',
      categoria: 'Declarações',
      precoBase: 3500,
      tipoRecorrencia: 'Ocasionais / Avulso',
      temMultaAtraso: false,
      multaAtrasoPct: 0,
      jurosMoraDiarioPct: 0,
      diasTolerancia: 0,
      ativo: true,
      descricao: 'Emissão de documento oficial comprovativo com pauta de notas.',
      codigoContabilistico: '71301',
    },
    {
      id: 'sp-6',
      codigo: 'CERT-HABIL-01',
      nome: 'Certificado de Habilitações Literárias com Pauta Oficial',
      categoria: 'Certificados',
      precoBase: 12000,
      tipoRecorrencia: 'Ocasionais / Avulso',
      temMultaAtraso: false,
      multaAtrasoPct: 0,
      jurosMoraDiarioPct: 0,
      diasTolerancia: 0,
      ativo: true,
      descricao: 'Certificado de fim de ciclo autenticado pela Direção de Educação.',
      codigoContabilistico: '71302',
    },
    {
      id: 'sp-7',
      codigo: '2VIA-CARD-01',
      nome: 'Emissão de 2ª Via do Cartão Digital do Estudante',
      categoria: '2ª Via Cartão',
      precoBase: 5000,
      tipoRecorrencia: 'Ocasionais / Avulso',
      temMultaAtraso: false,
      multaAtrasoPct: 0,
      jurosMoraDiarioPct: 0,
      diasTolerancia: 0,
      ativo: true,
      descricao: 'Substituição do cartão em caso de perda, extravio ou dano físico.',
      codigoContabilistico: '71303',
    },
    {
      id: 'sp-8',
      codigo: 'TRANSP-ROTA-A',
      nome: 'Passe Mensal de Transporte Escolar - Rota A (Cidade)',
      categoria: 'Transporte Escolar',
      precoBase: 22000,
      tipoRecorrencia: 'Recorrente Mensal',
      diaVencimentoPadrão: 5,
      temMultaAtraso: true,
      multaAtrasoPct: 3,
      jurosMoraDiarioPct: 0.05,
      diasTolerancia: 3,
      ativo: true,
      descricao: 'Serviço de transporte idas e voltas na zona urbana principal.',
      codigoContabilistico: '71401',
    },
    {
      id: 'sp-9',
      codigo: 'EXTRA-ROBOT-01',
      nome: 'Clube Extracurricular de Robótica & Programação',
      categoria: 'Atividades Extracurriculares',
      precoBase: 12500,
      tipoRecorrencia: 'Recorrente Mensal',
      diaVencimentoPadrão: 10,
      temMultaAtraso: false,
      multaAtrasoPct: 0,
      jurosMoraDiarioPct: 0,
      diasTolerancia: 5,
      ativo: true,
      descricao: 'Aulas práticas semanais de robótica e eletrónica no laboratório Vendaia.',
      codigoContabilistico: '71501',
    },
    {
      id: 'sp-10',
      codigo: 'UNIF-OFIC-KIT',
      nome: 'Kit de Uniforme Oficial Vendaia School (2 Camisas + Blusão)',
      categoria: 'Uniformes',
      precoBase: 28000,
      tipoRecorrencia: 'Ocasionais / Avulso',
      temMultaAtraso: false,
      multaAtrasoPct: 0,
      jurosMoraDiarioPct: 0,
      diasTolerancia: 0,
      ativo: true,
      descricao: 'Conjunto completo de vestuário escolar obrigatório.',
      codigoContabilistico: '71601',
    },
    {
      id: 'sp-11',
      codigo: 'LIVR-MANU-10',
      nome: 'Kit de Manuais Escolares - 10º Ano Ciências Físicas',
      categoria: 'Livros & Manuais',
      precoBase: 32000,
      tipoRecorrencia: 'Ocasionais / Avulso',
      temMultaAtraso: false,
      multaAtrasoPct: 0,
      jurosMoraDiarioPct: 0,
      diasTolerancia: 0,
      ativo: true,
      descricao: 'Manuais oficiais de Matemática, Física, Química e Português.',
      codigoContabilistico: '71602',
    },
    {
      id: 'sp-12',
      codigo: 'EMOL-REINSP-01',
      nome: 'Emolumento de Reclamação / Revisão de Prova Escrita',
      categoria: 'Emolumentos',
      precoBase: 4000,
      tipoRecorrencia: 'Ocasionais / Avulso',
      temMultaAtraso: false,
      multaAtrasoPct: 0,
      jurosMoraDiarioPct: 0,
      diasTolerancia: 0,
      ativo: true,
      descricao: 'Taxa administrativa para recurso e revisão de exame por júri.',
      codigoContabilistico: '71304',
    },
  ]);

  // Global Billing Rules State (Módulo 4 - Tela 1)
  const [globalBillingRules, setGlobalBillingRules] = useState({
    diaVencimentoPadrao: 10,
    multaPadraoPct: 5,
    jurosDiariosPadraoPct: 0.1,
    diasToleranciaPadrao: 5,
    bloqueioCertificadosSeEmMora: true,
    bloqueioMatriculaSeEmMora: true,
    notificacaoSmsDiasAntes: 3,
    notificacaoSmsDiasApos: 2,
  });

  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Modal State for Item Create / Edit
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServicoProdutoItem | null>(null);

  // Form Fields
  const [formCodigo, setFormCodigo] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formCategoria, setFormCategoria] = useState<ServicoProdutoItem['categoria']>('Propinas');
  const [formPrecoBase, setFormPrecoBase] = useState<number>(0);
  const [formTipoRecorrencia, setFormTipoRecorrencia] =
    useState<ServicoProdutoItem['tipoRecorrencia']>('Recorrente Mensal');
  const [formDiaVencimento, setFormDiaVencimento] = useState<number>(10);
  const [formTemMulta, setFormTemMulta] = useState<boolean>(true);
  const [formMultaPct, setFormMultaPct] = useState<number>(5);
  const [formJurosPct, setFormJurosPct] = useState<number>(0.1);
  const [formTolerancia, setFormTolerancia] = useState<number>(5);
  const [formAtivo, setFormAtivo] = useState<boolean>(true);
  const [formDescricao, setFormDescricao] = useState('');
  const [formCodigoContabilistico, setFormCodigoContabilistico] = useState('');

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<ServicoProdutoItem | null>(null);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingItem(null);
    const generatedCode = `SERV-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormCodigo(generatedCode);
    setFormNome('');
    setFormCategoria('Propinas');
    setFormPrecoBase(10000);
    setFormTipoRecorrencia('Recorrente Mensal');
    setFormDiaVencimento(globalBillingRules.diaVencimentoPadrao);
    setFormTemMulta(true);
    setFormMultaPct(globalBillingRules.multaPadraoPct);
    setFormJurosPct(globalBillingRules.jurosDiariosPadraoPct);
    setFormTolerancia(globalBillingRules.diasToleranciaPadrao);
    setFormAtivo(true);
    setFormDescricao('');
    setFormCodigoContabilistico('71100');
    setIsItemModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: ServicoProdutoItem) => {
    setEditingItem(item);
    setFormCodigo(item.codigo);
    setFormNome(item.nome);
    setFormCategoria(item.categoria);
    setFormPrecoBase(item.precoBase);
    setFormTipoRecorrencia(item.tipoRecorrencia);
    setFormDiaVencimento(item.diaVencimentoPadrão || 10);
    setFormTemMulta(item.temMultaAtraso);
    setFormMultaPct(item.multaAtrasoPct);
    setFormJurosPct(item.jurosMoraDiarioPct);
    setFormTolerancia(item.diasTolerancia);
    setFormAtivo(item.ativo);
    setFormDescricao(item.descricao || '');
    setFormCodigoContabilistico(item.codigoContabilistico || '');
    setIsItemModalOpen(true);
  };

  // Save Item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim()) return;

    if (editingItem) {
      const updated = items.map((it) => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            codigo: formCodigo,
            nome: formNome,
            categoria: formCategoria,
            precoBase: Number(formPrecoBase),
            tipoRecorrencia: formTipoRecorrencia,
            diaVencimentoPadrão: formTipoRecorrencia.startsWith('Recorrente') ? Number(formDiaVencimento) : undefined,
            temMultaAtraso: formTemMulta,
            multaAtrasoPct: formTemMulta ? Number(formMultaPct) : 0,
            jurosMoraDiarioPct: formTemMulta ? Number(formJurosPct) : 0,
            diasTolerancia: formTemMulta ? Number(formTolerancia) : 0,
            ativo: formAtivo,
            descricao: formDescricao,
            codigoContabilistico: formCodigoContabilistico,
          };
        }
        return it;
      });
      setItems(updated);
      onShowToast(`Serviço/Produto "${formNome}" atualizado com sucesso.`);
    } else {
      const newItem: ServicoProdutoItem = {
        id: `sp-${Date.now()}`,
        codigo: formCodigo,
        nome: formNome,
        categoria: formCategoria,
        precoBase: Number(formPrecoBase),
        tipoRecorrencia: formTipoRecorrencia,
        diaVencimentoPadrão: formTipoRecorrencia.startsWith('Recorrente') ? Number(formDiaVencimento) : undefined,
        temMultaAtraso: formTemMulta,
        multaAtrasoPct: formTemMulta ? Number(formMultaPct) : 0,
        jurosMoraDiarioPct: formTemMulta ? Number(formJurosPct) : 0,
        diasTolerancia: formTemMulta ? Number(formTolerancia) : 0,
        ativo: formAtivo,
        descricao: formDescricao,
        codigoContabilistico: formCodigoContabilistico,
      };
      setItems([newItem, ...items]);
      onShowToast(`Novo artigo/serviço "${formNome}" registado no catálogo.`);
    }

    setIsItemModalOpen(false);
  };

  // Toggle Item Active Status
  const handleToggleActive = (id: string) => {
    setItems(
      items.map((it) => {
        if (it.id === id) {
          const nextState = !it.ativo;
          onShowToast(`Estado do artigo "${it.nome}" alterado para ${nextState ? 'Ativo' : 'Inativo'}.`);
          return { ...it, ativo: nextState };
        }
        return it;
      })
    );
  };

  // Confirm Delete
  const handleDeleteItemConfirm = () => {
    if (!deletingItem) return;
    setItems(items.filter((it) => it.id !== deletingItem.id));
    onShowToast(`Serviço/Produto "${deletingItem.nome}" removido do catálogo.`);
    setDeletingItem(null);
  };

  // Filter Items
  const filteredItems = items.filter((it) => {
    const matchesSearch =
      it.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.categoria.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategoria === 'todas' || it.categoria === filterCategoria;
    const matchesTipo =
      filterTipo === 'todos' ||
      (filterTipo === 'recorrente' && it.tipoRecorrencia.startsWith('Recorrente')) ||
      (filterTipo === 'ocasional' && it.tipoRecorrencia === 'Ocasionais / Avulso');

    return matchesSearch && matchesCategory && matchesTipo;
  });

  const formatKz = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(val);
  };

  // Stats Calculations
  const totalArtigos = items.length;
  const totalAtivos = items.filter((i) => i.ativo).length;
  const totalRecorrentes = items.filter((i) => i.tipoRecorrencia.startsWith('Recorrente')).length;
  const mediaPrecoPropinas = items.filter((i) => i.categoria === 'Propinas').length
    ? Math.round(
        items.filter((i) => i.categoria === 'Propinas').reduce((acc, curr) => acc + curr.precoBase, 0) /
          items.filter((i) => i.categoria === 'Propinas').length
      )
    : 0;

  const categoriasUnicas = Array.from(new Set(items.map((i) => i.categoria)));

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* KPI Stats Cards (Padrão Dashboard — h-[68px], sem redundâncias) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Card 1: TOTAL DE ARTIGOS / SERVIÇOS */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              TOTAL DE ARTIGOS / SERVIÇOS
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
              {totalArtigos}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 mr-0.5" /> {totalAtivos}
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">ativos</span>
          </div>
        </div>

        {/* Card 2: PROPINAS & RECORRENTES */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              PROPINAS & RECORRENTES
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
              {totalRecorrentes}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">
              {formatKz(mediaPrecoPropinas)}
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">média propina</span>
          </div>
        </div>

        {/* Card 3: MULTA POR ATRASO PADRÃO */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              MULTA POR ATRASO PADRÃO
            </span>
            <span className="text-xl sm:text-2xl font-bold text-error leading-none">
              {globalBillingRules.multaPadraoPct}% + {globalBillingRules.jurosDiariosPadraoPct}%/dia
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-error bg-error/10 text-[10px] font-bold">
              {globalBillingRules.diasToleranciaPadrao} dias
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">tolerância</span>
          </div>
        </div>

        {/* Card 4: CATEGORIAS DE SERVIÇOS */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              CATEGORIAS DE SERVIÇOS
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
              {categoriasUnicas.length}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-info bg-info/10 text-[10px] font-bold">
              Direta
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">integração</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'catalogo'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <ShoppingBag className="w-4 h-4 stroke-[2]" />
          Catálogo ({filteredItems.length})
        </button>

        <button
          onClick={() => setActiveTab('regras')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'regras'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <ShieldAlert className="w-4 h-4 stroke-[2]" />
          Regras de Cobrança & Prazos
        </button>

        <button
          onClick={() => setActiveTab('categorias_bolsas')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'categorias_bolsas'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Award className="w-4 h-4 stroke-[2]" />
          Políticas & Bolsas de Estudo
        </button>
      </div>

        {/* Tab 1: Catálogo de Serviços & Produtos */}
        {activeTab === 'catalogo' && (
          <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-surface-container-low/50 p-3 rounded-xl border border-border-subtle">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, código ou categoria (ex: propina, certificado, transporte...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <Filter className="w-3.5 h-3.5 text-outline" />
                  <span className="font-bold text-outline">Categoria:</span>
                  <select
                    value={filterCategoria}
                    onChange={(e) => setFilterCategoria(e.target.value)}
                    className="text-xs bg-surface-white border border-border-subtle rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary font-semibold text-primary"
                  >
                    <option value="todas">Todas as Categorias</option>
                    <option value="Inscrições">Inscrições</option>
                    <option value="Matrículas">Matrículas</option>
                    <option value="Propinas">Propinas</option>
                    <option value="Emolumentos">Emolumentos</option>
                    <option value="Certificados">Certificados</option>
                    <option value="Declarações">Declarações</option>
                    <option value="2ª Via Cartão">2ª Via do Cartão</option>
                    <option value="Transporte Escolar">Transporte Escolar</option>
                    <option value="Atividades Extracurriculares">Atividades Extracurriculares</option>
                    <option value="Uniformes">Uniformes</option>
                    <option value="Livros & Manuais">Livros & Manuais</option>
                    <option value="Material Escolar">Material Escolar</option>
                    <option value="Outros Serviços">Outros Serviços</option>
                    <option value="Outros Produtos">Outros Produtos</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <span className="font-bold text-outline">Cobrança:</span>
                  <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                    className="text-xs bg-surface-white border border-border-subtle rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary font-semibold text-primary"
                  >
                    <option value="todos">Todos os Tipos</option>
                    <option value="recorrente">Serviços Recorrentes</option>
                    <option value="ocasional">Ocasionais / Avulsos</option>
                  </select>
                </div>

                <button
                  onClick={openCreateModal}
                  className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm shrink-0 ml-1"
                  title="Novo Serviço / Produto"
                >
                  <Plus className="w-4 h-4 stroke-[2]" />
                  <span className="whitespace-nowrap">Novo Item</span>
                </button>
              </div>
            </div>

            {/* Table of Services and Products */}
            <div className="overflow-x-auto border border-border-subtle rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-xs font-bold text-primary">
                    <th className="px-3.5 py-3">Código</th>
                    <th className="px-3.5 py-3">Nome do Serviço / Produto</th>
                    <th className="px-3.5 py-3">Categoria</th>
                    <th className="px-3.5 py-3 text-right">Preço Base (Kz)</th>
                    <th className="px-3.5 py-3">Tipo / Frequência</th>
                    <th className="px-3.5 py-3">Regra de Multa</th>
                    <th className="px-3.5 py-3 text-center">Estado</th>
                    <th className="px-3.5 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-xs">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-on-surface-variant font-medium">
                        Nenhum serviço ou produto encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-3.5 py-3 font-mono font-bold text-primary">{item.codigo}</td>

                        <td className="px-3.5 py-3">
                          <div className="font-bold text-primary">{item.nome}</div>
                          {item.descricao && (
                            <p className="text-[11px] text-on-surface-variant truncate max-w-xs">{item.descricao}</p>
                          )}
                        </td>

                        <td className="px-3.5 py-3">
                          <span className="bg-primary/5 text-primary border border-primary/20 text-[11px] px-2 py-0.5 rounded-full font-bold">
                            {item.categoria}
                          </span>
                        </td>

                        <td className="px-3.5 py-3 text-right font-bold text-primary text-sm">
                          {formatKz(item.precoBase)}
                        </td>

                        <td className="px-3.5 py-3">
                          {item.tipoRecorrencia.startsWith('Recorrente') ? (
                            <span className="bg-secondary/10 text-secondary border border-secondary/20 text-[11px] px-2 py-0.5 rounded font-bold flex items-center gap-1 w-fit">
                              <RefreshCw className="w-3 h-3" />
                              {item.tipoRecorrencia} (Venc. dia {item.diaVencimentoPadrão})
                            </span>
                          ) : (
                            <span className="bg-surface-container-high text-on-surface-variant text-[11px] px-2 py-0.5 rounded font-medium flex items-center gap-1 w-fit">
                              <Tag className="w-3 h-3" />
                              Ocasionais / Avulso
                            </span>
                          )}
                        </td>

                        <td className="px-3.5 py-3">
                          {item.temMultaAtraso ? (
                            <div className="text-[11px]">
                              <span className="font-bold text-error">
                                +{item.multaAtrasoPct}% multa ({item.jurosMoraDiarioPct}%/dia)
                              </span>
                              <div className="text-outline text-[10px]">Tol: {item.diasTolerancia} dias de carência</div>
                            </div>
                          ) : (
                            <span className="text-outline text-[11px]">Sem multa aplicada</span>
                          )}
                        </td>

                        <td className="px-3.5 py-3 text-center">
                          <button
                            onClick={() => handleToggleActive(item.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                              item.ativo
                                ? 'bg-success/15 text-success hover:bg-success/25'
                                : 'bg-outline/20 text-outline hover:bg-outline/30'
                            }`}
                          >
                            {item.ativo ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>

                        <td className="px-3.5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-outline hover:text-secondary rounded hover:bg-secondary/10 transition-colors cursor-pointer"
                              title="Editar serviço"
                            >
                              <Edit3 className="w-4 h-4 stroke-[2]" />
                            </button>
                            <button
                              onClick={() => setDeletingItem(item)}
                              className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer"
                              title="Eliminar do catálogo"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Regras de Cobrança, Multas & Prazos */}
        {activeTab === 'regras' && (
          <div className="p-6 space-y-6">
            <div className="bg-surface-container-low border border-border-subtle rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                <div>
                  <h3 className="font-bold text-primary text-base flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-secondary" />
                    Parâmetros Globais de Cobrança Automática
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Estas regras definem o comportamento padrão para emissão de propinas, prazos de vencimento e aplicação automática de multas por atraso.
                  </p>
                </div>
                <button
                  onClick={() => setIsRulesModalOpen(true)}
                  className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Parâmetros
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-1">
                  <span className="text-outline font-bold uppercase text-[10px]">Dia de Vencimento Mensal</span>
                  <p className="text-base font-extrabold text-primary">Dia {globalBillingRules.diaVencimentoPadrao} de cada Mês</p>
                  <p className="text-on-surface-variant text-[11px]">Cobranças mensais são geradas no dia 1 de cada mês com vencimento até ao dia 10.</p>
                </div>

                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-1">
                  <span className="text-outline font-bold uppercase text-[10px]">Multa Padrão por Atraso</span>
                  <p className="text-base font-extrabold text-error">{globalBillingRules.multaPadraoPct}% do Valor Total</p>
                  <p className="text-on-surface-variant text-[11px]">Aplicada imediatamente após decorridos os dias de tolerância sem liquidação.</p>
                </div>

                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-1">
                  <span className="text-outline font-bold uppercase text-[10px]">Juros de Mora Diários</span>
                  <p className="text-base font-extrabold text-error">{globalBillingRules.jurosDiariosPadraoPct}% ao dia</p>
                  <p className="text-on-surface-variant text-[11px]">Acumulados diariamente sobre o valor da dívida em atraso.</p>
                </div>

                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-1">
                  <span className="text-outline font-bold uppercase text-[10px]">Carência / Tolerância</span>
                  <p className="text-base font-extrabold text-success">{globalBillingRules.diasToleranciaPadrao} Dias Sem Multa</p>
                  <p className="text-on-surface-variant text-[11px]">Período de tolerância concedido aos encarregados após a data de vencimento.</p>
                </div>

                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-1">
                  <span className="text-outline font-bold uppercase text-[10px]">Bloqueio de Emissão de Certificados</span>
                  <p className="text-base font-extrabold text-primary">
                    {globalBillingRules.bloqueioCertificadosSeEmMora ? 'Ativado (Automático)' : 'Desativado'}
                  </p>
                  <p className="text-on-surface-variant text-[11px]">Impede emissão automática de documentos a alunos com propinas em atraso.</p>
                </div>

                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-1">
                  <span className="text-outline font-bold uppercase text-[10px]">Notificações SMS / Email</span>
                  <p className="text-base font-extrabold text-info">
                    {globalBillingRules.notificacaoSmsDiasAntes} dias antes / {globalBillingRules.notificacaoSmsDiasApos} dias após
                  </p>
                  <p className="text-on-surface-variant text-[11px]">Alertas automáticos enviados aos encarregados de educação.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Políticas de Descontos & Bolsas */}
        {activeTab === 'categorias_bolsas' && (
          <div className="p-6 space-y-6">
            <div className="bg-surface-container-low border border-border-subtle rounded-xl p-5 space-y-4">
              <div className="border-b border-border-subtle pb-3">
                <h3 className="font-bold text-primary text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary" />
                  Políticas de Isenção, Descontos & Bolsas de Estudo Vendaia School®
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Configure escalões de apoio social, bolsas de mérito e descontos familiares aplicados automaticamente nas propinas dos alunos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary text-sm">Bolsa de Mérito Académico</span>
                    <span className="bg-success/15 text-success font-bold text-[10px] px-2 py-0.5 rounded">100% Isenção</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px]">Concedida a estudantes com Média Geral igual ou superior a 18.0 valores no ano transato.</p>
                  <div className="pt-2 border-t border-border-subtle flex justify-between text-[11px]">
                    <span className="text-outline">Estudantes Beneficiados:</span>
                    <span className="font-bold text-primary">18 Alunos</span>
                  </div>
                </div>

                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary text-sm">Desconto Familiar / Irmãos</span>
                    <span className="bg-info/15 text-info font-bold text-[10px] px-2 py-0.5 rounded">15% a 25% Desconto</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px]">Aplicado a partir do 2º e 3º filho matriculado da mesma família no mesmo ano letivo.</p>
                  <div className="pt-2 border-t border-border-subtle flex justify-between text-[11px]">
                    <span className="text-outline">Famílias Abrangidas:</span>
                    <span className="font-bold text-primary">42 Famílias</span>
                  </div>
                </div>

                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary text-sm">Apoio Social Institucional</span>
                    <span className="bg-warning/15 text-warning font-bold text-[10px] px-2 py-0.5 rounded">50% Isenção</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px]">Atribuído mediante avaliação socioeconómica aprovada pela Direção Escolar.</p>
                  <div className="pt-2 border-t border-border-subtle flex justify-between text-[11px]">
                    <span className="text-outline">Processos Ativos:</span>
                    <span className="font-bold text-primary">12 Processos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Modal Criar / Editar Serviço ou Produto */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs overflow-y-auto">
          <div className="bg-surface-white rounded-xl max-w-lg w-full p-5 space-y-4 border border-border-subtle shadow-xl my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h3 className="font-bold text-primary text-base">
                {editingItem ? 'Editar Serviço / Produto' : 'Novo Serviço / Produto no Catálogo'}
              </h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="text-outline hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Código do Item:</label>
                  <input
                    type="text"
                    required
                    value={formCodigo}
                    onChange={(e) => setFormCodigo(e.target.value)}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-mono font-bold focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Categoria:</label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value as any)}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold focus:border-secondary focus:outline-none"
                  >
                    <option value="Inscrições">Inscrições</option>
                    <option value="Matrículas">Matrículas</option>
                    <option value="Propinas">Propinas</option>
                    <option value="Emolumentos">Emolumentos</option>
                    <option value="Certificados">Certificados</option>
                    <option value="Declarações">Declarações</option>
                    <option value="2ª Via Cartão">2ª Via Cartão</option>
                    <option value="Transporte Escolar">Transporte Escolar</option>
                    <option value="Atividades Extracurriculares">Atividades Extracurriculares</option>
                    <option value="Uniformes">Uniformes</option>
                    <option value="Livros & Manuais">Livros & Manuais</option>
                    <option value="Material Escolar">Material Escolar</option>
                    <option value="Outros Serviços">Outros Serviços</option>
                    <option value="Outros Produtos">Outros Produtos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Nome do Serviço / Produto:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Propina Mensal - II Ciclo Geral"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Preço Base (Kz):</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formPrecoBase}
                    onChange={(e) => setFormPrecoBase(Number(e.target.value))}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Tipo de Cobrança:</label>
                  <select
                    value={formTipoRecorrencia}
                    onChange={(e) => setFormTipoRecorrencia(e.target.value as any)}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold focus:border-secondary focus:outline-none"
                  >
                    <option value="Recorrente Mensal">Recorrente Mensal</option>
                    <option value="Recorrente Semestral">Recorrente Semestral</option>
                    <option value="Recorrente Anual">Recorrente Anual</option>
                    <option value="Ocasionais / Avulso">Ocasionais / Avulso</option>
                  </select>
                </div>
              </div>

              {formTipoRecorrencia.startsWith('Recorrente') && (
                <div>
                  <label className="block font-bold mb-1">Dia Limite de Vencimento Mensal:</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formDiaVencimento}
                    onChange={(e) => setFormDiaVencimento(Number(e.target.value))}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold focus:border-secondary focus:outline-none"
                  />
                </div>
              )}

              {/* Multa Settings */}
              <div className="bg-surface-container-low p-3 rounded-lg border border-border-subtle space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="temMultaCheck"
                    checked={formTemMulta}
                    onChange={(e) => setFormTemMulta(e.target.checked)}
                    className="rounded text-secondary focus:ring-secondary cursor-pointer"
                  />
                  <label htmlFor="temMultaCheck" className="font-bold cursor-pointer">
                    Aplicar Multa e Juros em caso de Atraso
                  </label>
                </div>

                {formTemMulta && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-outline">Multa Atraso (%):</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={formMultaPct}
                        onChange={(e) => setFormMultaPct(Number(e.target.value))}
                        className="w-full bg-surface-white border border-border-subtle rounded p-1.5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-outline">Juros Diários (%):</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={formJurosPct}
                        onChange={(e) => setFormJurosPct(Number(e.target.value))}
                        className="w-full bg-surface-white border border-border-subtle rounded p-1.5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-outline">Tolerância (Dias):</label>
                      <input
                        type="number"
                        min="0"
                        value={formTolerancia}
                        onChange={(e) => setFormTolerancia(Number(e.target.value))}
                        className="w-full bg-surface-white border border-border-subtle rounded p-1.5 font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">Descrição Informativa:</label>
                <textarea
                  rows={2}
                  placeholder="Escreva detalhes e notas explicativas para a tesouraria e faturas..."
                  value={formDescricao}
                  onChange={(e) => setFormDescricao(e.target.value)}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="ativoCheck"
                  checked={formAtivo}
                  onChange={(e) => setFormAtivo(e.target.checked)}
                  className="rounded text-secondary focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="ativoCheck" className="font-bold cursor-pointer">
                  Item Ativo e Disponível para Emissão
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-3.5 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-secondary text-surface-white rounded-lg font-bold hover:bg-secondary/90 cursor-pointer transition-all"
                >
                  {editingItem ? 'Guardar Alterações' : 'Criar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Regras Globais de Cobrança */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-surface-white rounded-xl max-w-md w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h3 className="font-bold text-primary text-base">Editar Regras de Cobrança Globais</h3>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="text-outline hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Dia do Mês de Vencimento Padrão:</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={globalBillingRules.diaVencimentoPadrao}
                  onChange={(e) =>
                    setGlobalBillingRules({ ...globalBillingRules, diaVencimentoPadrao: Number(e.target.value) })
                  }
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Multa Padrão (%):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={globalBillingRules.multaPadraoPct}
                    onChange={(e) =>
                      setGlobalBillingRules({ ...globalBillingRules, multaPadraoPct: Number(e.target.value) })
                    }
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Juros Diários (%):</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={globalBillingRules.jurosDiariosPadraoPct}
                    onChange={(e) =>
                      setGlobalBillingRules({ ...globalBillingRules, jurosDiariosPadraoPct: Number(e.target.value) })
                    }
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Dias de Carência / Tolerância:</label>
                <input
                  type="number"
                  min="0"
                  value={globalBillingRules.diasToleranciaPadrao}
                  onChange={(e) =>
                    setGlobalBillingRules({ ...globalBillingRules, diasToleranciaPadrao: Number(e.target.value) })
                  }
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bloqueioCertCheck"
                  checked={globalBillingRules.bloqueioCertificadosSeEmMora}
                  onChange={(e) =>
                    setGlobalBillingRules({
                      ...globalBillingRules,
                      bloqueioCertificadosSeEmMora: e.target.checked,
                    })
                  }
                  className="rounded text-secondary focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="bloqueioCertCheck" className="font-bold cursor-pointer">
                  Bloquear emissão de declarações em caso de mora
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsRulesModalOpen(false)}
                  className="px-3.5 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onShowToast('Parâmetros globais de cobrança guardados!');
                    setIsRulesModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-secondary text-surface-white rounded-lg font-bold hover:bg-secondary/90 cursor-pointer transition-all"
                >
                  Guardar Parâmetros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminação */}
      {deletingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-surface-white rounded-xl max-w-sm w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <h3 className="font-bold text-error text-base">Remover Artigo / Serviço</h3>
            <p className="text-on-surface-variant">
              Tem a certeza que deseja remover o artigo <strong className="text-primary">{deletingItem.nome}</strong> ({deletingItem.codigo}) do catálogo de serviços?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-3.5 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteItemConfirm}
                className="px-4 py-1.5 bg-error text-surface-white rounded-lg font-bold hover:bg-red-700 cursor-pointer transition-all"
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
