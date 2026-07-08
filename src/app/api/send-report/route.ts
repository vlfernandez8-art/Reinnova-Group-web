import { NextRequest, NextResponse } from "next/server";
import { recordDiagnosticSurvey } from "@/lib/eventsDataStore";
import { getDiagnosticoPdfBase64 } from "@/lib/generarPDF";
import { DiagnosticResult, DiagnosticoState } from "@/lib/types";
import { checkRateLimit, escapeHtml, getClientIp, rateLimitResponse } from "@/lib/security";

const recipients = ["administracion@reinnova.com.ar", "reinnova.ae@gmail.com", "vfernandez@contannova.com.ar"];

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`send-report:${ip}`, 8, 60 * 60 * 1000);
    if (!limit.ok) {
      return rateLimitResponse(limit.retryAfter);
    }

    const { state, result } = (await request.json()) as {
      state: DiagnosticoState;
      result: DiagnosticResult;
    };

    if (!isValidDiagnosticPayload(state, result)) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    await recordDiagnosticSurvey(state, result);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ skipped: true });
    }

    const pdfBase64 = getDiagnosticoPdfBase64(state, result);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? "Reinnova Diagnostico <onboarding@resend.dev>",
        to: recipients,
        subject: `Nuevo diagnostico - ${state.company.empresa}`,
        html: buildEmailHtml(state, result),
        attachments: [
          {
            filename: `diagnostico-reinnova-${safeFileName(state.company.empresa)}.pdf`,
            content: pdfBase64,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("send_report_email_error", await response.text());
      return NextResponse.json({ sent: false }, { status: 500 });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("send_report_error", error);
    return NextResponse.json({ sent: false }, { status: 500 });
  }
}

function buildEmailHtml(state: DiagnosticoState, result: DiagnosticResult) {
  return `
    <h2>Nuevo diagnostico completado</h2>
    <p><strong>Empresa:</strong> ${escapeHtml(state.company.empresa)}</p>
    <p><strong>Contacto:</strong> ${escapeHtml(state.company.nombre)} (${escapeHtml(state.company.cargo)})</p>
    <p><strong>Email:</strong> ${escapeHtml(state.company.email)}</p>
    <p><strong>WhatsApp:</strong> ${escapeHtml(state.company.whatsapp || "No informado")}</p>
    <p><strong>Empleados:</strong> ${escapeHtml(state.company.empleados)}</p>
    <p><strong>Facturacion:</strong> ${escapeHtml(state.company.facturacion)}</p>
    <p><strong>Nivel:</strong> ${escapeHtml(result.perfil)} - ${escapeHtml(result.perfilTitulo)}</p>
    <p><strong>Madurez:</strong> ${escapeHtml(result.maturityScore)}%</p>
    <p><strong>Impacto mensual:</strong> ${escapeHtml(result.impact.total_mensual)}</p>
  `;
}

function isValidDiagnosticPayload(state?: DiagnosticoState, result?: DiagnosticResult) {
  return Boolean(
    state?.company?.empresa &&
      state.company.nombre &&
      state.company.email &&
      state.company.empleados &&
      state.company.facturacion &&
      state.profile?.rubro &&
      result?.perfil &&
      Number.isFinite(result.maturityScore) &&
      Number.isFinite(result.impact?.total_mensual) &&
      Number.isFinite(result.cyberRisk?.maturityScore),
  );
}

function safeFileName(value: string) {
  return (value || "empresa").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
