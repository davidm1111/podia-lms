import React, { useState } from 'react';
import type { Course } from '../../types';
import {
  Check,
  ChevronDown,
  ChevronRight,
  FileCode,
  FileText,
  PlayCircle,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface CourseLandingProps {
  course: Course;
  onEnrollOrStart: () => void;
  onBackToCatalog: () => void;
}

export const CourseLanding: React.FC<CourseLandingProps> = ({
  course,
  onEnrollOrStart,
  onBackToCatalog,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // Open first 2 sections by default
    const map: Record<string, boolean> = {};
    course.sections.slice(0, 2).forEach(s => {
      map[s.id] = true;
    });
    return map;
  });

  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true });

  const toggleSection = (id: string) => {
    setOpenSections(p => ({ ...p, [id]: !p[id] }));
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqs(p => ({ ...p, [idx]: !p[idx] }));
  };

  const allLessons = course.sections.flatMap(s => s.lessons);
  const totalMinutes = allLessons.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
  const totalNotebooks = allLessons.filter(l => l.type === 'notebook').length;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2533]">
      {/* Top Back Nav */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#281434] transition-colors"
        >
          <span>← Volver al catálogo de cursos</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-14 text-center sm:text-left">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200 shadow-sm relative overflow-hidden">
          {/* Subtle top decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 max-w-3xl">
            {course.badge && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-[#724ae8] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                {course.badge}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#281434] tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
              {course.tagline}
            </p>

            {/* Course Meta Details */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-6 pt-6 border-t border-stone-100 text-xs sm:text-sm text-stone-600">
              <div className="flex items-center gap-2">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-8 h-8 rounded-full border border-purple-200"
                />
                <span className="font-semibold text-[#281434]">{course.instructor.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-purple-600" />
                <span>{totalNotebooks} Notebooks interactivos (.ipynb)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>{totalMinutes} min de contenido</span>
              </div>
            </div>

            {/* CTA & Price Box */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onEnrollOrStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-bold py-4 px-8 rounded-full text-base shadow-md shadow-purple-200 transition-all active:scale-95"
              >
                <span>Empezar este curso gratis</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#281434]">100% Gratis</span>
                <span className="text-xs text-stone-400 font-medium">Sin tarjeta requerida</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Features Grid */}
      {course.features && course.features.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="bg-[#faf8f5] rounded-3xl p-6 sm:p-8 border border-stone-200/90">
            <h2 className="text-xl font-bold text-[#281434] mb-6">
              Lo que aprenderás en este curso
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200/70 shadow-2xs">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curriculum Syllabus Preview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Plan de Estudios
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#281434] tracking-tight">
                Contenido del curso
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              {course.sections.length} secciones · {allLessons.length} lecciones en total
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {course.sections.map((section, sIdx) => {
              const isOpen = openSections[section.id] ?? false;

              return (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider">
                        Módulo {sIdx + 1}
                      </div>
                      <h3 className="text-base font-bold text-[#281434] mt-0.5">
                        {section.title}
                      </h3>
                      {section.description && (
                        <p className="text-xs text-stone-500 mt-1">{section.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-xs text-stone-400 hidden sm:inline">
                        {section.lessons.length} lecciones
                      </span>
                      <div className="p-1 rounded-full text-stone-400 bg-stone-100">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-stone-100 divide-y divide-stone-100 bg-[#faf8f5]/40">
                      {section.lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3.5 sm:px-6 hover:bg-white transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-4">
                            {lesson.type === 'notebook' ? (
                              <FileCode className="w-4 h-4 text-purple-600 shrink-0" />
                            ) : lesson.type === 'video' ? (
                              <PlayCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            <div className="truncate">
                              <span className="text-xs sm:text-sm font-semibold text-stone-800 block truncate">
                                {lesson.title}
                              </span>
                              {lesson.summary && (
                                <span className="text-[11px] text-stone-500 block truncate">
                                  {lesson.summary}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 text-xs text-stone-400">
                            {lesson.type === 'notebook' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-purple-100 text-purple-800">
                                .ipynb
                              </span>
                            )}
                            <span>{lesson.durationMinutes} min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-purple-200 shadow-md shrink-0"
          />
          <div className="space-y-2">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Tu Instructor
            </span>
            <h3 className="text-xl font-bold text-[#281434]">{course.instructor.name}</h3>
            <p className="text-xs font-medium text-stone-500">{course.instructor.title}</p>
            <p className="text-sm text-stone-600 leading-relaxed pt-2">
              {course.instructor.bio}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {course.faq && course.faq.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Dudas Frecuentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#281434] tracking-tight mt-1">
              Preguntas y Respuestas
            </h2>
          </div>

          <div className="space-y-3">
            {course.faq.map((item, idx) => {
              const isOpen = openFaqs[idx] ?? false;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-stone-50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#281434] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                      {item.question}
                    </span>
                    <span className="text-stone-400 ml-4 shrink-0">
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#faf8f5]/40">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom Sticky-style CTA Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-[#281434] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ¿Listo para empezar a aprender?
            </h3>
            <p className="text-purple-200 text-sm sm:text-base">
              Accede de inmediato a todos los notebooks interactivos y completa tus proyectos prácticos.
            </p>
            <div className="pt-4">
              <button
                onClick={onEnrollOrStart}
                className="inline-flex items-center gap-2 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-purple-900/50 transition-all active:scale-95 text-base"
              >
                <span>Acceder gratis al curso</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
