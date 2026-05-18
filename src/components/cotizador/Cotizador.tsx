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
    <div className="min-h-screen pb-mobile-stack lg:pb-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-lav-100/60">
        <div className="absolute inset-0 bg-brand-gradient-soft opacity-70" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-mauve-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-champagne-200/30 blur-3xl" />

        <div className="container-app relative pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-mauve-200/60 mb-7">
              <Sparkles size={13} className="text-mauve-600" />
              <span className="text-xs font-medium text-mauve-700 tracking-wide">Cotizador profesional</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-warm-800 leading-[1.05] mb-6">
              Diseña tu manicura <span className="italic text-brand-gradient">ideal</span>
            </h1>
            <p className="text-warm-500 text-base sm:text-lg max-w-xl leading-relaxed">
              Selecciona tu servicio, decoraciones y extras. Calculamos tu cotización al instante con total transparencia.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sticky Steps Bar ── */}
      <div className="sticky top-0 z-30 glass border-b border-lav-100/60">
        <div className="container-app py-5 md:py-6">
          <div className="relative">
            <div className="absolute top-[18px] left-5 right-5 h-0.5 bg-lav-200 -translate-y-1/2" />
            <div
              className="absolute top-[18px] left-5 h-0.5 bg-brand-gradient -translate-y-1/2 transition-all duration-500"
              style={{ width: `calc((100% - 2.5rem) * ${progress / 100})` }}
            />
            <div className="relative flex justify-between">
              {STEPS.map((step) => {
                const done    = step.number < currentStep;
                const current = step.number === currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => scrollToStep(step.id)}
                    className="flex flex-col items-center group min-w-0"
                  >
                    <div
                      className={`w-10 h-10 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                        done    ? 'bg-green-600 text-white shadow-soft'
                        : current ? 'bg-mauve-700 text-white ring-4 ring-mauve-200/70 shadow-petal scale-110'
                        : 'bg-white border border-lav-200 text-warm-400 group-hover:border-mauve-300'
                      }`}
                    >
                      {done ? '✓' : step.number}
                    </div>
                    <span
                      className={`hidden sm:inline mt-3 text-xs font-semibold tracking-wide ${
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
      <div className="container-app py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem] gap-8 lg:gap-12 xl:gap-16">

          {/* Steps column */}
          <div className="space-y-8 md:space-y-10 min-w-0">

            {/* Step 1 */}
            <section
              ref={serviceRef}
              className="bg-white rounded-3xl border border-lav-100 shadow-soft scroll-mt-32 overflow-hidden"
            >
              <div className="px-7 md:px-10 pt-8 md:pt-10 pb-2 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${currentStep > 1 ? 'bg-green-600' : 'bg-brand-gradient shadow-petal'}`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl text-warm-800 leading-tight">Tu servicio</h2>
                  <p className="text-sm text-warm-400 mt-1">Elige el tipo de manicura</p>
                </div>
              </div>
              <div className="px-7 md:px-10 pt-7 pb-9 md:pb-10"><ServiceSelector /></div>
            </section>

            {/* Step 2 */}
            {(serviceType === 'acrilico' || serviceType === 'retoque') && (
              <section
                ref={lengthRef}
                className="bg-white rounded-3xl border border-lav-100 shadow-soft scroll-mt-32 overflow-hidden animate-fade-in-up"
              >
                <div className="px-7 md:px-10 pt-8 md:pt-10 pb-2 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${currentStep > 2 ? 'bg-green-600' : 'bg-brand-gradient shadow-petal'}`}>
                    {currentStep > 2 ? '✓' : '2'}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl text-warm-800 leading-tight">El largo</h2>
                    <p className="text-sm text-warm-400 mt-1">Del más corto al más dramático</p>
                  </div>
                </div>
                <div className="px-7 md:px-10 pt-7 pb-9 md:pb-10"><LengthSelector /></div>
              </section>
            )}

            {/* Step 3 */}
            {serviceType && (serviceType === 'gel' || nailLength) && (
              <section
                ref={decorationsRef}
                className="bg-white rounded-3xl border border-lav-100 shadow-soft scroll-mt-32 overflow-hidden animate-fade-in-up"
              >
                <div className="px-7 md:px-10 pt-8 md:pt-10 pb-2 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${currentStep > 3 ? 'bg-green-600' : 'bg-brand-gradient shadow-petal'}`}>
                    {currentStep > 3 ? '✓' : '3'}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl text-warm-800 leading-tight">Decoraciones</h2>
                    <p className="text-sm text-warm-400 mt-1">Nail art, cristales y más</p>
                  </div>
                </div>
                <div className="px-7 md:px-10 pt-7 pb-9 md:pb-10"><DecorationSelector /></div>
              </section>
            )}

            {/* Step 4 */}
            {serviceType && (serviceType === 'gel' || nailLength) && (
              <section
                ref={extrasRef}
                className="bg-white rounded-3xl border border-lav-100 shadow-soft scroll-mt-32 overflow-hidden animate-fade-in-up"
              >
                <div className="px-7 md:px-10 pt-8 md:pt-10 pb-2 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-gradient shadow-petal flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl text-warm-800 leading-tight">Extras</h2>
                    <p className="text-sm text-warm-400 mt-1">Tonos adicionales y servicios</p>
                  </div>
                </div>
                <div className="px-7 md:px-10 pt-7 pb-9 md:pb-10"><ExtrasSelector /></div>
              </section>
            )}
          </div>

          {/* Summary — desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-36"><QuoteSummary /></div>
          </div>
        </div>
      </div>

      {/* Summary — mobile */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-3 pb-3">
        <QuoteSummary />
      </div>
    </div>
  );
}
