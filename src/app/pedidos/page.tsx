"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import OrdersPanel from "@/components/orders/OrdersPanel";

export default function PedidosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 pb-24 lg:pb-16">
          <div className="container-app py-10 md:py-14 lg:py-16">
            <OrdersPanel />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
