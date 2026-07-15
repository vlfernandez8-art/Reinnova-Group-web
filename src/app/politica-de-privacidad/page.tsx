import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Política de Privacidad | Reinnova Group" };

const sections = [
  ["1. Responsable del tratamiento", <p key="responsable">El responsable del tratamiento es <strong>Reinnova Group</strong>, con domicilio en Neuquén, Argentina. Para consultas o para ejercer derechos sobre sus datos personales puede escribir a <a href="mailto:administracion@reinnova.com.ar">administracion@reinnova.com.ar</a>.</p>],
  ["2. Datos que recopilamos", <p key="datos">Podemos recopilar los datos que usted proporciona voluntariamente al completar el autodiagnóstico, formularios de contacto o inscripciones a eventos y capacitaciones. Estos datos pueden incluir nombre y apellido, empresa, cargo o puesto, correo electrónico, teléfono, información general de la empresa y respuestas ingresadas. No solicitamos que incorpore datos sensibles ni información confidencial de terceros que no resulte necesaria.</p>],
  ["3. Finalidades", <div key="finalidades"><p>Utilizamos los datos para:</p><ul><li>generar, analizar y entregar el autodiagnóstico y sus recomendaciones;</li><li>contactarlo en relación con el diagnóstico o una consulta;</li><li>gestionar inscripciones, confirmaciones, eventos y capacitaciones;</li><li>atender solicitudes de información;</li><li>mejorar el funcionamiento y la seguridad del Sitio; y</li><li>elaborar estadísticas internas con información previamente disociada que no permita identificar a personas o empresas.</li></ul><p>No enviaremos comunicaciones promocionales ajenas a su solicitud sin contar con la autorización correspondiente.</p></div>],
  ["4. Consentimiento y campos obligatorios", <p key="consentimiento">Cuando corresponda, el tratamiento se basa en su consentimiento libre, expreso e informado. Los campos señalados como obligatorios son necesarios para generar el diagnóstico, responder una consulta o gestionar una inscripción. Si no los proporciona, es posible que no podamos prestar el servicio solicitado. Los demás campos son facultativos.</p>],
  ["5. Proveedores y destinatarios", <p key="terceros">Reinnova no vende ni comercializa datos personales. Podemos permitir su tratamiento por proveedores de alojamiento, almacenamiento, correo electrónico, soporte o seguridad, únicamente en la medida necesaria para prestar esos servicios y bajo obligaciones de confidencialidad. También podremos comunicar información cuando exista consentimiento, una obligación legal o un requerimiento válido de una autoridad competente.</p>],
  ["6. Conservación", <p key="conservacion">Conservaremos los datos durante el tiempo necesario para cumplir las finalidades informadas y atender obligaciones legales o contractuales. Cuando dejen de ser necesarios, serán eliminados, anonimizados o archivados cuando corresponda.</p>],
  ["7. Almacenamiento en el dispositivo", <p key="storage">El Sitio utiliza el almacenamiento local del navegador para conservar el avance del autodiagnóstico. Esta información permanece en el dispositivo utilizado hasta que usted reinicie el diagnóstico o elimine los datos del navegador.</p>],
  ["8. Seguridad y confidencialidad", <p key="seguridad">Adoptamos medidas técnicas y organizativas razonables para preservar la seguridad y confidencialidad de los datos y evitar su pérdida, adulteración, consulta o tratamiento no autorizado. Sin embargo, ningún sistema conectado a Internet puede garantizar seguridad absoluta.</p>],
  ["9. Sus derechos", <div key="derechos"><p>Puede solicitar gratuitamente el acceso a sus datos personales y, cuando corresponda, su actualización, rectificación, supresión o confidencialidad, acreditando su identidad mediante un correo a <a href="mailto:administracion@reinnova.com.ar">administracion@reinnova.com.ar</a>.</p><p>Las solicitudes de acceso serán respondidas dentro de diez días corridos. Las solicitudes de rectificación, actualización o supresión serán atendidas dentro de cinco días hábiles. La supresión podrá no proceder cuando exista una obligación legal de conservación o pudiera afectar derechos o intereses legítimos de terceros.</p><p>La Agencia de Acceso a la Información Pública, órgano de control de la Ley N.º 25.326, recibe consultas y denuncias por incumplimientos en materia de protección de datos personales.</p></div>],
  ["10. Cambios a esta política", <p key="cambios">Podremos actualizar esta Política para reflejar cambios normativos, técnicos o relacionados con nuestros servicios. La versión vigente estará siempre disponible en esta página.</p>],
] as const;

export default function PrivacyPolicyPage() {
  return <LegalPage eyebrow="Privacidad y datos personales" title="Política de Privacidad" sections={sections} />;
}

function LegalPage({ eyebrow, title, sections }: { eyebrow: string; title: string; sections: ReadonlyArray<readonly [string, React.ReactNode]> }) {
  return (
    <main className="section-shell py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-white/55">Última actualización: 15 de julio de 2026</p>
        <div className="mt-10 grid gap-8 rounded-lg border border-white/10 bg-white/[0.03] p-6 text-[15px] leading-7 text-white/72 md:p-10">
          <p>Esta Política explica cómo Reinnova Group recopila, utiliza y protege los datos personales proporcionados a través de este sitio web.</p>
          {sections.map(([heading, content]) => <section key={heading} className="legal-copy"><h2 className="font-heading text-xl font-bold text-white">{heading}</h2><div className="mt-3 grid gap-3">{content}</div></section>)}
        </div>
        <Link href="/" className="mt-8 inline-flex font-bold text-accent hover:underline">Volver al inicio</Link>
      </div>
    </main>
  );
}
