"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-8 bg-cream-pattern">
      <div className="container-narrow">
        <LoginForm />
      </div>
    </div>
  );
}
