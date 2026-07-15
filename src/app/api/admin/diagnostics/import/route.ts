import { NextRequest, NextResponse } from "next/server";
import { getAdminFromSessionCookie } from "@/lib/adminAuth";
import { importDiagnosticSurveys } from "@/lib/eventsDataStore";
import { type DiagnosticSurveyRecord } from "@/lib/eventsTypes";

export async function POST(request: NextRequest) {
  const admin = await getAdminFromSessionCookie();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as { diagnosticSurveys?: DiagnosticSurveyRecord[] };
    if (!Array.isArray(body.diagnosticSurveys) || body.diagnosticSurveys.length > 500) {
      return NextResponse.json({ error: "invalid_import" }, { status: 400 });
    }

    const result = await importDiagnosticSurveys(body.diagnosticSurveys);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("diagnostic_import_error", error);
    return NextResponse.json({ error: "import_failed" }, { status: 500 });
  }
}
