import { NextResponse } from "next/server";
import { serializeAppointment } from "@/app/lib/appointments";
import { prisma } from "@/app/lib/prisma";
import { requireStaff } from "@/app/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "请先登录员工账号" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const where = status && status !== "all" ? { status: status.toUpperCase() as never } : {};

  const appointments = await prisma.appointment.findMany({
    where,
    include: { customer: { select: { name: true, phone: true } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ appointments: appointments.map(serializeAppointment) });
}
