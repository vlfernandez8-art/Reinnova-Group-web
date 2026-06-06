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
    text: "¿Sabés en este momento exactamente cuánto dinero tenés disponible en caja + banco?",
    kind: "single",
    options: options(["Sí, al instante", "Con 1-2 días de demora", "Solo aproximado", "No tengo idea"]),
  },
  {
    id: "fin_rentabilidad",
    block: "Control financiero",
    text: "¿Cuánto tiempo tardás en saber si el mes fue rentable o no?",
    kind: "single",
    options: options(["El mismo día que cierra", "1 semana", "15 días o más", "Nunca lo sé con precisión"]),
  },
  {
    id: "fin_personales",
    block: "Control financiero",
    text: "¿Las finanzas del negocio están separadas de las personales?",
    kind: "single",
    options: options(["Completamente separadas", "Mayormente separadas", "Se mezclan bastante", "Están mezcladas"]),
  },
  {
    id: "ops_persona_clave",
    block: "Operaciones y procesos",
    text: "Si faltara una persona clave en tu empresa hoy, ¿el proceso se frena?",
    kind: "single",
    options: options(["Para nada, todo documentado", "Algo se frena", "Se frena bastante", "Todo para"]),
  },
  {
    id: "ops_dato_repetido",
    block: "Operaciones y procesos",
    text: "¿Cuántas veces se carga el mismo dato en diferentes lugares?",
    kind: "single",
    options: options(["Una sola vez", "2 veces", "3 o más veces", "No lo sé"]),
  },
  {
    id: "ops_rentables",
    block: "Operaciones y procesos",
    text: "¿Tenés registrado cuáles son tus productos/servicios más rentables?",
    kind: "single",
    options: options(["Sí, con datos", "Tengo intuición", "No lo sé", "Nunca lo analicé"]),
  },
  {
    id: "tec_software",
    block: "Tecnología y datos",
    text: "¿Usás algún software de gestión (ERP, CRM, facturador)?",
    kind: "single",
    options: options(["Sí, integrado y actualizado", "Sí pero incompleto", "Solo Excel/papel", "No uso nada"]),
  },
  {
    id: "tec_versiones",
    block: "Tecnología y datos",
    text: "¿Tus equipos trabajan con la misma información o cada uno tiene su versión?",
    kind: "single",
    options: options(["Todos con la misma", "Mayormente igual", "Cada uno maneja lo suyo", "Hay versiones contradictorias"]),
  },
  {
    id: "lider_horas",
    block: "Tiempo del dueño / liderazgo",
    text: "¿Cuántas horas por semana dedicás a tareas operativas o administrativas?",
    kind: "single",
    options: options(["Menos de 5hs", "5-15hs", "15-30hs", "Más de 30hs"]),
  },
  {
    id: "lider_descanso",
    block: "Tiempo del dueño / liderazgo",
    text: "Si te tomaras 15 días de descanso sin celular, ¿tu negocio seguiría operando?",
    kind: "single",
    options: options(["Sin problemas", "Con pequeños inconvenientes", "Habría problemas serios", "Se caería todo"]),
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
  return [...baseQuestions, ...(rubro ? industryQuestions[rubro] ?? [] : [])];
}
