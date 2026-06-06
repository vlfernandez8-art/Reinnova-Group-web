import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/70 py-12">
      <div className="section-shell grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="font-heading text-2xl font-bold">Reinnova Group</div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            Plataformas SaaS y automatización para contabilidad, obra, campo y talento.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-white/72">
          <Link href="/#servicios">Servicios</Link>
          <Link href="/#metodologia">Metodología</Link>
          <Link href="/diagnostico">Diagnóstico gratuito</Link>
          <Link href="/#contacto">Contacto</Link>
        </div>
        <div className="grid gap-3 text-sm text-white/72">
          <span className="flex items-center gap-2"><Mail size={16} /> administracion@reinnova.com.ar</span>
          <span className="flex items-center gap-2"><Phone size={16} /> +54 9 299 505 4800</span>
          <span className="flex items-center gap-2"><MapPin size={16} /> Neuquén, Argentina</span>
        </div>
      </div>
      <div className="section-shell mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-muted md:flex-row">
        <span>© 2025 Reinnova Group · Neuquén, Argentina</span>
        <span>Desarrollado por Reinnova Group</span>
      </div>
    </footer>
  );
}
