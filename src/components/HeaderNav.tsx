import React, { useState, useEffect } from 'react';
import { ActiveView } from '../types';
import { useAccess } from '../context/AccessContext';
import {
  Building2,
  Calendar,
  Clock,
  ChevronDown,
  Bell,
  Grid3x3,
  Maximize2,
  User,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  CreditCard,
  FileText,
} from 'lucide-react';

interface HeaderNavProps {
  currentView: ActiveView;
  selectedStudentName?: string;
  onSelectView: (view: ActiveView) => void;
  onOpenNotifications?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  selectedStudentName,
  onSelectView,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const { userStructures, currentStructureId, switchStructure } = useAccess();

  const currentStructure = userStructures.find((s) => s.id === currentStructureId);
  const currentStructureName =
    currentStructureId === 'all'
      ? 'Todas as Estruturas'
      : currentStructure?.nome || 'Sede Central (Luanda)';

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="header-nav fixed top-0 right-0 h-header-height flex justify-between items-center px-4 sm:px-6 bg-surface-white/90 backdrop-blur-md z-40 border-b border-border-subtle shadow-2xs transition-all duration-300">
      {/* Left Area: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
        {currentView === 'dashboard' && (
          <span className="text-primary font-bold text-sm">Dashboard Principal</span>
        )}

        {['estudantes', 'perfil', 'turmas', 'professores', 'config_academicas', 'aluno_portal', 'encarregado_portal', 'professor_portal'].includes(currentView) && (
          <div className="flex items-center gap-1">
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={() => onSelectView('estudantes')}
            >
              Gestão Académica
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            <span className="text-primary font-bold">
              {currentView === 'estudantes'
                ? 'Estudantes'
                : currentView === 'turmas'
                ? 'Turmas'
                : currentView === 'professores'
                ? 'Professores'
                : currentView === 'config_academicas'
                ? 'Configurações Académicas'
                : currentView === 'aluno_portal'
                ? 'Portal do Aluno'
                : currentView === 'encarregado_portal'
                ? 'Portal do Encarregado'
                : currentView === 'professor_portal'
                ? 'Portal do Professor'
                : 'Estudantes'}
            </span>
            {currentView === 'perfil' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-outline" />
                <span className="text-primary font-bold truncate max-w-[180px]">
                  {selectedStudentName || 'Perfil de Estudante'}
                </span>
              </>
            )}
          </div>
        )}

        {currentView === 'biblioteca' && (
          <div className="flex items-center gap-1">
            <span className="text-primary font-bold text-sm">Biblioteca Digital</span>
          </div>
        )}

        {['servicos_produtos', 'cantina'].includes(currentView) && (
          <div className="flex items-center gap-1">
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={() => onSelectView('servicos_produtos')}
            >
              Serviços Institucionais
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            <span className="text-primary font-bold">
              {currentView === 'servicos_produtos' ? 'Serviços e Produtos' : 'Gerir Cantina'}
            </span>
          </div>
        )}

        {['tesouraria', 'gestao_financeira', 'financeiro'].includes(currentView) && (
          <div className="flex items-center gap-1">
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={() => onSelectView('tesouraria')}
            >
              Gestão Financeira
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            <span className="text-primary font-bold">
              {currentView === 'tesouraria' ? 'Tesouraria / Facturação' : 'Gestão Financeira'}
            </span>
          </div>
        )}

        {['rh_colaboradores'].includes(currentView) && (
          <div className="flex items-center gap-1">
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={() => onSelectView('rh_colaboradores')}
            >
              Recursos Humanos
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            <span className="text-primary font-bold">Colaboradores</span>
          </div>
        )}

        {['gestao_documental', 'documental'].includes(currentView) && (
          <div className="flex items-center gap-1">
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={() => onSelectView('gestao_documental')}
            >
              Gestão Documental
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            <span className="text-primary font-bold">Arquivo Documental</span>
          </div>
        )}

        {['comunicacao', 'cms'].includes(currentView) && (
          <div className="flex items-center gap-1">
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={() => onSelectView('comunicacao')}
            >
              Comunicação
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            <span className="text-primary font-bold">
              {currentView === 'comunicacao' ? 'Comunicação' : 'CMS (Website)'}
            </span>
          </div>
        )}

        {['utilizadores_permissoes', 'estruturas', 'config_instituicao', 'administracao'].includes(currentView) && (
          <div className="flex items-center gap-1">
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={() => onSelectView('utilizadores_permissoes')}
            >
              Admin. Plataforma
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            <span className="text-primary font-bold">
              {currentView === 'config_instituicao'
                ? 'Config. Instituição'
                : currentView === 'estruturas'
                ? 'Estruturas & Unidades'
                : 'Utilizadores & Permissões'}
            </span>
          </div>
        )}
      </div>

      {/* Right Controls: Frameless Header Controls + Control Icons + User Avatar */}
      <div className="flex items-center gap-3">
        {/* Item 1: Data e Hora em Tempo Real (Sem Fundo) */}
        <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-primary">
          <Clock className="w-4 h-4 text-primary shrink-0 stroke-[2]" />
          <span className="capitalize text-primary">{formattedDate}</span>
          <span className="text-primary/40">•</span>
          <span className="font-mono text-secondary font-extrabold">{formattedTime}</span>
        </div>

