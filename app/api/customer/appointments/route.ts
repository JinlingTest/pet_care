import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { estimateAppointmentPrice, serializeAppointment } from "@/app/lib/appointments";
import { prisma } from "@/app/lib/prisma";
import { requireCustomer, setSession } from "@/app/lib/session";

export const runtime = "nodejs";

const createAppointmentSchema = z.object({
  owner: z.string().trim().min(1, "请填写主人称呼"),
  phone: z.string().trim().min(6, "请填写有效联系电话"),
  password: z.string().min(6, "密码至少 6 位"),
  petType: z.enum(["dog", "cat"]),
  size: z.enum(["small", "medium", "large"]),
  plan: z.enum(["清爽基础洗", "全套护理洗", "造型精修"]),
  note: z.string().trim().optional()
});

export async function POST(request: Request) {
  const parsed = createAppointmentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "提交内容不完整" }, { status: 400 });
  }

  const data = parsed.data;
  const existingCustomer = await prisma.customer.findUnique({ where: { phone: data.phone } });
  let customer = existingCustomer;

  if (existingCustomer) {
    const passwordOk = await bcrypt.compare(data.password, existingCustomer.passwordHash);
    if (!passwordOk) {
      return NextResponse.json({ error: "该手机号已注册，密码不正确" }, { status: 401 });
    }
    customer = await prisma.customer.update({
      where: { id: existingCustomer.id },
      data: { name: data.owner }
    });
  } else {
    customer = await prisma.customer.create({
      data: {
        phone: data.phone,
        name: data.owner,
        passwordHash: await bcrypt.hash(data.password, 12)
      }
    });
  }

  const appointment = await prisma.appointment.create({
    data: {
      customerId: customer.id,
      ownerName: data.owner,
      phone: data.phone,
      petType: data.petType,
      size: data.size,
      plan: data.plan,
      note: data.note || null,
      estimatedPrice: estimateAppointmentPrice(data.plan, data.size, data.petType)
    }
  });

  await setSession({ id: customer.id, type: "customer" });
  return NextResponse.json({ appointment: serializeAppointment(appointment) }, { status: 201 });
}

export async function GET() {
  const session = await requireCustomer();
  if (!session) {
    return NextResponse.json({ error: "请先登录客户账号" }, { status: 401 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { customerId: session.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ appointments: appointments.map(serializeAppointment) });
}
