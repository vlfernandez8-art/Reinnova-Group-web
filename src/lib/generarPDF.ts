import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { currency } from "@/lib/calcularImpacto";
import { getQuestionsForRubro, rubros } from "@/lib/preguntas";
import { maturityLevels } from "@/lib/scoring";
import { DiagnosticResult, DiagnosticoState } from "@/lib/types";

export function buildDiagnosticoPdf(state: DiagnosticoState, result: DiagnosticResult) {
  const doc = new jsPDF();
  const rubroLabel = rubros.find((rubro) => rubro.id === state.profile.rubro)?.label ?? state.profile.rubroOtro ?? "No informado";
  const accent: [number, number, number] = [0, 150, 190];
  const dark: [number, number, number] = [20, 29, 44];

  cover(doc, state, result, rubroLabel, accent, dark);

  doc.addPage();
  pageHeader(doc, "Resumen ejecutivo", accent, dark);
  doc.setFontSize(10);
  doc.setTextColor(45);
  doc.text(`Empresa: ${state.company.empresa}`, 14, 34);
  doc.text(`Contacto: ${state.company.nombre} - ${state.company.email}`, 14, 42);
  drawDetectedProfileCard(doc, result, accent, 14, 52, 182);
  drawBaseDataBox(doc, state, rubroLabel, accent, 14, 88, 182);
  addWrappedText(
    doc,
    "Este diagnostico es una estimacion orientativa construida a partir de las respuestas brindadas. Su objetivo es identificar oportunidades de mejora en la gestion, los procesos, la tecnologia y la ciberseguridad de la empresa. Los valores economicos no representan una auditoria contable, sino una aproximacion al costo oculto que pueden generar tareas manuales, reprocesos, demoras en la informacion y riesgos operativos.",
    14,
    128,
    182,
    9,
    5,
  );
  autoTable(doc, {
    startY: 154,
    head: [["Concepto evaluado", "Estimacion mensual orientativa"]],
    body: [
      ["Horas improductivas", currency(result.impact.costo_horas)],
      ["Errores y reprocesos", currency(result.impact.costo_errores)],
      ["Decisiones sin informacion", currency(result.impact.riesgo_decision)],
      ["Riesgo de Cyberseguridad", currency(result.impact.riesgo_cyber)],
      ["Oportunidad mensual estimada", currency(result.impact.total_mensual)],
      ["Oportunidad anual estimada", currency(result.impact.total_anual)],
    ],
    theme: "grid",
    headStyles: { fillColor: dark, textColor: 255 },
    alternateRowStyles: { fillColor: [245, 248, 250] },
  });

  autoTable(doc, {
    startY: 214,
    head: [["Punto de dolor", "Sintoma detectado", "Perdida mensual asignada"]],
    body: result.dolores.map((dolor) => [dolor.block, dolor.symptom, currency(dolor.monthlyCost)]),
    theme: "grid",
    headStyles: { fillColor: accent, textColor: 255 },
    styles: { fontSize: 8 },
  });

  doc.addPage();
  pageHeader(doc, "Como interpretar los resultados", accent, dark);
  drawInterpretationPage(doc, state, result, rubroLabel, accent);

  doc.addPage();
  pageHeader(doc, "Riesgo de cyberseguridad", accent, dark);
  addWrappedText(
    doc,
    "La ciberseguridad no se mide solamente por la existencia de herramientas, sino por la capacidad de prevenir, responder y recuperarse ante un incidente. Por eso, este bloque estima cuanto podria impactar una interrupcion o perdida de informacion en la operacion de la empresa.",
    14,
    36,
    182,
    9,
    5,
  );
  autoTable(doc, {
    startY: 62,
    head: [["Indicador", "Resultado"]],
    body: [
      ["Indice de madurez en ciberseguridad", `${result.cyberRisk.maturityScore}%`],
      ["Riesgo de fuga de datos", result.cyberRisk.dataLeakRiskLevel],
      ["Tiempo estimado de recuperacion", `${result.cyberRisk.recoveryDays} dias`],
      ["Sueldos por dias improductivos", currency(result.cyberRisk.recoveryCost.salariosDiasImproductivos)],
      ["Perdida de ventas estimada", currency(result.cyberRisk.recoveryCost.perdidaVentas)],
      ["Costo por resolucion", currency(result.cyberRisk.recoveryCost.resolucion)],
      ["Costo total de recuperacion", currency(result.cyberRisk.recoveryCost.total)],
      ["Impacto mensual ponderado", currency(result.cyberRisk.monthlyImpact)],
      ["Impacto anual ponderado", currency(result.cyberRisk.annualImpact)],
    ],
    theme: "grid",
    headStyles: { fillColor: dark, textColor: 255 },
    styles: { fontSize: 9, cellPadding: 4 },
  });
  addWrappedText(
    doc,
    "El costo total de recuperacion representa una estimacion del impacto si ocurriera un incidente relevante. El impacto mensual ponderado distribuye ese riesgo considerando la probabilidad estimada de ocurrencia segun el nivel de madurez detectado.",
    14,
    156,
    182,
    9,
    5,
  );

  doc.addPage();
  pageHeader(doc, "Niveles de madurez", accent, dark);
  autoTable(doc, {
    startY: 34,
    head: [["Nivel", "Categoria", "Lectura operativa"]],
    body: maturityLevels.map((level) => [`Nivel ${level.id}`, level.title, pdfMaturityDescriptions[level.id]]),
    theme: "grid",
    headStyles: { fillColor: dark, textColor: 255 },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 0: { cellWidth: 24 }, 1: { cellWidth: 46 }, 2: { cellWidth: 110 } },
  });

  const questions = getQuestionsForRubro(state.profile.rubro);
  doc.addPage();
  pageHeader(doc, "Detalle del diagnostico", accent, dark);
  addWrappedText(
    doc,
    "Las respuestas seleccionadas permiten identificar patrones de gestion. No se evaluan respuestas correctas o incorrectas, sino senales que ayudan a detectar oportunidades de mejora.",
    14,
    36,
    182,
    9,
    5,
  );
  autoTable(doc, {
    startY: 56,
    head: [["Bloque", "Pregunta", "Respuesta"]],
    body: questions.map((question) => {
      const answerScore = state.answers[question.id];
      const answer = question.options.find((option) => String(option.score) === answerScore)?.label ?? "Sin respuesta";
      return [question.block, question.text, answer];
    }),
    styles: { fontSize: 7, cellWidth: "wrap" },
    columnStyles: { 0: { cellWidth: 36 }, 1: { cellWidth: 92 }, 2: { cellWidth: 50 } },
    headStyles: { fillColor: dark, textColor: 255 },
  });

  doc.addPage();
  pageHeader(doc, "Plan de accion sugerido", accent, dark);
  addWrappedText(
    doc,
    "Las siguientes acciones se proponen en funcion de los principales puntos de dolor detectados. El objetivo es priorizar mejoras concretas que permitan ordenar la operacion, reducir reprocesos, mejorar la informacion disponible y fortalecer la continuidad del negocio.",
    14,
    36,
    182,
    9,
    5,
  );
  autoTable(doc, {
    startY: 62,
    head: [["Unidad", "Que hace", "Acciones principales"]],
    body: result.solutionColumns.map((column) => [column.title, column.subtitle, column.items.join("\n")]),
    theme: "grid",
    headStyles: { fillColor: accent, textColor: 255 },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 0: { cellWidth: 38 }, 1: { cellWidth: 48 }, 2: { cellWidth: 92 } },
  });
  doc.setFontSize(10);
  doc.setTextColor(55);
  addWrappedText(
    doc,
    "Importante: Este informe es una estimacion automatica generada a partir de las respuestas del diagnostico. Los valores economicos son orientativos y representan oportunidades de mejora, no resultados de una auditoria financiera, contable, operativa o tecnica. Para validar los resultados y definir un plan de accion, se recomienda una reunion de analisis con Reinnova Group.",
    14,
    204,
    182,
    9,
    5,
  );
  doc.text("REINNOVA GROUP | REINNOVA CONSULTING | SYSEMC", 14, 242);
  doc.text("WhatsApp: 2995201981", 14, 252);
  doc.text("Email: administracion@reinnova.com.ar", 14, 262);
  doc.text("Web: www.reinnovagroup.com.ar", 14, 272);

  footer(doc);
  return doc;
}

