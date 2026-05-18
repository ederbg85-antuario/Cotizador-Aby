'use client';

import { Plus, Minus, Check, Palette } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ADDITIONAL_SERVICES, INCLUDED_TONES, EXTRA_TONE_PRICE } from '@/lib/pricing-data';

export function ExtrasSelector() {
  const { extraTones, setExtraTones, additionalServices, toggleAdditionalService, setAdditionalQuantity } = useAppStore();
  const isSel = (id: string) => additionalServices.some((s) => s.serviceId === id);
  const getQ  = (id: string) => additionalServices.find((s) => s.serviceId === id)?.quantity || 1;

  return (
    <div className="space-y-6">
      {/* Tonos */}
      <div className="rounded-2xl border border-champagne-200/70 bg-champagne-50/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-champagne-100 flex items-center justify-center">
            <Palette size={15} className="text-champagne-600" />
          </div>
          <p className="text-xs font-bold text-warm-500 uppercase tracking-[0.15em]">Tonos extra</p>
        </div>

        <p className="text-sm text-warm-600 leading-relaxed mb-4">
          Incluye <span className="font-semibold text-warm-800">{INCLUDED_TONES} tonos lisos</span> sin costo.
          Cada tono adicional: <span className="font-bold text-mauve-700">${EXTRA_TONE_PRICE} MXN</span>
        </p>

        <div className="flex items-center justify-between bg-white rounded-xl border border-champagne-200/60 px-4 py-3">
          <span className="text-sm text-warm-700 font-medium">Tonos adicionales</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExtraTones(Math.max(0, extraTones - 1))}
              disabled={extraTones === 0}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-lav-100 hover:bg-mauve-100 disabled:opacity-40 disabled:hover:bg-lav-100 text-warm-600"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              min="0"
              value={extraTones}
              onChange={(e) => setExtraTones(parseInt(e.target.value) || 0)}
              className="w-12 h-9 text-center font-bold text-warm-800 bg-lav-50 border border-lav-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mauve-300"
            />
            <button
              onClick={() => setExtraTones(extraTones + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-lav-100 hover:bg-mauve-100 text-warm-600"
            >
              <Plus size={14} />
            </button>
            {extraTones > 0 && (
              <span className="ml-2 text-sm font-bold text-mauve-700">+${extraTones * EXTRA_TONE_PRICE}</span>
            )}
          </div>
        </div>
      </div>

      {/* Adicionales */}
      <div>
        <p className="text-xs font-bold text-warm-500 uppercase tracking-[0.15em] mb-3">Servicios adicionales</p>
        <div className="space-y-2.5">
          {ADDITIONAL_SERVICES.map((svc) => {
            const sel   = isSel(svc.id);
            const qty   = getQ(svc.id);
            const needQ = svc.unit === 'uña' || svc.unit === 'tono';
            return (
              <div
                key={svc.id}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  sel
                    ? 'bg-brand-gradient border-mauve-700 shadow-petal'
                    : 'bg-white border-lav-200 hover:border-mauve-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm truncate ${sel ? 'text-white' : 'text-warm-800'}`}>
                      {svc.name}
                    </p>
                    <p className={`text-xs mt-0.5 ${sel ? 'text-white/85' : 'text-warm-500'}`}>
                      <span className={`font-bold ${sel ? 'text-white' : 'text-mauve-700'}`}>${svc.price}</span>
                      <span className="mx-1">·</span>
                      por {svc.unit}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAdditionalService(svc.id)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      sel
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-mauve-50 text-mauve-700 hover:bg-mauve-100'
                    }`}
                  >
                    {sel ? <><Check size={12} /> Agregado</> : <><Plus size={12} /> Agregar</>}
                  </button>
                </div>
                {sel && needQ && (
                  <div className="flex items-center gap-3 bg-black/15 px-5 py-2.5 border-t border-white/10">
                    <span className="text-xs text-white/85 flex-1 font-medium">Cantidad</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setAdditionalQuantity(svc.id, Math.max(1, qty - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white"
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) => setAdditionalQuantity(svc.id, parseInt(e.target.value) || 1)}
                        className="w-9 h-7 text-center text-sm font-bold text-warm-800 bg-white rounded-lg border-0 focus:outline-none"
                      />
                      <button
                        onClick={() => setAdditionalQuantity(svc.id, qty + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white"
                      >
                        <Plus size={12} />
                      </button>
                      <span className="ml-2 text-sm font-bold text-white">${qty * svc.price}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
