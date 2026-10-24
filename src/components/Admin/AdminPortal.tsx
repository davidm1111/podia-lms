import React, { useState } from 'react';
import type { Course, Student, SiteConfig } from '../../types';
import { CourseEditor } from '../CourseCreator/CourseEditor';
import { StudentManager } from './StudentManager';
import { HomeEditor } from './HomeEditor';
import {
  BookOpen,
  Users,
  Cloud,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Zap,
  Eye,
  LayoutTemplate,
} from 'lucide-react';

interface AdminPortalProps {
  courses: Course[];
  students: Student[];
  siteConfig: SiteConfig;
  onSaveCourse: (course: Course) => void;
  onPreviewCourse: (course: Course) => void;
  onSaveSiteConfig: (config: SiteConfig) => void;
  onAddStudent: (name: string, email: string, courseIds: string[]) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onLogout: () => void;
  onOpenDeployModal: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  courses,
  students,
  siteConfig,
  onSaveCourse,
  onPreviewCourse,
  onSaveSiteConfig,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onLogout,
  onOpenDeployModal,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'students' | 'home' | 'cloud'>('courses');

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2533]">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-[#281434] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 font-bold">
                Profe
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    Panel del Profesor
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/20">
                    Privado
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/70">
                  Control de cursos, módulos, portada y alumnos
                </p>
              </div>
            </div>

            {/* Admin Tabs */}
            <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-purple-900/60">
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'courses'
                    ? 'bg-white text-[#281434] shadow-xs'
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Cursos y Módulos</span>
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'students'
                    ? 'bg-white text-[#281434] shadow-xs'
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Gestión de Alumnos</span>
                <span className="bg-purple-900 text-purple-200 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {students.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'home'
                    ? 'bg-white text-[#281434] shadow-xs'
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Editar Portada</span>
              </button>

              <button
                onClick={() => setActiveTab('cloud')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'cloud'
                    ? 'bg-white text-[#281434] shadow-xs'
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Cloudflare $0</span>
              </button>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPreviewCourse(courses[0])}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-purple-200 hover:text-white hover:bg-white/10 border border-purple-400/20 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver como alumno</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-rose-500/20 hover:text-rose-200 text-purple-200 transition-colors"
              title="Cerrar sesión de profesor"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around border-t border-purple-900/60 py-2 px-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-xl shrink-0 ${activeTab === 'courses' ? 'bg-white text-[#281434]' : 'text-purple-200'}`}
          >
            Cursos
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-xl shrink-0 ${activeTab === 'students' ? 'bg-white text-[#281434]' : 'text-purple-200'}`}
          >
            Alumnos ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl shrink-0 ${activeTab === 'home' ? 'bg-white text-[#281434]' : 'text-purple-200'}`}
          >
            Portada
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-3 py-1.5 rounded-xl shrink-0 ${activeTab === 'cloud' ? 'bg-white text-[#281434]' : 'text-purple-200'}`}
          >
            Cloudflare
          </button>
        </div>
      </header>

      {/* Main Content Space */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'courses' && (
          <CourseEditor
            courses={courses}
            onSaveCourse={onSaveCourse}
            onPreviewCourse={onPreviewCourse}
            onBackToDashboard={() => setActiveTab('students')}
          />
        )}

        {activeTab === 'students' && (
          <StudentManager
            students={students}
            courses={courses}
            onAddStudent={onAddStudent}
            onUpdateStudent={onUpdateStudent}
            onDeleteStudent={onDeleteStudent}
          />
        )}

        {activeTab === 'home' && (
          <HomeEditor
            siteConfig={siteConfig}
            onSaveSiteConfig={onSaveSiteConfig}
          />
        )}

        {activeTab === 'cloud' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Infraestructura
              </span>
              <h2 className="text-2xl font-extrabold text-[#281434]">
                Estado de Cloudflare Pages &amp; Base de Datos D1
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cloudflare Pages</span>
                </div>
                <h4 className="text-base font-bold text-stone-900">En Vivo</h4>
                <p className="text-xs text-stone-500">
                  Alojamiento estático gratuito, SSL automático y CDN global activo.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>Cloudflare D1 SQL</span>
                </div>
                <h4 className="text-base font-bold text-stone-900">lms-database</h4>
                <p className="text-xs text-stone-500">
                  Base de datos serverless en región WEUR (5M lecturas/día gratis).
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                  <Cloud className="w-4 h-4 text-amber-600" />
                  <span>Coste Mensual</span>
                </div>
                <h4 className="text-base font-bold text-emerald-600">$0.00 / mes</h4>
                <p className="text-xs text-stone-500">
                  Operando íntegramente dentro del nivel gratuito perpetuo de Cloudflare.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4">
              <h3 className="text-base font-bold text-[#281434]">
                Comandos de Administración de Cloudflare
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Puedes consultar el estado o desplegar cambios con Wrangler desde tu terminal:
              </p>
              <pre className="p-4 rounded-2xl bg-[#1e1b2e] text-stone-100 font-mono text-xs overflow-x-auto leading-relaxed">
{`# 1. Compilar y publicar cambios en Cloudflare Pages
npm run build
npx wrangler pages deploy dist --project-name aura-lms

# 2. Consultar registros de la base de datos D1
npx wrangler d1 execute lms-database --command="SELECT COUNT(*) FROM courses;" --remote`}
              </pre>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onOpenDeployModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#724ae8] hover:bg-[#5d38cc] text-white text-xs font-bold shadow-xs transition-all"
                >
                  <span>Abrir Guía Completa de Despliegue</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
