import React, { useMemo, useState } from 'react';
import { ActiveView } from '../types';
import { TriangleAlert as AlertTriangle, Award, Banknote, BookOpen, Briefcase, Building2, Calendar, CircleCheck as CheckCircle2, Clock, Download, Pencil as Edit3, FileText, FolderOpen, GraduationCap, Plus, Receipt, Search, Trash2, Users, X, UsersRound, Eye, FileSignature, UserCheck, Mail, Phone, BadgeCheck } from 'lucide-react';

interface Props { onSelectView: (view: ActiveView) => void; onShowToast: (msg: string) => void; }
type Tab = 'colaboradores' | 'departamentos' | 'avaliacoes' | 'formacao' | 'salarios' | 'ferias_faltas' | 'relatorios';
type EmployeeStatus = 'Ativo' | 'Inativo' | 'Férias' | 'Licença';
type ContractType = 'Indefinido' | 'Termo Certo' | 'Estágio' | 'Prestador de Serviços';

interface Employee {
  id: string;
  nome: string;
  funcao: string;
  departamento: string;
  contrato: ContractType;
  salarioBase: number;
  status: EmployeeStatus;
  dataAdmissao: string;
  email: string;
  contacto: string;
  avatar?: string;
}

const money = (value: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(value);

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'colaboradores', label: 'Colaboradores & Contratos', icon: <Users className="w-4 h-4" /> },
  { key: 'departamentos', label: 'Departamentos', icon: <Building2 className="w-4 h-4" /> },
  { key: 'avaliacoes', label: 'Avaliações', icon: <Award className="w-4 h-4" /> },
  { key: 'formacao', label: 'Formação', icon: <GraduationCap className="w-4 h-4" /> },
  { key: 'salarios', label: 'Salários & Vencimentos', icon: <Banknote className="w-4 h-4" /> },
  { key: 'ferias_faltas', label: 'Férias & Faltas', icon: <Calendar className="w-4 h-4" /> },
  { key: 'relatorios', label: 'Relatórios RH', icon: <BookOpen className="w-4 h-4" /> },
];

const initialEmployees: Employee[] = [
  { id: 'rh001', nome: 'Domingos Henriques', funcao: 'Professor de Matemática', departamento: 'Académico', contrato: 'Indefinido', salarioBase: 285000, status: 'Ativo', dataAdmissao: '12 Set 2021', email: 'domingoshenriques1@ispozango.com', contacto: '+244 923 456 789' },
  { id: 'rh002', nome: 'Sara Silva', funcao: 'Secretária Académica', departamento: 'Secretaria', contrato: 'Indefinido', salarioBase: 165000, status: 'Ativo', dataAdmissao: '03 Fev 2022', email: 'sara.silva@ispozango.com', contacto: '+244 912 345 678' },
  { id: 'rh003', nome: 'Carlos Mendes', funcao: 'Diretor Pedagógico', departamento: 'Direção', contrato: 'Indefinido', salarioBase: 420000, status: 'Ativo', dataAdmissao: '15 Ago 2020', email: 'carlos.mendes@ispozango.com', contacto: '+244 923 100 200' },
  { id: 'rh004', nome: 'Ana Catarina Mendes', funcao: 'Professora de Português', departamento: 'Académico', contrato: 'Termo Certo', salarioBase: 240000, status: 'Férias', dataAdmissao: '01 Set 2023', email: 'ana.mendes@ispozango.com', contacto: '+244 923 555 444' },
  { id: 'rh005', nome: 'Eduardo Jorge Lima', funcao: 'Técnico de Informática', departamento: 'Tecnologias', contrato: 'Estágio', salarioBase: 120000, status: 'Ativo', dataAdmissao: '10 Jan 2026', email: 'eduardo.lima@ispozango.com', contacto: '+244 933 222 111' },
  { id: 'rh006', nome: 'Beatriz Ferreira', funcao: 'Tesoureira', departamento: 'Financeiro', contrato: 'Indefinido', salarioBase: 210000, status: 'Licença', dataAdmissao: '22 Jun 2023', email: 'beatriz.ferreira@ispozango.com', contacto: '+244 944 333 222' },
  { id: 'rh007', nome: 'João Pinto', funcao: 'Coordenador de Tecnologia', departamento: 'Tecnologias', contrato: 'Indefinido', salarioBase: 350000, status: 'Ativo', dataAdmissao: '05 Mar 2021', email: 'joao.pinto@ispozango.com', contacto: '+244 923 777 888' },
  { id: 'rh008', nome: 'Marta Sousa', funcao: 'Professora de Ciências', departamento: 'Académico', contrato: 'Termo Certo', salarioBase: 230000, status: 'Ativo', dataAdmissao: '14 Set 2024', email: 'marta.sousa@ispozango.com', contacto: '+244 923 666 555' },
];

