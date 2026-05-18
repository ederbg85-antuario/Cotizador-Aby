'use client';

import { useAppStore } from '@/lib/store';
import { ACRILICO_PRICES, RETOQUE_PRICES } from '@/lib/pricing-data';
import type { NailLength } from '@/lib/types';

export function LengthSelector() {
  const { serviceType, nailLength, setNailLength } = useAppStore();
  if (serviceType !== 'acrilico' && serviceType !== 'retoque') return null;

  const prices  = serviceType === 'acrilico' ? ACRILICO_PRICES : RETOQUE_PRICES;
  const lengths: NailLength[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const nailH   = { 1:'h-4', 2:'h-5', 3:'h-7', 4:'h-9', 5:'h-11', 6:'h-13', 7:'h-15', 8:'h-17', 9:'h-20' } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-warm-400 font-medium">← Más corto</span>
        <span className="text-warm-400 font-medium">Más largo →</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
        {lengths.map((len) => {
          const sel = nailLength === len;
          return (
            <button
              key={len}
              onClick={() => setNailLength(len)}
              className={`flex flex-col items-center py-5 px-2 rounded-2xl border transition-all duration-200 ${
                sel
                  ? 'bg-brand-gradient border-mauve-700 shadow-petal scale-[1.04]'
                  : 'bg-lav-50/60 border-lav-200 hover:border-mauve-300 hover:bg-white hover:shadow-soft'
              }`}
            >
              <div className="flex items-end justify-center h-20 mb-3">
                <div
                  className={`w-2 rounded-t-full transition-all ${sel ? 'bg-white/85' : 'bg-mauve-300/70'} ${nailH[len]}`}
                />
              </div>
              <span className={`font-bold text-sm ${sel ? 'text-white' : 'text-warm-800'}`}>
                {len}
              </span>
              <span className={`text-xs mt-1 font-semibold ${sel ? 'text-white/85' : 'text-mauve-600'}`}>
                ${prices[len]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
