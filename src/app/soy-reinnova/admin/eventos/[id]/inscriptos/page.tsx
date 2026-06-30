import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById, getRegistrations } from "@/lib/eventsDataStore";

export const revalidate = 0;

export default async function EventRegistrationsPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  if (!event) {
    notFound();
  }

  const registrations = await getRegistrations(params.id);

  return (
    <section className="section-shell py-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-4xl font-bold">Inscriptos</h1>
          <p className="mt-2 text-white/70">{event.title}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/soy-reinnova/admin/eventos" className="rounded border border-white/12 px-3 py-2 text-sm">
            Volver
          </Link>
          <a href={`/api/admin/events/${event.id}/registrations/csv`} className="rounded bg-accent px-3 py-2 text-sm font-bold text-black">
            Descargar CSV
          </a>
        </div>
      </div>

      <div className="glow-card overflow-x-auto rounded border border-white/12 bg-white/[0.03]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-xs uppercase text-white/54">Nombre y apellido</th>
              <th className="px-4 py-3 text-xs uppercase text-white/54">Empresa</th>
              <th className="px-4 py-3 text-xs uppercase text-white/54">Puesto</th>
              <th className="px-4 py-3 text-xs uppercase text-white/54">Mail</th>
              <th className="px-4 py-3 text-xs uppercase text-white/54">Telefono</th>
              <th className="px-4 py-3 text-xs uppercase text-white/54">Fecha de inscripcion</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-white/70" colSpan={6}>
                  No hay inscriptos para esta capacitacion.
                </td>
              </tr>
            ) : (
              registrations.map((row) => (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="px-4 py-3">{row.fullName}</td>
                  <td className="px-4 py-3">{row.company}</td>
                  <td className="px-4 py-3">{row.position}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.phone}</td>
                  <td className="px-4 py-3">{new Date(row.createdAt).toLocaleString("es-AR")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
