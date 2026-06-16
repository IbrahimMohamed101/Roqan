import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "rooqan_admin_session";
const SESSION_DAYS = 7;

const getSecret = () => {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required for admin session signing.");
  }

  return process.env.AUTH_SECRET;
};

const sign = (value: string) =>
  createHmac("sha256", getSecret()).update(value).digest("hex");

const createPayload = (email: string, expiresAt: number) =>
  Buffer.from(JSON.stringify({ email, expiresAt })).toString("base64url");

const readExpiresAt = (payload: string) => {
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof parsed.expiresAt === "number" ? parsed.expiresAt : 0;
  } catch {
    const separatorIndex = payload.lastIndexOf(":");
    return Number(payload.slice(separatorIndex + 1));
  }
};

const safeCompare = (a: string, b: string) => {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
};

export const verifyAdminCredentials = (email: string, password: string) =>
  Boolean(process.env.ADMIN_EMAIL) &&
  Boolean(process.env.ADMIN_PASSWORD) &&
  safeCompare(email, process.env.ADMIN_EMAIL ?? "") &&
  safeCompare(password, process.env.ADMIN_PASSWORD ?? "");

export const createAdminSession = async (email: string) => {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = createPayload(email, expiresAt);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });

  return true;
};

export const clearAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
};

export const isAdminAuthenticated = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;

  if (!raw) {
    return false;
  }

  const separatorIndex = raw.lastIndexOf(".");
  const payload = raw.slice(0, separatorIndex);
  const signature = raw.slice(separatorIndex + 1);

  if (!payload || !signature || !safeCompare(signature, sign(payload))) {
    return false;
  }

  return readExpiresAt(payload) > Date.now();
};