export function getDiagnosticoPdfBase64(state: DiagnosticoState, result: DiagnosticResult) {
  return Buffer.from(buildDiagnosticoPdf(state, result).output("arraybuffer")).toString("base64");
}

function cover(
  doc: jsPDF,
  state: DiagnosticoState,
  result: DiagnosticResult,
  rubroLabel: string,
  accent: [number, number, number],
  dark: [number, number, number],
) {
  doc.setFillColor(...dark);
  doc.rect(0, 0, 210, 297, "F");
  doc.setFillColor(...accent);
  doc.rect(0, 0, 210, 18, "F");
  doc.setTextColor(255);
  doc.setFontSize(12);
  doc.text("REINNOVA GROUP", 14, 34);
  doc.setFontSize(28);
  doc.text("Diagnostico Empresarial", 14, 62);
  doc.text("Reinnova", 14, 76);
  doc.setFontSize(15);
  doc.text("Matriz de madurez, impacto economico estimado y ciberseguridad", 14, 94);
  doc.setDrawColor(...accent);
  doc.setLineWidth(1);
  doc.line(14, 108, 196, 108);
  doc.setFontSize(13);
  doc.text(`Diagnostico empresarial - ${state.company.empresa || "Empresa sin nombre"}`, 14, 128);
  drawDetectedProfileCard(doc, result, accent, 14, 138, 182, true);
  drawBaseDataBox(doc, state, rubroLabel, accent, 14, 174, 182, true);
  doc.text(`Indice de madurez empresarial: ${result.maturityScore}%`, 14, 224);
  doc.text(`Indice de madurez en ciberseguridad: ${result.cyberRisk.maturityScore}%`, 14, 236);
  doc.text(`Oportunidad mensual de mejora estimada: ${currency(result.impact.total_mensual)}`, 14, 248);
  doc.text(`Riesgo mensual estimado por ciberseguridad: ${currency(result.impact.riesgo_cyber)}`, 14, 260);
  doc.setFontSize(10);
  doc.text(`Completado por: ${state.company.nombre} (${state.company.cargo || "No informado"})`, 14, 276);
}

