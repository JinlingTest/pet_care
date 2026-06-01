import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { setSession } from "@/app/lib/session";

export const runtime = "nodejs";

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "请填写用户名和密码" }, { status: 400 });
  }

  const employee = await prisma.employee.findUnique({ where: { username: parsed.data.username } });
  if (!employee || !employee.isActive || !(await bcrypt.compare(parsed.data.password, employee.passwordHash))) {
    return NextResponse.json({ error: "用户名或密码不正确" }, { status: 401 });
  }

  await setSession({ id: employee.id, type: "staff", role: employee.role });
  return NextResponse.json({
    employee: { id: employee.id, username: employee.username, name: employee.name, role: employee.role }
  });
}
