import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  Utensils,
  Coffee,
  ShoppingBasket,
  Wallet,
  CreditCard,
  Plus,
  Search,
  Filter,
  Pencil as Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Receipt,
  Package,
  DollarSign,
  Calendar,
  UserCheck,
  X,
  Clock,
  QrCode,
  ShieldAlert,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

interface CantinaViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

export interface CantinaProduto {
  id: string;
  codigo: string;
  nome: string;
  categoria: 'Refeições Quentes' | 'Lanches & Salgados' | 'Bebidas' | 'Frutas & Sobremesas' | 'Menus Completos';
  preco: number;
  stockAtual: number;
  stockMinimo: number;
  ativo: boolean;
  imagemUrl?: string;
}

export interface CarteiraAluno {
  studentId: string;
  matricula: string;
  nomeEstudante: string;
  classe: string;
  turma: string;
  saldoAtual: number;
  limiteDiario: number;
  gastoHoje: number;
  bloqueado: boolean;
}

export interface MenuDiaItem {
  diaSemana: 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira';
  pratoPrincipal: string;
  pratoVegetariano: string;
  sopa: string;
  sobremesa: string;
  precoMenu: number;
}

export const CantinaView: React.FC<CantinaViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'pos' | 'ementa' | 'produtos' | 'carteiras' | 'caixa'>('pos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('todas');

  // Cantina Products Catalog (Módulo 4 - Tela 2)
  const [produtos, setProdutos] = useState<CantinaProduto[]>([
    {
      id: 'cant-1',
      codigo: 'MENU-ALMOCO-01',
      nome: 'Menu Completo de Almoço Escolar (Sopa + Prato + Bebida + Fruta)',
      categoria: 'Menus Completos',
      preco: 1800,
      stockAtual: 150,
      stockMinimo: 20,
      ativo: true,
    },
    {
      id: 'cant-2',
      codigo: 'PRAT-FRAN-01',
      nome: 'Prato do Dia: Bife de Frango Grelhado c/ Arroz e Salada',
      categoria: 'Refeições Quentes',
      preco: 1400,
      stockAtual: 80,
      stockMinimo: 15,
      ativo: true,
    },
    {
      id: 'cant-3',
      codigo: 'LANC-PAST-01',
      nome: 'Pastel de Chouriço ou Carne Assado',
      categoria: 'Lanches & Salgados',
      preco: 350,
      stockAtual: 45,
      stockMinimo: 10,
      ativo: true,
    },
    {
      id: 'cant-4',
      codigo: 'LANC-SAND-01',
      nome: 'Sandes de Queijo & Fiambre em Pão de Leite',
      categoria: 'Lanches & Salgados',
      preco: 450,
      stockAtual: 60,
      stockMinimo: 15,
      ativo: true,
    },
    {
      id: 'cant-5',
      codigo: 'BEB-SUMO-01',
      nome: 'Sumo Natural de Laranja / Fruta da Época (300ml)',
      categoria: 'Bebidas',
      preco: 300,
      stockAtual: 90,
      stockMinimo: 20,
      ativo: true,
    },
    {
      id: 'cant-6',
      codigo: 'BEB-AGUA-01',
      nome: 'Água Mineral sem Gás (500ml)',
      categoria: 'Bebidas',
      preco: 150,
      stockAtual: 120,
      stockMinimo: 30,
      ativo: true,
    },
    {
      id: 'cant-7',
      codigo: 'SOBR-IOGU-01',
      nome: 'Iogurte Natural c/ Frutas e Cereais',
      categoria: 'Frutas & Sobremesas',
      preco: 400,
      stockAtual: 8, // Low stock alert
      stockMinimo: 15,
      ativo: true,
    },
    {
      id: 'cant-8',
      codigo: 'SOBR-FRUT-01',
      nome: 'Manga / Maçã / Banana Fresca Cortada',
      categoria: 'Frutas & Sobremesas',
      preco: 200,
      stockAtual: 50,
      stockMinimo: 10,
      ativo: true,
    },
  ]);

  // Students Digital Wallet Balances
  const [carteiras, setCarteiras] = useState<CarteiraAluno[]>([
    {
      studentId: 'EST-2024-089',
      matricula: '20230145',
      nomeEstudante: 'João Miguel Santos Almeida',
      classe: '10º Ano',
      turma: 'Turma A',
      saldoAtual: 8500,
      limiteDiario: 2500,
      gastoHoje: 650,
      bloqueado: false,
    },
    {
      studentId: 'EST-2024-012',
      matricula: '20230146',
      nomeEstudante: 'Beatriz Costa Silva',
      classe: '11º Ano',
      turma: 'Turma B',
      saldoAtual: 3200,
      limiteDiario: 2000,
      gastoHoje: 0,
      bloqueado: false,
    },
    {
      studentId: 'EST-2024-034',
      matricula: '20230147',
      nomeEstudante: 'Carlos Eduardo Ferreira',
      classe: '10º Ano',
      turma: 'Turma A',
      saldoAtual: 450, // Low balance
      limiteDiario: 1500,
      gastoHoje: 1200,
      bloqueado: false,
    },
    {
      studentId: 'EST-2024-055',
      matricula: '20230148',
      nomeEstudante: 'Diana Sofia Paiva',
      classe: '12º Ano',
      turma: 'Turma A',
      saldoAtual: 12000,
      limiteDiario: 3000,
      gastoHoje: 1800,
      bloqueado: false,
    },
  ]);

  // Weekly Menu Plan
  const [menuSemanal, setMenuSemanal] = useState<MenuDiaItem[]>([
    {
      diaSemana: 'Segunda-feira',
      pratoPrincipal: 'Bife de Frango Grelhado com Arroz de Cenoura e Salada',
      pratoVegetariano: 'Lasanha de Legumes Assados c/ Queijo Mozzarella',
      sopa: 'Sopa de Abóbora c/ Espinafres',
      sobremesa: 'Fruta da Época ou Iogurte',
      precoMenu: 1800,
    },
    {
      diaSemana: 'Terça-feira',
      pratoPrincipal: 'Massa à Bolonhesa c/ Carne Picada de Vaca',
      pratoVegetariano: 'Hambúrguer de Grão de Bico c/ Batata Doce',
      sopa: 'Creme de Ervilhas c/ Croutons',
      sobremesa: 'Mousse de Maracujá',
      precoMenu: 1800,
    },
    {
      diaSemana: 'Quarta-feira',
      pratoPrincipal: 'Peixe Assado no Forno c/ Batata Cozida e Legumes',
      pratoVegetariano: 'Tofu Salteado c/ Vegetais e Arroz Integral',
      sopa: 'Sopa de Caldo Verde Tradicional',
      sobremesa: 'Salada de Frutas Frescas',
      precoMenu: 1800,
    },
    {
      diaSemana: 'Quinta-feira',
      pratoPrincipal: 'Arroz de Feijão c/ Febras de Porco Grelhadas',
      pratoVegetariano: 'Estufado de Lentilhas c/ Cenoura e Cogumelos',
      sopa: 'Creme de Feijão Verde',
      sobremesa: 'Pudim de Leite',
      precoMenu: 1800,
    },
    {
      diaSemana: 'Sexta-feira',
      pratoPrincipal: 'Empadão de Carne c/ Salada Mista',
      pratoVegetariano: 'Quiche de Cogumelos e Espinafres',
      sopa: 'Sopa de Legumes Variados',
      sobremesa: 'Fruta da Época',
      precoMenu: 1800,
    },
  ]);

  // POS State (Selected Student & Cart)
  const [selectedStudentPos, setSelectedStudentPos] = useState<CarteiraAluno | null>(carteiras[0]);
  const [cartItems, setCartItems] = useState<{ produto: CantinaProduto; quantidade: number }[]>([]);
  const [posMetodoPagamento, setPosMetodoPagamento] = useState<'carteira' | 'dinheiro'>('carteira');

  // Register Transaction Modal State
  const [caixaStatus, setCaixaStatus] = useState<'aberto' | 'fechado'>('aberto');
  const [vendasHojeCount, setVendasHojeCount] = useState(48);
  const [faturadoHojeCarteira, setFaturadoHojeCarteira] = useState(64500);
  const [faturadoHojeDinheiro, setFaturadoHojeDinheiro] = useState(18200);

  // Recharge Modal State
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeStudent, setRechargeStudent] = useState<CarteiraAluno | null>(null);
  const [rechargeValor, setRechargeValor] = useState<number>(2000);
  const [rechargeMetodo, setRechargeMetodo] = useState<'multicaixa' | 'iban' | 'tesouraria'>('multicaixa');

  // Create Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<CantinaProduto | null>(null);

  // Form Fields for Product
  const [formProdCodigo, setFormProdCodigo] = useState('');
  const [formProdNome, setFormProdNome] = useState('');
  const [formProdCategoria, setFormProdCategoria] =
    useState<CantinaProduto['categoria']>('Refeições Quentes');
  const [formProdPreco, setFormProdPreco] = useState<number>(500);
  const [formProdStock, setFormProdStock] = useState<number>(50);
  const [formProdStockMin, setFormProdStockMin] = useState<number>(10);

  const formatKz = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(val);
  };

  // Add Item to POS Cart
  const handleAddToCart = (prod: CantinaProduto) => {
    if (prod.stockAtual <= 0) {
      onShowToast(`Produto "${prod.nome}" está Esgotado sem stock!`);
      return;
    }

    const existingIndex = cartItems.findIndex((item) => item.produto.id === prod.id);
    if (existingIndex >= 0) {
      const updated = [...cartItems];
      if (updated[existingIndex].quantidade + 1 > prod.stockAtual) {
        onShowToast(`Stock insuficiente! Apenas ${prod.stockAtual} unidades disponíveis.`);
        return;
      }
      updated[existingIndex].quantidade += 1;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, { produto: prod, quantidade: 1 }]);
    }
  };

  // Remove / Change Cart Qty
  const handleUpdateCartQty = (prodId: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.produto.id === prodId) {
          const newQty = item.quantidade + delta;
          if (newQty > item.produto.stockAtual) {
            onShowToast(`Stock máximo atingido (${item.produto.stockAtual} unidades).`);
            return item;
          }
          return newQty > 0 ? { ...item, quantidade: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as { produto: CantinaProduto; quantidade: number }[];

    setCartItems(updated);
  };

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.produto.preco * curr.quantidade, 0);

  // Finalize POS Sale
  const handleFinalizePosSale = () => {
    if (!selectedStudentPos) {
      onShowToast('Por favor, selecione um estudante para registar o consumo.');
      return;
    }

    if (cartItems.length === 0) {
      onShowToast('O carrinho da cantina está vazio. Adicione pelo menos 1 produto.');
      return;
    }

    if (posMetodoPagamento === 'carteira') {
      if (selectedStudentPos.saldoAtual < cartTotal) {
        onShowToast(`Saldo insuficiente! Saldo atual: ${formatKz(selectedStudentPos.saldoAtual)} | Total: ${formatKz(cartTotal)}`);
        return;
      }

      if (selectedStudentPos.gastoHoje + cartTotal > selectedStudentPos.limiteDiario) {
        onShowToast(`Limite diário excedido! Limite estipulado: ${formatKz(selectedStudentPos.limiteDiario)} | Já gastou hoje: ${formatKz(selectedStudentPos.gastoHoje)}`);
        return;
      }

      // Deduct from wallet balance
      const updatedCarteiras = carteiras.map((c) => {
        if (c.studentId === selectedStudentPos.studentId) {
          return {
            ...c,
            saldoAtual: c.saldoAtual - cartTotal,
            gastoHoje: c.gastoHoje + cartTotal,
          };
        }
        return c;
      });
      setCarteiras(updatedCarteiras);
      setSelectedStudentPos({
        ...selectedStudentPos,
        saldoAtual: selectedStudentPos.saldoAtual - cartTotal,
        gastoHoje: selectedStudentPos.gastoHoje + cartTotal,
      });

      setFaturadoHojeCarteira((prev) => prev + cartTotal);
    } else {
      setFaturadoHojeDinheiro((prev) => prev + cartTotal);
    }

    // Deduct stock
    const updatedProd = produtos.map((p) => {
      const inCart = cartItems.find((c) => c.produto.id === p.id);
      if (inCart) {
        return { ...p, stockAtual: Math.max(0, p.stockAtual - inCart.quantidade) };
      }
      return p;
    });
    setProdutos(updatedProd);

    setVendasHojeCount((prev) => prev + 1);
    onShowToast(`Venda registada com sucesso! Consumo de ${formatKz(cartTotal)} debitado a ${selectedStudentPos.nomeEstudante}.`);
    setCartItems([]);
  };

  // Recharge Wallet
  const handleConfirmRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rechargeStudent || rechargeValor <= 0) return;

    setCarteiras(
      carteiras.map((c) => {
        if (c.studentId === rechargeStudent.studentId) {
          return {
            ...c,
            saldoAtual: c.saldoAtual + rechargeValor,
          };
        }
        return c;
      })
    );

    onShowToast(`Carregamento de ${formatKz(rechargeValor)} efetuado com sucesso para ${rechargeStudent.nomeEstudante}!`);
    setIsRechargeModalOpen(false);
  };

  // Open Product Modal
  const openCreateProductModal = () => {
    setEditingProduto(null);
    setFormProdCodigo(`CANT-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormProdNome('');
    setFormProdCategoria('Refeições Quentes');
    setFormProdPreco(500);
    setFormProdStock(50);
    setFormProdStockMin(10);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: CantinaProduto) => {
    setEditingProduto(prod);
    setFormProdCodigo(prod.codigo);
    setFormProdNome(prod.nome);
    setFormProdCategoria(prod.categoria);
    setFormProdPreco(prod.preco);
    setFormProdStock(prod.stockAtual);
    setFormProdStockMin(prod.stockMinimo);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProdNome.trim()) return;

    if (editingProduto) {
      setProdutos(
        produtos.map((p) => {
          if (p.id === editingProduto.id) {
            return {
              ...p,
              codigo: formProdCodigo,
              nome: formProdNome,
              categoria: formProdCategoria,
              preco: Number(formProdPreco),
              stockAtual: Number(formProdStock),
              stockMinimo: Number(formProdStockMin),
            };
          }
          return p;
        })
      );
      onShowToast(`Produto "${formProdNome}" atualizado no inventário da cantina.`);
    } else {
      const newP: CantinaProduto = {
        id: `cant-${Date.now()}`,
        codigo: formProdCodigo,
        nome: formProdNome,
        categoria: formProdCategoria,
        preco: Number(formProdPreco),
        stockAtual: Number(formProdStock),
        stockMinimo: Number(formProdStockMin),
        ativo: true,
      };
      setProdutos([newP, ...produtos]);
      onShowToast(`Novo produto "${formProdNome}" adicionado à cantina.`);
    }

    setIsProductModalOpen(false);
  };

  const filteredProdutos = produtos.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategoria === 'todas' || p.categoria === filterCategoria;
    return matchesSearch && matchesCat;
  });

  const stockBaixoItems = produtos.filter((p) => p.stockAtual <= p.stockMinimo);

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* KPI Stats Cards (Padrão Dashboard — h-[68px], sem redundâncias) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Card 1: FATURAÇÃO HOJE (TOTAL) */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              FATURAÇÃO HOJE (TOTAL)
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
              {formatKz(faturadoHojeCarteira + faturadoHojeDinheiro)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <ShoppingBasket className="w-3 h-3 mr-0.5" /> {vendasHojeCount}
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">vendas hoje</span>
          </div>
        </div>

        {/* Card 2: CARTEIRA DIGITAL (CARTÃO) */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              CARTEIRA DIGITAL (CARTÃO)
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
              {formatKz(faturadoHojeCarteira)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">
              {Math.round((faturadoHojeCarteira / (faturadoHojeCarteira + faturadoHojeDinheiro || 1)) * 100)}%
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">do total</span>
          </div>
        </div>

        {/* Card 3: VENDAS EM NUMERÁRIO */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              VENDAS EM NUMERÁRIO
            </span>
            <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
              {formatKz(faturadoHojeDinheiro)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-info bg-info/10 text-[10px] font-bold">
              <Receipt className="w-3 h-3 mr-0.5" /> Presencial
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">pagamentos</span>
          </div>
        </div>

        {/* Card 4: AVISOS DE STOCK BAIXO */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              AVISOS DE STOCK BAIXO
            </span>
            <span className="text-xl sm:text-2xl font-bold text-error leading-none">
              {stockBaixoItems.length}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-error bg-error/10 text-[10px] font-bold">
              <AlertTriangle className="w-3 h-3 mr-0.5" /> Reposição
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">necessária</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'pos'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <ShoppingBasket className="w-4 h-4 stroke-[2]" />
          Ponto de Venda (POS)
        </button>

        <button
          onClick={() => setActiveTab('ementa')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'ementa'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Calendar className="w-4 h-4 stroke-[2]" />
          Ementa & Menus
        </button>

        <button
          onClick={() => setActiveTab('produtos')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'produtos'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Package className="w-4 h-4 stroke-[2]" />
          Catálogo & Stock ({produtos.length})
        </button>

        <button
          onClick={() => setActiveTab('carteiras')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'carteiras'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Wallet className="w-4 h-4 stroke-[2]" />
          Carteira Digital
        </button>

        <button
          onClick={() => setActiveTab('caixa')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'caixa'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Receipt className="w-4 h-4 stroke-[2]" />
          Caixa & Relatórios
        </button>
      </div>

        {/* Tab 1: POS - Registo Rápido de Consumos */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Col: Student Identification & Product Catalog (Cols 7) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Student Identification & Digital Wallet Card */}
              <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-border-subtle/60 pb-2.5">
                  <span className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-primary" />
                    Estudante / Cartão Digital Lido
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Leitor de Cartão Ativo
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
                    <select
                      value={selectedStudentPos?.studentId || ''}
                      onChange={(e) => {
                        const found = carteiras.find((c) => c.studentId === e.target.value);
                        if (found) setSelectedStudentPos(found);
                      }}
                      className="w-full bg-surface-white border border-border-subtle rounded-lg pl-9 pr-3 py-2 text-xs font-bold text-primary focus:border-primary focus:outline-none cursor-pointer"
                    >
                      {carteiras.map((c) => (
                        <option key={c.studentId} value={c.studentId}>
                          {c.nomeEstudante} (Matrícula: {c.matricula}) - {c.classe}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedStudentPos && (
                  <div className="bg-surface-container-low/60 p-3.5 rounded-xl border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20 shrink-0">
                        {selectedStudentPos.nomeEstudante
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-extrabold text-primary text-sm leading-tight">
                          {selectedStudentPos.nomeEstudante}
                        </p>
                        <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                          Matrícula: <span className="font-bold text-primary">{selectedStudentPos.matricula}</span> • {selectedStudentPos.classe} • {selectedStudentPos.turma}
                        </p>
                      </div>
                    </div>

                    <div className="bg-surface-white p-2.5 rounded-lg border border-border-subtle/80 text-right shrink-0">
                      <p className="text-[9px] text-outline uppercase font-bold tracking-wider">Saldo Carteira Digital</p>
                      <p className={`text-base font-black ${selectedStudentPos.saldoAtual < 1000 ? 'text-error' : 'text-primary'}`}>
                        {formatKz(selectedStudentPos.saldoAtual)}
                      </p>
                      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-outline font-medium">
                        <span>Gasto hoje: <strong className="text-on-surface">{formatKz(selectedStudentPos.gastoHoje)}</strong></span>
                        <span>/</span>
                        <span>Máx: <strong className="text-on-surface">{formatKz(selectedStudentPos.limiteDiario)}</strong></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Catalog Grid & Filters */}
              <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h3 className="font-extrabold text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-primary" />
                    Produtos da Cantina
                  </h3>
                  <div className="flex flex-wrap gap-1 text-[11px]">
                    {['todas', 'Refeições Quentes', 'Lanches & Salgados', 'Bebidas', 'Menus Completos', 'Frutas & Sobremesas'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategoria(cat)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          filterCategoria === cat
                            ? 'bg-primary text-surface-white shadow-xs'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                        }`}
                      >
                        {cat === 'todas' ? 'Todas' : cat.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {produtos
                    .filter((p) => filterCategoria === 'todas' || p.categoria === filterCategoria)
                    .map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => handleAddToCart(prod)}
                        disabled={prod.stockAtual <= 0}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group h-[115px] relative overflow-hidden ${
                          prod.stockAtual <= 0
                            ? 'bg-surface-container-low border-border-subtle opacity-50 cursor-not-allowed'
                            : 'bg-surface-white border-border-subtle hover:border-primary hover:shadow-md'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[9px] font-bold text-outline uppercase tracking-wider line-clamp-1">{prod.categoria}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${prod.stockAtual <= prod.stockMinimo ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                              {prod.stockAtual} un.
                            </span>
                          </div>
                          <p className="font-bold text-primary text-xs line-clamp-2 group-hover:text-primary transition-colors">{prod.nome}</p>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs font-black text-primary">{formatKz(prod.preco)}</span>
                          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-surface-white flex items-center justify-center transition-colors">
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Right Col: POS Checkout Cart (Cols 5) */}
            <div className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-xl p-4 flex flex-col justify-between shadow-sm space-y-4">
              <div>
                <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <ShoppingBasket className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-primary text-sm">Talão de Consumo</h3>
                      <span className="text-[10px] font-semibold text-outline">
                        {cartItems.reduce((acc, curr) => acc + curr.quantidade, 0)} {cartItems.reduce((acc, curr) => acc + curr.quantidade, 0) === 1 ? 'item' : 'itens'} no carrinho
                      </span>
                    </div>
                  </div>
                  {cartItems.length > 0 && (
                    <button
                      onClick={() => setCartItems([])}
                      className="text-[11px] font-bold text-outline hover:text-error cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Limpar
                    </button>
                  )}
                </div>

                <div className="divide-y divide-border-subtle/60 max-h-[320px] overflow-y-auto my-2 pr-1">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12 text-outline text-xs space-y-2">
                      <ShoppingBasket className="w-8 h-8 mx-auto text-outline-variant stroke-[1.5]" />
                      <p className="font-semibold text-on-surface-variant">Carrinho vazio</p>
                      <p className="text-[11px] text-outline">Clique nos produtos da cantina para adicionar ao consumo.</p>
                    </div>
                  ) : (
                    cartItems.map(({ produto, quantidade }) => (
                      <div key={produto.id} className="py-2.5 flex justify-between items-center text-xs">
                        <div className="pr-2 flex-1 min-w-0">
                          <p className="font-bold text-primary truncate">{produto.nome}</p>
                          <p className="text-[10px] text-outline">
                            {formatKz(produto.preco)} x {quantidade}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleUpdateCartQty(produto.id, -1)}
                            className="w-6 h-6 bg-surface-container border border-border-subtle rounded-md flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-surface-white transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-bold text-primary w-5 text-center">{quantidade}</span>
                          <button
                            onClick={() => handleUpdateCartQty(produto.id, 1)}
                            className="w-6 h-6 bg-surface-container border border-border-subtle rounded-md flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-surface-white transition-colors cursor-pointer"
                          >
                            +
                          </button>
                          <span className="font-extrabold text-primary ml-2 w-20 text-right">
                            {formatKz(produto.preco * quantidade)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-border-subtle pt-3 space-y-3">
                <div className="bg-surface-container-low/60 rounded-xl p-3 border border-border-subtle/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-outline font-medium">
                    <span>Subtotal:</span>
                    <span>{formatKz(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between font-black text-primary text-base pt-1.5 border-t border-border-subtle/80">
                    <span>Total a Pagar:</span>
                    <span className="text-primary">{formatKz(cartTotal)}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-outline uppercase tracking-wider">Forma de Pagamento:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPosMetodoPagamento('carteira')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        posMetodoPagamento === 'carteira'
                          ? 'bg-primary text-surface-white border-primary shadow-xs'
                          : 'bg-surface-white text-primary border-border-subtle hover:bg-surface-container'
                      }`}
                    >
                      <Wallet className="w-4 h-4" /> Carteira Digital
                    </button>
                    <button
                      onClick={() => setPosMetodoPagamento('dinheiro')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        posMetodoPagamento === 'dinheiro'
                          ? 'bg-primary text-surface-white border-primary shadow-xs'
                          : 'bg-surface-white text-primary border-border-subtle hover:bg-surface-container'
                      }`}
                    >
                      <Receipt className="w-4 h-4" /> Numerário
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleFinalizePosSale}
                  className="w-full bg-primary text-surface-white hover:bg-primary/90 py-3 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2]" />
                  Confirmar & Registrar Venda ({formatKz(cartTotal)})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Ementa & Menus Semanais */}
        {activeTab === 'ementa' && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-primary text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  Ementa Semanal da Cantina Escolar
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Planeamento nutricional das refeições de Segunda a Sexta-feira servidas no refeitório da Vendaia School®.
                </p>
              </div>
              <button
                onClick={() => onShowToast('A ementa semanal foi atualizada e enviada aos encarregados via Portal/App.')}
                className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-3.5 py-2 rounded-lg font-bold cursor-pointer transition-all shadow-sm"
              >
                Publicar Ementa aos Encarregados
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {menuSemanal.map((menu, idx) => (
                <div key={idx} className="bg-surface-container-low border border-border-subtle rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase block w-fit mb-1">
                      {menu.diaSemana}
                    </span>

                    <div className="space-y-1.5 mt-2">
                      <div>
                        <span className="text-[10px] font-bold text-outline uppercase block">Prato Principal:</span>
                        <p className="font-bold text-primary text-xs">{menu.pratoPrincipal}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-success uppercase block">Opção Vegetariana:</span>
                        <p className="text-on-surface-variant text-[11px]">{menu.pratoVegetariano}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-outline uppercase block">Sopa do Dia:</span>
                        <p className="text-on-surface-variant text-[11px]">{menu.sopa}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-outline uppercase block">Sobremesa / Fruta:</span>
                        <p className="text-on-surface-variant text-[11px]">{menu.sobremesa}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border-subtle flex justify-between items-center text-xs">
                    <span className="font-extrabold text-primary">{formatKz(menu.precoMenu)}</span>
                    <button
                      onClick={() => onShowToast(`Editar menu para ${menu.diaSemana}`)}
                      className="text-outline hover:text-primary p-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Catálogo de Produtos & Stock */}
        {activeTab === 'produtos' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface-container-low/50 p-3 rounded-xl border border-border-subtle">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
                <input
                  type="text"
                  placeholder="Pesquisar produto da cantina..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="text-xs bg-surface-white border border-border-subtle rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary font-semibold text-primary"
                >
                  <option value="todas">Todas as Categorias</option>
                  <option value="Refeições Quentes">Refeições Quentes</option>
                  <option value="Lanches & Salgados">Lanches & Salgados</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Frutas & Sobremesas">Frutas & Sobremesas</option>
                  <option value="Menus Completos">Menus Completos</option>
                </select>

                <button
                  onClick={openCreateProductModal}
                  className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm shrink-0"
                  title="Novo Produto"
                >
                  <Plus className="w-4 h-4 stroke-[2]" />
                  <span className="whitespace-nowrap">Novo Produto</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-border-subtle rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low font-bold text-primary">
                    <th className="px-3.5 py-3">Código</th>
                    <th className="px-3.5 py-3">Nome do Produto</th>
                    <th className="px-3.5 py-3">Categoria</th>
                    <th className="px-3.5 py-3 text-right">Preço (Kz)</th>
                    <th className="px-3.5 py-3 text-center">Stock Atual</th>
                    <th className="px-3.5 py-3 text-center">Estado Stock</th>
                    <th className="px-3.5 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredProdutos.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-3.5 py-3 font-mono font-bold text-primary">{p.codigo}</td>
                      <td className="px-3.5 py-3 font-bold text-primary">{p.nome}</td>
                      <td className="px-3.5 py-3">
                        <span className="bg-primary/5 text-primary text-[11px] px-2 py-0.5 rounded-full font-bold">
                          {p.categoria}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-right font-extrabold text-primary">{formatKz(p.preco)}</td>
                      <td className="px-3.5 py-3 text-center font-bold text-primary">{p.stockAtual} Unidades</td>
                      <td className="px-3.5 py-3 text-center">
                        {p.stockAtual <= p.stockMinimo ? (
                          <span className="bg-error/15 text-error px-2 py-0.5 rounded font-bold text-[10px] flex items-center justify-center gap-1 w-fit mx-auto">
                            <AlertTriangle className="w-3 h-3" /> Stock Crítico
                          </span>
                        ) : (
                          <span className="bg-success/15 text-success px-2 py-0.5 rounded font-bold text-[10px] w-fit mx-auto block">
                            Em Stock
                          </span>
                        )}
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="p-1.5 text-outline hover:text-primary cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Carteira Digital dos Alunos */}
        {activeTab === 'carteiras' && (
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-primary text-base flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  Saldos da Carteira Digital do Cartão do Estudante
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Gestão de carregamentos, controlo de limites diários estipulados pelos pais e extrato de consumo.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-border-subtle rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low font-bold text-primary">
                    <th className="px-3.5 py-3">Estudante</th>
                    <th className="px-3.5 py-3">Matrícula / Turma</th>
                    <th className="px-3.5 py-3 text-right">Saldo Atual</th>
                    <th className="px-3.5 py-3 text-right">Limite Diário</th>
                    <th className="px-3.5 py-3 text-right">Gasto Hoje</th>
                    <th className="px-3.5 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {carteiras.map((c) => (
                    <tr key={c.studentId} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-3.5 py-3 font-bold text-primary">{c.nomeEstudante}</td>
                      <td className="px-3.5 py-3 text-on-surface-variant">
                        {c.matricula} ({c.classe} - {c.turma})
                      </td>
                      <td className="px-3.5 py-3 text-right font-extrabold text-primary text-sm">
                        {formatKz(c.saldoAtual)}
                      </td>
                      <td className="px-3.5 py-3 text-right font-bold text-primary">{formatKz(c.limiteDiario)}</td>
                      <td className="px-3.5 py-3 text-right font-bold text-outline">{formatKz(c.gastoHoje)}</td>
                      <td className="px-3.5 py-3 text-center">
                        <button
                          onClick={() => {
                            setRechargeStudent(c);
                            setIsRechargeModalOpen(true);
                          }}
                          className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1 rounded text-[11px] font-bold cursor-pointer transition-all shadow-2xs"
                        >
                          + Carregar Saldo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Caixa & Relatórios */}
        {activeTab === 'caixa' && (
          <div className="p-6 space-y-6">
            <div className="bg-surface-container-low border border-border-subtle rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                <div>
                  <h3 className="font-bold text-primary text-base flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-secondary" />
                    Resumo do Fecho de Caixa Diário da Cantina
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Consolidação dos recebimentos via Carteira Digital e Numerário do dia atual.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCaixaStatus(caixaStatus === 'aberto' ? 'fechado' : 'aberto');
                    onShowToast(`Estado do caixa alterado para: ${caixaStatus === 'aberto' ? 'FECHADO' : 'ABERTO'}`);
                  }}
                  className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-3.5 py-2 rounded-lg font-bold cursor-pointer"
                >
                  {caixaStatus === 'aberto' ? 'Efetuar Fecho de Caixa' : 'Reabrir Caixa'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-1">
                  <span className="text-outline font-bold uppercase text-[10px]">Total Carteira Digital</span>
                  <p className="text-xl font-extrabold text-secondary">{formatKz(faturadoHojeCarteira)}</p>
                  <p className="text-on-surface-variant text-[11px]">Cobrado via saldo dos cartões digitais dos alunos.</p>
                </div>

                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-1">
                  <span className="text-outline font-bold uppercase text-[10px]">Total Dinheiro em Caixa</span>
                  <p className="text-xl font-extrabold text-primary">{formatKz(faturadoHojeDinheiro)}</p>
                  <p className="text-on-surface-variant text-[11px]">Pagamentos físicos recebidos pelo operador de caixa.</p>
                </div>

                <div className="bg-surface-white p-4 rounded-xl border border-border-subtle space-y-1">
                  <span className="text-outline font-bold uppercase text-[10px]">Total Geral Faturado Hoje</span>
                  <p className="text-xl font-extrabold text-success">{formatKz(faturadoHojeCarteira + faturadoHojeDinheiro)}</p>
                  <p className="text-on-surface-variant text-[11px]">Soma total de recebimentos da cantina hoje.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Modal Carregar Saldo Carteira */}
      {isRechargeModalOpen && rechargeStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-surface-white rounded-xl max-w-md w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h3 className="font-bold text-primary text-base">Carregar Carteira Digital</h3>
              <button
                onClick={() => setIsRechargeModalOpen(false)}
                className="text-outline hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            <form onSubmit={handleConfirmRecharge} className="space-y-3">
              <div>
                <span className="text-outline text-[10px] uppercase font-bold block">Estudante:</span>
                <p className="font-bold text-primary text-sm">{rechargeStudent.nomeEstudante}</p>
                <p className="text-on-surface-variant">
                  Matrícula: {rechargeStudent.matricula} • Saldo Atual: <strong className="text-secondary">{formatKz(rechargeStudent.saldoAtual)}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold mb-1">Valor do Carregamento (Kz):</label>
                <input
                  type="number"
                  required
                  min="500"
                  step="500"
                  value={rechargeValor}
                  onChange={(e) => setRechargeValor(Number(e.target.value))}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Método de Depósito:</label>
                <select
                  value={rechargeMetodo}
                  onChange={(e) => setRechargeMetodo(e.target.value as any)}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                >
                  <option value="multicaixa">Multicaixa Express / Referência MCX</option>
                  <option value="iban">Transferência Bancária (IBAN)</option>
                  <option value="tesouraria">Depósito em Numerário na Tesouraria</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsRechargeModalOpen(false)}
                  className="px-3.5 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-secondary text-surface-white rounded-lg font-bold hover:bg-secondary/90 cursor-pointer transition-all"
                >
                  Confirmar Depósito ({formatKz(rechargeValor)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Criar/Editar Produto Cantina */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-surface-white rounded-xl max-w-md w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h3 className="font-bold text-primary text-base">
                {editingProduto ? 'Editar Produto da Cantina' : 'Novo Produto na Cantina'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-outline hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Código:</label>
                  <input
                    type="text"
                    required
                    value={formProdCodigo}
                    onChange={(e) => setFormProdCodigo(e.target.value)}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Categoria:</label>
                  <select
                    value={formProdCategoria}
                    onChange={(e) => setFormProdCategoria(e.target.value as any)}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                  >
                    <option value="Refeições Quentes">Refeições Quentes</option>
                    <option value="Lanches & Salgados">Lanches & Salgados</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Frutas & Sobremesas">Frutas & Sobremesas</option>
                    <option value="Menus Completos">Menus Completos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Nome do Produto:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sumo Natural de Laranja"
                  value={formProdNome}
                  onChange={(e) => setFormProdNome(e.target.value)}
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold mb-1">Preço (Kz):</label>
                  <input
                    type="number"
                    required
                    min="50"
                    step="50"
                    value={formProdPreco}
                    onChange={(e) => setFormProdPreco(Number(e.target.value))}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Stock Atual:</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formProdStock}
                    onChange={(e) => setFormProdStock(Number(e.target.value))}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Stock Mínimo:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formProdStockMin}
                    onChange={(e) => setFormProdStockMin(Number(e.target.value))}
                    className="w-full bg-surface-white border border-border-subtle rounded-lg p-2 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-3.5 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-secondary text-surface-white rounded-lg font-bold hover:bg-secondary/90 cursor-pointer transition-all"
                >
                  {editingProduto ? 'Guardar Produto' : 'Criar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