const initialDepartments = [
  { id: 'dep1', nome: 'Académico', responsavel: 'Carlos Mendes', colaboradores: 24, orcamento: 6800000 },
  { id: 'dep2', nome: 'Secretaria', responsavel: 'Sara Silva', colaboradores: 5, orcamento: 950000 },
  { id: 'dep3', nome: 'Direção', responsavel: 'Carlos Mendes', colaboradores: 3, orcamento: 1260000 },
  { id: 'dep4', nome: 'Tecnologias', responsavel: 'João Pinto', colaboradores: 6, orcamento: 2100000 },
  { id: 'dep5', nome: 'Financeiro', responsavel: 'Beatriz Ferreira', colaboradores: 4, orcamento: 840000 },
];

const initialEvaluations = [
  { id: 'ev1', colaborador: 'Domingos Henriques', periodo: '2025/2026', nota: 4.5, classificacao: 'Muito Bom', estado: 'Concluída' },
  { id: 'ev2', colaborador: 'Sara Silva', periodo: '2025/2026', nota: 4.8, classificacao: 'Excelente', estado: 'Concluída' },
  { id: 'ev3', colaborador: 'Carlos Mendes', periodo: '2025/2026', nota: 4.7, classificacao: 'Excelente', estado: 'Concluída' },
  { id: 'ev4', colaborador: 'Ana Catarina Mendes', periodo: '2025/2026', nota: 0, classificacao: '—', estado: 'Pendente' },
  { id: 'ev5', colaborador: 'Eduardo Jorge Lima', periodo: '2025/2026', nota: 0, classificacao: '—', estado: 'Pendente' },
];

const initialTrainings = [
  { id: 'f1', titulo: 'Pedagogia Digital e LMS Moodle', colaboradores: 12, data: '15 Set 2026', estado: 'Agendada' },
  { id: 'f2', titulo: 'Primeiros Socorros no Ambiente Escolar', colaboradores: 8, data: '02 Set 2026', estado: 'Concluída' },
  { id: 'f3', titulo: 'Gestão de Conflitos em Sala de Aula', colaboradores: 15, data: '20 Ago 2026', estado: 'Concluída' },
  { id: 'f4', titulo: 'Segurança de Dados e LGPD', colaboradores: 6, data: '28 Set 2026', estado: 'Agendada' },
];

const initialDocuments = [
  { id: 'doc1', tipo: 'Contrato de Trabalho', colaborador: 'Domingos Henriques', data: '12 Set 2021', estado: 'VALIDADO' },
  { id: 'doc2', tipo: 'Cópia de BI', colaborador: 'Sara Silva', data: '03 Fev 2022', estado: 'VALIDADO' },
  { id: 'doc3', tipo: 'Certificado de Habilitações', colaborador: 'Eduardo Jorge Lima', data: '10 Jan 2026', estado: 'PENDENTE' },
  { id: 'doc4', tipo: 'Atestado Médico', colaborador: 'Beatriz Ferreira', data: '22 Jun 2023', estado: 'VALIDADO' },
  { id: 'doc5', tipo: 'Registo Criminal', colaborador: 'Marta Sousa', data: '14 Set 2024', estado: 'EXPIRADO' },
];

