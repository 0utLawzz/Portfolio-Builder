import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useGetAdminMe, useGetStats, useAdminLogout, getGetAdminMeQueryKey, getGetStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, FolderOpen, MessageSquare, Star, Users } from "lucide-react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const adminLogout = useAdminLogout();

  const { data: session, isLoading } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey(), retry: false },
  });

  useEffect(() => {
    if (!isLoading && !session?.authenticated) setLocation("/admin");
  }, [session, isLoading, setLocation]);

  const handleLogout = () => {
    adminLogout.mutate({}, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminMeQueryKey() });
        setLocation("/admin");
      },
    });
  };

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <span className="text-[#FFE600] font-mono">Loading...</span>
    </div>
  );

  const navLinks = [
    { href: "/admin/dashboard", label: "DASHBOARD" },
    { href: "/admin/projects", label: "PROJECTS" },
    { href: "/admin/messages", label: "MESSAGES" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'Space Mono', monospace" }}>
      {/* Admin top bar */}
      <header className="bg-black border-b-[3px] border-[#FFE600] py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <span className="text-white font-bold text-xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            OUTLAWZ LABS™ <span className="text-[#FFE600]">ADMIN</span>
          </span>
          <nav className="hidden md:flex gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1 text-xs font-bold uppercase text-gray-400 border border-gray-700 hover:border-[#FFE600] hover:text-[#FFE600] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs font-mono text-gray-500 hover:text-gray-300 uppercase">
            VIEW SITE
          </Link>
          <button
            onClick={handleLogout}
            data-testid="button-admin-logout"
            className="flex items-center gap-2 border-[2px] border-[#FF2D20] text-[#FF2D20] px-3 py-1 text-xs font-bold uppercase hover:bg-[#FF2D20] hover:text-white transition-colors"
          >
            <LogOut size={12} />
            LOGOUT
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Dashboard | OUTLAWZ LABS™ Admin";
  }, []);

  const { data: stats, isLoading } = useGetStats({
    query: { queryKey: getGetStatsQueryKey() },
  });

  const statCards = [
    { icon: FolderOpen, label: "TOTAL PROJECTS", value: stats?.totalProjects ?? 0, color: "#FFE600" },
    { icon: Star, label: "FEATURED", value: stats?.featuredProjects ?? 0, color: "#00FF41" },
    { icon: MessageSquare, label: "MESSAGES", value: stats?.totalMessages ?? 0, color: "#0066FF" },
    { icon: Users, label: "UNREAD", value: stats?.unreadMessages ?? 0, color: "#FF2D20" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold text-black uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              DASHBOARD
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-10">
          {statCards.map((card, i) => (
            <div
              key={card.label}
              className={`border-[3px] border-black p-6 bg-white ${i > 0 ? "border-l-0" : ""}`}
            >
              <card.icon size={20} className="mb-3" style={{ color: card.color }} />
              <div className="text-4xl font-bold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {isLoading ? "—" : card.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        {stats?.projectsByCategory && stats.projectsByCategory.length > 0 && (
          <div className="border-[3px] border-black bg-white p-6 mb-10">
            <h2 className="text-2xl font-bold uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              PROJECTS BY CATEGORY
            </h2>
            <div className="space-y-2">
              {stats.projectsByCategory.map((cat) => (
                <div key={cat.category} className="flex items-center gap-4">
                  <span className="w-32 font-bold text-xs uppercase text-gray-600">{cat.category}</span>
                  <div className="flex-1 border-[2px] border-black h-8 bg-gray-100 relative overflow-hidden">
                    <div
                      className="h-full bg-[#FFE600] border-r-[2px] border-black"
                      style={{ width: `${Math.min((cat.count / (stats.totalProjects || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="font-bold text-sm w-8 text-right">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { href: "/admin/projects", label: "MANAGE PROJECTS", desc: "Create, edit, delete projects" },
            { href: "/admin/projects/new", label: "ADD PROJECT", desc: "Add a new portfolio project" },
            { href: "/admin/messages", label: "VIEW MESSAGES", desc: "Read contact form submissions" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-[3px] border-black p-6 bg-black text-white shadow-[4px_4px_0_#FFE600] hover:shadow-[6px_6px_0_#FFE600] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group"
            >
              <h3 className="text-xl font-bold uppercase mb-2 group-hover:text-[#FFE600] transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {item.label}
              </h3>
              <p className="text-xs font-mono text-gray-400">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export { AdminLayout };
