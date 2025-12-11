import { requireAuth } from "@/lib/auth-middleware";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-ink-black-950 pt-20 pb-20 md:pb-0">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
