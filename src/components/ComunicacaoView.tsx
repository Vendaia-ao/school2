import React, { useState } from 'react';
import { ActiveView } from '../types';
import { MessageSquare, Send, Mail, CheckCircle2, MessageCircle, Users, BellRing, Smartphone, FileText, History, Pencil as Edit3, Sliders, Search, Plus, Eye, Download, RefreshCw, Copy, Bell, X } from 'lucide-react';

interface ComunicacaoViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

interface MessageHistory {
  id: string;
  titulo: string;
  canal: 'SMS' | 'E-mail' | 'Push App' | 'Multicanal';
  destinatarios: string;
  dataEnvio: string;
  estado: 'Enviado' | 'Entregue' | 'Lido' | 'Agendado';
  taxaAbertura: string;
  autor: string;
}

const ModalXL: React.FC<{ title: string; subtitle?: string; onClose: () => void; children: React.ReactNode }> = ({ title, subtitle, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-surface-white border border-border-subtle rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
      {/* Header — Paleta de Cores Módulo Administração */}
      <div className="bg-primary text-surface-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-surface-white/10 rounded-xl">
            <MessageSquare className="w-5 h-5 text-surface-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight text-surface-white">{title}</h3>
            <p className="text-[11px] text-surface-white/80">
              {subtitle || 'Registo e Envio de Avisos e Notificações Institucionais'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-surface-white/20 p-1.5 rounded-lg transition-colors text-surface-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export const ComunicacaoView: React.FC<ComunicacaoViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'historico' | 'modelos' | 'canais'>('historico');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCanal, setFilterCanal] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterDestinatario, setFilterDestinatario] = useState('todos');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form states for new communication
  const [targetGroup, setTargetGroup] = useState('encarregados');
  const [selectedClass, setSelectedClass] = useState('todas');
  const [channelSMS, setChannelSMS] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelPush, setChannelPush] = useState(true);
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // Initial Mock History
  const [historyList, setHistoryList] = useState<MessageHistory[]>([
    {
      id: 'com-101',
      titulo: 'Convocatória para Reunião Geral de Encarregados de Educação',
      canal: 'Multicanal',
      destinatarios: 'Todos os Encarregados (842)',
      dataEnvio: '09 Ago 2026, 14:30',
      estado: 'Lido',
      taxaAbertura: '94%',
      autor: 'Dra. Sara Silva (Direção)',
    },
    {
      id: 'com-102',
      titulo: 'Lembrete de Liquidação de Propinas - Mês de Agosto',
      canal: 'SMS',
      destinatarios: 'Encarregados com Pendência (14)',
      dataEnvio: '05 Ago 2026, 09:15',
      estado: 'Entregue',
      taxaAbertura: '100%',
      autor: 'Serviços Financeiros',
    },
    {
      id: 'com-103',
      titulo: 'Divulgação do Calendário de Exames do 2º Semestre',
      canal: 'E-mail',
      destinatarios: 'Estudantes do 10º ao 12º Ano (320)',
      dataEnvio: '01 Ago 2026, 11:00',
      estado: 'Lido',
      taxaAbertura: '88%',
      autor: 'Secretaria Académica',
    },
    {
      id: 'com-104',
      titulo: 'Aviso: Suspensão de Atividades Letivas - Feriado Municipal',
      canal: 'Push App',
      destinatarios: 'Toda a Comunidade Escolar (1.250)',
      dataEnvio: '25 Jul 2026, 16:45',
      estado: 'Enviado',
      taxaAbertura: '91%',
      autor: 'Dra. Sara Silva (Direção)',
    },
    {
      id: 'com-105',
      titulo: 'Comprovativo de Inscrição na Atividade Extracurricular de Robótica',
      canal: 'E-mail',
      destinatarios: 'Inscritos no Clube de Robótica (45)',
      dataEnvio: '18 Jul 2026, 10:20',
      estado: 'Entregue',
      taxaAbertura: '96%',
      autor: 'Prof. Miguel Ângelo',
    },
  ]);

  const templates = [
    {
      id: 'tmpl-1',
      nome: 'Aviso de Reunião de Pais',
      categoria: 'Geral',
      assunto: 'Convocatória: Reunião com o Encarregado de Educação',
      corpo: 'Estimado Encarregado de Educação, vimos por este meio convidá-lo para a reunião presencial a realizar-se no próximo dia [DATA] às [HORA] na sala [SALA]. Contamos com a sua presença.',
    },
    {
      id: 'tmpl-2',
      nome: 'Lembrete de Propina Pendente',
      categoria: 'Financeiro',
      assunto: 'Aviso de Vencimento de Propina - Vendaia School®',
      corpo: 'Exmo.(a) Sr.(a) [NOME_ENCARREGADO], informamos que a propina referente ao mês de [MÊS] do estudante [NOME_ALUNO] se encontra pendente. Agradecemos a regularização via Multicaixa / Referência MB.',
    },
    {
      id: 'tmpl-3',
      nome: 'Notificação de Falta Injustificada',
      categoria: 'Assiduidade',
      assunto: 'Notificação de Assiduidade - [NOME_ALUNO]',
      corpo: 'Informamos que o estudante [NOME_ALUNO] registou uma falta injustificada no dia [DATA] na disciplina de [DISCIPLINA]. Solicita-se o envio de justificativo à secretaria no prazo de 48h.',
    },
    {
      id: 'tmpl-4',
      nome: 'Lançamento de Notas / Pautas',
      categoria: 'Académico',
      assunto: 'Disponibilização de Notas do 1º Período',
      corpo: 'Informamos que as pautas de avaliação referentes ao 1º Período já se encontram disponíveis para consulta no Portal do Aluno e Portal do Encarregado.',
    },
  ];

  const handleSendNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !messageBody.trim()) {
      onShowToast('Por favor preencha o assunto e o texto da mensagem.');
      return;
    }

    const selectedChannelsList = [];
    if (channelSMS) selectedChannelsList.push('SMS');
    if (channelEmail) selectedChannelsList.push('E-mail');
    if (channelPush) selectedChannelsList.push('Push App');

    const mainCanal =
      selectedChannelsList.length > 1
        ? 'Multicanal'
        : (selectedChannelsList[0] as 'SMS' | 'E-mail' | 'Push App') || 'Push App';

    const newComm: MessageHistory = {
      id: `com-${Date.now()}`,
      titulo: subject,
      canal: mainCanal,
      destinatarios:
        targetGroup === 'encarregados'
          ? 'Encarregados de Educação'
          : targetGroup === 'alunos'
          ? 'Estudantes'
          : targetGroup === 'professores'
          ? 'Corpo Docente'
          : 'Toda a Comunidade',
      dataEnvio: 'Agora mesmo',
      estado: 'Enviado',
      taxaAbertura: '100%',
      autor: 'Dra. Sara Silva (Administração)',
    };

    setHistoryList([newComm, ...historyList]);
    setSubject('');
    setMessageBody('');
    setIsModalOpen(false);
    setActiveTab('historico');
    onShowToast('Comunicado enviado com sucesso para os destinatários selecionados!');
  };

  const applyTemplate = (tmpl: (typeof templates)[0]) => {
    setSubject(tmpl.assunto);
    setMessageBody(tmpl.corpo);
    setIsModalOpen(true);
    onShowToast(`Modelo "${tmpl.nome}" aplicado no formulário de envio.`);
  };

  const filteredHistory = historyList.filter((item) => {
    const matchesSearch =
      item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destinatarios.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.autor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCanal =
      filterCanal === 'todos' || item.canal.toLowerCase() === filterCanal.toLowerCase();

    const matchesEstado =
      filterEstado === 'todos' || item.estado.toLowerCase() === filterEstado.toLowerCase();

    const matchesDestinatario =
      filterDestinatario === 'todos' ||
      item.destinatarios.toLowerCase().includes(filterDestinatario.toLowerCase());

    return matchesSearch && matchesCanal && matchesEstado && matchesDestinatario;
  });

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">Mensagens no Mês</span>
            <span className="text-2xl font-bold leading-none text-primary">1.428</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-info bg-info/10 text-[10px] font-bold">
              <Mail className="w-4 h-4" />+12%
            </span>
          </div>
        </div>

        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">Taxa de Entrega</span>
            <span className="text-2xl font-bold leading-none text-primary">98.4%</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <CheckCircle2 className="w-4 h-4" />Excelente
            </span>
          </div>
        </div>

        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">Saldo de SMS</span>
            <span className="text-2xl font-bold leading-none text-primary">4.250</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-warning bg-warning/10 text-[10px] font-bold">
              <Smartphone className="w-4 h-4" />Ativo
            </span>
          </div>
        </div>

        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">Encarregados Ativos</span>
            <span className="text-2xl font-bold leading-none text-primary">842</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-primary bg-primary/10 text-[10px] font-bold">
              <Users className="w-4 h-4" />Comunidade
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('historico')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'historico'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <History className="w-4 h-4" />
          Histórico de Envio
        </button>

        <button
          onClick={() => setActiveTab('modelos')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'modelos'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <FileText className="w-4 h-4" />
          Modelos (Templates)
        </button>

        <button
          onClick={() => setActiveTab('canais')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'canais'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Canais & Integrações
        </button>
      </div>

      {/* Tab 1: Histórico de Envio */}
      {activeTab === 'historico' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-3">
          {/* Filters & Search & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter: Canal */}
              <div className="flex items-center gap-1.5 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium text-xs">
                <span className="font-bold text-primary">Canal:</span>
                <select
                  value={filterCanal}
                  onChange={(e) => setFilterCanal(e.target.value)}
                  className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
                >
                  <option value="todos">Todos</option>
                  <option value="sms">SMS</option>
                  <option value="e-mail">E-mail</option>
                  <option value="push app">Push App</option>
                  <option value="multicanal">Multicanal</option>
                </select>
              </div>

              {/* Filter: Estado */}
              <div className="flex items-center gap-1.5 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium text-xs">
                <span className="font-bold text-primary">Estado:</span>
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
                >
                  <option value="todos">Todos</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                  <option value="lido">Lido</option>
                  <option value="agendado">Agendado</option>
                </select>
              </div>

              {/* Filter: Público-Alvo / Destinatários */}
              <div className="flex items-center gap-1.5 bg-surface border border-border-subtle rounded-lg px-2.5 py-1 font-medium text-xs">
                <span className="font-bold text-primary">Destinatários:</span>
                <select
                  value={filterDestinatario}
                  onChange={(e) => setFilterDestinatario(e.target.value)}
                  className="bg-transparent text-xs focus:outline-none font-medium text-on-surface cursor-pointer"
                >
                  <option value="todos">Todos</option>
                  <option value="encarregados">Encarregados</option>
                  <option value="estudantes">Estudantes</option>
                  <option value="docente">Docentes / Professores</option>
                  <option value="comunidade">Comunidade</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Pesquisar comunicados..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-primary font-medium"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-surface-white hover:bg-primary/90 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Send className="w-4 h-4 stroke-[1.75]" />
                Novo Comunicado
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Título do Comunicado</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Canal</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Destinatários</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Data de Envio</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase text-center">Estado</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase text-center">Taxa Leitura</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-on-surface-variant font-medium">
                      Nenhum comunicado encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="px-3 py-1.5 font-bold text-primary max-w-xs truncate">{item.titulo}</td>
                      <td className="px-3 py-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                          {item.canal}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-on-surface-variant">{item.destinatarios}</td>
                      <td className="px-3 py-1.5 text-outline">{item.dataEnvio}</td>
                      <td className="px-3 py-1.5 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                          {item.estado}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-center font-bold text-primary">{item.taxaAbertura}</td>
                      <td className="px-3 py-1.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onShowToast(`Detalhes do comunicado "${item.titulo}" - Autor: ${item.autor}`)}
                            title="Ver Detalhes"
                            className="p-1.5 text-outline hover:text-primary rounded hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onShowToast(`Reenviando comunicado "${item.titulo}"...`)}
                            title="Reenviar Comunicado"
                            className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onShowToast(`Exportando relatório de entrega de "${item.titulo}"...`)}
                            title="Exportar Relatório"
                            className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
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

      {/* Modal XL: Compor Novo Comunicado */}
      {isModalOpen && (
        <ModalXL title="Compor Novo Comunicado" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSendNewMessage}>
            <div className="p-4 sm:p-5 flex flex-col gap-3.5 text-xs">
              {/* Compact Top Configuration Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pb-3 border-b border-border-subtle items-center">
                <div className={`${targetGroup === 'turma_especifica' ? 'sm:col-span-4' : 'sm:col-span-5'} flex flex-col gap-1`}>
                  <label className="font-bold text-on-surface text-[11px]">Destinatários *</label>
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    className="p-2 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-primary text-xs cursor-pointer"
                  >
                    <option value="encarregados">Todos os Encarregados de Educação (842)</option>
                    <option value="alunos">Todos os Estudantes (1.250)</option>
                    <option value="professores">Corpo Docente e Professores (68)</option>
                    <option value="turma_especifica">Turma Específica</option>
                    <option value="comunidade">Toda a Comunidade Escolar</option>
                  </select>
                </div>

                {targetGroup === 'turma_especifica' && (
                  <div className="sm:col-span-3 flex flex-col gap-1">
                    <label className="font-bold text-on-surface text-[11px]">Turma *</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="p-2 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-primary text-xs cursor-pointer"
                    >
                      <option value="10A">10º Ano - Turma A</option>
                      <option value="10B">10º Ano - Turma B</option>
                      <option value="11A">11º Ano - Turma A</option>
                      <option value="12A">12º Ano - Turma A</option>
                    </select>
                  </div>
                )}

                <div className={`${targetGroup === 'turma_especifica' ? 'sm:col-span-5' : 'sm:col-span-7'} flex flex-col gap-1`}>
                  <label className="font-bold text-on-surface text-[11px]">Canais de Difusão Ativos</label>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={channelEmail}
                        onChange={(e) => setChannelEmail(e.target.checked)}
                        className="rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span>E-mail</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={channelSMS}
                        onChange={(e) => setChannelSMS(e.target.checked)}
                        className="rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span>SMS</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={channelPush}
                        onChange={(e) => setChannelPush(e.target.checked)}
                        className="rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span>Push App</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface text-[11px]">Assunto / Título do Comunicado *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Convocatória para Reunião de Avaliação do 1º Trimestre"
                  className="p-2 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-primary text-xs"
                  required
                />
              </div>

              {/* Message Body (Major Focus) */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-on-surface text-[11px]">Conteúdo da Mensagem *</label>
                  <span className="text-[10px] text-outline">Recomendado &lt; 500 caracteres para SMS</span>
                </div>
                <textarea
                  rows={8}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Escreva aqui a mensagem detalhada a ser enviada aos destinatários..."
                  className="p-3 border border-border-subtle rounded-lg bg-surface font-medium outline-none focus:border-primary text-xs min-h-[190px] resize-y"
                  required
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-surface-container-low border-t border-border-subtle flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSubject('');
                  setMessageBody('');
                  setIsModalOpen(false);
                }}
                className="px-3.5 py-1.5 rounded-lg border border-border-subtle hover:bg-surface-container transition-colors font-medium text-xs text-on-surface-variant cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-primary text-surface-white hover:bg-primary/90 transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                Enviar Comunicado
              </button>
            </div>
          </form>
        </ModalXL>
      )}

      {/* Tab 3: Modelos */}
      {activeTab === 'modelos' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="font-title-lg text-lg font-bold text-primary mb-1">Modelos Pré-definidos (Templates)</h2>
            <p className="text-xs text-on-surface-variant">
              Utilize estes modelos estandardizados para agilizar o envio de avisos frequentes na escola.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="border border-border-subtle bg-surface-container-low/50 rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-all shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-primary text-sm">{tmpl.nome}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                      {tmpl.categoria}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-on-surface mb-1">Assunto: {tmpl.assunto}</p>
                  <p className="text-xs text-on-surface-variant italic bg-surface-white p-2 rounded border border-border-subtle mb-3">
                    "{tmpl.corpo}"
                  </p>
                </div>

                <button
                  onClick={() => applyTemplate(tmpl)}
                  className="w-full bg-primary text-surface-white hover:bg-primary/90 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  Usar Este Modelo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Canais */}
      {activeTab === 'canais' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="font-title-lg text-lg font-bold text-primary mb-1">Estado dos Canais de Comunicação</h2>
            <p className="text-xs text-on-surface-variant">
              Monitorize a conectividade dos servidores de envio da plataforma Vendaia School®.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border-subtle rounded-xl p-4 bg-surface-container-low/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-xs flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-info" /> Gateway E-mail SMTP
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                  Operacional
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Servidor: smtp.vendaia.edu.pt (Porta 587 SSL)</p>
              <p className="text-[11px] text-outline">Capacidade: 10.000 e-mails/dia</p>
            </div>

            <div className="border border-border-subtle rounded-xl p-4 bg-surface-container-low/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-xs flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-warning" /> Gateway SMS Nacional
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                  Operacional
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Provedor: Vendaia TeleCom API</p>
              <p className="text-[11px] text-outline">Crédito Disponível: 4.250 SMS</p>
            </div>

            <div className="border border-border-subtle rounded-xl p-4 bg-surface-container-low/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-xs flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-secondary" /> Push Firebase
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                  Operacional
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Dispositivos Registados: 1.102 móveis</p>
              <p className="text-[11px] text-outline">Latência Média: &lt; 2 segundos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
