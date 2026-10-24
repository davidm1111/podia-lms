import React, { useState } from 'react';
import type { SiteConfig } from '../../types';
import { defaultSiteConfig } from '../../data/sampleCourses';
import { Save, Check, LayoutTemplate, RotateCcw, Plus, Trash2 } from 'lucide-react';

interface HomeEditorProps {
  siteConfig: SiteConfig;
  onSaveSiteConfig: (config: SiteConfig) => void;
}

export const HomeEditor: React.FC<HomeEditorProps> = ({ siteConfig, onSaveSiteConfig }) => {
  const [config, setConfig] = useState<SiteConfig>(siteConfig);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('¿Restablecer los textos de la portada a los valores iniciales?')) {
      setConfig(defaultSiteConfig);
      onSaveSiteConfig(defaultSiteConfig);
    }
  };

  const handleAddFeature = () => {
    setConfig({
      ...config,
      features: [...config.features, { title: 'Nuevo Módulo', description: 'Descripción del recurso o competencia' }],
    });
  };

  const handleDeleteFeature = (index: number) => {
    setConfig({
      ...config,
      features: config.features.filter((_, idx) => idx !== index),
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Zona de Profesor
          </span>
          <h2 className="text-2xl font-extrabold text-[#281434] tracking-tight">
            Personalización de la Portada (Home)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Modifica los textos, el banner principal y los beneficios que verán los alumnos al entrar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-600 hover:text-stone-900 text-xs font-semibold shadow-2xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 bg-[#724ae8] hover:bg-[#5d38cc] text-white font-semibold px-5 py-2 rounded-full text-xs shadow-xs transition-all active:scale-95"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>¡Portada Guardada!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Portada</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Banner Configuration */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-[#281434] font-bold text-base">
          <LayoutTemplate className="w-4 h-4 text-purple-600" />
          <span>Banner Principal (Hero)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Nombre de la Academia / Centro</label>
            <input
              type="text"
              value={config.academyName}
              onChange={(e) => setConfig({ ...config, academyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Etiqueta Superior (Badge)</label>
            <input
              type="text"
              value={config.heroBadge}
              onChange={(e) => setConfig({ ...config, heroBadge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Título Principal de la Portada</label>
          <input
            type="text"
            value={config.heroTitle}
            onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Subtítulo y Descripción de Bienvenida</label>
          <textarea
            rows={3}
            value={config.heroSubtitle}
            onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
            className="w-full p-3.5 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Texto del Botón de Acción Principal</label>
          <input
            type="text"
            value={config.heroCtaText}
            onChange={(e) => setConfig({ ...config, heroCtaText: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#281434] focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      {/* Highlights / Features Configuration */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="text-base font-bold text-[#281434]">
            Sección de Beneficios y Módulos ({config.features.length})
          </h3>
          <button
            type="button"
            onClick={handleAddFeature}
            className="flex items-center gap-1.5 text-xs font-bold text-[#724ae8] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Beneficio</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {config.features.map((feat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200 space-y-2 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  Beneficio #{idx + 1}
                </span>
                {config.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteFeature(idx)}
                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <input
                type="text"
                value={feat.title}
                onChange={(e) => {
                  const updated = [...config.features];
                  updated[idx].title = e.target.value;
                  setConfig({ ...config, features: updated });
                }}
                placeholder="Título del beneficio..."
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-[#281434] bg-white"
              />

              <textarea
                rows={2}
                value={feat.description}
                onChange={(e) => {
                  const updated = [...config.features];
                  updated[idx].description = e.target.value;
                  setConfig({ ...config, features: updated });
                }}
                placeholder="Descripción concisa..."
                className="w-full p-2 rounded-lg border border-stone-200 text-xs text-stone-600 bg-white resize-none"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
