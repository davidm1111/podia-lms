import React, { useState } from 'react';
import type { Course, Section, Lesson, JupyterNotebook, QuizQuestion } from '../../types';
import { NotebookUploader } from './NotebookUploader';
import {
  Save,
  Plus,
  Trash2,
  FileCode,
  FileText,
  Video,
  Image as ImageIcon,
  Headphones,
  HelpCircle,
  Clock,
  Check,
  Eye,
  ArrowLeft,
} from 'lucide-react';

interface CourseEditorProps {
  courses: Course[];
  onSaveCourse: (course: Course) => void;
  onPreviewCourse: (course: Course) => void;
  onBackToDashboard: () => void;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({
  courses,
  onSaveCourse,
  onPreviewCourse,
  onBackToDashboard,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [isSaved, setIsSaved] = useState(false);

  // Lesson Modal State
  const [editingLessonSectionId, setEditingLessonSectionId] = useState<string | null>(null);
  const [newLessonType, setNewLessonType] = useState<Lesson['type']>('video');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonSummary, setNewLessonSummary] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState(15);

  // Module Specific Form States
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonImageUrl, setNewLessonImageUrl] = useState('');
  const [newLessonImageCaption, setNewLessonImageCaption] = useState('');
  const [newLessonAudioUrl, setNewLessonAudioUrl] = useState('');
  const [newLessonAudioTitle, setNewLessonAudioTitle] = useState('');
  const [newLessonMarkdown, setNewLessonMarkdown] = useState('');
  const [newLessonNotebook, setNewLessonNotebook] = useState<JupyterNotebook | null>(null);
  const [newLessonNotebookFileName, setNewLessonNotebookFileName] = useState('');

