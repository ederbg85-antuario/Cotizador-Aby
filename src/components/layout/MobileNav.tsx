"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, CalendarDays, User } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Cotizador", icon: Calculator },
    { href: "/pedidos", label: "Pedidos", icon: CalendarDays },
    { href: "/auth/login", label: "Cuenta", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-lav-100/60 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                active ? "text-mauve-700" : "text-warm-400 hover:text-mauve-600"
              }`}
            >
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-brand-gradient rounded-b-full" />
              )}
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[11px] font-semibold tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
