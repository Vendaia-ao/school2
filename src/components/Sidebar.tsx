import React, { useState } from 'react';
import { ActiveView } from '../types';
import { Palette, Search, MessageSquare, Camera, Send, X, ChevronRight, CircleCheck as CheckCircle2, Monitor, Sun, Moon, Check } from 'lucide-react';

interface SidebarProps {
  currentView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onShowToast?: (msg: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isExpanded,
  onToggleExpand,
  onShowToast,
}) => {
  // State for collapsible submenus
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    academica: true,
    biblioteca: false,
    servicos: false,
    financeira: false,
    rh: false,
    documental: false,
    comunicacao: false,
    admin: false,
  });

  // State for Definições popover, Theme submenu & Feedback modal
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'system' | 'light' | 'dark'>('light');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(120);
  const [feedbackText, setFeedbackText] = useState('');
  const [includeDiag, setIncludeDiag] = useState(true);
  const [screenAttached, setScreenAttached] = useState(false);

  const handleSelectTheme = (themeMode: 'system' | 'light' | 'dark') => {
    setCurrentTheme(themeMode);
    setShowThemeSubmenu(false);
    localStorage.setItem('vendaia_theme', themeMode);

    let isDark = false;
    if (themeMode === 'dark') {
      isDark = true;
    } else if (themeMode === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    const themeLabels = {
      system: 'Sistema',
      light: 'Claro',
      dark: 'Escuro',
    };

    if (onShowToast) {
      onShowToast(`Tema alterado para: ${themeLabels[themeMode]}`);
    }
  };

  // Restore saved theme and 120% default zoom on mount
  React.useEffect(() => {
    const savedZoom = localStorage.getItem('vendaia_zoom');
    const initialZoom = savedZoom ? parseInt(savedZoom, 10) : 120;
    setZoomLevel(initialZoom);
    const actualCssZoom = Math.round((initialZoom * 80) / 100);
    try {
      (document.body.style as any).zoom = `${actualCssZoom}%`;
    } catch (e) {
      // Fallback
    }

    const savedTheme = (localStorage.getItem('vendaia_theme') as 'system' | 'light' | 'dark') || 'light';
    setCurrentTheme(savedTheme);
    let isDark = false;
    if (savedTheme === 'dark') {
      isDark = true;
    } else if (savedTheme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  const handleZoomChange = (delta: number) => {
    const newZoom = Math.min(Math.max(zoomLevel + delta, 70), 150);
    setZoomLevel(newZoom);
    localStorage.setItem('vendaia_zoom', newZoom.toString());
    const actualCssZoom = Math.round((newZoom * 80) / 100);
    try {
      (document.body.style as any).zoom = `${actualCssZoom}%`;
    } catch (e) {
      // Fallback
    }
    if (onShowToast) {
      onShowToast(`Nível de zoom ajustado para ${newZoom}%.`);
    }
  };

  const handleCaptureScreen = () => {
    setScreenAttached(true);
    if (onShowToast) {
      onShowToast('Captura de ecrã efetuada e anexada ao feedback.');
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFeedbackModal(false);
    setFeedbackText('');
    setScreenAttached(false);
    if (onShowToast) {
      onShowToast('Feedback enviado com sucesso! Obrigado pela colaboração.');
    }
  };

  const toggleModule = (moduleKey: string) => {
    if (!isExpanded) {
      onToggleExpand();
    }
    setOpenModules((prev) => {
      const isCurrentlyOpen = prev[moduleKey];
      const closedState = {
        academica: false,
        biblioteca: false,
        servicos: false,
        financeira: false,
        rh: false,
        documental: false,
        comunicacao: false,
        admin: false,
      };
      return isCurrentlyOpen ? closedState : { ...closedState, [moduleKey]: true };
    });
  };

  const handleSelectScreen = (view: ActiveView) => {
    if (!isExpanded) {
      onToggleExpand();
    }
    onSelectView(view);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full flex flex-col bg-[#051939] border-r border-[#051939]/40 z-50 transition-all duration-300 ${
        isExpanded ? 'sidebar-expanded w-[230px]' : 'sidebar-collapsed w-[72px]'
      }`}
      id="sidebar"
    >
      {/* Header / Brand */}
      <div className="px-3 py-3 border-b border-on-primary-container/20 flex items-center justify-between menu-header h-[64px] shrink-0">
        {isExpanded ? (
          <div
            className="sidebar-text truncate cursor-pointer select-none"
            onClick={() => onSelectView('dashboard')}
          >
            <h1 className="font-title-lg text-title-lg font-bold text-on-primary mb-0.5 tracking-tight">
              Vendaia School®
            </h1>
            <p className="font-label-sm text-[11px] text-on-primary-container">
              Plataforma de Gestão Escolar
            </p>
          </div>
        ) : null}
        <button
          className="text-on-primary-container hover:text-on-primary p-1.5 rounded hover:bg-on-primary-container/20 transition-colors mx-auto cursor-pointer"
          onClick={onToggleExpand}
          title={isExpanded ? 'Recolher Menu' : 'Expandir Menu'}
        >
          <span className="material-symbols-outlined text-[18px]">menu</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
        {/* MÓDULO 1: DASHBOARD */}
        <div>
          <button
            onClick={() => handleSelectScreen('dashboard')}
            className={`w-full flex items-center gap-2 px-3 py-2 transition-all rounded-none menu-item text-left cursor-pointer ${
              currentView === 'dashboard'
                ? 'text-on-primary bg-info/20 border-l-3 border-[#2563EB] font-bold shadow-2xs'
                : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
            }`}
            title="Dashboard (Hub Central)"
          >
            <span className="material-symbols-outlined text-[18px] text-info">dashboard</span>
            {isExpanded && <span className="font-label-md sidebar-text truncate">Dashboard (Hub Central)</span>}
          </button>
        </div>

        {/* MÓDULOS DE DOMÍNIO */}
        {/* GESTÃO ACADÉMICA */}
          <div>
            <button
              onClick={() => toggleModule('academica')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-none cursor-pointer menu-item transition-all text-left ${
                ['estudantes', 'perfil', 'turmas', 'professores', 'config_academicas', 'aluno_portal', 'encarregado_portal', 'professor_portal'].includes(currentView)
                  ? 'text-on-primary bg-info/20 border-l-3 border-[#2563EB] font-bold shadow-2xs'
                  : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
              }`}
              title="Gestão Académica"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px]">school</span>
                {isExpanded && <span className="font-label-md sidebar-text truncate">Gestão Académica</span>}
              </div>
              {isExpanded && (
                <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.academica ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              )}
            </button>

            {isExpanded && openModules.academica && (
              <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
                <button
                  onClick={() => handleSelectScreen('estudantes')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'estudantes' || currentView === 'perfil'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  1. Estudantes
                </button>
                <button
                  onClick={() => handleSelectScreen('turmas')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'turmas'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  2. Turmas
                </button>
                <button
                  onClick={() => handleSelectScreen('professores')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'professores'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  3. Professores
                </button>
                <button
                  onClick={() => handleSelectScreen('config_academicas')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'config_academicas'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  4. Config. Académicas
                </button>
                <button
                  onClick={() => handleSelectScreen('aluno_portal')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'aluno_portal'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  5. Portal do Aluno
                </button>
                <button
                  onClick={() => handleSelectScreen('encarregado_portal')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'encarregado_portal'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  6. Portal Encarregado
                </button>
                <button
                  onClick={() => handleSelectScreen('professor_portal')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'professor_portal'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  7. Portal Professor
                </button>
              </div>
            )}
          </div>

          {/* BIBLIOTECA DIGITAL */}
          <div>
            <button
              onClick={() => toggleModule('biblioteca')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-none cursor-pointer menu-item transition-all text-left ${
                ['biblioteca', 'biblioteca_catalogo', 'biblioteca_solicitacoes', 'biblioteca_relatorios', 'biblioteca_configuracoes'].includes(currentView)
                  ? 'text-on-primary bg-info/20 border-l-3 border-[#2563EB] font-bold shadow-2xs'
                  : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
              }`}
              title="Biblioteca Digital"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px]">local_library</span>
                {isExpanded && <span className="font-label-md sidebar-text truncate">Biblioteca Digital</span>}
              </div>
              {isExpanded && (
                <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.biblioteca ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              )}
            </button>

            {isExpanded && openModules.biblioteca && (
              <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
                <button
                  onClick={() => handleSelectScreen('biblioteca_catalogo')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'biblioteca' || currentView === 'biblioteca_catalogo'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  1. Catálogo
                </button>
                <button
                  onClick={() => handleSelectScreen('biblioteca_solicitacoes')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'biblioteca_solicitacoes'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  2. Solicitações
                </button>
                <button
                  onClick={() => handleSelectScreen('biblioteca_relatorios')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'biblioteca_relatorios'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  3. Relatórios
                </button>
                <button
                  onClick={() => handleSelectScreen('biblioteca_configuracoes')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'biblioteca_configuracoes'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  4. Configurações
                </button>
              </div>
            )}
          </div>

          {/* SERVIÇOS INSTITUCIONAIS */}
          <div>
            <button
              onClick={() => toggleModule('servicos')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-none cursor-pointer menu-item transition-all text-left ${
                ['servicos_produtos', 'cantina'].includes(currentView)
                  ? 'text-on-primary bg-info/20 border-l-3 border-[#2563EB] font-bold shadow-2xs'
                  : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
              }`}
              title="Serviços Institucionais"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                {isExpanded && <span className="font-label-md sidebar-text truncate">Serviços Institucionais</span>}
              </div>
              {isExpanded && (
                <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.servicos ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              )}
            </button>

            {isExpanded && openModules.servicos && (
              <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
                <button
                  onClick={() => handleSelectScreen('servicos_produtos')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'servicos_produtos'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  1. Serviços e Produtos
                </button>
                <button
                  onClick={() => handleSelectScreen('cantina')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'cantina'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  2. Gerir Cantina
                </button>
              </div>
            )}
          </div>

          {/* GESTÃO FINANCEIRA */}
          <div>
            <button
              onClick={() => toggleModule('financeira')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-none cursor-pointer menu-item transition-all text-left ${
                ['tesouraria', 'gestao_financeira', 'financeiro'].includes(currentView)
                  ? 'text-on-primary bg-info/20 border-l-3 border-[#2563EB] font-bold shadow-2xs'
                  : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
              }`}
              title="Gestão Financeira"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                {isExpanded && <span className="font-label-md sidebar-text truncate">Gestão Financeira</span>}
              </div>
              {isExpanded && (
                <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.financeira ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              )}
            </button>

            {isExpanded && openModules.financeira && (
              <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
                <button
                  onClick={() => handleSelectScreen('tesouraria')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'tesouraria'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  1. Tesouraria / Facturação
                </button>
                <button
                  onClick={() => handleSelectScreen('gestao_financeira')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'gestao_financeira' || currentView === 'financeiro'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  2. Gestão Financeira
                </button>
              </div>
            )}
          </div>

          {/* RECURSOS HUMANOS */}
          <div>
            <button
              onClick={() => toggleModule('rh')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-none cursor-pointer menu-item transition-all text-left ${
                ['rh_colaboradores'].includes(currentView)
                  ? 'text-on-primary bg-info/20 border-l-3 border-[#2563EB] font-bold shadow-2xs'
                  : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
              }`}
              title="Recursos Humanos"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px]">badge</span>
                {isExpanded && <span className="font-label-md sidebar-text truncate">Recursos Humanos</span>}
              </div>
              {isExpanded && (
                <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.rh ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              )}
            </button>

            {isExpanded && openModules.rh && (
              <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
                <button
                  onClick={() => handleSelectScreen('rh_colaboradores')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'rh_colaboradores'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  1. Colaboradores
                </button>
              </div>
            )}
          </div>

          {/* GESTÃO DOCUMENTAL */}
          <div>
            <button
              onClick={() => toggleModule('documental')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-none cursor-pointer menu-item transition-all text-left ${
                ['gestao_documental', 'documental'].includes(currentView)
                  ? 'text-on-primary bg-info/20 border-l-3 border-[#2563EB] font-bold shadow-2xs'
                  : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
              }`}
              title="Gestão Documental"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px]">folder_open</span>
                {isExpanded && <span className="font-label-md sidebar-text truncate">Gestão Documental</span>}
              </div>
              {isExpanded && (
                <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.documental ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              )}
            </button>

            {isExpanded && openModules.documental && (
              <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
                <button
                  onClick={() => handleSelectScreen('gestao_documental')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'gestao_documental' || currentView === 'documental'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  1. Arquivo Documental
                </button>
              </div>
            )}
          </div>

          {/* COMUNICAÇÃO INSTITUCIONAL */}
          <div>
            <button
              onClick={() => toggleModule('comunicacao')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-none cursor-pointer menu-item transition-all text-left ${
                ['comunicacao', 'cms'].includes(currentView)
                  ? 'text-on-primary bg-info/20 border-l-3 border-[#2563EB] font-bold shadow-2xs'
                  : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
              }`}
              title="Comunicação Institucional"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px]">forum</span>
                {isExpanded && <span className="font-label-md sidebar-text truncate">Comunicação</span>}
              </div>
              {isExpanded && (
                <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.comunicacao ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              )}
            </button>

            {isExpanded && openModules.comunicacao && (
              <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
                <button
                  onClick={() => handleSelectScreen('comunicacao')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'comunicacao'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  1. Comunicação
                </button>
                <button
                  onClick={() => handleSelectScreen('cms')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'cms'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  2. CMS (Website)
                </button>
              </div>
            )}
          </div>

          {/* ADMINISTRAÇÃO DA PLATAFORMA */}
          <div>
            <button
              onClick={() => toggleModule('admin')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-none cursor-pointer menu-item transition-all text-left ${
                ['utilizadores_permissoes', 'estruturas', 'config_instituicao', 'administracao'].includes(currentView)
                  ? 'text-on-primary bg-info/20 border-l-3 border-[#2563EB] font-bold shadow-2xs'
                  : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
              }`}
              title="Admin. Plataforma"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                {isExpanded && <span className="font-label-md sidebar-text truncate">Admin. Plataforma</span>}
              </div>
              {isExpanded && (
                <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.admin ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              )}
            </button>

            {isExpanded && openModules.admin && (
              <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
                <button
                  onClick={() => handleSelectScreen('utilizadores_permissoes')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'utilizadores_permissoes' || currentView === 'administracao'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  1. Utilizadores & Permissões
                </button>
                <button
                  onClick={() => handleSelectScreen('estruturas')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'estruturas'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  2. Estruturas & Unidades
                </button>
                <button
                  onClick={() => handleSelectScreen('config_instituicao')}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-none text-xs transition-colors cursor-pointer ${
                    currentView === 'config_instituicao'
                      ? 'text-info font-bold bg-on-primary-container/20'
                      : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                  }`}
                >
                  3. Config. Instituição
                </button>
              </div>
            )}
          </div>
        </div>

      {/* Footer (3 Ações: Definições, Ajuda & Suporte, Terminar Sessão) */}
      <div className="border-t border-on-primary-container/20 p-2 shrink-0 space-y-0.5 relative">
        {/* Popover de Definições (Personalização & Zoom) */}
        {showSettingsPopover && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowSettingsPopover(false)}
            />
            <div className="absolute bottom-16 left-2 right-2 z-50 bg-surface-white border border-border-subtle rounded-xl shadow-2xl p-3 text-xs text-primary animate-in fade-in zoom-in-95 duration-150">
              {/* Option 1: Personalização */}
              <div className="relative mb-2">
                <button
                  onClick={() => setShowThemeSubmenu(!showThemeSubmenu)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg font-semibold text-primary transition-colors cursor-pointer ${
                    showThemeSubmenu ? 'bg-surface-container-low/90' : 'hover:bg-surface-container-low/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Palette className="w-4 h-4 text-outline stroke-[1.75]" />
                    <span>Personalização</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-outline/60 stroke-[1.75]" />
                </button>

                {/* Submenu de Personalização (Sistema, Claro, Escuro) */}
                {showThemeSubmenu && (
                  <div className="absolute left-[calc(100%+8px)] top-0 z-50 w-44 bg-surface-white border border-border-subtle rounded-xl shadow-2xl p-1 text-xs text-primary animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => handleSelectTheme('system')}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                        currentTheme === 'system'
                          ? 'bg-surface-container-low font-bold'
                          : 'hover:bg-surface-container-low/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Monitor className="w-4 h-4 text-outline/80 stroke-[1.75]" />
                        <span>Sistema</span>
                      </div>
                      {currentTheme === 'system' && <Check className="w-4 h-4 text-secondary stroke-[2.5]" />}
                    </button>

                    <button
                      onClick={() => handleSelectTheme('light')}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                        currentTheme === 'light'
                          ? 'bg-surface-container-low font-bold'
                          : 'hover:bg-surface-container-low/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sun className="w-4 h-4 text-outline/80 stroke-[1.75]" />
                        <span>Claro</span>
                      </div>
                      {currentTheme === 'light' && <Check className="w-4 h-4 text-secondary stroke-[2.5]" />}
                    </button>

                    <button
                      onClick={() => handleSelectTheme('dark')}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                        currentTheme === 'dark'
                          ? 'bg-surface-container-low font-bold'
                          : 'hover:bg-surface-container-low/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Moon className="w-4 h-4 text-outline/80 stroke-[1.75]" />
                        <span>Escuro</span>
                      </div>
                      {currentTheme === 'dark' && <Check className="w-4 h-4 text-secondary stroke-[2.5]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Option 2: Zoom */}
              <div className="p-2.5 bg-surface-container-low/40 rounded-lg space-y-2 border border-border-subtle/40">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <Search className="w-4 h-4 text-outline stroke-[1.75]" />
                  <span>Zoom</span>
                </div>
                <div className="flex items-center justify-between bg-surface-white border border-border-subtle rounded-lg px-2 py-1 shadow-2xs">
                  <button
                    onClick={() => handleZoomChange(-10)}
                    className="w-6 h-6 rounded flex items-center justify-center font-bold text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                    title="Reduzir Zoom"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-primary text-xs">{zoomLevel}%</span>
                  <button
                    onClick={() => handleZoomChange(10)}
                    className="w-6 h-6 rounded flex items-center justify-center font-bold text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                    title="Aumentar Zoom"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <button
          onClick={() => setShowSettingsPopover(!showSettingsPopover)}
          className={`w-full flex items-center gap-2 px-3 py-1.5 transition-all rounded menu-item text-left cursor-pointer ${
            showSettingsPopover
              ? 'border border-white/60 bg-surface-white/10 text-on-primary font-bold shadow-2xs'
              : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
          }`}
          title="Definições"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          {isExpanded && <span className="font-label-md sidebar-text">Definições</span>}
        </button>

        <button
          onClick={() => {
            setShowSettingsPopover(false);
            setShowFeedbackModal(true);
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20 transition-colors rounded menu-item text-left cursor-pointer"
          title="Ajuda & Suporte"
        >
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          {isExpanded && <span className="font-label-md sidebar-text">Ajuda & Suporte</span>}
        </button>

        <button
          onClick={() => alert('Sessão terminada com sucesso.')}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-error/90 hover:text-error hover:bg-error/10 transition-colors rounded menu-item text-left cursor-pointer font-medium"
          title="Terminar Sessão"
        >
          <span className="material-symbols-outlined text-[18px] text-error">logout</span>
          {isExpanded && <span className="font-label-md sidebar-text">Terminar Sessão</span>}
        </button>
      </div>

      {/* Modal de Feedback: Ajuda & Suporte */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-[#0c1c38] text-surface-white rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-[#081528] px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                  <MessageSquare className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight">Enviar feedback</h2>
                  <p className="text-[11px] text-white/70">
                    Ajude-nos a melhorar a plataforma Vendaia School®
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSendFeedback} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-white/90 font-bold mb-1.5">
                  Descreva o seu feedback ou problema <span className="text-error">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Explique o que aconteceu, sugestões de melhoria ou erros observados..."
                  className="w-full bg-[#06101f] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-white/40 focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-white/90 font-bold mb-1.5">Anexo de Ecrã</label>
                <button
                  type="button"
                  onClick={handleCaptureScreen}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl py-3 px-4 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs"
                >
                  <Camera className="w-4 h-4 text-blue-400 stroke-[2]" />
                  <span>{screenAttached ? 'Substituir captura de ecrã' : 'Tirar captura de ecrã'}</span>
                </button>
                {screenAttached && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Captura_ecra_vendaia_school.png (1.2 MB)
                    </span>
                    <button
                      type="button"
                      onClick={() => setScreenAttached(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-white/80 select-none">
                  <input
                    type="checkbox"
                    checked={includeDiag}
                    onChange={(e) => setIncludeDiag(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-blue-500 focus:ring-blue-500 bg-[#06101f] cursor-pointer mt-0.5"
                  />
                  <span className="text-[11px] leading-tight">
                    Incluir dados de diagnóstico do sistema (versão, navegador e resolução de ecrã)
                  </span>
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-2 border-t border-white/10 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="border border-white/20 hover:bg-white/10 text-white rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl px-6 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2]" />
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
