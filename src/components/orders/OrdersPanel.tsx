"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import type { Order } from "@/lib/types";
import { parseISO, isSameDay } from "date-fns";
import { Plus, Sparkles } from "lucide-react";
import OrderCard from "./OrderCard";
import CalendarView from "./CalendarView";

type FilterStatus = "todos" | "pendientes" | "confirmadas" | "completadas";

function buildMockOrders(): Order[] {
  const now = Date.now();
  return [
    {
      id: "mock-1",
      quote: { id: "q1", clientInfo: { name: "María García", email: "maria@example.com", phone: "+52 612 345 6789" },
        serviceType: "acrilico", nailLength: 3, decorations: [{ decorationId: "d1", nailCount: 5 }],
        extraTones: 0, additionalServices: [], notes: "Uñas con brillos", totalPrice: 450,
        status: "borrador", createdAt: new Date(now).toISOString(), updatedAt: new Date(now).toISOString() },
      scheduledDate: new Date(now).toISOString(), scheduledTime: "14:00", status: "pendiente",
      notes: "Cliente preferida", tenantId: "t1", createdAt: new Date(now).toISOString(), updatedAt: new Date(now).toISOString(),
    },
    {
      id: "mock-2",
      quote: { id: "q2", clientInfo: { name: "Sofía López", email: "sofia@example.com", phone: "+52 623 456 7890" },
        serviceType: "gel", gelServiceId: "gel-manos",
        decorations: [{ decorationId: "d2", nailCount: 10 }], extraTones: 2,
        additionalServices: [{ serviceId: "s1", quantity: 1 }], notes: "Diseño francés",
        totalPrice: 650, status: "confirmada",
        createdAt: new Date(now - 86400000).toISOString(), updatedAt: new Date(now - 86400000).toISOString() },
      scheduledDate: new Date(now + 86400000).toISOString(), scheduledTime: "10:30", status: "confirmada",
      notes: "Llegará temprano", tenantId: "t1", createdAt: new Date(now - 86400000).toISOString(), updatedAt: new Date(now - 86400000).toISOString(),
    },
    {
      id: "mock-3",
      quote: { id: "q3", clientInfo: { name: "Alejandra Martínez", email: "ale@example.com", phone: "+52 634 567 8901" },
        serviceType: "retoque", nailLength: 2, decorations: [], extraTones: 1,
        additionalServices: [], notes: "Retoque simple", totalPrice: 250, status: "completada",
        createdAt: new Date(now - 172800000).toISOString(), updatedAt: new Date(now - 172800000).toISOString() },
      scheduledDate: new Date(now - 172800000).toISOString(), scheduledTime: "15:00", status: "completada",
      notes: "", tenantId: "t1", createdAt: new Date(now - 172800000).toISOString(), updatedAt: new Date(now - 172800000).toISOString(),
    },
  ];
}

export default function OrdersPanel() {
  const { orders, updateOrder } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mockData] = useState<Order[]>(() => buildMockOrders());

  const mockOrders = useMemo(
    () => (orders.length === 0 ? mockData : orders),
    [orders, mockData]
  );

  const filteredOrders = useMemo(() => {
    let r = mockOrders;
    if (filterStatus !== "todos") {
      const map: Record<FilterStatus, string | string[]> = { todos: [], pendientes: "pendiente", confirmadas: "confirmada", completadas: "completada" };
      const s = Array.isArray(map[filterStatus]) ? map[filterStatus] : [map[filterStatus]];
      r = r.filter((o) => s.includes(o.status));
    }
    if (selectedDate) r = r.filter((o) => isSameDay(parseISO(o.scheduledDate), selectedDate));
    return r;
  }, [mockOrders, filterStatus, selectedDate]);

  const appointmentDates = mockOrders.map((o) => o.scheduledDate);
  const labels: Record<FilterStatus, string> = { todos: "Todos", pendientes: "Pendientes", confirmadas: "Confirmadas", completadas: "Completadas" };

  const stats = {
    pendientes: mockOrders.filter((o) => o.status === "pendiente").length,
    confirmadas: mockOrders.filter((o) => o.status === "confirmada").length,
    completadas: mockOrders.filter((o) => o.status === "completada").length,
  };

  return (
    <div className="space-y-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mauve-100 mb-5">
            <Sparkles size={12} className="text-mauve-600" />
            <span className="text-[11px] font-semibold text-mauve-700 tracking-wide uppercase">Panel de citas</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-warm-800 tracking-tight leading-tight">
            Mis <span className="italic text-brand-gradient">pedidos</span>
          </h1>
          <p className="text-base text-warm-500 mt-3 max-w-md">Gestiona tus órdenes y citas con elegancia</p>
        </div>
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-sm rounded-2xl"
        >
          <Plus size={17} />
          Nuevo Pedido
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pendientes",  value: stats.pendientes,  color: "from-champagne-300 to-champagne-500", text: "text-champagne-600" },
          { label: "Confirmadas", value: stats.confirmadas, color: "from-mauve-400 to-mauve-600",          text: "text-mauve-700" },
          { label: "Completadas", value: stats.completadas, color: "from-green-500 to-green-700",          text: "text-green-700" },
        ].map(({ label, value, color, text }) => (
          <div key={label} className="bg-white rounded-2xl border border-lav-100 shadow-soft px-6 py-5 flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-display font-bold text-base flex-shrink-0`}>
              {value}
            </div>
            <div>
              <p className={`text-sm font-semibold ${text}`}>{label}</p>
              <p className="text-xs text-warm-400 mt-1">en total</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <CalendarView appointmentDates={appointmentDates} onDateSelect={setSelectedDate} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <span className="text-[11px] font-bold text-warm-400 uppercase tracking-[0.15em]">Filtrar:</span>
        <div className="flex flex-wrap gap-2">
          {(["todos", "pendientes", "confirmadas", "completadas"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => { setFilterStatus(s); setSelectedDate(null); }}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                filterStatus === s
                  ? 'bg-brand-gradient text-white shadow-petal'
                  : 'bg-white border border-lav-200 text-warm-600 hover:border-mauve-300 hover:text-mauve-700'
              }`}
            >
              {labels[s]}
            </button>
          ))}
        </div>
        {selectedDate && (
          <button
            onClick={() => setSelectedDate(null)}
            className="text-xs text-mauve-700 hover:text-mauve-800 font-semibold underline underline-offset-2"
          >
            Limpiar fecha
          </button>
        )}
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-lav-100 shadow-soft py-20 px-8 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-24 h-24 mx-auto mb-7 bg-brand-gradient-soft rounded-3xl flex items-center justify-center text-5xl float">
              💅
            </div>
            <h2 className="font-display text-2xl text-warm-800 mb-3">Sin pedidos por ahora</h2>
            <p className="text-warm-500 text-sm mb-8 leading-relaxed">
              {selectedDate
                ? "No tienes pedidos para esta fecha. Selecciona otra o crea uno nuevo."
                : "Comienza a crear pedidos para gestionar tus citas de manicura."}
            </p>
            <Link
              href="/"
              className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-sm rounded-2xl"
            >
              <Plus size={16} /> Crear Primer Pedido
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onConfirm={(id) => updateOrder(id, { status: "confirmada" })}
              onCancel={(id) => updateOrder(id, { status: "cancelada" })}
              onComplete={(id) => updateOrder(id, { status: "completada" })}
            />
          ))}
        </div>
      )}

      {filteredOrders.length > 0 && (
        <p className="text-center text-sm text-warm-400 font-medium tracking-wide">
          {filteredOrders.length} pedido{filteredOrders.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
