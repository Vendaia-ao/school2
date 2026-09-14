import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  BookOpen,
  Plus,
  Search,
  Pencil as Edit3,
  Trash2,
  Eye,
  Download,
  Star,
  FileText,
  Book,
  Award,
  X,
  Layers,
  CheckCircle2,
  Grid,
  List,
  Upload,
  Link as LinkIcon,
  Check,
  Building,
  Bookmark,
  Filter,
  Calendar,
  Users,
  AlertTriangle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  TrendingUp,
  FolderPlus,
  Settings
} from 'lucide-react';

interface BibliotecaViewProps {
  activeSubmodule?: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

export type RecursoTipo =
  | 'Manual Didático'
  | 'Livro Digital'
  | 'Guia de Exame'
  | 'Documento Institucional'
  | 'Literatura & Outros';

export type RecursoFormato = 'PDF' | 'Físico';
export type RecursoEstado = 'Publicado' | 'Rascunho' | 'Em Revisão' | 'Arquivado';

export interface RecursoBiblioteca {
  id: string;
  codigoIsbn: string;
  titulo: string;
  autor: string;
  tipo: RecursoTipo;
  formato: RecursoFormato;
  estado: RecursoEstado;
  rating: number; // e.g. 4.8
  readsCount: number; // e.g. 1420
  capaUrl: string;
  disciplina: string;
  classe: string;
  anoEdicao: string;
  descricao: string;
  niveisAcesso: string;
  // Físico & Ebook details
  isFisicoDisponivel: boolean;
  localizacaoPrateleira: string;
  estadoFisico: 'Disponível' | 'Indisponível' | 'Empréstimo';
  isEbookDisponivel: boolean;
  ebookUrl: string;
}

export interface SolicitacaoEmprestimo {
  id: string;
  utente: string;
  tipoUtente: 'Aluno' | 'Professor' | 'Funcionário';
  turmaOuCargo: string;
  livroTitulo: string;
  formato: 'Físico' | 'E-book';
  dataSolicitacao: string;
  dataDevolucaoPrevista: string;
  estado: 'Pendente' | 'Ativo' | 'Devolvido' | 'Atrasado';
}

export interface CategoriaBiblioteca {
  id: string;
  nome: string;
  obrasCount: number;
  descricao: string;
}

export const BibliotecaView: React.FC<BibliotecaViewProps> = ({
  activeSubmodule = 'biblioteca_catalogo',
  onSelectView,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<'capas' | 'tabela'>('capas');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  // Submodule 2: Solicitações State & Filters
  const [solicitacaoSearchQuery, setSolicitacaoSearchQuery] = useState('');
  const [solicitacaoDataInicio, setSolicitacaoDataInicio] = useState('');
  const [solicitacaoDataFim, setSolicitacaoDataFim] = useState('');
  const [solicitacaoFilterStatus, setSolicitacaoFilterStatus] = useState<string>('todos');
  const [solicitacaoPageSize, setSolicitacaoPageSize] = useState<number>(10);
  const [solicitacaoCurrentPage, setSolicitacaoCurrentPage] = useState<number>(1);
  const [isNovaSolicitacaoModalOpen, setIsNovaSolicitacaoModalOpen] = useState(false);

  const [novaSolUtente, setNovaSolUtente] = useState('');
  const [novaSolTipo, setNovaSolTipo] = useState<'Aluno' | 'Professor'>('Aluno');
  const [novaSolTurma, setNovaSolTurma] = useState('10º Ano A');
  const [novaSolLivro, setNovaSolLivro] = useState('Manual Didático de Matemática — 10ª Classe');
  const [novaSolFormato, setNovaSolFormato] = useState<'Físico' | 'E-book'>('Físico');

  // Submodule 3: Relatórios State
  const [relatorioPeriodo, setRelatorioPeriodo] = useState<'30dias' | '7dias' | 'trimestre' | 'ano'>('30dias');

  // Submodule 4: Configurações State
  const [categorias, setCategorias] = useState<CategoriaBiblioteca[]>([
    { id: 'cat-1', nome: 'Matemática & Ciências Exatas', obrasCount: 142, descricao: 'Manuais, algebrários, geometria e exercícios resolvidos.' },
    { id: 'cat-2', nome: 'Literatura Angolana & Lusófona', obrasCount: 98, descricao: 'Romances, poesia e ensaios literários curriculares.' },
    { id: 'cat-3', nome: 'História, Geografia & Sociedade', obrasCount: 64, descricao: 'História geral, geografia de Angola e ciências sociais.' },
    { id: 'cat-4', nome: 'Química, Biologia & Saúde', obrasCount: 52, descricao: 'Manuais laboratoriais, biologia celular e química orgânica.' },
    { id: 'cat-5', nome: 'Informática & Tecnologias de Informação', obrasCount: 38, descricao: 'Programação, redes de computadores e literacia digital.' },
    { id: 'cat-6', nome: 'Guias de Exames Nacionais & Testes', obrasCount: 45, descricao: 'Provas e testes de acesso ao ensino superior.' },
  ]);
  const [novaCategoriaInput, setNovaCategoriaInput] = useState('');

  // Configurações de Parâmetros Gerais
  const [duracaoDias, setDuracaoDias] = useState(14);
  const [limiteObrasAluno, setLimiteObrasAluno] = useState(3);
  const [multaDiariaKz, setMultaDiariaKz] = useState(200);
  const [diasTolerancia, setDiasTolerancia] = useState(2);
  const [notificarSms, setNotificarSms] = useState(true);
  const [notificarEmail, setNotificarEmail] = useState(true);
  const [permitirReservaOnline, setPermitirReservaOnline] = useState(true);

  // Mock data for Solicitações
  const [solicitacoes, setSolicitações] = useState<SolicitacaoEmprestimo[]>([
    {
      id: 'REQ-2026-089',
      utente: 'Afonso Mateus Lemba',
      tipoUtente: 'Aluno',
      turmaOuCargo: '10º Ano A',
      livroTitulo: 'Manual Didático de Matemática — 10ª Classe',
      formato: 'Físico',
      dataSolicitacao: '12/09/2026',
      dataDevolucaoPrevista: '26/09/2026',
      estado: 'Ativo',
    },
    {
      id: 'REQ-2026-090',
      utente: 'Prof. Domingos Henriques',
      tipoUtente: 'Professor',
      turmaOuCargo: 'Docente de Matemática',
      livroTitulo: 'Mayombe — Pepetela',
      formato: 'E-book',
      dataSolicitacao: '14/09/2026',
      dataDevolucaoPrevista: '28/09/2026',
      estado: 'Pendente',
    },
    {
      id: 'REQ-2026-091',
      utente: 'Beatriz Costa',
      tipoUtente: 'Aluno',
      turmaOuCargo: '11º Ano B',
      livroTitulo: 'Química Orgânica Avançada',
      formato: 'Físico',
      dataSolicitacao: '01/09/2026',
      dataDevolucaoPrevista: '15/09/2026',
      estado: 'Atrasado',
    },
    {
      id: 'REQ-2026-092',
      utente: 'Carlos Eduardo',
      tipoUtente: 'Aluno',
      turmaOuCargo: '12º Ano A',
      livroTitulo: 'Guia de Preparação para Exames',
      formato: 'E-book',
      dataSolicitacao: '05/09/2026',
      dataDevolucaoPrevista: '12/09/2026',
      estado: 'Devolvido',
    },
    {
      id: 'REQ-2026-093',
      utente: 'Fernanda Isabel Kiala',
      tipoUtente: 'Aluno',
      turmaOuCargo: '10º Ano B',
      livroTitulo: 'História Geral de Angola & África',
      formato: 'Físico',
      dataSolicitacao: '10/09/2026',
      dataDevolucaoPrevista: '24/09/2026',
      estado: 'Ativo',
    },
    {
      id: 'REQ-2026-094',
      utente: 'Profª. Maria Teresa Bento',
      tipoUtente: 'Professor',
      turmaOuCargo: 'Docente de Química',
      livroTitulo: 'Regulamento Académico & Código de Conduta',
      formato: 'E-book',
      dataSolicitacao: '11/09/2026',
      dataDevolucaoPrevista: '25/09/2026',
      estado: 'Devolvido',
    },
    {
      id: 'REQ-2026-095',
      utente: 'Gaspar António Neto',
      tipoUtente: 'Aluno',
      turmaOuCargo: '12º Ano B',
      livroTitulo: 'Manual Didático de Matemática — 10ª Classe',
      formato: 'Físico',
      dataSolicitacao: '13/09/2026',
      dataDevolucaoPrevista: '27/09/2026',
      estado: 'Pendente',
    },
    {
      id: 'REQ-2026-096',
      utente: 'Helena Manuel Vunge',
      tipoUtente: 'Aluno',
      turmaOuCargo: '11º Ano A',
      livroTitulo: 'Mayombe — Pepetela',
      formato: 'Físico',
      dataSolicitacao: '28/08/2026',
      dataDevolucaoPrevista: '11/09/2026',
      estado: 'Atrasado',
    },
  ]);

  // Library Items Data
  const [recursos, setRecursos] = useState<RecursoBiblioteca[]>([
    {
      id: 'bib-1',
      codigoIsbn: '978-972-0-00101-1',
      titulo: 'Manual Didático de Matemática — 10ª Classe',
      autor: 'Prof. Dr. Manuel Agostinho',
      tipo: 'Manual Didático',
      formato: 'PDF',
      estado: 'Publicado',
      rating: 4.8,
      readsCount: 1420,
      capaUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      disciplina: 'Matemática',
      classe: '10ª Classe',
      anoEdicao: '2026',
      descricao: 'Manual oficial com o programa completo do II Ciclo do Ensino Secundário, exercícios resolvidos e fichas de avaliação contínua.',
      niveisAcesso: 'Estudantes & Professores',
      isFisicoDisponivel: true,
      localizacaoPrateleira: 'Estante A, Fila 2',
      estadoFisico: 'Disponível',
      isEbookDisponivel: true,
      ebookUrl: 'https://vendaia.edu.ao/livros/matematica-10.pdf',
    },
    {
      id: 'bib-2',
      codigoIsbn: '978-972-20-4512-3',
      titulo: 'Mayombe — Pepetela',
      autor: 'Pepetela (Artur Carlos Maurício Pestana dos Santos)',
      tipo: 'Livro Digital',
      formato: 'PDF',
      estado: 'Publicado',
      rating: 4.9,
      readsCount: 2310,
      capaUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      disciplina: 'Língua Portuguesa & Literatura',
      classe: '11ª Classe',
      anoEdicao: '2025',
      descricao: 'Obra clássica da literatura angolana sobre a luta de libertação nacional no Mayombe. Leitura obrigatória no plano curricular.',
      niveisAcesso: 'Público Geral Escolar',
      isFisicoDisponivel: true,
      localizacaoPrateleira: 'Estante L, Fila 4',
      estadoFisico: 'Disponível',
      isEbookDisponivel: true,
      ebookUrl: 'https://vendaia.edu.ao/livros/mayombe.pdf',
    },
    {
      id: 'bib-3',
      codigoIsbn: '978-989-12-0948-2',
      titulo: 'Guia de Preparação para o Exame Nacional de Acesso ao Ensino Superior',
      autor: 'Comissão Pedagógica Central',
      tipo: 'Guia de Exame',
      formato: 'PDF',
      estado: 'Publicado',
      rating: 5.0,
      readsCount: 3100,
      capaUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      disciplina: 'Prep. Exames',
      classe: '12ª Classe',
      anoEdicao: '2026',
      descricao: 'Compilado de exames resolvidos dos últimos 10 anos, critérios de correção e dicas pedagógicas essenciais para admissão universitária.',
      niveisAcesso: 'Estudantes do 12º Ano',
      isFisicoDisponivel: false,
      localizacaoPrateleira: '',
      estadoFisico: 'Indisponível',
      isEbookDisponivel: true,
      ebookUrl: 'https://vendaia.edu.ao/guias/exames-2026.pdf',
    },
    {
      id: 'bib-4',
      codigoIsbn: 'DOC-INST-2026-01',
      titulo: 'Regulamento Académico & Código de Conduta do Estudante 2026/2027',
      autor: 'Conselho de Governação Institucional',
      tipo: 'Documento Institucional',
      formato: 'PDF',
      estado: 'Publicado',
      rating: 4.6,
      readsCount: 4120,
      capaUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      disciplina: 'Institucional',
      classe: 'Geral',
      anoEdicao: '2026',
      descricao: 'Normas disciplinares, direitos, deveres, sistema de avaliação e diretrizes operacionais do complexo escolar Vendaia School.',
      niveisAcesso: 'Toda a Comunidade',
      isFisicoDisponivel: true,
      localizacaoPrateleira: 'Secretaria Geral',
      estadoFisico: 'Disponível',
      isEbookDisponivel: true,
      ebookUrl: 'https://vendaia.edu.ao/docs/regulamento.pdf',
    },
    {
      id: 'bib-5',
      codigoIsbn: '978-972-0-00205-6',
      titulo: 'Química Orgânica Avançada — Reações & Estequiometria',
      autor: 'Profª. Drª. Maria Teresa Bento',
      tipo: 'Manual Didático',
      formato: 'Físico',
      estado: 'Em Revisão',
      rating: 4.8,
      readsCount: 890,
      capaUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
      disciplina: 'Química',
      classe: '11ª Classe',
      anoEdicao: '2026',
      descricao: 'Estruturas moleculares, hidrocarbonetos e mecanismos de reação em laboratório.',
      niveisAcesso: 'Professores & Revisores',
      isFisicoDisponivel: true,
      localizacaoPrateleira: 'Estante Q, Fila 1',
      estadoFisico: 'Disponível',
      isEbookDisponivel: false,
      ebookUrl: '',
    },
    {
      id: 'bib-6',
      codigoIsbn: '978-989-88-1200-9',
      titulo: 'História Geral de Angola & África Subsariana',
      autor: 'Dr. José Eduardo Neto',
      tipo: 'Literatura & Outros',
      formato: 'Físico',
      estado: 'Rascunho',
      rating: 4.9,
      readsCount: 340,
      capaUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
      disciplina: 'História',
      classe: '10ª Classe',
      anoEdicao: '2026',
      descricao: 'Análise aprofundada dos reinos pré-coloniais, rotas comerciais e independência angolana.',
      niveisAcesso: 'Autores Pedagógicos',
      isFisicoDisponivel: true,
      localizacaoPrateleira: 'Estante H, Fila 3',
      estadoFisico: 'Empréstimo',
      isEbookDisponivel: false,
      ebookUrl: '',
    },
  ]);

  // Drawer / Modal States
  const [selectedRecurso, setSelectedRecurso] = useState<RecursoBiblioteca | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [isEditorDrawerOpen, setIsEditorDrawerOpen] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<RecursoBiblioteca | null>(null);

  // Form fields matching the user specification
  const [formTitulo, setFormTitulo] = useState('');
  const [formAutor, setFormAutor] = useState('');
  const [formIsbn, setFormIsbn] = useState('');
  const [formTipo, setFormTipo] = useState<RecursoTipo>('Manual Didático');
  const [formCapaUrl, setFormCapaUrl] = useState('');
  
  // Disponibilidade do Livro Físico
  const [formIsFisicoDisponivel, setFormIsFisicoDisponivel] = useState(true);
  const [formLocalizacaoPrateleira, setFormLocalizacaoPrateleira] = useState('Estante A, Fila 2');
  const [formEstadoFisico, setFormEstadoFisico] = useState<'Disponível' | 'Indisponível' | 'Empréstimo'>('Disponível');

  // Disponibilidade do E-book
  const [formIsEbookDisponivel, setFormIsEbookDisponivel] = useState(true);
  const [formEbookUrl, setFormEbookUrl] = useState('');

  const [formDescricao, setFormDescricao] = useState('');

  // Open Create Drawer
  const openCreateDrawer = () => {
    setEditingRecurso(null);
    setFormTitulo('');
    setFormAutor('');
    setFormIsbn(`978-972-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(0 + Math.random() * 9)}`);
    setFormTipo('Manual Didático');
    setFormCapaUrl('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80');
    setFormIsFisicoDisponivel(true);
    setFormLocalizacaoPrateleira('Estante A, Fila 2');
    setFormEstadoFisico('Disponível');
    setFormIsEbookDisponivel(true);
    setFormEbookUrl('');
    setFormDescricao('');
    setIsEditorDrawerOpen(true);
  };

  // Open Edit Drawer
  const openEditDrawer = (recurso: RecursoBiblioteca) => {
    setEditingRecurso(recurso);
    setFormTitulo(recurso.titulo);
    setFormAutor(recurso.autor);
    setFormIsbn(recurso.codigoIsbn);
    setFormTipo(recurso.tipo);
    setFormCapaUrl(recurso.capaUrl);
    setFormIsFisicoDisponivel(recurso.isFisicoDisponivel);
    setFormLocalizacaoPrateleira(recurso.localizacaoPrateleira);
    setFormEstadoFisico(recurso.estadoFisico);
    setFormIsEbookDisponivel(recurso.isEbookDisponivel);
    setFormEbookUrl(recurso.ebookUrl);
    setFormDescricao(recurso.descricao);
    setIsEditorDrawerOpen(true);
  };

  // Save Recurso
  const handleSaveRecurso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim()) return;

    const formatoCalculado: RecursoFormato = formIsEbookDisponivel ? 'PDF' : 'Físico';

    if (editingRecurso) {
      const updated = recursos.map((r) => {
        if (r.id === editingRecurso.id) {
          return {
            ...r,
            titulo: formTitulo,
            autor: formAutor,
            codigoIsbn: formIsbn,
            tipo: formTipo,
            formato: formatoCalculado,
            capaUrl: formCapaUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
            isFisicoDisponivel: formIsFisicoDisponivel,
            localizacaoPrateleira: formLocalizacaoPrateleira,
            estadoFisico: formEstadoFisico,
            isEbookDisponivel: formIsEbookDisponivel,
            ebookUrl: formEbookUrl,
            descricao: formDescricao,
          };
        }
        return r;
      });
      setRecursos(updated);
      onShowToast(`Livro "${formTitulo}" atualizado com sucesso no acervo!`);
    } else {
      const newRecurso: RecursoBiblioteca = {
        id: `bib-${Date.now()}`,
        titulo: formTitulo,
        autor: formAutor || 'Autor Desconhecido',
        codigoIsbn: formIsbn,
        tipo: formTipo,
        formato: formatoCalculado,
        estado: 'Publicado',
        rating: 5.0,
        readsCount: 1,
        capaUrl: formCapaUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
        disciplina: 'Geral',
        classe: 'Geral',
        anoEdicao: '2026',
        niveisAcesso: 'Comunidade Escolar',
        isFisicoDisponivel: formIsFisicoDisponivel,
        localizacaoPrateleira: formLocalizacaoPrateleira,
        estadoFisico: formEstadoFisico,
        isEbookDisponivel: formIsEbookDisponivel,
        ebookUrl: formEbookUrl,
        descricao: formDescricao || 'Sem descrição cadastrada.',
      };
      setRecursos([newRecurso, ...recursos]);
      onShowToast(`Novo livro "${formTitulo}" cadastrado com sucesso no acervo!`);
    }

    setIsEditorDrawerOpen(false);
  };

