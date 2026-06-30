import { NextRequest, NextResponse } from "next/server";
import { addRegistration, getEventById } from "@/lib/eventsDataStore";
import { sendRegistrationConfirmationEmail } from "@/lib/eventMailer";

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      company?: string;
      position?: string;
      email?: string;
      phone?: string;
    };
    const registration = await addRegistration(context.params.id, {
      fullName: body.fullName ?? "",
      company: body.company ?? "",
      position: body.position ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
    });

    const event = await getEventById(context.params.id);
    if (event) {
      try {
        await sendRegistrationConfirmationEmail(event, registration);
      } catch (error) {
        console.error("No se pudo enviar mail de confirmación", error);
      }
    }

    return NextResponse.json({ ok: true, message: "registered" });
  } catch (error) {
    return NextResponse.json(
      { error: "registration_failed", message: String(error) },
      { status: 400 },
    );
  }
}
