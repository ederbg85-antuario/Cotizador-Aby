'use client';

import { useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { ServiceSelector } from './ServiceSelector';
import { LengthSelector } from './LengthSelector';
import { DecorationSelector } from './DecorationSelector';
import { ExtrasSelector } from './ExtrasSelector';
import { QuoteSummary } from './QuoteSummary';
import { Sparkles } from 'lucide-react';

const STEPS = [
  { number: 1, label: 'Servicio',     id: 'service' },
  { number: 2, label: 'Largo',        id: 'length' },
  { number: 3, label: 'Decoraciones', id: 'decorations' },
  { number: 4, label: 'Extras',       id: 'extras' },
];

export function Cotizador() {
  const { serviceType, nailLength } = useAppStore();
  const serviceRef     = useRef<HTMLDivElement>(null);
  const lengthRef      = useRef<HTMLDivElement>(null);
  const decorationsRef = useRef<HTMLDivElement>(null);
  const extrasRef      = useRef<HTMLDivElement>(null);

  const stepRefs = { service: serviceRef, length: lengthRef, decorations: decorationsRef, extras: extrasRef };

  let currentStep = 1;
  if (serviceType) currentStep = 2;
  if (serviceType && (serviceType === 'gel' || nailLength)) currentStep = 3;

  const scrollToStep = (id: string) => {
    stepRefs[id as keyof typeof stepRefs]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen pb-40 md:pb-16">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-lav-100/70">
        <div className="absolute inset-0 bg-brand-gradient-soft opacity-70" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-mauve-200/40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-champagne-200/30 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-12 md:pt-14 md:pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-mauve-200/60 mb-5">
            <Sparkles size={13} className="text-mauve-600" />
            <span className="text-xs font-medium text-mauve-700 tracking-wide">Cotizador profesional</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-warm-800 leading-[1.05] mb-3">
            Diseña tu manicura <span className="italic text-brand-gradient">ideal</span>
          </h1>
          <p className="text-warm-500 text-sm sm:text-base max-w-xl leading-relaxed">
            Selecciona tu servicio, decoraciones y extras. Calculamos tu cotización al instante con total transparencia.
          </p>
        </div>
      </section>

      {/* ── Sticky Steps Bar ── */}
      <div className="sticky top-0 z-30 glass border-b border-lav-100/70">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-4">
          {/* Progress bar */}
          <div className="relative mb-4">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-lav-100 -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-brand-gradient -translate-y-1/2 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
            <div className="relative flex justify-between">
              {STEPS.map((step) => {
                const done    = step.number < currentStep;
                const current = step.number === currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => scrollToStep(step.id)}
                    className="flex flex-col items-center group"
                  >
                    <div
                      className={`w-9 h-9 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                        done    ? 'bg-green-600 text-white shadow-soft'
                        : current ? 'bg-mauve-700 text-white ring-4 ring-mauve-200/70 shadow-petal scale-110'
                        : 'bg-white border border-lav-200 text-lav-500 group-hover:border-mauve-300'
                      }`}
                    >
                      {done ? '✓' : step.number}
                    </div>
                    <span
                      className={`hidden sm:inline mt-2 text-xs font-medium tracking-wide ${
                        current ? 'text-mauve-700' : done ? 'text-green-700' : 'text-warm-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

          {/* Steps column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1 */}
            <section
              ref={serviceRef}
              className="bg-white rounded-3xl border border-lav-100 shadow-soft scroll-mt-32 card-lift overflow-hidden"
            >
              <div className="px-7 pt-7 pb-2 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${currentStep > 1 ? 'bg-green-600' : 'bg-brand-gradient shadow-petal'}`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <div>
                  <h2 className="font-display text-2xl text-warm-800 leading-tight">Tu servicio</h2>
                  <p className="text-xs text-warm-400 mt-0.5">Elige el tipo de manicura</p>
                </div>
              </div>
              <div className="px-7 pt-5 pb-7"><ServiceSelector /></div>
            </section>

            {/* Step 2 */}
            {(serviceType === 'acrilico' || serviceType === 'retoque') && (
              <section
                ref={lengthRef}
                className="bg-white rounded-3xl border border-lav-100 shadow-soft scroll-mt-32 card-lift overflow-hidden animate-fade-in-up"
              >
                <div className="px-7 pt-7 pb-2 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${currentStep > 2 ? 'bg-green-600' : 'bg-brand-gradient shadow-petal'}`}>
                    {currentStep > 2 ? '✓' : '2'}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-warm-800 leading-tight">El largo</h2>
                    <p className="text-xs text-warm-400 mt-0.5">Del más corto al más dramático</p>
                  </div>
                </div>
                <div className="px-7 pt-5 pb-7"><LengthSelector /></div>
              </section>
            )}

            {/* Step 3 */}
            {serviceType && (serviceType === 'gel' || nailLength) && (
              <section
                ref={decorationsRef}
                className="bg-white rounded-3xl border border-lav-100 shadow-soft scroll-mt-32 card-lift overflow-hidden animate-fade-in-up"
              >
                <div className="px-7 pt-7 pb-2 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${currentStep > 3 ? 'bg-green-600' : 'bg-brand-gradient shadow-petal'}`}>
                    {currentStep > 3 ? '✓' : '3'}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-warm-800 leading-tight">Decoraciones</h2>
                    <p className="text-xs text-warm-400 mt-0.5">Nail art, cristales y más</p>
                  </div>
                </div>
                <div className="px-7 pt-5 pb-7"><DecorationSelector /></div>
              </section>
            )}

            {/* Step 4 */}
            {serviceType && (serviceType === 'gel' || nailLength) && (
              <section
                ref={extrasRef}
                className="bg-white rounded-3xl border border-lav-100 shadow-soft scroll-mt-32 card-lift overflow-hidden animate-fade-in-up"
              >
                <div className="px-7 pt-7 pb-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gradient shadow-petal flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-warm-800 leading-tight">Extras</h2>
                    <p className="text-xs text-warm-400 mt-0.5">Tonos adicionales y servicios</p>
                  </div>
                </div>
                <div className="px-7 pt-5 pb-7"><ExtrasSelector /></div>
              </section>
            )}
          </div>

          {/* Summary — desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-32"><QuoteSummary /></div>
          </div>
        </div>
      </div>

      {/* Summary — mobile */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40">
        <QuoteSummary />
      </div>
    </div>
  );
}
