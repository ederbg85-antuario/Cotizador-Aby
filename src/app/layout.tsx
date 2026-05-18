import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cotizador de Aby — Servicios de manicura",
  description: "Cotizador profesional de servicios de manicura. Acrílico, gel y nail art.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen font-sans antialiased text-warm-700">
        {children}
      </body>
    </html>
  );
}
