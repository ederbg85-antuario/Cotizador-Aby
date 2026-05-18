"use client";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegistroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-8 bg-cream-pattern">
      <div className="container-narrow">
        <RegisterForm />
      </div>
    </div>
  );
}
