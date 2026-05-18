"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, CalendarDays, User } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { href: "/",        label: "Cotizador", icon: Calculator },
    { href: "/pedidos", label: "Pedidos",   icon: CalendarDays },
    { href: "/auth/login", label: "Mi Cuenta", icon: User },
  ];

  return (
    <aside className="hidden lg:flex bg-white/60 backdrop-blur-sm sticky top-18 left-0 h-[calc(100vh-4.5rem)] w-64 flex-col border-r border-lav-100/70">
      <div className="px-6 py-6 border-b border-lav-100/70">
        <p className="text-[11px] font-bold text-warm-400 uppercase tracking-[0.18em]">Navegación</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                pathname === href
                  ? "bg-brand-gradient text-white shadow-petal"
                  : "text-warm-600 hover:bg-lav-100/60 hover:text-mauve-700"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-lav-100/70 px-6 py-5">
        <p className="font-display text-sm text-warm-500 leading-tight">
          Nails by <span className="italic text-mauve-700">Cinthia</span>
        </p>
        <p className="text-[10px] text-warm-400 mt-0.5 tracking-wider uppercase">Estudio profesional</p>
      </div>
    </aside>
  );
}
