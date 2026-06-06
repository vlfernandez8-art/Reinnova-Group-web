import { Contacto } from "@/components/home/Contacto";
import { DiagnosticoPreview } from "@/components/home/DiagnosticoPreview";
import { Hero } from "@/components/home/Hero";
import { Metodologia } from "@/components/home/Metodologia";
import { Problema } from "@/components/home/Problema";
import { ProcesoTrabajo } from "@/components/home/ProcesoTrabajo";
import { Servicios } from "@/components/home/Servicios";

export default function Home() {
  return (
    <main>
      <Hero />
      <Problema />
      <Metodologia />
      <DiagnosticoPreview />
      <Servicios />
      <ProcesoTrabajo />
      <Contacto />
    </main>
  );
}
