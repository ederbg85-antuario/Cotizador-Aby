'use client';

import { useAppStore } from '@/lib/store';
import { ACRILICO_PRICES, RETOQUE_PRICES } from '@/lib/pricing-data';
import type { NailLength } from '@/lib/types';

export function LengthSelector() {
  const { serviceType, nailLength, setNailLength } = useAppStore();
  if (serviceType !== 'acrilico' && serviceType !== 'retoque') return null;

  const prices  = serviceType === 'acrilico' ? ACRILICO_PRICES : RETOQUE_PRICES;
  const lengths: NailLength[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] text-warm-400 font-medium px-1">
        <span>← Corto</span>
        <span>Largo →</span>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
        {lengths.map((len) => {
          const sel = nailLength === len;
          return (
            <button
              key={len}
              onClick={() => setNailLength(len)}
              className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                sel
                  ? 'bg-brand-gradient border-mauve-700 shadow-petal text-white scale-105'
                  : 'bg-lav-50/60 border-lav-200 hover:border-mauve-300 hover:bg-white'
              }`}
            >
              <span className={`font-display text-xl font-semibold leading-none ${sel ? 'text-white' : 'text-warm-800'}`}>
                {len}
              </span>
              <span className={`text-[11px] mt-1.5 font-semibold ${sel ? 'text-white/85' : 'text-mauve-600'}`}>
                ${prices[len]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
