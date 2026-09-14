import React, { useMemo, useState } from 'react';
import { ActiveView } from '../types';
import { Globe, FileText, Newspaper, Palette, Settings, Plus, Search, Pencil as Edit3, Trash2, Eye, Image as ImageIcon, LayoutDashboard, Building2, GraduationCap, Phone, MonitorSmartphone, Save, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Clock, FolderOpen, X, GripVertical, CornerDownRight, List, GitFork, ChevronDown, ChevronRight } from 'lucide-react';

interface CmsViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

type Tab = 'paginas' | 'noticias' | 'apariencia' | 'configuracao';

interface PageItem {
  id: string;
  titulo: string;
  slug: string;
  seccao: string;
  estado: 'Publicado' | 'Rascunho' | 'Agendado';
  atualizado: string;
  autor: string;
}

interface NewsItem {
  id: string;
  titulo: string;
  categoria: string;
  data: string;
  estado: 'Publicado' | 'Rascunho' | 'Agendado';
  autor: string;
  destacada: boolean;
}

const initialPages: PageItem[] = [
  { id: 'p1', titulo: 'Página Inicial (Home)', slug: '/', seccao: 'Home', estado: 'Publicado', atualizado: '08 Ago 2026', autor: 'João Pinto' },
  { id: 'p2', titulo: 'Apresentação da Instituição', slug: '/instituicao/apresentacao', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '05 Ago 2026', autor: 'Sara Silva' },
  { id: 'p3', titulo: 'Estatutos da Vendaia School®', slug: '/instituicao/estatutos', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '03 Ago 2026', autor: 'Carlos Mendes' },
  { id: 'p4', titulo: 'Factos e Números', slug: '/instituicao/factos-numeros', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '01 Ago 2026', autor: 'Sara Silva' },
  { id: 'p5', titulo: 'História da Instituição', slug: '/instituicao/historia', seccao: 'A Instituição › Institucional', estado: 'Rascunho', atualizado: '28 Jul 2026', autor: 'João Pinto' },
  { id: 'p6', titulo: 'Informação Oficial', slug: '/instituicao/informacao-oficial', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '25 Jul 2026', autor: 'Carlos Mendes' },
  { id: 'p7', titulo: 'Organização e Estrutura', slug: '/instituicao/organizacao', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '22 Jul 2026', autor: 'Sara Silva' },
  { id: 'p8', titulo: 'Investigação & Desenvolvimento (I&D)', slug: '/instituicao/id', seccao: 'A Instituição › Institucional', estado: 'Rascunho', atualizado: '20 Jul 2026', autor: 'João Pinto' },
  { id: 'p9', titulo: 'Localização e Contactos', slug: '/instituicao/localizacao', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '18 Jul 2026', autor: 'Sara Silva' },
  { id: 'p10', titulo: 'Departamento de Engenharia Civil', slug: '/departamentos/engenharia-civil', seccao: 'A Instituição › Departamentos', estado: 'Publicado', atualizado: '15 Jul 2026', autor: 'Carlos Mendes' },
  { id: 'p11', titulo: 'Departamento de Engenharia Electrotécnica', slug: '/departamentos/engenharia-electrotecnica', seccao: 'A Instituição › Departamentos', estado: 'Publicado', atualizado: '12 Jul 2026', autor: 'Carlos Mendes' },
  { id: 'p12', titulo: 'Serviços — Biblioteca', slug: '/servicos/biblioteca', seccao: 'A Instituição › Serviços', estado: 'Publicado', atualizado: '10 Jul 2026', autor: 'Sara Silva' },
  { id: 'p13', titulo: 'Serviços Académicos', slug: '/servicos/academicos', seccao: 'A Instituição › Serviços', estado: 'Publicado', atualizado: '08 Jul 2026', autor: 'Sara Silva' },
  { id: 'p14', titulo: 'Oferta Formativa', slug: '/estudar-aqui/oferta-formativa', seccao: 'Estudar Aqui', estado: 'Publicado', atualizado: '05 Jul 2026', autor: 'João Pinto' },
  { id: 'p15', titulo: 'Formas de Ingresso', slug: '/estudar-aqui/formas-de-ingresso', seccao: 'Estudar Aqui', estado: 'Publicado', atualizado: '03 Jul 2026', autor: 'João Pinto' },
  { id: 'p16', titulo: 'Calendário Escolar', slug: '/alunos/calendario-escolar', seccao: 'Alunos › Alunos da Instituição', estado: 'Publicado', atualizado: '01 Jul 2026', autor: 'Sara Silva' },
  { id: 'p17', titulo: 'Horários de Aulas', slug: '/alunos/horarios', seccao: 'Alunos › Alunos da Instituição', estado: 'Publicado', atualizado: '28 Jun 2026', autor: 'Sara Silva' },
  { id: 'p18', titulo: 'Mapa de Exames', slug: '/alunos/mapa-de-exames', seccao: 'Alunos › Alunos da Instituição', estado: 'Agendado', atualizado: '25 Jun 2026', autor: 'Carlos Mendes' },
  { id: 'p19', titulo: 'Contactos da Instituição', slug: '/contactos', seccao: 'Contactos', estado: 'Publicado', atualizado: '20 Jun 2026', autor: 'Sara Silva' },
  { id: 'p20', titulo: 'Secretaria Online', slug: '/secretaria-online', seccao: 'Secretaria Online', estado: 'Publicado', atualizado: '15 Jun 2026', autor: 'João Pinto' },
];

