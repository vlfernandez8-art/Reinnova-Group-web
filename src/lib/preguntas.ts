import { DiagnosticQuestion, RubroId } from "./types";

const options = (labels: string[]) =>
  labels.map((label, index) => ({ label, score: index === 0 ? 0 : index === 1 ? 1 : index === 2 ? 3 : 4 }));

export const rubros: { id: RubroId; label: string; icon: string }[] = [
  { id: "retail", label: "Comercio Minorista / Retail", icon: "ShoppingCart" },
  { id: "gastronomia", label: "Gastronomía / Food Service", icon: "Utensils" },
  { id: "construccion", label: "Construcción y afines", icon: "HardHat" },
  { id: "salud", label: "Salud / Clínica / Veterinaria", icon: "HeartPulse" },
  { id: "servicios-personales", label: "Servicios Personales", icon: "Scissors" },
  { id: "servicios-tecnicos", label: "Servicios Técnicos / Industria", icon: "Wrench" },
  { id: "logistica", label: "Logística / Distribución", icon: "Truck" },
  { id: "servicios-profesionales", label: "Servicios Profesionales", icon: "BriefcaseBusiness" },
  { id: "tecnologia", label: "Tecnología / Software", icon: "Code2" },
  { id: "importacion-exportacion", label: "Importación / Exportación", icon: "Globe2" },
  { id: "agro", label: "Agropecuario / Agro", icon: "Sprout" },
  { id: "educacion", label: "Educación / Capacitación", icon: "GraduationCap" },
  { id: "manufactura", label: "Manufactura / Producción", icon: "Factory" },
  { id: "inmobiliaria", label: "Inmobiliaria / Construcción", icon: "Home" },
  { id: "ecommerce", label: "E-commerce / Venta Online", icon: "Package" },
  { id: "otro", label: "Otro", icon: "Settings" },
];

