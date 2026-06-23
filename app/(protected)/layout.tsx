import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/ui/Sidebar";
import MobileNav from "@/components/ui/MobileNav";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch mahasiswa profile
  const { data: mahasiswa } = await supabase
    .from("mahasiswa")
    .select("nama_lengkap, program_studi")
    .eq("id", user.id)
    .single();

  const userName = mahasiswa?.nama_lengkap || user.email || "Pengguna";
  const userProdi = mahasiswa?.program_studi || "";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar userName={userName} userProdi={userProdi} />
      <main className="md:ml-60 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
