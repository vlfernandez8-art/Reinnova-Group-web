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
  doc.text(`Rubro: ${rubroLabel}`, 14, 50);
  doc.text(`Nivel detectado: ${result.perfil} - ${result.perfilTitulo}`, 14, 58);
  doc.text(`Madurez empresarial: ${result.maturityScore}%`, 14, 66);
  doc.text(`Madurez cyber: ${result.cyberRisk.maturityScore}%`, 14, 74);
  autoTable(doc, {
    startY: 84,
    head: [["Concepto", "Estimacion mensual"]],
    body: [
      ["Horas improductivas", currency(result.impact.costo_horas)],
      ["Errores y reprocesos", currency(result.impact.costo_errores)],
      ["Decisiones sin informacion", currency(result.impact.riesgo_decision)],
      ["Riesgo de Cyberseguridad", currency(result.impact.riesgo_cyber)],
      ["Total mensual", currency(result.impact.total_mensual)],
      ["Total anual", currency(result.impact.total_anual)],
    ],
    theme: "grid",
    headStyles: { fillColor: dark, textColor: 255 },
    alternateRowStyles: { fillColor: [245, 248, 250] },
  });

  autoTable(doc, {
    startY: 150,
    head: [["Punto de dolor", "Sintoma detectado", "Perdida mensual asignada"]],
    body: result.dolores.map((dolor) => [dolor.block, dolor.symptom, currency(dolor.monthlyCost)]),
    theme: "grid",
    headStyles: { fillColor: accent, textColor: 255 },
    styles: { fontSize: 8 },
  });

  doc.addPage();
  pageHeader(doc, "Riesgo de cyberseguridad", accent, dark);
  autoTable(doc, {
    startY: 36,
    head: [["Indicador", "Resultado"]],
    body: [
      ["Madurez cyber", `${result.cyberRisk.maturityScore}%`],
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

  doc.addPage();
  pageHeader(doc, "Niveles de madurez", accent, dark);
  autoTable(doc, {
    startY: 34,
    head: [["Nivel", "Categoria", "Lectura operativa"]],
    body: maturityLevels.map((level) => [`Nivel ${level.id}`, level.title, level.description]),
    theme: "grid",
    headStyles: { fillColor: dark, textColor: 255 },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 0: { cellWidth: 24 }, 1: { cellWidth: 46 }, 2: { cellWidth: 110 } },
  });

  const questions = getQuestionsForRubro(state.profile.rubro);
  doc.addPage();
  pageHeader(doc, "Detalle del diagnostico", accent, dark);
  autoTable(doc, {
    startY: 34,
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
  pageHeader(doc, "Solucion propuesta", accent, dark);
  autoTable(doc, {
    startY: 36,
    head: [["Unidad", "Que hace", "Acciones principales"]],
    body: result.solutionColumns.map((column) => [column.title, column.subtitle, column.items.join("\n")]),
    theme: "grid",
    headStyles: { fillColor: accent, textColor: 255 },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 0: { cellWidth: 38 }, 1: { cellWidth: 48 }, 2: { cellWidth: 92 } },
  });
  doc.setFontSize(10);
  doc.setTextColor(55);
  doc.text("REINNOVA GROUP | REINNOVA CONSULTING | SYSEMC", 14, 208);
  doc.text("WhatsApp: 2995201981", 14, 218);
  doc.text("Email: administracion@reinnova.com.ar", 14, 228);
  doc.text("Web: www.reinnovagroup.com.ar", 14, 238);
  doc.text("Neuquen, Argentina", 14, 248);

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
  doc.text("Propuesta de", 14, 62);
  doc.text("Transformacion Administrativa", 14, 76);
  doc.setFontSize(15);
  doc.text("Control de Gestion Operativa, Rentabilidad y Cyberseguridad", 14, 94);
  doc.setDrawColor(...accent);
  doc.setLineWidth(1);
  doc.line(14, 108, 196, 108);
  doc.setFontSize(13);
  doc.text(`Diagnostico empresarial - ${state.company.empresa || "Empresa sin nombre"}`, 14, 128);
  doc.text(`Rubro: ${rubroLabel}`, 14, 140);
  doc.text(`Nivel detectado: ${result.perfil} - ${result.perfilTitulo}`, 14, 152);
  doc.text(`Madurez: ${result.maturityScore}%`, 14, 164);
  doc.text(`Madurez cyber: ${result.cyberRisk.maturityScore}%`, 14, 176);
  doc.text(`Impacto mensual estimado: ${currency(result.impact.total_mensual)}`, 14, 188);
  doc.text(`Riesgo cyber mensual: ${currency(result.impact.riesgo_cyber)}`, 14, 200);
  doc.setFontSize(10);
  doc.text(`Completado por: ${state.company.nombre} (${state.company.cargo})`, 14, 222);
  doc.text(`Email: ${state.company.email}`, 14, 232);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-AR")}`, 14, 242);
}

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
