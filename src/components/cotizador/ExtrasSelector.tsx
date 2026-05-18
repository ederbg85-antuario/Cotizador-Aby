'use client';

import { Plus, Minus, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ADDITIONAL_SERVICES, INCLUDED_TONES, EXTRA_TONE_PRICE } from '@/lib/pricing-data';

export function ExtrasSelector() {
  const { extraTones, setExtraTones, additionalServices, toggleAdditionalService, setAdditionalQuantity } = useAppStore();
  const isSel = (id: string) => additionalServices.some((s) => s.serviceId === id);
  const getQ  = (id: string) => additionalServices.find((s) => s.serviceId === id)?.quantity || 1;

  return (
    <div className="space-y-6">
      {/* Tonos extra — control simple */}
      <div className="rounded-xl border border-champagne-200/70 bg-champagne-50/40 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-warm-800">Tonos extra</p>
            <p className="text-[11px] text-warm-500 mt-0.5">
              Incluye {INCLUDED_TONES} lisos · ${EXTRA_TONE_PRICE} c/u extra
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setExtraTones(Math.max(0, extraTones - 1))}
              disabled={extraTones === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-lav-200 hover:bg-mauve-50 disabled:opacity-40 text-warm-700"
            >
              <Minus size={13} />
            </button>
            <input
              type="number"
              min="0"
              value={extraTones}
              onChange={(e) => setExtraTones(parseInt(e.target.value) || 0)}
              className="w-11 h-8 text-center font-bold text-warm-800 bg-white border border-lav-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-300"
            />
            <button
              onClick={() => setExtraTones(extraTones + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-lav-200 hover:bg-mauve-50 text-warm-700"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
        {extraTones > 0 && (
          <p className="mt-3 text-xs font-semibold text-mauve-700">
            + ${extraTones * EXTRA_TONE_PRICE} MXN
          </p>
        )}
      </div>

      {/* Servicios adicionales — lista compacta */}
      <div>
        <p className="text-[11px] font-semibold text-warm-400 uppercase tracking-[0.18em] mb-3">
          Servicios adicionales
        </p>
        <div className="space-y-2">
          {ADDITIONAL_SERVICES.map((svc) => {
            const sel   = isSel(svc.id);
            const qty   = getQ(svc.id);
            const needQ = svc.unit === 'uña' || svc.unit === 'tono';
            return (
              <div
                key={svc.id}
                className={`rounded-xl border overflow-hidden transition-all ${
                  sel ? 'bg-mauve-50/70 border-mauve-300' : 'bg-white border-lav-200 hover:border-mauve-200'
                }`}
              >
                <button
                  onClick={() => toggleAdditionalService(svc.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-warm-800 truncate">{svc.name}</p>
                    <p className="text-[11px] mt-0.5 text-warm-500">
                      <span className="text-mauve-700 font-semibold">${svc.price}</span> por {svc.unit}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                    sel ? 'bg-mauve-700 text-white' : 'bg-lav-100 text-mauve-700'
                  }`}>
                    {sel ? <Check size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
                  </div>
                </button>
                {sel && needQ && (
                  <div className="flex items-center gap-3 bg-white border-t border-mauve-100 px-4 py-2.5">
                    <span className="text-xs text-warm-600 flex-1 font-medium">Cantidad</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setAdditionalQuantity(svc.id, Math.max(1, qty - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-lav-100 hover:bg-mauve-100 text-warm-700"
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) => setAdditionalQuantity(svc.id, parseInt(e.target.value) || 1)}
                        className="w-10 h-7 text-center text-sm font-bold text-warm-800 bg-lav-50 border border-lav-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-300"
                      />
                      <button
                        onClick={() => setAdditionalQuantity(svc.id, qty + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-lav-100 hover:bg-mauve-100 text-warm-700"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-mauve-700 ml-1 min-w-12 text-right">
                      +${qty * svc.price}
                    </span>
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
