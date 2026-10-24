import React, { useState } from 'react';
import type { Course, Lesson } from '../../types';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  FileCode,
  FileText,
  Video,
  Image as ImageIcon,
  Headphones,
  HelpCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface CurriculumSidebarProps {
  course: Course;
  activeLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (lesson: Lesson) => void;
  onToggleComplete: (lessonId: string) => void;
  onBackToCourse: () => void;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  course,
  activeLessonId,
  completedLessonIds,
  onSelectLesson,
  onToggleComplete,
  onBackToCourse,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    course.sections.forEach(s => {
      map[s.id] = true;
    });
    return map;
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const allLessons = course.sections.flatMap(s => s.lessons);
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter(l => completedLessonIds.includes(l.id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'audio':
        return <Headphones className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'notebook':
        return <FileCode className="w-4 h-4 text-purple-600 shrink-0" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'article':
      default:
        return <FileText className="w-4 h-4 text-emerald-600 shrink-0" />;
    }
  };

  return (
    <aside className="w-full lg:w-84 xl:w-92 shrink-0 bg-white border-r border-stone-200/90 flex flex-col h-full overflow-hidden">
      {/* Course Header & Progress Bar */}
      <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-[#faf8f5]/60">
        <button
          onClick={onBackToCourse}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#281434] transition-colors mb-3 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver al curso</span>
        </button>

        <h2 className="text-base font-bold text-[#281434] line-clamp-2 leading-tight">
          {course.title}
        </h2>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-stone-600">Tu progreso</span>
            <span className="font-bold text-[#724ae8] flex items-center gap-1">
              {progressPercent === 100 && <Sparkles className="w-3 h-3 text-amber-500" />}
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#724ae8] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-400">
            {completedCount} de {totalLessons} lecciones completadas
          </p>
        </div>
      </div>

      {/* Sections and Lessons Accordion */}
      <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2 sm:p-3 space-y-2">
        {course.sections.map((section, sIndex) => {
          const isOpen = openSections[section.id] ?? true;
          const sectionCompleted = section.lessons.filter(l => completedLessonIds.includes(l.id)).length;

          return (
            <div key={section.id} className="pt-2 first:pt-0">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-stone-50 transition-colors group"
              >
                <div className="pr-2">
                  <div className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider">
                    Módulo {sIndex + 1}
                  </div>
                  <h4 className="text-sm font-bold text-[#281434] line-clamp-1 group-hover:text-purple-900">
                    {section.title}
                  </h4>
                  <span className="text-[11px] text-stone-400">
                    {sectionCompleted}/{section.lessons.length} completadas
                  </span>
                </div>
                <div className="text-stone-400 group-hover:text-stone-700">
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {/* Lesson Items */}
              {isOpen && (
                <div className="mt-1 space-y-1 pl-1">
                  {section.lessons.map(lesson => {
                    const isActive = lesson.id === activeLessonId;
                    const isDone = completedLessonIds.includes(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        className={`group flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#f3effe] text-[#281434] font-semibold shadow-2xs border-l-3 border-[#724ae8]'
                            : 'hover:bg-stone-50/90 text-stone-700'
                        }`}
                        onClick={() => onSelectLesson(lesson)}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(lesson.id);
                            }}
                            className="text-stone-300 hover:text-[#724ae8] transition-colors shrink-0"
                            title={isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-4 h-4 text-stone-300 group-hover:text-purple-400" />
                            )}
                          </button>

                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              {getLessonIcon(lesson.type)}
                              <span className="text-xs truncate block">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5 pl-5.5">
                              <span>{lesson.durationMinutes} min</span>
                              <span className="uppercase text-[9px] font-semibold text-purple-700 bg-purple-50 px-1 rounded">
                                {lesson.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
