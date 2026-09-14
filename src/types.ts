export type ActiveView = 
  | 'dashboard'
  // Módulo 2 — Gestão Académica
  | 'estudantes' 
  | 'perfil' 
  | 'turmas' 
  | 'professores' 
  | 'config_academicas'
  | 'aluno_portal'
  | 'encarregado_portal'
  | 'professor_portal'
  // Módulo 3 — Biblioteca Digital
  | 'biblioteca' 
  | 'biblioteca_catalogo'
  | 'biblioteca_solicitacoes'
  | 'biblioteca_relatorios'
  | 'biblioteca_configuracoes'
  // Módulo 4 — Serviços Institucionais
  | 'servicos_produtos'
  | 'cantina'
  // Módulo 5 — Gestão Financeira
  | 'tesouraria'
  | 'gestao_financeira'
  | 'financeiro' // legacy fallback
  // Módulo 6 — Recursos Humanos
  | 'rh_colaboradores'
  // Módulo 7 — Gestão Documental
  | 'gestao_documental' 
  | 'documental' // legacy fallback
  // Módulo 8 — Comunicação Institucional
  | 'comunicacao' 
  | 'cms'
  // Módulo 9 — Administração da Plataforma
  | 'utilizadores_permissoes'
  | 'estruturas'
  | 'config_instituicao'
  | 'administracao'; // legacy fallback

export type StructureType = 'college' | 'campus' | 'faculty' | 'polo' | 'center' | 'unit';

export interface Structure {
  id: string;
  institutionId: string;
  codigo: string;
  nome: string;
  tipo: StructureType;
  tipoLabel: string;
  morada: string;
  diretorResponsavel: string;
  estudantesCount: number;
  professoresCount: number;
  estado: 'Ativo' | 'Inativo';
  criadoEm: string;
}

export interface UserStructureAccess {
  id: string;
  userId: string;
  institutionId: string;
  structureId?: string; // undefined / null = Acesso Consolidado Global a Todas as Estruturas
  groupId?: string;
  groupNome?: string;
  isPrimary: boolean;
}


export type EnrollmentStatus = 'Ativo' | 'Inativo' | 'Pendente';
export type FinancialStatus = 'Regularizada' | 'Pendente' | 'Dívida';

export interface Student {
  id: string; // e.g. "EST-2024-089" or "20230145"
  matricula: string; // e.g. "20230145"
  nomeCompleto: string;
  nomeSocial?: string;
  dataNascimento: string;
  nacionalidade: string;
  nif: string;
  cartaoCidadao: string;
  photoUrl: string;
  classe: string; // e.g. "10º Ano"
  turma: string; // e.g. "Turma A"
  curso: string; // e.g. "Ciências Físicas"
  encarregadoNome: string;
  encarregadoParentesco: string;
  encarregadoTelefone: string;
  encarregadoEmail: string;
  contactoEstudante: string;
  emailEstudante: string;
  estadoMatricula: EnrollmentStatus;
  situacaoFinanceira: FinancialStatus;
  documentacaoPendente: string; // e.g. 'ok', 'bi', 'cert', 'foto'
  
  // Profile specific
  morada: {
    endereco: string;
    codigoPostal: string;
    localidade: string;
    concelhoDistrito: string;
  };
  tutorAcademico: string;
  tutorPhotoUrl?: string;
  mediaGeral: number; // e.g. 17.2
  creditosECTS?: number;
  taxaAssiduidade?: number;
  dataMatricula?: string;
}

export interface AcademicGrade {
  id: string;
  disciplina: string;
  iconName: string;
  professor: string;
  nota1Per: number;
  notaFinal: number;
  estado: 'Aprovado' | 'Aprov. Condicional' | 'Reprovado';
}

export interface FinancialTransaction {
  id: string;
  descricao: string;
  dataVencimento: string;
  valor: number;
  estado: 'Pago' | 'Emitido' | 'Pendente' | 'Atrasado';
  dataPagamento?: string;
}

export interface AbsenceRecord {
  id: string;
  data: string;
  disciplina: string;
  tipo: 'Teórica' | 'Prática';
  estado: 'Justificada' | 'Não Justificada';
  observacao?: string;
}

export interface DocumentItem {
  id: string;
  tipo: string;
  iconName: string;
  dataUpload: string;
  validade: string;
  estado: 'VALIDADO' | 'PENDENTE' | 'EXPIRADO';
}

export interface TimelineEvent {
  id: string;
  studentId: string;
  timestamp: string; // e.g. "10:45" or "16:30"
  dateCategory: 'Hoje' | 'Ontem' | '12 Set' | string;
  categoria: 'finance' | 'academic' | 'documental' | 'administrative';
  categoriaLabel: string; // e.g. "Financeiro"
  badgeBg: string;
  badgeText: string;
  icon: string;
  iconColor: string;
  titulo: string;
  descricao: string;
  autorName: string;
  autorType: 'system' | 'professor' | 'secretary' | 'admin';
  autorPhoto?: string;
  actionText?: string;
}

export interface StudentFilters {
  anoLetivo: string;
  dataInicio: string;
  dataFim: string;
  classe: string;
  curso: string;
  estado: string;
  financeiro: string;
  docPendente: string;
  searchQuery: string;
  rowsPerPage: number;
}
