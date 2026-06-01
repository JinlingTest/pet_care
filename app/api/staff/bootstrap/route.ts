import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { setSession } from "@/app/lib/session";

export const runtime = "nodejs";

const bootstrapSchema = z.object({
  username: z.string().trim().min(3, "用户名至少 3 位"),
  name: z.string().trim().min(1, "请填写员工姓名"),
  password: z.string().min(6, "密码至少 6 位")
});

export async function GET() {
  const count = await prisma.employee.count();
  return NextResponse.json({ needsSetup: count === 0 });
}

export async function POST(request: Request) {
  const count = await prisma.employee.count();
  if (count > 0) {
    return NextResponse.json({ error: "管理员已初始化" }, { status: 409 });
  }

  const parsed = bootstrapSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "提交内容不完整" }, { status: 400 });
  }

  const employee = await prisma.employee.create({
    data: {
      username: parsed.data.username,
      name: parsed.data.name,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(parsed.data.password, 12)
    }
  });

  await setSession({ id: employee.id, type: "staff", role: employee.role });
  return NextResponse.json({ employee: { id: employee.id, username: employee.username, name: employee.name, role: employee.role } });
}
