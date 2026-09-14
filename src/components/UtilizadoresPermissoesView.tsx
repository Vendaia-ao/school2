import React, { useMemo, useState } from 'react';
import { ActiveView } from '../types';
import { PERMISSIONS_CATALOG, PermissionLevel } from '../permissionsCatalog';
import { useAccess } from '../context/AccessContext';
import { ShieldCheck, Users, UserPlus, UserCog, KeyRound, ScrollText, Plus, Search, Pencil, LockKeyhole, Trash2, Power, X, TriangleAlert as AlertTriangle, FileText, ChevronRight, Copy, Building2, MoreVertical, CheckCircle2 } from 'lucide-react';

import { PermissionWizardView, WizardTarget } from './PermissionWizardView';

interface Props {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

type Tab = 'utilizadores' | 'grupos' | 'auditoria';

interface UserItem {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  grupo: string;
  estado: 'Ativo' | 'Inativo' | 'Bloqueado';
  ultimoAcesso: string;
  criado: string;
  avatar?: string;
  acessoConsolidado?: boolean;
  estruturasAutorizadas?: string[];
  estruturaPrincipalId?: string;
}

interface GroupItem {
  id: string;
  nome: string;
  descricao: string;
  membros: number;
  estado: 'Ativo' | 'Inativo';
  permissoes: number;
}

interface LogItem {
  id: string;
  utilizador: string;
  acao: string;
  modulo: string;
  ip: string;
  data: string;
  hora: string;
  nivel: 'Info' | 'Aviso' | 'Crítico';
}

const initialUsers: UserItem[] = [
  { id: 'u1', nome: 'Sara Silva', email: 'sara.silva@vendaia.edu', perfil: 'Administrador', grupo: 'Direção Geral', estado: 'Ativo', ultimoAcesso: '10 Ago 2026, 09:15', criado: '15 Jan 2025' },
  { id: 'u2', nome: 'Carlos Mendes', email: 'carlos.mendes@vendaia.edu', perfil: 'Gestor Académico', grupo: 'Secretaria Académica', estado: 'Ativo', ultimoAcesso: '10 Ago 2026, 08:42', criado: '03 Fev 2025' },
  { id: 'u3', nome: 'João Pinto', email: 'joao.pinto@vendaia.edu', perfil: 'Professor', grupo: 'Corpo Docente', estado: 'Ativo', ultimoAcesso: '09 Ago 2026, 16:30', criado: '12 Fev 2025' },
  { id: 'u4', nome: 'Miguel Ângelo', email: 'miguel.angelo@vendaia.edu', perfil: 'Professor', grupo: 'Corpo Docente', estado: 'Ativo', ultimoAcesso: '09 Ago 2026, 14:20', criado: '20 Fev 2025' },
  { id: 'u5', nome: 'Ana Lopes', email: 'ana.lopes@vendaia.edu', perfil: 'Tesoureiro', grupo: 'Serviços Financeiros', estado: 'Ativo', ultimoAcesso: '08 Ago 2026, 11:10', criado: '05 Mar 2025' },
  { id: 'u6', nome: 'Rui Costa', email: 'rui.costa@vendaia.edu', perfil: 'Bibliotecário', grupo: 'Biblioteca', estado: 'Inativo', ultimoAcesso: '15 Jul 2026, 10:00', criado: '10 Mar 2025' },
  { id: 'u7', nome: 'Marta Gomes', email: 'marta.gomes@vendaia.edu', perfil: 'Gestor RH', grupo: 'Recursos Humanos', estado: 'Ativo', ultimoAcesso: '09 Ago 2026, 15:45', criado: '18 Mar 2025' },
  { id: 'u8', nome: 'Pedro Santos', email: 'pedro.santos@vendaia.edu', perfil: 'Editor CMS', grupo: 'Comunicação', estado: 'Ativo', ultimoAcesso: '10 Ago 2026, 07:30', criado: '22 Mar 2025' },
  { id: 'u9', nome: 'Domingos Henriques', email: 'domingoshenriques1@ispozango.com', perfil: 'Professor', grupo: 'Corpo Docente', estado: 'Ativo', ultimoAcesso: '09 Ago 2026, 13:15', criado: '01 Abr 2025' },
  { id: 'u10', nome: 'Lúcia Pereira', email: 'lucia.pereira@vendaia.edu', perfil: 'Rececionista', grupo: 'Receção', estado: 'Bloqueado', ultimoAcesso: '10 Jun 2026, 09:00', criado: '15 Abr 2025' },
];

const initialGroups: GroupItem[] = [
  { id: 'g1', nome: 'Direção Geral', descricao: 'Acesso total ao sistema e todas as configurações', membros: 3, estado: 'Ativo', permissoes: 48 },
  { id: 'g2', nome: 'Secretaria Académica', descricao: 'Gestão de estudantes, matrículas e documentos', membros: 5, estado: 'Ativo', permissoes: 32 },
  { id: 'g3', nome: 'Corpo Docente', descricao: 'Professores com acesso a turmas, notas e assiduidade', membros: 28, estado: 'Ativo', permissoes: 18 },
  { id: 'g4', nome: 'Serviços Financeiros', descricao: 'Tesouraria, faturação e relatórios financeiros', membros: 4, estado: 'Ativo', permissoes: 24 },
  { id: 'g5', nome: 'Biblioteca', descricao: 'Gestão do acervo e catálogo digital', membros: 2, estado: 'Ativo', permissoes: 12 },
  { id: 'g6', nome: 'Recursos Humanos', descricao: 'Colaboradores, salários e processamento', membros: 3, estado: 'Ativo', permissoes: 22 },
  { id: 'g7', nome: 'Comunicação', descricao: 'CMS, notícias e comunicação institucional', membros: 2, estado: 'Ativo', permissoes: 14 },
  { id: 'g8', nome: 'Receção', descricao: 'Atendimento geral e marcações', membros: 2, estado: 'Inativo', permissoes: 6 },
];

const initialLogs: LogItem[] = [
  { id: 'l1', utilizador: 'Sara Silva', acao: 'Login no sistema', modulo: 'Autenticação', ip: '192.168.1.10', data: '10 Ago 2026', hora: '09:15', nivel: 'Info' },
  { id: 'l2', utilizador: 'Carlos Mendes', acao: 'Editou dados do estudante EST-2024-089', modulo: 'Gestão Académica', ip: '192.168.1.24', data: '10 Ago 2026', hora: '08:45', nivel: 'Info' },
  { id: 'l3', utilizador: 'Ana Lopes', acao: 'Emitiu fatura FAT-2026-0312', modulo: 'Tesouraria', ip: '192.168.1.35', data: '10 Ago 2026', hora: '08:30', nivel: 'Info' },
  { id: 'l4', utilizador: 'Lúcia Pereira', acao: 'Tentativa de acesso bloqueada — conta suspensa', modulo: 'Autenticação', ip: '192.168.1.52', data: '10 Ago 2026', hora: '07:50', nivel: 'Crítico' },
  { id: 'l5', utilizador: 'Pedro Santos', acao: 'Publicou notícia "Abertura de Inscrições 2026/2027"', modulo: 'CMS', ip: '192.168.1.41', data: '09 Ago 2026', hora: '17:20', nivel: 'Info' },
  { id: 'l6', utilizador: 'Sara Silva', acao: 'Alterou permissões do grupo "Receção"', modulo: 'Administração', ip: '192.168.1.10', data: '09 Ago 2026', hora: '16:00', nivel: 'Aviso' },
  { id: 'l7', utilizador: 'João Pinto', acao: 'Lançou notas da turma 10ºA — Matemática', modulo: 'Gestão Académica', ip: '192.168.1.28', data: '09 Ago 2026', hora: '14:30', nivel: 'Info' },
  { id: 'l8', utilizador: 'Marta Gomes', acao: 'Processou folha salarial — Julho 2026', modulo: 'Recursos Humanos', ip: '192.168.1.33', data: '09 Ago 2026', hora: '11:15', nivel: 'Info' },
  { id: 'l9', utilizador: 'Sara Silva', acao: 'Exportou relatório de auditoria (PDF)', modulo: 'Administração', ip: '192.168.1.10', data: '08 Ago 2026', hora: '18:00', nivel: 'Info' },
  { id: 'l10', utilizador: 'Rui Costa', acao: 'Conta desativada por inatividade (30 dias)', modulo: 'Autenticação', ip: '192.168.1.45', data: '15 Jul 2026', hora: '10:00', nivel: 'Aviso' },
];

const statusChip = (estado: string): string => {
  const map: Record<string, string> = {
    'Ativo': 'bg-success/15 text-success',
    'Inativo': 'bg-warning/15 text-warning',
    'Bloqueado': 'bg-error/15 text-error',
  };
  return map[estado] || 'bg-surface-container text-outline';
};

const nivelChip = (nivel: string): string => {
  const map: Record<string, string> = {
    'Info': 'bg-info/15 text-info',
    'Aviso': 'bg-warning/15 text-warning',
    'Crítico': 'bg-error/15 text-error',
  };
  return map[nivel] || 'bg-surface-container text-outline';
};

const perfilIcon = (perfil: string): string => {
  return perfil.charAt(0).toUpperCase();
};

const allScreens = PERMISSIONS_CATALOG.flatMap(m => m.screens);
const allTabKeys: string[] = PERMISSIONS_CATALOG.flatMap(m =>
  m.screens.flatMap(s => s.tabs.map(t => `${s.id}::${t}`))
);

const emptyPerms = (): Record<string, PermissionLevel> =>
  Object.fromEntries([
    ...allScreens.map(s => [s.id, 'none' as PermissionLevel]),
    ...allTabKeys.map(k => [k, 'none' as PermissionLevel]),
  ]);

const cyclePermission = (perm: PermissionLevel): PermissionLevel => {
  if (perm === 'none') return 'read';
  if (perm === 'read') return 'full';
  return 'none';
};

const permLabel = (perm: PermissionLevel): { label: string; cls: string } => {
  const map: Record<PermissionLevel, { label: string; cls: string }> = {
    'full': { label: 'Total', cls: 'bg-success/15 text-success' },
    'read': { label: 'Leitura', cls: 'bg-info/15 text-info' },
    'none': { label: '—', cls: 'bg-surface-container text-outline' },
  };
  return map[perm] || map['none'];
};

// Shared permissions panel component for modals
const PermissionsPanel: React.FC<{
  tempPermissions: Record<string, PermissionLevel>;
  setTempPermissions: React.Dispatch<React.SetStateAction<Record<string, PermissionLevel>>>;
  expandedPermModules: Set<string>;
  setExpandedPermModules: React.Dispatch<React.SetStateAction<Set<string>>>;
  title: string;
}> = ({ tempPermissions, setTempPermissions, expandedPermModules, setExpandedPermModules, title }) => (
  <div className="border border-border-subtle rounded-lg p-3 bg-surface-container-low/30">
    <div className="flex items-center justify-between mb-2">
      <span className="font-bold text-primary uppercase text-[10px] tracking-wider">{title}</span>
      <div className="flex gap-1">
        <button type="button" onClick={() => setTempPermissions(Object.fromEntries([...allScreens.map(s => [s.id, 'full' as PermissionLevel]), ...allTabKeys.map(k => [k, 'full' as PermissionLevel])]))} className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded font-bold cursor-pointer hover:bg-success/20">Marcar Tudo</button>
        <button type="button" onClick={() => setTempPermissions(emptyPerms())} className="text-[10px] bg-surface-container text-outline px-2 py-0.5 rounded font-bold cursor-pointer hover:bg-surface-container-high">Limpar</button>
      </div>
    </div>
    <div className="max-h-56 overflow-y-auto space-y-0.5 drawer-scroll">
      {PERMISSIONS_CATALOG.map((mod) => {
        const isExpanded = expandedPermModules.has(mod.id);
        const activeCount = mod.screens.filter(s => tempPermissions[s.id] !== 'none').length;
        return (
          <div key={mod.id}>
            <button
              type="button"
              onClick={() => setExpandedPermModules(prev => {
                const ns = new Set(prev);
                if (ns.has(mod.id)) ns.delete(mod.id);
                else ns.add(mod.id);
                return ns;
              })}
              className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-surface-container-low rounded text-xs font-bold text-primary cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                {mod.label}
              </span>
              <span className="text-[10px] text-outline font-medium">{activeCount}/{mod.screens.length} telas</span>
            </button>
            {isExpanded && (
              <div className="ml-5 pl-2 border-l border-border-subtle space-y-0.5">
                {mod.screens.map((screen) => {
                  const perm = tempPermissions[screen.id] || 'none';
                  const p = permLabel(perm);
                  return (
                    <div key={screen.id} className="px-2 py-1">
                      <div className="flex items-center justify-between hover:bg-surface-container-low/50 rounded">
                        <span className="text-[11px] font-medium text-on-surface">{screen.label}</span>
                        <button
                          type="button"
                          onClick={() => setTempPermissions(prev => ({ ...prev, [screen.id]: cyclePermission(prev[screen.id] || 'none') }))}
                          className={`${p.cls} px-2 py-0.5 rounded-full text-[9px] font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          {p.label}
                        </button>
                      </div>
                      {screen.tabs.length > 0 && (
                        <div className="ml-3 mt-1 space-y-0.5">
                          {screen.tabs.map((tabLabel) => {
                            const tabKey = `${screen.id}::${tabLabel}`;
                            const tabPerm = tempPermissions[tabKey] || 'none';
                            const tp = permLabel(tabPerm);
                            return (
                              <div key={tabLabel} className="flex items-center justify-between hover:bg-surface-container-low/50 rounded px-1.5 py-0.5">
                                <span className="text-[10px] text-on-surface-variant flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-outline" />
                                  {tabLabel}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setTempPermissions(prev => ({ ...prev, [tabKey]: cyclePermission(prev[tabKey] || 'none') }))}
                                  className={`${tp.cls} px-1.5 py-0.5 rounded-full text-[9px] font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                                >
                                  {tp.label}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export const UtilizadoresPermissoesView: React.FC<Props> = ({ onShowToast }) => {
  const { structures, userAccesses, setUserAccesses } = useAccess();
  const [tab, setTab] = useState<Tab>('utilizadores');
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [groups, setGroups] = useState<GroupItem[]>(initialGroups);
  const [logs] = useState<LogItem[]>(initialLogs);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterPerfil, setFilterPerfil] = useState('Todos');
  const [filterNivel, setFilterNivel] = useState('Todos');

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [batchGroupModalOpen, setBatchGroupModalOpen] = useState(false);
  const [selectedBatchGroup, setSelectedBatchGroup] = useState('Secretaria Académica');

  const [wizardTarget, setWizardTarget] = useState<WizardTarget | null>(null);
  const [userModal, setUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<UserItem | null>(null);
  const [passwordModal, setPasswordModal] = useState<UserItem | null>(null);
  const [groupModal, setGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState<GroupItem | null>(null);

  const [userForm, setUserForm] = useState({
    nome: '',
    email: '',
    perfil: 'Professor',
    grupo: 'Corpo Docente',
    estado: 'Ativo' as UserItem['estado'],
    acessoConsolidado: true,
    estruturasAutorizadas: [] as string[],
    estruturaPrincipalId: 'str-01',
  });
  const [groupForm, setGroupForm] = useState({ nome: '', descricao: '', estado: 'Ativo' as GroupItem['estado'] });
  const [newPassword, setNewPassword] = useState('');

  // Permissions state: Record<groupId/userId, Record<screenId, PermissionLevel>>
  const [groupPermissions, setGroupPermissions] = useState<Record<string, Record<string, PermissionLevel>>>(() => {
    const base: Record<string, Record<string, PermissionLevel>> = {};
    const fullPerms = Object.fromEntries(allScreens.map(s => [s.id, 'full' as PermissionLevel]));
    base['g1'] = { ...fullPerms };
    base['g2'] = Object.fromEntries(allScreens.map(s => [s.id, (['estudantes', 'turmas', 'config_academicas', 'gestao_documental'].includes(s.id) ? 'full' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g3'] = Object.fromEntries(allScreens.map(s => [s.id, (['estudantes', 'turmas', 'professores', 'professor_portal', 'aluno_portal'].includes(s.id) ? 'read' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g4'] = Object.fromEntries(allScreens.map(s => [s.id, (['gestao_financeira'].includes(s.id) ? 'full' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g5'] = Object.fromEntries(allScreens.map(s => [s.id, (s.id === 'biblioteca' ? 'full' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g6'] = Object.fromEntries(allScreens.map(s => [s.id, (s.id === 'rh_colaboradores' ? 'full' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g7'] = Object.fromEntries(allScreens.map(s => [s.id, (['comunicacao', 'cms'].includes(s.id) ? 'full' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g8'] = Object.fromEntries(allScreens.map(s => [s.id, (s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    return base;
  });
  const [userPermissions, setUserPermissions] = useState<Record<string, Record<string, PermissionLevel>>>({});

  // Temp permissions for modal editing
  const [tempPermissions, setTempPermissions] = useState<Record<string, PermissionLevel>>(emptyPerms);
  const [expandedPermModules, setExpandedPermModules] = useState<Set<string>>(new Set());
  const [expandedMatrixScreens, setExpandedMatrixScreens] = useState<Set<string>>(new Set());
  const [openActionMenu, setOpenActionMenu] = useState<{ type: 'user' | 'group'; id: string } | null>(null);

  const activeCount = users.filter((u) => u.estado === 'Ativo').length;
  const inactiveCount = users.filter((u) => u.estado === 'Inativo').length;
  const blockedCount = users.filter((u) => u.estado === 'Bloqueado').length;
  const groupCount = groups.filter((g) => g.estado === 'Ativo').length;

  const openCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      nome: '',
      email: '',
      perfil: 'Professor',
      grupo: 'Corpo Docente',
      estado: 'Ativo',
      acessoConsolidado: true,
      estruturasAutorizadas: structures.map(s => s.id),
      estruturaPrincipalId: structures[0]?.id || 'str-01',
    });
    setTempPermissions(emptyPerms());
    setExpandedPermModules(new Set());
    setUserModal(true);
  };

  const openEditUser = (user: UserItem) => {
    setEditingUser(user);
    setUserForm({
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      grupo: user.grupo,
      estado: user.estado,
      acessoConsolidado: user.acessoConsolidado ?? true,
      estruturasAutorizadas: user.estruturasAutorizadas ?? structures.map(s => s.id),
      estruturaPrincipalId: user.estruturaPrincipalId ?? (structures[0]?.id || 'str-01'),
    });
    setTempPermissions(userPermissions[user.id] ? { ...userPermissions[user.id] } : emptyPerms());
    setExpandedPermModules(new Set());
    setUserModal(true);
  };

  const saveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = editingUser ? editingUser.id : `u${Date.now()}`;
    const updatedUserData: UserItem = {
      id: userId,
      nome: userForm.nome,
      email: userForm.email,
      perfil: userForm.perfil,
      grupo: userForm.grupo,
      estado: userForm.estado,
      acessoConsolidado: userForm.acessoConsolidado,
      estruturasAutorizadas: userForm.estruturasAutorizadas,
      estruturaPrincipalId: userForm.estruturaPrincipalId,
      ultimoAcesso: editingUser ? editingUser.ultimoAcesso : 'Nunca',
      criado: editingUser ? editingUser.criado : '10 Ago 2026',
    };

    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? updatedUserData : u)));
      onShowToast(`Utilizador "${userForm.nome}" atualizado com sucesso!`);
    } else {
      setUsers([updatedUserData, ...users]);
      onShowToast(`Utilizador "${userForm.nome}" criado com sucesso!`);
    }

    setUserPermissions({ ...userPermissions, [userId]: tempPermissions });

    // Synchronize UserStructureAccess in AccessContext
    const newAccesses = userAccesses.filter(a => a.userId !== userId);
    if (userForm.acessoConsolidado) {
      newAccesses.push({ id: `acc-${Date.now()}-global`, userId, institutionId: 'inst-01', structureId: undefined, isPrimary: true });
    } else {
      userForm.estruturasAutorizadas.forEach(structId => {
        newAccesses.push({
          id: `acc-${Date.now()}-${structId}`,
          userId,
          institutionId: 'inst-01',
          structureId: structId,
          isPrimary: structId === userForm.estruturaPrincipalId,
        });
      });
    }
    setUserAccesses(newAccesses);

    setUserModal(false);
  };

  const toggleUserStatus = (user: UserItem) => {
    const newEstado = user.estado === 'Ativo' ? 'Inativo' : 'Ativo';
    setUsers(users.map((u) => (u.id === user.id ? { ...u, estado: newEstado } : u)));
    onShowToast(`Utilizador "${user.nome}" ${newEstado === 'Ativo' ? 'ativado' : 'desativado'}.`);
  };

  const removeUser = () => {
    if (!confirmDeleteUser) return;
    setUsers(users.filter((u) => u.id !== confirmDeleteUser.id));
    onShowToast(`Utilizador "${confirmDeleteUser.nome}" removido.`);
    setConfirmDeleteUser(null);
  };

  const changePassword = () => {
    if (!passwordModal || !newPassword.trim()) return;
    onShowToast(`Palavra-passe de "${passwordModal.nome}" alterada com sucesso!`);
    setPasswordModal(null);
    setNewPassword('');
  };

  const openCreateGroup = () => {
    setEditingGroup(null);
    setGroupForm({ nome: '', descricao: '', estado: 'Ativo' });
    setTempPermissions(emptyPerms());
    setExpandedPermModules(new Set());
    setGroupModal(true);
  };

  const openEditGroup = (group: GroupItem) => {
    setEditingGroup(group);
    setGroupForm({ nome: group.nome, descricao: group.descricao, estado: group.estado });
    setTempPermissions(groupPermissions[group.id] ? { ...groupPermissions[group.id] } : emptyPerms());
    setExpandedPermModules(new Set());
    setGroupModal(true);
  };

  const saveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const permCount = Object.values(tempPermissions).filter(p => p !== 'none').length;
    if (editingGroup) {
      setGroups(groups.map((g) => (g.id === editingGroup.id ? { ...g, ...groupForm, permissoes: permCount } : g)));
      setGroupPermissions({ ...groupPermissions, [editingGroup.id]: tempPermissions });
      onShowToast(`Grupo "${groupForm.nome}" atualizado com sucesso!`);
    } else {
      const newGroup: GroupItem = {
        id: `g${Date.now()}`,
        nome: groupForm.nome,
        descricao: groupForm.descricao,
        membros: 0,
        estado: groupForm.estado,
        permissoes: permCount,
      };
      setGroups([newGroup, ...groups]);
      setGroupPermissions({ ...groupPermissions, [newGroup.id]: tempPermissions });
      onShowToast(`Grupo "${groupForm.nome}" criado com sucesso!`);
    }
    setGroupModal(false);
  };

  const toggleGroupStatus = (group: GroupItem) => {
    const newEstado = group.estado === 'Ativo' ? 'Inativo' : 'Ativo';
    setGroups(groups.map((g) => (g.id === group.id ? { ...g, estado: newEstado } : g)));
    onShowToast(`Grupo "${group.nome}" ${newEstado === 'Ativo' ? 'ativado' : 'desativado'}.`);
  };

  const removeGroup = () => {
    if (!confirmDeleteGroup) return;
    setGroups(groups.filter((g) => g.id !== confirmDeleteGroup.id));
    onShowToast(`Grupo "${confirmDeleteGroup.nome}" removido.`);
    setConfirmDeleteGroup(null);
  };

  const cloneGroup = (group: GroupItem) => {
    const clonedId = `g_${Date.now()}`;
    const clonedGroup: GroupItem = {
      id: clonedId,
      nome: `${group.nome} (Cópia)`,
      descricao: `Cópia do perfil ${group.nome}`,
      membros: 0,
      estado: 'Ativo',
      permissoes: group.permissoes,
    };
    setGroups([...groups, clonedGroup]);
    setGroupPermissions({
      ...groupPermissions,
      [clonedId]: { ...(groupPermissions[group.id] || {}) },
    });
    onShowToast(`Perfil "${group.nome}" clonado com sucesso!`);
  };

  const filteredUsers = useMemo(() => users.filter((u) => {
    const matchSearch = `${u.nome} ${u.email} ${u.perfil} ${u.grupo}`.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === 'Todos' || u.estado === filterEstado;
    const matchPerfil = filterPerfil === 'Todos' || u.perfil === filterPerfil;
    return matchSearch && matchEstado && matchPerfil;
  }), [users, search, filterEstado, filterPerfil]);

  const filteredGroups = useMemo(() => groups.filter((g) => {
    const matchSearch = `${g.nome} ${g.descricao}`.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === 'Todos' || g.estado === filterEstado;
    return matchSearch && matchEstado;
  }), [groups, search, filterEstado]);

  const filteredLogs = useMemo(() => logs.filter((l) => {
    const matchSearch = `${l.utilizador} ${l.acao} ${l.modulo} ${l.ip}`.toLowerCase().includes(search.toLowerCase());
    const matchNivel = filterNivel === 'Todos' || l.nivel === filterNivel;
    return matchSearch && matchNivel;
  }), [logs, search, filterNivel]);

  const perfiles = ['Todos', 'Administrador', 'Gestor Académico', 'Professor', 'Tesoureiro', 'Bibliotecário', 'Gestor RH', 'Editor CMS', 'Rececionista'];
  const activeGroups = groups.filter(g => g.estado === 'Ativo');

  if (wizardTarget) {
    return (
      <PermissionWizardView
        target={wizardTarget}
        onBack={() => setWizardTarget(null)}
        onSave={(id, data) => {
          onShowToast(`Permissões salvas no Vendaia Governance® para ${wizardTarget.name}!`);
        }}
        onShowToast={onShowToast}
      />
    );
  }

  return (
    <div className="mt-header-height w-full flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary stroke-[1.75]" />
          Utilizadores e Permissões
        </h1>
        <div className="flex items-center gap-2">
          {tab === 'utilizadores' && (
            <button onClick={openCreateUser} className="bg-primary hover:bg-primary-container text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer">
              <UserPlus className="w-4 h-4 stroke-[2]" />Criar Utilizador
            </button>
          )}
          {tab === 'grupos' && (
            <button onClick={openCreateGroup} className="bg-primary hover:bg-primary-container text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer">
              <Plus className="w-4 h-4 stroke-[2]" />Criar Grupo
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards — Enterprise Compact (68px height) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-border-subtle/30 rounded-lg p-3.5 h-[68px] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Utilizadores Ativos</p>
            <p className="text-lg font-bold text-primary leading-tight mt-0.5">{activeCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle/30 rounded-lg p-3.5 h-[68px] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Inativos / Bloqueados</p>
            <p className="text-lg font-bold text-primary leading-tight mt-0.5">{inactiveCount + blockedCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Power className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle/30 rounded-lg p-3.5 h-[68px] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Grupos Ativos</p>
            <p className="text-lg font-bold text-primary leading-tight mt-0.5">{groupCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <UserCog className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle/30 rounded-lg p-3.5 h-[68px] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Registos de Auditoria</p>
            <p className="text-lg font-bold text-primary leading-tight mt-0.5">{logs.length}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ScrollText className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        {([
          { key: 'utilizadores', label: 'Utilizadores', icon: <Users className="w-4 h-4" /> },
          { key: 'grupos', label: 'Grupos de Utilizadores', icon: <UserCog className="w-4 h-4" /> },
          { key: 'auditoria', label: 'Auditoria & Logs', icon: <ScrollText className="w-4 h-4" /> },
        ] as { key: Tab; label: string; icon: React.ReactNode }[]).map((item) => (
          <button key={item.key} onClick={() => { setTab(item.key); setSearch(''); setFilterEstado('Todos'); setFilterPerfil('Todos'); setFilterNivel('Todos'); }} className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${tab === item.key ? 'bg-primary text-surface-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`}>
            {item.icon}{item.label}
          </button>
        ))}
      </div>

      {/* Tab: Utilizadores */}
      {tab === 'utilizadores' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <select value={filterPerfil} onChange={(e) => setFilterPerfil(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-primary py-1 cursor-pointer">
                {perfiles.map((p) => <option key={p} value={p}>{p === 'Todos' ? 'Perfil: Todos' : p}</option>)}
              </select>
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-primary py-1 cursor-pointer">
                <option value="Todos">Estado: Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar utilizadores..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium" />
            </div>
          </div>

          {/* Banner de Ações em Lote (Estilo Fiel à Imagem de Referência) */}
          {selectedUserIds.length > 0 && (
            <div className="bg-[#FAF0E8] border border-[#E8D7C8] rounded-t-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b-0 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-[#4A382C] flex items-center gap-1.5">
                Acções em Lote Disponíveis:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBatchGroupModalOpen(true)}
                  className="bg-surface-white border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5 text-on-surface-variant" /> Alterar Grupo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsers(users.map(u => selectedUserIds.includes(u.id) ? { ...u, estado: 'Ativo' } : u));
                    onShowToast(`${selectedUserIds.length} utilizadores ativados com sucesso.`);
                    setSelectedUserIds([]);
                  }}
                  className="bg-[#047857] hover:bg-[#0369a1] text-surface-white rounded-md px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ativar ({selectedUserIds.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsers(users.map(u => selectedUserIds.includes(u.id) ? { ...u, estado: 'Inativo' } : u));
                    onShowToast(`${selectedUserIds.length} utilizadores suspensos com sucesso.`);
                    setSelectedUserIds([]);
                  }}
                  className="bg-[#B45309] hover:bg-[#92400E] text-surface-white rounded-md px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <Power className="w-3.5 h-3.5" /> Suspender ({selectedUserIds.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUserIds([])}
                  className="bg-surface-white border border-outline-variant/30 text-outline hover:bg-surface-container rounded-md px-3 py-1.5 text-xs font-medium shadow-2xs cursor-pointer transition-colors"
                >
                  Desmarcar
                </button>
              </div>
            </div>
          )}

          <div className={`overflow-x-auto border border-border-subtle ${selectedUserIds.length > 0 ? 'rounded-b-lg border-t-0' : 'rounded-lg'}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-[11px] font-bold text-outline uppercase tracking-wider">
                  <th className="px-3.5 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                      onChange={() => {
                        if (selectedUserIds.length === filteredUsers.length) {
                          setSelectedUserIds([]);
                        } else {
                          setSelectedUserIds(filteredUsers.map(u => u.id));
                        }
                      }}
                      className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                    />
                  </th>
                  <th className="px-3.5 py-3 text-left">Utilizador</th>
                  <th className="px-3.5 py-3 text-left">Perfil / Grupo</th>
                  <th className="px-3.5 py-3 text-left">Segurança & Sessões</th>
                  <th className="px-3.5 py-3 text-center">Estado & Último Acesso</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.length ? filteredUsers.map((u) => {
                  const isSelected = selectedUserIds.includes(u.id);
                  return (
                  <tr key={u.id} className={`hover:bg-surface-container-low/40 transition-colors ${isSelected ? 'bg-[#FDF8F5]' : ''}`}>
                    <td className="px-3.5 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            setSelectedUserIds(selectedUserIds.filter(id => id !== u.id));
                          } else {
                            setSelectedUserIds([...selectedUserIds, u.id]);
                          }
                        }}
                        className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#8C4303] text-surface-white flex items-center justify-center font-bold text-xs shrink-0">
                          {perfilIcon(u.nome)}
                        </div>
                        <div>
                          <p className="font-bold text-primary">{u.nome}</p>
                          <p className="text-[11px] text-outline">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <span className="bg-[#FFEBEB] text-[#900C3F] px-2 py-0.5 rounded text-[10px] font-bold">
                          {u.perfil}
                        </span>
                        <span className="text-xs text-on-surface-variant flex items-center gap-1">
                          <UserCog className="w-3 h-3 text-outline" /> {u.grupo}
                        </span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                          <LockKeyhole className="w-3 h-3 text-emerald-600" /> MFA OK
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 1 Sessão
                        </span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`${statusChip(u.estado)} px-2.5 py-0.5 rounded-full text-[11px] font-bold`}>
                          {u.estado}
                        </span>
                        <span className="text-[10px] text-outline">{u.ultimoAcesso}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-right relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu?.id === u.id ? null : { type: 'user', id: u.id }); }}
                        className={`p-1.5 text-outline hover:text-primary rounded-lg transition-colors cursor-pointer ${openActionMenu?.id === u.id ? 'bg-surface-container-high text-primary' : 'hover:bg-surface-container'}`}
                        title="Ações"
                      >
                        <MoreVertical className="w-4 h-4 stroke-[2]" />
                      </button>

                      {openActionMenu?.type === 'user' && openActionMenu.id === u.id && (
                        <>
                          <div className="fixed inset-0 z-20 cursor-default" onClick={(e) => { e.stopPropagation(); setOpenActionMenu(null); }} />
                          <div className="absolute right-3 top-10 z-30 w-52 bg-surface-white border border-border-subtle rounded-xl shadow-xl py-1 text-left text-xs divide-y divide-border-subtle animate-in fade-in zoom-in-95 duration-100">
                            <div className="py-1">
                              <button
                                onClick={() => { setWizardTarget({ type: 'user', id: u.id, name: u.nome, role: u.perfil }); setOpenActionMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-primary/10 hover:text-primary font-medium cursor-pointer transition-colors"
                              >
                                <LockKeyhole className="w-4 h-4 text-primary stroke-[2]" />
                                <span>Atribuir Permissões</span>
                              </button>
                              <button
                                onClick={() => { openEditUser(u); setOpenActionMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-primary/10 hover:text-primary font-medium cursor-pointer transition-colors"
                              >
                                <Pencil className="w-4 h-4 text-primary stroke-[2]" />
                                <span>Editar Utilizador</span>
                              </button>
                              <button
                                onClick={() => { setPasswordModal(u); setOpenActionMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-info/10 hover:text-info font-medium cursor-pointer transition-colors"
                              >
                                <KeyRound className="w-4 h-4 text-info stroke-[2]" />
                                <span>Alterar Palavra-passe</span>
                              </button>
                              <button
                                onClick={() => { toggleUserStatus(u); setOpenActionMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-warning/10 hover:text-warning font-medium cursor-pointer transition-colors"
                              >
                                <Power className="w-4 h-4 text-warning stroke-[2]" />
                                <span>{u.estado === 'Ativo' ? 'Desativar Utilizador' : 'Ativar Utilizador'}</span>
                              </button>
                            </div>
                            <div className="py-1">
                              <button
                                onClick={() => { setConfirmDeleteUser(u); setOpenActionMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-error hover:bg-error/10 font-bold cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-error stroke-[2]" />
                                <span>Remover Utilizador</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                  <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant font-medium">Nenhum utilizador encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Grupos */}
      {tab === 'grupos' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-primary py-1 cursor-pointer">
              <option value="Todos">Estado: Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar grupos..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium" />
            </div>
          </div>

          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left">Grupo</th>
                  <th className="px-3.5 py-3 text-left">Descrição</th>
                  <th className="px-3.5 py-3 text-center">Membros</th>
                  <th className="px-3.5 py-3 text-center">Permissões</th>
                  <th className="px-3.5 py-3 text-center">Estado</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredGroups.length ? filteredGroups.map((g) => {
                  const permCount = groupPermissions[g.id] ? Object.values(groupPermissions[g.id]).filter(p => p !== 'none').length : g.permissoes;
                  return (
                    <tr key={g.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center"><UserCog className="w-4 h-4" /></div>
                          <span className="font-bold text-primary">{g.nome}</span>
                        </div>
                      </td>
                      <td className="px-3.5 py-3 text-on-surface-variant">{g.descricao}</td>
                      <td className="px-3.5 py-3 text-center font-bold text-primary">{g.membros}</td>
                      <td className="px-3.5 py-3 text-center"><span className="bg-info/10 text-info px-2 py-0.5 rounded text-[10px] font-bold">{permCount} perms</span></td>
                      <td className="px-3.5 py-3 text-center"><span className={`${statusChip(g.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{g.estado}</span></td>
                      <td className="px-3.5 py-3 text-right relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu?.id === g.id ? null : { type: 'group', id: g.id }); }}
                        className={`p-1.5 text-outline hover:text-primary rounded-lg transition-colors cursor-pointer ${openActionMenu?.id === g.id ? 'bg-surface-container-high text-primary' : 'hover:bg-surface-container'}`}
                        title="Ações"
                      >
                        <MoreVertical className="w-4 h-4 stroke-[2]" />
                      </button>

                      {openActionMenu?.type === 'group' && openActionMenu.id === g.id && (
                        <>
                          <div className="fixed inset-0 z-20 cursor-default" onClick={(e) => { e.stopPropagation(); setOpenActionMenu(null); }} />
                          <div className="absolute right-3 top-10 z-30 w-52 bg-surface-white border border-border-subtle rounded-xl shadow-xl py-1 text-left text-xs divide-y divide-border-subtle animate-in fade-in zoom-in-95 duration-100">
                            <div className="py-1">
                              <button
                                onClick={() => { setWizardTarget({ type: 'group', id: g.id, name: g.nome }); setOpenActionMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-primary/10 hover:text-primary font-medium cursor-pointer transition-colors"
                              >
                                <LockKeyhole className="w-4 h-4 text-primary stroke-[2]" />
                                <span>Atribuir Permissões</span>
                              </button>
                              <button
                                onClick={() => { cloneGroup(g); setOpenActionMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-primary/10 hover:text-primary font-medium cursor-pointer transition-colors"
                              >
                                <Copy className="w-4 h-4 text-primary stroke-[2]" />
                                <span>Clonar Perfil</span>
                              </button>
                              <button
                                onClick={() => { openEditGroup(g); setOpenActionMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-primary/10 hover:text-primary font-medium cursor-pointer transition-colors"
                              >
                                <Pencil className="w-4 h-4 text-primary stroke-[2]" />
                                <span>Editar Grupo</span>
                              </button>
                              <button
                                onClick={() => { toggleGroupStatus(g); setOpenActionMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-on-surface-variant hover:bg-warning/10 hover:text-warning font-medium cursor-pointer transition-colors"
                              >
                                <Power className="w-4 h-4 text-warning stroke-[2]" />
                                <span>{g.estado === 'Ativo' ? 'Desativar Grupo' : 'Ativar Grupo'}</span>
                              </button>
                            </div>
                            <div className="py-1">
                              <button
                                onClick={() => { setConfirmDeleteGroup(g); setOpenActionMenu(null); }}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-error hover:bg-error/10 font-bold cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-error stroke-[2]" />
                                <span>Remover Grupo</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant font-medium">Nenhum grupo encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* Tab: Auditoria & Logs */}
      {tab === 'auditoria' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <select value={filterNivel} onChange={(e) => setFilterNivel(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-primary py-1 cursor-pointer">
                <option value="Todos">Nível: Todos</option>
                <option value="Info">Info</option>
                <option value="Aviso">Aviso</option>
                <option value="Crítico">Crítico</option>
              </select>
              <button onClick={() => onShowToast('Registos de auditoria exportados em PDF.')} className="border border-border-subtle px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-surface-container transition-all"><FileText className="w-3.5 h-3.5" />Exportar PDF</button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar logs..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium" />
            </div>
          </div>

          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left">Utilizador</th>
                  <th className="px-3.5 py-3 text-left">Ação</th>
                  <th className="px-3.5 py-3 text-left">Módulo</th>
                  <th className="px-3.5 py-3 text-left">IP</th>
                  <th className="px-3.5 py-3 text-left">Data</th>
                  <th className="px-3.5 py-3 text-left">Hora</th>
                  <th className="px-3.5 py-3 text-center">Nível</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredLogs.length ? filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-3.5 py-3 font-bold text-primary">{l.utilizador}</td>
                    <td className="px-3.5 py-3 text-on-surface-variant">{l.acao}</td>
                    <td className="px-3.5 py-3"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{l.modulo}</span></td>
                    <td className="px-3.5 py-3 text-outline font-mono text-[11px]">{l.ip}</td>
                    <td className="px-3.5 py-3 text-outline">{l.data}</td>
                    <td className="px-3.5 py-3 text-outline">{l.hora}</td>
                    <td className="px-3.5 py-3 text-center"><span className={`${nivelChip(l.nivel)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{l.nivel}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant font-medium">Nenhum registo encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Criar/Editar Utilizador */}
      {userModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-primary px-5 py-4 flex items-center justify-between border-b border-primary-container shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary-container/20 border border-secondary-container/40 text-secondary-container flex items-center justify-center font-bold shrink-0 shadow-inner">
                  <UserPlus className="w-4.5 h-4.5 text-secondary-container stroke-[2.25]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-surface-white leading-tight">
                    {editingUser ? `Editar Utilizador: ${editingUser.nome}` : 'Criar Utilizador'}
                  </h2>
                  <p className="text-[11px] text-[#b5c7ef]">Preencha os dados do utilizador e atribua o acesso às estruturas.</p>
                </div>
              </div>
              <button onClick={() => setUserModal(false)} className="text-surface-white/70 hover:text-surface-white p-1.5 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <form onSubmit={saveUser} className="p-6 space-y-4 text-xs">
              <label className="block text-outline font-bold">Nome Completo<input type="text" required value={userForm.nome} onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none" /></label>
              <label className="block text-outline font-bold">Email<input type="email" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-outline font-bold">Perfil<select value={userForm.perfil} onChange={(e) => setUserForm({ ...userForm, perfil: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none bg-surface-white">
                  <option>Administrador</option><option>Gestor Académico</option><option>Professor</option><option>Tesoureiro</option><option>Bibliotecário</option><option>Gestor RH</option><option>Editor CMS</option><option>Rececionista</option>
                </select></label>
                <label className="block text-outline font-bold">Grupo<select value={userForm.grupo} onChange={(e) => setUserForm({ ...userForm, grupo: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none bg-surface-white">
                  <option>Direção Geral</option><option>Secretaria Académica</option><option>Corpo Docente</option><option>Serviços Financeiros</option><option>Biblioteca</option><option>Recursos Humanos</option><option>Comunicação</option><option>Receção</option>
                </select></label>
              </div>
              <label className="block text-outline font-bold">Estado<select value={userForm.estado} onChange={(e) => setUserForm({ ...userForm, estado: e.target.value as UserItem['estado'] })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none bg-surface-white">
                <option>Ativo</option><option>Inativo</option><option>Bloqueado</option>
              </select></label>

              {/* Painel de Atribuição de Estruturas / Unidades */}
              <div className="border border-border-subtle rounded-lg p-3 bg-surface-container-low/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    Acesso a Estruturas / Unidades
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={userForm.acessoConsolidado}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setUserForm({
                          ...userForm,
                          acessoConsolidado: isChecked,
                          estruturasAutorizadas: isChecked ? structures.map(s => s.id) : [structures[0]?.id || 'str-01'],
                        });
                      }}
                      className="rounded border-border-subtle text-primary focus:ring-primary cursor-pointer"
                    />
                    Acesso Consolidado (Todas as Estruturas)
                  </label>
                </div>

                {!userForm.acessoConsolidado && (
                  <div className="mt-2 space-y-2 pt-2 border-t border-border-subtle">
                    <p className="text-[10px] text-on-surface-variant font-medium">Selecione as unidades autorizadas e defina a estrutura primária do utilizador:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto drawer-scroll">
                      {structures.map((struct) => {
                        const isSelected = userForm.estruturasAutorizadas.includes(struct.id);
                        const isPrimary = userForm.estruturaPrincipalId === struct.id;
                        return (
                          <div key={struct.id} className="flex items-center justify-between p-2 bg-surface-white border border-border-subtle rounded text-[11px]">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  let next = [...userForm.estruturasAutorizadas];
                                  if (e.target.checked) {
                                    next.push(struct.id);
                                  } else {
                                    next = next.filter(id => id !== struct.id);
                                  }
                                  setUserForm({ ...userForm, estruturasAutorizadas: next });
                                }}
                                className="rounded border-border-subtle text-primary focus:ring-primary cursor-pointer"
                              />
                              {struct.nome}
                            </label>
                            {isSelected && (
                              <button
                                type="button"
                                onClick={() => setUserForm({ ...userForm, estruturaPrincipalId: struct.id })}
                                className={`text-[9px] px-1.5 py-0.5 rounded font-bold cursor-pointer transition-all ${isPrimary ? 'bg-primary text-surface-white' : 'bg-surface-container text-outline hover:bg-surface-container-high'}`}
                              >
                                {isPrimary ? '★ Primária' : 'Tornar Primária'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4 mt-4">
                <button type="button" onClick={() => setUserModal(false)} className="text-outline hover:text-primary font-semibold text-xs px-4 py-2 rounded-lg hover:bg-surface-container transition-all cursor-pointer">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-container text-surface-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2">{editingUser ? 'Guardar Utilizador' : 'Criar Utilizador'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Alterar Palavra-passe */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md overflow-hidden my-8">
            <div className="bg-primary px-5 py-4 flex items-center justify-between border-b border-primary-container shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary-container/20 border border-secondary-container/40 text-secondary-container flex items-center justify-center font-bold shrink-0 shadow-inner">
                  <KeyRound className="w-4.5 h-4.5 text-secondary-container stroke-[2.25]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-surface-white leading-tight">Alterar Palavra-passe</h2>
                  <p className="text-[11px] text-[#b5c7ef]">Defina uma nova palavra-passe de acesso.</p>
                </div>
              </div>
              <button onClick={() => { setPasswordModal(null); setNewPassword(''); }} className="text-surface-white/70 hover:text-surface-white p-1.5 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs text-on-surface-variant mb-4">A alterar a palavra-passe de <strong className="text-primary">{passwordModal.nome}</strong> ({passwordModal.email}).</p>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova palavra-passe" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none mb-4" />
              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4">
                <button onClick={() => { setPasswordModal(null); setNewPassword(''); }} className="text-outline hover:text-primary font-semibold text-xs px-4 py-2 rounded-lg hover:bg-surface-container transition-all cursor-pointer">Cancelar</button>
                <button onClick={changePassword} className="bg-primary hover:bg-primary-container text-surface-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2">Alterar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Utilizador */}
      {confirmDeleteUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md overflow-hidden my-8">
            <div className="bg-primary px-5 py-4 flex items-center justify-between border-b border-primary-container shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-error/20 border border-error/40 text-error-container flex items-center justify-center font-bold shrink-0 shadow-inner">
                  <AlertTriangle className="w-4.5 h-4.5 text-error stroke-[2.25]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-surface-white leading-tight">Confirmar Remoção</h2>
                  <p className="text-[11px] text-[#b5c7ef]">Esta ação é irreversível.</p>
                </div>
              </div>
              <button onClick={() => setConfirmDeleteUser(null)} className="text-surface-white/70 hover:text-surface-white p-1.5 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs text-on-surface-variant mb-4">Esta ação não pode ser desfeita. Deseja remover o utilizador <strong className="text-primary">{confirmDeleteUser.nome}</strong>?</p>
              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4">
                <button onClick={() => setConfirmDeleteUser(null)} className="text-outline hover:text-primary font-semibold text-xs px-4 py-2 rounded-lg hover:bg-surface-container transition-all cursor-pointer">Cancelar</button>
                <button onClick={removeUser} className="bg-error hover:bg-error/90 text-surface-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2">Sim, Remover</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Criar/Editar Grupo */}
      {groupModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-primary px-5 py-4 flex items-center justify-between border-b border-primary-container shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary-container/20 border border-secondary-container/40 text-secondary-container flex items-center justify-center font-bold shrink-0 shadow-inner">
                  <UserCog className="w-4.5 h-4.5 text-secondary-container stroke-[2.25]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-surface-white leading-tight">
                    {editingGroup ? `Editar Grupo: ${editingGroup.nome}` : 'Criar Grupo de Utilizadores'}
                  </h2>
                  <p className="text-[11px] text-[#b5c7ef]">Defina o perfil de acesso e permissões do grupo.</p>
                </div>
              </div>
              <button onClick={() => setGroupModal(false)} className="text-surface-white/70 hover:text-surface-white p-1.5 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <form onSubmit={saveGroup} className="p-6 space-y-4 text-xs">
              <label className="block text-outline font-bold">Nome do Grupo<input type="text" required value={groupForm.nome} onChange={(e) => setGroupForm({ ...groupForm, nome: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none" /></label>
              <label className="block text-outline font-bold">Descrição<textarea rows={3} value={groupForm.descricao} onChange={(e) => setGroupForm({ ...groupForm, descricao: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none resize-none" /></label>
              <label className="block text-outline font-bold">Estado<select value={groupForm.estado} onChange={(e) => setGroupForm({ ...groupForm, estado: e.target.value as GroupItem['estado'] })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none bg-surface-white">
                <option>Ativo</option><option>Inativo</option>
              </select></label>

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4 mt-4">
                <button type="button" onClick={() => setGroupModal(false)} className="text-outline hover:text-primary font-semibold text-xs px-4 py-2 rounded-lg hover:bg-surface-container transition-all cursor-pointer">Cancelar</button>
                <button type="submit" className="bg-primary hover:bg-primary-container text-surface-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2">{editingGroup ? 'Guardar Grupo' : 'Criar Grupo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Grupo */}
      {confirmDeleteGroup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md overflow-hidden my-8">
            <div className="bg-primary px-5 py-4 flex items-center justify-between border-b border-primary-container shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-error/20 border border-error/40 text-error-container flex items-center justify-center font-bold shrink-0 shadow-inner">
                  <AlertTriangle className="w-4.5 h-4.5 text-error stroke-[2.25]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-surface-white leading-tight">Confirmar Remoção</h2>
                  <p className="text-[11px] text-[#b5c7ef]">Esta ação é irreversível.</p>
                </div>
              </div>
              <button onClick={() => setConfirmDeleteGroup(null)} className="text-surface-white/70 hover:text-surface-white p-1.5 rounded-lg hover:bg-surface-white/10 transition-colors cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs text-on-surface-variant mb-4">Esta ação não pode ser desfeita. Deseja remover o grupo <strong className="text-primary">{confirmDeleteGroup.nome}</strong>?</p>
              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4">
                <button onClick={() => setConfirmDeleteGroup(null)} className="text-outline hover:text-primary font-semibold text-xs px-4 py-2 rounded-lg hover:bg-surface-container transition-all cursor-pointer">Cancelar</button>
                <button onClick={removeGroup} className="bg-error hover:bg-error/90 text-surface-white px-5 py-2 rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2">Sim, Remover</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
