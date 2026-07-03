import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { access, constants, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import {
  type AdminSessionRecord,
  type AdminUserRecord,
  type DiagnosticSurveyRecord,
  type EventPayload,
  type EventRecord,
  type EventStatus,
  type PublicEventRecord,
  type RegistrationPayload,
  type RegistrationRecord,
} from "@/lib/eventsTypes";
import { type DiagnosticResult, type DiagnosticoState } from "@/lib/types";

type EventsDb = {
  events: EventRecord[];
  registrations: RegistrationRecord[];
  adminUsers: AdminUserRecord[];
  sessions: AdminSessionRecord[];
  diagnosticSurveys: DiagnosticSurveyRecord[];
};

const DB_DIR = path.join(process.cwd(), "data");
const FALLBACK_DB_DIR = path.join(process.cwd(), "tmp");
const FALLBACK_DB_FILE = path.join(tmpdir(), "reinnova-events-store.json");
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24;
const ENV_DB_PATH = process.env.EVENTS_DB_PATH?.trim();

const DEFAULT_ADMIN_EMAILS = [
  "cmontesino@reinnova.com.ar",
  "vfernandez@reinnova.com.ar",
];
const DEFAULT_ADMIN_BOOTSTRAP_PASSWORD = "R.diagnostico";

function isEventStatus(value: string): value is EventStatus {
  return value === "borrador" || value === "publicado";
}

function normalizeAdminEmails(): string[] {
  const envValue = process.env.ADMIN_EMAILS?.trim();
  if (!envValue) {
    return DEFAULT_ADMIN_EMAILS;
  }

  const split = envValue
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return split.length > 0 ? split : DEFAULT_ADMIN_EMAILS;
}

let cachedDbPath: string | null = null;

async function resolveDbPath(): Promise<string> {
  if (cachedDbPath) {
    return cachedDbPath;
  }

  const candidates = ENV_DB_PATH
    ? [ENV_DB_PATH, path.join(FALLBACK_DB_DIR, "events-store.json"), FALLBACK_DB_FILE]
    : [path.join(DB_DIR, "events-store.json"), path.join(FALLBACK_DB_DIR, "events-store.json"), FALLBACK_DB_FILE];

  for (const candidate of candidates) {
    const candidateDir = path.dirname(candidate);
    try {
      await mkdir(candidateDir, { recursive: true });
      await access(candidate, constants.F_OK | constants.R_OK | constants.W_OK);
      await writeFile(candidate, "", { flag: "a+" });
      cachedDbPath = candidate;
      return candidate;
    } catch {
      // no existe o no accesible
    }

    try {
      const seedDb: EventsDb = {
        events: [],
        registrations: [],
        adminUsers: [],
        sessions: [],
        diagnosticSurveys: [],
      };
      await writeFile(candidate, JSON.stringify(seedDb, null, 2), "utf8");
      cachedDbPath = candidate;
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error("No writable events DB path available");
}

function getSeedDb(): EventsDb {
  return {
    events: [],
    registrations: [],
    adminUsers: [],
    sessions: [],
    diagnosticSurveys: [],
  };
}

function getAdminBootstrapPassword(): string | null {
  return process.env.ADMIN_TEMP_PASSWORD?.trim() || DEFAULT_ADMIN_BOOTSTRAP_PASSWORD;
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const pepper = process.env.ADMIN_PASSWORD_PEPPER ?? "";
  const derived = scryptSync(`${password}:${pepper}`, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, expected] = storedHash.split(":");
  if (!salt || !expected) {
    return false;
  }

  const pepper = process.env.ADMIN_PASSWORD_PEPPER ?? "";
  const derived = scryptSync(`${password}:${pepper}`, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  if (expectedBuffer.length !== derived.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, derived);
}

function createId() {
  return randomUUID();
}

const now = () => new Date().toISOString();

function sanitizeStatus(value: string | null) {
  if (value === "borrador" || value === "publicado") {
    return value;
  }
  return "borrador";
}

function mapEventToPublic(event: EventRecord): PublicEventRecord {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    modality: event.modality,
    targetAudience: event.targetAudience,
    status: event.status,
  };
}

function stripUndefined<T>(input: T): T {
  return JSON.parse(JSON.stringify(input));
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePublicPayload(payload: Partial<EventPayload>) {
  if (!payload.title?.trim()) throw new Error("title_required");
  if (!payload.description?.trim()) throw new Error("description_required");
  if (!payload.date?.trim()) throw new Error("date_required");
  if (!payload.time?.trim()) throw new Error("time_required");
  if (!payload.duration?.trim()) throw new Error("duration_required");
  if (!payload.modality?.trim()) throw new Error("modality_required");
  if (!payload.targetAudience?.trim()) throw new Error("target_required");
}

function validateRegistrationPayload(payload: Partial<RegistrationPayload>) {
  if (!payload.fullName?.trim()) throw new Error("fullName_required");
  if (!payload.company?.trim()) throw new Error("company_required");
  if (!payload.position?.trim()) throw new Error("position_required");
  if (!payload.email?.trim() || !validateEmail(payload.email)) throw new Error("email_invalid");
  if (!payload.phone?.trim()) throw new Error("phone_required");
}

async function readDb(): Promise<EventsDb> {
  const dbPath = await resolveDbPath();
  await mkdir(path.dirname(dbPath), { recursive: true });

  try {
    const raw = await readFile(dbPath, "utf8");
    const parsed = JSON.parse(raw) as EventsDb;
    return ensureSeedAndCleanupSessions({
      events: parsed.events ?? [],
      registrations: parsed.registrations ?? [],
      adminUsers: parsed.adminUsers ?? [],
      sessions: parsed.sessions ?? [],
      diagnosticSurveys: parsed.diagnosticSurveys ?? [],
    });
  } catch {
    const created = await writeDb(getSeedDb());
    return created;
  }
}

async function writeDb(db: EventsDb): Promise<EventsDb> {
  const dbPath = await resolveDbPath();
  await mkdir(path.dirname(dbPath), { recursive: true });
  const normalized = ensureSeedAndCleanupSessions({
    ...db,
    events: db.events.map((item) => ({
      ...item,
      status: sanitizeStatus(item.status),
      title: item.title.trim(),
      description: item.description.trim(),
      date: item.date.trim(),
      time: item.time.trim(),
      duration: item.duration.trim(),
      modality: item.modality.trim(),
      targetAudience: item.targetAudience.trim(),
      accessLink: item.accessLink.trim(),
    })),
    registrations: db.registrations.map((item) => ({
      ...item,
      fullName: item.fullName.trim(),
      company: item.company.trim(),
      position: item.position.trim(),
      email: item.email.trim().toLowerCase(),
      phone: item.phone.trim(),
    })),
    adminUsers: db.adminUsers.map((item) => ({
      ...item,
      email: item.email.trim().toLowerCase(),
    })),
    sessions: db.sessions.map((item) => ({
      ...item,
      adminUserId: item.adminUserId,
    })),
    diagnosticSurveys: (db.diagnosticSurveys ?? []).map((item) => ({
      ...item,
      rubro: item.rubro.trim(),
      rubroOtro: item.rubroOtro?.trim(),
      empleados: item.empleados.trim(),
      facturacion: item.facturacion.trim(),
      perfil: item.perfil.trim(),
      perfilTitulo: item.perfilTitulo.trim(),
      cyberRiskLevel: item.cyberRiskLevel.trim(),
    })),
  });

  await writeFile(dbPath, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}

function getSessionTtlSeconds() {
  const envValue = Number(process.env.ADMIN_SESSION_TTL_SECONDS);
  return Number.isFinite(envValue) && envValue > 0 ? envValue : DEFAULT_SESSION_TTL_SECONDS;
}

function ensureSeedAndCleanupSessions(db: EventsDb): EventsDb {
  const nowDate = new Date();
  const activeSessions = db.sessions.filter((session) => new Date(session.expiresAt).getTime() > nowDate.getTime());
  const seedPassword = getAdminBootstrapPassword();
  const adminEmails = normalizeAdminEmails();

  if (adminEmails.length > 0 && seedPassword) {
    db.adminUsers = db.adminUsers.map((user) => {
      const normalizedEmail = user.email.toLowerCase();
      if (!adminEmails.includes(normalizedEmail)) {
        return user;
      }

      if (verifyPassword(seedPassword, user.passwordHash)) {
        return user;
      }

      return {
        ...user,
        passwordHash: hashPassword(seedPassword),
        updatedAt: now(),
      };
    });

    const existingEmails = new Set(db.adminUsers.map((user) => user.email.toLowerCase()));
    const seededUsers = adminEmails
      .filter((email) => !existingEmails.has(email))
      .map((email) => ({
        id: createId(),
        email,
        passwordHash: hashPassword(seedPassword),
        createdAt: now(),
      }));

    if (seededUsers.length > 0 || db.adminUsers.some((user) => !adminEmails.includes(user.email))) {
      db.adminUsers = [
        ...db.adminUsers.filter((user) => adminEmails.includes(user.email)),
        ...seededUsers,
      ];
    }
  }

  return {
    ...db,
    sessions: activeSessions,
  };
}

export async function getPublishedEvents(): Promise<PublicEventRecord[]> {
  const db = await readDb();
  return db.events
    .filter((event) => event.status === "publicado")
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .map(mapEventToPublic)
    .map((event) => event);
}

export async function getAllEvents(): Promise<EventRecord[]> {
  const db = await readDb();
  return db.events
    .map(stripUndefined)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

export async function getEventById(eventId: string): Promise<EventRecord | null> {
  const db = await readDb();
  return db.events.find((event) => event.id === eventId) ?? null;
}

export async function createEvent(payload: EventPayload): Promise<EventRecord> {
  validatePublicPayload(payload);
  if (!isEventStatus(payload.status)) {
    throw new Error("invalid_status");
  }

  const db = await readDb();
  const event: EventRecord = {
    id: createId(),
    title: payload.title.trim(),
    description: payload.description.trim(),
    date: payload.date.trim(),
    time: payload.time.trim(),
    duration: payload.duration.trim(),
    modality: payload.modality.trim(),
    targetAudience: payload.targetAudience.trim(),
    accessLink: payload.accessLink.trim(),
    status: payload.status,
    createdAt: now(),
    updatedAt: now(),
  };

  db.events.push(event);
  await writeDb(db);
  return event;
}

export async function updateEvent(eventId: string, payload: Partial<EventPayload>): Promise<EventRecord> {
  const db = await readDb();
  const index = db.events.findIndex((event) => event.id === eventId);
  if (index === -1) {
    throw new Error("event_not_found");
  }

  const current = db.events[index];
  const nextStatus = payload.status ? sanitizeStatus(payload.status) : current.status;

  const updated: EventRecord = {
    ...current,
    ...(payload.title !== undefined ? { title: payload.title.trim() } : {}),
    ...(payload.description !== undefined ? { description: payload.description.trim() } : {}),
    ...(payload.date !== undefined ? { date: payload.date.trim() } : {}),
    ...(payload.time !== undefined ? { time: payload.time.trim() } : {}),
    ...(payload.duration !== undefined ? { duration: payload.duration.trim() } : {}),
    ...(payload.modality !== undefined ? { modality: payload.modality.trim() } : {}),
    ...(payload.targetAudience !== undefined ? { targetAudience: payload.targetAudience.trim() } : {}),
    ...(payload.accessLink !== undefined ? { accessLink: payload.accessLink.trim() } : {}),
    status: nextStatus,
    updatedAt: now(),
  };

  db.events[index] = updated;
  await writeDb(db);
  return updated;
}

export async function deleteEvent(eventId: string): Promise<EventRecord> {
  const db = await readDb();
  const index = db.events.findIndex((event) => event.id === eventId);
  if (index === -1) {
    throw new Error("event_not_found");
  }

  const [removed] = db.events.splice(index, 1);
  db.registrations = db.registrations.filter((registration) => registration.eventId !== eventId);
  await writeDb(db);
  return removed;
}

export async function addRegistration(eventId: string, payload: RegistrationPayload): Promise<RegistrationRecord> {
  validateRegistrationPayload(payload);
  const db = await readDb();
  const event = db.events.find((item) => item.id === eventId);
  if (!event || event.status !== "publicado") {
    throw new Error("event_not_available");
  }

  const registration: RegistrationRecord = {
    id: createId(),
    eventId,
    fullName: payload.fullName.trim(),
    company: payload.company.trim(),
    position: payload.position.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    createdAt: now(),
  };
  db.registrations.push(registration);
  await writeDb(db);
  return registration;
}

export async function getRegistrations(eventId: string): Promise<RegistrationRecord[]> {
  const db = await readDb();
  return db.registrations
    .filter((registration) => registration.eventId === eventId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getAdminByEmail(email: string): Promise<AdminUserRecord | null> {
  const db = await readDb();
  return db.adminUsers.find((admin) => admin.email.toLowerCase() === email.trim().toLowerCase()) ?? null;
}

export function verifyAdminPassword(password: string, storedHash: string) {
  return verifyPassword(password, storedHash);
}

export async function createSession(adminUserId: string): Promise<AdminSessionRecord> {
  const safeTtl = getSessionTtlSeconds();
  const db = await readDb();
  const newSession: AdminSessionRecord = {
    id: createId(),
    adminUserId,
    createdAt: now(),
    expiresAt: new Date(Date.now() + safeTtl * 1000).toISOString(),
  };

  db.sessions = db.sessions.filter((session) => session.adminUserId !== adminUserId);
  db.sessions.push(newSession);
  await writeDb(db);
  return newSession;
}

export async function getSession(sessionId: string): Promise<AdminSessionRecord | null> {
  const db = await readDb();
  const session = db.sessions.find((item) => item.id === sessionId) ?? null;
  if (!session) {
    return null;
  }

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await revokeSession(session.id);
    return null;
  }

  return session;
}

export async function revokeSession(sessionId: string) {
  const db = await readDb();
  db.sessions = db.sessions.filter((item) => item.id !== sessionId);
  await writeDb(db);
}

export async function getAdminBySession(sessionId: string): Promise<AdminUserRecord | null> {
  const session = await getSession(sessionId);
  if (!session) {
    return null;
  }
  return getAdminById(session.adminUserId);
}

export async function getAdminById(adminId: string): Promise<AdminUserRecord | null> {
  const db = await readDb();
  return db.adminUsers.find((user) => user.id === adminId) ?? null;
}

export async function buildCsvForRegistrations(eventId: string) {
  const [event, registrations] = await Promise.all([getEventById(eventId), getRegistrations(eventId)]);
  if (!event) {
    throw new Error("event_not_found");
  }

  const header = "nombre_apellido,empresa,puesto,mail,telefono,fecha_inscripcion,capacitacion";
  const rows = registrations.map((item) =>
    [
      quoteCsvValue(item.fullName),
      quoteCsvValue(item.company),
      quoteCsvValue(item.position),
      quoteCsvValue(item.email),
      quoteCsvValue(item.phone),
      quoteCsvValue(item.createdAt),
      quoteCsvValue(event.title),
    ].join(","),
  );
  return [header, ...rows].join("\n");
}

export async function recordDiagnosticSurvey(state: DiagnosticoState, result: DiagnosticResult): Promise<DiagnosticSurveyRecord> {
  const db = await readDb();
  const survey: DiagnosticSurveyRecord = {
    id: createId(),
    createdAt: now(),
    rubro: state.profile.rubro || "sin-rubro",
    rubroOtro: state.profile.rubroOtro?.trim() || undefined,
    empleados: state.company.empleados || "No informado",
    facturacion: state.company.facturacion || "No informada",
    perfil: result.perfil,
    perfilTitulo: result.perfilTitulo,
    maturityScore: result.maturityScore,
    totalImpactMonthly: result.impact.total_mensual,
    totalImpactAnnual: result.impact.total_anual,
    cyberMaturityScore: result.cyberRisk.maturityScore,
    cyberRiskLevel: result.cyberRisk.dataLeakRiskLevel,
    cyberRecoveryDays: result.cyberRisk.recoveryDays,
    cyberImpactMonthly: result.cyberRisk.monthlyImpact,
    cyberImpactAnnual: result.cyberRisk.annualImpact,
  };

  db.diagnosticSurveys.push(survey);
  await writeDb(db);
  return survey;
}

export async function getDiagnosticSurveys(filters?: { from?: string | null; to?: string | null; rubro?: string | null }) {
  const db = await readDb();
  const from = filters?.from ? new Date(`${filters.from}T00:00:00`).getTime() : null;
  const to = filters?.to ? new Date(`${filters.to}T23:59:59`).getTime() : null;
  const rubro = filters?.rubro?.trim();

  return db.diagnosticSurveys
    .filter((item) => {
      const created = new Date(item.createdAt).getTime();
      if (from && created < from) return false;
      if (to && created > to) return false;
      if (rubro && rubro !== "todos" && item.rubro !== rubro) return false;
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(stripUndefined);
}

export async function buildCsvForDiagnosticSurveys(filters?: { from?: string | null; to?: string | null; rubro?: string | null }) {
  const surveys = await getDiagnosticSurveys(filters);
  const header = [
    "fecha",
    "rubro",
    "rubro_otro",
    "empleados",
    "facturacion",
    "perfil",
    "madurez",
    "impacto_mensual",
    "impacto_anual",
    "madurez_cyber",
    "riesgo_cyber",
    "dias_recuperacion_cyber",
    "impacto_cyber_mensual",
    "impacto_cyber_anual",
  ].join(",");
  const rows = surveys.map((item) =>
    [
      quoteCsvValue(item.createdAt),
      quoteCsvValue(item.rubro),
      quoteCsvValue(item.rubroOtro ?? ""),
      quoteCsvValue(item.empleados),
      quoteCsvValue(item.facturacion),
      quoteCsvValue(`${item.perfil} - ${item.perfilTitulo}`),
      item.maturityScore,
      item.totalImpactMonthly,
      item.totalImpactAnnual,
      item.cyberMaturityScore,
      quoteCsvValue(item.cyberRiskLevel),
      item.cyberRecoveryDays,
      item.cyberImpactMonthly,
      item.cyberImpactAnnual,
    ].join(","),
  );

  return [header, ...rows].join("\n");
}

function quoteCsvValue(value: string) {
  const safe = value.replace(/"/g, '""');
  return `"${safe}"`;
}

export { hashPassword, validateEmail };
