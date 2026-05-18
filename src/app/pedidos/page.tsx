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

        <main className="flex-1 p-5 md:p-8 lg:p-12 pb-24 lg:pb-12">
          <div className="max-w-6xl mx-auto">
            <OrdersPanel />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
