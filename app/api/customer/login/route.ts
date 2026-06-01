import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { setSession } from "@/app/lib/session";

export const runtime = "nodejs";

const loginSchema = z.object({
  phone: z.string().trim().min(6),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "请填写手机号和密码" }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({ where: { phone: parsed.data.phone } });
  if (!customer || !(await bcrypt.compare(parsed.data.password, customer.passwordHash))) {
    return NextResponse.json({ error: "手机号或密码不正确" }, { status: 401 });
  }

  await setSession({ id: customer.id, type: "customer" });
  return NextResponse.json({ customer: { id: customer.id, name: customer.name, phone: customer.phone } });
}