  // Quiz questions state
  const [newQuizQuestions, setNewQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-1',
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
    },
  ]);

  const handleSave = () => {
    const updated = {
      ...selectedCourse,
      updatedAt: new Date().toISOString(),
    };
    onSaveCourse(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCreateNewCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: 'Nuevo Curso de Formación Profesional',
      slug: `nuevo-curso-${Date.now()}`,
      tagline: 'Aprende paso a paso con vídeos, audios, código y cuestionarios interactivos.',
      description: 'Descripción completa del programa formativo.',
      badge: 'Borrador',
      themeColor: '#724ae8',
      price: 'Acceso Privado',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      instructor: {
        name: 'Prof. David Rodriguez',
        title: 'Director de Ingeniería y Formador de IA',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
        bio: 'Instructor y arquitecto de software.',
      },
      features: [
        'Módulos multimedia de vídeo, audio y fotos',
        'Ejecución en navegador de código Python (.ipynb)',
        'Cuestionarios interactivos autocorregibles',
      ],
      faq: [],
      sections: [
        {
          id: `sec-${Date.now()}`,
          title: 'Módulo 1: Introducción y Primeros Pasos',
          description: 'Lecciones iniciales del programa',
          lessons: [],
        },
      ],
    };

    setSelectedCourse(newCourse);
    onSaveCourse(newCourse);
  };

  const handleAddSection = () => {
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      title: `Módulo ${selectedCourse.sections.length + 1}: Nuevo Módulo`,
      description: 'Descripción de las competencias a desarrollar',
      lessons: [],
    };
    setSelectedCourse({
      ...selectedCourse,
      sections: [...selectedCourse.sections, newSection],
    });
  };

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
      // Specific data by module type
      videoUrl: newLessonType === 'video' ? newLessonVideoUrl.trim() : undefined,
      imageUrl: newLessonType === 'image' ? newLessonImageUrl.trim() : undefined,
      imageCaption: newLessonType === 'image' ? newLessonImageCaption.trim() : undefined,
      audioUrl: newLessonType === 'audio' ? newLessonAudioUrl.trim() : undefined,
      audioTitle: newLessonType === 'audio' ? (newLessonAudioTitle.trim() || newLessonTitle.trim()) : undefined,
      contentMarkdown: newLessonType === 'article' || newLessonMarkdown ? newLessonMarkdown : undefined,
      notebookData: newLessonType === 'notebook' ? newLessonNotebook || undefined : undefined,
      notebookFileName: newLessonNotebookFileName || undefined,
      quizQuestions: newLessonType === 'quiz' ? newQuizQuestions.filter(q => q.question.trim().length > 0) : undefined,
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
    setNewLessonVideoUrl('');
    setNewLessonImageUrl('');
    setNewLessonImageCaption('');
    setNewLessonAudioUrl('');
    setNewLessonAudioTitle('');
    setNewLessonMarkdown('');
    setNewLessonNotebook(null);
    setNewLessonNotebookFileName('');
  };

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

  const getModuleIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case 'article':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'notebook':
        return <FileCode className="w-4 h-4 text-purple-600" />;
      case 'audio':
        return <Headphones className="w-4 h-4 text-amber-500" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              Diseñador de Cursos Multimedia
            </span>
            <h1 className="text-2xl font-extrabold text-[#281434] tracking-tight">
              Editor de Módulos y Lecciones
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPreviewCourse(selectedCourse)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-700 hover:text-[#281434] text-xs font-semibold shadow-2xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Vista de Alumno</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-semibold px-5 py-2 rounded-full text-xs shadow-xs transition-all active:scale-95"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Course Selector & New Course */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-stone-500">Curso Seleccionado:</label>
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
          Información del Curso
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-600">Título</label>
            <input
              type="text"
              value={selectedCourse.title}
              onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-600">Subtítulo / Tagline</label>
            <input
              type="text"
              value={selectedCourse.tagline}
              onChange={(e) => setSelectedCourse({ ...selectedCourse, tagline: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>
      </div>

      {/* Sections and Lessons */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Estructura Temática
            </span>
            <h3 className="text-xl font-bold text-[#281434]">
              Módulos del Curso ({selectedCourse.sections.length})
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
                  <span>Añadir Lección Multimedia</span>
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
                  No hay lecciones creadas. Pulsa <strong>"Añadir Lección Multimedia"</strong> para agregar Vídeo, Audio, Infografía, Código o Quiz.
                </div>
              ) : (
                section.lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-stone-200/80 hover:bg-white transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="p-2 rounded-xl bg-white border border-stone-200">
                        {getModuleIcon(lesson.type)}
                      </div>
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
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#724ae8]">
                        {lesson.type}
                      </span>
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

      {/* Add Lesson Modal with All 6 Modules */}
      {editingLessonSectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#281434] mb-4">
              Añadir Módulo / Lección al Curso
            </h3>

            <form onSubmit={handleAddLessonSubmit} className="space-y-5">
              {/* Module Type Selector (6 types requested by user) */}
              <div>
                <label className="text-xs font-bold text-stone-700 mb-2 block">
                  Selecciona el Formato de la Lección:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'video', label: 'Vídeo HD', icon: Video, color: 'text-rose-500' },
                    { id: 'image', label: 'Infografía / Foto', icon: ImageIcon, color: 'text-blue-500' },
                    { id: 'audio', label: 'Audio / Podcast', icon: Headphones, color: 'text-amber-500' },
                    { id: 'notebook', label: 'Código (.ipynb)', icon: FileCode, color: 'text-purple-600' },
                    { id: 'article', label: 'Guía / Lectura', icon: FileText, color: 'text-emerald-600' },
                    { id: 'quiz', label: 'Cuestionario Test', icon: HelpCircle, color: 'text-indigo-500' },
                  ].map(mod => {
                    const Icon = mod.icon;
                    const isSelected = newLessonType === mod.id;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setNewLessonType(mod.id as any)}
                        className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                          isSelected
                            ? 'border-[#724ae8] bg-purple-50 text-[#724ae8] ring-1 ring-[#724ae8]'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${mod.color}`} />
                        <span>{mod.label}</span>
                      </button>
                    );
                  })}
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
                    placeholder="p. ej. Clase Práctica 1"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600">Duración (min)</label>
                  <input
                    type="number"
                    value={newLessonDuration}
                    onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
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
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              {/* Module-Specific Fields */}
              {/* 1. Video Module */}
              {newLessonType === 'video' && (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                  <label className="text-xs font-bold text-rose-900 block">
                    URL del Vídeo (YouTube, Vimeo o enlace directo .mp4)
                  </label>
                  <input
                    type="url"
                    required
                    value={newLessonVideoUrl}
                    onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... o https://...video.mp4"
                    className="w-full px-3.5 py-2 rounded-xl border border-rose-200 bg-white text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
              )}

              {/* 2. Image / Photo Module */}
              {newLessonType === 'image' && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-blue-900 block">URL de la Imagen o Infografía</label>
                    <input
                      type="url"
                      required
                      value={newLessonImageUrl}
                      onChange={(e) => setNewLessonImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... o enlace directo a imagen"
                      className="w-full px-3.5 py-2 rounded-xl border border-blue-200 bg-white text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-blue-900 block">Pie de foto / Explicación visual</label>
                    <input
                      type="text"
                      value={newLessonImageCaption}
                      onChange={(e) => setNewLessonImageCaption(e.target.value)}
                      placeholder="Descripción de la infografía o esquema..."
                      className="w-full px-3.5 py-2 rounded-xl border border-blue-200 bg-white text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>
              )}

              {/* 3. Audio / Podcast Module */}
              {newLessonType === 'audio' && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-900 block">URL del Archivo de Audio (MP3 o Podcast)</label>
                    <input
                      type="url"
                      required
                      value={newLessonAudioUrl}
                      onChange={(e) => setNewLessonAudioUrl(e.target.value)}
                      placeholder="https://.../episodio.mp3"
                      className="w-full px-3.5 py-2 rounded-xl border border-amber-200 bg-white text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-900 block">Título del Episodio</label>
                    <input
                      type="text"
                      value={newLessonAudioTitle}
                      onChange={(e) => setNewLessonAudioTitle(e.target.value)}
                      placeholder="Episodio 1: ..."
                      className="w-full px-3.5 py-2 rounded-xl border border-amber-200 bg-white text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                </div>
              )}

              {/* 4. Notebook / Code Module */}
              {newLessonType === 'notebook' && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-purple-900 block">
                    Cargar archivo Jupyter Notebook (.ipynb)
                  </label>
                  <NotebookUploader
                    title="Subir archivo .ipynb para esta lección"
                    subtitle="El archivo se convertirá en código interactivo ejecutable en el navegador"
                    onNotebookLoaded={(parsed, name) => {
                      setNewLessonNotebook(parsed);
                      setNewLessonNotebookFileName(name);
                      if (!newLessonTitle) {
                        setNewLessonTitle(name.replace('.ipynb', '').replace(/[-_]/g, ' '));
                      }
                    }}
                  />
                </div>
              )}

              {/* 5. Article / Text Markdown Module */}
              {newLessonType === 'article' && (
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-stone-600">Contenido en Markdown</label>
                  <textarea
                    rows={5}
                    value={newLessonMarkdown}
                    onChange={(e) => setNewLessonMarkdown(e.target.value)}
                    placeholder="# Título&#10;&#10;Escribe tu explicación... Puedes usar bloques de código con ```python"
                    className="w-full p-3 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                  />
                </div>
              )}

              {/* 6. Quiz Module */}
              {newLessonType === 'quiz' && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900">
                      Preguntas del Cuestionario ({newQuizQuestions.length})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setNewQuizQuestions([
                          ...newQuizQuestions,
                          {
                            id: `q-${Date.now()}`,
                            question: '',
                            options: ['', '', '', ''],
                            correctIndex: 0,
                            explanation: '',
                          },
                        ])
                      }
                      className="text-xs font-bold text-[#724ae8] hover:underline"
                    >
                      + Añadir otra pregunta
                    </button>
                  </div>

                  {newQuizQuestions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-white rounded-xl border border-indigo-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-indigo-700">Pregunta #{idx + 1}</span>
                        {newQuizQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setNewQuizQuestions(newQuizQuestions.filter(item => item.id !== q.id))}
                            className="text-[11px] text-rose-500 hover:underline"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...newQuizQuestions];
                          updated[idx].question = e.target.value;
                          setNewQuizQuestions(updated);
                        }}
                        placeholder="Escribe la pregunta..."
                        className="w-full p-2 border border-stone-200 rounded-lg text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctIndex === optIdx}
                              onChange={() => {
                                const updated = [...newQuizQuestions];
                                updated[idx].correctIndex = optIdx;
                                setNewQuizQuestions(updated);
                              }}
                              title="Marcar como respuesta correcta"
                            />
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => {
                                const updated = [...newQuizQuestions];
                                updated[idx].options[optIdx] = e.target.value;
                                setNewQuizQuestions(updated);
                              }}
                              placeholder={`Opción ${optIdx + 1}`}
                              className="w-full p-1.5 border border-stone-200 rounded text-xs"
                            />
                          </div>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => {
                          const updated = [...newQuizQuestions];
                          updated[idx].explanation = e.target.value;
                          setNewQuizQuestions(updated);
                        }}
                        placeholder="Explicación pedagógica de la respuesta correcta..."
                        className="w-full p-1.5 border border-stone-200 rounded text-[11px] text-stone-600"
                      />
                    </div>
                  ))}
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