const initialNews: NewsItem[] = [
  { id: 'n1', titulo: 'Abertura das Inscrições para o Ano Letivo 2026/2027', categoria: 'Anúncios', data: '10 Ago 2026', estado: 'Publicado', autor: 'Sara Silva', destacada: true },
  { id: 'n2', titulo: 'Resultados do Concurso de Acesso ao Ensino Superior', categoria: 'Académico', data: '08 Ago 2026', estado: 'Publicado', autor: 'Carlos Mendes', destacada: false },
  { id: 'n3', titulo: 'Feira de Ciências e Tecnologia — Edição 2026', categoria: 'Eventos', data: '05 Ago 2026', estado: 'Publicado', autor: 'João Pinto', destacada: true },
  { id: 'n4', titulo: 'Protocolo de Parceria com Universidade de Coimbra', categoria: 'Institucional', data: '02 Ago 2026', estado: 'Publicado', autor: 'Carlos Mendes', destacada: false },
  { id: 'n5', titulo: 'Workshop de Pedagogia Digital para Docentes', categoria: 'Formação', data: '28 Jul 2026', estado: 'Rascunho', autor: 'Sara Silva', destacada: false },
  { id: 'n6', titulo: 'Campeonato Inter-Turmas de Atletismo', categoria: 'Desporto', data: '25 Jul 2026', estado: 'Agendado', autor: 'João Pinto', destacada: false },
  { id: 'n7', titulo: 'Entrega de Diplomas — Turma 2025/2026', categoria: 'Académico', data: '20 Jul 2026', estado: 'Publicado', autor: 'Carlos Mendes', destacada: true },
];

const seccoes = ['Todas', 'Home', 'A Instituição › Institucional', 'A Instituição › Departamentos', 'A Instituição › Serviços', 'Estudar Aqui', 'Alunos › Alunos da Instituição', 'Contactos', 'Secretaria Online'];

const statusChip = (estado: string): string => {
  const map: Record<string, string> = {
    'Publicado': 'bg-success/15 text-success',
    'Rascunho': 'bg-warning/15 text-warning',
    'Agendado': 'bg-info/15 text-info',
  };
  return map[estado] || 'bg-surface-container text-outline';
};

const seccaoIcon = (seccao: string): React.ReactNode => {
  if (seccao.startsWith('Home')) return <LayoutDashboard className="w-4 h-4" />;
  if (seccao.startsWith('A Instituição')) return <Building2 className="w-4 h-4" />;
  if (seccao.startsWith('Estudar Aqui')) return <GraduationCap className="w-4 h-4" />;
  if (seccao.startsWith('Alunos')) return <FileText className="w-4 h-4" />;
  if (seccao.startsWith('Contactos')) return <Phone className="w-4 h-4" />;
  if (seccao.startsWith('Secretaria')) return <MonitorSmartphone className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
};