const initialLeaves = [
  { id: 'lf1', colaborador: 'Ana Catarina Mendes', tipo: 'Férias', inicio: '01 Ago 2026', fim: '21 Ago 2026', dias: 21, estado: 'Aprovado' },
  { id: 'lf2', colaborador: 'Beatriz Ferreira', tipo: 'Licença Médica', inicio: '05 Ago 2026', fim: '30 Ago 2026', dias: 25, estado: 'Aprovado' },
  { id: 'lf3', colaborador: 'Eduardo Jorge Lima', tipo: 'Falta Justificada', inicio: '08 Ago 2026', fim: '08 Ago 2026', dias: 1, estado: 'Pendente' },
  { id: 'lf4', colaborador: 'Marta Sousa', tipo: 'Férias', inicio: '15 Set 2026', fim: '05 Out 2026', dias: 21, estado: 'Pendente' },
];

const statusChip = (status: string) => {
  const map: Record<string, string> = {
    'Ativo': 'bg-success/15 text-success', 'Inativo': 'bg-error/15 text-error',
    'Férias': 'bg-info/15 text-info', 'Licença': 'bg-warning/15 text-warning',
    'Concluída': 'bg-success/15 text-success', 'Pendente': 'bg-warning/15 text-warning',
    'Agendada': 'bg-info/15 text-info', 'Aprovado': 'bg-success/15 text-success',
    'VALIDADO': 'bg-success/15 text-success', 'PENDENTE': 'bg-warning/15 text-warning', 'EXPIRADO': 'bg-error/15 text-error',
  };
  return map[status] || 'bg-surface-container text-outline';
};

