'use client';

import { useState } from 'react';
import { ChevronDown, Download, Share2, Save } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ACRILICO_PRICES, RETOQUE_PRICES, GEL_SERVICES, getDecorationById, getAdditionalServiceById, EXTRA_TONE_PRICE } from '@/lib/pricing-data';
import { downloadQuotePDF } from '@/lib/generate-pdf';

export function QuoteSummary() {
  const { serviceType, nailLength, gelServiceId, decorations, extraTones, additionalServices, totalPrice, clientInfo, setClientInfo, saveQuote } = useAppStore();

  // En mobile arranca colapsado (solo header). En desktop el body siempre se ve.
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const items: { label: string; price: number }[] = [];
  if (serviceType === 'acrilico' && nailLength)      items.push({ label: `Acrílico — Largo ${nailLength}`, price: ACRILICO_PRICES[nailLength] });
  else if (serviceType === 'retoque' && nailLength)  items.push({ label: `Retoque — Largo ${nailLength}`,  price: RETOQUE_PRICES[nailLength] });
  else if (serviceType === 'gel' && gelServiceId) {
    const g = GEL_SERVICES.find((g) => g.id === gelServiceId);
    if (g) items.push({ label: g.name, price: g.price });
  }
  decorations.forEach((d) => { const i = getDecorationById(d.decorationId); if (i) items.push({ label: `${i.name} (${d.nailCount} uña${d.nailCount > 1 ? 's' : ''})`, price: i.pricePerNail * d.nailCount }); });
  if (extraTones > 0) items.push({ label: `Tonos extra (${extraTones})`, price: extraTones * EXTRA_TONE_PRICE });
  additionalServices.forEach((s) => { const i = getAdditionalServiceById(s.serviceId); if (i) items.push({ label: `${i.name} (${s.quantity} ${i.unit})`, price: i.price * s.quantity }); });

  const handleSave = () => {
    if (!clientInfo.name || !clientInfo.email || !clientInfo.phone) { alert('Completa los datos del cliente'); return; }
    const q = saveQuote(); alert(`Cotización guardada — ID: ${q.id}`);
  };

  const handleWA = () => {
    if (!clientInfo.name) { alert('Ingresa tu nombre primero'); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(`Hola, soy ${clientInfo.name}. Cotización: $${totalPrice} MXN`)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl border border-lav-100 shadow-petal overflow-hidden">
      {/* ── Header total (toggle en mobile, decorativo en desktop) ── */}
      <button
        onClick={() => setMobileExpanded(!mobileExpanded)}
        className="w-full block text-left bg-brand-gradient text-white hover:brightness-105 lg:cursor-default transition-all"
      >
        <div className="px-7 py-6 lg:px-9 lg:py-10 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 mb-2 lg:mb-5">
              Total estimado
            </p>
            <p className="font-display text-3xl lg:text-5xl font-semibold leading-none tracking-tight">
              ${totalPrice.toFixed(0)}
              <span className="text-sm lg:text-lg font-normal text-white/75 ml-2 align-middle">MXN</span>
            </p>
          </div>
          <ChevronDown
            size={22}
            className={`lg:hidden text-white/85 flex-shrink-0 transition-transform ${mobileExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* ── Body: siempre visible en lg+, en mobile solo si expandido ── */}
      <div className={`${mobileExpanded ? 'block' : 'hidden lg:block'} px-7 pt-7 pb-7 lg:px-9 lg:pt-9 lg:pb-9 space-y-7 lg:space-y-8 max-h-[55vh] lg:max-h-none overflow-y-auto`}>
        {/* ── Breakdown ── */}
        {items.length > 0 ? (
          <div>
            <p className="text-[11px] font-bold text-warm-400 uppercase tracking-[0.18em] mb-5">
              Desglose
            </p>
            <div className="space-y-0.5 max-h-44 overflow-y-auto -mx-1 px-1">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm gap-4 py-2.5 border-b border-lav-100/70 last:border-0">
                  <span className="text-warm-600 leading-snug">{item.label}</span>
                  <span className="font-semibold text-warm-800 flex-shrink-0">${item.price.toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t-2 border-mauve-100 flex justify-between items-baseline">
              <span className="text-sm font-semibold text-warm-700">Total</span>
              <span className="font-display text-2xl font-semibold text-mauve-700">
                ${totalPrice.toFixed(0)}
                <span className="text-xs font-sans font-medium text-warm-400 ml-1.5">MXN</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 px-6 bg-lav-50/60 rounded-2xl border border-dashed border-lav-200">
            <p className="text-sm text-warm-500 leading-relaxed">
              Selecciona un servicio para comenzar tu cotización
            </p>
          </div>
        )}

        {/* ── Client ── */}
        <div>
          <p className="text-[11px] font-bold text-warm-400 uppercase tracking-[0.18em] mb-5">
            Datos del cliente
          </p>
          <div className="space-y-3">
            {[
              { type: 'text',  ph: 'Nombre completo',    f: 'name',  v: clientInfo.name },
              { type: 'email', ph: 'Correo electrónico', f: 'email', v: clientInfo.email },
              { type: 'tel',   ph: 'Teléfono',           f: 'phone', v: clientInfo.phone },
            ].map(({ type, ph, f, v }) => (
              <input
                key={f}
                type={type}
                placeholder={ph}
                value={v}
                onChange={(e) => setClientInfo({ [f]: e.target.value })}
                className="w-full h-12 px-5 rounded-xl bg-lav-50/60 border border-lav-200 text-warm-800 placeholder-warm-400 text-sm focus:outline-none focus:ring-2 focus:ring-mauve-300 focus:border-mauve-300 transition-all"
              />
            ))}
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSave}
            className="btn-primary w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold"
          >
            <Save size={16} /> Guardar Cotización
          </button>
          <button
            onClick={() => {
              const label = serviceType === 'acrilico' ? 'Acrílico' : serviceType === 'retoque' ? 'Retoque' : 'Gel Semipermanente';
              downloadQuotePDF({
                clientName: clientInfo.name || 'Cliente', clientEmail: clientInfo.email, clientPhone: clientInfo.phone,
                serviceType: label + (nailLength ? ` - Largo ${nailLength}` : ''),
                nailLength: nailLength || undefined,
                gelServiceName: gelServiceId ? GEL_SERVICES.find((g) => g.id === gelServiceId)?.name : undefined,
                decorations: decorations.map((d) => { const i = getDecorationById(d.decorationId); return { name: i?.name || '', nailCount: d.nailCount, pricePerNail: i?.pricePerNail || 0, total: (i?.pricePerNail || 0) * d.nailCount }; }),
                extraTones,
                additionalServices: additionalServices.map((s) => { const i = getAdditionalServiceById(s.serviceId); return { name: i?.name || '', quantity: s.quantity, price: i?.price || 0, total: (i?.price || 0) * s.quantity }; }),
                subtotal: totalPrice, total: totalPrice, notes: '',
                date: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
              });
            }}
            className="btn-ghost w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold"
          >
            <Download size={16} /> Generar PDF
          </button>
          <button
            onClick={handleWA}
            className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-[#25D366] hover:bg-[#1da856] text-white text-sm font-semibold shadow-soft transition-all"
          >
            <Share2 size={16} /> Compartir por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