function drawDetectedProfileCard(
  doc: jsPDF,
  result: DiagnosticResult,
  accent: [number, number, number],
  x: number,
  y: number,
  width: number,
  darkMode = false,
) {
  doc.setDrawColor(...accent);
  doc.setFillColor(darkMode ? 28 : 238, darkMode ? 44 : 248, darkMode ? 62 : 252);
  doc.roundedRect(x, y, width, 26, 2, 2, "FD");
  doc.setTextColor(...(darkMode ? ([255, 255, 255] as [number, number, number]) : ([20, 29, 44] as [number, number, number])));
  doc.setFontSize(9);
  doc.text("Tipo de empresa detectado", x + 6, y + 8);
  doc.setFontSize(15);
  doc.text(`${result.perfil} - ${result.perfilTitulo}`, x + 6, y + 18);
}

function drawBaseDataBox(
  doc: jsPDF,
  state: DiagnosticoState,
  rubroLabel: string,
  accent: [number, number, number],
  x: number,
  y: number,
  width: number,
  darkMode = false,
) {
  const rows = [
    ["Rubro seleccionado", rubroLabel],
    ["Rango de empleados", valueOrFallback(state.company.empleados)],
    ["Rango de ventas mensuales", valueOrFallback(state.company.facturacion)],
    ["Rol de quien responde", valueOrFallback(state.company.cargo)],
    ["Fecha del diagnostico", new Date().toLocaleDateString("es-AR")],
  ];

  doc.setDrawColor(...accent);
  doc.setFillColor(darkMode ? 20 : 250, darkMode ? 32 : 252, darkMode ? 48 : 255);
  doc.roundedRect(x, y, width, 38, 2, 2, "FD");
  doc.setTextColor(...(darkMode ? ([255, 255, 255] as [number, number, number]) : ([20, 29, 44] as [number, number, number])));
  doc.setFontSize(10);
  doc.text("Datos base considerados", x + 6, y + 8);
  doc.setFontSize(8);
  rows.forEach((row, index) => {
    const rowY = y + 16 + index * 4.4;
    doc.text(`${row[0]}:`, x + 6, rowY);
    doc.text(row[1], x + 70, rowY);
  });
}

