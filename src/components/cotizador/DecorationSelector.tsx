'use client';

import { useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DECORATIONS, CATEGORY_LABELS } from '@/lib/pricing-data';
import type { DecorationCategory } from '@/lib/types';

type Filter = 'all' | DecorationCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',       label: 'Todos'     },
  { id: 'tecnica',   label: 'Técnicas'  },
  { id: 'nail-art',  label: 'Nail art'  },
  { id: 'cristales', label: 'Cristales' },
  { id: 'extras',    label: 'Extras'    },
];

export function DecorationSelector() {
  const { decorations, addDecoration, removeDecoration, updateDecorationNails } = useAppStore();
  const [filter, setFilter] = useState<Filter>('all');

  const isSel  = (id: string) => decorations.some((d) => d.decorationId === id);
  const getN   = (id: string) => decorations.find((d) => d.decorationId === id)?.nailCount || 1;
  const togDec = (id: string) => isSel(id) ? removeDecoration(id) : addDecoration(id);

  const filtered = filter === 'all' ? DECORATIONS : DECORATIONS.filter((d) => d.category === filter);

  const countByCat = (cat: Filter) => {
    if (cat === 'all') return decorations.length;
    return decorations.filter((d) => DECORATIONS.find((x) => x.id === d.decorationId)?.category === cat).length;
  };

  return (
    <div className="space-y-4">
      {/* Filtros chip */}
      <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-thin">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          const n = countByCat(f.id);
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all flex-shrink-0 ${
                active
                  ? 'bg-mauve-700 text-white border-mauve-700 shadow-soft'
                  : 'bg-white text-warm-600 border-lav-200 hover:border-mauve-300'
              }`}
            >
              {f.label}
              {n > 0 && (
                <span className={`inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold ${
                  active ? 'bg-white/25 text-white' : 'bg-mauve-100 text-mauve-700'
                }`}>
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lista compacta */}
      <div className="space-y-2">
        {filtered.map((dec) => {
          const sel   = isSel(dec.id);
          const nails = getN(dec.id);
          return (
            <div
              key={dec.id}
              className={`rounded-xl border overflow-hidden transition-all ${
                sel ? 'bg-mauve-50/70 border-mauve-300' : 'bg-white border-lav-200 hover:border-mauve-200'
              }`}
            >
              <button
                onClick={() => togDec(dec.id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-warm-800 truncate">{dec.name}</p>
                  <p className="text-[11px] mt-0.5 text-warm-500">
                    <span className="text-mauve-700 font-semibold">${dec.pricePerNail}</span> por uña
                    <span className="ml-1.5 text-warm-400">· {CATEGORY_LABELS[dec.category]}</span>
                  </p>
                </div>
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                  sel ? 'bg-mauve-700 text-white' : 'bg-lav-100 text-mauve-700'
                }`}>
                  {sel ? <Check size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
                </div>
              </button>
              {sel && (
                <div className="flex items-center gap-3 bg-white border-t border-mauve-100 px-4 py-2.5">
                  <span className="text-xs text-warm-600 flex-1 font-medium">¿Cuántas uñas?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateDecorationNails(dec.id, Math.max(1, nails - 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-lav-100 hover:bg-mauve-100 text-warm-700"
                    >
                      <Minus size={12} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={nails}
                      onChange={(e) => updateDecorationNails(dec.id, parseInt(e.target.value) || 1)}
                      className="w-10 h-7 text-center text-sm font-bold text-warm-800 bg-lav-50 border border-lav-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mauve-300"
                    />
                    <button
                      onClick={() => updateDecorationNails(dec.id, Math.min(10, nails + 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-lav-100 hover:bg-mauve-100 text-warm-700"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-xs font-bold text-mauve-700 ml-1 min-w-12 text-right">
                    +${dec.pricePerNail * nails}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
