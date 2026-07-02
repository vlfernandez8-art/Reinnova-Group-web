import { NextRequest, NextResponse } from "next/server";
import { getAdminFromSessionCookie } from "@/lib/adminAuth";
import { getDiagnosticSurveys } from "@/lib/eventsDataStore";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromSessionCookie();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const surveys = await getDiagnosticSurveys({
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    rubro: searchParams.get("rubro"),
  });

  return NextResponse.json({ surveys });
}
