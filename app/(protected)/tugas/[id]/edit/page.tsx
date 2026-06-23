import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TaskForm from "@/components/forms/TaskForm";
import Link from "next/link";

interface EditTugasPageProps {
  params: { id: string };
}

export default async function EditTugasPage({ params }: EditTugasPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: task } = await supabase
    .from("tugas")
    .select("*")
    .eq("id", params.id)
    .eq("mahasiswa_id", user.id) // RLS safety
    .single();

  if (!task) notFound();

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Edit Tugas</h1>
          <p className="text-xs text-slate-500 truncate max-w-xs">{task.judul}</p>
        </div>
      </div>

      <div className="card p-5">
        <TaskForm mode="edit" task={task} mahasiswaId={user.id} />
      </div>
    </div>
  );
}