export const CmsView: React.FC<CmsViewProps> = ({ onShowToast }) => {
  const [tab, setTab] = useState<Tab>('paginas');
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [search, setSearch] = useState('');
  const [filterSeccao, setFilterSeccao] = useState('Todas');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSectionCollapse = (id: string) => {
    setCollapsedSections((prev) => {
      const currentIsCollapsed = prev[id] !== false;
      return {
        ...prev,
        [id]: !currentIsCollapsed,
      };
    });
  };

  const togglePageStatus = (id: string) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextEstado: PageItem['estado'] = p.estado === 'Publicado' ? 'Rascunho' : 'Publicado';
          onShowToast(`Estado da página "${p.titulo}" alterado para ${nextEstado}.`);
          return { ...p, estado: nextEstado };
        }
        return p;
      })
    );
  };

  const [pageModal, setPageModal] = useState(false);
  const [pagePanelTab, setPagePanelTab] = useState<'geral' | 'conteudo' | 'seo'>('geral');
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [confirmDeletePage, setConfirmDeletePage] = useState<PageItem | null>(null);
  const [newsModal, setNewsModal] = useState(false);
  const [newsPanelTab, setNewsPanelTab] = useState<'geral' | 'conteudo'>('geral');
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [confirmDeleteNews, setConfirmDeleteNews] = useState<NewsItem | null>(null);

  const [pageForm, setPageForm] = useState({ titulo: '', slug: '', seccao: 'Home', estado: 'Rascunho' as PageItem['estado'], resumo: '', metaTitle: '', metaDesc: '' });
  const [newsForm, setNewsForm] = useState({ titulo: '', categoria: 'Anúncios', estado: 'Rascunho' as NewsItem['estado'], destacada: false, resumo: '', conteudo: '' });

  const publishedCount = pages.filter((p) => p.estado === 'Publicado').length;
  const draftCount = pages.filter((p) => p.estado === 'Rascunho').length;
  const scheduledCount = pages.filter((p) => p.estado === 'Agendado').length;
  const newsPublishedCount = news.filter((n) => n.estado === 'Publicado').length;
  const featuredCount = news.filter((n) => n.destacada).length;

  const openCreatePage = () => {
    setEditingPage(null);
    setPageForm({ titulo: '', slug: '', seccao: 'Home', estado: 'Rascunho', resumo: '', metaTitle: '', metaDesc: '' });
    setPagePanelTab('geral');
    setPageModal(true);
  };

  const openEditPage = (page: PageItem) => {
    setEditingPage(page);
    setPageForm({ titulo: page.titulo, slug: page.slug, seccao: page.seccao, estado: page.estado, resumo: '', metaTitle: page.titulo, metaDesc: `Página institucional: ${page.titulo}` });
    setPagePanelTab('geral');
    setPageModal(true);
  };

  const savePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      setPages(pages.map((p) => (p.id === editingPage.id ? { ...p, ...pageForm } : p)));
      onShowToast(`Página "${pageForm.titulo}" atualizada com sucesso!`);
    } else {
      const newPage: PageItem = {
        id: `p${Date.now()}`,
        titulo: pageForm.titulo,
        slug: pageForm.slug || `/${pageForm.titulo.toLowerCase().replace(/\s+/g, '-')}`,
        seccao: pageForm.seccao,
        estado: pageForm.estado,
        atualizado: '10 Ago 2026',
        autor: 'Sara Silva',
      };
      setPages([newPage, ...pages]);
      onShowToast(`Página "${pageForm.titulo}" criada com sucesso!`);
    }
    setPageModal(false);
  };

  const removePage = () => {
    if (!confirmDeletePage) return;
    setPages(pages.filter((p) => p.id !== confirmDeletePage.id));
    onShowToast(`Página "${confirmDeletePage.titulo}" removida.`);
    setConfirmDeletePage(null);
  };

  const openCreateNews = () => {
    setEditingNews(null);
    setNewsForm({ titulo: '', categoria: 'Anúncios', estado: 'Rascunho', destacada: false, resumo: '', conteudo: '' });
    setNewsPanelTab('geral');
    setNewsModal(true);
  };

  const openEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setNewsForm({ titulo: item.titulo, categoria: item.categoria, estado: item.estado, destacada: item.destacada, resumo: '', conteudo: '' });
    setNewsPanelTab('geral');
    setNewsModal(true);
  };

  const saveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNews) {
      setNews(news.map((n) => (n.id === editingNews.id ? { ...n, ...newsForm } : n)));
      onShowToast(`Notícia "${newsForm.titulo}" atualizada com sucesso!`);
    } else {
      const newNews: NewsItem = {
        id: `n${Date.now()}`,
        titulo: newsForm.titulo,
        categoria: newsForm.categoria,
        data: '10 Ago 2026',
        estado: newsForm.estado,
        autor: 'Sara Silva',
        destacada: newsForm.destacada,
      };
      setNews([newNews, ...news]);
      onShowToast(`Notícia "${newsForm.titulo}" criada com sucesso!`);
    }
    setNewsModal(false);
  };

  const removeNews = () => {
    if (!confirmDeleteNews) return;
    setNews(news.filter((n) => n.id !== confirmDeleteNews.id));
    onShowToast(`Notícia "${confirmDeleteNews.titulo}" removida.`);
    setConfirmDeleteNews(null);
  };

  const toggleFeatured = (id: string) => {
    setNews(news.map((n) => (n.id === id ? { ...n, destacada: !n.destacada } : n)));
  };

  const filteredPages = useMemo(() => pages.filter((p) => {
    const matchSearch = `${p.titulo} ${p.slug} ${p.seccao} ${p.autor}`.toLowerCase().includes(search.toLowerCase());
    const matchSeccao = filterSeccao === 'Todas' || p.seccao === filterSeccao;
    const matchEstado = filterEstado === 'Todos' || p.estado === filterEstado;
    return matchSearch && matchSeccao && matchEstado;
  }), [pages, search, filterSeccao, filterEstado]);

  const filteredNews = useMemo(() => news.filter((n) => {
    const matchSearch = `${n.titulo} ${n.categoria} ${n.autor}`.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === 'Todos' || n.estado === filterEstado;
    return matchSearch && matchEstado;
  }), [news, search, filterEstado]);

  const treeGroups = useMemo(() => {
    const groups = [
      { id: 'g_home', title: 'Início (Home)', slug: '/', mainPageId: 'p1', filter: (p: PageItem) => p.id === 'p1', children: [] as PageItem[] },
      {
        id: 'g_inst',
        title: 'A Instituição',
        slug: '/instituicao',
        mainPageId: '',
        filter: (p: PageItem) => p.seccao.startsWith('A Instituição'),
        children: [] as PageItem[]
      },
      {
        id: 'g_estudar',
        title: 'Estudar Aqui',
        slug: '/estudar-aqui',
        mainPageId: '',
        filter: (p: PageItem) => p.seccao === 'Estudar Aqui',
        children: [] as PageItem[]
      },
      {
        id: 'g_alunos',
        title: 'Alunos',
        slug: '/alunos',
        mainPageId: '',
        filter: (p: PageItem) => p.seccao.startsWith('Alunos'),
        children: [] as PageItem[]
      },
      {
        id: 'g_contactos',
        title: 'Contactos',
        slug: '/contactos',
        mainPageId: 'p19',
        filter: (p: PageItem) => p.id === 'p19',
        children: [] as PageItem[]
      },
      {
        id: 'g_secretaria',
        title: 'Secretaria Online',
        slug: '/secretaria-online',
        mainPageId: 'p20',
        filter: (p: PageItem) => p.id === 'p20',
        children: [] as PageItem[]
      },
    ];

    return groups.map((g) => {
      const items = pages.filter(g.filter);
      return {
        ...g,
        children: items,
        allPublished: items.length > 0 && items.every((i) => i.estado === 'Publicado'),
      };
    });
  }, [pages]);

  const treeGroupsFiltered = useMemo(() => {
    if (!search.trim()) return treeGroups;
    const query = search.toLowerCase();
    return treeGroups
      .map((g) => {
        const titleMatch = g.title.toLowerCase().includes(query) || g.slug.toLowerCase().includes(query);
        const filteredChildren = g.children.filter(
          (c) => c.titulo.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query)
        );
        if (titleMatch || filteredChildren.length > 0) {
          return {
            ...g,
            children: titleMatch ? g.children : filteredChildren,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof treeGroups;
  }, [treeGroups, search]);

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* Banner de Título */}
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary stroke-[1.75]" />
          CMS — Gestão de Conteúdo do Website
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => onShowToast('Pré-visualização do website aberta numa nova janela.')} className="bg-surface-white border border-border-subtle hover:bg-surface-container-low text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Eye className="w-4 h-4 stroke-[1.75]" />Pré-visualizar
          </button>
          {tab === 'paginas' && (
            <button onClick={openCreatePage} className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
              <Plus className="w-4 h-4 stroke-[1.75]" />Nova Página
            </button>
          )}
          {tab === 'noticias' && (
            <button onClick={openCreateNews} className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
              <Plus className="w-4 h-4 stroke-[1.75]" />Nova Notícia
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">Páginas Publicadas</span>
            <span className="text-2xl font-bold leading-none text-primary">{publishedCount}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <FileText className="w-4 h-4" />Ativas
            </span>
          </div>
        </div>

        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">Rascunhos</span>
            <span className="text-2xl font-bold leading-none text-primary">{draftCount}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-warning bg-warning/10 text-[10px] font-bold">
              <Edit3 className="w-4 h-4" />Edição
            </span>
          </div>
        </div>

        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">Notícias Publicadas</span>
            <span className="text-2xl font-bold leading-none text-primary">{newsPublishedCount}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-info bg-info/10 text-[10px] font-bold">
              <Newspaper className="w-4 h-4" />Online
            </span>
          </div>
        </div>

        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">Conteúdo Agendado</span>
            <span className="text-2xl font-bold leading-none text-primary">{scheduledCount}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">
              <Clock className="w-4 h-4" />Programado
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        {([
          { key: 'paginas', label: 'Páginas do Site', icon: <FileText className="w-4 h-4" /> },
          { key: 'noticias', label: 'Notícias & Conteúdo', icon: <Newspaper className="w-4 h-4" /> },
          { key: 'apariencia', label: 'Aparência do Website', icon: <Palette className="w-4 h-4" /> },
          { key: 'configuracao', label: 'Configurar Portal', icon: <Settings className="w-4 h-4" /> },
        ] as { key: Tab; label: string; icon: React.ReactNode }[]).map((item) => (
          <button
            key={item.key}
            onClick={() => { setTab(item.key); setSearch(''); setFilterSeccao('Todas'); setFilterEstado('Todos'); }}
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

      {/* Tab: Páginas do Site */}
      {tab === 'paginas' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
          {/* Barra Superior: Pesquisa de Páginas e Controlos do Acordeão */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5 bg-surface-container-low border border-border-subtle px-3 py-1.5 rounded-lg">
                <GitFork className="w-3.5 h-3.5 text-primary" /> Estrutura Hierárquica do Site
              </span>
              <button
                type="button"
                onClick={() => {
                  const allExpanded: Record<string, boolean> = {};
                  treeGroups.forEach((g) => { allExpanded[g.id] = false; });
                  setCollapsedSections(allExpanded);
                }}
                className="text-[11px] font-bold text-outline hover:text-primary px-2.5 py-1 rounded-md hover:bg-surface-container transition-colors cursor-pointer"
              >
                Expandir Tudo
              </button>
              <span className="text-border-subtle">•</span>
              <button
                type="button"
                onClick={() => setCollapsedSections({})}
                className="text-[11px] font-bold text-outline hover:text-primary px-2.5 py-1 rounded-md hover:bg-surface-container transition-colors cursor-pointer"
              >
                Recolher Tudo
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar páginas..."
                className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          {/* Renderização Exclusiva: Estrutura de Árvore com Acordeão (Conforme Solicitado pelo Utilizador) */}
          <div className="bg-surface-container-low/30 border border-border-subtle rounded-xl p-4 space-y-3">
            {treeGroupsFiltered.length ? treeGroupsFiltered.map((group) => {
              const isCollapsed = search.trim() ? false : (collapsedSections[group.id] !== false);
              const hasChildren = group.children.length > 0;

              return (
                <div key={group.id} className="bg-surface-white border border-border-subtle rounded-xl p-3.5 shadow-2xs transition-all hover:border-primary/30">
                  {/* Item Raiz do Menu (Cabeçalho do Acordeão) */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {hasChildren ? (
                        <button
                          onClick={() => toggleSectionCollapse(group.id)}
                          className="p-1 text-outline hover:text-primary hover:bg-surface-container rounded-md transition-colors cursor-pointer"
                          title={isCollapsed ? 'Expandir secção' : 'Recolher secção'}
                        >
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-primary stroke-[2.2]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-primary stroke-[2.2]" />
                          )}
                        </button>
                      ) : (
                        <span className="w-6" />
                      )}
                      <GripVertical className="w-4 h-4 text-outline/40 cursor-grab hover:text-primary shrink-0" />
                      <span
                        onClick={() => hasChildren && toggleSectionCollapse(group.id)}
                        className="font-bold text-sm text-primary cursor-pointer hover:underline"
                      >
                        {group.title}
                      </span>
                      <span className="bg-surface-container text-outline font-mono px-2 py-0.5 rounded text-[11px] font-semibold">{group.slug}</span>
                      {hasChildren && isCollapsed && (
                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full ml-1">
                          {group.children.length} sub-{group.children.length === 1 ? 'página' : 'páginas'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const targetState = group.allPublished ? 'Rascunho' : 'Publicado';
                          setPages((prev) => prev.map((p) => group.filter(p) ? { ...p, estado: targetState } : p));
                          onShowToast(`Secção "${group.title}" alterada para ${targetState === 'Publicado' ? 'Visível' : 'Oculta'}.`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                          group.allPublished
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${group.allPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {group.allPublished ? 'Visível' : 'Rascunho'}
                      </button>
                      <button
                        onClick={() => {
                          setPages((prev) => prev.filter((p) => !group.filter(p)));
                          onShowToast(`Secção "${group.title}" removida.`);
                        }}
                        className="p-1.5 text-outline/60 hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                        title="Remover Secção"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sub-páginas conectadas (Recolhível via Acordeão) */}
                  {hasChildren && !isCollapsed && (
                    <div className="mt-3 ml-4 pl-4 border-l-2 border-border-subtle/80 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      {group.children.map((child) => (
                        <div key={child.id} className="bg-surface-container-low/40 border border-border-subtle/60 hover:border-primary/30 rounded-lg p-2.5 flex items-center justify-between gap-3 transition-all">
                          <div className="flex items-center gap-2 min-w-0">
                            <CornerDownRight className="w-3.5 h-3.5 text-primary stroke-[2] shrink-0" />
                            <span className="font-bold text-xs text-primary truncate">{child.titulo}</span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-on-surface-variant font-mono text-[11px]">{child.slug}</span>
                            <span className={`${statusChip(child.estado)} px-2 py-0.5 rounded-full text-[10px] font-bold`}>{child.estado}</span>
                            <button onClick={() => openEditPage(child)} className="p-1 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer" title="Editar"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setConfirmDeletePage(child)} className="p-1 text-outline/60 hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer" title="Remover"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="text-center py-8 text-on-surface-variant font-medium">Nenhuma página ou secção encontrada.</div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Notícias & Conteúdo */}
      {tab === 'noticias' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-primary py-1 cursor-pointer">
                <option value="Todos">Estado: Todos</option>
                <option value="Publicado">Publicado</option>
                <option value="Rascunho">Rascunho</option>
                <option value="Agendado">Agendado</option>
              </select>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar notícias..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium" />
            </div>
          </div>

          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left">Notícia</th>
                  <th className="px-3.5 py-3 text-left">Categoria</th>
                  <th className="px-3.5 py-3 text-left">Data</th>
                  <th className="px-3.5 py-3 text-center">Estado</th>
                  <th className="px-3.5 py-3 text-center">Destaque</th>
                  <th className="px-3.5 py-3 text-left">Autor</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredNews.length ? filteredNews.map((n) => (
                  <tr key={n.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center"><Newspaper className="w-4 h-4" /></div>
                        <span className="font-bold text-primary">{n.titulo}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{n.categoria}</span></td>
                    <td className="px-3.5 py-3 text-outline">{n.data}</td>
                    <td className="px-3.5 py-3 text-center"><span className={`${statusChip(n.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{n.estado}</span></td>
                    <td className="px-3.5 py-3 text-center">
                      <button onClick={() => toggleFeatured(n.id)} className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${n.destacada ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline'}`}>
                        {n.destacada ? '★ Destacada' : '☆ Não'}
                      </button>
                    </td>
                    <td className="px-3.5 py-3 text-on-surface-variant">{n.autor}</td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => onShowToast(`Pré-visualização de "${n.titulo}" aberta.`)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer" title="Pré-visualizar"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEditNews(n)} className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer" title="Editar"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDeleteNews(n)} className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer" title="Remover"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant font-medium">Nenhuma notícia encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Aparência do Website */}
      {tab === 'apariencia' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Editar a Aparência do Website</h2>
            <p className="text-xs text-on-surface-variant">Personalize o tema, cores, tipografia e layout do portal institucional.</p>
          </div>

          {/* Tema Ativo */}
          <div className="mb-6">
            <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Tema Ativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 't1', nome: 'Navy Corporate (Padrão)', desc: 'Tema institucional navy + azul', ativo: true },
                { id: 't2', nome: 'Light Minimal', desc: 'Tema claro minimalista com acentos azuis', ativo: false },
                { id: 't3', nome: 'Dark Academic', desc: 'Tema escuro para modo noturno', ativo: false },
              ].map((t) => (
                <div key={t.id} className={`border rounded-lg p-4 cursor-pointer transition-all ${t.ativo ? 'border-primary bg-primary/5 shadow-sm' : 'border-border-subtle hover:border-outline-variant hover:shadow-sm'}`} onClick={() => onShowToast(`Tema "${t.nome}" selecionado.`)}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center"><Palette className="w-5 h-5" /></div>
                    {t.ativo && <span className="bg-success/15 text-success px-2 py-0.5 rounded-full text-[10px] font-bold">Ativo</span>}
                  </div>
                  <h4 className="text-sm font-bold text-primary">{t.nome}</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Logótipo e Branding */}
          <div className="mb-6">
            <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Logótipo e Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border-subtle rounded-lg p-4">
                <span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-2">Logótipo Principal</span>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded bg-primary text-surface-white flex items-center justify-center font-bold text-lg">VS</div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => onShowToast('Seletor de ficheiro de logótipo aberto.')} className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"><ImageIcon className="w-3.5 h-3.5" />Carregar Logótipo</button>
                    <span className="text-[10px] text-outline">Recomendado: 512x512px, PNG transparente</span>
                  </div>
                </div>
              </div>
              <div className="border border-border-subtle rounded-lg p-4">
                <span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-2">Favicon</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary text-surface-white flex items-center justify-center font-bold text-xs">VS</div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => onShowToast('Seletor de favicon aberto.')} className="border border-border-subtle px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-surface-container transition-all"><ImageIcon className="w-3.5 h-3.5" />Carregar Favicon</button>
                    <span className="text-[10px] text-outline">Recomendado: 32x32px, ICO ou PNG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paleta de Cores */}
          <div className="mb-6">
            <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Paleta de Cores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Cor Primária', color: '#041939' },
                { label: 'Cor Secundária', color: '#041939' },
                { label: 'Fundo', color: '#f8f9fa' },
                { label: 'Texto', color: '#191c1d' },
              ].map((c) => (
                <div key={c.label} className="border border-border-subtle rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded border border-border-subtle" style={{ backgroundColor: c.color }} />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline tracking-wider block">{c.label}</span>
                    <span className="text-xs font-mono font-bold text-primary">{c.color}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tipografia */}
          <div className="mb-6">
            <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Tipografia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Fonte dos Títulos</label>
                <select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none bg-surface-white">
                  <option>Hanken Grotesk (Padrão)</option>
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                </select>
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Fonte do Corpo de Texto</label>
                <select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none bg-surface-white">
                  <option>Hanken Grotesk (Padrão)</option>
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                </select>
              </div>
            </div>
          </div>

          {/* Opções de Layout */}
          <div className="mb-4">
            <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Opções de Layout</h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors">
                <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary" />
                <span className="font-medium">Exibir barra superior com contactos e redes sociais</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors">
                <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary" />
                <span className="font-medium">Mostrar banner de notícias em destaque na home</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors">
                <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                <span className="font-medium">Ativar modo escuro automático (baseado no sistema)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors">
                <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary" />
                <span className="font-medium">Exibir rodapé com links institucionais</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border-subtle">
            <button onClick={() => onShowToast('Aparência do website guardada com sucesso!')} className="bg-primary text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-all shadow-sm">
              <Save className="w-4 h-4" />Guardar Aparência
            </button>
          </div>
        </div>
      )}

      {/* Tab: Configurar Portal */}
      {tab === 'configuracao' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Configurar o Portal</h2>
            <p className="text-xs text-on-surface-variant">Definições gerais do portal institucional, SEO, domínio e integrações.</p>
          </div>

          {/* Definições Gerais */}
          <div className="mb-6">
            <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Definições Gerais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Nome do Portal</label>
                <input type="text" defaultValue="Vendaia School® — Portal Institucional" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Domínio</label>
                <input type="text" defaultValue="www.vendaia.edu" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Email de Contacto Geral</label>
                <input type="email" defaultValue="geral@vendaia.edu" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Telefone de Contacto</label>
                <input type="text" defaultValue="+244 923 000 000" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none" />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="mb-6">
            <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Configuração SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Meta Título (Title Tag)</label>
                <input type="text" defaultValue="Vendaia School® — Gestão Académica de Excelência" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Meta Descrição</label>
                <textarea rows={2} defaultValue="Portal institucional da Vendaia School®. Informações sobre matrículas, oferta formativa, serviços académicos e notícias da instituição." className="w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Palavras-chave (separadas por vírgula)</label>
                <input type="text" defaultValue="escola, gestão académica, matrículas, ensino secundário, Vendaia School" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Estado do Portal */}
          <div className="mb-6">
            <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Estado do Portal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border border-success/20 bg-success/5 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Portal Online</span>
                  <span className="text-sm font-bold text-success">Ativo</span>
                </div>
              </div>
              <div className="border border-border-subtle rounded-lg p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-info" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Última Atualização</span>
                  <span className="text-sm font-bold text-primary">08 Ago 2026</span>
                </div>
              </div>
              <div className="border border-border-subtle rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-surface-container-low/30 transition-colors" onClick={() => onShowToast('Modo de manutenção ativado. O portal está temporariamente indisponível.')}>
                <AlertTriangle className="w-5 h-5 text-warning" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Modo Manutenção</span>
                  <span className="text-sm font-bold text-warning">Ativar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Integrações */}
          <div className="mb-4">
            <h3 className="font-bold text-primary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Integrações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { nome: 'Google Analytics', desc: 'Tracking de visitantes e métricas', estado: 'Conectado' },
                { nome: 'Google Search Console', desc: 'Indexação e SEO', estado: 'Conectado' },
                { nome: 'Facebook Pixel', desc: 'Tracking de campanhas', estado: 'Desconectado' },
                { nome: 'Newsletter (Mailchimp)', desc: 'Envio de boletins informativos', estado: 'Conectado' },
              ].map((int) => (
                <div key={int.nome} className="border border-border-subtle rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-primary text-xs">{int.nome}</p>
                    <p className="text-[11px] text-on-surface-variant">{int.desc}</p>
                  </div>
                  <span className={`${int.estado === 'Conectado' ? 'bg-success/15 text-success' : 'bg-surface-container text-outline'} px-2 py-0.5 rounded-full text-[10px] font-bold`}>{int.estado}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border-subtle">
            <button onClick={() => onShowToast('Configurações do portal guardadas com sucesso!')} className="bg-primary text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-all shadow-sm">
              <Save className="w-4 h-4" />Guardar Configurações
            </button>
          </div>
        </div>
      )}

      {/* Painel Lateral (Slide-Over Drawer): Criar/Editar Página */}
      {pageModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-xl md:max-w-2xl bg-surface-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header do Painel (Dark Navy Header) */}
            <div className="bg-[#041939] text-surface-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary stroke-[1.75]" />
                <div>
                  <h2 className="text-base font-bold tracking-wide">
                    {editingPage ? `Editar Página: ${editingPage.titulo}` : 'Nova Página do Site'}
                  </h2>
                  <p className="text-[11px] text-white/70">Painel Completo de Gestão de Página e SEO</p>
                </div>
              </div>
              <button
                onClick={() => setPageModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Abas de Navegação Internas do Painel */}
            <div className="bg-surface-container-low border-b border-border-subtle px-6 flex items-center gap-2 shrink-0">
              {[
                { key: 'geral', label: 'Geral & Estrutura' },
                { key: 'conteudo', label: 'Conteúdo & Imagens' },
                { key: 'seo', label: 'SEO & Meta Tags' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setPagePanelTab(t.key as any)}
                  className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    pagePanelTab === t.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-outline hover:text-primary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Conteúdo do Formulário (Scrollable) */}
            <form onSubmit={savePage} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {pagePanelTab === 'geral' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-outline font-bold mb-1">Título da Página <span className="text-error">*</span></label>
                    <input
                      type="text"
                      required
                      value={pageForm.titulo}
                      onChange={(e) => setPageForm({ ...pageForm, titulo: e.target.value })}
                      placeholder="Ex: Factos e Números da Instituição"
                      className="w-full border border-border-subtle rounded-lg p-2.5 text-xs font-medium focus:border-primary focus:outline-none bg-surface-white"
                    />
                  </div>

                  <div>
                    <label className="block text-outline font-bold mb-1">Slug (URL Amigável)</label>
                    <input
                      type="text"
                      value={pageForm.slug}
                      onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                      placeholder="/instituicao/factos-numeros"
                      className="w-full border border-border-subtle rounded-lg p-2.5 text-xs font-mono focus:border-primary focus:outline-none bg-surface-white"
                    />
                    <span className="text-[10px] text-outline block mt-1">Deixe em branco para auto-gerar a partir do título.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-outline font-bold mb-1">Secção de Enquadramento</label>
                      <select
                        value={pageForm.seccao}
                        onChange={(e) => setPageForm({ ...pageForm, seccao: e.target.value })}
                        className="w-full border border-border-subtle rounded-lg p-2.5 text-xs font-medium focus:border-primary focus:outline-none bg-surface-white"
                      >
                        <option>Home</option>
                        <option>A Instituição › Institucional</option>
                        <option>A Instituição › Departamentos</option>
                        <option>A Instituição › Serviços</option>
                        <option>Estudar Aqui</option>
                        <option>Alunos › Alunos da Instituição</option>
                        <option>Contactos</option>
                        <option>Secretaria Online</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-outline font-bold mb-1">Estado de Publicação</label>
                      <select
                        value={pageForm.estado}
                        onChange={(e) => setPageForm({ ...pageForm, estado: e.target.value as PageItem['estado'] })}
                        className="w-full border border-border-subtle rounded-lg p-2.5 text-xs font-bold focus:border-primary focus:outline-none bg-surface-white"
                      >
                        <option value="Rascunho">Rascunho (Privado)</option>
                        <option value="Publicado">Publicado (Visível)</option>
                        <option value="Agendado">Agendado</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {pagePanelTab === 'conteudo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-outline font-bold mb-1">Resumo / Subtítulo da Página</label>
                    <textarea
                      rows={3}
                      value={pageForm.resumo}
                      onChange={(e) => setPageForm({ ...pageForm, resumo: e.target.value })}
                      placeholder="Breve introdução que surge no topo da página..."
                      className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-outline font-bold mb-1">Editor de Bloco de Conteúdo</label>
                    <div className="border border-border-subtle rounded-lg overflow-hidden bg-surface-white">
                      <div className="bg-surface-container-low p-2 border-b border-border-subtle flex items-center gap-2 text-outline">
                        <button type="button" className="p-1 hover:bg-surface-container rounded font-bold">B</button>
                        <button type="button" className="p-1 hover:bg-surface-container rounded italic">I</button>
                        <button type="button" className="p-1 hover:bg-surface-container rounded underline">U</button>
                        <span className="h-4 border-r border-border-subtle mx-1" />
                        <button type="button" className="p-1 hover:bg-surface-container rounded text-[11px] font-mono">Link</button>
                        <button type="button" className="p-1 hover:bg-surface-container rounded text-[11px] font-mono">H2</button>
                        <button type="button" className="p-1 hover:bg-surface-container rounded text-[11px] font-mono">H3</button>
                      </div>
                      <textarea
                        rows={8}
                        placeholder="Escreva ou cole aqui o conteúdo formatado em HTML ou Markdown..."
                        className="w-full p-3 text-xs focus:outline-none resize-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-outline font-bold mb-1">Imagem de Destaque / Banner</label>
                    <div className="border-2 border-dashed border-border-subtle rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-surface-container-low/20">
                      <ImageIcon className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="font-bold text-primary text-xs">Carregar Imagem de Capa</p>
                      <p className="text-[10px] text-outline mt-0.5">Formatos suportados: PNG, JPG, WebP (Máx. 5MB)</p>
                    </div>
                  </div>
                </div>
              )}

              {pagePanelTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-outline font-bold mb-1">Meta Título (Title Tag)</label>
                    <input
                      type="text"
                      value={pageForm.metaTitle}
                      onChange={(e) => setPageForm({ ...pageForm, metaTitle: e.target.value })}
                      placeholder="Título otimizado para motores de pesquisa"
                      className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-outline font-bold mb-1">Meta Descrição</label>
                    <textarea
                      rows={3}
                      value={pageForm.metaDesc}
                      onChange={(e) => setPageForm({ ...pageForm, metaDesc: e.target.value })}
                      placeholder="Resumo de 150 a 160 caracteres que aparece nos resultados do Google..."
                      className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  {/* Pré-visualização Google */}
                  <div className="border border-border-subtle rounded-lg p-3.5 bg-surface-container-low/30">
                    <p className="text-[10px] uppercase font-bold text-outline tracking-wider mb-2">Pré-visualização nos Resultados de Pesquisa (Google)</p>
                    <p className="text-sm font-bold text-[#1a0dab] hover:underline cursor-pointer truncate">{pageForm.metaTitle || pageForm.titulo || 'Título da Página'} — Vendaia School®</p>
                    <p className="text-[11px] text-[#006621] truncate font-mono">https://www.vendaia.edu{pageForm.slug || '/pagina'}</p>
                    <p className="text-xs text-[#545454] line-clamp-2 mt-1">{pageForm.metaDesc || 'Descrição da página disponibilizada institucionalmente pelo portal da Vendaia School.'}</p>
                  </div>
                </div>
              )}

              {/* Botões de Ação do Footer */}
              <div className="pt-4 border-t border-border-subtle flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setPageModal(false)}
                  className="border border-border-subtle px-4 py-2 rounded-lg font-bold text-xs hover:bg-surface-container transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary text-surface-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
                >
                  {editingPage ? 'Guardar Alterações' : 'Criar Página'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Página */}
      {confirmDeletePage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Confirmar Remoção</h2>
              <button onClick={() => setConfirmDeletePage(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">Esta ação não pode ser desfeita. Deseja remover a página <strong className="text-primary">{confirmDeletePage.titulo}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDeletePage(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={removePage} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Remover</button>
            </div>
          </div>
        </div>
      )}

      {/* Painel Lateral (Slide-Over Drawer): Criar/Editar Notícia */}
      {newsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-xl md:max-w-2xl bg-surface-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header do Painel (Dark Navy Header) */}
            <div className="bg-[#041939] text-surface-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Newspaper className="w-5 h-5 text-primary stroke-[1.75]" />
                <div>
                  <h2 className="text-base font-bold tracking-wide">
                    {editingNews ? `Editar Notícia: ${editingNews.titulo}` : 'Nova Notícia'}
                  </h2>
                  <p className="text-[11px] text-white/70">Painel de Publicação de Notícias e Eventos</p>
                </div>
              </div>
              <button
                onClick={() => setNewsModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Abas de Navegação Internas do Painel */}
            <div className="bg-surface-container-low border-b border-border-subtle px-6 flex items-center gap-2 shrink-0">
              {[
                { key: 'geral', label: 'Dados da Notícia' },
                { key: 'conteudo', label: 'Corpo & Mídia' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setNewsPanelTab(t.key as any)}
                  className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    newsPanelTab === t.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-outline hover:text-primary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Conteúdo do Formulário (Scrollable) */}
            <form onSubmit={saveNews} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {newsPanelTab === 'geral' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-outline font-bold mb-1">Título da Notícia <span className="text-error">*</span></label>
                    <input
                      type="text"
                      required
                      value={newsForm.titulo}
                      onChange={(e) => setNewsForm({ ...newsForm, titulo: e.target.value })}
                      placeholder="Ex: Abertura das Candidaturas para o Ano Letivo 2026/2027"
                      className="w-full border border-border-subtle rounded-lg p-2.5 text-xs font-medium focus:border-primary focus:outline-none bg-surface-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-outline font-bold mb-1">Categoria</label>
                      <select
                        value={newsForm.categoria}
                        onChange={(e) => setNewsForm({ ...newsForm, categoria: e.target.value })}
                        className="w-full border border-border-subtle rounded-lg p-2.5 text-xs font-medium focus:border-primary focus:outline-none bg-surface-white"
                      >
                        <option>Anúncios</option>
                        <option>Académico</option>
                        <option>Eventos</option>
                        <option>Institucional</option>
                        <option>Formação</option>
                        <option>Desporto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-outline font-bold mb-1">Estado de Publicação</label>
                      <select
                        value={newsForm.estado}
                        onChange={(e) => setNewsForm({ ...newsForm, estado: e.target.value as NewsItem['estado'] })}
                        className="w-full border border-border-subtle rounded-lg p-2.5 text-xs font-bold focus:border-primary focus:outline-none bg-surface-white"
                      >
                        <option value="Rascunho">Rascunho</option>
                        <option value="Publicado">Publicado</option>
                        <option value="Agendado">Agendado</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 border border-border-subtle rounded-lg bg-surface-container-low/30">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newsForm.destacada}
                        onChange={(e) => setNewsForm({ ...newsForm, destacada: e.target.checked })}
                        className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4"
                      />
                      <div>
                        <span className="font-bold text-primary block text-xs">Notícia em Destaque (Banner Principal)</span>
                        <span className="text-[10px] text-outline">Aparece em destaque no carrossel da homepage do portal.</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {newsPanelTab === 'conteudo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-outline font-bold mb-1">Resumo Executivo da Notícia</label>
                    <textarea
                      rows={3}
                      value={newsForm.resumo}
                      onChange={(e) => setNewsForm({ ...newsForm, resumo: e.target.value })}
                      placeholder="Breve sumário exibido nos cartões de notícia..."
                      className="w-full border border-border-subtle rounded-lg p-2.5 text-xs focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-outline font-bold mb-1">Corpo da Notícia</label>
                    <textarea
                      rows={8}
                      value={newsForm.conteudo}
                      onChange={(e) => setNewsForm({ ...newsForm, conteudo: e.target.value })}
                      placeholder="Escreva o texto integral da notícia..."
                      className="w-full border border-border-subtle rounded-lg p-3 text-xs focus:border-primary focus:outline-none resize-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-outline font-bold mb-1">Imagem de Capa da Notícia</label>
                    <div className="border-2 border-dashed border-border-subtle rounded-lg p-5 text-center hover:border-primary transition-colors cursor-pointer bg-surface-container-low/20">
                      <ImageIcon className="w-7 h-7 text-primary mx-auto mb-1.5" />
                      <p className="font-bold text-primary text-xs">Upload de Imagem Ilustrativa</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de Ação do Footer */}
              <div className="pt-4 border-t border-border-subtle flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setNewsModal(false)}
                  className="border border-border-subtle px-4 py-2 rounded-lg font-bold text-xs hover:bg-surface-container transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary text-surface-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
                >
                  {editingNews ? 'Guardar Notícia' : 'Criar Notícia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Notícia */}
      {confirmDeleteNews && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Confirmar Remoção</h2>
              <button onClick={() => setConfirmDeleteNews(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">Esta ação não pode ser desfeita. Deseja remover a notícia <strong className="text-primary">{confirmDeleteNews.titulo}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDeleteNews(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={removeNews} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
