import { Contacto } from "@/components/home/Contacto";
import { DiagnosticoPreview } from "@/components/home/DiagnosticoPreview";
import { EventosPreview } from "@/components/home/EventosPreview";
import { Hero } from "@/components/home/Hero";
import { Metodologia } from "@/components/home/Metodologia";
import { Problema } from "@/components/home/Problema";
import { ProcesoTrabajo } from "@/components/home/ProcesoTrabajo";
import { Servicios } from "@/components/home/Servicios";
import { getPublishedEvents } from "@/lib/eventsDataStore";

export const revalidate = 0;

export default async function Home() {
  const eventos = await getPublishedEvents();
  return (
    <main>
      <Hero />
      <Problema />
      <Metodologia />
      <DiagnosticoPreview />
      <EventosPreview events={eventos} />
      <Servicios />
      <ProcesoTrabajo />
      <Contacto />
    </main>
  );
}
