"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") ?? "/soy-reinnova/admin/eventos";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Completa mail y contrasena para ingresar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12000);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        signal: controller.signal,
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      }).finally(() => window.clearTimeout(timeout));

      if (response.status === 429) {
        setLoading(false);
        setError("Demasiados intentos. Espera unos minutos y volve a probar.");
        return;
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setLoading(false);
        setError(getLoginErrorMessage(payload?.error));
        return;
      }

      const sessionResponse = await fetch("/api/admin/session", {
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!sessionResponse.ok) {
        setLoading(false);
        setError("La clave fue validada, pero no se pudo abrir la sesion. Actualiza la pagina y volve a intentar.");
        return;
      }

      window.location.href = redirectTo;
    } catch {
      setLoading(false);
      setError("No pudimos conectar con el servidor o la respuesta demoro demasiado. Volve a intentar en unos segundos.");
    }
  };

  return (
    <main className="min-h-screen pt-28">
      <section className="section-shell grid max-w-2xl gap-6 py-12">
        <h1 className="font-heading text-4xl font-bold">Acceso interno Reinnova</h1>
        <p className="text-white/72">Ingresa con tu usuario administrador para gestionar eventos y capacitaciones.</p>
        <form className="glow-card rounded border border-white/12 bg-white/[0.03] p-6 md:p-8" onSubmit={submit}>
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm">
              <span>Mail</span>
              <input className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Contrasena</span>
              <input type="password" className="input" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            {error ? <p className="rounded border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p> : null}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="mt-2 rounded bg-accent px-5 py-3 font-bold text-black disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
          <p className="mt-5 text-sm text-white/64">
            <Link className="text-accent underline" href="/">
              Volver al inicio
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function LoginShell() {
  return (
    <main className="min-h-screen pt-28">
      <section className="section-shell grid max-w-2xl gap-6 py-12">
        <h1 className="font-heading text-4xl font-bold">Acceso interno Reinnova</h1>
        <p className="text-white/72">Cargando acceso interno...</p>
      </section>
    </main>
  );
}

function getLoginErrorMessage(error?: string) {
  if (error === "invalid_request") return "No pudimos validar el origen de la solicitud. Actualiza la pagina y volve a intentar.";
  if (error === "missing_credentials") return "Completa mail y contrasena para ingresar.";
  if (error === "server_error") return "Hay un problema tecnico en el servidor. Revisemos las variables de Vercel.";
  return "No pudimos validar tus credenciales.";
}
