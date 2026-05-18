"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, Clock, User, Calendar } from "lucide-react";
import type { Order } from "@/lib/types";

interface OrderCardProps {
  order: Order;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

const STATUS = {
  pendiente:    { label: "Pendiente",   badge: "bg-champagne-100 text-champagne-700 border-champagne-200" },
  confirmada:   { label: "Confirmada",  badge: "bg-mauve-100 text-mauve-700 border-mauve-200" },
  "en-progreso":{ label: "En Progreso", badge: "bg-purple-100 text-purple-700 border-purple-200" },
  completada:   { label: "Completada",  badge: "bg-green-100 text-green-700 border-green-200" },
  cancelada:    { label: "Cancelada",   badge: "bg-red-100 text-red-700 border-red-200" },
};

export default function OrderCard({ order, onConfirm, onCancel, onComplete }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg  = STATUS[order.status];
  const date = format(parseISO(order.scheduledDate), "dd 'de' MMMM", { locale: es });
  const svc  = order.quote.serviceType === "acrilico" ? "Acrílico" : order.quote.serviceType === "retoque" ? "Retoque" : "Gel Semipermanente";

  return (
    <div className="bg-white rounded-3xl border border-lav-100 shadow-soft card-lift overflow-hidden">
      <div className="px-7 pt-7 pb-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-brand-gradient-soft flex items-center justify-center font-display text-lg text-mauve-700 font-semibold flex-shrink-0">
              {order.quote.clientInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-lg text-warm-800 truncate">{order.quote.clientInfo.name}</h3>
              <p className="text-xs text-warm-500 mt-1">{svc}</p>
            </div>
          </div>
          <span className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-[11px] font-semibold ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-5 border-y border-lav-100 mb-5">
          {[
            { icon: Calendar, label: "Fecha", value: date },
            { icon: Clock,    label: "Hora",  value: order.scheduledTime },
            { icon: null,     label: "Total", value: `$${order.quote.totalPrice}`, accent: true },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div key={label}>
              <p className="text-[10px] text-warm-400 mb-1.5 uppercase tracking-wider font-semibold flex items-center gap-1">
                {Icon && <Icon size={10} />} {label}
              </p>
              <p className={`text-sm font-semibold ${accent ? "text-mauve-700 font-display text-base" : "text-warm-800"}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2.5 mb-4">
          {order.status === "pendiente" && (<>
            <button
              onClick={() => onConfirm?.(order.id)}
              className="btn-primary flex-1 py-2.5 font-semibold rounded-xl text-xs"
            >
              Confirmar
            </button>
            <button
              onClick={() => onCancel?.(order.id)}
              className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-xs transition-all"
            >
              Cancelar
            </button>
          </>)}
          {order.status === "confirmada" && (<>
            <button
              onClick={() => onComplete?.(order.id)}
              className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs transition-all"
            >
              En Progreso
            </button>
            <button
              onClick={() => onCancel?.(order.id)}
              className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-xs transition-all"
            >
              Cancelar
            </button>
          </>)}
          {order.status === "en-progreso" && (
            <button
              onClick={() => onComplete?.(order.id)}
              className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-xs transition-all"
            >
              Completar
            </button>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 text-warm-400 hover:text-mauve-700 text-xs font-medium py-1.5 transition-colors"
        >
          {expanded ? "Ocultar detalles" : "Ver detalles"}
          <ChevronDown size={13} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-lav-100 px-7 py-6 bg-lav-50/40 space-y-5 animate-fade-in-up">
          <div>
            <p className="text-[11px] font-bold text-warm-400 uppercase tracking-[0.15em] mb-3 flex items-center gap-1.5">
              <User size={10} /> Cliente
            </p>
            <div className="space-y-1.5 text-sm text-warm-600">
              <p><span className="font-semibold text-warm-700">Email:</span> {order.quote.clientInfo.email}</p>
              <p><span className="font-semibold text-warm-700">Teléfono:</span> {order.quote.clientInfo.phone}</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-warm-400 uppercase tracking-[0.15em] mb-3">Servicio</p>
            <div className="pl-4 border-l-2 border-mauve-300 space-y-1.5 text-sm text-warm-600">
              <p><span className="font-semibold text-warm-700">Tipo:</span> {svc}</p>
              {order.quote.nailLength && <p><span className="font-semibold text-warm-700">Largo:</span> {order.quote.nailLength}</p>}
              {order.quote.decorations.length > 0 && (
                <p><span className="font-semibold text-warm-700">Decoraciones:</span> {order.quote.decorations.length} aplicadas</p>
              )}
            </div>
          </div>
          <div className="bg-brand-gradient rounded-2xl px-6 py-4 flex justify-between items-center text-white">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/85">Total</span>
            <span className="font-display text-2xl font-semibold">${order.quote.totalPrice} <span className="text-xs font-sans font-normal text-white/80">MXN</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
