import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { requireStaff } from "@/app/lib/session";

export const runtime = "nodejs";

const employeeSchema = z.object({
  username: z.string().trim().min(3, "用户名至少 3 位"),
  name: z.string().trim().min(1, "请填写员工姓名"),
  password: z.string().min(6, "密码至少 6 位"),
  role: z.enum(["ADMIN", "STAFF"]).default("STAFF")
});

export async function GET() {
  const session = await requireStaff();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });
  }

  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, username: true, name: true, role: true, isActive: true, createdAt: true }
  });
  return NextResponse.json({ employees });
}

export async function POST(request: Request) {
  const session = await requireStaff();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });
  }

  const parsed = employeeSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "提交内容不完整" }, { status: 400 });
  }

  const employee = await prisma.employee.create({
    data: {
      username: parsed.data.username,
      name: parsed.data.name,
      role: parsed.data.role,
      passwordHash: await bcrypt.hash(parsed.data.password, 12)
    },
    select: { id: true, username: true, name: true, role: true, isActive: true, createdAt: true }
  });

  return NextResponse.json({ employee }, { status: 201 });
}
