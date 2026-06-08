import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import ProjectCard from "@/components/project-card";
import { useListProjects, getListProjectsQueryKey } from "@workspace/api-client-react";
import { Search } from "lucide-react";

const categories = ["All", "Automation", "AI", "SaaS", "OCR", "Internal Tools", "Web Apps"];

export default function Projects() {
  useEffect(() => {
    document.title = "Projects | OUTLAWZ LABS™";
  }, []);

  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [category, setCategory] = useState("All");

  const params = {
    ...(activeSearch ? { search: activeSearch } : {}),
    ...(category !== "All" ? { category } : {}),
  };

  const { data: projects, isLoading } = useListProjects(params, {
    query: { queryKey: getListProjectsQueryKey(params) },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(search);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Navbar />

      {/* Header */}
      <section className="bg-black border-b-[3px] border-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            PROJECTS
          </h1>
          <div className="w-24 h-[3px] bg-[#FFE600] mt-4" />
          <p className="text-gray-400 font-mono text-sm mt-4">
            Systems built. Problems solved. Automation deployed.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b-[3px] border-black bg-[#F5F0E8] sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-md">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH PROJECTS..."
              className="flex-1 border-[3px] border-black border-r-0 px-4 py-3 font-mono text-sm uppercase bg-white focus:outline-none focus:bg-[#FFE600] transition-colors"
              data-testid="input-search-projects"
            />
            <button
              type="submit"
              className="border-[3px] border-black bg-black text-white px-4 py-3 hover:bg-[#FFE600] hover:text-black transition-colors"
              data-testid="button-search-submit"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Category filters */}
          <div className="flex flex-wrap gap-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                data-testid={`button-filter-${cat.toLowerCase().replace(" ", "-")}`}
                className={`px-4 py-3 text-xs font-bold uppercase border-[3px] border-black border-r-0 last:border-r-[3px] transition-colors ${
                  category === cat
                    ? "bg-[#FFE600] text-black"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border-[3px] border-black h-80 bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <>
              <div className="mb-6 font-mono text-sm text-gray-600 uppercase">
                {projects.length} project{projects.length !== 1 ? "s" : ""} found
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} showFeaturedBadge />
                ))}
              </div>
            </>
          ) : (
            <div className="border-[3px] border-black p-20 text-center bg-white">
              <p className="font-mono text-gray-500 uppercase tracking-wider text-sm">No projects found</p>
              {(activeSearch || category !== "All") && (
                <button
                  onClick={() => { setSearch(""); setActiveSearch(""); setCategory("All"); }}
                  className="mt-4 border-[3px] border-black px-6 py-2 font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors"
                >
                  CLEAR FILTERS
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-black border-t-[3px] border-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gray-500 font-mono text-xs">© 2025 OUTLAWZ LABS™</span>
        </div>
      </footer>
    </div>
  );
}
