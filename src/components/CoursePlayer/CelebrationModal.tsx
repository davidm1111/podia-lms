import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle, Sparkles, X, ArrowRight, Share2 } from 'lucide-react';
import type { Course } from '../../types';

interface CelebrationModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  course,
  isOpen,
  onClose,
  onGoToDashboard,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst!
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#724ae8', '#281434', '#10b981', '#f59e0b'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#724ae8', '#281434', '#10b981', '#f59e0b'],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Trophy Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 mb-5 relative">
          <Award className="w-10 h-10" />
          <div className="absolute -top-1 -right-1 bg-amber-400 text-[#281434] p-1.5 rounded-full shadow">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#281434] tracking-tight">
          ¡Felicidades! Has completado el curso
        </h3>

        <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
          Has completado con éxito todas las lecciones y notebooks interactivos de:{' '}
          <strong className="text-[#281434]">{course.title}</strong>
        </p>

        {/* Certificate Card Preview */}
        <div className="mt-6 p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/90 text-left flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Certificado de Finalización Listo
            </div>
            <div className="text-xs text-stone-500">
              Emitido por {course.instructor.name} · Alojado en Cloudflare Pages
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onGoToDashboard}
            className="flex-1 flex items-center justify-center gap-2 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-semibold py-3 px-5 rounded-full shadow-sm transition-all active:scale-95 text-sm"
          >
            <span>Ir a Mis Cursos</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('¡Enlace del curso copiado al portapapeles!');
            }}
            className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 px-5 rounded-full transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
