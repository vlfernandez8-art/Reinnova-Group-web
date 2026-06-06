import { NextResponse } from "next/server";
import { getDiagnosticoPdfBase64 } from "@/lib/generarPDF";
import { DiagnosticResult, DiagnosticoState } from "@/lib/types";

const recipients = ["administracion@reinnova.com.ar", "reinnova.ae@gmail.com", "vfernandez@contannova.com.ar"];

export async function POST(request: Request) {
  const { state, result } = (await request.json()) as {
    state: DiagnosticoState;
    result: DiagnosticResult;
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ skipped: true, reason: "Missing RESEND_API_KEY" });
  }

  const pdfBase64 = getDiagnosticoPdfBase64(state, result);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? "Reinnova Diagnóstico <onboarding@resend.dev>",
      to: recipients,
      subject: `Nuevo diagnóstico - ${state.company.empresa}`,
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
    const error = await response.text();
    return NextResponse.json({ sent: false, error }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}

function buildEmailHtml(state: DiagnosticoState, result: DiagnosticResult) {
  return `
    <h2>Nuevo diagnóstico completado</h2>
    <p><strong>Empresa:</strong> ${state.company.empresa}</p>
    <p><strong>Contacto:</strong> ${state.company.nombre} (${state.company.cargo})</p>
    <p><strong>Email:</strong> ${state.company.email}</p>
    <p><strong>WhatsApp:</strong> ${state.company.whatsapp || "No informado"}</p>
    <p><strong>Empleados:</strong> ${state.company.empleados}</p>
    <p><strong>Facturación:</strong> ${state.company.facturacion}</p>
    <p><strong>Nivel:</strong> ${result.perfil} - ${result.perfilTitulo}</p>
    <p><strong>Madurez:</strong> ${result.maturityScore}%</p>
    <p><strong>Impacto mensual:</strong> ${result.impact.total_mensual}</p>
  `;
}

function safeFileName(value: string) {
  return (value || "empresa").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
