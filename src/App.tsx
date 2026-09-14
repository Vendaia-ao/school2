import React, { useState, useEffect } from 'react';
import {
  ActiveView,
  Student,
  AcademicGrade,
  FinancialTransaction,
  AbsenceRecord,
  DocumentItem,
  TimelineEvent,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_GRADES,
  INITIAL_FINANCIALS,
  INITIAL_ABSENCES,
  INITIAL_DOCUMENTS,
  INITIAL_TIMELINE,
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { HeaderNav } from './components/HeaderNav';
import { StudentsView } from './components/StudentsView';
import { StudentProfileView } from './components/StudentProfileView';
import { DashboardView } from './components/DashboardView';
import { ComunicacaoView } from './components/ComunicacaoView';
import { TurmasView } from './components/TurmasView';
import { ProfessoresView } from './components/ProfessoresView';
import { ConfigAcademicasView } from './components/ConfigAcademicasView';
import { AlunoPortalView } from './components/AlunoPortalView';
import { EncarregadoPortalView } from './components/EncarregadoPortalView';
import { ProfessorPortalView } from './components/ProfessorPortalView';
import { ServicosProdutosView } from './components/ServicosProdutosView';
import { CantinaView } from './components/CantinaView';
import { GestaoFinanceiraView } from './components/GestaoFinanceiraView';
import { TesourariaView } from './components/TesourariaView';
import { RhColaboradoresView } from './components/RhColaboradoresView';
import { GestaoDocumentalView } from './components/GestaoDocumentalView';
import { CmsView } from './components/CmsView';
import { UtilizadoresPermissoesView } from './components/UtilizadoresPermissoesView';
import { ConfigInstituicaoView } from './components/ConfigInstituicaoView';
import { EstruturasView } from './components/EstruturasView';
import { BibliotecaView } from './components/BibliotecaView';
import { AccessProvider } from './context/AccessContext';
import { StudentFormModal, ToastNotification } from './components/Modals';

function AppContent() {
  const [currentView, setCurrentView] = useState<ActiveView>('estudantes');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  // Core Data States
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(INITIAL_STUDENTS[5]); // Default to João Miguel Santos Almeida
  const [grades, setGrades] = useState<AcademicGrade[]>(INITIAL_GRADES);
  const [financials, setFinancials] = useState<FinancialTransaction[]>(INITIAL_FINANCIALS);
  const [absences, setAbsences] = useState<AbsenceRecord[]>(INITIAL_ABSENCES);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE);

  // UI Feedback States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Sync body class for sidebar margin
  useEffect(() => {
    if (isSidebarExpanded) {
      document.body.classList.add('sidebar-expanded-body');
      document.body.classList.remove('sidebar-collapsed-body');
    } else {
      document.body.classList.add('sidebar-collapsed-body');
      document.body.classList.remove('sidebar-expanded-body');
    }
  }, [isSidebarExpanded]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handlers
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('perfil');
  };

  const handleSaveStudent = (formData: Partial<Student>) => {
    if (editingStudent) {
      // Edit existing student
      const updated = students.map((s) => {
        if (s.id === editingStudent.id) {
          return { ...s, ...formData } as Student;
        }
        return s;
      });
      setStudents(updated);
      if (selectedStudent && selectedStudent.id === editingStudent.id) {
        setSelectedStudent({ ...selectedStudent, ...formData } as Student);
      }
      showToast(`Ficha de ${formData.nomeCompleto} atualizada com sucesso!`);
    } else {
      // Add new student
      const newId = `EST-2024-${Math.floor(100 + Math.random() * 900)}`;
      const newMatricula = `2024${Math.floor(1000 + Math.random() * 9000)}`;
      const newStudent: Student = {
        id: newId,
        matricula: newMatricula,
        nomeCompleto: formData.nomeCompleto || 'Novo Estudante',
        nomeSocial: formData.nomeSocial || '',
        dataNascimento: formData.dataNascimento || '10 Maio 2008',
        nacionalidade: formData.nacionalidade || 'Portuguesa',
        nif: formData.nif || '254 999 888',
        cartaoCidadao: formData.cartaoCidadao || '14902381 0 ZX1',
        photoUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        classe: formData.classe || '10º Ano',
        turma: formData.turma || 'Turma A',
        curso: formData.curso || 'Ciências Físicas',
        encarregadoNome: formData.encarregadoNome || 'Encarregado',
        encarregadoParentesco: formData.encarregadoParentesco || 'Mãe',
        encarregadoTelefone: formData.encarregadoTelefone || '+351 912 345 678',
        encarregadoEmail: formData.encarregadoEmail || 'encarregado@email.com',
        contactoEstudante: formData.contactoEstudante || '+351 912 345 678',
        emailEstudante:
          formData.emailEstudante ||
          `${formData.nomeCompleto?.toLowerCase().replace(/\s+/g, '.')}@student.vendaia.edu`,
        estadoMatricula: 'Ativo',
        situacaoFinanceira: 'Regularizada',
        documentacaoPendente: 'ok',
        morada: formData.morada || {
          endereco: 'Rua Principal',
          codigoPostal: '1000-001',
          localidade: 'Lisboa',
          concelhoDistrito: 'Lisboa, Lisboa',
        },
        tutorAcademico: 'Dr. Carlos Mendes',
        mediaGeral: 16.0,
        creditosECTS: 120,
        taxaAssiduidade: 95,
        dataMatricula: new Date().toLocaleDateString('pt-PT', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };

      setStudents([newStudent, ...students]);
      showToast(`Inscrição concluída para ${newStudent.nomeCompleto} (Matrícula: ${newStudent.matricula})`);
    }

    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Tem a certeza que deseja remover este estudante do sistema Vendaia School®?')) {
      setStudents(students.filter((s) => s.id !== studentId));
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null);
        setCurrentView('estudantes');
      }
      showToast('Registo de estudante eliminado com sucesso.');
    }
  };

  const handleToggleStatus = (studentId: string) => {
    setStudents(
      students.map((s) => {
        if (s.id === studentId) {
          const newStatus = s.estadoMatricula === 'Ativo' ? 'Inativo' : 'Ativo';
          showToast(`Estado da matrícula de ${s.nomeCompleto} alterado para: ${newStatus}`);
          return { ...s, estadoMatricula: newStatus };
        }
        return s;
      })
    );
  };

  const handleBatchAction = (actionType: 'card' | 'declaration' | 'status' | 'notify') => {
    const labels = {
      card: 'Cartões de Estudante emitidos em lote para impressão.',
      declaration: 'Declarações de Matrícula geradas em PDF para envio.',
      status: 'Estado de matrícula atualizado para os estudantes selecionados.',
      notify: 'Notificações de pendências enviadas via SMS/Email aos encarregados.',
    };
    showToast(labels[actionType]);
  };

  const handleAddTimelineEvent = (eventData: Partial<TimelineEvent>) => {
    const newEvent: TimelineEvent = {
      id: `t_${Date.now()}`,
      studentId: eventData.studentId || selectedStudent?.id || 'EST-2024-089',
      timestamp: eventData.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateCategory: eventData.dateCategory || 'Hoje',
      categoria: eventData.categoria || 'administrative',
      categoriaLabel: eventData.categoriaLabel || 'Administrativo',
      badgeBg: eventData.badgeBg || 'bg-surface-container-high',
      badgeText: eventData.badgeText || 'text-on-surface-variant',
      icon: eventData.icon || 'info',
      iconColor: eventData.iconColor || 'text-outline',
      titulo: eventData.titulo || 'Nova Notificação',
      descricao: eventData.descricao || '',
      autorName: eventData.autorName || 'Secretaria - Sara Silva',
      autorType: eventData.autorType || 'secretary',
    };

    setTimelineEvents([newEvent, ...timelineEvents]);
  };

  const handleUpdateDocumentStatus = (docId: string, status: 'VALIDADO' | 'PENDENTE' | 'EXPIRADO') => {
    setDocuments(documents.map((d) => (d.id === docId ? { ...d, estado: status } : d)));
  };

  const handlePayFinancial = (finId: string) => {
    setFinancials(
      financials.map((f) =>
        f.id === finId
          ? {
              ...f,
              estado: 'Pago',
              dataPagamento: new Date().toLocaleDateString('pt-PT', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
            }
          : f
      )
    );
    showToast('Pagamento confirmado com sucesso! Recibo de liquidação emitido.');
  };

  const handleJustifyAbsence = (absId: string) => {
    setAbsences(
      absences.map((a) => (a.id === absId ? { ...a, estado: 'Justificada', observacao: 'Atestado validado' } : a))
    );
    showToast('Falta justificada e arquivada.');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans flex flex-col antialiased">
      {/* Top Header Navigation */}
      <HeaderNav
        currentView={currentView}
        selectedStudentName={selectedStudent?.nomeCompleto}
        onSelectView={setCurrentView}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1">
        {/* Collapsible Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          isExpanded={isSidebarExpanded}
          onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
          onShowToast={showToast}
        />

        {/* Dynamic Main View Container */}
        <main className="main-content flex-1 transition-all duration-300 pb-12">
          {currentView === 'estudantes' && (
            <StudentsView
              students={students}
              onSelectStudent={handleSelectStudent}
              onOpenAddModal={() => {
                setEditingStudent(null);
                setIsAddModalOpen(true);
              }}
              onOpenEditModal={(student) => {
                setEditingStudent(student);
                setIsAddModalOpen(true);
              }}
              onDeleteStudent={handleDeleteStudent}
              onToggleStatus={handleToggleStatus}
              onOpenBatchAction={handleBatchAction}
              onShowToast={showToast}
            />
          )}

          {currentView === 'perfil' && selectedStudent && (
            <StudentProfileView
              student={selectedStudent}
              grades={grades}
              financials={financials}
              absences={absences}
              documents={documents}
              timelineEvents={timelineEvents}
              onBack={() => setCurrentView('estudantes')}
              onEditStudent={(student) => {
                setEditingStudent(student);
                setIsAddModalOpen(true);
              }}
              onShowToast={showToast}
              onAddTimelineEvent={handleAddTimelineEvent}
              onUpdateDocumentStatus={handleUpdateDocumentStatus}
              onPayFinancial={handlePayFinancial}
              onJustifyAbsence={handleJustifyAbsence}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'comunicacao' && (
            <ComunicacaoView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'turmas' && (
            <TurmasView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'professores' && (
            <ProfessoresView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'config_academicas' && (
            <ConfigAcademicasView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'aluno_portal' && (
            <AlunoPortalView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'encarregado_portal' && (
            <EncarregadoPortalView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'professor_portal' && (
            <ProfessorPortalView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'servicos_produtos' && (
            <ServicosProdutosView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'cantina' && (
            <CantinaView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'tesouraria' && (
            <TesourariaView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'gestao_financeira' && (
            <GestaoFinanceiraView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'rh_colaboradores' && (
            <RhColaboradoresView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {(currentView === 'gestao_documental' || currentView === 'documental') && (
            <GestaoDocumentalView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'cms' && (
            <CmsView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {(currentView === 'utilizadores_permissoes' || currentView === 'administracao') && (
            <UtilizadoresPermissoesView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'estruturas' && (
            <EstruturasView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'config_instituicao' && (
            <ConfigInstituicaoView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'biblioteca' && (
            <BibliotecaView onSelectView={setCurrentView} onShowToast={showToast} />
          )}

          {currentView === 'financeiro' && (
            <div className="mt-header-height p-6 w-full">
              <div className="bg-surface-white border border-border-subtle rounded-xl p-8 text-center shadow-sm max-w-2xl mx-auto my-12">
                <span className="material-symbols-outlined text-secondary text-5xl mb-3">construction</span>
                <h2 className="text-xl font-bold text-primary capitalize mb-2">Módulo: {currentView}</h2>
                <p className="text-xs text-on-surface-variant mb-6">
                  Este módulo institucional da Vendaia School® está ativo e sincronizado com os estudantes.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setCurrentView('estudantes')}
                    className="bg-primary text-surface-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 cursor-pointer"
                  >
                    Ir para Gestão de Estudantes
                  </button>
                  <button
                    onClick={() => setCurrentView('comunicacao')}
                    className="bg-secondary text-surface-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 cursor-pointer"
                  >
                    Ir para Comunicação
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Form for Add/Edit Student */}
      <StudentFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveStudent}
        initialData={editingStudent}
      />

      {/* Floating Toast Notification */}
      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AccessProvider>
      <AppContent />
    </AccessProvider>
  );
}
