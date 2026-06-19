import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { useGetGitHubData, getGetGitHubDataQueryKey } from "@workspace/api-client-react";
import { Star, GitFork, ExternalLink, Github, Users, BookOpen } from "lucide-react";

const languageColors: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  "C#": "#239120",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#FA7343",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
};

type SortOption = "updated" | "stars" | "name" | "forks";

export default function GitHubPage() {
  useEffect(() => {
    document.title = "GitHub | OUTLAWZ LABS™";
  }, []);

  const [sort, setSort] = useState<SortOption>("updated");
  const [langFilter, setLangFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useGetGitHubData({
    query: { queryKey: getGetGitHubDataQueryKey(), staleTime: 5 * 60 * 1000 },
  });

  const { profile, repos = [] } = data ?? {};

  const languages = ["All", ...Array.from(new Set(repos.map((r) => r.language).filter(Boolean) as string[])).sort()];

  const filtered = repos
    .filter((r) => {
      const matchLang = langFilter === "All" || r.language === langFilter;
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || (r.description ?? "").toLowerCase().includes(search.toLowerCase());
      return matchLang && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "stars") return b.stargazers_count - a.stargazers_count;
      if (sort === "forks") return b.forks_count - a.forks_count;
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  return (
    <div className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Navbar />

      {/* Header */}
      <section className="bg-black border-b-[3px] border-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-6xl md:text-9xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              GITHUB
            </h1>
            <div className="w-24 h-[3px] bg-[#FFE600] mt-4" />
            <p className="text-gray-400 font-mono text-sm mt-4">
              Live from <a href="https://github.com/0utLawzz" target="_blank" rel="noreferrer" className="text-[#FFE600] hover:underline">github.com/0utLawzz</a>
            </p>
          </div>

          {/* Profile stats */}
          {profile && (
            <div className="flex gap-0">
              {[
                { icon: BookOpen, label: "REPOS", value: profile.public_repos },
                { icon: Users, label: "FOLLOWERS", value: profile.followers },
              ].map((s, i) => (
                <div key={s.label} className={`border-[3px] border-white px-6 py-4 text-center ${i > 0 ? "border-l-0" : ""}`}>
                  <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1 justify-center mt-1">
                    <s.icon size={10} />
                    {s.label}
                  </div>
                </div>
              ))}
              <a
                href={profile.html_url}
                target="_blank"
                rel="noreferrer"
                data-testid="link-github-profile"
                className="border-[3px] border-[#FFE600] bg-[#FFE600] text-black px-6 py-4 flex flex-col items-center justify-center hover:bg-transparent hover:text-[#FFE600] transition-colors border-l-0"
              >
                <Github size={20} />
                <span className="text-xs font-bold uppercase mt-1">PROFILE</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="border-b-[3px] border-black bg-[#F5F0E8] sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH REPOS..."
            className="border-[3px] border-black px-4 py-3 font-mono text-sm uppercase bg-white focus:outline-none focus:bg-[#FFE600] transition-colors w-full lg:w-72"
            data-testid="input-search-repos"
          />

          {/* Language filter */}
          <div className="flex flex-wrap gap-0 flex-1">
            {languages.slice(0, 8).map((lang) => (
              <button
                key={lang}
                onClick={() => setLangFilter(lang)}
                data-testid={`button-lang-${lang.toLowerCase()}`}
                style={langFilter === lang && lang !== "All" ? { backgroundColor: languageColors[lang] ?? "#FFE600", color: "#000" } : {}}
                className={`px-3 py-3 text-xs font-bold uppercase border-[3px] border-black border-r-0 last:border-r-[3px] transition-colors whitespace-nowrap ${
                  langFilter === lang
                    ? lang === "All" ? "bg-[#FFE600] text-black" : "text-black"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-0 flex-shrink-0">
            {(["updated", "stars", "forks", "name"] as SortOption[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                data-testid={`button-sort-${s}`}
                className={`px-3 py-3 text-xs font-bold uppercase border-[3px] border-black border-r-0 last:border-r-[3px] transition-colors ${
                  sort === s ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {s === "updated" ? "RECENT" : s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border-[3px] border-black h-48 bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="border-[3px] border-[#FF2D20] bg-white p-12 text-center">
              <p className="font-mono text-[#FF2D20] uppercase text-sm mb-2">Failed to load GitHub data</p>
              <p className="font-mono text-gray-500 text-xs">Check your connection or visit <a href="https://github.com/0utLawzz" className="underline" target="_blank" rel="noreferrer">github.com/0utLawzz</a> directly</p>
            </div>
          ) : (
            <>
              <div className="mb-6 font-mono text-sm text-gray-600 uppercase">
                {filtered.length} repo{filtered.length !== 1 ? "s" : ""}
                {langFilter !== "All" && <span className="ml-2 text-gray-400">in {langFilter}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((repo) => {
                  const langColor = languageColors[repo.language ?? ""] ?? "#888";
                  const updatedAt = new Date(repo.updated_at);
                  const ageMs = Date.now() - updatedAt.getTime();
                  const ageDays = Math.floor(ageMs / 86400000);
                  const ageStr = ageDays < 7 ? `${ageDays}d ago` : ageDays < 30 ? `${Math.floor(ageDays / 7)}w ago` : ageDays < 365 ? `${Math.floor(ageDays / 30)}mo ago` : `${Math.floor(ageDays / 365)}y ago`;

                  return (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      data-testid={`card-repo-${repo.id}`}
                      className="border-[3px] border-black bg-white shadow-[4px_4px_0_#0A0A0A] hover:shadow-[6px_6px_0_#FFE600] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col group"
                    >
                      {/* Top bar with language color */}
                      <div className="h-1.5" style={{ backgroundColor: repo.language ? langColor : "#E0D9CD" }} />

                      <div className="p-5 flex flex-col flex-1">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-black text-base uppercase group-hover:text-[#FF2D20] transition-colors break-all leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}>
                            {repo.name}
                          </h3>
                          <ExternalLink size={14} className="text-gray-400 flex-shrink-0 ml-2 mt-0.5 group-hover:text-black transition-colors" />
                        </div>

                        {/* Description */}
                        <p className="font-mono text-xs text-gray-600 leading-relaxed flex-1 mb-4 line-clamp-3">
                          {repo.description ?? <span className="text-gray-400 italic">No description</span>}
                        </p>

                        {/* Topics */}
                        {repo.topics && repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {repo.topics.slice(0, 4).map((topic) => (
                              <span key={topic} className="border border-black px-1.5 py-0.5 text-[10px] font-mono uppercase bg-[#F5F0E8]">
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer stats */}
                        <div className="flex items-center gap-4 pt-3 border-t-[2px] border-gray-100">
                          {repo.language && (
                            <span className="flex items-center gap-1 text-xs font-mono text-gray-600">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: langColor }} />
                              {repo.language}
                            </span>
                          )}
                          {repo.stargazers_count > 0 && (
                            <span className="flex items-center gap-1 text-xs font-mono text-gray-500">
                              <Star size={11} />
                              {repo.stargazers_count}
                            </span>
                          )}
                          {repo.forks_count > 0 && (
                            <span className="flex items-center gap-1 text-xs font-mono text-gray-500">
                              <GitFork size={11} />
                              {repo.forks_count}
                            </span>
                          )}
                          <span className="ml-auto text-[10px] font-mono text-gray-400">{ageStr}</span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="border-[3px] border-black p-16 text-center bg-white">
                  <p className="font-mono text-gray-500 uppercase text-sm">No repos match your filters</p>
                  <button
                    onClick={() => { setSearch(""); setLangFilter("All"); }}
                    className="mt-4 border-[3px] border-black px-6 py-2 font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors"
                  >
                    CLEAR FILTERS
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="bg-black border-t-[3px] border-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-white font-bold text-xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            OUTLAWZ LABS™
          </span>
          <span className="text-gray-500 font-mono text-xs">Repos auto-sync from GitHub every 5 min</span>
          <a
            href="https://github.com/0utLawzz"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white border border-gray-700 px-3 py-1 hover:border-white transition-colors font-mono text-xs uppercase"
          >
            <Github size={12} />
            GITHUB PROFILE
          </a>
        </div>
      </footer>
    </div>
  );
}
