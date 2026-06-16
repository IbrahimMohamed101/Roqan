"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";

const inputClass =
  "min-h-12 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--ring)]";

export default function DashboardLoginPage() {
  const [error, formAction, pending] = useActionState(loginAdmin, "");

  return (
    <div className="container-shell section-y">
      <form
        action={formAction}
        className="mx-auto max-w-md rounded-[24px] border border-[var(--border)] bg-white p-6 shadow-soft"
      >
        <p className="text-sm font-black text-[var(--teal)]">لوحة التحكم</p>
        <h1 className="mt-2 text-3xl font-black text-[var(--text)]">
          تسجيل دخول المدير
        </h1>
        {error ? (
          <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-[var(--danger)]">
            {error}
          </p>
        ) : null}
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-[var(--text)]">
            البريد الإلكتروني
            <input className={inputClass} name="email" type="email" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--text)]">
            كلمة المرور
            <input className={inputClass} name="password" type="password" />
          </label>
        </div>
        <button className="btn-primary mt-5 w-full" disabled={pending} type="submit">
          {pending ? "جار الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
