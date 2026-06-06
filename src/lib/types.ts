export type EmployeeRange = "1-5" | "6-15" | "16-50" | "51-200" | "+200";
export type RevenueRange =
  | "Hasta $500k"
  | "$500k-$2M"
  | "$2M-$10M"
  | "$10M-$50M"
  | "+$50M";

export type RubroId =
  | "retail"
  | "gastronomia"
  | "construccion"
  | "salud"
  | "servicios-personales"
  | "servicios-tecnicos"
  | "logistica"
  | "servicios-profesionales"
  | "tecnologia"
  | "importacion-exportacion"
  | "agro"
  | "educacion"
  | "manufactura"
  | "inmobiliaria"
  | "ecommerce"
  | "otro";

export type MaturityChoice = "A" | "B" | "C";
export type QuestionKind = "single";

export type QuestionOption = {
  label: string;
  score: number;
};

export type DiagnosticQuestion = {
  id: string;
  block: string;
  text: string;
  kind: QuestionKind;
  options: QuestionOption[];
};

export type CompanyData = {
  empresa: string;
  nombre: string;
  cargo: string;
  email: string;
  whatsapp?: string;
  empleados: EmployeeRange | "";
  facturacion: RevenueRange | "";
};

export type ProfileData = {
  rubro: RubroId | "";
  rubroOtro?: string;
  perfilDeclarado: MaturityChoice | "";
};

export type EconomicData = {
  horasSemanaAdmin: number;
  salarioPromedio: number;
  salarioRango: string;
  erroresMensuales: number;
  erroresDetalle?: string;
  demoraBalance: string;
  ventasPerdidas: string;
};

export type Answers = Record<string, string>;

export type DiagnosticoState = {
  step: number;
  company: CompanyData;
  profile: ProfileData;
  answers: Answers;
  economic: EconomicData;
};

export type ImpactoEconomico = {
  costo_horas: number;
  costo_errores: number;
  riesgo_decision: number;
  total_mensual: number;
  total_anual: number;
};

export type PainPoint = {
  block: string;
  score: number;
  symptom: string;
  monthlyCost: number;
};

export type DiagnosticResult = {
  score: number;
  maturityScore: number;
  perfil: MaturityChoice;
  perfilTitulo: string;
  urgencia: {
    color: "green" | "orange" | "red";
    label: string;
  };
  impact: ImpactoEconomico;
  dolores: PainPoint[];
};
