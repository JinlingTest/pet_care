import { NextResponse } from "next/server";
import { z } from "zod";
import { estimateAppointmentPrice, serializeAppointment } from "@/app/lib/appointments";
import { prisma } from "@/app/lib/prisma";
import { requireCustomer } from "@/app/lib/session";

export const runtime = "nodejs";

const editableStatuses = ["PENDING", "CONFIRMED"];

const updateAppointmentSchema = z.object({
  petType: z.enum(["dog", "cat"]).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  plan: z.enum(["清爽基础洗", "全套护理洗", "造型精修"]).optional(),
  note: z.string().trim().optional(),
  cancel: z.boolean().optional()
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireCustomer();
  if (!session) {
    return NextResponse.json({ error: "请先登录客户账号" }, { status: 401 });
  }

  const { id } = await context.params;
  const appointment = await prisma.appointment.findFirst({
    where: { id, customerId: session.id }
  });

  if (!appointment) {
    return NextResponse.json({ error: "预约不存在" }, { status: 404 });
  }

  if (!editableStatuses.includes(appointment.status)) {
    return NextResponse.json({ error: "当前状态不可修改预约" }, { status: 409 });
  }

  const parsed = updateAppointmentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "提交内容不完整" }, { status: 400 });
  }

  if (parsed.data.cancel) {
    const updated = await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: "CANCELLED" }
    });
    return NextResponse.json({ appointment: serializeAppointment(updated) });
  }

  const petType = parsed.data.petType ?? appointment.petType;
  const size = parsed.data.size ?? appointment.size;
  const plan = parsed.data.plan ?? appointment.plan;

  const updated = await prisma.appointment.update({
    where: { id: appointment.id },
    data: {
      petType,
      size,
      plan,
      note: parsed.data.note ?? appointment.note,
      estimatedPrice: estimateAppointmentPrice(plan, size, petType)
    }
  });

  return NextResponse.json({ appointment: serializeAppointment(updated) });
}
