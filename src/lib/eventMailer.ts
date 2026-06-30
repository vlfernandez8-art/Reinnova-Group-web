import { z } from "zod";
import { type EventRecord, type RegistrationRecord } from "@/lib/eventsTypes";

const mailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
});

async function sendResendEmail(payload: { to: string; subject: string; html: string }) {
  const result = mailSchema.safeParse(payload);
  if (!result.success) {
    return { ok: false, message: "invalid_email_payload" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, message: "missing_resend_key" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? "Reinnova Group <onboarding@resend.dev>",
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { ok: false, message: error };
  }

  return { ok: true };
}

export async function sendRegistrationConfirmationEmail(
  event: EventRecord,
  registration: RegistrationRecord,
) {
  const html = `
    <h2>Confirmacion de inscripcion - ${event.title}</h2>
    <p>Hola ${registration.fullName},</p>
    <p>Gracias por inscribirte a la capacitacion <strong>${event.title}</strong> de Reinnova Group.</p>
    <p><strong>Fecha:</strong> ${event.date}</p>
    <p><strong>Hora:</strong> ${event.time}</p>
    <p><strong>Modalidad:</strong> ${event.modality}</p>
    <p><strong>Duracion:</strong> ${event.duration}</p>
    <p>
      <strong>Link de acceso:</strong>
      <a href="${event.accessLink}">${event.accessLink}</a>
    </p>
    <p>Te recomendamos ingresar unos minutos antes.</p>
    <p>Saludos,<br/>Equipo Reinnova Group</p>
  `;

  return sendResendEmail({
    to: registration.email,
    subject: `Confirmacion de inscripcion - ${event.title}`,
    html,
  });
}
