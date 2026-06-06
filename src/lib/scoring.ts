import { calcularImpacto } from "./calcularImpacto";
import { getQuestionsForRubro } from "./preguntas";
import { Answers, DiagnosticResult, DiagnosticoState, MaturityChoice, PainPoint } from "./types";

const profileTitles: Record<MaturityChoice, string> = {
  A: "Base Operativa Crítica",
  B: "Empresa en Desarrollo",
  C: "Empresa Madura",
};

const symptoms: Record<string, string> = {
  "Control financiero": "La información económica llega tarde o incompleta para decidir.",
  "Operaciones y procesos": "Hay dependencia de personas clave y tareas que no están estandarizadas.",
  "Tecnología y datos": "Los datos viven repartidos entre sistemas, planillas o conversaciones.",
  "Tiempo del dueño / liderazgo": "El equipo directivo sigue atrapado en tareas operativas.",
};

export function calculateScore(state: DiagnosticoState): DiagnosticResult {
  const questions = getQuestionsForRubro(state.profile.rubro);
  const byBlock = new Map<string, number>();

  const score = questions.reduce((total, question) => {
    const selected = findOptionScore(state.answers, question.id);
    byBlock.set(question.block, (byBlock.get(question.block) ?? 0) + selected);
    return total + selected;
  }, 0);

  const perfil = getProfile(score);
  const impact = calcularImpacto(state.company.facturacion, state.economic);
  const topBlocks = Array.from(byBlock.entries())
    .map(([block, blockScore]) => ({
      block,
      score: blockScore,
      symptom: symptoms[block] ?? "Se detectan fricciones que consumen tiempo y margen.",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const dolores = distributePainCosts(topBlocks, impact.total_mensual) satisfies PainPoint[];

  return {
    score,
    maturityScore: Math.max(0, Math.min(100, 100 - score * 2)),
    perfil,
    perfilTitulo: profileTitles[perfil],
    urgencia: getUrgency(score),
    impact,
    dolores,
  };
}

function findOptionScore(answers: Answers, questionId: string) {
  const value = answers[questionId];
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getProfile(score: number): MaturityChoice {
  if (score <= 15) return "C";
  if (score <= 30) return "B";
  return "A";
}

function getUrgency(score: number): DiagnosticResult["urgencia"] {
  if (score <= 15) return { color: "green", label: "Tu empresa está bien posicionada" };
  if (score <= 30) return { color: "orange", label: "Hay oportunidades de mejora importantes" };
  return { color: "red", label: "Situación crítica que requiere intervención" };
}

function distributePainCosts(blocks: Omit<PainPoint, "monthlyCost">[], totalMonthly: number) {
  if (!blocks.length) return [];
  const scoreTotal = blocks.reduce((sum, block) => sum + block.score, 0);
  let assigned = 0;

  return blocks.map((block, index) => {
    const monthlyCost =
      index === blocks.length - 1
        ? Math.max(0, totalMonthly - assigned)
        : Math.round(totalMonthly * (scoreTotal ? block.score / scoreTotal : 1 / blocks.length));
    assigned += monthlyCost;
    return { ...block, monthlyCost };
  });
}

export const maturityLevels = [
  {
    id: "A",
    title: "Base Operativa Crítica",
    color: "red",
    description: "La empresa depende de personas clave, datos dispersos y controles tardíos. El foco es ordenar y recuperar control.",
  },
  {
    id: "B",
    title: "Empresa en Desarrollo",
    color: "orange",
    description: "Ya existe estructura, pero hay fricción entre áreas, reprocesos o sistemas que no conversan entre sí.",
  },
  {
    id: "C",
    title: "Empresa Madura",
    color: "green",
    description: "La base está ordenada. El siguiente salto es automatización, inteligencia de datos e integración de procesos.",
  },
] as const;

export const solutionColumns = [
  {
    title: "Reinnova Consulting",
    subtitle: "Orden, control y rentabilidad operativa",
    items: [
      "Releva procesos, roles, circuitos administrativos y controles críticos.",
      "Diseña tableros de gestión, rutinas de control y protocolos de seguimiento.",
      "Acompaña la implementación para reducir fugas, errores y dependencia operativa.",
    ],
  },
  {
    title: "Reinnova Group",
    subtitle: "Automatización, software e inteligencia aplicada",
    items: [
      "Integra sistemas, automatiza tareas repetitivas y conecta fuentes de datos.",
      "Construye dashboards, flujos digitales, bots e integraciones API.",
      "Incorpora IA para acelerar administración, reportes y decisiones.",
    ],
  },
] as const;
