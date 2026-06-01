import { NextResponse } from "next/server";
import { z } from "zod";
import { serializeAppointment } from "@/app/lib/appointments";
import { prisma } from "@/app/lib/prisma";
import { requireStaff } from "@/app/lib/session";

export const runtime = "nodejs";

const statusMap = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  in_service: "IN_SERVICE",
  completed: "COMPLETED",
  cancelled: "CANCELLED"
} as const;

const updateSchema = z.object({
  status: z.enum(["pending", "confirmed", "in_service", "completed", "cancelled"]).optional(),
  staffNote: z.string().trim().optional()
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "请先登录员工账号" }, { status: 401 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "提交内容不完整" }, { status: 400 });
  }

  const { id } = await context.params;
  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      status: parsed.data.status ? statusMap[parsed.data.status] : undefined,
      staffNote: parsed.data.staffNote
    },
    include: { customer: { select: { name: true, phone: true } } }
  });

  return NextResponse.json({ appointment: serializeAppointment(updated) });
}
