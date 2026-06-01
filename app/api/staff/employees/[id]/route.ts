import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { requireStaff } from "@/app/lib/session";

export const runtime = "nodejs";

const updateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  role: z.enum(["ADMIN", "STAFF"]).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional()
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "提交内容不完整" }, { status: 400 });
  }

  const { id } = await context.params;
  const employee = await prisma.employee.update({
    where: { id },
    data: {
      name: parsed.data.name,
      role: parsed.data.role,
      isActive: parsed.data.isActive,
      passwordHash: parsed.data.password ? await bcrypt.hash(parsed.data.password, 12) : undefined
    },
    select: { id: true, username: true, name: true, role: true, isActive: true, createdAt: true }
  });

  return NextResponse.json({ employee });
}