export const baseQuestions: DiagnosticQuestion[] = [
  {
    id: "fin_caja",
    block: "Control financiero",
    text: "Sabes en este momento cuanto dinero tenes disponible entre caja y banco?",
    kind: "single",
    options: options(["Si, al instante", "Con 1-2 dias de demora", "Solo aproximado", "No tengo idea"]),
  },
  {
    id: "fin_personales",
    block: "Control financiero",
    text: "Las finanzas del negocio estan separadas de las personales?",
    kind: "single",
    options: options(["Completamente separadas", "Mayormente separadas", "Se mezclan bastante", "Estan mezcladas"]),
  },
  {
    id: "fin_margen",
    block: "Control financiero",
    text: "Sabes que productos, servicios o trabajos te dejan mayor margen?",
    kind: "single",
    options: options(["Si, con datos", "Tengo una idea general", "Lo reviso poco", "No lo se"]),
  },
  {
    id: "ops_continuidad",
    block: "Operaciones y procesos",
    text: "Si vos o una persona clave no esta disponible por varios dias, el negocio puede seguir funcionando?",
    kind: "single",
    options: options(["Sin problemas", "Con pequenos ajustes", "Con problemas importantes", "Se frena casi todo"]),
  },
  {
    id: "ops_info_unica",
    block: "Operaciones y procesos",
    text: "La informacion se carga una sola vez y todos trabajan con el mismo dato?",
    kind: "single",
    options: options(["Si, todo integrado", "Mayormente", "Hay datos repetidos", "Cada uno maneja su version"]),
  },
  {
    id: "tec_gestion",
    block: "Tecnologia y datos",
    text: "Usas algun sistema, planilla ordenada o metodo unico para gestionar ventas, pagos, stock/clientes y reportes?",
    kind: "single",
    options: options(["Si, integrado", "Si, pero incompleto", "Planillas/WhatsApp", "No hay metodo claro"]),
  },
];
export const industryQuestions: Partial<Record<RubroId, DiagnosticQuestion[]>> = {
  retail: [
    ["ret_stock", "¿Tu stock está actualizado en tiempo real o lo controlás periódicamente?", ["Tiempo real", "Cada semana", "Cada mes", "Nunca lo controlo"]],
    ["ret_tarjetas", "¿Cuántos días pasan entre una venta con tarjeta y la conciliación?", ["Lo sé exactamente", "Aproximadamente", "No lo controlo", "No sé comisiones"]],
    ["ret_caja", "¿Cómo controlás las diferencias de caja al cierre del día?", ["Proceso documentado", "Se anota algo", "No se controla", "No se cierra caja"]],
    ["ret_margen", "¿Sabés cuáles son los 5 productos que más margen generan?", ["Sí, con datos", "Intuición", "No", "No analizo márgenes"]],
  ].map(toQuestion("Comercio y stock")),
  gastronomia: [
    ["gas_foodcost", "¿Tenés calculado el food cost de cada plato?", ["Sí y lo actualizo", "Aproximado", "No lo tengo", "No sé qué es"]],
    ["gas_desperdicio", "¿Cómo controlás el uso de insumos y desperdicio?", ["Registro diario", "Registro parcial", "No se registra", "Es un caos"]],
    ["gas_precios", "¿Tus precios contemplan inflación actualizada?", ["Reviso mensualmente", "Cada 3 meses", "Hace más de 6 meses", "Precios intuitivos"]],
    ["gas_ventas", "¿Tenés ventas por producto y día?", ["Sí, en sistema", "Solo totales", "No", "No tengo registro"]],
  ].map(toQuestion("Gastronomía")),
  construccion: [
    ["con_costos", "¿Tenés presupuestos por obra con costos reales vs estimados?", ["Sí, siempre", "A veces", "Solo presupuesto inicial", "Voy sobre la marcha"]],
    ["con_avance", "¿Cómo controlás avance de obra y flujo de fondos?", ["Cronograma documentado", "Seguimiento informal", "Solo lo sé yo", "No hay control"]],
    ["con_proveedores", "¿Proveedores y subcontratistas están registrados con pagos al día?", ["Todo documentado", "Mayormente", "Parcialmente", "No hay registro"]],
  ].map(toQuestion("Proyectos y obras")),
  salud: [
    ["sal_turnos", "¿Tenés turnos integrados con facturación e historia clínica?", ["Sí, integrado", "Separados pero funcionan", "Sin conexión", "Todo manual"]],
    ["sal_pacientes", "¿Sabés cuántos pacientes activos tenés y cuántos no volvieron?", ["Sí, exactamente", "Aproximadamente", "No", "No tengo registro"]],
    ["sal_cuentas", "¿Controlás cuentas corrientes de obras sociales o prepagas?", ["Sí, con seguimiento", "Parcialmente", "Solo cuando hay deuda", "No"]],
  ].map(toQuestion("Gestión clínica")),
  "servicios-personales": [
    ["per_turnos", "¿Usás turnos que registren ingresos por servicio y profesional?", ["Sí, completo", "Turnos sí, ingresos no", "Papel/WhatsApp", "No hay sistema"]],
    ["per_ticket", "¿Sabés ticket promedio por cliente y frecuencia de regreso?", ["Sí, lo mido", "Aproximación", "No", "No analizo eso"]],
    ["per_profesional", "¿Tenés control de ingresos por profesional?", ["Sí, por persona", "Totales", "No", "No tengo empleados fijos"]],
  ].map(toQuestion("Turnos y clientes")),
  "servicios-tecnicos": [
    ["tec_ot", "¿Tenés órdenes de trabajo documentadas por cliente?", ["Sí, todas", "La mayoría", "Solo algunas", "No, de palabra"]],
    ["tec_repuestos", "¿Cómo controlás inventario de repuestos?", ["Sistema actualizado", "Revisión periódica", "Cuando falta algo", "No controlo"]],
    ["tec_estado", "¿Sabés qué trabajos están pendientes, en proceso o entregados?", ["Sí, dashboard", "Seguimiento informal", "Solo yo lo sé", "No hay seguimiento"]],
  ].map(toQuestion("Órdenes de trabajo")),
  logistica: [
    ["log_flota", "¿Tenés control de flota con costos por unidad y viaje?", ["Sí, detallado", "Solo total", "No", "No tengo flota propia"]],
    ["log_entregas", "¿Cómo controlás entregas, faltantes y reclamos?", ["Sistema documentado", "Excel/WhatsApp", "Informal", "No hay control"]],
    ["log_km", "¿Conocés el costo por kilómetro o entrega?", ["Sí, lo calculo", "Aproximación", "No", "Nunca lo calculé"]],
  ].map(toQuestion("Distribución")),
  "servicios-profesionales": [
    ["pro_rentabilidad", "¿Medís rentabilidad por cliente?", ["Sí, por cliente", "Por servicio", "No", "Facturo y ya"]],
    ["pro_no_facturable", "¿Cuánto trabajo no facturable perdés por semana?", ["Menos del 10%", "10-20%", "20-35%", "Más del 35%"]],
    ["pro_documentado", "¿Tenés procesos documentados?", ["Todo documentado", "Parcialmente", "Lo saben las personas", "Nada documentado"]],
  ].map(toQuestion("Servicios profesionales")),
  tecnologia: [
    ["soft_metricas", "¿Usás métricas como MRR, churn, CAC o LTV?", ["Dashboard en tiempo real", "Algunas métricas", "Solo facturación", "No medimos"]],
    ["soft_onboarding", "¿Tu onboarding de clientes está documentado y es repetible?", ["Sí, automatizado", "Documentado manual", "Depende del equipo", "No existe"]],
  ].map(toQuestion("Software")),
  "importacion-exportacion": [
    ["imp_costos", "¿Tenés costos de importación/exportación actualizados por operación?", ["Sí, por operación", "Aproximados", "Parciales", "No"]],
    ["imp_documentos", "¿Controlás documentación, vencimientos y pagos en un solo lugar?", ["Sí, centralizado", "Excel", "Parcial", "No"]],
  ].map(toQuestion("Comercio exterior")),
  agro: [
    ["agr_costos", "¿Llevás costos por lote, cultivo o hacienda?", ["Sí, detallado", "General", "No", "No aplica"]],
    ["agr_flujo", "¿Cómo planificás el flujo de fondos según estacionalidad?", ["Proyección anual", "Estimación básica", "Reacciono tarde", "No planifico"]],
  ].map(toQuestion("Agro")),
  educacion: [
    ["edu_gestion", "¿Tenés gestión de alumnos, inscripciones y cobranzas integrada?", ["Sí, integrado", "Separado pero funciona", "Planillas", "Nada"]],
    ["edu_retencion", "¿Medís retención de alumnos entre ciclos o cursos?", ["Sí, lo analizo", "Aproximación", "No", "No lo pensé"]],
  ].map(toQuestion("Educación")),
  manufactura: [
    ["man_costeo", "¿Tenés costeo de producción por unidad actualizado?", ["Sí, mensual", "Estimado", "No", "Nunca lo calculé"]],
    ["man_desperdicio", "¿Cómo controlás materias primas y desperdicio?", ["Registro diario", "Periódico", "Solo si hay problema", "No controlo"]],
  ].map(toQuestion("Producción")),
  inmobiliaria: [
    ["inm_cartera", "¿Tenés cartera de inmuebles con estado, comisiones y vencimientos?", ["Sí, sistema", "Excel", "Incompleto", "No"]],
    ["inm_leads", "¿Cómo llevás el seguimiento de leads e interesados?", ["CRM", "Excel/WhatsApp", "Memoria", "No llevo seguimiento"]],
  ].map(toQuestion("Inmobiliaria")),
  ecommerce: [
    ["eco_stock", "¿Tenés integrado stock con todos los canales de venta?", ["Sí, sincronizado", "Manual", "No", "Vendo en un canal"]],
    ["eco_cac", "¿Calculás CAC y retorno de cada campaña?", ["Sí, por canal", "Total general", "No", "No hago publicidad"]],
    ["eco_marketplace", "¿Conciliás ventas de marketplace con pagos reales?", ["Automáticamente", "Manualmente", "A veces", "No concilio"]],
  ].map(toQuestion("E-commerce")),
  otro: [
    ["otr_datos", "¿Tenés un tablero mínimo para mirar ventas, costos y pendientes?", ["Sí, actualizado", "Parcial", "No", "No lo necesito"]],
    ["otr_procesos", "¿Tus procesos principales están escritos y se pueden delegar?", ["Sí", "Algunos", "Muy pocos", "Ninguno"]],
  ].map(toQuestion("Gestión general")),
};