        {/* Item 2: Seletor de Estrutura / Polo (Sem Fundo Escuro) */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-primary hover:bg-surface-container/60 transition-colors cursor-pointer relative">
            <Building2 className="w-4 h-4 text-primary shrink-0 stroke-[2]" />
            <select
              value={currentStructureId}
              onChange={(e) => switchStructure(e.target.value)}
              className="bg-transparent text-primary font-bold text-xs focus:outline-none cursor-pointer appearance-none pr-5 py-0 z-10"
              title="Alternar Polo ou Estrutura"
            >
              <option value="all" className="bg-surface-white text-primary font-semibold">
                📍 Todas as Estruturas ({userStructures.length})
              </option>
              <optgroup label="Unidades Operacionais" className="bg-surface-white text-primary font-semibold">
                {userStructures.map((s) => (
                  <option key={s.id} value={s.id} className="bg-surface-white text-primary font-medium">
                    🏢 {s.nome}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-primary absolute right-2 pointer-events-none stroke-[2.5]" />
          </div>
        </div>

        {/* Control Icon 1: Notificação com Badge Laranja */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-surface-container cursor-pointer"
            title="Notificações"
          >
            <Bell className="w-5 h-5 stroke-[1.75]" />
            {/* Orange Badge Dot */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface-white shadow-2xs"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-surface-white border border-border-subtle rounded-xl shadow-2xl z-50 p-4 text-xs">
              <div className="flex justify-between items-center border-b border-border-subtle pb-2 mb-3">
                <span className="font-extrabold text-primary text-sm">Notificações</span>
                <span className="text-[10px] text-secondary font-bold hover:underline cursor-pointer">
                  Marcar todas como lidas
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2.5 bg-surface-container-low/70 rounded-lg border-l-3 border-error flex gap-2.5">
                  <CreditCard className="w-4 h-4 text-error shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-primary">14 Propinas Pendentes</p>
                    <p className="text-[10px] text-outline">Lembretes automáticos prontos para envio.</p>
                  </div>
                </div>
                <div className="p-2.5 bg-surface-container-low/70 rounded-lg border-l-3 border-warning flex gap-2.5">
                  <FileText className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-primary">3 Documentos Expirados</p>
                    <p className="text-[10px] text-outline">Atualização necessária na secretaria.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Icon 2: Grelha de Módulos (9 Dots Grid) */}
        <button
          onClick={() => onSelectView('administracao')}
          className="p-1.5 text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-surface-container cursor-pointer flex items-center justify-center"
          title="Módulos Vendaia OS®"
        >
          <svg className="w-4.5 h-4.5 text-primary fill-current transition-colors" viewBox="0 0 24 24">
            <rect x="3" y="3" width="4.5" height="4.5" rx="1.2" />
            <rect x="9.75" y="3" width="4.5" height="4.5" rx="1.2" />
            <rect x="16.5" y="3" width="4.5" height="4.5" rx="1.2" />
            <rect x="3" y="9.75" width="4.5" height="4.5" rx="1.2" />
            <rect x="9.75" y="9.75" width="4.5" height="4.5" rx="1.2" />
            <rect x="16.5" y="9.75" width="4.5" height="4.5" rx="1.2" />
            <rect x="3" y="16.5" width="4.5" height="4.5" rx="1.2" />
            <rect x="9.75" y="16.5" width="4.5" height="4.5" rx="1.2" />
            <rect x="16.5" y="16.5" width="4.5" height="4.5" rx="1.2" />
          </svg>
        </button>

        {/* Control Icon 3: Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-surface-container cursor-pointer"
          title="Alternar Ecrã Inteiro"
        >
          <Maximize2 className="w-4 h-4 text-primary stroke-[2]" />
        </button>

        {/* Control Item 4: Dark Navy User Profile Circle Avatar */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8.5 h-8.5 rounded-full bg-[#041939] hover:bg-[#062656] text-surface-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm cursor-pointer ml-1 aspect-square shrink-0"
            style={{ borderRadius: '50%' }}
            title="Perfil de Utilizador"
          >
            <User className="w-4 h-4 text-white stroke-[2]" />
          </button>

          {/* User Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-10 w-56 bg-surface-white border border-border-subtle rounded-xl shadow-2xl z-50 p-2 text-xs">
              <div className="p-3 border-b border-border-subtle mb-1 bg-surface-container-low/50 rounded-t-lg">
                <p className="font-extrabold text-primary text-sm">Dra. Sara Silva</p>
                <p className="text-[10px] font-semibold text-secondary">Administradora Geral</p>
                <p className="text-[10px] text-outline">sara.silva@vendaia.pt</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onSelectView('administracao');
                }}
                className="w-full text-left p-2.5 hover:bg-surface-container rounded-lg flex items-center gap-2 font-semibold text-primary transition-colors"
              >
                <Settings className="w-4 h-4 text-outline" /> Configurações de Conta
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert('Sessão terminada com segurança.');
                }}
                className="w-full text-left p-2.5 hover:bg-error/10 text-error rounded-lg flex items-center gap-2 font-bold transition-colors mt-1"
              >
                <LogOut className="w-4 h-4 text-error" /> Sair do Sistema
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
