import { calcularImpacto, revenueMap } from "./calcularImpacto";
import { getQuestionsForRubro } from "./preguntas";
import { Answers, CyberRiskResult, DiagnosticResult, DiagnosticoState, MaturityChoice, PainPoint, SolutionColumn } from "./types";

const profileTitles: Record<MaturityChoice, string> = {
  A: "Base Operativa Critica",
  B: "Empresa en Desarrollo",
  C: "Empresa Madura",
};

const symptoms: Record<string, string> = {
  "Control financiero": "La informacion economica llega tarde o incompleta para decidir.",
  "Operaciones y procesos": "Hay dependencia de personas clave y tareas que no estan estandarizadas.",
  "Tecnologia y datos": "Los datos viven repartidos entre sistemas, planillas o conversaciones.",
  "Tiempo del dueno / liderazgo": "El equipo directivo sigue atrapado en tareas operativas.",
  Cyberseguridad: "La continuidad operativa y la informacion critica quedan expuestas ante incidentes, fuga de datos o perdida de acceso.",
};

export function calculateScore(state: DiagnosticoState): DiagnosticResult {
  const questions = getQuestionsForRubro(state.profile.rubro);
  const byBlock = new Map<string, number>();
  const maxScore = questions.reduce((sum, question) => sum + Math.max(...question.options.map((option) => option.score)), 0);

  const score = questions.reduce((total, question) => {
    const selected = findOptionScore(state.answers, question.id);
    byBlock.set(question.block, (byBlock.get(question.block) ?? 0) + selected);
    return total + selected;
  }, 0);

  const maturityScore = scoreToMaturity(score, maxScore);
  const cyberQuestions = questions.filter((question) => question.block === "Cyberseguridad");
  const cyberRisk = calculateCyberRisk(state, cyberQuestions);
  const perfil = getProfile(maturityScore);
  const impact = calcularImpacto(state.company.facturacion, state.economic, cyberRisk.monthlyImpact);
  const topBlocks = Array.from(byBlock.entries())
    .map(([block, blockScore]) => ({
      block,
      score: blockScore,
      symptom: symptoms[block] ?? "Se detectan fricciones que consumen tiempo y margen.",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const dolores = distributePainCosts(topBlocks, impact.total_mensual) satisfies PainPoint[];
  const solutionColumns = buildSolutionColumns(topBlocks, cyberRisk);

  return {
    score,
    maturityScore,
    cyberRisk,
    perfil,
    perfilTitulo: profileTitles[perfil],
    urgencia: getUrgency(maturityScore),
    impact,
    dolores,
    solutionColumns,
  };
}

function findOptionScore(answers: Answers, questionId: string) {
  const value = answers[questionId];
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function scoreToMaturity(score: number, maxScore: number) {
  if (!maxScore) return 100;
  return Math.max(0, Math.min(100, Math.round(100 - (score / maxScore) * 100)));
}

function getProfile(maturityScore: number): MaturityChoice {
  if (maturityScore >= 75) return "C";
  if (maturityScore >= 45) return "B";
  return "A";
}

function getUrgency(maturityScore: number): DiagnosticResult["urgencia"] {
  if (maturityScore >= 75) return { color: "green", label: "Tu empresa esta bien posicionada" };
  if (maturityScore >= 45) return { color: "orange", label: "Hay oportunidades de mejora importantes" };
  return { color: "red", label: "Situacion critica que requiere intervencion" };
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

function calculateCyberRisk(state: DiagnosticoState, cyberQuestions: ReturnType<typeof getQuestionsForRubro>): CyberRiskResult {
  const cyberScore = cyberQuestions.reduce((sum, question) => sum + findOptionScore(state.answers, question.id), 0);
  const cyberMax = cyberQuestions.reduce((sum, question) => sum + Math.max(...question.options.map((option) => option.score)), 0);
  const maturityScore = scoreToMaturity(cyberScore, cyberMax);
  const revenue = state.company.facturacion ? revenueMap[state.company.facturacion] : 1250000;
  const salary = state.economic.salarioPromedio || 350000;
  const normativaScore = findOptionScore(state.answers, "cyber_normativa");
  const complianceMultiplier = getComplianceMultiplier(normativaScore);
  const recommendations = buildCyberRecommendations(maturityScore);
  const sysemcPlan = getSysemcPlan(Math.round(maturityToMonthly(100 - maturityScore, complianceMultiplier)));

  const dataLeakRiskLevel = getDataLeakRiskLevel(maturityScore);
  const recoveryDays = getRecoveryDays(maturityScore);
  const salariosDiasImproductivos = Math.round((salary / 22) * recoveryDays);
  const perdidaVentas = Math.round((revenue / 22) * recoveryDays * lostRevenueByCyberMaturity(maturityScore));
  const resolucion = Math.round(getResolutionCost(dataLeakRiskLevel, revenue) * complianceMultiplier);
  const total = salariosDiasImproductivos + perdidaVentas + resolucion;
  const monthlyImpact = Math.round(total * monthlyProbabilityByCyberMaturity(maturityScore) * complianceMultiplier);
  const annualImpact = monthlyImpact * 12;

  return {
    maturityScore,
    dataLeakRiskLevel,
    recoveryDays,
    monthlyImpact,
    annualImpact,
    recoveryCost: {
      salariosDiasImproductivos,
      perdidaVentas,
      resolucion,
      total,
    },
    recommendations,
    sysemcPlan,
  };
}

function maturityToMonthly(maturityScore: number, complianceMultiplier: number) {
  const base = Math.round((100 - maturityScore) * 800);
  return base * complianceMultiplier;
}

function getComplianceMultiplier(score: number) {
  if (score >= 4) return 1;
  if (score >= 3) return 0.9;
  if (score >= 1) return 1.05;
  if (score === 0) return 1.18;
  return 1.1;
}

function getSysemcPlan(monthlyImpact: number) {
  if (monthlyImpact >= 70000) {
    return {
      name: "SYSEMC Crítico",
      description: "Arquitectura de continuidad avanzada para incidentes, ransomware y recuperacion de negocio.",
      actions: [
        "Implementar doble factor en accesos, segmentacion de red y MFA por rol.",
        "Crear respaldo inmutable, fuera de sitio y pruebas de restauracion trimestrales.",
        "Operar plan de continuidad con orden de prioridades por sistema y simulacros mensuales.",
      ],
    };
  }

  if (monthlyImpact >= 35000) {
    return {
      name: "SYSEMC Operar Seguro",
      description: "Fortalecimiento integral de backup y continuidad para reducir tiempo de inactividad.",
      actions: [
        "Formalizar plan de continuidad, backups automaticos y recuperacion priorizada.",
        "Unificar accesos con matriz de permisos y trazabilidad de cambios.",
        "Implementar monitoreo de incidentes, alertas y revisiones de recuperacion.",
      ],
    };
  }

  if (monthlyImpact >= 15000) {
    return {
      name: "SYSEMC Continuidad",
      description: "Base operativa fortalecida para evitar dias sin sistema y proteger informacion critica.",
      actions: [
        "Mejorar controles de acceso y respaldos automaticos verificados.",
        "Definir responsables y tiempos de recuperacion por area.",
        "Reducir dependencia de equipos fisicos con alternativas de contingencia.",
      ],
    };
  }

  return {
    name: "SYSEMC Esencial",
    description: "Capa inicial de seguridad y respaldo para ordenar riesgos sin cambiar toda la infraestructura.",
    actions: [
      "Levantar backup automatico con prueba mensual de restauracion.",
      "Habilitar MFA y credenciales individuales para accesos criticos.",
      "Documentar flujo de continuidad minimo y responsables de respuesta.",
    ],
  };
}

function getDataLeakRiskLevel(maturityScore: number): CyberRiskResult["dataLeakRiskLevel"] {
  if (maturityScore >= 80) return "Bajo";
  if (maturityScore >= 60) return "Medio";
  if (maturityScore >= 35) return "Alto";
  return "Critico";
}

function getRecoveryDays(maturityScore: number) {
  if (maturityScore >= 80) return 1;
  if (maturityScore >= 60) return 3;
  if (maturityScore >= 35) return 7;
  return 14;
}

function lostRevenueByCyberMaturity(maturityScore: number) {
  if (maturityScore >= 80) return 0.15;
  if (maturityScore >= 60) return 0.3;
  if (maturityScore >= 35) return 0.55;
  return 0.8;
}

function monthlyProbabilityByCyberMaturity(maturityScore: number) {
  if (maturityScore >= 80) return 0.015;
  if (maturityScore >= 60) return 0.035;
  if (maturityScore >= 35) return 0.075;
  return 0.12;
}

function getResolutionCost(level: CyberRiskResult["dataLeakRiskLevel"], revenue: number) {
  const base = {
    Bajo: 120000,
    Medio: 280000,
    Alto: 650000,
    Critico: 1200000,
  }[level];

  return Math.round(base + revenue * (level === "Critico" ? 0.025 : level === "Alto" ? 0.015 : level === "Medio" ? 0.008 : 0.003));
}

function buildCyberRecommendations(maturityScore: number) {
  if (maturityScore >= 80) {
    return [
      "Mantener monitoreo preventivo, revision periodica de accesos y pruebas de restauracion.",
      "Documentar evidencias de backup y continuidad para auditorias o requerimientos de clientes.",
    ];
  }

  if (maturityScore >= 60) {
    return [
      "Formalizar pruebas de restauracion y doble factor en accesos criticos.",
      "Implementar monitoreo de infraestructura y alertas tempranas sobre sistemas sensibles.",
    ];
  }

  return [
    "Implementar cloud backup gestionado con pruebas de recuperacion y retencion segura.",
    "Ordenar accesos, doble factor, monitoreo y plan de continuidad ante ransomware o fuga de datos.",
    "Evaluar cloud desktop para reducir dependencia de equipos locales y acelerar recuperacion.",
  ];
}

function buildSolutionColumns(topBlocks: { block: string; score: number }[], cyberRisk: CyberRiskResult): SolutionColumn[] {
  const weakBlocks = new Set(topBlocks.map((block) => block.block));

  return [
    {
      title: "Reinnova Consulting",
      subtitle: "Orden, control y rentabilidad operativa",
      items: [
        weakBlocks.has("Control financiero")
          ? "Priorizar tablero financiero, flujo de fondos y rutina de control para bajar decisiones tardias."
          : "Mantener control financiero con indicadores de rentabilidad, caja y seguimiento mensual.",
        weakBlocks.has("Operaciones y procesos") || weakBlocks.has("Tiempo del dueno / liderazgo")
          ? "Documentar procesos criticos, roles y circuitos administrativos para reducir dependencia de personas clave."
          : "Ajustar protocolos y responsables para sostener la operacion con menor friccion.",
        cyberRisk.maturityScore < 70
          ? "Incorporar riesgo cyber dentro del mapa de procesos criticos y continuidad operativa."
          : "Conservar evidencias de continuidad y controles como parte del sistema de gestion.",
      ],
    },
    {
      title: "Reinnova Group",
      subtitle: "Automatizacion, software e inteligencia aplicada",
      items: [
        weakBlocks.has("Tecnologia y datos")
          ? "Integrar fuentes de datos, planillas y sistemas para reducir versiones contradictorias."
          : "Automatizar reportes y tareas repetitivas sobre la base operativa ya ordenada.",
        weakBlocks.has("Control financiero")
          ? "Construir dashboards con alertas de caja, rentabilidad, deuda y ventas perdidas."
          : "Conectar indicadores operativos y comerciales para acelerar decisiones.",
        cyberRisk.maturityScore < 60
          ? "Alinear integraciones y automatizaciones con controles de acceso, trazabilidad y resguardo de datos."
          : "Preparar flujos digitales escalables con trazabilidad y permisos por rol.",
      ],
    },
    {
      title: "SYSEMC",
      subtitle: cyberRisk.sysemcPlan.name,
      items: [cyberRisk.sysemcPlan.description, ...cyberRisk.recommendations, ...cyberRisk.sysemcPlan.actions],
    },
  ];
}

export const maturityLevels = [
  {
    id: "A",
    title: "Base Operativa Critica",
    color: "red",
    description: "La empresa depende de personas clave, datos dispersos y controles tardios. El foco es ordenar y recuperar control.",
  },
  {
    id: "B",
    title: "Empresa en Desarrollo",
    color: "orange",
    description: "Ya existe estructura, pero hay friccion entre areas, reprocesos o sistemas que no conversan entre si.",
  },
  {
    id: "C",
    title: "Empresa Madura",
    color: "green",
    description: "La base esta ordenada. El siguiente salto es automatizacion, inteligencia de datos e integracion de procesos.",
  },
] as const;
