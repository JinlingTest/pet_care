import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireStaff } from "@/app/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "请先登录员工账号" }, { status: 401 });
  }

  const employee = await prisma.employee.findUnique({ where: { id: session.id } });
  if (!employee || !employee.isActive) {
    return NextResponse.json({ error: "员工账号不可用" }, { status: 401 });
  }

  return NextResponse.json({
    employee: { id: employee.id, username: employee.username, name: employee.name, role: employee.role }
  });
}
