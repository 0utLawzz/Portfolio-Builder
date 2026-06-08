import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useListProjects, useDeleteProject, useGetAdminMe, getGetAdminMeQueryKey, getListProjectsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./dashboard";
import { Edit, Trash2, Star, ExternalLink, Github } from "lucide-react";

export default function AdminProjects() {
  useEffect(() => {
    document.title = "Projects | OUTLAWZ LABS™ Admin";
  }, []);

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session, isLoading: checkingSession } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey(), retry: false },
  });

  useEffect(() => {
    if (!checkingSession && !session?.authenticated) setLocation("/admin");
  }, [session, checkingSession, setLocation]);

  const { data: projects, isLoading } = useListProjects({}, {
    query: { queryKey: getListProjectsQueryKey({}) },
  });

  const deleteProject = useDeleteProject();

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteProject.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey({}) });
        toast({ title: "DELETED", description: `"${title}" removed.` });
      },
      onError: () => {
        toast({ title: "ERROR", description: "Failed to delete.", variant: "destructive" });
      },
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold text-black uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              PROJECTS
            </h1>
            <div className="w-16 h-[3px] bg-[#FFE600] mt-2" />
          </div>
          <Link
            href="/admin/projects/new"
            data-testid="button-new-project"
            className="border-[3px] border-black bg-[#FFE600] text-black px-6 py-3 font-bold uppercase text-sm shadow-[4px_4px_0_#0A0A0A] hover:shadow-[2px_2px_0_#0A0A0A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            + NEW PROJECT
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 border-[3px] border-black bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="border-[3px] border-black bg-white">
            <div className="border-b-[3px] border-black px-6 py-3 bg-black grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 uppercase">
              <div className="col-span-4">TITLE</div>
              <div className="col-span-2">CATEGORY</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-1 text-center">FEAT.</div>
              <div className="col-span-3 text-right">ACTIONS</div>
            </div>
            {projects.map((p, i) => (
              <div
                key={p.id}
                data-testid={`row-project-${p.id}`}
                className={`px-6 py-4 grid grid-cols-12 gap-4 items-center ${i > 0 ? "border-t-[2px] border-gray-200" : ""} hover:bg-gray-50`}
              >
                <div className="col-span-4">
                  <div className="font-bold text-sm uppercase">{p.title}</div>
                  <div className="text-xs font-mono text-gray-500">{p.slug}</div>
                </div>
                <div className="col-span-2">
                  {p.category && (
                    <span className="border-2 border-black px-2 py-0.5 text-xs font-bold uppercase bg-[#FFE600] text-black">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <span className={`border-2 border-black px-2 py-0.5 text-xs font-bold uppercase ${
                    p.status === "active" ? "bg-[#00FF41] text-black" :
                    p.status === "wip" ? "bg-[#FFE600] text-black" :
                    "bg-gray-300 text-black"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="col-span-1 flex justify-center">
                  {p.featured && <Star size={16} className="text-[#FFE600] fill-[#FFE600]" />}
                </div>
                <div className="col-span-3 flex gap-2 justify-end">
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" rel="noreferrer" className="p-2 border-[2px] border-black hover:bg-black hover:text-white transition-colors">
                      <Github size={14} />
                    </a>
                  )}
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noreferrer" className="p-2 border-[2px] border-black hover:bg-black hover:text-white transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    data-testid={`button-edit-${p.id}`}
                    className="p-2 border-[2px] border-black hover:bg-[#FFE600] transition-colors"
                  >
                    <Edit size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    data-testid={`button-delete-${p.id}`}
                    className="p-2 border-[2px] border-[#FF2D20] text-[#FF2D20] hover:bg-[#FF2D20] hover:text-white transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-[3px] border-black p-16 text-center bg-white">
            <p className="font-mono text-gray-500 uppercase tracking-wider text-sm mb-4">No projects yet</p>
            <Link
              href="/admin/projects/new"
              className="inline-block border-[3px] border-black px-6 py-3 font-bold uppercase text-sm bg-[#FFE600] text-black shadow-[4px_4px_0_#0A0A0A]"
            >
              CREATE FIRST PROJECT
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