function drawInterpretationPage(
  doc: jsPDF,
  state: DiagnosticoState,
  result: DiagnosticResult,
  rubroLabel: string,
  accent: [number, number, number],
) {
  let y = 36;
  y = addInterpretationBlock(
    doc,
    "Tipo de empresa detectado",
    [
      `Resultado actual: ${result.perfil} - ${result.perfilTitulo}.`,
      "El tipo de empresa detectado surge de combinar las respuestas del diagnostico con informacion base declarada por el usuario, como el rubro, el rango de empleados y el rango de ventas mensuales.",
      "Esto permite contextualizar el resultado: una misma respuesta puede tener distinto impacto si se trata de una empresa pequena, una empresa en crecimiento o una organizacion con mayor volumen operativo.",
      "El objetivo no es clasificar a la empresa de forma rigida, sino identificar en que etapa de orden, control y gestion se encuentra actualmente.",
    ],
    y,
    accent,
  );
  y = addInterpretationBlock(
    doc,
    "Datos base considerados",
    [
      `Rubro seleccionado: ${rubroLabel}`,
      `Rango de empleados: ${valueOrFallback(state.company.empleados)}`,
      `Rango de ventas mensuales: ${valueOrFallback(state.company.facturacion)}`,
      `Rol de quien responde: ${valueOrFallback(state.company.cargo)}`,
      `Fecha del diagnostico: ${new Date().toLocaleDateString("es-AR")}`,
      "Para interpretar los resultados se consideraron el rubro, el tamano aproximado de la empresa segun cantidad de empleados y el rango de ventas mensuales informado. Estos datos permiten ajustar la lectura del impacto economico y la madurez detectada al contexto real del negocio.",
    ],
    y,
    accent,
  );
  y = addInterpretationBlock(
    doc,
    "Indice de madurez empresarial",
    [
      "El indice de madurez empresarial mide que tan preparada esta la empresa para operar de forma ordenada, eficiente y escalable. No mide el tamano de la empresa, sino la calidad de su gestion interna.",
      "Para calcularlo se analizan respuestas relacionadas con control financiero, procesos, tecnologia, informacion disponible, dependencia de personas clave, tiempo operativo del dueno y particularidades del rubro.",
      "A mayor madurez, menor dependencia de tareas manuales, menor probabilidad de errores y mayor capacidad para tomar decisiones con informacion confiable.",
    ],
    y,
    accent,
  );
  y = addInterpretationBlock(
    doc,
    "Impacto economico estimado",
    [
      "El impacto economico estimado muestra una oportunidad de mejora. No significa que ese dinero se pierda de forma exacta todos los meses, sino que representa el costo oculto que pueden generar ineficiencias como horas improductivas, errores, reprocesos, demoras en la informacion o sistemas que no estan integrados.",
      "Esta estimacion permite visualizar que areas podrian estar afectando la rentabilidad y donde conviene priorizar acciones de mejora.",
    ],
    y,
    accent,
  );
  addInterpretationBlock(
    doc,
    "Ciberseguridad",
    [
      "El indice de madurez en ciberseguridad evalua buenas practicas basicas como copias de seguridad, control de accesos, doble factor de autenticacion, monitoreo, recuperacion ante incidentes y cumplimiento minimo esperado para el rubro.",
      "El riesgo mensual estimado surge de ponderar el posible costo de recuperacion ante un incidente con la probabilidad estimada de ocurrencia segun las respuestas brindadas.",
    ],
    y,
    accent,
  );
}

function addInterpretationBlock(doc: jsPDF, title: string, paragraphs: string[], y: number, accent: [number, number, number]) {
  doc.setTextColor(...accent);
  doc.setFontSize(13);
  doc.text(title, 14, y);
  y += 6;
  doc.setTextColor(45);
  paragraphs.forEach((paragraph) => {
    y = addWrappedText(doc, paragraph, 14, y, 182, 8.2, 4.2) + 1.6;
  });
  return y + 2.2;
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, fontSize = 9, lineHeight = 5) {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function valueOrFallback(value?: string) {
  return value?.trim() || "No informado";
}

const pdfMaturityDescriptions = {
  A: "La empresa funciona principalmente por esfuerzo individual, con procesos poco documentados, informacion dispersa y controles tardios. La prioridad es ordenar la gestion, reducir urgencias y recuperar control.",
  B: "La empresa ya cuenta con cierta estructura, pero todavia existen tareas manuales, reprocesos, fricciones entre areas o sistemas que no conversan entre si. La prioridad es estandarizar, medir y reducir perdidas ocultas.",
  C: "La empresa posee una base de gestion ordenada. El siguiente paso es automatizar, integrar informacion, anticipar desvios y utilizar datos para mejorar rentabilidad y crecimiento.",
} as const;

function pageHeader(doc: jsPDF, title: string, accent: [number, number, number], dark: [number, number, number]) {
  doc.setFillColor(...dark);
  doc.rect(0, 0, 210, 18, "F");
  doc.setFillColor(...accent);
  doc.rect(0, 18, 210, 2, "F");
  doc.setTextColor(255);
  doc.setFontSize(11);
  doc.text("REINNOVA GROUP", 14, 12);
  doc.setTextColor(20);
  doc.setFontSize(20);
  doc.text(title, 14, 28);
}

function footer(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text("Documento confidencial generado por reinnovagroup.com.ar", 14, 287);
    doc.text(`${i}/${pages}`, 190, 287);
  }
}
