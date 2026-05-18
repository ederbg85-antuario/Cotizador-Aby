'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Minus, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DECORATIONS, CATEGORY_LABELS, getDecorationsByCategory } from '@/lib/pricing-data';
import type { DecorationCategory } from '@/lib/types';

const CATEGORIES: DecorationCategory[] = ['tecnica', 'nail-art', 'cristales', 'extras'];

const CATEGORY_ICONS: Record<DecorationCategory, string> = {
  tecnica: '✨',
  'nail-art': '🎨',
  cristales: '💎',
  extras: '🌸',
};

export function DecorationSelector() {
  const { decorations, addDecoration, removeDecoration, updateDecorationNails } = useAppStore();
  const [expanded, setExpanded] = useState<Record<DecorationCategory, boolean>>({ tecnica: true, 'nail-art': true, cristales: false, extras: false });

  const toggle   = (cat: DecorationCategory) => setExpanded((p) => ({ ...p, [cat]: !p[cat] }));
  const isSel    = (id: string) => decorations.some((d) => d.decorationId === id);
  const getN     = (id: string) => decorations.find((d) => d.decorationId === id)?.nailCount || 1;
  const togDec   = (id: string) => isSel(id) ? removeDecoration(id) : addDecoration(id);

  return (
    <div className="space-y-4">
      {CATEGORIES.map((cat) => {
        const items = getDecorationsByCategory(cat);
        const isOpen = expanded[cat];
        const count  = decorations.filter((d) => DECORATIONS.find((x) => x.id === d.decorationId)?.category === cat).length;

        return (
          <div key={cat} className="rounded-2xl border border-lav-200 overflow-hidden bg-white shadow-soft">
            <button
              onClick={() => toggle(cat)}
              className="w-full px-7 py-6 flex items-center justify-between hover:bg-lav-50/60 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                <span className="font-semibold text-warm-700 text-base">{CATEGORY_LABELS[cat]}</span>
                {count > 0 && (
                  <span className="min-w-6 h-6 px-2 flex items-center justify-center text-xs font-bold text-white bg-brand-gradient rounded-full shadow-petal">
                    {count}
                  </span>
                )}
              </div>
              <ChevronDown
                size={18}
                className={`text-warm-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-lav-100 p-6 space-y-3 bg-lav-50/40">
                {items.map((dec) => {
                  const sel   = isSel(dec.id);
                  const nails = getN(dec.id);
                  return (
                    <div
                      key={dec.id}
                      className={`rounded-xl border overflow-hidden transition-all ${
                        sel
                          ? 'bg-brand-gradient border-mauve-700 shadow-petal'
                          : 'bg-white border-lav-200 hover:border-mauve-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 px-6 py-5">
                        <div className="min-w-0">
                          <p className={`font-semibold text-sm truncate ${sel ? 'text-white' : 'text-warm-800'}`}>
                            {dec.name}
                          </p>
                          <p className={`text-xs mt-1 font-medium ${sel ? 'text-white/85' : 'text-mauve-600'}`}>
                            ${dec.pricePerNail} por uña
                          </p>
                        </div>
                        <button
                          onClick={() => togDec(dec.id)}
                          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            sel
                              ? 'bg-white/20 text-white hover:bg-white/30'
                              : 'bg-mauve-50 text-mauve-700 hover:bg-mauve-100'
                          }`}
                        >
                          {sel ? <><Check size={13} /> Agregado</> : <><Plus size={13} /> Agregar</>}
                        </button>
                      </div>
                      {sel && (
                        <div className="flex items-center gap-4 bg-black/15 px-5 py-3.5 border-t border-white/10">
                          <span className="text-xs text-white/85 flex-1 font-medium">¿Cuántas uñas?</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateDecorationNails(dec.id, Math.max(1, nails - 1))}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white"
                            >
                              <Minus size={13} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={nails}
                              onChange={(e) => updateDecorationNails(dec.id, parseInt(e.target.value) || 1)}
                              className="w-10 h-8 text-center text-sm font-bold text-warm-800 bg-white rounded-lg border-0 focus:outline-none"
                            />
                            <button
                              onClick={() => updateDecorationNails(dec.id, Math.min(10, nails + 1))}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
