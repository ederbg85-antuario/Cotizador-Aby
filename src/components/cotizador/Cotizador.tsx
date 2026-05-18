'use client';

import { useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { ServiceSelector } from './ServiceSelector';
import { LengthSelector } from './LengthSelector';
import { DecorationSelector } from './DecorationSelector';
import { ExtrasSelector } from './ExtrasSelector';
import { QuoteSummary } from './QuoteSummary';

const STEPS = [
  { number: 1, label: 'Servicio',     id: 'service' },
  { number: 2, label: 'Largo',        id: 'length' },
  { number: 3, label: 'Decoración',   id: 'decorations' },
  { number: 4, label: 'Extras',       id: 'extras' },
];

interface StepCardProps {
  innerRef: React.RefObject<HTMLDivElement | null>;
  number: number;
  current: number;
  title: string;
  children: React.ReactNode;
  animate?: boolean;
}

function StepCard({ innerRef, number, current, title, children, animate }: StepCardProps) {
  const done = current > number;
  return (
    <section
      ref={innerRef}
      className={`bg-white rounded-2xl border border-lav-100 shadow-soft scroll-mt-32 sm:scroll-mt-40 overflow-hidden ${animate ? 'animate-fade-in-up' : ''}`}
    >
      <header className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4 flex items-center gap-3 border-b border-lav-50/70">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 ${
            done
              ? 'bg-green-600 text-white'
              : 'bg-mauve-100 text-mauve-700'
          }`}
        >
          {done ? '✓' : number}
        </span>
        <h2 className="font-display text-xl sm:text-2xl text-warm-800 leading-tight">{title}</h2>
      </header>
      <div className="px-5 sm:px-7 py-6">{children}</div>
    </section>
  );
}

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
  const showLength      = serviceType === 'acrilico' || serviceType === 'retoque';
  const showRest        = !!serviceType && (serviceType === 'gel' || !!nailLength);

  return (
    <div className="min-h-screen pb-mobile-stack lg:pb-16">

      {/* ── Hero compacto ── */}
      <section className="relative overflow-hidden border-b border-lav-100/60">
        <div className="absolute inset-0 bg-brand-gradient-soft opacity-60" />
        <div className="container-app relative py-7 sm:py-10 lg:py-14">
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-warm-800 leading-tight">
            Diseña tu manicura <span className="italic text-brand-gradient">ideal</span>
          </h1>
          <p className="text-warm-500 text-sm sm:text-base mt-2 max-w-xl">
            Cuatro pasos. Te calculamos el total al instante.
          </p>
        </div>
      </section>

      {/* ── Stepper sticky ultra-compacto (debajo del navbar) ── */}
      <div className="sticky top-16 md:top-20 z-30 glass border-b border-lav-100/60">
        <div className="container-app py-2.5 sm:py-4">
          <div className="relative">
            <div className="absolute top-3 sm:top-4 left-[6%] right-[6%] h-0.5 bg-lav-200 rounded-full" />
            <div
              className="absolute top-3 sm:top-4 left-[6%] h-0.5 bg-brand-gradient rounded-full transition-all duration-500"
              style={{ width: `calc(88% * ${progress / 100})` }}
            />
            <div className="relative grid grid-cols-4 gap-1">
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
                      className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center transition-all ${
                        done    ? 'bg-green-600 text-white'
                        : current ? 'bg-mauve-700 text-white ring-2 sm:ring-4 ring-mauve-200/60 shadow-petal'
                        : 'bg-white border border-lav-200 text-warm-400'
                      }`}
                    >
                      {done ? '✓' : step.number}
                    </div>
                    <span
                      className={`hidden sm:block mt-1.5 text-xs font-semibold tracking-wide truncate max-w-full ${
                        current ? 'text-mauve-700' : done ? 'text-green-700' : 'text-warm-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    {current && (
                      <span className="sm:hidden mt-1 text-[10px] font-semibold text-mauve-700 truncate max-w-full">
                        {step.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className="container-app py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem] gap-6 lg:gap-8">

          <div className="space-y-5 sm:space-y-6 min-w-0">
            <StepCard innerRef={serviceRef} number={1} current={currentStep} title="¿Qué servicio quieres?">
              <ServiceSelector />
            </StepCard>

            {showLength && (
              <StepCard innerRef={lengthRef} number={2} current={currentStep} title="¿Qué largo?" animate>
                <LengthSelector />
              </StepCard>
            )}

            {showRest && (
              <StepCard innerRef={decorationsRef} number={3} current={currentStep} title="¿Algún detalle?" animate>
                <DecorationSelector />
              </StepCard>
            )}

            {showRest && (
              <StepCard innerRef={extrasRef} number={4} current={currentStep} title="¿Algo extra?" animate>
                <ExtrasSelector />
              </StepCard>
            )}
          </div>

          {/* Summary desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-36"><QuoteSummary /></div>
          </div>
        </div>
      </div>

      {/* Summary mobile */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-3 pb-2">
        <QuoteSummary />
      </div>
    </div>
  );
}
