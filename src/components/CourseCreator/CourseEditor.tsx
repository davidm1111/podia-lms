import React, { useState } from 'react';
import type { Course, Section, Lesson, JupyterNotebook } from '../../types';
import { NotebookUploader } from './NotebookUploader';
import {
  Save,
  Plus,
  Trash2,
  FileCode,
  FileText,
  Clock,
  Check,
  Eye,
  ArrowLeft,
} from 'lucide-react';

interface CourseEditorProps {
  courses: Course[];
  onSaveCourse: (course: Course) => void;
  onPreviewCourse: (course: Course) => void;
  onBackToCatalog: () => void;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({
  courses,
  onSaveCourse,
  onPreviewCourse,
  onBackToCatalog,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [isSaved, setIsSaved] = useState(false);

  // Lesson Modal State
  const [editingLessonSectionId, setEditingLessonSectionId] = useState<string | null>(null);
  const [newLessonType, setNewLessonType] = useState<Lesson['type']>('notebook');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonSummary, setNewLessonSummary] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState(15);
  const [newLessonMarkdown, setNewLessonMarkdown] = useState('');
  const [newLessonNotebook, setNewLessonNotebook] = useState<JupyterNotebook | null>(null);
  const [newLessonNotebookFileName, setNewLessonNotebookFileName] = useState('');

  // Handle saving course
  const handleSave = () => {
    const updated = {
      ...selectedCourse,
      updatedAt: new Date().toISOString(),
    };
    onSaveCourse(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Create brand new course
  const handleCreateNewCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: 'Nuevo Curso de Ciencia de Datos e IA',
      slug: `nuevo-curso-${Date.now()}`,
      tagline: 'Aprende paso a paso con Jupyter Notebooks interactivos y proyectos reales.',
      description: 'Descripción completa de este curso práctico.',
      badge: 'Borrador',
      themeColor: '#724ae8',
      price: 'Gratis',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      instructor: {
        name: 'David Rodriguez',
        title: 'Instructor & Cloud Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
        bio: 'Creador de cursos tecnológicos y desarrollador fullstack en la nube.',
      },
      features: [
        'Soporte nativo de Jupyter Notebooks (.ipynb)',
        'Ejecución interactiva de Python en el navegador',
        'Despliegue gratuito en Cloudflare Pages',
      ],
      faq: [
        {
          question: '¿Qué requisitos previos necesito?',
          answer: 'Conocimientos básicos de computación y ganas de aprender.',
        },
      ],
      sections: [
        {
          id: `sec-${Date.now()}`,
          title: 'Módulo 1: Introducción',
          description: 'Primeros pasos y configuración',
          lessons: [],
        },
      ],
    };

    setSelectedCourse(newCourse);
    onSaveCourse(newCourse);
  };

  // Add Section
  const handleAddSection = () => {
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      title: `Módulo ${selectedCourse.sections.length + 1}: Nuevo Módulo`,
      description: 'Descripción de los temas cubiertos',
      lessons: [],
    };
    setSelectedCourse({
      ...selectedCourse,
      sections: [...selectedCourse.sections, newSection],
    });
  };

  // Delete Section
  const handleDeleteSection = (sectionId: string) => {
    if (selectedCourse.sections.length <= 1) {
      alert('El curso debe tener al menos una sección.');
      return;
    }
    setSelectedCourse({
      ...selectedCourse,
      sections: selectedCourse.sections.filter(s => s.id !== sectionId),
    });
  };

