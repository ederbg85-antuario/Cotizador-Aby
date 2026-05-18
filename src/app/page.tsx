"use client";

import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { Cotizador } from "@/components/cotizador/Cotizador";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">
        <Cotizador />
      </main>
      <MobileNav />
    </div>
  );
}