const cyberOptions = (positive: string, partial: string, weak: string, critical: string) =>
  options([positive, partial, weak, critical]);

const cyberBaseQuestion: DiagnosticQuestion = {
  id: "cyber_backup_general",
  block: "Cyberseguridad",
  text: "¿Su empresa realiza copias de seguridad automáticas y verificadas de su información crítica?",
  kind: "single",
  options: cyberOptions("Sí, automáticas y probadas", "Automáticas sin prueba frecuente", "Manuales o esporádicas", "No tenemos backup confiable"),
};


const cyberRegulatoryRequirement: Partial<Record<RubroId, string>> = {
  retail: "Ley 25.326 y defensa del consumidor",
  gastronomia: "Ley 25.326 y normas sanitarias",
  construccion: "Seguridad e higiene y normativa profesional",
  salud: "Ley 25.326 y Ley 26.529",
  "servicios-personales": "Ley 25.326 si guarda base de clientes",
  "servicios-tecnicos": "Ley 25.326 y obligaciones del servicio",
  logistica: "CNRT y trazabilidad por operacion",
  "servicios-profesionales": "Secreto profesional y Ley 25.246 si aplica",
  tecnologia: "Ley 25.326 y PCI-DSS si hay pagos",
  "importacion-exportacion": "AFIP/Aduana y normativa cambiaria",
  agro: "SENASA y trazabilidad sanitaria",
  educacion: "Ley 26.206 y proteccion de datos de menores",
  manufactura: "Normas de seguridad e higiene del sector",
  inmobiliaria: "Ley 25.326 y normas inmobiliarias",
  ecommerce: "Defensa del consumidor y seguridad de pagos",
  otro: "A definir",
};

