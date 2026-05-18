"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarViewProps {
  appointmentDates?: string[];
  onDateSelect?: (date: Date) => void;
}

export default function CalendarView({ appointmentDates = [], onDateSelect }: CalendarViewProps) {
  const [current, setCurrent] = useState(new Date());
  const monthStart = startOfMonth(current);
  const days       = eachDayOfInterval({ start: monthStart, end: endOfMonth(current) });
  const apptSet    = new Set(appointmentDates.map((d) => format(new Date(d), "yyyy-MM-dd")));
  const empties    = Array.from({ length: monthStart.getDay() });

  return (
    <div className="bg-white rounded-3xl border border-lav-100 shadow-soft px-6 py-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg text-warm-800 capitalize">
          {format(current, "MMMM yyyy", { locale: es })}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrent(subMonths(current, 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-mauve-100 text-warm-500 hover:text-mauve-700 rounded-xl transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => setCurrent(addMonths(current, 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-mauve-100 text-warm-500 hover:text-mauve-700 rounded-xl transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Dom","Lun","Mar","Mié","Jue","Vie","Sab"].map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-warm-400 py-1 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {empties.map((_, i) => <div key={i} />)}
        {days.map((day) => {
          const str  = format(day, "yyyy-MM-dd");
          const appt = apptSet.has(str);
          const tod  = isToday(day);
          return (
            <button
              key={str}
              onClick={() => onDateSelect?.(day)}
              className={`aspect-square rounded-xl text-xs font-medium transition-all relative ${
                tod
                  ? 'bg-brand-gradient text-white shadow-petal font-bold'
                  : appt
                  ? 'bg-mauve-100 text-mauve-800 border border-mauve-300 font-semibold hover:bg-mauve-200'
                  : 'hover:bg-lav-100/60 text-warm-600'
              }`}
            >
              {format(day, "d")}
              {appt && !tod && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-mauve-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-lav-100 flex items-center gap-5 text-xs text-warm-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-mauve-300" />
          <span>Citas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-lg bg-brand-gradient" />
          <span>Hoy</span>
        </div>
      </div>
    </div>
  );
}
