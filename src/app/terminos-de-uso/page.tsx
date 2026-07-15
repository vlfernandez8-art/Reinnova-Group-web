import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Términos de Uso | Reinnova Group" };

export default function TermsPage() {
  return (
    <main className="section-shell py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Condiciones del sitio y los servicios</p>
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-6xl">Términos de Uso</h1>
        <p className="mt-4 text-sm text-white/55">Última actualización: 15 de julio de 2026</p>
        <div className="legal-copy mt-10 grid gap-8 rounded-lg border border-white/10 bg-white/[0.03] p-6 text-[15px] leading-7 text-white/72 md:p-10">
          <Section title="1. Alcance y aceptación"><p>Estos Términos regulan el acceso y uso del sitio web de Reinnova Group, su autodiagnóstico, contenidos, eventos, capacitaciones y demás servicios disponibles. Al utilizar el Sitio, la persona declara haber leído y aceptado estos Términos.</p></Section>
          <Section title="2. Autodiagnóstico"><p>El autodiagnóstico es una herramienta orientativa destinada a relevar aspectos operativos, administrativos, tecnológicos y de ciberseguridad de una empresa. Las estimaciones, niveles de madurez y recomendaciones se generan a partir de la información proporcionada y pueden variar si ésta es incompleta, aproximada o no refleja la realidad de la organización.</p></Section>
          <Section title="3. Limitaciones del resultado"><p>Los resultados no constituyen una auditoría ni asesoramiento profesional, legal, contable, financiero, fiscal, laboral, técnico o de ciberseguridad definitivo. Las decisiones empresariales deben adoptarse luego de realizar las verificaciones y consultas profesionales correspondientes.</p></Section>
          <Section title="4. Obligaciones de la persona usuaria"><p>La persona usuaria se compromete a proporcionar información veraz, actualizada y de buena fe; no suplantar identidades; contar con autorización suficiente para proporcionar información de la empresa que representa; y no ingresar datos sensibles o información confidencial innecesaria de terceros.</p></Section>
          <Section title="5. Usos prohibidos"><p>Está prohibido utilizar el Sitio con fines ilícitos o fraudulentos, intentar acceder sin autorización a cuentas, sistemas o información, eludir controles de seguridad, introducir código malicioso, explorar vulnerabilidades sin autorización o interferir con el funcionamiento de los servicios.</p></Section>
          <Section title="6. Cuentas y credenciales"><p>Cuando Reinnova otorgue credenciales de acceso, éstas serán personales e intransferibles. La persona autorizada deberá mantenerlas confidenciales y comunicar inmediatamente cualquier uso no autorizado o posible vulneración.</p></Section>
          <Section title="7. Restricción del acceso"><p>Reinnova podrá restringir o suspender el acceso ante incumplimientos de estos Términos, intentos de acceso no autorizado, utilización fraudulenta, afectación de terceros o riesgos para la seguridad del Sitio, sin perjuicio de las acciones legales que pudieran corresponder.</p></Section>
          <Section title="8. Propiedad intelectual"><p>El diseño, software, metodología, cuestionarios, textos, gráficos, marcas, informes y demás contenidos pertenecen a Reinnova o se utilizan con autorización. No pueden copiarse, modificarse, distribuirse o comercializarse sin autorización. La empresa usuaria puede descargar y utilizar internamente el informe generado para ella.</p></Section>
          <Section title="9. Disponibilidad"><p>Reinnova procurará mantener el Sitio disponible y operativo, pero no garantiza un funcionamiento ininterrumpido o libre de errores. Podrá realizar mantenimiento, modificaciones o interrupciones cuando resulten necesarias.</p></Section>
          <Section title="10. Servicios externos"><p>El Sitio puede incluir enlaces o integraciones con servicios de terceros. Reinnova no controla sus contenidos, disponibilidad, términos o políticas de privacidad, que corresponden a sus respectivos responsables.</p></Section>
          <Section title="11. Responsabilidad"><p>Reinnova no será responsable por decisiones adoptadas exclusivamente sobre la base de los resultados orientativos del autodiagnóstico ni por circunstancias externas que no le sean razonablemente atribuibles. Esta limitación no se aplica cuando la responsabilidad no pueda excluirse conforme a la legislación vigente.</p></Section>
          <Section title="12. Datos personales"><p>El tratamiento de datos personales se rige por nuestra <Link href="/politica-de-privacidad">Política de Privacidad</Link>.</p></Section>
          <Section title="13. Modificaciones"><p>Podremos actualizar estos Términos para reflejar cambios legales, técnicos o de los servicios. La versión vigente estará disponible en esta página.</p></Section>
          <Section title="14. Legislación aplicable"><p>Estos Términos se rigen por las leyes de la República Argentina. Las controversias serán sometidas a los tribunales competentes conforme a la normativa aplicable, sin afectar los derechos que pudieran corresponder a consumidores y usuarios.</p></Section>
        </div>
        <Link href="/" className="mt-8 inline-flex font-bold text-accent hover:underline">Volver al inicio</Link>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="font-heading text-xl font-bold text-white">{title}</h2><div className="mt-3 grid gap-3">{children}</div></section>;
}
