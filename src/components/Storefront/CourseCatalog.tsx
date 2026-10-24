import React, { useRef } from 'react';
import type { Course } from '../../types';
import { getStoredProgress } from '../../lib/storage';
import { parseNotebook } from '../../lib/notebookParser';
import {
  FileCode,
  Sparkles,
  ArrowRight,
  Upload,
  BookOpen,
  Cloud,
} from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onOpenCoursePlayer: (course: Course) => void;
  onOpenCreator: () => void;
  onOpenDeployModal: () => void;
  onQuickUploadNotebook: (notebookData: any, fileName: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  onSelectCourse,
  onOpenCoursePlayer,
  onOpenCreator,
  onOpenDeployModal,
  onQuickUploadNotebook,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter in-progress courses
  const coursesWithProgress = courses.map(course => {
    const progress = getStoredProgress(course.id);
    const allLessons = course.sections.flatMap(s => s.lessons);
    const completedCount = allLessons.filter(l => progress.completedLessonIds.includes(l.id)).length;
    const percent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
    return {
      course,
      completedCount,
      totalCount: allLessons.length,
      percent,
    };
  });

  const enrolled = coursesWithProgress.filter(c => c.completedCount > 0);

  // File upload handler for fast notebook inspection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseNotebook(text);
        onQuickUploadNotebook(parsed, file.name);
      } catch (err: any) {
        alert(err.message || 'Error al procesar el archivo .ipynb');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 px-4 sm:px-6 lg:px-8 text-[#2c2533]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Welcome Hero Banner with Podia Plum Aesthetics */}
        <div className="bg-[#281434] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LMS Gratuito para Cloudflare</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Aprende y enseña con <span className="text-purple-300">Jupyter Notebooks</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Plataforma LMS moderna inspirada en la estética limpia de Podia. Ejecuta código Python interactivo en tu navegador y despliega gratis en Cloudflare Pages sin costes de servidor.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => onSelectCourse(courses[0])}
                className="flex items-center gap-2 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-bold py-3 px-6 rounded-full text-sm shadow-md transition-all active:scale-95"
              >
                <span>Explorar Cursos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDeployModal}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-5 rounded-full text-sm backdrop-blur-xs transition-colors"
              >
                <Cloud className="w-4 h-4 text-orange-400" />
                <span>Desplegar en Cloudflare $0</span>
              </button>
            </div>
          </div>

          {/* Quick Upload Notebook Card */}
          <div className="w-full md:w-84 shrink-0 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl text-center z-10">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300 mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">¿Tienes un archivo .ipynb?</h3>
            <p className="text-xs text-purple-200 mt-1 mb-4 leading-relaxed">
              Sube tu propio Jupyter Notebook desde tu ordenador para visualizarlo y ejecutarlo aquí al instante.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".ipynb,application/x-ipynb+json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-full bg-white text-[#281434] hover:bg-purple-50 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              Seleccionar archivo .ipynb
            </button>
          </div>
        </div>

        {/* In-Progress Courses (if any) */}
        {enrolled.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#281434] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#724ae8]" />
                <span>Continuar Aprendiendo</span>
              </h2>
              <span className="text-xs text-stone-500">
                {enrolled.length} curso(s) en progreso
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolled.map(({ course, completedCount, totalCount, percent }) => (
                <div
                  key={course.id}
                  className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
                      {course.badge || 'Curso Inscrito'}
                    </span>
                    <h3 className="text-base font-bold text-[#281434] line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2">{course.tagline}</p>
                  </div>

                  <div className="mt-5 space-y-3 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">{completedCount} de {totalCount} lecciones</span>
                      <span className="font-bold text-[#724ae8]">{percent}%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#724ae8] h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <button
                      onClick={() => onOpenCoursePlayer(course)}
                      className="w-full mt-2 flex items-center justify-center gap-2 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-semibold py-2.5 rounded-full text-xs shadow-xs transition-all active:scale-95"
                    >
                      <span>Continuar donde lo dejaste</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Available Courses Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Explora el Catálogo
              </span>
              <h2 className="text-2xl font-extrabold text-[#281434] tracking-tight">
                Todos los cursos disponibles
              </h2>
            </div>

            <button
              onClick={onOpenCreator}
              className="text-xs font-semibold text-[#724ae8] hover:text-[#5d38cc] flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>+ Crear o importar curso</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {courses.map(course => {
              const allLessons = course.sections.flatMap(s => s.lessons);
              const notebookLessons = allLessons.filter(l => l.type === 'notebook');

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      {course.badge && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-[#724ae8]">
                          {course.badge}
                        </span>
                      )}
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {course.price}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectCourse(course)}
                      className="text-xl font-bold text-[#281434] group-hover:text-[#724ae8] transition-colors cursor-pointer leading-snug"
                    >
                      {course.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {course.tagline}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-stone-500 pt-2">
                      <div className="flex items-center gap-1.5 font-medium">
                        <FileCode className="w-4 h-4 text-purple-600" />
                        <span>{notebookLessons.length} Notebooks</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <BookOpen className="w-4 h-4 text-stone-400" />
                        <span>{allLessons.length} Lecciones</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-[#faf8f5]/80 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-7 h-7 rounded-full border border-purple-200"
                      />
                      <span className="text-xs font-semibold text-stone-700">{course.instructor.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:text-[#281434] hover:bg-white transition-colors"
                      >
                        Ver detalles
                      </button>

                      <button
                        onClick={() => onOpenCoursePlayer(course)}
                        className="flex items-center gap-1.5 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-semibold px-4 py-1.5 rounded-full text-xs shadow-2xs transition-all active:scale-95"
                      >
                        <span>Comenzar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
