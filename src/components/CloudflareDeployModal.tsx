import React, { useState } from 'react';
import { Cloud, Check, Copy, X, Terminal, ExternalLink, ShieldCheck, Zap, Database } from 'lucide-react';

interface CloudflareDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudflareDeployModal: React.FC<CloudflareDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Instala las dependencias y compila el LMS',
      cmd: 'npm install\nnpm run build',
      desc: 'Genera la carpeta dist/ optimizada y lista para producción.',
    },
    {
      title: '2. Inicia sesión en Cloudflare (Gratis)',
      cmd: 'npx wrangler login',
      desc: 'Abrirá tu navegador para autenticarte con tu cuenta gratuita de Cloudflare.',
    },
    {
      title: '3. Despliega en Cloudflare Pages con un solo comando',
      cmd: 'npx wrangler pages deploy dist --project-name podia-lms',
      desc: '¡Listo! Tu LMS estará en vivo en https://podia-lms.pages.dev con SSL gratis y CDN global.',
    },
    {
      title: '4. (Opcional) Activa Base de Datos Cloudflare D1 gratis',
      cmd: 'npx wrangler d1 create lms-database\nnpx wrangler d1 execute lms-database --file=./schema.sql',
      desc: '5 millones de lecturas diarias y 5 GB de almacenamiento SQLite sin pagar un céntimo.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
              100% Gratuito Perpetuo
            </span>
            <h3 className="text-2xl font-extrabold text-[#281434] tracking-tight">
              Despliegue en Cloudflare Pages
            </h3>
          </div>
        </div>

        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
          Este LMS está diseñado específicamente para aprovechar la capa gratuita de Cloudflare. No requiere servidores dedicados, ni Docker, ni tarjeta de crédito.
        </p>

        {/* Free Tier Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="p-3 rounded-2xl bg-[#faf8f5] border border-stone-200 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-[#281434]">SSL & CDN Ilimitado</div>
              <div className="text-stone-500 text-[11px]">300+ ubicaciones en el mundo</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#faf8f5] border border-stone-200 flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-[#281434]">500 Builds / Mes</div>
              <div className="text-stone-500 text-[11px]">Integración con GitHub</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#faf8f5] border border-stone-200 flex items-center gap-2.5">
            <Database className="w-4 h-4 text-purple-600 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-[#281434]">Cloudflare D1 SQL</div>
              <div className="text-stone-500 text-[11px]">5M lecturas/día gratis</div>
            </div>
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-4 my-6">
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Instrucciones de Despliegue con Wrangler CLI
          </h4>

          {steps.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#281434]">{s.title}</span>
                <button
                  onClick={() => copyToClipboard(s.cmd, idx)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl bg-[#1e1b2e] p-3 text-stone-100 font-mono text-xs overflow-x-auto flex items-center justify-between">
                <pre className="whitespace-pre">{s.cmd}</pre>
              </div>

              <p className="text-[11px] text-stone-500">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Alternative Git Push */}
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 text-xs text-[#281434] space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-purple-900">
            <Terminal className="w-4 h-4 text-purple-700" />
            <span>¿Prefieres integración continua desde GitHub?</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Solo sube tu proyecto a GitHub, ve a <strong>Cloudflare Dashboard &gt; Workers &amp; Pages &gt; Connect to Git</strong> y elige el preset <strong>Vite</strong>. ¡Se compilará y actualizará solo en cada commit!
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
          >
            Cerrar
          </button>
          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#724ae8] hover:bg-[#5d38cc] text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <span>Ir a Cloudflare Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
