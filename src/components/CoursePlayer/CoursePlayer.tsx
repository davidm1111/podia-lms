import React, { useState } from 'react';
import type { Course, Lesson } from '../../types';
import { CurriculumSidebar } from './CurriculumSidebar';
import { NotebookRenderer } from '../Notebook/NotebookRenderer';
import { MarkdownView } from '../MarkdownView';
import { LessonComments } from './LessonComments';
import { CelebrationModal } from './CelebrationModal';
import {
  getStoredProgress,
  toggleLessonCompletion,
  saveLessonNote,
  addLessonComment,
} from '../../lib/storage';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
  Download,
  FileCode,
  FileText,
  Clock,
  Sparkles,
  Paperclip,
} from 'lucide-react';

interface CoursePlayerProps {
  course: Course;
  initialLessonId?: string;
  onBackToCourse: () => void;
  onGoToDashboard: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  initialLessonId,
  onBackToCourse,
  onGoToDashboard,
}) => {
  // All lessons flat array for easy sequential navigation
  const allLessons = course.sections.flatMap(s => s.lessons);

  // Active lesson
  const [activeLesson, setActiveLesson] = useState<Lesson>(() => {
    if (initialLessonId) {
      const found = allLessons.find(l => l.id === initialLessonId);
      if (found) return found;
    }
    return allLessons[0] || course.sections[0]?.lessons[0];
  });

  // User progress state
  const [progress, setProgress] = useState(() => getStoredProgress(course.id));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Current lesson navigation indices
  const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCurrentLessonDone = progress.completedLessonIds.includes(activeLesson.id);

  // Toggle complete
  const handleToggleComplete = (lessonId: string) => {
    toggleLessonCompletion(course.id, lessonId);
    const updated = getStoredProgress(course.id);
    setProgress(updated);

    // Check if course 100% complete
    const isNowAllDone = allLessons.every(l => updated.completedLessonIds.includes(l.id));
    if (isNowAllDone) {
      setShowCelebration(true);
    }
  };

  // Mark current as complete and advance to next lesson
  const handleCompleteAndNext = () => {
    if (!isCurrentLessonDone) {
      handleToggleComplete(activeLesson.id);
    }
    if (nextLesson) {
      setActiveLesson(nextLesson);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finished last lesson!
      setShowCelebration(true);
    }
  };

  return (
    <div className="flex h-screen bg-[#faf8f5] overflow-hidden text-[#2c2533]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Curriculum Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:static lg:z-auto transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <CurriculumSidebar
          course={course}
          activeLessonId={activeLesson.id}
          completedLessonIds={progress.completedLessonIds}
          onSelectLesson={(lesson) => {
            setActiveLesson(lesson);
            setIsSidebarOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onToggleComplete={handleToggleComplete}
          onBackToCourse={onBackToCourse}
        />
      </div>

      {/* Main Learning Space */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-stone-200/90 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Lección {currentIndex + 1} de {allLessons.length}
              </span>
              <h1 className="text-sm font-bold text-[#281434] line-clamp-1 max-w-md">
                {activeLesson.title}
              </h1>
            </div>
          </div>

          {/* Quick Prev / Next Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => prevLesson && setActiveLesson(prevLesson)}
              disabled={!prevLesson}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Lección anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => nextLesson && setActiveLesson(nextLesson)}
              disabled={!nextLesson}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Siguiente lección"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleToggleComplete(activeLesson.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isCurrentLessonDone
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentLessonDone ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span className="hidden md:inline">{isCurrentLessonDone ? 'Completada' : 'Marcar lista'}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Lesson Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Lesson Title Header */}
            <div className="space-y-3 pb-6 border-b border-stone-200/80">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-[#724ae8]">
                  {activeLesson.type === 'notebook' ? (
                    <>
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Jupyter Notebook (.ipynb)</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      <span>Guía de Estudio</span>
                    </>
                  )}
                </span>

                <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {activeLesson.durationMinutes} minutos estimados
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#281434] tracking-tight">
                {activeLesson.title}
              </h1>

              {activeLesson.summary && (
                <p className="text-base text-stone-600 leading-relaxed">
                  {activeLesson.summary}
                </p>
              )}
            </div>

            {/* Content Display: Notebook or Markdown Article */}
            {activeLesson.type === 'notebook' && activeLesson.notebookData ? (
              <NotebookRenderer
                notebook={activeLesson.notebookData}
                fileName={activeLesson.notebookFileName || `${activeLesson.slug}.ipynb`}
                lessonTitle={activeLesson.title}
              />
            ) : activeLesson.contentMarkdown ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs">
                <MarkdownView content={activeLesson.contentMarkdown} />
              </div>
            ) : (
              <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-stone-500">
                Esta lección aún no tiene contenido asignado.
              </div>
            )}

            {/* Resources / Downloads Box */}
            {activeLesson.resources && activeLesson.resources.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-900">
                  <Paperclip className="w-4 h-4 text-purple-600" />
                  <span>Archivos y Recursos Descargables</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeLesson.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      onClick={(e) => {
                        if (res.url === '#' && activeLesson.notebookData) {
                          e.preventDefault();
                          // Download current notebook
                          const blob = new Blob([JSON.stringify(activeLesson.notebookData, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = res.name;
                          a.click();
                        }
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] hover:bg-purple-50/50 border border-stone-200/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <FileCode className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="text-xs font-medium text-stone-800 truncate group-hover:text-purple-900">
                          {res.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-400">
                        <span>{res.size || 'Descargar'}</span>
                        <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Podia Signature "Complete & Continue" Big Footer Button */}
            <div className="pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
              {prevLesson ? (
                <button
                  onClick={() => {
                    setActiveLesson(prevLesson);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{prevLesson.title}</span>
                </button>
              ) : <div />}

              <button
                onClick={handleCompleteAndNext}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-semibold py-3.5 px-8 rounded-full shadow-md shadow-purple-200 transition-all active:scale-95 text-sm"
              >
                <span>{nextLesson ? 'Completar y continuar' : 'Finalizar curso'}</span>
                {nextLesson ? <ChevronRight className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </button>
            </div>

            {/* Lesson Comments & Private Study Notes */}
            <LessonComments
              lessonId={activeLesson.id}
              comments={progress.comments}
              initialNote={progress.notes[activeLesson.id] || ''}
              onSaveNote={(note) => {
                saveLessonNote(course.id, activeLesson.id, note);
                setProgress(getStoredProgress(course.id));
              }}
              onAddComment={(comment) => {
                addLessonComment(course.id, comment);
                setProgress(getStoredProgress(course.id));
              }}
            />
          </div>
        </main>
      </div>

      {/* Course Completion Confetti Modal */}
      <CelebrationModal
        course={course}
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onGoToDashboard={onGoToDashboard}
      />
    </div>
  );
};
