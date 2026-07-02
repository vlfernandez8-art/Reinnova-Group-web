import Link from "next/link";
import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { BarChart3, CalendarDays } from "lucide-react";
import { getAdminFromSessionCookie } from "@/lib/adminAuth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getAdminFromSessionCookie();
  if (!admin) {
    redirect("/soy-reinnova/login");
  }

  return (
    <main className="min-h-screen pt-24">
      <div className="border-b border-white/10 bg-black/60">
        <div className="section-shell flex flex-wrap items-center justify-between gap-3 py-3">
          <h1 className="font-heading text-2xl font-bold">Panel interno</h1>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/soy-reinnova/admin"
              className="inline-flex items-center gap-2 rounded border border-white/12 px-3 py-2 text-sm"
            >
              <CalendarDays size={16} />
              Eventos
            </Link>
            <Link
              href="/soy-reinnova/admin/relevamiento"
              className="inline-flex items-center gap-2 rounded border border-white/12 px-3 py-2 text-sm"
            >
              <BarChart3 size={16} />
              Relevamiento
            </Link>
            <form action="/api/admin/logout" method="post">
              <button className="rounded border border-white/12 px-3 py-2 text-sm">Salir</button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </main>
  );
}
