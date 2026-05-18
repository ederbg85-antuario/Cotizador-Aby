"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calculator, CalendarDays, User } from "lucide-react";

function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${size === "md" ? "w-9 h-9" : "w-8 h-8"} rounded-xl bg-brand-gradient flex items-center justify-center shadow-petal`}>
        <span className="font-display italic text-white text-base font-bold">N</span>
      </div>
      <div className="leading-none">
        <p className={`font-display ${size === "md" ? "text-lg" : "text-base"} text-warm-800 font-semibold tracking-tight`}>
          Nails by <span className="italic text-mauve-700">Cinthia</span>
        </p>
        <p className="text-[10px] text-warm-400 font-medium tracking-[0.18em] uppercase mt-0.5">Estudio de uñas</p>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Cotizador", icon: Calculator },
    { href: "/pedidos", label: "Pedidos", icon: CalendarDays },
    { href: "/auth/login", label: "Mi Cuenta", icon: User },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex glass sticky top-0 z-40 h-18 items-center border-b border-lav-100/70 px-8 lg:px-16 py-3">
        <Link href="/" className="flex-1">
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(href)
                  ? "bg-brand-gradient text-white shadow-petal"
                  : "text-warm-600 hover:text-mauve-700 hover:bg-lav-100/60"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile */}
      <nav className="md:hidden glass sticky top-0 z-50 h-16 flex items-center justify-between px-5 border-b border-lav-100/70">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-warm-600 hover:bg-lav-100/60"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-lav-100 shadow-petal-lg rounded-b-3xl overflow-hidden animate-fade-in-up">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium border-b border-lav-50 last:border-0 ${
                  isActive(href) ? "bg-brand-gradient text-white" : "text-warm-700 hover:bg-lav-50"
                }`}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