  // Delete Recurso
  const handleDeleteRecurso = (id: string, titulo: string) => {
    if (window.confirm(`Tem a certeza que deseja remover "${titulo}" da biblioteca?`)) {
      setRecursos(recursos.filter((r) => r.id !== id));
      if (selectedRecurso?.id === id) {
        setIsDetailDrawerOpen(false);
        setSelectedRecurso(null);
      }
      onShowToast(`Livro "${titulo}" removido com sucesso.`);
    }
  };

  // Filter Items
  const filteredRecursos = recursos.filter((rec) => {
    const matchesSearch =
      rec.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.autor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.codigoIsbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.disciplina.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.classe.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTipo =
      filterTipo === 'todos' || rec.tipo.toLowerCase() === filterTipo.toLowerCase();

    const matchesEstado =
      filterEstado === 'todos' || rec.estado.toLowerCase() === filterEstado.toLowerCase();

    return matchesSearch && matchesTipo && matchesEstado;
  });

  const getEstadoBadge = (estado: RecursoEstado) => {
    switch (estado) {
      case 'Publicado':
        return 'bg-[#86efac] text-[#065f46] font-bold';
      case 'Em Revisão':
        return 'bg-[#93c5fd] text-[#1e40af] font-bold';
      case 'Rascunho':
        return 'bg-[#fde047] text-[#854d0e] font-bold';
      case 'Arquivado':
        return 'bg-[#cbd5e1] text-[#475569] font-bold';
      default:
        return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  // KPI Calculations
  const totalLeituras = recursos.reduce((acc, curr) => acc + curr.readsCount, 0);
  const totalManuais = recursos.filter((r) => r.tipo === 'Manual Didático').length;
  const totalPublicados = recursos.filter((r) => r.estado === 'Publicado').length;

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* SUBMODULO 1: CATÁLOGO */}
      {(activeSubmodule === 'biblioteca' || activeSubmodule === 'biblioteca_catalogo') && (
        <>
          {/* KPI Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Card 1: TOTAL DE OBRAS NO ACERVO */}
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
              <div className="flex flex-col justify-center">
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  TOTAL DE OBRAS NO ACERVO
                </span>
                <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
                  {recursos.length}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 mr-0.5" /> {totalPublicados}
                </span>
                <span className="text-[9px] text-outline font-medium uppercase">publicados</span>
              </div>
            </div>

            {/* Card 2: TOTAL DE LEITURAS & ACESSOS */}
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
              <div className="flex flex-col justify-center">
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  TOTAL DE LEITURAS & ACESSOS
                </span>
                <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
                  {totalLeituras.toLocaleString('pt-PT')}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">
                  ⭐ 4.8
                </span>
                <span className="text-[9px] text-outline font-medium uppercase">avaliação</span>
              </div>
            </div>

            {/* Card 3: MANUAIS ESCOLARES DIDÁTICOS */}
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
              <div className="flex flex-col justify-center">
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  MANUAIS ESCOLARES DIDÁTICOS
                </span>
                <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
                  {totalManuais}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-info bg-info/10 text-[10px] font-bold">
                  Currículo
                </span>
                <span className="text-[9px] text-outline font-medium uppercase">oficial</span>
              </div>
            </div>

            {/* Card 4: LIVROS FÍSICOS NA PRATELEIRA */}
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
              <div className="flex flex-col justify-center">
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  LIVROS FÍSICOS NA PRATELEIRA
                </span>
                <span className="text-xl sm:text-2xl font-bold text-primary leading-none">
                  {recursos.filter((r) => r.isFisicoDisponivel).length}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">
                  <Building className="w-3 h-3 mr-0.5" /> Acervo
                </span>
                <span className="text-[9px] text-outline font-medium uppercase">prateleiras</span>
              </div>
            </div>
          </div>

          {/* Main Controls & Filters Box */}
          <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-4">
            {/* Search & View Switcher & Primary Action Top Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-outline absolute left-3.5 top-3 stroke-[2]" />
                <input
                  type="text"
                  placeholder="Pesquisar por título, autor, ISBN, disciplina ou código..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-surface-container-low border border-border-subtle rounded-xl focus:outline-none focus:border-primary font-medium transition-all"
                />
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                {/* View Mode Toggle Switcher */}
                <div className="bg-surface-container-low border border-border-subtle rounded-xl p-1 flex items-center gap-1">
                  <button
                    onClick={() => setViewMode('capas')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'capas'
                        ? 'bg-primary text-surface-white shadow-sm'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    Capas
                  </button>
                  <button
                    onClick={() => setViewMode('tabela')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'tabela'
                        ? 'bg-primary text-surface-white shadow-sm'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    Tabela
                  </button>
                </div>

                {/* Primary Action Button: Novo Livro */}
                <button
                  onClick={openCreateDrawer}
                  className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0 ml-1"
                  title="Novo Livro"
                >
                  <Plus className="w-4 h-4 stroke-[2]" />
                  <span className="whitespace-nowrap">Novo Livro</span>
                </button>
              </div>
            </div>

            {/* Filter Pills Rows */}
            <div className="pt-2 border-t border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-extrabold text-primary uppercase text-[10px] mr-1 tracking-wider">Tipo:</span>
                {[
                  'todos',
                  'Manual Didático',
                  'Livro Digital',
                  'Guia de Exame',
                  'Documento Institucional',
                  'Literatura & Outros',
                ].map((tipo) => {
                  const label = tipo === 'todos' ? 'Todos os Tipos' : tipo;
                  const isActive = filterTipo === tipo;
                  return (
                    <button
                      key={tipo}
                      onClick={() => setFilterTipo(tipo)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#041939] text-white shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant border border-border-subtle hover:bg-surface-container-high'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-extrabold text-primary uppercase text-[10px] mr-1 tracking-wider">Estado:</span>
                {['todos', 'Publicado', 'Rascunho', 'Em Revisão', 'Arquivado'].map((estado) => {
                  const label = estado === 'todos' ? 'Todos' : estado;
                  const isActive = filterEstado === estado;
                  return (
                    <button
                      key={estado}
                      onClick={() => setFilterEstado(estado)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#c2410c] text-white shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant border border-border-subtle hover:bg-surface-container-high'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CONTENT AREA: GRID (CAPAS) vs TABELA */}
          {viewMode === 'capas' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredRecursos.length === 0 ? (
                <div className="col-span-full bg-surface-white border border-border-subtle rounded-2xl p-12 text-center text-on-surface-variant font-medium">
                  <BookOpen className="w-10 h-10 text-outline mx-auto mb-2 opacity-50" />
                  Nenhum livro encontrado na biblioteca com os filtros aplicados.
                </div>
              ) : (
                filteredRecursos.map((rec) => {
                  return (
                    <div
                      key={rec.id}
                      className="bg-surface-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div
                        onClick={() => {
                          setSelectedRecurso(rec);
                          setIsDetailDrawerOpen(true);
                        }}
                        className="relative h-48 bg-surface-container-high overflow-hidden cursor-pointer"
                      >
                        <img
                          src={rec.capaUrl}
                          alt={rec.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#09172e] text-white px-2.5 py-1 rounded-md text-[11px] font-extrabold shadow-sm">
                          {rec.formato === 'PDF' ? (
                            <FileText className="w-3.5 h-3.5 text-secondary" />
                          ) : (
                            <Book className="w-3.5 h-3.5 text-secondary" />
                          )}
                          <span>{rec.formato === 'PDF' ? 'PDF' : 'FÍSICO'}</span>
                        </div>
                        <div className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider shadow-sm ${getEstadoBadge(rec.estado)}`}>
                          {rec.estado.toUpperCase()}
                        </div>
                      </div>

                      <div
                        onClick={() => {
                          setSelectedRecurso(rec);
                          setIsDetailDrawerOpen(true);
                        }}
                        className="p-4 flex-1 flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          <p className="text-[10px] font-extrabold text-secondary uppercase tracking-wider">
                            {rec.tipo}
                          </p>
                          <h3 className="text-xs font-bold text-primary line-clamp-2 mt-1 group-hover:text-secondary transition-colors leading-tight">
                            {rec.titulo}
                          </h3>
                          <p className="text-[11px] text-on-surface-variant truncate mt-1">
                            {rec.autor}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-outline font-medium">
                          <div className="flex items-center gap-1 text-secondary font-bold">
                            <Star className="w-3 h-3 fill-secondary text-secondary" />
                            <span>{rec.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{rec.readsCount} leituras</span>
                            {rec.isFisicoDisponivel && (
                              <span className="text-success font-bold">• Prateleira</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-2.5 bg-surface-container-low border-t border-border-subtle flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedRecurso(rec);
                            setIsDetailDrawerOpen(true);
                          }}
                          className="text-xs text-primary hover:text-secondary font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-secondary" />
                          Ler
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditDrawer(rec)}
                            className="p-1.5 text-outline hover:text-secondary rounded hover:bg-secondary/10 transition-colors cursor-pointer"
                            title="Editar Livro"
                          >
                            <Edit3 className="w-4 h-4 stroke-[2]" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecurso(rec.id, rec.titulo)}
                            className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer"
                            title="Eliminar Livro"
                          >
                            <Trash2 className="w-4 h-4 stroke-[2]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="bg-surface-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-xs font-bold text-primary border-b border-border-subtle">
                      <th className="px-4 py-3.5">Livro / Título</th>
                      <th className="px-3.5 py-3.5">Categoria</th>
                      <th className="px-3.5 py-3.5">Autor</th>
                      <th className="px-3.5 py-3.5">Formato</th>
                      <th className="px-3.5 py-3.5">Localização Prateleira</th>
                      <th className="px-3.5 py-3.5 text-center">Leituras</th>
                      <th className="px-3.5 py-3.5 text-center">Estado</th>
                      <th className="px-4 py-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-xs font-medium">
                    {filteredRecursos.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-10 text-on-surface-variant">
                          Nenhum livro encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredRecursos.map((rec) => {
                        return (
                          <tr key={rec.id} className="hover:bg-surface-container-low/40 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={rec.capaUrl}
                                  alt={rec.titulo}
                                  className="w-10 h-12 object-cover rounded-md shrink-0 border border-border-subtle"
                                />
                                <div>
                                  <p className="font-bold text-primary text-xs line-clamp-1">{rec.titulo}</p>
                                  <p className="text-[10px] text-outline font-mono mt-0.5">ISBN: {rec.codigoIsbn}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3.5 py-3">
                              <span className="bg-secondary/10 text-secondary border border-secondary/20 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                                {rec.tipo}
                              </span>
                            </td>
                            <td className="px-3.5 py-3 font-semibold text-primary">{rec.autor}</td>
                            <td className="px-3.5 py-3">
                              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                                {rec.formato === 'PDF' ? <FileText className="w-3 h-3 text-secondary" /> : <Book className="w-3 h-3 text-secondary" />}
                                {rec.formato === 'PDF' ? 'PDF (E-book)' : 'Físico'}
                              </div>
                            </td>
                            <td className="px-3.5 py-3">
                              {rec.isFisicoDisponivel ? (
                                <span className="text-xs text-primary font-semibold">{rec.localizacaoPrateleira || 'Disponível na Estante'}</span>
                              ) : (
                                <span className="text-xs text-outline italic">Não Físico</span>
                              )}
                            </td>
                            <td className="px-3.5 py-3 text-center">
                              <div className="font-extrabold text-primary">{rec.readsCount}</div>
                              <div className="text-[10px] text-secondary font-bold flex items-center justify-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-secondary" /> {rec.rating.toFixed(1)}
                              </div>
                            </td>
                            <td className="px-3.5 py-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${getEstadoBadge(rec.estado)}`}>
                                {rec.estado}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedRecurso(rec);
                                    setIsDetailDrawerOpen(true);
                                  }}
                                  className="px-2.5 py-1 text-primary hover:text-secondary font-bold text-xs bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                  title="Ler Livro"
                                >
                                  <Eye className="w-3.5 h-3.5 text-secondary" /> Ler
                                </button>
                                <button
                                  onClick={() => openEditDrawer(rec)}
                                  className="p-1.5 text-outline hover:text-secondary rounded hover:bg-secondary/10 transition-colors cursor-pointer"
                                  title="Editar"
                                >
                                  <Edit3 className="w-4 h-4 stroke-[2]" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRecurso(rec.id, rec.titulo)}
                                  className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4 stroke-[2]" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* SUBMODULO 2: SOLICITAÇÕES & EMPRÉSTIMOS */}
      {activeSubmodule === 'biblioteca_solicitacoes' && (
        <div className="space-y-4">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between h-[68px]">
              <div>
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">TOTAL DE PEDIDOS</span>
                <span className="text-2xl font-bold text-primary leading-none">{solicitacoes.length}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">Geral</span>
            </div>
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between h-[68px]">
              <div>
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">EMPRÉSTIMOS ATIVOS</span>
                <span className="text-2xl font-bold text-primary leading-none">
                  {solicitacoes.filter((s) => s.estado === 'Ativo').length}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">Em Curso</span>
            </div>
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between h-[68px]">
              <div>
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">PEDIDOS PENDENTES</span>
                <span className="text-2xl font-bold text-primary leading-none">
                  {solicitacoes.filter((s) => s.estado === 'Pendente').length}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-amber-800 bg-amber-100 text-[10px] font-bold">Aprovação</span>
            </div>
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between h-[68px]">
              <div>
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">DEVOLUÇÕES EM ATRASO</span>
                <span className="text-2xl font-bold text-error leading-none">
                  {solicitacoes.filter((s) => s.estado === 'Atrasado').length}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-error bg-error/10 text-[10px] font-bold">Atenção</span>
            </div>
          </div>

          {/* Filter & Toolbar Area */}
          <div className="bg-surface-white border border-border-subtle rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={solicitacaoSearchQuery}
                  onChange={(e) => setSolicitacaoSearchQuery(e.target.value)}
                  placeholder="Pesquisar Aluno ou Livro..."
                  className="w-full pl-9 pr-4 py-2 border border-border-subtle rounded-xl text-xs font-medium focus:outline-none focus:border-secondary bg-surface-white"
                />
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-primary text-xs">Período:</span>
                <input
                  type="date"
                  value={solicitacaoDataInicio}
                  onChange={(e) => setSolicitacaoDataInicio(e.target.value)}
                  className="p-1.5 border border-border-subtle rounded-lg text-xs font-semibold bg-surface-white"
                />
                <span className="text-outline font-bold">-</span>
                <input
                  type="date"
                  value={solicitacaoDataFim}
                  onChange={(e) => setSolicitacaoDataFim(e.target.value)}
                  className="p-1.5 border border-border-subtle rounded-lg text-xs font-semibold bg-surface-white"
                />
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-primary">Status:</span>
                <select
                  value={solicitacaoFilterStatus}
                  onChange={(e) => setSolicitacaoFilterStatus(e.target.value)}
                  className="p-2 border border-border-subtle rounded-xl text-xs font-bold bg-surface-white focus:outline-none"
                >
                  <option value="todos">Todos</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Devolvido">Devolvido</option>
                  <option value="Atrasado">Atrasado</option>
                </select>
              </div>

              {/* Linhas Select */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-primary">Linhas:</span>
                <select
                  value={solicitacaoPageSize}
                  onChange={(e) => setSolicitacaoPageSize(Number(e.target.value))}
                  className="p-2 border border-border-subtle rounded-xl text-xs font-bold bg-surface-white focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setIsNovaSolicitacaoModalOpen(true)}
                className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" /> Nova Requisição
              </button>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-surface-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-xs font-bold text-primary border-b border-border-subtle">
                    <th className="px-4 py-3.5">Data</th>
                    <th className="px-3.5 py-3.5">Livro Solicitado</th>
                    <th className="px-3.5 py-3.5">Leitor (Estudante/Docente)</th>
                    <th className="px-3.5 py-3.5 text-center">Status</th>
                    <th className="px-4 py-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-xs font-medium">
                  {solicitacoes
                    .filter((sol) => {
                      const matchesSearch =
                        sol.utente.toLowerCase().includes(solicitacaoSearchQuery.toLowerCase()) ||
                        sol.livroTitulo.toLowerCase().includes(solicitacaoSearchQuery.toLowerCase()) ||
                        sol.id.toLowerCase().includes(solicitacaoSearchQuery.toLowerCase());
                      const matchesStatus =
                        solicitacaoFilterStatus === 'todos' || sol.estado.toLowerCase() === solicitacaoFilterStatus.toLowerCase();
                      return matchesSearch && matchesStatus;
                    })
                    .slice(0, solicitacaoPageSize)
                    .map((sol) => (
                      <tr key={sol.id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-primary">{sol.dataSolicitacao}</td>
                        <td className="px-3.5 py-3">
                          <p className="font-bold text-primary">{sol.livroTitulo}</p>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] bg-surface-container-high rounded font-bold text-outline">
                            {sol.formato} • {sol.id}
                          </span>
                        </td>
                        <td className="px-3.5 py-3">
                          <p className="font-bold text-primary">{sol.utente}</p>
                          <p className="text-[10px] text-outline">{sol.tipoUtente} • {sol.turmaOuCargo}</p>
                        </td>
                        <td className="px-3.5 py-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              sol.estado === 'Ativo'
                                ? 'bg-green-100 text-green-800'
                                : sol.estado === 'Pendente'
                                ? 'bg-amber-100 text-amber-800'
                                : sol.estado === 'Atrasado'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {sol.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {sol.estado === 'Pendente' && (
                              <button
                                onClick={() => {
                                  setSolicitações(
                                    solicitacoes.map((s) => (s.id === sol.id ? { ...s, estado: 'Ativo' } : s))
                                  );
                                  onShowToast(`Requisição ${sol.id} aprovada com sucesso.`);
                                }}
                                className="px-2.5 py-1 bg-success text-surface-white rounded-lg text-xs font-bold hover:bg-success/90 cursor-pointer"
                              >
                                Aprovar
                              </button>
                            )}
                            {sol.estado === 'Ativo' && (
                              <button
                                onClick={() => {
                                  setSolicitações(
                                    solicitacoes.map((s) => (s.id === sol.id ? { ...s, estado: 'Devolvido' } : s))
                                  );
                                  onShowToast(`Devolução da requisição ${sol.id} registada.`);
                                }}
                                className="px-2.5 py-1 bg-primary text-surface-white rounded-lg text-xs font-bold hover:bg-primary/90 cursor-pointer"
                              >
                                Devolver
                              </button>
                            )}
                            {sol.estado === 'Atrasado' && (
                              <button
                                onClick={() => onShowToast(`Lembrete de devolução enviado para ${sol.utente}.`)}
                                className="px-2.5 py-1 bg-amber-600 text-surface-white rounded-lg text-xs font-bold hover:bg-amber-700 cursor-pointer"
                              >
                                Notificar
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSolicitações(solicitacoes.filter((s) => s.id !== sol.id));
                                onShowToast(`Requisição ${sol.id} removida.`);
                              }}
                              className="p-1 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-3 bg-surface-container-low border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
              <span className="text-on-surface-variant font-medium">
                A mostrar 1 a {Math.min(solicitacoes.length, solicitacaoPageSize)} de {solicitacoes.length} resultados
              </span>
              <div className="flex items-center gap-1 font-bold text-primary">
                <button
                  onClick={() => setSolicitacaoCurrentPage(Math.max(1, solicitacaoCurrentPage - 1))}
                  className="px-2.5 py-1 rounded-lg border border-border-subtle bg-surface-white hover:bg-surface-container cursor-pointer disabled:opacity-50"
                  disabled={solicitacaoCurrentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 bg-primary text-surface-white rounded-lg text-xs">
                  {solicitacaoCurrentPage} / {Math.ceil(solicitacoes.length / solicitacaoPageSize) || 1}
                </span>
                <button
                  onClick={() => setSolicitacaoCurrentPage(solicitacaoCurrentPage + 1)}
                  className="px-2.5 py-1 rounded-lg border border-border-subtle bg-surface-white hover:bg-surface-container cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULO 3: RELATÓRIOS & MÉTRICAS */}
      {activeSubmodule === 'biblioteca_relatorios' && (
        <div className="space-y-4">
          {/* Top KPI Cards (Identical layout & styling to Solicitações) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between h-[68px]">
              <div>
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">TOTAL ACERVO</span>
                <span className="text-2xl font-bold text-primary leading-none">1.480</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">Geral</span>
            </div>
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between h-[68px]">
              <div>
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">DISPONÍVEIS</span>
                <span className="text-2xl font-bold text-success leading-none">1.120</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">Em Curso</span>
            </div>
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between h-[68px]">
              <div>
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">EMPRESTADOS</span>
                <span className="text-2xl font-bold text-primary leading-none">260</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-amber-800 bg-amber-100 text-[10px] font-bold">Aprovação</span>
            </div>
            <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between h-[68px]">
              <div>
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">E-BOOKS DIGITAIS</span>
                <span className="text-2xl font-bold text-error leading-none">100</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-error bg-error/10 text-[10px] font-bold">Atenção</span>
            </div>
          </div>

          {/* Filter & Toolbar Area (Identical structure & layout to Solicitações) */}
          <div className="bg-surface-white border border-border-subtle rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar Aluno ou Livro..."
                  className="w-full pl-9 pr-4 py-2 border border-border-subtle rounded-xl text-xs font-medium focus:outline-none focus:border-secondary bg-surface-white"
                />
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-primary text-xs">Período:</span>
                <input
                  type="date"
                  className="p-1.5 border border-border-subtle rounded-lg text-xs font-semibold bg-surface-white"
                />
                <span className="text-outline font-bold">-</span>
                <input
                  type="date"
                  className="p-1.5 border border-border-subtle rounded-lg text-xs font-semibold bg-surface-white"
                />
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-primary">Status:</span>
                <select
                  value={relatorioPeriodo}
                  onChange={(e) => setRelatorioPeriodo(e.target.value as any)}
                  className="p-2 border border-border-subtle rounded-xl text-xs font-bold bg-surface-white focus:outline-none"
                >
                  <option value="30dias">Todos</option>
                  <option value="7dias">Últimos 7 Dias</option>
                  <option value="trimestre">Este Trimestre</option>
                  <option value="ano">Ano Letivo 2026</option>
                </select>
              </div>

              {/* Linhas Select */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-primary">Linhas:</span>
                <select
                  className="p-2 border border-border-subtle rounded-xl text-xs font-bold bg-surface-white focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={() => onShowToast('Relatório completo do acervo exportado em PDF com sucesso!')}
                className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
              >
                <Download className="w-4 h-4" /> Exportar PDF
              </button>
            </div>
          </div>

          {/* Section 2: Atividade por Período & Distribuição */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Atividade por Período (Últimos 30 dias) */}
            <div className="bg-surface-white border border-border-subtle rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                <h4 className="font-bold text-primary text-xs uppercase tracking-wider">Atividade por Período (Últimos 30 dias)</h4>
                <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">Atualizado hoje</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-surface-container-low p-3 rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-outline font-bold block uppercase">Novos Leitores</span>
                  <span className="text-xl font-bold text-primary">48</span>
                  <span className="text-[9px] text-success font-bold block">+12% este mês</span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-outline font-bold block uppercase">Novas Obras</span>
                  <span className="text-xl font-bold text-primary">15</span>
                  <span className="text-[9px] text-outline font-bold block">Adicionadas</span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-outline font-bold block uppercase">Solicitações</span>
                  <span className="text-xl font-bold text-primary">142</span>
                  <span className="text-[9px] text-success font-bold block">+18% que ago.</span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl border border-border-subtle">
                  <span className="text-[10px] text-outline font-bold block uppercase">Novos E-books</span>
                  <span className="text-xl font-bold text-primary">8</span>
                  <span className="text-[9px] text-outline font-bold block">PDFs Anexados</span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl border border-border-subtle col-span-2 sm:col-span-2">
                  <span className="text-[10px] text-outline font-bold block uppercase">Utilização Digital (E-books)</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-bold text-secondary">78.5%</span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">890 Leituras Online</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '78.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribuição por Categoria */}
            <div className="bg-surface-white border border-border-subtle rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                <h4 className="font-bold text-primary text-xs uppercase tracking-wider">Distribuição por Categoria</h4>
                <span className="text-[10px] font-bold text-outline">6 Categorias</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-primary text-xs mb-1">
                    <span>Matemática & Ciências Exatas</span>
                    <span>142 Obras (38%)</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '38%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-primary text-xs mb-1">
                    <span>Literatura Angolana & Lusófona</span>
                    <span>98 Obras (28%)</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full" style={{ width: '28%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-primary text-xs mb-1">
                    <span>História, Geografia & Sociedade</span>
                    <span>64 Obras (18%)</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: '18%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-primary text-xs mb-1">
                    <span>Guias de Exames Nacionais & Testes</span>
                    <span>45 Obras (10%)</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: '10%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-primary text-xs mb-1">
                    <span>Informática & Outros</span>
                    <span>38 Obras (6%)</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: '6%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Evolução de Solicitações (Últimos 6 meses) & Rankings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart: Evolução de Solicitações (6 Meses) */}
            <div className="bg-surface-white border border-border-subtle rounded-2xl p-4 shadow-sm space-y-3 lg:col-span-2">
              <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                <h4 className="font-bold text-primary text-xs uppercase tracking-wider">Evolução de Solicitações (Últimos 6 meses)</h4>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Tendência +42%</span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2">
                {[
                  { mes: 'abr.', val: 85, label: '85 Pedidos' },
                  { mes: 'mai.', val: 110, label: '110 Pedidos' },
                  { mes: 'jun.', val: 145, label: '145 Pedidos' },
                  { mes: 'jul.', val: 90, label: '90 Pedidos' },
                  { mes: 'ago.', val: 160, label: '160 Pedidos' },
                  { mes: 'set.', val: 210, label: '210 Pedidos' },
                ].map((item, idx) => {
                  const maxVal = 210;
                  const heightPercent = Math.round((item.val / maxVal) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.val}
                      </span>
                      <div className="w-full bg-surface-container-high rounded-t-lg overflow-hidden flex items-end h-[120px]">
                        <div
                          className={`w-full transition-all duration-500 group-hover:brightness-110 rounded-t-lg ${
                            idx === 5 ? 'bg-primary' : 'bg-secondary'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-primary">{item.mes}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top 5 Obras & Leitores mais Ativos */}
            <div className="bg-surface-white border border-border-subtle rounded-2xl p-4 shadow-sm space-y-3">
              <div className="border-b border-border-subtle pb-2">
                <h4 className="font-bold text-primary text-xs uppercase tracking-wider">Top Obras Mais Requisitadas</h4>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 p-2 bg-surface-container-low rounded-xl border border-border-subtle">
                  <div className="w-6 h-6 rounded-full bg-primary text-surface-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary truncate">Manual Didático de Matemática 10ª</p>
                    <p className="text-[10px] text-outline">1.420 Acessos • 4.8 ★</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 bg-surface-container-low rounded-xl border border-border-subtle">
                  <div className="w-6 h-6 rounded-full bg-secondary text-surface-white flex items-center justify-center font-bold text-xs shrink-0">2</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary truncate">Mayombe — Pepetela</p>
                    <p className="text-[10px] text-outline">2.310 Acessos • 4.9 ★</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 bg-surface-container-low rounded-xl border border-border-subtle">
                  <div className="w-6 h-6 rounded-full bg-slate-400 text-surface-white flex items-center justify-center font-bold text-xs shrink-0">3</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary truncate">Guia de Preparação para Exames</p>
                    <p className="text-[10px] text-outline">3.100 Acessos • 5.0 ★</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 bg-surface-container-low rounded-xl border border-border-subtle">
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-primary flex items-center justify-center font-bold text-xs shrink-0">4</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary truncate">Regulamento Académico 2026</p>
                    <p className="text-[10px] text-outline">4.120 Acessos • 4.6 ★</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMODULO 4: CONFIGURAÇÕES DA BIBLIOTECA */}
      {activeSubmodule === 'biblioteca_configuracoes' && (
        <div className="bg-surface-white border border-border-subtle rounded-2xl p-5 shadow-sm space-y-6">
          {/* Header */}
          <div className="border-b border-border-subtle pb-4">
            <h3 className="font-bold text-primary text-base">Configurações da Biblioteca</h3>
            <p className="text-xs text-on-surface-variant">Ajusta os parâmetros de empréstimo e a identidade visual do catálogo.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Parâmetros Gerais */}
            <div className="space-y-4 bg-surface-container-low p-4 rounded-2xl border border-border-subtle">
              <h4 className="font-bold text-primary text-xs uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-2">
                <Settings className="w-4 h-4 text-secondary" /> Parâmetros Gerais de Empréstimo
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-primary mb-1">Duração Máxima de Empréstimo (Dias)</label>
                  <input
                    type="number"
                    value={duracaoDias}
                    onChange={(e) => setDuracaoDias(Number(e.target.value))}
                    className="w-full p-2 border border-border-subtle rounded-xl bg-surface-white font-bold text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-primary mb-1">Limite por Estudante (Obras)</label>
                  <input
                    type="number"
                    value={limiteObrasAluno}
                    onChange={(e) => setLimiteObrasAluno(Number(e.target.value))}
                    className="w-full p-2 border border-border-subtle rounded-xl bg-surface-white font-bold text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-primary mb-1">Multa Diária por Atraso (Kz)</label>
                  <input
                    type="number"
                    value={multaDiariaKz}
                    onChange={(e) => setMultaDiariaKz(Number(e.target.value))}
                    className="w-full p-2 border border-border-subtle rounded-xl bg-surface-white font-bold text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-primary mb-1">Tolerância para Renovação (Dias)</label>
                  <input
                    type="number"
                    value={diasTolerancia}
                    onChange={(e) => setDiasTolerancia(Number(e.target.value))}
                    className="w-full p-2 border border-border-subtle rounded-xl bg-surface-white font-bold text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle space-y-2">
                <label className="flex items-center gap-2 font-bold text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={permitirReservaOnline}
                    onChange={(e) => setPermitirReservaOnline(e.target.checked)}
                    className="w-4 h-4 text-secondary rounded"
                  />
                  <span>Permitir reservas de e-books pelo Portal do Aluno</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={notificarSms}
                    onChange={(e) => setNotificarSms(e.target.checked)}
                    className="w-4 h-4 text-secondary rounded"
                  />
                  <span>Enviar notificações automáticas via SMS aos leitores</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={notificarEmail}
                    onChange={(e) => setNotificarEmail(e.target.checked)}
                    className="w-4 h-4 text-secondary rounded"
                  />
                  <span>Enviar avisos de devolução por E-mail</span>
                </label>
              </div>
            </div>

            {/* Categorias de Livros / Gestão de Categorias */}
            <div className="space-y-4 bg-surface-container-low p-4 rounded-2xl border border-border-subtle">
              <div className="border-b border-border-subtle pb-2 flex justify-between items-center">
                <h4 className="font-bold text-primary text-xs uppercase tracking-wider flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-secondary" /> Categorias de Livros & Gestão
                </h4>
                <span className="text-[10px] font-bold text-outline">{categorias.length} Registadas</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Adicione e organize as categorias literárias disponíveis no acervo.</p>

              {/* Add category input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novaCategoriaInput}
                  onChange={(e) => setNovaCategoriaInput(e.target.value)}
                  placeholder="Nome da nova categoria..."
                  className="flex-1 p-2 border border-border-subtle rounded-xl bg-surface-white font-medium text-xs focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (!novaCategoriaInput.trim()) return;
                    setCategorias([
                      ...categorias,
                      {
                        id: `cat-${Date.now()}`,
                        nome: novaCategoriaInput.trim(),
                        obrasCount: 0,
                        descricao: 'Categoria criada recentemente.',
                      },
                    ]);
                    setNovaCategoriaInput('');
                    onShowToast(`Categoria "${novaCategoriaInput.trim()}" adicionada.`);
                  }}
                  className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>

              {/* Categories List */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {categorias.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-2.5 bg-surface-white rounded-xl border border-border-subtle text-xs">
                    <div>
                      <p className="font-bold text-primary">{cat.nome}</p>
                      <p className="text-[10px] text-outline">{cat.obrasCount} obras catalogadas</p>
                    </div>
                    <button
                      onClick={() => {
                        setCategorias(categorias.filter((c) => c.id !== cat.id));
                        onShowToast(`Categoria ${cat.nome} removida.`);
                      }}
                      className="p-1 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer"
                      title="Eliminar Categoria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-border-subtle">
            <button
              onClick={() => onShowToast('Configurações da Biblioteca salvas com sucesso!')}
              className="bg-primary text-surface-white hover:bg-primary/90 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" /> Guardar Configurações
            </button>
          </div>
        </div>
      )}

      {/* MODAL NOVA SOLICITAÇÃO / REQUISIÇÃO */}
      {isNovaSolicitacaoModalOpen && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <h3 className="font-bold text-primary text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-secondary" /> Nova Requisição de Empréstimo
              </h3>
              <button
                onClick={() => setIsNovaSolicitacaoModalOpen(false)}
                className="text-outline hover:text-primary p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-primary mb-1">Nome do Leitor (Aluno / Professor)</label>
                <input
                  type="text"
                  value={novaSolUtente}
                  onChange={(e) => setNovaSolUtente(e.target.value)}
                  placeholder="Ex: Afonso Mateus Lemba"
                  className="w-full p-2 border border-border-subtle rounded-xl font-semibold bg-surface-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-primary mb-1">Tipo de Leitor</label>
                  <select
                    value={novaSolTipo}
                    onChange={(e) => setNovaSolTipo(e.target.value as any)}
                    className="w-full p-2 border border-border-subtle rounded-xl font-bold bg-surface-white focus:outline-none"
                  >
                    <option value="Aluno">Aluno</option>
                    <option value="Professor">Professor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-primary mb-1">Turma / Cargo</label>
                  <input
                    type="text"
                    value={novaSolTurma}
                    onChange={(e) => setNovaSolTurma(e.target.value)}
                    className="w-full p-2 border border-border-subtle rounded-xl font-semibold bg-surface-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Livro Requisitado</label>
                <select
                  value={novaSolLivro}
                  onChange={(e) => setNovaSolLivro(e.target.value)}
                  className="w-full p-2 border border-border-subtle rounded-xl font-semibold bg-surface-white focus:outline-none"
                >
                  <option value="Manual Didático de Matemática — 10ª Classe">Manual Didático de Matemática — 10ª Classe</option>
                  <option value="Mayombe — Pepetela">Mayombe — Pepetela</option>
                  <option value="Química Orgânica Avançada">Química Orgânica Avançada</option>
                  <option value="Guia de Preparação para Exames">Guia de Preparação para Exames</option>
                  <option value="História Geral de Angola & África">História Geral de Angola & África</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Formato</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 font-bold text-primary cursor-pointer">
                    <input
                      type="radio"
                      name="formato"
                      checked={novaSolFormato === 'Físico'}
                      onChange={() => setNovaSolFormato('Físico')}
                      className="text-secondary"
                    />
                    Físico (Empréstimo Presencial)
                  </label>
                  <label className="flex items-center gap-1.5 font-bold text-primary cursor-pointer">
                    <input
                      type="radio"
                      name="formato"
                      checked={novaSolFormato === 'E-book'}
                      onChange={() => setNovaSolFormato('E-book')}
                      className="text-secondary"
                    />
                    E-book (Digital)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
              <button
                onClick={() => setIsNovaSolicitacaoModalOpen(false)}
                className="px-4 py-2 text-outline font-bold hover:bg-surface-container rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!novaSolUtente.trim()) {
                    onShowToast('Por favor insira o nome do leitor.');
                    return;
                  }
                  const newSol: SolicitacaoEmprestimo = {
                    id: `REQ-2026-0${solicitacoes.length + 90}`,
                    utente: novaSolUtente.trim(),
                    tipoUtente: novaSolTipo,
                    turmaOuCargo: novaSolTurma,
                    livroTitulo: novaSolLivro,
                    formato: novaSolFormato,
                    dataSolicitacao: new Date().toLocaleDateString('pt-PT'),
                    dataDevolucaoPrevista: '28/09/2026',
                    estado: 'Pendente',
                  };
                  setSolicitações([newSol, ...solicitacoes]);
                  setIsNovaSolicitacaoModalOpen(false);
                  setNovaSolUtente('');
                  onShowToast(`Nova requisição ${newSol.id} para ${newSol.utente} registada!`);
                }}
                className="px-4 py-2 bg-primary text-surface-white font-bold rounded-xl hover:bg-primary/90 cursor-pointer shadow-sm"
              >
                Criar Requisição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER / READER PREVIEW */}
      {isDetailDrawerOpen && selectedRecurso && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-surface-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-primary text-surface-white p-5 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-secondary tracking-wider">
                    {selectedRecurso.tipo}
                  </span>
                  <h2 className="text-base font-bold text-surface-white leading-tight">
                    {selectedRecurso.titulo}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="text-surface-white/70 hover:text-surface-white p-1 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-6 flex-1">
              {/* Top Summary Banner */}
              <div className="flex flex-col sm:flex-row gap-5 bg-surface-container-low p-4 rounded-2xl border border-border-subtle">
                <img
                  src={selectedRecurso.capaUrl}
                  alt={selectedRecurso.titulo}
                  className="w-32 h-44 object-cover rounded-xl shadow-md border border-border-subtle shrink-0 mx-auto sm:mx-0"
                />

                <div className="space-y-2 flex-1 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${getEstadoBadge(selectedRecurso.estado)}`}>
                    {selectedRecurso.estado}
                  </span>
                  <h3 className="font-extrabold text-primary text-sm leading-snug">{selectedRecurso.titulo}</h3>
                  <p className="text-on-surface-variant font-semibold">{selectedRecurso.autor}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle text-[11px]">
                    <div>
                      <span className="text-outline font-bold block text-[10px] uppercase">Formato</span>
                      <span className="font-bold text-primary">{selectedRecurso.formato === 'PDF' ? 'PDF (E-book)' : 'Físico'}</span>
                    </div>
                    <div>
                      <span className="text-outline font-bold block text-[10px] uppercase">ISBN</span>
                      <span className="font-mono text-primary font-bold">{selectedRecurso.codigoIsbn}</span>
                    </div>
                    {selectedRecurso.isFisicoDisponivel && (
                      <div className="col-span-2 bg-surface-white p-2 rounded-lg border border-border-subtle mt-1">
                        <span className="text-secondary font-bold block text-[10px] uppercase">Localização na Prateleira</span>
                        <span className="font-bold text-primary">{selectedRecurso.localizacaoPrateleira || 'Estante A'} ({selectedRecurso.estadoFisico})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Resumo / Sinopse Pedagógica</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-white p-4 rounded-xl border border-border-subtle">
                  {selectedRecurso.descricao}
                </p>
              </div>

              {/* Reader Mockup Area */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Área de Leitura do Livro</h4>
                <div className="bg-surface-container-high border border-border-subtle rounded-2xl p-8 text-center space-y-3">
                  <FileText className="w-12 h-12 text-secondary mx-auto" />
                  <p className="text-xs font-bold text-primary">Leitor Digital Integrado Vendaia School®</p>
                  <p className="text-[11px] text-on-surface-variant max-w-md mx-auto">
                    O livro está pronto para leitura online segura ou consulta presencial na biblioteca escolar.
                  </p>
                  {selectedRecurso.isEbookDisponivel && (
                    <button
                      onClick={() => onShowToast(`Modo de Leitura iniciado para "${selectedRecurso.titulo}".`)}
                      className="bg-primary text-surface-white hover:bg-primary/90 text-xs px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2 shadow-sm cursor-pointer transition-all"
                    >
                      <BookOpen className="w-4 h-4" /> Ler Ficheiro PDF Online
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Controls */}
            <div className="p-4 bg-surface-container-low border-t border-border-subtle flex justify-between items-center">
              <button
                onClick={() => {
                  setIsDetailDrawerOpen(false);
                  openEditDrawer(selectedRecurso);
                }}
                className="bg-surface-white border border-border-subtle hover:bg-surface-container text-primary text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-secondary stroke-[2]" /> Editar Livro
              </button>

              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="bg-primary text-surface-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT SIDE-DRAWER (NOVO LIVRO) */}
      {isEditorDrawerOpen && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-xs z-50 flex justify-end">
          <form
            onSubmit={handleSaveRecurso}
            className="bg-surface-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="bg-primary text-surface-white p-5 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-surface-white">
                    {editingRecurso ? 'Editar Livro' : 'Novo Livro'}
                  </h2>
                  <p className="text-xs text-surface-white/70">
                    Preencha os detalhes do livro no acervo.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorDrawerOpen(false)}
                className="text-surface-white/70 hover:text-surface-white p-1 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Fields - Exact layout requested by user */}
            <div className="p-6 space-y-5 text-xs">
              {/* Imagem de Capa (Opcional) */}
              <div className="space-y-2 bg-surface-container-low p-4 rounded-xl border border-border-subtle">
                <label className="block font-bold text-primary">Imagem de Capa (Opcional)</label>
                <p className="text-[11px] text-on-surface-variant">Carregue a capa do livro para facilitar a identificação.</p>
                
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const sample = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                      setFormCapaUrl(sample);
                      onShowToast('Imagem de capa selecionada com sucesso.');
                    }}
                    className="bg-surface-white border border-border-subtle hover:bg-surface-container text-primary font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-4 h-4 text-secondary" /> Carregar Imagem
                  </button>

                  <input
                    type="url"
                    value={formCapaUrl}
                    onChange={(e) => setFormCapaUrl(e.target.value)}
                    placeholder="OU cole o URL da imagem da capa"
                    className="flex-1 p-2 border border-border-subtle rounded-lg text-[11px] font-mono focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              {/* Título * */}
              <div>
                <label className="block font-bold text-primary mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  placeholder="Ex: Manual Didático de Matemática — 10ª Classe"
                  className="w-full p-2.5 border border-border-subtle rounded-xl focus:border-secondary focus:outline-none font-semibold text-xs"
                />
              </div>

              {/* Autor * & ISBN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-primary mb-1">Autor *</label>
                  <input
                    type="text"
                    required
                    value={formAutor}
                    onChange={(e) => setFormAutor(e.target.value)}
                    placeholder="Ex: Pepetela"
                    className="w-full p-2.5 border border-border-subtle rounded-xl focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-primary mb-1">ISBN</label>
                  <input
                    type="text"
                    value={formIsbn}
                    onChange={(e) => setFormIsbn(e.target.value)}
                    placeholder="Ex: 978-972-20-4512-3"
                    className="w-full p-2.5 border border-border-subtle rounded-xl focus:border-secondary focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block font-bold text-primary mb-1">Categoria</label>
                <select
                  value={formTipo}
                  onChange={(e) => setFormTipo(e.target.value as RecursoTipo)}
                  className="w-full p-2.5 border border-border-subtle rounded-xl focus:border-secondary focus:outline-none font-bold"
                >
                  <option value="" disabled>Selecione ou escreva uma nova</option>
                  <option value="Manual Didático">Manual Didático</option>
                  <option value="Livro Digital">Livro Digital</option>
                  <option value="Guia de Exame">Guia de Exame</option>
                  <option value="Documento Institucional">Documento Institucional</option>
                  <option value="Literatura & Outros">Literatura & Outros</option>
                </select>
              </div>

              {/* Disponibilidade do Livro Section */}
              <div className="space-y-4 pt-2 border-t border-border-subtle">
                <h3 className="font-extrabold text-primary uppercase text-[11px] tracking-wider">Disponibilidade do Livro</h3>

                {/* Livro Físico Disponível */}
                <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-border-subtle">
                  <label className="flex items-center gap-2 font-bold text-primary cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formIsFisicoDisponivel}
                      onChange={(e) => setFormIsFisicoDisponivel(e.target.checked)}
                      className="w-4 h-4 text-secondary rounded focus:ring-secondary cursor-pointer"
                    />
                    <span>Livro Físico Disponível</span>
                  </label>

                  {formIsFisicoDisponivel && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle">
                      <div>
                        <label className="block font-bold text-primary mb-1">Localização na Prateleira</label>
                        <input
                          type="text"
                          value={formLocalizacaoPrateleira}
                          onChange={(e) => setFormLocalizacaoPrateleira(e.target.value)}
                          placeholder="Ex: Estante A, Fila 2"
                          className="w-full p-2 border border-border-subtle rounded-lg focus:border-secondary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-primary mb-1">Estado do Livro Físico</label>
                        <select
                          value={formEstadoFisico}
                          onChange={(e) => setFormEstadoFisico(e.target.value as any)}
                          className="w-full p-2 border border-border-subtle rounded-lg focus:border-secondary focus:outline-none font-semibold"
                        >
                          <option value="Disponível">Disponível</option>
                          <option value="Indisponível">Indisponível</option>
                          <option value="Empréstimo">Empréstimo</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* E-book Disponível */}
                <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-border-subtle">
                  <label className="flex items-center gap-2 font-bold text-primary cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formIsEbookDisponivel}
                      onChange={(e) => setFormIsEbookDisponivel(e.target.checked)}
                      className="w-4 h-4 text-secondary rounded focus:ring-secondary cursor-pointer"
                    />
                    <span>E-book Disponível</span>
                  </label>

                  {formIsEbookDisponivel && (
                    <div className="space-y-3 pt-2 border-t border-border-subtle">
                      <div>
                        <label className="block font-bold text-primary mb-1">Carregar Arquivo (PDF)</label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormEbookUrl('https://vendaia.edu.ao/livros/exemplo.pdf');
                            onShowToast('Ficheiro PDF anexado com sucesso.');
                          }}
                          className="bg-surface-white border border-border-subtle hover:bg-surface-container text-primary font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <FileText className="w-4 h-4 text-secondary" /> Selecionar Arquivo
                        </button>
                      </div>

                      <div className="relative text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-subtle"></div></div>
                        <span className="relative bg-surface-container-low px-2 text-[10px] font-bold text-outline uppercase">OU</span>
                      </div>

                      <div>
                        <label className="block font-bold text-primary mb-1">URL do E-book Externo</label>
                        <input
                          type="url"
                          value={formEbookUrl}
                          onChange={(e) => setFormEbookUrl(e.target.value)}
                          placeholder="https://exemplo.com/livro.pdf"
                          className="w-full p-2 border border-border-subtle rounded-lg font-mono text-[11px] focus:border-secondary focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block font-bold text-primary mb-1">Descrição</label>
                <textarea
                  rows={4}
                  value={formDescricao}
                  onChange={(e) => setFormDescricao(e.target.value)}
                  placeholder="Escreva a sinopse ou resumo pedagógico do livro..."
                  className="w-full p-2.5 border border-border-subtle rounded-xl focus:border-secondary focus:outline-none"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-surface-container-low border-t border-border-subtle flex justify-end gap-2 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => setIsEditorDrawerOpen(false)}
                className="bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-xs font-bold text-primary hover:bg-surface-container cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary text-surface-white hover:bg-primary/90 px-5 py-2 rounded-lg text-xs font-bold cursor-pointer shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" /> Guardar Livro
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
