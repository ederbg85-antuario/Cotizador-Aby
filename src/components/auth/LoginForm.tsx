"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
  };

  return (
    <div className="w-full">
      {/* Brand */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-6 bg-brand-gradient rounded-3xl flex items-center justify-center shadow-petal-lg">
          <span className="font-display italic text-white text-4xl font-bold">A</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-warm-800 tracking-tight">
          Cotizador de <span className="italic text-brand-gradient">Aby</span>
        </h1>
        <p className="text-xs text-warm-400 mt-3 tracking-[0.18em] uppercase">Panel de administración</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl border border-lav-100 shadow-petal px-7 sm:px-10 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mauve-100 mb-4">
            <Sparkles size={11} className="text-mauve-600" />
            <span className="text-[11px] font-semibold text-mauve-700 tracking-wide">Bienvenida</span>
          </div>
          <h2 className="font-display text-2xl text-warm-800">Iniciar sesión</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-semibold text-warm-500 uppercase tracking-[0.15em] mb-2.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-lav-50/70 border border-lav-200 rounded-2xl text-warm-800 text-sm placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-mauve-300 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-warm-500 uppercase tracking-[0.15em] mb-2.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" />
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-12 py-3.5 bg-lav-50/70 border border-lav-200 rounded-2xl text-warm-800 text-sm placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-mauve-300 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-400 hover:text-mauve-700"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-mauve-600"
              />
              <span className="text-sm text-warm-600">Recuérdame</span>
            </label>
            <Link href="#" className="text-sm font-medium text-mauve-700 hover:text-mauve-800 transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 font-semibold text-sm rounded-2xl mt-4 disabled:opacity-60"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-lav-200" /></div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-[11px] text-warm-400 font-medium uppercase tracking-wider">o</span>
          </div>
        </div>
        <p className="text-center text-sm text-warm-600">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/registro" className="font-semibold text-mauve-700 hover:text-mauve-800 underline underline-offset-2">
            Crear cuenta
          </Link>
        </p>
      </div>
      <p className="text-center text-xs text-warm-400 mt-7">🔒 Tus datos están seguros</p>
    </div>
  );
}
