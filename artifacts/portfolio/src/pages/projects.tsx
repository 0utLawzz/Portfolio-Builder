import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import ProjectCard from "@/components/project-card";
import {
  useListProjects,
  getListProjectsQueryKey,
  useGetGitHubData,
  getGetGitHubDataQueryKey,
} from "@workspace/api-client-react";
import { Search } from "lucide-react";

const categories = ["All", "Automation", "AI", "SaaS", "OCR", "Internal Tools", "Web Apps", "Python", "TypeScript"];

type CardProject = {
  id: number;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  category?: string | null;
  status: string;
  cover_image?: string | null;
  featured: boolean;
  github_url?: string | null;
  live_url?: string | null;
  source: "db" | "github";
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function guessCategory(topics: string[], language: string | null): string {
  const t = topics.map((x) => x.toLowerCase());
  if (t.some((x) => x.includes("ocr") || x.includes("document"))) return "OCR";
  if (t.some((x) => x.includes("ai") || x.includes("ml"))) return "AI";
  if (t.some((x) => x.includes("saas"))) return "SaaS";
  if (t.some((x) => x.includes("automation") || x.includes("sheet") || x.includes("drive"))) return "Automation";
  if (language === "Python") return "Python";
  if (language === "TypeScript" || language === "JavaScript") return "Web Apps";
  return language || "Web Apps";
}

export default function Projects() {
  useEffect(() => {
    document.title = "Projects | OUTLAWZ LABS™";
  }, []);

  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data: dbProjects, isLoading: dbLoading } = useListProjects(
    {},
    { query: { queryKey: getListProjectsQueryKey({}) } }
  );

  const { data: ghData, isLoading: ghLoading } = useGetGitHubData({
    query: { queryKey: getGetGitHubDataQueryKey(), staleTime: 5 * 60 * 1000 },
  });

  const isLoading = dbLoading || ghLoading;

  const merged: CardProject[] = useMemo(() => {
    const db = dbProjects ?? [];
    const repos = ghData?.repos ?? [];

    const dbBySlug = new Map(db.map((p) => [p.slug, p]));
    const dbByGithubName = new Map<string, (typeof db)[0]>();
    for (const p of db) {
      if (p.github_url) {
        try {
          const parts = new URL(p.github_url).pathname.split("/").filter(Boolean);
          if (parts[1]) dbByGithubName.set(parts[1].toLowerCase(), p);
        } catch {}
      }
    }

    const cards: CardProject[] = [];
    const usedDbIds = new Set<number>();

    for (const r of repos) {
      const slug = slugify(r.name);
      const match = dbByGithubName.get(r.name.toLowerCase()) || dbBySlug.get(slug);
      if (match) {
        usedDbIds.add(match.id);
        cards.push({
          id: match.id,
          title: match.title,
          slug: match.slug,
          description: match.description || r.description || "",
          tech_stack: match.tech_stack?.length ? match.tech_stack : (r.language ? [r.language] : []),
          category: match.category || guessCategory(r.topics || [], r.language),
          status: match.status || "active",
          cover_image: match.cover_image,
          featured: match.featured,
          github_url: match.github_url || r.html_url,
          live_url: match.live_url || r.homepage,
          source: "db",
        });
      } else {
        cards.push({
          id: r.id,
          title: r.name.replace(/-/g, " "),
          slug,
          description: r.description || "GitHub repository — open for details.",
          tech_stack: r.language ? [r.language, ...(r.topics || []).slice(0, 3)] : (r.topics || []).slice(0, 4),
          category: guessCategory(r.topics || [], r.language),
          status: "active",
          cover_image: null,
          featured: false,
          github_url: r.html_url,
          live_url: r.homepage,
          source: "github",
        });
      }
    }

    for (const p of db) {
      if (!usedDbIds.has(p.id)) {
        cards.push({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          tech_stack: p.tech_stack || [],
          category: p.category,
          status: p.status,
          cover_image: p.cover_image,
          featured: p.featured,
          github_url: p.github_url,
          live_url: p.live_url,
          source: "db",
        });
      }
    }

    cards.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.title.localeCompare(b.title);
    });

    return cards;
  }, [dbProjects, ghData]);

  const filtered = useMemo(() => {
    return merged.filter((p) => {
      const matchCat =
        category === "All" ||
        (p.category || "").toLowerCase() === category.toLowerCase() ||
        p.tech_stack.some((t) => t.toLowerCase() === category.toLowerCase());
      const q = activeSearch.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        p.tech_stack.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [merged, category, activeSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(search);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Navbar />

      <section className="bg-black border-b-[3px] border-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            PROJECTS
          </h1>
          <div className="w-24 h-[3px] bg-[#FFE600] mt-4" />
          <p className="text-gray-400 font-mono text-sm mt-4">
            All public repos — auto-synced from GitHub. Featured ones have full case studies.
          </p>
        </div>
      </section>

      <section className="border-b-[3px] border-black bg-[#F5F0E8] sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
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
              className="border-[3px] border-black px-4 py-3 bg-black text-white hover:bg-[#FFE600] hover:text-black transition-colors"
            >
              <Search size={18} />
            </button>
          </form>
          <div className="flex flex-wrap">
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

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border-[3px] border-black h-80 bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="mb-6 font-mono text-sm text-gray-600 uppercase">
                {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
                {ghData?.repos ? ` · ${ghData.repos.length} from GitHub` : ""}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <ProjectCard key={`${p.source}-${p.id}`} project={p} showFeaturedBadge />
                ))}
              </div>
            </>
          ) : (
            <div className="border-[3px] border-black p-20 text-center bg-white">
              <p className="font-mono text-gray-500 uppercase tracking-wider text-sm">No projects found</p>
              {(activeSearch || category !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveSearch("");
                    setCategory("All");
                  }}
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
