"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, Building2, Sparkles } from "lucide-react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", salonName: "", password: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim())           { setError("Por favor ingresa tu nombre"); return; }
    if (!formData.email.trim())          { setError("Por favor ingresa tu correo"); return; }
    if (!formData.salonName.trim())      { setError("Por favor ingresa el nombre de tu salón"); return; }
    if (formData.password.length < 8)    { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    if (formData.password !== formData.confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsLoading(false);
  };

  const baseInput = "w-full py-3.5 bg-lav-50/70 border border-lav-200 rounded-2xl text-warm-800 text-sm placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-mauve-300 focus:border-transparent transition-all";
  const labelClass = "block text-[11px] font-semibold text-warm-500 uppercase tracking-[0.15em] mb-2.5";

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-6 bg-brand-gradient rounded-3xl flex items-center justify-center shadow-petal-lg">
          <span className="font-display italic text-white text-4xl font-bold">A</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-warm-800 tracking-tight">
          Nails by <span className="italic text-brand-gradient">Aby</span>
        </h1>
        <p className="text-xs text-warm-400 mt-3 tracking-[0.18em] uppercase">Panel de administración</p>
      </div>

      <div className="bg-white rounded-3xl border border-lav-100 shadow-petal px-7 sm:px-10 py-10">
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-100 mb-4">
            <Sparkles size={11} className="text-champagne-600" />
            <span className="text-[11px] font-semibold text-champagne-600 tracking-wide">Empieza tu estudio</span>
          </div>
          <h2 className="font-display text-2xl text-warm-800 mb-2">Crear cuenta</h2>
          <p className="text-sm text-warm-500">Configuramos tu espacio en segundos</p>
        </div>

        {error && (
          <div className="mb-6 px-5 py-3.5 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { id: "name",      label: "Tu nombre",          type: "text",  icon: User,      ph: "María García",      val: formData.name },
            { id: "email",     label: "Correo electrónico", type: "email", icon: Mail,      ph: "tu@email.com",      val: formData.email },
            { id: "salonName", label: "Nombre del salón",   type: "text",  icon: Building2, ph: "Mi Salón de Uñas",  val: formData.salonName },
          ].map(({ id, label: lbl, type, icon: Icon, ph, val }) => (
            <div key={id}>
              <label className={labelClass}>{lbl}</label>
              <div className="relative">
                <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" />
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={val}
                  onChange={handle}
                  placeholder={ph}
                  className={`${baseInput} pl-12 pr-4`}
                  required
                />
              </div>
            </div>
          ))}

          {[
            { id: "password",        lbl: "Contraseña",            show: showPwd,  toggle: () => setShowPwd(!showPwd),   ph: "Mínimo 8 caracteres", val: formData.password },
            { id: "confirmPassword", lbl: "Confirmar contraseña",  show: showCPwd, toggle: () => setShowCPwd(!showCPwd), ph: "Repite tu contraseña", val: formData.confirmPassword },
          ].map(({ id, lbl, show, toggle, ph, val }) => (
            <div key={id}>
              <label className={labelClass}>{lbl}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" />
                <input
                  id={id}
                  name={id}
                  type={show ? "text" : "password"}
                  value={val}
                  onChange={handle}
                  placeholder={ph}
                  className={`${baseInput} pl-12 pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-400 hover:text-mauve-700 transition-colors"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 font-semibold text-sm rounded-2xl mt-4 disabled:opacity-60"
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-lav-200" /></div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-[11px] text-warm-400 font-medium uppercase tracking-wider">o</span>
          </div>
        </div>

        <p className="text-center text-sm text-warm-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="font-semibold text-mauve-700 hover:text-mauve-800 underline underline-offset-2">
            Iniciar sesión
          </Link>
        </p>
      </div>

      <p className="text-center text-xs text-warm-400 mt-7">🔒 Tus datos están seguros</p>
    </div>
  );
}
