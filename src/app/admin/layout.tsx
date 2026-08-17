import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "GERGA Admin | Content & Operations Control Center",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090b09] text-[#f7f5ef] flex">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-6 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
