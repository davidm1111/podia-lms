import React from 'react';
import type { AuthUser } from '../types';
import {
  GraduationCap,
  Cloud,
  LogOut,
  ShieldLock,
  User,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'catalog' | 'landing' | 'player' | 'admin' | 'login';
  authUser: AuthUser | null;
  onNavigate: (view: 'catalog' | 'admin' | 'login') => void;
  onLogout: () => void;
  onOpenDeployModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  authUser,
  onNavigate,
  onLogout,
  onOpenDeployModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Logo (Original clean branding, 0 trademark) */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onNavigate(authUser?.role === 'admin' ? 'admin' : 'catalog')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#281434] flex items-center justify-center text-white shadow-sm shadow-purple-950/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#281434]">
                  Aura<span className="text-[#724ae8]">LMS</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#724ae8] px-2 py-0.5 rounded-full">
                  Cloud
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Plataforma de Formación &amp; Código
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-stone-200">
            <button
              onClick={() => onNavigate('catalog')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentView === 'catalog' || currentView === 'landing'
                  ? 'bg-white text-[#281434] shadow-xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-[#281434]'
              }`}
            >
              Mis Cursos
            </button>

            {authUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  currentView === 'admin'
                    ? 'bg-white text-[#281434] shadow-xs border border-stone-200/80'
                    : 'text-stone-600 hover:text-[#281434]'
                }`}
              >
                <ShieldLock className="w-3.5 h-3.5 text-purple-600" />
                <span>Panel de Profesor</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Cloudflare Deploy Free Status */}
          <button
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-50 hover:bg-orange-100/80 text-orange-800 border border-orange-200/90 shadow-2xs transition-all active:scale-95"
            title="Ver guía y estado de Cloudflare"
          >
            <Cloud className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">Cloudflare Pages</span>
            <span className="bg-orange-200/70 text-orange-900 text-[10px] px-1.5 py-0.2 rounded font-bold">
              $0
            </span>
          </button>

          {/* User Profile or Login Action */}
          {authUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs text-[#281434]">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-[#724ae8] flex items-center justify-center font-bold text-[10px]">
                  {authUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold truncate max-w-[120px]">{authUser.name}</span>
                <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded">
                  {authUser.role === 'admin' ? 'Profesor' : 'Alumno'}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#281434] text-white hover:bg-stone-800 shadow-xs transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
