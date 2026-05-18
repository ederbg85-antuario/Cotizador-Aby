'use client';

import { Sparkles, RefreshCw, Droplets, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { ServiceType, GelServiceId } from '@/lib/types';
import { GEL_SERVICES, ACRILICO_PRICES, RETOQUE_PRICES } from '@/lib/pricing-data';

export function ServiceSelector() {
  const { serviceType, setServiceType, setGelService, gelServiceId } = useAppStore();

  const handleServiceSelect = (service: ServiceType) => {
    setServiceType(service);
    if (service !== 'gel') setGelService(null as unknown as GelServiceId);
  };

  const services = [
    {
      id: 'acrilico' as const,
      label: 'Acrílico',
      icon: Sparkles,
      from: `Desde $${ACRILICO_PRICES[1]}`,
    },
    {
      id: 'retoque' as const,
      label: 'Retoque',
      icon: RefreshCw,
      from: `Desde $${RETOQUE_PRICES[1]}`,
    },
    {
      id: 'gel' as const,
      label: 'Gel Semipermanente',
      icon: Droplets,
      from: `Desde $${Math.min(...GEL_SERVICES.map(g => g.price))}`,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {services.map(({ id, label, icon: Icon, from }) => {
          const selected = serviceType === id;
          return (
            <button
              key={id}
              onClick={() => handleServiceSelect(id)}
              className={`relative flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2 p-4 sm:p-5 rounded-xl border text-left transition-all ${
                selected
                  ? 'border-mauve-600 bg-brand-gradient text-white shadow-petal'
                  : 'border-lav-200 bg-lav-50/60 hover:border-mauve-300 hover:bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selected ? 'bg-white/20' : 'bg-mauve-100'
              }`}>
                <Icon size={18} className={selected ? 'text-white' : 'text-mauve-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm sm:text-base ${selected ? 'text-white' : 'text-warm-800'}`}>
                  {label}
                </p>
                <p className={`text-xs mt-0.5 ${selected ? 'text-white/80' : 'text-warm-500'}`}>
                  {from} MXN
                </p>
              </div>
              {selected && (
                <div className="w-6 h-6 bg-white/25 rounded-full flex items-center justify-center sm:absolute sm:top-4 sm:right-4">
                  <Check size={13} className="text-white" strokeWidth={2.5} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {serviceType === 'gel' && (
        <div className="animate-fade-in-up">
          <p className="text-[11px] font-semibold text-warm-400 uppercase tracking-[0.18em] mb-3">Tipo de gel</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {GEL_SERVICES.map((gel) => {
              const selected = gelServiceId === gel.id;
              return (
                <button
                  key={gel.id}
                  onClick={() => setGelService(gel.id)}
                  className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all ${
                    selected
                      ? 'border-mauve-600 bg-brand-gradient text-white shadow-petal'
                      : 'border-lav-200 bg-white hover:border-mauve-300'
                  }`}
                >
                  <span className={`font-semibold text-sm ${selected ? 'text-white' : 'text-warm-800'}`}>
                    {gel.name.replace('Gel Semipermanente ', '').replace('Semipermanente ', '')}
                  </span>
                  <span className={`font-display text-lg font-semibold ${selected ? 'text-white' : 'text-mauve-700'}`}>
                    ${gel.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
