import { NextRequest, NextResponse } from "next/server";
import { getAdminFromSessionCookie } from "@/lib/adminAuth";
import { buildCsvForDiagnosticSurveys } from "@/lib/eventsDataStore";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromSessionCookie();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const csv = await buildCsvForDiagnosticSurveys({
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    rubro: searchParams.get("rubro"),
  });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="relevamiento-diagnosticos.csv"',
    },
  });
}
