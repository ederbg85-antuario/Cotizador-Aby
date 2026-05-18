'use client';

import { Sparkles, RefreshCw, Droplets, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { ServiceType, GelServiceId } from '@/lib/types';
import { GEL_SERVICES } from '@/lib/pricing-data';

export function ServiceSelector() {
  const { serviceType, setServiceType, setGelService, gelServiceId } = useAppStore();

  const handleServiceSelect = (service: ServiceType) => {
    setServiceType(service);
    if (service !== 'gel') setGelService(null as unknown as GelServiceId);
  };

  const services = [
    { id: 'acrilico' as const, label: 'Acrílico',           description: 'Uñas duraderas y elegantes',     icon: Sparkles,  note: 'Incluye 2 tonos lisos' },
    { id: 'retoque'  as const, label: 'Retoque',            description: 'Mantén tu acrílico impecable',   icon: RefreshCw, note: 'Incluye 2 tonos lisos' },
    { id: 'gel'      as const, label: 'Gel Semipermanente', description: 'Brillo extra y larga duración',  icon: Droplets,  note: 'Selecciona tu opción' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {services.map(({ id, label, description, icon: Icon, note }) => {
          const selected = serviceType === id;
          return (
            <button
              key={id}
              onClick={() => handleServiceSelect(id)}
              className={`group relative p-8 sm:p-9 lg:p-10 rounded-2xl border text-left transition-all duration-200 flex flex-col min-h-[17rem] ${
                selected
                  ? 'border-mauve-600 bg-brand-gradient text-white shadow-petal'
                  : 'border-lav-200 bg-lav-50/60 hover:border-mauve-300 hover:bg-white hover:shadow-soft'
              }`}
            >
              {selected && (
                <div className="absolute top-6 right-6 w-7 h-7 bg-white/25 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" strokeWidth={2.5} />
                </div>
              )}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                selected ? 'bg-white/20' : 'bg-mauve-100 group-hover:bg-mauve-200'
              }`}>
                <Icon size={22} className={selected ? 'text-white' : 'text-mauve-600'} />
              </div>
              <p className={`font-semibold text-base mb-2.5 ${selected ? 'text-white' : 'text-warm-800'}`}>{label}</p>
              <p className={`text-sm leading-relaxed mb-6 ${selected ? 'text-white/85' : 'text-warm-500'}`}>{description}</p>
              <div className="mt-auto">
                <span className={`text-[11px] font-medium px-3 py-1.5 rounded-full inline-block ${
                  selected ? 'bg-white/20 text-white' : 'bg-champagne-100 text-champagne-600'
                }`}>
                  {note}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {serviceType === 'gel' && (
        <div className="space-y-5 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-lav-200" />
            <p className="text-[11px] font-semibold text-warm-400 uppercase tracking-[0.18em]">Tipo de gel</p>
            <div className="h-px flex-1 bg-lav-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GEL_SERVICES.map((gel) => {
              const selected = gelServiceId === gel.id;
              return (
                <button
                  key={gel.id}
                  onClick={() => setGelService(gel.id)}
                  className={`relative p-8 rounded-2xl border text-center transition-all duration-200 ${
                    selected
                      ? 'border-mauve-600 bg-brand-gradient text-white shadow-petal'
                      : 'border-lav-200 bg-lav-50/60 hover:border-mauve-300 hover:bg-white hover:shadow-soft'
                  }`}
                >
                  <p className={`font-semibold text-sm ${selected ? 'text-white' : 'text-warm-800'}`}>{gel.name}</p>
                  <p className={`text-3xl font-display font-semibold mt-3 ${selected ? 'text-white' : 'text-mauve-700'}`}>
                    ${gel.price}
                    <span className={`text-xs font-sans font-medium ml-1.5 ${selected ? 'text-white/80' : 'text-warm-400'}`}>MXN</span>
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
