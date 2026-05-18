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

interface StepCardProps {
  innerRef: React.RefObject<HTMLDivElement | null>;
  number: number;
  current: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  animate?: boolean;
}

function StepCard({ innerRef, number, current, title, subtitle, children, animate }: StepCardProps) {
  const done = current > number;
  return (
    <section
      ref={innerRef}
      className={`bg-white rounded-3xl border border-lav-100 shadow-soft scroll-mt-36 overflow-hidden ${animate ? 'animate-fade-in-up' : ''}`}
    >
      <header className="px-7 sm:px-10 md:px-12 pt-9 sm:pt-11 md:pt-12 pb-7 border-b border-lav-50/70">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
              done
                ? 'bg-green-600 text-white'
                : 'bg-mauve-100 text-mauve-700'
            }`}
          >
            {done ? '✓' : number}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-warm-400">
            Paso {number} de 4
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-warm-800 leading-tight">{title}</h2>
        <p className="text-sm text-warm-500 mt-2">{subtitle}</p>
      </header>
      <div className="px-7 sm:px-10 md:px-12 py-9 md:py-10">{children}</div>
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

  return (
    <div className="min-h-screen pb-mobile-stack lg:pb-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-lav-100/60">
        <div className="absolute inset-0 bg-brand-gradient-soft opacity-70" />
        <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-mauve-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-champagne-200/30 blur-3xl" />

        <div className="container-app relative pt-14 pb-14 md:pt-20 md:pb-18 lg:pt-24 lg:pb-20">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-mauve-200/60 mb-7">
              <Sparkles size={13} className="text-mauve-600" />
              <span className="text-xs font-medium text-mauve-700 tracking-wide">Cotizador profesional</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-warm-800 leading-[1.05] mb-5">
              Diseña tu manicura <span className="italic text-brand-gradient">ideal</span>
            </h1>
            <p className="text-warm-500 text-base sm:text-lg max-w-2xl leading-relaxed">
              Selecciona tu servicio, decoraciones y extras. Calculamos tu cotización al instante con total transparencia.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sticky Steps Bar ── */}
      <div className="sticky top-0 z-30 glass border-b border-lav-100/60">
        <div className="container-app py-6 md:py-7">
          <div className="relative">
            {/* línea de fondo */}
            <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-lav-200 rounded-full" />
            <div
              className="absolute top-5 left-[5%] h-0.5 bg-brand-gradient rounded-full transition-all duration-500"
              style={{ width: `calc(90% * ${progress / 100})` }}
            />
            <div className="relative grid grid-cols-4 gap-2">
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
                      className={`relative w-10 h-10 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
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
      <div className="container-app py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem] gap-8 lg:gap-10">

          {/* Steps column */}
          <div className="space-y-8 md:space-y-10 min-w-0">

            <StepCard
              innerRef={serviceRef}
              number={1}
              current={currentStep}
              title="Tu servicio"
              subtitle="Elige el tipo de manicura que prefieres"
            >
              <ServiceSelector />
            </StepCard>

            {(serviceType === 'acrilico' || serviceType === 'retoque') && (
              <StepCard
                innerRef={lengthRef}
                number={2}
                current={currentStep}
                title="El largo"
                subtitle="Del más corto al más dramático"
                animate
              >
                <LengthSelector />
              </StepCard>
            )}

            {serviceType && (serviceType === 'gel' || nailLength) && (
              <StepCard
                innerRef={decorationsRef}
                number={3}
                current={currentStep}
                title="Decoraciones"
                subtitle="Nail art, cristales y técnicas especiales"
                animate
              >
                <DecorationSelector />
              </StepCard>
            )}

            {serviceType && (serviceType === 'gel' || nailLength) && (
              <StepCard
                innerRef={extrasRef}
                number={4}
                current={currentStep}
                title="Extras"
                subtitle="Tonos adicionales y servicios complementarios"
                animate
              >
                <ExtrasSelector />
              </StepCard>
            )}
          </div>

          {/* Summary — desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-40"><QuoteSummary /></div>
          </div>
        </div>
      </div>

      {/* Summary — mobile */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-4 pb-3">
        <QuoteSummary />
      </div>
    </div>
  );
}