export const RhColaboradoresView: React.FC<Props> = ({ onShowToast }) => {
  const [tab, setTab] = useState<Tab>('colaboradores');
  const [employees, setEmployees] = useState(initialEmployees);
  const [departments] = useState(initialDepartments);
  const [evaluations] = useState(initialEvaluations);
  const [trainings] = useState(initialTrainings);
  const [documents] = useState(initialDocuments);
  const [leaves] = useState(initialLeaves);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('Todos');
  const [filterContract, setFilterContract] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [selectedProfile, setSelectedProfile] = useState<Employee | null>(null);
  const [selectedContract, setSelectedContract] = useState<Employee | null>(null);
  const [modal, setModal] = useState<'employee' | 'department' | null>(null);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Employee | null>(null);
  const [form, setForm] = useState({ nome: '', funcao: '', departamento: 'Académico', contrato: 'Indefinido' as ContractType, salarioBase: 0, email: '', contacto: '' });

  const activeCount = employees.filter((e) => e.status === 'Ativo').length;
  const onLeaveCount = employees.filter((e) => e.status === 'Férias' || e.status === 'Licença').length;
  const payrollTotal = employees.filter((e) => e.status === 'Ativo').reduce((sum, e) => sum + e.salarioBase, 0);
  const avgSalary = activeCount > 0 ? Math.round(payrollTotal / activeCount) : 0;

  const openEmployee = (item?: Employee) => {
    setModal('employee'); setEditing(item || null);
    setForm({ nome: item?.nome || '', funcao: item?.funcao || '', departamento: item?.departamento || 'Académico', contrato: item?.contrato || 'Indefinido', salarioBase: item?.salarioBase || 0, email: item?.email || '', contacto: item?.contacto || '' });
  };
  const saveEmployee = (event: React.FormEvent) => {
    event.preventDefault();
    const item: Employee = { id: editing?.id || `rh${String(employees.length + 1).padStart(3, '0')}`, nome: form.nome, funcao: form.funcao, departamento: form.departamento, contrato: form.contrato, salarioBase: form.salarioBase, status: 'Ativo', dataAdmissao: '10 Ago 2026', email: form.email, contacto: form.contacto };
    setEmployees(editing ? employees.map((x) => x.id === item.id ? item : x) : [item, ...employees]);
    onShowToast(editing ? 'Ficha de colaborador atualizada.' : 'Colaborador registado e contratado com sucesso.');
    setModal(null);
  };
  const removeEmployee = () => {
    if (!confirmDelete) return;
    setEmployees(employees.filter((x) => x.id !== confirmDelete.id));
    setConfirmDelete(null);
    onShowToast('Colaborador removido do registo.');
  };

  const filteredEmployees = useMemo(() => employees.filter((e) => {
    const matchSearch = `${e.nome} ${e.funcao} ${e.email}`.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === 'Todos' || e.departamento === filterDept;
    const matchContract = filterContract === 'Todos' || e.contrato === filterContract;
    const matchStatus = filterStatus === 'Todos' || e.status === filterStatus;
    return matchSearch && matchDept && matchContract && matchStatus;
  }), [employees, search, filterDept, filterContract, filterStatus]);

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Kpi label="Total Colaboradores" value={String(employees.length)} tone="text-primary" note={`${activeCount} ativos`} icon={<Users className="w-4 h-4" />} />
        <Kpi label="Em Férias / Licença" value={String(onLeaveCount)} tone="text-warning" note="Ago 2026" icon={<Calendar className="w-4 h-4" />} />
        <Kpi label="Folha Salarial Mensal" value={money(payrollTotal)} tone="text-primary" note="Colaboradores ativos" icon={<Banknote className="w-4 h-4" />} />
        <Kpi label="Salário Médio" value={money(avgSalary)} tone="text-primary" note="Base mensal" icon={<Briefcase className="w-4 h-4" />} />
      </div>

      {/* Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => { setTab(item.key); setSearch(''); setFilterDept('Todos'); setFilterContract('Todos'); setFilterStatus('Todos'); }}
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

      {/* Tab Content */}
      {tab === 'colaboradores' && (
        <Panel>
          <FilterBar
            search={search} setSearch={setSearch}
            filters={[
              { label: 'Departamento', value: filterDept, set: setFilterDept, options: ['Todos', 'Académico', 'Secretaria', 'Direção', 'Tecnologias', 'Financeiro'] },
              { label: 'Contrato', value: filterContract, set: setFilterContract, options: ['Todos', 'Indefinido', 'Termo Certo', 'Estágio', 'Prestador de Serviços'] },
              { label: 'Estado', value: filterStatus, set: setFilterStatus, options: ['Todos', 'Ativo', 'Férias', 'Licença', 'Inativo'] },
            ]}
            actions={
              <>
                <button onClick={() => onShowToast('Lista de colaboradores exportada.')} className="bg-surface-white border border-border-subtle hover:bg-surface-container-low text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
                <button onClick={() => openEmployee()} className="bg-primary text-surface-white hover:bg-primary/90 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm">
                  <Plus className="w-4 h-4" />
                  Contratar Colaborador
                </button>
              </>
            }
          />
          <DataTable
            headers={['Colaborador', 'Função', 'Departamento', 'Contrato', 'Salário Base', 'Estado', 'Ações']}
            rows={filteredEmployees.map((e) => ({
              id: e.id,
              cells: [
                <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{e.nome.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div><div><div className="font-bold text-primary">{e.nome}</div><div className="text-[10px] text-outline">{e.email}</div></div></div>,
                e.funcao,
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{e.departamento}</span>,
                <span className="font-semibold text-on-surface">{e.contrato}</span>,
                <span className="font-bold text-primary">{money(e.salarioBase)}</span>,
                <span className={`${statusChip(e.status)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{e.status}</span>,
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => setSelectedProfile(e)} title="Ver Perfil do Colaborador" className="p-1.5 text-outline hover:text-primary rounded hover:bg-surface-container transition-colors cursor-pointer"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => setSelectedContract(e)} title="Gerir Contrato / Adenda" className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer"><FileSignature className="w-4 h-4" /></button>
                  <button onClick={() => openEmployee(e)} title="Editar Ficha" className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => setConfirmDelete(e)} title="Remover Colaborador" className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>,
              ],
            }))}
            emptyMessage="Nenhum colaborador encontrado."
          />
        </Panel>
      )}

      {tab === 'departamentos' && (
        <Panel>
          <div className="flex justify-between items-center mb-4">
            <SectionTitle title="Departamentos" subtitle="Estrutura departamental e orçamentos." inline />
            <button onClick={() => onShowToast('Formulário de departamento aberto.')} className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm">
              <Plus className="w-4 h-4" />Novo Departamento
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {departments.map((d) => (
              <div key={d.id} className="border border-border-subtle rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="bg-success/15 text-success px-2 py-0.5 rounded-full text-[10px] font-bold">Ativo</span>
                </div>
                <h3 className="text-sm font-bold text-primary">{d.nome}</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">Responsável: {d.responsavel}</p>
                <div className="border-t border-border-subtle mt-3 pt-3 flex justify-between text-xs">
                  <div><span className="text-[10px] uppercase font-bold text-outline block">Colaboradores</span><span className="font-bold text-primary">{d.colaboradores}</span></div>
                  <div className="text-right"><span className="text-[10px] uppercase font-bold text-outline block">Orçamento Anual</span><span className="font-bold text-success">{money(d.orcamento)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {tab === 'avaliacoes' && (
        <Panel>
          <SectionTitle title="Avaliações de Desempenho" subtitle="Avaliações periódicas dos colaboradores." />
          <DataTable
            headers={['Colaborador', 'Período', 'Nota', 'Classificação', 'Estado', 'Ações']}
            rows={evaluations.map((ev) => ({
              id: ev.id,
              cells: [
                <span className="font-bold text-primary">{ev.colaborador}</span>,
                ev.periodo,
                ev.nota > 0 ? <span className="font-bold text-primary">{ev.nota.toFixed(1)} / 5.0</span> : <span className="text-outline">—</span>,
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ev.classificacao === 'Excelente' ? 'bg-success/15 text-success' : ev.classificacao === 'Muito Bom' ? 'bg-info/15 text-info' : 'bg-surface-container text-outline'}`}>{ev.classificacao}</span>,
                <span className={`${statusChip(ev.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{ev.estado}</span>,
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => onShowToast(`Avaliação de ${ev.colaborador} iniciada.`)} className="p-1.5 text-outline hover:text-success rounded hover:bg-success/10 transition-colors cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                </div>,
              ],
            }))}
            emptyMessage="Nenhuma avaliação encontrada."
          />
        </Panel>
      )}

      {tab === 'formacao' && (
        <Panel>
          <div className="flex justify-between items-center mb-4">
            <SectionTitle title="Formação & Desenvolvimento" subtitle="Ações de formação para colaboradores." inline />
            <button onClick={() => onShowToast('Formulário de formação aberto.')} className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm">
              <Plus className="w-4 h-4" />Nova Formação
            </button>
          </div>
          <DataTable
            headers={['Formação', 'Participantes', 'Data', 'Estado', 'Ações']}
            rows={trainings.map((f) => ({
              id: f.id,
              cells: [
                <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" /><span className="font-bold text-primary">{f.titulo}</span></div>,
                <span className="font-bold text-primary">{f.colaboradores}</span>,
                f.data,
                <span className={`${statusChip(f.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{f.estado}</span>,
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => onShowToast(`Detalhes da formação "${f.titulo}" abertos.`)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer"><FileText className="w-4 h-4" /></button>
                </div>,
              ],
            }))}
            emptyMessage="Nenhuma formação encontrada."
          />
        </Panel>
      )}

      {tab === 'salarios' && (
        <Panel>
          <div className="flex justify-between items-center mb-4">
            <SectionTitle title="Salários & Vencimentos" subtitle="Critérios de pagamento, subsídios, horas extras e descontos." inline />
            <button onClick={() => onShowToast('Processamento salarial do mês iniciado.')} className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm">
              <Banknote className="w-4 h-4" />Processar Folha
            </button>
          </div>
          <DataTable
            headers={['Colaborador', 'Salário Base', 'Subsídios', 'Horas Extras', 'Descontos', 'Salário Líquido', 'Ações']}
            rows={employees.filter((e) => e.status === 'Ativo').map((e) => {
              const subsidios = Math.round(e.salarioBase * 0.15);
              const extras = Math.round(e.salarioBase * 0.05);
              const descontos = Math.round(e.salarioBase * 0.08);
              const liquido = e.salarioBase + subsidios + extras - descontos;
              return {
                id: e.id,
                cells: [
                  <span className="font-bold text-primary">{e.nome}</span>,
                  money(e.salarioBase),
                  <span className="text-success">{money(subsidios)}</span>,
                  <span className="text-success">{money(extras)}</span>,
                  <span className="text-error">{money(descontos)}</span>,
                  <span className="font-bold text-primary">{money(liquido)}</span>,
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onShowToast(`Recibo de vencimento de ${e.nome} emitido.`)} className="p-1.5 text-outline hover:text-success rounded hover:bg-success/10 transition-colors cursor-pointer"><Receipt className="w-4 h-4" /></button>
                  </div>,
                ],
              };
            })}
            emptyMessage="Nenhum colaborador ativo."
          />
        </Panel>
      )}

      {tab === 'ferias_faltas' && (
        <Panel>
          <div className="flex justify-between items-center mb-4">
            <SectionTitle title="Férias & Faltas" subtitle="Gestão de ausências dos colaboradores." inline />
            <button onClick={() => onShowToast('Formulário de pedido de ausência aberto.')} className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm">
              <Plus className="w-4 h-4" />Nova Ausência
            </button>
          </div>
          <DataTable
            headers={['Colaborador', 'Tipo', 'Início', 'Fim', 'Dias', 'Estado', 'Ações']}
            rows={leaves.map((l) => ({
              id: l.id,
              cells: [
                <span className="font-bold text-primary">{l.colaborador}</span>,
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${l.tipo === 'Férias' ? 'bg-info/15 text-info' : l.tipo === 'Licença Médica' ? 'bg-warning/15 text-warning' : 'bg-primary/10 text-primary'}`}>{l.tipo}</span>,
                l.inicio,
                l.fim,
                <span className="font-bold text-primary">{l.dias}</span>,
                <span className={`${statusChip(l.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{l.estado}</span>,
                <div className="flex items-center justify-end gap-1">
                  {l.estado === 'Pendente' && <button onClick={() => onShowToast(`Pedido de ${l.colaborador} aprovado.`)} className="p-1.5 text-outline hover:text-success rounded hover:bg-success/10 transition-colors cursor-pointer"><CheckCircle2 className="w-4 h-4" /></button>}
                  <button onClick={() => onShowToast(`Registo de ausência de ${l.colaborador} exportado.`)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer"><Download className="w-4 h-4" /></button>
                </div>,
              ],
            }))}
            emptyMessage="Nenhuma ausência registada."
          />
        </Panel>
      )}

      {tab === 'relatorios' && (
        <Panel>
          <div className="flex justify-between items-center mb-4">
            <SectionTitle title="Relatórios de Recursos Humanos" subtitle="Relatórios para a direção e auditoria." inline />
            <button onClick={() => onShowToast('Relatório consolidado de RH exportado.')} className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm">
              <Download className="w-4 h-4" />Exportar Consolidado
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['Mapa de Pessoal', 'Folha Salarial Mensal', 'Relatório de Avaliações', 'Relatório de Formação', 'Mapa de Férias e Faltas', 'Indicadores de RH'].map((item) => (
              <button key={item} onClick={() => onShowToast(`Relatório "${item}" gerado.`)} className="text-left border border-border-subtle rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                <BookOpen className="w-5 h-5 text-primary mb-2" />
                <h3 className="text-sm font-bold text-primary">{item}</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">Gerar e descarregar relatório detalhado.</p>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {/* Employee Modal */}
      {modal === 'employee' && (
        <Modal title={editing ? 'Editar Colaborador' : 'Novo Colaborador'} onClose={() => setModal(null)}>
          <form onSubmit={saveEmployee} className="space-y-3 text-xs">
            <Field label="Nome Completo" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Função" value={form.funcao} onChange={(v) => setForm({ ...form, funcao: v })} required />
              <label className="block text-outline font-bold">Departamento<select value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none bg-surface-white"><option>Académico</option><option>Secretaria</option><option>Direção</option><option>Tecnologias</option><option>Financeiro</option></select></label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-outline font-bold">Tipo de Contrato<select value={form.contrato} onChange={(e) => setForm({ ...form, contrato: e.target.value as ContractType })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-primary focus:outline-none bg-surface-white"><option>Indefinido</option><option>Termo Certo</option><option>Estágio</option><option>Prestador de Serviços</option></select></label>
              <Field label="Salário Base (Kz)" type="number" value={String(form.salarioBase)} onChange={(v) => setForm({ ...form, salarioBase: Number(v) })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              <Field label="Contacto Telefónico" value={form.contacto} onChange={(v) => setForm({ ...form, contacto: v })} />
            </div>
            <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
              <button type="button" onClick={() => setModal(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button className="bg-primary text-surface-white hover:bg-primary/90 px-4 py-2 rounded-lg font-bold cursor-pointer transition-all shadow-sm">Guardar</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <Modal title="Confirmar Remoção" onClose={() => setConfirmDelete(null)}>
          <div className="space-y-4 text-xs">
            <p className="text-on-surface-variant flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Esta ação não pode ser desfeita. Deseja remover o colaborador <strong className="text-primary">{confirmDelete.nome}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={removeEmployee} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Remover</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <Modal title="Perfil do Colaborador" onClose={() => setSelectedProfile(null)}>
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-lg border border-border-subtle">
              <div className="w-12 h-12 rounded-full bg-primary text-surface-white flex items-center justify-center text-sm font-bold shadow-sm">
                {selectedProfile.nome.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-primary">{selectedProfile.nome}</h3>
                <p className="text-on-surface-variant font-medium">{selectedProfile.funcao}</p>
                <span className={`${statusChip(selectedProfile.status)} px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 inline-block`}>
                  {selectedProfile.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-surface-white p-3 rounded-lg border border-border-subtle">
              <div>
                <span className="text-[10px] uppercase font-bold text-outline block">Departamento</span>
                <span className="font-bold text-primary">{selectedProfile.departamento}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline block">Tipo de Contrato</span>
                <span className="font-bold text-primary">{selectedProfile.contrato}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline block">Data de Admissão</span>
                <span className="font-medium text-on-surface">{selectedProfile.dataAdmissao}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline block">Salário Base</span>
                <span className="font-bold text-primary">{money(selectedProfile.salarioBase)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline block">Email Institucional</span>
                <span className="font-medium text-on-surface">{selectedProfile.email}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-outline block">Contacto Telefónico</span>
                <span className="font-medium text-on-surface">{selectedProfile.contacto}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
              <button
                onClick={() => { const emp = selectedProfile; setSelectedProfile(null); openEmployee(emp); }}
                className="border border-border-subtle px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-surface-container transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar Ficha
              </button>
              <button
                onClick={() => { const emp = selectedProfile; setSelectedProfile(null); setSelectedContract(emp); }}
                className="bg-primary text-surface-white hover:bg-primary/90 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <FileSignature className="w-3.5 h-3.5" /> Ver Contrato
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Contract Management Modal */}
      {selectedContract && (
        <Modal title="Gestão & Minuta de Contrato" onClose={() => setSelectedContract(null)}>
          <div className="space-y-4 text-xs">
            <div className="bg-surface-container-low p-3 rounded-lg border border-border-subtle flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-outline">Colaborador</p>
                <h3 className="font-bold text-sm text-primary">{selectedContract.nome}</h3>
                <p className="text-[11px] text-on-surface-variant">{selectedContract.funcao} · {selectedContract.departamento}</p>
              </div>
              <span className="bg-primary/15 text-primary px-3 py-1 rounded-full text-xs font-bold">
                {selectedContract.contrato}
              </span>
            </div>

            <div className="space-y-2 border border-border-subtle p-3 rounded-lg bg-surface-white">
              <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                <span className="text-outline font-bold">Data de Início do Vínculo:</span>
                <span className="font-bold text-primary">{selectedContract.dataAdmissao}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                <span className="text-outline font-bold">Vencimento Base Acordado:</span>
                <span className="font-bold text-primary">{money(selectedContract.salarioBase)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-outline font-bold">Estado do Contrato:</span>
                <span className="bg-success/15 text-success px-2 py-0.5 rounded text-[10px] font-bold">Ativo & Válido</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
              <button
                onClick={() => { onShowToast(`Minuta de contrato de ${selectedContract.nome} gerada em PDF.`); setSelectedContract(null); }}
                className="border border-border-subtle px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-surface-container transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Exportar PDF
              </button>
              <button
                onClick={() => { onShowToast(`Contrato de ${selectedContract.nome} renovado com sucesso!`); setSelectedContract(null); }}
                className="bg-primary text-surface-white hover:bg-primary/90 px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Renovar Contrato
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* Shared components */
const Kpi = ({ label, value, tone, note, icon }: { label: string; value: string; tone: string; note: string; icon: React.ReactNode }) => (
  <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
    <div className="flex flex-col justify-center">
      <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">{label}</span>
      <span className={`text-2xl font-bold leading-none ${tone}`}>{value}</span>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">{icon}{note}</span>
    </div>
  </div>
);

const Panel = ({ children }: { children: React.ReactNode }) => <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">{children}</div>;

const SectionTitle = ({ title, subtitle, inline = false }: { title: string; subtitle: string; inline?: boolean }) => (
  <div className={inline ? '' : 'mb-4'}>
    <h2 className="text-lg font-bold text-primary">{title}</h2>
    <p className="text-xs text-on-surface-variant">{subtitle}</p>
  </div>
);

const Field = ({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) => (
  <label className="block text-outline font-bold">{label}<input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>
);

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-lg p-6 my-8">
      <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2"><Users className="w-5 h-5 text-secondary" />{title}</h2>
        <button onClick={onClose} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
      </div>
      {children}
    </div>
  </div>
);

const FilterBar = ({ search, setSearch, filters, actions }: { search: string; setSearch: (x: string) => void; filters: { label?: string; value: string; set: (x: string) => void; options: string[] }[]; actions?: React.ReactNode }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f, i) => (
        <div key={i} className="flex items-center gap-1.5 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium text-xs">
          {f.label && <span className="font-bold text-primary">{f.label}:</span>}
          <select
            value={f.value}
            onChange={(e) => f.set(e.target.value)}
            className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
          >
            {f.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-secondary font-medium" />
      </div>
      {actions}
    </div>
  </div>
);

const DataTable = ({ headers, rows, emptyMessage }: { headers: string[]; rows: { id: string; cells: React.ReactNode[] }[]; emptyMessage: string }) => (
  <div className="overflow-x-auto border border-border-subtle rounded-lg">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary">
          {headers.map((h, i) => <th key={i} className={`px-3.5 py-3 ${h === 'Ações' ? 'text-right' : h === 'Estado' || h === 'Nota' ? 'text-center' : ''}`}>{h}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-border-subtle text-xs">
        {rows.length ? rows.map((row) => (
          <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors">
            {row.cells.map((cell, i) => <td key={i} className={`px-3.5 py-3 ${headers[i] === 'Ações' ? 'text-right' : headers[i] === 'Estado' || headers[i] === 'Nota' ? 'text-center' : ''}`}>{cell}</td>)}
          </tr>
        )) : (
          <tr><td colSpan={headers.length} className="text-center py-8 text-on-surface-variant font-medium">{emptyMessage}</td></tr>
        )}
      </tbody>
    </table>
  </div>
);
