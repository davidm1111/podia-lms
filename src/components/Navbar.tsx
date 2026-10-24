import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Cloud,
  Layers,
  Edit3,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'catalog' | 'landing' | 'player' | 'creator';
  userRole: 'student' | 'creator';
  onNavigate: (view: 'catalog' | 'creator') => void;
  onToggleRole: () => void;
  onOpenDeployModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  userRole,
  onNavigate,
  onToggleRole,
  onOpenDeployModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#281434] flex items-center justify-center text-white shadow-sm shadow-purple-950/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#281434]">
                  Podia<span className="text-[#724ae8]">LMS</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#724ae8] px-2 py-0.5 rounded-full">
                  Free
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Notebooks .ipynb &amp; Cloudflare
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-stone-200">
            <button
              onClick={() => onNavigate('catalog')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentView === 'catalog' || currentView === 'landing'
                  ? 'bg-white text-[#281434] shadow-xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-[#281434]'
              }`}
            >
              Cursos y Catálogo
            </button>

            <button
              onClick={() => onNavigate('creator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentView === 'creator'
                  ? 'bg-white text-[#281434] shadow-xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-[#281434]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-600" />
              <span>Estudio de Creador</span>
            </button>
          </nav>
        </div>

        {/* Right Actions: Deploy Pill & Role Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Cloudflare Free Tier Badge */}
          <button
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-50 hover:bg-orange-100/80 text-orange-800 border border-orange-200/90 shadow-2xs transition-all active:scale-95 group"
            title="Ver guía de instalación gratuita en Cloudflare"
          >
            <Cloud className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Desplegar en Cloudflare</span>
            <span className="bg-orange-200/70 text-orange-900 text-[10px] px-1.5 py-0.2 rounded font-bold">
              $0
            </span>
          </button>

          {/* Creator / Student Role Switcher */}
          <button
            onClick={onToggleRole}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              userRole === 'creator'
                ? 'bg-[#281434] text-white border-[#281434] shadow-sm'
                : 'bg-white text-stone-700 hover:text-[#281434] border-stone-200/90 shadow-2xs'
            }`}
          >
            {userRole === 'creator' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span className="hidden xs:inline">Modo Creador</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden xs:inline">Modo Estudiante</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