  // Add Lesson Submit
  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLessonSectionId || !newLessonTitle.trim()) return;

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: newLessonTitle.trim(),
      slug: newLessonTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: newLessonType,
      durationMinutes: Number(newLessonDuration) || 15,
      summary: newLessonSummary.trim(),
      contentMarkdown: newLessonType === 'article' ? newLessonMarkdown : undefined,
      notebookData: newLessonType === 'notebook' ? newLessonNotebook || undefined : undefined,
      notebookFileName: newLessonNotebookFileName || undefined,
      resources: newLessonType === 'notebook' && newLessonNotebook ? [
        { name: newLessonNotebookFileName || 'notebook.ipynb', url: '#', size: '15 KB' }
      ] : [],
    };

    const updatedSections = selectedCourse.sections.map(sec => {
      if (sec.id === editingLessonSectionId) {
        return {
          ...sec,
          lessons: [...sec.lessons, newLesson],
        };
      }
      return sec;
    });

    const updatedCourse = { ...selectedCourse, sections: updatedSections };
    setSelectedCourse(updatedCourse);
    onSaveCourse(updatedCourse);

    // Reset modal
    setEditingLessonSectionId(null);
    setNewLessonTitle('');
    setNewLessonSummary('');
    setNewLessonMarkdown('');
    setNewLessonNotebook(null);
    setNewLessonNotebookFileName('');
  };

  // Delete Lesson
  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    const updatedSections = selectedCourse.sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          lessons: sec.lessons.filter(l => l.id !== lessonId),
        };
      }
      return sec;
    });
    setSelectedCourse({ ...selectedCourse, sections: updatedSections });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8 px-4 sm:px-6 lg:px-8 text-[#2c2533]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Bar with Podia Styling */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToCatalog}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                Estudio de Creador
              </span>
              <h1 className="text-2xl font-extrabold text-[#281434] tracking-tight">
                Editor de Cursos y Notebooks
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreviewCourse(selectedCourse)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-700 hover:text-[#281434] text-xs font-semibold shadow-2xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>Vista Previa</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-semibold px-5 py-2 rounded-full text-xs shadow-xs transition-all active:scale-95"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>¡Cambios Guardados!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Curso</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Course Switcher / New Course */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-stone-500">Curso Activo:</label>
            <select
              value={selectedCourse.id}
              onChange={(e) => {
                const found = courses.find(c => c.id === e.target.value);
                if (found) setSelectedCourse(found);
              }}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-[#281434] focus:outline-none focus:ring-1 focus:ring-purple-400 bg-[#faf8f5]"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateNewCourse}
            className="flex items-center gap-1.5 text-xs font-bold text-[#724ae8] hover:text-[#5d38cc]"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Curso</span>
          </button>
        </div>

        {/* Course Basic Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <h3 className="text-lg font-bold text-[#281434] pb-2 border-b border-stone-100">
            Detalles Generales del Curso
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-600">Título del curso</label>
              <input
                type="text"
                value={selectedCourse.title}
                onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-600">Etiqueta destacada (Badge)</label>
              <input
                type="text"
                value={selectedCourse.badge || ''}
                onChange={(e) => setSelectedCourse({ ...selectedCourse, badge: e.target.value })}
                placeholder="p. ej. Curso Más Popular, Nuevo, Certificado"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-600">Subtítulo / Tagline</label>
            <input
              type="text"
              value={selectedCourse.tagline}
              onChange={(e) => setSelectedCourse({ ...selectedCourse, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-600">Descripción detallada</label>
            <textarea
              rows={3}
              value={selectedCourse.description}
              onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
              className="w-full p-4 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
            />
          </div>
        </div>

        {/* Curriculum Sections & Lessons Manager */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Estructura del Plan de Estudios
              </span>
              <h3 className="text-xl font-bold text-[#281434]">
                Módulos y Lecciones ({selectedCourse.sections.length} módulos)
              </h3>
            </div>

            <button
              onClick={handleAddSection}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-stone-200 text-[#724ae8] hover:bg-purple-50 text-xs font-bold shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Módulo</span>
            </button>
          </div>

          {selectedCourse.sections.map((section, sIdx) => (
            <div
              key={section.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden space-y-4 p-5 sm:p-6"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                    Módulo {sIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      const updatedSections = [...selectedCourse.sections];
                      updatedSections[sIdx].title = e.target.value;
                      setSelectedCourse({ ...selectedCourse, sections: updatedSections });
                    }}
                    className="font-bold text-base text-[#281434] bg-transparent border-b border-transparent hover:border-stone-300 focus:border-purple-400 focus:outline-none px-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingLessonSectionId(section.id)}
                    className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-[#724ae8] px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Lección</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar este módulo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lessons List in Section */}
              <div className="space-y-2">
                {section.lessons.length === 0 ? (
                  <div className="py-6 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-2xl bg-[#faf8f5]/50">
                    No hay lecciones en este módulo. Pulsa <strong>"Añadir Lección"</strong> o sube un archivo <strong>.ipynb</strong>.
                  </div>
                ) : (
                  section.lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-stone-200/80 hover:bg-white transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {lesson.type === 'notebook' ? (
                          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                            <FileCode className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                        <div className="truncate">
                          <span className="text-xs sm:text-sm font-bold text-stone-800 block truncate">
                            {lesson.title}
                          </span>
                          <span className="text-[11px] text-stone-500 block truncate">
                            {lesson.summary || 'Sin descripción'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {lesson.type === 'notebook' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-purple-100 text-purple-800">
                            .ipynb
                          </span>
                        )}
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.durationMinutes}m
                        </span>

                        <button
                          onClick={() => handleDeleteLesson(section.id, lesson.id)}
                          className="p-1 rounded-lg text-stone-300 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Lesson Modal */}
      {editingLessonSectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#281434] mb-4">
              Añadir Nueva Lección
            </h3>

            <form onSubmit={handleAddLessonSubmit} className="space-y-4">
              {/* Lesson Type Tabs */}
              <div>
                <label className="text-xs font-bold text-stone-600 mb-1.5 block">
                  Tipo de Contenido
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLessonType('notebook')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      newLessonType === 'notebook'
                        ? 'border-[#724ae8] bg-purple-50 text-[#724ae8] shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <FileCode className="w-4 h-4" />
                    <span>Jupyter Notebook (.ipynb)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewLessonType('article')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      newLessonType === 'article'
                        ? 'border-[#724ae8] bg-purple-50 text-[#724ae8] shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Guía Markdown</span>
                  </button>
                </div>
              </div>

              {/* Title & Duration */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-stone-600">Título de la lección</label>
                  <input
                    type="text"
                    required
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="p. ej. Introducción a Redes Neuronales"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600">Duración (min)</label>
                  <input
                    type="number"
                    value={newLessonDuration}
                    onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600">Resumen breve</label>
                <input
                  type="text"
                  value={newLessonSummary}
                  onChange={(e) => setNewLessonSummary(e.target.value)}
                  placeholder="Qué aprenderá el estudiante en esta clase"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              {/* Specific Content Type Fields */}
              {newLessonType === 'notebook' ? (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-purple-900 block">
                    Cargar archivo Jupyter Notebook (.ipynb)
                  </label>
                  <NotebookUploader
                    title="Subir archivo .ipynb para esta lección"
                    subtitle="El archivo se parseará automáticamente y se convertirá en lección interactiva"
                    onNotebookLoaded={(parsed, name) => {
                      setNewLessonNotebook(parsed);
                      setNewLessonNotebookFileName(name);
                      if (!newLessonTitle) {
                        // Auto-fill title from filename
                        setNewLessonTitle(name.replace('.ipynb', '').replace(/[-_]/g, ' '));
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-stone-600">Contenido Markdown</label>
                  <textarea
                    rows={6}
                    value={newLessonMarkdown}
                    onChange={(e) => setNewLessonMarkdown(e.target.value)}
                    placeholder="# Título en Markdown&#10;&#10;Escribe tu explicación teórica aquí... Puedes usar bloques de código con ```python"
                    className="w-full p-3 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                  />
                </div>
              )}

              {/* Modal Buttons */}
              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingLessonSectionId(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#724ae8] hover:bg-[#5d38cc] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  Guardar Lección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
