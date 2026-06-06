import { Mail, MessageCircle } from "lucide-react";

const whatsappUrl = "https://wa.me/5492995054800?text=Hola%2C%20quiero%20conocer%20las%20soluciones%20de%20Reinnova%20Group";

export function Contacto() {
  return (
    <section id="contacto" className="py-24">
      <div className="glow-card section-shell grid gap-8 rounded-lg border border-accent/30 bg-accent/10 p-8 md:grid-cols-[1fr_0.8fr] md:p-12">
        <div>
          <h2 className="font-heading text-4xl font-bold md:text-5xl">Tu operación puede escalar con más control.</h2>
          <p className="mt-4 text-lg text-white/74">
            Hablemos de diagnóstico, software, automatización o una demo del ecosistema Reinnova Group.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded bg-accent px-6 py-4 font-bold text-black">
              <MessageCircle size={18} />
              WhatsApp directo
            </a>
            <a href="mailto:administracion@reinnova.com.ar" className="inline-flex items-center justify-center gap-2 rounded border border-white/16 px-6 py-4 font-bold">
              <Mail size={18} />
              administracion@reinnova.com.ar
            </a>
          </div>
        </div>
        <form className="grid gap-3">
          {["Nombre", "Email", "Empresa"].map((placeholder) => (
            <input key={placeholder} className="focus-ring rounded border border-white/12 bg-black/30 px-4 py-3 text-white placeholder:text-white/42" placeholder={placeholder} />
          ))}
          <textarea className="focus-ring min-h-28 rounded border border-white/12 bg-black/30 px-4 py-3 text-white placeholder:text-white/42" placeholder="Mensaje" />
        </form>
      </div>
    </section>
  );
}
