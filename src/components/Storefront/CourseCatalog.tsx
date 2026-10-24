import React from 'react';
import type { Course, AuthUser } from '../../types';
import { getStoredProgress } from '../../lib/storage';
import {
  FileCode,
  Sparkles,
  ArrowRight,
  BookOpen,
  Cloud,
  Users,
  Video,
  Headphones,
  HelpCircle,
} from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  authUser: AuthUser | null;
  onSelectCourse: (course: Course) => void;
  onOpenCoursePlayer: (course: Course) => void;
  onOpenAdmin: () => void;
  onOpenDeployModal: () => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  authUser,
  onSelectCourse,
  onOpenCoursePlayer,
  onOpenAdmin,
  onOpenDeployModal,
}) => {
  const userId = authUser?.id || 'default';

  const coursesWithProgress = courses.map(course => {
    const progress = getStoredProgress(course.id, userId);
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

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 px-4 sm:px-6 lg:px-8 text-[#2c2533]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Welcome Banner */}
        <div className="bg-[#281434] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma de Formación Privada</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Aprende con <span className="text-purple-300">Vídeo, Audio y Código</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {authUser
                ? `Bienvenido/a, ${authUser.name}. Tienes acceso exclusivo a tus módulos formativos, laboratorios de código interactivo y cuestionarios.`
                : 'Accede a tus cursos autorizados con tus credenciales asignadas por el profesor.'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => onSelectCourse(courses[0])}
                className="flex items-center gap-2 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-bold py-3 px-6 rounded-full text-sm shadow-md transition-all active:scale-95"
              >
                <span>Ver Mi Plan de Estudios</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {authUser?.role === 'admin' ? (
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-5 rounded-full text-sm backdrop-blur-xs transition-colors"
                >
                  <Users className="w-4 h-4 text-purple-300" />
                  <span>Gestionar Alumnos</span>
                </button>
              ) : (
                <button
                  onClick={onOpenDeployModal}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-5 rounded-full text-sm backdrop-blur-xs transition-colors"
                >
                  <Cloud className="w-4 h-4 text-orange-400" />
                  <span>Cloudflare $0</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Learning Stats Card */}
          <div className="w-full md:w-80 shrink-0 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-left z-10 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
              Módulos Disponibles
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/10 rounded-2xl flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-400" />
                <span>Vídeos HD</span>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-300" />
                <span>Python .ipynb</span>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-300" />
                <span>Podcasts</span>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-300" />
                <span>Quizzes</span>
              </div>
            </div>
          </div>
        </div>

        {/* In-Progress Courses */}
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
                      {course.badge || 'Curso Asignado'}
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
                      <span>Continuar Lección</span>
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
                Catálogo de Cursos
              </span>
              <h2 className="text-2xl font-extrabold text-[#281434] tracking-tight">
                Cursos Asignados en la Academia
              </h2>
            </div>

            {authUser?.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="text-xs font-semibold text-[#724ae8] hover:text-[#5d38cc] flex items-center gap-1 group self-start sm:self-auto"
              >
                <span>+ Gestionar o añadir curso</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => {
              const allLessons = course.sections.flatMap(s => s.lessons);
              const notebookLessons = allLessons.filter(l => l.type === 'notebook');
              const videoLessons = allLessons.filter(l => l.type === 'video');

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
                      <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full">
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

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-2">
                      <div className="flex items-center gap-1 font-medium">
                        <Video className="w-3.5 h-3.5 text-rose-500" />
                        <span>{videoLessons.length} Vídeos</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <FileCode className="w-3.5 h-3.5 text-purple-600" />
                        <span>{notebookLessons.length} Notebooks</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-stone-400" />
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
                        Temario
                      </button>

                      <button
                        onClick={() => onOpenCoursePlayer(course)}
                        className="flex items-center gap-1.5 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-semibold px-4 py-1.5 rounded-full text-xs shadow-2xs transition-all active:scale-95"
                      >
                        <span>Entrar</span>
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
