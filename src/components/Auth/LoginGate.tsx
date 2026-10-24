import React, { useState } from 'react';
import { loginAsAdmin, loginAsStudent } from '../../lib/storage';
import type { AuthUser } from '../../types';
import {
  GraduationCap,
  ShieldLock,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface LoginGateProps {
  onLoginSuccess: (user: AuthUser) => void;
  onContinueAsGuest?: () => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');

  // Student form
  const [studentEmail, setStudentEmail] = useState('');
  const [studentError, setStudentError] = useState<string | null>(null);

  // Admin form
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);

    const res = loginAsStudent(studentEmail);
    if (res.success && res.student) {
      onLoginSuccess({
        role: 'student',
        id: res.student.id,
        name: res.student.name,
        email: res.student.email,
      });
    } else {
      setStudentError(res.error || 'Correo no reconocido.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    const ok = loginAsAdmin(adminPassword);
    if (ok) {
      onLoginSuccess({
        role: 'admin',
        id: 'admin-1',
        name: 'Profesor / Administrador',
        email: 'admin@academia.com',
      });
    } else {
      setAdminError('Contraseña incorrecta. (Prueba con: admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center items-center p-4 sm:p-6 text-[#2c2533]">
      <div className="max-w-md w-full space-y-8">
        {/* Brand Header (No Podia trademark) */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-[#281434] text-white flex items-center justify-center mx-auto shadow-md shadow-purple-950/20">
            <GraduationCap className="w-7 h-7 text-purple-300" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#724ae8] mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Acceso Privado a la Academia</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#281434] tracking-tight">
              Portal Educativo
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Inicia sesión con tu correo autorizado o accede como profesor.
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          {/* Tabs: Alumno vs Profesor */}
          <div className="grid grid-cols-2 p-1 bg-[#faf8f5] rounded-2xl border border-stone-200/80 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('student');
                setStudentError(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-[#281434] shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Portal del Alumno
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setAdminError(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-[#281434] shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Zona de Profesor
            </button>
          </div>

          {/* Student Login Form */}
          {activeTab === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Tu Correo Electrónico Registrado
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="ej. alumno@ejemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <p className="text-[11px] text-stone-400">
                  El profesor debe haber registrado tu correo previamente.
                </p>
              </div>

              {studentError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{studentError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-bold py-3 px-4 rounded-full text-xs shadow-xs transition-all active:scale-95"
              >
                <span>Acceder a Mis Cursos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Admin / Teacher Login Form */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Contraseña de Profesor / Administrador
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Introduce tu clave de profesor..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>

              {adminError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#281434] hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-full text-xs shadow-xs transition-all active:scale-95"
              >
                <ShieldLock className="w-4 h-4 text-purple-300" />
                <span>Entrar al Panel de Profesor</span>
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Reminder */}
          <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-500 bg-[#faf8f5] p-3 rounded-2xl space-y-1">
            <span className="font-bold text-[#281434] block">Accesos de demostración listos:</span>
            <div>
              👨‍🎓 <strong>Alumno:</strong>{' '}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('student');
                  setStudentEmail('alumno@ejemplo.com');
                }}
                className="underline text-purple-700 font-mono"
              >
                alumno@ejemplo.com
              </button>
            </div>
            <div>
              🧑‍🏫 <strong>Profesor:</strong> Clave{' '}
              <span className="font-mono font-bold text-purple-800">admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