const rubrosConNormativaCyber = new Set<RubroId>([
  "salud",
  "educacion",
  "servicios-profesionales",
  "tecnologia",
  "ecommerce",
  "importacion-exportacion",
  "logistica",
]);
const cyberComplianceQuestion = (rubro: RubroId): DiagnosticQuestion | null => {
  const requirement = cyberRegulatoryRequirement[rubro];
  if (!requirement || requirement === "A definir") {
    return {
      id: "cyber_normativa",
      block: "Cyberseguridad",
      text: "Tu rubro requiere cumplimiento normativo y este tema esta definido?",
      kind: "single",
      options: cyberOptions(
        "No aplica por ahora",
        "No aplica por ahora",
        "Aun estamos definiendo",
        "No sabemos lo que aplica",
      ),
    };
  }

  return {
    id: "cyber_normativa",
    block: "Cyberseguridad",
    text: `Cumplis la normativa base de tu rubro? (${requirement})`,
    kind: "single",
    options: cyberOptions("Si, cumplimos y esta documentado", "Parcialmente", "No esta bien implementado", "No sabia que aplicaba"),
  };
};

const cyberIndustryQuestions: Record<RubroId, DiagnosticQuestion[]> = {
  retail: cyberQuestions("¿El sistema de caja/stock tiene usuarios individuales y permisos por rol?", "¿Protegés los datos de clientes y medios de pago con accesos controlados?"),
  gastronomia: cyberQuestions("¿Los sistemas de reservas, delivery y caja tienen accesos separados por usuario?", "¿Existe un plan para operar si falla internet, el POS o la plataforma de pedidos?"),
  construccion: cyberQuestions("¿Los presupuestos, planos y contratos se guardan en repositorios con control de acceso?", "¿Tenés resguardo de documentación crítica de obras ante robo, pérdida o ransomware?"),
  salud: cyberQuestions("¿Las historias clínicas, turnos y datos de pacientes tienen permisos y trazabilidad de acceso?", "¿Existe un protocolo para recuperar agenda e información clínica si un sistema queda fuera de línea?"),
  "servicios-personales": cyberQuestions("¿Los datos de clientes, turnos y pagos están protegidos con usuarios y contraseñas propias?", "¿Tenés backup de agenda, fichas y caja para recuperar operación en menos de 48 horas?"),
  "servicios-tecnicos": cyberQuestions("¿Las órdenes de trabajo, clientes y presupuestos se administran con accesos por usuario?", "¿Tenés resguardo de información técnica y documentación de clientes ante pérdida de equipos?"),
  logistica: cyberQuestions("¿Los datos de flota, rutas y entregas están protegidos contra accesos no autorizados?", "¿Existe continuidad operativa si cae el sistema de seguimiento, facturación o coordinación?"),
  "servicios-profesionales": cyberQuestions("¿Los documentos de clientes se almacenan con permisos, historial y doble factor?", "¿Tenés un procedimiento para responder ante fuga de información confidencial de clientes?"),
  tecnologia: cyberQuestions("¿Usan doble factor, control de accesos y gestión de credenciales en sistemas críticos?", "¿Tienen monitoreo, backups y pruebas de recuperación para ambientes productivos?"),
  "importacion-exportacion": cyberQuestions("¿La documentación aduanera, pagos y proveedores se comparten por canales seguros?", "¿Tenés resguardo y recuperación de documentación crítica ante pérdida o bloqueo de sistemas?"),
  agro: cyberQuestions("¿La información de lotes, costos, maquinaria y proveedores tiene backup y control de acceso?", "¿Existe un plan para operar si se pierde acceso a sistemas de gestión, clima, stock o trazabilidad?"),
  educacion: cyberQuestions("¿Los datos de alumnos, docentes, pagos e inscripciones están protegidos por permisos?", "¿Tenés backup y plan de recuperación para campus, legajos, cobranzas y comunicaciones?"),
  manufactura: cyberQuestions("¿Los sistemas de producción, stock y compras tienen usuarios, permisos y respaldo?", "¿Existe continuidad operativa si cae el sistema de producción, inventario o facturación?"),
  inmobiliaria: cyberQuestions("¿Contratos, documentación de inmuebles y datos de clientes se almacenan en canales seguros?", "¿Tenés backup y recuperación rápida de cartera, leads, reservas y documentación legal?"),
  ecommerce: cyberQuestions("¿La tienda, pasarelas, marketplace y accesos administrativos usan doble factor?", "¿Tenés plan de recuperación si se bloquea la tienda, se fuga información o cae un canal de venta?"),
  otro: cyberQuestions("¿Los accesos a sistemas, mails y archivos críticos están controlados por usuario?", "¿Tenés definido cómo recuperar la operación si se pierde información o se bloquean equipos?"),
};

