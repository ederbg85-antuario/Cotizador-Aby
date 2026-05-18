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
    <div className="space-y-3">
      {CATEGORIES.map((cat) => {
        const items = getDecorationsByCategory(cat);
        const isOpen = expanded[cat];
        const count  = decorations.filter((d) => DECORATIONS.find((x) => x.id === d.decorationId)?.category === cat).length;

        return (
          <div key={cat} className="rounded-2xl border border-lav-200 overflow-hidden bg-white shadow-soft">
            <button
              onClick={() => toggle(cat)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-lav-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{CATEGORY_ICONS[cat]}</span>
                <span className="font-semibold text-warm-700 text-sm">{CATEGORY_LABELS[cat]}</span>
                {count > 0 && (
                  <span className="min-w-5 h-5 px-1.5 flex items-center justify-center text-[11px] font-bold text-white bg-brand-gradient rounded-full shadow-petal">
                    {count}
                  </span>
                )}
              </div>
              <ChevronDown
                size={16}
                className={`text-warm-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-lav-100 px-4 pb-4 pt-3 space-y-2 bg-lav-50/40">
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
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="min-w-0">
                          <p className={`font-semibold text-sm truncate ${sel ? 'text-white' : 'text-warm-800'}`}>
                            {dec.name}
                          </p>
                          <p className={`text-[11px] mt-0.5 font-medium ${sel ? 'text-white/85' : 'text-mauve-600'}`}>
                            ${dec.pricePerNail} por uña
                          </p>
                        </div>
                        <button
                          onClick={() => togDec(dec.id)}
                          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            sel
                              ? 'bg-white/20 text-white hover:bg-white/30'
                              : 'bg-mauve-50 text-mauve-700 hover:bg-mauve-100'
                          }`}
                        >
                          {sel ? <><Check size={12} /> Agregado</> : <><Plus size={12} /> Agregar</>}
                        </button>
                      </div>
                      {sel && (
                        <div className="flex items-center gap-3 bg-black/15 px-4 py-2.5 border-t border-white/10">
                          <span className="text-xs text-white/85 flex-1 font-medium">¿Cuántas uñas?</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateDecorationNails(dec.id, Math.max(1, nails - 1))}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white"
                            >
                              <Minus size={12} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={nails}
                              onChange={(e) => updateDecorationNails(dec.id, parseInt(e.target.value) || 1)}
                              className="w-9 h-7 text-center text-sm font-bold text-warm-800 bg-white rounded-lg border-0 focus:outline-none"
                            />
                            <button
                              onClick={() => updateDecorationNails(dec.id, Math.min(10, nails + 1))}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white"
                            >
                              <Plus size={12} />
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
