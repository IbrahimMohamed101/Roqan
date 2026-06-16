import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { clearAdminSession, isAdminAuthenticated } from "@/lib/adminAuth";

const logout = async () => {
  "use server";

  await clearAdminSession();
  redirect("/dashboard/login");
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/dashboard/login");
  }

  return (
    <div className="container-shell section-y">
      <div className="mb-6 flex flex-col gap-3 rounded-[24px] border border-[var(--border)] bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <DashboardNav />
        <form action={logout}>
          <button className="btn-secondary min-h-10 px-4" type="submit">
            خروج
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
