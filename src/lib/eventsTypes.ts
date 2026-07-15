export type EventStatus = "borrador" | "publicado";

export type EventPayload = {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  modality: string;
  targetAudience: string;
  accessLink: string;
  status: EventStatus;
};

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  modality: string;
  targetAudience: string;
  accessLink: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
};

export type PublicEventRecord = {
  id: string;
  title: string;
  date: string;
  time: string;
  modality: string;
  targetAudience: string;
  description: string;
  status: EventStatus;
};

export type RegistrationPayload = {
  fullName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
};

export type RegistrationRecord = {
  id: string;
  eventId: string;
  fullName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type AdminUserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type AdminSessionRecord = {
  id: string;
  adminUserId: string;
  expiresAt: string;
  createdAt: string;
};

export type DiagnosticSurveyRecord = {
  id: string;
  createdAt: string;
  companyName?: string;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
  rubro: string;
  rubroOtro?: string;
  empleados: string;
  facturacion: string;
  perfil: string;
  perfilTitulo: string;
  maturityScore: number;
  totalImpactMonthly: number;
  totalImpactAnnual: number;
  cyberMaturityScore: number;
  cyberRiskLevel: string;
  cyberRecoveryDays: number;
  cyberImpactMonthly: number;
  cyberImpactAnnual: number;
};
