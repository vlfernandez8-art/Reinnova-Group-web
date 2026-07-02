import { DiagnosticSurveyDashboard } from "@/components/admin/DiagnosticSurveyDashboard";
import { getDiagnosticSurveys } from "@/lib/eventsDataStore";

export const revalidate = 0;

export default async function AdminDiagnosticsSurveyPage() {
  const surveys = await getDiagnosticSurveys();
  return <DiagnosticSurveyDashboard initialSurveys={surveys} />;
}
