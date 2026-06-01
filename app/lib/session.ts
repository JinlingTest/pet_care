import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export type SessionUser = {
  id: string;
  type: "customer" | "staff";
  role?: "ADMIN" | "STAFF";
};

const cookieName = "pet_care_session";

function secretKey() {
  const secret = process.env.SESSION_SECRET || "dev-only-pet-care-session-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function setSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.id !== "string" || (payload.type !== "customer" && payload.type !== "staff")) {
      return null;
    }
    return {
      id: payload.id,
      type: payload.type,
      role: payload.role === "ADMIN" || payload.role === "STAFF" ? payload.role : undefined
    };
  } catch {
    return null;
  }
}

export async function requireCustomer() {
  const session = await getSession();
  if (!session || session.type !== "customer") {
    return null;
  }
  return session;
}

export async function requireStaff() {
  const session = await getSession();
  if (!session || session.type !== "staff") {
    return null;
  }
  return session;
}
