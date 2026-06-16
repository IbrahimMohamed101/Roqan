"use server";

import { redirect } from "next/navigation";
import { createAdminSession, verifyAdminCredentials } from "@/lib/adminAuth";

export const loginAdmin = async (_state: string, formData: FormData) => {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(email, password)) {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  }

  await createAdminSession(email);
  redirect("/dashboard");
};