function cyberQuestions(accessText: string, continuityText: string): DiagnosticQuestion[] {
  return [
    {
      id: "cyber_accesos",
      block: "Cyberseguridad",
      text: accessText,
      kind: "single",
      options: cyberOptions("Sí, con controles claros", "Parcialmente", "Muy básico", "No está controlado"),
    },
    {
      id: "cyber_continuidad",
      block: "Cyberseguridad",
      text: continuityText,
      kind: "single",
      options: cyberOptions("Sí, probado", "Existe pero no se prueba", "Depende de acciones manuales", "No existe"),
    },
  ];
}

function toQuestion(block: string) {
  return (value: (string | string[])[]): DiagnosticQuestion => {
    const [id, text, labels] = value as [string, string, string[]];
    return {
    id,
    block,
    text,
    kind: "single",
    options: options(labels),
    };
  };
}

export function getQuestionsForRubro(rubro: RubroId | "") {
  const normativa = rubro && rubrosConNormativaCyber.has(rubro) ? cyberComplianceQuestion(rubro) : null;

  return [
    ...baseQuestions,
    ...(rubro ? industryQuestions[rubro] ?? [] : []),
    cyberBaseQuestion,
    ...(rubro ? cyberIndustryQuestions[rubro] ?? [] : []),
    ...(normativa ? [normativa] : []),
  ];
}

